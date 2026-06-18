"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import type { Routine } from "@/lib/data"

interface RoutineDisplayProps {
  routine: Routine | undefined
  athleteId?: string
}

export function RoutineDisplay({ routine, athleteId }: RoutineDisplayProps) {
  if (!routine) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rutina Actual</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">Sin rutina asignada para este atleta.</p>
          <Button 
            nativeButton={false} 
            render={<Link href="/programacion/crear" />}
            className="flex items-center gap-2"
          >
            <Zap className="size-4" />
            Crear Rutina
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-base">Rutina Actual</CardTitle>
          <CardDescription className="text-xs mt-0.5">{routine.blockName}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={routine.days[0]?.day || ""} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${routine.days.length}, 1fr)` }}>
            {routine.days.map((day) => (
              <TabsTrigger key={day.day} value={day.day} className="text-xs">
                {day.day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {routine.days.map((day) => (
            <TabsContent key={day.day} value={day.day} className="mt-4 space-y-3">
              <div className="space-y-3">
                {day.exercises.map((exercise, idx) => (
                  <div key={idx} className="flex flex-col gap-2 rounded-lg border border-border/50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-card-foreground text-sm">{exercise.name}</h4>
                        {exercise.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">{exercise.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {exercise.sets} x {exercise.reps}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Descanso: {exercise.rest}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
