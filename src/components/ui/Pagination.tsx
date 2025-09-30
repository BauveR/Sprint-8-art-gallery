import * as React from "react";
import { Button } from "./button";

interface PaginationProps {
  page: number;           // 1-based
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < pages;

  // simple window
  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(pages, start + windowSize - 1);
  const range = [];
  for (let p = start; p <= end; p++) range.push(p);

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" disabled={!canPrev} onClick={() => canPrev && onPageChange(page - 1)}>
        Anterior
      </Button>

      <div className="flex items-center gap-1">
        {range.map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "secondary"}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
      </div>

      <Button variant="secondary" disabled={!canNext} onClick={() => canNext && onPageChange(page + 1)}>
        Siguiente
      </Button>

      <span className="text-sm text-gray-600 ml-2">
        Página {page} de {pages} · {total} registros
      </span>
    </div>
  );
}
