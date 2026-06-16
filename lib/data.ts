// Mock data layer for Coach-Pilot. In-memory sample data only (no persistence).

export type AlertType = "ESTANCAMIENTO" | "RUTINA_INCOMPLETA"
export type AthleteStatus = "activo" | "expirado" | "sin_acceso"
export type SessionStatus = "completa" | "incompleta"

export type Athlete = {
  id: string
  name: string
  email: string
  program: string | null
  accessUntil: string | null // ISO date
  status: AthleteStatus
}

export type CoachAlert = {
  id: string
  athleteId: string
  athleteName: string
  type: AlertType
  detail: string
  week: number
  createdAt: string // ISO date
  reviewed: boolean
}

export type ProgressionAdjustment = {
  id: string
  athleteId: string
  athleteName: string
  exercise: string
  suggestedDelta: string // e.g. "+2.5kg"
  createdAt: string
}

export type TrainingSession = {
  id: string
  athleteId: string
  date: string // ISO date
  dayName: string
  status: SessionStatus
  durationMin: number
}

export type Template = {
  id: string
  name: string
}

export const coach = {
  name: "Carlos Méndez",
  email: "carlos@coachpilot.app",
  initials: "CM",
}

export const templates: Template[] = [
  { id: "t1", name: "Fuerza 4 días - Intermedio" },
  { id: "t2", name: "Hipertrofia 5 días" },
  { id: "t3", name: "Full Body 3 días - Principiante" },
  { id: "t4", name: "Powerlifting - Bloque de fuerza" },
  { id: "t5", name: "Acondicionamiento metabólico" },
]

export const athletes: Athlete[] = [
  {
    id: "a1",
    name: "Lucía Fernández",
    email: "lucia.f@gmail.com",
    program: "Fuerza 4 días - Intermedio",
    accessUntil: "2026-08-12",
    status: "activo",
  },
  {
    id: "a2",
    name: "Diego Ramírez",
    email: "diego.ramirez@gmail.com",
    program: "Hipertrofia 5 días",
    accessUntil: "2026-07-01",
    status: "activo",
  },
  {
    id: "a3",
    name: "Martina Soto",
    email: "martina.soto@outlook.com",
    program: "Powerlifting - Bloque de fuerza",
    accessUntil: "2026-05-20",
    status: "expirado",
  },
  {
    id: "a4",
    name: "Andrés Castro",
    email: "andres.castro@gmail.com",
    program: null,
    accessUntil: null,
    status: "sin_acceso",
  },
  {
    id: "a5",
    name: "Valentina Ríos",
    email: "valentina.rios@gmail.com",
    program: "Full Body 3 días - Principiante",
    accessUntil: "2026-09-30",
    status: "activo",
  },
  {
    id: "a6",
    name: "Tomás Herrera",
    email: "tomas.herrera@gmail.com",
    program: "Acondicionamiento metabólico",
    accessUntil: "2026-06-05",
    status: "expirado",
  },
  {
    id: "a7",
    name: "Camila Vega",
    email: "camila.vega@gmail.com",
    program: null,
    accessUntil: null,
    status: "sin_acceso",
  },
]

export const coachAlerts: CoachAlert[] = [
  {
    id: "al1",
    athleteId: "a1",
    athleteName: "Lucía Fernández",
    type: "ESTANCAMIENTO",
    detail: "Sin progreso en Press de banca durante 3 semanas (estancada en 52.5kg).",
    week: 8,
    createdAt: "2026-06-15T09:20:00Z",
    reviewed: false,
  },
  {
    id: "al2",
    athleteId: "a2",
    athleteName: "Diego Ramírez",
    type: "RUTINA_INCOMPLETA",
    detail: "Completó solo 2 de 5 sesiones programadas esta semana.",
    week: 6,
    createdAt: "2026-06-14T18:45:00Z",
    reviewed: false,
  },
  {
    id: "al3",
    athleteId: "a5",
    athleteName: "Valentina Ríos",
    type: "RUTINA_INCOMPLETA",
    detail: "No registró la sesión de piernas del lunes.",
    week: 3,
    createdAt: "2026-06-14T08:10:00Z",
    reviewed: false,
  },
  {
    id: "al4",
    athleteId: "a3",
    athleteName: "Martina Soto",
    type: "ESTANCAMIENTO",
    detail: "Sentadilla sin incremento de carga en las últimas 4 sesiones.",
    week: 10,
    createdAt: "2026-06-12T14:30:00Z",
    reviewed: false,
  },
]

export const progressionAdjustments: ProgressionAdjustment[] = [
  {
    id: "pa1",
    athleteId: "a2",
    athleteName: "Diego Ramírez",
    exercise: "Peso muerto",
    suggestedDelta: "+5kg",
    createdAt: "2026-06-15T07:00:00Z",
  },
  {
    id: "pa2",
    athleteId: "a5",
    athleteName: "Valentina Ríos",
    exercise: "Press militar",
    suggestedDelta: "+2.5kg",
    createdAt: "2026-06-14T07:00:00Z",
  },
  {
    id: "pa3",
    athleteId: "a1",
    athleteName: "Lucía Fernández",
    exercise: "Remo con barra",
    suggestedDelta: "+2.5kg",
    createdAt: "2026-06-13T07:00:00Z",
  },
]

const sessionsByAthlete: Record<string, TrainingSession[]> = {
  a1: [
    { id: "s1", athleteId: "a1", date: "2026-06-15", dayName: "Día A - Empuje", status: "completa", durationMin: 64 },
    { id: "s2", athleteId: "a1", date: "2026-06-13", dayName: "Día B - Tirón", status: "completa", durationMin: 58 },
    { id: "s3", athleteId: "a1", date: "2026-06-11", dayName: "Día C - Piernas", status: "incompleta", durationMin: 32 },
    { id: "s4", athleteId: "a1", date: "2026-06-09", dayName: "Día A - Empuje", status: "completa", durationMin: 61 },
  ],
  a2: [
    { id: "s5", athleteId: "a2", date: "2026-06-14", dayName: "Pecho y tríceps", status: "completa", durationMin: 72 },
    { id: "s6", athleteId: "a2", date: "2026-06-12", dayName: "Espalda y bíceps", status: "incompleta", durationMin: 40 },
    { id: "s7", athleteId: "a2", date: "2026-06-10", dayName: "Piernas", status: "incompleta", durationMin: 25 },
  ],
  a5: [
    { id: "s8", athleteId: "a5", date: "2026-06-13", dayName: "Full Body 1", status: "completa", durationMin: 55 },
    { id: "s9", athleteId: "a5", date: "2026-06-11", dayName: "Full Body 2", status: "completa", durationMin: 50 },
    { id: "s10", athleteId: "a5", date: "2026-06-09", dayName: "Full Body 3", status: "incompleta", durationMin: 30 },
  ],
}

export function getAthlete(id: string): Athlete | undefined {
  return athletes.find((a) => a.id === id)
}

export function getAlertsForAthlete(id: string): CoachAlert[] {
  return coachAlerts.filter((a) => a.athleteId === id)
}

export function getSessionsForAthlete(id: string): TrainingSession[] {
  return sessionsByAthlete[id] ?? []
}

export const stats = {
  activeAthletes: athletes.filter((a) => a.status === "activo").length,
  redAlerts: coachAlerts.filter((a) => a.type === "ESTANCAMIENTO").length,
  expiredAccess: athletes.filter((a) => a.status === "expirado").length,
}

// Relative-time formatter in Spanish (e.g. "Hace 2 días").
export function timeAgo(iso: string): string {
  const now = new Date("2026-06-16T12:00:00Z").getTime()
  const then = new Date(iso).getTime()
  const diffMs = now - then
  const mins = Math.round(diffMs / 60000)
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.round(hours / 24)
  return `Hace ${days} ${days === 1 ? "día" : "días"}`
}

export function formatDate(iso: string | null): string {
  if (!iso) return "Sin fecha"
  const d = new Date(iso)
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}
