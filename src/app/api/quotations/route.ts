import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

// POST - Create a new quotation (from landing page)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, items } = body;

    if (!name || !email || !items) {
      return NextResponse.json(
        { success: false, error: "Name, email, and items are required" },
        { status: 400 }
      );
    }

    const quotation = await db.quotation.create({
      data: { name, email, phone: phone || null, items },
    });

    // Create notifications for ADMIN and MECHANIC roles
    await db.notification.createMany({
      data: [
        {
          type: "NEW_QUOTATION",
          title: "New Quotation Request",
          message: `${name} requested a quote: ${items.substring(0, 80)}${items.length > 80 ? "..." : ""}`,
          entityId: quotation.id,
          forRole: "ADMIN",
        },
        {
          type: "NEW_QUOTATION",
          title: "New Quotation Request",
          message: `${name} requested a quote: ${items.substring(0, 80)}${items.length > 80 ? "..." : ""}`,
          entityId: quotation.id,
          forRole: "MECHANIC",
        },
      ],
    });

    return NextResponse.json({ success: true, data: quotation });
  } catch (error) {
    console.error("Quotation creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create quotation" },
      { status: 500 }
    );
  }
}
