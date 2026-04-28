import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "@/lib/database/secret";

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
      "SELECT * FROM res_users WHERE email = $1 AND tenant_id = $2 LIMIT 1",
      [email, tenant.tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No account found with this email for this tenant",
      }, { status: 400 });
    }

    const user = rows[0];

    if (user.is_banned) {
      return NextResponse.json({
        success: false,
        message: "User is banned",
      }, { status: 400 });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      return NextResponse.json({
        success: false,
        message: "Incorrect password",
      }, { status: 400 });
    }

    const payload = { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    const response = NextResponse.json(
      {
        success: true,
        message: "Successfully logged in",
        payload: { id: user.id, name: user.name, email: user.email, role: user.role },
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