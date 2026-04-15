import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

// POST - Create a new booking (from landing page)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, date } = body;

    if (!name || !email || !phone || !service || !date) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const booking = await db.booking.create({
      data: {
        name,
        email,
        phone,
        service,
        date: new Date(date),
      },
    });

    // Create notifications for ADMIN and MECHANIC roles
    await db.notification.createMany({
      data: [
        {
          type: "NEW_BOOKING",
          title: "New Booking Request",
          message: `${name} booked ${service} for ${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
          entityId: booking.id,
          forRole: "ADMIN",
        },
        {
          type: "NEW_BOOKING",
          title: "New Booking Request",
          message: `${name} booked ${service} for ${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
          entityId: booking.id,
          forRole: "MECHANIC",
        },
      ],
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
