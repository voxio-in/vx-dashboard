import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import User from "@/features/auth/model";
import connectDB from "./db";
import { UserDocument } from "@/features/auth/types";

export async function getCurrentUser(): Promise<UserDocument | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || typeof payload === "string") return null;

  await connectDB();

  const user = await User.findById(payload.id).lean();

  return user as unknown as UserDocument;
}
