"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { HistoryItem } from "@/lib/types";
import { getHistoryFromLocal } from "@/lib/storage";
import DossierVerdictBadge from "./DossierVerdictBadge";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistoryFromLocal());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative z-50 flex h-full w-full max-w-md flex-col border-l border-[#1c2538] bg-[#0c1017] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1c2538] pb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Interview History</h2>
            <p className="text-xs text-slate-400">Past evaluated sessions</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-[#151c2c] hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* History List */}
        <div className="mt-4 flex-1 overflow-y-auto divide-y divide-[#182030] pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No previous interviews found. Complete a session to populate history.
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div key={item.sessionId} className="py-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-medium text-slate-200 line-clamp-1">
                      {item.targetRole}
                    </span>
                    <DossierVerdictBadge verdict={item.verdict} size="sm" />
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {item.codingTitle}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>{dateStr}</span>
                    <Link
                      href={`/dossier/${item.sessionId}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 font-medium text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>View dossier</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#1c2538] pt-4 text-xs text-slate-400">
          Saved locally & in DynamoDB
        </div>
      </div>
    </div>
  );
}
