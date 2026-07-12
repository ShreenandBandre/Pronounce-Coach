import { transcribeAudio, judgePronunciation } from "./groq.service.js";
 
export async function scoreAudio(buffer, filename, reference, languageCode) {
  // Pass the ISO code directly. 
  // We remove '|| "English"' because the controller has already mapped the language.
  const stt = await transcribeAudio(buffer, filename, languageCode);
  
  const lowConfidence = (stt.segments || [])
    .filter((s) => s.avg_logprob < -0.5)
    .map((s) => ({ text: s.text, avg_logprob: s.avg_logprob }));
 
  // Pass the language code to the judge service as well
  const verdict = await judgePronunciation({ 
    transcript: stt.text, 
    segments: lowConfidence, 
    reference, 
    language: languageCode 
  });
  
  return { transcript: stt.text, ...verdict };
}