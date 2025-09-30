import { Request, Response } from "express";
import * as svc from "../services/exposService";

export async function list(_req: Request, res: Response) {
  res.json(await svc.listExpos());
}

export async function create(req: Request, res: Response) {
  try {
    const id = await svc.createExpo(req.body);
    res.status(201).json({ id_expo: id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    res.status(400).json({ error: msg });
  }
}
