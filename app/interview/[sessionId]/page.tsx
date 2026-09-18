"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSessionFromLocal } from "@/lib/storage";
import { submitEvaluation } from "@/lib/api";
import { SessionResponse, StarAnswer } from "@/lib/types";
import { mockSessionResponse } from "@/lib/mockData";
import CodeEditor from "@/components/CodeEditor";
import StarResponseForm from "@/components/StarResponseForm";
import { ChevronLeft, Loader2, ArrowRight, Clock, Copy, Check } from "lucide-react";

export default function InterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = typeof params.sessionId === "string" ? params.sessionId : "default";

  const [session, setSession] = useState<SessionResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"problem" | "lp">("problem");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [starAnswer, setStarAnswer] = useState<StarAnswer>({
    situation: "",
    task: "",
    action: "",
    result: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copiedProblem, setCopiedProblem] = useState(false);

  // Stopwatch timer for authentic mock session pressure
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const evaluationSteps = [
    "Analyzing code AST & complexity...",
    "Verifying edge case resilience via Nova Lite...",
    "Auditing STAR metrics against Amazon Bar Raiser rubric...",
    "Synthesizing debrief hiring dossier...",
  ];

  useEffect(() => {
    const loaded = getSessionFromLocal(sessionId);
    if (loaded) {
      setSession(loaded);
      setCode(loaded.codingChallenge.starterCode);
    } else {
      setSession({
        ...mockSessionResponse,
        sessionId,
      });
      setCode(mockSessionResponse.codingChallenge.starterCode);
    }
  }, [sessionId]);

  const handleSubmit = async () => {
    if (!session || isSubmitting) return;

    if (!code.trim() || code === session.codingChallenge.starterCode) {
      const proceed = confirm(
        "You haven't written or modified any code. Do you still want to submit to the Bar Raiser?"
      );
      if (!proceed) return;
    }

    setIsSubmitting(true);
    setError(null);
    setEvalProgress(0);

    const stepInterval = setInterval(() => {
      setEvalProgress((prev) => (prev < evaluationSteps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      await submitEvaluation(
        sessionId,
        code,
        language,
        starAnswer,
        session.targetRole,
        session.codingChallenge.title
      );
      clearInterval(stepInterval);
      router.push(`/dossier/${sessionId}`);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsSubmitting(false);
      setError(err.message || "Evaluation failed. Please try submitting again.");
    }
  };

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isSubmitting) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [session, code, language, starAnswer, isSubmitting]);

  const handleCopyProblem = () => {
    if (!session) return;
    const text = `${session.codingChallenge.title}\n\n${session.codingChallenge.description}`;
    navigator.clipboard.writeText(text);
    setCopiedProblem(true);
    setTimeout(() => setCopiedProblem(false), 2000);
  };

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Loading interview environment...</span>
        </div>
      </div>
    );
  }

  const { codingChallenge, leadershipPrinciple } = session;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-3rem)] overflow-hidden bg-[#090b10]">
      {/* Subheader */}
      <div className="flex h-10 items-center justify-between border-b border-[#182030] bg-[#0c1017] px-6 text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Setup</span>
          </Link>
          <span className="text-[#202b3e]">/</span>
          <span className="font-medium text-slate-200 truncate max-w-sm">
            {session.targetRole}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="h-3 w-3 text-slate-500" />
            <span>Elapsed: {formatTimer(secondsElapsed)}</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="hidden sm:inline text-slate-500">ID: {sessionId}</span>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 p-3.5 overflow-hidden">
        {/* Left Column (5 cols): Problem & Behavioral Prompts */}
        <div className="lg:col-span-5 flex flex-col border border-[#1d273b] bg-[#0c1017] rounded-md overflow-hidden">
          {/* Tab Bar */}
          <div className="flex items-center justify-between border-b border-[#1d273b] bg-[#0f141e] px-1 text-xs">
            <div className="flex">
              <button
                type="button"
                onClick={() => setActiveTab("problem")}
                className={`py-2 px-3 font-medium transition-colors cursor-pointer ${
                  activeTab === "problem"
                    ? "border-b-2 border-amber-500 text-white bg-[#0c1017]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                1. Technical Challenge
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("lp")}
                className={`py-2 px-3 font-medium transition-colors cursor-pointer ${
                  activeTab === "lp"
                    ? "border-b-2 border-amber-500 text-white bg-[#0c1017]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                2. Leadership Principle
              </button>
            </div>

            {activeTab === "problem" && (
              <button
                type="button"
                onClick={handleCopyProblem}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded transition-colors cursor-pointer"
                title="Copy problem"
              >
                {copiedProblem ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 text-xs text-slate-300 space-y-4 leading-relaxed">
            {activeTab === "problem" ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-[#182030] pb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      {codingChallenge.title}
                    </h2>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Algorithmic Assessment
                    </span>
                  </div>
                  <span className="rounded border border-amber-800/60 bg-amber-950/40 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                    {codingChallenge.difficulty}
                  </span>
                </div>

                <div className="whitespace-pre-wrap space-y-2.5 text-xs text-slate-300">
                  {codingChallenge.description}
                </div>

                {codingChallenge.examples && codingChallenge.examples.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">
                      Examples
                    </span>
                    {codingChallenge.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="rounded border border-[#1b2436] bg-[#090d14] p-3 font-mono text-[11px] space-y-1"
                      >
                        <div className="text-slate-400">
                          <span className="text-amber-400 font-semibold">Input:</span> {ex.input}
                        </div>
                        <div className="text-slate-400">
                          <span className="text-emerald-400 font-semibold">Output:</span> {ex.output}
                        </div>
                        {ex.explanation && (
                          <div className="text-slate-400 font-sans pt-1 text-[11px] border-t border-[#182030]">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {codingChallenge.constraints && codingChallenge.constraints.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">
                      Constraints
                    </span>
                    <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-400">
                      {codingChallenge.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-[#182030] pb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Target Competency
                  </span>
                  <h2 className="text-sm font-semibold text-white mt-0.5">
                    {leadershipPrinciple.principle}
                  </h2>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Interview Scenario Question
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium bg-[#090d14] p-3.5 rounded border border-[#1b2436]">
                    "{leadershipPrinciple.question}"
                  </p>
                </div>

                <div className="space-y-2 text-slate-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                    Amazon Evaluation Criteria
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside text-xs">
                    <li>
                      <strong className="text-slate-200">Quantifiable Metrics:</strong> Specific percentages, latencies, or revenue metrics.
                    </li>
                    <li>
                      <strong className="text-slate-200">Personal Ownership:</strong> What you personally led vs what the team did.
                    </li>
                    <li>
                      <strong className="text-slate-200">Architecture Trade-offs:</strong> Technical justification for chosen decisions under pressure.
                    </li>
                  </ul>
                  {leadershipPrinciple.tip && (
                    <p className="pt-2 text-amber-400/90 text-[11px] italic border-t border-[#182030]">
                      Bar Raiser note: {leadershipPrinciple.tip}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Monaco Editor + STAR Form */}
        <div className="lg:col-span-7 flex flex-col gap-3.5 overflow-hidden">
          {/* Top (55%): Code Editor */}
          <div className="h-[54%] min-h-[220px]">
            <CodeEditor
              initialCode={code}
              onChange={(newVal) => setCode(newVal)}
              language={language}
              onLanguageChange={(newLang) => setLanguage(newLang)}
            />
          </div>

          {/* Bottom (46%): STAR Form */}
          <div className="flex-1 min-h-[200px] overflow-hidden">
            <StarResponseForm
              value={starAnswer}
              onChange={(updated) => setStarAnswer(updated)}
              lpQuestion={leadershipPrinciple.question}
              lpPrinciple={leadershipPrinciple.principle}
            />
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="h-12 border-t border-[#182030] bg-[#0c1017] px-6 flex items-center justify-between text-xs">
        <div className="text-slate-400 text-xs">
          {error ? (
            <span className="text-rose-400">{error}</span>
          ) : (
            <span className="hidden sm:inline">
              Submission triggers dual AST code review & STAR metric analysis.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[11px] text-slate-400 font-mono">
            <kbd className="rounded border border-[#242f44] bg-[#111724] px-1 py-0.5 text-slate-300">Ctrl</kbd> + <kbd className="rounded border border-[#242f44] bg-[#111724] px-1 py-0.5 text-slate-300">Enter</kbd>
          </span>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-md bg-amber-500 px-4 py-1.5 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{evaluationSteps[evalProgress]}</span>
              </>
            ) : (
              <>
                <span>Submit to Bar Raiser</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
