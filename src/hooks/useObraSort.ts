import { useState } from "react";
import { Obra } from "../types";

type Sort = {
  key: keyof Obra | "ubicacion" | "expo_nombre" | "tienda_nombre";
  dir: "asc" | "desc";
};

export function useObraSort(initialPageSize = 10) {
  const [sort, setSort] = useState<Sort>({ key: "id_obra", dir: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = initialPageSize;

  const toggleSort = (key: Sort["key"]) => {
    setPage(1); // reset paginación al cambiar sort
    setSort((s) => {
      if (s.key === key) {
        return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  const headerBtn = (label: string, key: Sort["key"]) => {
    const active = sort.key === key;
    return {
      label,
      active,
      dir: sort.dir,
      onClick: () => toggleSort(key),
    };
  };

  return {
    sort,
    page,
    pageSize,
    setPage,
    toggleSort,
    headerBtn,
  };
}
