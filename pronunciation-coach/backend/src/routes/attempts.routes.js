import { Router } from "express";
import { listAttempts, deleteAttempt, deleteAllForSession } from "../controllers/attempts.controller.js";
 
const router = Router();
router.get("/:sessionId", listAttempts);
router.delete("/:sessionId", deleteAllForSession);
router.delete("/item/:id", deleteAttempt);
export default router;
