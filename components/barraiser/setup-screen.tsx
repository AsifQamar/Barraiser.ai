"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, History, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createSession } from "@/lib/api";
import { Badge, Kbd, Wordmark } from "./ui";
import { HistoryDrawer } from "./history-drawer";

const ROLE_PRESETS = [
  {
    id: "amazon-sde1",
    title: "Amazon SDE-1",
    level: "L4 · SDE-1",
    focus: "AWS Messaging & Streaming · Distributed Systems, DynamoDB",
    role: "Amazon SDE-1 (AWS Messaging & Streaming)",
    jd: "Looking for an SDE-1 proficient in Java, Distributed Systems, Multi-threading, and DynamoDB. You will design fault-tolerant pub/sub pipelines, build sub-millisecond LRU caching layers, and optimize webhook processing during 10x traffic spikes. Candidates must demonstrate Amazon Leadership Principles (Customer Obsession, Bias for Action, Dive Deep).",
  },
  {
    id: "phonepe-backend",
    title: "PhonePe Backend SDE",
    level: "L2 · Mid",
    focus: "Transactions Platform · Idempotent ledgers, Redis, high concurrency",
    role: "PhonePe Backend SDE (Transactions Platform)",
    jd: "We are seeking a backend engineer experienced in Golang/Java, PostgreSQL, Redis, and high-concurrency payment ledger reconciliation. You will build idempotent transaction handling mechanisms, solve double-spend race conditions, and uphold 99.999% payment success SLAs under real-time network drops.",
  },
  {
    id: "cred-platform",
    title: "CRED Platform Engineer",
    level: "L5 · Senior",
    focus: "Edge & Resiliency · Distributed rate limiting, Token Bucket, Kafka",
    role: "CRED Platform Engineer (Edge & Resiliency)",
    jd: "Seeking a Platform SDE with deep knowledge of distributed rate limiting, token buckets, and event streaming via Apache Kafka. You will safeguard member-facing microservices from cascading failures, build circuit breakers, and uphold zero-downtime deployments under extreme flash-sale bursts.",
  },
];

const JD_TARGET = 400;

const LOADING_MESSAGES = [
  "Analyzing role specifications & stack requirements...",
  "Synthesizing algorithmic problem via Amazon Nova Lite...",
  "Calibrating Amazon Leadership Principle scenario...",
  "Provisioning session record in DynamoDB...",
];

export function SetupScreen() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [preset, setPreset] = useState<string | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const canStart = role.trim().length > 2 && jd.trim().length >= 40 && !loading;

  function selectPreset(p: typeof ROLE_PRESETS[0]) {
    setPreset(p.id);
    setRole(p.role);
    setJd(p.jd);
    setError(null);
  }

  const handleStart = React.useCallback(async () => {
    if (!canStart) {
      if (jd.trim().length < 40) {
        setError("Please provide at least 40 characters in the job description.");
      }
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const session = await createSession(role, jd);
      clearInterval(stepInterval);
      router.push(`/interview/${session.sessionId}`);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setLoading(false);
      const errMsg = err instanceof Error ? err.message : "Failed to initialize Bar Raiser session. Please try again.";
      setError(errMsg);
    }
  }, [canStart, jd, role, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !loading) {
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleStart, loading]);

  const jdPct = Math.min(100, Math.round((jd.length / JD_TARGET) * 100));

  return (
    <div className="relative min-h-dvh flex flex-col bg-background text-foreground">
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 grid-lines [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 border-b border-border/50 backdrop-blur-sm">
        <Wordmark />
        <div className="hidden items-center gap-2 sm:flex">
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setHistoryOpen(true)}
          className="gap-1.5"
        >
          <History className="size-3.5" />
          <span className="hidden sm:inline">History</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-28 pt-8 sm:px-8 sm:pt-14 flex-1">
        <div className="animate-fade-in">
          <Badge tone="primary" className="mb-4">
            <Sparkles className="size-3" />
            Interview Setup
          </Badge>
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-[28px] text-foreground">
            Configure your mock interview
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Tell BarRaiser the role you&apos;re targeting. We&apos;ll synthesize a calibrated technical challenge and a
            leadership scenario, then evaluate you against authentic bar raiser standards.
          </p>
        </div>

        <div className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Left column — primary inputs */}
          <div className="space-y-8">
            <Field label="Target role & level" hint="Required">
              <input
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setPreset(null);
                }}
                placeholder="e.g. Amazon SDE-1 (AWS Messaging & Streaming)"
                className={cn(
                  "h-11 w-full rounded-[11px] border border-input bg-surface px-3.5 text-sm outline-none transition-colors",
                  "placeholder:text-muted-foreground/60 hover:border-border-strong text-foreground",
                  "focus-visible:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-ring/40"
                )}
              />
            </Field>

            <Field label="Job description" hint="Min 40 chars · tunes algorithmic & LP focus">
              <div
                className={cn(
                  "group rounded-[14px] border border-input bg-surface transition-colors",
                  "focus-within:border-primary/60 focus-within:ring-[3px] focus-within:ring-ring/40 hover:border-border-strong"
                )}
              >
                <textarea
                  value={jd}
                  onChange={(e) => {
                    setJd(e.target.value);
                    setError(null);
                  }}
                  placeholder="Paste the target job description or requirements here. We extract key competencies to tune problem difficulty, edge cases, and leadership principles."
                  rows={7}
                  className="w-full resize-none bg-transparent px-4 py-3.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50 text-foreground"
                />
                <div className="flex items-center justify-between border-t border-border/70 px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border-strong">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          jd.length >= 40 ? "bg-primary" : "bg-warning"
                        )}
                        style={{ width: `${jdPct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      {jd.length}/{JD_TARGET}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {jd.length === 0
                      ? "No description yet"
                      : jd.length < 40
                      ? "Minimum 40 characters required"
                      : jd.length < 150
                      ? "Good signal detected"
                      : "High-density calibration"}
                  </span>
                </div>
              </div>
            </Field>

            {error && (
              <div className="rounded-xl border border-critical/30 bg-critical/10 p-3.5 text-xs text-critical animate-fade-in">
                {error}
              </div>
            )}
          </div>

          {/* Right column — role presets */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-foreground">Role presets</span>
              <span className="text-[11px] text-muted-foreground">1-click calibration</span>
            </div>
            <div className="space-y-2">
              {ROLE_PRESETS.map((p) => {
                const active = preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPreset(p)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-150 cursor-pointer",
                      active
                        ? "border-primary/40 bg-primary-soft"
                        : "border-border bg-surface hover:border-border-strong hover:bg-surface-2"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1 size-2 shrink-0 rounded-full transition-colors",
                        active ? "bg-primary" : "bg-border-strong group-hover:bg-muted-foreground"
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className={cn("truncate text-[13px] font-medium", active ? "text-foreground font-semibold" : "text-foreground/90")}>
                          {p.title}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{p.level}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-muted-foreground">{p.focus}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <p className="hidden items-center gap-2 text-[12px] text-muted-foreground sm:flex">
            Press <Kbd>Ctrl / ⌘</Kbd> <Kbd>↵</Kbd> to start
          </p>
          <div className="flex flex-1 items-center justify-end gap-3">
            <span className="text-[12px] text-muted-foreground">
              {loading
                ? LOADING_MESSAGES[loadingStep]
                : canStart
                ? "Ready to generate"
                : "Enter role & 40+ chars JD"}
            </span>
            <Button
              size="lg"
              disabled={!canStart}
              onClick={handleStart}
              className="h-10 gap-2 px-5"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Generating session…</span>
                </>
              ) : (
                <>
                  <span>Start Interview Session</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
        {loading && (
          <div className="h-0.5 w-full overflow-hidden bg-transparent">
            <div className="h-full w-1/4 animate-loading-bar rounded-full bg-primary" />
          </div>
        )}
      </div>

      {/* History Drawer */}
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onNew={() => {}}
      />
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-[13px] font-medium text-foreground">{label}</label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
