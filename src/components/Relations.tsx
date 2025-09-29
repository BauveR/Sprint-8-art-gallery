import { useEffect, useState } from 'react'
import { obrasAPI } from '../services/api'
import { Skeleton } from '@/components/ui/skeleton'

export default function Relations({ obraId }: { obraId: number }) {
  const [data, setData] = useState<{ tiendas: any[]; exposiciones: any[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        setError(null)
        const r = await obrasAPI.getRelations(obraId)
        setData(r.data)
      } catch {
        setError('No se pudieron cargar las relaciones')
      }
    })()
  }, [obraId])

  if (error) return <div className="text-sm text-destructive">{error}</div>
  if (!data) return <Skeleton className="h-16 w-full" />

  return (
    <div className="text-sm space-y-3">
      <div>
        <h4 className="font-medium">Tiendas</h4>
        {data.tiendas.length ? (
          <ul className="list-disc pl-5">
            {data.tiendas.map((t) => (
              <li key={t.id_relacion}>
                {t.nombre} · stock {t.stock} · {t.precio_venta ? `€${Number(t.precio_venta).toLocaleString()}` : 'sin precio'}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Sin vínculos</p>
        )}
      </div>
      <div>
        <h4 className="font-medium">Exposiciones</h4>
        {data.exposiciones.length ? (
          <ul className="list-disc pl-5">
            {data.exposiciones.map((e) => (
              <li key={e.id_relacion}>
                {e.titulo} ({e.lugar}) · {e.fecha_inicio} → {e.fecha_fin}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Sin vínculos</p>
        )}
      </div>
    </div>
  )
}
