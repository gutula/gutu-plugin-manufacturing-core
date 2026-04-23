export const domainCatalog = {
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
} as const;
