/*
  # Add total_c column to job_cards table

  1. New Columns
    - `total_c` (text) - Total C value for lubricants used

  2. Changes
    - Add total_c column to job_cards table for storing calculated total
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'total_c'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN total_c text;
  END IF;
END $$;