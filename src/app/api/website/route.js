import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { rows } = await pool.query(
      `SELECT w.*, t.status as tenant_status, t.expires_at 
       FROM websites w 
       JOIN tenants t ON w.tenant_id = t.tenant_id 
       WHERE w.tenant_id = $1 LIMIT 1`,
      [tenant.tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Website profile not found. Showing tenant info only.",
        payload: {
          tenant_status: tenant.status,
          expires_at: tenant.expires_at
        },
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      message: "Website details fetched successfully",
      payload: rows[0],
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch website details",
      error: error.message,
    }, { status: 500 });
  }
}

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

    const body = await req.json();

    const { rows: existing } = await pool.query(
      "SELECT website_id FROM websites WHERE tenant_id = $1 LIMIT 1",
      [tenant.tenant_id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Website profile does not exist for this tenant. Creation via API is disabled." 
      }, { status: 403 });
    }

    const allowedFields = [
      'name', 'domain', 'theme', 'status', 'business_name', 'logo', 'favicon',
      'email', 'phone', 'address', 'city', 'country', 'meta_title', 'meta_description',
      'facebook', 'instagram', 'linkedin', 'youtube', 'primary_color', 'secondary_color',
      'is_public', 'is_store_enabled'
    ];

    const updates = {};
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: "No valid fields provided for update" }, { status: 400 });
    }

    const columns = Object.keys(updates);
    const setClause = columns.map((col, idx) => `${col} = $${idx + 2}`).join(", ");
    const values = Object.values(updates);

    const query = `UPDATE websites SET ${setClause}, updated_at = NOW() WHERE tenant_id = $1 RETURNING *`;
    const { rows: updatedWebsite } = await pool.query(query, [tenant.tenant_id, ...values]);

    return NextResponse.json({
      success: true,
      message: "Website details updated successfully",
      payload: updatedWebsite[0],
    }, { status: 200 });

  } catch (error) {
    console.error("Website Update Error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update website details",
      error: error.message,
    }, { status: 500 });
  }
}