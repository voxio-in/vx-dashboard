import jwt from "jsonwebtoken";
import { Response } from "express";

export const signToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const setHttpOnlyCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
