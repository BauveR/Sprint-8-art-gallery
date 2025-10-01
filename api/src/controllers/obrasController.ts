import { Request, Response } from "express";
import * as svc from "../services/obrasService";
import type { SortKey, SortDir } from "../repositories/obrasRepo";

export async function list(req: Request, res: Response) {
  const sort = (req.query.sort as SortKey | undefined) ?? undefined;
  const dir = (req.query.dir as SortDir | undefined) ?? undefined;

  // Si NO hay page/pageSize -> modo legacy (array plano)
  const hasPage = typeof req.query.page !== "undefined" || typeof req.query.pageSize !== "undefined";
  if (!hasPage) {
    const data = await svc.getObrasSorted(sort, dir);
    return res.json(data); // ← array
  }

  // Si HAY page/pageSize -> modo paginado (objeto)
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await svc.getObrasPaged(sort, dir, page, pageSize);
  return res.json(result); // ← { data, total, page, pageSize }
}

export async function create(req: Request, res: Response) {
  try {
    const id = await svc.createObra(req.body);
    res.status(201).json({ id_obra: id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    res.status(400).json({ error: msg });
  }
}

export async function update(req: Request, res: Response) {
  try {
    await svc.updateObra(Number(req.params.id), req.body);
    res.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    const code = msg.includes("no encontrada") ? 404 : 400;
    res.status(code).json({ error: msg });
  }
}

export async function remove(req: Request, res: Response) {
  await svc.removeObra(Number(req.params.id));
  res.status(204).end();
}

export async function asignarTienda(req: Request, res: Response) {
  try {
    const { id_tienda, fecha_entrada } = req.body || {};
    await svc.linkTienda(Number(req.params.id), Number(id_tienda), fecha_entrada ?? null);
    res.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    res.status(400).json({ error: msg });
  }
}

export async function sacarTienda(req: Request, res: Response) {
  try {
    const { fecha_salida } = req.body || {};
    await svc.unlinkTienda(Number(req.params.id), fecha_salida ?? null);
    res.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    res.status(400).json({ error: msg });
  }
}

export async function asignarExpo(req: Request, res: Response) {
  try {
    const { id_expo } = req.body || {};
    await svc.linkExpo(Number(req.params.id), Number(id_expo));
    res.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    res.status(400).json({ error: msg });
  }
}

export async function quitarExpo(req: Request, res: Response) {
  try {
    const { id_expo } = req.body || {};
    await svc.unlinkExpo(Number(req.params.id), Number(id_expo));
    res.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    res.status(400).json({ error: msg });
  }
}
