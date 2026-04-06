import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/tenses/[id] — update
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, purpose, formulaParts, notes } = body;

    if (!name || !purpose || !Array.isArray(formulaParts) || formulaParts.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tense = await prisma.tense.update({
      where: { id },
      data: {
        name: String(name).trim(),
        purpose: String(purpose).trim(),
        formulaParts: JSON.stringify(formulaParts.map((p: string) => p.trim()).filter(Boolean)),
        notes: notes ? String(notes).trim() : null,
      },
    });

    return NextResponse.json(tense);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update tense" }, { status: 500 });
  }
}

// DELETE /api/tenses/[id] — remove
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.tense.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete tense" }, { status: 500 });
  }
}
