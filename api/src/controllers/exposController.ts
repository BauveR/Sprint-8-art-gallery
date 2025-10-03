import { Request, Response } from "express";
import * as svc from "../services/exposService";
import { asyncHandler, parseIdParam } from "../utils/helpers";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await svc.listExpos());
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const id = await svc.createExpo(req.body);
  res.status(201).json({ id_expo: id });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  await svc.updateExpo(id, req.body);
  res.json({ ok: true });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = parseIdParam(req);
  await svc.removeExpo(id);
  res.status(204).end();
});
