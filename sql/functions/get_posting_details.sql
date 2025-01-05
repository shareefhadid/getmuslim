CREATE OR REPLACE FUNCTION get_posting_details(posting_ids bigint []) RETURNS TABLE (
    posting_id bigint,
    categories json [],
    links json [],
    media json []
  ) language SQL
SET search_path = 'public' AS $$
SELECT p.id AS posting_id,
  coalesce(
    array_agg(
      DISTINCT jsonb_build_object('id', c.id, 'label', c.label, 'icon', c.icon)
    ) filter (
      WHERE c.id IS NOT NULL
    ),
    '{}'
  )::json [] AS categories,
  coalesce(
    array_agg(
      DISTINCT jsonb_build_object(
        'id',
        pl.id,
        'url',
        pl.url,
        'type',
        jsonb_build_object(
          'id',
          lt.id,
          'label',
          lt.label,
          'icon',
          lt.icon,
          'prefix',
          lt.prefix
        )
      )
    ) filter (
      WHERE pl.id IS NOT NULL
    ),
    '{}'
  )::json [] AS links,
  coalesce(
    array_agg(
      DISTINCT jsonb_build_object(
        'id',
        pm.id,
        'url',
        pm.url,
        'media_type',
        pm.media_type
      )
    ) filter (
      WHERE pm.id IS NOT NULL
    ),
    '{}'
  )::json [] AS media
FROM unnest(posting_ids) pid
  JOIN public.postings p ON p.id = pid
  LEFT JOIN public.posting_categories pc ON pc.posting_id = p.id
  LEFT JOIN public.categories c ON c.id = pc.category_id
  LEFT JOIN public.posting_links pl ON pl.posting_id = p.id
  LEFT JOIN public.link_types lt ON lt.id = pl.link_type_id
  LEFT JOIN public.posting_media pm ON pm.posting_id = p.id
GROUP BY p.id;
$$;