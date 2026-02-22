import mongoose, { Schema, Document } from "mongoose";
import { Role } from "@vx/shared";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  parentId?: mongoose.Types.ObjectId;
  permissions: string[];
  uiOverrides: string[];
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(Role), required: true },
    isActive: { type: Boolean, default: true },
    parentId: { type: Schema.Types.ObjectId, ref: "User" },
    permissions: [{ type: String }],
    uiOverrides: [{ type: String }],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUserDocument>("User", UserSchema);
