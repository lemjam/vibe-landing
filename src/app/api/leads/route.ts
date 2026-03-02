import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface LeadPayload {
  name: string;
  contact: string;
  consent: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<LeadPayload>;
    const { name, contact, consent } = body;

    const isValidName = typeof name === "string" && name.trim().length > 0;
    const isValidContact =
      typeof contact === "string" && contact.trim().length > 0;
    const isValidConsent = consent === true;

    if (!isValidName || !isValidContact || !isValidConsent) {
      return NextResponse.json(
        { error: "Invalid payload", details: { name, contact, consent } },
        { status: 400 },
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: name!.trim(),
        contact: contact!.trim(),
        consent: true,
      },
    });

    await prisma.conversionEvent.create({
      data: {
        type: "lead_created",
        metadata: {
          leadId: lead.id,
          name: lead.name,
          contact: lead.contact,
        } as any,
      },
    });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const text = `🔔 Новый лид!\nИмя: ${lead.name}\nКонтакт: ${lead.contact}`;

      try {
        await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text,
            }),
          },
        );
      } catch (notificationError) {
        console.error("Failed to send Telegram notification:", notificationError);
        // Do not fail the entire request if notification fails
      }
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error in /api/leads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

