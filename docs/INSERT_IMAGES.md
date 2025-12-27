# Insertar Imágenes de Cloudinary en la Base de Datos

Esta guía te muestra cómo insertar las URLs de tus imágenes de Cloudinary en la base de datos MySQL para que aparezcan en las obras.

---

## 📋 URLs Disponibles

Tienes **6 imágenes** en Cloudinary:

1. `wrhuydyrktmnckskc7fq.jpg`
2. `uvmtoygy3snzmkohkavj.png`
3. `xg6mk6apsh2ftqwx8gob.png`
4. `nwdizt5vmslr5z1yr2cx.png`
5. `hgj4vczqzmbzgxd2jfme.jpg`
6. `j5lawlxmrssmemqnnm2d.jpg`

---

## 🚀 Opción 1: Script Node.js (Recomendado)

### Paso 1: Configurar el modo de asignación

Abre el archivo `api/scripts/insert-cloudinary-images.js` y edita esta línea:

```javascript
const ASSIGNMENT_MODE = 'ONE_PER_OBRA';  // o 'THREE_PER_OBRA' o 'CUSTOM'
```

**Modos disponibles:**
- `'ONE_PER_OBRA'` - Una imagen por obra (6 obras con 1 imagen cada una)
- `'THREE_PER_OBRA'` - Tres imágenes por obra (2 obras con 3 imágenes cada una)
- `'CUSTOM'` - Define manualmente qué imágenes van a qué obra

### Paso 2: Ejecutar el script

```bash
cd api
node scripts/insert-cloudinary-images.js
```

El script te mostrará:
1. Las obras disponibles en la base de datos
2. Cómo se asignarán las imágenes
3. Una confirmación antes de insertar
4. Un resumen de las imágenes insertadas

### Ejemplo de salida:

```
🚀 Iniciando script de inserción de imágenes...

✅ Conectado a MySQL

📊 Obras disponibles en la base de datos: 10

Obras:
  - [1] Obra 1 - Artista 1
  - [2] Obra 2 - Artista 2
  ...

📋 Modo: UNA IMAGEN POR OBRA

Asignaciones a insertar:

  Obra 1: "Obra 1" - Artista 1
    - wrhuydyrktmnckskc7fq.jpg

  Obra 2: "Obra 2" - Artista 2
    - uvmtoygy3snzmkohkavj.png

¿Continuar con la inserción? (s/n): s

🔄 Insertando imágenes...

  ✅ Imagen 1 asignada a obra 1
  ✅ Imagen 2 asignada a obra 2
  ...

✅ Proceso completado. 6 imágenes insertadas.
```

---

## 🗃️ Opción 2: Script SQL Directo

### Paso 1: Editar el archivo SQL

Abre `api/insert_cloudinary_images.sql` y elige una de las 3 opciones:

**OPCIÓN 1:** Asignar manualmente (recomendado para control total)
**OPCIÓN 2:** Una imagen por obra (automático)
**OPCIÓN 3:** Tres imágenes por obra (automático)

### Paso 2: Ejecutar el SQL

#### Método A: MySQL CLI

```bash
mysql -u arte_user -p arte_db < api/insert_cloudinary_images.sql
```

#### Método B: MySQL Workbench

1. Abre MySQL Workbench
2. Conecta a tu base de datos
3. File → Open SQL Script
4. Selecciona `api/insert_cloudinary_images.sql`
5. Edita los `id_obra` según tus necesidades
6. Ejecuta (⚡ icono o Ctrl+Shift+Enter)

#### Método C: Copiar y Pegar

1. Abre el archivo `api/insert_cloudinary_images.sql`
2. Copia el bloque INSERT que quieras usar
3. Pega en tu cliente MySQL (TablePlus, DBeaver, etc.)
4. Edita los `id_obra` si es necesario
5. Ejecuta

---

## 🎯 Asignación Personalizada (CUSTOM)

Si quieres control total sobre qué imagen va a qué obra:

### Usando Node.js:

Edita `api/scripts/insert-cloudinary-images.js`:

```javascript
const ASSIGNMENT_MODE = 'CUSTOM';

const assignmentsCustom = {
  1: [0, 1, 2],  // Obra 1 tendrá las imágenes 0, 1 y 2
  5: [3],        // Obra 5 tendrá la imagen 3
  10: [4, 5],    // Obra 10 tendrá las imágenes 4 y 5
};
```

**Índices de imágenes:**
- `0` = wrhuydyrktmnckskc7fq.jpg
- `1` = uvmtoygy3snzmkohkavj.png
- `2` = xg6mk6apsh2ftqwx8gob.png
- `3` = nwdizt5vmslr5z1yr2cx.png
- `4` = hgj4vczqzmbzgxd2jfme.jpg
- `5` = j5lawlxmrssmemqnnm2d.jpg

### Usando SQL:

```sql
-- Obra 1: 3 imágenes
INSERT INTO obra_imagenes (id_obra, url) VALUES
(1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767737/art-gallery/obras/wrhuydyrktmnckskc7fq.jpg'),
(1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767228/art-gallery/obras/uvmtoygy3snzmkohkavj.png'),
(1, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767150/art-gallery/obras/xg6mk6apsh2ftqwx8gob.png');

-- Obra 5: 1 imagen
INSERT INTO obra_imagenes (id_obra, url) VALUES
(5, 'https://res.cloudinary.com/dmweipuof/image/upload/v1761767081/art-gallery/obras/nwdizt5vmslr5z1yr2cx.png');
```

---

## ✅ Verificar que Funcionó

### 1. Verificar en MySQL

```sql
SELECT oi.id, oi.id_obra, o.titulo, oi.url
FROM obra_imagenes oi
JOIN obras o ON oi.id_obra = o.id_obra
ORDER BY oi.id_obra, oi.id;
```

### 2. Verificar en el Frontend

1. Inicia el frontend: `npm run dev`
2. Ve a la página de **Shop** o **Obras**
3. Las imágenes deberían aparecer en las obras

### 3. Verificar en la API

```bash
curl http://localhost:3000/api/obras/1/imagenes
```

Debería retornar un JSON con las imágenes de la obra 1.

---

## 🔄 Reiniciar (Limpiar todas las imágenes)

Si quieres empezar desde cero:

```sql
-- ⚠️ CUIDADO: Esto elimina TODAS las imágenes
DELETE FROM obra_imagenes;
ALTER TABLE obra_imagenes AUTO_INCREMENT = 1;
```

Luego puedes volver a insertar las imágenes con cualquiera de los métodos.

---

## 🐛 Problemas Comunes

### Error: "Cannot add or update a child row: a foreign key constraint fails"

**Causa:** Estás intentando insertar una imagen para una obra que no existe.

**Solución:** Verifica que el `id_obra` exista:

```sql
SELECT id_obra, titulo FROM obras;
```

Usa solo IDs que existan en la tabla `obras`.

---

### Las imágenes no aparecen en el frontend

**Posibles causas:**

1. **Backend no está corriendo**
   ```bash
   cd api
   npm run dev
   ```

2. **Las URLs están mal**
   - Verifica que las URLs comiencen con `https://res.cloudinary.com/`
   - Verifica que las imágenes existan en Cloudinary

3. **Cache del navegador**
   - Recarga con Ctrl+Shift+R (fuerza reload)
   - Abre en incógnito

4. **Query no se está ejecutando**
   - Abre la consola del navegador (F12)
   - Busca errores en la pestaña Console o Network

---

## 📝 Notas Importantes

- Cada obra puede tener **máximo 3 imágenes** (límite del sistema)
- Las imágenes se muestran en orden de inserción (la primera es la principal)
- Puedes mezclar imágenes subidas con el sistema de upload y las insertadas manualmente

---

## 🔗 Ver También

- [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) - Configuración del upload directo
- [README.md](./README.md) - Documentación general

---

¡Listo! Ahora tus imágenes de Cloudinary deberían verse en las obras. 🎉
