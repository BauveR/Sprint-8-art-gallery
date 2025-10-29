# Configurar Admin Role en Railway (Producción)

## 🚀 Pasos para ejecutar el script en Railway

### Opción 1: Usando Railway Shell (Terminal Interactiva)

1. **Abre una terminal en tu computadora local**

2. **Navega al directorio del proyecto:**
   ```bash
   cd /Users/rick/Documents/Academy/Sprint-8-art-gallery
   ```

3. **Vincula el proyecto de Railway:**
   ```bash
   railway link
   ```
   - Selecciona el proyecto: `reasonable-beauty`
   - Selecciona el ambiente: `production`
   - Selecciona el servicio: `api` (o el nombre de tu backend)

4. **Abre el shell interactivo:**
   ```bash
   railway shell
   ```
   Esto abrirá una shell bash en el contenedor de Railway

5. **Dentro del shell de Railway, ejecuta:**
   ```bash
   cd /app/api
   npx ts-node scripts/setAdminRole.ts admin@gallery.com
   ```

6. **Verifica la salida:**
   Deberías ver:
   ```
   ✅ Usuario encontrado: rSnlyw2Hhehr2138BtPcXbC8OkX2
   📋 Custom Claims actuales: {}
   ✅ Rol de admin asignado exitosamente a admin@gallery.com
   📋 Custom Claims actualizados: { role: 'admin' }
   ```

7. **Sal del shell:**
   ```bash
   exit
   ```

---

### Opción 2: Usando Railway Run (Sin Shell Interactivo)

Si `railway shell` no funciona, puedes ejecutar el comando directamente:

```bash
cd /Users/rick/Documents/Academy/Sprint-8-art-gallery

# Vincular el proyecto (si no lo has hecho)
railway link

# Ejecutar el script directamente
railway run npx ts-node api/scripts/setAdminRole.ts admin@gallery.com
```

---

### Opción 3: Agregar como Script de Deployment

Puedes agregar el script como parte del proceso de deployment:

1. **Crea un archivo `railway.json` en la raíz del proyecto:**
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

2. **O ejecuta manualmente después del deploy:**
   Una vez que el deploy termine, ejecuta:
   ```bash
   railway run npx ts-node api/scripts/setAdminRole.ts admin@gallery.com
   ```

---

### Opción 4: Desde Railway Dashboard (Web UI)

1. Ve a [Railway Dashboard](https://railway.app/project/reasonable-beauty)
2. Selecciona tu servicio de API
3. Ve a la pestaña "Settings"
4. Busca la sección "Deploy Logs"
5. Haz clic en "Open Shell" (icono de terminal)
6. En la shell web, ejecuta:
   ```bash
   cd /app/api
   npx ts-node scripts/setAdminRole.ts admin@gallery.com
   ```

---

## ⚠️ Verificar Variables de Entorno en Railway

Antes de ejecutar el script, asegúrate de que Railway tenga configuradas las credenciales de Firebase:

### Verifica las variables:
```bash
railway variables
```

### Deberías tener una de estas configuraciones:

**Opción A: Service Account Path**
```
FIREBASE_SERVICE_ACCOUNT_PATH=/app/api/firebase-service-account.json
```

**Opción B: Variables Individuales**
```
FIREBASE_PROJECT_ID=artgallery-e079a
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@artgallery-e079a.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### Si no existen, agrégalas:

**Para Service Account (recomendado):**
1. Sube el archivo `firebase-service-account.json` al repositorio (dentro de `api/`)
2. Agrega la variable:
   ```bash
   railway variables --set "FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json"
   ```

**Para Variables Individuales:**
```bash
railway variables --set "FIREBASE_PROJECT_ID=tu-proyecto-id"
railway variables --set "FIREBASE_CLIENT_EMAIL=firebase-adminsdk@..."
railway variables --set "FIREBASE_PRIVATE_KEY=$(cat api/firebase-service-account.json | jq -r '.private_key')"
```

---

## 🧪 Después de ejecutar el script

Una vez que el script se ejecute exitosamente en Railway:

1. **Cierra sesión** en la aplicación web de producción
2. **Vuelve a iniciar sesión** con `admin@gallery.com`
3. **Verifica** que puedas:
   - Crear exposiciones
   - Ver `/api/orders/all`
   - Ver `/api/orders/stats`

---

## 🐛 Troubleshooting

### Error: "No se encontró ningún usuario"
- Verifica que `admin@gallery.com` esté registrado en Firebase Authentication
- Usa el mismo proyecto de Firebase que usa la app en producción

### Error: "Firebase Admin SDK requires..."
- Verifica que las variables de entorno estén configuradas en Railway
- Ejecuta `railway variables` para ver las variables actuales

### Error: "Cannot find module"
- Asegúrate de estar en el directorio correcto (`/app/api`)
- Verifica que el deployment incluyó el archivo `scripts/setAdminRole.ts`

---

## 📝 Comandos Rápidos

```bash
# Vincular proyecto
railway link

# Ver variables
railway variables

# Ejecutar script
railway run npx ts-node api/scripts/setAdminRole.ts admin@gallery.com

# Abrir shell
railway shell

# Ver logs
railway logs
```
