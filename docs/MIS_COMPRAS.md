# Mis Compras - Guía de Usuario

## Descripción

La página "Mis Compras" permite a los usuarios autenticados ver el historial de todas sus compras realizadas en la galería, con información detallada del estado de cada pedido y seguimiento de envío.

## Características

### 🔐 Acceso Protegido
- Solo usuarios autenticados pueden acceder
- Si un usuario no autenticado intenta acceder, verá un mensaje para iniciar sesión
- El link "Mis Compras" solo aparece en la navegación cuando hay sesión activa

### 📦 Información de Pedidos

Cada pedido muestra:
- **Imagen de la obra** (clickeable para ver detalles)
- **Título y autor** de la obra
- **Estado del pedido** con icono visual:
  - 📦 Procesando Envío (amarillo)
  - 🚚 En Camino (azul)
  - ✅ Entregado (verde)
  - ⚠️ Pendiente Devolución (naranja)
  - ❌ No Entregado (rojo)
- **Fecha de compra**
- **Precio pagado**
- **Información de seguimiento** (cuando disponible):
  - Número de rastreo
  - Link directo para rastrear el paquete

## Acceso a la Página

### Desde la Navegación
1. Inicia sesión en tu cuenta
2. Haz clic en el botón "Mis Compras" (icono de paquete) en la barra de navegación
3. La página se carga automáticamente con todas tus compras

### Después de Comprar
1. Completa el checkout exitosamente
2. En la pantalla de confirmación, haz clic en "Ver mis compras"
3. Se te redirige directamente a tu historial de pedidos

### URL Directa
Accede directamente a: `http://localhost:5173/my-orders`

## Estados del Pedido

### 📦 Procesando Envío
Tu pedido ha sido confirmado y está siendo preparado para envío.
- **No hay tracking todavía**
- El equipo está empaquetando tu obra

### 🚚 En Camino (Enviado)
Tu pedido ha sido despachado y está en tránsito.
- **Información de tracking disponible**
- Puedes rastrear tu paquete con el número de seguimiento
- Click en "Rastrear paquete" para ver ubicación actual

### ✅ Entregado
Tu pedido ha sido entregado exitosamente.
- El tracking muestra "Entregado"
- Deberías haber recibido un email de confirmación
- Email de agradecimiento enviado

### ⚠️ Pendiente Devolución
Hay un problema con tu pedido y está en proceso de devolución.
- Contacta al soporte para más información
- El reembolso será procesado una vez recibida la obra

### ❌ No Entregado
El pedido no pudo ser entregado.
- Puede haber un problema con la dirección
- Contacta al soporte inmediatamente

## Seguimiento de Envío

### Cuando está disponible
- Aparece una caja azul con información de envío
- Muestra el número de rastreo en formato monospace
- Incluye un link directo "Rastrear paquete" que abre en nueva pestaña

### Información visible
```
Información de Envío
━━━━━━━━━━━━━━━━━━━━
Número: ABC123456789
🔗 Rastrear paquete
```

## Estados sin Compras

Si no has realizado ninguna compra aún:
- Verás un icono de bolsa de compras grande
- Mensaje: "No tienes compras aún"
- Botón para "Explorar la colección" que te lleva a /shop

## Integración con Emails

El sistema envía emails automáticos en cada cambio de estado:

1. **Confirmación de Pago** ✅
   - Enviado inmediatamente después del pago
   - Incluye resumen del pedido y total pagado

2. **Notificación de Envío** 📧
   - Enviado cuando el estado cambia a "enviado"
   - Incluye número de tracking y link de seguimiento

3. **Confirmación de Entrega** 📬
   - Enviado cuando el estado cambia a "entregado"
   - Confirma que el paquete fue recibido

4. **Email de Agradecimiento** 💌
   - Enviado después de la confirmación de entrega
   - Agradece la compra y fideliza al cliente

## Flujo Completo del Usuario

1. **Compra**
   - Usuario navega /shop
   - Agrega obras al carrito
   - Completa checkout con Stripe
   - Recibe email de confirmación

2. **Seguimiento**
   - Usuario hace click en "Ver mis compras"
   - Ve estado "Procesando Envío"
   - Espera notificación de envío

3. **Envío**
   - Admin actualiza estado a "enviado" y agrega tracking
   - Usuario recibe email con info de tracking
   - Usuario puede rastrear en tiempo real desde "Mis Compras"

4. **Entrega**
   - Admin marca como "entregado"
   - Usuario recibe email de confirmación
   - Usuario recibe email de agradecimiento
   - En "Mis Compras" aparece como ✅ Entregado

## Tecnología

### Backend
- **Endpoint**: GET `/api/orders?email=user@example.com`
- **Controller**: `ordersController.ts`
- **Service**: `ordersService.ts`
- **Repository**: `ordersRepo.ts`
- Query: Busca en `obras_estado_actual` donde `comprador_email = ?`

### Frontend
- **Página**: `MyOrdersPage.tsx`
- **Hook**: `useOrders(email)` (React Query)
- **Ruta**: `/my-orders`
- **Layout**: Usa `PublicLayout` con navegación

### Protección
- La página verifica `isAuthenticated`
- Si no hay sesión, muestra mensaje de login
- El botón en navbar solo se muestra con sesión activa

## Estilos y UX

- **Diseño responsivo**: Funciona en móvil, tablet y desktop
- **Cards elegantes**: Fondo con blur y bordes sutiles
- **Iconos visuales**: Cada estado tiene su propio icono y color
- **Hover effects**: Imagen y título responden al hover
- **Links externos**: Se abren en nueva pestaña
- **Loading states**: Muestra "Cargando..." mientras obtiene datos
- **Empty states**: Mensajes amigables cuando no hay datos

## Testing

Para probar la funcionalidad:

1. Crea una cuenta de usuario
2. Realiza una compra de prueba con Stripe test card: `4242 4242 4242 4242`
3. Ve a "Mis Compras" en la navegación
4. Verifica que aparece tu pedido con estado "Procesando Envío"
5. Como admin, actualiza el estado a "enviado" con tracking
6. Refresca "Mis Compras" y verifica que aparece la info de tracking
7. Haz click en "Rastrear paquete" y verifica que abre el link
8. Como admin, marca como "entregado"
9. Verifica que el estado cambió a "Entregado" con ícono verde

## Troubleshooting

### No veo mis compras
- Verifica que estás con la sesión iniciada
- Asegúrate de usar el mismo email con el que compraste
- Verifica que el backend esté corriendo en puerto 3000

### El tracking no aparece
- El admin debe agregar número y link de tracking
- Solo aparece cuando estado es "enviado" o "entregado"
- Verifica en la base de datos que los campos no sean NULL

### Error al cargar
- Verifica que el endpoint `/api/orders` esté funcionando
- Prueba: `curl "http://localhost:3000/api/orders?email=test@example.com"`
- Verifica logs del backend para errores SQL
