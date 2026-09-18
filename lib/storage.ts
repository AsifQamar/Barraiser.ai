import { DossierResponse, HistoryItem, SessionResponse } from "./types";
import { initialMockHistory, mockDossierResponse, mockSessionResponse } from "./mockData";

const SESSIONS_KEY = "barraiser_sessions";
const DOSSIERS_KEY = "barraiser_dossiers";
const HISTORY_KEY = "barraiser_history";

export function saveSessionToLocal(session: SessionResponse): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    const map: Record<string, SessionResponse> = raw ? JSON.parse(raw) : {};
    map[session.sessionId] = session;
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(map));
  } catch (err) {
    console.error("Failed to save session to localStorage", err);
  }
}

export function getSessionFromLocal(sessionId: string): SessionResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw) {
      const map: Record<string, SessionResponse> = JSON.parse(raw);
      if (map[sessionId]) return map[sessionId];
    }
    // Fallback to mock session if matches mock id
    if (sessionId === mockSessionResponse.sessionId || sessionId === "demo") {
      return mockSessionResponse;
    }
  } catch (err) {
    console.error("Failed to get session from localStorage", err);
  }
  return null;
}

export function saveDossierToLocal(dossier: DossierResponse, targetRole: string, codingTitle: string): void {
  if (typeof window === "undefined") return;
  try {
    // Save full dossier
    const rawDossiers = localStorage.getItem(DOSSIERS_KEY);
    const dossiers: Record<string, DossierResponse> = rawDossiers ? JSON.parse(rawDossiers) : {};
    dossiers[dossier.sessionId] = dossier;
    localStorage.setItem(DOSSIERS_KEY, JSON.stringify(dossiers));

    // Update history list
    const rawHistory = localStorage.getItem(HISTORY_KEY);
    let history: HistoryItem[] = rawHistory ? JSON.parse(rawHistory) : [...initialMockHistory];

    // Filter out existing item if updated
    history = history.filter((item) => item.sessionId !== dossier.sessionId);

    const newItem: HistoryItem = {
      sessionId: dossier.sessionId,
      targetRole: targetRole || dossier.targetRole || "Software Development Engineer",
      createdAt: dossier.createdAt || new Date().toISOString(),
      verdict: dossier.verdict,
      summary: dossier.summary,
      codingTitle: codingTitle || "Technical Coding & LP Evaluation",
    };

    history.unshift(newItem);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error("Failed to save dossier to localStorage", err);
  }
}

export function getDossierFromLocal(sessionId: string): DossierResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DOSSIERS_KEY);
    if (raw) {
      const map: Record<string, DossierResponse> = JSON.parse(raw);
      if (map[sessionId]) return map[sessionId];
    }
    if (sessionId === mockDossierResponse.sessionId || sessionId === "demo") {
      return mockDossierResponse;
    }
  } catch (err) {
    console.error("Failed to get dossier from localStorage", err);
  }
  return null;
}

export function getHistoryFromLocal(): HistoryItem[] {
  if (typeof window === "undefined") return initialMockHistory;
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Seed initial mock history
    localStorage.setItem(HISTORY_KEY, JSON.stringify(initialMockHistory));
    return initialMockHistory;
  } catch (err) {
    console.error("Failed to read history from localStorage", err);
    return initialMockHistory;
  }
}
