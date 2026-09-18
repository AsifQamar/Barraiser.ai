"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CodingChallenge, LeadershipPrinciple } from "@/lib/types";
import { Badge } from "./ui";
import { CopyButton } from "./copy-button";

export type ChallengeTab = "technical" | "leadership";

interface ChallengePanelProps {
  tab: ChallengeTab;
  onTabChange: (t: ChallengeTab) => void;
  challenge: CodingChallenge;
  leadership: LeadershipPrinciple;
}

export function ChallengePanel({
  tab,
  onTabChange,
  challenge,
  leadership,
}: ChallengePanelProps) {
  const copyText =
    tab === "technical"
      ? `${challenge.title}\n\n${challenge.description}`
      : `${leadership.principle}\n\n${leadership.question}`;

  return (
    <div className="flex h-full flex-col bg-surface/40">
      {/* Tab bar & copy */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1 rounded-[11px] bg-surface-2 p-1">
          <TabButton
            active={tab === "technical"}
            onClick={() => onTabChange("technical")}
          >
            Technical Challenge
          </TabButton>
          <TabButton
            active={tab === "leadership"}
            onClick={() => onTabChange("leadership")}
          >
            Leadership Principle
          </TabButton>
        </div>
        <CopyButton value={copyText} label="Copy" />
      </div>

      {/* Body content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {tab === "technical" ? (
          <TechnicalBody challenge={challenge} />
        ) : (
          <LeadershipBody leadership={leadership} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-[12.5px] font-medium tracking-tight transition-all duration-150 cursor-pointer",
        active
          ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function TechnicalBody({ challenge }: { challenge: CodingChallenge }) {
  const difficultyTone =
    challenge.difficulty === "Easy"
      ? "success"
      : challenge.difficulty === "Hard"
      ? "critical"
      : "warning";

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge tone={difficultyTone}>{challenge.difficulty}</Badge>
          <Badge>Algorithmic Assessment</Badge>
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {challenge.title}
        </h2>
      </div>

      <div className="text-[13.5px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
        {challenge.description}
      </div>

      {challenge.examples && challenge.examples.length > 0 && (
        <section>
          <SectionLabel>Examples</SectionLabel>
          <div className="mt-2.5 space-y-2.5">
            {challenge.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-surface-2/50 p-3.5"
              >
                <div className="space-y-1.5 font-mono text-[12px]">
                  <div className="flex gap-2">
                    <span className="shrink-0 text-muted-foreground">Input</span>
                    <span className="text-foreground/90 whitespace-pre-wrap">{ex.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-muted-foreground">Output</span>
                    <span className="text-primary font-semibold">{ex.output}</span>
                  </div>
                </div>
                {ex.explanation && (
                  <p className="mt-2.5 border-t border-border/60 pt-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {challenge.constraints && challenge.constraints.length > 0 && (
        <section>
          <SectionLabel>Constraints</SectionLabel>
          <ul className="mt-2.5 space-y-1.5">
            {challenge.constraints.map((con, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground"
              >
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-border-strong" />
                <span className="font-mono text-foreground/80">{con}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function LeadershipBody({ leadership }: { leadership: LeadershipPrinciple }) {
  const guidance = [
    "Anchor the scenario in a high-stakes production incident or engineering trade-off.",
    "Make your personal agency ('I decided' vs 'we discussed') unmistakable.",
    "Quantify business impact with concrete metrics (latency ms, % drops, throughput RPS, financial loss averted).",
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <Badge tone="info" className="mb-2">
          {leadership.principle}
        </Badge>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Amazon Bar Raiser Scenario Question
        </h2>
      </div>

      <div className="rounded-xl border border-border bg-surface-2/60 p-4">
        <p className="text-[13.5px] font-medium leading-relaxed text-foreground">
          &ldquo;{leadership.question}&rdquo;
        </p>
      </div>

      <section>
        <SectionLabel>What great looks like</SectionLabel>
        <ul className="mt-2.5 space-y-2">
          {guidance.map((g, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground"
            >
              <span className="mt-0.5 font-mono text-[11px] text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </section>

      {leadership.tip && (
        <div className="rounded-xl border border-primary/20 bg-primary-soft p-3.5">
          <p className="text-[12px] leading-relaxed text-primary/90 italic">
            <strong className="font-semibold not-italic">Bar Raiser Note:</strong> {leadership.tip}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface-2/40 p-3.5">
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Structure your answer using the <span className="font-medium text-foreground">STAR</span> framework in the
          workspace. The <span className="text-primary font-medium">Result</span> section strictly audits for measurable impact.
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </h3>
  );
}
