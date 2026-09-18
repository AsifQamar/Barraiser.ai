"use client";

import React from "react";

interface ActionableFixesListProps {
  fixes: string[];
}

export default function ActionableFixesList({ fixes }: ActionableFixesListProps) {
  const getPriority = (idx: number) => {
    if (idx === 0) return { label: "P0 · Critical", style: "text-rose-400 bg-rose-950/40 border-rose-800/60" };
    if (idx === 1) return { label: "P1 · High Impact", style: "text-amber-400 bg-amber-950/40 border-amber-800/60" };
    return { label: "P2 · Calibration", style: "text-sky-400 bg-sky-950/40 border-sky-800/60" };
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-[#1c2538] pb-3">
        <h3 className="text-sm font-semibold text-white">Priority Recommendations</h3>
        <p className="text-xs text-slate-400">Targeted adjustments before a live Bar Raiser round</p>
      </div>

      <div className="divide-y divide-[#182030]">
        {fixes.map((fix, idx) => {
          const prio = getPriority(idx);
          return (
            <div key={idx} className="py-3.5 flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-amber-500/80 pt-0.5 shrink-0">
                0{idx + 1}
              </span>
              <div className="space-y-1.5 flex-1">
                <span className={`inline-block text-[10px] font-mono px-1.5 py-0.2 rounded border ${prio.style}`}>
                  {prio.label}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {fix}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
