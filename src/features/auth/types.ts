import { Document, Types } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  RESELLER = "reseller",
  USER = "user",
}

export interface IUser {
  email: string;
  username: string;
  password?: string;
  name?: string;
  role: UserRole;
  api_key?: string;
  flows?: Types.ObjectId[];
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserDocument extends IUser, IUserMethods, Document {
  createdAt: Date;
  updatedAt: Date;
}
