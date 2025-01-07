CREATE OR REPLACE FUNCTION get_recent_postings (
    lat double precision DEFAULT NULL,
    long double precision DEFAULT NULL,
    category bigint DEFAULT NULL,
    limit_count int DEFAULT 10,
    offset_count int DEFAULT 0
  ) RETURNS public.paginated_postings LANGUAGE plpgsql
SET search_path = 'public, postgis' AS $$
DECLARE result public.paginated_postings;
BEGIN WITH base_postings AS (
  SELECT p.id,
    p.created_at,
    p.title,
    p.description,
    p.address,
    p.featured_image,
    p.location
  FROM public.postings p
  WHERE p.status = 'active'
),
filtered_postings AS (
  SELECT DISTINCT bp.*
  FROM base_postings bp
    LEFT JOIN public.posting_categories pc ON pc.posting_id = bp.id
  WHERE category IS NULL
    OR pc.category_id = category
),
paginated_postings AS (
  SELECT fp.*
  FROM filtered_postings fp
  ORDER BY fp.created_at DESC
  LIMIT limit_count OFFSET offset_count
),
postings_with_distance AS (
  SELECT pp.*,
    CASE
      WHEN lat IS NOT NULL
      AND long IS NOT NULL THEN postgis.ST_Distance(pp.location, POINT(long, lat)::postgis.geometry)::bigint
      ELSE NULL
    END AS distance
  FROM paginated_postings pp
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
  SELECT pp.id,
    pp.created_at,
    pp.title,
    pp.description,
    pp.address,
    pp.featured_image,
    pp.distance,
    pd.categories,
    pd.links,
    pd.media
  FROM postings_with_distance pp
    LEFT JOIN posting_details pd ON pd.posting_id = pp.id
  ORDER BY pp.created_at DESC
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