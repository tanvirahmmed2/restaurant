import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/pg";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const { rows } = await pool.query(
      "SELECT * FROM res_categories WHERE tenant_id = $1 ORDER BY created_at DESC",
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
    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const tenant = await getTenant(req);
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get("name");

    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Check if category exists for this tenant
    const { rows: existingCat } = await pool.query(
      "SELECT id FROM res_categories WHERE slug = $1 AND tenant_id = $2 LIMIT 1",
      [slug, tenant.tenant_id]
    );

    if (existingCat.length > 0) {
      return NextResponse.json({ success: false, message: "Category already exists for this tenant" }, { status: 400 });
    }

    const imageFile = formData.get("image");
    if (!imageFile) {
      return NextResponse.json({ success: false, message: "Please upload cover image" }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    const cloudImage = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "restaurant-pos" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(imageBuffer);
    });

    const { rows: newCat } = await pool.query(
      "INSERT INTO res_categories (tenant_id, name, slug, image, image_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [tenant.tenant_id, name, slug, cloudImage.secure_url, cloudImage.public_id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully created category",
      payload: newCat[0],
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
      "SELECT * FROM res_categories WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [id, tenant.tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Category not found for this tenant" }, { status: 404 });
    }

    const cat = rows[0];

    if (cat.image_id) {
      await cloudinary.uploader.destroy(cat.image_id);
    }

    await pool.query("DELETE FROM res_categories WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted category",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}