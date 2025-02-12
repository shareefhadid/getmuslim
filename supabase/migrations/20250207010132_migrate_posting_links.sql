-- Update phone numbers
UPDATE public.postings p
SET phone = REPLACE(pl.url, 'tel:', '')
FROM public.posting_links pl
WHERE pl.posting_id = p.id
  AND pl.link_type_id = 3;
-- Update emails
UPDATE public.postings p
SET email = REPLACE(pl.url, 'mailto:', '')
FROM public.posting_links pl
WHERE pl.posting_id = p.id
  AND pl.link_type_id = 4;
-- Update websites
UPDATE public.postings p
SET website = pl.url
FROM public.posting_links pl
WHERE pl.posting_id = p.id
  AND pl.link_type_id = 2;
-- Update google maps
UPDATE public.postings p
SET google_maps = pl.url
FROM public.posting_links pl
WHERE pl.posting_id = p.id
  AND pl.link_type_id = 1;
