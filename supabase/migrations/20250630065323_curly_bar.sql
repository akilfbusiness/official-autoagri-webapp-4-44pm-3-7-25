/*
  # Add completion status tracking for job cards

  1. New Columns
    - `is_worker_assigned_complete` (boolean, default false)
    - `is_parts_assigned_complete` (boolean, default false)
  
  2. Purpose
    - Track completion status of assigned workers and parts independently
    - Enable visual indicators in Admin Portal
    - Control job card visibility in Mechanic Portal
*/

DO $$
BEGIN
  -- Add is_worker_assigned_complete column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'is_worker_assigned_complete'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN is_worker_assigned_complete boolean DEFAULT false;
  END IF;

  -- Add is_parts_assigned_complete column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'is_parts_assigned_complete'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN is_parts_assigned_complete boolean DEFAULT false;
  END IF;
END $$;