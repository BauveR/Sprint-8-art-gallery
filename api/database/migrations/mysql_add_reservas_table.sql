-- ============================================================================
-- TABLA DE RESERVAS TEMPORALES PARA EL CARRITO (MySQL)
-- ============================================================================

CREATE TABLE IF NOT EXISTS reservas (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_obra INT NOT NULL,
  id_user VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL, -- Para usuarios no autenticados
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Restricción única: una obra solo puede estar reservada por un usuario a la vez
  UNIQUE KEY unique_obra_reservation (id_obra),

  -- Foreign key
  CONSTRAINT fk_reservas_obra FOREIGN KEY (id_obra) REFERENCES obras(id_obra) ON DELETE CASCADE,

  -- Índices para mejorar performance
  INDEX idx_reservas_user (id_user),
  INDEX idx_reservas_session (session_id),
  INDEX idx_reservas_expires (expires_at),
  INDEX idx_reservas_obra (id_obra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentarios
ALTER TABLE reservas COMMENT = 'Reservas temporales de obras en el carrito (15 minutos)';
