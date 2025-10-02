import { Request, Response, NextFunction } from "express";
import * as svc from "../services/tiendasService";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await svc.listTiendas());
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const id = await svc.createTienda(req.body);
    res.status(201).json({ id_tienda: id });
  } catch (e) {
    next(e);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    await svc.updateTienda(id, req.body);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    await svc.removeTienda(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
