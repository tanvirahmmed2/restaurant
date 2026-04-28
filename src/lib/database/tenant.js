import { pool } from "./pg";

export async function getTenant(req) {
  const host = req.headers.get("host");

  const { rows } = await pool.query(
    `
    SELECT t.*, w.website_id, w.status as website_status, w.name as website_name
    FROM tenants t
    LEFT JOIN websites w ON w.tenant_id = t.tenant_id
    WHERE w.domain = $1 OR t.domain = $1 OR t.subdomain = $1
    LIMIT 1
    `,
    [host]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}
