"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"

const EXERCISES = [
  { name: "COMP SQ", aliases: ["Competencia Sentadilla", "Squat Competencia"] },
  { name: "COMP BENCH", aliases: ["Competencia Banca", "Press Competencia"] },
  { name: "COMP DL", aliases: ["Competencia Peso Muerto", "Deadlift Comp"] },
  { name: "LOW BAR SQ", aliases: ["Sentadilla Baja", "Low Bar"] },
  { name: "HIGH BAR SQ", aliases: ["Sentadilla Alta", "High Bar"] },
  { name: "FRONT SQ", aliases: ["Sentadilla Frontal", "Front Squat"] },
  { name: "PAUSE SQ", aliases: ["Sentadilla Pausa", "Pause Squat"] },
  { name: "TEMPO SQ", aliases: ["Sentadilla Tempo", "Tempo Squat"] },
  { name: "FLAT BENCH", aliases: ["Banca Plana", "Press Banca"] },
  { name: "INCLINE BENCH", aliases: ["Banca Inclinada", "Press Inclinado"] },
  { name: "CLOSE GRIP BENCH", aliases: ["Banca Agarre Cerrado", "Close Grip"] },
  { name: "PAUSE BENCH", aliases: ["Banca Pausa", "Pause Press"] },
  { name: "CONV DL", aliases: ["Peso Muerto Convencional", "Deadlift Conv"] },
  { name: "SUMO DL", aliases: ["Peso Muerto Sumo", "Sumo Deadlift"] },
  { name: "RDL", aliases: ["Peso Muerto Rumano", "Romanian DL"] },
  { name: "STIFF LEG DL", aliases: ["Peso Muerto Pierna Rígida", "SLDL"] },
  { name: "BULGARAS", aliases: ["Bulgarian Split Squat", "Estocada Búlgara"] },
  { name: "LUNGES", aliases: ["Estocadas", "Caminata"] },
  { name: "LEG PRESS", aliases: ["Prensa de Pierna", "Leg Press Machine"] },
  { name: "LEG CURL", aliases: ["Curl de Pierna", "Isquiotibial"] },
  { name: "LEG EXT", aliases: ["Extensión de Pierna", "Cuádriceps"] },
  { name: "ROW", aliases: ["Remo", "Remada"] },
  { name: "PENDLAY ROW", aliases: ["Remo Pendlay", "Remo Barra"] },
  { name: "CABLE ROW", aliases: ["Remo Cable", "Remo Máquina"] },
  { name: "PULLDOWN", aliases: ["Lat Pulldown", "Jalón Frontal"] },
  { name: "PULL UP", aliases: ["Dominada", "Pull-up"] },
  { name: "OHP", aliases: ["Press Militar", "Overhead Press"] },
  { name: "DUMBBELL OHP", aliases: ["Press Mancuerna", "DB OHP"] },
  { name: "LATERAL RAISE", aliases: ["Elevación Lateral", "Shoulder Raise"] },
  { name: "FACE PULL", aliases: ["Face Pull", "Jalón Cara"] },
  { name: "TRICEP PUSHDOWN", aliases: ["Extensión Tríceps", "Pushdown"] },
  { name: "CURL", aliases: ["Curl Bíceps", "Flexión Barra"] },
  { name: "HIP THRUST", aliases: ["Empuje de Cadera", "Glute Bridge"] },
  { name: "GLUTE BRIDGE", aliases: ["Puente Glúteo", "Glute Bridge"] },
  { name: "AB WHEEL", aliases: ["Rueda Abdominal", "Ab Wheel"] },
]

// Fuzzy search simple pero efectivo
function fuzzySearch(query: string, text: string): number {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  if (textLower.includes(queryLower)) return 100

  let score = 0
  let queryIdx = 0
  for (let i = 0; i < textLower.length && queryIdx < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIdx]) {
      score += 10
      queryIdx++
    }
  }

  return queryIdx === queryLower.length ? score : -1
}

export function ExerciseCombobox({
  value,
  onChange,
  onCreateCustom,
  onTabNext,
}: {
  value: string
  onChange: (value: string) => void
  onCreateCustom?: (name: string) => void
  onTabNext?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Buscar ejercicios
  const filtered = search
    ? EXERCISES.filter((ex) => {
        const nameScore = fuzzySearch(search, ex.name)
        const aliasScores = ex.aliases.map((a) => fuzzySearch(search, a))
        return nameScore > 0 || aliasScores.some((s) => s > 0)
      })
        .sort((a, b) => {
          const scoreA = Math.max(
            fuzzySearch(search, a.name),
            Math.max(...a.aliases.map((al) => fuzzySearch(search, al)))
          )
          const scoreB = Math.max(
            fuzzySearch(search, b.name),
            Math.max(...b.aliases.map((al) => fuzzySearch(search, al)))
          )
          return scoreB - scoreA
        })
        .slice(0, 4)
    : EXERCISES.slice(0, 4)

  // Opción "crear personalizado" si no hay coincidencias exactas
  const hasExactMatch = search && EXERCISES.some((ex) => ex.name.toLowerCase() === search.toLowerCase())
  const showCreateOption = search && !hasExactMatch

  const allOptions = [...filtered, ...(showCreateOption ? [{ name: `+ Crear: "${search}"`, aliases: [] }] : [])]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault()
        setOpen(true)
        setSelected(0)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelected((prev) => (prev < allOptions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelected((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selected >= 0 && selected < allOptions.length) {
          const option = allOptions[selected]
          if (option.name.startsWith("+ Crear:")) {
            onCreateCustom?.(search)
            setOpen(false)
          } else {
            onChange(option.name)
            setSearch("")
            setOpen(false)
            setSelected(-1)
          }
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        setSelected(-1)
        break
      case "Tab":
        e.preventDefault()
        if (selected >= 0 && selected < allOptions.length) {
          const option = allOptions[selected]
          if (option.name.startsWith("+ Crear:")) {
            onCreateCustom?.(search)
          } else {
            onChange(option.name)
          }
        }
        setOpen(false)
        setSearch("")
        setSelected(-1)
        onTabNext?.()
        break
    }
  }

  useEffect(() => {
    if (open && selected >= 0 && selected < allOptions.length) {
      const element = document.querySelector(`[data-exercise-idx="${selected}"]`)
      element?.scrollIntoView({ block: "nearest" })
    }
  }, [selected, open, allOptions.length])

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        placeholder="EJERCICIO"
        value={search || value}
        onChange={(e) => {
          setSearch(e.target.value)
          setSelected(0)
          if (!open) setOpen(true)
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => !open && setOpen(true)}
        className="h-8 text-xs px-2 border-0 bg-muted/30 hover:bg-muted/50 focus:bg-muted/70"
      />

      {open && (
        <div
          className="absolute top-full left-0 right-0 z-50 w-48 mt-1 p-0 border-0 shadow-lg rounded-md bg-card/95 backdrop-blur-sm"
        >
          <Command className="rounded-none">
            <CommandList className="max-h-40">
              {allOptions.length === 0 ? (
                <CommandEmpty className="py-2 text-xs text-muted-foreground text-center">
                  Sin resultados
                </CommandEmpty>
              ) : (
                <CommandGroup className="overflow-hidden">
                  {allOptions.map((option, idx) => (
                    <CommandItem
                      key={idx}
                      value={option.name}
                      data-exercise-idx={idx}
                      onSelect={() => {
                        if (option.name.startsWith("+ Crear:")) {
                          onCreateCustom?.(search)
                        } else {
                          onChange(option.name)
                        }
                        setOpen(false)
                        setSearch("")
                        setSelected(-1)
                      }}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer",
                        selected === idx ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                      )}
                    >
                      {option.name.startsWith("+ Crear:") ? (
                        <>
                          <Plus className="size-3" />
                          <span className="truncate">{option.name}</span>
                        </>
                      ) : (
                        <>
                          {value === option.name && <Check className="size-3 shrink-0" />}
                          <span className="flex-1 truncate">{option.name}</span>
                        </>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
