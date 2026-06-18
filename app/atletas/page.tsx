"use client"

import { useState } from "react"
import Link from "next/link"
import { UserPlus, Users, Search, X } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AthleteRow } from "@/components/athlete-row"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { athletes } from "@/lib/data"

export default function AtletasPage() {
  const [search, setSearch] = useState("")

  const filtered = athletes.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  const activeAthletes = filtered.filter((a) => a.status === "activo")
  const otherAthletes = filtered.filter((a) => a.status !== "activo")

  const renderTable = (athletesList: typeof athletes) => (
    <Card className="overflow-hidden py-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Atleta</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Acceso hasta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {athletesList.map((athlete) => (
              <AthleteRow key={athlete.id} athlete={athlete} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )

  return (
    <AppShell title="Atletas">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <Search className="size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-card-foreground transition-colors"
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

        {athletes.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No hay atletas registrados</EmptyTitle>
              <EmptyDescription>Registra a tu primer atleta para empezar a gestionar su entrenamiento.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button nativeButton={false} render={<Link href="/atletas/nuevo" />}>
                <UserPlus data-icon="inline-start" />
                Registrar atleta
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Otros Atletas */}
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

            {/* Atletas Activos */}
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
        )}
      </div>
    </AppShell>
  )
}
