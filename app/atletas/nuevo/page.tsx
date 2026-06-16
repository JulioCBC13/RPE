"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel, FieldDescription } from "@/components/ui/field"

export default function NuevoAtletaPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    // Mock: a new athlete would be created on the backend. Redirect to enable access.
    router.push("/atletas/a4/habilitar")
  }

  return (
    <AppShell title="Registrar atleta">
      <div className="mx-auto w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Registrar atleta</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
                  <Input id="name" name="name" placeholder="Ej. María González" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" name="email" type="email" placeholder="atleta@email.com" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tempPassword">Contraseña temporal</FieldLabel>
                  <Input
                    id="tempPassword"
                    name="tempPassword"
                    type="text"
                    defaultValue="Atleta-7F2K"
                    className="font-mono"
                  />
                  <FieldDescription>
                    Comparte este email y contraseña con el atleta para que entre a la app móvil.
                  </FieldDescription>
                </Field>
              </FieldGroup>
              <div className="flex flex-col gap-2">
                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  Crear atleta
                </Button>
                <Button variant="link" size="sm" className="mx-auto" nativeButton={false} render={<Link href="/atletas" />}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
