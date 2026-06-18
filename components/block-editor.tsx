"use client"

import { useRef, useCallback, useState, useId } from "react"
import { Trash2, Copy, Plus, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type Classification = "Principal" | "Accesorio"

type ExerciseRow = {
  id: string
  classification: Classification
  exercise: string
  sets: string
  reps: string
  rpe: string
  rest: string
}

type Day = {
  id: string
  label: string
  rows: ExerciseRow[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EXERCISE_SUGGESTIONS = [
  "COMP SQ", "COMP BENCH", "COMP DL",
  "LOW BAR SQ", "HIGH BAR SQ", "FRONT SQ", "PAUSE SQ", "TEMPO SQ",
  "FLAT BENCH", "INCLINE BENCH", "CLOSE GRIP BENCH", "PAUSE BENCH",
  "CONV DL", "SUMO DL", "RDL", "STIFF LEG DL",
  "BULGARAS", "LUNGES", "LEG PRESS", "LEG CURL", "LEG EXT",
  "ROW", "PENDLAY ROW", "CABLE ROW", "PULLDOWN", "PULL UP",
  "OHP", "DUMBBELL OHP", "LATERAL RAISE",
  "FACE PULL", "TRICEP PUSHDOWN", "CURL",
  "HIP THRUST", "GLUTE BRIDGE", "AB WHEEL",
]

const COLS = ["classification", "exercise", "sets", "reps", "rpe", "rest"] as const
type ColKey = typeof COLS[number]

const mkRow = (): ExerciseRow => ({
  id: Math.random().toString(36).slice(2),
  classification: "Principal",
  exercise: "",
  sets: "",
  reps: "",
  rpe: "",
  rest: "",
})

const mkDay = (n: number): Day => ({
  id: Math.random().toString(36).slice(2),
  label: `Día ${n}`,
  rows: [mkRow()],
})

// ─── Cell input ───────────────────────────────────────────────────────────────

type CellRef = { dayId: string; rowId: string; col: ColKey }

function ClassificationToggle({
  value,
  onChange,
  onKeyDown,
  inputRef,
}: {
  value: Classification
  onChange: (v: Classification) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  inputRef: (el: HTMLButtonElement | null) => void
}) {
  const isPrincipal = value === "Principal"
  return (
    <button
      ref={inputRef}
      type="button"
      onClick={() => onChange(isPrincipal ? "Accesorio" : "Principal")}
      onKeyDown={onKeyDown}
      className={cn(
        "h-[26px] rounded px-2 text-[10px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-1 focus:ring-primary",
        isPrincipal
          ? "bg-primary/20 text-primary"
          : "bg-muted text-muted-foreground",
      )}
    >
      {value === "Principal" ? "PRINC." : "ACCES."}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BlockEditor() {
  const [blockName, setBlockName] = useState("")
  const [weeks, setWeeks] = useState("4")
  const [days, setDays] = useState<Day[]>([mkDay(1), mkDay(2), mkDay(3)])

  // Map of cellId → DOM input element for focus management
  const cellRefs = useRef<Record<string, HTMLInputElement | HTMLButtonElement | null>>({})

  const cellKey = (dayId: string, rowId: string, col: ColKey) =>
    `${dayId}__${rowId}__${col}`

  const registerRef = useCallback(
    (dayId: string, rowId: string, col: ColKey) =>
      (el: HTMLInputElement | HTMLButtonElement | null) => {
        cellRefs.current[cellKey(dayId, rowId, col)] = el
      },
    [],
  )

  const focusCell = (dayId: string, rowId: string, col: ColKey) => {
    const el = cellRefs.current[cellKey(dayId, rowId, col)]
    if (el) (el as HTMLElement).focus()
  }

  // ── row mutations ──────────────────────────────────────────────────────────

  const updateRow = (dayId: string, rowId: string, patch: Partial<ExerciseRow>) =>
    setDays((prev) =>
      prev.map((d) =>
        d.id !== dayId
          ? d
          : { ...d, rows: d.rows.map((r) => (r.id !== rowId ? r : { ...r, ...patch })) },
      ),
    )

  const addRow = (dayId: string, afterRowId?: string) => {
    const newRow = mkRow()
    setDays((prev) =>
      prev.map((d) => {
        if (d.id !== dayId) return d
        if (!afterRowId) return { ...d, rows: [...d.rows, newRow] }
        const idx = d.rows.findIndex((r) => r.id === afterRowId)
        const rows = [...d.rows]
        rows.splice(idx + 1, 0, newRow)
        return { ...d, rows }
      }),
    )
    // Focus exercise cell after state update
    setTimeout(() => focusCell(dayId, newRow.id, "exercise"), 30)
  }

  const deleteRow = (dayId: string, rowId: string) =>
    setDays((prev) =>
      prev.map((d) =>
        d.id !== dayId
          ? d
          : { ...d, rows: d.rows.length === 1 ? d.rows : d.rows.filter((r) => r.id !== rowId) },
      ),
    )

  const duplicateDay = (dayId: string) => {
    setDays((prev) => {
      const idx = prev.findIndex((d) => d.id === dayId)
      if (idx < 0) return prev
      const src = prev[idx]
      const copy: Day = {
        id: Math.random().toString(36).slice(2),
        label: `Día ${prev.length + 1}`,
        rows: src.rows.map((r) => ({ ...r, id: Math.random().toString(36).slice(2) })),
      }
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
  }

  const addDay = () =>
    setDays((prev) => [...prev, mkDay(prev.length + 1)])

  // ── keyboard navigation ────────────────────────────────────────────────────

  const handleKeyDown =
    (dayId: string, rowId: string, col: ColKey) =>
    (e: React.KeyboardEvent) => {
      const day = days.find((d) => d.id === dayId)!
      const rowIdx = day.rows.findIndex((r) => r.id === rowId)
      const colIdx = COLS.indexOf(col)

      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault()
        // Last editable col: create new row
        if (col === "rest") {
          addRow(dayId, rowId)
        } else {
          const nextCol = COLS[colIdx + 1]
          focusCell(dayId, rowId, nextCol)
        }
      } else if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault()
        if (colIdx > 0) focusCell(dayId, rowId, COLS[colIdx - 1])
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (rowIdx < day.rows.length - 1) {
          focusCell(dayId, day.rows[rowIdx + 1].id, col)
        } else {
          addRow(dayId, rowId)
        }
      } else if (e.key === "ArrowDown") {
        if (rowIdx < day.rows.length - 1)
          focusCell(dayId, day.rows[rowIdx + 1].id, col)
      } else if (e.key === "ArrowUp") {
        if (rowIdx > 0) focusCell(dayId, day.rows[rowIdx - 1].id, col)
      }
    }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-0 min-h-full">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background px-4 py-2.5">
        <input
          type="text"
          placeholder="Nombre del Bloque — ej: Off Season B2"
          value={blockName}
          onChange={(e) => setBlockName(e.target.value)}
          className="h-8 flex-1 rounded border border-border bg-card px-3 text-sm font-semibold text-card-foreground placeholder:font-normal placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <select
          value={weeks}
          onChange={(e) => setWeeks(e.target.value)}
          className="h-8 rounded border border-border bg-card px-2 text-sm text-card-foreground focus:border-primary focus:outline-none"
        >
          {["4", "5", "6"].map((w) => (
            <option key={w} value={w}>{w} semanas</option>
          ))}
        </select>
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded bg-primary px-3 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Zap className="size-3.5" />
          Publicar y Activar Calendario
        </button>
      </div>

      {/* ── Days Grid ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-4">
        {days.map((day) => (
          <DayTable
            key={day.id}
            day={day}
            registerRef={registerRef}
            handleKeyDown={handleKeyDown}
            updateRow={updateRow}
            addRow={addRow}
            deleteRow={deleteRow}
            duplicateDay={duplicateDay}
          />
        ))}

        <button
          type="button"
          onClick={addDay}
          className="flex h-9 items-center justify-center gap-2 rounded border border-dashed border-border text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="size-4" />
          Añadir Día
        </button>
      </div>
    </div>
  )
}

// ─── Day Table ────────────────────────────────────────────────────────────────

function DayTable({
  day,
  registerRef,
  handleKeyDown,
  updateRow,
  addRow,
  deleteRow,
  duplicateDay,
}: {
  day: Day
  registerRef: (dayId: string, rowId: string, col: ColKey) => (el: any) => void
  handleKeyDown: (dayId: string, rowId: string, col: ColKey) => (e: React.KeyboardEvent) => void
  updateRow: (dayId: string, rowId: string, patch: Partial<ExerciseRow>) => void
  addRow: (dayId: string, afterRowId?: string) => void
  deleteRow: (dayId: string, rowId: string) => void
  duplicateDay: (dayId: string) => void
}) {
  return (
    <div className="overflow-hidden rounded border border-border bg-card">
      {/* Day header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
          {day.label}
        </span>
        <button
          type="button"
          onClick={() => duplicateDay(day.id)}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Copy className="size-3" />
          Duplicar Día
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-fixed border-collapse text-xs">
        <colgroup>
          <col className="w-24" />
          <col className="w-auto" />
          <col className="w-16" />
          <col className="w-20" />
          <col className="w-16" />
          <col className="w-24" />
          <col className="w-8" />
        </colgroup>
        <thead>
          <tr className="border-b border-border">
            {[
              "CLASIFICACIÓN",
              "EJERCICIO",
              "SERIES",
              "REPS",
              "RPE",
              "DESCANSO",
              "",
            ].map((h) => (
              <th
                key={h}
                className="px-2 py-1 text-left text-[9px] font-bold uppercase tracking-widest text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {day.rows.map((row) => (
            <ExerciseRowComp
              key={row.id}
              row={row}
              dayId={day.id}
              registerRef={registerRef}
              handleKeyDown={handleKeyDown}
              updateRow={updateRow}
              deleteRow={deleteRow}
            />
          ))}
        </tbody>
      </table>

      {/* Add row button */}
      <button
        type="button"
        onClick={() => addRow(day.id)}
        className="flex w-full items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-card-foreground"
      >
        <Plus className="size-3" />
        Añadir Ejercicio
      </button>
    </div>
  )
}

// ─── Exercise Row ─────────────────────────────────────────────────────────────

function ExerciseRowComp({
  row,
  dayId,
  registerRef,
  handleKeyDown,
  updateRow,
  deleteRow,
}: {
  row: ExerciseRow
  dayId: string
  registerRef: (dayId: string, rowId: string, col: ColKey) => (el: any) => void
  handleKeyDown: (dayId: string, rowId: string, col: ColKey) => (e: React.KeyboardEvent) => void
  updateRow: (dayId: string, rowId: string, patch: Partial<ExerciseRow>) => void
  deleteRow: (dayId: string, rowId: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const uid = useId()
  const listId = `suggestions-${uid}`

  const cellBase =
    "h-7 w-full rounded-sm bg-transparent px-1.5 text-[11px] text-card-foreground caret-primary focus:bg-accent focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary/60 placeholder:text-muted-foreground/40"

  return (
    <tr
      className="group border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Classification */}
      <td className="px-1.5 py-0.5">
        <ClassificationToggle
          value={row.classification}
          onChange={(v) => updateRow(dayId, row.id, { classification: v })}
          onKeyDown={handleKeyDown(dayId, row.id, "classification")}
          inputRef={registerRef(dayId, row.id, "classification")}
        />
      </td>

      {/* Exercise with datalist autocomplete */}
      <td className="px-1 py-0.5">
        <datalist id={listId}>
          {EXERCISE_SUGGESTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <input
          ref={registerRef(dayId, row.id, "exercise")}
          list={listId}
          type="text"
          placeholder="Ejercicio..."
          value={row.exercise}
          onChange={(e) => updateRow(dayId, row.id, { exercise: e.target.value })}
          onKeyDown={handleKeyDown(dayId, row.id, "exercise")}
          className={cn(cellBase, "font-medium")}
          autoComplete="off"
        />
      </td>

      {/* Sets */}
      <td className="px-1 py-0.5">
        <input
          ref={registerRef(dayId, row.id, "sets")}
          type="text"
          inputMode="numeric"
          placeholder="4"
          value={row.sets}
          onChange={(e) => updateRow(dayId, row.id, { sets: e.target.value })}
          onKeyDown={handleKeyDown(dayId, row.id, "sets")}
          className={cn(cellBase, "text-center")}
        />
      </td>

      {/* Reps */}
      <td className="px-1 py-0.5">
        <input
          ref={registerRef(dayId, row.id, "reps")}
          type="text"
          placeholder="8-12"
          value={row.reps}
          onChange={(e) => updateRow(dayId, row.id, { reps: e.target.value })}
          onKeyDown={handleKeyDown(dayId, row.id, "reps")}
          className={cn(cellBase, "text-center")}
        />
      </td>

      {/* RPE */}
      <td className="px-1 py-0.5">
        <input
          ref={registerRef(dayId, row.id, "rpe")}
          type="text"
          inputMode="decimal"
          placeholder="8"
          value={row.rpe}
          onChange={(e) => updateRow(dayId, row.id, { rpe: e.target.value })}
          onKeyDown={handleKeyDown(dayId, row.id, "rpe")}
          className={cn(cellBase, "text-center")}
        />
      </td>

      {/* Rest */}
      <td className="px-1 py-0.5">
        <input
          ref={registerRef(dayId, row.id, "rest")}
          type="text"
          placeholder="3 min"
          value={row.rest}
          onChange={(e) => updateRow(dayId, row.id, { rest: e.target.value })}
          onKeyDown={handleKeyDown(dayId, row.id, "rest")}
          className={cellBase}
        />
      </td>

      {/* Delete */}
      <td className="px-1 py-0.5 text-center">
        <button
          type="button"
          onClick={() => deleteRow(dayId, row.id)}
          className={cn(
            "rounded p-0.5 text-danger transition-opacity",
            hovered ? "opacity-70 hover:opacity-100" : "opacity-0",
          )}
          tabIndex={-1}
        >
          <Trash2 className="size-3.5" />
        </button>
      </td>
    </tr>
  )
}
