import { describe, expect, it } from "bun:test";

import {
  buildManufacturingCoreSqliteMigrationSql,
  buildManufacturingCoreSqliteRollbackSql,
  getManufacturingCoreSqliteLookupIndexName,
  getManufacturingCoreSqliteStatusIndexName
} from "../../src/sqlite";

describe("manufacturing-core sqlite helpers", () => {
  it("creates the business tables and indexes", () => {
    const sql = buildManufacturingCoreSqliteMigrationSql().join("\n");

    expect(sql).toContain("CREATE TABLE IF NOT EXISTS manufacturing_core_primary_records");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS manufacturing_core_secondary_records");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS manufacturing_core_exception_records");
    expect(sql).toContain(getManufacturingCoreSqliteLookupIndexName("manufacturing_core_"));
    expect(sql).toContain(getManufacturingCoreSqliteStatusIndexName("manufacturing_core_"));
  });

  it("rolls the sqlite tables back safely", () => {
    const sql = buildManufacturingCoreSqliteRollbackSql({ tablePrefix: "manufacturing_core_preview_" }).join("\n");
    expect(sql).toContain("DROP TABLE IF EXISTS manufacturing_core_preview_exception_records");
  });
});
