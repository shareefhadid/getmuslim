alter table public.posting_categories
add constraint posting_categories_posting_id_category_id unique (posting_id, category_id);