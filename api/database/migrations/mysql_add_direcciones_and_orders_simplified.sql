-- ============================================================================
-- TABLA DE DIRECCIONES DE ENVÍO (MySQL - Simplificada sin triggers)
-- ============================================================================

CREATE TABLE IF NOT EXISTS direcciones_envio (
  id_direccion INT AUTO_INCREMENT PRIMARY KEY,
  id_user VARCHAR(255) NOT NULL,

  -- Información de contacto
  nombre_completo VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(255),

  -- Dirección
  direccion VARCHAR(500) NOT NULL,
  numero_exterior VARCHAR(50) NOT NULL,
  numero_interior VARCHAR(50),
  colonia VARCHAR(255) NOT NULL,
  codigo_postal VARCHAR(10) NOT NULL,
  ciudad VARCHAR(255) NOT NULL,
  estado VARCHAR(100) NOT NULL,
  pais VARCHAR(100) DEFAULT 'México',
  referencias TEXT,

  -- Metadata
  es_predeterminada BOOLEAN DEFAULT FALSE,
  alias VARCHAR(100), -- "Casa", "Trabajo", etc.

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Índices
  INDEX idx_direcciones_user (id_user),
  INDEX idx_direcciones_predeterminada (id_user, es_predeterminada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA DE ÓRDENES (MySQL - Simplificada)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ordenes (
  id_orden INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL, -- Generado manualmente en la app

  -- Usuario
  id_user VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,

  -- Dirección de envío (FK)
  id_direccion INT,
  FOREIGN KEY (id_direccion) REFERENCES direcciones_envio(id_direccion) ON DELETE SET NULL,

  -- Snapshot de dirección (para histórico, en caso de que se borre la dirección)
  shipping_snapshot JSON NOT NULL,

  -- Items de la orden
  items JSON NOT NULL, -- [{id_obra, titulo, precio, cantidad}]

  -- Totales
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Estado y tracking
  status ENUM(
    'pending',              -- Pendiente de pago
    'paid',                 -- Pagado, procesando envío
    'processing_shipment',  -- Procesando envío
    'shipped',              -- Enviado
    'delivered',            -- Entregado
    'pending_return',       -- Pendiente de devolución
    'never_delivered',      -- Nunca entregado
    'cancelled'             -- Cancelado
  ) DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  tracking_number VARCHAR(255),
  carrier VARCHAR(100), -- "FedEx", "DHL", "Estafeta", etc.
  estimated_delivery DATE,
  delivered_at TIMESTAMP NULL,

  -- Notas y motivos
  admin_notes TEXT,
  return_reason TEXT,
  customer_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,
  shipped_at TIMESTAMP NULL,

  -- Índices
  INDEX idx_ordenes_user (id_user),
  INDEX idx_ordenes_status (status),
  INDEX idx_ordenes_number (order_number),
  INDEX idx_ordenes_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA DE HISTORIAL DE CAMBIOS DE ESTADO (MySQL)
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_status_history (
  id_history INT AUTO_INCREMENT PRIMARY KEY,
  id_orden INT NOT NULL,

  status_from ENUM(
    'pending',
    'paid',
    'processing_shipment',
    'shipped',
    'delivered',
    'pending_return',
    'never_delivered',
    'cancelled'
  ),
  status_to ENUM(
    'pending',
    'paid',
    'processing_shipment',
    'shipped',
    'delivered',
    'pending_return',
    'never_delivered',
    'cancelled'
  ) NOT NULL,

  changed_by VARCHAR(255), -- Usuario que hizo el cambio (admin o system)
  notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Foreign key
  FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden) ON DELETE CASCADE,

  -- Índices
  INDEX idx_order_history_orden (id_orden),
  INDEX idx_order_history_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================

ALTER TABLE direcciones_envio COMMENT = 'Direcciones de envío guardadas de los usuarios';
ALTER TABLE ordenes COMMENT = 'Órdenes de compra con tracking completo';
ALTER TABLE order_status_history COMMENT = 'Historial de cambios de estado de órdenes';

-- NOTA: Los triggers fueron removidos por limitaciones de privilegios.
-- La lógica de:
-- 1. Asegurar solo una dirección predeterminada por usuario
-- 2. Generar números de orden automáticos
-- 3. Registrar cambios de estado automáticamente
-- Se maneja ahora en la capa de aplicación (Node.js)
