"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button, ButtonVariant, ButtonSize } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  size = "xs",
  variant = "ghost",
  className,
}: {
  value: string;
  label?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={copy}
      className={cn("gap-1.5 text-muted-foreground", copied && "text-success", className)}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span className="tabular-nums">{copied ? "Copied" : label}</span>
    </Button>
  );
}
