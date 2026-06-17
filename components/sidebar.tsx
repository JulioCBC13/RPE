"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Bell, Users, Zap, LogOut, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { coach, coachAlerts } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navSections = [
  {
    title: "Navegación",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      { href: "/alertas", label: "Alertas", icon: Bell },
    ],
  },
  {
    title: "Gestión",
    items: [
      { href: "/atletas", label: "Atletas", icon: Users },
      { href: "/atletas/nuevo", label: "Registrar atleta", icon: UserPlus },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const alertCount = coachAlerts.filter((a) => !a.reviewed).length

  return (
    <aside className="fixed inset-y-0 left-0 flex w-60 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="size-4 text-primary-foreground" fill="currentColor" />
        </div>
        <span className="text-lg font-bold text-sidebar-primary">Coach-Pilot</span>
      </div>

      <nav className="flex flex-1 flex-col gap-6 px-3 py-4">
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {section.title}
            </p>
            {section.items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/atletas/nuevo" && pathname.startsWith(item.href + "/"))
              const showBadge = item.href === "/alertas" && alertCount > 0
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="size-5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {showBadge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-xs font-semibold text-danger-foreground">
                      {alertCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-9">
            <AvatarFallback className="bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
              {coach.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-accent-foreground">{coach.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">Coach</p>
          </div>
        </div>
        <Link
          href="/login"
          className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-5 shrink-0" />
          Cerrar sesión
        </Link>
      </div>
    </aside>
  )
}
