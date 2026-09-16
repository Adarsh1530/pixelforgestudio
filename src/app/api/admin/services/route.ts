import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServiceSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = ServiceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: result.data,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
