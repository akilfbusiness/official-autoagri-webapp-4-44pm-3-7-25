/*
  # Add Customer Details to job_cards table

  1. New Columns
    - `customer_name` (text) - Customer's full name
    - `company_name` (text) - Company name (optional)
    - `abn` (text) - Australian Business Number
    - `mobile` (text) - Mobile phone number
    - `email` (text) - Email address

  2. Changes
    - Add customer information columns to job_cards table
    - Create indexes for frequently searched fields
*/

-- Add Customer Details columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'customer_name'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN customer_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN company_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'abn'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN abn text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'mobile'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN mobile text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'email'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN email text;
  END IF;
END $$;

-- Create indexes for customer search functionality
CREATE INDEX IF NOT EXISTS idx_job_cards_customer_name ON job_cards(customer_name);
CREATE INDEX IF NOT EXISTS idx_job_cards_company_name ON job_cards(company_name);
CREATE INDEX IF NOT EXISTS idx_job_cards_email ON job_cards(email);