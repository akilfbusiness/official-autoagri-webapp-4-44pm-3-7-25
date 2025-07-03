/*
  # Add Total A and Assigned Fields to job_cards table

  1. New Columns
    - `total_a` (text) - Manual total field for mechanics
    - `assigned_worker` (text) - Dropdown selection for assigned worker
    - `assigned_parts` (text) - Dropdown selection for assigned parts

  2. Changes
    - Add new columns to job_cards table
    - These fields support the new functionality in the job card form
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'total_a'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN total_a text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'assigned_worker'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN assigned_worker text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'assigned_parts'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN assigned_parts text;
  END IF;
END $$;