import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_EVENT_TYPES = ["landing_view", "cta_click", "lead_created"] as const;

type EventType = (typeof ALLOWED_EVENT_TYPES)[number];

interface EventPayload {
  type: EventType;
  metadata?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<EventPayload>;

    const { type, metadata } = body;

    if (!type || !ALLOWED_EVENT_TYPES.includes(type as EventType)) {
      return NextResponse.json(
        { error: "Invalid or missing event type" },
        { status: 400 },
      );
    }

    const event = await prisma.conversionEvent.create({
      data: {
        type,
        // Prisma Json field accepts any serializable value
        metadata: metadata as any,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error in /api/events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

