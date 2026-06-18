"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { athletes } from "@/lib/data"
import { Plus, Copy, Save, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

type Row = {
  id: string
  exercise: string
  sets: string
  reps: string
  rpe: string
  load: string
  notes: string
}

type Day = {
  id: string
  label: string
  weekday: string
  rows: Row[]
}

const EXERCISES = [
  "Sentadilla baja barra",
  "Sentadilla frontal",
  "Press de banca",
  "Press inclinado mancuernas",
  "Peso muerto convencional",
  "Peso muerto rumano",
  "Remo pendlay",
  "Remo con mancuerna",
  "Press militar",
  "Dominadas lastradas",
  "Hip thrust",
  "Curl de bíceps",
  "Extensión de tríceps",
  "Elevaciones laterales",
]

let rid = 0
const newRow = (partial?: Partial<Row>): Row => ({
  id: `r${rid++}`,
  exercise: "",
  sets: "",
  reps: "",
  rpe: "",
  load: "",
  notes: "",
  ...partial,
})

const initialDays: Day[] = [
  {
    id: "d1",
    label: "Día 1",
    weekday: "Lunes",
    rows: [
      newRow({ exercise: "Sentadilla baja barra", sets: "4", reps: "5", rpe: "RPE 8", load: "120 kg", notes: "Pausa 1s" }),
      newRow({ exercise: "Press de banca", sets: "4", reps: "6", rpe: "RPE 7.5", load: "82.5 kg", notes: "" }),
      newRow({ exercise: "Remo pendlay", sets: "3", reps: "8", rpe: "RPE 8", load: "70 kg", notes: "Explosivo" }),
    ],
  },
  {
    id: "d2",
    label: "Día 2",
    weekday: "Miércoles",
    rows: [
      newRow({ exercise: "Peso muerto convencional", sets: "3", reps: "4", rpe: "RPE 8", load: "160 kg", notes: "" }),
      newRow({ exercise: "Press militar", sets: "4", reps: "8", rpe: "RIR 2", load: "50 kg", notes: "Estricto" }),
    ],
  },
  {
    id: "d3",
    label: "Día 3",
    weekday: "Viernes",
    rows: [
      newRow({ exercise: "Sentadilla frontal", sets: "4", reps: "6", rpe: "RPE 7", load: "90 kg", notes: "" }),
      newRow({ exercise: "Dominadas lastradas", sets: "4", reps: "6", rpe: "RIR 2", load: "+15 kg", notes: "" }),
    ],
  },
]

const COLS = [
  { key: "exercise", label: "Ejercicio", className: "w-[28%]" },
  { key: "sets", label: "Series", className: "w-[9%]" },
  { key: "reps", label: "Reps", className: "w-[9%]" },
  { key: "rpe", label: "RPE / RIR", className: "w-[13%]" },
  { key: "load", label: "Carga objetivo", className: "w-[15%]" },
  { key: "notes", label: "Notas", className: "" },
] as const

export function ProgramacionWorkspace() {
  const [athleteId, setAthleteId] = useState(athletes[0].id)
  const [days, setDays] = useState<Day[]>(initialDays)

  const athlete = athletes.find((a) => a.id === athleteId)

  function updateCell(dayId: string, rowId: string, key: keyof Row, value: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.id !== dayId
          ? d
          : { ...d, rows: d.rows.map((r) => (r.id === rowId ? { ...r, [key]: value } : r)) },
      ),
    )
  }

  function addRow(dayId: string) {
    setDays((prev) => prev.map((d) => (d.id === dayId ? { ...d, rows: [...d.rows, newRow()] } : d)))
  }

  function deleteRow(dayId: string, rowId: string) {
    setDays((prev) =>
      prev.map((d) => (d.id !== dayId ? d : { ...d, rows: d.rows.filter((r) => r.id !== rowId) })),
    )
  }

  function duplicateDay(dayId: string) {
    setDays((prev) => {
      const idx = prev.findIndex((d) => d.id === dayId)
      if (idx === -1) return prev
      const src = prev[idx]
      const copy: Day = {
        id: `d${Date.now()}`,
        label: `Día ${prev.length + 1}`,
        weekday: "Nuevo",
        rows: src.rows.map((r) => newRow({ ...r })),
      }
      return [...prev, copy]
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Top bar: athlete + mesociclo */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Atleta</label>
            <Select value={athleteId} onValueChange={(v) => setAthleteId(v as string)}>
              <SelectTrigger className="w-56">
                <SelectValue>{() => athlete?.name}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {athletes.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Bloque / Mesociclo</label>
            <div className="flex items-center gap-1 rounded-md border border-border bg-background px-1 py-1">
              <Button variant="ghost" size="icon" className="size-7" aria-label="Bloque anterior">
                <ChevronLeft className="size-4" />
              </Button>
              <span className="px-2 text-sm font-medium text-card-foreground">
                Bloque de Acumulación · Semana 1
              </span>
              <Button variant="ghost" size="icon" className="size-7" aria-label="Bloque siguiente">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button>
          <Save className="size-4" data-icon="inline-start" />
          Guardar bloque como plantilla
        </Button>
      </div>

      {/* Day sheets */}
      <div className="flex flex-col gap-5">
        {days.map((day) => (
          <div key={day.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-card-foreground">{day.label}</span>
                <span className="text-xs text-muted-foreground">{day.weekday}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => addRow(day.id)}>
                  <Plus className="size-3.5" data-icon="inline-start" />
                  Añadir fila
                </Button>
                <Button variant="outline" size="sm" onClick={() => duplicateDay(day.id)}>
                  <Copy className="size-3.5" data-icon="inline-start" />
                  Duplicar día
                </Button>
              </div>
            </div>

            {/* Spreadsheet */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left">
                    {COLS.map((c) => (
                      <th
                        key={c.key}
                        className={`border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${c.className}`}
                      >
                        {c.label}
                      </th>
                    ))}
                    <th className="w-10 border-b border-border" aria-label="Acciones" />
                  </tr>
                </thead>
                <tbody>
                  {day.rows.map((row) => (
                    <tr key={row.id} className="group">
                      {COLS.map((c) => (
                        <td key={c.key} className="border-b border-border/60 p-0">
                          <input
                            value={row[c.key]}
                            onChange={(e) => updateCell(day.id, row.id, c.key, e.target.value)}
                            list={c.key === "exercise" ? "exercise-list" : undefined}
                            placeholder={c.key === "exercise" ? "Buscar ejercicio…" : ""}
                            className="w-full bg-transparent px-3 py-2 text-card-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:bg-primary/5 focus:ring-1 focus:ring-inset focus:ring-primary"
                          />
                        </td>
                      ))}
                      <td className="border-b border-border/60 text-center">
                        <button
                          type="button"
                          onClick={() => deleteRow(day.id, row.id)}
                          className="inline-flex size-7 items-center justify-center rounded text-muted-foreground/50 opacity-0 transition hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                          aria-label="Eliminar fila"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <datalist id="exercise-list">
        {EXERCISES.map((ex) => (
          <option key={ex} value={ex} />
        ))}
      </datalist>
    </div>
  )
}
