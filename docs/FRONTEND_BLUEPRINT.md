# 🎨 BarRaiser.ai — Frontend Engineering Blueprint & Component Architecture

> **Owner:** Souvik (Frontend & UX Lead)  
> **Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, `@monaco-editor/react`, Lucide Icons  
> **Design Language:** Modern Dark Glassmorphism, Zero Fluff, High-Signal Amazon Bar Raiser Aesthetic  
> **Master Blueprint Reference:** [`Bharat_Builds/First commit/PROJECT_BLUEPRINT.md`](file:///C:/Souvik/Obsidian/Bharat_Builds/First%20commit/PROJECT_BLUEPRINT.md)

---

## 📁 1. Next.js 15 Directory Structure

```text
barraiser-web/
├── app/
│   ├── globals.css              # Dark mode Tailwind palette, custom scrollbars, glass borders
│   ├── layout.tsx               # Root layout: Navbar, Ambient blur glows, Past History Drawer
│   ├── page.tsx                 # Screen 1: Intake & Job Description Form
│   ├── interview/
│   │   └── [sessionId]/
│   │       └── page.tsx         # Screen 2: Split-Screen Mock Interview (Problem + Monaco + STAR)
│   └── dossier/
│       └── [sessionId]/
│           └── page.tsx         # Screen 3: Official Bar Raiser Hiring Dossier & LP Matrix
├── components/
│   ├── Navbar.tsx               # Header with AWS Bedrock badge & Past Sessions trigger
│   ├── HistoryDrawer.tsx        # Slide-over drawer listing past interview dossiers from LocalStorage/DynamoDB
│   ├── ScreenIntake.tsx         # Role input, JD textarea with quick-fill presets & validation
│   ├── CodeEditor.tsx           # Monaco Editor wrapper with language picker & theme config
│   ├── StarResponseForm.tsx     # Structured STAR (Situation, Task, Action, Result) textareas
│   ├── DossierVerdictBadge.tsx  # Calibrated [ Strong Hire | Hire | Lean Hire | No Hire ] pill
│   ├── LeadershipScorecard.tsx  # Progress bars & feedback for Amazon Leadership Principles
│   └── ActionableFixesList.tsx  # Priority cards for the 3 targeted engineering fixes
├── lib/
│   ├── api.ts                   # Fetch client with toggleable mock fallback
│   ├── mockData.ts              # Amazon SDE-1 calibrated test payloads for offline dev
│   └── types.ts                 # Full TypeScript schemas strictly mirroring backend contracts
└── .env.local                   # NEXT_PUBLIC_API_BASE_URL & NEXT_PUBLIC_USE_MOCKS=true
```

---

## 📐 2. Core TypeScript Schemas (`lib/types.ts`)

```typescript
export type VerdictType = "Strong Hire" | "Hire" | "Lean Hire" | "No Hire";

export interface CodingChallenge {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  starterCode: string;
}

export interface LeadershipPrinciple {
  principle: string;
  question: string;
}

export interface StarAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface SessionResponse {
  sessionId: string;
  codingChallenge: CodingChallenge;
  leadershipPrinciple: LeadershipPrinciple;
}

export interface LeadershipScore {
  principle: string;
  score: number; // 1 to 5
  feedback: string;
}

export interface DossierResponse {
  sessionId: string;
  verdict: VerdictType;
  summary: string;
  technicalEvaluation: {
    timeComplexity: string;
    spaceComplexity: string;
    edgeCasesIdentified: string;
  };
  leadershipScorecard: LeadershipScore[];
  actionableFixes: string[];
}
```

---

## ⚡ 3. Screen-by-Screen Implementation Specs

### 🔹 Screen 1: Role & JD Intake Form (`app/page.tsx`)
- **Visuals:** Dark card (`bg-slate-900/60 border border-slate-800 backdrop-blur-md`), glowing purple/cyan accents.
- **Inputs:**
  - `Target Role`: Text input (with quick chips: "Amazon SDE-1", "PhonePe Backend", "CRED Platform").
  - `Job Description`: Auto-expanding textarea with min 50 characters validation.
- **Button:** "Generate Mock Interview" with loading spinner and text: *"Synthesizing Amazon Bar Raiser questions via Amazon Nova Lite..."*.

### 🔹 Screen 2: Mock Interview Room (`app/interview/[sessionId]/page.tsx`)
- **Layout:** Split-view `grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-5rem)]`.
- **Left Column (Col 5): Problem & LP Scenario:**
  - Tab 1: **Technical Problem Statement** (Title, Difficulty badge, Markdown problem description, constraints, examples).
  - Tab 2: **Amazon Leadership Principle** (Principle tag, scenario question, prompt explaining how Bar Raisers evaluate data-driven results).
- **Right Column (Col 7): Workspace:**
  - Top Half (55% height): **Monaco Code Editor** (`@monaco-editor/react`, theme `vs-dark`, language selector: Java, Python, C++, TypeScript).
  - Bottom Half (45% height): **Structured STAR Textareas**:
    - 4 distinct collapsible blocks: **S** (Situation), **T** (Task), **A** (Action — emphasis on personal contribution), **R** (Result — metrics reminder: %, ms, revenue).
- **Footer Action Bar:** "Submit to Bar Raiser" primary button trigger.

### 🔹 Screen 3: Bar Raiser Dossier (`app/dossier/[sessionId]/page.tsx`)
- **Verdict Banner:**
  - `Strong Hire`: Emerald badge (`bg-emerald-500/10 text-emerald-400 border-emerald-500/30`).
  - `Hire`: Blue badge (`bg-blue-500/10 text-blue-400 border-blue-500/30`).
  - `Lean Hire`: Amber badge (`bg-amber-500/10 text-amber-400 border-amber-500/30`).
  - `No Hire`: Rose badge (`bg-rose-500/10 text-rose-400 border-rose-500/30`).
- **Executive Summary:** High-density evaluation summary highlighting key strengths and liabilities.
- **Technical Breakdown Card:** Time Complexity & Space Complexity comparison vs optimal solution, edge-case audit.
- **LP Radar / Scorecard Bars:** Visual score bars (1-5) for each evaluated Amazon LP with specific critique.
- **Top 3 Actionable Fixes Drawer / Card:** Numbered cards with high-impact recommendations to implement before live interview.
- **Top Right Button:** "Past Interviews History" opening the persistent drawer.

---

## 🔌 4. API Client & Seamless Mock Fallback (`lib/api.ts`)

Allows 100% frontend velocity without waiting for the backend to be deployed:

```typescript
import { SessionResponse, DossierResponse, StarAnswer } from "./types";
import { mockSessionResponse, mockDossierResponse } from "./mockData";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export async function createSession(targetRole: string, jobDescription: string): Promise<SessionResponse> {
  if (USE_MOCKS || !API_BASE) {
    await new Promise((res) => setTimeout(res, 1200)); // Simulates Nova Lite latency
    return mockSessionResponse;
  }
  const res = await fetch(`${API_BASE}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetRole, jobDescription }),
  });
  if (!res.ok) throw new Error("Failed to initialize session");
  return res.json();
}

export async function submitEvaluation(
  sessionId: string,
  submittedCode: string,
  codeLanguage: string,
  starAnswer: StarAnswer
): Promise<DossierResponse> {
  if (USE_MOCKS || !API_BASE) {
    await new Promise((res) => setTimeout(res, 1800)); // Simulates evaluation latency
    return mockDossierResponse;
  }
  const res = await fetch(`${API_BASE}/api/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, submittedCode, codeLanguage, starAnswer }),
  });
  if (!res.ok) throw new Error("Failed to evaluate submission");
  return res.json();
}
```

---

*Documented in [`Bharat_Builds/First commit/FRONTEND_BLUEPRINT.md`](file:///C:/Souvik/Obsidian/Bharat_Builds/First%20commit/FRONTEND_BLUEPRINT.md) and tracked in [`Brain.md`](file:///C:/Souvik/Obsidian/Brain.md).*
