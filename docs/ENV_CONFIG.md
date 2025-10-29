# Configuración de Variables de Entorno

## Resumen de cómo funciona

El código en `src/lib/api.ts` usa:
```javascript
const BASE = import.meta.env.VITE_API_URL || "/api";
```

Esto significa:
- Si existe `VITE_API_URL` → usa ese valor
- Si NO existe → usa `/api` como fallback

## Archivos de entorno y prioridad

Vite carga las variables en este orden (las últimas sobrescriben a las primeras):

1. `.env` - Base para todos los entornos
2. `.env.local` - Local para todos los entornos (**no se sube a git**)
3. `.env.[mode]` - Específico para cada modo (development, production)
4. `.env.[mode].local` - Local específico para cada modo (**no se sube a git**)
5. **Variables del sistema/plataforma** (ej: Vercel) ← **MÁXIMA PRIORIDAD**

## Configuración actual

### 🖥️ Desarrollo Local

**Archivos:**
- `.env.development` → `VITE_API_URL=http://localhost:3000/api`
- `.env.local` → `VITE_API_URL=http://localhost:3000/api`

**Resultado:**
```
http://localhost:3000/api
```

**Cómo usarlo:**
```bash
npm run dev
```

---

### 🚀 Producción (Vercel)

**Archivos:**
- `.env.production` → `VITE_API_URL=https://sprint-8-art-gallery-production.up.railway.app/api`

**Variables en Vercel Dashboard:**
- `VITE_API_URL` = `https://sprint-8-art-gallery-production.up.railway.app/api`

**Resultado final:**
Las variables de Vercel **sobrescriben** los archivos `.env`, así que se usa:
```
https://sprint-8-art-gallery-production.up.railway.app/api
```

**Cómo verificarlo:**
```bash
npm run build
grep "railway.app" dist/assets/index-*.js
# Debería mostrar la URL de Railway
```

---

## Actualizar la URL del backend en producción

Si cambias la URL del backend (ej: cambias de Railway a otro servicio):

### Opción 1: Actualizar en Vercel (Recomendado)
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Edita `VITE_API_URL` con la nueva URL
4. Redeploy (Settings → Deployments → ... → Redeploy)

### Opción 2: Actualizar en el código
1. Edita `.env.production`
2. Commit y push
3. Vercel se redeployará automáticamente

---

## Verificación

### En desarrollo:
```bash
npm run dev
# Abre http://localhost:5173
# Abre la consola del navegador
# Deberías ver: [API Config] Base URL: http://localhost:3000/api
```

### En producción:
1. Ve a: https://sprint-8-art-gallery.vercel.app
2. Abre la consola del navegador (F12)
3. Deberías ver: `[API Config] Base URL: https://sprint-8-art-gallery-production.up.railway.app/api`

---

## Troubleshooting

### Problema: "Failed to fetch" en desarrollo
**Solución:**
- Verifica que el backend esté corriendo: `curl http://localhost:3000/api/health`
- Verifica que `.env.local` tenga: `VITE_API_URL=http://localhost:3000/api`
- Reinicia Vite: `Ctrl+C` y luego `npm run dev`

### Problema: Las obras no cargan en producción
**Solución:**
- Verifica que Railway esté corriendo: `curl https://sprint-8-art-gallery-production.up.railway.app/api/health`
- Verifica la variable en Vercel Dashboard
- Verifica en la consola del navegador qué URL está usando
- Redeploy en Vercel

### Problema: Cambié `.env` pero no se refleja
**Solución:**
- **SIEMPRE reinicia Vite** después de cambiar `.env` en desarrollo
- En producción, debes hacer un nuevo deploy

---

## Archivos importantes

| Archivo | Propósito | Se sube a git |
|---------|-----------|---------------|
| `.env.example` | Plantilla con ejemplos | ✅ Sí |
| `.env.development` | Config de desarrollo | ✅ Sí |
| `.env.production` | Config de producción | ✅ Sí |
| `.env.local` | Overrides locales | ❌ No (en .gitignore) |
| `.env.production.local` | Overrides locales para prod | ❌ No (en .gitignore) |

---

## Configuración en Railway (Backend)

El backend también tiene variables de entorno en `api/.env`:

```env
# Base de datos
DB_HOST=127.0.0.1
DB_USER=arte_user
DB_PASS=TuNuevaPassSegura
DB_NAME=arte_db
PORT=3000

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME=dmweipuof
CLOUDINARY_API_KEY=144483678174765
CLOUDINARY_API_SECRET=_9A6hZWhbLbeoQkghZCFNaNoq84

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Stripe
STRIPE_SECRET_KEY=sk_test_...
```

**En Railway**, estas mismas variables se configuran en el dashboard de Railway (Settings → Variables).
