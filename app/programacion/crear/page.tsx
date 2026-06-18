import { AppShell } from "@/components/app-shell"
import { BlockEditor } from "@/components/block-editor"

export default function CrearBloquePage() {
  return (
    <AppShell title="Crear Bloque" className="p-0">
      <BlockEditor />
    </AppShell>
  )
}
