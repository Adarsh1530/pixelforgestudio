import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PortfolioProjectSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = PortfolioProjectSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.portfolioProject.update({
      where: { id },
      data: result.data,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Update portfolio project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.portfolioProject.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete portfolio project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
