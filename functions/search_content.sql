CREATE OR REPLACE FUNCTION search_content(search_query text) RETURNS TABLE (
    category_results json,
    posting_results json
  ) LANGUAGE SQL
SET search_path = 'public, postgis' AS $$ WITH processed_query AS (
    SELECT string_agg(word || ':*', ' | ') AS query
    FROM unnest(string_to_array(trim(search_query), ' ')) AS word
  )
SELECT (
    SELECT json_agg(
        json_build_object(
          'id',
          c.id,
          'label',
          c.label,
          'icon',
          c.icon
        )
      )
    FROM public.categories c
    WHERE c.search_text @@ to_tsquery(
        'english',
        (
          SELECT query
          FROM processed_query
        )
      )
    LIMIT 5
  ) AS category_results,
  (
    SELECT json_agg(
        json_build_object(
          'id',
          p.id,
          'title',
          p.title,
          'description',
          p.description,
          'featured_image',
          p.featured_image,
          'address',
          CASE
            WHEN p.show_address THEN p.address
            ELSE NULL
          END
        )
      )
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
  ) AS posting_results;
$$;