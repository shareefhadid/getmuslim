create or replace function nearby_postings_by_category (
    lat float,
    long float,
    max_distance float default null,
    category_id bigint default null
  ) returns table (
    id postings.id % type,
    title postings.title % type,
    lat float,
    long float,
    dist_meters float
  ) language sql
set search_path = 'public, postgis' as $$ with recursive descendant_categories as (
    select id
    from public.categories
    where id = category_id
    union all
    select c.id
    from public.categories c
      join descendant_categories dc on dc.id = c.parent_id
  )
select p.id,
  p.title,
  postgis.st_y(p.location::postgis.geometry) as lat,
  postgis.st_x(p.location::postgis.geometry) as long,
  postgis.st_distance(
    p.location,
    postgis.st_point(long, lat)::postgis.geography
  ) as dist_meters
from public.postings p
where p.location is not null
  and (
    category_id is null
    or p.id in (
      select pc.posting_id
      from public.posting_categories pc
      where pc.category_id in (
          select id
          from descendant_categories
        )
    )
  )
  and (
    max_distance is null
    or postgis.st_distance(
      p.location,
      postgis.st_point(long, lat)::postgis.geography
    ) <= max_distance
  )
order by p.location OPERATOR(postgis.<->) postgis.st_point(long, lat)::postgis.geometry;
$$;