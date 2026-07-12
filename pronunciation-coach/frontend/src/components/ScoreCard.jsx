import WordHighlight from "./WordHighlight";
import { useSessionStore } from "../store/useSessionStore";
 
export default function ScoreCard() {
  const { result, reset } = useSessionStore();
  if (!result) return null;
  const { overallScore, words, summary, transcript } = result;
  const color = overallScore >= 80 ? "text-green-600" : overallScore >= 50 ? "text-amber-600" : "text-red-600";
 
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Your score</h2>
        <span className={`text-4xl font-bold ${color}`}>{overallScore}</span>
      </div>
      <p className="text-sm text-slate-500 mt-2 italic">"{transcript}"</p>
      <div className="mt-5 flex flex-wrap">
        {words?.map((w, i) => <WordHighlight key={i} word={w} />)}
      </div>
      <p className="text-sm text-slate-600 mt-5 bg-slate-50 rounded-lg p-4">{summary}</p>
      <button onClick={reset} className="mt-6 w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-xl transition">
        Try another recording
      </button>
    </div>
  );
}
