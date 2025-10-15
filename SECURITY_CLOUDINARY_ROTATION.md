# 🚨 ROTACIÓN DE CREDENCIALES DE CLOUDINARY - URGENTE

## ⚠️ Problema Detectado

GitGuardian detectó que las credenciales de Cloudinary fueron expuestas en GitHub en el commit `6501bd2`.

**Credenciales comprometidas:**
- Cloud Name: `dmweipuof`
- API Key: `144483678174765`
- API Secret: `_9A6hZWhbLbeoQkghZCFNaNoq84`

## ✅ Pasos para Rotar Credenciales (HACER AHORA)

### Paso 1: Rotar API Key en Cloudinary

1. **Ve a Cloudinary Dashboard:** https://console.cloudinary.com/settings/security
2. **Security → API Keys**
3. **Encuentra la API Key:** `144483678174765`
4. **Clic en "Revoke"** o **"Reset API Secret"**
5. **Confirma la revocación**
6. **Genera nuevas credenciales:**
   - Clic en "Generate New API Key" o "Add API Key"
   - **Copia las nuevas credenciales** (Cloud Name permanece igual)

**Nuevas credenciales serán algo como:**
```
CLOUDINARY_CLOUD_NAME=dmweipuof  (no cambia)
CLOUDINARY_API_KEY=nuevo_api_key_aqui
CLOUDINARY_API_SECRET=nuevo_api_secret_aqui
```

---

### Paso 2: Actualizar Credenciales en Railway

1. **Ve a Railway:** https://railway.app
2. **Selecciona tu proyecto → Backend service**
3. **Variables tab**
4. **Actualiza estas 2 variables:**
   - `CLOUDINARY_API_KEY` = nuevo valor
   - `CLOUDINARY_API_SECRET` = nuevo valor
5. Railway se redeployará automáticamente

---

### Paso 3: Actualizar Credenciales Localmente

Edita tu archivo `api/.env` (NO el .env.example):
```env
CLOUDINARY_CLOUD_NAME=dmweipuof
CLOUDINARY_API_KEY=tu_nuevo_api_key
CLOUDINARY_API_SECRET=tu_nuevo_api_secret
```

---

### Paso 4: Limpiar el Repositorio

```bash
# 1. Asegúrate que .env.example NO tenga credenciales reales
# 2. El .env.example debe tener solo placeholders
cd api
cat .env.example | grep CLOUDINARY
# Debe mostrar:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

---

## ⚠️ Por qué NO limpiar el historial de Git

Limpiar el historial de Git (`git filter-branch` o BFG Repo-Cleaner) es complicado y puede romper el repositorio. Es más seguro **rotar las credenciales** y dejar el historial como está.

**Las credenciales antiguas quedarán en el historial, pero estarán revocadas y no funcionarán.**

---

## 🔐 Prevención Futura

### .gitignore ya está configurado correctamente:
```
.env
api/.env
.env.production
```

### NUNCA hagas esto:
❌ `git add api/.env`
❌ Poner credenciales reales en archivos `.example`
❌ Commitear archivos con secretos

### SIEMPRE haz esto:
✅ Usa `.env` para credenciales locales (está en .gitignore)
✅ Usa `.env.example` con valores de ejemplo como `your_api_key`
✅ Revisa `git status` antes de commit
✅ Usa Railway/Vercel variables para producción

---

## 📋 Checklist de Verificación

- [ ] Nuevas credenciales generadas en Cloudinary
- [ ] Credenciales antiguas revocadas en Cloudinary
- [ ] Variables actualizadas en Railway
- [ ] `api/.env` local actualizado con nuevas credenciales
- [ ] `api/.env.example` tiene solo placeholders (sin credenciales reales)
- [ ] Backend en Railway funciona con nuevas credenciales
- [ ] Frontend en Vercel puede subir imágenes

---

## 🧪 Verificar que Funciona

```bash
# Desde local (después de actualizar .env):
cd api
npm run dev

# En otra terminal:
curl -X POST http://localhost:3000/api/test-cloudinary
# (si creas un endpoint de test)

# O prueba subiendo una imagen desde la app en:
# http://localhost:5173
```

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que las nuevas credenciales estén correctas
2. Revisa los logs de Railway: `railway logs`
3. Verifica que las variables de Railway no tengan espacios extra
4. Asegúrate de que Cloudinary no tenga restricciones de IP

---

## ⏱️ Tiempo Estimado

- Rotar credenciales en Cloudinary: **2 minutos**
- Actualizar Railway: **1 minuto + 2 min deploy**
- Actualizar local: **1 minuto**
- Verificar: **2 minutos**

**Total: ~10 minutos**
