"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserPlus, Search, X, FilePlus2, Layers, CalendarCheck } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AthleteRow } from "@/components/athlete-row"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { athletes } from "@/lib/data"
import { useAppStore, type StoreAthlete } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function AtletasPage() {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { athletes: storeAthletes, setPendingAthleteId } = useAppStore()
  const router = useRouter()

  // Merge static mock athletes with store athletes (store athletes shown first)
  const allAthletes: StoreAthlete[] = [
    ...storeAthletes,
    ...athletes
      .filter((a) => !storeAthletes.find((s) => s.id === a.id))
      .map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        status: a.status as StoreAthlete["status"],
        block: null,
      })),
  ]

  const filtered = allAthletes.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()),
  )

  const activeAthletes = filtered.filter((a) => a.status === "activo")
  const otherAthletes = filtered.filter((a) => a.status !== "activo")
  const selected = allAthletes.find((a) => a.id === selectedId) ?? null

  function handleCreateBlock(athleteId: string) {
    setPendingAthleteId(athleteId)
    router.push("/programacion/crear")
  }

  const renderTable = (list: StoreAthlete[]) => (
    <Card className="overflow-hidden py-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Atleta</TableHead>
              <TableHead>Bloque activo</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((a) => (
              <TableRow
                key={a.id}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedId === a.id && "bg-primary/10",
                )}
                onClick={() => setSelectedId(a.id === selectedId ? null : a.id)}
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-card-foreground">{a.name}</span>
                    <span className="text-xs text-muted-foreground">{a.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {a.block ? (
                    <span className="text-xs font-medium text-success">{a.block.name}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground/50 italic">Sin bloque</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={cn(
                      "border-0 text-[11px]",
                      a.status === "activo"
                        ? "bg-success/10 text-success"
                        : a.status === "expirado"
                          ? "bg-danger/10 text-danger"
                          : "bg-warning/10 text-warning",
                    )}
                  >
                    {a.status === "activo"
                      ? "Activo"
                      : a.status === "expirado"
                        ? "Expirado"
                        : "Sin acceso"}
                  </Badge>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )

  return (
    <AppShell title="Atletas">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative flex flex-1 max-w-xs items-center">
            <Search className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 text-muted-foreground hover:text-card-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Button nativeButton={false} render={<Link href="/atletas/nuevo" />}>
            <UserPlus data-icon="inline-start" />
            Registrar atleta
          </Button>
        </div>

        {/* Main split layout */}
        <div className={cn("grid gap-5", selected ? "grid-cols-[1fr_320px]" : "grid-cols-1")}>
          {/* Left: tables */}
          <div className="flex flex-col gap-6">
            {otherAthletes.length > 0 && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-card-foreground">Otros Atletas</h2>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-warning/15 px-1.5 text-xs font-semibold text-warning">
                    {otherAthletes.length}
                  </span>
                </div>
                {renderTable(otherAthletes)}
              </section>
            )}
            {activeAthletes.length > 0 && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-card-foreground">Atletas Activos</h2>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-success/15 px-1.5 text-xs font-semibold text-success">
                    {activeAthletes.length}
                  </span>
                </div>
                {renderTable(activeAthletes)}
              </section>
            )}
          </div>

          {/* Right: detail panel */}
          {selected && (
            <div className="flex flex-col gap-3">
              <Card className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{selected.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{selected.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-muted-foreground hover:text-card-foreground transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 pt-0">
                  {selected.block ? (
                    /* Has block */
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 rounded-md bg-success/10 px-3 py-2.5">
                        <CalendarCheck className="size-4 shrink-0 text-success" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-success">Bloque Activo</span>
                          <span className="text-sm font-bold text-card-foreground">
                            {selected.block.name}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex flex-col gap-0.5 rounded bg-muted/50 px-2.5 py-2">
                          <span className="text-muted-foreground">Semanas</span>
                          <span className="font-semibold text-card-foreground">
                            {selected.block.weeks}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 rounded bg-muted/50 px-2.5 py-2">
                          <span className="text-muted-foreground">Asignado</span>
                          <span className="font-semibold text-card-foreground">
                            {selected.block.createdAt}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCreateBlock(selected.id)}
                      >
                        <FilePlus2 data-icon="inline-start" />
                        Crear nuevo bloque
                      </Button>
                    </div>
                  ) : (
                    /* No block */
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                        <Layers className="size-6 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-card-foreground">
                          Sin rutina asignada
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Este atleta no tiene un bloque activo todavía.
                        </p>
                      </div>
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:opacity-90"
                        onClick={() => handleCreateBlock(selected.id)}
                      >
                        <FilePlus2 data-icon="inline-start" />
                        + Crear Bloque
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
