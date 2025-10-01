import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as svc from "../services/imagesService";

// === Config multer ===
const uploadDir = path.resolve(__dirname, "../uploads"); // ../uploads (junto a dist/uploads)
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename(_req, file, cb) {
    // ejemplo: 1727800000000-originalname-sin-espacios.ext
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${ts}-${safe}`);
  },
});
export const upload = multer({ storage });

// GET /api/obras/:id/imagenes
export async function listByObra(req: Request, res: Response) {
  const id_obra = Number(req.params.id);
  const imgs = await svc.getByObra(id_obra);
  res.json(imgs);
}

// POST /api/obras/:id/imagenes (multipart/form-data, field: "file")
export async function uploadForObra(req: Request, res: Response) {
  const id_obra = Number(req.params.id);
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: "Archivo requerido (campo 'file')" });

  // URL pública
  const publicUrl = `/uploads/${path.basename(file.path)}`;
  const { id } = await svc.addImagen(id_obra, publicUrl);
  res.status(201).json({ id, url: publicUrl });
}

// DELETE /api/imagenes/:id
export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await svc.deleteImagen(id);
  res.status(204).end();
}
