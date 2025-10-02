import { Request, Response, NextFunction } from "express";
import * as svc from "../services/obrasService";
import type { SortKey, SortDir } from "../repositories/obrasRepo";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
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
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const id = await svc.createObra(req.body);
    res.status(201).json({ id_obra: id });
  } catch (e) {
    next(e);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    console.log(`[UPDATE] Actualizando obra ${id} con:`, req.body);
    await svc.updateObra(id, req.body);
    console.log(`[UPDATE] Obra ${id} actualizada exitosamente`);
    res.json({ ok: true });
  } catch (e) {
    console.error(`[UPDATE] Error actualizando obra ${id}:`, e);
    next(e);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    await svc.removeObra(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}

export async function asignarTienda(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    const { id_tienda, fecha_entrada } = req.body || {};
    await svc.linkTienda(id, Number(id_tienda), fecha_entrada ?? null);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function sacarTienda(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    const { fecha_salida } = req.body || {};
    await svc.unlinkTienda(id, fecha_salida ?? null);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function asignarExpo(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    const { id_expo } = req.body || {};
    await svc.linkExpo(id, Number(id_expo));
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function quitarExpo(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");
    const { id_expo } = req.body || {};
    await svc.unlinkExpo(id, Number(id_expo));
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
