"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Users,
  Video,
  AlertTriangle,
  CalendarClock,
  CheckCircle,
  Zap,
  ArrowRight,
  Clock,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  stats,
  coachAlerts,
  blockUpdates,
  pendingPayments,
  pendingVideos,
  timeAgo,
  initialsOf,
  type PendingPayment,
} from "@/lib/data"
import { cn } from "@/lib/utils"

// --- Alertas Críticas ---
function CriticalAlertCard({ alert }: { alert: typeof coachAlerts[0] }) {
  const isStagnation = alert.type === "ESTANCAMIENTO"
  return (
    <div className="flex items-start gap-3 rounded-lg border border-danger/25 bg-danger/5 p-4">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-danger/15">
        <AlertTriangle className="size-4 text-danger" />
      </div>
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-card-foreground">{alert.athleteName}</span>
          <Badge className="text-[10px] bg-danger/15 text-danger border-0">
            {isStagnation ? "Estancamiento" : "Rutina Incompleta"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{alert.detail}</p>
        <p className="text-[11px] text-muted-foreground/60">Semana {alert.week} · {timeAgo(alert.createdAt)}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 border-danger/30 text-danger hover:bg-danger/10 hover:text-danger"
        nativeButton={false}
        render={<Link href={`/atletas/${alert.athleteId}`} />}
      >
        Ajustar Plan
      </Button>
    </div>
  )
}

// --- Bloque por vencer ---
function BlockUpdateCard({ block }: { block: typeof blockUpdates[0] }) {
  const urgency = block.daysLeft <= 3 ? "high" : block.daysLeft <= 7 ? "medium" : "low"
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        urgency === "high"   && "border-warning/30 bg-warning/5",
        urgency === "medium" && "border-warning/20 bg-warning/5",
        urgency === "low"    && "border-border bg-card",
      )}
    >
      <div className={cn(
        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
        urgency === "high"   && "bg-warning/15",
        urgency === "medium" && "bg-warning/10",
        urgency === "low"    && "bg-muted",
      )}>
        <CalendarClock className={cn(
          "size-4",
          urgency !== "low" ? "text-warning" : "text-muted-foreground",
        )} />
      </div>
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-card-foreground">{block.athleteName}</span>
          <Badge
            className={cn(
              "text-[10px] border-0",
              urgency !== "low"
                ? "bg-warning/15 text-warning"
                : "bg-muted text-muted-foreground",
            )}
          >
            {block.daysLeft === 1 ? "Mañana" : `${block.daysLeft} días`}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{block.blockName}</p>
        <p className="text-[11px] text-muted-foreground/60">
          Semana {block.currentWeek} de {block.totalWeeks}
        </p>
      </div>
      <Button
        size="sm"
        className="shrink-0 bg-warning/90 text-warning-foreground hover:bg-warning"
        nativeButton={false}
        render={<Link href={`/atletas/${block.athleteId}`} />}
      >
        Diseñar Siguiente
      </Button>
    </div>
  )
}

// --- Pago reportado ---
const methodColors: Record<string, string> = {
  "Zelle":         "bg-primary/10 text-primary",
  "Pago Móvil":    "bg-success/10 text-success",
  "Binance":       "bg-warning/10 text-warning",
  "Transferencia": "bg-muted text-muted-foreground",
}

function PaymentRow({ payment, onEnable }: { payment: PendingPayment; onEnable: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="text-[11px] bg-muted text-muted-foreground">
          {initialsOf(payment.athleteName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-card-foreground truncate">{payment.athleteName}</span>
        <div className="flex items-center gap-1.5">
          <Badge className={cn("text-[10px] border-0", methodColors[payment.method])}>
            {payment.method}
          </Badge>
          <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
            <Clock className="size-3" />
            {timeAgo(payment.reportedAt)}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        className="shrink-0 bg-success/90 text-success-foreground hover:bg-success"
        onClick={() => onEnable(payment.id)}
        nativeButton={false}
        render={<Link href={`/atletas/${payment.athleteId}/habilitar`} />}
      >
        <CheckCircle className="size-3.5" data-icon="inline-start" />
        Habilitar
      </Button>
    </div>
  )
}

// --- Dashboard Page ---
export default function DashboardPage() {
  const criticalAlerts = coachAlerts.filter((a) => !a.reviewed)
  const sortedBlocks = [...blockUpdates].sort((a, b) => a.daysLeft - b.daysLeft)
  const [payments, setPayments] = useState(pendingPayments)

  const trainingPercent = Math.round((stats.trainingToday / stats.totalCapacity) * 100)

  return (
    <AppShell title="Centro de Mando Operativo">
      <div className="flex flex-col gap-6">

        {/* Main 2-column area */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">

          {/* LEFT: Tabs Alertas / Bloques */}
          <Card className="flex flex-col">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Centro de Mando</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Atletas que necesitan tu atención ahora
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  {criticalAlerts.length > 0 && (
                    <Badge className="bg-danger/15 text-danger border-0 text-xs">
                      {criticalAlerts.length} activas
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 pt-4">
              <Tabs defaultValue="alertas">
                <TabsList className="w-full">
                  <TabsTrigger value="alertas" className="flex-1 gap-2">
                    <AlertTriangle className="size-3.5 text-danger" />
                    Alertas Críticas
                    {criticalAlerts.length > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-danger-foreground px-1">
                        {criticalAlerts.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="bloques" className="flex-1 gap-2">
                    <CalendarClock className="size-3.5 text-warning" />
                    Actualizaciones de Bloque
                    {sortedBlocks.length > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground px-1">
                        {sortedBlocks.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="alertas" className="flex flex-col gap-3 mt-4">
                  {criticalAlerts.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <CheckCircle className="size-8 text-success" />
                      <p className="text-sm font-medium text-card-foreground">Sin alertas críticas</p>
                      <p className="text-xs text-muted-foreground">Todos tus atletas van en buen camino.</p>
                    </div>
                  ) : (
                    criticalAlerts.map((a) => <CriticalAlertCard key={a.id} alert={a} />)
                  )}
                </TabsContent>

                <TabsContent value="bloques" className="flex flex-col gap-3 mt-4">
                  {sortedBlocks.map((b) => <BlockUpdateCard key={b.id} block={b} />)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* RIGHT: Validación de Accesos */}
          <Card className="flex flex-col">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Validación de Accesos</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Pagos reportados esperando habilitación
                  </CardDescription>
                </div>
                {payments.length > 0 && (
                  <Badge className="bg-success/15 text-success border-0 text-xs">
                    {payments.length} en cola
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              {payments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <CheckCircle className="size-8 text-success" />
                  <p className="text-sm font-medium text-card-foreground">Todo al día</p>
                  <p className="text-xs text-muted-foreground">No hay pagos pendientes.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {payments.map((p) => (
                    <PaymentRow
                      key={p.id}
                      payment={p}
                      onEnable={(id) => setPayments((prev) => prev.filter((x) => x.id !== id))}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* BOTTOM: Metrics row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Atletas activos hoy */}
          <Card>
            <CardContent className="flex items-start gap-4 pt-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <Users className="size-5 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Atletas activos hoy</p>
                    <p className="text-2xl font-bold text-card-foreground leading-none mt-1">
                      {stats.trainingToday}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/ {stats.totalCapacity}</span>
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-success">{trainingPercent}%</span>
                </div>
                <Progress value={trainingPercent} className="h-1.5" />
                <p className="text-[11px] text-muted-foreground">
                  {stats.totalCapacity - stats.trainingToday} cupos disponibles
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Videos por revisar */}
          <Card>
            <CardContent className="flex items-start gap-4 pt-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/15">
                <Video className="size-5 text-warning" />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-xs text-muted-foreground">Videos por revisar</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-card-foreground leading-none">
                    {stats.pendingVideosCount}
                  </p>
                  <Badge className="bg-warning/15 text-warning border-0 text-xs">Pendientes</Badge>
                </div>
                <div className="mt-2 flex flex-col gap-1.5">
                  {pendingVideos.slice(0, 3).map((v) => (
                    <div key={v.id} className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground truncate">{v.athleteName} — {v.exercise}</span>
                      <span className="text-muted-foreground/60 shrink-0 ml-2">{timeAgo(v.submittedAt)}</span>
                    </div>
                  ))}
                  {stats.pendingVideosCount > 3 && (
                    <p className="text-[11px] text-primary">+{stats.pendingVideosCount - 3} más</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceso rápido */}
          <Card>
            <CardContent className="flex flex-col justify-between gap-4 pt-5 h-full">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-primary" />
                  <p className="text-sm font-semibold text-card-foreground">Acceso rápido</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Acciones frecuentes del día</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-between"
                  nativeButton={false}
                  render={<Link href="/atletas" />}
                >
                  Ver todos los atletas
                  <ArrowRight className="size-3.5" data-icon="inline-end" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-between"
                  nativeButton={false}
                  render={<Link href="/alertas" />}
                >
                  Gestionar alertas
                  <ArrowRight className="size-3.5" data-icon="inline-end" />
                </Button>
                <Button
                  size="sm"
                  className="justify-between"
                  nativeButton={false}
                  render={<Link href="/atletas/nuevo" />}
                >
                  Registrar atleta
                  <ArrowRight className="size-3.5" data-icon="inline-end" />
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppShell>
  )
}
