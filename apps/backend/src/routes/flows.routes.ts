import { Router } from "express";
import {
  getFlows,
  createFlow,
  updateFlow,
  deleteFlow,
  getFlowById,
} from "../controllers/flows.controller";
import { getSTT, updateSTT } from "../controllers/stt.controller";
import { getTTS, updateTTS } from "../controllers/tts.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);
router.get("/", getFlows);
router.post("/", createFlow);
router.put("/:id", updateFlow);
router.delete("/:id", deleteFlow);
router.get("/:id", getFlowById);
router.patch(
  "/:id/silence",
  async (req, res, next) => {
    req.body = { "max-silence-counter": req.body.maxSilenceCounter };
    next();
  },
  updateFlow,
);

router.get("/:flowId/stt", getSTT);
router.put("/:flowId/stt", updateSTT);
router.get("/:flowId/tts", getTTS);
router.put("/:flowId/tts", updateTTS);

export default router;
