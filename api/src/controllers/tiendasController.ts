import { Request, Response } from "express";
import * as svc from "../services/tiendasService";
import { asyncHandler, parseIdParam } from "../utils/helpers";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await svc.listTiendas());
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const id = await svc.createTienda(req.body);
  res.status(201).json({ id_tienda: id });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  await svc.updateTienda(id, req.body);
  res.json({ ok: true });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  await svc.removeTienda(id);
  res.status(204).end();
});
