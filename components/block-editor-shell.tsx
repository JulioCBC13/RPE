"use client"

import { Sidebar } from "@/components/sidebar"
import { BlockEditor } from "@/components/block-editor"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function BlockEditorShell() {
  const { sidebarCollapsed } = useAppStore()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      {/* Offset for sidebar width */}
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-200 ease-in-out",
        sidebarCollapsed ? "pl-14" : "pl-60",
      )}>
        <BlockEditor />
      </div>
    </div>
  )
}
