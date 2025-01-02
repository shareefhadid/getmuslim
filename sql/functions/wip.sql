create or replace function get_nearby_postings (
    lat double precision,
    long double precision,
    max_distance bigint default 100000,
    category bigint default null
  ) returns table (
    id bigint,
    created_at timestamp with time zone,
    title text,
    description text,
    address text,
    featured_image text,
    distance bigint
  ) language plpgsql
set search_path = 'public, postgis' as $$ BEGIN return query
select p.id,
  p.created_at,
  p.title,
  p.description,
  p.address,
  p.featured_image,
  postgis.ST_Distance(p.location, POINT(lat, long)::postgis.geometry)::bigint as distance
from public.postings p
  left join public.posting_categories pc on pc.posting_id = p.id
where postgis.ST_DWithin (
    p.location,
    POINT(lat, long)::postgis.geometry,
    max_distance
  )
  AND category is null
  OR pc.category_id = category
order by distance desc;
END;
$$ 
-- select * from get_nearby_postings(-79.446827, 44.010638, 1000)
-- drop function get_nearby_postings;