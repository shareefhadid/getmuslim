-- Add generated columns for text search
ALTER TABLE public.postings 
ADD COLUMN IF NOT EXISTS search_text tsvector 
GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || description)) STORED;

ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS search_text tsvector 
GENERATED ALWAYS AS (to_tsvector('english', label)) STORED;

-- Create GIN indexes for fast text search
CREATE INDEX IF NOT EXISTS postings_search_idx ON public.postings USING gin(search_text);
CREATE INDEX IF NOT EXISTS categories_search_idx ON public.categories USING gin(search_text); 