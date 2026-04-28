import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const { rowCount } = await pool.query(
      "UPDATE res_reservations SET status = 'confirmed' WHERE id = $1 AND tenant_id = $2",
      [id, tenant.tenant_id]
    );

    if (rowCount === 0) {
      return NextResponse.json({ success: false, message: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Successfully confirmed reservation" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to confirm reservation",
      error: error.message,
    }, { status: 500 });
  }
}