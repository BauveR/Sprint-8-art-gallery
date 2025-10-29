/**
 * Script para ejecutar desde la consola del navegador
 *
 * INSTRUCCIONES:
 * 1. Abre https://sprint-8-art-gallery.vercel.app en tu navegador
 * 2. Abre la consola del navegador (F12)
 * 3. Copia y pega todo este código
 * 4. Presiona Enter
 *
 * Si ves "✅ Admin role asignado exitosamente", cierra sesión y vuelve a iniciar sesión
 */

(async function setupAdmin() {
  console.log('🚀 Iniciando configuración de admin...');

  // IMPORTANTE: Cambia este secret por el que configuraste en Railway
  const SECRET = 'piedra-admin-setup-2024';
  const EMAIL = 'rick.bauve@gmail.com';
  const API_URL = 'https://sprint-8-art-gallery-production.up.railway.app';

  try {
    console.log(`📤 Enviando petición para asignar admin role a ${EMAIL}...`);

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
      console.log('📋 Respuesta:', data);
      console.log('\n⚠️  IMPORTANTE: Cierra sesión y vuelve a iniciar sesión para que los cambios surtan efecto.\n');

      // Opcional: Verificar claims
      console.log('🔍 Verificando custom claims...');
      const verifyResponse = await fetch(`${API_URL}/api/admin-setup/verify-claims/${EMAIL}?secret=${SECRET}`);
      const verifyData = await verifyResponse.json();
      console.log('📋 Custom Claims actuales:', verifyData.customClaims);

      return { success: true, data };
    } else {
      console.error('❌ Error:', data);

      if (response.status === 403) {
        console.error('\n⚠️  El secret es incorrecto. Verifica que coincida con ADMIN_SETUP_SECRET en Railway.\n');
      } else if (response.status === 404) {
        console.error('\n⚠️  No se encontró el usuario. Verifica que rick.bauve@gmail.com esté registrado en Firebase.\n');
      }

      return { success: false, error: data };
    }
  } catch (error) {
    console.error('❌ Error al ejecutar el script:', error);
    console.error('\nPosibles causas:');
    console.error('- El backend no está accesible');
    console.error('- Hay un problema de red');
    console.error('- El endpoint no existe (deployment no completado)');
    return { success: false, error };
  }
})();
