import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const stored = await uploadFile(file);

    const media = await prisma.media.create({
      data: {
        filename: stored.filename,
        url: stored.url,
        storageKey: stored.storageKey,
        type: stored.type,
        size: stored.size,
      },
    });

    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: error?.message || "File upload failed" }, { status: 500 });
  }
}
