-- Add buyer information fields to obras table
ALTER TABLE obras
ADD COLUMN comprador_nombre VARCHAR(255) NULL,
ADD COLUMN comprador_email VARCHAR(255) NULL,
ADD COLUMN fecha_compra DATETIME NULL;

-- Add index on buyer email for faster queries
CREATE INDEX idx_obras_comprador_email ON obras(comprador_email);
