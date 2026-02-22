import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserActivation,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";
import { roleGuard } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createUserSchema, updateUserSchema, Role } from "@vx/shared";

const router = Router();

router.use(protect);

router.get("/", roleGuard(Role.ADMIN), getUsers);
router.post("/", roleGuard(Role.ADMIN), validate(createUserSchema), createUser);
router.put(
  "/:id",
  roleGuard(Role.ADMIN),
  validate(updateUserSchema),
  updateUser,
);
router.delete("/:id", roleGuard(Role.ADMIN), deleteUser);
router.patch("/:id/toggle", roleGuard(Role.ADMIN), toggleUserActivation);

export default router;
