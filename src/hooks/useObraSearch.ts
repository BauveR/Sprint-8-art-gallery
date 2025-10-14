import { useState, useMemo } from "react";
import { Obra } from "../types";

export function useObraSearch(obras: Obra[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredObras = useMemo(() => {
    if (!searchQuery.trim()) return obras;

    const query = searchQuery.toLowerCase();
    return obras.filter((obra) =>
      obra.autor?.toLowerCase().includes(query) ||
      obra.titulo?.toLowerCase().includes(query) ||
      obra.tecnica?.toLowerCase().includes(query) ||
      obra.tienda_nombre?.toLowerCase().includes(query) ||
      obra.expo_nombre?.toLowerCase().includes(query)
    );
  }, [obras, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredObras,
  };
}
