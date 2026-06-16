import { cn } from "@/lib/utils"
import type { AlertType, AthleteStatus, SessionStatus } from "@/lib/data"

export function AlertTypeChip({ type }: { type: AlertType }) {
  const isRed = type === "ESTANCAMIENTO"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        isRed ? "bg-danger/10 text-danger" : "bg-warning/15 text-warning-foreground",
      )}
    >
      {isRed ? "ESTANCAMIENTO" : "RUTINA INCOMPLETA"}
    </span>
  )
}

const statusConfig: Record<AthleteStatus, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-success/10 text-success" },
  expirado: { label: "Expirado", className: "bg-danger/10 text-danger" },
  sin_acceso: { label: "Sin acceso", className: "bg-muted text-muted-foreground" },
}

export function StatusChip({ status }: { status: AthleteStatus }) {
  const cfg = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        cfg.className,
      )}
    >
      {cfg.label}
    </span>
  )
}

export function CompletionBadge({ status }: { status: SessionStatus }) {
  const complete = status === "completa"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        complete ? "bg-success/10 text-success" : "bg-warning/15 text-warning-foreground",
      )}
    >
      {complete ? "Completa" : "Incompleta"}
    </span>
  )
}
