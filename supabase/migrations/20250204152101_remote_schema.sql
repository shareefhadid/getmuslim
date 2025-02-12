SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";
CREATE SCHEMA IF NOT EXISTS "postgis";
ALTER SCHEMA "postgis" OWNER TO "postgres";
COMMENT ON SCHEMA "public" IS 'standard public schema';
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "postgis";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE TYPE "public"."category_detail" AS (
	"id" bigint,
	"label" "text",
	"icon" "text"
);
ALTER TYPE "public"."category_detail" OWNER TO "postgres";
CREATE TYPE "public"."link_type_detail" AS (
	"id" bigint,
	"label" "text",
	"icon" "text",
	"prefix" "text"
);
ALTER TYPE "public"."link_type_detail" OWNER TO "postgres";
CREATE TYPE "public"."link_detail" AS (
	"id" bigint,
	"url" "text",
	"type" "public"."link_type_detail"
);
ALTER TYPE "public"."link_detail" OWNER TO "postgres";
CREATE TYPE "public"."media_type_enum" AS ENUM (
    'image',
    'video'
);
ALTER TYPE "public"."media_type_enum" OWNER TO "postgres";
CREATE TYPE "public"."media_detail" AS (
	"id" bigint,
	"url" "text",
	"media_type" "public"."media_type_enum"
);
ALTER TYPE "public"."media_detail" OWNER TO "postgres";
CREATE TYPE "public"."posting_status" AS ENUM (
    'active',
    'inactive',
    'deleted'
);
ALTER TYPE "public"."posting_status" OWNER TO "postgres";
CREATE TYPE "public"."posting_details" AS (
	"id" bigint,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"title" "text",
	"description" "text",
	"address" "text",
	"featured_image" "text",
	"distance" bigint,
	"status" "public"."posting_status",
	"categories" "public"."category_detail"[],
	"links" "public"."link_detail"[],
	"media" "public"."media_detail"[]
);
ALTER TYPE "public"."posting_details" OWNER TO "postgres";
CREATE TYPE "public"."paginated_postings" AS (
	"rows" "public"."posting_details"[],
	"count" bigint
);
ALTER TYPE "public"."paginated_postings" OWNER TO "postgres";
SET default_tablespace = '';
SET default_table_access_method = "heap";
CREATE TABLE IF NOT EXISTS "public"."postings" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "location" "postgis"."geography" NOT NULL,
    "show_address" boolean DEFAULT false NOT NULL,
    "address" "text" NOT NULL,
    "featured_image" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "status" "public"."posting_status" DEFAULT 'inactive'::"public"."posting_status" NOT NULL,
    "search_text" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", (((("title" || ' '::"text") || "description") || ' '::"text") || "address"))) STORED,
    CONSTRAINT "postings_description_check" CHECK (("length"("description") < 500)),
    CONSTRAINT "postings_title_check" CHECK (("length"("title") < 100))
);
ALTER TABLE "public"."postings" OWNER TO "postgres";
CREATE TYPE "public"."search_results" AS (
	"categories" "public"."category_detail"[],
	"postings" "public"."postings"[]
);
ALTER TYPE "public"."search_results" OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."get_nearby_postings"("lat" double precision, "long" double precision, "max_distance" bigint DEFAULT 100000, "category" bigint DEFAULT NULL::bigint, "limit_count" integer DEFAULT 10, "offset_count" integer DEFAULT 0) RETURNS "public"."paginated_postings"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, postgis'
    AS $$
DECLARE result public.paginated_postings;
BEGIN WITH base_postings AS (
  SELECT p.id,
    p.created_at,
    p.updated_at,
    p.title,
    p.description,
    p.address,
    p.featured_image,
    p.status,
    postgis.ST_Distance(p.location, POINT(long, lat)::postgis.geometry)::bigint AS distance
  FROM public.postings p
  WHERE postgis.ST_DWithin(
      p.location,
      POINT(long, lat)::postgis.geometry,
      max_distance
    )
    AND p.status = 'active'
),
filtered_postings AS (
  SELECT DISTINCT bp.*
  FROM base_postings bp
    LEFT JOIN public.posting_categories pc ON pc.posting_id = bp.id
  WHERE category IS NULL
    OR pc.category_id = category
),
paginated_postings AS (
  SELECT *
  FROM filtered_postings
  ORDER BY distance ASC
  LIMIT limit_count OFFSET offset_count
),
posting_details AS (
  SELECT *
  FROM public.get_posting_details(
      (
        SELECT array_agg(paginated_postings.id)
        FROM paginated_postings
      )
    )
),
final_results AS (
  SELECT fp.id,
    fp.created_at,
    fp.updated_at,
    fp.title,
    fp.description,
    fp.address,
    fp.featured_image,
    fp.distance,
    fp.status,
    pd.categories,
    pd.links,
    pd.media
  FROM paginated_postings fp
    LEFT JOIN posting_details pd ON pd.posting_id = fp.id
  ORDER BY fp.distance ASC
)
SELECT array_agg((final_results.*)::public.posting_details),
  (
    SELECT COUNT(*)
    FROM filtered_postings
  ) INTO result.rows,
  result.count
FROM final_results;
RETURN result;
END;
$$;
ALTER FUNCTION "public"."get_nearby_postings"("lat" double precision, "long" double precision, "max_distance" bigint, "category" bigint, "limit_count" integer, "offset_count" integer) OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."get_posting"("posting_id" bigint, "lat" double precision DEFAULT NULL::double precision, "long" double precision DEFAULT NULL::double precision) RETURNS TABLE("id" bigint, "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "title" "text", "description" "text", "address" "text", "featured_image" "text", "distance" bigint, "status" "public"."posting_status", "categories" "public"."category_detail"[], "links" "public"."link_detail"[], "media" "public"."media_detail"[])
    LANGUAGE "sql"
    SET "search_path" TO 'public, postgis'
    AS $$ WITH base_posting AS (
        SELECT p.id,
            p.created_at,
            p.updated_at,
            p.title,
            p.description,
            p.address,
            p.featured_image,
            p.status,
            CASE
                WHEN lat IS NOT NULL
                AND long IS NOT NULL THEN postgis.ST_Distance(p.location, POINT(long, lat)::postgis.geometry)::bigint
                ELSE NULL
            END AS distance
        FROM public.postings p
        WHERE p.id = posting_id
            AND p.status = 'active'
    )
SELECT bp.id,
    bp.created_at,
    bp.updated_at,
    bp.title,
    bp.description,
    bp.address,
    bp.featured_image,
    bp.distance,
    bp.status,
    pd.categories,
    pd.links,
    pd.media
FROM base_posting bp
    LEFT JOIN public.get_posting_details(ARRAY [posting_id]) pd ON pd.posting_id = bp.id;
$$;
ALTER FUNCTION "public"."get_posting"("posting_id" bigint, "lat" double precision, "long" double precision) OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."get_posting_data"("posting_id" bigint) RETURNS TABLE("id" bigint, "title" "text", "description" "text", "lat" double precision, "long" double precision, "categories" "public"."category_detail"[], "media" "public"."media_detail"[], "links" "public"."link_detail"[])
    LANGUAGE "sql"
    SET "search_path" TO 'public'
    AS $$
SELECT p.id,
  p.title,
  p.description,
  CASE
    WHEN p.location IS NOT NULL THEN postgis.ST_Y(p.location::postgis.geometry)
    ELSE NULL
  END,
  CASE
    WHEN p.location IS NOT NULL THEN postgis.ST_X(p.location::postgis.geometry)
    ELSE NULL
  END,
  pd.categories,
  pd.media,
  pd.links
FROM public.postings p
  LEFT JOIN get_posting_details(ARRAY [posting_id]) pd ON pd.posting_id = p.id
WHERE p.id = posting_id;
$$;
ALTER FUNCTION "public"."get_posting_data"("posting_id" bigint) OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."get_posting_details"("posting_ids" bigint[]) RETURNS TABLE("posting_id" bigint, "categories" "public"."category_detail"[], "links" "public"."link_detail"[], "media" "public"."media_detail"[])
    LANGUAGE "sql"
    SET "search_path" TO 'public'
    AS $$ WITH categories_agg AS (
        SELECT p.id AS posting_id,
            COALESCE(
                ARRAY_AGG(
                    (c.id, c.label, c.icon)::category_detail
                ) FILTER (
                    WHERE c.id IS NOT NULL
                ),
                ARRAY []::category_detail []
            ) AS categories
        FROM unnest(posting_ids) pid
            JOIN public.postings p ON p.id = pid
            LEFT JOIN public.posting_categories pc ON pc.posting_id = p.id
            LEFT JOIN public.categories c ON c.id = pc.category_id
        GROUP BY p.id
    ),
    links_agg AS (
        SELECT p.id AS posting_id,
            COALESCE(
                ARRAY_AGG(
                    (
                        pl.id,
                        pl.url,
                        (lt.id, lt.label, lt.icon, lt.prefix)::link_type_detail
                    )::link_detail
                ) FILTER (
                    WHERE pl.id IS NOT NULL
                ),
                ARRAY []::link_detail []
            ) AS links
        FROM unnest(posting_ids) pid
            JOIN public.postings p ON p.id = pid
            LEFT JOIN public.posting_links pl ON pl.posting_id = p.id
            LEFT JOIN public.link_types lt ON lt.id = pl.link_type_id
        GROUP BY p.id
    ),
    media_agg AS (
        SELECT p.id AS posting_id,
            COALESCE(
                ARRAY_AGG(
                    (pm.id, pm.url, pm.media_type)::media_detail
                ) FILTER (
                    WHERE pm.id IS NOT NULL
                ),
                ARRAY []::media_detail []
            ) AS media
        FROM unnest(posting_ids) pid
            JOIN public.postings p ON p.id = pid
            LEFT JOIN public.posting_media pm ON pm.posting_id = p.id
        GROUP BY p.id
    )
SELECT p.id AS posting_id,
    c.categories,
    l.links,
    m.media
FROM unnest(posting_ids) pid
    JOIN public.postings p ON p.id = pid
    LEFT JOIN categories_agg c ON c.posting_id = p.id
    LEFT JOIN links_agg l ON l.posting_id = p.id
    LEFT JOIN media_agg m ON m.posting_id = p.id;
$$;
ALTER FUNCTION "public"."get_posting_details"("posting_ids" bigint[]) OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."get_recent_postings"("lat" double precision DEFAULT NULL::double precision, "long" double precision DEFAULT NULL::double precision, "category" bigint DEFAULT NULL::bigint, "limit_count" integer DEFAULT 10, "offset_count" integer DEFAULT 0) RETURNS "public"."paginated_postings"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, postgis'
    AS $$
DECLARE result public.paginated_postings;
BEGIN WITH base_postings AS (
  SELECT p.id,
    p.created_at,
    p.updated_at,
    p.title,
    p.description,
    p.address,
    p.featured_image,
    p.status,
    p.location
  FROM public.postings p
  WHERE p.status = 'active'
),
filtered_postings AS (
  SELECT DISTINCT bp.*
  FROM base_postings bp
    LEFT JOIN public.posting_categories pc ON pc.posting_id = bp.id
  WHERE category IS NULL
    OR pc.category_id = category
),
paginated_postings AS (
  SELECT fp.*
  FROM filtered_postings fp
  ORDER BY fp.updated_at DESC NULLS LAST
  LIMIT limit_count OFFSET offset_count
),
postings_with_distance AS (
  SELECT pp.*,
    CASE
      WHEN lat IS NOT NULL
      AND long IS NOT NULL THEN postgis.ST_Distance(pp.location, POINT(long, lat)::postgis.geometry)::bigint
      ELSE NULL
    END AS distance
  FROM paginated_postings pp
),
posting_details AS (
  SELECT *
  FROM public.get_posting_details(
      (
        SELECT array_agg(id)
        FROM paginated_postings
      )
    )
),
final_results AS (
  SELECT pp.id,
    pp.created_at,
    pp.updated_at,
    pp.title,
    pp.description,
    pp.address,
    pp.featured_image,
    pp.distance,
    pp.status,
    pd.categories,
    pd.links,
    pd.media
  FROM postings_with_distance pp
    LEFT JOIN posting_details pd ON pd.posting_id = pp.id
)
SELECT array_agg(
    (final_results.*)::public.posting_details
    ORDER BY updated_at DESC NULLS LAST
  ),
  (
    SELECT COUNT(*)
    FROM filtered_postings
  ) INTO result.rows,
  result.count
FROM final_results;
RETURN result;
END;
$$;
ALTER FUNCTION "public"."get_recent_postings"("lat" double precision, "long" double precision, "category" bigint, "limit_count" integer, "offset_count" integer) OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."search_content"("search_query" "text") RETURNS "public"."search_results"
    LANGUAGE "sql"
    SET "search_path" TO 'public, postgis'
    AS $$ WITH processed_query AS (
    SELECT string_agg(word || ':*', ' | ') AS query
    FROM unnest(string_to_array(trim(search_query), ' ')) AS word
  ),
  matching_categories AS (
    SELECT ARRAY_AGG(
        ROW(c.id, c.label, c.icon)::public.category_detail
      ) AS categories
    FROM public.categories c
    WHERE c.search_text @@ to_tsquery(
        'english',
        (
          SELECT query
          FROM processed_query
        )
      )
    LIMIT 5
  ), matching_postings AS (
    SELECT ARRAY_AGG(
        ROW(
          p.id,
          p.created_at,
          p.title,
          p.description,
          p.location,
          p.show_address,
          p.address,
          p.featured_image,
          p.updated_at,
          p.status,
          NULL::tsvector
        )::public.postings
      ) AS postings
    FROM public.postings p
    WHERE p.status = 'active'
      AND p.search_text @@ to_tsquery(
        'english',
        (
          SELECT query
          FROM processed_query
        )
      )
    LIMIT 5
  )
SELECT COALESCE(
    (
      SELECT categories
      FROM matching_categories
    ),
    ARRAY []::public.category_detail []
  ) AS categories,
  COALESCE(
    (
      SELECT postings
      FROM matching_postings
    ),
    ARRAY []::public.postings []
  ) AS postings;
$$;
ALTER FUNCTION "public"."search_content"("search_query" "text") OWNER TO "postgres";
CREATE OR REPLACE FUNCTION "public"."update_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
    new.updated_at = CURRENT_TIMESTAMP;
    return new;
end;
$$;
ALTER FUNCTION "public"."update_timestamp"() OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "label" "text" NOT NULL,
    "icon" "text",
    "search_text" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", "label")) STORED
);
ALTER TABLE "public"."categories" OWNER TO "postgres";
ALTER TABLE "public"."categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
CREATE TABLE IF NOT EXISTS "public"."link_types" (
    "id" bigint NOT NULL,
    "label" "text" NOT NULL,
    "icon" "text",
    "prefix" "text"
);
ALTER TABLE "public"."link_types" OWNER TO "postgres";
ALTER TABLE "public"."link_types" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."link_types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
CREATE TABLE IF NOT EXISTS "public"."posting_categories" (
    "id" bigint NOT NULL,
    "posting_id" bigint NOT NULL,
    "category_id" bigint NOT NULL
);
ALTER TABLE "public"."posting_categories" OWNER TO "postgres";
ALTER TABLE "public"."posting_categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."posting_categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
CREATE TABLE IF NOT EXISTS "public"."posting_links" (
    "id" bigint NOT NULL,
    "url" "text" NOT NULL,
    "link_type_id" bigint NOT NULL,
    "posting_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."posting_links" OWNER TO "postgres";
ALTER TABLE "public"."posting_links" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."posting_links_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
CREATE TABLE IF NOT EXISTS "public"."posting_media" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "posting_id" bigint NOT NULL,
    "media_type" "public"."media_type_enum" DEFAULT 'image'::"public"."media_type_enum" NOT NULL,
    "url" "text" NOT NULL
);
ALTER TABLE "public"."posting_media" OWNER TO "postgres";
ALTER TABLE "public"."posting_media" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."posting_media_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
ALTER TABLE "public"."postings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."postings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."link_types"
    ADD CONSTRAINT "link_types_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."posting_categories"
    ADD CONSTRAINT "posting_categories_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."posting_categories"
    ADD CONSTRAINT "posting_categories_posting_id_category_id" UNIQUE ("posting_id", "category_id");
ALTER TABLE ONLY "public"."posting_links"
    ADD CONSTRAINT "posting_links_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."posting_links"
    ADD CONSTRAINT "posting_links_posting_type_unique" UNIQUE ("posting_id", "link_type_id");
ALTER TABLE ONLY "public"."posting_media"
    ADD CONSTRAINT "posting_media_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."postings"
    ADD CONSTRAINT "postings_pkey" PRIMARY KEY ("id");
CREATE INDEX "categories_search_idx" ON "public"."categories" USING "gin" ("search_text");
CREATE INDEX "posting_categories_category_id_index" ON "public"."posting_categories" USING "btree" ("category_id");
CREATE INDEX "posting_categories_posting_category_index" ON "public"."posting_categories" USING "btree" ("posting_id", "category_id");
CREATE INDEX "postings_geo_index" ON "public"."postings" USING "gist" ("location");
CREATE INDEX "postings_search_idx" ON "public"."postings" USING "gin" ("search_text");
CREATE INDEX "postings_status_index" ON "public"."postings" USING "btree" ("status");
CREATE OR REPLACE TRIGGER "update_timestamp" BEFORE UPDATE ON "public"."postings" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();
ALTER TABLE ONLY "public"."posting_categories"
    ADD CONSTRAINT "posting_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."posting_categories"
    ADD CONSTRAINT "posting_categories_posting_id_fkey" FOREIGN KEY ("posting_id") REFERENCES "public"."postings"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."posting_links"
    ADD CONSTRAINT "posting_links_link_type_id_fkey" FOREIGN KEY ("link_type_id") REFERENCES "public"."link_types"("id");
ALTER TABLE ONLY "public"."posting_links"
    ADD CONSTRAINT "posting_links_posting_id_fkey" FOREIGN KEY ("posting_id") REFERENCES "public"."postings"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."posting_media"
    ADD CONSTRAINT "posting_media_posting_id_fkey" FOREIGN KEY ("posting_id") REFERENCES "public"."postings"("id") ON DELETE CASCADE;
CREATE POLICY "Enable read access for all users" ON "public"."categories" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."link_types" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."posting_categories" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."posting_links" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."posting_media" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."postings" FOR SELECT USING (true);
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."link_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."posting_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."posting_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."posting_media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."postings" ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";
GRANT USAGE ON SCHEMA "postgis" TO PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT ALL ON TABLE "public"."postings" TO "anon";
GRANT ALL ON TABLE "public"."postings" TO "authenticated";
GRANT ALL ON TABLE "public"."postings" TO "service_role";
GRANT ALL ON FUNCTION "public"."get_nearby_postings"("lat" double precision, "long" double precision, "max_distance" bigint, "category" bigint, "limit_count" integer, "offset_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_nearby_postings"("lat" double precision, "long" double precision, "max_distance" bigint, "category" bigint, "limit_count" integer, "offset_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_nearby_postings"("lat" double precision, "long" double precision, "max_distance" bigint, "category" bigint, "limit_count" integer, "offset_count" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."get_posting"("posting_id" bigint, "lat" double precision, "long" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."get_posting"("posting_id" bigint, "lat" double precision, "long" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_posting"("posting_id" bigint, "lat" double precision, "long" double precision) TO "service_role";
GRANT ALL ON FUNCTION "public"."get_posting_data"("posting_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_posting_data"("posting_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_posting_data"("posting_id" bigint) TO "service_role";
GRANT ALL ON FUNCTION "public"."get_posting_details"("posting_ids" bigint[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_posting_details"("posting_ids" bigint[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_posting_details"("posting_ids" bigint[]) TO "service_role";
GRANT ALL ON FUNCTION "public"."get_recent_postings"("lat" double precision, "long" double precision, "category" bigint, "limit_count" integer, "offset_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_recent_postings"("lat" double precision, "long" double precision, "category" bigint, "limit_count" integer, "offset_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recent_postings"("lat" double precision, "long" double precision, "category" bigint, "limit_count" integer, "offset_count" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."search_content"("search_query" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_content"("search_query" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_content"("search_query" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "service_role";
GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";
GRANT ALL ON TABLE "public"."link_types" TO "anon";
GRANT ALL ON TABLE "public"."link_types" TO "authenticated";
GRANT ALL ON TABLE "public"."link_types" TO "service_role";
GRANT ALL ON SEQUENCE "public"."link_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."link_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."link_types_id_seq" TO "service_role";
GRANT ALL ON TABLE "public"."posting_categories" TO "anon";
GRANT ALL ON TABLE "public"."posting_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."posting_categories" TO "service_role";
GRANT ALL ON SEQUENCE "public"."posting_categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posting_categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posting_categories_id_seq" TO "service_role";
GRANT ALL ON TABLE "public"."posting_links" TO "anon";
GRANT ALL ON TABLE "public"."posting_links" TO "authenticated";
GRANT ALL ON TABLE "public"."posting_links" TO "service_role";
GRANT ALL ON SEQUENCE "public"."posting_links_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posting_links_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posting_links_id_seq" TO "service_role";
GRANT ALL ON TABLE "public"."posting_media" TO "anon";
GRANT ALL ON TABLE "public"."posting_media" TO "authenticated";
GRANT ALL ON TABLE "public"."posting_media" TO "service_role";
GRANT ALL ON SEQUENCE "public"."posting_media_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posting_media_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posting_media_id_seq" TO "service_role";
GRANT ALL ON SEQUENCE "public"."postings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."postings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."postings_id_seq" TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";
RESET ALL;
