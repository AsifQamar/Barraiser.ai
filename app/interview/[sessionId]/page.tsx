"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSessionFromLocal } from "@/lib/storage";
import { mockSessionResponse } from "@/lib/mockData";
import { WorkspaceScreen } from "@/components/barraiser/workspace-screen";

export default function InterviewRoomPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === "string" ? params.sessionId : "default";

  const session = useMemo(() => {
    return getSessionFromLocal(sessionId) || { ...mockSessionResponse, sessionId };
  }, [sessionId]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Loading interview environment…</span>
        </div>
      </div>
    );
  }

  return <WorkspaceScreen session={session} />;
}
