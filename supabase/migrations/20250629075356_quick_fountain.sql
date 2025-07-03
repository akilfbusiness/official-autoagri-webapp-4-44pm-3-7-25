/*
  # Add service selection column to job_cards table

  1. Changes
    - Add `service_selection` column to store the selected service type
    - Column allows storing "Service A", "Service B", "Service C", or "Service D"

  2. Security
    - No RLS changes needed as this extends existing table
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