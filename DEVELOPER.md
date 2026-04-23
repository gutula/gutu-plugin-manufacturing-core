# Manufacturing Core Developer Guide

BOM, routing, work order, production execution, WIP posture, and subcontract-friendly production truth with explicit inventory and accounting handoff.

**Maturity Tier:** `Hardened`

## Purpose And Architecture Role

Owns BOM, routing, work-order, and WIP state so production truth remains explicit and separate from inventory or accounting outcomes.

### This plugin is the right fit when

- You need **boms**, **work orders**, **wip** as a governed domain boundary.
- You want to integrate through declared actions, resources, jobs, workflows, and UI surfaces instead of implicit side effects.
- You need the host application to keep plugin boundaries honest through manifest capabilities, permissions, and verification lanes.

### This plugin is intentionally not

- Not a full vertical application suite; this plugin only owns the domain slice exported in this repo.
- Not a replacement for explicit orchestration in jobs/workflows when multi-step automation is required.

## Repo Map

| Path | Purpose |
| --- | --- |
| `package.json` | Root extracted-repo manifest, workspace wiring, and repo-level script entrypoints. |
| `framework/builtin-plugins/manufacturing-core` | Nested publishable plugin package. |
| `framework/builtin-plugins/manufacturing-core/src` | Runtime source, actions, resources, services, and UI exports. |
| `framework/builtin-plugins/manufacturing-core/tests` | Unit, contract, integration, and migration coverage where present. |
| `framework/builtin-plugins/manufacturing-core/docs` | Internal domain-doc source set kept in sync with this guide. |
| `framework/builtin-plugins/manufacturing-core/db/schema.ts` | Database schema contract when durable state is owned. |
| `framework/builtin-plugins/manufacturing-core/src/postgres.ts` | SQL migration and rollback helpers when exported. |

## Manifest Contract

| Field | Value |
| --- | --- |
| Package Name | `@plugins/manufacturing-core` |
| Manifest ID | `manufacturing-core` |
| Display Name | Manufacturing Core |
| Domain Group | Operational Data |
| Default Category | Business / Manufacturing & Production |
| Version | `0.1.0` |
| Kind | `plugin` |
| Trust Tier | `first-party` |
| Review Tier | `R1` |
| Isolation Profile | `same-process-trusted` |
| Framework Compatibility | ^0.1.0 |
| Runtime Compatibility | bun>=1.3.12 |
| Database Compatibility | postgres, sqlite |

## Dependency Graph And Capability Requests

| Field | Value |
| --- | --- |
| Depends On | `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core`, `workflow-core`, `product-catalog-core`, `inventory-core`, `traceability-core` |
| Requested Capabilities | `ui.register.admin`, `api.rest.mount`, `data.write.manufacturing`, `events.publish.manufacturing` |
| Provides Capabilities | `manufacturing.boms`, `manufacturing.work-orders`, `manufacturing.wip` |
| Owns Data | `manufacturing.boms`, `manufacturing.work-orders`, `manufacturing.operation-logs`, `manufacturing.wip` |

### Dependency interpretation

- Direct plugin dependencies describe package-level coupling that must already be present in the host graph.
- Requested capabilities tell the host what platform services or sibling plugins this package expects to find.
- Provided capabilities and owned data tell integrators what this package is authoritative for.

## Public Integration Surfaces

| Type | ID / Symbol | Access / Mode | Notes |
| --- | --- | --- | --- |
| Action | `manufacturing.boms.publish` | Permission: `manufacturing.boms.write` | Publish BOM<br>Idempotent<br>Audited |
| Action | `manufacturing.work-orders.release` | Permission: `manufacturing.work-orders.write` | Release Work Order<br>Non-idempotent<br>Audited |
| Action | `manufacturing.outputs.record` | Permission: `manufacturing.outputs.write` | Record Manufacturing Output<br>Non-idempotent<br>Audited |
| Resource | `manufacturing.boms` | Portal disabled | Bills of material and routing-ready manufacturing definitions.<br>Purpose: Own what should be made and how it should be made.<br>Admin auto-CRUD enabled<br>Fields: `title`, `recordState`, `approvalState`, `postingState`, `fulfillmentState`, `updatedAt` |
| Resource | `manufacturing.work-orders` | Portal disabled | Released work orders and operation execution records.<br>Purpose: Track production execution without directly mutating stock or ledger truth.<br>Admin auto-CRUD enabled<br>Fields: `label`, `status`, `requestedAction`, `updatedAt` |
| Resource | `manufacturing.wip` | Portal disabled | WIP posture, variances, and production exception records.<br>Purpose: Expose in-flight production state and variance handling as first-class operational truth.<br>Admin auto-CRUD enabled<br>Fields: `severity`, `status`, `reasonCode`, `updatedAt` |

### Job Catalog

| Job | Queue | Retry | Timeout |
| --- | --- | --- | --- |
| `manufacturing.projections.refresh` | `manufacturing-projections` | Retry policy not declared | No timeout declared |
| `manufacturing.reconciliation.run` | `manufacturing-reconciliation` | Retry policy not declared | No timeout declared |


### Workflow Catalog

| Workflow | Actors | States | Purpose |
| --- | --- | --- | --- |
| `manufacturing-work-order-lifecycle` | `planner`, `supervisor`, `operator` | `draft`, `pending_approval`, `active`, `reconciled`, `closed`, `canceled` | Keep production planning and execution explicit through scrap, rework, and variance-heavy flows. |


### UI Surface Summary

| Surface | Present | Notes |
| --- | --- | --- |
| UI Surface | Yes | A bounded UI surface export is present. |
| Admin Contributions | Yes | Additional admin workspace contributions are exported. |
| Zone/Canvas Extension | No | No dedicated zone extension export. |

## Hooks, Events, And Orchestration

This plugin should be integrated through **explicit commands/actions, resources, jobs, workflows, and the surrounding Gutu event runtime**. It must **not** be documented as a generic WordPress-style hook system unless such a hook API is explicitly exported.

- No standalone plugin-owned lifecycle event feed is exported today.
- Job surface: `manufacturing.projections.refresh`, `manufacturing.reconciliation.run`.
- Workflow surface: `manufacturing-work-order-lifecycle`.
- Recommended composition pattern: invoke actions, read resources, then let the surrounding Gutu command/event/job runtime handle downstream automation.

## Storage, Schema, And Migration Notes

- Database compatibility: `postgres`, `sqlite`
- Schema file: `framework/builtin-plugins/manufacturing-core/db/schema.ts`
- SQL helper file: `framework/builtin-plugins/manufacturing-core/src/postgres.ts`
- Migration lane present: Yes

The plugin ships explicit SQL helper exports. Use those helpers as the truth source for database migration or rollback expectations.

## Failure Modes And Recovery

- Action inputs can fail schema validation or permission evaluation before any durable mutation happens.
- If downstream automation is needed, the host must add it explicitly instead of assuming this plugin emits jobs.
- There is no separate lifecycle-event feed to rely on today; do not build one implicitly from internal details.
- Schema regressions are expected to show up in the migration lane and should block shipment.

## Mermaid Flows

### Primary Lifecycle

```mermaid
flowchart LR
  caller["Host or operator"] --> action["manufacturing.boms.publish"]
  action --> validation["Schema + permission guard"]
  validation --> service["Manufacturing Core service layer"]
  service --> state["manufacturing.boms"]
  service --> jobs["Follow-up jobs / queue definitions"]
  service --> workflows["Workflow state transitions"]
  state --> ui["Admin contributions"]
```

### Workflow State Machine

```mermaid
stateDiagram-v2
  [*] --> draft
  draft --> pending_approval
  draft --> active
  draft --> reconciled
  draft --> closed
  draft --> canceled
```


## Integration Recipes

### 1. Host wiring

```ts
import { manifest, createPrimaryRecordAction, BusinessPrimaryResource, jobDefinitions, workflowDefinitions, adminContributions, uiSurface } from "@plugins/manufacturing-core";

export const pluginSurface = {
  manifest,
  createPrimaryRecordAction,
  BusinessPrimaryResource,
  jobDefinitions,
  workflowDefinitions,
  adminContributions,
  uiSurface
};
```

Use this pattern when your host needs to register the plugin’s declared exports without reaching into internal file paths.

### 2. Action-first orchestration

```ts
import { manifest, createPrimaryRecordAction } from "@plugins/manufacturing-core";

console.log("plugin", manifest.id);
console.log("action", createPrimaryRecordAction.id);
```

- Prefer action IDs as the stable integration boundary.
- Respect the declared permission, idempotency, and audit metadata instead of bypassing the service layer.
- Treat resource IDs as the read-model boundary for downstream consumers.

### 3. Cross-plugin composition

- Register the workflow definitions with the host runtime instead of re-encoding state transitions outside the plugin.
- Drive follow-up automation from explicit workflow transitions and resource reads.
- Pair workflow decisions with notifications or jobs in the outer orchestration layer when humans must be kept in the loop.

## Test Matrix

| Lane | Present | Evidence |
| --- | --- | --- |
| Build | Yes | `bun run build` |
| Typecheck | Yes | `bun run typecheck` |
| Lint | Yes | `bun run lint` |
| Test | Yes | `bun run test` |
| Unit | Yes | 1 file(s) |
| Contracts | Yes | 1 file(s) |
| Integration | Yes | 1 file(s) |
| Migrations | Yes | 2 file(s) |

### Verification commands

- `bun run build`
- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run test:contracts`
- `bun run test:unit`
- `bun run test:integration`
- `bun run test:migrations`
- `bun run docs:check`

## Current Truth And Recommended Next

### Current truth

- Exports 3 governed actions: `manufacturing.boms.publish`, `manufacturing.work-orders.release`, `manufacturing.outputs.record`.
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

### Current gaps

- Repo-local documentation verification entrypoints were missing before this pass and need to stay green as the repo evolves.

### Recommended next

- Deepen production variance, subcontracting, and rework handling before the manufacturing boundary is treated as production-grade.
- Add stronger planning and quality integration contracts where plant execution depends on them daily.
- Broaden lifecycle coverage with deeper orchestration, reconciliation, and operator tooling where the business flow requires it.
- Add more explicit domain events or follow-up job surfaces when downstream systems need tighter coupling.
- Convert more ERP parity references into first-class runtime handlers where needed, starting from `BOM`, `Routing`, `Operation`.

### Later / optional

- Outbound connectors, richer analytics, or portal-facing experiences once the core domain contracts harden.
