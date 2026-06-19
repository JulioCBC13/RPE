"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Bell, Users, LogOut, CreditCard, Table2, FilePlus2, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { coach, coachAlerts } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"

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
      { href: "/payments", label: "Validación de Pagos", icon: CreditCard },
    ],
  },
  {
    title: "Programación",
    items: [
      { href: "/programacion", label: "Laboratorio", icon: Table2 },
      { href: "/programacion/crear", label: "Crear Bloque", icon: FilePlus2 },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const alertCount = coachAlerts.filter((a) => !a.reviewed).length
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-200 ease-in-out",
        sidebarCollapsed ? "w-14" : "w-60",
      )}
    >
      {/* Toggle button */}
      <div className={cn(
        "flex h-12 shrink-0 items-center border-b border-sidebar-border",
        sidebarCollapsed ? "justify-center px-0" : "justify-end px-3",
      )}>
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex size-7 items-center justify-center rounded-md text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {sidebarCollapsed
            ? <PanelLeftOpen className="size-4" />
            : <PanelLeftClose className="size-4" />
          }
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-2 py-4">
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            {!sidebarCollapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {section.title}
              </p>
            )}
            {sidebarCollapsed && (
              <div className="mx-auto mb-1 h-px w-8 bg-sidebar-border" />
            )}
            {section.items.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/")
              const showBadge = item.href === "/alertas" && alertCount > 0
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-md px-2 py-2.5 text-sm font-medium transition-colors",
                    sidebarCollapsed ? "justify-center" : "gap-3 px-3",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="size-5 shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {showBadge && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-xs font-semibold text-danger-foreground">
                          {alertCount}
                        </span>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && showBadge && (
                    <span className="absolute left-7 top-1 flex size-3.5 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-danger-foreground">
                      {alertCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        {!sidebarCollapsed ? (
          <>
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
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
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <LogOut className="size-4 shrink-0" />
              Cerrar sesión
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <Avatar className="size-8">
              <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                {coach.initials}
              </AvatarFallback>
            </Avatar>
            <Link
              href="/login"
              title="Cerrar sesión"
              className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <LogOut className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
