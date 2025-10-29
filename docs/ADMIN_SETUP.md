# Configuración de Usuarios Admin - Firebase Custom Claims

## 🚨 Problema: Error 403 "Admin access required"

Si al intentar acceder a endpoints de admin (`/api/orders/all`, `/api/orders/stats`, `/api/expos`) recibes un error **403 Forbidden** con el mensaje:

```json
{
  "error": "Admin access required",
  "message": "You don't have permission to access this resource"
}
```

**Causa:** El usuario no tiene el Custom Claim `role: "admin"` configurado en Firebase Authentication.

---

## 🔐 Cómo funciona la autenticación de admin

### Frontend (determina UI):
```typescript
// AuthContextFirebase.tsx
function getUserRole(email: string): UserRole {
  if (email === "admin@gallery.com") {
    return "admin";
  }
  return "user";
}
```
- El frontend determina el rol basándose en el **email**
- Esto solo afecta la **interfaz de usuario** (qué botones se muestran)
- **NO afecta los permisos del backend**

### Backend (valida permisos reales):
```typescript
// authMiddleware.ts
const role = (decodedToken.role as string) || "user";

if (req.user.role !== "admin") {
  res.status(403).json({
    error: "Admin access required"
  });
}
```
- El backend obtiene el rol desde los **Firebase Custom Claims**
- Los Custom Claims son seguros porque **solo el backend puede modificarlos**
- Si el Custom Claim no existe, el rol por defecto es `"user"`

---

## ✅ Solución: Asignar rol de admin con Custom Claims

### Opción 1: Script automatizado (RECOMENDADO)

Hemos creado un script que asigna el rol de admin automáticamente.

#### Paso 1: Configurar variables de entorno

Asegúrate de que tu archivo `.env` en la raíz del proyecto (o en Railway/producción) tenga una de estas configuraciones:

**Opción A: Service Account (más seguro para producción)**
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

**Opción B: Variables individuales (útil para CI/CD)**
```bash
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEv....\n-----END PRIVATE KEY-----\n
```

> **Nota:** Para Railway/producción, puedes codificar la private key en base64:
> ```bash
> echo -n "-----BEGIN PRIVATE KEY-----..." | base64
> ```

#### Paso 2: Ejecutar el script

**Localmente:**
```bash
cd api
npm run set-admin-role admin@gallery.com
```

**En producción (Railway):**

1. Abre una sesión shell en Railway
2. Navega al directorio `/app/api`
3. Ejecuta:
```bash
npx ts-node scripts/setAdminRole.ts admin@gallery.com
```

#### Paso 3: ⚠️ IMPORTANTE - Cerrar sesión y volver a iniciar

Los Custom Claims se incluyen en el **token de autenticación** de Firebase. Para que los cambios surtan efecto:

1. **Cierra sesión** en la aplicación
2. **Vuelve a iniciar sesión** con el usuario admin
3. Firebase generará un nuevo token con los Custom Claims actualizados

---

### Opción 2: Configurar manualmente desde Firebase Console

Si prefieres hacerlo manualmente:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Users**
4. Busca el usuario `admin@gallery.com`
5. Copia su **UID**
6. Abre **Cloud Functions** o usa Firebase CLI:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

admin.auth().setCustomUserClaims('UID_DEL_USUARIO', { role: 'admin' })
  .then(() => {
    console.log('Custom claims set successfully');
  })
  .catch(error => {
    console.error('Error setting custom claims:', error);
  });
```

---

## 🧪 Verificar que funciona

### 1. Verificar Custom Claims en el backend

En el script `setAdminRole.ts` verás la salida:

```
✅ Usuario encontrado: abc123xyz
📋 Custom Claims actuales: {}
✅ Rol de admin asignado exitosamente a admin@gallery.com
📋 Custom Claims actualizados: { role: 'admin' }
```

### 2. Verificar en el frontend (consola del navegador)

Después de iniciar sesión, ejecuta en la consola:

```javascript
firebase.auth().currentUser.getIdTokenResult()
  .then((idTokenResult) => {
    console.log('Custom Claims:', idTokenResult.claims);
  });
```

Deberías ver:
```javascript
{
  role: "admin",
  // ... otros claims
}
```

### 3. Verificar acceso a endpoints

Intenta acceder a un endpoint de admin:

```bash
curl -H "Authorization: Bearer TU_TOKEN" \
  https://tu-api.com/api/orders/all
```

Deberías recibir una respuesta exitosa (200 OK) en lugar de 403.

---

## 🔒 Seguridad

### ¿Por qué usar Custom Claims en lugar de un campo en la base de datos?

1. **Inmutabilidad:** Solo el backend puede modificar Custom Claims (con Firebase Admin SDK)
2. **Incluido en el token:** El rol está cifrado en el JWT, no puede ser falsificado
3. **Sin consultas adicionales:** No necesitas consultar la base de datos en cada request
4. **Estándar de Firebase:** Es la forma oficial y recomendada por Firebase

### ⚠️ Nunca confíes en el rol del frontend

```typescript
// ❌ INSEGURO - El frontend puede mentir
const role = req.body.role; // Nunca hagas esto

// ✅ SEGURO - Solo confía en el token verificado
const role = decodedToken.role || "user";
```

---

## 🐛 Troubleshooting

### "Error: No se encontró ningún usuario con el email"

- Verifica que el usuario exista en Firebase Authentication
- Asegúrate de que el email esté escrito correctamente
- Verifica que el usuario haya confirmado su email (si está habilitado)

### "Error: FIREBASE_SERVICE_ACCOUNT_PATH not found"

- Verifica que la variable de entorno esté configurada
- Asegúrate de que la ruta al archivo sea correcta
- Usa una ruta relativa desde la raíz del proyecto api: `./firebase-service-account.json`

### "Error: Failed to decode base64 private key"

- Verifica que la private key esté correctamente codificada en base64
- No incluyas saltos de línea en el valor de la variable de entorno
- Asegúrate de usar `-n` en el comando echo: `echo -n "clave" | base64`

### Sigo recibiendo 403 después de ejecutar el script

1. **Cierra sesión completamente** en el frontend
2. **Borra las cookies y localStorage** (opcional pero recomendado)
3. **Vuelve a iniciar sesión** para obtener un nuevo token
4. **Verifica en la consola del navegador** que el token tiene el claim `role: "admin"`

---

## 📝 Comandos rápidos

```bash
# Ver usuarios en Firebase (requiere Firebase CLI)
firebase auth:export users.json --project tu-proyecto-id

# Asignar admin role
cd api
npm run set-admin-role admin@gallery.com

# Verificar Custom Claims (Node.js)
node -e "require('firebase-admin').initializeApp(); require('firebase-admin').auth().getUser('UID').then(u => console.log(u.customClaims));"
```

---

## 📚 Referencias

- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Backend authMiddleware.ts](./api/src/middleware/authMiddleware.ts)
- [Script setAdminRole.ts](./api/scripts/setAdminRole.ts)
