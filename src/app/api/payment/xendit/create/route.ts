import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { createXenditInvoice } from "@/lib/xendit";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: NextRequest) {
  try {
    // Guard: fail fast if secret key is not configured
    if (!process.env.XENDIT_SECRET_KEY) {
      console.error("Xendit create invoice: XENDIT_SECRET_KEY is not set in environment");
      return NextResponse.json(
        { success: false, message: "Payment gateway is not configured. Contact support." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { orderId, email } = body as { orderId: string; email: string };

    if (!orderId || !email) {
      return NextResponse.json(
        { success: false, message: "orderId and email are required" },
        { status: 400 }
      );
    }

    // Load order with items
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { part: true },
        },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payment = order.payment as any;
    if (payment?.xenditInvoiceId) {
      // Already has a Xendit invoice — return existing URL
      return NextResponse.json({
        success: true,
        invoiceUrl: payment.xenditPaymentUrl,
        invoiceId: payment.xenditInvoiceId,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${request.headers.get("host")}`;

    const invoice = await createXenditInvoice({
      externalId: order.orderNumber,
      amount: Number(order.totalAmount),
      payerEmail: email,
      description: `ADR Auto Parts — Order ${order.orderNumber}`,
      items: order.items.map((item) => ({
        name: item.part?.name ?? "Auto Part",
        quantity: item.quantity,
        price: Number(item.unitPrice),
        category: item.part?.category ?? "Auto Parts",
      })),
      successRedirectUrl: `${baseUrl}/orders/${orderId}?paid=true`,
      failureRedirectUrl: `${baseUrl}/orders/${orderId}?failed=true`,
    });

    // Upsert payment record with Xendit details
    await (db.payment.upsert as any)({
      where: { orderId },
      create: {
        userId: order.userId,
        orderId: order.id,
        amount: new Decimal(Number(order.totalAmount)),
        method: "XENDIT",
        status: "PENDING",
        xenditInvoiceId: invoice.id,
        xenditPaymentUrl: invoice.invoice_url,
      },
      update: {
        method: "XENDIT",
        xenditInvoiceId: invoice.id,
        xenditPaymentUrl: invoice.invoice_url,
      },
    });

    return NextResponse.json({
      success: true,
      invoiceUrl: invoice.invoice_url,
      invoiceId: invoice.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create payment invoice";
    console.error("Xendit create invoice error:", message);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
