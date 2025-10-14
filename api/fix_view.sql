-- Eliminar la vista existente
DROP VIEW IF EXISTS obras_estado_actual;

-- Recrear la vista sin DEFINER específico
CREATE VIEW obras_estado_actual AS
SELECT
  o.id_obra,
  o.autor,
  o.titulo,
  o.anio,
  o.medidas,
  o.tecnica,
  o.precio_salida,
  o.estado_venta,
  o.numero_seguimiento,
  o.link_seguimiento,
  o.comprador_nombre,
  o.comprador_email,
  o.fecha_compra,
  CASE
    WHEN ex1.id_expo IS NOT NULL THEN 'en_exposicion'
    WHEN ti1.id_tienda IS NOT NULL AND ti1.es_online = 1 THEN 'tienda_online'
    WHEN ti1.id_tienda IS NOT NULL AND ti1.es_online = 0 THEN 'en_tienda'
    ELSE 'almacen'
  END AS ubicacion,
  ex1.id_expo,
  ex1.nombre AS expo_nombre,
  ex1.lat AS expo_lat,
  ex1.lng AS expo_lng,
  ex1.url_expo AS expo_url,
  ti1.id_tienda,
  ti1.nombre AS tienda_nombre,
  ti1.lat AS tienda_lat,
  ti1.lng AS tienda_lng,
  ti1.url_tienda AS url_tienda,
  ti1.es_online AS tienda_es_online
FROM obras o
LEFT JOIN (
  SELECT t.id_obra, t.id_expo, t.nombre, t.lat, t.lng, t.url_expo
  FROM (
    SELECT oe.id_obra, e.id_expo, e.nombre, e.lat, e.lng, e.url_expo,
           ROW_NUMBER() OVER (PARTITION BY oe.id_obra ORDER BY e.fecha_inicio DESC, e.id_expo DESC) AS rn
    FROM obra_exposicion oe
    JOIN exposiciones e ON e.id_expo = oe.id_expo
  ) t
  WHERE t.rn = 1
) ex1 ON ex1.id_obra = o.id_obra
LEFT JOIN (
  SELECT z.id_obra, z.id_tienda, z.nombre, z.lat, z.lng, z.url_tienda, z.es_online
  FROM (
    SELECT ot.id_obra, t.id_tienda, t.nombre, t.lat, t.lng, t.url_tienda, t.es_online,
           ROW_NUMBER() OVER (PARTITION BY ot.id_obra ORDER BY ot.fecha_entrada DESC, ot.id_tienda DESC) AS rn
    FROM obra_tienda ot
    JOIN tiendas t ON t.id_tienda = ot.id_tienda
    WHERE ot.fecha_salida IS NULL
  ) z
  WHERE z.rn = 1
) ti1 ON ti1.id_obra = o.id_obra;
