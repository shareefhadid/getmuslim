create or replace function get_posting_data(posting_id bigint) returns jsonb language sql
set search_path = 'public' as $$
select jsonb_build_object(
    'id',
    p.id,
    'title',
    p.title,
    'description',
    p.description,
    'lat',
    case
      when p.location is not null then postgis.st_y(p.location::postgis.geometry)
      else null
    end,
    'long',
    case
      when p.location is not null then postgis.st_x(p.location::postgis.geometry)
      else null
    end,
    'categories',
    (
      select coalesce(
          jsonb_agg(
            jsonb_build_object('id', c.id, 'label', c.label, 'icon', c.icon)
          ),
          '[]'::jsonb
        )
      from public.categories c
        join public.posting_categories pc on pc.category_id = c.id
      where pc.posting_id = p.id
    ),
    'media',
    (
      select coalesce(
          jsonb_agg(
            jsonb_build_object(
              'id',
              pm.id,
              'url',
              pm.url,
              'media_type',
              pm.media_type,
              'is_featured',
              pm.is_featured
            )
          ),
          '[]'::jsonb
        )
      from public.posting_media pm
      where pm.posting_id = p.id
    ),
    'links',
    (
      select coalesce(
          jsonb_agg(
            jsonb_build_object(
              'id',
              pl.id,
              'url',
              pl.url,
              'link_type',
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
          ),
          '[]'::jsonb
        )
      from public.posting_links pl
        join public.link_types lt on lt.id = pl.link_type_id
      where pl.posting_id = p.id
    )
  )
from public.postings p
where p.id = posting_id;
$$;