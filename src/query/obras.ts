import { useQuery } from "@tanstack/react-query";
import { obrasService } from "../services/obrasService";
import { Obra } from "../types";

type Sort = { key: string; dir: "asc" | "desc" };
type Paged<T> = { data: T[]; total: number; page: number; pageSize: number };

export function useObras(opts?: { sort?: Sort; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["obras"],
    queryFn: async () => {
      const data = await obrasService.list();
      const paged: Paged<Obra> = {
        data,
        total: data.length,
        page: 1,
        pageSize: data.length || 10,
      };
      return paged;
    },
  });
}
