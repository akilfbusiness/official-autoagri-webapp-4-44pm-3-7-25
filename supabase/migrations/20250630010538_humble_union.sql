/*
  # Add lubricants used tracking to job_cards table

  1. New Columns
    - `lubricants_used` (jsonb) - Stores array of lubricants data
    - `total_c` (text) - Total cost of all lubricants

  2. Changes
    - Add lubricants_used column to job_cards table for dynamic lubricants tracking
    - Column will store array of objects with lubricant details (task_name, grade, qty, cost_per_litre, total_cost, remarks)
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