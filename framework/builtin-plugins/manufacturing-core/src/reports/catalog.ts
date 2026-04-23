export const reportDefinitions = [
  {
    "id": "manufacturing-core.report.01",
    "label": "BOM Stock Report",
    "owningPlugin": "manufacturing-core",
    "source": "erpnext-parity",
    "exceptionQueues": [
      "material-shortage-review",
      "scrap-variance-review",
      "capacity-overload-review",
      "subcontract-output-hold"
    ]
  },
  {
    "id": "manufacturing-core.report.02",
    "label": "Production Plan Summary",
    "owningPlugin": "manufacturing-core",
    "source": "erpnext-parity",
    "exceptionQueues": [
      "material-shortage-review",
      "scrap-variance-review",
      "capacity-overload-review",
      "subcontract-output-hold"
    ]
  },
  {
    "id": "manufacturing-core.report.03",
    "label": "Work Order Variance",
    "owningPlugin": "manufacturing-core",
    "source": "erpnext-parity",
    "exceptionQueues": [
      "material-shortage-review",
      "scrap-variance-review",
      "capacity-overload-review",
      "subcontract-output-hold"
    ]
  },
  {
    "id": "manufacturing-core.report.04",
    "label": "Capacity and Downtime Summary",
    "owningPlugin": "manufacturing-core",
    "source": "erpnext-parity",
    "exceptionQueues": [
      "material-shortage-review",
      "scrap-variance-review",
      "capacity-overload-review",
      "subcontract-output-hold"
    ]
  }
] as const;
