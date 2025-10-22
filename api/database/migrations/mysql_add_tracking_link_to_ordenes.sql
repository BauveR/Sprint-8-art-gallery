-- Add tracking_link field to ordenes table
ALTER TABLE ordenes
ADD COLUMN tracking_link VARCHAR(500) NULL AFTER carrier;
