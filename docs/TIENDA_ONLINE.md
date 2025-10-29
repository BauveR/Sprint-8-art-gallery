# Tienda Online - Guía de Uso

## ¿Qué es la Tienda Online?

La "Tienda Online" es una ubicación especial para obras que están disponibles para compra en línea a través del sitio web. Es diferente de las tiendas físicas donde los clientes pueden ver las obras en persona.

## Diferencias entre ubicaciones

- **Tienda Física** (`en_tienda`): Obras ubicadas en tiendas físicas (Marsella 68, En el 14, Compás 88, etc.)
- **Tienda Online** (`tienda_online`): Obras disponibles exclusivamente para compra online
- **En Exposición** (`en_exposicion`): Obras que están en exposiciones (solo para ver, NO se pueden comprar)
- **Almacén** (`almacen`): Obras guardadas en almacén (NO visibles en la tienda online)

## Configuración Inicial

### 1. Verificar que existe la Tienda Online

La tienda online ya fue creada automáticamente con:
- Nombre: "Tienda Online"
- ID: 12
- Marcada como online (`es_online = 1`)

### 2. Asignar Obras a la Tienda Online

Hay dos formas de asignar obras a la tienda online:

#### Opción A: Desde el Panel de Administración

1. Ve al panel de administración de obras
2. Edita una obra existente o crea una nueva
3. En el campo "Tienda", selecciona "Tienda Online"
4. La obra aparecerá automáticamente con ubicación "Tienda Online"
5. Si el estado de venta es "disponible", la obra se mostrará en la página de Shop

#### Opción B: Desde la Base de Datos (SQL)

```sql
-- Ver obras disponibles
SELECT id_obra, titulo, autor, estado_venta FROM obras
WHERE estado_venta = 'disponible' LIMIT 10;

-- Asignar obra a tienda online
INSERT INTO obra_tienda (id_obra, id_tienda, fecha_entrada)
VALUES (ID_DE_LA_OBRA, 12, CURDATE());

-- Verificar
SELECT * FROM obras_estado_actual WHERE ubicacion = 'tienda_online';
```

## Lógica de la Tienda Online

### Filtro en ShopPage

La página `/shop` muestra SOLO obras que cumplen:
1. `estado_venta = 'disponible'`
2. `ubicacion = 'tienda_online'`

Esto significa que:
- ❌ Obras en tiendas físicas NO aparecen
- ❌ Obras en exposiciones NO aparecen
- ❌ Obras en almacén NO aparecen
- ❌ Obras vendidas NO aparecen
- ✅ Solo obras en tienda online y disponibles aparecen

### Cambios Automáticos de Estado

Cuando un cliente compra una obra:
1. Estado cambia a `procesando_envio`
2. La obra DESAPARECE de la tienda online (ya no está disponible)
3. Se guarda información del comprador (nombre, email, fecha)

## Visualización en el Panel de Admin

En el panel de administración verás:

### Badge de Ubicación
- **Tienda Online** (verde/azul) - Obra en tienda online
- **Tienda Física** (amarillo) - Obra en tienda física
- **Exposición** (morado) - Obra en exposición
- **Almacén** (gris) - Obra en almacén

### Gráfico de Distribución
El pie chart muestra la distribución de obras por ubicación, incluyendo cuántas están en la tienda online.

## Flujo Completo de Compra

1. **Cliente ve obras** en `/shop` (solo tienda online + disponible)
2. **Cliente agrega al carrito** (estado NO cambia todavía)
3. **Cliente paga** con Stripe
4. **Sistema actualiza**: estado → `procesando_envio`, guarda info del comprador
5. **Admin actualiza**: agrega tracking, estado → `enviado`
6. **Sistema envía email** automático con info de tracking
7. **Admin marca**: estado → `entregado`
8. **Sistema envía emails** de confirmación de entrega y agradecimiento

## Preguntas Frecuentes

### ¿Puedo tener una obra en tienda física Y online?
No, una obra solo puede estar en UNA ubicación a la vez.

### ¿Cómo muevo una obra de almacén a tienda online?
Edita la obra en el panel de admin y selecciona "Tienda Online" en el campo Tienda.

### ¿Cómo quito una obra de la tienda online?
Cambia el campo "Tienda" a "Sin tienda" o asígnala a otra tienda/exposición.

### ¿Las obras en exposición se pueden vender?
No, la página de detalle de obra oculta el precio y el botón de compra para obras en exposición.

### ¿Qué pasa si una obra está en tienda_online pero estado_venta es "vendido"?
No aparecerá en la tienda porque el filtro requiere estado_venta = "disponible".

## Testing

Para probar la tienda online:

1. Asigna algunas obras a la tienda online
2. Verifica que aparecen en `/shop`
3. Verifica que tienen precio y botón "Agregar al carrito"
4. Realiza una compra de prueba con tarjeta de Stripe test
5. Verifica que la obra desaparece de la tienda
6. Verifica en el panel de admin que el estado cambió

## Troubleshooting

### Las obras no aparecen en /shop

Verifica:
- ✅ Obra tiene `estado_venta = 'disponible'`
- ✅ Obra está asignada a la tienda online (id_tienda = 12)
- ✅ La tienda online tiene `es_online = 1`
- ✅ La obra tiene precio configurado

### Comando SQL para debug:

```sql
-- Ver todas las obras y sus ubicaciones
SELECT
  o.id_obra,
  o.titulo,
  o.estado_venta,
  oea.ubicacion,
  oea.tienda_nombre,
  oea.tienda_es_online
FROM obras o
JOIN obras_estado_actual oea ON o.id_obra = oea.id_obra
ORDER BY o.id_obra;
```
