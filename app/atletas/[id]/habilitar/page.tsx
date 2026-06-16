import { notFound } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { HabilitarForm } from "@/components/habilitar-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getAthlete } from "@/lib/data"

export default async function HabilitarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const athlete = getAthlete(id)
  if (!athlete) notFound()

  return (
    <AppShell title="Habilitar acceso">
      <div className="mx-auto w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Habilitar acceso</CardTitle>
            <CardDescription>{athlete.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <HabilitarForm athleteId={athlete.id} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
