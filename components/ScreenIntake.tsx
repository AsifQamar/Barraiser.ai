"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/api";
import { ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

const ROLE_PRESETS = [
  {
    name: "Amazon SDE-1",
    tag: "AWS Messaging",
    role: "Amazon SDE-1 (AWS Messaging & Streaming)",
    jd: "Looking for an SDE-1 proficient in Java, Distributed Systems, Multi-threading, and DynamoDB. You will design fault-tolerant pub/sub pipelines, build sub-millisecond LRU caching layers, and optimize webhook processing during 10x traffic spikes. Candidates must demonstrate Amazon Leadership Principles (Customer Obsession, Bias for Action, Dive Deep).",
  },
  {
    name: "PhonePe Backend",
    tag: "Payments Core",
    role: "PhonePe Backend SDE (Transactions Platform)",
    jd: "We are seeking a backend engineer experienced in Golang/Java, PostgreSQL, Redis, and high-concurrency payment ledger reconciliation. You will build idempotent transaction handling mechanisms, solve double-spend race conditions, and uphold 99.999% payment success SLAs under real-time network drops.",
  },
  {
    name: "CRED Platform",
    tag: "Distributed Systems",
    role: "CRED Platform Engineer (Edge & Resiliency)",
    jd: "Seeking a Platform SDE with deep knowledge of distributed rate limiting, token buckets, and event streaming via Apache Kafka. You will safeguard member-facing microservices from cascading failures, build circuit breakers, and uphold zero-downtime deployments under extreme flash-sale bursts.",
  },
];

export default function ScreenIntake() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState(ROLE_PRESETS[0].role);
  const [jobDescription, setJobDescription] = useState(ROLE_PRESETS[0].jd);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    "Analyzing role specifications & stack requirements...",
    "Synthesizing algorithmic problem via Amazon Nova Lite...",
    "Calibrating Amazon Leadership Principle scenario...",
    "Provisioning session record in DynamoDB...",
  ];

  const handleSelectPreset = (preset: typeof ROLE_PRESETS[0]) => {
    setTargetRole(preset.role);
    setJobDescription(preset.jd);
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (jobDescription.trim().length < 40) {
      setError("Please provide at least 40 characters of job description.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const session = await createSession(targetRole, jobDescription);
      clearInterval(stepInterval);
      router.push(`/interview/${session.sessionId}`);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsLoading(false);
      setError(err.message || "Failed to initialize session. Please try again.");
    }
  };

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isLoading) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [targetRole, jobDescription, isLoading]);

  const charProgress = Math.min(100, Math.round((jobDescription.length / 40) * 100));

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Interview Setup
          </span>
          <span className="text-xs text-slate-400 font-mono">Stage 1 of 3</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Configure Interview Session
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
          Provide your target role and job description. BarRaiser synthesizes an authentic coding challenge and Amazon Leadership Principle prompt calibrated against real bar raiser standards.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Preset Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Select Role Template or Define Custom
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {ROLE_PRESETS.map((preset) => {
              const isSelected = targetRole === preset.role;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-3 rounded-md border transition-all cursor-pointer ${
                    isSelected
                      ? "border-amber-500/80 bg-[#121927] text-white shadow-sm"
                      : "border-[#1d2638] bg-[#0c1017] text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium mb-1">
                    <span className={isSelected ? "text-amber-400 font-semibold" : "text-slate-300"}>
                      {preset.name}
                    </span>
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-amber-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    {preset.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Role Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Target Role & Level
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Amazon SDE-1 (AWS Messaging & Streaming)"
            required
            className="w-full rounded-md border border-[#202a3d] bg-[#0c1017] px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Job Description Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Job Description or Requirements
            </label>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={jobDescription.length >= 40 ? "text-slate-400" : "text-amber-400"}>
                {jobDescription.length} / 40 min
              </span>
              <div className="w-12 h-1.5 rounded-full bg-[#1b2336] overflow-hidden">
                <div
                  className={`h-full ${charProgress === 100 ? "bg-emerald-500" : "bg-amber-500"}`}
                  style={{ width: `${charProgress}%` }}
                />
              </div>
            </div>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={7}
            placeholder="Paste the job posting description, key competencies, and required backend/systems experience..."
            required
            className="w-full rounded-md border border-[#202a3d] bg-[#0c1017] p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors leading-relaxed font-sans"
          />
        </div>

        {/* Error Notice */}
        {error && (
          <div className="rounded-md border border-rose-900/60 bg-rose-950/40 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loadingMessages[loadingStep]}</span>
              </>
            ) : (
              <>
                <span>Start Interview Session</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <span className="text-[11px] text-slate-400 font-mono">
            Press <kbd className="rounded border border-[#242f44] bg-[#111724] px-1.5 py-0.5 text-slate-300">Ctrl</kbd> + <kbd className="rounded border border-[#242f44] bg-[#111724] px-1.5 py-0.5 text-slate-300">Enter</kbd> to start
          </span>
        </div>
      </form>

      {/* Specification Footprint */}
      <div className="mt-14 border-t border-[#182030] pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="space-y-1">
          <span className="font-mono text-amber-500/80 text-[11px]">01</span>
          <div className="font-semibold text-slate-200">Algorithmic Challenge</div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Synthesized based on stack requirements with custom starter code and test cases.
          </p>
        </div>
        <div className="space-y-1">
          <span className="font-mono text-amber-500/80 text-[11px]">02</span>
          <div className="font-semibold text-slate-200">Leadership Principle</div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Targeted Amazon LP scenario audited for data-backed metrics and ownership.
          </p>
        </div>
        <div className="space-y-1">
          <span className="font-mono text-amber-500/80 text-[11px]">03</span>
          <div className="font-semibold text-slate-200">Hiring Packet Debrief</div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Calibrated verdict, complexity analysis, and top 3 prioritized engineering fixes.
          </p>
        </div>
      </div>
    </div>
  );
}
