import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * MyFatoorah Payment Webhook Handler
 *
 * Flow:
 * 1. Verify HMAC signature
 * 2. Check idempotency (skip if already processed)
 * 3. Update order payment_status → confirmed
 * 4. Update order_status → confirmed
 * 5. Release stock reservation → deduct from product_variants.stock_quantity
 * 6. Send confirmation email via Resend
 * 7. Trigger revalidateTag for admin dashboard
 * 8. Log to audit_log
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("MyFatoorah-Signature") || "";

    // ── Step 1: Verify HMAC signature ──
    const secret = process.env.MYFATOORAH_WEBHOOK_SECRET;
    if (!secret) {
      console.error("MYFATOORAH_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid MyFatoorah webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);

    // ── Step 2: Idempotency check ──
    const transactionId = payload?.Data?.InvoiceId || payload?.Data?.PaymentId;
    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    // TODO: Check if this transaction has already been processed
    // const existing = await db.from('payments').select().eq('transaction_id', transactionId).single();
    // if (existing.data) return NextResponse.json({ message: 'Already processed' }, { status: 200 });

    // ── Steps 3–8: Process payment ──
    // TODO: Implement full payment processing flow
    // This will be built in Phase 2 (Checkout & Orders)

    console.log(`MyFatoorah webhook received: Transaction ${transactionId}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("MyFatoorah webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
