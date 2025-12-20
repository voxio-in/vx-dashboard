import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAgent {
  workflow: {
    nodes: any;
    variables?: any;
    start_node?: string;
  };
}

export interface AgentDocument extends IAgent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<AgentDocument>(
  {
    workflow: {
      nodes: { type: Schema.Types.Mixed, default: {} },
      variables: { type: Schema.Types.Mixed, default: {} },
      start_node: { type: String, default: "greeting" },
    },
  },
  {
    timestamps: true,
    collection: "agents",
  }
);

const Agent: Model<AgentDocument> =
  mongoose.models.Agent || mongoose.model<AgentDocument>("Agent", AgentSchema);

export default Agent;
