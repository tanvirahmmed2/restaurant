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
      "SELECT * FROM res_reviews WHERE tenant_id = $1 ORDER BY created_at DESC",
      [tenant.tenant_id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully fetched data",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { name, email, comment, rating } = await req.json();
    if (!name || !email || !comment || !rating) {
      return NextResponse.json({ success: false, message: "Please provide all information" }, { status: 400 });
    }

    // Enforce one review per email per tenant
    const { rows: existing } = await pool.query(
      "SELECT id FROM res_reviews WHERE email = $1 AND tenant_id = $2 LIMIT 1",
      [email, tenant.tenant_id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Review already submitted with this email for this restaurant" }, { status: 400 });
    }

    const { rows: newReview } = await pool.query(
      "INSERT INTO res_reviews (tenant_id, name, email, comment, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [tenant.tenant_id, name, email, comment, rating]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully submitted review",
      payload: newReview[0],
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = await isManager();
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
      "SELECT id FROM res_reviews WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [id, tenant.tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Review not found for this tenant" }, { status: 404 });
    }

    await pool.query("DELETE FROM res_reviews WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted review",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}