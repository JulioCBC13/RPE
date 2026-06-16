import { Bell, TrendingUp } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AlertCard } from "@/components/alert-card"
import { AdjustmentCard } from "@/components/adjustment-card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { coachAlerts, progressionAdjustments } from "@/lib/data"

export default function AlertasPage() {
  return (
    <AppShell title="Alertas">
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-bold text-primary">Alertas de rendimiento</h2>
            <p className="text-sm text-muted-foreground">
              Atletas que requieren tu atención por estancamiento o rutinas incompletas.
            </p>
          </div>
          {coachAlerts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {coachAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bell />
                </EmptyMedia>
                <EmptyTitle>Sin alertas de rendimiento</EmptyTitle>
                <EmptyDescription>Todos tus atletas están al día. ¡Buen trabajo!</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </section>

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
