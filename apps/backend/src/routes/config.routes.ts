import { Router } from "express";
import { getMyConfig } from "../controllers/config.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);
router.get("/me", getMyConfig);

export default router;
