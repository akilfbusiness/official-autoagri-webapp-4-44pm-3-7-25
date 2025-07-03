/*
  # Update job cards totals to numeric type

  1. Changes
    - Convert total_a from text to numeric(10,2)
    - Convert total_c from text to numeric(10,2)
    - These changes enable proper auto-calculation of approximate_cost

  2. Notes
    - Existing text data will be converted to numeric where possible
    - Invalid numeric data will be set to 0.00
*/

DO $$
BEGIN
  -- Convert total_a from text to numeric
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'total_a' AND data_type = 'text'
  ) THEN
    -- First, update any non-numeric values to '0'
    UPDATE job_cards 
    SET total_a = '0' 
    WHERE total_a IS NOT NULL 
    AND total_a !~ '^[0-9]*\.?[0-9]+$'
    AND total_a != '';
    
    -- Set empty strings to NULL
    UPDATE job_cards 
    SET total_a = NULL 
    WHERE total_a = '';
    
    -- Convert column type
    ALTER TABLE job_cards 
    ALTER COLUMN total_a TYPE numeric(10,2) 
    USING CASE 
      WHEN total_a IS NULL OR total_a = '' THEN 0.00
      ELSE total_a::numeric(10,2)
    END;
    
    -- Set default value
    ALTER TABLE job_cards 
    ALTER COLUMN total_a SET DEFAULT 0.00;
  END IF;

  -- Convert total_c from text to numeric
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_cards' AND column_name = 'total_c' AND data_type = 'text'
  ) THEN
    -- First, update any non-numeric values to '0'
    UPDATE job_cards 
    SET total_c = '0' 
    WHERE total_c IS NOT NULL 
    AND total_c !~ '^[0-9]*\.?[0-9]+$'
    AND total_c != '';
    
    -- Set empty strings to NULL
    UPDATE job_cards 
    SET total_c = NULL 
    WHERE total_c = '';
    
    -- Convert column type
    ALTER TABLE job_cards 
    ALTER COLUMN total_c TYPE numeric(10,2) 
    USING CASE 
      WHEN total_c IS NULL OR total_c = '' THEN 0.00
      ELSE total_c::numeric(10,2)
    END;
    
    -- Set default value
    ALTER TABLE job_cards 
    ALTER COLUMN total_c SET DEFAULT 0.00;
  END IF;
END $$;