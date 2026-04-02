// ============================================================
// Guest Invitation Types
// ============================================================

export interface Venue {
  id: string;
  name: string;          // Tên địa điểm: "Tư Gia"
  address: string;       // Địa chỉ đầy đủ
  mapUrl: string;        // Google Maps direction URL
  videoUrl?: string;     // Video dẫn đường (URL)
  showVideo: boolean;    // Bật/tắt phần video dẫn đường
  createdAt: string;
}

export interface GuestEvent {
  date?: string;          // ISO date — ghi đè WEDDING.date
  displayDate?: string;   // ghi đè WEDDING.displayDateFull
  receptionTime?: string; // giờ đón khách, ghi đè WEDDING.time.reception
  time?: string;          // giờ khai tiệc, ghi đè WEDDING.time.ceremony
  // Venue fields — tự điền từ venueId, giữ fallback cho backward compat
  venueName?: string;
  venueAddress?: string;
  venueMapUrl?: string;
  videoUrl?: string;
  showVideo?: boolean;
}

export interface InvitationTemplate {
  id: string;
  text: string;           // "đến dự Lễ Thành Hôn của chúng tôi"
  createdAt: string;
}

export interface Guest {
  id: string;
  hostName: string;
  hostSide: "groom" | "bride";
  guestName: string;
  guestTitle: string;
  invitationText?: string;
  venueId?: string;        // Reference đến Venue config
  event?: GuestEvent | null;
  createdAt: string;
}
