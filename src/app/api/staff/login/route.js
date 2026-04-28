import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "@/lib/database/secret";
import { isLogin } from "@/lib/auth/middleware";

export async function POST(req) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Please provide email and password",
      }, { status: 400 });
    }

    const { rows } = await pool.query(
      "SELECT * FROM res_users WHERE email = $1 AND tenant_id = $2 AND role != 'user' LIMIT 1",
      [email, tenant.tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No staff account found with this email for this restaurant",
      }, { status: 400 });
    }

    const staff = rows[0];

    if (staff.is_banned) {
      return NextResponse.json({
        success: false,
        message: "This staff account is banned",
      }, { status: 400 });
    }

    const isMatchPassword = await bcrypt.compare(password, staff.password);

    if (!isMatchPassword) {
      return NextResponse.json({
        success: false,
        message: "Incorrect password",
      }, { status: 400 });
    }

    const payload = { id: staff.id, email: staff.email, role: staff.role, tenant_id: staff.tenant_id };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    const response = NextResponse.json(
      {
        success: true,
        message: "Successfully logged in",
        payload: { id: staff.id, name: staff.name, email: staff.email, role: staff.role },
      },
      { status: 200 }
    );

    response.cookies.set("restaurant_token", token, {
      httpOnly: true,
      secure: NODE_ENV,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to login",
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    res.cookies.set("restaurant_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "failed to logout",
      error: error.message,
    }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const staff = auth.payload;

    if (staff.role === "admin") {
      const { rows: adminRows } = await pool.query(
        "SELECT id FROM res_users WHERE role = 'admin' AND tenant_id = $1",
        [tenant.tenant_id]
      );

      if (adminRows.length === 1) {
        return NextResponse.json({
          success: false,
          message: "This account can't be removed (last admin)",
        }, { status: 400 });
      }
    }

    await pool.query("DELETE FROM res_users WHERE id = $1", [staff.id]);

    const res = NextResponse.json({
      success: true,
      message: "Successfully deleted account",
    }, { status: 200 });

    res.cookies.set("restaurant_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return res;

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}