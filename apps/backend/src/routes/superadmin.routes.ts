import { Router } from "express";
import {
  getGlobalConfig,
  updateGlobalConfig,
  updateRoleConfig,
  updateUserConfig,
} from "../controllers/superadmin.controller";
import { protect } from "../middleware/auth.middleware";
import { roleGuard } from "../middleware/role.middleware";
import { Role } from "@vx/shared";

const router = Router();

router.use(protect);
router.use(roleGuard(Role.SUPERADMIN));

router.get("/config", getGlobalConfig);
router.put("/config", updateGlobalConfig);
router.put("/config/role/:role", updateRoleConfig);
router.put("/config/user/:userId", updateUserConfig);

export default router;
