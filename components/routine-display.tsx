"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { useAppStore, type ActiveBlock } from "@/lib/store"
import type { Routine } from "@/lib/data"

interface RoutineDisplayProps {
  routine: Routine | undefined
  athleteId?: string
  storeBlock?: ActiveBlock | null
}

export function RoutineDisplay({ routine, athleteId, storeBlock }: RoutineDisplayProps) {
  const router = useRouter()
  const { setPendingAthleteId } = useAppStore()

  const handleCreateRoutine = () => {
    if (athleteId) setPendingAthleteId(athleteId)
    router.push("/programacion/crear")
  }

  // ── Build a unified "days" structure regardless of source ──────────────────
  // Priority: store block (live assigned) > static routine (seed data)
  type DisplayDay = {
    label: string
    exercises: {
      name: string
      sets: string
      reps: string
      rest?: string
      notes?: string
      classification?: string
    }[]
  }

  let blockName: string | null = null
  let displayDays: DisplayDay[] = []

  if (storeBlock?.name) {
    blockName = storeBlock.name
    displayDays = (storeBlock.days ?? []).map((d) => ({
      label: d.label,
      exercises: d.exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        classification: ex.classification,
      })),
    }))
  } else if (routine) {
    blockName = routine.blockName
    displayDays = routine.days.map((d) => ({
      label: d.day,
      exercises: d.exercises.map((ex) => ({
        name: ex.name,
        sets: String(ex.sets),
        reps: ex.reps,
        rest: ex.rest,
        notes: ex.notes,
      })),
    }))
  }

  // ── No routine at all ──────────────────────────────────────────────────────
  if (!blockName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rutina Actual</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">Sin rutina asignada para este atleta.</p>
          <Button onClick={handleCreateRoutine} className="flex items-center gap-2">
            <Zap className="size-4" />
            Crear Rutina
          </Button>
        </CardContent>
      </Card>
    )
  }

  // ── Days with no exercises (block saved without filling exercises) ──────────
  const hasDays = displayDays.length > 0 && displayDays.some((d) => d.exercises.length > 0)

  if (!hasDays) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rutina Actual</CardTitle>
          <CardDescription className="text-xs mt-0.5">{blockName}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">Bloque asignado sin ejercicios cargados.</p>
          <Button onClick={handleCreateRoutine} variant="outline" className="flex items-center gap-2">
            <Zap className="size-4" />
            Editar Rutina
          </Button>
        </CardContent>
      </Card>
    )
  }

  // ── Full routine display (same layout for static & store) ──────────────────
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-base">Rutina Actual</CardTitle>
          <CardDescription className="text-xs mt-0.5">{blockName}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={displayDays[0]?.label ?? ""} className="w-full">
          <TabsList
            className="grid w-full"
            style={{ gridTemplateColumns: `repeat(${displayDays.length}, 1fr)` }}
          >
            {displayDays.map((day) => (
              <TabsTrigger key={day.label} value={day.label} className="text-xs">
                {day.label.length > 5 ? day.label.slice(0, 3) : day.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {displayDays.map((day) => (
            <TabsContent key={day.label} value={day.label} className="mt-4 space-y-3">
              {day.exercises.map((exercise, idx) => (
                <div key={idx} className="flex flex-col gap-2 rounded-lg border border-border/50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-card-foreground text-sm">{exercise.name}</h4>
                        {exercise.classification && (
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                            exercise.classification === "Principal"
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {exercise.classification === "Principal" ? "PRINC." : "ACCES."}
                          </span>
                        )}
                      </div>
                      {exercise.notes && (
                        <p className="text-xs text-muted-foreground mt-1 italic">{exercise.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {exercise.sets} x {exercise.reps}
                    </Badge>
                    {exercise.rest && (
                      <Badge variant="outline" className="text-xs">
                        Descanso: {exercise.rest}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
