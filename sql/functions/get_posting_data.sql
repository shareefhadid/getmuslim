CREATE OR REPLACE FUNCTION get_posting_data(posting_id bigint) RETURNS jsonb language SQL
SET search_path = 'public' AS $$
SELECT jsonb_build_object(
    'id',
    p.id,
    'title',
    p.title,
    'description',
    p.description,
    'lat',
    CASE
      WHEN p.location IS NOT NULL THEN postgis.st_y(p.location::postgis.geometry)
      ELSE NULL
    END,
    'long',
    CASE
      WHEN p.location IS NOT NULL THEN postgis.st_x(p.location::postgis.geometry)
      ELSE NULL
    END,
    'categories',
    (
      SELECT categories
      FROM get_posting_details(ARRAY [posting_id])
    ),
    'media',
    (
      SELECT media
      FROM get_posting_details(ARRAY [posting_id])
    ),
    'links',
    (
      SELECT links
      FROM get_posting_details(ARRAY [posting_id])
    )
  )
FROM public.postings p
WHERE p.id = posting_id;
$$;