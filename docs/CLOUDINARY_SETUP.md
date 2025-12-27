# Configuración de Upload Directo a Cloudinary

Este documento explica cómo configurar y usar el nuevo sistema de upload directo a Cloudinary que **no requiere Railway** para subir imágenes.

---

## 🎯 Resumen

El proyecto ahora soporta **dos modos de upload de imágenes**:

| Modo | Descripción | Ventajas | Desventajas |
|------|-------------|----------|-------------|
| **DIRECT_TO_CLOUDINARY** (actual) | Sube desde el navegador directamente a Cloudinary | ✅ Gratis (sin Railway)<br>✅ Más rápido<br>✅ Cloudinary free tier 25GB | ⚠️ Requiere configurar upload preset |
| **VIA_BACKEND** (original) | Sube a través del backend con Multer | ✅ Control total<br>✅ Validación en servidor | ❌ Requiere Railway ($$$)<br>❌ Más lento |

---

## 📋 Configuración del Modo Directo (Recomendado)

### Paso 1: Crear Upload Preset en Cloudinary

1. Ve a tu dashboard de Cloudinary: https://console.cloudinary.com/
2. Navega a **Settings → Upload**
3. Scroll hasta la sección **"Upload presets"**
4. Haz clic en **"Add upload preset"**

5. Configura el preset con estos valores:

```
Preset name: art-gallery-unsigned
Signing mode: Unsigned (IMPORTANTE ⚠️)
Folder: art-gallery/obras
Unique filename: true
Overwrite: false
```

6. En la sección **"Eager transformations"** (opcional pero recomendado):
   - Agrega: `c_limit,w_1200,h_1200`
   - Agrega: `q_auto:good`

7. **Guarda** el preset

8. **Copia** el nombre del preset (por ejemplo: `art-gallery-unsigned`)

---

### Paso 2: Configurar Variables de Entorno

Agrega estas variables en tu archivo `.env.local` (frontend):

```bash
# Cloudinary - Upload directo
VITE_CLOUDINARY_CLOUD_NAME=dmweipuof
VITE_CLOUDINARY_UPLOAD_PRESET=art-gallery-unsigned  # El nombre que copiaste en el paso 1
```

**NOTA:** Si cambiaste tu cloud name en Cloudinary, usa ese valor en lugar de `dmweipuof`.

---

### Paso 3: Verificar la Configuración

Abre el archivo `src/config/cloudinary.ts` y verifica que esté configurado así:

```typescript
export const CURRENT_UPLOAD_MODE: UploadMode = 'DIRECT_TO_CLOUDINARY';
```

Si está configurado como `'VIA_BACKEND'`, cámbialo a `'DIRECT_TO_CLOUDINARY'`.

---

### Paso 4: Probar el Upload

1. Inicia el frontend:
```bash
npm run dev
```

2. Inicia sesión como admin

3. Ve a la página de **Obras** y edita una obra

4. Intenta subir una imagen

5. **Abre la consola del navegador** (F12) y verifica estos logs:
```
[Upload] Modo: DIRECT_TO_CLOUDINARY
[Upload] Imagen subida a Cloudinary: https://res.cloudinary.com/...
[Upload] URL guardada en base de datos
```

6. La imagen debería aparecer en la galería de la obra

---

## 🔄 Cambiar entre Modos

### Activar Modo Directo (DIRECT_TO_CLOUDINARY)

**Frontend:** En `src/config/cloudinary.ts`:
```typescript
export const CURRENT_UPLOAD_MODE: UploadMode = 'DIRECT_TO_CLOUDINARY';
```

**Requisitos:**
- ✅ Upload preset configurado en Cloudinary
- ✅ Variables de entorno en `.env.local`
- ✅ Backend corriendo (solo para guardar URLs en MySQL)

---

### Reactivar Modo Original (VIA_BACKEND)

**Frontend:** En `src/config/cloudinary.ts`:
```typescript
export const CURRENT_UPLOAD_MODE: UploadMode = 'VIA_BACKEND';
```

**Requisitos:**
- ✅ Backend corriendo con todas las dependencias
- ✅ Railway desplegado O backend local corriendo
- ✅ Multer configurado (ya está listo)

---

## 🛠️ Flujo Técnico

### Modo DIRECT_TO_CLOUDINARY (Actual)

```
1. Usuario selecciona imagen en el navegador
   ↓
2. useObraImages valida tamaño y cantidad (frontend)
   ↓
3. imageService.uploadDirectToCloudinary() sube a Cloudinary
   ↓
4. Cloudinary retorna la URL de la imagen
   ↓
5. imageService.saveImageUrl() guarda la URL en MySQL
   ↓
6. Frontend recarga la lista de imágenes
```

**Archivos modificados:**
- ✨ `src/config/cloudinary.ts` (nuevo)
- ✨ `src/services/imageService.ts` (método nuevo: `uploadDirectToCloudinary`)
- ✨ `src/hooks/useObraImages.ts` (lógica condicional)
- ✨ `api/src/controllers/imagesController.ts` (endpoint nuevo: `saveImageUrl`)
- ✨ `api/src/routes/index.ts` (ruta nueva: `POST /obras/:id/imagenes/url`)

---

### Modo VIA_BACKEND (Original)

```
1. Usuario selecciona imagen en el navegador
   ↓
2. useObraImages valida tamaño y cantidad (frontend)
   ↓
3. imageService.uploadForObra() envía archivo al backend
   ↓
4. Backend recibe archivo con Multer
   ↓
5. Backend sube a Cloudinary con transformaciones
   ↓
6. Backend guarda URL en MySQL
   ↓
7. Backend retorna URL al frontend
   ↓
8. Frontend recarga la lista de imágenes
```

**Archivos (sin cambios, funciona igual que antes):**
- ⚠️ `src/services/imageService.ts` (método original: `uploadForObra`)
- ⚠️ `api/src/controllers/imagesController.ts` (endpoint original: `uploadForObra`)
- ⚠️ `api/src/routes/index.ts` (ruta original: `POST /obras/:id/imagenes`)

---

## 🔒 Seguridad

### Modo DIRECT_TO_CLOUDINARY

**Validaciones en Frontend:**
- Tamaño máximo: 2MB
- Cantidad máxima: 3 imágenes por obra
- Tipos permitidos: JPEG, PNG, WEBP, GIF

**Validaciones en Backend:**
- URL debe ser de Cloudinary (`res.cloudinary.com`)
- Autenticación Firebase requerida
- Solo admins pueden guardar URLs

**Upload Preset en Cloudinary:**
- Modo: Unsigned (permite uploads sin autenticación)
- Folder: `art-gallery/obras` (organiza las imágenes)
- Transformaciones: Limita tamaño y optimiza calidad

**NOTA:** El modo "unsigned" es seguro porque:
1. Solo permite subir a una carpeta específica
2. Cloudinary tiene rate limiting automático
3. No expone credenciales sensibles
4. El backend valida que la URL sea de Cloudinary antes de guardarla

---

## 📊 Límites de Cloudinary Free Tier

- **Almacenamiento:** 25 GB
- **Ancho de banda:** 25 GB/mes
- **Transformaciones:** 25 créditos/mes
- **Imágenes:** Ilimitadas

Para la galería de arte, esto es suficiente para:
- ~5,000 imágenes de alta calidad (500KB promedio)
- ~50,000 visualizaciones/mes

---

## 🐛 Troubleshooting

### Error: "Upload preset not found"

**Causa:** El preset no existe o el nombre está mal escrito.

**Solución:**
1. Verifica que creaste el preset en Cloudinary
2. Copia exactamente el nombre del preset
3. Actualiza `VITE_CLOUDINARY_UPLOAD_PRESET` en `.env.local`
4. Reinicia el servidor de desarrollo

---

### Error: "Invalid signature"

**Causa:** El preset está configurado como "signed" en lugar de "unsigned".

**Solución:**
1. Ve a Cloudinary → Settings → Upload
2. Edita el preset `art-gallery-unsigned`
3. Cambia "Signing mode" a **Unsigned**
4. Guarda

---

### Error: "URL inválida. Debe ser de Cloudinary"

**Causa:** El backend rechaza la URL porque no es de Cloudinary.

**Solución:**
1. Verifica que la imagen se subió correctamente a Cloudinary
2. Verifica que la URL comienza con `https://res.cloudinary.com/`
3. Revisa los logs del navegador para ver la URL generada

---

### Las imágenes no aparecen después de subirlas

**Causa:** El backend no está corriendo o no puede guardar en MySQL.

**Solución:**
1. Verifica que el backend está corriendo
2. Revisa los logs del backend:
   ```
   [SaveURL] Saving image URL for obra X: https://...
   [SaveURL] URL saved to DB with id: Y
   ```
3. Verifica la conexión a MySQL
4. Revisa la tabla `obra_imagenes` en MySQL

---

## 📝 Notas para Desarrollo

### Para volver al modo original:

1. Abre `src/config/cloudinary.ts`
2. Cambia:
   ```typescript
   export const CURRENT_UPLOAD_MODE: UploadMode = 'VIA_BACKEND';
   ```
3. Asegúrate que el backend esté corriendo
4. Todo funcionará como antes

### Para desarrollo local:

Puedes usar cualquier modo:
- **DIRECT_TO_CLOUDINARY:** No requiere Railway, solo MySQL local
- **VIA_BACKEND:** Corre el backend localmente con `npm run dev` en `/api`

### Para producción:

- **Frontend:** Deploy en Vercel/Netlify
- **Backend:** Solo necesario para guardar URLs (puede ser Render free tier)
- **Imágenes:** Cloudinary (free tier)
- **Base de datos:** PlanetScale (free tier) o MySQL

---

## 🔗 Enlaces Útiles

- [Cloudinary Dashboard](https://console.cloudinary.com/)
- [Cloudinary Upload Presets Docs](https://cloudinary.com/documentation/upload_presets)
- [Cloudinary Unsigned Upload Docs](https://cloudinary.com/documentation/upload_images#unsigned_upload)

---

## ✅ Checklist de Configuración

- [ ] Upload preset creado en Cloudinary (nombre: `art-gallery-unsigned`)
- [ ] Preset configurado como "Unsigned"
- [ ] Variables de entorno agregadas en `.env.local`
- [ ] `CURRENT_UPLOAD_MODE` configurado como `'DIRECT_TO_CLOUDINARY'`
- [ ] Backend corriendo (para guardar URLs)
- [ ] Probado subiendo una imagen como admin
- [ ] Imagen visible en la galería

---

## 📞 Soporte

Si tienes problemas, revisa:
1. Logs del navegador (F12 → Console)
2. Logs del backend (terminal donde corre el backend)
3. Esta documentación (sección Troubleshooting)

¡Listo! Ahora puedes subir imágenes sin pagar Railway. 🎉
