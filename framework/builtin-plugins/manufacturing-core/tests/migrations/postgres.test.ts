import { describe, expect, it } from "bun:test";

import {
  buildManufacturingCoreMigrationSql,
  buildManufacturingCoreRollbackSql,
  getManufacturingCoreLookupIndexName,
  getManufacturingCoreStatusIndexName
} from "../../src/postgres";

describe("manufacturing-core postgres helpers", () => {
  it("creates the business tables and indexes", () => {
    const sql = buildManufacturingCoreMigrationSql().join("\n");

    expect(sql).toContain("CREATE TABLE IF NOT EXISTS manufacturing_core.primary_records");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS manufacturing_core.secondary_records");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS manufacturing_core.exception_records");
    expect(sql).toContain(getManufacturingCoreLookupIndexName());
    expect(sql).toContain(getManufacturingCoreStatusIndexName());
  });

  it("rolls the schema back safely", () => {
    const sql = buildManufacturingCoreRollbackSql({ schemaName: "manufacturing_core_preview", dropSchema: true }).join("\n");
    expect(sql).toContain("DROP TABLE IF EXISTS manufacturing_core_preview.exception_records");
    expect(sql).toContain("DROP SCHEMA IF EXISTS manufacturing_core_preview CASCADE");
  });
});
