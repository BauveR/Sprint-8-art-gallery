# 🚀 Guía de Deployment - Art Gallery

## 📋 Pre-requisitos

- ✅ Cuenta de [Railway](https://railway.app) para backend + base de datos MySQL
- ✅ Cuenta de [Vercel](https://vercel.com) para el frontend
- ✅ Proyecto Firebase configurado
- ✅ Clave de Stripe (test o producción)

**💰 Railway Plan Gratuito:**
- $5 USD de crédito mensual
- Incluye MySQL + Backend Node.js
- Sin límite de "dormirse" como otros servicios
- Suficiente para desarrollo y testing

---

## 🗄️ PASO 1: Crear Base de Datos MySQL en Railway

### 1.1 Crear Proyecto y Database

1. Ve a [Railway](https://railway.app) y regístrate/inicia sesión
2. Click en **"New Project"**
3. Selecciona **"Provision MySQL"**
4. Railway creará automáticamente un servicio MySQL

### 1.2 Obtener Credenciales de MySQL

1. Click en el servicio MySQL creado
2. Ve a la pestaña **"Variables"**
3. Verás las variables de conexión:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER` (normalmente es `root`)
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE` (normalmente es `railway`)

**Copia estas credenciales**, las necesitarás en el siguiente paso.

### 1.3 Importar el Schema

Tienes dos opciones para importar el schema SQL:

**Opción A: Usando Railway CLI (Recomendado)**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Abrir shell de MySQL
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE

# Una vez dentro de MySQL, ejecuta:
source api/sql/schema.sql
```

**Opción B: Desde tu computadora (si tienes MySQL instalado)**

```bash
# Reemplaza con tus credenciales de Railway
mysql -h containers-us-west-xxx.railway.app \
      -u root \
      -p[TU_PASSWORD] \
      railway < api/sql/schema.sql
```

**Opción C: Usando MySQL Workbench o TablePlus**

1. Descarga [MySQL Workbench](https://www.mysql.com/products/workbench/) o [TablePlus](https://tableplus.com/)
2. Crea nueva conexión con las credenciales de Railway
3. Abre y ejecuta el archivo `api/sql/schema.sql`

---

## 🔧 PASO 2: Deployar Backend en Railway

### 2.1 Agregar Servicio Backend al Proyecto

1. En tu proyecto de Railway (donde ya tienes MySQL)
2. Click en **"+ New"** → **"GitHub Repo"**
3. Conecta tu repositorio:
   - Si es primera vez, autoriza Railway en GitHub
   - Busca: `BauveR/Sprint-8-art-gallery`
   - Click en **"Deploy Now"**

### 2.2 Configurar el Servicio

1. Railway detectará automáticamente que es un proyecto Node.js
2. Click en el servicio recién creado
3. Ve a **"Settings"**:
   - **Root Directory**: Cambia a `api`
   - **Build Command**: Déjalo en `npm install` (Railway usa package.json automáticamente)
   - **Start Command**: `npm start`
   - **Watch Paths**: `api/**`

### 2.3 Configurar Variables de Entorno

1. En tu servicio backend, ve a la pestaña **"Variables"**
2. Click en **"+ New Variable"** y agrega:

```bash
# Database - Usar credenciales del servicio MySQL de Railway
DB_HOST=${{MySQL.MYSQLHOST}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASS=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
PORT=3000

# Frontend URL (para CORS - actualizar después con URL de Vercel)
FRONTEND_URL=http://localhost:5173

# Stripe
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_stripe

# Firebase - Variables individuales (RECOMENDADO para Railway)
FIREBASE_PROJECT_ID=artgallery-e079a
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@artgallery-e079a.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu\nPrivate\nKey\nAqui\n-----END PRIVATE KEY-----\n"
```

**⚠️ IMPORTANTE:**

- **Variables de MySQL**: Railway permite referenciar variables entre servicios usando `${{servicio.VARIABLE}}`
- **FIREBASE_PRIVATE_KEY**:
  1. Abre `firebase-service-account.json`
  2. Copia el valor completo de `"private_key"`
  3. Incluye las comillas dobles
  4. Mantén los `\n` (saltos de línea)

### 2.4 Deploy

1. Railway desplegará automáticamente después de configurar
2. El proceso toma 2-3 minutos
3. Verás los logs en tiempo real

### 2.5 Generar URL Pública

1. En tu servicio backend, ve a **"Settings"**
2. Scroll hasta **"Networking"**
3. Click en **"Generate Domain"**
4. Railway te dará una URL como: `https://tu-proyecto.up.railway.app`

**Copia esta URL**, la necesitarás para el frontend.

### 2.6 Verificar el Deploy

Abre en el navegador:
```
https://tu-proyecto.up.railway.app/api/health
```

Deberías ver: `{"ok":true}`

---

## 🎨 PASO 3: Deployar Frontend en Vercel

### 3.1 Conectar Repositorio

1. Ve a [Vercel](https://vercel.com)
2. Click en "Add New" → "Project"
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Configurar Variables de Entorno

En Vercel → Settings → Environment Variables, agrega:

```bash
# API URL - CAMBIAR con tu URL de Railway
VITE_API_URL=https://tu-proyecto.up.railway.app/api

# Stripe Public Key
VITE_STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=artgallery-e079a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=artgallery-e079a
VITE_FIREBASE_STORAGE_BUCKET=artgallery-e079a.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=1:your_sender_id:web:1fde02b33500114b9b4424

# EmailJS (opcional - si ya lo configuraste)
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
VITE_EMAILJS_TEMPLATE_PAYMENT=tu_template_id
VITE_EMAILJS_TEMPLATE_SHIPMENT=tu_template_id
VITE_EMAILJS_TEMPLATE_DELIVERY=tu_template_id
VITE_EMAILJS_TEMPLATE_THANKYOU=tu_template_id
```

### 3.3 Deploy

Click en "Deploy" y espera a que se complete.

Tu URL de producción será algo como:
```
https://sprint-8-art-gallery.vercel.app
```

---

## 🔗 PASO 4: Configurar CORS en el Backend

**⚠️ IMPORTANTE:** Debes permitir que tu frontend de Vercel se comunique con tu backend de Railway.

### 4.1 Actualizar FRONTEND_URL en Railway

El CORS ya está configurado en `api/src/server.ts` para usar la variable `FRONTEND_URL`. Solo necesitas actualizarla:

1. Ve a tu proyecto en [Railway Dashboard](https://railway.app)
2. Click en tu servicio backend
3. Ve a la pestaña **"Variables"**
4. Edita la variable `FRONTEND_URL` con tu URL de Vercel:
   ```
   FRONTEND_URL=https://sprint-8-art-gallery.vercel.app
   ```
5. Click en **"Save"** o presiona Enter
6. Railway redesplegará automáticamente (toma ~2 minutos)

**Nota:** El código ya está configurado para aceptar múltiples orígenes:
- `http://localhost:5173` (desarrollo)
- `http://localhost:3000` (testing)
- El valor de `FRONTEND_URL` (producción)

---

## 🔒 PASO 5: Configurar Firebase Authentication

### 5.1 Agregar Dominios Autorizados

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto: `artgallery-e079a`
3. Authentication → Settings → Authorized domains
4. Agrega tu dominio de Vercel:
   ```
   sprint-8-art-gallery.vercel.app
   ```

### 5.2 Configurar Google Sign-In

1. En Authentication → Sign-in method
2. Habilita "Google" si aún no lo está
3. Agrega las URIs de redirección autorizadas en Google Cloud Console

---

## ✅ PASO 6: Verificación Final

### 6.1 Checklist

- [ ] Backend desplegado en Railway y funcionando
- [ ] Base de datos MySQL conectada y con schema importado
- [ ] Frontend desplegado en Vercel
- [ ] Variables de entorno configuradas en ambos lados
- [ ] CORS configurado correctamente
- [ ] Firebase dominios autorizados configurados
- [ ] Login con email/password funciona
- [ ] Login con Google funciona
- [ ] Stripe checkout funciona (modo test)
- [ ] Imágenes de obras se cargan correctamente

### 6.2 Pruebas

1. **Autenticación:**
   - Registra un nuevo usuario
   - Login con email/password
   - Login con Google

2. **Funcionalidad:**
   - Navega por la galería
   - Agrega obras al carrito
   - Completa una compra (usa `4242 4242 4242 4242` para Stripe test)
   - Verifica que el email de confirmación llega

3. **Admin (si tienes usuario admin):**
   - Login como admin
   - Crea/edita/elimina obras
   - Gestiona inventario

---

## 🐛 Troubleshooting

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` esté configurada en Railway con tu URL de Vercel
- Ve a Railway Dashboard → Tu servicio backend → Variables → Edita `FRONTEND_URL`
- Railway redesplegará automáticamente al guardar cambios

### Error: "Failed to fetch"
- Verifica que `VITE_API_URL` en Vercel sea correcta (debe terminar en `/api`)
- Comprueba que el backend esté corriendo (abre `https://tu-proyecto.up.railway.app/api/health`)
- Verifica los logs en Railway para ver si hay errores

### Error: Firebase "auth/unauthorized-domain"
- Agrega el dominio en Firebase Console → Authentication → Authorized domains
- Debe incluir tanto `tu-proyecto.vercel.app` como cualquier dominio personalizado

### Error: Database connection
- Verifica las variables de MySQL en Railway
- Asegúrate de que usaste las referencias `${{MySQL.MYSQLHOST}}`, etc.
- Verifica que el schema fue importado correctamente
- Revisa los logs de Railway para ver el error específico

### Stripe no funciona
- Verifica que `STRIPE_SECRET_KEY` esté en Railway (backend)
- Verifica que `VITE_STRIPE_PUBLIC_KEY` esté en Vercel (frontend)
- Las claves test deben emparejar (ambas `sk_test_` y `pk_test_`)
- En producción, usa claves de producción (`sk_live_` y `pk_live_`)

### Railway excede los $5/mes
- Verifica el uso en Railway Dashboard → Billing
- MySQL: ~$1-2/mes
- Backend: ~$2-3/mes
- Si excedes: considera optimizar queries o upgrade a plan de pago
- Puedes pausar servicios que no uses

---

## 🔄 Actualizaciones Futuras

### Actualizar Backend

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push
```

Railway redesplegará automáticamente (~2-3 minutos). Puedes ver el progreso en los logs.

### Actualizar Frontend

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push
```

Vercel redesplegará automáticamente.

---

## 📞 Recursos y Documentación

- **Railway Docs**: https://docs.railway.app
- **Railway CLI**: https://docs.railway.app/develop/cli
- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **MySQL Workbench**: https://www.mysql.com/products/workbench/
- **TablePlus**: https://tableplus.com/

---

¡Deployment completado! 🎉
