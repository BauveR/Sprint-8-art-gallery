import { pool } from './src/db/pool';

async function seed() {
  try {
    console.log('🌱 Iniciando seed de obras de prueba...');

    // Datos de prueba - 10 obras con diferentes combinaciones
    const obras = [
      {
        autor: 'Pablo Picasso',
        titulo: 'Les Demoiselles d\'Avignon',
        anio: 1907,
        medidas: '243.9 × 233.7 cm',
        tecnica: 'Óleo sobre lienzo',
        precio_salida: 50000,
        estado_venta: 'disponible',
        id_tienda: 1,
        id_expo: null,
      },
      {
        autor: 'Vincent van Gogh',
        titulo: 'La noche estrellada',
        anio: 1889,
        medidas: '73.7 × 92.1 cm',
        tecnica: 'Óleo sobre lienzo',
        precio_salida: 75000,
        estado_venta: 'en_carrito',
        id_tienda: null,
        id_expo: 1,
      },
      {
        autor: 'Salvador Dalí',
        titulo: 'La persistencia de la memoria',
        anio: 1931,
        medidas: '24 × 33 cm',
        tecnica: 'Óleo sobre lienzo',
        precio_salida: 45000,
        estado_venta: 'disponible',
        id_tienda: 2,
        id_expo: null,
      },
      {
        autor: 'Frida Kahlo',
        titulo: 'Las dos Fridas',
        anio: 1939,
        medidas: '173.5 × 173 cm',
        tecnica: 'Óleo sobre lienzo',
        precio_salida: 60000,
        estado_venta: 'procesando_envio',
        id_tienda: null,
        id_expo: null,
      },
      {
        autor: 'Diego Rivera',
        titulo: 'La vendedora de flores',
        anio: 1926,
        medidas: '121.3 × 121.9 cm',
        tecnica: 'Óleo sobre masonite',
        precio_salida: 35000,
        estado_venta: 'enviado',
        id_tienda: 1,
        id_expo: 1,
      },
      {
        autor: 'Joan Miró',
        titulo: 'El carnaval del arlequín',
        anio: 1925,
        medidas: '66 × 93 cm',
        tecnica: 'Óleo sobre lienzo',
        precio_salida: 42000,
        estado_venta: 'entregado',
        id_tienda: null,
        id_expo: null,
      },
      {
        autor: 'Remedios Varo',
        titulo: 'La creación de las aves',
        anio: 1957,
        medidas: '54 × 64 cm',
        tecnica: 'Óleo sobre masonite',
        precio_salida: 38000,
        estado_venta: 'disponible',
        id_tienda: null,
        id_expo: 1,
      },
      {
        autor: 'Rufino Tamayo',
        titulo: 'Hombre contemplando el cielo',
        anio: 1950,
        medidas: '100 × 80 cm',
        tecnica: 'Óleo sobre lienzo',
        precio_salida: 32000,
        estado_venta: 'en_carrito',
        id_tienda: 2,
        id_expo: null,
      },
      {
        autor: 'José Clemente Orozco',
        titulo: 'El hombre en llamas',
        anio: 1939,
        medidas: '300 × 200 cm',
        tecnica: 'Fresco',
        precio_salida: 85000,
        estado_venta: 'disponible',
        id_tienda: 1,
        id_expo: null,
      },
      {
        autor: 'David Alfaro Siqueiros',
        titulo: 'La marcha de la humanidad',
        anio: 1971,
        medidas: '500 × 400 cm',
        tecnica: 'Acrílico sobre madera',
        precio_salida: 95000,
        estado_venta: 'procesando_envio',
        id_tienda: null,
        id_expo: 1,
      },
    ];

    for (const obra of obras) {
      console.log(`\n📦 Creando: "${obra.titulo}" por ${obra.autor}`);

      // Insertar obra
      const [result] = await pool.query<any>(
        `INSERT INTO obras (autor, titulo, anio, medidas, tecnica, precio_salida, estado_venta)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          obra.autor,
          obra.titulo,
          obra.anio,
          obra.medidas,
          obra.tecnica,
          obra.precio_salida,
          obra.estado_venta,
        ]
      );

      const id_obra = result.insertId;
      console.log(`   ✓ Obra creada con ID: ${id_obra}`);

      // Asignar tienda si existe
      if (obra.id_tienda) {
        await pool.query(
          `INSERT INTO obra_tienda (id_obra, id_tienda, fecha_entrada)
           VALUES (?, ?, CURRENT_DATE())`,
          [id_obra, obra.id_tienda]
        );
        console.log(`   ✓ Asignada a tienda ${obra.id_tienda}`);
      }

      // Asignar expo si existe
      if (obra.id_expo) {
        await pool.query(
          `INSERT INTO obra_exposicion (id_obra, id_expo)
           VALUES (?, ?)`,
          [id_obra, obra.id_expo]
        );
        console.log(`   ✓ Asignada a exposición ${obra.id_expo}`);
      }

      console.log(`   ✓ Estado: ${obra.estado_venta}`);
    }

    console.log('\n\n🎉 Seed completado! 10 obras creadas con éxito.');
    console.log('\n📊 Resumen:');
    console.log('   • Estados de venta variados');
    console.log('   • Algunas en tienda, algunas en exposición');
    console.log('   • Algunas en almacén (sin tienda ni expo)');
    console.log('   • Combinaciones de tienda + expo');

    await pool.end();
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seed();
