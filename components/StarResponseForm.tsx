"use client";

import React from "react";
import { StarAnswer } from "@/lib/types";
import { Check, AlertCircle } from "lucide-react";

interface StarResponseFormProps {
  value: StarAnswer;
  onChange: (updated: StarAnswer) => void;
  lpQuestion?: string;
  lpPrinciple?: string;
}

export default function StarResponseForm({
  value,
  onChange,
  lpQuestion,
  lpPrinciple,
}: StarResponseFormProps) {
  const updateField = (field: keyof StarAnswer, text: string) => {
    onChange({
      ...value,
      [field]: text,
    });
  };

  const hasMetrics = /\d+(\.\d+)?(%|ms|s|m|k|b|\$|x|\s*percent|\s*users|\s*transactions|\s*requests|\s*rps|\s*qps|\s*sla)/i.test(
    value.result
  );

  return (
    <div className="flex flex-col h-full border border-[#1d273b] bg-[#0c1017] rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex h-10 items-center justify-between border-b border-[#1d273b] bg-[#0f141e] px-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">STAR Behavioral Response</span>
          {lpPrinciple && (
            <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">
              · {lpPrinciple}
            </span>
          )}
        </div>

        <div>
          {hasMetrics ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Check className="h-3 w-3" />
              <span>Metrics detected</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-amber-400/90">
              <AlertCircle className="h-3 w-3" />
              <span>Result lacks numbers (%, ms, $, RPS)</span>
            </span>
          )}
        </div>
      </div>

      {/* Input Blocks */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
        {/* Situation */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <label className="font-medium text-slate-300">
              <span className="text-slate-400 font-mono">S ·</span> Situation (Incident context & constraints)
            </label>
            <span className="font-mono text-[10px] text-slate-400">{value.situation.length} chars</span>
          </div>
          <textarea
            value={value.situation}
            onChange={(e) => updateField("situation", e.target.value)}
            rows={2}
            placeholder="Describe the production incident, system bottleneck, or business urgency..."
            className="w-full rounded border border-[#1d2638] bg-[#090d14] p-2 text-slate-200 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-sans resize-none"
          />
        </div>

        {/* Task */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <label className="font-medium text-slate-300">
              <span className="text-slate-400 font-mono">T ·</span> Task (Your specific objective & SLA)
            </label>
            <span className="font-mono text-[10px] text-slate-400">{value.task.length} chars</span>
          </div>
          <textarea
            value={value.task}
            onChange={(e) => updateField("task", e.target.value)}
            rows={2}
            placeholder="What was your target SLA, deadline, or engineering deliverable?"
            className="w-full rounded border border-[#1d2638] bg-[#090d14] p-2 text-slate-200 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-sans resize-none"
          />
        </div>

        {/* Action */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <label className="font-medium text-slate-300">
              <span className="text-slate-400 font-mono">A ·</span> Action (Individual decisions & trade-offs — focus on "I")
            </label>
            <span className="font-mono text-[10px] text-slate-400">{value.action.length} chars</span>
          </div>
          <textarea
            value={value.action}
            onChange={(e) => updateField("action", e.target.value)}
            rows={2}
            placeholder="Explain the specific technical choices and trade-offs you made..."
            className="w-full rounded border border-[#1d2638] bg-[#090d14] p-2 text-slate-200 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-sans resize-none"
          />
        </div>

        {/* Result */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <label className="font-medium text-slate-300">
              <span className="text-slate-400 font-mono">R ·</span> Result (Quantifiable metrics & business impact)
            </label>
            <span className="font-mono text-[10px] text-slate-400">{value.result.length} chars</span>
          </div>
          <textarea
            value={value.result}
            onChange={(e) => updateField("result", e.target.value)}
            rows={2}
            placeholder="Quantify the business impact: latency reduction (ms), dropped error rate (%), RPS handled..."
            className={`w-full rounded border p-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 text-xs font-sans resize-none ${
              hasMetrics
                ? "border-emerald-800/80 bg-[#090d14] focus:border-emerald-500 focus:ring-emerald-500"
                : "border-[#1d2638] bg-[#090d14] focus:border-amber-500 focus:ring-amber-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
