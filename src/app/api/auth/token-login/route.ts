import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/features/auth/model";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Verify the token
    const payload = verifyToken(token);

    if (!payload || typeof payload === "string") {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // FIXED: Handle both "id" and "user_id" from JWT payload
    const userId = payload.user_id || payload.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in token" },
        { status: 401 }
      );
    }

    // Connect to DB and fetch the user
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Set the authentication cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Token login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
