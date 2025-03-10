CREATE TABLE public.postings (
  id bigint generated by DEFAULT AS identity NOT NULL,
  created_at timestamp WITH time zone NOT NULL DEFAULT NOW(),
  title text NOT NULL,
  description text NOT NULL,
  location geography NOT NULL,
  show_address boolean NOT NULL DEFAULT false,
  address text NOT NULL,
  featured_image text NULL,
  updated_at timestamp WITH time zone NULL DEFAULT NOW(),
  STATUS public.posting_status NOT NULL DEFAULT 'inactive'::posting_status,
  CONSTRAINT postings_pkey PRIMARY KEY (id),
  CONSTRAINT postings_description_check CHECK ((length(description) < 500)),
  CONSTRAINT postings_title_check CHECK ((length(title) < 100))
) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS postings_geo_index ON public.postings USING gist (location) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS postings_status_index ON public.postings USING btree (STATUS) TABLESPACE pg_default;
CREATE TRIGGER update_timestamp BEFORE
UPDATE ON postings FOR EACH ROW EXECUTE FUNCTION update_timestamp ();