"use client"

import Link from "next/link"
import { ArrowLeft, CalendarClock, History } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AlertCard } from "@/components/alert-card"
import { SessionRow } from "@/components/session-row"
import { WeightProgressChart } from "@/components/weight-progress-chart"
import { WeightProgressTable } from "@/components/weight-progress-table"
import { RoutineDisplay } from "@/components/routine-display"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { useAppStore } from "@/lib/store"
import { getAlertsForAthlete, getSessionsForAthlete, initialsOf, athleteWeightProgress, athleteRoutines, getAthlete } from "@/lib/data"

export function AthleteProfileClient({ athleteId }: { athleteId: string }) {
  const { athletes: storeAthletes } = useAppStore()

  // Search first in store (new or modified athletes), then fallback to static data
  const storeAthlete = storeAthletes.find((a) => a.id === athleteId)
  const staticAthlete = getAthlete(athleteId)
  const athlete = storeAthlete || staticAthlete

  if (!athlete) {
    return (
      <AppShell title="Perfil de atleta">
        <div className="flex flex-col items-center gap-4 py-12">
          <p className="text-lg text-muted-foreground">Atleta no encontrado</p>
          <Button nativeButton={false} render={<Link href="/atletas" />}>
            Volver a atletas
          </Button>
        </div>
      </AppShell>
    )
  }

  const alerts = getAlertsForAthlete(athlete.id)
  const sessions = getSessionsForAthlete(athlete.id)

  return (
    <AppShell title="Perfil de atleta">
      <div className="flex flex-col gap-6">
        <Button variant="ghost" size="sm" className="w-fit" nativeButton={false} render={<Link href="/atletas" />}>
          <ArrowLeft data-icon="inline-start" />
          Volver a atletas
        </Button>

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
                {athlete.status === "sin_acceso" ? "Habilitar" : "Renovar"} acceso
              </Button>
            )}
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <WeightProgressChart entries={athleteWeightProgress[athlete.id] || []} athleteName={athlete.name} />
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
                  Próximas sesiones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <Empty>
                    <EmptyMedia>
                      <CalendarClock className="size-8 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle>Sin sesiones próximas</EmptyTitle>
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

        {alerts.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-card-foreground">Alertas</h3>
            <div className="flex flex-col gap-2">
              {alerts.map((alert, i) => (
                <AlertCard key={i} alert={alert} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
