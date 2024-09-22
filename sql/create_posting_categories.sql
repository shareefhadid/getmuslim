create table if not exists public.posting_categories (
  posting_id bigint not null,
  category_id bigint not null,
  primary key (posting_id, category_id),
  foreign key (posting_id) references public.postings (id) on delete cascade,
  foreign key (category_id) references public.categories (id) on delete cascade
) tablespace pg_default;