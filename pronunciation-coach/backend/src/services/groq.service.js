import { groq } from "../config/groq.js";
 
export async function transcribeAudio(buffer, filename, language) {
  const file = new File([buffer], filename);
  const options = {
    file,
    model: "whisper-large-v3",
    response_format: "verbose_json",
    timestamp_granularities: ["word", "segment"],
  };
  
  // language is now the ISO code (en, hi, mr) passed from scoring.service.js
  if (language) options.language = language;
  
  return groq.audio.transcriptions.create(options);
}
 
export async function judgePronunciation({ transcript, segments, reference, language }) {
  // Map ISO codes back to full names for the AI's system prompt
  const languageNames = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi"
  };
  
  const languageName = languageNames[language] || language || "English";

  const prompt = `You are a strict pronunciation coach for learners of ${languageName}.
Return STRICT JSON only, no markdown, matching this shape:
{"overallScore": number (0-100), "words": [{"word": string, "status": "ok"|"mispronounced"|"unclear", "tip": string}], "summary": string}
 
Transcript: "${transcript}"
Low-confidence segments: ${JSON.stringify(segments)}
Reference sentence (may be empty): "${reference || ""}"
 
Rules:
- Provide feedback in ${languageName}.
- Flag only words that are mispronounced or unclear; omit clearly fine words.
- Base "mispronounced" on reference mismatches when a reference is given.
- Base "unclear" mainly on low-confidence segments.
- "summary" is 1-2 sentences of actionable feedback.`;
 
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
 
  return JSON.parse(completion.choices[0].message.content);
}