"use client";

import React from "react";
import { VerdictType } from "@/lib/types";
import { CheckCircle2, Trophy, AlertTriangle, XCircle } from "lucide-react";

interface DossierVerdictBadgeProps {
  verdict: VerdictType;
  size?: "sm" | "md" | "lg";
}

export default function DossierVerdictBadge({ verdict, size = "md" }: DossierVerdictBadgeProps) {
  const config = {
    "Strong Hire": {
      container: "bg-emerald-950/50 text-emerald-300 border-emerald-800/60",
      icon: Trophy,
      label: "Strong Hire",
    },
    "Hire": {
      container: "bg-sky-950/50 text-sky-300 border-sky-800/60",
      icon: CheckCircle2,
      label: "Hire",
    },
    "Lean Hire": {
      container: "bg-amber-950/50 text-amber-300 border-amber-800/60",
      icon: AlertTriangle,
      label: "Lean Hire",
    },
    "No Hire": {
      container: "bg-rose-950/50 text-rose-300 border-rose-800/60",
      icon: XCircle,
      label: "No Hire",
    },
  }[verdict] || {
    container: "bg-slate-900 text-slate-300 border-slate-700",
    icon: CheckCircle2,
    label: verdict,
  };

  const IconComponent = config.icon;

  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium ${config.container}`}
      >
        <IconComponent className="h-3 w-3 shrink-0" />
        <span>{config.label}</span>
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div
        className={`inline-flex items-center gap-2.5 rounded-md border px-4 py-2 text-sm font-semibold tracking-wide uppercase ${config.container}`}
      >
        <IconComponent className="h-4 w-4 shrink-0" />
        <span>{config.label}</span>
      </div>
    );
  }

  // Default "md"
  return (
    <span
      className={`inline-flex items-center gap-2 rounded border px-3 py-1 text-xs font-semibold ${config.container}`}
    >
      <IconComponent className="h-3.5 w-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
