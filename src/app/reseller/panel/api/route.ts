import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/db";
import User from "@/features/auth/model";
// Import Flow so Mongoose knows about the schema before populating
import Flow from "@/features/flow/model";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || typeof payload === "string") {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    await connectDB();

    // 1. Find the User
    // 2. Populate the 'flows' array
    // 3. We assume the 'Flow' model is stored in the 'flows' collection (lowercase) in MongoDB
    const user = await User.findById(payload.id)
      .select("flows") // We only need the flows array from the user
      .populate({
        path: "flows",
        model: Flow,
        // Select specific fields to send to frontend to save bandwidth
        select: "name api_key stt_id tts_id agent_id _id",
      })
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the flows list directly
    return NextResponse.json({
      flows: user.flows || [],
    });
  } catch (error: any) {
    console.error("Dashboard Fetch Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
