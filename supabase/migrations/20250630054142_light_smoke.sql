/*
  # Add signature columns to job_cards table

  1. New Columns
    - `customer_signature` (text) - Customer signature data
    - `supervisor_signature` (text) - Supervisor signature data

  2. Security
    - No additional RLS policies needed as signatures are part of job card data
*/

DO $$
BEGIN
  -- Add customer_signature column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'customer_signature'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN customer_signature text;
  END IF;

  -- Add supervisor_signature column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'supervisor_signature'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN supervisor_signature text;
  END IF;
END $$;