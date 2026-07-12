import { create } from "zustand";
 
export const useSessionStore = create((set) => ({
  status: "idle", // idle | uploading | scoring | done | error
  result: null,
  error: null,
  consentGiven: false,
  sessionId: crypto.randomUUID(),
 
  setConsent: (v) => set({ consentGiven: v }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result, status: "done" }),
  setError: (error) => set({ error, status: "error" }),
  reset: () => set({ status: "idle", result: null, error: null }),
}));
