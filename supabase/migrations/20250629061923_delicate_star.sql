/*
  # Create job_cards table

  1. New Tables
    - `job_cards`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_archived` (boolean, default false)

  2. Security
    - Enable RLS on `job_cards` table
    - Add policy for authenticated users to manage job cards
*/

CREATE TABLE IF NOT EXISTS job_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_archived boolean DEFAULT false
);

ALTER TABLE job_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage job cards"
  ON job_cards
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_cards_updated_at
  BEFORE UPDATE ON job_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();