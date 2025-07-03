/*
  # Add parts and consumables column to job_cards table

  1. New Columns
    - `parts_and_consumables` (jsonb) - Stores array of parts and consumables data

  2. Changes
    - Add parts_and_consumables column to job_cards table for dynamic parts tracking
    - Column will store array of objects with part details (part_number, description, price, qty_used, total_cost, supplier, remarks)
    - Uses JSONB for efficient querying and storage
    - Default value is empty array
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'parts_and_consumables'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN parts_and_consumables jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;