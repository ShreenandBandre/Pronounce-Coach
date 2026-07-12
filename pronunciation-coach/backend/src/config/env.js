import dotenv from "dotenv";
dotenv.config();
 
export const env = {
  port: process.env.PORT || 4000,
  groqApiKey: process.env.GROQ_API_KEY,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  minSeconds: Number(process.env.MAX_AUDIO_SECONDS_MIN || 30),
  maxSeconds: Number(process.env.MAX_AUDIO_SECONDS_MAX || 45),
};
