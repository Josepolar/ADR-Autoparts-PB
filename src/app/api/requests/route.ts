import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

// POST - Create a new service request (from landing page)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const serviceRequest = await db.serviceRequest.create({
      data: { name, email, service, message },
    });

    // Create notifications for ADMIN and MECHANIC roles
    await db.notification.createMany({
      data: [
        {
          type: "NEW_REQUEST",
          title: "New Service Request",
          message: `${name} submitted a ${service} request: ${message.substring(0, 60)}${message.length > 60 ? "..." : ""}`,
          entityId: serviceRequest.id,
          forRole: "ADMIN",
        },
        {
          type: "NEW_REQUEST",
          title: "New Service Request",
          message: `${name} submitted a ${service} request: ${message.substring(0, 60)}${message.length > 60 ? "..." : ""}`,
          entityId: serviceRequest.id,
          forRole: "MECHANIC",
        },
      ],
    });

    return NextResponse.json({ success: true, data: serviceRequest });
  } catch (error) {
    console.error("Service request creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create service request" },
      { status: 500 }
    );
  }
}
