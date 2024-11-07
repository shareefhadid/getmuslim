/*
FILTERING
- get all postings
- restrict to category
- restrict by max distance
SORTING
- sort by distance
- sort by title
- sort by rating
JOINING
- include categories as array
- include links as array
- include media as array
*/

create or replace function get_postings (
    lat float default null,
    long float default null,
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
  ) -- Select postings with a valid location first
  (
    select p.id,
      p.title,
      postgis.st_y(p.location::postgis.geometry) as lat,
      postgis.st_x(p.location::postgis.geometry) as long,
      postgis.st_distance(
        p.location::postgis.geography,
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
      ) -- Apply max distance only if lat and long are provided
      and (
        lat is null
        or long is null
        or max_distance is null
        or postgis.st_distance(
          p.location::postgis.geography,
          postgis.st_point(long, lat)::postgis.geography
        ) <= max_distance
      )
    order by case
        when lat is not null
        and long is not null then p.location OPERATOR(postgis.<->) postgis.st_point(long, lat)::postgis.geometry
      end,
      p.title
  )
union all
-- Then select postings with null locations, sorted alphabetically by title
(
  select p.id,
    p.title,
    null as lat,
    null as long,
    null as dist_meters
  from public.postings p
  where p.location is null
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
  order by p.title
);
$$;