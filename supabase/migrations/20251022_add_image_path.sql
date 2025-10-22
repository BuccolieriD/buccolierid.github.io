-- Migration: add image_path column to articles

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS image_path text;

-- Backfill example:
-- If your `image` column stores public URLs like
-- https://<project>.supabase.co/storage/v1/object/public/images/filename.png
-- you can extract the path after the last slash and store it in image_path:

-- UPDATE public.articles
-- SET image_path = substring(image from '([^/]+)$')
-- WHERE image_path IS NULL AND image IS NOT NULL;

-- For more precise backfill, if you have nested folders, adjust the regex accordingly.
