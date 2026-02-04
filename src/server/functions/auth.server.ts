// src/server/functions/auth.server.ts

import { createServerFn } from "@tanstack/react-start";
import { setCookie, deleteCookie } from "vinxi/http";
import bcrypt from "bcryptjs";
import { connectDB } from "../db/connections";
import User from "../db/models/User";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "../../lib/validators/auth.schema";

export const registerFn = createServerFn({ method: "POST" })
  .inputValidator((data: RegisterInput) => {
    return registerSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      await connectDB();

      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error("An account with this email already exists");
      }

      // 2. Hash password with bcrypt (10 rounds)
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // 3. Create new user in database
      const newUser = await User.create({
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        role: "super_admin", // First user is super admin
      });

      // 4. Set authentication cookie
      setCookie("auth_session", newUser._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      console.log("✅ User registered:", newUser.email);

      // 5. Return success
      return {
        success: true,
        userId: newUser._id.toString(),
        role: newUser.role,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Registration error:", error.message);
        throw error;
      }
      throw new Error("Registration failed. Please try again.");
    }
  });

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: LoginInput) => {
    return loginSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      // Connect to database
      await connectDB();

      // 1. Find user by email (include password for verification)
      const user = await User.findOne({ email: data.email }).select(
        "+passwordHash",
      );
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // 2. Verify password
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // 3. Set authentication cookie
      setCookie("auth_session", user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      console.log("✅ User logged in:", user.email);

      // 4. Return user data
      return {
        success: true,
        userId: user._id.toString(),
        role: user.role,
        name: user.name,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Login error:", error.message);
        throw error;
      }
      throw new Error("Login failed. Please try again.");
    }
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    deleteCookie("auth_session");
    console.log("✅ User logged out");
    return { success: true };
  } catch (error) {
    console.error("❌ Logout error:", error);
    throw new Error("Logout failed");
  }
});
