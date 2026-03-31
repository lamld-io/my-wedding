import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const WISHES_FILE = path.join(DATA_DIR, "wishes.json");

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(WISHES_FILE)) {
    await writeFile(WISHES_FILE, JSON.stringify({ wishes: [] }, null, 2));
  }
}

async function readWishes(): Promise<Wish[]> {
  await ensureDataDir();
  try {
    const data = await readFile(WISHES_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.wishes || [];
  } catch {
    return [];
  }
}

async function saveWishes(wishes: Wish[]) {
  await ensureDataDir();
  await writeFile(WISHES_FILE, JSON.stringify({ wishes }, null, 2));
}

export async function GET() {
  try {
    const wishes = await readWishes();
    return NextResponse.json({ wishes: wishes.reverse() }); // newest first
  } catch {
    return NextResponse.json({ wishes: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Tên và lời chúc là bắt buộc" },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedName = String(name).trim().slice(0, 50);
    const sanitizedMessage = String(message).trim().slice(0, 500);

    const newWish: Wish = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: sanitizedName,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
    };

    const wishes = await readWishes();
    wishes.push(newWish);
    await saveWishes(wishes);

    return NextResponse.json({ success: true, wish: newWish }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Có lỗi xảy ra" },
      { status: 500 }
    );
  }
}
