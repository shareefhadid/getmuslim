-- Add generated columns for text search
ALTER TABLE public.postings
ADD COLUMN IF NOT EXISTS search_text tsvector GENERATED ALWAYS AS (
    to_tsvector(
      'english',
      title || ' ' || description || ' ' || address
    )
  ) STORED;
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS search_text tsvector GENERATED ALWAYS AS (to_tsvector('english', label)) STORED;