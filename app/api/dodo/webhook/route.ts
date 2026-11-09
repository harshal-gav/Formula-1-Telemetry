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
    status?: string;
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

  // 1. Extract raw body text and headers for Svix verification
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

    // Retrieve UID from metadata (prefixed or direct)
    let uid = metadata.uid || metadata.metadata_uid || metadata.userId;

    // Fallback: If UID not directly in metadata, search user by email
    const customerEmail = data.customer?.email;
    if (!uid && customerEmail) {
      const usersQuery = await db
        .collection("users")
        .where("email", "==", customerEmail)
        .limit(1)
        .get();

      if (!usersQuery.empty) {
        uid = usersQuery.docs[0].id;
      }
    }

    if (!uid) {
      console.warn("Dodo webhook received without matching user UID:", eventType, customerEmail);
      return NextResponse.json(
        { warning: "User not found for subscription event", eventType },
        { status: 200 }
      );
    }

    const userRef = db.collection("users").doc(uid);

    switch (eventType) {
      case "subscription.active":
      case "subscription.renewed": {
        const currentPeriodEnd =
          data.next_billing_date ||
          data.current_period_end ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        await userRef.set(
          {
            plan: "pro",
            status: "active",
            subscriptionId: data.subscription_id || null,
            customerId: data.customer?.customer_id || null,
            productId: data.product_id || null,
            currentPeriodEnd,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log(`[Dodo Webhook] Activated Pro subscription for user: ${uid}`);
        break;
      }

      case "subscription.cancelled": {
        await userRef.set(
          {
            status: "cancelled",
            plan: "free",
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log(`[Dodo Webhook] Cancelled subscription for user: ${uid}`);
        break;
      }

      case "subscription.failed":
      case "subscription.on_hold": {
        await userRef.set(
          {
            status: "past_due",
            plan: "free",
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log(`[Dodo Webhook] Subscription marked past_due for user: ${uid}`);
        break;
      }

      case "payment.succeeded": {
        console.log(`[Dodo Webhook] Payment succeeded for subscription: ${data.subscription_id}`);
        break;
      }

      default:
        console.log(`[Dodo Webhook] Unhandled event type: ${eventType}`);
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

