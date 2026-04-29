import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import { isLogin } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const user = auth.payload;

    const { rows } = await pool.query(
      "SELECT * FROM res_orders WHERE phone = $1 AND tenant_id = $2 ORDER BY created_at DESC",
      [user.phone, tenant.tenant_id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully fetched user orders",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    }, { status: 500 });
  }
}
