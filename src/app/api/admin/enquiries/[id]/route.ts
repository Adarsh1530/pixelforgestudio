import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnquiryUpdateSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = EnquiryUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload", details: result.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        status: result.data.status,
        notes: result.data.notes,
      },
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    console.error("Update enquiry error:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.enquiry.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    console.error("Delete enquiry error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
