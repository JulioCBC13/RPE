"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar, PageHeading } from "@/components/topbar"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

export function AppShell({
  title,
  breadcrumb = [],
  className,
  children,
}: {
  title: string
  breadcrumb?: string[]
  className?: string
  children: ReactNode
}) {
  const { sidebarCollapsed } = useAppStore()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        "transition-all duration-200 ease-in-out",
        sidebarCollapsed ? "pl-14" : "pl-60",
      )}>
        <Topbar title={title} />
        <main className={cn("mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6", className)}>
          <PageHeading title={title} breadcrumb={breadcrumb.length ? breadcrumb : [title]} />
          {children}
        </main>
      </div>
    </div>
  )
}
