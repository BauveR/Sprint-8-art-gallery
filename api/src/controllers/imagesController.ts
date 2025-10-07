// src/controllers/imagesController.ts
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as svc from "../services/imagesService";
import * as imageRepo from "../repositories/imagesRepo"; // ← nombre EXACTO del archivo

const uploadDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename(_req, file, cb) {
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${ts}-${safe}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Tipo de archivo no permitido"));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2MB máximo
});

type MulterReq = Request & { file?: Express.Multer.File };

export async function listByObra(req: Request, res: Response, next: NextFunction) {
  try {
    const id_obra = Number(req.params.id);
    if (Number.isNaN(id_obra)) throw new Error("ID inválido");
    const imgs = await svc.getByObra(id_obra);
    res.json(imgs);
  } catch (e) { next(e); }
}

export async function uploadForObra(req: MulterReq, res: Response, next: NextFunction) {
  try {
    const id_obra = Number(req.params.id);
    if (Number.isNaN(id_obra)) throw new Error("ID inválido");

    const file = req.file;
    if (!file) return res.status(400).json({ error: "Archivo requerido (campo 'file')" });

    const publicUrl = `/uploads/${path.basename(file.path)}`;
    const { id } = await svc.addImagen(id_obra, publicUrl);
    res.status(201).json({ id, url: publicUrl });
  } catch (e) { next(e); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");

    const { url } = await svc.deleteImagen(id);

    // 1) borra fila en DB usando el MISMO objeto de módulo
    await imageRepo.deleteImagen(id);

    // 2) borra archivo físico si existe
    if (url) {
      const filename = url.split("/uploads/")[1];
      if (filename) {
        const abs = path.join(uploadDir, filename);
        try { await fs.promises.unlink(abs); } catch { /* ignore */ }
      }
    }

    res.status(204).end();
  } catch (e) { next(e); }
}
