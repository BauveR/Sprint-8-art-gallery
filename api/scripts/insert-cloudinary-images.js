/**
 * Script para insertar imágenes de Cloudinary en la base de datos
 *
 * USO:
 * cd api
 * node scripts/insert-cloudinary-images.js
 *
 * REQUISITOS:
 * - Base de datos MySQL corriendo
 * - Variables de entorno configuradas en api/.env
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// URLs de las imágenes en Cloudinary
const CLOUDINARY_IMAGES = [
  'https://res.cloudinary.com/dmweipuof/image/upload/v1761767737/art-gallery/obras/wrhuydyrktmnckskc7fq.jpg',
  'https://res.cloudinary.com/dmweipuof/image/upload/v1761767228/art-gallery/obras/uvmtoygy3snzmkohkavj.png',
  'https://res.cloudinary.com/dmweipuof/image/upload/v1761767150/art-gallery/obras/xg6mk6apsh2ftqwx8gob.png',
  'https://res.cloudinary.com/dmweipuof/image/upload/v1761767081/art-gallery/obras/nwdizt5vmslr5z1yr2cx.png',
  'https://res.cloudinary.com/dmweipuof/image/upload/v1761766930/art-gallery/obras/hgj4vczqzmbzgxd2jfme.jpg',
  'https://res.cloudinary.com/dmweipuof/image/upload/v1761756828/art-gallery/obras/j5lawlxmrssmemqnnm2d.jpg',
];

/**
 * CONFIGURA AQUÍ cómo quieres asignar las imágenes
 *
 * Opciones:
 * 1. 'ONE_PER_OBRA' - Una imagen por obra (6 obras diferentes)
 * 2. 'THREE_PER_OBRA' - 3 imágenes por obra (2 obras con 3 imágenes cada una)
 * 3. 'CUSTOM' - Define manualmente en assignmentsCustom
 */
const ASSIGNMENT_MODE = 'CUSTOM';

/**
 * Modo CUSTOM: Define manualmente qué imagen va a qué obra
 *
 * Asignando a las obras que no tienen imágenes:
 * - Obra 66 (email): imágenes 0, 1
 * - Obra 67 (prueba 2): imágenes 2, 3
 * - Obra 68 (prueba 12121): imágenes 4, 5
 */
const assignmentsCustom = {
  66: [0, 1],  // Obra 66 tendrá las imágenes 0 y 1
  67: [2, 3],  // Obra 67 tendrá las imágenes 2 y 3
  68: [4, 5],  // Obra 68 tendrá las imágenes 4 y 5
};

async function main() {
  console.log('🚀 Iniciando script de inserción de imágenes...\n');

  // Crear conexión a MySQL
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'arte_user',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'arte_db',
  });

  console.log('✅ Conectado a MySQL\n');

  try {
    // Verificar cuántas obras existen
    const [obras] = await connection.query('SELECT id_obra, titulo, autor FROM obras ORDER BY id_obra');

    console.log(`📊 Obras disponibles en la base de datos: ${obras.length}\n`);

    if (obras.length === 0) {
      console.error('❌ No hay obras en la base de datos. Crea obras primero.');
      process.exit(1);
    }

    console.log('Obras:');
    obras.slice(0, 10).forEach(obra => {
      console.log(`  - [${obra.id_obra}] ${obra.titulo} - ${obra.autor}`);
    });
    if (obras.length > 10) {
      console.log(`  ... y ${obras.length - 10} más`);
    }
    console.log('');

    // Generar asignaciones según el modo
    let assignments = {};

    if (ASSIGNMENT_MODE === 'ONE_PER_OBRA') {
      // Una imagen por obra
      console.log('📋 Modo: UNA IMAGEN POR OBRA\n');
      CLOUDINARY_IMAGES.forEach((url, index) => {
        const obraId = index + 1;
        if (obraId <= obras.length) {
          assignments[obraId] = [index];
        }
      });
    } else if (ASSIGNMENT_MODE === 'THREE_PER_OBRA') {
      // 3 imágenes por obra
      console.log('📋 Modo: TRES IMÁGENES POR OBRA\n');
      const imagesPerObra = 3;
      const numObras = Math.ceil(CLOUDINARY_IMAGES.length / imagesPerObra);

      for (let i = 0; i < numObras; i++) {
        const obraId = i + 1;
        const startIdx = i * imagesPerObra;
        const endIdx = Math.min(startIdx + imagesPerObra, CLOUDINARY_IMAGES.length);

        if (obraId <= obras.length) {
          assignments[obraId] = Array.from(
            { length: endIdx - startIdx },
            (_, idx) => startIdx + idx
          );
        }
      }
    } else if (ASSIGNMENT_MODE === 'CUSTOM') {
      console.log('📋 Modo: ASIGNACIÓN PERSONALIZADA\n');
      assignments = assignmentsCustom;
    }

    // Validar asignaciones
    if (Object.keys(assignments).length === 0) {
      console.error('❌ No hay asignaciones configuradas. Verifica ASSIGNMENT_MODE o assignmentsCustom.');
      process.exit(1);
    }

    // Validar que los IDs de obra existen
    const obraIds = obras.map(o => o.id_obra);
    for (const obraId of Object.keys(assignments)) {
      if (!obraIds.includes(parseInt(obraId))) {
        console.error(`❌ La obra con ID ${obraId} no existe en la base de datos.`);
        process.exit(1);
      }
    }

    console.log('Asignaciones a insertar:');
    for (const [obraId, imageIndexes] of Object.entries(assignments)) {
      const obra = obras.find(o => o.id_obra === parseInt(obraId));
      console.log(`\n  Obra ${obraId}: "${obra.titulo}" - ${obra.autor}`);
      imageIndexes.forEach(idx => {
        const url = CLOUDINARY_IMAGES[idx];
        const filename = url.split('/').pop();
        console.log(`    - ${filename}`);
      });
    }
    console.log('');

    // Preguntar confirmación
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      readline.question('¿Continuar con la inserción? (s/n): ', resolve);
    });
    readline.close();

    if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'y') {
      console.log('\n❌ Operación cancelada por el usuario.');
      process.exit(0);
    }

    console.log('\n🔄 Insertando imágenes...\n');

    // Insertar imágenes
    let insertCount = 0;
    for (const [obraId, imageIndexes] of Object.entries(assignments)) {
      for (const idx of imageIndexes) {
        const url = CLOUDINARY_IMAGES[idx];

        try {
          await connection.query(
            'INSERT INTO obra_imagenes (id_obra, url) VALUES (?, ?)',
            [obraId, url]
          );
          insertCount++;
          console.log(`  ✅ Imagen ${idx + 1} asignada a obra ${obraId}`);
        } catch (error) {
          console.error(`  ❌ Error insertando imagen ${idx + 1} para obra ${obraId}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Proceso completado. ${insertCount} imágenes insertadas.\n`);

    // Mostrar resumen
    const [result] = await connection.query(`
      SELECT oi.id, oi.id_obra, o.titulo, o.autor, oi.url
      FROM obra_imagenes oi
      JOIN obras o ON oi.id_obra = o.id_obra
      ORDER BY oi.id_obra, oi.id
    `);

    console.log('📊 Resumen de imágenes en la base de datos:\n');

    let currentObraId = null;
    result.forEach(row => {
      if (row.id_obra !== currentObraId) {
        currentObraId = row.id_obra;
        console.log(`\n  Obra ${row.id_obra}: "${row.titulo}" - ${row.autor}`);
      }
      const filename = row.url.split('/').pop();
      console.log(`    - [${row.id}] ${filename}`);
    });

    console.log('\n✅ ¡Listo! Las imágenes deberían verse en el frontend.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
