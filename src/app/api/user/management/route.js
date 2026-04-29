import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isAdmin } from "@/lib/auth/middleware";

export async function POST(req) {
  try {
    const auth = await isAdmin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { name, email, password, role, phone } = await req.json();
    if (!name || !email || !role || !password) {
      return NextResponse.json({ success: false, message: "Please fill all required information" }, { status: 400 });
    }

    if (password.trim().length < 6) {
      return NextResponse.json({ success: false, message: "Enter at least 6 digit password" }, { status: 400 });
    }

    // Check if email already exists in this tenant
    const { rows: existing } = await pool.query(
      "SELECT id FROM res_users WHERE email = $1 AND tenant_id = $2 LIMIT 1",
      [email, tenant.tenant_id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "User already exists with this email" }, { status: 400 });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const userPhone = phone || "01900000000";

    const { rows: newUser } = await pool.query(
      "INSERT INTO res_users (tenant_id, name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, phone, role",
      [tenant.tenant_id, name, email, hashedPass, userPhone, role]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully created user",
      payload: newUser[0],
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = await isAdmin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { id, email, role } = await req.json();
    if ((!id && !email) || !role) {
      return NextResponse.json({ success: false, message: "Missing id/email or role" }, { status: 400 });
    }

    let userId = id;

    // If email is provided instead of id, look up the user
    if (!userId && email) {
      const { rows: emailSearch } = await pool.query(
        "SELECT id FROM res_users WHERE email = $1 AND tenant_id = $2 LIMIT 1",
        [email, tenant.tenant_id]
      );
      if (emailSearch.length === 0) {
        return NextResponse.json({ success: false, message: "User with this email not found" }, { status: 404 });
      }
      userId = emailSearch[0].id;
    }

    const validRoles = ['admin', 'manager', 'sales', 'user'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role specified" }, { status: 400 });
    }

    // Check if updating the last admin
    if (role !== 'admin') {
      const { rows: staffRows } = await pool.query(
        "SELECT role FROM res_users WHERE id = $1 AND tenant_id = $2 LIMIT 1",
        [userId, tenant.tenant_id]
      );

      if (staffRows.length > 0 && staffRows[0].role === 'admin') {
        const { rows: adminRows } = await pool.query(
          "SELECT id FROM res_users WHERE role = 'admin' AND tenant_id = $1",
          [tenant.tenant_id]
        );
        if (adminRows.length <= 1) {
          return NextResponse.json({ success: false, message: "Cannot demote the last admin" }, { status: 400 });
        }
      }
    }

    const { rows: updatedUser } = await pool.query(
      "UPDATE res_users SET role = $1 WHERE id = $2 AND tenant_id = $3 RETURNING id, name, email, role",
      [role, userId, tenant.tenant_id]
    );

    if (updatedUser.length === 0) {
      return NextResponse.json({ success: false, message: "User not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
      payload: updatedUser[0],
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = await isAdmin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "User id not found" }, { status: 400 });
    }

    const { rows: userRows } = await pool.query(
      "SELECT id, role FROM res_users WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [id, tenant.tenant_id]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const user = userRows[0];

    // Ensure at least one admin remains
    const { rows: adminRows } = await pool.query(
      "SELECT id FROM res_users WHERE role = 'admin' AND tenant_id = $1",
      [tenant.tenant_id]
    );

    if (adminRows.length === 1 && user.role === "admin") {
      return NextResponse.json({ success: false, message: "This account can't be removed (last admin)" }, { status: 400 });
    }

    await pool.query("DELETE FROM res_users WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "User has been deleted",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
