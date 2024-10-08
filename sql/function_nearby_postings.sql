create or replace function nearby_postings (
    lat float,
    long float,
    max_distance float default null
  ) returns table (
    id postings.id % type,
    title postings.title % type,
    lat float,
    long float,
    dist_meters float
  ) language sql
set search_path = 'public, postgis' as $$
select id,
  title,
  postgis.st_y(location::postgis.geometry) as lat,
  postgis.st_x(location::postgis.geometry) as long,
  postgis.st_distance(
    location,
    postgis.st_point(long, lat)::postgis.geography
  ) as dist_meters
from public.postings
where location is not null
  and (
    max_distance is null
    or postgis.st_distance(
      location,
      postgis.st_point(long, lat)::postgis.geography
    ) <= max_distance
  )
order by location OPERATOR(postgis.<->) postgis.st_point(long, lat)::postgis.geometry;
$$;