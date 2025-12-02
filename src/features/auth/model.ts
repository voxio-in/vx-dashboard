import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserDocument, UserRole } from "./types";

const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    name: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true,
    },
    api_key: {
      type: String,
      unique: true,
      sparse: true,
    },
    flows: [
      {
        type: Schema.Types.ObjectId,
        ref: "Flow",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  } catch (error) {
    throw error;
  }
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password as string);
};

const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
