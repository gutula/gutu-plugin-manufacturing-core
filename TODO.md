# Manufacturing Core TODO

**Maturity Tier:** `Hardened`

## Shipped Now

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

## Current Gaps

- No additional gaps were identified beyond the plugin’s stated non-goals.

## Recommended Next

- Deepen production variance, subcontracting, and rework handling before the manufacturing boundary is treated as production-grade.
- Add stronger planning and quality integration contracts where plant execution depends on them daily.
- Broaden lifecycle coverage with deeper orchestration, reconciliation, and operator tooling where the business flow requires it.
- Add more explicit domain events or follow-up job surfaces when downstream systems need tighter coupling.
- Convert more ERP parity references into first-class runtime handlers where needed, starting from `BOM`, `Routing`, `Operation`.

## Later / Optional

- Outbound connectors, richer analytics, or portal-facing experiences once the core domain contracts harden.
