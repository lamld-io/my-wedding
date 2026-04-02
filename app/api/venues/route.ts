import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { Venue } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const VENUES_FILE = path.join(DATA_DIR, "venues.json");

async function ensureFile() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(VENUES_FILE)) {
    await writeFile(VENUES_FILE, JSON.stringify({ venues: [] }, null, 2));
  }
}

async function readVenues(): Promise<Venue[]> {
  await ensureFile();
  try {
    const data = await readFile(VENUES_FILE, "utf-8");
    return JSON.parse(data).venues || [];
  } catch {
    return [];
  }
}

async function saveVenues(venues: Venue[]) {
  await ensureFile();
  await writeFile(VENUES_FILE, JSON.stringify({ venues }, null, 2));
}

function generateId(): string {
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
}

// GET /api/venues
export async function GET() {
  try {
    const venues = await readVenues();
    return NextResponse.json({ venues });
  } catch {
    return NextResponse.json({ venues: [] });
  }
}

// POST /api/venues — Thêm địa điểm
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, mapUrl, videoUrl, showVideo } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: "Tên và địa chỉ là bắt buộc" },
        { status: 400 }
      );
    }

    const newVenue: Venue = {
      id: generateId(),
      name: String(name).trim().slice(0, 100),
      address: String(address).trim().slice(0, 200),
      mapUrl: mapUrl ? String(mapUrl).trim() : "",
      videoUrl: videoUrl ? String(videoUrl).trim() : "",
      showVideo: showVideo !== false,
      createdAt: new Date().toISOString(),
    };

    const venues = await readVenues();
    venues.push(newVenue);
    await saveVenues(venues);

    return NextResponse.json({ success: true, venue: newVenue }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Lỗi khi thêm địa điểm" }, { status: 500 });
  }
}

// PUT /api/venues — Cập nhật địa điểm
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, address, mapUrl, videoUrl, showVideo } = body;

    if (!id) {
      return NextResponse.json({ error: "ID là bắt buộc" }, { status: 400 });
    }

    const venues = await readVenues();
    const index = venues.findIndex((v) => v.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    venues[index] = {
      ...venues[index],
      name: name ? String(name).trim().slice(0, 100) : venues[index].name,
      address: address ? String(address).trim().slice(0, 200) : venues[index].address,
      mapUrl: mapUrl !== undefined ? String(mapUrl).trim() : venues[index].mapUrl,
      videoUrl: videoUrl !== undefined ? String(videoUrl).trim() : venues[index].videoUrl,
      showVideo: showVideo !== undefined ? !!showVideo : venues[index].showVideo,
    };

    await saveVenues(venues);
    return NextResponse.json({ success: true, venue: venues[index] });
  } catch {
    return NextResponse.json({ error: "Lỗi khi cập nhật" }, { status: 500 });
  }
}

// DELETE /api/venues?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID là bắt buộc" }, { status: 400 });
    }

    const venues = await readVenues();
    const filtered = venues.filter((v) => v.id !== id);
    if (filtered.length === venues.length) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    await saveVenues(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi khi xóa" }, { status: 500 });
  }
}
