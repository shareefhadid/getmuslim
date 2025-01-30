CREATE TABLE public.categories (
  id bigint generated by DEFAULT AS identity NOT NULL,
  label text NOT NULL,
  icon text NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;