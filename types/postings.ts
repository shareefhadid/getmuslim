import type { Database } from "./database.types.js";

// Base types from Supabase
type DbPostingDetails = Database["public"]["CompositeTypes"]["posting_details"];
type DbCategoryDetail = Database["public"]["CompositeTypes"]["category_detail"];
type DbLinkTypeDetail =
  Database["public"]["CompositeTypes"]["link_type_detail"];
type DbLinkDetail = Database["public"]["CompositeTypes"]["link_detail"];
type DbMediaDetail = Database["public"]["CompositeTypes"]["media_detail"];

// Non-nullable versions
export type CategoryDetail = Omit<DbCategoryDetail, "id" | "label"> & {
  id: number;
  label: string;
  // icon remains nullable
};

export type LinkTypeDetail = Omit<
  DbLinkTypeDetail,
  "id" | "label" | "prefix"
> & {
  id: number;
  label: string;
  prefix: string;
  // icon remains nullable
};

export type LinkDetail = Omit<DbLinkDetail, "id" | "url" | "type"> & {
  id: number;
  url: string;
  type: LinkTypeDetail;
};

export type MediaDetail = Omit<DbMediaDetail, "id" | "url" | "media_type"> & {
  id: number;
  url: string;
  media_type: Database["public"]["Enums"]["media_type_enum"];
};

export type PostingDetails = Omit<
  DbPostingDetails,
  | "id"
  | "created_at"
  | "updated_at"
  | "title"
  | "description"
  | "categories"
  | "links"
  | "media"
  | "show_address"
> & {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  categories: Array<CategoryDetail>;
  links: Array<LinkDetail>;
  media: Array<MediaDetail>;
  show_address: boolean;
  email?: string;
  website?: string;
  phone?: string;
  google_maps?: string;
};
