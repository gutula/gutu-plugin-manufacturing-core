# Manufacturing Core

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

BOM, routing, work order, production execution, WIP posture, and subcontract-friendly production truth with explicit inventory and accounting handoff.

![Maturity: Hardened](https://img.shields.io/badge/Maturity-Hardened-2563eb) ![Verification: Build+Typecheck+Lint+Test+Contracts+Migrations+Integration](https://img.shields.io/badge/Verification-Build%2BTypecheck%2BLint%2BTest%2BContracts%2BMigrations%2BIntegration-2563eb) ![DB: postgres+sqlite](https://img.shields.io/badge/DB-postgres%2Bsqlite-2563eb) ![Integration Model: Actions+Resources+Jobs+Workflows+UI](https://img.shields.io/badge/Integration%20Model-Actions%2BResources%2BJobs%2BWorkflows%2BUI-2563eb)

## Part Of The Gutu Stack

| Aspect | Value |
| --- | --- |
| Repo kind | First-party plugin |
| Domain group | Operational Data |
| Default category | Business / Manufacturing & Production |
| Primary focus | boms, work orders, wip |
| Best when | You need a governed domain boundary with explicit contracts and independent release cadence. |
| Composes through | Actions+Resources+Jobs+Workflows+UI |

- Gutu keeps plugins as independent repos with manifest-governed boundaries, compatibility channels, and verification lanes instead of hiding everything behind one giant mutable codebase.
- This plugin is meant to compose through explicit actions, resources, jobs, workflows, and runtime envelopes, not through undocumented hook chains.

## What It Does Now

Owns BOM, routing, work-order, and WIP state so production truth remains explicit and separate from inventory or accounting outcomes.

- Exports 7 governed actions: `manufacturing.boms.publish`, `manufacturing.work-orders.release`, `manufacturing.outputs.record`, `manufacturing.boms.hold`, `manufacturing.boms.release`, `manufacturing.boms.amend`, `manufacturing.boms.reverse`.
- Owns 3 resource contracts: `manufacturing.boms`, `manufacturing.work-orders`, `manufacturing.wip`.
- Publishes 2 job definitions with explicit queue and retry policy metadata.
- Publishes 1 workflow definition with state-machine descriptions and mandatory steps.
- Adds richer admin workspace contributions on top of the base UI surface.
- Ships explicit SQL migration or rollback helpers alongside the domain model.
- Documents 9 owned entity surface(s): `BOM Revision`, `Routing`, `Work Center`, `Production Plan`, `Work Order`, `Operation Log`, and more.
- Carries 4 report surface(s) and 4 exception queue(s) for operator parity and reconciliation visibility.
- Tracks ERPNext reference parity against module(s): `Manufacturing`, `Subcontracting`.
- Operational scenario matrix includes `mrp-to-production-plan`, `work-order-release`, `issue-to-production-to-finished-goods`, `scrap-and-rework`, `subcontract-manufacturing`.
- Governs 4 settings or policy surface(s) for operator control and rollout safety.

## Maturity

**Maturity Tier:** `Hardened`

This tier is justified because unit coverage exists, contract coverage exists, integration coverage exists, migration coverage exists, job definitions are exported, and workflow definitions are exported.

## Verified Capability Summary

- Domain group: **Operational Data**
- Default category: **Business / Manufacturing & Production**
- Verification surface: **Build+Typecheck+Lint+Test+Contracts+Migrations+Integration**
- Tests discovered: **5** total files across unit, contract, integration, migration lanes
- Integration model: **Actions+Resources+Jobs+Workflows+UI**
- Database support: **postgres + sqlite**

## Dependency And Compatibility Summary

| Field | Value |
| --- | --- |
| Package | `@plugins/manufacturing-core` |
| Manifest ID | `manufacturing-core` |
| Repo | [gutu-plugin-manufacturing-core](https://github.com/gutula/gutu-plugin-manufacturing-core) |
| Depends On | `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core`, `workflow-core`, `product-catalog-core`, `inventory-core`, `traceability-core` |
| Recommended Plugins | `quality-core`, `accounting-core` |
| Capability Enhancing | `procurement-core`, `projects-core`, `assets-core`, `maintenance-cmms-core`, `hr-payroll-core` |
| Integration Only | `analytics-bi-core` |
| Suggested Packs | `sector-manufacturing` |
| Standalone Supported | No |
| Requested Capabilities | `ui.register.admin`, `api.rest.mount`, `data.write.manufacturing`, `events.publish.manufacturing` |
| Provided Capabilities | `manufacturing.boms`, `manufacturing.work-orders`, `manufacturing.wip` |
| Runtime | bun>=1.3.12 |
| Database | postgres, sqlite |
| Integration Model | Actions+Resources+Jobs+Workflows+UI |

## Installation Guidance

- Required plugins: `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core`, `workflow-core`, `product-catalog-core`, `inventory-core`, `traceability-core`
- Recommended plugins: `quality-core`, `accounting-core`
- Capability-enhancing plugins: `procurement-core`, `projects-core`, `assets-core`, `maintenance-cmms-core`, `hr-payroll-core`
- Integration-only plugins: `analytics-bi-core`
- Suggested packs: `sector-manufacturing`
- Standalone supported: no
- Manufacturing should not be treated as a first install on its own; it reaches operational usefulness when Inventory, Quality, and Accounting are already in place.

## Capability Matrix

| Surface | Count | Details |
| --- | --- | --- |
| Actions | 7 | `manufacturing.boms.publish`, `manufacturing.work-orders.release`, `manufacturing.outputs.record`, `manufacturing.boms.hold`, `manufacturing.boms.release`, `manufacturing.boms.amend`, `manufacturing.boms.reverse` |
| Resources | 3 | `manufacturing.boms`, `manufacturing.work-orders`, `manufacturing.wip` |
| Jobs | 2 | `manufacturing.projections.refresh`, `manufacturing.reconciliation.run` |
| Workflows | 1 | `manufacturing-work-order-lifecycle` |
| UI | Present | base UI surface, admin contributions |
| Owned Entities | 9 | `BOM Revision`, `Routing`, `Work Center`, `Production Plan`, `Work Order`, `Operation Log`, `Scrap Record`, `Rework Order`, `WIP Snapshot` |
| Reports | 4 | `BOM Stock Report`, `Production Plan Summary`, `Work Order Variance`, `Capacity and Downtime Summary` |
| Exception Queues | 4 | `material-shortage-review`, `scrap-variance-review`, `capacity-overload-review`, `subcontract-output-hold` |
| Operational Scenarios | 5 | `mrp-to-production-plan`, `work-order-release`, `issue-to-production-to-finished-goods`, `scrap-and-rework`, `subcontract-manufacturing` |
| Settings Surfaces | 4 | `Manufacturing Settings`, `Workstation`, `Routing`, `Operation` |
| ERPNext Refs | 2 | `Manufacturing`, `Subcontracting` |

## Quick Start For Integrators

Use this repo inside a **compatible Gutu workspace** or the **ecosystem certification workspace** so its `workspace:*` dependencies resolve honestly.

```bash
# from a compatible workspace that already includes this plugin's dependency graph
bun install
bun run build
bun run test
bun run docs:check
```

```ts
import { manifest, publishBomAction, BusinessPrimaryResource, jobDefinitions, workflowDefinitions, adminContributions, uiSurface } from "@plugins/manufacturing-core";

console.log(manifest.id);
console.log(publishBomAction.id);
console.log(BusinessPrimaryResource.id);
```

Use the root repo scripts for day-to-day work **after the workspace is bootstrapped**, or run the nested package directly from `framework/builtin-plugins/manufacturing-core` if you need lower-level control.

## Current Test Coverage

- Root verification scripts: `bun run build`, `bun run typecheck`, `bun run lint`, `bun run test`, `bun run test:contracts`, `bun run test:unit`, `bun run test:integration`, `bun run test:migrations`, `bun run docs:check`
- Unit files: 1
- Contracts files: 1
- Integration files: 1
- Migrations files: 2

## Known Boundaries And Non-Goals

- Not a full vertical application suite; this plugin only owns the domain slice exported in this repo.
- Not a replacement for explicit orchestration in jobs/workflows when multi-step automation is required.
- Cross-plugin composition should use Gutu command, event, job, and workflow primitives. This repo should not be documented as exposing a generic WordPress-style hook system unless one is explicitly exported.

## Recommended Next Milestones

- Deepen production variance, subcontracting, and rework handling before the manufacturing boundary is treated as production-grade.
- Add stronger planning and quality integration contracts where plant execution depends on them daily.
- Broaden lifecycle coverage with deeper orchestration, reconciliation, and operator tooling where the business flow requires it.
- Add more explicit domain events or follow-up job surfaces when downstream systems need tighter coupling.
- Convert more ERP parity references into first-class runtime handlers where needed, starting from `BOM`, `Routing`, `Operation`.

## More Docs

See [DEVELOPER.md](./DEVELOPER.md), [TODO.md](./TODO.md), [SECURITY.md](./SECURITY.md), [CONTRIBUTING.md](./CONTRIBUTING.md). The internal domain sources used to build those docs live under:

- `plugins/gutu-plugin-manufacturing-core/framework/builtin-plugins/manufacturing-core/docs/AGENT_CONTEXT.md`
- `plugins/gutu-plugin-manufacturing-core/framework/builtin-plugins/manufacturing-core/docs/BUSINESS_RULES.md`
- `plugins/gutu-plugin-manufacturing-core/framework/builtin-plugins/manufacturing-core/docs/EDGE_CASES.md`
- `plugins/gutu-plugin-manufacturing-core/framework/builtin-plugins/manufacturing-core/docs/FLOWS.md`
- `plugins/gutu-plugin-manufacturing-core/framework/builtin-plugins/manufacturing-core/docs/GLOSSARY.md`
- `plugins/gutu-plugin-manufacturing-core/framework/builtin-plugins/manufacturing-core/docs/MANDATORY_STEPS.md`
