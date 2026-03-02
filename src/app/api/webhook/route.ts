import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface WebhookPayload {
  id: string;
  event: string;
  data: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const secretHeader = request.headers.get("x-webhook-secret");
    const expectedSecret = process.env.WEBHOOK_SECRET;

    if (!expectedSecret || secretHeader !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Partial<WebhookPayload>;
    const { id, event, data } = body;

    if (!id || typeof id !== "string" || !event || typeof event !== "string") {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 },
      );
    }

    try {
      await prisma.webhookEvent.create({
        data: {
          externalId: id,
          payload: {
            event,
            data,
          } as any,
        },
      });

      return NextResponse.json(
        { status: "created", id },
        { status: 201 },
      );
    } catch (error: unknown) {
      const maybeError = error as { code?: string };

      if (maybeError && maybeError.code === "P2002") {
        // Unique constraint violation on externalId — idempotent duplicate
        return NextResponse.json(
          { status: "duplicate", id },
          { status: 200 },
        );
      }

      console.error("Error creating WebhookEvent:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in /api/webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

