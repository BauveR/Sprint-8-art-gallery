# Documentación del Proyecto - Art Gallery

Este directorio contiene la documentación técnica del proyecto de galería de arte.

---

## 📚 Documentos Disponibles

### [DEPLOYMENT.md](./DEPLOYMENT.md) 🚀 **NUEVO - ¡EMPIEZA AQUÍ!**
**Guía completa para desplegar tu galería 100% GRATIS** en Vercel + Render + PlanetScale.

**Lee este documento si:**
- Quieres desplegar a producción sin gastar dinero
- Necesitas migrar de Railway a alternativas gratuitas
- Quieres usar Vercel (frontend), Render (backend) y PlanetScale (database)
- Necesitas configurar todo desde cero para producción

### [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
Guía completa para configurar el sistema de upload directo a Cloudinary que **no requiere Railway** para subir imágenes.

**Lee este documento si:**
- No quieres pagar Railway
- Quieres entender cómo funcionan los uploads de imágenes
- Necesitas configurar el upload preset en Cloudinary
- Quieres cambiar entre los dos modos de upload

### [INSERT_IMAGES.md](./INSERT_IMAGES.md)
Guía para insertar imágenes de Cloudinary directamente en la base de datos (sin usar el upload del admin).

**Lee este documento si:**
- Ya tienes imágenes en Cloudinary y quieres que se vean en las obras
- Quieres insertar imágenes manualmente en MySQL
- Prefieres usar scripts SQL o Node.js para asignar imágenes a obras

---

## 🚀 Quick Start - Configuración de Cloudinary

### 1. Crear Upload Preset

1. Ve a: https://console.cloudinary.com/settings/upload
2. Clic en "Add upload preset"
3. Configuración:
   - Preset name: `art-gallery-unsigned`
   - Signing mode: **Unsigned** ⚠️
   - Folder: `art-gallery/obras`
4. Guarda y copia el nombre del preset

### 2. Variables de Entorno

Agrega en `.env.local`:
```bash
VITE_CLOUDINARY_CLOUD_NAME=dmweipuof
VITE_CLOUDINARY_UPLOAD_PRESET=art-gallery-unsigned
```

### 3. Verificar Configuración

En `src/config/cloudinary.ts`:
```typescript
export const CURRENT_UPLOAD_MODE: UploadMode = 'DIRECT_TO_CLOUDINARY';
```

### 4. Probar

```bash
npm run dev
```

Inicia sesión como admin, ve a Obras, edita una obra y sube una imagen.

---

## 🔄 Sistema de Upload de Imágenes

### Dos Modos Disponibles

| Modo | Requiere Railway | Velocidad | Costo |
|------|-----------------|-----------|-------|
| **DIRECT_TO_CLOUDINARY** | ❌ No | ⚡ Rápido | 💰 Gratis |
| **VIA_BACKEND** | ✅ Sí | 🐌 Lento | 💸 $5/mes |

### Cambiar de Modo

Edita `src/config/cloudinary.ts`:

```typescript
// Modo directo (sin Railway)
export const CURRENT_UPLOAD_MODE: UploadMode = 'DIRECT_TO_CLOUDINARY';

// Modo original (con Railway)
export const CURRENT_UPLOAD_MODE: UploadMode = 'VIA_BACKEND';
```

---

## 🎯 Archivos Clave Modificados

### Frontend

```
src/
├── config/
│   └── cloudinary.ts          ✨ NUEVO - Configuración de modos
├── services/
│   └── imageService.ts        ✨ Métodos nuevos agregados
├── hooks/
│   └── useObraImages.ts       ✨ Lógica condicional agregada
└── constants/
    └── images.ts              ✨ Error nuevo agregado
```

### Backend

```
api/src/
├── controllers/
│   └── imagesController.ts    ✨ Endpoint nuevo: saveImageUrl()
└── routes/
    └── index.ts               ✨ Ruta nueva: POST /obras/:id/imagenes/url
```

**IMPORTANTE:** Todo el código original está **intacto** y funcional. Solo se agregaron nuevas funcionalidades.

---

## 📋 Checklist de Configuración

- [ ] Upload preset creado en Cloudinary
- [ ] Variables agregadas en `.env.local`
- [ ] Modo configurado en `src/config/cloudinary.ts`
- [ ] Backend corriendo
- [ ] Imagen de prueba subida exitosamente

---

## 🐛 Problemas Comunes

### "Upload preset not found"
→ Verifica el nombre del preset en Cloudinary y `.env.local`

### "Invalid signature"
→ El preset debe estar en modo **Unsigned**

### "URL inválida"
→ Verifica que la imagen se subió a Cloudinary correctamente

Ver más detalles en [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md#-troubleshooting)

---

## 📞 Más Información

Para detalles completos, lee [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
