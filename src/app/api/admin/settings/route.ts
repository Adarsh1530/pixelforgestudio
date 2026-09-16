import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SiteSettingsSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: "default" },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = SiteSettingsSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: result.data,
      create: { id: "default", ...result.data },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
