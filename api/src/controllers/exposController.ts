import { Request, Response, NextFunction } from "express";
import * as svc from "../services/exposService";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await svc.listExpos());
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const id = await svc.createExpo(req.body);
    res.status(201).json({ id_expo: id });
  } catch (e) {
    next(e);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    await svc.updateExpo(id, req.body);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    await svc.removeExpo(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
