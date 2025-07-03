/*
  # Add service selection field

  1. New Columns
    - `service_selection` (text) - Service type selection for HR Truck/Prime Mover

  2. Changes
    - Add service_selection column to job_cards table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'service_selection'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN service_selection text;
  END IF;
END $$;