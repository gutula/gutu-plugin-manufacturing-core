import {
  createBusinessDomainStateStore,
  createBusinessOrchestrationState,
  createBusinessPluginService,
  type BusinessAdvancePrimaryRecordInput,
  type BusinessCreatePrimaryRecordInput,
  type BusinessFailPendingDownstreamItemInput,
  type BusinessReconcilePrimaryRecordInput,
  type BusinessReplayDeadLetterInput,
  type BusinessResolvePendingDownstreamItemInput
} from "@platform/business-runtime";

import { type ExceptionRecord, type PrimaryRecord, type SecondaryRecord } from "../model";

export type CreatePrimaryRecordInput = BusinessCreatePrimaryRecordInput;
export type AdvancePrimaryRecordInput = BusinessAdvancePrimaryRecordInput;
export type ReconcilePrimaryRecordInput = BusinessReconcilePrimaryRecordInput;
export type ResolvePendingDownstreamItemInput = BusinessResolvePendingDownstreamItemInput;
export type FailPendingDownstreamItemInput = BusinessFailPendingDownstreamItemInput;
export type ReplayDeadLetterInput = BusinessReplayDeadLetterInput;

function seedState() {
  return {
    primaryRecords: [
      {
        id: "manufacturing-core:seed",
        tenantId: "tenant-platform",
        title: "Manufacturing Core Seed Record",
        counterpartyId: "party:seed",
        companyId: "company:primary",
        branchId: "branch:head-office",
        recordState: "active",
        approvalState: "approved",
        postingState: "unposted",
        fulfillmentState: "none",
        amountMinor: 125000,
        currencyCode: "USD",
        revisionNo: 1,
        reasonCode: null,
        effectiveAt: "2026-04-23T00:00:00.000Z",
        correlationId: "manufacturing-core:seed",
        processId: "manufacturing-work-order-lifecycle:seed",
        upstreamRefs: [],
        downstreamRefs: [],
        updatedAt: "2026-04-23T00:00:00.000Z"
      }
    ] satisfies PrimaryRecord[],
    secondaryRecords: [] satisfies SecondaryRecord[],
    exceptionRecords: [] satisfies ExceptionRecord[],
    orchestration: createBusinessOrchestrationState()
  };
}

const store = createBusinessDomainStateStore({
  pluginId: "manufacturing-core",
  sqlite: {
    primaryTable: "manufacturing_core_primary_records",
    secondaryTable: "manufacturing_core_secondary_records",
    exceptionTable: "manufacturing_core_exception_records",
    dbFileName: "business-runtime.sqlite"
  },
  postgres: {
    schemaName: "manufacturing_core"
  },
  seedStateFactory: seedState
});

const service = createBusinessPluginService({
  pluginId: "manufacturing-core",
  displayName: "Manufacturing Core",
  primaryResourceId: "manufacturing.boms",
  secondaryResourceId: "manufacturing.work-orders",
  exceptionResourceId: "manufacturing.wip",
  createEvent: "manufacturing.bom-published.v1",
  advanceEvent: "manufacturing.work-order-released.v1",
  reconcileEvent: "manufacturing.output-recorded.v1",
  projectionJobId: "manufacturing.projections.refresh",
  reconciliationJobId: "manufacturing.reconciliation.run",
  advanceActionLabel: "Release Work Order",
  orchestrationTargets: {
  "create": [],
  "advance": [
    "inventory.transfers.request",
    "traceability.links.record"
  ],
  "reconcile": [
    "traceability.reconciliation.queue"
  ]
},
  store
});

export const {
  listPrimaryRecords,
  listSecondaryRecords,
  listExceptionRecords,
  listPublishedMessages,
  listPendingDownstreamItems,
  listDeadLetters,
  listProjectionRecords,
  getBusinessOverview,
  createPrimaryRecord,
  advancePrimaryRecord,
  reconcilePrimaryRecord,
  resolvePendingDownstreamItem,
  failPendingDownstreamItem,
  replayDeadLetter
} = service;
