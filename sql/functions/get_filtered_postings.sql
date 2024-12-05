create or replace function get_filtered_postings(
    lat float default null,
    long float default null,
    max_distance float default null,
    category_id bigint default null,
    page int default 1,
    page_size int default 10
  ) returns table (
    id bigint,
    data jsonb,
    dist_meters float
  ) language plpgsql
set search_path = 'public, postgis' as $$
declare subcategories bigint [];
-- Array to store category filtering
begin -- Get all relevant subcategories if a category_id is provided
if category_id is not null then
select array_agg(id) into subcategories
from get_subcategories(category_id);
end if;
-- Main query: Filter postings by category and location, sort by distance, and paginate
return query
select p.id,
  get_posting_data(p.id) as data,
  n.dist_meters
from (
    -- Step 1: Filter postings by location (if lat/long provided)
    select *
    from get_nearby_postings(lat, long, max_distance)
  ) n
  join public.postings p on p.id = n.id
where (
    -- Step 2: Filter by categories (if provided)
    subcategories is null
    or exists (
      select 1
      from public.posting_categories pc
      where pc.posting_id = p.id
        and pc.category_id = any(subcategories)
    )
  )
order by case
    when n.dist_meters is null then 1
    else 0
  end,
  -- Postings without location go last
  n.dist_meters -- Sort by distance if applicable
  offset (page - 1) * page_size
limit page_size;
end;
$$;