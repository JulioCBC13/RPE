"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { CalendarClock } from "lucide-react"
import { useAppStore } from "@/lib/store"

const durations = [
  { value: "1", label: "1 mes" },
  { value: "3", label: "3 meses" },
  { value: "6", label: "6 meses" },
]

export function HabilitarForm({ athleteId }: { athleteId: string }) {
  const router = useRouter()
  const { athletes, setAthleteStatus } = useAppStore()
  const [duration, setDuration] = useState<string>("1")
  const [linkTemplate, setLinkTemplate] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const accessUntil = useMemo(() => {
    const months = Number.parseInt(duration, 10)
    const d = new Date("2026-06-16T12:00:00Z")
    d.setMonth(d.getMonth() + months)
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
  }, [duration])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    
    // Update athlete status in store if it's a new athlete
    const athlete = athletes.find((a) => a.id === athleteId)
    if (athlete && athlete.status === "sin_acceso") {
      setAthleteStatus(athleteId, "activo")
    }
    
    router.push(`/atletas/${athleteId}`)
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>Duración del acceso</FieldLabel>
          <ToggleGroup
            value={[duration]}
            onValueChange={(value) => {
              if (value[0]) setDuration(value[0])
            }}
            variant="outline"
            spacing={0}
          >
            {durations.map((d) => (
              <ToggleGroupItem key={d.value} value={d.value} className="flex-1 px-4">
                {d.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>

        <Field>
          <FieldLabel htmlFor="payment">Referencia de pago</FieldLabel>
          <Input id="payment" name="payment" placeholder="Opcional — ej. TRX-00921" />
        </Field>
      </FieldGroup>

      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <CalendarClock className="size-4" />
          Acceso hasta
        </span>
        <span className="text-sm font-semibold text-card-foreground tabular-nums">{accessUntil}</span>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 px-3 py-2.5">
        <div className="flex flex-col">
          <label htmlFor="link-template" className="text-sm text-card-foreground">
            Vincular plantilla base
          </label>
          <span className="text-xs text-muted-foreground">Opcional para clientes recreativos</span>
        </div>
        <Switch id="link-template" checked={linkTemplate} onCheckedChange={setLinkTemplate} />
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          Confirmar y habilitar
        </Button>
        <Button variant="link" size="sm" className="mx-auto" nativeButton={false} render={<Link href={`/atletas/${athleteId}`} />}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
