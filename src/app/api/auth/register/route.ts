import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import connectDB from "@/lib/db";
import User from "@/features/auth/model";
import Flow from "@/features/flow/model";
import STT from "@/features/stt/model";
import TTS from "@/features/tts/model";
import Agent from "@/features/agent/model";

// --- Helper: Generate Secure API Key ---
function generateApiKey(): string {
  const prefix = "vk_";
  const length = 64;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const bytes = randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }

  return prefix + result;
}

export async function POST(req: Request) {
  console.log("🔵 [Register API] Request received");

  try {
    // 1. Parse Input
    const body = await req.json();
    const { username, email, password, name, role } = body;

    console.log(`🔵 [Register API] Processing registration for: ${email}`);

    // 2. Validate
    if (!email || !password) {
      console.log(
        "🔴 [Register API] Validation failed: Missing email or password"
      );
      return NextResponse.json(
        { message: "Missing email or password" },
        { status: 400 }
      );
    }

    // 3. Connect to DB
    console.log("🔵 [Register API] Connecting to database...");
    await connectDB();
    console.log("✅ [Register API] Database connected");

    // 4. Check Duplicate
    console.log("🔵 [Register API] Checking for existing user...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("🔴 [Register API] User already exists");
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // 5. Password Hashing - REMOVED
    // We are passing the plain password to User.create.
    // Your User Model's pre('save') hook will handle the hashing.
    // This prevents "Double Hashing" which causes login failures.
    console.log(
      "🔵 [Register API] Proceeding with plain password (model will hash it)..."
    );

    // --- CREATE DEFAULT COMPONENTS ---
    console.log("🔵 [Register API] Creating default components...");

    // A. Create Default STT
    console.log("🔵 [Register API] Creating STT...");
    const newSTT = await STT.create({
      service: "deepgram",
      "model-name": "nova-2",
      language: "multi",
      prompt: "",
      temperature: 0,
      keyterms: "",
      channels: 1,
      sample_rate: 16000,
      sample_width: 2,
    });
    console.log(`✅ [Register API] STT Created: ${newSTT._id}`);

    // B. Create Default TTS
    console.log("🔵 [Register API] Creating TTS...");
    const newTTS = await TTS.create({
      service: "rime",
      "model-name": "mist",
      voice_id: "allison",
    });
    console.log(`✅ [Register API] TTS Created: ${newTTS._id}`);

    // C. Create Default Agent
    console.log("🔵 [Register API] Creating Agent...");
    const newAgent = await Agent.create({
      workflow: {
        variables: {
          user_input: { type: "str" },
          llm_response: { type: "str" },
          conversation_history: { type: "list" },
          speak: { type: "str" },
          node_type: { type: "str" },
        },
        start_node: "greeting",
        nodes: [
          {
            name: "greeting",
            type: "out",
            parameters: {
              out_dict: { speak: "Hello! How can I assist you today?" },
            },
            next: "ask_for_input",
          },
          {
            name: "ask_for_input",
            type: "interrupt",
            parameters: {},
            next: "transcription",
          },
          {
            name: "transcription",
            type: "out",
            parameters: { variables: ["user_input"] },
            next: "llm",
          },
          {
            name: "llm",
            type: "llm",
            parameters: {
              input_variables: {
                user_input: { type: "str", description: "User input." },
              },
              prompt_template: "base_llm",
              system_prompt: "You are a helpful assistant.",
              service: "groq",
              model: "llama-3.1-8b-instant",
              history_key: "conversation_history",
              llm_return_type: {
                speak: { type: "str", description: "LLM response." },
              },
            },
            next: "response",
          },
          {
            name: "response",
            type: "out",
            parameters: { variables: ["speak"] },
            next: "ask_for_input",
          },
        ],
      },
    });
    console.log(`✅ [Register API] Agent Created: ${newAgent._id}`);

    // D. Create Flow (With Auto-Generated API Key)
    console.log("🔵 [Register API] Generating API key...");
    const generatedApiKey = generateApiKey();

    console.log("🔵 [Register API] Creating Flow...");
    const newFlow = await Flow.create({
      name: "My First Flow",
      api_key: generatedApiKey,
      stt_id: newSTT._id,
      tts_id: newTTS._id,
      agent_id: newAgent._id,
      faces: [],
    });
    console.log(`✅ [Register API] Flow Created: ${newFlow._id}`);

    // 6. Create User
    console.log("🔵 [Register API] Creating user...");

    const newUser = await User.create({
      username: username || name || email.split("@")[0],
      name: name || username || email.split("@")[0],
      email,
      password: password, // Sending PLAIN password, Model will hash it
      role: role || "user",
      flows: [newFlow._id],
    });

    console.log(`✅ [Register API] User Created: ${newUser._id}`);

    // Return success response
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          flows: newUser.flows,
          apiKey: generatedApiKey,
        },
        createdComponents: {
          stt_id: newSTT._id,
          tts_id: newTTS._id,
          agent_id: newAgent._id,
          flow_id: newFlow._id,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("🔴 [Register API] Error:", error);
    console.error("🔴 [Register API] Error stack:", error.stack);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
