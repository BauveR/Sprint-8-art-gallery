import { Request, Response } from "express";
import * as direccionesService from "../services/direccionesService";

/**
 * Obtener todas las direcciones del usuario autenticado
 * GET /api/direcciones
 */
export async function getUserAddresses(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const addresses = await direccionesService.getUserAddresses(userId);

    res.json({
      success: true,
      data: addresses,
      count: addresses.length,
    });
  } catch (error: any) {
    console.error("Error al obtener direcciones:", error);
    res.status(500).json({ error: error.message || "Error al obtener direcciones" });
  }
}

/**
 * Obtener una dirección por ID
 * GET /api/direcciones/:id
 */
export async function getAddressById(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;
    const addressId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (isNaN(addressId)) {
      return res.status(400).json({ error: "ID de dirección inválido" });
    }

    const address = await direccionesService.getAddressById(addressId, userId);

    res.json({
      success: true,
      data: address,
    });
  } catch (error: any) {
    console.error("Error al obtener dirección:", error);
    const status = error.message === "Dirección no encontrada" ? 404 : 500;
    res.status(status).json({ error: error.message || "Error al obtener dirección" });
  }
}

/**
 * Obtener dirección predeterminada del usuario
 * GET /api/direcciones/default
 */
export async function getDefaultAddress(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const address = await direccionesService.getDefaultAddress(userId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "No tienes una dirección predeterminada",
      });
    }

    res.json({
      success: true,
      data: address,
    });
  } catch (error: any) {
    console.error("Error al obtener dirección predeterminada:", error);
    res.status(500).json({ error: error.message || "Error al obtener dirección" });
  }
}

/**
 * Crear una nueva dirección
 * POST /api/direcciones
 */
export async function createAddress(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const addressData = {
      ...req.body,
      id_user: userId,
    };

    const newAddress = await direccionesService.createAddress(addressData);

    res.status(201).json({
      success: true,
      message: "Dirección creada correctamente",
      data: newAddress,
    });
  } catch (error: any) {
    console.error("Error al crear dirección:", error);
    res.status(400).json({ error: error.message || "Error al crear dirección" });
  }
}

/**
 * Actualizar una dirección existente
 * PUT /api/direcciones/:id
 */
export async function updateAddress(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;
    const addressId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (isNaN(addressId)) {
      return res.status(400).json({ error: "ID de dirección inválido" });
    }

    const updatedAddress = await direccionesService.updateAddress(
      addressId,
      userId,
      req.body
    );

    res.json({
      success: true,
      message: "Dirección actualizada correctamente",
      data: updatedAddress,
    });
  } catch (error: any) {
    console.error("Error al actualizar dirección:", error);
    const status = error.message === "Dirección no encontrada" ? 404 : 400;
    res.status(status).json({ error: error.message || "Error al actualizar dirección" });
  }
}

/**
 * Establecer una dirección como predeterminada
 * POST /api/direcciones/:id/set-default
 */
export async function setDefaultAddress(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;
    const addressId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (isNaN(addressId)) {
      return res.status(400).json({ error: "ID de dirección inválido" });
    }

    const result = await direccionesService.setDefaultAddress(addressId, userId);

    res.json(result);
  } catch (error: any) {
    console.error("Error al establecer dirección predeterminada:", error);
    const status = error.message === "Dirección no encontrada" ? 404 : 400;
    res.status(status).json({
      error: error.message || "Error al establecer dirección predeterminada",
    });
  }
}

/**
 * Eliminar una dirección
 * DELETE /api/direcciones/:id
 */
export async function deleteAddress(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;
    const addressId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (isNaN(addressId)) {
      return res.status(400).json({ error: "ID de dirección inválido" });
    }

    const result = await direccionesService.deleteAddress(addressId, userId);

    res.json(result);
  } catch (error: any) {
    console.error("Error al eliminar dirección:", error);
    const status = error.message === "Dirección no encontrada" ? 404 : 400;
    res.status(status).json({ error: error.message || "Error al eliminar dirección" });
  }
}

/**
 * Obtener estadísticas de direcciones del usuario
 * GET /api/direcciones/stats
 */
export async function getAddressStats(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const stats = await direccionesService.getAddressStats(userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: error.message || "Error al obtener estadísticas" });
  }
}
