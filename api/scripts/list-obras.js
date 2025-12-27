/**
 * Script rápido para listar todas las obras en la base de datos
 *
 * USO:
 * cd api
 * node scripts/list-obras.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  console.log('📚 Listando obras en la base de datos...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'arte_user',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'arte_db',
  });

  try {
    // Obtener obras
    const [obras] = await connection.query(`
      SELECT
        id_obra,
        titulo,
        autor,
        anio,
        estado_venta,
        (SELECT COUNT(*) FROM obra_imagenes WHERE id_obra = obras.id_obra) as num_imagenes
      FROM obras
      ORDER BY id_obra
    `);

    console.log(`Total de obras: ${obras.length}\n`);

    if (obras.length === 0) {
      console.log('⚠️  No hay obras en la base de datos.');
      console.log('   Crea obras primero desde el panel de admin.\n');
      return;
    }

    console.log('╔══════╦═══════════════════════════════════════════════╦═══════════╗');
    console.log('║  ID  ║ Título / Autor / Año                          ║ Imágenes  ║');
    console.log('╠══════╬═══════════════════════════════════════════════╬═══════════╣');

    obras.forEach(obra => {
      const id = String(obra.id_obra).padEnd(4);
      const titulo = (obra.titulo || 'Sin título').substring(0, 30).padEnd(30);
      const autor = (obra.autor || 'Desconocido').substring(0, 20).padEnd(20);
      const anio = obra.anio || '----';
      const estado = obra.estado_venta === 'disponible' ? '✅' : '❌';
      const imagenes = String(obra.num_imagenes).padStart(2) + '/3';

      console.log(`║ ${id} ║ ${titulo}                     ║   ${imagenes}   ║`);
      console.log(`║      ║ ${autor} (${anio})        ${estado}  ║           ║`);
      console.log('╠══════╬═══════════════════════════════════════════════╬═══════════╣');
    });

    console.log('╚══════╩═══════════════════════════════════════════════╩═══════════╝\n');

    // Resumen
    const obrasConImagenes = obras.filter(o => o.num_imagenes > 0).length;
    const obrasSinImagenes = obras.filter(o => o.num_imagenes === 0).length;
    const obrasCompletas = obras.filter(o => o.num_imagenes === 3).length;

    console.log('📊 Resumen:');
    console.log(`   - Obras con imágenes: ${obrasConImagenes}`);
    console.log(`   - Obras sin imágenes: ${obrasSinImagenes}`);
    console.log(`   - Obras con 3 imágenes (completas): ${obrasCompletas}\n`);

    // Sugerencias
    if (obrasSinImagenes > 0) {
      console.log('💡 Sugerencia:');
      console.log(`   Tienes ${obrasSinImagenes} obra(s) sin imágenes.`);
      console.log('   Usa el script insert-cloudinary-images.js para asignarles imágenes.\n');
    }

  } finally {
    await connection.end();
  }
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
