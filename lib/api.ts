import { SessionResponse, DossierResponse, StarAnswer } from "./types";
import { mockSessionResponse, mockDossierResponse } from "./mockData";
import { saveSessionToLocal, saveDossierToLocal } from "./storage";

// 1. Updated to match your Amplify variable exactly
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
// 2. Hardcoded to false to permanently disable mock data in production
const USE_MOCKS = false;

export async function createSession(targetRole: string, jobDescription: string): Promise<SessionResponse> {
  if (USE_MOCKS || !API_BASE) {
    // Simulates Amazon Bedrock Nova Lite inference latency (~1200ms)
    await new Promise((res) => setTimeout(res, 1200));
    
    // Generate a fresh session ID for realistic flows
    const dynamicId = `sess_nova_${Math.random().toString(36).substring(2, 9)}`;
    const session: SessionResponse = {
      ...mockSessionResponse,
      sessionId: dynamicId,
      targetRole: targetRole || mockSessionResponse.targetRole,
      createdAt: new Date().toISOString(),
    };
    
    saveSessionToLocal(session);
    return session;
  }

  const res = await fetch(`${API_BASE}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetRole, jobDescription }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to initialize Bar Raiser session");
  }

  const session: SessionResponse = await res.json();
  saveSessionToLocal(session);
  return session;
}

export async function submitEvaluation(
  sessionId: string,
  submittedCode: string,
  codeLanguage: string,
  starAnswer: StarAnswer,
  targetRole: string = "Amazon SDE-1",
  codingTitle: string = "Technical Coding Problem"
): Promise<DossierResponse> {
  if (USE_MOCKS || !API_BASE) {
    // Simulates Bedrock evaluation & DynamoDB write latency (~1800ms)
    await new Promise((res) => setTimeout(res, 1800));

    // Determine verdict dynamically based on answer depth if using mocks
    let verdict = mockDossierResponse.verdict;
    const hasCode = submittedCode.trim().length > 40;
    const hasSTAR =
      starAnswer.situation.trim().length > 20 &&
      starAnswer.task.trim().length > 20 &&
      starAnswer.action.trim().length > 30 &&
      starAnswer.result.trim().length > 20;

    if (!hasCode || !hasSTAR) {
      verdict = "Lean Hire";
    }

    const dossier: DossierResponse = {
      ...mockDossierResponse,
      sessionId,
      targetRole,
      verdict,
      createdAt: new Date().toISOString(),
    };

    saveDossierToLocal(dossier, targetRole, codingTitle);
    return dossier;
  }

  const res = await fetch(`${API_BASE}/api/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, submittedCode, codeLanguage, starAnswer }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to evaluate mock interview submission");
  }

  const dossier: DossierResponse = await res.json();
  saveDossierToLocal(dossier, targetRole, codingTitle);
  return dossier;
}
