CREATE OR REPLACE FUNCTION public.insert_posting(
    title text,
    description text,
    lat double precision,
    long double precision,
    address text,
    category_ids bigint [] DEFAULT NULL,
    featured_image text DEFAULT NULL,
    website text DEFAULT NULL,
    email text DEFAULT NULL,
    phone text DEFAULT NULL,
    google_maps text DEFAULT NULL,
    show_address boolean DEFAULT false,
    status public.posting_status DEFAULT 'inactive'
  ) RETURNS bigint LANGUAGE plpgsql SECURITY INVOKER
SET search_path = 'public' AS $$
DECLARE new_posting_id bigint;
BEGIN -- Validate category IDs exist
IF category_ids IS NOT NULL
AND NOT EXISTS (
  SELECT 1
  FROM public.categories
  WHERE id = ANY(category_ids)
  HAVING COUNT(*) = array_length(category_ids, 1)
) THEN RAISE EXCEPTION 'One or more category IDs do not exist';
END IF;
-- Create posting
INSERT INTO public.postings (
    title,
    description,
    location,
    address,
    featured_image,
    website,
    email,
    phone,
    google_maps,
    show_address,
    status
  )
VALUES (
    title,
    description,
    POINT(long, lat)::postgis.geometry,
    address,
    featured_image,
    website,
    email,
    phone,
    google_maps,
    show_address,
    status
  )
RETURNING id INTO new_posting_id;
-- Link categories if provided
IF category_ids IS NOT NULL
AND array_length(category_ids, 1) > 0 THEN
INSERT INTO public.posting_categories (posting_id, category_id)
SELECT new_posting_id,
  unnest(category_ids);
END IF;
RETURN new_posting_id;
END;
$$;
-- Grant permissions
GRANT EXECUTE ON FUNCTION public.insert_posting(
    text,
    text,
    double precision,
    double precision,
    text,
    bigint [],
    text,
    text,
    text,
    text,
    text,
    boolean,
    public.posting_status
  ) TO authenticated,
  service_role;