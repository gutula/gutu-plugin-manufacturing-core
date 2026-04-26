/** Bill of Materials — multi-level explosion + cost roll-up.
 *
 *  A BOM has an output item, an output quantity, optional labour and
 *  overhead, and a set of input lines. Each line is either a raw
 *  material (rate_minor + scrap_pct) or a sub-assembly that points at
 *  another BOM (sub_bom_id) — explosion recursively descends.
 *
 *  explodeBom() returns:
 *    - the flattened list of leaf inputs (same item may appear multiple
 *      times if used in different sub-trees; we de-duplicate by code at
 *      the API boundary if requested),
 *    - the rolled-up material cost,
 *    - labour + overhead totals across the tree.
 *
 *  Cycle detection: if a sub_bom_id chain refers back to its ancestor,
 *  we throw `BomError("cycle", …)` so production planning never loops.
 */

import { db, nowIso } from "@gutu-host";
import { uuid } from "@gutu-host";

export interface BomLineInput {
  itemCode: string;
  description?: string;
  quantity: number;
  uom?: string;
  rateMinor?: number;
  subBomId?: string;
  scrapPct?: number;
}

export interface BomLine {
  id: string;
  position: number;
  itemCode: string;
  description: string | null;
  quantity: number;
  uom: string;
  rateMinor: number;
  subBomId: string | null;
  scrapPct: number;
}

export interface Bom {
  id: string;
  tenantId: string;
  itemCode: string;
  version: string;
  outputQty: number;
  uom: string;
  currency: string;
  labourMinor: number;
  overheadMinor: number;
  isDefault: boolean;
  enabled: boolean;
  memo: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lines: BomLine[];
}

export class BomError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "BomError";
  }
}

interface BomRow {
  id: string;
  tenant_id: string;
  item_code: string;
  version: string;
  output_qty: number;
  uom: string;
  currency: string;
  labour_minor: number;
  overhead_minor: number;
  is_default: number;
  enabled: number;
  memo: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface LineRow {
  id: string;
  bom_id: string;
  position: number;
  item_code: string;
  description: string | null;
  quantity: number;
  uom: string;
  rate_minor: number;
  sub_bom_id: string | null;
  scrap_pct: number;
}

function bomFromRows(b: BomRow, lines: BomLine[]): Bom {
  return {
    id: b.id,
    tenantId: b.tenant_id,
    itemCode: b.item_code,
    version: b.version,
    outputQty: b.output_qty,
    uom: b.uom,
    currency: b.currency,
    labourMinor: b.labour_minor,
    overheadMinor: b.overhead_minor,
    isDefault: b.is_default === 1,
    enabled: b.enabled === 1,
    memo: b.memo,
    createdBy: b.created_by,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
    lines,
  };
}

function lineFromRow(r: LineRow): BomLine {
  return {
    id: r.id,
    position: r.position,
    itemCode: r.item_code,
    description: r.description,
    quantity: r.quantity,
    uom: r.uom,
    rateMinor: r.rate_minor,
    subBomId: r.sub_bom_id,
    scrapPct: r.scrap_pct,
  };
}

export interface CreateBomArgs {
  tenantId: string;
  itemCode: string;
  version?: string;
  outputQty?: number;
  uom?: string;
  currency?: string;
  labourMinor?: number;
  overheadMinor?: number;
  isDefault?: boolean;
  memo?: string;
  lines: BomLineInput[];
  createdBy: string;
}

export function createBom(args: CreateBomArgs): Bom {
  if (!args.lines || args.lines.length === 0)
    throw new BomError("no-lines", "BOM must have at least one line");
  const id = uuid();
  const now = nowIso();
  const tx = db.transaction(() => {
    if (args.isDefault) {
      db.prepare(
        `UPDATE boms SET is_default = 0, updated_at = ?
           WHERE tenant_id = ? AND item_code = ?`,
      ).run(now, args.tenantId, args.itemCode);
    }
    try {
      db.prepare(
        `INSERT INTO boms
           (id, tenant_id, item_code, version, output_qty, uom, currency,
            labour_minor, overhead_minor, is_default, enabled, memo, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)`,
      ).run(
        id,
        args.tenantId,
        args.itemCode,
        args.version ?? "1",
        args.outputQty ?? 1,
        args.uom ?? "unit",
        args.currency ?? "USD",
        args.labourMinor ?? 0,
        args.overheadMinor ?? 0,
        args.isDefault ? 1 : 0,
        args.memo ?? null,
        args.createdBy,
        now,
        now,
      );
    } catch (err) {
      if (err instanceof Error && /UNIQUE/.test(err.message))
        throw new BomError(
          "duplicate",
          `BOM for ${args.itemCode} v${args.version ?? "1"} already exists`,
        );
      throw err;
    }
    args.lines.forEach((l, i) => {
      if (!l.itemCode) throw new BomError("invalid", `Line ${i + 1} missing itemCode`);
      if (!Number.isFinite(l.quantity) || l.quantity <= 0)
        throw new BomError("invalid", `Line ${i + 1} quantity must be > 0`);
      if ((l.scrapPct ?? 0) < 0 || (l.scrapPct ?? 0) > 100)
        throw new BomError("invalid", `Line ${i + 1} scrap % out of range`);
      if (l.subBomId) {
        const sub = db
          .prepare(`SELECT id FROM boms WHERE id = ? AND tenant_id = ?`)
          .get(l.subBomId, args.tenantId);
        if (!sub) throw new BomError("invalid-sub-bom", `Line ${i + 1}: sub-BOM not found`);
      }
      db.prepare(
        `INSERT INTO bom_lines
           (id, tenant_id, bom_id, position, item_code, description, quantity, uom,
            rate_minor, sub_bom_id, scrap_pct)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        uuid(),
        args.tenantId,
        id,
        i,
        l.itemCode,
        l.description ?? null,
        l.quantity,
        l.uom ?? "unit",
        l.rateMinor ?? 0,
        l.subBomId ?? null,
        l.scrapPct ?? 0,
      );
    });
  });
  tx();
  return getBom(args.tenantId, id)!;
}

export function getBom(tenantId: string, id: string): Bom | null {
  const row = db
    .prepare(`SELECT * FROM boms WHERE id = ? AND tenant_id = ?`)
    .get(id, tenantId) as BomRow | undefined;
  if (!row) return null;
  const lines = (
    db
      .prepare(`SELECT * FROM bom_lines WHERE bom_id = ? ORDER BY position ASC`)
      .all(id) as LineRow[]
  ).map(lineFromRow);
  return bomFromRows(row, lines);
}

export function getDefaultBom(tenantId: string, itemCode: string): Bom | null {
  const r = db
    .prepare(
      `SELECT id FROM boms
         WHERE tenant_id = ? AND item_code = ? AND enabled = 1
         ORDER BY is_default DESC, updated_at DESC LIMIT 1`,
    )
    .get(tenantId, itemCode) as { id: string } | undefined;
  return r ? getBom(tenantId, r.id) : null;
}

export function listBoms(tenantId: string, itemCode?: string): Bom[] {
  const ids = itemCode
    ? (db
        .prepare(
          `SELECT id FROM boms WHERE tenant_id = ? AND item_code = ?
             ORDER BY is_default DESC, version DESC, updated_at DESC`,
        )
        .all(tenantId, itemCode) as Array<{ id: string }>)
    : (db
        .prepare(
          `SELECT id FROM boms WHERE tenant_id = ? ORDER BY item_code ASC, version DESC`,
        )
        .all(tenantId) as Array<{ id: string }>);
  return ids.map((r) => getBom(tenantId, r.id)!).filter(Boolean);
}

export interface ExplosionRow {
  itemCode: string;
  description: string | null;
  quantity: number;             // total required at this level
  uom: string;
  rateMinor: number;             // unit cost
  costMinor: number;             // = quantity * rate (rounded)
  scrapPct: number;
  /** Path of BOM ids → leaf, useful for traceability. */
  path: string[];
  /** True if this row is a sub-assembly (i.e. has its own BOM); false
   *  for raw materials. The caller may want to keep sub-assemblies as
   *  separate items (build-or-buy) — set explodeSubAssemblies=false. */
  isSubAssembly: boolean;
}

export interface BomExplosion {
  bomId: string;
  outputItem: string;
  outputQty: number;
  rows: ExplosionRow[];
  totalMaterialMinor: number;
  totalLabourMinor: number;
  totalOverheadMinor: number;
  totalCostMinor: number;
  unitCostMinor: number;
}

/** Recursive explosion. Multiplies the request qty into the total
 *  required at every level, factoring scrap. */
export function explodeBom(args: {
  tenantId: string;
  bomId: string;
  quantity: number;
  /** When false, sub-assemblies are emitted as their own ExplosionRow
   *  rather than being expanded to leaves. */
  explodeSubAssemblies?: boolean;
}): BomExplosion {
  const root = getBom(args.tenantId, args.bomId);
  if (!root) throw new BomError("not-found", "BOM not found");
  const rows: ExplosionRow[] = [];
  let totalMaterial = 0;
  let totalLabour = 0;
  let totalOverhead = 0;
  const visited = new Set<string>();
  const explode = args.explodeSubAssemblies !== false;

  function visit(bom: Bom, qtyToProduce: number, path: string[]): void {
    if (visited.has(bom.id) && path.includes(bom.id)) {
      throw new BomError("cycle", `BOM cycle detected at ${bom.itemCode} (path: ${path.join(" → ")})`);
    }
    visited.add(bom.id);
    const factor = qtyToProduce / bom.outputQty;
    totalLabour += Math.round(bom.labourMinor * factor);
    totalOverhead += Math.round(bom.overheadMinor * factor);
    for (const line of bom.lines) {
      const requiredBeforeScrap = line.quantity * factor;
      const scrapMultiplier = 1 + (line.scrapPct ?? 0) / 100;
      const required = requiredBeforeScrap * scrapMultiplier;
      if (line.subBomId && explode) {
        const sub = getBom(args.tenantId, line.subBomId);
        if (!sub) throw new BomError("invalid-sub-bom", `Sub-BOM ${line.subBomId} missing`);
        visit(sub, required, [...path, bom.id]);
        continue;
      }
      const rate = line.rateMinor;
      const costMinor = Math.round(required * rate);
      totalMaterial += costMinor;
      rows.push({
        itemCode: line.itemCode,
        description: line.description,
        quantity: required,
        uom: line.uom,
        rateMinor: rate,
        costMinor,
        scrapPct: line.scrapPct,
        path: [...path, bom.id],
        isSubAssembly: !!line.subBomId,
      });
    }
  }

  visit(root, args.quantity, []);

  const totalCost = totalMaterial + totalLabour + totalOverhead;
  return {
    bomId: root.id,
    outputItem: root.itemCode,
    outputQty: args.quantity,
    rows,
    totalMaterialMinor: totalMaterial,
    totalLabourMinor: totalLabour,
    totalOverheadMinor: totalOverhead,
    totalCostMinor: totalCost,
    unitCostMinor: args.quantity > 0 ? Math.round(totalCost / args.quantity) : 0,
  };
}

/** Aggregate identical itemCodes in an explosion's rows. */
export function aggregateExplosion(rows: ExplosionRow[]): ExplosionRow[] {
  const map = new Map<string, ExplosionRow>();
  for (const r of rows) {
    const existing = map.get(r.itemCode);
    if (!existing) {
      map.set(r.itemCode, { ...r });
      continue;
    }
    existing.quantity += r.quantity;
    existing.costMinor += r.costMinor;
  }
  return Array.from(map.values()).sort((a, b) =>
    a.itemCode.localeCompare(b.itemCode),
  );
}

export function deleteBom(tenantId: string, id: string): boolean {
  const r = db.prepare(`DELETE FROM boms WHERE id = ? AND tenant_id = ?`).run(id, tenantId);
  return r.changes > 0;
}
