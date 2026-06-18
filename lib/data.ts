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

export type PaymentMethod = "Zelle" | "Pago Móvil" | "Binance" | "Transferencia"

export type PendingPayment = {
  id: string
  athleteId: string
  athleteName: string
  method: PaymentMethod
  reportedAt: string // ISO date
}

export type BlockUpdate = {
  id: string
  athleteId: string
  athleteName: string
  blockName: string
  currentWeek: number
  totalWeeks: number
  daysLeft: number
}

export type PendingVideo = {
  id: string
  athleteId: string
  athleteName: string
  exercise: string
  submittedAt: string
}

export type WeightEntry = {
  date: string // ISO date
  value: number // kg
}

export type RoutineExercise = {
  name: string
  sets: number
  reps: string // e.g. "8-12" or "5"
  rest: string // e.g. "90s" or "2min"
  notes?: string
}

export type RoutineDay = {
  day: string // "Lunes", "Martes", etc.
  exercises: RoutineExercise[]
}

export type Routine = {
  id: string
  athleteId: string
  blockName: string
  days: RoutineDay[]
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

export const pendingPayments: PendingPayment[] = [
  { id: "pp1", athleteId: "a4", athleteName: "Andrés Castro",   method: "Pago Móvil",    reportedAt: "2026-06-16T11:50:00Z" },
  { id: "pp2", athleteId: "a7", athleteName: "Camila Vega",     method: "Binance",       reportedAt: "2026-06-16T11:20:00Z" },
  { id: "pp3", athleteId: "a3", athleteName: "Martina Soto",    method: "Zelle",         reportedAt: "2026-06-16T10:05:00Z" },
  { id: "pp4", athleteId: "a6", athleteName: "Tomás Herrera",   method: "Transferencia", reportedAt: "2026-06-16T09:30:00Z" },
]

export const blockUpdates: BlockUpdate[] = [
  { id: "bu1", athleteId: "a2", athleteName: "Diego Ramírez",   blockName: "Peaking de fuerza",      currentWeek: 4, totalWeeks: 4, daysLeft: 2  },
  { id: "bu2", athleteId: "a1", athleteName: "Lucía Fernández", blockName: "Bloque de acumulación",  currentWeek: 4, totalWeeks: 5, daysLeft: 4  },
  { id: "bu3", athleteId: "a5", athleteName: "Valentina Ríos",  blockName: "Full Body - Fase 1",     currentWeek: 3, totalWeeks: 4, daysLeft: 7  },
  { id: "bu4", athleteId: "a6", athleteName: "Tomás Herrera",   blockName: "Acondicionamiento",      currentWeek: 2, totalWeeks: 4, daysLeft: 12 },
]

export const pendingVideos: PendingVideo[] = [
  { id: "pv1", athleteId: "a1", athleteName: "Lucía Fernández", exercise: "Sentadilla baja barra",    submittedAt: "2026-06-16T10:00:00Z" },
  { id: "pv2", athleteId: "a5", athleteName: "Valentina Ríos",  exercise: "Peso muerto convencional", submittedAt: "2026-06-16T09:30:00Z" },
  { id: "pv3", athleteId: "a2", athleteName: "Diego Ramírez",   exercise: "Press banca",              submittedAt: "2026-06-15T18:00:00Z" },
  { id: "pv4", athleteId: "a3", athleteName: "Martina Soto",    exercise: "Sentadilla frontal",       submittedAt: "2026-06-15T15:45:00Z" },
  { id: "pv5", athleteId: "a6", athleteName: "Tomás Herrera",   exercise: "Remo pendlay",             submittedAt: "2026-06-15T14:00:00Z" },
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

// --- Progreso de Peso (por atleta) ---
export const athleteWeightProgress: Record<string, WeightEntry[]> = {
  a1: [ // Lucía Fernández
    { date: "2026-05-15", value: 62.5 },
    { date: "2026-05-22", value: 62.8 },
    { date: "2026-05-29", value: 63.1 },
    { date: "2026-06-05", value: 63.4 },
    { date: "2026-06-12", value: 63.7 },
    { date: "2026-06-17", value: 64.0 },
  ],
  a2: [ // Diego Ramírez
    { date: "2026-05-15", value: 80.2 },
    { date: "2026-05-22", value: 80.5 },
    { date: "2026-05-29", value: 80.9 },
    { date: "2026-06-05", value: 81.1 },
    { date: "2026-06-12", value: 81.4 },
    { date: "2026-06-17", value: 81.8 },
  ],
  a3: [ // Martina Soto
    { date: "2026-05-15", value: 58.0 },
    { date: "2026-05-22", value: 58.2 },
    { date: "2026-05-29", value: 58.5 },
    { date: "2026-06-05", value: 58.8 },
    { date: "2026-06-12", value: 59.0 },
    { date: "2026-06-17", value: 59.3 },
  ],
  a4: [ // Andrés Castro
    { date: "2026-05-15", value: 75.5 },
    { date: "2026-05-22", value: 75.8 },
    { date: "2026-05-29", value: 76.2 },
    { date: "2026-06-05", value: 76.5 },
    { date: "2026-06-12", value: 76.9 },
    { date: "2026-06-17", value: 77.2 },
  ],
}

// --- Rutinas (por atleta) ---
export const athleteRoutines: Record<string, Routine> = {
  a1: {
    id: "r1",
    athleteId: "a1",
    blockName: "Bloque de acumulación - Semana 4",
    days: [
      {
        day: "Lunes",
        exercises: [
          { name: "Sentadilla baja barra", sets: 4, reps: "6-8", rest: "3min" },
          { name: "Leg press", sets: 3, reps: "8-10", rest: "2min" },
          { name: "Extensión de cuádriceps", sets: 3, reps: "10-12", rest: "90s" },
        ],
      },
      {
        day: "Miércoles",
        exercises: [
          { name: "Press banca", sets: 4, reps: "6-8", rest: "3min" },
          { name: "Press inclinado", sets: 3, reps: "8-10", rest: "2min" },
          { name: "Pec deck", sets: 3, reps: "12-15", rest: "60s" },
        ],
      },
      {
        day: "Viernes",
        exercises: [
          { name: "Peso muerto convencional", sets: 3, reps: "5", rest: "3min", notes: "Enfoque en técnica" },
          { name: "Remo barra", sets: 4, reps: "6-8", rest: "2min30s" },
          { name: "Remo máquina", sets: 3, reps: "10-12", rest: "90s" },
        ],
      },
    ],
  },
  a2: {
    id: "r2",
    athleteId: "a2",
    blockName: "Peaking de fuerza - Semana 4 (Final)",
    days: [
      {
        day: "Lunes",
        exercises: [
          { name: "Sentadilla baja barra", sets: 5, reps: "3", rest: "4min", notes: "Test de máximo" },
          { name: "Sentadilla pausa 2s", sets: 3, reps: "3", rest: "3min" },
        ],
      },
      {
        day: "Miércoles",
        exercises: [
          { name: "Press banca", sets: 5, reps: "3", rest: "4min" },
          { name: "Tablillas de press", sets: 3, reps: "3", rest: "3min" },
        ],
      },
      {
        day: "Viernes",
        exercises: [
          { name: "Peso muerto", sets: 5, reps: "2", rest: "4min" },
          { name: "Halones de peso muerto", sets: 3, reps: "3", rest: "3min" },
        ],
      },
    ],
  },
  a3: {
    id: "r3",
    athleteId: "a3",
    blockName: "Full Body - Fase 1",
    days: [
      {
        day: "Martes",
        exercises: [
          { name: "Sentadilla", sets: 3, reps: "8-10", rest: "2min" },
          { name: "Press banca", sets: 3, reps: "8-10", rest: "2min" },
          { name: "Remo barra", sets: 3, reps: "8-10", rest: "2min" },
        ],
      },
      {
        day: "Jueves",
        exercises: [
          { name: "Leg press", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Press inclinado", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Lat pulldown", sets: 3, reps: "10-12", rest: "90s" },
        ],
      },
      {
        day: "Sábado",
        exercises: [
          { name: "Peso muerto", sets: 3, reps: "6-8", rest: "2min30s" },
          { name: "Dips", sets: 3, reps: "8-12", rest: "90s" },
          { name: "Remo máquina", sets: 3, reps: "12-15", rest: "60s" },
        ],
      },
    ],
  },
}

export const stats = {
  activeAthletes: athletes.filter((a) => a.status === "activo").length,
  trainingToday: 42,
  totalCapacity: 100,
  redAlerts: coachAlerts.filter((a) => a.type === "ESTANCAMIENTO").length,
  expiredAccess: athletes.filter((a) => a.status === "expirado").length,
  pendingVideosCount: 5,
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
