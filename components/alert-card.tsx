"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { CoachAlert } from "@/lib/data"
import { timeAgo, formatDate, initialsOf } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AlertTypeChip } from "@/components/chips"
import { Check } from "lucide-react"

export function AlertCard({ alert, compact = false }: { alert: CoachAlert; compact?: boolean }) {
  const [reviewed, setReviewed] = useState(alert.reviewed)
  const isRed = alert.type === "ESTANCAMIENTO"

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between",
        "border-l-4",
        isRed ? "border-l-danger" : "border-l-warning",
        reviewed && "opacity-60",
      )}
    >
      <div className="flex gap-3">
        {!compact && (
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {initialsOf(alert.athleteName)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {!compact && <span className="text-sm font-semibold text-card-foreground">{alert.athleteName}</span>}
            <AlertTypeChip type={alert.type} />
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Semana {alert.week}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{alert.detail}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
        <span className="text-xs text-muted-foreground">{compact ? timeAgo(alert.createdAt) : formatDate(alert.createdAt)}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={reviewed}
          onClick={() => setReviewed(true)}
        >
          <Check data-icon="inline-start" />
          {reviewed ? "Revisada" : "Marcar revisada"}
        </Button>
      </div>
    </div>
  )
}
