export type EventType =
  | 'nunta'
  | 'botez'
  | 'cununie'
  | 'aniversare'
  | 'corporate'
  | 'private'
  | 'garden'
  | 'altul';

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';
export type AvailabilityStatus = 'available' | 'pending' | 'booked' | 'blocked';
export type GalleryCategory = 'nunti' | 'botezuri' | 'petreceri' | 'exterior' | 'lac' | 'cort' | 'sala';

export interface BookingRequest {
  full_name: string;
  phone: string;
  email: string;
  event_type: EventType;
  guests: number;
  event_date: string; // YYYY-MM-DD
  message?: string;
}

export interface Booking extends BookingRequest {
  id: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface DayStatus {
  day: string;
  status: AvailabilityStatus;
  note?: string | null;
}

export interface CalendarRange {
  start: string;
  end: string;
  days: DayStatus[];
}

export interface ContactRequest {
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface GalleryImage {
  id: number;
  title?: string | null;
  url: string;
  thumbnail_url?: string | null;
  category: GalleryCategory;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AdminStats {
  bookings: { total: number; pending: number; confirmed: number; upcoming_30d: number };
  messages: { total: number; unread: number };
  gallery: { total: number; published: number };
}
