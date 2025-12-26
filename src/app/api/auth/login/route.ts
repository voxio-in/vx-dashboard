import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/features/auth/model";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    console.log('Attempting login for username:', username);

    await connectDB();

    const user = await User.findOne({ username }).select("+password");

    console.log('User found:', !!user);
    if (user) console.log('Password hash exists:', !!user.password);

    console.log('Comparing password...');
    const passwordMatch = await user.comparePassword(password);
    console.log('Password match result:', passwordMatch);

    if (!user || !passwordMatch) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
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
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
