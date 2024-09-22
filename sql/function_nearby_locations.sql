create or replace function nearby_postings (
    lat float,
    long float,
    max_distance float default null
  ) returns table (
    id public.postings.id % type,
    name public.postings.title % type,
    lat float,
    long float,
    dist_meters float
  ) language sql
set search_path = '' as $$
select id,
  title,
  st_y(public.postings.location::postgis.geometry) as lat,
  st_x(public.postings.location::postgis.geometry) as long,
  st_distance(
    public.postings.location,
    st_point(long, lat)::postgis.geography
  ) as dist_meters
from public.postings
where location is not null
  and (
    max_distance is null
    or st_distance(location, st_point(long, lat)::geography) <= max_distance
  )
order by location <->st_point(long, lat)::postgis.geography;
$$;