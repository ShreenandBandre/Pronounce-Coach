import { useSessionStore } from "../store/useSessionStore";
 
export default function ConsentGate() {
  const setConsent = useSessionStore((s) => s.setConsent);
  return (
    <div className="max-w-xl mx-auto mt-24 bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">Before you start</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        Your recording is sent to our AI provider (Groq) only to generate a pronunciation score.
        The audio itself is never stored — only the transcript and score, and only if you opt in
        to save history. You can delete your history anytime.
      </p>
      <button onClick={() => setConsent(true)}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-xl transition">
        I understand, continue
      </button>
    </div>
  );
}
