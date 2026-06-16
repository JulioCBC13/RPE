"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ProgressionAdjustment } from "@/lib/data"
import { formatDate, initialsOf } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, X, TrendingUp } from "lucide-react"

export function AdjustmentCard({ adjustment }: { adjustment: ProgressionAdjustment }) {
  const [decision, setDecision] = useState<"pending" | "approved" | "ignored">("pending")

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border border-l-4 border-l-success bg-card p-4 sm:flex-row sm:items-start sm:justify-between",
        decision !== "pending" && "opacity-60",
      )}
    >
      <div className="flex gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initialsOf(adjustment.athleteName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-card-foreground">{adjustment.athleteName}</span>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-card-foreground">{adjustment.exercise}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-success">
              <TrendingUp className="size-4" />
              Peso sugerido: {adjustment.suggestedDelta}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
        <span className="text-xs text-muted-foreground">{formatDate(adjustment.createdAt)}</span>
        {decision === "pending" ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setDecision("approved")}>
              <Check data-icon="inline-start" />
              Aprobar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDecision("ignored")}>
              <X data-icon="inline-start" />
              Ignorar
            </Button>
          </div>
        ) : (
          <span className="text-xs font-semibold text-muted-foreground">
            {decision === "approved" ? "Aprobado" : "Ignorado"}
          </span>
        )}
      </div>
    </div>
  )
}
