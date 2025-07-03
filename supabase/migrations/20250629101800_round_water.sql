/*
  # Add image upload columns to job_cards table

  1. New Columns
    - `image_front` (text) - Base64 encoded front image
    - `image_back` (text) - Base64 encoded back image  
    - `image_right_side` (text) - Base64 encoded right side image
    - `image_left_side` (text) - Base64 encoded left side image

  2. Changes
    - Add image storage columns to job_cards table for vehicle photos
    - Images will be compressed and stored as base64 strings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'image_front'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN image_front text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'image_back'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN image_back text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'image_right_side'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN image_right_side text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'image_left_side'
  ) THEN
    ALTER TABLE job_cards ADD COLUMN image_left_side text;
  END IF;
END $$;