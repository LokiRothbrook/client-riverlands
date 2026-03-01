-- Add show_cover_image toggle to posts (defaults to true / visible)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS show_cover_image boolean NOT NULL DEFAULT true;
