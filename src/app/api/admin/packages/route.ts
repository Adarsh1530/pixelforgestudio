import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AcademicPackageSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const packages = await prisma.academicPackage.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(packages);
  } catch (error) {
    console.error("Fetch packages error:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = AcademicPackageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const pkg = await prisma.academicPackage.create({
      data: {
        ...result.data,
        features: JSON.stringify(result.data.features),
      },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, package: pkg });
  } catch (error) {
    console.error("Create package error:", error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}
