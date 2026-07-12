import { parseBuffer } from "music-metadata";
import { env } from "../config/env.js";
 
export async function validateAudioDuration(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "Audio file is required" });
    const meta = await parseBuffer(req.file.buffer, req.file.mimetype);
    const duration = meta.format.duration || 0;
    if (duration < env.minSeconds || duration > env.maxSeconds) {
      return res.status(400).json({
        error: `Audio must be ${env.minSeconds}-${env.maxSeconds}s (got ${duration.toFixed(1)}s)`,
      });
    }
    req.audioDuration = duration;
    next();
  } catch {
    return res.status(400).json({ error: "Could not read audio metadata" });
  }
}
