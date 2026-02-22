import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./users.routes";
import configRoutes from "./config.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/config", configRoutes);

export default router;
