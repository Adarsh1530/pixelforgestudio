import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TestimonialSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = TestimonialSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: result.data,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    console.error("Update testimonial error:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
