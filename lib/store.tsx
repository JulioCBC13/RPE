"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type AthleteStatus = "activo" | "expirado" | "sin_acceso"

export type ActiveBlock = {
  name: string
  weeks: number
  createdAt: string
}

export type StoreAthlete = {
  id: string
  name: string
  email: string
  status: AthleteStatus
  block: ActiveBlock | null
  discipline?: string
}

type AppStore = {
  athletes: StoreAthlete[]
  // Navigation intent: which athlete to pre-select in "Crear Bloque"
  pendingAthleteId: string | null
  setPendingAthleteId: (id: string | null) => void
  // Assign a block to an athlete
  assignBlock: (athleteId: string, block: ActiveBlock) => void
  // Add a new athlete to the store
  addAthlete: (athlete: Omit<StoreAthlete, "id" | "block">) => string
  // Sidebar collapsed state
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
}

// ─── Initial mock data ────────────────────────────────────────────────────────

const INITIAL_ATHLETES: StoreAthlete[] = [
  {
    id: "s1",
    name: "Julio Bando",
    email: "julio@example.com",
    status: "activo",
    discipline: "Powerlifting",
    block: { name: "Off Season B2", weeks: 4, createdAt: "2026-06-01" },
  },
  {
    id: "s2",
    name: "Santiago",
    email: "santiago@example.com",
    status: "activo",
    discipline: "Bodybuilding",
    block: null,
  },
  {
    id: "s3",
    name: "Carlos Pérez",
    email: "carlos@example.com",
    status: "sin_acceso",
    discipline: "Estética",
    block: null,
  },
  {
    id: "s4",
    name: "María Gómez",
    email: "maria@example.com",
    status: "activo",
    discipline: "Running",
    block: null,
  },
]

// ─── Context ──────────────────────────────────────────────────────────────────

const StoreContext = createContext<AppStore | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [athletes, setAthletes] = useState<StoreAthlete[]>(INITIAL_ATHLETES)
  const [pendingAthleteId, setPendingAthleteId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const assignBlock = (athleteId: string, block: ActiveBlock) => {
    setAthletes((prev) =>
      prev.map((a) => (a.id === athleteId ? { ...a, block, status: "activo" } : a)),
    )
  }

  const addAthlete = (athlete: Omit<StoreAthlete, "id" | "block">) => {
    const newId = `created-${Date.now()}`
    const newAthlete: StoreAthlete = {
      id: newId,
      name: athlete.name,
      email: athlete.email,
      status: athlete.status,
      block: null,
    }
    setAthletes((prev) => [...prev, newAthlete])
    return newId
  }

  return (
    <StoreContext.Provider
      value={{ athletes, pendingAthleteId, setPendingAthleteId, assignBlock, addAthlete, sidebarCollapsed, setSidebarCollapsed }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useAppStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider")
  return ctx
}
