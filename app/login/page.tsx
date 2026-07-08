"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Zap, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  FieldGroup,
  Field,
  FieldLabel,
} from "@/components/ui/field"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Por favor ingresa tu email")
      return
    }

    if (!password.trim()) {
      setError("Por favor ingresa tu contraseña")
      return
    }

    setIsLoading(true)
    // Simular delay de verificación
    setTimeout(() => {
      // En una app real, aquí harías un call a una API de autenticación
      // Por ahora, permitimos acceso con cualquier credencial válida
      router.push("/dashboard")
    }, 500)
  }

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
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="size-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="coach@coachpilot.app"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </Field>
              </FieldGroup>

              <Button size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
