import Link from "next/link"
import { notFound } from "next/navigation"
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
import {
  getAthlete,
  getAlertsForAthlete,
  getSessionsForAthlete,
  formatDate,
  initialsOf,
  athleteWeightProgress,
  athleteRoutines,
} from "@/lib/data"

export default async function AthleteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const athlete = getAthlete(id)
  if (!athlete) notFound()

  const alerts = getAlertsForAthlete(id)
  const sessions = getSessionsForAthlete(id)
  const actionLabel = athlete.status === "sin_acceso" ? "Habilitar" : "Renovar"

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

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex flex-col gap-1 sm:text-right">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Programa activo</span>
                <span className="text-sm font-semibold text-card-foreground">{athlete.program ?? "Sin programa"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarClock className="size-4" />
                Acceso hasta: {formatDate(athlete.accessUntil)}
              </div>
              <Button nativeButton={false} render={<Link href={`/atletas/${athlete.id}/habilitar`} />}>{actionLabel}</Button>
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <WeightProgressChart entries={athleteWeightProgress[athlete.id] || []} athleteName={athlete.name} />
          <RoutineDisplay routine={athleteRoutines[athlete.id]} />
        </section>

        <WeightProgressTable entries={athleteWeightProgress[athlete.id] || []} />

        <section className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-primary">Alertas activas</h3>
          {alerts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} compact />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-sm text-muted-foreground">
                Sin alertas activas para este atleta.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-primary">Historial de sesiones</h3>
          {sessions.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Últimas sesiones registradas</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.map((session) => (
                  <SessionRow key={session.id} session={session} />
                ))}
              </CardContent>
            </Card>
          ) : (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <History />
                </EmptyMedia>
                <EmptyTitle>Sin sesiones registradas</EmptyTitle>
                <EmptyDescription>Este atleta aún no ha registrado entrenamientos.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </section>
      </div>
    </AppShell>
  )
}
