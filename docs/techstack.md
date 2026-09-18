# 🛠️ BarRaiser.ai — End-to-End Tech Stack

> **Hackathon Series:** Bharat Builds #1: First Commit (WeMakeDevs x AWS)  
> **Track:** Track 2: Deployed, With a URL (`SHIP IT`)  
> **Architecture Principle:** Lean, reliable 48-hour working model (Zero Overengineering)

---

### AWS Architecture:

* **Compute & API:**  
  AWS Lambda and API Gateway.  
  * Lightweight serverless REST endpoints (`POST /api/session` and `POST /api/evaluate`) handling request routing, Bedrock prompt orchestration, and DynamoDB persistence without managing servers or connection timeouts.

* **AI:**  
  Amazon Bedrock for foundation models to generate the study content and interview evaluation.  
  * Powered by native **Amazon Nova Lite**: Generates tailored technical coding challenges, formulates Amazon Leadership Principle (LP) scenarios, probes candidate submissions with targeted Bar Raiser follow-ups, and produces the final Hire/No-Hire debrief dossier at sub-2s latency and ultra-low cost ($0.06/M tokens).

* **Database:**  
  DynamoDB to track application and interview session statuses.  
  * Fully managed NoSQL key-value store to save candidate interview sessions, target roles, submitted code, STAR behavioral answers, and calibrated Bar Raiser scorecards with sub-millisecond read/write latency.

* **Frontend:**  
  Amplify Hosting.  
  * Next.js 15 application hosting connected directly to GitHub for automated CI/CD builds, custom SSL domain handling, and global Edge CDN distribution to provide the live public URL on Day 1.

---

### Client & Application Layer:

* **Framework:** Next.js 15 (App Router), React 19, TypeScript
* **Styling & UI:** Tailwind CSS (Dark Mode), Lucide Icons, clean split-view code textarea & STAR input cards
* **AWS SDKs:** `@aws-sdk/client-bedrock-runtime`, `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`

---

### ⏱️ 48-Hour Team-of-Two Build Scope:

```text
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│       Frontend (Person 1)            │     │       Backend & AI (Person 2)        │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│ • Amplify Hosting setup              │     │ • DynamoDB table setup               │
│ • Screen 1: Role & JD Input Form     │     │ • AWS Lambda handlers in Node/Python │
│ • Screen 2: Mock Interview UI        │     │ • Amazon Bedrock Nova Lite SDK calls │
│ • Screen 3: Bar Raiser Dossier Card  │     │ • API Gateway REST endpoints         │
└──────────────────────────────────────┘     └──────────────────────────────────────┘
```
