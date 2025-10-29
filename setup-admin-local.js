/**
 * Script para configurar admin localmente
 *
 * INSTRUCCIONES:
 * 1. Asegúrate de que el backend esté corriendo (npm run dev en /api)
 * 2. Ejecuta: node setup-admin-local.js
 */

const EMAIL = 'rick.bauve@gmail.com';
const SECRET = 'piedra-admin-setup-2024';
const API_URL = 'http://localhost:3000';

async function setupAdmin() {
  console.log('🚀 Configurando admin localmente...');
  console.log(`📧 Email: ${EMAIL}`);
  console.log(`🔗 API URL: ${API_URL}`);

  try {
    // 1. Asignar rol de admin
    console.log('\n📤 Asignando rol de admin...');
    const response = await fetch(`${API_URL}/api/admin-setup/set-admin-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: EMAIL,
        secret: SECRET
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Admin role asignado exitosamente!');
      console.log('📋 Respuesta:', JSON.stringify(data, null, 2));
      console.log('\n⚠️  IMPORTANTE: El usuario debe cerrar sesión y volver a iniciar sesión para que los cambios surtan efecto.\n');

      // 2. Verificar custom claims
      console.log('🔍 Verificando custom claims...');
      const verifyResponse = await fetch(`${API_URL}/api/admin-setup/verify-claims/${EMAIL}?secret=${SECRET}`);

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('✅ Custom Claims verificados:');
        console.log(JSON.stringify(verifyData.customClaims, null, 2));
      } else {
        console.log('⚠️  No se pudieron verificar los claims');
      }

      console.log('\n✅ ¡Setup completado exitosamente!');
      console.log('\n📝 Próximos pasos:');
      console.log('1. Cierra sesión en el frontend');
      console.log('2. Vuelve a iniciar sesión con rick.bauve@gmail.com');
      console.log('3. Intenta crear/editar una obra');

    } else {
      console.error('❌ Error:', data);

      if (response.status === 403) {
        console.error('\n⚠️  El secret es incorrecto. Verifica que coincida con ADMIN_SETUP_SECRET en .env\n');
      } else if (response.status === 404) {
        console.error('\n⚠️  No se encontró el usuario. Pasos para solucionarlo:');
        console.error('1. Abre http://localhost:5173 (o tu URL del frontend)');
        console.error('2. Registra un nuevo usuario con email: rick.bauve@gmail.com');
        console.error('3. Vuelve a ejecutar este script\n');
      }
    }
  } catch (error) {
    console.error('❌ Error al ejecutar el script:', error.message);
    console.error('\n⚠️  Posibles causas:');
    console.error('- El backend NO está corriendo en', API_URL);
    console.error('- Verifica que hayas ejecutado: cd api && npm run dev');
    console.error('- Verifica que el puerto 3000 esté disponible\n');
  }
}

setupAdmin();
