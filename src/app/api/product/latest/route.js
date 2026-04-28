import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { rows } = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM res_items p 
       LEFT JOIN res_categories c ON p.category_id = c.id 
       WHERE p.tenant_id = $1 
       ORDER BY p.created_at DESC 
       LIMIT 8`,
      [tenant.tenant_id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully fetched data",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    }, { status: 500 });
  }
}