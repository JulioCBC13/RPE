"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { athletes as staticAthletes } from "@/lib/data"
import { useAppStore } from "@/lib/store"
import { CalendarCheck, ChevronLeft, ChevronRight, Lock, Unlock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// ---------- Types ----------
type Serie = { load: string; reps: string; rpe: string }

type ExerciseRow = {
  id: string
  name: string
  // Preparante (coach plan)
  prepLoad: string
  prepSets: string
  prepReps: string
  prepRpe: string
  // Descanso
  rest: string
  // Protocolo history (previous week athlete results)
  history: Serie[]
}

type Week = {
  week: number
  rows: ExerciseRow[]
}

type Block = {
  id: string
  name: string
  totalWeeks: number
  weeks: Week[]
}

// ---------- Mock data ----------
const BLOCK_EXERCISES = [
  "COMP SQ",
  "SPOTO BP",
  "PENDLAY ROW",
  "PAUSA SQ",
  "CLOSE GRIP BP",
  "RDL",
  "OHP",
]

let _eid = 0
function mkRow(
  name: string,
  prep: { load: string; sets: string; reps: string; rpe: string },
  rest: string,
  history: Serie[],
): ExerciseRow {
  return {
    id: `e${_eid++}`,
    name,
    prepLoad: prep.load,
    prepSets: prep.sets,
    prepReps: prep.reps,
    prepRpe: prep.rpe,
    rest,
    history,
  }
}

const MOCK_BLOCKS: Block[] = [
  {
    id: "b4",
    name: "Bloque 4",
    totalWeeks: 4,
    weeks: [
      {
        week: 1,
        rows: [
          mkRow("COMP SQ",      { load: "120", sets: "4", reps: "5", rpe: "7"   }, "3-4 min", []),
          mkRow("SPOTO BP",     { load: "90",  sets: "4", reps: "6", rpe: "7"   }, "3-4 min", []),
          mkRow("PENDLAY ROW",  { load: "80",  sets: "4", reps: "6", rpe: "7"   }, "2-3 min", []),
          mkRow("PAUSA SQ",     { load: "100", sets: "3", reps: "3", rpe: "6.5" }, "3 min",   []),
          mkRow("CLOSE GRIP BP",{ load: "75",  sets: "3", reps: "8", rpe: "7"   }, "2 min",   []),
          mkRow("RDL",          { load: "110", sets: "3", reps: "8", rpe: "7"   }, "2-3 min", []),
          mkRow("OHP",          { load: "55",  sets: "3", reps: "8", rpe: "7"   }, "2 min",   []),
        ],
      },
      {
        week: 2,
        rows: [
          mkRow("COMP SQ",      { load: "125", sets: "4", reps: "4", rpe: "7.5" }, "3-4 min",
            [{ load: "122.5", reps: "5", rpe: "7" }, { load: "122.5", reps: "5", rpe: "7.5" }, { load: "120",   reps: "5", rpe: "7.5" }, { load: "120",   reps: "5", rpe: "8"   }]),
          mkRow("SPOTO BP",     { load: "92.5",sets: "4", reps: "5", rpe: "7.5" }, "3-4 min",
            [{ load: "90",   reps: "6", rpe: "7" }, { load: "90",   reps: "6", rpe: "7"   }, { load: "90",   reps: "6", rpe: "7.5" }, { load: "87.5", reps: "6", rpe: "7.5" }]),
          mkRow("PENDLAY ROW",  { load: "82.5",sets: "4", reps: "6", rpe: "7.5" }, "2-3 min",
            [{ load: "80",   reps: "6", rpe: "7" }, { load: "80",   reps: "6", rpe: "7.5" }, { load: "80",   reps: "6", rpe: "7.5" }, { load: "77.5", reps: "6", rpe: "7.5" }]),
          mkRow("PAUSA SQ",     { load: "102.5",sets: "3",reps: "3",rpe: "7"   }, "3 min",
            [{ load: "100",  reps: "3", rpe: "6.5"},{ load: "100",  reps: "3", rpe: "7"   },{ load: "97.5", reps: "3", rpe: "7"   }]),
          mkRow("CLOSE GRIP BP",{ load: "77.5",sets: "3", reps: "7", rpe: "7.5" }, "2 min",
            [{ load: "75",   reps: "8", rpe: "7" }, { load: "75",   reps: "8", rpe: "7.5" }, { load: "72.5", reps: "8", rpe: "7.5" }]),
          mkRow("RDL",          { load: "112.5",sets: "3",reps: "7",rpe: "7.5" }, "2-3 min",
            [{ load: "110",  reps: "8", rpe: "7" }, { load: "110",  reps: "8", rpe: "7.5" }, { load: "107.5",reps: "8", rpe: "7.5" }]),
          mkRow("OHP",          { load: "57.5",sets: "3", reps: "7", rpe: "7.5" }, "2 min",
            [{ load: "55",   reps: "8", rpe: "7" }, { load: "55",   reps: "8", rpe: "7.5" }, { load: "52.5", reps: "8", rpe: "7.5" }]),
        ],
      },
      {
        week: 3,
        rows: [
          mkRow("COMP SQ",      { load: "130", sets: "5", reps: "3", rpe: "8"   }, "3-4 min",
            [{ load: "127.5", reps: "4", rpe: "7.5"},{ load: "127.5", reps: "4", rpe: "8" },{ load: "125",   reps: "4", rpe: "8" },{ load: "125",   reps: "4", rpe: "8.5"}]),
          mkRow("SPOTO BP",     { load: "95",  sets: "5", reps: "4", rpe: "8"   }, "3-4 min",
            [{ load: "92.5",  reps: "5", rpe: "7.5"},{ load: "92.5",  reps: "5", rpe: "8" },{ load: "92.5",  reps: "5", rpe: "8" },{ load: "90",    reps: "5", rpe: "8.5"}]),
          mkRow("PENDLAY ROW",  { load: "85",  sets: "4", reps: "5", rpe: "8"   }, "2-3 min",
            [{ load: "82.5",  reps: "6", rpe: "7.5"},{ load: "82.5",  reps: "6", rpe: "8" },{ load: "80",    reps: "6", rpe: "8" },{ load: "80",    reps: "6", rpe: "8.5"}]),
          mkRow("PAUSA SQ",     { load: "105", sets: "3", reps: "3", rpe: "7.5" }, "3 min",
            [{ load: "102.5", reps: "3", rpe: "7"},{ load: "102.5", reps: "3", rpe: "7.5"},{ load: "100",   reps: "3", rpe: "7.5"}]),
          mkRow("CLOSE GRIP BP",{ load: "80",  sets: "3", reps: "6", rpe: "8"   }, "2 min",
            [{ load: "77.5",  reps: "7", rpe: "7.5"},{ load: "77.5",  reps: "7", rpe: "8" },{ load: "75",    reps: "7", rpe: "8" }]),
          mkRow("RDL",          { load: "115", sets: "3", reps: "6", rpe: "8"   }, "2-3 min",
            [{ load: "112.5", reps: "7", rpe: "7.5"},{ load: "112.5", reps: "7", rpe: "8" },{ load: "110",   reps: "7", rpe: "8" }]),
          mkRow("OHP",          { load: "60",  sets: "3", reps: "6", rpe: "8"   }, "2 min",
            [{ load: "57.5",  reps: "7", rpe: "7.5"},{ load: "57.5",  reps: "7", rpe: "8" },{ load: "55",    reps: "7", rpe: "8" }]),
        ],
      },
      {
        week: 4,
        rows: BLOCK_EXERCISES.map((name) =>
          mkRow(name, { load: "", sets: "", reps: "", rpe: "" }, "3-4 min", [])
        ),
      },
    ],
  },
  {
    id: "b3",
    name: "Bloque 3",
    totalWeeks: 4,
    weeks: Array.from({ length: 4 }, (_, i) => ({
      week: i + 1,
      rows: BLOCK_EXERCISES.map((name) =>
        mkRow(name, { load: "—", sets: "—", reps: "—", rpe: "—" }, "3-4 min", [])
      ),
    })),
  },
]

// ---------- Cell Component ----------
function Cell({
  value,
  onChange,
  locked,
  placeholder,
  ghost,
  align = "left",
  tabIndex,
  onKeyDown,
  inputRef,
}: {
  value: string
  onChange?: (v: string) => void
  locked?: boolean
  placeholder?: string
  ghost?: boolean
  align?: "left" | "right" | "center"
  tabIndex?: number
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  inputRef?: React.Ref<HTMLInputElement>
}) {
  if (ghost) {
    return (
      <td className="border-b border-border/40 px-2 py-1.5 align-top">
        <span className="block whitespace-pre-wrap text-[11px] leading-[1.4] text-muted-foreground/50 italic">
          {value || "—"}
        </span>
      </td>
    )
  }
  return (
    <td className="border-b border-border/40 p-0">
      <input
        ref={inputRef}
        value={value}
        readOnly={locked}
        tabIndex={locked ? -1 : tabIndex}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={locked ? undefined : placeholder}
        className={cn(
          "w-full bg-transparent px-2 py-1.5 text-xs outline-none transition-colors",
          "placeholder:text-muted-foreground/35",
          align === "center" && "text-center",
          align === "right" && "text-right",
          locked
            ? "cursor-default text-card-foreground/60"
            : "text-card-foreground focus:bg-primary/10 focus:ring-1 focus:ring-inset focus:ring-primary",
        )}
      />
    </td>
  )
}

// ---------- Main Component ----------
export function ProgramacionWorkspace() {
  const { athletes: storeAthletes } = useAppStore()

  // Merge store athletes (may have newly assigned blocks) with static list
  const athletes = [
    ...storeAthletes,
    ...staticAthletes
      .filter((a) => !storeAthletes.find((s) => s.id === a.id))
      .map((a) => ({ id: a.id, name: a.name, email: a.email, status: a.status as "activo" | "expirado" | "sin_acceso", block: null as null | { name: string; weeks: number; createdAt: string } })),
  ]

  const [athleteId, setAthleteId] = useState(athletes[0]?.id ?? "")
  const [blockIdx, setBlockIdx] = useState(0)
  const [weekNum, setWeekNum] = useState(1)
  const [locked, setLocked] = useState(true)
  const [blocks, setBlocks] = useState<Block[]>(MOCK_BLOCKS)

  const tableRef = useRef<HTMLTableElement>(null)

  const athlete = athletes.find((a) => a.id === athleteId)
  // Store athletes (s1/s2/s3) only show the table if they have a block assigned.
  // Static athletes (a1–a4) always show the table (they have MOCK_BLOCKS data).
  const isStoreAthlete = athleteId.startsWith("s")
  const athleteHasStoreBlock = !isStoreAthlete || !!athlete?.block
  const block = blocks[blockIdx]
  const weekData = block.weeks.find((w) => w.week === weekNum)!
  const prevWeekData = block.weeks.find((w) => w.week === weekNum - 1)

  function updateCell(rowId: string, field: keyof ExerciseRow, value: string) {
    setBlocks((prev) =>
      prev.map((b, bi) =>
        bi !== blockIdx
          ? b
          : {
              ...b,
              weeks: b.weeks.map((w) =>
                w.week !== weekNum
                  ? w
                  : {
                      ...w,
                      rows: w.rows.map((r) =>
                        r.id !== rowId ? r : { ...r, [field]: value }
                      ),
                    }
              ),
            }
      )
    )
  }

  function planNextWeek() {
    const nextWeek = weekNum + 1
    if (nextWeek > block.totalWeeks) return
    setBlocks((prev) =>
      prev.map((b, bi) => {
        if (bi !== blockIdx) return b
        const currentRows = b.weeks.find((w) => w.week === weekNum)!.rows
        return {
          ...b,
          weeks: b.weeks.map((w) => {
            if (w.week !== nextWeek) return w
            return {
              ...w,
              rows: w.rows.map((r, i) => ({
                ...r,
                name: currentRows[i]?.name ?? r.name,
                prepLoad: "",
                prepSets: currentRows[i]?.prepSets ?? "",
                prepReps: currentRows[i]?.prepReps ?? "",
                prepRpe: "",
              })),
            }
          }),
        }
      })
    )
    setWeekNum(nextWeek)
    setLocked(false)
  }

  // Tab key: move between prep inputs only
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIdx: number,
    colIdx: number,
  ) {
    if (e.key !== "Tab" && e.key !== "ArrowRight" && e.key !== "ArrowLeft" &&
        e.key !== "ArrowDown" && e.key !== "ArrowUp") return

    e.preventDefault()
    const PREP_COLS = 4 // load, sets, reps, rpe
    let nextRow = rowIdx
    let nextCol = colIdx

    if (e.key === "Tab" || e.key === "ArrowRight") {
      nextCol = colIdx + 1
      if (nextCol >= PREP_COLS) { nextCol = 0; nextRow = rowIdx + 1 }
    } else if (e.key === "ArrowLeft") {
      nextCol = colIdx - 1
      if (nextCol < 0) { nextCol = PREP_COLS - 1; nextRow = rowIdx - 1 }
    } else if (e.key === "ArrowDown") {
      nextRow = rowIdx + 1
    } else if (e.key === "ArrowUp") {
      nextRow = rowIdx - 1
    }

    nextRow = Math.max(0, Math.min(nextRow, weekData.rows.length - 1))
    nextCol = Math.max(0, Math.min(nextCol, PREP_COLS - 1))

    const cell = tableRef.current?.querySelector<HTMLInputElement>(
      `[data-row="${nextRow}"][data-col="${nextCol}"]`
    )
    cell?.focus()
  }

  const isLastWeek = weekNum === block.totalWeeks
  const canPlanNext = weekNum < block.totalWeeks

  return (
    <div className="flex flex-col gap-4">
      {/* ── Block Control Header ── */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex flex-wrap items-end gap-4">
          {/* Atleta */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Atleta
            </span>
            <Select value={athleteId} onValueChange={(v) => { setAthleteId(v); setBlockIdx(0); setWeekNum(1) }}>
              <SelectTrigger className="h-8 w-52 text-xs">
                <SelectValue>{() => athlete?.name ?? "Seleccionar atleta"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {athletes.map((a) => (
                    <SelectItem key={a.id} value={a.id} className="text-xs">
                      <span>{a.name}</span>
                      {a.block && (
                        <span className="ml-1.5 text-[10px] text-success">— {a.block.name}</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Bloque */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Bloque
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setBlockIdx((i) => Math.max(0, i - 1))}
                className="flex size-8 items-center justify-center rounded border border-border bg-background text-muted-foreground transition hover:text-card-foreground"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="px-3 text-xs font-semibold text-card-foreground">
                {block.name}
              </span>
              <button
                onClick={() => setBlockIdx((i) => Math.min(blocks.length - 1, i + 1))}
                className="flex size-8 items-center justify-center rounded border border-border bg-background text-muted-foreground transition hover:text-card-foreground"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Lock toggle */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setLocked((l) => !l)}
              className={cn(
                "flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-[11px] font-medium transition",
                locked
                  ? "border-border bg-muted text-muted-foreground hover:text-card-foreground"
                  : "border-primary/40 bg-primary/10 text-primary"
              )}
            >
              {locked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
              {locked ? "Bloqueado" : "Editando"}
            </button>

            {canPlanNext && (
              <Button size="sm" className="h-8 text-xs" onClick={planNextWeek}>
                <CalendarCheck className="size-3.5" data-icon="inline-start" />
                Planificar Semana {weekNum + 1}
              </Button>
            )}
          </div>
        </div>

        {/* ── Empty state: athlete without block ── */}
        {!athleteHasStoreBlock && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="size-7 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-card-foreground">
                Este atleta no tiene un bloque activo
              </p>
              <p className="text-xs text-muted-foreground">
                Ve a &quot;Crear Bloque&quot; para asignarle uno y comenzar a programar sus semanas.
              </p>
            </div>
            <Link
              href="/programacion/crear"
              className="inline-flex h-9 items-center gap-2 rounded bg-primary px-4 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
            >
              Ir a Crear Bloque
            </Link>
          </div>
        )}

      {/* Week selector */}
        <div className={cn("flex gap-1", !athleteHasStoreBlock && "hidden")}>
          {block.weeks.map((w) => {
            const active = w.week === weekNum
            const hasData = w.rows.some((r) => r.prepLoad !== "")
            return (
              <button
                key={w.week}
                onClick={() => setWeekNum(w.week)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded py-1.5 transition",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted text-muted-foreground hover:text-card-foreground"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  S{w.week}
                </span>
                <div className="flex gap-0.5">
                  <span className={cn(
                    "rounded-sm px-1 py-px text-[8px] font-semibold uppercase",
                    active ? "bg-white/20" : "bg-success/20 text-success"
                  )}>
                    Plan
                  </span>
                  <span className={cn(
                    "rounded-sm px-1 py-px text-[8px] font-semibold uppercase",
                    active ? "bg-white/20" : hasData ? "bg-muted-foreground/20 text-muted-foreground" : "opacity-40 bg-muted text-muted-foreground"
                  )}>
                    Prot.
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className={cn("overflow-x-auto rounded-lg border border-border bg-card", !athleteHasStoreBlock && "hidden")}>
        <table ref={tableRef} className="w-full min-w-[860px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              {/* Ejercicio */}
              <th className="w-[16%] border-r border-border px-2 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Ejercicio
              </th>
              {/* Preparante group */}
              <th
                colSpan={4}
                className="border-r border-border px-2 py-2 text-center text-[10px] font-bold uppercase tracking-widest text-success"
              >
                Objetivo del Coach — Preparante
              </th>
              {/* Historial */}
              <th className="border-r border-border px-2 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Historial en Vivo (semana anterior)
              </th>
              {/* Descanso */}
              <th className="px-2 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Descanso
              </th>
            </tr>
            <tr className="border-b border-border bg-muted/30">
              <th className="border-r border-border px-2 py-1" />
              {["Carga (kg)", "Series", "Reps", "RPE"].map((h) => (
                <th
                  key={h}
                  className="px-2 py-1 text-center text-[9px] font-semibold uppercase tracking-widest text-success/70"
                >
                  {h}
                </th>
              ))}
              <th className="border-x border-border px-2 py-1 text-[9px] font-semibold text-muted-foreground/50">
                Protocolo anterior (referencia)
              </th>
              <th className="px-2 py-1" />
            </tr>
          </thead>
          <tbody>
            {weekData.rows.map((row, rowIdx) => {
              const prev = prevWeekData?.rows[rowIdx]
              const historyText = prev?.history.length
                ? prev.history
                    .map((s, i) => `S${i + 1}: ${s.load}kg×${s.reps} @RPE${s.rpe}`)
                    .join("  |  ")
                : prev?.prepLoad && prev.prepLoad !== "" && prev.prepLoad !== "—"
                ? `Plan: ${prev.prepLoad}kg × ${prev.prepReps} — ${prev.prepSets} series`
                : ""

              return (
                <tr
                  key={row.id}
                  className={cn(
                    "group",
                    rowIdx % 2 === 0 ? "bg-card" : "bg-muted/10"
                  )}
                >
                  {/* Ejercicio (locked) */}
                  <td className="border-b border-r border-border/40 px-2 py-1.5">
                    <span className="text-xs font-semibold tracking-wide text-card-foreground/90">
                      {row.name}
                    </span>
                  </td>

                  {/* Preparante inputs */}
                  {(["prepLoad", "prepSets", "prepReps", "prepRpe"] as const).map((field, colIdx) => (
                    <td key={field} className="border-b border-border/40 p-0">
                      <input
                        data-row={rowIdx}
                        data-col={colIdx}
                        value={row[field]}
                        readOnly={locked}
                        tabIndex={locked ? -1 : 0}
                        onChange={(e) => updateCell(row.id, field, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                        placeholder={locked ? "—" : ""}
                        className={cn(
                          "w-full bg-transparent px-2 py-1.5 text-center text-xs outline-none transition-colors",
                          "placeholder:text-muted-foreground/30",
                          locked
                            ? "cursor-default text-card-foreground/70"
                            : "text-card-foreground focus:bg-primary/10 focus:ring-1 focus:ring-inset focus:ring-primary"
                        )}
                      />
                    </td>
                  ))}

                  {/* Historial ghost */}
                  <td className="border-b border-x border-border/40 max-w-[260px] px-2 py-1.5 align-middle">
                    <span className="block truncate text-[10px] italic text-muted-foreground/50">
                      {historyText || "—"}
                    </span>
                  </td>

                  {/* Descanso */}
                  <td className="border-b border-border/40 px-2 py-1.5">
                    <input
                      value={row.rest}
                      readOnly={locked}
                      onChange={(e) => updateCell(row.id, "rest", e.target.value)}
                      className={cn(
                        "w-full bg-transparent text-xs outline-none transition-colors",
                        locked
                          ? "cursor-default text-muted-foreground/60"
                          : "text-card-foreground focus:text-primary"
                      )}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {athleteHasStoreBlock && (
        <p className="text-[10px] text-muted-foreground/50">
          Navega con <kbd className="rounded border border-border bg-muted px-1">Tab</kbd> · <kbd className="rounded border border-border bg-muted px-1">↑↓←→</kbd> entre celdas de la fase Preparante.
          Activa &quot;Editando&quot; para desbloquear la cuadrícula.
        </p>
      )}
    </div>
  )
}
