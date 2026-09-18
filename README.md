# 🎯 BarRaiser.ai — Amazon Bar Raiser Mock Interview Copilot

> **Hackathon:** Bharat Builds #1: First Commit (WeMakeDevs x AWS)  
> **Track:** Track 2: Deployed, With a URL (`SHIP IT`)  
> **Team:** 2-Person 48-Hour Sprint (Frontend Lead & AWS Cloud Lead)

---

## 📌 Problem & Motivation

Engineering candidates often solve hundreds of LeetCode problems yet struggle in Tier-1 technical and behavioral rounds (especially Amazon Bar Raisers) because:
1. **No Live Edge-Case Interrogation:** Real interviewers challenge concurrency, time-to-live expiration, and scale limits.
2. **The Amazon Leadership Principle (LP) Trap:** Candidates provide vague behavioral stories without quantifiable metrics (%, ms, revenue, throughput) or clear personal agency.
3. **Information Overload:** Candidates are overwhelmed by generic job descriptions and don't know which 3 competencies to prioritize before an interview.

**`BarRaiser.ai`** bridges this gap: paste any target role and job description to simulate an authentic Amazon Bar Raiser interview round with split-screen coding, structured STAR behavioral inputs, and a calibrated hiring debrief dossier.

---

## 🏗️ Architecture & AWS Services

```text
┌──────────────────────────────────────────────────────────────┐
│                    AWS Amplify Hosting                       │
│      (Next.js 15 + React 19 + Tailwind CSS + Monaco Editor)   │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTPS (REST Calls)
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  Amazon API Gateway                          │
│             (/api/session  |  /api/evaluate)                 │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                      AWS Lambda                              │
│                    (Node.js 20.x)                            │
└──────────────────────────────┬───────────────────────────────┘
                               │
             ┌─────────────────┴─────────────────┐
             ▼                                   ▼
┌─────────────────────────┐             ┌─────────────────────────┐
│     Amazon Bedrock      │             │     Amazon DynamoDB     │
│  (Amazon Nova Lite)     │             │   (Single-Table Store:  │
│  • Sub-2s Latency       │             │    BarRaiserSessions)   │
│  • $0.06 / 1M tokens    │             │                         │
└─────────────────────────┘             └─────────────────────────┘
```

* **Frontend:** AWS Amplify Hosting running Next.js 15 (App Router, Turbopack, Tailwind CSS v4, `@monaco-editor/react`, Geist font).
* **AI Model:** Amazon Bedrock (Nova Lite) enforcing strict JSON schemas for problem generation and AST/STAR complexity auditing.
* **Compute:** AWS Lambda serverless REST endpoints (`/api/session` and `/api/evaluate`).
* **Database:** Amazon DynamoDB (`BarRaiserSessions` table with `sessionId` partition key).

---

## ⚡ Key Features

* **Tailored Problem Synthesis:** Analyzes role keywords and generates 1 targeted coding challenge + 1 Leadership Principle prompt.
* **In-Browser Monaco Code Editor:** Multi-language support (Java 21, Python 3.12, C++ 20, TypeScript) with line numbers, code reset, and copy.
* **Structured STAR Auditor:** Distinct Situation, Task, Action, and Result inputs with real-time regex auditing for quantifiable metrics (%, ms, RPS, $, SLAs).
* **Official Hiring Debrief Dossier:** High-density hiring report with verdict badges (`Strong Hire`, `Hire`, `Lean Hire`, `No Hire`), algorithmic complexity breakdown, Amazon LP scorecard, and P0/P1/P2 prioritized engineering fixes.
* **Session History & Offline Mock Mode:** Includes local storage sync and full offline simulation mode so developers can test without waiting for cloud deployment.
* **Print-to-PDF Ready:** Clean `@media print` stylesheet transforms the dossier into an authentic 2-page formal corporate debrief packet.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 20.x or higher
* npm 10.x or higher

### Installation

```bash
git clone https://github.com/Son7c/Barraiser.ai.git
cd Barraiser.ai
npm install
```

### Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

By default, `NEXT_PUBLIC_USE_MOCKS=true` is enabled for zero-latency local development. When connecting to live AWS infrastructure, set:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-id.execute-api.region.amazonaws.com/prod
NEXT_PUBLIC_USE_MOCKS=false
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Repository Structure

```text
├── app/
│   ├── globals.css                       # Minimal dark design system & print styles
│   ├── layout.tsx                        # Root layout with Geist font bindings
│   ├── page.tsx                          # Screen 1: Role & JD intake form
│   ├── interview/[sessionId]/page.tsx    # Screen 2: Split-screen mock room
│   └── dossier/[sessionId]/page.tsx      # Screen 3: Bar Raiser hiring dossier
├── components/
│   ├── Navbar.tsx                        # High-density header with session indicator
│   ├── HistoryDrawer.tsx                 # Slide-over past session manager
│   ├── ScreenIntake.tsx                  # Interactive role templates & JD input
│   ├── CodeEditor.tsx                    # Monaco Editor wrapper (Java, Python, C++, TS)
│   ├── StarResponseForm.tsx              # STAR response textareas with metric auditor
│   ├── DossierVerdictBadge.tsx           # Calibrated Amazon verdict badge
│   ├── LeadershipScorecard.tsx           # LP progress bars & competency ratings
│   └── ActionableFixesList.tsx           # Prioritized P0/P1/P2 recommendations
├── docs/
│   ├── FRONTEND_BLUEPRINT.md             # Frontend UI blueprint & specifications
│   ├── PROJECT_BLUEPRINT.md              # Master AWS & serverless architecture
│   └── techstack.md                      # End-to-end tech stack breakdown
├── lib/
│   ├── api.ts                            # Fetch client with toggleable mock fallback
│   ├── mockData.ts                       # Calibrated Amazon SDE-1 mock payloads
│   ├── storage.ts                        # Local storage synchronization engine
│   └── types.ts                          # Strict TypeScript schemas
└── package.json
```

---

## 👥 Authors

* **Souvik (Frontend & UX Lead)** — Next.js 15 UI, Monaco Editor, STAR Form, Dossier & Design System.
* **Cloud & AI Lead** — AWS Bedrock (Nova Lite), DynamoDB, AWS Lambda, API Gateway & Amplify CI/CD.
