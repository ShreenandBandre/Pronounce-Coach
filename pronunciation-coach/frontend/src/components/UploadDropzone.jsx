import { useRef, useState } from "react";
import { getAudioDuration } from "../lib/audio";
import { scoreAudio } from "../lib/api";
import { useSessionStore } from "../store/useSessionStore";
 
console.log("scoreAudio loaded:", scoreAudio);

export default function UploadDropzone() {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [reference, setReference] = useState("");
  const [saveHistory, setSaveHistory] = useState(false);
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState(null);
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const { sessionId, setStatus, setResult, setError } = useSessionStore();
 
  // --- Recording Logic ---
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const file = new File([blob], "recording.webm", { type: "audio/webm" });
      handleFile(file);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    setIsRecording(false);
  };

  // --- Handling Logic ---
  async function handleFile(file) {
    setError(null);
    try {
      const dur = await getAudioDuration(file);
      setDuration(dur);
      if (dur < 30 || dur > 45) {
        setError(`Audio must be 30-45s (got ${dur.toFixed(1)}s)`);
        setStatus("error");
        return;
      }
      setStatus("scoring");
      const result = await scoreAudio({ file, reference, sessionId, saveHistory, language });
      setResult(result);
    } catch (err) { setError(err.message); }
  }
 
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Upload or Record</h2>
      
      {/* Recording Controls */}
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-full py-3 mb-6 rounded-xl font-medium transition ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-brand-100 text-brand-700 hover:bg-brand-200"}`}>
        {isRecording ? "Stop & Score Recording" : "Start Live Recording"}
      </button>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current.click()}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition ${dragOver ? "border-brand-500 bg-brand-50" : "border-slate-300"}`}>
        <p className="text-slate-500 text-sm">Drag & drop audio here, or click to browse</p>
        <p className="text-xs text-slate-400 mt-1">WAV, MP3, M4A, WEBM · 30-45 seconds</p>
        <input ref={inputRef} type="file" accept="audio/*" className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
      </div>

      {duration && <p className="text-xs text-slate-400 mt-2">Detected duration: {duration.toFixed(1)}s</p>}
      
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        className="mt-4 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="English">English</option>
        <option value="Hindi">Hindi (हिंदी)</option>
        <option value="Marathi">Marathi (मराठी)</option>
      </select>

      <input type="text" placeholder="Optional: reference sentence you were reading" value={reference}
        onChange={(e) => setReference(e.target.value)}
        className="mt-4 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
      
      <label className="flex items-center gap-2 mt-3 text-sm text-slate-600">
        <input type="checkbox" checked={saveHistory} onChange={(e) => setSaveHistory(e.target.checked)} />
        Save this attempt to my history
      </label>
    </div>
  );
}