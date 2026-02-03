import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/jwt";
import connectDB from "@/lib/db";
import User from "@/features/auth/model";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = verifyToken(token);

    if (!payload || typeof payload === "string") {
      return NextResponse.json({ user: null });
    }

    await connectDB();
    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
