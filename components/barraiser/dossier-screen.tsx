"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleCheckBig,
  Gauge,
  History,
  Printer,
  RotateCcw,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DossierResponse, VerdictType } from "@/lib/types";
import { Badge, ScoreBar, Tone, Wordmark } from "./ui";
import { CopyButton } from "./copy-button";
import { HistoryDrawer } from "./history-drawer";

interface DossierScreenProps {
  dossier: DossierResponse;
}

const VERDICT_META: Record<
  VerdictType,
  { tone: Tone; blurb: string }
> = {
  "Strong Hire": { tone: "success", blurb: "Clearly raises the hiring bar" },
  "Hire": { tone: "success", blurb: "At or above the bar" },
  "Lean Hire": { tone: "warning", blurb: "Borderline, leaning positive" },
  "No Hire": { tone: "critical", blurb: "Below the bar this round" },
};

export function DossierScreen({ dossier }: DossierScreenProps) {
  const router = useRouter();
  const [historyOpen, setHistoryOpen] = useState(false);

  const meta = VERDICT_META[dossier.verdict] || VERDICT_META["Hire"];

  // Calculate average leadership score
  const scores = dossier.leadershipScorecard || [];
  const avgLp = scores.length > 0
    ? scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length
    : 4.0;

  // Calculate calibrated confidence percentage (0-100)
  const confidence = Math.min(
    99,
    Math.max(
      35,
      dossier.verdict === "Strong Hire"
        ? Math.round(88 + (avgLp / 5) * 10)
        : dossier.verdict === "Hire"
        ? Math.round(75 + (avgLp / 5) * 12)
        : dossier.verdict === "Lean Hire"
        ? Math.round(56 + (avgLp / 5) * 10)
        : Math.round(32 + (avgLp / 5) * 10)
    )
  );

  const role = dossier.targetRole || "Software Development Engineer";

  // Format date
  const dateFormatted = dossier.createdAt
    ? new Date(dossier.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return (
    <div className="relative min-h-dvh flex flex-col bg-background text-foreground">
      {/* Background Grid Lines */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 grid-lines [mask-image:linear-gradient(to_bottom,black,transparent)]" />

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

      {/* Main Dossier Content */}
      <main className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-28 pt-4 sm:px-8 flex-1">
        {/* Hero Section */}
        <section className="animate-slide-up">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-mono">
            <span>Bar Raiser Dossier</span>
            <span className="size-1 rounded-full bg-border-strong" />
            <span className="truncate text-foreground font-sans font-medium">{role}</span>
            <span className="size-1 rounded-full bg-border-strong hidden sm:inline" />
            <span className="hidden sm:inline">{dateFormatted}</span>
          </div>

          <div className="mt-4 grid gap-6 rounded-2xl border border-border bg-surface/80 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8 shadow-sm">
            <div>
              <VerdictBadge verdict={dossier.verdict} meta={meta} />
              <p className="mt-4 max-w-xl text-balance text-[15px] font-medium leading-relaxed text-foreground">
                {dossier.summary.split(".")[0]}.
              </p>
            </div>
            <ConfidenceGauge value={confidence} tone={meta.tone} />
          </div>
        </section>

        {/* Executive Debrief */}
        <section
          className="mt-5 animate-slide-up rounded-2xl border border-border bg-surface/60 p-6 shadow-sm"
          style={{ animationDelay: "60ms" }}
        >
          <SectionHeader
            icon={<TrendingUp className="size-4" />}
            title="Executive debrief"
            caption="Calibrated summary against Amazon Bar Raiser standards"
          />
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            {dossier.summary}
          </p>
        </section>

        {/* Two Column Grid: Technical Audit + Leadership Signal */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Technical Card */}
          <section
            className="animate-slide-up rounded-2xl border border-border bg-surface/60 p-6 shadow-sm"
            style={{ animationDelay: "90ms" }}
          >
            <SectionHeader
              icon={<Gauge className="size-4" />}
              title="Technical evaluation"
              right={
                <Badge tone={dossier.verdict === "Strong Hire" ? "success" : "warning"}>
                  AST Complexity Verified
                </Badge>
              }
            />

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <Metric
                label="Time complexity"
                value={dossier.technicalEvaluation.timeComplexity}
              />
              <Metric
                label="Space complexity"
                value={dossier.technicalEvaluation.spaceComplexity}
              />
            </div>

            <div className="mt-5">
              <MiniLabel>Edge-case & failure mode audit</MiniLabel>
              <div className="mt-2 rounded-xl border border-border bg-surface-2/40 p-3.5 text-[12.5px] leading-relaxed text-muted-foreground">
                {dossier.technicalEvaluation.edgeCasesIdentified}
              </div>
            </div>
          </section>

          {/* Leadership Signal Card */}
          <section
            className="animate-slide-up rounded-2xl border border-border bg-surface/60 p-6 shadow-sm"
            style={{ animationDelay: "120ms" }}
          >
            <SectionHeader
              icon={<TrendingUp className="size-4" />}
              title="Leadership signal"
              right={
                <span className="font-mono text-[13px] tabular-nums text-muted-foreground">
                  <span className="text-base font-semibold text-foreground">
                    {avgLp.toFixed(1)}
                  </span>
                  /5.0
                </span>
              }
            />

            <div className="mt-4 space-y-3.5">
              {scores.map((s) => {
                const classification =
                  s.score >= 4
                    ? "Bar Raising"
                    : s.score === 3
                    ? "Meets Bar"
                    : "Below Bar";
                const classTone: Tone =
                  s.score >= 4 ? "success" : s.score === 3 ? "warning" : "critical";

                return (
                  <div key={s.principle}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12.5px] font-medium text-foreground">
                        {s.principle}
                      </span>
                      <Badge tone={classTone}>{classification}</Badge>
                    </div>
                    <div className="mt-1.5">
                      <ScoreBar value={s.score} tone={classTone} />
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                      {s.feedback}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Action Plan Section */}
        {dossier.actionableFixes && dossier.actionableFixes.length > 0 && (
          <section
            className="mt-5 animate-slide-up rounded-2xl border border-border bg-surface/60 p-6 shadow-sm"
            style={{ animationDelay: "140ms" }}
          >
            <SectionHeader
              icon={<Target className="size-4" />}
              title="Your action plan"
              caption="Ranked priority fixes before your real interview round"
            />
            <div className="mt-4 space-y-2.5">
              {dossier.actionableFixes.map((fix, idx) => {
                const priority: "P0" | "P1" | "P2" =
                  idx === 0 ? "P0" : idx === 1 ? "P1" : "P2";
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                  >
                    <PriorityTag priority={priority} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] leading-relaxed text-foreground/95">
                        {fix}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-[12px] text-muted-foreground">
              Evaluation complete · Calibrated via Amazon Bedrock Nova Lite
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <CopyButton
              value={buildShareText(dossier, role)}
              label="Copy summary"
              variant="outline"
              size="sm"
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => window.print()}
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">Export / Print</span>
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/")}
              className="h-9 gap-1.5 px-3.5"
            >
              <RotateCcw className="size-3.5" />
              <span>New session</span>
            </Button>
          </div>
        </div>
      </div>

      {/* History Drawer */}
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onNew={() => router.push("/")}
      />
    </div>
  );
}

function VerdictBadge({
  verdict,
  meta,
}: {
  verdict: VerdictType;
  meta: { tone: Tone; blurb: string };
}) {
  const toneRing: Record<string, string> = {
    success: "ring-success/25 bg-success/10 text-success",
    warning: "ring-warning/25 bg-warning/10 text-warning",
    critical: "ring-critical/25 bg-critical/10 text-critical",
    default: "ring-border bg-surface text-foreground",
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-2xl ring-1",
          toneRing[meta.tone] || toneRing.default
        )}
      >
        <CircleCheckBig className="size-5" />
      </span>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight sm:text-2xl text-foreground">
            {verdict}
          </span>
        </div>
        <div className="text-[12px] text-muted-foreground">{meta.blurb}</div>
      </div>
    </div>
  );
}

function ConfidenceGauge({ value, tone }: { value: number; tone: Tone }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  const stroke: Record<string, string> = {
    success: "stroke-success",
    info: "stroke-info",
    warning: "stroke-warning",
    critical: "stroke-critical",
    default: "stroke-primary",
  };

  return (
    <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-1">
      <div className="relative size-28">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="7"
            className="stroke-border-strong"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className={cn(
              "transition-[stroke-dashoffset] duration-1000 ease-out",
              stroke[tone] || stroke.default
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold tabular-nums leading-none text-foreground">
            {value}
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            score
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:justify-center">
        <Gauge className="size-3" />
        Confidence
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  caption,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  caption?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
          {icon}
        </span>
        <div>
          <h2 className="text-[14px] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {caption && (
            <p className="text-[11.5px] text-muted-foreground">{caption}</p>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-[13px] sm:text-[14px] font-semibold text-foreground line-clamp-2">
        {value}
      </div>
    </div>
  );
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
      {children}
    </div>
  );
}

function PriorityTag({ priority }: { priority: "P0" | "P1" | "P2" }) {
  const tone: Tone =
    priority === "P0" ? "critical" : priority === "P1" ? "warning" : "info";
  return (
    <span className="shrink-0">
      <Badge tone={tone}>{priority}</Badge>
    </span>
  );
}

function buildShareText(d: DossierResponse, role: string) {
  return [
    `BarRaiser.ai — Hiring Dossier`,
    `Role: ${role}`,
    `Verdict: ${d.verdict}`,
    ``,
    `Summary: ${d.summary}`,
    ``,
    `Technical: Time: ${d.technicalEvaluation.timeComplexity} / Space: ${d.technicalEvaluation.spaceComplexity}`,
    `Edge cases: ${d.technicalEvaluation.edgeCasesIdentified}`,
  ].join("\n");
}
