import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    // Fetch order details
    const { rows: orderRows } = await pool.query(
      "SELECT * FROM res_orders WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [id, tenant.tenant_id]
    );

    if (orderRows.length === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const order = orderRows[0];

    // Fetch order items
    const { rows: itemRows } = await pool.query(
      "SELECT * FROM res_order_items WHERE order_id = $1 AND tenant_id = $2",
      [id, tenant.tenant_id]
    );

    order.items = itemRows;

    return NextResponse.json({
      success: true,
      message: "Successfully fetched order details",
      payload: order,
    }, { status: 200 });

  } catch (error) {
    console.error("Order detail error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    }, { status: 500 });
  }
}