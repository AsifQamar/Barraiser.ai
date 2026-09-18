"use client";

import React, { useMemo } from "react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarAnswer } from "@/lib/types";

type StarKey = "situation" | "task" | "action" | "result";

const FIELDS: { key: StarKey; letter: string; label: string; placeholder: string }[] = [
  {
    key: "situation",
    letter: "S",
    label: "Situation",
    placeholder: "Set the scene. What was the production incident, system bottleneck, or business context?",
  },
  {
    key: "task",
    letter: "T",
    label: "Task",
    placeholder: "What was your specific objective, target deliverable, or SLA deadline?",
  },
  {
    key: "action",
    letter: "A",
    label: "Action",
    placeholder: "What technical choices, trade-offs, and decisions did YOU personally own? Focus on 'I'.",
  },
  {
    key: "result",
    letter: "R",
    label: "Result (Audited for metrics)",
    placeholder: "Quantify the outcome: latency drop (ms), error rate reduction (%), RPS handled, revenue protected.",
  },
];

interface StarEditorProps {
  value: StarAnswer;
  onChange: (updated: StarAnswer) => void;
}

export function StarEditor({ value, onChange }: StarEditorProps) {
  const updateField = (field: StarKey, text: string) => {
    onChange({
      ...value,
      [field]: text,
    });
  };

  const totalWords = useMemo(() => {
    return Object.values(value)
      .join(" ")
      .split(/\s+/)
      .filter(Boolean).length;
  }, [value]);

  const hasMetrics = /\d+(\.\d+)?(%|ms|s|m|k|b|\$|x|\s*percent|\s*users|\s*transactions|\s*requests|\s*rps|\s*qps|\s*sla)/i.test(
    value.result
  );

  const filled = FIELDS.filter((f) => value[f.key].trim().length > 8).length;
  const quality = Math.round((filled / FIELDS.length) * 100);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      {/* Header with Word Count & Metrics Detection */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-surface">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-medium text-foreground">STAR Behavioral Response</span>
          {hasMetrics ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-success/15 border border-success/30 px-1.5 py-0.5 text-[10.5px] font-medium text-success">
              <Check className="size-3" />
              Metrics detected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 border border-warning/30 px-1.5 py-0.5 text-[10.5px] font-medium text-warning">
              <AlertCircle className="size-3" />
              Lacks numbers (%, ms, $, RPS)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border-strong">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                quality < 50 ? "bg-warning" : quality < 100 ? "bg-info" : "bg-success"
              )}
              style={{ width: `${quality}%` }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {totalWords}w
          </span>
        </div>
      </div>

      {/* Input Blocks */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {FIELDS.map((f) => {
          const val = value[f.key];
          const active = val.trim().length > 8;
          const isResultField = f.key === "result";

          return (
            <div key={f.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-md text-[11px] font-semibold transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-2 text-muted-foreground"
                    )}
                  >
                    {f.letter}
                  </span>
                  <label className="text-[12.5px] font-medium text-foreground">
                    {f.label}
                  </label>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {val.length} chars
                </span>
              </div>

              <textarea
                value={val}
                onChange={(e) => updateField(f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={f.key === "action" ? 4 : isResultField ? 3 : 2}
                className={cn(
                  "w-full resize-none rounded-xl border bg-surface-2/40 px-3 py-2.5 text-[12.5px] leading-relaxed outline-none transition-colors text-foreground",
                  "placeholder:text-muted-foreground/50 hover:border-border-strong",
                  isResultField && hasMetrics
                    ? "border-success/40 focus-visible:border-success/80 focus-visible:ring-[3px] focus-visible:ring-success/20"
                    : "border-input focus-visible:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-ring/40"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
