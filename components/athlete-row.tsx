import Link from "next/link"
import type { Athlete } from "@/lib/data"
import { formatDate, initialsOf } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/chips"
import { TableCell, TableRow } from "@/components/ui/table"

export function AthleteRow({ athlete }: { athlete: Athlete }) {
  const actionLabel = athlete.status === "sin_acceso" ? "Habilitar" : "Renovar"

  return (
    <TableRow className="cursor-pointer">
      <TableCell>
        <Link href={`/atletas/${athlete.id}`} className="flex items-center gap-3 py-2 -mx-2 px-2 rounded hover:bg-muted/50 transition-colors">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {initialsOf(athlete.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-card-foreground">{athlete.name}</p>
            <p className="truncate text-xs text-muted-foreground">{athlete.email}</p>
          </div>
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">{athlete.program ?? "Sin programa"}</TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(athlete.accessUntil)}</TableCell>
      <TableCell>
        <StatusChip status={athlete.status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="link" size="sm" nativeButton={false} render={<Link href={`/atletas/${athlete.id}`} />}>
            Ver perfil
          </Button>
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/atletas/${athlete.id}/habilitar`} />}>
            {actionLabel}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
