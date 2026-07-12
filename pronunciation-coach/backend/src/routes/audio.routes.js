import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import { validateAudioDuration } from "../middleware/validateAudio.js";
import { scoreAudioHandler } from "../controllers/audio.controller.js";
 
const router = Router();
router.post("/score", upload.single("audio"), validateAudioDuration, scoreAudioHandler);
export default router;
