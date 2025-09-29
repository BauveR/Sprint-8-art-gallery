import { useState } from 'react'
import { useObras } from '../hooks/useObras'
import { Button } from '@/components/ui/button'
import ObraForm from './ObraForm'
import ObrasTable from './ObrasTable'

export function ObrasList() {
  const { obras, loading, error } = useObras()
  const [showForm, setShowForm] = useState(false)
  const [reloading, setReloading] = useState(false)

  const reload = async () => {
    setReloading(true)
    setTimeout(() => setReloading(false), 0)
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

      {!obras?.length ? (
        <div className="rounded-md border p-6 text-muted-foreground">
          No hay obras.
        </div>
      ) : (
        <ObrasTable obras={obras} onChanged={reload} defaultPageSize={10} />
      )}
    </div>
  )
}
