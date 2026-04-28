import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isAdmin, isLogin } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully verified staff",
      payload: auth.payload,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

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

    const { name, email, password, role } = await req.json();
    if (!name || !email || !role || !password) {
      return NextResponse.json({ success: false, message: "Please fill all information" }, { status: 400 });
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

    const { rows: newStaff } = await pool.query(
      "INSERT INTO res_users (tenant_id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
      [tenant.tenant_id, name, email, hashedPass, role]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully created staff",
      payload: newStaff[0],
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password || password.trim().length < 6) {
      return NextResponse.json({ success: false, message: "Enter at least 6 digit password" }, { status: 400 });
    }

    const user = auth.payload;
    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (isMatchPassword) {
      return NextResponse.json({ success: false, message: "Please try a new password" }, { status: 400 });
    }

    const hashPass = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE res_users SET password = $1 WHERE id = $2",
      [hashPass, user.id]
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
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
      return NextResponse.json({ success: false, message: "Staff id not found" }, { status: 400 });
    }

    const { rows: staffRows } = await pool.query(
      "SELECT id, role FROM res_users WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [id, tenant.tenant_id]
    );

    if (staffRows.length === 0) {
      return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });
    }

    const staff = staffRows[0];

    // Ensure at least one admin remains
    const { rows: adminRows } = await pool.query(
      "SELECT id FROM res_users WHERE role = 'admin' AND tenant_id = $1",
      [tenant.tenant_id]
    );

    if (adminRows.length === 1 && staff.role === "admin") {
      return NextResponse.json({ success: false, message: "This account can't be removed (last admin)" }, { status: 400 });
    }

    await pool.query("DELETE FROM res_users WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Account has been deleted",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}