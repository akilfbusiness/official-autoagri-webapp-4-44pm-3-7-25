/*
  # Add vehicle_state column to job_cards table

  1. New Column
    - `vehicle_state` (text) - Australian state/territory for vehicle registration

  2. Changes
    - Add vehicle_state column to job_cards table for storing state information
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'vehicle_state'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN vehicle_state text;
  END IF;
END $$;