"use client"

import { useState } from "react"
import { Bell, TrendingUp, Clock } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AlertCard } from "@/components/alert-card"
import { AdjustmentCard } from "@/components/adjustment-card"
import { AlertTypeChip } from "@/components/chips"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { coachAlerts, progressionAdjustments, timeAgo } from "@/lib/data"
import type { CoachAlert } from "@/lib/data"
import { Check } from "lucide-react"

export default function AlertasPage() {
  const [activeAlerts, setActiveAlerts] = useState<CoachAlert[]>(coachAlerts)
  const [reviewedHistory, setReviewedHistory] = useState<CoachAlert[]>([])

  function handleReviewed(alert: CoachAlert) {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alert.id))
    setReviewedHistory((prev) => {
      const next = [{ ...alert, reviewed: true }, ...prev]
      return next.slice(0, 20)
    })
  }

  return (
    <AppShell title="Alertas">
      <div className="flex flex-col gap-8">

        {/* Alertas de rendimiento + historial */}
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-bold text-primary">Alertas de rendimiento</h2>
            <p className="text-sm text-muted-foreground">
              Atletas que requieren tu atención por estancamiento o rutinas incompletas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
            {/* Lista de alertas activas */}
            <div className="flex flex-col gap-3">
              {activeAlerts.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{activeAlerts.length} pendiente{activeAlerts.length !== 1 ? "s" : ""}</Badge>
                </div>
              )}
              {activeAlerts.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Bell />
                    </EmptyMedia>
                    <EmptyTitle>Sin alertas de rendimiento</EmptyTitle>
                    <EmptyDescription>Todos tus atletas están al día. ¡Buen trabajo!</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeAlerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onReviewed={handleReviewed}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mini historial */}
            <Card className="h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="size-4" />
                  Historial
                </CardTitle>
                <CardDescription className="text-xs">
                  {reviewedHistory.length === 0
                    ? "Hasta 20 alertas revisadas"
                    : `${reviewedHistory.length} revisada${reviewedHistory.length !== 1 ? "s" : ""}`}
                </CardDescription>
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
                        <p className="text-xs font-medium text-card-foreground">{alert.athleteName}</p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{alert.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sugerencias de peso */}
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-bold text-primary">Sugerencias de peso</h2>
            <p className="text-sm text-muted-foreground">
              Ajustes de progresión recomendados según el rendimiento reciente.
            </p>
          </div>
          {progressionAdjustments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {progressionAdjustments.map((adj) => (
                <AdjustmentCard key={adj.id} adjustment={adj} />
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TrendingUp />
                </EmptyMedia>
                <EmptyTitle>Sin sugerencias de peso</EmptyTitle>
                <EmptyDescription>No hay ajustes de progresión pendientes por ahora.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </section>

      </div>
    </AppShell>
  )
}
