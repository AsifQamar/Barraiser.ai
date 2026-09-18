"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import HistoryDrawer from "./HistoryDrawer";

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar onOpenHistory={() => setIsHistoryOpen(true)} />

      {/* Slide-over History Drawer */}
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {/* Core Viewport Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Clean Utility Footer */}
      <footer className="border-t border-[#182030] bg-[#0b0e14] py-4 text-xs text-slate-400">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">BarRaiser</span>
            <span className="text-slate-500">/</span>
            <span>Amazon Bar Raiser Mock Copilot</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Amazon Nova Lite & DynamoDB</span>
            <span>Amplify CI/CD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
