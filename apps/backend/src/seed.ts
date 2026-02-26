import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { User } from "./models/User.model";
import { hashPassword } from "./utils/hash.utils";
import { Role } from "@vx/shared";

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ email: "superadmin@vx.com" });
  if (existing) {
    console.log("SuperAdmin already exists");
    process.exit(0);
  }

  const password = await hashPassword("superadmin123");
  await User.create({
    name: "Super Admin",
    email: "superadmin@vx.com",
    password,
    role: Role.SUPERADMIN,
    isActive: true,
  });

  console.log("✅ SuperAdmin created!");
  console.log("Email: superadmin@vx.com");
  console.log("Password: superadmin123");
  process.exit(0);
};

seed().catch(console.error);
