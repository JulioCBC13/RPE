import { coach } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-bold text-primary text-balance">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-card-foreground">{coach.name}</p>
          <p className="text-xs text-muted-foreground">{coach.email}</p>
        </div>
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
            {coach.initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
