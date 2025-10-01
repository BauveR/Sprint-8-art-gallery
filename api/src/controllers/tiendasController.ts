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
