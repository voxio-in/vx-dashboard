import { Router } from "express";
import {
  getAgentByFlowId,
  saveAgentConfiguration,
} from "../controllers/agent.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router({ mergeParams: true });

router.use(protect);
router.get("/", getAgentByFlowId);
router.post("/", saveAgentConfiguration);

export default router;
