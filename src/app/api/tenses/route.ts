import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tenses — list all
export async function GET() {
  try {
    const tenses = await prisma.tense.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(tenses);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch tenses" }, { status: 500 });
  }
}

// POST /api/tenses — create new
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, purpose, formulaParts, notes } = body;

    if (!name || !purpose || !Array.isArray(formulaParts) || formulaParts.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get max order
    const maxOrder = await prisma.tense.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    const tense = await prisma.tense.create({
      data: {
        name: String(name).trim(),
        purpose: String(purpose).trim(),
        formulaParts: JSON.stringify(formulaParts.map((p: string) => p.trim()).filter(Boolean)),
        notes: notes ? String(notes).trim() : null,
        order: nextOrder,
      },
    });

    return NextResponse.json(tense, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create tense" }, { status: 500 });
  }
}
