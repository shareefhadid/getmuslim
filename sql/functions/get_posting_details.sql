create or replace function get_posting_details(posting_ids bigint []) returns table (
    posting_id bigint,
    categories json [],
    links json [],
    media json []
  ) language sql
set search_path = 'public' as $$
select p.id as posting_id,
  coalesce(
    array_agg(
      distinct jsonb_build_object('id', c.id, 'label', c.label, 'icon', c.icon)
    ) filter (
      where c.id is not null
    ),
    '{}'
  )::json [] as categories,
  coalesce(
    array_agg(
      distinct jsonb_build_object(
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
      where pl.id is not null
    ),
    '{}'
  )::json [] as links,
  coalesce(
    array_agg(
      distinct jsonb_build_object(
        'id',
        pm.id,
        'url',
        pm.url,
        'media_type',
        pm.media_type
      )
    ) filter (
      where pm.id is not null
    ),
    '{}'
  )::json [] as media
from unnest(posting_ids) pid
  join public.postings p on p.id = pid
  left join public.posting_categories pc on pc.posting_id = p.id
  left join public.categories c on c.id = pc.category_id
  left join public.posting_links pl on pl.posting_id = p.id
  left join public.link_types lt on lt.id = pl.link_type_id
  left join public.posting_media pm on pm.posting_id = p.id
group by p.id;
$$;