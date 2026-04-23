import { definePackage } from "@platform/kernel";

export default definePackage({
  "id": "manufacturing-core",
  "kind": "plugin",
  "version": "0.1.0",
  "contractVersion": "1.0.0",
  "sourceRepo": "gutu-plugin-manufacturing-core",
  "displayName": "Manufacturing Core",
  "domainGroup": "Operational Data",
  "defaultCategory": {
    "id": "business",
    "label": "Business",
    "subcategoryId": "manufacturing_production",
    "subcategoryLabel": "Manufacturing & Production"
  },
  "description": "BOM, routing, work order, production execution, WIP posture, and subcontract-friendly production truth with explicit inventory and accounting handoff.",
  "extends": [],
  "dependsOn": [
    "auth-core",
    "org-tenant-core",
    "role-policy-core",
    "audit-core",
    "workflow-core",
    "product-catalog-core",
    "inventory-core",
    "traceability-core"
  ],
  "dependencyContracts": [
    {
      "packageId": "auth-core",
      "class": "required",
      "rationale": "Required for Manufacturing Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "org-tenant-core",
      "class": "required",
      "rationale": "Required for Manufacturing Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "role-policy-core",
      "class": "required",
      "rationale": "Required for Manufacturing Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "audit-core",
      "class": "required",
      "rationale": "Required for Manufacturing Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "workflow-core",
      "class": "required",
      "rationale": "Required for Manufacturing Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "product-catalog-core",
      "class": "required",
      "rationale": "Required for Manufacturing Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "inventory-core",
      "class": "required",
      "rationale": "Required for Manufacturing Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "traceability-core",
      "class": "required",
      "rationale": "Required for Manufacturing Core to keep its boundary governed and explicit."
    }
  ],
  "optionalWith": [],
  "conflictsWith": [],
  "providesCapabilities": [
    "manufacturing.boms",
    "manufacturing.work-orders",
    "manufacturing.wip"
  ],
  "requestedCapabilities": [
    "ui.register.admin",
    "api.rest.mount",
    "data.write.manufacturing",
    "events.publish.manufacturing"
  ],
  "ownsData": [
    "manufacturing.boms",
    "manufacturing.work-orders",
    "manufacturing.operation-logs",
    "manufacturing.wip"
  ],
  "extendsData": [],
  "publicCommands": [
    "manufacturing.boms.publish",
    "manufacturing.work-orders.release",
    "manufacturing.outputs.record",
    "manufacturing.boms.hold",
    "manufacturing.boms.release",
    "manufacturing.boms.amend",
    "manufacturing.boms.reverse"
  ],
  "publicQueries": [
    "manufacturing.plan-summary",
    "manufacturing.variance-summary"
  ],
  "publicEvents": [
    "manufacturing.bom-published.v1",
    "manufacturing.work-order-released.v1",
    "manufacturing.output-recorded.v1"
  ],
  "domainCatalog": {
    "erpnextModules": [
      "Manufacturing",
      "Subcontracting"
    ],
    "erpnextDoctypes": [
      "BOM",
      "Routing",
      "Operation",
      "Work Order",
      "Job Card",
      "Production Plan",
      "Workstation",
      "Downtime Entry",
      "Subcontracting BOM"
    ],
    "ownedEntities": [
      "BOM Revision",
      "Routing",
      "Work Center",
      "Production Plan",
      "Work Order",
      "Operation Log",
      "Scrap Record",
      "Rework Order",
      "WIP Snapshot"
    ],
    "reports": [
      "BOM Stock Report",
      "Production Plan Summary",
      "Work Order Variance",
      "Capacity and Downtime Summary"
    ],
    "exceptionQueues": [
      "material-shortage-review",
      "scrap-variance-review",
      "capacity-overload-review",
      "subcontract-output-hold"
    ],
    "operationalScenarios": [
      "mrp-to-production-plan",
      "work-order-release",
      "issue-to-production-to-finished-goods",
      "scrap-and-rework",
      "subcontract-manufacturing"
    ],
    "settingsSurfaces": [
      "Manufacturing Settings",
      "Workstation",
      "Routing",
      "Operation"
    ],
    "edgeCases": [
      "backflushed variances",
      "scrap and by-product capture",
      "operation quality hold",
      "subcontract partial receipt",
      "serial genealogy across rework"
    ]
  },
  "slotClaims": [],
  "trustTier": "first-party",
  "reviewTier": "R1",
  "isolationProfile": "same-process-trusted",
  "compatibility": {
    "framework": "^0.1.0",
    "runtime": "bun>=1.3.12",
    "db": [
      "postgres",
      "sqlite"
    ]
  }
});
