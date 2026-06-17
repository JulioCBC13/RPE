import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type Variant = "success" | "danger" | "warning"

const ringColor: Record<Variant, string> = {
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
}

function Donut({ percent, variant }: { percent: number; variant: Variant }) {
  const r = 22
  const c = 2 * Math.PI * r
  const offset = c - (percent / 100) * c
  return (
    <svg viewBox="0 0 56 56" className="size-14 -rotate-90" aria-hidden>
      <circle cx="28" cy="28" r={r} fill="none" strokeWidth="6" className="text-muted" stroke="currentColor" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className={ringColor[variant]}
        stroke="currentColor"
      />
    </svg>
  )
}

export function StatCard({
  label,
  value,
  variant,
  icon: Icon,
  highlightWhenPositive = false,
  percent = 65,
  delta,
  deltaDirection = "up",
  deltaNote = "vs. mes anterior",
}: {
  label: string
  value: number
  variant: Variant
  icon: LucideIcon
  highlightWhenPositive?: boolean
  percent?: number
  delta?: string
  deltaDirection?: "up" | "down"
  deltaNote?: string
}) {
  const useHighlight = !highlightWhenPositive || value > 0
  const deltaPositive = deltaDirection === "up"
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span
            className={cn(
              "text-3xl font-bold tabular-nums",
              useHighlight && variant !== "success" ? ringColor[variant] : "text-card-foreground",
            )}
          >
            {value}
          </span>
          <Donut percent={percent} variant={variant} />
        </div>
        {delta && (
          <div className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
                deltaPositive ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
              )}
            >
              {deltaPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
              {delta}
            </span>
            <span className="text-muted-foreground">{deltaNote}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
