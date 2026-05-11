import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { validateXenditWebhookToken } from "@/lib/xendit";

/**
 * Xendit sends invoice payment callbacks here.
 * Configure this URL in your Xendit dashboard → Webhooks:
 *   https://yourdomain.com/api/payment/xendit/webhook
 *
 * Set the "Invoice paid" event and optionally "Invoice expired".
 */
export async function POST(request: NextRequest) {
  try {
    // Validate Xendit callback token
    const callbackToken = request.headers.get("x-callback-token");
    if (!validateXenditWebhookToken(callbackToken)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      status,          // "SETTLED" | "EXPIRED"
      external_id,     // Our orderNumber
      id: xenditInvoiceId,
      paid_at,
    } = body as {
      status: string;
      external_id: string;
      id: string;
      payment_method?: string;
      payment_channel?: string;
      paid_amount?: number;
      paid_at?: string;
    };

    // Find the order by orderNumber
    const order = await db.order.findUnique({
      where: { orderNumber: external_id },
      include: { payment: true },
    });

    if (!order) {
      // Log and return 200 so Xendit doesn't retry indefinitely
      console.warn(`Xendit webhook: order not found for external_id=${external_id}`);
      return NextResponse.json({ received: true });
    }

    if (status === "SETTLED") {
      // Update payment to COMPLETED
      await db.payment.update({
        where: { orderId: order.id },
        data: {
          status: "COMPLETED",
          transactionId: xenditInvoiceId,
          completedAt: paid_at ? new Date(paid_at) : new Date(),
          webhookData: JSON.stringify(body),
        },
      });

      // Advance order to PAYMENT_CONFIRMED
      await db.order.update({
        where: { id: order.id },
        data: { status: "PAYMENT_CONFIRMED" },
      });
    } else if (status === "EXPIRED") {
      await db.payment.update({
        where: { orderId: order.id },
        data: {
          status: "FAILED",
          webhookData: JSON.stringify(body),
        },
      });

      await db.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Xendit webhook error:", error);
    // Always return 200 to prevent Xendit from retrying on our internal errors
    return NextResponse.json({ received: true, error: "internal" });
  }
}
