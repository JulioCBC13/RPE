import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar, PageHeading } from "@/components/topbar"

export function AppShell({
  title,
  breadcrumb = [],
  children,
}: {
  title: string
  breadcrumb?: string[]
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-60">
        <Topbar title={title} />
        <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
          <PageHeading title={title} breadcrumb={breadcrumb.length ? breadcrumb : [title]} />
          {children}
        </main>
      </div>
    </div>
  )
}
