CREATE TYPE posting_details AS (
  id bigint,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  title text,
  description text,
  address text,
  featured_image text,
  distance bigint,
  status posting_status,
  categories category_detail [],
  links link_detail [],
  media media_detail []
);