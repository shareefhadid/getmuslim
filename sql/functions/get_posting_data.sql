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
      select categories
      from get_posting_details(ARRAY [posting_id])
    ),
    'media',
    (
      select media
      from get_posting_details(ARRAY [posting_id])
    ),
    'links',
    (
      select links
      from get_posting_details(ARRAY [posting_id])
    )
  )
from public.postings p
where p.id = posting_id;
$$;