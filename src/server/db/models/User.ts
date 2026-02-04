// app/server/db/models/User.ts

import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * USER INTERFACE
 *
 * Defines the structure of a User document in MongoDB
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin" | "reseller" | "super_admin";

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * USER SCHEMA
 *
 * Mongoose schema for the User collection
 */
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Index for faster queries
      validate: {
        validator: function (email: string) {
          // Basic email validation
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Invalid email address",
      },
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't include in queries by default (security)
    },

    role: {
      type: String,
      enum: ["user", "admin", "reseller", "super_admin"],
      default: "user",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

/**
 * INDEXES
 *
 * Create indexes for better query performance
 */
UserSchema.index({ email: 1 }); // Single field index
UserSchema.index({ role: 1 }); // For role-based queries

/**
 * INSTANCE METHODS
 *
 * Methods that can be called on a user document
 * Example: user.toJSON()
 */
UserSchema.methods.toJSON = function () {
  const user = this.toObject();

  // Remove sensitive data from JSON output
  delete user.passwordHash;
  delete user.__v;

  return user;
};

/**
 * STATIC METHODS
 *
 * Methods that can be called on the User model
 * Example: User.findByEmail('test@example.com')
 */
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

/**
 * MODEL EXPORT
 *
 * Prevent model recompilation during hot reload in development
 */
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
