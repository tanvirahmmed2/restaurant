import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID not found" }, { status: 400 });
    }

    const { rowCount } = await pool.query(
      "UPDATE res_orders SET status = 'cancelled', payment_status = 'unpaid' WHERE id = $1 AND tenant_id = $2",
      [id, tenant.tenant_id]
    );

    if (rowCount === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Successfully cancelled order" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    }, { status: 500 });
  }
}