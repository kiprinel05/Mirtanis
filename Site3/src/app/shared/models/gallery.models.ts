/** TypeScript mirrors of the FastAPI schemas. */

export type EventStatus = 'draft' | 'published' | 'expired';

export interface AdminProfile {
  id: string;
  email: string;
  display_name: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  admin_email: string;
}

export interface EventAdminOut {
  id: string;
  slug: string;
  title: string;
  client_name: string | null;
  description: string | null;
  event_date: string | null;
  expires_at: string | null;
  status: EventStatus;
  cover_image_key: string | null;
  allow_download: boolean;
  allow_favorites: boolean;
  created_at: string;
  updated_at: string;
  image_count: number;
  has_password: boolean;
  is_expired: boolean;
}

export interface EventListOut {
  items: EventAdminOut[];
  total: number;
}

export interface EventCreatePayload {
  title: string;
  client_name?: string | null;
  description?: string | null;
  event_date?: string | null;
  expires_at?: string | null;
  allow_download?: boolean;
  allow_favorites?: boolean;
  access_password?: string | null;
}

export interface EventUpdatePayload {
  title?: string;
  client_name?: string | null;
  description?: string | null;
  event_date?: string | null;
  expires_at?: string | null;
  status?: EventStatus;
  allow_download?: boolean;
  allow_favorites?: boolean;
  access_password?: string | null;
  clear_access_password?: boolean;
}

export interface ImageAdminOut {
  id: string;
  event_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  original_key: string;
  thumb_key: string | null;
  sort_order: number;
  created_at: string;
  preview_url: string | null;
  thumb_url: string | null;
}

export interface BulkUploadResult {
  uploaded: ImageAdminOut[];
  failed: string[];
}

/** Public gallery payloads */

export interface PublicEventOut {
  slug: string;
  title: string;
  client_name: string | null;
  description: string | null;
  event_date: string | null;
  cover_url: string | null;
  allow_download: boolean;
  allow_favorites: boolean;
  image_count: number;
  requires_password: boolean;
}

export interface GalleryImageOut {
  id: string;
  filename: string;
  width: number | null;
  height: number | null;
  size_bytes: number;
  preview_url: string;
  thumb_url: string;
  download_url: string | null;
}

export interface GalleryUnlockResponse {
  access_token: string;
  expires_in: number;
}
