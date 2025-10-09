-- Script para asignar algunas obras a la tienda online (solo para testing)
-- Esto asigna las primeras 3 obras disponibles a la tienda online

-- Primero verificamos qué obras están disponibles
SELECT id_obra, titulo, autor, estado_venta
FROM obras
WHERE estado_venta = 'disponible'
LIMIT 5;

-- Asignar las primeras 3 obras a la tienda online (id_tienda = 12)
-- Nota: Ajusta los IDs según las obras que existan en tu base de datos

-- Ejemplo: Si tienes obras con id 1, 2, 3
-- INSERT INTO obra_tienda (id_obra, id_tienda, fecha_entrada) VALUES (1, 12, CURDATE());
-- INSERT INTO obra_tienda (id_obra, id_tienda, fecha_entrada) VALUES (2, 12, CURDATE());
-- INSERT INTO obra_tienda (id_obra, id_tienda, fecha_entrada) VALUES (3, 12, CURDATE());

-- Ver el resultado
SELECT * FROM obras_estado_actual WHERE ubicacion = 'tienda_online';
