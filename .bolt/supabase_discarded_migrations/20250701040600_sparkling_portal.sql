/*
  # Enable Row Level Security for job_cards table

  1. Security Changes
    - Enable RLS on job_cards table
    - Ensure existing policies work correctly with authenticated users
    
  2. Notes
    - The table already has policies defined but RLS was disabled
    - This migration enables RLS to make the policies active
    - All existing data and functionality will be preserved
*/

-- Enable Row Level Security on job_cards table
ALTER TABLE job_cards ENABLE ROW LEVEL SECURITY;

-- Verify the existing policy is still active
-- The policy "Users can manage job cards" should already exist and allow all operations for authenticated users