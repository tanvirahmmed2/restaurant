import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import { isSales } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const auth = await isSales();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { rows } = await pool.query(
      "SELECT * FROM res_orders WHERE tenant_id = $1 ORDER BY created_at DESC",
      [tenant.tenant_id]
    );

    // Fetch items for each order (optional, but good for management)
    // For now, let's just return the orders. UI can fetch items separately if needed.
    return NextResponse.json({
      success: true,
      message: "Successfully fetched orders",
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

export async function POST(req) {
  const client = await pool.connect();
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const data = await req.json();
    const {
      phone,
      delivery_method,
      items,
      sub_total,
      total_discount,
      total_price,
      payment_method,
      table_no,
      status,
      transaction_id,
    } = data;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    const customerPhone = phone?.trim() || "01900000000";
    let customerName = "guest";

    // Start transaction
    await client.query("BEGIN");

    // 1. Handle Customer
    const { rows: existingCustomer } = await client.query(
      "SELECT name FROM res_customers WHERE phone = $1 AND tenant_id = $2 LIMIT 1",
      [customerPhone, tenant.tenant_id]
    );

    if (existingCustomer.length > 0) {
      customerName = existingCustomer[0].name;
    } else {
      await client.query(
        "INSERT INTO res_customers (tenant_id, phone, name) VALUES ($1, $2, $3)",
        [tenant.tenant_id, customerPhone, "guest"]
      );
    }

    const orderStatus = status || "pending";
    const determinedPaymentStatus = orderStatus === "pending" ? "unpaid" : "paid";

    // 2. Insert Order
    const { rows: orderRows } = await client.query(
      `INSERT INTO res_orders 
      (tenant_id, name, phone, delivery_method, table_no, sub_total, total_discount, total_price, payment_method, status, transaction_id, payment_status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING id`,
      [
        tenant.tenant_id,
        customerName,
        customerPhone,
        delivery_method || "takein",
        table_no || "N/A",
        sub_total || 0,
        total_discount || 0,
        total_price || 0,
        payment_method || "cash",
        orderStatus,
        transaction_id || "",
        determinedPaymentStatus,
      ]
    );

    const orderId = orderRows[0].id;

    // 3. Insert Order Items
    for (const item of items) {
      await client.query(
        `INSERT INTO res_order_items (tenant_id, order_id, product_id, title, quantity, price, discount) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          tenant.tenant_id,
          orderId,
          item.id || item._id, // Support both MongoDB-style and PG-style IDs from frontend
          item.title,
          item.quantity,
          item.price,
          item.discount || 0,
        ]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: `Order placed for ${customerName}`,
      orderId: orderId,
    }, { status: 201 });

  } catch (error) {
    await client.query("ROLLBACK");
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req) {
  try {
    const auth = await isSales();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Id not found" }, { status: 400 });
    }

    const { rows } = await pool.query(
      "SELECT id FROM res_orders WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [id, tenant.tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Order not found for this tenant" }, { status: 404 });
    }

    await pool.query("DELETE FROM res_orders WHERE id = $1", [id]);

    return NextResponse.json({ success: true, message: "Successfully deleted order" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    }, { status: 500 });
  }
}