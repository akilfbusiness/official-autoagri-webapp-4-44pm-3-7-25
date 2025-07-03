/*
  # Add payment status column to job_cards table

  1. New Columns
    - `payment_status` (text) - Payment status: 'paid' or 'unpaid'

  2. Changes
    - Add payment_status column to job_cards table with default value 'unpaid'
    - This supports the new Payments tab functionality
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN payment_status text DEFAULT 'unpaid';
  END IF;
END $$;