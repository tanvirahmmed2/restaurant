
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const host = req.headers.get("host");

    const { rows } = await pool.query(
      `
      SELECT t.tenant_id, t.name as tenant_name, t.status as tenant_status, w.*
      FROM tenants t
      LEFT JOIN websites w ON w.tenant_id = t.tenant_id
      WHERE w.domain = $1 OR t.domain = $1 OR t.subdomain = $1
      LIMIT 1
      `,
      [host]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Website not found" },
        { status: 404 }
      );
    }

    const data = rows[0];

    if (data.tenant_status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: `Tenant is ${data.tenant_status}`,
        },
        { status: 403 }
      );
    }

    if (data.status !== "active" && data.status !== "development") {
      return NextResponse.json(
        {
          success: false,
          message: `Website is ${data.status}`,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const auth = await isAdmin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const host = req.headers.get("host");
    const body = await req.json();

    // 1. Get tenant + website
    const { rows } = await pool.query(
      `
      SELECT t.tenant_id, w.website_id
      FROM tenants t
      LEFT JOIN websites w ON w.tenant_id = t.tenant_id
      WHERE w.domain = $1 OR t.domain = $1 OR t.subdomain = $1
      LIMIT 1
      `,
      [host]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Website not found" },
        { status: 404 }
      );
    }

    const { tenant_id, website_id } = rows[0];

    // 2. Check if res_user belongs to tenant
    if (auth.payload.tenant_id !== tenant_id) {
       return NextResponse.json(
        { success: false, message: "Forbidden: Not tenant admin" },
        { status: 403 }
      );
    }

    // 3. Build dynamic update query
    const fields = Object.keys(body);
    const values = Object.values(body);

    if (fields.length === 0) {
      return NextResponse.json(
        { success: false, message: "No data to update" },
        { status: 400 }
      );
    }

    const setQuery = fields
      .map((field, i) => `${field} = $${i + 1}`)
      .join(", ");

    const updateQuery = `
      UPDATE websites
      SET ${setQuery}, updated_at = now()
      WHERE website_id = $${fields.length + 1}
      RETURNING *
    `;

    const updated = await pool.query(updateQuery, [
      ...values,
      website_id,
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Website updated successfully",
        data: updated.rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}