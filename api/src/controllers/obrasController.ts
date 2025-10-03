import { Request, Response } from "express";
import * as svc from "../services/obrasService";
import type { SortKey, SortDir } from "../repositories/obrasRepo";
import { asyncHandler, parseIdParam } from "../utils/helpers";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const sort = (req.query.sort as SortKey | undefined) ?? undefined;
  const dir = (req.query.dir as SortDir | undefined) ?? undefined;

  const hasPage =
    typeof req.query.page !== "undefined" ||
    typeof req.query.pageSize !== "undefined";

  if (!hasPage) {
    const data = await svc.getObrasSorted(sort, dir);
    return res.json(data);
  }

  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await svc.getObrasPaged(sort, dir, page, pageSize);
  return res.json(result);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const id = await svc.createObra(req.body);
  res.status(201).json({ id_obra: id });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  await svc.updateObra(id, req.body);
  res.json({ ok: true });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  await svc.removeObra(id);
  res.status(204).end();
});

export const asignarTienda = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  const { id_tienda, fecha_entrada } = req.body || {};
  await svc.linkTienda(id, Number(id_tienda), fecha_entrada ?? null);
  res.json({ ok: true });
});

export const sacarTienda = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  const { fecha_salida } = req.body || {};
  await svc.unlinkTienda(id, fecha_salida ?? null);
  res.json({ ok: true });
});

export const asignarExpo = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  const { id_expo } = req.body || {};
  await svc.linkExpo(id, Number(id_expo));
  res.json({ ok: true });
});

export const quitarExpo = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  const { id_expo } = req.body || {};
  await svc.unlinkExpo(id, Number(id_expo));
  res.json({ ok: true });
});
