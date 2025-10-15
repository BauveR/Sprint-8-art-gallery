// src/controllers/imagesController.ts
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import * as svc from "../services/imagesService";
import * as imageRepo from "../repositories/imagesRepo";

// Multer para guardar archivos en memoria (buffer)
const storage = multer.memoryStorage();

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

    console.log(`[Upload] Starting upload for obra ${id_obra}, file: ${file.originalname}, size: ${file.size} bytes`);

    // Subir a Cloudinary usando buffer
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "art-gallery/obras",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" }, // Máximo 1200x1200
            { quality: "auto:good" }, // Optimización automática
          ],
        },
        (error, result) => {
          if (error) {
            console.error("[Cloudinary] Upload error:", error);
            reject(error);
          } else {
            console.log("[Cloudinary] Upload success:", result?.secure_url);
            resolve(result);
          }
        }
      );
      uploadStream.end(file.buffer);
    });

    const publicUrl = uploadResult.secure_url;
    const { id } = await svc.addImagen(id_obra, publicUrl);
    console.log(`[Upload] Image saved to DB with id: ${id}`);
    res.status(201).json({ id, url: publicUrl });
  } catch (e) {
    console.error("[Upload] Error:", e);
    next(e);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new Error("ID inválido");

    const { url } = await svc.deleteImagen(id);

    // 1) borra fila en DB
    await imageRepo.deleteImagen(id);

    // 2) borra imagen de Cloudinary si existe
    if (url && url.includes("cloudinary.com")) {
      try {
        // Extraer public_id de la URL de Cloudinary
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
        const urlParts = url.split("/");

        // El public_id incluye la carpeta
        const folderIndex = urlParts.indexOf("upload");
        if (folderIndex !== -1) {
          const pathParts = urlParts.slice(folderIndex + 1);
          // Filtrar transformaciones (empiezan con letras como v, w_, h_, etc)
          const cleanParts = pathParts.filter(part => !part.match(/^[a-z]_/));
          const publicId = cleanParts.join("/").replace(/\.[^/.]+$/, "");

          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error("[Cloudinary] Error deleting image:", error);
        // No fallar si hay error al eliminar de Cloudinary
      }
    }

    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
