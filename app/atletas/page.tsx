import Link from "next/link"
import { UserPlus, Users } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AthleteRow } from "@/components/athlete-row"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
  return (
    <AppShell title="Atletas">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Atletas</h1>
          <Button nativeButton={false} render={<Link href="/atletas/nuevo" />}>
            <UserPlus data-icon="inline-start" />
            Registrar atleta
          </Button>
        </div>

        {athletes.length > 0 ? (
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
                  {athletes.map((athlete) => (
                    <AthleteRow key={athlete.id} athlete={athlete} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
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
        )}
      </div>
    </AppShell>
  )
}
