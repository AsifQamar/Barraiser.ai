"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDossierFromLocal } from "@/lib/storage";
import { DossierResponse } from "@/lib/types";
import { mockDossierResponse } from "@/lib/mockData";
import DossierVerdictBadge from "@/components/DossierVerdictBadge";
import LeadershipScorecard from "@/components/LeadershipScorecard";
import ActionableFixesList from "@/components/ActionableFixesList";
import { ChevronLeft, Share2, Printer, Check, Loader2, ArrowRight } from "lucide-react";

export default function DossierPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === "string" ? params.sessionId : "default";

  const [dossier, setDossier] = useState<DossierResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loaded = getDossierFromLocal(sessionId);
    if (loaded) {
      setDossier(loaded);
    } else {
      setDossier({
        ...mockDossierResponse,
        sessionId,
      });
    }
  }, [sessionId]);

  const handleCopySummary = () => {
    if (!dossier) return;
    const text = `BarRaiser Hiring Dossier\nRole: ${dossier.targetRole || "SDE"}\nVerdict: ${
      dossier.verdict
    }\nSummary: ${dossier.summary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!dossier) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Retrieving hiring dossier...</span>
        </div>
      </div>
    );
  }

  const { technicalEvaluation } = dossier;
  const dateFormatted = new Date(dossier.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182030] pb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Configure new session</span>
        </Link>

        <div className="flex items-center gap-2.5 text-xs">
          <button
            onClick={handleCopySummary}
            type="button"
            className="flex items-center gap-1.5 rounded border border-[#202a3d] bg-[#0d121b] px-3 py-1.5 text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center gap-1.5 rounded border border-[#202a3d] bg-[#0d121b] px-3 py-1.5 text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Official Dossier Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Bar Raiser Packet
            </span>
            <span className="text-xs text-slate-400 font-mono">Doc ref: BR-{sessionId.slice(0, 8)}</span>
          </div>
          <DossierVerdictBadge verdict={dossier.verdict} size="md" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Interview Debrief & Hiring Calibration
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-mono pt-2">
            <span>Target: <strong className="text-slate-200 font-sans">{dossier.targetRole || "Software Development Engineer"}</strong></span>
            <span>·</span>
            <span>Date: {dateFormatted}</span>
            <span>·</span>
            <span>Session: {sessionId}</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="border-t border-[#182030] pt-6 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Executive Debrief Summary
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {dossier.summary}
        </p>
      </div>

      {/* Technical & Algorithmic Audit */}
      <div className="border-t border-[#182030] pt-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Technical & Algorithmic Audit</h3>
          <p className="text-xs text-slate-400">Evaluated from submitted code AST and complexity constraints</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="rounded border border-[#1b2336] bg-[#0b0f16] p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Time Complexity Analysis
            </span>
            <p className="text-xs font-mono text-emerald-400 font-medium">
              {technicalEvaluation.timeComplexity}
            </p>
          </div>

          <div className="rounded border border-[#1b2336] bg-[#0b0f16] p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Space Complexity Analysis
            </span>
            <p className="text-xs font-mono text-sky-400 font-medium">
              {technicalEvaluation.spaceComplexity}
            </p>
          </div>

          <div className="sm:col-span-2 rounded border border-[#1b2336] bg-[#0b0f16] p-4 space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Edge Cases & Potential Failure Modes
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {technicalEvaluation.edgeCasesIdentified}
            </p>
          </div>
        </div>
      </div>

      {/* Leadership Principles Scorecard */}
      <div className="border-t border-[#182030] pt-6">
        <LeadershipScorecard scores={dossier.leadershipScorecard} />
      </div>

      {/* Actionable Recommendations */}
      <div className="border-t border-[#182030] pt-6">
        <ActionableFixesList fixes={dossier.actionableFixes} />
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-[#182030] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-400">
          Calibrated via Amazon Bedrock Nova Lite & Amazon Bar Raiser Debrief Rubric.
        </span>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
        >
          <span>Configure Another Mock</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
