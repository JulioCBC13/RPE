"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import type { CoachAlert } from "@/lib/data"
import { formatDate, initialsOf } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AlertTypeChip } from "@/components/chips"
import { Check, ExternalLink } from "lucide-react"

export function AlertCard({
  alert,
  onReviewed,
}: {
  alert: CoachAlert
  onReviewed?: (alert: CoachAlert) => void
}) {
  const isRed = alert.type === "ESTANCAMIENTO"

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between",
        "border-l-4",
        isRed ? "border-l-danger" : "border-l-warning",
      )}
    >
      <div className="flex gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initialsOf(alert.athleteName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/atletas/${alert.athleteId}`}
              className="flex items-center gap-1 text-sm font-semibold text-card-foreground hover:underline"
            >
              {alert.athleteName}
              <ExternalLink className="size-3 text-muted-foreground" />
            </Link>
            <AlertTypeChip type={alert.type} />
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Semana {alert.week}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{alert.detail}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
        <span className="text-xs text-muted-foreground">{formatDate(alert.createdAt)}</span>
        {onReviewed && (
          <Button variant="outline" size="sm" onClick={() => onReviewed(alert)}>
            <Check data-icon="inline-start" />
            Marcar revisada
          </Button>
        )}
      </div>
    </div>
  )
}
