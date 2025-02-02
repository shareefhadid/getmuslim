CREATE TYPE search_results AS (
  categories category_detail [],
  postings public.postings []
);