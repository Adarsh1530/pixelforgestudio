import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const actionType = searchParams.get("type")?.toLowerCase(); // "accept" | "reject"

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const newStatus = actionType === "reject" ? "REJECTED" : "ACCEPTED";

    // Update status in database
    await prisma.enquiry.update({
      where: { id },
      data: {
        status: newStatus,
        notes: enquiry.notes
          ? `${enquiry.notes}\n[${new Date().toLocaleString()}]: Marked as ${newStatus}`
          : `[${new Date().toLocaleString()}]: Marked as ${newStatus}`,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/enquiries");

    const cleanClientPhone = enquiry.phone.replace(/[^0-9]/g, "");

    let clientReplyText = "";
    if (newStatus === "ACCEPTED") {
      clientReplyText =
        `Hello ${enquiry.name}! 👋\n\n` +
        `Thank you for contacting PixelForge Studio.\n\n` +
        `✅ We are pleased to *accept* your project enquiry for *${enquiry.service}* (Budget: ${enquiry.budget}).\n\n` +
        `We would love to discuss the details and begin working on your project. Let us know a convenient time to connect!\n\n` +
        `Best regards,\n` +
        `Keerthi Adarsh | PixelForge Studio\n` +
        `+91 87789 79416`;
    } else {
      clientReplyText =
        `Hello ${enquiry.name},\n\n` +
        `Thank you for your interest in PixelForge Studio regarding your *${enquiry.service}* project enquiry.\n\n` +
        `❌ Unfortunately, we are currently unable to take on this project due to our existing scheduling commitments.\n\n` +
        `We appreciate you reaching out and wish you all the best with your project!\n\n` +
        `Best regards,\n` +
        `Keerthi Adarsh | PixelForge Studio\n` +
        `+91 87789 79416`;
    }

    // Redirect directly to WhatsApp with pre-filled message to client
    const targetWaUrl = `https://wa.me/${cleanClientPhone}?text=${encodeURIComponent(clientReplyText)}`;
    return NextResponse.redirect(targetWaUrl, 307);
  } catch (error) {
    console.error("Enquiry action error:", error);
    return NextResponse.json({ error: "Failed to process enquiry action" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const actionType = body?.action?.toLowerCase(); // "accept" | "reject"

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const newStatus = actionType === "reject" ? "REJECTED" : "ACCEPTED";

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        status: newStatus,
        notes: enquiry.notes
          ? `${enquiry.notes}\n[${new Date().toLocaleString()}]: Marked as ${newStatus}`
          : `[${new Date().toLocaleString()}]: Marked as ${newStatus}`,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/enquiries");

    const cleanClientPhone = enquiry.phone.replace(/[^0-9]/g, "");

    let clientReplyText = "";
    if (newStatus === "ACCEPTED") {
      clientReplyText =
        `Hello ${enquiry.name}! 👋\n\n` +
        `Thank you for contacting PixelForge Studio.\n\n` +
        `✅ We are pleased to *accept* your project enquiry for *${enquiry.service}* (Budget: ${enquiry.budget}).\n\n` +
        `We would love to discuss the details and begin working on your project. Let us know a convenient time to connect!\n\n` +
        `Best regards,\n` +
        `Keerthi Adarsh | PixelForge Studio\n` +
        `+91 87789 79416`;
    } else {
      clientReplyText =
        `Hello ${enquiry.name},\n\n` +
        `Thank you for your interest in PixelForge Studio regarding your *${enquiry.service}* project enquiry.\n\n` +
        `❌ Unfortunately, we are currently unable to take on this project due to our existing scheduling commitments.\n\n` +
        `We appreciate you reaching out and wish you all the best with your project!\n\n` +
        `Best regards,\n` +
        `Keerthi Adarsh | PixelForge Studio\n` +
        `+91 87789 79416`;
    }

    const whatsappUrl = `https://wa.me/${cleanClientPhone}?text=${encodeURIComponent(clientReplyText)}`;

    return NextResponse.json({
      success: true,
      status: newStatus,
      enquiry: updated,
      whatsappUrl,
      replyText: clientReplyText,
    });
  } catch (error) {
    console.error("Enquiry action POST error:", error);
    return NextResponse.json({ error: "Failed to process enquiry action" }, { status: 500 });
  }
}
