import { v2 as cloudinary } from "cloudinary";

// Configurar cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log de configuración (solo en desarrollo o para debug)
console.log("[Cloudinary] Configuration loaded:");
console.log(`  - Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME ? "✓" : "✗ MISSING"}`);
console.log(`  - API Key: ${process.env.CLOUDINARY_API_KEY ? "✓" : "✗ MISSING"}`);
console.log(`  - API Secret: ${process.env.CLOUDINARY_API_SECRET ? "✓" : "✗ MISSING"}`);

export default cloudinary;
