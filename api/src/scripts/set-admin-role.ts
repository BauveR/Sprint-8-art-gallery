/**
 * Script para configurar un usuario como admin usando Firebase Custom Claims
 *
 * USO:
 *   ts-node src/scripts/set-admin-role.ts admin@gallery.com
 *
 * IMPORTANTE: Este script debe ejecutarse en el servidor backend, no en el frontend
 */

import { initializeFirebaseAdmin, getAuth } from "../config/firebase-admin";

async function setAdminRole(email: string) {
  try {
    // Inicializar Firebase Admin
    initializeFirebaseAdmin();
    console.log("[Script] Firebase Admin initialized");

    // Buscar usuario por email
    const user = await getAuth().getUserByEmail(email);
    console.log(`[Script] Found user: ${user.uid} (${user.email})`);

    // Configurar custom claim de admin
    await getAuth().setCustomUserClaims(user.uid, { role: "admin" });
    console.log(`[Script] ✅ Admin role set for ${user.email}`);
    console.log(`[Script] User must re-login to get new token with admin claim`);

    // Verificar que se configuró correctamente
    const updatedUser = await getAuth().getUser(user.uid);
    console.log("[Script] Current custom claims:", updatedUser.customClaims);

    process.exit(0);
  } catch (error) {
    console.error("[Script] Error setting admin role:", error);
    process.exit(1);
  }
}

// Obtener email de los argumentos de línea de comandos
const email = process.argv[2];

if (!email) {
  console.error("Usage: ts-node src/scripts/set-admin-role.ts <email>");
  console.error("Example: ts-node src/scripts/set-admin-role.ts admin@gallery.com");
  process.exit(1);
}

setAdminRole(email);
