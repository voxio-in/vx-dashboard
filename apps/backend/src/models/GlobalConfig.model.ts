import mongoose, { Schema, Document } from "mongoose";

export interface IGlobalConfigDocument extends Document {
  defaultUIConfig: {
    hiddenComponents: string[];
    sidebarItems: any[];
  };
  roleOverrides: Record<string, any>;
  updatedAt: Date;
}

const GlobalConfigSchema = new Schema<IGlobalConfigDocument>(
  {
    defaultUIConfig: {
      hiddenComponents: [{ type: String }],
      sidebarItems: [{ type: Schema.Types.Mixed }],
    },
    roleOverrides: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

export const GlobalConfig = mongoose.model<IGlobalConfigDocument>(
  "GlobalConfig",
  GlobalConfigSchema,
);
