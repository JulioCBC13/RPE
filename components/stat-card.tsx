import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type Variant = "success" | "danger" | "warning"

const dotColor: Record<Variant, string> = {
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
}

const valueColor: Record<Variant, string> = {
  success: "text-card-foreground",
  danger: "text-danger",
  warning: "text-warning",
}

export function StatCard({
  label,
  value,
  variant,
  icon: Icon,
  highlightWhenPositive = false,
}: {
  label: string
  value: number
  variant: Variant
  icon: LucideIcon
  highlightWhenPositive?: boolean
}) {
  const useHighlight = !highlightWhenPositive || value > 0
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={cn("size-2 rounded-full", dotColor[variant])} aria-hidden />
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </div>
          <span
            className={cn(
              "text-3xl font-bold tabular-nums",
              useHighlight ? valueColor[variant] : "text-card-foreground",
            )}
          >
            {value}
          </span>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
