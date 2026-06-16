import type { TrainingSession } from "@/lib/data"
import { formatDate } from "@/lib/data"
import { Clock } from "lucide-react"
import { CompletionBadge } from "@/components/chips"

export function SessionRow({ session }: { session: TrainingSession }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <div className="flex items-center gap-4">
        <span className="w-20 shrink-0 text-sm tabular-nums text-muted-foreground">
          {formatDate(session.date)}
        </span>
        <span className="text-sm font-medium text-card-foreground">{session.dayName}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="size-4" />
          {session.durationMin} min
        </span>
        <CompletionBadge status={session.status} />
      </div>
    </div>
  )
}
