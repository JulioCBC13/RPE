import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar, PageHeading } from "@/components/topbar"
import { cn } from "@/lib/utils"

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
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-60">
        <Topbar title={title} />
        <main className={cn("mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6", className)}>
          <PageHeading title={title} breadcrumb={breadcrumb.length ? breadcrumb : [title]} />
          {children}
        </main>
      </div>
    </div>
  )
}
