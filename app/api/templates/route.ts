import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { InvitationTemplate } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "templates.json");

async function ensureFile() {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  if (!existsSync(FILE)) await writeFile(FILE, JSON.stringify({ templates: [] }, null, 2));
}

async function readTemplates(): Promise<InvitationTemplate[]> {
  await ensureFile();
  try {
    const data = await readFile(FILE, "utf-8");
    return JSON.parse(data).templates || [];
  } catch { return []; }
}

async function saveTemplates(templates: InvitationTemplate[]) {
  await ensureFile();
  await writeFile(FILE, JSON.stringify({ templates }, null, 2));
}

function generateId(): string {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
}

// GET
export async function GET() {
  try {
    const templates = await readTemplates();
    return NextResponse.json({ templates });
  } catch { return NextResponse.json({ templates: [] }); }
}

// POST
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "Nội dung là bắt buộc" }, { status: 400 });
    }
    const newTemplate: InvitationTemplate = {
      id: generateId(),
      text: String(text).trim().slice(0, 200),
      createdAt: new Date().toISOString(),
    };
    const templates = await readTemplates();
    templates.push(newTemplate);
    await saveTemplates(templates);
    return NextResponse.json({ success: true, template: newTemplate }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Lỗi" }, { status: 500 });
  }
}

// PUT
export async function PUT(request: NextRequest) {
  try {
    const { id, text } = await request.json();
    if (!id) return NextResponse.json({ error: "ID bắt buộc" }, { status: 400 });
    const templates = await readTemplates();
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    templates[index] = { ...templates[index], text: text ? String(text).trim().slice(0, 200) : templates[index].text };
    await saveTemplates(templates);
    return NextResponse.json({ success: true, template: templates[index] });
  } catch {
    return NextResponse.json({ error: "Lỗi" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID bắt buộc" }, { status: 400 });
    const templates = await readTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    if (filtered.length === templates.length) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    await saveTemplates(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi" }, { status: 500 });
  }
}
