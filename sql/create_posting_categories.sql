create table if not exists public.posting_categories (
  id bigint generated by default as identity not null,
  posting_id bigint not null,
  category_id bigint not null,
  constraint posting_categories_pkey primary key (id),
  constraint posting_categories_posting_id_category_id unique (posting_id, category_id),
  constraint posting_categories_category_id_fkey foreign key (category_id) references categories (id) on delete cascade,
  constraint posting_categories_posting_id_fkey foreign key (posting_id) references postings (id) on delete cascade
) tablespace pg_default;