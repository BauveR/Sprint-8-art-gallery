/**
 * TEMPORAL: Endpoint para configurar rol de admin
 *
 * ⚠️ IMPORTANTE: Este endpoint debería ser ELIMINADO después de usar
 * Solo se usa una vez para configurar el primer usuario admin
 *
 * Uso:
 * POST /api/admin-setup/set-admin-role
 * Body: { "email": "admin@gallery.com", "secret": "TU_SECRET_KEY" }
 */

import { Router } from "express";
import { getAuth } from "../config/firebase-admin";

const router = Router();

// Secret key para evitar acceso no autorizado
// En producción, configura esta variable de entorno en Railway
const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || "change-me-in-production";

router.post("/set-admin-role", async (req, res) => {
  try {
    const { email, secret } = req.body;

    // Log para debugging (TEMPORAL)
    console.log(`[Admin Setup] Received secret: ${secret ? 'PROVIDED' : 'MISSING'}`);
    console.log(`[Admin Setup] Expected secret: ${SETUP_SECRET ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
    console.log(`[Admin Setup] Secrets match: ${secret === SETUP_SECRET}`);

    // Validar secret
    if (!secret || secret !== SETUP_SECRET) {
      console.warn(`[Admin Setup] Unauthorized attempt to set admin role`);
      return res.status(403).json({
        error: "Unauthorized",
        message: "Invalid secret key",
        debug: {
          receivedSecretLength: secret?.length || 0,
          expectedSecretLength: SETUP_SECRET?.length || 0,
          secretsMatch: secret === SETUP_SECRET
        }
      });
    }

    // Validar email
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Email is required"
      });
    }

    console.log(`[Admin Setup] Attempting to set admin role for: ${email}`);

    // Buscar usuario por email
    const user = await getAuth().getUserByEmail(email);
    console.log(`[Admin Setup] User found: ${user.uid}`);

    // Verificar custom claims actuales
    const currentClaims = user.customClaims || {};
    console.log(`[Admin Setup] Current custom claims:`, currentClaims);

    // Asignar el rol de admin
    await getAuth().setCustomUserClaims(user.uid, {
      ...currentClaims,
      role: "admin",
    });

    console.log(`[Admin Setup] ✅ Admin role assigned successfully to ${email}`);

    // Verificar que se aplicó correctamente
    const updatedUser = await getAuth().getUser(user.uid);
    console.log(`[Admin Setup] Updated custom claims:`, updatedUser.customClaims);

    return res.status(200).json({
      success: true,
      message: `Admin role assigned successfully to ${email}`,
      uid: user.uid,
      customClaims: updatedUser.customClaims,
      warning: "User must logout and login again for changes to take effect"
    });

  } catch (error: any) {
    console.error("[Admin Setup] Error:", error);

    if (error.code === "auth/user-not-found") {
      return res.status(404).json({
        error: "User Not Found",
        message: `No user found with email: ${req.body.email}`
      });
    }

    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Failed to set admin role"
    });
  }
});

// Endpoint para verificar custom claims de un usuario
router.get("/verify-claims/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { secret } = req.query;

    // Validar secret
    if (!secret || secret !== SETUP_SECRET) {
      return res.status(403).json({
        error: "Unauthorized",
        message: "Invalid secret key"
      });
    }

    const user = await getAuth().getUserByEmail(email);

    return res.status(200).json({
      success: true,
      uid: user.uid,
      email: user.email,
      customClaims: user.customClaims || {}
    });

  } catch (error: any) {
    console.error("[Admin Setup] Error verifying claims:", error);

    if (error.code === "auth/user-not-found") {
      return res.status(404).json({
        error: "User Not Found",
        message: `No user found with email: ${req.params.email}`
      });
    }

    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
});

export default router;
