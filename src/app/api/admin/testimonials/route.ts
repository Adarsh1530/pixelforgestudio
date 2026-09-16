import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TestimonialSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Fetch testimonials error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = TestimonialSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: result.data,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
