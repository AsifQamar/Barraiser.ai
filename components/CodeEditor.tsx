"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Copy, RotateCcw, Check } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  initialCode: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { id: "java", name: "Java 21" },
  { id: "python", name: "Python 3.12" },
  { id: "cpp", name: "C++ 20" },
  { id: "typescript", name: "TypeScript" },
];

export default function CodeEditor({
  initialCode,
  onChange,
  language = "java",
  onLanguageChange,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [activeLang, setActiveLang] = useState(language);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorChange = (value: string | undefined) => {
    const updated = value || "";
    setCode(updated);
    onChange(updated);
  };

  const handleLanguageSelect = (newLang: string) => {
    setActiveLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    onChange(initialCode);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full border border-[#1d273b] bg-[#0c1017] rounded-md overflow-hidden">
      {/* Chrome Top Bar */}
      <div className="flex h-10 items-center justify-between border-b border-[#1d273b] bg-[#0f141e] px-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-300">Editor</span>
          <select
            value={activeLang}
            onChange={(e) => handleLanguageSelect(e.target.value)}
            className="rounded border border-[#26334d] bg-[#141b29] px-2 py-0.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1 rounded px-2 py-1 text-slate-400 hover:bg-[#1b2336] hover:text-white transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-1 rounded px-2 py-1 text-slate-400 hover:bg-[#1b2336] hover:text-white transition-colors cursor-pointer"
            title="Reset code"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 w-full relative bg-[#1e1e1e]">
        {isMounted ? (
          <Editor
            height="100%"
            language={activeLang === "cpp" ? "cpp" : activeLang}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
              tabSize: 4,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: "on",
              padding: { top: 10, bottom: 10 },
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-500 font-mono">
            Loading editor...
          </div>
        )}
      </div>
    </div>
  );
}
