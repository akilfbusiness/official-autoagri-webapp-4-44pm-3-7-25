/*
  # Add Customer Declaration fields

  1. New Columns
    - `customer_declaration_authorized` (boolean) - Customer authorization checkbox
  
  2. Changes
    - Add customer declaration field to job_cards table
    - Set default value to false for the authorization checkbox
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'customer_declaration_authorized'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN customer_declaration_authorized boolean DEFAULT false;
  END IF;
END $$;