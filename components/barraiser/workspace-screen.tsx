"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, GripVertical, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitEvaluation } from "@/lib/api";
import { SessionResponse, StarAnswer } from "@/lib/types";
import { Badge, StageStepper, Wordmark } from "./ui";
import { ChallengePanel, ChallengeTab } from "./challenge-panel";
import { CodeEditor, SupportedLanguage } from "./code-editor";
import { StarEditor } from "./star-editor";

const ANALYZING_STEPS = [
  "Compiling & running hidden test suite",
  "Analyzing time & space complexity AST",
  "Auditing edge-case coverage & TTL bounds",
  "Scoring leadership signal against Amazon principles",
  "Assembling Bar Raiser hiring dossier",
];

interface WorkspaceScreenProps {
  session: SessionResponse;
}

export function WorkspaceScreen({ session }: WorkspaceScreenProps) {
  const router = useRouter();
  const [tab, setTab] = useState<ChallengeTab>("technical");
  const [split, setSplit] = useState(46);
  const [code, setCode] = useState(session.codingChallenge.starterCode || "");
  const [language, setLanguage] = useState<SupportedLanguage>("java");
  const [starAnswer, setStarAnswer] = useState<StarAnswer>({
    situation: "",
    task: "",
    action: "",
    result: "",
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Stopwatch timer
  useEffect(() => {
    if (analyzing) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [analyzing]);

  // Resizer handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(65, Math.max(28, pct)));
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Submit flow
  const handleSubmit = useCallback(async () => {
    if (analyzing) return;

    if (!code.trim() || code === session.codingChallenge.starterCode) {
      const proceed = confirm(
        "You haven't written or modified any code. Do you still want to submit to the Bar Raiser?"
      );
      if (!proceed) return;
    }

    setAnalyzing(true);
    setError(null);
    setStep(0);

    const stepInterval = setInterval(() => {
      setStep((s) => (s < ANALYZING_STEPS.length - 1 ? s + 1 : s));
    }, 550);

    try {
      await submitEvaluation(
        session.sessionId,
        code,
        language,
        starAnswer,
        session.targetRole,
        session.codingChallenge.title
      );
      clearInterval(stepInterval);
      setStep(ANALYZING_STEPS.length);
      setTimeout(() => {
        router.push(`/dossier/${session.sessionId}`);
      }, 500);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setAnalyzing(false);
      const errMsg = err instanceof Error ? err.message : "Evaluation failed. Please try submitting again.";
      setError(errMsg);
    }
  }, [analyzing, code, language, router, session, starAnswer]);

  // Keyboard shortcut Ctrl/Cmd + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !analyzing) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, analyzing]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* Top Header */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-2.5 sm:px-5 bg-surface/50 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-3">
          <Wordmark className="hidden sm:flex" />
          <span className="hidden h-5 w-px bg-border sm:block" />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium leading-tight text-foreground">
              {session.targetRole}
            </div>
            <div className="text-[11px] leading-tight text-muted-foreground font-mono">
              Session ID: {session.sessionId}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <StageStepper current={1} />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5">
            <Clock className="size-3.5 text-muted-foreground" />
            <span className="font-mono text-[12px] tabular-nums text-foreground">
              {mm}:{ss}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
        </div>
      </header>

      {/* Split Panes Workspace */}
      <div ref={containerRef} className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left Column: Challenge Panel */}
        <section
          className="min-h-0 border-b border-border lg:border-b-0 lg:border-r"
          style={{ flexBasis: `${split}%` }}
        >
          <ChallengePanel
            tab={tab}
            onTabChange={setTab}
            challenge={session.codingChallenge}
            leadership={session.leadershipPrinciple}
          />
        </section>

        {/* Draggable Resizer (Desktop) */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="group hidden w-1.5 shrink-0 cursor-col-resize items-center justify-center bg-transparent transition-colors hover:bg-primary/10 lg:flex"
          role="separator"
          aria-orientation="vertical"
        >
          <span className="flex h-8 w-1.5 items-center justify-center rounded-full bg-border-strong transition-colors group-hover:bg-primary">
            <GripVertical className="size-3 text-background opacity-0 group-hover:opacity-100" />
          </span>
        </div>

        {/* Right Column: Code Editor OR STAR Form */}
        <section className="flex min-h-0 flex-1 flex-col">
          {tab === "technical" ? (
            <CodeEditor
              initialCode={session.codingChallenge.starterCode}
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
            />
          ) : (
            <StarEditor value={starAnswer} onChange={setStarAnswer} />
          )}
        </section>
      </div>

      {/* Action Bar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-background px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Badge tone={tab === "technical" ? "warning" : "info"}>
            {tab === "technical" ? "Solving" : "Answering"}
          </Badge>
          <span className="hidden sm:inline">
            {error ? (
              <span className="text-critical font-medium">{error}</span>
            ) : tab === "technical" ? (
              "Switch to the Leadership tab before submitting for a complete evaluation."
            ) : (
              "Both technical and leadership responses feed your calibrated dossier."
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline font-mono text-[11px] text-muted-foreground">
            Press Ctrl / ⌘ + ↵
          </span>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={analyzing}
            className="h-10 gap-2 px-5"
          >
            {analyzing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Evaluating…</span>
              </>
            ) : (
              <>
                <span>Submit for Evaluation</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analyzing Overlay */}
      {analyzing && <AnalyzingOverlay step={step} />}
    </div>
  );
}

function AnalyzingOverlay({ step }: { step: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft">
            <Loader2 className="size-4 animate-spin text-primary" />
          </span>
          <div>
            <div className="text-[14px] font-semibold tracking-tight text-foreground">
              Evaluating your session
            </div>
            <div className="text-[12px] text-muted-foreground">
              Calibrating against the Amazon Bar Raiser rubric
            </div>
          </div>
        </div>
        <ul className="space-y-2.5">
          {ANALYZING_STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors",
                    done && "border-success/30 bg-success/15 text-success",
                    active && "border-primary/40 bg-primary-soft text-primary",
                    !done && !active && "border-border text-muted-foreground/50"
                  )}
                >
                  {done ? "✓" : active ? <Loader2 className="size-3 animate-spin" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-[12.5px] transition-colors",
                    done
                      ? "text-muted-foreground line-through decoration-border"
                      : active
                      ? "text-foreground font-medium"
                      : "text-muted-foreground/60"
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
