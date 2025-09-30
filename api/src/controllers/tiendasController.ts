import { Request, Response } from "express";
import * as svc from "../services/tiendasService";

export async function list(_req: Request, res: Response) {
  res.json(await svc.listTiendas());
}

export async function create(req: Request, res: Response) {
  try {
    const id = await svc.createTienda(req.body);
    res.status(201).json({ id_tienda: id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    res.status(400).json({ error: msg });
  }
}
