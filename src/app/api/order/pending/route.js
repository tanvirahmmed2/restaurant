import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { rows: orders } = await pool.query(
      "SELECT * FROM res_orders WHERE tenant_id = $1 AND status = 'pending' ORDER BY created_at DESC",
      [tenant.tenant_id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully fetched pending orders",
      payload: orders,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch pending orders",
      error: error.message,
    }, { status: 500 });
  }
}
