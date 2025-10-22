-- ============================================================================
-- TABLA DE DIRECCIONES DE ENVÍO
-- ============================================================================

CREATE TABLE IF NOT EXISTS direcciones_envio (
  id_direccion SERIAL PRIMARY KEY,
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

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para direcciones
CREATE INDEX idx_direcciones_user ON direcciones_envio(id_user);
CREATE INDEX idx_direcciones_predeterminada ON direcciones_envio(id_user, es_predeterminada);

-- Trigger para asegurar solo una dirección predeterminada por usuario
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.es_predeterminada = TRUE THEN
    UPDATE direcciones_envio
    SET es_predeterminada = FALSE
    WHERE id_user = NEW.id_user
      AND id_direccion != NEW.id_direccion
      AND es_predeterminada = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_single_default_address
BEFORE INSERT OR UPDATE ON direcciones_envio
FOR EACH ROW
EXECUTE FUNCTION ensure_single_default_address();

-- ============================================================================
-- MEJORAR TABLA DE ÓRDENES
-- ============================================================================

-- Tipo ENUM para estados de orden
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending',              -- Pendiente de pago
    'paid',                 -- Pagado, procesando envío
    'processing_shipment',  -- Procesando envío
    'shipped',              -- Enviado
    'delivered',            -- Entregado
    'pending_return',       -- Pendiente de devolución
    'never_delivered',      -- Nunca entregado
    'cancelled'             -- Cancelado
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Si la tabla ya existe, la modificamos. Si no, la creamos
CREATE TABLE IF NOT EXISTS ordenes (
  id_orden SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL, -- Número de orden visible (ORD-2025-0001)

  -- Usuario
  id_user VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,

  -- Dirección de envío (FK)
  id_direccion INTEGER REFERENCES direcciones_envio(id_direccion),

  -- Snapshot de dirección (para histórico, en caso de que se borre la dirección)
  shipping_snapshot JSONB NOT NULL,

  -- Items de la orden
  items JSONB NOT NULL, -- [{id_obra, titulo, precio, cantidad}]

  -- Totales
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Estado y tracking
  status order_status DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  tracking_number VARCHAR(255),
  carrier VARCHAR(100), -- "FedEx", "DHL", "Estafeta", etc.
  estimated_delivery DATE,
  delivered_at TIMESTAMP,

  -- Notas y motivos
  admin_notes TEXT,
  return_reason TEXT,
  customer_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  shipped_at TIMESTAMP
);

-- Índices para órdenes
CREATE INDEX idx_ordenes_user ON ordenes(id_user);
CREATE INDEX idx_ordenes_status ON ordenes(status);
CREATE INDEX idx_ordenes_number ON ordenes(order_number);
CREATE INDEX idx_ordenes_created ON ordenes(created_at DESC);

-- Función para generar número de orden
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  counter INT;
  order_num TEXT;
BEGIN
  year := EXTRACT(YEAR FROM NOW())::TEXT;

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_number FROM 'ORD-[0-9]{4}-([0-9]+)') AS INT)
  ), 0) + 1 INTO counter
  FROM ordenes
  WHERE order_number LIKE 'ORD-' || year || '-%';

  order_num := 'ORD-' || year || '-' || LPAD(counter::TEXT, 4, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de orden automáticamente
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
BEFORE INSERT ON ordenes
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_timestamp
BEFORE UPDATE ON ordenes
FOR EACH ROW
EXECUTE FUNCTION update_order_timestamp();

-- ============================================================================
-- TABLA DE HISTORIAL DE CAMBIOS DE ESTADO
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_status_history (
  id_history SERIAL PRIMARY KEY,
  id_orden INTEGER NOT NULL REFERENCES ordenes(id_orden) ON DELETE CASCADE,

  status_from order_status,
  status_to order_status NOT NULL,

  changed_by VARCHAR(255), -- Usuario que hizo el cambio (admin o system)
  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para historial
CREATE INDEX idx_order_history_orden ON order_status_history(id_orden);
CREATE INDEX idx_order_history_created ON order_status_history(created_at DESC);

-- Trigger para registrar cambios de estado automáticamente
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (id_orden, status_from, status_to, changed_by, notes)
    VALUES (NEW.id_orden, OLD.status, NEW.status, 'system', NEW.admin_notes);

    -- Actualizar timestamps según el nuevo estado
    IF NEW.status = 'paid' THEN
      NEW.paid_at = NOW();
    ELSIF NEW.status = 'shipped' THEN
      NEW.shipped_at = NOW();
    ELSIF NEW.status = 'delivered' THEN
      NEW.delivered_at = NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_order_status_change
BEFORE UPDATE ON ordenes
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================

COMMENT ON TABLE direcciones_envio IS 'Direcciones de envío guardadas de los usuarios';
COMMENT ON TABLE ordenes IS 'Órdenes de compra con tracking completo';
COMMENT ON TABLE order_status_history IS 'Historial de cambios de estado de órdenes';

COMMENT ON COLUMN ordenes.order_number IS 'Número de orden visible al usuario (ORD-2025-0001)';
COMMENT ON COLUMN ordenes.shipping_snapshot IS 'Snapshot de la dirección de envío en el momento de la compra';
COMMENT ON COLUMN ordenes.items IS 'Array de items: [{id_obra, titulo, precio, cantidad}]';
COMMENT ON COLUMN ordenes.status IS 'Estado actual de la orden';

-- Estados posibles:
-- pending: Orden creada, pendiente de pago
-- paid: Pago confirmado, procesando envío
-- processing_shipment: Preparando el paquete para envío
-- shipped: Enviado, en tránsito
-- delivered: Entregado al cliente
-- pending_return: Cliente solicitó devolución
-- never_delivered: No se pudo entregar
-- cancelled: Orden cancelada
