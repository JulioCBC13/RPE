import Link from "next/link"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  FieldGroup,
  Field,
  FieldLabel,
} from "@/components/ui/field"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="size-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-primary">Coach-Pilot</span>
          </div>
          <p className="text-sm text-muted-foreground">Gestiona tu equipo de atletas</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form className="flex flex-col gap-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" name="email" type="email" placeholder="coach@coachpilot.app" autoComplete="email" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
                </Field>
              </FieldGroup>
              <Button size="lg" className="w-full" nativeButton={false} render={<Link href="/dashboard" />}>
                Iniciar sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
