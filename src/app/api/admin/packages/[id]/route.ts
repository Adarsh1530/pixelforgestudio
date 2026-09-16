import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AcademicPackageSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Convert features array to string if provided as array
    const dataToValidate = {
      ...body,
      features: Array.isArray(body.features) ? body.features : [],
    };
    
    const result = AcademicPackageSchema.partial().safeParse(dataToValidate);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { ...result.data };
    if (result.data.features) {
      updateData.features = JSON.stringify(result.data.features);
    }

    const updated = await prisma.academicPackage.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, package: updated });
  } catch (error) {
    console.error("Update package error:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.academicPackage.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete package error:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
