import { Router } from "express";
import {
  getFlows,
  createFlow,
  updateFlow,
  deleteFlow,
} from "../controllers/flows.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);
router.get("/", getFlows);
router.post("/", createFlow);
router.put("/:id", updateFlow);
router.delete("/:id", deleteFlow);

export default router;
