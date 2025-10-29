# 🔒 Guía de Seguridad

## Configuración de Administrador

### Crear un usuario administrador

Para configurar un usuario con permisos de administrador:

1. **Crear usuario en Firebase Console** (o por registro normal)
   - Email: `admin@gallery.com` (o el que prefieras)
   - Contraseña: (usa una contraseña segura)

2. **Ejecutar script para configurar Custom Claims**:
   ```bash
   cd api
   npx ts-node src/scripts/set-admin-role.ts admin@gallery.com
   ```

3. **El usuario debe cerrar sesión y volver a iniciar**
   - Los Custom Claims solo se actualizan cuando se obtiene un nuevo token
   - Cerrar sesión invalida el token antiguo

4. **Verificar que funcionó**:
   - El usuario debería poder acceder al Dashboard
   - En los logs del backend verás: `[Auth] User admin@gallery.com authenticated with role: admin`

## Seguridad Implementada

### ✅ Fase 1 - Seguridad Crítica (Implementado)

1. **Autenticación en Endpoints Admin**
   - Todos los endpoints de creación/modificación/eliminación requieren auth + admin
   - Protección contra acceso no autorizado

2. **Firebase Custom Claims**
   - Roles manejados en el backend (no frontend)
   - Imposible falsificar rol de admin desde el cliente

3. **Helmet - Security Headers**
   - Content-Security-Policy
   - XSS Protection
   - Clickjacking Protection
   - MIME Sniffing Protection

4. **Rate Limiting**
   - 100 requests por IP cada 15 minutos (general)
   - 5 intentos de login cada 15 minutos
   - Protección contra brute force y DDoS

5. **CORS Restrictivo**
   - Whitelist específica de dominios
   - No wildcards en producción
   - Validación estricta de origen

### 🔐 Mejores Prácticas

#### Variables de Entorno
- **NUNCA** commitear archivos `.env`
- Usar variables de entorno diferentes para dev/staging/prod
- Rotar secrets regularmente

#### Custom Claims en Firebase
```typescript
// ✅ CORRECTO - Backend determina el rol
const decodedToken = await getAuth().verifyIdToken(token);
const role = decodedToken.role || "user";

// ❌ INCORRECTO - Frontend determina el rol (inseguro)
if (email === "admin@gallery.com") {
  role = "admin";
}
```

#### Rate Limiting
- Ajustar límites según tráfico real
- Monitorear logs de requests bloqueados
- Whitelist para IPs confiables si es necesario

## Endpoints Protegidos

### Solo Administrador
- `POST /api/obras` - Crear obra
- `PUT /api/obras/:id` - Actualizar obra
- `DELETE /api/obras/:id` - Eliminar obra
- `POST/PUT/DELETE /api/tiendas/*` - Gestión de tiendas
- `POST/PUT/DELETE /api/expos/*` - Gestión de exposiciones
- `GET /api/orders/all` - Ver todas las órdenes
- `GET /api/orders/stats` - Estadísticas
- `PUT /api/orders/:id/status` - Cambiar estado de orden

### Usuario Autenticado
- `POST /api/orders` - Crear orden
- `GET /api/orders/my-orders` - Ver mis órdenes
- `POST /api/orders/:id/cancel` - Cancelar mi orden
- `/api/direcciones/*` - Gestionar mis direcciones

### Público
- `GET /api/obras` - Ver catálogo
- `GET /api/tiendas` - Ver tiendas
- `GET /api/expos` - Ver exposiciones
- `/api/reservas/*` - Carrito (usa session ID)
- `POST /api/payments/*` - Stripe checkout

## Monitoreo

### Logs de Seguridad
```bash
# Ver intentos de acceso admin denegados
grep "[Security] Non-admin user" api/logs/*.log

# Ver autenticaciones exitosas
grep "[Auth] User .* authenticated" api/logs/*.log
```

### Alertas Recomendadas
- Múltiples intentos fallidos de login
- Requests bloqueados por rate limiting
- Accesos admin denegados
- Errores 401/403 frecuentes desde la misma IP

## Producción

### Checklist antes de deploy
- [ ] Variables de entorno configuradas
- [ ] Al menos un usuario admin configurado
- [ ] CORS actualizado con URLs de producción
- [ ] Rate limits ajustados
- [ ] Logs configurados
- [ ] Monitoring/alerting activo
- [ ] HTTPS habilitado
- [ ] Secrets rotados

### URLs de Producción
Actualizar en `api/src/server.ts`:
```typescript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://tu-dominio-produccion.com",
  "https://sprint-8-art-gallery.vercel.app",
];
```

## Contacto de Seguridad

Si encuentras una vulnerabilidad, por favor reporta a:
- Email: security@example.com
- No divulgues públicamente hasta que se corrija
