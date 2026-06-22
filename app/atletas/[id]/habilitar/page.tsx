"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { HabilitarForm } from "@/components/habilitar-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { getAthlete } from "@/lib/data"

export default function HabilitarPage() {
  const params = useParams()
  const id = params.id as string
  const { athletes } = useAppStore()
  const [athlete, setAthlete] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // First check in store (new athletes), then fallback to static data (existing athletes)
    const storeAthlete = athletes.find((a) => a.id === id)
    if (storeAthlete) {
      setAthlete(storeAthlete)
      return
    }

    const staticAthlete = getAthlete(id)
    if (staticAthlete) {
      setAthlete(staticAthlete)
      return
    }

    setNotFound(true)
  }, [id, athletes])

  if (notFound) {
    return (
      <AppShell title="Habilitar acceso">
        <div className="mx-auto w-full max-w-lg text-center py-16">
          <p className="text-muted-foreground">Atleta no encontrado</p>
        </div>
      </AppShell>
    )
  }

  if (!athlete) {
    return (
      <AppShell title="Habilitar acceso">
        <div className="mx-auto w-full max-w-lg">
          <div className="h-40 animate-pulse bg-muted rounded-lg" />
        </div>
      </AppShell>
    )
  }

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
