export const exceptionQueueDefinitions = [
  {
    "id": "material-shortage-review",
    "label": "Material Shortage Review",
    "severity": "medium",
    "owner": "planner",
    "reconciliationJobId": "manufacturing.reconciliation.run"
  },
  {
    "id": "scrap-variance-review",
    "label": "Scrap Variance Review",
    "severity": "medium",
    "owner": "planner",
    "reconciliationJobId": "manufacturing.reconciliation.run"
  },
  {
    "id": "capacity-overload-review",
    "label": "Capacity Overload Review",
    "severity": "medium",
    "owner": "planner",
    "reconciliationJobId": "manufacturing.reconciliation.run"
  },
  {
    "id": "subcontract-output-hold",
    "label": "Subcontract Output Hold",
    "severity": "medium",
    "owner": "planner",
    "reconciliationJobId": "manufacturing.reconciliation.run"
  }
] as const;
