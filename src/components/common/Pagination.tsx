import { Button } from "@/components/ui/button";

export function Pagination({
  page, total, pageSize, onPageChange,
}: { page: number; total: number; pageSize: number; onPageChange: (p: number) => void; }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between px-3 py-2 text-sm">
      <div>Página {page} de {totalPages} · {total} registros</div>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page<=1} onClick={() => onPageChange(Math.max(1, page-1))}>← Anterior</Button>
        <Button variant="secondary" disabled={page>=totalPages} onClick={() => onPageChange(Math.min(totalPages, page+1))}>Siguiente →</Button>
      </div>
    </div>
  );
}
