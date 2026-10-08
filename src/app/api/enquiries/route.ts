import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnquirySchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

// Helper to send automated background WhatsApp notification to admin phone
async function sendWhatsAppServerNotification(data: {
  name: string;
  phone: string;
  email: string;
  service: string;
  budget: string;
  description?: string;
}) {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  const targetPhone = process.env.CALLMEBOT_PHONE || "918778979416";

  if (!apiKey) {
    console.log("CallMeBot API key not configured yet. Set CALLMEBOT_API_KEY to receive background server alerts.");
    return;
  }

  try {
    const message =
      `🚀 *New PixelForge Enquiry!* 🚀\n\n` +
      `👤 *Name:* ${data.name}\n` +
      `📞 *Phone:* ${data.phone}\n` +
      `✉️ *Email:* ${data.email}\n` +
      `🛠️ *Service:* ${data.service}\n` +
      `💰 *Budget:* ${data.budget}\n` +
      `📝 *Message:* ${data.description || "N/A"}`;

    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(targetPhone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        clearTimeout(timeout);
        if (res.ok) {
          console.log("CallMeBot notification sent successfully.");
        } else {
          console.warn("CallMeBot response status:", res.status);
        }
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.error("CallMeBot notification error:", err?.message || err);
      });
  } catch (err) {
    console.error("Failed to dispatch WhatsApp alert:", err);
  }
}

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
        status: "PENDING",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/enquiries");
    revalidatePath("/mobile-admin");
    revalidatePath("/admin/mobile");

    // 1. Dispatch background server-to-phone WhatsApp alert if API key configured
    sendWhatsAppServerNotification(result.data);

    // 2. Generate client-to-admin WhatsApp pre-filled link
    const adminWhatsApp = "918778979416";
    const clientWaText =
      `Hello Keerthi Adarsh, I just submitted an enquiry on PixelForge Studio:\n\n` +
      `• Name: ${result.data.name}\n` +
      `• Service: ${result.data.service}\n` +
      `• Budget: ${result.data.budget}\n` +
      `• Phone: ${result.data.phone}\n` +
      `• Email: ${result.data.email}\n` +
      (result.data.description ? `• Details: ${result.data.description}` : "");

    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(clientWaText)}`;

    return NextResponse.json({
      success: true,
      message: "Thank you! Your enquiry has been received. We'll get back to you shortly.",
      enquiryId: enquiry.id,
      whatsappUrl,
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
