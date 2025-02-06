UPDATE public.postings
SET show_location = false
WHERE show_location IS NULL;