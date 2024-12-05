create or replace function get_nearby_postings (
    lat float default null,
    long float default null,
    max_distance float default null
) returns table (id bigint, dist_meters float) language sql
set search_path = 'public, postgis' as $$
select id,
  case
    when lat is null or long is null then null -- Return null for dist_meters if lat or long is null
    when location is not null then postgis.st_distance(
      location,
      postgis.st_point(long, lat)::postgis.geography
    )
    else null
  end as dist_meters
from public.postings
where (lat is null or long is null or location is not null) -- Include all postings if lat/long is null
  and (
    max_distance is null
    or postgis.st_distance(
      location,
      postgis.st_point(long, lat)::postgis.geography
    ) <= max_distance
  )
order by case
    when location is not null then 0
    else 1
  end,
  -- Postings without a location go last
  location OPERATOR(postgis.<->) postgis.st_point(long, lat)::postgis.geometry;
-- Sort by proximity
$$;