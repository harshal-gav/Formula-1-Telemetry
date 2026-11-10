import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

interface DodoWebhookEvent {
  business_id?: string;
  type: string;
  timestamp: string;
  data: {
    subscription_id?: string;
    payment_id?: string;
    status?: string;
    total_amount?: number;
    currency?: string;
    customer?: {
      customer_id?: string;
      email?: string;
      name?: string;
    };
    product_id?: string;
    price_id?: string;
    next_billing_date?: string;
    current_period_end?: string;
    trial_end?: string | null;
    cancel_at_next_billing_date?: boolean;
    metadata?: Record<string, string>;
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.DODO_WEBHOOK_SECRET;

  if (!secret) {
    console.error("DODO_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret missing from environment" },
      { status: 500 }
    );
  }

  // 1. Extract raw body text and headers for Svix signature verification
  const rawBody = await req.text();
  const headers = {
    "webhook-id": req.headers.get("webhook-id") || req.headers.get("svix-id") || "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") || req.headers.get("svix-timestamp") || "",
    "webhook-signature": req.headers.get("webhook-signature") || req.headers.get("svix-signature") || "",
  };

  if (!headers["webhook-signature"] || !headers["webhook-id"]) {
    return NextResponse.json(
      { error: "Missing required webhook signature headers" },
      { status: 400 }
    );
  }

  // 2. Cryptographic signature verification
  let event: DodoWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(rawBody, headers) as DodoWebhookEvent;
  } catch (err: any) {
    console.error("Dodo webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid cryptographic signature" },
      { status: 401 }
    );
  }

  // 3. Process verified event with Firestore Admin
  try {
    const db = getAdminDb();
    const eventType = event.type;
    const data = event.data;
    const metadata = data.metadata || {};

    // 3-Tier UID resolution:
    // A) From session/checkout metadata
    let uid = metadata.uid || metadata.metadata_uid || metadata.userId;

    // B) From existing subscription ID (critical for recurring renewals & cancellation webhooks!)
    if (!uid && data.subscription_id) {
      try {
        const subQuery = await db
          .collection("users")
          .where("subscriptionId", "==", data.subscription_id)
          .limit(1)
          .get();

        if (!subQuery.empty) {
          uid = subQuery.docs[0].id;
          console.log(`[Dodo Webhook] Found user by subscriptionId ${data.subscription_id}: ${uid}`);
        }
      } catch (err: any) {
        console.warn(`[Dodo Webhook] Query by subscriptionId failed:`, err.message);
      }
    }

    // C) From customer email fallback
    const customerEmail = data.customer?.email || metadata.email || metadata.metadata_email;
    if (!uid && customerEmail) {
      try {
        const usersQuery = await db
          .collection("users")
          .where("email", "==", customerEmail)
          .limit(1)
          .get();

        if (!usersQuery.empty) {
          uid = usersQuery.docs[0].id;
          console.log(`[Dodo Webhook] Found user by email ${customerEmail}: ${uid}`);
        }
      } catch (err: any) {
        console.warn(`[Dodo Webhook] Query by email failed:`, err.message);
      }
    }

    if (!uid) {
      console.warn("[Dodo Webhook] Event received without matching user UID:", eventType, data.subscription_id, customerEmail);
      return NextResponse.json(
        { warning: "User not found for subscription event", eventType },
        { status: 200 }
      );
    }

    const userRef = db.collection("users").doc(uid);

    // Compute expiration date (from next_billing_date, current_period_end, or now + 30 days)
    const computeExpiresAt = (): string => {
      if (data.next_billing_date) {
        const nextDate = new Date(data.next_billing_date);
        if (nextDate > new Date()) {
          return nextDate.toISOString();
        }
      }
      if (data.current_period_end) {
        const endDate = new Date(data.current_period_end);
        if (endDate > new Date()) {
          return endDate.toISOString();
        }
      }
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    };

    switch (eventType) {
      case "payment.succeeded":
      case "subscription.active":
      case "subscription.renewed": {
        const currentPeriodEnd = computeExpiresAt();

        await userRef.set(
          {
            plan: "pro",
            status: "active",
            subscriptionId: data.subscription_id || null,
            customerId: data.customer?.customer_id || null,
            productId: data.product_id || null,
            currentPeriodEnd,
            cancel_at_period_end: false,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log(`[Dodo Webhook] ${eventType} -> Activated/Renewed Pro for user: ${uid} (Valid until: ${currentPeriodEnd})`);
        break;
      }

      case "subscription.updated": {
        const subStatus = data.status;
        console.log(`[Dodo Webhook] Subscription updated for user ${uid} to status: ${subStatus}`);

        if (subStatus === "active") {
          const currentPeriodEnd = computeExpiresAt();
          await userRef.set(
            {
              plan: "pro",
              status: "active",
              currentPeriodEnd,
              cancel_at_period_end: false,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } else if (subStatus === "failed") {
          await userRef.set(
            {
              plan: "free",
              status: "past_due",
              cancel_at_period_end: false,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } else if (subStatus === "expired") {
          await userRef.set(
            {
              plan: "free",
              status: "expired",
              cancel_at_period_end: false,
              currentPeriodEnd: null,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } else if (subStatus === "cancelled") {
          const userSnap = await userRef.get();
          const userData = userSnap.data();
          const now = new Date();
          const hasValidExpiry = userData?.currentPeriodEnd && new Date(userData.currentPeriodEnd) > now;

          if (hasValidExpiry && data.cancel_at_next_billing_date !== false) {
            // Keep access until the paid 30-day period concludes
            await userRef.set(
              {
                cancel_at_period_end: true,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } else {
            // Expired or immediate cancellation
            await userRef.set(
              {
                plan: "free",
                status: "cancelled",
                cancel_at_period_end: false,
                currentPeriodEnd: null,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        }
        break;
      }

      case "subscription.cancelled": {
        const userSnap = await userRef.get();
        const userData = userSnap.data();
        const now = new Date();
        const hasValidExpiry = userData?.currentPeriodEnd && new Date(userData.currentPeriodEnd) > now;

        if (hasValidExpiry) {
          // User already paid for the current 30-day period! Keep access active until currentPeriodEnd
          await userRef.set(
            {
              cancel_at_period_end: true,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          console.log(`[Dodo Webhook] Marked cancel_at_period_end for user ${uid}. Pro access remains until: ${userData.currentPeriodEnd}`);
        } else {
          await userRef.set(
            {
              plan: "free",
              status: "cancelled",
              cancel_at_period_end: false,
              currentPeriodEnd: null,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          console.log(`[Dodo Webhook] Revoked Pro access immediately for user: ${uid}`);
        }
        break;
      }

      case "subscription.expired": {
        await userRef.set(
          {
            plan: "free",
            status: "expired",
            cancel_at_period_end: false,
            currentPeriodEnd: null,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log(`[Dodo Webhook] 30-day cycle expired without renewal for user: ${uid}. Pro access revoked.`);
        break;
      }

      case "payment.failed":
      case "subscription.failed":
      case "subscription.on_hold": {
        await userRef.set(
          {
            plan: "free",
            status: "past_due",
            cancel_at_period_end: false,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log(`[Dodo Webhook] Payment failed / on hold for user: ${uid}. Pro access revoked.`);
        break;
      }

      default:
        console.log(`[Dodo Webhook] Unhandled event type: ${eventType}`);
    }

    // 4. Record transaction in Firestore audit collection
    try {
      const transactionId = data.payment_id || `${data.subscription_id || uid}_${Date.now()}`;
      await db.collection("dodo_transactions").doc(transactionId).set(
        {
          uid,
          eventType,
          subscriptionId: data.subscription_id || null,
          paymentId: data.payment_id || null,
          status: data.status || "processed",
          amount: data.total_amount || null,
          currency: data.currency || null,
          timestamp: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (auditErr: any) {
      console.warn("[Dodo Webhook] Audit log write warning:", auditErr.message);
    }

    return NextResponse.json({ success: true, eventType });
  } catch (dbErr: any) {
    console.error("Error updating Firestore from Dodo webhook:", dbErr);
    return NextResponse.json(
      { error: "Database update failed", details: dbErr.message },
      { status: 500 }
    );
  }
}
