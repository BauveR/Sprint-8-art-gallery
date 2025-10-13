import * as admin from "firebase-admin";
import * as path from "path";

let firebaseApp: admin.app.App | null = null;

export function initializeFirebaseAdmin(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Opción 1: Usar archivo de service account
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (serviceAccountPath) {
      // Resolver la ruta relativa a absoluta desde la raíz del proyecto
      const absolutePath = path.resolve(__dirname, '../../', serviceAccountPath);
      const serviceAccount = require(absolutePath);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("[Firebase Admin] Initialized with service account from:", absolutePath);
      return firebaseApp;
    }

    // Opción 2: Usar credenciales individuales (para development/testing)
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Si la private key está en base64, decodificarla
    if (privateKey && !privateKey.includes('BEGIN PRIVATE KEY')) {
      try {
        privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
        console.log("[Firebase Admin] Decoded private key from base64");
      } catch (error) {
        console.warn("[Firebase Admin] Failed to decode base64, trying as plain text");
      }
    }

    // Reemplazar \n literales con saltos de línea reales
    privateKey = privateKey?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("[Firebase Admin] Initialized with environment variables");
      return firebaseApp;
    }

    // Opción 3: Application Default Credentials (para Google Cloud)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.log("[Firebase Admin] Initialized with application default credentials");
      return firebaseApp;
    }

    throw new Error(
      "Firebase Admin SDK requires either FIREBASE_SERVICE_ACCOUNT_PATH or " +
        "(FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) to be set"
    );
  } catch (error) {
    console.error("[Firebase Admin] Initialization error:", error);
    throw error;
  }
}

export function getAuth(): admin.auth.Auth {
  if (!firebaseApp) {
    firebaseApp = initializeFirebaseAdmin();
  }
  return admin.auth(firebaseApp);
}
