import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { getXenditInvoice } from "@/lib/xendit";

/**
 * POST /api/payment/xendit/sync
 * Body: { orderId: string }
 *
 * Polls Xendit for the current invoice status and syncs it to the database.
 * Used when the user returns from the Xendit payment page and webhooks
 * haven't fired yet (e.g., in development without a public URL).
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId } = (await request.json()) as { orderId: string };

    if (!orderId) {
      return NextResponse.json({ success: false, message: "orderId is required" }, { status: 400 });
    }

    // Load payment record to get the Xendit invoice ID
    const payment = await (db.payment.findUnique as any)({
      where: { orderId },
    });

    if (!payment?.xenditInvoiceId) {
      return NextResponse.json(
        { success: false, message: "No Xendit invoice found for this order" },
        { status: 404 }
      );
    }

    // Fetch the current status from Xendit
    const invoice = await getXenditInvoice(payment.xenditInvoiceId);

    const isPaid = invoice.status === "SETTLED" || invoice.status === "PAID";

    if (isPaid) {
      // Only update if not already completed
      if (payment.status !== "COMPLETED") {
        await db.payment.update({
          where: { orderId },
          data: {
            status: "COMPLETED",
            transactionId: invoice.id,
            completedAt: invoice.paid_at ? new Date(invoice.paid_at) : new Date(),
          },
        });

        await db.order.update({
          where: { id: orderId },
          data: { status: "PAYMENT_CONFIRMED" },
        });
      }

      return NextResponse.json({ success: true, status: "SETTLED", orderStatus: "PAYMENT_CONFIRMED" });
    }

    if (invoice.status === "EXPIRED") {
      if (payment.status !== "FAILED") {
        await db.payment.update({ where: { orderId }, data: { status: "FAILED" } });
        await db.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
      }
      return NextResponse.json({ success: true, status: "EXPIRED", orderStatus: "CANCELLED" });
    }

    
    return NextResponse.json({ success: true, status: invoice.status, orderStatus: "PENDING_PAYMENT" });
  } catch (error) {
    console.error("Xendit sync error:", error);
    return NextResponse.json({ success: false, message: "Failed to sync payment status" }, { status: 500 });
  }
}
