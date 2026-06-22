"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CalendarClock, History, Clock, Bell } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AlertCard } from "@/components/alert-card"
import { WeightProgressChart } from "@/components/weight-progress-chart"
import { WeightProgressTable } from "@/components/weight-progress-table"
import { RoutineDisplay } from "@/components/routine-display"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import type { CoachAlert } from "@/lib/data"
import { useAppStore, type StoreAthlete } from "@/lib/store"
import {
  getAthlete,
  getAlertsForAthlete,
  getSessionsForAthlete,
  initialsOf,
  timeAgo,
  athleteWeightProgress,
  athleteRoutines,
} from "@/lib/data"
import { SessionRow } from "@/components/session-row"
import { AlertTypeChip } from "@/components/chips"

export default function AthleteProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { athletes: storeAthletes } = useAppStore()
  const [athlete, setAthlete] = useState<StoreAthlete | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [activeAlerts, setActiveAlerts] = useState<CoachAlert[]>([])
  const [reviewedHistory, setReviewedHistory] = useState<CoachAlert[]>([])

  useEffect(() => {
    // 1. Check store first (covers s1-s4, created-*, and any newly added athlete)
    const fromStore = storeAthletes.find((a) => a.id === id)
    if (fromStore) {
      setAthlete(fromStore)
      setActiveAlerts(getAlertsForAthlete(fromStore.id).filter((a) => !a.reviewed))
      return
    }

    // 2. Fallback: static data (a1-a6), mapped to StoreAthlete shape
    const fromStatic = getAthlete(id)
    if (fromStatic) {
      setAthlete({
        id: fromStatic.id,
        name: fromStatic.name,
        email: fromStatic.email,
        status: fromStatic.status as StoreAthlete["status"],
        block: null,
      })
      setActiveAlerts(getAlertsForAthlete(fromStatic.id).filter((a) => !a.reviewed))
      return
    }

    setNotFound(true)
  }, [id, storeAthletes])

  function handleAlertReviewed(alert: CoachAlert) {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alert.id))
    setReviewedHistory((prev) => {
      const next = [{ ...alert, reviewed: true }, ...prev]
      return next.slice(0, 20) // keep last 20
    })
  }

  if (notFound) {
    return (
      <AppShell title="Perfil de atleta">
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-lg text-muted-foreground">Atleta no encontrado</p>
          <Button nativeButton={false} render={<Link href="/atletas" />}>
            Volver a atletas
          </Button>
        </div>
      </AppShell>
    )
  }

  if (!athlete) {
    return (
      <AppShell title="Perfil de atleta">
        <div className="flex flex-col gap-4 p-6">
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </div>
      </AppShell>
    )
  }

  const sessions = getSessionsForAthlete(athlete.id)
  const actionLabel = athlete.status === "sin_acceso" ? "Habilitar" : "Renovar"
  const storeAthlete = storeAthletes.find((a) => a.id === athlete.id)

  return (
    <AppShell title="Perfil de atleta">
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          nativeButton={false}
          render={<Link href="/atletas" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Volver a atletas
        </Button>

        {/* Header card */}
        <Card>
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                  {initialsOf(athlete.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-card-foreground">{athlete.name}</h2>
                <p className="text-sm text-muted-foreground">{athlete.email}</p>
              </div>
            </div>

            {athlete.status !== "activo" && (
              <Button
                size="sm"
                className="w-fit"
                nativeButton={false}
                render={<Link href={`/atletas/${athlete.id}/habilitar`} />}
              >
                {actionLabel} acceso
              </Button>
            )}
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <WeightProgressChart
            entries={athleteWeightProgress[athlete.id] || []}
            athleteName={athlete.name}
          />
          <RoutineDisplay routine={athleteRoutines[athlete.id]} athleteId={athlete.id} storeBlock={storeAthlete?.block} />
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="size-5" />
                  Historial de datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeightProgressTable entries={athleteWeightProgress[athlete.id] || []} />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarClock className="size-4" />
                  Sesiones recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <Empty>
                    <EmptyMedia>
                      <CalendarClock className="size-8 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle>Sin sesiones</EmptyTitle>
                      <EmptyDescription>Asigna una rutina a este atleta</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="flex flex-col gap-2">
                    {sessions.map((session, i) => (
                      <SessionRow key={i} session={session} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {(activeAlerts.length > 0 || reviewedHistory.length > 0) && (
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
            {/* Alertas activas */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-card-foreground" />
                <h3 className="text-sm font-bold text-card-foreground">Alertas de Rendimiento</h3>
                {activeAlerts.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {activeAlerts.length}
                  </Badge>
                )}
              </div>
              {activeAlerts.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">Sin alertas pendientes.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col gap-2">
                  {activeAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} compact onReviewed={handleAlertReviewed} />
                  ))}
                </div>
              )}
            </div>

            {/* Mini historial de revisadas */}
            <Card className="h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="size-4" />
                  Historial
                </CardTitle>
                <CardDescription className="text-xs">Últimas {Math.min(reviewedHistory.length, 20)} revisadas</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {reviewedHistory.length === 0 ? (
                  <p className="px-4 pb-4 text-xs text-muted-foreground">
                    Las alertas marcadas como revisadas aparecerán aquí.
                  </p>
                ) : (
                  <div className="flex flex-col divide-y divide-border">
                    {reviewedHistory.map((alert) => (
                      <div key={alert.id} className="flex flex-col gap-1 px-4 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <AlertTypeChip type={alert.type} />
                          <span className="text-xs text-muted-foreground">{timeAgo(alert.createdAt)}</span>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{alert.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </AppShell>
  )
}
