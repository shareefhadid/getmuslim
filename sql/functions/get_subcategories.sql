create or replace function get_subcategories (category_id bigint) returns table (id bigint) language sql
set search_path = 'public' as $$ with recursive category_tree as (
    -- Start with the provided category
    select id
    from public.categories
    where id = category_id
    union all
    -- Recursively find child categories
    select c.id
    from public.categories c
      join category_tree ct on c.parent_id = ct.id
  )
select id
from category_tree;
$$;