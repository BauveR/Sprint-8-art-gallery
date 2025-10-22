-- ============================================================================
-- TABLA DE DIRECCIONES DE ENVÍO (MySQL)
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

-- Trigger para asegurar solo una dirección predeterminada por usuario
DELIMITER //
CREATE TRIGGER trigger_single_default_address_before_insert
BEFORE INSERT ON direcciones_envio
FOR EACH ROW
BEGIN
  IF NEW.es_predeterminada = TRUE THEN
    UPDATE direcciones_envio
    SET es_predeterminada = FALSE
    WHERE id_user = NEW.id_user
      AND es_predeterminada = TRUE;
  END IF;
END//

CREATE TRIGGER trigger_single_default_address_before_update
BEFORE UPDATE ON direcciones_envio
FOR EACH ROW
BEGIN
  IF NEW.es_predeterminada = TRUE AND (OLD.es_predeterminada = FALSE OR OLD.es_predeterminada IS NULL) THEN
    UPDATE direcciones_envio
    SET es_predeterminada = FALSE
    WHERE id_user = NEW.id_user
      AND id_direccion != NEW.id_direccion
      AND es_predeterminada = TRUE;
  END IF;
END//
DELIMITER ;

-- ============================================================================
-- MEJORAR TABLA DE ÓRDENES (MySQL)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ordenes (
  id_orden INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL, -- Número de orden visible (ORD-2025-0001)

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

-- Trigger para generar número de orden automáticamente
DELIMITER //
CREATE TRIGGER trigger_set_order_number
BEFORE INSERT ON ordenes
FOR EACH ROW
BEGIN
  DECLARE year_str VARCHAR(4);
  DECLARE counter INT;
  DECLARE new_order_num VARCHAR(50);

  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    SET year_str = YEAR(NOW());

    -- Obtener el contador actual para el año
    SELECT COALESCE(MAX(
      CAST(SUBSTRING(order_number, LOCATE('-', order_number, 5) + 1) AS UNSIGNED)
    ), 0) + 1 INTO counter
    FROM ordenes
    WHERE order_number LIKE CONCAT('ORD-', year_str, '-%');

    -- Generar el número de orden
    SET new_order_num = CONCAT('ORD-', year_str, '-', LPAD(counter, 4, '0'));
    SET NEW.order_number = new_order_num;
  END IF;
END//
DELIMITER ;

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

-- Trigger para registrar cambios de estado automáticamente
DELIMITER //
CREATE TRIGGER trigger_log_order_status_change
BEFORE UPDATE ON ordenes
FOR EACH ROW
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO order_status_history (id_orden, status_from, status_to, changed_by, notes)
    VALUES (NEW.id_orden, OLD.status, NEW.status, 'system', NEW.admin_notes);

    -- Actualizar timestamps según el nuevo estado
    IF NEW.status = 'paid' THEN
      SET NEW.paid_at = NOW();
    ELSEIF NEW.status = 'shipped' THEN
      SET NEW.shipped_at = NOW();
    ELSEIF NEW.status = 'delivered' THEN
      SET NEW.delivered_at = NOW();
    END IF;
  END IF;
END//
DELIMITER ;

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================

ALTER TABLE direcciones_envio COMMENT = 'Direcciones de envío guardadas de los usuarios';
ALTER TABLE ordenes COMMENT = 'Órdenes de compra con tracking completo';
ALTER TABLE order_status_history COMMENT = 'Historial de cambios de estado de órdenes';

-- Estados posibles de órdenes:
-- pending: Orden creada, pendiente de pago
-- paid: Pago confirmado, procesando envío
-- processing_shipment: Preparando el paquete para envío
-- shipped: Enviado, en tránsito
-- delivered: Entregado al cliente
-- pending_return: Cliente solicitó devolución
-- never_delivered: No se pudo entregar
-- cancelled: Orden cancelada
