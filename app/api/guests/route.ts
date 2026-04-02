import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { Guest, Venue, InvitationTemplate } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const GUESTS_FILE = path.join(DATA_DIR, "guests.json");
const VENUES_FILE = path.join(DATA_DIR, "venues.json");
const TEMPLATES_FILE = path.join(DATA_DIR, "templates.json");

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(GUESTS_FILE)) {
    await writeFile(GUESTS_FILE, JSON.stringify({ guests: [] }, null, 2));
  }
}

async function readGuests(): Promise<Guest[]> {
  await ensureDataDir();
  try {
    const data = await readFile(GUESTS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.guests || [];
  } catch {
    return [];
  }
}

async function readVenues(): Promise<Venue[]> {
  try {
    if (!existsSync(VENUES_FILE)) return [];
    const data = await readFile(VENUES_FILE, "utf-8");
    return JSON.parse(data).venues || [];
  } catch {
    return [];
  }
}

async function readTemplates(): Promise<InvitationTemplate[]> {
  try {
    if (!existsSync(TEMPLATES_FILE)) return [];
    const data = await readFile(TEMPLATES_FILE, "utf-8");
    return JSON.parse(data).templates || [];
  } catch {
    return [];
  }
}

async function saveGuests(guests: Guest[]) {
  await ensureDataDir();
  await writeFile(GUESTS_FILE, JSON.stringify({ guests }, null, 2));
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Resolve venue data vào guest.event khi guest có venueId.
 * Venue fields ghi đè lên event fields (nhưng giữ event.time, event.date, etc.)
 */
function resolveGuestVenue(guest: Guest, venues: Venue[]): Guest {
  if (!guest.venueId) return guest;

  const venue = venues.find((v) => v.id === guest.venueId);
  if (!venue) return guest;

  return {
    ...guest,
    event: {
      ...guest.event,
      venueName: venue.name,
      venueAddress: venue.address,
      venueMapUrl: venue.mapUrl,
      videoUrl: venue.videoUrl || undefined,
      showVideo: venue.showVideo,
    },
  };
}

// GET /api/guests         → tất cả khách mời
// GET /api/guests?id=xxx  → 1 khách mời theo ID (resolve venue)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const guests = await readGuests();

    if (id) {
      const guest = guests.find((g) => g.id === id);
      if (!guest) {
        return NextResponse.json(
          { error: "Không tìm thấy khách mời" },
          { status: 404 }
        );
      }
      // Resolve venue + template data
      const venues = await readVenues();
      const templates = await readTemplates();
      let resolved = resolveGuestVenue(guest, venues);
      // Resolve template: nếu guest có invitationText trùng template ID, thay bằng text thật
      if (resolved.invitationText) {
        const tmpl = templates.find((t) => t.id === resolved.invitationText);
        if (tmpl) resolved = { ...resolved, invitationText: tmpl.text };
      }
      return NextResponse.json({ guest: resolved });
    }

    return NextResponse.json({ guests });
  } catch {
    return NextResponse.json({ guests: [] });
  }
}

// POST /api/guests — Thêm khách mời mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostName, hostSide, guestName, guestTitle, invitationText, venueId, event } = body;

    if (!hostName || !guestName) {
      return NextResponse.json(
        { error: "Tên người mời và tên khách mời là bắt buộc" },
        { status: 400 }
      );
    }

    const newGuest: Guest = {
      id: generateId(),
      hostName: String(hostName).trim().slice(0, 100),
      hostSide: hostSide === "bride" ? "bride" : "groom",
      guestName: String(guestName).trim().slice(0, 100),
      guestTitle: guestTitle ? String(guestTitle).trim().slice(0, 100) : "",
      invitationText: invitationText ? String(invitationText).trim().slice(0, 200) : "",
      venueId: venueId || undefined,
      event: event || null,
      createdAt: new Date().toISOString(),
    };

    const guests = await readGuests();
    guests.push(newGuest);
    await saveGuests(guests);

    return NextResponse.json({ success: true, guest: newGuest }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi thêm khách mời" },
      { status: 500 }
    );
  }
}

// PUT /api/guests — Cập nhật khách mời
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, hostName, hostSide, guestName, guestTitle, invitationText, venueId, event } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID khách mời là bắt buộc" },
        { status: 400 }
      );
    }

    const guests = await readGuests();
    const index = guests.findIndex((g) => g.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Không tìm thấy khách mời" },
        { status: 404 }
      );
    }

    guests[index] = {
      ...guests[index],
      hostName: hostName ? String(hostName).trim().slice(0, 100) : guests[index].hostName,
      hostSide: hostSide === "bride" ? "bride" : "groom",
      guestName: guestName ? String(guestName).trim().slice(0, 100) : guests[index].guestName,
      guestTitle: guestTitle !== undefined ? String(guestTitle).trim().slice(0, 100) : guests[index].guestTitle,
      invitationText: invitationText !== undefined ? String(invitationText).trim().slice(0, 200) : guests[index].invitationText,
      venueId: venueId !== undefined ? (venueId || undefined) : guests[index].venueId,
      event: event !== undefined ? event : guests[index].event,
    };

    await saveGuests(guests);
    return NextResponse.json({ success: true, guest: guests[index] });
  } catch {
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi cập nhật" },
      { status: 500 }
    );
  }
}

// DELETE /api/guests?id=xxx — Xóa khách mời
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID khách mời là bắt buộc" },
        { status: 400 }
      );
    }

    const guests = await readGuests();
    const filtered = guests.filter((g) => g.id !== id);

    if (filtered.length === guests.length) {
      return NextResponse.json(
        { error: "Không tìm thấy khách mời" },
        { status: 404 }
      );
    }

    await saveGuests(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi xóa" },
      { status: 500 }
    );
  }
}
