import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { JWT_SECRET } from "../database/secret";
import { pool } from "../database/pg";
import { getTenant } from "../database/tenant";

async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("restaurant_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const { rows } = await pool.query(
      "SELECT id, tenant_id, name, email, phone, role, is_banned FROM res_users WHERE id = $1 LIMIT 1",
      [decoded.id]
    );

    if (rows.length === 0) return null;
    const user = rows[0];

    if (user.is_banned) return null;

    return user;
  } catch (error) {
    return null;
  }
}

export async function isLogin() {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, message: "Please login" };

  // Verify tenant
  const headerList = await headers();
  const host = headerList.get("host");
  
  const { rows: tenantRows } = await pool.query(
    "SELECT t.tenant_id FROM tenants t LEFT JOIN websites w ON w.tenant_id = t.tenant_id WHERE w.domain = $1 OR t.domain = $1 OR t.subdomain = $1 LIMIT 1",
    [host]
  );

  if (tenantRows.length === 0 || user.tenant_id !== tenantRows[0].tenant_id) {
    return { success: false, message: "Unauthorized tenant access" };
  }

  return { success: true, payload: user };
}

export async function isAdmin() {
  const auth = await isLogin();
  if (!auth.success) return auth;
  if (auth.payload.role !== "admin") return { success: false, message: "Admins only" };
  return auth;
}

export async function isManager() {
  const auth = await isLogin();
  if (!auth.success) return auth;
  if (auth.payload.role !== "manager" && auth.payload.role !== "admin") {
    return { success: false, message: "Manager only" };
  }
  return auth;
}

export async function isSales() {
  const auth = await isLogin();
  if (!auth.success) return auth;
  if (auth.payload.role !== "sales" && auth.payload.role !== "admin") {
    return { success: false, message: "Sales only" };
  }
  return auth;
}



