import { useState } from 'react'
import type { ObraCreate } from '../types/ObraArte'
import { obrasAPI } from '../services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from "sonner"
export default function ObraForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<ObraCreate>({
    autor: '', titulo: '', anio: new Date().getFullYear(),
    precio_salida: 0, tipo: 'pintura', disponibilidad: 'disponible',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (name: keyof ObraCreate, value: any) => setForm((f) => ({ ...f, [name]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true); setError(null)
      await obrasAPI.create(form)
      toast('Obra creada', { description: `${form.titulo} · ${form.autor}` })
      onCreated()
      setForm({ autor: '', titulo: '', anio: new Date().getFullYear(), precio_salida: 0, tipo: 'pintura', disponibilidad: 'disponible' })
    } catch {
      setError('No se pudo crear la obra')
    } finally { setSaving(false) }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Dar de alta obra</CardTitle>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="autor">Autor</Label>
              <Input id="autor" value={form.autor} onChange={e => set('autor', e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="anio">Año</Label>
              <Input id="anio" type="number" value={form.anio} onChange={e => set('anio', Number(e.target.value))} required />
            </div>
            <div className="grid gap-1.5">
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => set('tipo', v as any)}>
                <SelectTrigger><SelectValue placeholder="Tipo de obra" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pintura">Pintura</SelectItem>
                  <SelectItem value="escultura">Escultura</SelectItem>
                  <SelectItem value="fotografia">Fotografía</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="mixta">Mixta</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Disponibilidad</Label>
              <Select value={form.disponibilidad} onValueChange={(v) => set('disponibilidad', v as any)}>
                <SelectTrigger><SelectValue placeholder="Disponibilidad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="no disponible">No disponible</SelectItem>
                  <SelectItem value="en_exposicion">En exposición</SelectItem>
                  <SelectItem value="en_tienda">En tienda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="precio_salida">Precio salida (€)</Label>
              <Input id="precio_salida" type="number" step="0.01" value={form.precio_salida}
                     onChange={e => set('precio_salida', Number(e.target.value))} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ubicacion">Ubicación (opcional)</Label>
              <Input id="ubicacion" value={form.ubicacion ?? ''} onChange={e => set('ubicacion', e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" value={form.descripcion ?? ''} onChange={e => set('descripcion', e.target.value)} />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Crear obra'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
