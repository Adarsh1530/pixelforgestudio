import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PortfolioProjectSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Fetch portfolio error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = PortfolioProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const project = await prisma.portfolioProject.create({
      data: result.data,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Create portfolio project error:", error);
    return NextResponse.json({ error: "Failed to create portfolio project" }, { status: 500 });
  }
}
