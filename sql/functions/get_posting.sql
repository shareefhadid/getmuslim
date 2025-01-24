CREATE OR REPLACE FUNCTION get_posting(
        posting_id bigint,
        lat double precision DEFAULT NULL,
        long double precision DEFAULT NULL
    ) RETURNS TABLE (
        id bigint,
        created_at timestamp WITH time zone,
        updated_at timestamp WITH time zone,
        title text,
        description text,
        address text,
        featured_image text,
        distance bigint,
        status posting_status,
        categories category_detail [],
        links link_detail [],
        media media_detail []
    ) LANGUAGE SQL
SET search_path = 'public, postgis' AS $$ WITH base_posting AS (
        SELECT p.id,
            p.created_at,
            p.updated_at,
            p.title,
            p.description,
            p.address,
            p.featured_image,
            p.status,
            CASE
                WHEN lat IS NOT NULL
                AND long IS NOT NULL THEN postgis.ST_Distance(p.location, POINT(long, lat)::postgis.geometry)::bigint
                ELSE NULL
            END AS distance
        FROM public.postings p
        WHERE p.id = posting_id
            AND p.status = 'active'
    )
SELECT bp.id,
    bp.created_at,
    bp.updated_at,
    bp.title,
    bp.description,
    bp.address,
    bp.featured_image,
    bp.distance,
    bp.status,
    pd.categories,
    pd.links,
    pd.media
FROM base_posting bp
    LEFT JOIN public.get_posting_details(ARRAY [posting_id]) pd ON pd.posting_id = bp.id;
$$;