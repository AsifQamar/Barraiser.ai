"use client";

import React from "react";
import { LeadershipScore } from "@/lib/types";

interface LeadershipScorecardProps {
  scores: LeadershipScore[];
}

export default function LeadershipScorecard({ scores }: LeadershipScorecardProps) {
  const calculateOverallAverage = () => {
    if (!scores || scores.length === 0) return "0.0";
    const total = scores.reduce((acc, curr) => acc + curr.score, 0);
    return (total / scores.length).toFixed(1);
  };

  const getCompetencyLabel = (score: number) => {
    if (score >= 4) return { label: "Raises the Bar", style: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60" };
    if (score === 3) return { label: "Meets the Bar", style: "text-amber-400 bg-amber-950/40 border-amber-800/60" };
    return { label: "Below the Bar", style: "text-rose-400 bg-rose-950/40 border-rose-800/60" };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between border-b border-[#1c2538] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Leadership Principles Scorecard</h3>
          <p className="text-xs text-slate-400">Calibrated against Amazon's 16 Leadership Principles</p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Average Score: <span className="font-semibold text-slate-200">{calculateOverallAverage()} / 5.0</span>
        </div>
      </div>

      <div className="divide-y divide-[#182030]">
        {scores.map((item, idx) => {
          const competency = getCompetencyLabel(item.score);
          const percentage = (item.score / 5) * 100;

          return (
            <div key={idx} className="py-3.5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-slate-200">{item.principle}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border font-mono ${competency.style}`}>
                    {competency.label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 rounded-full bg-[#182030] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.score >= 4
                          ? "bg-emerald-500"
                          : item.score === 3
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-slate-300 w-8 text-right font-medium">
                    {item.score} / 5
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pl-1">
                {item.feedback}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
