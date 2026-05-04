import { pool } from "@/lib/database/pg";
import { isLogin } from "@/lib/auth/middleware";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const auth = await isLogin();
    
    if (!auth.success || auth.payload.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tenant_id = auth.payload.tenant_id;

    if (!tenant_id) {
      return NextResponse.json({ message: "Tenant ID not found" }, { status: 400 });
    }

    const tables = [
      "res_users",
      "res_customers",
      "res_categories",
      "res_items",
      "res_item_variants",
      "res_orders",
      "res_order_items",
      "res_order_item_variants",
      "res_payments",
      "res_expenses",
      "res_reservations",
      "res_support_tickets",
      "res_reviews",
      "res_offers"
    ];

    const databaseExport = {
      tenant_id,
      exported_at: new Date().toISOString(),
      data: {}
    };

    for (const table of tables) {
      const { rows } = await pool.query(
        `SELECT * FROM ${table} WHERE tenant_id = $1`,
        [tenant_id]
      );
      databaseExport.data[table] = rows;
    }

    // Also include tenant and website info
    const { rows: tenantRows } = await pool.query(
      `SELECT * FROM tenants WHERE tenant_id = $1`,
      [tenant_id]
    );
    databaseExport.tenant = tenantRows[0];

    const { rows: websiteRows } = await pool.query(
      `SELECT * FROM public.websites WHERE tenant_id = $1`,
      [tenant_id]
    );
    databaseExport.website = websiteRows[0];

    const jsonString = JSON.stringify(databaseExport, null, 2);
    
    return new Response(jsonString, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=tenant_${tenant_id}_db_export_${new Date().getTime()}.json`,
      },
    });

  } catch (error) {
    console.error("Database export error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
