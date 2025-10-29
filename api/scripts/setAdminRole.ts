/**
 * Script para asignar el rol de admin a un usuario en Firebase
 *
 * Uso:
 * npm run set-admin-role admin@gallery.com
 *
 * O directamente con ts-node:
 * npx ts-node api/scripts/setAdminRole.ts admin@gallery.com
 */

import * as admin from "firebase-admin";
import * as path from "path";
import * as dotenv from "dotenv";

// Cargar variables de entorno desde api/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Inicializar Firebase Admin
function initializeFirebase() {
  // Opción 1: Service Account Path
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath) {
    // Resolver la ruta relativa desde el directorio api/
    const absolutePath = path.resolve(__dirname, "..", serviceAccountPath);
    console.log(`🔍 Buscando service account en: ${absolutePath}`);
    const serviceAccount = require(absolutePath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase initialized with service account");
    return;
  }

  // Opción 2: Environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey && !privateKey.includes("BEGIN PRIVATE KEY")) {
    try {
      privateKey = Buffer.from(privateKey, "base64").toString("utf-8");
    } catch (error) {
      console.warn("⚠️  Failed to decode base64 private key");
    }
  }

  privateKey = privateKey?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("✅ Firebase initialized with environment variables");
    return;
  }

  throw new Error(
    "❌ Firebase Admin SDK requires either FIREBASE_SERVICE_ACCOUNT_PATH or " +
      "(FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)"
  );
}

async function setAdminRole(email: string) {
  try {
    console.log(`\n🔍 Buscando usuario: ${email}`);

    // Buscar usuario por email
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✅ Usuario encontrado: ${user.uid}`);

    // Verificar custom claims actuales
    const currentClaims = user.customClaims || {};
    console.log(`📋 Custom Claims actuales:`, currentClaims);

    // Asignar el rol de admin
    await admin.auth().setCustomUserClaims(user.uid, {
      ...currentClaims,
      role: "admin",
    });

    console.log(`✅ Rol de admin asignado exitosamente a ${email}`);
    console.log(`\n⚠️  IMPORTANTE: El usuario debe cerrar sesión y volver a iniciar sesión para que los cambios surtan efecto.`);
    console.log(`   Esto se debe a que los Custom Claims se incluyen en el token de autenticación.`);

    // Verificar que se aplicó correctamente
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log(`\n📋 Custom Claims actualizados:`, updatedUser.customClaims);

  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      console.error(`❌ Error: No se encontró ningún usuario con el email ${email}`);
      console.log(`\n💡 Sugerencia: Verifica que el email esté escrito correctamente y que el usuario exista en Firebase Authentication.`);
    } else {
      console.error(`❌ Error al asignar rol de admin:`, error.message);
    }
    process.exit(1);
  }
}

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error(`❌ Error: Debes proporcionar un email como argumento`);
    console.log(`\nUso: npm run set-admin-role admin@gallery.com`);
    console.log(`O: npx ts-node api/scripts/setAdminRole.ts admin@gallery.com`);
    process.exit(1);
  }

  console.log(`\n🚀 Iniciando script para asignar rol de admin...`);

  // Inicializar Firebase
  initializeFirebase();

  // Asignar rol
  await setAdminRole(email);

  console.log(`\n✅ Script completado exitosamente\n`);
  process.exit(0);
}

main().catch((error) => {
  console.error(`❌ Error inesperado:`, error);
  process.exit(1);
});
