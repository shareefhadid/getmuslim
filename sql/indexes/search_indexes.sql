-- Create GIN indexes for fast text search
CREATE INDEX IF NOT EXISTS postings_search_idx ON public.postings USING gin(search_text);
CREATE INDEX IF NOT EXISTS categories_search_idx ON public.categories USING gin(search_text);