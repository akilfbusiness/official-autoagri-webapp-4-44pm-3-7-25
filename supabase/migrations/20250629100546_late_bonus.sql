/*
  # Add mechanic sections to job_cards table

  1. New Columns
    - `handover_valuables_to_customer` (text) - Notes for handover valuables check
    - `check_all_tyres` (text) - Notes for tyre check
    - `future_work_notes` (text) - Future work recommendations

  2. Changes
    - Add new columns to support the mechanic sections
    - These fields will store text notes for each section
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'handover_valuables_to_customer'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN handover_valuables_to_customer text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'check_all_tyres'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN check_all_tyres text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'future_work_notes'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN future_work_notes text;
  END IF;
END $$;