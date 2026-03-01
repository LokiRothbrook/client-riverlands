-- Migration: Newsletter Enhancements
-- Adds topic categories, frequency preferences, and manage token to newsletter subscribers
-- Also adds priority field to ad_placements for fair rotation

-- Create newsletter frequency enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE newsletter_frequency AS ENUM ('weekly', 'biweekly', 'monthly');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to newsletter_subscribers
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS topics_subscribed text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS frequency newsletter_frequency NOT NULL DEFAULT 'weekly',
  ADD COLUMN IF NOT EXISTS manage_token text UNIQUE DEFAULT uuid_generate_v4()::text;

-- Set manage_token for existing subscribers that don't have one
UPDATE newsletter_subscribers
SET manage_token = uuid_generate_v4()::text
WHERE manage_token IS NULL;

-- Make manage_token NOT NULL after populating existing rows
ALTER TABLE newsletter_subscribers
  ALTER COLUMN manage_token SET NOT NULL;

-- Add priority field to ad_placements
ALTER TABLE ad_placements
  ADD COLUMN IF NOT EXISTS priority integer NOT NULL DEFAULT 1;

-- Add index for manage_token lookups
CREATE INDEX IF NOT EXISTS newsletter_manage_token_idx ON newsletter_subscribers(manage_token);
