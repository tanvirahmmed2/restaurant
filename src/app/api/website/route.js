import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM website LIMIT 1"
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Website not configured yet",
        payload: null,
      }, { status: 404 });
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

    const body = await req.json();

    const allowedFields = [
      'name', 'business_name', 'logo', 'favicon',
      'email', 'phone', 'address', 'city', 'country', 'meta_title', 'meta_description',
      'facebook', 'instagram', 'linkedin', 'youtube', 'primary_color', 'secondary_color'
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

    const { rows: existing } = await pool.query("SELECT id FROM website LIMIT 1");

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, message: "Website not initialized. Please seed the database first." },
        { status: 404 }
      );
    }

    // Update-only — never insert a second row
    const columns = Object.keys(updates);
    const setClause = columns.map((col, idx) => `${col} = $${idx + 2}`).join(", ");
    const values = Object.values(updates);
    const query = `UPDATE website SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, [existing[0].id, ...values]);
    const updatedWebsite = rows[0];

    return NextResponse.json({
      success: true,
      message: "Website details updated successfully",
      payload: updatedWebsite,
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