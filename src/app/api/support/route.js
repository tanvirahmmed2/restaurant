import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { rows } = await pool.query(
      "SELECT * FROM res_support_tickets WHERE tenant_id = $1 ORDER BY created_at DESC",
      [tenant.tenant_id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully fetched support data",
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

    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: "Please fill all information" }, { status: 400 });
    }

    const { rows: newSupport } = await pool.query(
      "INSERT INTO res_support_tickets (tenant_id, name, email, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [tenant.tenant_id, name, email, subject, message]
    );

    return NextResponse.json({
      success: true,
      message: "Placed support message. Wait for response",
      payload: newSupport[0],
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
      "SELECT id FROM res_support_tickets WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [id, tenant.tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Support data not found for this tenant" }, { status: 404 });
    }

    await pool.query("DELETE FROM res_support_tickets WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted support data",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}