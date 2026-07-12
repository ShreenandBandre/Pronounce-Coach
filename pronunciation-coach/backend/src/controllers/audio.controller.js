import { scoreAudio } from "../services/scoring.service.js";
import { prisma } from "../config/prisma.js"; 

export async function scoreAudioHandler(req, res, next) {
  try {
    const { buffer, originalname } = req.file;
    // Extract language from req.body
    const { reference, sessionId, saveHistory, language } = req.body;
    
    // Map full name to ISO-639-1 code required by the API
    const languageMap = {
      "English": "en",
      "Hindi": "hi",
      "Marathi": "mr"
    };

    // Use the mapped code, or default to "en"
    const languageCode = languageMap[language] || "en";
    
    // Pass the ISO code to the scoring service
    const result = await scoreAudio(buffer, originalname, reference, languageCode);
 
    if (saveHistory === "true" && sessionId) {
      await prisma.attempt.create({
        data: {
          sessionId,
          transcript: result.transcript,
          overallScore: result.overallScore,
          flaggedWords: result.words,
          summary: result.summary,
        },
      });
    }
    res.json(result);
  } catch (err) { 
    next(err); 
  }
}