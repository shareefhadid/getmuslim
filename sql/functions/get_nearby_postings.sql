CREATE OR REPLACE FUNCTION get_nearby_postings (
    lat DOUBLE PRECISION,
    long DOUBLE PRECISION,
    max_distance bigint DEFAULT 100000,
    category bigint DEFAULT NULL,
    limit_count INT DEFAULT 10,
    offset_count INT DEFAULT 0
  ) RETURNS public.paginated_postings LANGUAGE plpgsql
SET search_path = 'public, postgis' AS $$
DECLARE result public.paginated_postings;
BEGIN WITH base_postings AS (
  SELECT p.id,
    p.created_at,
    p.updated_at,
    p.title,
    p.description,
    p.address,
    p.featured_image,
    p.status,
    postgis.ST_Distance(p.location, POINT(long, lat)::postgis.geometry)::bigint AS distance
  FROM public.postings p
  WHERE postgis.ST_DWithin(
      p.location,
      POINT(long, lat)::postgis.geometry,
      max_distance
    )
    AND p.status = 'active'
),
filtered_postings AS (
  SELECT DISTINCT bp.*
  FROM base_postings bp
    LEFT JOIN public.posting_categories pc ON pc.posting_id = bp.id
  WHERE category IS NULL
    OR pc.category_id = category
),
paginated_postings AS (
  SELECT *
  FROM filtered_postings
  ORDER BY distance ASC
  LIMIT limit_count OFFSET offset_count
),
posting_details AS (
  SELECT *
  FROM public.get_posting_details(
      (
        SELECT array_agg(paginated_postings.id)
        FROM paginated_postings
      )
    )
),
final_results AS (
  SELECT fp.id,
    fp.created_at,
    fp.updated_at,
    fp.title,
    fp.description,
    fp.address,
    fp.featured_image,
    fp.distance,
    fp.status,
    pd.categories,
    pd.links,
    pd.media
  FROM paginated_postings fp
    LEFT JOIN posting_details pd ON pd.posting_id = fp.id
  ORDER BY fp.distance ASC
)
SELECT array_agg((final_results.*)::public.posting_details),
  (
    SELECT COUNT(*)
    FROM filtered_postings
  ) INTO result.rows,
  result.count
FROM final_results;
RETURN result;
END;
$$;