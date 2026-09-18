"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getHistoryFromLocal } from "@/lib/storage";
import { VerdictType } from "@/lib/types";
import { Badge, Tone } from "./ui";

const verdictToneMap: Record<VerdictType, Tone> = {
  "Strong Hire": "success",
  "Hire": "success",
  "Lean Hire": "warning",
  "No Hire": "critical",
};

export function HistoryDrawer({
  open,
  onClose,
  onNew,
}: {
  open: boolean;
  onClose: () => void;
  onNew?: () => void;
}) {
  const router = useRouter();
  const history = open ? getHistoryFromLocal() : [];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSelectSession = (sessionId: string) => {
    onClose();
    router.push(`/dossier/${sessionId}`);
  };

  const handleStartNew = () => {
    onClose();
    if (onNew) {
      onNew();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-surface shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-[14px] font-semibold tracking-tight">Session history</h2>
            <p className="text-[11.5px] text-muted-foreground">{history.length} past evaluations</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close history">
            <X className="size-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {history.length === 0 ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              No interview sessions recorded yet.
            </div>
          ) : (
            history.map((s) => {
              const tone = verdictToneMap[s.verdict] || "default";
              const dateStr = s.createdAt
                ? new Date(s.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <button
                  key={s.sessionId}
                  onClick={() => handleSelectSession(s.sessionId)}
                  className="group flex w-full items-start gap-3 rounded-xl border border-border bg-background p-3.5 text-left transition-colors hover:border-border-strong hover:bg-surface-2 cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] font-medium text-foreground">{s.targetRole}</span>
                      <span className="shrink-0 text-[10.5px] text-muted-foreground font-mono">{dateStr}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">{s.codingTitle}</div>
                    <div className="mt-2">
                      <Badge tone={tone}>{s.verdict}</Badge>
                    </div>
                  </div>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </button>
              );
            })
          )}
        </div>

        <div className="border-t border-border p-3">
          <Button className="w-full gap-2" onClick={handleStartNew}>
            <Plus className="size-4" />
            Start new session
          </Button>
        </div>
      </aside>
    </>
  );
}
