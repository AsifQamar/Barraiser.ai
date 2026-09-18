"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-[9px] bg-primary text-primary-foreground shadow-sm",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <path d="M4 16 L9 8 L14 14 L20 5" />
        <path d="M4 20 H20" strokeWidth="2" opacity="0.5" />
      </svg>
    </span>
  );
}

export function Wordmark({ className, href = "/" }: { className?: string; href?: string }) {
  const content = (
    <span className={cn("flex items-center gap-2.5 group cursor-pointer", className)}>
      <Logo className="group-hover:scale-105 transition-transform" />
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        BarRaiser<span className="text-primary">.ai</span>
      </span>
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export type Tone =
  | "default"
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "critical";

const toneStyles: Record<Tone, string> = {
  default: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary-soft text-primary border-primary/25",
  success: "bg-success/10 text-success border-success/25",
  info: "bg-info/10 text-info border-info/25",
  warning: "bg-warning/10 text-warning border-warning/25",
  critical: "bg-critical/10 text-critical border-critical/25",
};

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-medium leading-5 tracking-tight",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = "default" }: { tone?: Tone }) {
  const map: Record<Tone, string> = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    success: "bg-success",
    info: "bg-info",
    warning: "bg-warning",
    critical: "bg-critical",
  };
  return <span className={cn("size-1.5 rounded-full", map[tone])} />;
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border-strong bg-surface-2 px-1.5 font-mono text-[10.5px] font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}

const STAGES = ["Setup", "Workspace", "Dossier"];

export function StageStepper({ current }: { current: 0 | 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      {STAGES.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full text-[9px] font-semibold tabular-nums transition-colors",
                  active && "bg-primary text-primary-foreground",
                  done && "bg-primary/25 text-primary",
                  !active && !done && "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium tracking-tight transition-colors",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < STAGES.length - 1 && <span className="h-px w-5 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

export function ScoreBar({
  value,
  max = 5,
  tone = "primary",
}: {
  value: number;
  max?: number;
  tone?: Tone;
}) {
  const map: Record<Tone, string> = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    success: "bg-success",
    info: "bg-info",
    warning: "bg-warning",
    critical: "bg-critical",
  };
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i < value ? map[tone] : "bg-border-strong"
          )}
        />
      ))}
    </div>
  );
}
