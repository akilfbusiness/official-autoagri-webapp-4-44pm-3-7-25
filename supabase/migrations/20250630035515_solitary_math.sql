/*
  # Add other_progress column to job_cards table

  1. New Columns
    - `other_progress` (jsonb) - Stores other task progress data for "Other" vehicle type

  2. Changes
    - Add other_progress column to job_cards table for dynamic other task tracking
    - Column will store array of objects with task details (task_name, description, done_by, hours)
    - Uses JSONB for efficient querying and storage
    - Default value is empty array
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'other_progress'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN other_progress jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;