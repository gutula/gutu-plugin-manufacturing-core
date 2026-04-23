import {
  advancePrimaryRecord,
  amendPrimaryRecord,
  createPrimaryRecord,
  placePrimaryRecordOnHold,
  reconcilePrimaryRecord,
  releasePrimaryRecordHold,
  reversePrimaryRecord,
  type AdvancePrimaryRecordInput,
  type AmendPrimaryRecordInput,
  type CreatePrimaryRecordInput,
  type PlacePrimaryRecordOnHoldInput,
  type ReconcilePrimaryRecordInput,
  type ReleasePrimaryRecordHoldInput,
  type ReversePrimaryRecordInput
} from "../services/main.service";

export const businessFlowDefinitions = [
  {
    "id": "manufacturing.boms.publish",
    "label": "Publish BOM",
    "phase": "create",
    "methodName": "publishBom"
  },
  {
    "id": "manufacturing.work-orders.release",
    "label": "Release Work Order",
    "phase": "advance",
    "methodName": "releaseWorkOrder"
  },
  {
    "id": "manufacturing.outputs.record",
    "label": "Record Manufacturing Output",
    "phase": "reconcile",
    "methodName": "recordManufacturingOutput"
  },
  {
    "id": "manufacturing.boms.hold",
    "label": "Place Record On Hold",
    "phase": "hold",
    "methodName": "placeRecordOnHold"
  },
  {
    "id": "manufacturing.boms.release",
    "label": "Release Record Hold",
    "phase": "release",
    "methodName": "releaseRecordHold"
  },
  {
    "id": "manufacturing.boms.amend",
    "label": "Amend Record",
    "phase": "amend",
    "methodName": "amendRecord"
  },
  {
    "id": "manufacturing.boms.reverse",
    "label": "Reverse Record",
    "phase": "reverse",
    "methodName": "reverseRecord"
  }
] as const;

export async function publishBom(input: CreatePrimaryRecordInput) {
  return createPrimaryRecord(input);
}

export async function releaseWorkOrder(input: AdvancePrimaryRecordInput) {
  return advancePrimaryRecord(input);
}

export async function recordManufacturingOutput(input: ReconcilePrimaryRecordInput) {
  return reconcilePrimaryRecord(input);
}

export async function placeRecordOnHold(input: PlacePrimaryRecordOnHoldInput) {
  return placePrimaryRecordOnHold(input);
}

export async function releaseRecordHold(input: ReleasePrimaryRecordHoldInput) {
  return releasePrimaryRecordHold(input);
}

export async function amendRecord(input: AmendPrimaryRecordInput) {
  return amendPrimaryRecord(input);
}

export async function reverseRecord(input: ReversePrimaryRecordInput) {
  return reversePrimaryRecord(input);
}
