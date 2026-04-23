export const scenarioDefinitions = [
  {
    "id": "mrp-to-production-plan",
    "owningPlugin": "manufacturing-core",
    "workflowId": "manufacturing-work-order-lifecycle",
    "actionIds": [
      "manufacturing.boms.publish",
      "manufacturing.work-orders.release",
      "manufacturing.outputs.record"
    ],
    "downstreamTargets": {
      "create": [],
      "advance": [
        "inventory.transfers.request",
        "traceability.links.record"
      ],
      "reconcile": [
        "traceability.reconciliation.queue"
      ]
    }
  },
  {
    "id": "work-order-release",
    "owningPlugin": "manufacturing-core",
    "workflowId": "manufacturing-work-order-lifecycle",
    "actionIds": [
      "manufacturing.boms.publish",
      "manufacturing.work-orders.release",
      "manufacturing.outputs.record"
    ],
    "downstreamTargets": {
      "create": [],
      "advance": [
        "inventory.transfers.request",
        "traceability.links.record"
      ],
      "reconcile": [
        "traceability.reconciliation.queue"
      ]
    }
  },
  {
    "id": "issue-to-production-to-finished-goods",
    "owningPlugin": "manufacturing-core",
    "workflowId": "manufacturing-work-order-lifecycle",
    "actionIds": [
      "manufacturing.boms.publish",
      "manufacturing.work-orders.release",
      "manufacturing.outputs.record"
    ],
    "downstreamTargets": {
      "create": [],
      "advance": [
        "inventory.transfers.request",
        "traceability.links.record"
      ],
      "reconcile": [
        "traceability.reconciliation.queue"
      ]
    }
  },
  {
    "id": "scrap-and-rework",
    "owningPlugin": "manufacturing-core",
    "workflowId": "manufacturing-work-order-lifecycle",
    "actionIds": [
      "manufacturing.boms.publish",
      "manufacturing.work-orders.release",
      "manufacturing.outputs.record"
    ],
    "downstreamTargets": {
      "create": [],
      "advance": [
        "inventory.transfers.request",
        "traceability.links.record"
      ],
      "reconcile": [
        "traceability.reconciliation.queue"
      ]
    }
  },
  {
    "id": "subcontract-manufacturing",
    "owningPlugin": "manufacturing-core",
    "workflowId": "manufacturing-work-order-lifecycle",
    "actionIds": [
      "manufacturing.boms.publish",
      "manufacturing.work-orders.release",
      "manufacturing.outputs.record"
    ],
    "downstreamTargets": {
      "create": [],
      "advance": [
        "inventory.transfers.request",
        "traceability.links.record"
      ],
      "reconcile": [
        "traceability.reconciliation.queue"
      ]
    }
  }
] as const;
