/** Manufacturing REST API — BOMs and explosion.
 *
 *  Routes:
 *    GET   /boms                       list (?item=)
 *    GET   /boms/:id                   fetch one
 *    POST  /boms                       create
 *    DELETE /boms/:id
 *    POST  /boms/:id/explode           run explosion (body: { quantity, explodeSubAssemblies })
 *    POST  /boms/:id/aggregate         run explosion + aggregate by item code
 */

import { Hono } from "@gutu-host";
import { requireAuth, currentUser } from "@gutu-host";
import { getTenantContext } from "@gutu-host";
import {
  BomError,
  aggregateExplosion,
  createBom,
  deleteBom,
  explodeBom,
  getBom,
  listBoms,
} from "@gutu-plugin/manufacturing-core";

export const manufacturingRoutes = new Hono();
manufacturingRoutes.use("*", requireAuth);

function tenantId(): string {
  return getTenantContext()?.tenantId ?? "default";
}

function handle(err: unknown, c: Parameters<Parameters<typeof manufacturingRoutes.get>[1]>[0]) {
  if (err instanceof BomError) return c.json({ error: err.message, code: err.code }, 400);
  throw err;
}

manufacturingRoutes.get("/boms", (c) =>
  c.json({ rows: listBoms(tenantId(), c.req.query("item") ?? undefined) }),
);

manufacturingRoutes.get("/boms/:id", (c) => {
  const b = getBom(tenantId(), c.req.param("id"));
  if (!b) return c.json({ error: "not found" }, 404);
  return c.json(b);
});

manufacturingRoutes.post("/boms", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const user = currentUser(c);
  try {
    const b = createBom({
      tenantId: tenantId(),
      itemCode: String(body.itemCode ?? ""),
      version: typeof body.version === "string" ? body.version : undefined,
      outputQty: typeof body.outputQty === "number" ? body.outputQty : undefined,
      uom: typeof body.uom === "string" ? body.uom : undefined,
      currency: typeof body.currency === "string" ? body.currency : undefined,
      labourMinor: typeof body.labourMinor === "number" ? body.labourMinor : undefined,
      overheadMinor: typeof body.overheadMinor === "number" ? body.overheadMinor : undefined,
      isDefault: body.isDefault === true,
      memo: typeof body.memo === "string" ? body.memo : undefined,
      lines: Array.isArray(body.lines) ? (body.lines as never) : [],
      createdBy: user.email,
    });
    return c.json(b, 201);
  } catch (err) {
    return handle(err, c) as never;
  }
});

manufacturingRoutes.delete("/boms/:id", (c) => {
  const ok = deleteBom(tenantId(), c.req.param("id"));
  if (!ok) return c.json({ error: "not found" }, 404);
  return c.json({ ok: true });
});

manufacturingRoutes.post("/boms/:id/explode", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    const out = explodeBom({
      tenantId: tenantId(),
      bomId: c.req.param("id"),
      quantity: Number(body.quantity ?? 1),
      explodeSubAssemblies: body.explodeSubAssemblies !== false,
    });
    return c.json(out);
  } catch (err) {
    return handle(err, c) as never;
  }
});

manufacturingRoutes.post("/boms/:id/aggregate", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    const out = explodeBom({
      tenantId: tenantId(),
      bomId: c.req.param("id"),
      quantity: Number(body.quantity ?? 1),
      explodeSubAssemblies: true,
    });
    return c.json({
      ...out,
      rows: aggregateExplosion(out.rows),
    });
  } catch (err) {
    return handle(err, c) as never;
  }
});
