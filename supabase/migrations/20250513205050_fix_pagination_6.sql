CREATE OR REPLACE FUNCTION public.get_nearby_postings_v7(
    lat double precision,
    long double precision,
    max_distance bigint DEFAULT 100000,
    category bigint DEFAULT NULL::bigint,
    limit_count integer DEFAULT 10,
    offset_count integer DEFAULT 0
  ) RETURNS TABLE (rows jsonb [], total bigint) LANGUAGE plpgsql
SET search_path TO 'public, postgis' AS $$ BEGIN RETURN QUERY WITH base_postings AS (
    SELECT DISTINCT p.*,
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
  categories_agg AS (
    SELECT p.id AS posting_id,
      COALESCE(
        json_agg(
          json_build_object(
            'id',
            c.id,
            'label',
            c.label,
            'icon',
            c.icon
          )
        ) FILTER (
          WHERE c.id IS NOT NULL
        ),
        '[]'::json
      ) AS categories
    FROM filtered_postings p
      LEFT JOIN public.posting_categories pc ON pc.posting_id = p.id
      LEFT JOIN public.categories c ON c.id = pc.category_id
    GROUP BY p.id
  ),
  paginated_postings AS (
    SELECT DISTINCT ON (fp.distance, fp.id) fp.*,
      ca.categories
    FROM filtered_postings fp
      LEFT JOIN categories_agg ca ON ca.posting_id = fp.id
    ORDER BY fp.distance ASC,
      fp.id
    LIMIT limit_count OFFSET offset_count
  )
SELECT ARRAY_AGG(
    DISTINCT jsonb_build_object(
      'id',
      p.id,
      'created_at',
      p.created_at,
      'updated_at',
      p.updated_at,
      'title',
      p.title,
      'description',
      p.description,
      'address',
      CASE
        WHEN p.show_address THEN p.address
        ELSE NULL
      END,
      'featured_image',
      p.featured_image,
      'distance',
      p.distance,
      'status',
      p.status,
      'website',
      p.website,
      'email',
      p.email,
      'phone',
      p.phone,
      'google_maps',
      p.google_maps,
      'categories',
      COALESCE(p.categories, '[]'::json)
    )
  ) as rows,
  (
    SELECT COUNT(DISTINCT id)
    FROM filtered_postings
  )::bigint as total
FROM paginated_postings p;
END;
$$;
CREATE OR REPLACE FUNCTION public.get_recent_postings_v7(
    lat double precision DEFAULT NULL::double precision,
    long double precision DEFAULT NULL::double precision,
    category bigint DEFAULT NULL::bigint,
    limit_count integer DEFAULT 10,
    offset_count integer DEFAULT 0
  ) RETURNS TABLE (rows jsonb [], total bigint) LANGUAGE plpgsql
SET search_path TO 'public, postgis' AS $$ BEGIN RETURN QUERY WITH base_postings AS (
    SELECT DISTINCT p.*,
      CASE
        WHEN lat IS NOT NULL
        AND long IS NOT NULL THEN postgis.ST_Distance(p.location, POINT(long, lat)::postgis.geometry)::bigint
        ELSE NULL
      END AS distance
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
  categories_agg AS (
    SELECT p.id AS posting_id,
      COALESCE(
        json_agg(
          json_build_object(
            'id',
            c.id,
            'label',
            c.label,
            'icon',
            c.icon
          )
        ) FILTER (
          WHERE c.id IS NOT NULL
        ),
        '[]'::json
      ) AS categories
    FROM filtered_postings p
      LEFT JOIN public.posting_categories pc ON pc.posting_id = p.id
      LEFT JOIN public.categories c ON c.id = pc.category_id
    GROUP BY p.id
  ),
  paginated_postings AS (
    SELECT fp.*,
      ca.categories
    FROM filtered_postings fp
      LEFT JOIN categories_agg ca ON ca.posting_id = fp.id
    ORDER BY fp.updated_at DESC NULLS LAST,
      fp.id
    LIMIT limit_count OFFSET offset_count
  )
SELECT ARRAY_AGG(
    jsonb_build_object(
      'id',
      p.id,
      'created_at',
      p.created_at,
      'updated_at',
      p.updated_at,
      'title',
      p.title,
      'description',
      p.description,
      'address',
      CASE
        WHEN p.show_address THEN p.address
        ELSE NULL
      END,
      'featured_image',
      p.featured_image,
      'distance',
      p.distance,
      'status',
      p.status,
      'website',
      p.website,
      'email',
      p.email,
      'phone',
      p.phone,
      'google_maps',
      p.google_maps,
      'categories',
      COALESCE(p.categories, '[]'::json)
    ) ORDER BY p.updated_at DESC NULLS LAST, p.id
  ) as rows,
  (
    SELECT COUNT(DISTINCT id)
    FROM filtered_postings
  )::bigint as total
FROM paginated_postings p;
END;
$$;
-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_nearby_postings_v7(
    double precision,
    double precision,
    bigint,
    bigint,
    integer,
    integer
  ) TO anon,
  authenticated,
  service_role;
GRANT EXECUTE ON FUNCTION public.get_recent_postings_v7(
    double precision,
    double precision,
    bigint,
    integer,
    integer
  ) TO anon,
  authenticated,
  service_role;