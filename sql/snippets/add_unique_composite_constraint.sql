ALTER TABLE public.posting_categories
ADD CONSTRAINT posting_categories_posting_id_category_id UNIQUE (posting_id, category_id);
ALTER TABLE public.posting_links
ADD CONSTRAINT posting_links_posting_type_unique UNIQUE (posting_id, link_type_id);