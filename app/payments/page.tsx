"use client"

import Link from "next/link"
import { useState } from "react"
import { CheckCircle, Clock, CreditCard } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { pendingPayments, timeAgo, initialsOf, type PendingPayment } from "@/lib/data"
import { cn } from "@/lib/utils"

const methodColors: Record<string, string> = {
  "Zelle":         "bg-primary/10 text-primary",
  "Pago Móvil":    "bg-success/10 text-success",
  "Binance":       "bg-warning/10 text-warning",
  "Transferencia": "bg-muted text-muted-foreground",
}

function PaymentRow({
  payment,
  onEnable,
}: {
  payment: PendingPayment
  onEnable: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30">
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
          {initialsOf(payment.athleteName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <span className="text-sm font-semibold text-card-foreground truncate">
          {payment.athleteName}
        </span>
        <div className="flex items-center gap-2">
          <Badge className={cn("text-[11px] border-0", methodColors[payment.method])}>
            {payment.method}
          </Badge>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3 shrink-0" />
            {timeAgo(payment.reportedAt)}
          </span>
        </div>
      </div>

      <Button
        size="sm"
        className="shrink-0 bg-success/90 text-success-foreground hover:bg-success"
        nativeButton={false}
        render={<Link href={`/atletas/${payment.athleteId}/habilitar`} />}
        onClick={() => onEnable(payment.id)}
      >
        <CheckCircle className="size-3.5" data-icon="inline-start" />
        Habilitar acceso
      </Button>
    </div>
  )
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PendingPayment[]>(pendingPayments)

  const handleEnable = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <AppShell title="Validación de Pagos">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Pagos pendientes de validar</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Al habilitar un pago se otorga acceso automáticamente al atleta
                </CardDescription>
              </div>
              {payments.length > 0 && (
                <Badge className="bg-success/15 text-success border-0">
                  {payments.length} en cola
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {payments.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="size-7 text-success" />
                </div>
                <p className="text-sm font-semibold text-card-foreground">Todo al día</p>
                <p className="text-xs text-muted-foreground">No hay pagos pendientes de validar.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {payments.map((p) => (
                  <PaymentRow key={p.id} payment={p} onEnable={handleEnable} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary card */}
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
              <CreditCard className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                {pendingPayments.length - payments.length} pagos validados esta sesión
              </p>
              <p className="text-xs text-muted-foreground">
                Cada habilitación concede acceso inmediato al plan del atleta
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
