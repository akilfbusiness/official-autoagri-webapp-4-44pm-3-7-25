/*
  # Add Vehicle Details columns to job_cards table

  1. New Columns
    - `vehicle_make` (text) - Vehicle manufacturer
    - `vehicle_model` (text) - Vehicle model
    - `vehicle_month` (text) - Month of manufacture (01-12)
    - `vehicle_year` (integer) - Year of manufacture (4 digits)
    - `vehicle_kms` (integer) - Current kilometers
    - `fuel_type` (text) - Petrol or Diesel
    - `vin` (text) - Vehicle Identification Number
    - `tyre_size` (text) - Tyre size specification
    - `next_service_kms` (integer) - Next service due at kilometers
    - `vehicle_type` (text[]) - Array of vehicle types (HR Truck, Prime Mover, Trailer, Other)

  2. Indexes
    - Add indexes for frequently searched vehicle fields
*/

-- Add Vehicle Details columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'vehicle_make'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN vehicle_make text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'vehicle_model'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN vehicle_model text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'vehicle_month'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN vehicle_month text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'vehicle_year'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN vehicle_year integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'vehicle_kms'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN vehicle_kms integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'fuel_type'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN fuel_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'vin'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN vin text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'tyre_size'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN tyre_size text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'next_service_kms'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN next_service_kms integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'vehicle_type'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN vehicle_type text[];
  END IF;
END $$;

-- Create indexes for vehicle search functionality
CREATE INDEX IF NOT EXISTS idx_job_cards_vehicle_make ON job_cards(vehicle_make);
CREATE INDEX IF NOT EXISTS idx_job_cards_vehicle_model ON job_cards(vehicle_model);
CREATE INDEX IF NOT EXISTS idx_job_cards_vin ON job_cards(vin);
CREATE INDEX IF NOT EXISTS idx_job_cards_fuel_type ON job_cards(fuel_type);