"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getDossierFromLocal } from "@/lib/storage";
import { mockDossierResponse } from "@/lib/mockData";
import { DossierScreen } from "@/components/barraiser/dossier-screen";

export default function DossierPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === "string" ? params.sessionId : "default";

  const dossier = useMemo(() => {
    return getDossierFromLocal(sessionId) || { ...mockDossierResponse, sessionId };
  }, [sessionId]);

  if (!dossier) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Retrieving hiring dossier…</span>
        </div>
      </div>
    );
  }

  return <DossierScreen dossier={dossier} />;
}
