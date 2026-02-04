// app/server/db/connections.ts

import mongoose from "mongoose";

// Get MongoDB URI from environment variables
const MONGODB_URI =
  process.env.DATABASE_URL || "mongodb://localhost:27017/voxio";

// Track connection state to prevent multiple connections
let isConnected = false;

/**
 * CONNECT TO MONGODB
 *
 * This function:
 * 1. Checks if already connected (to avoid duplicate connections)
 * 2. Connects to MongoDB using Mongoose
 * 3. Sets connection state
 *
 * Usage in server functions:
 * ```typescript
 * await connectDB();
 * const user = await User.findOne({ email });
 * ```
 */
export async function connectDB(): Promise<void> {
  // If already connected, skip connection
  if (isConnected) {
    console.log("✅ MongoDB: Using existing connection");
    return;
  }

  try {
    // Connect to MongoDB
    const db = await mongoose.connect(MONGODB_URI, {
      // These options ensure stable connection
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    // Update connection state
    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("✅ MongoDB: Connected successfully to", db.connection.name);
    }
  } catch (error) {
    console.error("❌ MongoDB: Connection failed", error);
    isConnected = false;
    throw new Error("Database connection failed");
  }
}

/**
 * DISCONNECT FROM MONGODB
 *
 * Useful for:
 * - Testing
 * - Graceful shutdown
 *
 * Usage:
 * ```typescript
 * await disconnectDB();
 * ```
 */
export async function disconnectDB(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("✅ MongoDB: Disconnected successfully");
  } catch (error) {
    console.error("❌ MongoDB: Disconnect failed", error);
    throw new Error("Database disconnect failed");
  }
}
