-- Tabla de reservas temporales para el carrito
CREATE TABLE IF NOT EXISTS reservas (
  id_reserva SERIAL PRIMARY KEY,
  id_obra INTEGER NOT NULL REFERENCES obras(id_obra) ON DELETE CASCADE,
  id_user VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL, -- Para usuarios no autenticados
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  -- Índices para mejorar performance
  CONSTRAINT unique_obra_reservation UNIQUE(id_obra)
);

-- Índices
CREATE INDEX idx_reservas_user ON reservas(id_user);
CREATE INDEX idx_reservas_session ON reservas(session_id);
CREATE INDEX idx_reservas_expires ON reservas(expires_at);
CREATE INDEX idx_reservas_obra ON reservas(id_obra);

-- Función para limpiar reservas expiradas automáticamente
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS void AS $$
BEGIN
  DELETE FROM reservas WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comentarios
COMMENT ON TABLE reservas IS 'Reservas temporales de obras en el carrito (15 minutos)';
COMMENT ON COLUMN reservas.id_obra IS 'ID de la obra reservada';
COMMENT ON COLUMN reservas.id_user IS 'ID del usuario (Firebase UID)';
COMMENT ON COLUMN reservas.session_id IS 'ID de sesión para usuarios no autenticados';
COMMENT ON COLUMN reservas.expires_at IS 'Timestamp de expiración (15 minutos desde creación)';
