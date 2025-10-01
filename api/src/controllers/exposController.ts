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
