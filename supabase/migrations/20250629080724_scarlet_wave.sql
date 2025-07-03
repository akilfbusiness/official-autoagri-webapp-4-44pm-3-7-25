/*
  # Add service progress tracking

  1. New Columns
    - `service_progress` (jsonb) - Stores dynamic task progress data
  
  2. Changes
    - Add service_progress column to job_cards table to store task completion data
    - Column will store array of objects with task details (task_name, status, description, done_by, hours)
    - Only tasks with actual data will be stored to prevent redundant storage
  
  3. Notes
    - Uses JSONB for efficient querying and storage
    - Default value is empty array
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'service_progress'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN service_progress jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;