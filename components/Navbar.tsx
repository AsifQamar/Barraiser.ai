"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, Clock, Plus } from "lucide-react";
import { getHistoryFromLocal } from "@/lib/storage";

interface NavbarProps {
  onOpenHistory?: () => void;
  activeSessionId?: string;
  activeRole?: string;
}

export default function Navbar({ onOpenHistory, activeSessionId, activeRole }: NavbarProps) {
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    const history = getHistoryFromLocal();
    setSessionCount(history.length);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#182030] bg-[#090c12]/95 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
        {/* Brand & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:border-amber-500/50 transition-colors">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-xs tracking-tight text-white group-hover:text-amber-300 transition-colors">
              BarRaiser
            </span>
          </Link>

          <span className="text-[#202b3e]">/</span>

          {activeRole ? (
            <span className="text-xs text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">
              {activeRole}
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Mock Copilot
            </span>
          )}

          {activeSessionId && (
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-[#101522] px-1.5 py-0.5 rounded border border-[#1b2336]">
              {activeSessionId}
            </span>
          )}
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-slate-400 border border-[#1b2336] bg-[#0d111a] px-2 py-0.5 rounded">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
            <span>Nova Lite</span>
          </div>

          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              type="button"
              className="flex items-center gap-1.5 rounded border border-[#202a3d] bg-[#0d121b] px-2.5 py-1 font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            >
              <Clock className="h-3 w-3 text-slate-400" />
              <span>History</span>
              {sessionCount > 0 && (
                <span className="ml-0.5 rounded bg-[#182236] px-1.5 py-0.2 text-[10px] font-mono text-slate-400">
                  {sessionCount}
                </span>
              )}
            </button>
          )}

          <Link
            href="/"
            className="flex items-center gap-1 rounded bg-amber-500 px-2.5 py-1 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            <Plus className="h-3 w-3 stroke-[2.5]" />
            <span>New Session</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
