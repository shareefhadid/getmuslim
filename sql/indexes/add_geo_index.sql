CREATE INDEX postings_geo_index ON public.postings USING GIST (location);