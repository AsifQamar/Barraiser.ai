"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export type SupportedLanguage = "java" | "python" | "cpp" | "typescript";

interface CodeEditorProps {
  initialCode: string;
  code: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const LANGUAGES: { id: SupportedLanguage; label: string; ext: string }[] = [
  { id: "java", label: "Java 21", ext: "java" },
  { id: "python", label: "Python 3.12", ext: "py" },
  { id: "cpp", label: "C++ 20", ext: "cpp" },
  { id: "typescript", label: "TypeScript", ext: "ts" },
];

const emptySubscribe = () => () => {};

export function CodeEditor({
  initialCode,
  code,
  onChange,
  language,
  onLanguageChange,
}: CodeEditorProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const lineCount = useMemo(() => (code ? code.split("\n").length : 1), [code]);
  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  const handleReset = () => {
    onChange(initialCode);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 bg-surface">
        <div className="flex items-center gap-1 rounded-[10px] bg-surface-2 p-0.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => onLanguageChange(l.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11.5px] font-medium transition-all duration-150 cursor-pointer",
                language === l.id
                  ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.3)] font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={handleReset}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            title="Reset code to starter template"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </Button>
          <CopyButton value={code} />
        </div>
      </div>

      {/* Real Monaco Editor Surface */}
      <div className="relative flex min-h-0 flex-1 bg-[#12141a]">
        {isMounted ? (
          <Monaco
            height="100%"
            language={language === "cpp" ? "cpp" : language}
            theme="vs-dark"
            value={code}
            onChange={(val) => onChange(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "var(--font-geist-mono), JetBrains Mono, Menlo, Monaco, Consolas, monospace",
              tabSize: 4,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: "on",
              padding: { top: 12, bottom: 12 },
              lineNumbersMinChars: 3,
              renderLineHighlight: "line",
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted-foreground">
            Loading Monaco editor environment…
          </div>
        )}
      </div>

      {/* Bottom Status Line */}
      <div className="flex items-center justify-between border-t border-border px-3.5 py-1.5 font-mono text-[10.5px] text-muted-foreground bg-surface">
        <span>solution.{activeLang.ext}</span>
        <div className="flex items-center gap-3">
          <span>{lineCount} lines</span>
          <span>UTF-8</span>
          <span className="text-primary font-medium">{activeLang.label}</span>
        </div>
      </div>
    </div>
  );
}
