/**
 * Script para crear tablas necesarias en Railway MySQL
 *
 * Uso:
 * 1. Obtén las credenciales de Railway:
 *    - Ve a tu servicio MySQL en Railway
 *    - Click en "Variables"
 *    - Copia: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE
 *
 * 2. Ejecuta este script con las variables de entorno:
 *    MYSQLHOST=xxx MYSQLPORT=xxx MYSQLUSER=xxx MYSQLPASSWORD=xxx MYSQLDATABASE=xxx node setup-railway-db.js
 *
 * O simplemente edita las variables abajo con tus credenciales de Railway
 */

const mysql = require('mysql2/promise');

// OPCIÓN 1: Usa variables de entorno (recomendado)
const config = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  multipleStatements: true
};

// OPCIÓN 2: O edita directamente aquí (no commitear con credenciales!)
// const config = {
//   host: 'tú-host.railway.app',
//   port: 3306,
//   user: 'root',
//   password: 'tu-password',
//   database: 'railway',
//   multipleStatements: true
// };

const SQL_MIGRATIONS = `
-- ============================================================================
-- TABLA DE RESERVAS TEMPORALES PARA EL CARRITO
-- ============================================================================

CREATE TABLE IF NOT EXISTS reservas (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_obra INT NOT NULL,
  id_user VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_obra_reservation (id_obra),
  CONSTRAINT fk_reservas_obra FOREIGN KEY (id_obra) REFERENCES obras(id_obra) ON DELETE CASCADE,

  INDEX idx_reservas_user (id_user),
  INDEX idx_reservas_session (session_id),
  INDEX idx_reservas_expires (expires_at),
  INDEX idx_reservas_obra (id_obra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA DE DIRECCIONES DE ENVÍO
-- ============================================================================

CREATE TABLE IF NOT EXISTS direcciones_envio (
  id_direccion INT AUTO_INCREMENT PRIMARY KEY,
  id_user VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  direccion VARCHAR(500) NOT NULL,
  numero_exterior VARCHAR(50) NOT NULL,
  numero_interior VARCHAR(50),
  colonia VARCHAR(255) NOT NULL,
  codigo_postal VARCHAR(10) NOT NULL,
  ciudad VARCHAR(255) NOT NULL,
  estado VARCHAR(100) NOT NULL,
  pais VARCHAR(100) DEFAULT 'México',
  referencias TEXT,
  es_predeterminada BOOLEAN DEFAULT FALSE,
  alias VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_direcciones_user (id_user),
  INDEX idx_direcciones_predeterminada (id_user, es_predeterminada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA DE ÓRDENES
-- ============================================================================

CREATE TABLE IF NOT EXISTS ordenes (
  id_orden INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  id_user VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  id_direccion INT,
  shipping_snapshot JSON NOT NULL,
  items JSON NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending','paid','processing_shipment','shipped','delivered','pending_return','never_delivered','cancelled') DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  tracking_number VARCHAR(255),
  carrier VARCHAR(100),
  estimated_delivery DATE,
  delivered_at TIMESTAMP NULL,
  admin_notes TEXT,
  return_reason TEXT,
  customer_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,
  shipped_at TIMESTAMP NULL,

  FOREIGN KEY (id_direccion) REFERENCES direcciones_envio(id_direccion) ON DELETE SET NULL,

  INDEX idx_ordenes_user (id_user),
  INDEX idx_ordenes_status (status),
  INDEX idx_ordenes_number (order_number),
  INDEX idx_ordenes_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA DE HISTORIAL DE CAMBIOS DE ESTADO
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_status_history (
  id_history INT AUTO_INCREMENT PRIMARY KEY,
  id_orden INT NOT NULL,
  status_from ENUM('pending','paid','processing_shipment','shipped','delivered','pending_return','never_delivered','cancelled'),
  status_to ENUM('pending','paid','processing_shipment','shipped','delivered','pending_return','never_delivered','cancelled') NOT NULL,
  changed_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden) ON DELETE CASCADE,

  INDEX idx_order_history_orden (id_orden),
  INDEX idx_order_history_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function setupDatabase() {
  console.log('🚀 Conectando a Railway MySQL...');
  console.log(`   Host: ${config.host}`);
  console.log(`   Database: ${config.database}`);

  let connection;

  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection(config);
    console.log('✅ Conexión exitosa\n');

    // Ejecutar las migraciones
    console.log('📦 Creando tablas...');
    await connection.query(SQL_MIGRATIONS);
    console.log('✅ Tablas creadas exitosamente\n');

    // Verificar tablas creadas
    console.log('🔍 Verificando tablas...');
    const [tables] = await connection.query("SHOW TABLES LIKE '%reservas%' OR SHOW TABLES LIKE '%ordenes%' OR SHOW TABLES LIKE '%direcciones%'");

    const [allTables] = await connection.query("SHOW TABLES");
    console.log('\n📋 Tablas en la base de datos:');
    allTables.forEach(row => {
      const tableName = Object.values(row)[0];
      console.log(`   - ${tableName}`);
    });

    console.log('\n✨ ¡Setup completado exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error('   1. Las credenciales de Railway sean correctas');
    console.error('   2. La base de datos tenga la tabla "obras" (requerida por foreign keys)');
    console.error('   3. Tengas permisos para crear tablas');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Verificar que tenemos configuración
if (!config.host || !config.user || !config.password || !config.database) {
  console.error('❌ Faltan credenciales de base de datos');
  console.error('\n📝 Opciones para configurar:');
  console.error('\n1. Variables de entorno:');
  console.error('   MYSQLHOST=xxx MYSQLPORT=xxx MYSQLUSER=xxx MYSQLPASSWORD=xxx MYSQLDATABASE=xxx node setup-railway-db.js');
  console.error('\n2. O edita el archivo setup-railway-db.js con tus credenciales de Railway');
  console.error('\n💡 Obtén las credenciales en: Railway Dashboard → MySQL Service → Variables');
  process.exit(1);
}

// Ejecutar
setupDatabase();
