import Link from "next/link"
import { Users, AlertTriangle, CalendarX, ArrowRight, UserPlus } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { AlertTypeChip } from "@/components/chips"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { stats, coachAlerts, timeAgo } from "@/lib/data"

export default function DashboardPage() {
  const recentAlerts = [...coachAlerts]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5)

  return (
    <AppShell title="Dashboard">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Atletas activos" value={stats.activeAthletes} variant="success" icon={Users} />
          <StatCard
            label="Alertas rojas"
            value={stats.redAlerts}
            variant="danger"
            icon={AlertTriangle}
            highlightWhenPositive
          />
          <StatCard
            label="Accesos expirados"
            value={stats.expiredAccess}
            variant="warning"
            icon={CalendarX}
            highlightWhenPositive
          />
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Alertas recientes</CardTitle>
            <Button variant="link" size="sm" nativeButton={false} render={<Link href="/alertas" />}>
              Ver todas
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atleta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Hace</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium text-card-foreground">{alert.athleteName}</TableCell>
                      <TableCell>
                        <AlertTypeChip type={alert.type} />
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">{alert.detail}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{timeAgo(alert.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" size="sm" nativeButton={false} render={<Link href={`/atletas/${alert.athleteId}`} />}>
                          Ver atleta
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Button nativeButton={false} render={<Link href="/atletas/nuevo" />}>
            <UserPlus data-icon="inline-start" />
            Registrar atleta
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/alertas" />}>
            Ver todas las alertas
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
