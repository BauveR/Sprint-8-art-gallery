import { useState } from 'react'
import { useObras } from '../hooks/useObras'
import { obrasAPI } from '../services/api'
import ObraForm from './ObraForm'
import Relations from './Relations'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'

export function ObrasList() {
  const { obras, loading, error } = useObras()
  const [showForm, setShowForm] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)

  const reload = async () => {
    setReloading(true)
    setTimeout(() => setReloading(false), 0)
  }

  const remove = async (id: number) => {
    await obrasAPI.delete(id)
    toast({ title: 'Obra eliminada', description: `ID ${id}` })
    await reload()
  }

  if (loading || reloading) return <div className="p-6 text-muted-foreground">Cargando obras…</div>
  if (error) return <div className="p-6 text-destructive">{error}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Obras</h2>
        <Button onClick={() => setShowForm(s => !s)} variant="default">
          {showForm ? 'Cerrar' : 'Nueva obra'}
        </Button>
      </div>

      {showForm && <ObraForm onCreated={reload} />}

      {!obras?.length && (
        <Card>
          <CardContent className="p-6 text-muted-foreground">No hay obras.</CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {obras.map((o) => (
          <Card key={o.id_obra} className="overflow-hidden">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{o.titulo}</CardTitle>
                <p className="text-sm text-muted-foreground">{o.autor} · {o.tipo}</p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive" onClick={() => setPendingDelete(o.id_obra)}>
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Borrar esta obra?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        if (pendingDelete) {
                          await remove(pendingDelete)
                          setPendingDelete(null)
                        }
                      }}
                    >
                      Sí, borrar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm">
                Estado: <Badge variant="secondary">{o.disponibilidad}</Badge>
              </p>
              <p className="text-sm">
                Precio salida: €{Number(o.precio_salida).toLocaleString()}
              </p>
              {o.ubicacion_actual && (
                <p className="text-xs text-muted-foreground">Ubicación: {o.ubicacion_actual}</p>
              )}
              <div className="mt-3 rounded-md border p-2">
                <Relations obraId={o.id_obra} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
