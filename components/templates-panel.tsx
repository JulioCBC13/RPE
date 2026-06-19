"use client"

import { useState } from "react"
import { Plus, Layers, FolderOpen, Trash2, GripVertical, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

export type LegoExercise = {
  id: string
  exercise: string
  sets: string
  reps: string
}

export type LegoBlock = {
  id: string
  name: string
  exercises: LegoExercise[]
}

export type LegoFolder = {
  id: string
  name: string
  blocks: LegoBlock[]
}

// ─── Initial mock data ────────────────────────────────────────────────────────

const INITIAL_FOLDERS: LegoFolder[] = [
  {
    id: "f1",
    name: "Espalda",
    blocks: [
      {
        id: "lb1",
        name: "Hipertrofia Espalda",
        exercises: [
          { id: "e1", exercise: "PULL UP", sets: "4", reps: "8-10" },
          { id: "e2", exercise: "CABLE ROW", sets: "3", reps: "12-15" },
          { id: "e3", exercise: "FACE PULL", sets: "3", reps: "15-20" },
        ],
      },
      {
        id: "lb2",
        name: "Densidad de Tracción",
        exercises: [
          { id: "e4", exercise: "PULLDOWN", sets: "4", reps: "10-12" },
          { id: "e5", exercise: "PENDLAY ROW", sets: "4", reps: "6-8" },
        ],
      },
    ],
  },
  {
    id: "f2",
    name: "Pierna",
    blocks: [
      {
        id: "lb3",
        name: "Accesorios Quads",
        exercises: [
          { id: "e6", exercise: "LEG PRESS", sets: "4", reps: "12-15" },
          { id: "e7", exercise: "LEG EXT", sets: "3", reps: "15-20" },
          { id: "e8", exercise: "LUNGES", sets: "3", reps: "10/10" },
        ],
      },
      {
        id: "lb4",
        name: "Estabilidad Cadera",
        exercises: [
          { id: "e9", exercise: "HIP THRUST", sets: "4", reps: "10-12" },
          { id: "e10", exercise: "GLUTE BRIDGE", sets: "3", reps: "15" },
        ],
      },
    ],
  },
  {
    id: "f3",
    name: "Empuje",
    blocks: [
      {
        id: "lb5",
        name: "Accesorios Press",
        exercises: [
          { id: "e11", exercise: "INCLINE BENCH", sets: "3", reps: "10-12" },
          { id: "e12", exercise: "DUMBBELL OHP", sets: "3", reps: "12" },
          { id: "e13", exercise: "LATERAL RAISE", sets: "3", reps: "15-20" },
          { id: "e14", exercise: "TRICEP PUSHDOWN", sets: "3", reps: "15" },
        ],
      },
    ],
  },
  {
    id: "f4",
    name: "Core",
    blocks: [],
  },
  {
    id: "f5",
    name: "Cardio",
    blocks: [],
  },
  {
    id: "f6",
    name: "Movilidad",
    blocks: [],
  },
  {
    id: "f7",
    name: "Recuperación",
    blocks: [],
  },
  {
    id: "f8",
    name: "Técnica",
    blocks: [],
  },
]

// ─── New Lego Modal ───────────────────────────────────────────────────────────

function NewLegoModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (name: string, folderId: string, exercises: LegoExercise[]) => void
}) {
  const [name, setName] = useState("")
  const [folderId, setFolderId] = useState("")
  const [newFolderName, setNewFolderName] = useState("")
  const [exercises, setExercises] = useState<LegoExercise[]>([
    { id: Math.random().toString(36).slice(2), exercise: "", sets: "", reps: "" },
  ])
  const [folders] = useState(INITIAL_FOLDERS)

  const isCreatingFolder = folderId === "__new__"

  const addExRow = () =>
    setExercises((p) => [...p, { id: Math.random().toString(36).slice(2), exercise: "", sets: "", reps: "" }])

  const removeExRow = (id: string) =>
    setExercises((p) => p.filter((e) => e.id !== id))

  const updateEx = (id: string, field: keyof LegoExercise, val: string) =>
    setExercises((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)))

  const handleSave = () => {
    if (!name.trim()) return
    const resolvedFolderId = isCreatingFolder
      ? `__new__${(newFolderName?.trim() || "Nueva Carpeta")}`
      : folderId
    onSave(name.trim(), resolvedFolderId, exercises.filter((e) => e.exercise.trim()))
    setName("")
    setFolderId("")
    setNewFolderName("")
    setExercises([{ id: Math.random().toString(36).slice(2), exercise: "", sets: "", reps: "" }])
    onClose()
  }

  const inputCls = "h-7 w-full rounded border border-border bg-muted/40 px-2 text-xs text-card-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-border bg-card p-0 text-card-foreground">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <Layers className="size-4 text-primary" />
            Nuevo Bloque
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Nombre del Bloque
            </label>
            <input
              className={inputCls}
              placeholder="ej: Hipertrofia Espalda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Folder — optional */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Carpeta <span className="normal-case font-normal tracking-normal text-muted-foreground/50">(opcional)</span>
            </label>
            <div className="max-h-60 overflow-y-auto rounded border border-border bg-card">
              <div 
                className="cursor-pointer px-2 py-1.5 text-xs text-card-foreground hover:bg-muted/50 transition-colors"
                onClick={() => { setFolderId(""); setNewFolderName("") }}
              >
                Seleccione una Carpeta
              </div>
              <div 
                className="cursor-pointer px-2 py-1.5 text-xs text-primary font-semibold hover:bg-primary/10 transition-colors border-t border-border"
                onClick={() => { setFolderId("__new__"); setNewFolderName("") }}
              >
                + Crear una Carpeta
              </div>
              {folders.map((f) => (
                <div
                  key={f.id}
                  className={cn(
                    "cursor-pointer px-2 py-1.5 text-xs transition-colors border-t border-border/50",
                    folderId === f.id ? "bg-primary/20 text-primary font-semibold" : "text-card-foreground hover:bg-muted/50"
                  )}
                  onClick={() => { setFolderId(f.id); setNewFolderName("") }}
                >
                  {f.name}
                </div>
              ))}
            </div>
            {isCreatingFolder && (
              <input
                autoFocus
                className="mt-1.5 h-7 w-full rounded border border-primary bg-muted/40 px-2 text-xs text-card-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                placeholder="Nombre de la nueva carpeta..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            )}
          </div>

          {/* Exercises table */}
          <div className="flex flex-col gap-1.5">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["", "Series", "Reps", ""].map((h) => (
                    <th key={h} className="py-1 pr-2 text-left text-[9px] font-bold uppercase tracking-widest text-muted-foreground last:w-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exercises.map((ex) => (
                  <tr key={ex.id} className="border-b border-border/40">
                    <td className="py-0.5 pr-1.5">
                      <input className={inputCls} placeholder="Ejercicio" value={ex.exercise} onChange={(e) => updateEx(ex.id, "exercise", e.target.value)} />
                    </td>
                    <td className="py-0.5 pr-1.5 w-14">
                      <input className={inputCls} placeholder="4" value={ex.sets} onChange={(e) => updateEx(ex.id, "sets", e.target.value)} />
                    </td>
                    <td className="py-0.5 pr-1.5 w-20">
                      <input className={inputCls} placeholder="10-12" value={ex.reps} onChange={(e) => updateEx(ex.id, "reps", e.target.value)} />
                    </td>
                    <td className="py-0.5">
                      <button type="button" onClick={() => removeExRow(ex.id)} className="flex size-5 items-center justify-center rounded text-muted-foreground/50 hover:bg-muted hover:text-danger">
                        <X className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={addExRow}
              className="mt-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Plus className="size-3" />
              Añadir ejercicio
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button variant="ghost" size="sm" className="text-xs" onClick={onClose}>
              Cancelar
            </Button>
            <Button size="sm" className="text-xs" onClick={handleSave} disabled={!name.trim()}>
              Guardar Bloque
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Lego Card ────────────────────────────────────────────────────────────────

export function LegoCard({
  block,
  onDragStart,
  onDelete,
}: {
  block: LegoBlock
  onDragStart: (block: LegoBlock) => void
  onDelete: (blockId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [ctxPos, setCtxPos] = useState<{ x: number; y: number } | null>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setCtxPos({ x: e.clientX, y: e.clientY })
  }

  const closeCtx = () => setCtxPos(null)

  return (
    <>
      {ctxPos && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={closeCtx} />
          {/* menu */}
          <div
            className="fixed z-50 min-w-[140px] rounded border border-border bg-card py-1 shadow-lg"
            style={{ top: ctxPos.y, left: ctxPos.x }}
          >
            <button
              type="button"
              onClick={() => { onDelete(block.id); closeCtx() }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="size-3" />
              Eliminar
            </button>
          </div>
        </>
      )}
      <div className="flex flex-col gap-1">
        <div
          draggable
          onDragStart={() => onDragStart(block)}
          onContextMenu={handleContextMenu}
          className="group flex cursor-grab items-center gap-2 rounded border border-border bg-muted/30 px-2.5 py-2 transition-colors hover:border-primary/50 hover:bg-primary/5 active:cursor-grabbing"
        >
          <GripVertical className="size-3 shrink-0 text-muted-foreground/30 group-hover:text-primary/40" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="min-w-0 flex-1 text-left focus:outline-none"
          >
            <p className="truncate text-[11px] font-semibold text-card-foreground hover:text-primary transition-colors">{block.name}</p>
          </button>
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
            {block.exercises.length} ej.
          </span>
        </div>
        {expanded && (
          <div className="ml-2 flex flex-col gap-1 border-l border-border/50 pl-2 animate-in fade-in slide-in-from-top-1">
            {block.exercises.map((ex, idx) => (
              <div key={idx} className="text-[9px] text-muted-foreground">
                <span className="text-primary/80">•</span> {ex.exercise} <span className="text-muted-foreground/50">({ex.sets}x{ex.reps})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ─── Main Templates Panel ─────────────────────────────────────────────────────

export function TemplatesPanel({
  onDragStart,
}: {
  onDragStart: (block: LegoBlock) => void
}) {
  const [folders, setFolders] = useState<LegoFolder[]>(INITIAL_FOLDERS)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSaveLego = (name: string, folderId: string, exercises: LegoExercise[]) => {
    const newBlock: LegoBlock = {
      id: Math.random().toString(36).slice(2),
      name,
      exercises,
    }

    setFolders((prev) => {
      if (folderId.startsWith("__new__")) {
        const folderName = folderId.slice("__new__".length) || "Sin nombre"
        const newFolder: LegoFolder = {
          id: Math.random().toString(36).slice(2),
          name: folderName,
          blocks: [newBlock],
        }
        return [...prev, newFolder]
      }
      // No folder selected — add to a root-level "Sin carpeta" folder or create it
      if (!folderId) {
        const rootIdx = prev.findIndex((f) => f.id === "__root__")
        if (rootIdx >= 0) {
          return prev.map((f) => f.id === "__root__" ? { ...f, blocks: [...f.blocks, newBlock] } : f)
        }
        return [...prev, { id: "__root__", name: "Sin carpeta", blocks: [newBlock] }]
      }
      return prev.map((f) =>
        f.id === folderId ? { ...f, blocks: [...f.blocks, newBlock] } : f,
      )
    })
  }

  const handleDeleteBlock = (blockId: string) => {
    setFolders((prev) =>
      prev.map((f) => ({ ...f, blocks: f.blocks.filter((b) => b.id !== blockId) }))
    )
  }

  return (
    <>
      <NewLegoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLego}
      />

      <aside className="flex h-full w-56 shrink-0 flex-col border-l border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-card-foreground">
              Templates
            </span>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="size-3" />
            Nuevo
          </button>
        </div>

        {/* Folders */}
        <div className="flex-1 overflow-y-auto">
          <Accordion type="multiple" defaultValue={folders.map((f) => f.id)} className="w-full">
            {folders.map((folder) => (
              <AccordionItem
                key={folder.id}
                value={folder.id}
                className="border-b border-border/60"
              >
                <AccordionTrigger className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-card-foreground hover:no-underline [&>svg]:size-3 [&>svg]:shrink-0">
                  <FolderOpen className="size-3 text-primary/60" />
                  <span className="flex-1 text-left">{folder.name}</span>
                  <span className="mr-1 rounded bg-muted px-1 py-0.5 text-[9px] font-semibold text-muted-foreground/70">
                    {folder.blocks.length}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1 px-2 pb-2 pt-0">
                  {folder.blocks.map((block) => (
                    <LegoCard key={block.id} block={block} onDragStart={onDragStart} onDelete={handleDeleteBlock} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-3 py-2">
          <p className="text-[9px] leading-relaxed text-muted-foreground/50">
            Arrastra un Lego sobre un D&iacute;a para inyectar sus ejercicios.
          </p>
        </div>
      </aside>
    </>
  )
}
