"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { WeightEntry } from "@/lib/data"

interface WeightProgressTableProps {
  entries: WeightEntry[]
}

export function WeightProgressTable({ entries }: WeightProgressTableProps) {
  if (entries.length === 0) {
    return null
  }

  // Mostrar últimas 10 entradas en orden inverso (más reciente primero)
  const recentEntries = [...entries].reverse().slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Historial de Entrada de Datos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right">Peso (kg)</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right">Variación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEntries.map((entry, idx) => {
                const nextEntry = recentEntries[idx + 1]
                const prevWeight = nextEntry?.value
                const delta = prevWeight ? (entry.value - prevWeight).toFixed(2) : null
                const isDeltaPositive = delta && parseFloat(delta) >= 0

                return (
                  <TableRow key={entry.date} className="border-border/30 hover:bg-muted/30">
                    <TableCell className="text-card-foreground">
                      {new Date(entry.date).toLocaleDateString("es-ES", {
                        weekday: "short",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right font-medium text-card-foreground">{entry.value}</TableCell>
                    <TableCell className={`text-right font-medium ${isDeltaPositive ? "text-success" : "text-danger"}`}>
                      {delta ? (parseFloat(delta) >= 0 ? "+" : "") + delta : "—"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
