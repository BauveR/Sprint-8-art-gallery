-- Migración: Agregar columnas de tracking y nuevos estados
-- Fecha: 2025-10-08

-- 1. Agregar columnas de tracking a la tabla obras
ALTER TABLE obras
ADD COLUMN numero_seguimiento VARCHAR(255) NULL,
ADD COLUMN link_seguimiento VARCHAR(500) NULL;

-- 2. Actualizar el ENUM de estado_venta para incluir los nuevos estados
ALTER TABLE obras
MODIFY COLUMN estado_venta ENUM(
  'disponible',
  'en_carrito',
  'procesando_envio',
  'enviado',
  'entregado',
  'pendiente_devolucion',
  'nunca_entregado'
) DEFAULT 'disponible';

-- 3. Actualizar la vista de obras para incluir tienda_online como ubicación
-- Nota: Esta vista calcula la ubicación basada en id_tienda e id_expo
-- Debes actualizar la lógica de tu backend/vista para distinguir entre en_tienda y tienda_online

-- Comentarios sobre tienda_online:
-- Para que una obra aparezca en "tienda_online", necesitarás:
-- Opción 1: Crear un campo adicional en la tabla "tiendas" que indique si es física u online
-- Opción 2: Crear una tienda específica llamada "Tienda Online" y asignar obras a esa tienda
-- Opción 3: Agregar un campo booleano "es_online" directamente en la tabla obras

-- Ejemplo de Opción 1 (recomendada):
ALTER TABLE tiendas
ADD COLUMN es_online BOOLEAN DEFAULT FALSE;

-- Luego deberás actualizar tu vista o lógica de backend para usar este campo
-- Ejemplo de cómo podría verse la vista actualizada:
/*
CREATE OR REPLACE VIEW obras_vista AS
SELECT
  o.*,
  t.nombre as tienda_nombre,
  t.lat as tienda_lat,
  t.lng as tienda_lng,
  t.url_tienda as tienda_url,
  t.es_online as tienda_es_online,
  e.nombre as expo_nombre,
  e.lat as expo_lat,
  e.lng as expo_lng,
  e.url_expo as expo_url,
  CASE
    WHEN e.id_expo IS NOT NULL THEN 'en_exposicion'
    WHEN t.id_tienda IS NOT NULL AND t.es_online = TRUE THEN 'tienda_online'
    WHEN t.id_tienda IS NOT NULL AND t.es_online = FALSE THEN 'en_tienda'
    ELSE 'almacen'
  END as ubicacion
FROM obras o
LEFT JOIN tiendas t ON o.id_tienda = t.id_tienda
LEFT JOIN expos e ON o.id_expo = e.id_expo;
*/

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_obras_numero_seguimiento ON obras(numero_seguimiento);
CREATE INDEX idx_obras_estado_venta ON obras(estado_venta);

-- Comentarios finales:
-- 1. Asegúrate de hacer backup de tu base de datos antes de ejecutar esta migración
-- 2. Si usas una vista para calcular ubicacion, necesitarás actualizarla según la opción que elijas
-- 3. Los nuevos campos numero_seguimiento y link_seguimiento son opcionales (NULL)
