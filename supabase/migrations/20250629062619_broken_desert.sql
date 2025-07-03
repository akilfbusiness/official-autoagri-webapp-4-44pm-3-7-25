/*
  # Add Job Information fields to job_cards table

  1. New Columns
    - `job_number` (text, unique) - Format JC-YY-MM-NN
    - `job_start_date` (timestamptz) - Auto-populated with Adelaide time
    - `expected_completion_date` (timestamptz) - User input
    - `completed_date` (timestamptz, nullable) - Set when job is completed
    - `approximate_cost` (decimal) - Will be auto-calculated later

  2. Changes
    - Add unique constraint on job_number
    - Set default for job_start_date to current timestamp
*/

-- Add Job Information columns
ALTER TABLE job_cards 
ADD COLUMN IF NOT EXISTS job_number text UNIQUE,
ADD COLUMN IF NOT EXISTS job_start_date timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS expected_completion_date timestamptz,
ADD COLUMN IF NOT EXISTS completed_date timestamptz,
ADD COLUMN IF NOT EXISTS approximate_cost decimal(10,2) DEFAULT 0.00;

-- Create index on job_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_job_cards_job_number ON job_cards(job_number);

-- Create index on job_start_date for date-based queries
CREATE INDEX IF NOT EXISTS idx_job_cards_job_start_date ON job_cards(job_start_date);