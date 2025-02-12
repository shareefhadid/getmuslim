-- Drop the existing types and function if they exist
DROP FUNCTION IF EXISTS public.search_content(text);
DROP TYPE IF EXISTS public.search_results;
-- Create the new function
CREATE OR REPLACE FUNCTION search_content(search_query text) RETURNS TABLE(categories json, postings json) LANGUAGE SQL
SET search_path = 'public, postgis' AS $$ WITH processed_query AS (
    SELECT string_agg(word || ':*', ' & ') AS query
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
  ), (
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
  );
$$;
-- Grant permissions to all users since this is public data
GRANT EXECUTE ON FUNCTION public.search_content(text) TO anon,
  authenticated,
  service_role;