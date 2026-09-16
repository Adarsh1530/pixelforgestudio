import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServiceSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = ServiceSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation error", details: result.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: result.data,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
