import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteStoredFile } from "@/lib/storage";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    await deleteStoredFile(media.storageKey);
    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 });
  }
}
