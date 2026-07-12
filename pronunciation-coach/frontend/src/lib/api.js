const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
 
export async function scoreAudio({ file, reference, sessionId, saveHistory, language }) {
  const form = new FormData();
  form.append("audio", file);
  if (reference) form.append("reference", reference);
  form.append("sessionId", sessionId);
  form.append("saveHistory", String(saveHistory));
  form.append("language", language);
 
  const res = await fetch(`${API_URL}/v1/audio/score`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Scoring failed");
  return data;
}
 
export async function fetchHistory(sessionId) {
  const res = await fetch(`${API_URL}/v1/attempts/${sessionId}`);
  if (!res.ok) throw new Error("Could not load history");
  return res.json();
}
 
export async function clearHistory(sessionId) {
  await fetch(`${API_URL}/v1/attempts/${sessionId}`, { method: "DELETE" });
}
