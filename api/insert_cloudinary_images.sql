-- Script para insertar imágenes de Cloudinary en la base de datos
-- Creado: 2025-12-27
--
-- IMPORTANTE: Antes de ejecutar, reemplaza los números de id_obra con los IDs
-- reales de tus obras en la base de datos.
--
-- Para ver los IDs de tus obras, ejecuta:
-- SELECT id_obra, titulo, autor FROM obras ORDER BY id_obra;

-- Limpiar imágenes anteriores (OPCIONAL - descomenta si quieres empezar desde cero)
-- DELETE FROM obra_imagenes;
-- ALTER TABLE obra_imagenes AUTO_INCREMENT = 1;

-- ===================================================================
-- IMÁGENES DISPONIBLES EN CLOUDINARY
-- ===================================================================
-- Tienes 6 imágenes únicas:
--
-- 1. https://res.cloudinary.com/dmweipuof/image/upload/v1761767737/art-gallery/obras/wrhuydyrktmnckskc7fq.jpg
-- 2. https://res.cloudinary.com/dmweipuof/image/upload/v1761767228/art-gallery/obras/uvmtoygy3snzmkohkavj.png
-- 3. https://res.cloudinary.com/dmweipuof/image/upload/v1761767150/art-gallery/obras/xg6mk6apsh2ftqwx8gob.png
-- 4. https://res.cloudinary.com/dmweipuof/image/upload/v1761767081/art-gallery/obras/nwdizt5vmslr5z1yr2cx.png
-- 5. https://res.cloudinary.com/dmweipuof/image/upload/v1761766930/art-gallery/obras/hgj4vczqzmbzgxd2jfme.jpg
-- 6. https://res.cloudinary.com/dmweipuof/image/upload/v1761756828/art-gallery/obras/j5lawlxmrssmemqnnm2d.jpg

-- ===================================================================
-- OPCIÓN 1: ASIGNAR IMÁGENES MANUALMENTE
-- ===================================================================
-- Reemplaza los números después de "id_obra =" con los IDs de tus obras reales
-- Cada obra puede tener hasta 3 imágenes

-- Ejemplo: Obra 1 con 3 imágenes
-- INSERT INTO obra_imagenes (id_obra, url) VALUES
-- (1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767737/art-gallery/obras/wrhuydyrktmnckskc7fq.jpg'),
-- (1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767228/art-gallery/obras/uvmtoygy3snzmkohkavj.png'),
-- (1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767150/art-gallery/obras/xg6mk6apsh2ftqwx8gob.png');

-- Ejemplo: Obra 2 con 2 imágenes
-- INSERT INTO obra_imagenes (id_obra, url) VALUES
-- (2, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767081/art-gallery/obras/nwdizt5vmslr5z1yr2cx.png'),
-- (2, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761766930/art-gallery/obras/hgj4vczqzmbzgxd2jfme.jpg');

-- Ejemplo: Obra 3 con 1 imagen
-- INSERT INTO obra_imagenes (id_obra, url) VALUES
-- (3, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761756828/art-gallery/obras/j5lawlxmrssmemqnnm2d.jpg');


-- ===================================================================
-- OPCIÓN 2: ASIGNAR AUTOMÁTICAMENTE A LAS PRIMERAS 6 OBRAS
-- ===================================================================
-- Este script asigna cada imagen a una obra diferente (obras 1-6)
-- Descomenta las líneas de abajo para usar esta opción

-- Una imagen por obra (6 obras diferentes)
INSERT INTO obra_imagenes (id_obra, url) VALUES
(1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767737/art-gallery/obras/wrhuydyrktmnckskc7fq.jpg'),
(2, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767228/art-gallery/obras/uvmtoygy3snzmkohkavj.png'),
(3, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767150/art-gallery/obras/xg6mk6apsh2ftqwx8gob.png'),
(4, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767081/art-gallery/obras/nwdizt5vmslr5z1yr2cx.png'),
(5, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761766930/art-gallery/obras/hgj4vczqzmbzgxd2jfme.jpg'),
(6, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761756828/art-gallery/obras/j5lawlxmrssmemqnnm2d.jpg');


-- ===================================================================
-- OPCIÓN 3: ASIGNAR MÚLTIPLES IMÁGENES A CADA OBRA
-- ===================================================================
-- Este script distribuye las 6 imágenes entre las primeras 2 obras (3 cada una)
-- Descomenta las líneas de abajo para usar esta opción

-- Obra 1: 3 imágenes
-- INSERT INTO obra_imagenes (id_obra, url) VALUES
-- (1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767737/art-gallery/obras/wrhuydyrktmnckskc7fq.jpg'),
-- (1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767228/art-gallery/obras/uvmtoygy3snzmkohkavj.png'),
-- (1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767150/art-gallery/obras/xg6mk6apsh2ftqwx8gob.png');

-- Obra 2: 3 imágenes
-- INSERT INTO obra_imagenes (id_obra, url) VALUES
-- (2, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767081/art-gallery/obras/nwdizt5vmslr5z1yr2cx.png'),
-- (2, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761766930/art-gallery/obras/hgj4vczqzmbzgxd2jfme.jpg'),
-- (2, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761756828/art-gallery/obras/j5lawlxmrssmemqnnm2d.jpg');


-- ===================================================================
-- VERIFICACIÓN
-- ===================================================================
-- Después de ejecutar el script, verifica con:
-- SELECT oi.id, oi.id_obra, o.titulo, oi.url
-- FROM obra_imagenes oi
-- JOIN obras o ON oi.id_obra = o.id_obra
-- ORDER BY oi.id_obra, oi.id;

-- ===================================================================
-- INSTRUCCIONES DE USO
-- ===================================================================
--
-- MÉTODO 1: Usando MySQL CLI
-- ---------------------------
-- mysql -u arte_user -p arte_db < api/insert_cloudinary_images.sql
--
-- MÉTODO 2: Usando MySQL Workbench
-- ---------------------------------
-- 1. Abre MySQL Workbench
-- 2. Conecta a tu base de datos
-- 3. File → Open SQL Script
-- 4. Selecciona este archivo
-- 5. Edita los id_obra según necesites
-- 6. Ejecuta (⚡ icono o Ctrl+Shift+Enter)
--
-- MÉTODO 3: Copiar y Pegar
-- ------------------------
-- 1. Abre tu cliente MySQL favorito
-- 2. Copia el bloque INSERT que quieras usar (OPCIÓN 1, 2 o 3)
-- 3. Pega en tu cliente
-- 4. Edita los id_obra si es necesario
-- 5. Ejecuta
--
-- ===================================================================
