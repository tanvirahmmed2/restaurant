import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const auth = await isAdmin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { rows } = await pool.query(
      "SELECT id, name, email, role, is_banned, created_at FROM res_users WHERE tenant_id = $1 AND role IN ('admin', 'manager', 'sales') ORDER BY created_at DESC",
      [tenant.tenant_id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully fetched staff data",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}