export type FlowStatus = "active" | "inactive" | "draft";

export interface IFlow {
  _id: string;
  name: string;
  description?: string;
  status: FlowStatus;
  ownerId: string; // user who owns this flow
  createdAt: string;
  updatedAt: string;
}

export type CreateFlowPayload = Pick<IFlow, "name" | "description">;
export type UpdateFlowPayload = Partial<
  Pick<IFlow, "name" | "description" | "status">
>;
