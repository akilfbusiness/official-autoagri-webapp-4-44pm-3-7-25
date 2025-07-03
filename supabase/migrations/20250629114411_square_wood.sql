/*
  # Add Parts tab fields to job_cards table

  1. New Columns
    - `invoice_number` (text) - Invoice number for parts
    - `part_location` (text) - Location where parts are stored
    - `invoice_date` (date) - Date of the invoice
    - `invoice_value` (decimal) - Value of the invoice
    - `issue_counter_sale` (text) - Issue counter sale information

  2. Changes
    - Add new columns to job_cards table for parts management
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'invoice_number'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN invoice_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'part_location'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN part_location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'invoice_date'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN invoice_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'invoice_value'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN invoice_value decimal(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'issue_counter_sale'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN issue_counter_sale text;
  END IF;
END $$;