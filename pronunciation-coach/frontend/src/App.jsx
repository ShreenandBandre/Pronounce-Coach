import Header from "./components/Header";
import ConsentGate from "./components/ConsentGate";
import UploadDropzone from "./components/UploadDropzone";
import ScoreCard from "./components/ScoreCard";
import Loader from "./components/Loader";
import { useSessionStore } from "./store/useSessionStore";
 
export default function App() {
  const { consentGiven, status, error } = useSessionStore();
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-slate-50 pb-20">
      <Header />
      {!consentGiven && <ConsentGate />}
      {consentGiven && status === "idle" && <UploadDropzone />}
      {consentGiven && (status === "uploading" || status === "scoring") && (
        <Loader label={status === "uploading" ? "Uploading audio..." : "Analyzing pronunciation..."} />
      )}
      {consentGiven && status === "done" && <ScoreCard />}
      {consentGiven && status === "error" && (
        <div className="max-w-xl mx-auto mt-10 text-center text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}
