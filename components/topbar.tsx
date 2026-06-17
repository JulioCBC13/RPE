import { coach } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Bell, Settings, Maximize } from "lucide-react"

export function Topbar({ title, breadcrumb = [] }: { title: string; breadcrumb?: string[] }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar..."
            aria-label="Buscar"
            className="h-9 w-64 rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Pantalla completa"
          className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
        >
          <Maximize className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Ajustes"
          className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
        >
          <Settings className="size-5" />
        </button>
        <div className="ml-2 flex items-center gap-3 border-l border-border pl-3">
          <div className="text-right">
            <p className="text-sm font-medium text-card-foreground">{coach.name}</p>
            <p className="text-xs text-muted-foreground">Coach</p>
          </div>
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
              {coach.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export function PageHeading({ title, breadcrumb = [] }: { title: string; breadcrumb?: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h1 className="text-xl font-bold text-card-foreground text-balance">{title}</h1>
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Coach-Pilot</span>
        {breadcrumb.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            <span className={i === breadcrumb.length - 1 ? "text-foreground" : ""}>{crumb}</span>
          </span>
        ))}
      </nav>
    </div>
  )
}
