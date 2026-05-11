import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, items, totalAmount, billingAddress, paymentMethod } = body;

    // Validate required fields
    if (!email || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Resolve userId from email (never trust client-sent IDs)
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found. Please sign in again." },
        { status: 401 }
      );
    }
    const userId = user.id;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Calculate subtotal from items
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.12;

    // Create order with items
    const order = await db.order.create({
      data: {
        orderNumber,
        userId,
        subtotal: new Decimal(subtotal),
        tax: new Decimal(tax),
        totalAmount: new Decimal(totalAmount),
        status: "PENDING_PAYMENT",
        shippingAddress: billingAddress?.street || null,
        shippingCity: billingAddress?.city || null,
        shippingProvince: billingAddress?.province || null,
        shippingZip: billingAddress?.zipCode || null,
        items: {
          create: items.map((item: any) => ({
            partId: item.partId,
            quantity: item.quantity,
            unitPrice: new Decimal(item.price),
            totalPrice: new Decimal(item.price * item.quantity),
          })),
        },
      },
      include: {
        items: true,
        payment: true,
      },
    });

    // Create payment record (initially PENDING)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolvedMethod = (paymentMethod === "COD" ? "COD" : "XENDIT") as any;
    const payment = await db.payment.create({
      data: {
        userId,
        orderId: order.id,
        amount: new Decimal(totalAmount),
        method: resolvedMethod,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        ...order,
        payment,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
