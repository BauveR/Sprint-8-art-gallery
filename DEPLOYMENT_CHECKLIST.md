# ✅ Checklist de Despliegue - Art Gallery

Usa este checklist para desplegar tu galería 100% gratis en producción.

---

## 📋 PRE-REQUISITOS

- [ ] Código en GitHub (repo público o privado)
- [ ] Cuenta de GitHub
- [ ] Cuenta de Vercel (signup con GitHub)
- [ ] Cuenta de Render (signup con GitHub)
- [ ] Cuenta de PlanetScale
- [ ] Cuenta de Cloudinary (ya tienes)
- [ ] Cuenta de Firebase (ya tienes)
- [ ] Cuenta de Stripe (ya tienes)

---

## 🗄️ PASO 1: BASE DE DATOS (PlanetScale)

### Crear Database

- [ ] Crear cuenta en https://planetscale.com
- [ ] Crear database: `art-gallery-db`
- [ ] Región: US East (o la más cercana)
- [ ] Plan: Free

### Configurar Conexión

- [ ] Create password para branch `main`
- [ ] Copiar credenciales (host, user, password, database)
- [ ] ⚠️ Guardar credenciales en lugar seguro (se muestran solo una vez)

### Migrar Datos

- [ ] Exportar schema: `mysqldump -u arte_user -p arte_db > schema.sql`
- [ ] Instalar PlanetScale CLI: `brew install planetscale/tap/pscale`
- [ ] Login: `pscale auth login`
- [ ] Crear branch dev: `pscale branch create art-gallery-db dev`
- [ ] Importar schema: `pscale shell art-gallery-db dev < schema.sql`
- [ ] Promover a producción: `pscale deploy-request create art-gallery-db dev`

---

## 🖥️ PASO 2: BACKEND (Render)

### Crear Web Service

- [ ] Ir a https://render.com
- [ ] New → Web Service
- [ ] Conectar repo de GitHub
- [ ] Configurar:
  - Name: `art-gallery-api`
  - Region: Oregon
  - Branch: `main`
  - Root Directory: `api`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Plan: Free

### Configurar Variables de Entorno

Agregar en Render Environment:

#### Base de Datos
- [ ] `NODE_ENV` = `production`
- [ ] `DB_HOST` = (de PlanetScale)
- [ ] `DB_USER` = (de PlanetScale)
- [ ] `DB_PASS` = (de PlanetScale)
- [ ] `DB_NAME` = `art-gallery-db`
- [ ] `DB_PORT` = `3306`

#### Cloudinary
- [ ] `CLOUDINARY_CLOUD_NAME` = `dmweipuof`
- [ ] `CLOUDINARY_API_KEY` = `865564625473872`
- [ ] `CLOUDINARY_API_SECRET` = `quBftxBFpJy0PANedgDjnAl45yw`

#### Stripe
- [ ] `STRIPE_SECRET_KEY` = (tu clave secreta)
- [ ] `STRIPE_WEBHOOK_SECRET` = (configurar después)

#### Firebase
- [ ] `FIREBASE_SERVICE_ACCOUNT_PATH` = `./firebase-service-account.json`

#### Admin
- [ ] `ADMIN_SETUP_SECRET` = `piedra-admin-setup-2024`

#### Frontend (configurar después)
- [ ] `FRONTEND_URL` = (URL de Vercel, se configura en paso 3)

#### Puerto
- [ ] `PORT` = `3000`

### Desplegar y Verificar

- [ ] Clic en "Create Web Service"
- [ ] Esperar build (~3-5 min)
- [ ] Copiar URL: `https://art-gallery-api.onrender.com`
- [ ] Verificar health: `https://art-gallery-api.onrender.com/api/health`
- [ ] Debería retornar: `{"ok": true}`

---

## 🎨 PASO 3: FRONTEND (Vercel)

### Crear Proyecto

- [ ] Ir a https://vercel.com
- [ ] Add New → Project
- [ ] Importar repo de GitHub
- [ ] Framework: Vite (autodetectado)
- [ ] Root Directory: `.`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Configurar Variables de Entorno

Agregar en Vercel Environment Variables:

#### Backend
- [ ] `VITE_API_URL` = `https://art-gallery-api.onrender.com/api`

#### Cloudinary
- [ ] `VITE_CLOUDINARY_CLOUD_NAME` = `dmweipuof`
- [ ] `VITE_CLOUDINARY_UPLOAD_PRESET` = `art-gallery-unsigned`

#### Stripe
- [ ] `VITE_STRIPE_PUBLIC_KEY` = (tu clave pública)

#### Firebase
- [ ] `VITE_FIREBASE_API_KEY` = `AIzaSyCmT8yIAIlXi33q2PfP3IrcL-P9gsZuRvQ`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` = `artgallery-e079a.firebaseapp.com`
- [ ] `VITE_FIREBASE_PROJECT_ID` = `artgallery-e079a`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` = `artgallery-e079a.appspot.com`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` = `944323091117`
- [ ] `VITE_FIREBASE_APP_ID` = `1:944323091117:web:1fde02b33500114b9b4424`

#### EmailJS (opcional)
- [ ] `VITE_EMAILJS_SERVICE_ID` = `service_xqnj90g`
- [ ] `VITE_EMAILJS_PUBLIC_KEY` = `7RiRJ06ufzLByfWI1`
- [ ] `VITE_EMAILJS_TEMPLATE_PAYMENT` = `template_sytummv`
- [ ] `VITE_EMAILJS_TEMPLATE_SHIPMENT` = `template_myt2b1f`

### Desplegar y Verificar

- [ ] Clic en "Deploy"
- [ ] Esperar build (~2-3 min)
- [ ] Copiar URL: `https://sprint-8-art-gallery.vercel.app`
- [ ] Abrir URL en navegador
- [ ] Verificar que la página carga

---

## 🔗 PASO 4: CONECTAR FRONTEND Y BACKEND

### Actualizar CORS en Render

- [ ] Ir a Render → art-gallery-api → Environment
- [ ] Editar `FRONTEND_URL` = `https://sprint-8-art-gallery.vercel.app` (tu URL real)
- [ ] Guardar (redespliega automáticamente)

### Verificar Conexión

- [ ] Abrir frontend en Vercel
- [ ] Ir a Shop
- [ ] Verificar que las obras cargan
- [ ] Verificar que las imágenes se ven
- [ ] Abrir DevTools (F12) → Console
- [ ] No debería haber errores de CORS

---

## ☁️ PASO 5: CLOUDINARY

### Crear Upload Preset (si no existe)

- [ ] Ir a https://console.cloudinary.com/settings/upload
- [ ] Scroll a "Upload presets"
- [ ] Add upload preset:
  - Preset name: `art-gallery-unsigned`
  - Signing mode: **Unsigned** ⚠️
  - Folder: `art-gallery/obras`
  - Unique filename: true
- [ ] Guardar

### Verificar Variable

- [ ] En Vercel, verificar: `VITE_CLOUDINARY_UPLOAD_PRESET` = `art-gallery-unsigned`
- [ ] Si falta o está mal, agregar/corregir
- [ ] Redeploy en Vercel si cambió

---

## 🔐 PASO 6: FIREBASE AUTH

### Agregar Dominio Autorizado

- [ ] Ir a Firebase Console
- [ ] Authentication → Settings → Authorized domains
- [ ] Agregar: `sprint-8-art-gallery.vercel.app` (tu dominio real)
- [ ] Guardar

---

## 💳 PASO 7: STRIPE WEBHOOKS

### Configurar Webhook

- [ ] Ir a https://dashboard.stripe.com/webhooks
- [ ] Add endpoint
- [ ] Endpoint URL: `https://art-gallery-api.onrender.com/api/payments/webhook`
- [ ] Eventos:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
- [ ] Crear endpoint
- [ ] Copiar "Signing secret" (`whsec_...`)

### Actualizar Variable en Render

- [ ] Ir a Render → Environment
- [ ] Editar `STRIPE_WEBHOOK_SECRET` = (signing secret copiado)
- [ ] Guardar (redespliega)

---

## ✅ PASO 8: VERIFICACIÓN FINAL

### Backend

- [ ] `curl https://art-gallery-api.onrender.com/api/health` → `{"ok": true}`
- [ ] `curl https://art-gallery-api.onrender.com/api/obras` → Lista de obras

### Frontend

- [ ] Página de inicio carga correctamente
- [ ] Shop muestra obras con imágenes
- [ ] Detalles de obra funcionan
- [ ] Login funciona
- [ ] (Admin) Subir imagen funciona
- [ ] Checkout con Stripe funciona

### Performance

- [ ] Primera carga < 3 seg
- [ ] Imágenes de Cloudinary cargan rápido
- [ ] No hay errores en Console (F12)

---

## 📊 LÍMITES A MONITOREAR

### Render (Backend)
- ✅ 750 hrs/mes (31 días = 744 hrs → perfecto para 1 app)
- ⚠️ Se duerme después de 15 min sin uso
- 📈 Monitorear en: Render Dashboard → Metrics

### PlanetScale (Database)
- ✅ 5GB almacenamiento
- ✅ 1B lecturas/mes
- ✅ 10M escrituras/mes
- 📈 Monitorear en: PlanetScale Dashboard → Insights

### Vercel (Frontend)
- ✅ 100GB bandwidth/mes
- ✅ Builds ilimitados
- 📈 Monitorear en: Vercel Dashboard → Analytics

### Cloudinary (Imágenes)
- ✅ 25GB almacenamiento
- ✅ 25GB bandwidth/mes
- 📈 Monitorear en: Cloudinary Dashboard → Usage

---

## 🎉 ¡COMPLETADO!

Tu galería está 100% desplegada y funcionando gratis en:

- ✅ Frontend: https://sprint-8-art-gallery.vercel.app
- ✅ Backend: https://art-gallery-api.onrender.com
- ✅ Database: PlanetScale
- ✅ Imágenes: Cloudinary

---

## 🐛 Si algo falla...

Consulta [DEPLOYMENT.md](./docs/DEPLOYMENT.md) sección "Troubleshooting" para:
- Backend se duerme (Render free)
- Error de conexión a PlanetScale
- CORS errors
- Imágenes no cargan
- Firebase Auth no funciona

---

**¿Problemas?** Abre un issue en GitHub o revisa los logs en:
- Render → Logs
- Vercel → Deployments → View Function Logs
- PlanetScale → Insights
