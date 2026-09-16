import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Fetch media error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
