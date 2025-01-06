CREATE OR REPLACE FUNCTION get_posting_data(posting_id bigint) RETURNS TABLE (
    id bigint,
    title text,
    description text,
    lat double precision,
    long double precision,
    categories category_detail [],
    media media_detail [],
    links link_detail []
  ) LANGUAGE SQL
SET search_path = 'public' AS $$
SELECT p.id,
  p.title,
  p.description,
  CASE
    WHEN p.location IS NOT NULL THEN postgis.ST_Y(p.location::postgis.geometry)
    ELSE NULL
  END,
  CASE
    WHEN p.location IS NOT NULL THEN postgis.ST_X(p.location::postgis.geometry)
    ELSE NULL
  END,
  pd.categories,
  pd.media,
  pd.links
FROM public.postings p
  LEFT JOIN get_posting_details(ARRAY [posting_id]) pd ON pd.posting_id = p.id
WHERE p.id = posting_id;
$$;