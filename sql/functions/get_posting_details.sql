CREATE OR REPLACE FUNCTION get_posting_details(posting_ids bigint []) RETURNS TABLE (
    posting_id bigint,
    categories category_detail [],
    links link_detail [],
    media media_detail []
  ) LANGUAGE SQL
SET search_path = 'public' AS $$
SELECT p.id AS posting_id,
  COALESCE(
    ARRAY_AGG(
      (c.id, c.label, c.icon)::category_detail
    ) FILTER (
      WHERE c.id IS NOT NULL
    ),
    ARRAY []::category_detail []
  ) AS categories,
  COALESCE(
    ARRAY_AGG(
      (
        pl.id,
        pl.url,
        (lt.id, lt.label, lt.icon, lt.prefix)::link_type_detail
      )::link_detail
    ) FILTER (
      WHERE pl.id IS NOT NULL
    ),
    ARRAY []::link_detail []
  ) AS links,
  COALESCE(
    ARRAY_AGG(
      (pm.id, pm.url, pm.media_type)::media_detail
    ) FILTER (
      WHERE pm.id IS NOT NULL
    ),
    ARRAY []::media_detail []
  ) AS media
FROM unnest(posting_ids) pid
  JOIN public.postings p ON p.id = pid
  LEFT JOIN public.posting_categories pc ON pc.posting_id = p.id
  LEFT JOIN public.categories c ON c.id = pc.category_id
  LEFT JOIN public.posting_links pl ON pl.posting_id = p.id
  LEFT JOIN public.link_types lt ON lt.id = pl.link_type_id
  LEFT JOIN public.posting_media pm ON pm.posting_id = p.id
GROUP BY p.id;
$$;