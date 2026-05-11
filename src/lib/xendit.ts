/**
 * Xendit API helpers — uses REST directly for reliability.
 * Docs: https://developers.xendit.co/api-reference/
 */

const XENDIT_BASE_URL = "https://api.xendit.co";

function getAuthHeader(): string {
  const key = process.env.XENDIT_SECRET_KEY;
  if (!key) throw new Error("XENDIT_SECRET_KEY is not set");
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

export interface XenditInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface CreateInvoiceParams {
  externalId: string;       // Our order ID
  amount: number;           // In PHP pesos (integers only)
  payerEmail: string;
  description: string;
  items?: XenditInvoiceItem[];
  successRedirectUrl: string;
  failureRedirectUrl: string;
  currency?: string;        // defaults to PHP
}

export interface XenditInvoice {
  id: string;
  external_id: string;
  status: string;           // PENDING | SETTLED | EXPIRED
  invoice_url: string;
  amount: number;
  currency: string;
  payment_method?: string;
  payment_channel?: string;
  paid_amount?: number;
  paid_at?: string;
}

/**
 * Creates a Xendit invoice and returns the hosted payment URL.
 */
export async function createXenditInvoice(
  params: CreateInvoiceParams
): Promise<XenditInvoice> {
  const body: Record<string, unknown> = {
    external_id: params.externalId,
    amount: Math.round(params.amount),
    payer_email: params.payerEmail,
    description: params.description,
    currency: params.currency ?? "PHP",
    success_redirect_url: params.successRedirectUrl,
    failure_redirect_url: params.failureRedirectUrl,
    should_send_email: false,
    // Allow GCash, Maya, OTC, credit/debit cards
    payment_methods: ["GCASH", "PAYMAYA", "BPI", "RCBC", "CREDIT_CARD", "DD_BPI", "DD_RCBC", "OTC"],
  };

  if (params.items && params.items.length > 0) {
    body.items = params.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category ?? "Auto Parts",
    }));
  }

  const response = await fetch(`${XENDIT_BASE_URL}/v2/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `Xendit invoice creation failed: ${response.status} — ${JSON.stringify(err)}`
    );
  }

  return response.json() as Promise<XenditInvoice>;
}

/**
 * Retrieves an existing invoice by Xendit invoice ID.
 */
export async function getXenditInvoice(invoiceId: string): Promise<XenditInvoice> {
  const response = await fetch(`${XENDIT_BASE_URL}/v2/invoices/${invoiceId}`, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Xendit get invoice failed: ${response.status} — ${JSON.stringify(err)}`);
  }

  return response.json() as Promise<XenditInvoice>;
}

/**
 * Validates the Xendit webhook callback token from request headers.
 */
export function validateXenditWebhookToken(headerToken: string | null): boolean {
  const expected = process.env.XENDIT_WEBHOOK_TOKEN;
  if (!expected) {
    console.warn("XENDIT_WEBHOOK_TOKEN is not set — skipping webhook validation");
    return true; // Allow in dev if token not configured
  }
  return headerToken === expected;
}
