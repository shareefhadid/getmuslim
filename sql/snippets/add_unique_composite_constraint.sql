alter table public.posting_categories
add constraint posting_categories_posting_id_category_id unique (posting_id, category_id);

alter table public.posting_links
add constraint posting_links_posting_type_unique unique (posting_id, link_type_id);