import { useMemo, useState } from "react"
import type { ObraArte } from "../types/ObraArte"
import { obrasAPI } from "../services/api"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Props = {
  obras: ObraArte[]
  onChanged?: () => void
  defaultPageSize?: number
}

type SortKey = "titulo" | "autor" | "tipo" | "anio" | "precio_salida" | "disponibilidad"
type SortDir = "asc" | "desc"

const disponToVariant = (d: ObraArte["disponibilidad"]) => {
  switch (d) {
    case "disponible": return "secondary"
    case "vendido": return "destructive"
    case "reservado": return "outline"
    case "no disponible": return "outline"
    case "en_exposicion": return "default"
    case "en_tienda": return "default"
    default: return "secondary"
  }
}

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n)

export default function ObrasTable({ obras, onChanged, defaultPageSize = 10 }: Props) {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("titulo")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  // Diálogos
  const [viewObra, setViewObra] = useState<ObraArte | null>(null)
  const [editObra, setEditObra] = useState<ObraArte | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  // ====== Filtro + orden tipados (sin any)
  const getComparable = (o: ObraArte, key: SortKey): string | number => {
    switch (key) {
      case "titulo": return o.titulo ?? ""
      case "autor": return o.autor ?? ""
      case "tipo": return o.tipo ?? ""
      case "disponibilidad": return o.disponibilidad ?? ""
      case "anio": return typeof o.anio === "number" ? o.anio : Number(o.anio ?? 0)
      case "precio_salida": return typeof o.precio_salida === "number" ? o.precio_salida : Number(o.precio_salida ?? 0)
    }
  }

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q
      ? obras.filter(o => `${o.titulo} ${o.autor}`.toLowerCase().includes(q))
      : obras

    const sorted = [...base].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1
      const va = getComparable(a, sortKey)
      const vb = getComparable(b, sortKey)
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * mul
      return String(va).localeCompare(String(vb), "es") * mul
    })

    return sorted
  }, [obras, query, sortKey, sortDir])

  // ====== Paginación
  const total = filteredSorted.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  const pageItems = filteredSorted.slice(start, end)

  const goPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages))
  const changePageSize = (size: number) => { setPageSize(size); setPage(1) }

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  // ====== Acciones
  const remove = async (id: number) => {
    await obrasAPI.delete(id)
    toast("Obra eliminada", { description: `ID ${id}` })
    setConfirmDeleteId(null)
    onChanged?.()
  }

  const saveEdit = async () => {
    if (!editObra) return
    const { id_obra, ...payload } = editObra
    await obrasAPI.update(id_obra, payload)
    toast("Obra actualizada", { description: editObra.titulo })
    setEditObra(null)
    onChanged?.()
  }

  const SortHeader = ({ label, keyName, alignRight = false }:
    { label: string; keyName: SortKey; alignRight?: boolean }) => (
    <button
      type="button"
      onClick={() => toggleSort(keyName)}
      className={`inline-flex items-center gap-1 font-medium hover:underline ${alignRight ? "justify-end w-full" : ""}`}
      aria-label={`Ordenar por ${label}`}
      title={`Ordenar por ${label}`}
    >
      {label}
      <span className="text-xs text-muted-foreground">
        {sortKey === keyName ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </button>
  )

  // Render de números de página (compacto)
  const pageNums = (() => {
    const nums: number[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nums.push(i)
    } else {
      nums.push(1)
      const left = Math.max(2, currentPage - 1)
      const right = Math.min(totalPages - 1, currentPage + 1)
      if (left > 2) nums.push(-1) // ellipsis
      for (let i = left; i <= right; i++) nums.push(i)
      if (right < totalPages - 1) nums.push(-2) // ellipsis
      nums.push(totalPages)
    }
    return nums
  })()

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por título o autor…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filas por página</span>
          <Select value={String(pageSize)} onValueChange={(v) => changePageSize(Number(v))}>
            <SelectTrigger className="w-[84px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map(s => (
                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {total} resultado(s) • página {currentPage} de {totalPages}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[28%]"><SortHeader label="Título" keyName="titulo" /></TableHead>
              <TableHead className="w-[20%]"><SortHeader label="Autor" keyName="autor" /></TableHead>
              <TableHead className="w-[12%]"><SortHeader label="Tipo" keyName="tipo" /></TableHead>
              <TableHead className="w-[10%] text-right">
                <SortHeader label="Año" keyName="anio" alignRight />
              </TableHead>
              <TableHead className="w-[15%] text-right">
                <SortHeader label="Precio salida" keyName="precio_salida" alignRight />
              </TableHead>
              <TableHead className="w-[10%]"><SortHeader label="Estado" keyName="disponibilidad" /></TableHead>
              <TableHead className="w-[5%] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageItems.map((o) => (
              <TableRow key={o.id_obra}>
                <TableCell className="font-medium">{o.titulo}</TableCell>
                <TableCell>{o.autor}</TableCell>
                <TableCell className="capitalize">{o.tipo}</TableCell>
                <TableCell className="text-right">{o.anio}</TableCell>
                <TableCell className="text-right">{fmtEUR(o.precio_salida)}</TableCell>
                <TableCell>
                  <Badge variant={disponToVariant(o.disponibilidad)}>{o.disponibilidad}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" type="button">⋮</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setViewObra(o)}>
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditObra(o)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog open={confirmDeleteId === o.id_obra} onOpenChange={(open) => setConfirmDeleteId(open ? o.id_obra : null)}>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Eliminar…
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar la obra?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                              <Button variant="outline" type="button">Cancelar</Button>
                            </AlertDialogCancel>
                            {/* Forzamos type="button" para evitar submits accidentales */}
                            <AlertDialogAction asChild>
                              <Button variant="destructive" type="button" onClick={() => remove(o.id_obra)}>
                                Sí, borrar
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {!pageItems.length && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay obras que coincidan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {total ? start + 1 : 0}–{Math.min(end, total)} de {total}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => goPage(currentPage - 1)} />
            </PaginationItem>

            {pageNums.map((n, i) =>
              n > 0 ? (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={n === currentPage}
                    onClick={() => goPage(n)}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext onClick={() => goPage(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialog: Ver */}
      <Dialog open={!!viewObra} onOpenChange={(open) => !open && setViewObra(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewObra?.titulo}</DialogTitle>
            <DialogDescription>{viewObra?.autor}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 text-sm">
            <div><span className="text-muted-foreground">Tipo:</span> {viewObra?.tipo}</div>
            <div><span className="text-muted-foreground">Año:</span> {viewObra?.anio}</div>
            <div><span className="text-muted-foreground">Precio salida:</span> {viewObra ? fmtEUR(viewObra.precio_salida) : ""}</div>
            <div><span className="text-muted-foreground">Estado:</span> {viewObra?.disponibilidad}</div>
            {viewObra?.ubicacion_actual && (<div><span className="text-muted-foreground">Ubicación:</span> {viewObra.ubicacion_actual}</div>)}
            {viewObra?.descripcion && (<div><span className="text-muted-foreground">Descripción:</span> {viewObra.descripcion}</div>)}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setViewObra(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Editar */}
      <Dialog open={!!editObra} onOpenChange={(open) => !open && setEditObra(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar obra</DialogTitle>
            <DialogDescription>{editObra?.titulo}</DialogDescription>
          </DialogHeader>

          {!!editObra && (
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="e_titulo">Título</Label>
                <Input id="e_titulo" value={editObra.titulo} onChange={(e) => setEditObra({ ...editObra, titulo: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e_autor">Autor</Label>
                <Input id="e_autor" value={editObra.autor} onChange={(e) => setEditObra({ ...editObra, autor: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e_anio">Año</Label>
                <Input id="e_anio" type="number" value={editObra.anio} onChange={(e) => setEditObra({ ...editObra, anio: Number(e.target.value) })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e_precio">Precio salida (€)</Label>
                <Input id="e_precio" type="number" step="0.01" value={editObra.precio_salida} onChange={(e) => setEditObra({ ...editObra, precio_salida: Number(e.target.value) })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e_tipo">Tipo</Label>
                <Input id="e_tipo" value={editObra.tipo} onChange={(e) => setEditObra({ ...editObra, tipo: e.target.value as ObraArte["tipo"] })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e_dispon">Disponibilidad</Label>
                <Input id="e_dispon" value={editObra.disponibilidad} onChange={(e) => setEditObra({ ...editObra, disponibilidad: e.target.value as ObraArte["disponibilidad"] })} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setEditObra(null)}>Cancelar</Button>
            <Button type="button" onClick={saveEdit}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
