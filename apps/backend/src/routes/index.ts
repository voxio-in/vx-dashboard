import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./users.routes";
import configRoutes from "./config.routes";
import flowRoutes from "./flows.routes";
import superadminRoutes from "./superadmin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/config", configRoutes);
router.use("/flows", flowRoutes);
router.use("/superadmin", superadminRoutes);

export default router;
