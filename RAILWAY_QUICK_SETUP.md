# Setup Admin en Railway - Método Rápido (API Endpoint)

## 🚀 Método más simple: Usar el endpoint temporal

He creado un endpoint temporal que puedes llamar directamente desde tu navegador o con `curl` para asignar el rol de admin.

### Paso 1: Configurar el secret en Railway

1. Ve a [Railway Dashboard](https://railway.app)
2. Selecciona tu proyecto "reasonable-beauty"
3. Ve al servicio de API
4. En "Variables", agrega:
   ```
   ADMIN_SETUP_SECRET=tu-clave-secreta-aqui-12345
   ```
   *(Cambia esto por una clave segura)*

### Paso 2: Esperar el deployment

Espera a que el nuevo deployment termine (el que se activó con el último push).

### Paso 3: Llamar al endpoint

#### Opción A: Usando curl (desde terminal)

```bash
curl -X POST https://sprint-8-art-gallery-production.up.railway.app/api/admin-setup/set-admin-role \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gallery.com",
    "secret": "tu-clave-secreta-aqui-12345"
  }'
```

#### Opción B: Usando Postman o Thunder Client

1. Método: `POST`
2. URL: `https://sprint-8-art-gallery-production.up.railway.app/api/admin-setup/set-admin-role`
3. Headers:
   ```
   Content-Type: application/json
   ```
4. Body (raw JSON):
   ```json
   {
     "email": "admin@gallery.com",
     "secret": "tu-clave-secreta-aqui-12345"
   }
   ```

#### Opción C: Desde la consola del navegador

1. Abre tu aplicación en producción: https://sprint-8-art-gallery.vercel.app
2. Abre la consola del navegador (F12)
3. Ejecuta:

```javascript
fetch('https://sprint-8-art-gallery-production.up.railway.app/api/admin-setup/set-admin-role', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@gallery.com',
    secret: 'tu-clave-secreta-aqui-12345'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

### Paso 4: Verificar respuesta

Deberías recibir una respuesta como:

```json
{
  "success": true,
  "message": "Admin role assigned successfully to admin@gallery.com",
  "uid": "rSnlyw2Hhehr2138BtPcXbC8OkX2",
  "customClaims": {
    "role": "admin"
  },
  "warning": "User must logout and login again for changes to take effect"
}
```

### Paso 5: ⚠️ IMPORTANTE - Cerrar sesión y reiniciar

1. **Cierra sesión** en la aplicación web de producción
2. **Vuelve a iniciar sesión** con `admin@gallery.com`
3. Intenta crear una exposición - ¡debería funcionar!

---

## 🧪 Verificar Custom Claims

Para verificar que un usuario tiene el rol correcto, puedes usar este endpoint:

```bash
curl "https://sprint-8-art-gallery-production.up.railway.app/api/admin-setup/verify-claims/admin@gallery.com?secret=tu-clave-secreta-aqui-12345"
```

Respuesta esperada:
```json
{
  "success": true,
  "uid": "rSnlyw2Hhehr2138BtPcXbC8OkX2",
  "email": "admin@gallery.com",
  "customClaims": {
    "role": "admin"
  }
}
```

---

## 🗑️ Eliminar el endpoint después de usar

**IMPORTANTE:** Este endpoint es temporal y debería ser eliminado después de configurar el primer admin por razones de seguridad.

Para eliminarlo:

1. Borra el archivo: `api/src/routes/admin-setup.ts`
2. En `api/src/routes/index.ts`, elimina estas líneas:
   ```typescript
   import adminSetupRoutes from "./admin-setup";
   // ...
   router.use("/admin-setup", adminSetupRoutes);
   ```
3. Commit y push los cambios
4. Opcional: Elimina la variable `ADMIN_SETUP_SECRET` de Railway

---

## 🐛 Troubleshooting

### Error 403: "Invalid secret key"
- Verifica que el secret en la petición coincida con `ADMIN_SETUP_SECRET` en Railway
- Asegúrate de que la variable esté configurada correctamente (sin espacios extra)

### Error 404: "User Not Found"
- Verifica que el usuario `admin@gallery.com` esté registrado en Firebase Authentication
- Verifica que estés usando el proyecto correcto de Firebase

### Error 500: "Internal Server Error"
- Revisa los logs de Railway: `railway logs`
- Verifica que las credenciales de Firebase estén configuradas correctamente
- Asegúrate de que el deployment incluyó el archivo `admin-setup.ts`

### El endpoint no responde
- Verifica que el deployment haya terminado
- Verifica la URL: debe ser la URL de Railway (no Vercel)
- Revisa los logs de Railway para ver errores

---

## 📝 Resumen de URLs

- **Frontend (Vercel):** https://sprint-8-art-gallery.vercel.app
- **Backend (Railway):** https://sprint-8-art-gallery-production.up.railway.app
- **Endpoint Setup:** https://sprint-8-art-gallery-production.up.railway.app/api/admin-setup/set-admin-role

---

## ✅ Checklist

- [ ] Configurar `ADMIN_SETUP_SECRET` en Railway
- [ ] Esperar deployment (verificar en Railway dashboard)
- [ ] Llamar al endpoint con curl/Postman/navegador
- [ ] Verificar respuesta exitosa
- [ ] Cerrar sesión en producción
- [ ] Iniciar sesión nuevamente
- [ ] Probar crear exposición
- [ ] **Eliminar el endpoint temporal**
