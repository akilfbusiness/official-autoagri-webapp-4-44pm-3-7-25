/*
  # Add trailer progress tracking

  1. New Columns
    - `trailer_progress` (jsonb) - Stores trailer task progress data
  
  2. Changes
    - Add trailer_progress column to job_cards table to store trailer checklist data
    - Column will store array of objects with trailer task details (plant_number, etc.)
    - Uses JSONB for efficient querying and storage
    - Default value is empty array
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'trailer_progress'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN trailer_progress jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;