import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnquirySchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = EnquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        service: result.data.service,
        budget: result.data.budget,
        description: result.data.description,
        source: result.data.source || "WEBSITE",
        status: "NEW",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/enquiries");

    return NextResponse.json({
      success: true,
      message: "Thank you! Your enquiry has been received. We'll get back to you shortly.",
      enquiryId: enquiry.id,
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to process enquiry. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("Fetch enquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}
