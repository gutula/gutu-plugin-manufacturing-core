# Manufacturing Core Flows

## Happy paths

- `manufacturing.boms.publish`: Publish BOM
- `manufacturing.work-orders.release`: Release Work Order
- `manufacturing.outputs.record`: Record Manufacturing Output

## Operational scenario matrix

- `mrp-to-production-plan`
- `work-order-release`
- `issue-to-production-to-finished-goods`
- `scrap-and-rework`
- `subcontract-manufacturing`

## Action-level flows

### `manufacturing.boms.publish`

Publish BOM

Permission: `manufacturing.boms.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `manufacturing.boms`, `manufacturing.work-orders`, `manufacturing.wip`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `manufacturing.work-orders.release`

Release Work Order

Permission: `manufacturing.work-orders.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `manufacturing.boms`, `manufacturing.work-orders`, `manufacturing.wip`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `manufacturing.outputs.record`

Record Manufacturing Output

Permission: `manufacturing.outputs.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `manufacturing.boms`, `manufacturing.work-orders`, `manufacturing.wip`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


## Cross-package interactions

- Direct dependencies: `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core`, `workflow-core`, `product-catalog-core`, `inventory-core`, `traceability-core`
- Requested capabilities: `ui.register.admin`, `api.rest.mount`, `data.write.manufacturing`, `events.publish.manufacturing`
- Integration model: Actions+Resources+Jobs+Workflows+UI
- ERPNext doctypes used as parity references: `BOM`, `Routing`, `Operation`, `Work Order`, `Job Card`, `Production Plan`, `Workstation`, `Downtime Entry`, `Subcontracting BOM`
- Recovery ownership should stay with the host orchestration layer when the plugin does not explicitly export jobs, workflows, or lifecycle events.
