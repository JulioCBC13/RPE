"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale } from "lucide-react"
import type { WeightEntry } from "@/lib/data"

interface WeightProgressChartProps {
  entries: WeightEntry[]
  athleteName: string
}

export function WeightProgressChart({ entries, athleteName }: WeightProgressChartProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progreso de Peso</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Seguimiento del peso corporal de {athleteName}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <Scale className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin registros de peso aún.</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = entries.map((e) => ({
    date: new Date(e.date).toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
    weight: e.value,
  }))

  const currentWeight = entries[entries.length - 1].value
  const previousWeight = entries[0].value
  const delta = (currentWeight - previousWeight).toFixed(1)
  const deltaDirection = currentWeight >= previousWeight ? "up" : "down"
  const isPositive = deltaDirection === "up"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Progreso de Peso</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Seguimiento del peso corporal de {athleteName}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-bold text-card-foreground">{currentWeight} kg</span>
            <Badge className={isPositive ? "bg-success/15 text-success border-0" : "bg-danger/15 text-danger border-0"}>
              {isPositive ? "+" : ""}{delta} kg
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
            <YAxis domain={["dataMin - 1", "dataMax + 1"]} stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: `1px solid var(--border)`,
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "var(--card-foreground)" }}
              formatter={(value) => [`${value} kg`, "Peso"]}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-1)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
