"use client";

import { useState, useEffect, useCallback } from "react";
import type { Guest, GuestEvent, Venue, InvitationTemplate } from "@/lib/types";
import AdminSelect from "@/components/AdminSelect";
import { WEDDING } from "@/lib/constants";
import {
  Plus,
  Trash2,
  Copy,
  Check,
  Edit3,
  X,
  ChevronDown,
  ChevronUp,
  Users,
  Link as LinkIcon,
  Search,
  MapPin,
  Video,
  Eye,
  EyeOff,
  MessageSquare,
  Type,
} from "lucide-react";

/* ═══════════════════ Helpers ═══════════════════ */

function generateInviteUrl(id: string) {
  if (typeof window === "undefined") return `/?invite=${id}`;
  return `${window.location.origin}/?invite=${id}`;
}

/* ═══════════════════ Venue Form ═══════════════════ */

interface VenueFormProps {
  initialData?: Venue | null;
  onSubmit: (data: Omit<Venue, "id" | "createdAt">) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

function VenueForm({ initialData, onSubmit, onCancel, isSubmitting }: VenueFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [mapUrl, setMapUrl] = useState(initialData?.mapUrl || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [showVideo, setShowVideo] = useState(initialData?.showVideo ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, address, mapUrl, videoUrl, showVideo });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Tên địa điểm *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Tư Gia"
            required
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Địa chỉ *</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="VD: Ấp Tân An Chợ, Xã Tân An..."
            required
            className="admin-input"
          />
        </div>
      </div>

      <div>
        <label className="admin-label">Đường dẫn Google Maps</label>
        <input
          type="url"
          value={mapUrl}
          onChange={(e) => setMapUrl(e.target.value)}
          placeholder="https://www.google.com/maps/dir/?api=1&destination=..."
          className="admin-input font-mono text-xs"
        />
        <p className="text-[10px] text-white/30 mt-1">Bản đồ nhúng sẽ tự cập nhật theo tọa độ trong URL</p>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-3">Video dẫn đường</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">URL Video</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="admin-input font-mono text-xs"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showVideo}
                onChange={(e) => setShowVideo(e.target.checked)}
                className="w-4 h-4 accent-gold rounded"
              />
              <span className="text-sm text-white/70 flex items-center gap-1.5">
                {showVideo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {showVideo ? "Hiển thị video dẫn đường" : "Ẩn video dẫn đường"}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !address.trim()}
          className="admin-btn-primary"
        >
          {isSubmitting ? "Đang lưu..." : initialData ? "Cập nhật" : "Thêm địa điểm"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="admin-btn-secondary">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

/* ═══════════════════ Venue Card ═══════════════════ */

function VenueCard({
  venue,
  onEdit,
  onDelete,
  isDeleting,
}: {
  venue: Venue;
  onEdit: (v: Venue) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="admin-card">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-gold shrink-0" />
            <p className="font-serif text-lg text-white font-semibold truncate">{venue.name}</p>
          </div>
          <p className="text-sm text-white/50 truncate">{venue.address}</p>
          <div className="flex items-center gap-3 mt-1.5">
            {venue.videoUrl ? (
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <Video className="w-3 h-3" /> Có video
              </span>
            ) : (
              <span className="text-[10px] text-white/30 flex items-center gap-1">
                <Video className="w-3 h-3" /> Chưa có video
              </span>
            )}
            <span className={`text-[10px] flex items-center gap-1 ${venue.showVideo ? "text-green-400" : "text-red-400"}`}>
              {venue.showVideo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {venue.showVideo ? "Hiện video" : "Ẩn video"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onEdit(venue)} className="admin-btn-icon" title="Sửa">
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(venue.id)}
            disabled={isDeleting || venue.id === "default"}
            className="admin-btn-icon text-red-400 hover:!bg-red-500/20 disabled:opacity-30"
            title={venue.id === "default" ? "Không thể xóa mặc định" : "Xóa"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ Guest Form ═══════════════════ */

interface GuestFormProps {
  initialData?: Guest | null;
  venues: Venue[];
  templates: InvitationTemplate[];
  onSubmit: (data: Omit<Guest, "id" | "createdAt">) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

function GuestForm({ initialData, venues, templates, onSubmit, onCancel, isSubmitting }: GuestFormProps) {
  const [hostName, setHostName] = useState(initialData?.hostName || "");
  const [hostSide, setHostSide] = useState<"groom" | "bride">(initialData?.hostSide || "groom");
  const [guestName, setGuestName] = useState(initialData?.guestName || "");
  const [guestTitle, setGuestTitle] = useState(initialData?.guestTitle || "");
  const [invitationText, setInvitationText] = useState(initialData?.invitationText || "");
  const [venueId, setVenueId] = useState(initialData?.venueId || "");
  const [showTimeSettings, setShowTimeSettings] = useState(!!initialData?.event?.time || !!initialData?.event?.displayDate);

  const [eventDisplayDate, setEventDisplayDate] = useState(initialData?.event?.displayDate || "");
  const [eventTime, setEventTime] = useState(initialData?.event?.time || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const event: GuestEvent | null =
      eventDisplayDate || eventTime
        ? {
            ...(eventDisplayDate && { displayDate: eventDisplayDate }),
            ...(eventTime && { time: eventTime }),
          }
        : null;

    await onSubmit({ hostName, hostSide, guestName, guestTitle, invitationText, venueId: venueId || undefined, event });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Host info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Tên người mời *</label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="VD: Gia đình Lê Duy Lam"
            required
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Phía</label>
          <AdminSelect
            value={hostSide}
            onChange={(v) => setHostSide(v as "groom" | "bride")}
            options={[
              { value: "groom", label: "Nhà Trai" },
              { value: "bride", label: "Nhà Gái" },
            ]}
          />
        </div>
      </div>

      {/* Guest info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Tên khách mời *</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="VD: Anh Nguyễn Văn A"
            required
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Danh xưng thêm</label>
          <input
            type="text"
            value={guestTitle}
            onChange={(e) => setGuestTitle(e.target.value)}
            placeholder="VD: cùng gia đình"
            className="admin-input"
          />
        </div>
      </div>

      {/* Invitation text — template selector */}
      <div>
        <label className="admin-label">Mẫu lời mời</label>
        <AdminSelect
          value={invitationText}
          onChange={setInvitationText}
          options={[
            { value: "", label: "— Mặc định: đến dự Lễ Thành Hôn của chúng tôi —" },
            ...templates.map((t) => ({ value: t.id, label: t.text })),
          ]}
        />
        <p className="text-[10px] text-white/30 mt-1">Quản lý mẫu ở tab &quot;Mẫu Lời Mời&quot;</p>
      </div>

      {/* Venue selector */}
      <div>
        <label className="admin-label">Địa điểm</label>
        <AdminSelect
          value={venueId}
          onChange={setVenueId}
          options={[
            { value: "", label: "— Dùng mặc định —" },
            ...venues.map((v) => ({ value: v.id, label: `${v.name} — ${v.address}` })),
          ]}
        />
        <p className="text-[10px] text-white/30 mt-1">Chọn địa điểm đã cấu hình sẵn. Quản lý ở tab &quot;Địa Điểm&quot;</p>
      </div>

      {/* Time override */}
      <div className="border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => setShowTimeSettings(!showTimeSettings)}
          className="flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-light transition-colors"
        >
          {showTimeSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Tùy chỉnh thời gian
        </button>

        {showTimeSettings && (
          <div className="mt-4 space-y-4 pl-2 border-l-2 border-gold/20 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Ngày hiển thị</label>
                <input
                  type="text"
                  value={eventDisplayDate}
                  onChange={(e) => setEventDisplayDate(e.target.value)}
                  placeholder={WEDDING.displayDateFull}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Thời gian</label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder={WEDDING.time.ceremony}
                  className="admin-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !hostName.trim() || !guestName.trim()}
          className="admin-btn-primary"
        >
          {isSubmitting ? "Đang lưu..." : initialData ? "Cập nhật" : "Thêm khách mời"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="admin-btn-secondary">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

/* ═══════════════════ Guest Row ═══════════════════ */

function GuestRow({
  guest,
  venues,
  onEdit,
  onDelete,
  isDeleting,
}: {
  guest: Guest;
  venues: Venue[];
  onEdit: (g: Guest) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const venue = venues.find((v) => v.id === guest.venueId);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateInviteUrl(guest.id));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* */ }
  };

  return (
    <div className="admin-card group">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                guest.hostSide === "groom"
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-pink-500/20 text-pink-300"
              }`}
            >
              {guest.hostSide === "groom" ? "Trai" : "Gái"}
            </span>
            <span className="text-white/40 text-xs truncate">{guest.hostName}</span>
          </div>
          <p className="font-serif text-lg text-white font-semibold truncate">
            {guest.guestName}
            {guest.guestTitle && (
              <span className="text-white/50 text-sm font-normal ml-2">{guest.guestTitle}</span>
            )}
          </p>
          {venue && (
            <p className="text-xs text-gold/60 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {venue.name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={copyLink} className="admin-btn-icon" title="Copy link thiệp">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <a
            href={generateInviteUrl(guest.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-icon"
            title="Xem thiệp"
          >
            <LinkIcon className="w-4 h-4" />
          </a>
          <button onClick={() => onEdit(guest)} className="admin-btn-icon" title="Sửa">
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(guest.id)}
            disabled={isDeleting}
            className="admin-btn-icon text-red-400 hover:!bg-red-500/20"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ Admin Page ═══════════════════ */

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"guests" | "venues" | "templates">("guests");

  // --- Guests state ---
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);
  const [deletingGuestId, setDeletingGuestId] = useState<string | null>(null);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Venues state ---
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [isSubmittingVenue, setIsSubmittingVenue] = useState(false);
  const [deletingVenueId, setDeletingVenueId] = useState<string | null>(null);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [showVenueForm, setShowVenueForm] = useState(false);

  // --- Templates state ---
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isSubmittingTemplate, setIsSubmittingTemplate] = useState(false);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<InvitationTemplate | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  // --- Fetch ---
  const fetchGuests = useCallback(async () => {
    try {
      const res = await fetch("/api/guests");
      const data = await res.json();
      setGuests(data.guests || []);
    } catch { /* */ } finally {
      setIsLoadingGuests(false);
    }
  }, []);

  const fetchVenues = useCallback(async () => {
    try {
      const res = await fetch("/api/venues");
      const data = await res.json();
      setVenues(data.venues || []);
    } catch { /* */ } finally {
      setIsLoadingVenues(false);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch { /* */ } finally {
      setIsLoadingTemplates(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
    fetchVenues();
    fetchTemplates();
  }, [fetchGuests, fetchVenues, fetchTemplates]);

  // --- Guest CRUD ---
  const handleAddGuest = async (data: Omit<Guest, "id" | "createdAt">) => {
    setIsSubmittingGuest(true);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { await fetchGuests(); setShowGuestForm(false); }
    } finally { setIsSubmittingGuest(false); }
  };

  const handleEditGuest = async (data: Omit<Guest, "id" | "createdAt">) => {
    if (!editingGuest) return;
    setIsSubmittingGuest(true);
    try {
      const res = await fetch("/api/guests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingGuest.id, ...data }),
      });
      if (res.ok) { await fetchGuests(); setEditingGuest(null); }
    } finally { setIsSubmittingGuest(false); }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm("Xóa khách mời này?")) return;
    setDeletingGuestId(id);
    try {
      const res = await fetch(`/api/guests?id=${id}`, { method: "DELETE" });
      if (res.ok) await fetchGuests();
    } finally { setDeletingGuestId(null); }
  };

  // --- Venue CRUD ---
  const handleAddVenue = async (data: Omit<Venue, "id" | "createdAt">) => {
    setIsSubmittingVenue(true);
    try {
      const res = await fetch("/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { await fetchVenues(); setShowVenueForm(false); }
    } finally { setIsSubmittingVenue(false); }
  };

  const handleEditVenue = async (data: Omit<Venue, "id" | "createdAt">) => {
    if (!editingVenue) return;
    setIsSubmittingVenue(true);
    try {
      const res = await fetch("/api/venues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingVenue.id, ...data }),
      });
      if (res.ok) { await fetchVenues(); setEditingVenue(null); }
    } finally { setIsSubmittingVenue(false); }
  };

  const handleDeleteVenue = async (id: string) => {
    if (!confirm("Xóa địa điểm này?")) return;
    setDeletingVenueId(id);
    try {
      const res = await fetch(`/api/venues?id=${id}`, { method: "DELETE" });
      if (res.ok) await fetchVenues();
    } finally { setDeletingVenueId(null); }
  };

  // --- Template CRUD ---
  const handleAddTemplate = async (data: { text: string }) => {
    setIsSubmittingTemplate(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { await fetchTemplates(); setShowTemplateForm(false); }
    } finally { setIsSubmittingTemplate(false); }
  };

  const handleEditTemplate = async (data: { text: string }) => {
    if (!editingTemplate) return;
    setIsSubmittingTemplate(true);
    try {
      const res = await fetch("/api/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingTemplate.id, ...data }),
      });
      if (res.ok) { await fetchTemplates(); setEditingTemplate(null); }
    } finally { setIsSubmittingTemplate(false); }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Xóa mẫu lời mời này?")) return;
    setDeletingTemplateId(id);
    try {
      const res = await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
      if (res.ok) await fetchTemplates();
    } finally { setDeletingTemplateId(null); }
  };

  // --- Derived ---
  const filteredGuests = guests.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return g.guestName.toLowerCase().includes(q) || g.hostName.toLowerCase().includes(q) || g.guestTitle.toLowerCase().includes(q);
  });
  const groomCount = guests.filter((g) => g.hostSide === "groom").length;
  const brideCount = guests.filter((g) => g.hostSide === "bride").length;

  return (
    <div className="min-h-screen bg-[#0f0a1a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0a1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl text-white font-bold tracking-wide">
              Quản Lý Thiệp Mời
            </h1>
            <p className="text-white/40 text-xs mt-0.5">
              {WEDDING.groom.name} & {WEDDING.bride.name}
            </p>
          </div>
          <a href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors border border-white/10 rounded-lg px-3 py-1.5">
            ← Về trang chính
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("guests")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "guests"
                ? "bg-gold text-[#0f0a1a] shadow-lg"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <Users className="w-4 h-4" />
            Khách Mời
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "guests" ? "bg-[#0f0a1a]/20" : "bg-white/10"
            }`}>{guests.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("venues")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "venues"
                ? "bg-gold text-[#0f0a1a] shadow-lg"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Địa Điểm
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "venues" ? "bg-[#0f0a1a]/20" : "bg-white/10"
            }`}>{venues.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "templates"
                ? "bg-gold text-[#0f0a1a] shadow-lg"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Lời Mời
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === "templates" ? "bg-[#0f0a1a]/20" : "bg-white/10"
            }`}>{templates.length}</span>
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* ═══════════ TAB: GUESTS ═══════════ */}
        {activeTab === "guests" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="admin-stat-card">
                <Users className="w-5 h-5 text-gold mb-1" />
                <p className="text-2xl font-bold text-white">{guests.length}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Tổng</p>
              </div>
              <div className="admin-stat-card">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                  <span className="text-blue-300 text-[10px] font-bold">T</span>
                </div>
                <p className="text-2xl font-bold text-white">{groomCount}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Nhà Trai</p>
              </div>
              <div className="admin-stat-card">
                <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center mb-1">
                  <span className="text-pink-300 text-[10px] font-bold">G</span>
                </div>
                <p className="text-2xl font-bold text-white">{brideCount}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Nhà Gái</p>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khách mời..."
                  className="admin-input pl-9 w-full"
                />
              </div>
              <button
                onClick={() => { setEditingGuest(null); setShowGuestForm(true); }}
                className="admin-btn-primary flex items-center justify-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Thêm khách mời
              </button>
            </div>

            {/* Form */}
            {(showGuestForm || editingGuest) && (
              <div className="admin-card mb-6 border-gold/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-white font-semibold">
                    {editingGuest ? "Sửa thông tin" : "Thêm khách mời mới"}
                  </h3>
                  <button onClick={() => { setShowGuestForm(false); setEditingGuest(null); }} className="admin-btn-icon">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <GuestForm
                  key={editingGuest?.id || "new"}
                  initialData={editingGuest}
                  venues={venues}
                  templates={templates}
                  onSubmit={editingGuest ? handleEditGuest : handleAddGuest}
                  onCancel={() => { setShowGuestForm(false); setEditingGuest(null); }}
                  isSubmitting={isSubmittingGuest}
                />
              </div>
            )}

            {/* List */}
            {isLoadingGuests ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="admin-card animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                    <div className="h-6 bg-white/10 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 font-serif text-lg">
                  {searchQuery ? "Không tìm thấy" : "Chưa có khách mời nào"}
                </p>
                {!searchQuery && (
                  <button onClick={() => setShowGuestForm(true)} className="admin-btn-primary mt-4 inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Thêm khách mời đầu tiên
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGuests.map((guest) => (
                  <GuestRow
                    key={guest.id}
                    guest={guest}
                    venues={venues}
                    onEdit={setEditingGuest}
                    onDelete={handleDeleteGuest}
                    isDeleting={deletingGuestId === guest.id}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══════════ TAB: VENUES ═══════════ */}
        {activeTab === "venues" && (
          <>
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-white/50 text-sm">
                Cấu hình địa điểm tổ chức, bản đồ, và video dẫn đường
              </p>
              <button
                onClick={() => { setEditingVenue(null); setShowVenueForm(true); }}
                className="admin-btn-primary flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Thêm địa điểm
              </button>
            </div>

            {/* Form */}
            {(showVenueForm || editingVenue) && (
              <div className="admin-card mb-6 border-gold/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-white font-semibold">
                    {editingVenue ? "Sửa địa điểm" : "Thêm địa điểm mới"}
                  </h3>
                  <button onClick={() => { setShowVenueForm(false); setEditingVenue(null); }} className="admin-btn-icon">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <VenueForm
                  key={editingVenue?.id || "new-venue"}
                  initialData={editingVenue}
                  onSubmit={editingVenue ? handleEditVenue : handleAddVenue}
                  onCancel={() => { setShowVenueForm(false); setEditingVenue(null); }}
                  isSubmitting={isSubmittingVenue}
                />
              </div>
            )}

            {/* List */}
            {isLoadingVenues ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="admin-card animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                    <div className="h-6 bg-white/10 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : venues.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 font-serif text-lg">Chưa có địa điểm nào</p>
                <button onClick={() => setShowVenueForm(true)} className="admin-btn-primary mt-4 inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Thêm địa điểm đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {venues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onEdit={setEditingVenue}
                    onDelete={handleDeleteVenue}
                    isDeleting={deletingVenueId === venue.id}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══════════ TAB: TEMPLATES ═══════════ */}
        {activeTab === "templates" && (
          <>
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-white/50 text-sm">
                Quản lý mẫu lời mời hiển thị trên thiệp
              </p>
              <button
                onClick={() => { setEditingTemplate(null); setShowTemplateForm(true); }}
                className="admin-btn-primary flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Thêm mẫu
              </button>
            </div>

            {/* Form */}
            {(showTemplateForm || editingTemplate) && (
              <div className="admin-card mb-6 border-gold/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-white font-semibold">
                    {editingTemplate ? "Sửa mẫu lời mời" : "Thêm mẫu mới"}
                  </h3>
                  <button onClick={() => { setShowTemplateForm(false); setEditingTemplate(null); }} className="admin-btn-icon">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <TemplateForm
                  key={editingTemplate?.id || "new-template"}
                  initialData={editingTemplate}
                  onSubmit={editingTemplate ? handleEditTemplate : handleAddTemplate}
                  onCancel={() => { setShowTemplateForm(false); setEditingTemplate(null); }}
                  isSubmitting={isSubmittingTemplate}
                />
              </div>
            )}

            {/* List */}
            {isLoadingTemplates ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="admin-card animate-pulse">
                    <div className="h-5 bg-white/10 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 font-serif text-lg">Chưa có mẫu lời mời nào</p>
                <button onClick={() => setShowTemplateForm(true)} className="admin-btn-primary mt-4 inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Thêm mẫu đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((tmpl) => (
                  <div key={tmpl.id} className="admin-card">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Type className="w-4 h-4 text-gold shrink-0" />
                          <p className="text-white font-serif text-base truncate">&ldquo;{tmpl.text}&rdquo;</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setEditingTemplate(tmpl)} className="admin-btn-icon" title="Sửa">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(tmpl.id)}
                          disabled={deletingTemplateId === tmpl.id}
                          className="admin-btn-icon text-red-400 hover:!bg-red-500/20"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ═══════════════════ Template Form ═══════════════════ */

function TemplateForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  initialData?: InvitationTemplate | null;
  onSubmit: (data: { text: string }) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}) {
  const [text, setText] = useState(initialData?.text || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ text });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="admin-label">Nội dung lời mời *</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="VD: đến dự Lễ Vu Quy của chúng tôi"
          required
          className="admin-input"
        />
        <p className="text-[10px] text-white/30 mt-1">Nội dung sẽ hiển thị phía dưới tên khách mời trên thiệp</p>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting || !text.trim()} className="admin-btn-primary">
          {isSubmitting ? "Đang lưu..." : initialData ? "Cập nhật" : "Thêm mẫu"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="admin-btn-secondary">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
