import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/features/auth/model";
import { UserRole } from "@/features/auth/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // === EXTRACT NEW FIELDS ===
    const { username, email, password, name, role, flows, api_key } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, Email, and Password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this username or email already exists" },
        { status: 409 }
      );
    }

    const assignedRole = Object.values(UserRole).includes(role)
      ? role
      : UserRole.USER;

    const user = await User.create({
      username,
      email,
      password,
      name,
      role: assignedRole,
      // === SAVE NEW FIELDS ===
      api_key: api_key || undefined, // Only save if provided
      flows: flows || [], // Save provided flows or empty array
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
          flows: user.flows, // Return flows in response
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration Error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Username, Email, or API Key already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
