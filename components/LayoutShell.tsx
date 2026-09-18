"use client";

import React from "react";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground flex flex-col">{children}</div>;
}
