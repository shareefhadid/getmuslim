-- First create the function
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language plpgsql;
-- Then add the column and trigger
ALTER TABLE postings
ADD COLUMN IF NOT EXISTS updated_at timestamp WITH time zone DEFAULT NOW();
-- Create the trigger
CREATE TRIGGER update_timestamp BEFORE
UPDATE ON postings FOR EACH ROW EXECUTE FUNCTION update_timestamp();