import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { isManager } from "@/lib/auth/middleware";

export async function POST(req) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { title, description, price, discount, id } = await req.json();

    if (!title || !description || !price || !id) {
      return NextResponse.json({
        success: false,
        message: "Please fill all required data (title, description, price, id)",
      }, { status: 400 });
    }

    const { rows } = await pool.query(
      "SELECT id FROM res_items WHERE id = $1 AND tenant_id = $2",
      [id, tenant.tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Product not found for this tenant",
      }, { status: 404 });
    }

    const newSlug = slugify(title, { lower: true, strict: true });

    await pool.query(
      `UPDATE res_items 
       SET title = $1, slug = $2, description = $3, price = $4, discount = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 AND tenant_id = $7`,
      [title, newSlug, description, price, discount || 0, id, tenant.tenant_id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully updated product",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    }, { status: 500 });
  }
}