# 🚀 Guía de Despliegue - Art Gallery (100% Gratis)

Esta guía te llevará paso a paso para desplegar tu galería de arte completamente gratis usando:

- **Frontend:** Vercel
- **Backend:** Render
- **Base de Datos:** PlanetScale
- **Imágenes:** Cloudinary

**Costo total: $0 / mes** 💰

---

## 📋 Requisitos Previos

- [ ] Cuenta de GitHub (tu código debe estar en un repo)
- [ ] Cuenta de Vercel (https://vercel.com)
- [ ] Cuenta de Render (https://render.com)
- [ ] Cuenta de PlanetScale (https://planetscale.com)
- [ ] Cuenta de Cloudinary (ya tienes)
- [ ] Cuenta de Firebase (ya tienes)
- [ ] Cuenta de Stripe (ya tienes)

---

## 📦 PASO 1: Preparar el Repositorio

### 1.1 Asegúrate de tener todos los archivos

```bash
git status
```

Deberías tener:
- ✅ `render.yaml` (configuración de Render)
- ✅ `api/.env.example` (ejemplo de variables)
- ✅ `api/firebase-service-account.json` (credenciales de Firebase)
- ✅ Todos los archivos del proyecto

### 1.2 Agregar archivos al .gitignore

Verifica que `.gitignore` incluya:

```
# No subir a Git:
api/.env
api/firebase-service-account.json
.env.local
node_modules/
dist/
```

**IMPORTANTE:** `firebase-service-account.json` NO debe estar en `.gitignore` para Render (lo necesita para autenticación). Si ya está ignorado, cámbialo.

### 1.3 Hacer commit y push

```bash
git add .
git commit -m "Preparar para despliegue en Render y Vercel"
git push origin main
```

---

## 🗄️ PASO 2: Configurar PlanetScale (Base de Datos)

### 2.1 Crear cuenta y base de datos

1. Ve a https://planetscale.com y crea una cuenta
2. Clic en **"Create a database"**
3. Configuración:
   - **Name:** `art-gallery-db`
   - **Region:** Selecciona la más cercana (ej: `us-east`)
   - **Plan:** Free (incluye 1 database, 5GB almacenamiento, 1B lecturas/mes)
4. Clic en **"Create database"**

### 2.2 Exportar tu schema actual

En tu máquina local:

```bash
cd api
mysqldump -u arte_user -pTuNuevaPassSegura arte_db > planetscale-schema.sql
```

### 2.3 Crear conexión principal

1. En PlanetScale, ve a tu database → **"Connect"**
2. Selecciona **"Create password"**
3. Branch: `main`
4. Name: `production-app`
5. Clic en **"Create password"**

Verás algo como:

```
Host: aws.connect.psdb.cloud
Username: xxxxxxxxxxxxx
Password: pscale_pw_xxxxxxxxxxxxx
Database: art-gallery-db
```

**⚠️ COPIA ESTOS DATOS AHORA - Solo se muestran una vez!**

### 2.4 Importar datos a PlanetScale

#### Opción A: Usando PlanetScale CLI (Recomendado)

```bash
# Instalar CLI
brew install planetscale/tap/pscale

# Login
pscale auth login

# Crear branch para desarrollo
pscale branch create art-gallery-db dev

# Conectar a la database
pscale shell art-gallery-db dev

# Dentro del shell, pega el contenido de tu schema.sql
# O usa:
pscale shell art-gallery-db dev < planetscale-schema.sql
```

#### Opción B: Usando MySQL Workbench con SSL

1. Abre MySQL Workbench
2. Nueva conexión con los datos de PlanetScale
3. **SSL:** Required
4. Importa `planetscale-schema.sql`

### 2.5 Copiar datos (si tienes datos importantes)

```bash
# Exportar datos
mysqldump -u arte_user -pTuNuevaPassSegura arte_db --no-create-info --complete-insert > data.sql

# Importar a PlanetScale (usando pscale shell)
pscale shell art-gallery-db dev < data.sql
```

### 2.6 Promover branch a producción

```bash
# Crear deploy request
pscale deploy-request create art-gallery-db dev

# Aprobar y mergear
pscale deploy-request deploy art-gallery-db 1
```

---

## 🖥️ PASO 3: Desplegar Backend en Render

### 3.1 Crear cuenta en Render

1. Ve a https://render.com
2. Crea cuenta con GitHub (más fácil)

### 3.2 Crear Web Service

1. En Render Dashboard, clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Selecciona el repo `Sprint-8-art-gallery`
4. Configuración:
   - **Name:** `art-gallery-api` (o el que quieras)
   - **Region:** Oregon (o el más cercano)
   - **Branch:** `main`
   - **Root Directory:** `api`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### 3.3 Configurar Variables de Entorno

En la sección **"Environment"**, agrega todas estas variables:

```bash
# Entorno
NODE_ENV=production

# Base de datos PlanetScale
DB_HOST=aws.connect.psdb.cloud  # Tu host de PlanetScale
DB_USER=xxxxxxxxxxxxx           # Tu usuario de PlanetScale
DB_PASS=pscale_pw_xxxxxxxxxxxxx # Tu password de PlanetScale
DB_NAME=art-gallery-db
DB_PORT=3306

# Cloudinary
CLOUDINARY_CLOUD_NAME=dmweipuof
CLOUDINARY_API_KEY=865564625473872
CLOUDINARY_API_SECRET=quBftxBFpJy0PANedgDjnAl45yw

# Stripe (usa tus claves reales)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx  # O sk_live_ para producción
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Admin Setup
ADMIN_SETUP_SECRET=piedra-admin-setup-2024

# Frontend (lo configurarás después)
FRONTEND_URL=https://tu-frontend.vercel.app

# Puerto (Render lo configura automáticamente)
PORT=3000
```

### 3.4 Desplegar

1. Clic en **"Create Web Service"**
2. Render empezará a:
   - Clonar tu repo
   - Instalar dependencias (`npm install`)
   - Compilar TypeScript (`npm run build`)
   - Iniciar el servidor (`npm start`)

3. Espera ~3-5 minutos

4. Una vez desplegado, verás:
   - **URL:** `https://art-gallery-api.onrender.com`
   - **Status:** Live (verde)

### 3.5 Verificar que funciona

Abre en tu navegador:

```
https://art-gallery-api.onrender.com/api/health
```

Deberías ver:

```json
{"ok": true}
```

**⚠️ IMPORTANTE:** Copia esta URL, la necesitarás para Vercel.

### 3.6 Configurar SSL en PlanetScale (si es necesario)

Si ves errores de conexión a PlanetScale, edita `api/src/db/pool.ts`:

```typescript
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // ⬇️ Agrega esto para PlanetScale
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true
  } : undefined
});
```

Haz commit y push de este cambio. Render redesplegará automáticamente.

---

## 🎨 PASO 4: Desplegar Frontend en Vercel

### 4.1 Crear cuenta en Vercel

1. Ve a https://vercel.com
2. Crea cuenta con GitHub

### 4.2 Importar proyecto

1. En Vercel Dashboard, clic en **"Add New..."** → **"Project"**
2. Importa tu repo de GitHub
3. Vercel detectará automáticamente que es un proyecto Vite

### 4.3 Configurar proyecto

1. **Framework Preset:** Vite (autodetectado)
2. **Root Directory:** `.` (raíz del proyecto)
3. **Build Command:** `npm run build` (autodetectado)
4. **Output Directory:** `dist` (autodetectado)
5. **Install Command:** `npm install` (autodetectado)

### 4.4 Configurar Variables de Entorno

En **"Environment Variables"**, agrega:

```bash
# Backend API (URL de Render)
VITE_API_URL=https://art-gallery-api.onrender.com/api

# Cloudinary (para upload directo)
VITE_CLOUDINARY_CLOUD_NAME=dmweipuof
VITE_CLOUDINARY_UPLOAD_PRESET=art-gallery-unsigned

# Stripe (pública)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx  # O pk_live_ para producción

# Firebase (pública)
VITE_FIREBASE_API_KEY=AIzaSyCmT8yIAIlXi33q2PfP3IrcL-P9gsZuRvQ
VITE_FIREBASE_AUTH_DOMAIN=artgallery-e079a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=artgallery-e079a
VITE_FIREBASE_STORAGE_BUCKET=artgallery-e079a.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=944323091117
VITE_FIREBASE_APP_ID=1:944323091117:web:1fde02b33500114b9b4424

# EmailJS (si usas)
VITE_EMAILJS_SERVICE_ID=service_xqnj90g
VITE_EMAILJS_PUBLIC_KEY=7RiRJ06ufzLByfWI1
VITE_EMAILJS_TEMPLATE_PAYMENT=template_sytummv
VITE_EMAILJS_TEMPLATE_SHIPMENT=template_myt2b1f
```

### 4.5 Desplegar

1. Clic en **"Deploy"**
2. Vercel:
   - Clonará tu repo
   - Instalará dependencias
   - Compilará con Vite
   - Desplegará a CDN global

3. Espera ~2-3 minutos

4. Una vez desplegado, verás:
   - **URL:** `https://sprint-8-art-gallery.vercel.app` (o similar)
   - **Status:** Ready

### 4.6 Probar el frontend

Abre la URL de Vercel en tu navegador. Deberías ver tu galería funcionando.

---

## 🔗 PASO 5: Conectar Frontend y Backend (CORS)

### 5.1 Actualizar variable FRONTEND_URL en Render

1. Ve a Render Dashboard → tu Web Service
2. En **"Environment"**, edita `FRONTEND_URL`:

```
FRONTEND_URL=https://sprint-8-art-gallery.vercel.app
```

(Usa tu URL real de Vercel)

3. Guarda y espera que redesplegue (~1 min)

### 5.2 Verificar CORS

El archivo `api/src/server.ts` ya tiene configurado CORS para aceptar:
- URLs de Vercel con patrón `sprint-8-art-gallery-*.vercel.app`
- La URL específica que configuraste en `FRONTEND_URL`

Si tienes problemas de CORS, agrega tu URL manualmente en `allowedOrigins`:

```typescript
const allowedOrigins = [
  // ... otros orígenes
  "https://sprint-8-art-gallery.vercel.app",  // ← Tu URL de producción
  "https://sprint-8-art-gallery-git-main.vercel.app",  // ← Git branch
];
```

Haz commit y push para redesplegar.

---

## ☁️ PASO 6: Configurar Cloudinary Upload Preset

Para que el upload directo funcione desde el frontend desplegado:

### 6.1 Crear Upload Preset (si no lo hiciste)

1. Ve a https://console.cloudinary.com/settings/upload
2. Scroll hasta **"Upload presets"**
3. Clic en **"Add upload preset"**
4. Configuración:
   - **Preset name:** `art-gallery-unsigned`
   - **Signing mode:** **Unsigned** ⚠️ (importante)
   - **Folder:** `art-gallery/obras`
   - **Unique filename:** true
   - **Overwrite:** false
5. En **"Eager transformations"** (opcional):
   - `c_limit,w_1200,h_1200`
   - `q_auto:good`
6. **Guarda**

### 6.2 Verificar variable en Vercel

En Vercel, asegúrate de tener:

```
VITE_CLOUDINARY_UPLOAD_PRESET=art-gallery-unsigned
```

Si la agregaste/cambiaste, redespliega en Vercel:

1. Ve a Deployments
2. Clic en el último deployment
3. Clic en ⋮ (tres puntos) → **"Redeploy"**

---

## ✅ PASO 7: Verificar que Todo Funciona

### 7.1 Backend (Render)

```bash
# Health check
curl https://art-gallery-api.onrender.com/api/health

# Obtener obras
curl https://art-gallery-api.onrender.com/api/obras

# Obtener imágenes de una obra
curl https://art-gallery-api.onrender.com/api/obras/44/imagenes
```

### 7.2 Frontend (Vercel)

Abre tu URL de Vercel y verifica:

- ✅ Página de inicio carga
- ✅ Shop muestra obras con imágenes
- ✅ Puedes ver detalles de una obra
- ✅ Login funciona
- ✅ (Como admin) Puedes subir imágenes
- ✅ Checkout funciona con Stripe

### 7.3 Stripe Webhooks (para pagos)

1. Ve a https://dashboard.stripe.com/webhooks
2. Clic en **"Add endpoint"**
3. Endpoint URL: `https://art-gallery-api.onrender.com/api/payments/webhook`
4. Eventos a escuchar:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copia el **Signing secret** (`whsec_xxx`)
6. Actualiza `STRIPE_WEBHOOK_SECRET` en Render

---

## 🔧 Troubleshooting

### Backend se duerme (Render Free)

**Problema:** Render free tier se duerme después de 15 min sin actividad.

**Solución:**
- Primera request tarda ~30 seg (el servidor se despierta)
- Opción 1: Actualiza a plan pago ($7/mes, no se duerme)
- Opción 2: Usa un cron job gratuito para hacer ping cada 10 min

```bash
# Crea un cron en cron-job.org:
curl https://art-gallery-api.onrender.com/api/health
```

### Error de conexión a PlanetScale

**Problema:** `ER_ACCESS_DENIED_ERROR` o timeout

**Soluciones:**
1. Verifica credenciales en Render (usuario, password, host)
2. Asegúrate de usar SSL (ver PASO 3.6)
3. Verifica que el branch de PlanetScale esté en producción

### CORS errors en frontend

**Problema:** `Access to fetch... has been blocked by CORS`

**Soluciones:**
1. Verifica `FRONTEND_URL` en Render
2. Agrega tu URL de Vercel a `allowedOrigins` en `server.ts`
3. Redespliega backend después de cambios

### Imágenes no cargan

**Problema:** Imágenes no se ven en producción

**Soluciones:**
1. Verifica upload preset en Cloudinary (debe ser "unsigned")
2. Verifica `VITE_CLOUDINARY_UPLOAD_PRESET` en Vercel
3. Abre Network tab (F12) y busca errores 401/403

### Firebase Auth no funciona

**Problema:** Login/registro falla

**Soluciones:**
1. Agrega dominio de Vercel a dominios autorizados en Firebase:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Agrega `sprint-8-art-gallery.vercel.app`
2. Verifica variables `VITE_FIREBASE_*` en Vercel

---

## 📊 Límites de los Planes Gratuitos

### Render (Backend)
- ✅ 750 horas/mes gratis (suficiente para 1 app)
- ⚠️ Se duerme después de 15 min inactividad
- ⚠️ Máx 512MB RAM
- ⚠️ Builds limitados a 15 min

### PlanetScale (Database)
- ✅ 1 database gratis
- ✅ 5GB almacenamiento
- ✅ 1 billón lecturas/mes
- ✅ 10 millones escrituras/mes
- ⚠️ 1 branch producción

### Vercel (Frontend)
- ✅ 100GB bandwidth/mes
- ✅ Builds ilimitados
- ✅ Deployments ilimitados
- ✅ Dominios custom

### Cloudinary (Imágenes)
- ✅ 25GB almacenamiento
- ✅ 25GB bandwidth/mes
- ✅ Transformaciones: 25 créditos/mes

**Para tu galería:** Estos límites son MÁS QUE SUFICIENTES para empezar. 🎉

---

## 🎉 ¡Listo!

Tu galería de arte está desplegada y funcionando 100% gratis en:

- **Frontend:** https://sprint-8-art-gallery.vercel.app
- **Backend:** https://art-gallery-api.onrender.com
- **Database:** PlanetScale
- **Imágenes:** Cloudinary

---

## 📝 Próximos Pasos Opcionales

### Dominio Custom

1. Compra un dominio (ej: Namecheap, ~$10/año)
2. En Vercel: Settings → Domains → Add domain
3. Configura DNS según instrucciones de Vercel

### SSL Automático

Vercel y Render incluyen SSL (HTTPS) gratis automáticamente. ✅

### Monitoring

Usa los dashboards integrados:
- **Render:** Logs, métricas, uptime
- **Vercel:** Analytics, speed insights
- **PlanetScale:** Query insights, conexiones

---

¿Problemas? Revisa la sección de Troubleshooting o abre un issue en GitHub.
