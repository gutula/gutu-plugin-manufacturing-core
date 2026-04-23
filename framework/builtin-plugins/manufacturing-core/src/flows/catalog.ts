import {
  advancePrimaryRecord,
  createPrimaryRecord,
  reconcilePrimaryRecord,
  type AdvancePrimaryRecordInput,
  type CreatePrimaryRecordInput,
  type ReconcilePrimaryRecordInput
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
