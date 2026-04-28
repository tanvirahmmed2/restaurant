import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({
        success: false,
        message: "Slug not found",
      }, { status: 400 });
    }

    const { rows } = await pool.query(
      "SELECT p.*, c.name as category_name FROM res_items p LEFT JOIN res_categories c ON p.category_id = c.id WHERE p.slug = $1 AND p.tenant_id = $2 LIMIT 1",
      [slug, tenant.tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No product found with this slug for this restaurant",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product data found successfully",
      payload: rows[0],
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    }, { status: 500 });
  }
}


