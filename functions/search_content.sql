CREATE OR REPLACE FUNCTION search_content(search_query text) RETURNS search_results LANGUAGE SQL
SET search_path = 'public, postgis' AS $$ WITH processed_query AS (
    SELECT string_agg(word || ':*', ' | ') AS query
    FROM unnest(string_to_array(trim(search_query), ' ')) AS word
  ),
  matching_categories AS (
    SELECT ARRAY_AGG(
        ROW(c.id, c.label, c.icon)::public.category_detail
      ) AS categories
    FROM public.categories c
    WHERE c.search_text @@ to_tsquery(
        'english',
        (
          SELECT query
          FROM processed_query
        )
      )
    LIMIT 5
  ), matching_postings AS (
    SELECT ARRAY_AGG(
        ROW(
          p.id,
          p.created_at,
          p.title,
          p.description,
          p.location,
          p.show_address,
          p.address,
          p.featured_image,
          p.updated_at,
          p.status,
          NULL::tsvector
        )::public.postings
      ) AS postings
    FROM public.postings p
    WHERE p.status = 'active'
      AND p.search_text @@ to_tsquery(
        'english',
        (
          SELECT query
          FROM processed_query
        )
      )
    LIMIT 5
  )
SELECT COALESCE(
    (
      SELECT categories
      FROM matching_categories
    ),
    ARRAY []::public.category_detail []
  ) AS categories,
  COALESCE(
    (
      SELECT postings
      FROM matching_postings
    ),
    ARRAY []::public.postings []
  ) AS postings;
$$;