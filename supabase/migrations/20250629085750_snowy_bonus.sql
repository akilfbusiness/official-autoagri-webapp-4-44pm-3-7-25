/*
  # Add REGO column to job_cards table

  1. New Column
    - `rego` (text) - Vehicle registration number

  2. Changes
    - Add rego column to job_cards table with proper indexing for search functionality
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'rego'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN rego text;
  END IF;
END $$;

-- Add index for rego field for better search performance
CREATE INDEX IF NOT EXISTS idx_job_cards_rego ON job_cards USING btree (rego);