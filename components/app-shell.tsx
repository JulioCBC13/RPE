import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-60">
        <Topbar title={title} />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
