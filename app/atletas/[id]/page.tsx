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
import { AthleteProfileClient } from "@/components/athlete-profile-client"

export default async function AthleteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Try static data first
  const athlete = getAthlete(id)
  
  // If not found and ID is dynamic (created at runtime), use client component to look in store
  if (!athlete && id.startsWith("created-")) {
    return <AthleteProfileClient athleteId={id} />
  }
  
  // If not found at all
  if (!athlete) {
    notFound()
  }

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

            <Button size="sm" className="w-fit">
              {actionLabel} acceso
            </Button>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <WeightProgressChart entries={athleteWeightProgress[athlete.id] || []} athleteName={athlete.name} />
          <RoutineDisplay routine={athleteRoutines[athlete.id]} athleteId={athlete.id} />
        </section>

        <section className="grid grid-cols-1 gap-5">
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
