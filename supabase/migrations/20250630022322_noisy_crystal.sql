/*
  # Add lubricants_used and total_c columns to job_cards table

  1. New Columns
    - `lubricants_used` (jsonb) - Stores array of lubricants data with grade, qty, cost per litre, total cost, remarks
    - `total_c` (text) - Total cost of all lubricants used

  2. Changes
    - Add lubricants_used column to job_cards table for lubricants tracking
    - Add total_c column for storing the sum of all lubricant costs
    - Uses JSONB for efficient querying and storage
    - Default value is empty array for lubricants_used
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'lubricants_used'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN lubricants_used jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'total_c'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN total_c text;
  END IF;
END $$;