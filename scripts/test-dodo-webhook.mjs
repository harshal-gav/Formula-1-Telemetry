#!/usr/bin/env node

/**
 * Dodo Payments Webhook Local Testing Script
 * Signs a test payload with Svix HMAC-SHA256 and dispatches to localhost:3000/api/dodo/webhook
 * 
 * Usage:
 *   node scripts/test-dodo-webhook.mjs [options]
 * 
 * Options:
 *   --uid <firebase_uid>       Target user Firebase UID (default: test_uid_12345)
 *   --event <event_type>       Event type: subscription.active | subscription.cancelled (default: subscription.active)
 *   --secret <signing_secret>  DODO_WEBHOOK_SECRET (default: whsec_test_secret_for_local_dev)
 *   --url <endpoint_url>       Webhook URL (default: http://localhost:3000/api/dodo/webhook)
 */

import crypto from "node:crypto";

const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : defaultValue;
}

const uid = getArg("--uid", "test_user_uid_123");
const eventType = getArg("--event", "subscription.active");
const secret = getArg("--secret", process.env.DODO_WEBHOOK_SECRET || "whsec_test_secret_for_local_dev");
const url = getArg("--url", "http://localhost:3000/api/dodo/webhook");

const webhookId = `msg_${Date.now()}`;
const timestamp = Math.floor(Date.now() / 1000).toString();

const payloadObject = {
  business_id: "bus_test_formula1",
  type: eventType,
  timestamp: new Date().toISOString(),
  data: {
    subscription_id: `sub_${Date.now()}`,
    status: eventType === "subscription.active" ? "active" : "cancelled",
    product_id: "pdt_f1pro_monthly",
    price_id: "prc_monthly_999",
    next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      customer_id: `cus_${Date.now()}`,
      email: "driver@formula-analytics.com",
      name: "Test Driver",
    },
    metadata: {
      uid: uid,
      metadata_uid: uid,
    },
  },
};

const rawBody = JSON.stringify(payloadObject);

// Generate Svix HMAC-SHA256 signature
// Format: HMAC-SHA256(secret_bytes, "${id}.${timestamp}.${rawBody}")
function signSvix(secretString, msgId, msgTimestamp, body) {
  // If secret starts with "whsec_", Svix strips the prefix and base64-decodes the rest
  let keyBytes;
  if (secretString.startsWith("whsec_")) {
    const b64 = secretString.slice("whsec_".length);
    keyBytes = Buffer.from(b64, "base64");
  } else {
    keyBytes = Buffer.from(secretString, "utf8");
  }

  const toSign = `${msgId}.${msgTimestamp}.${body}`;
  const hmac = crypto.createHmac("sha256", keyBytes);
  hmac.update(toSign);
  const signature = hmac.digest("base64");
  return `v1,${signature}`;
}

const signature = signSvix(secret, webhookId, timestamp, rawBody);

console.log("-----------------------------------------------------------------");
console.log("🏎️  Dispatching Test Dodo Webhook to:", url);
console.log("Event Type :", eventType);
console.log("Target UID :", uid);
console.log("Webhook-Id :", webhookId);
console.log("-----------------------------------------------------------------");

try {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "webhook-id": webhookId,
      "webhook-timestamp": timestamp,
      "webhook-signature": signature,
    },
    body: rawBody,
  });

  const responseText = await response.text();
  console.log(`Response Status: ${response.status} ${response.statusText}`);
  console.log(`Response Body  :`, responseText);
  console.log("-----------------------------------------------------------------");
  if (response.ok) {
    console.log("✅ Webhook delivered and accepted successfully!");
  } else {
    console.log("❌ Webhook returned an error status.");
  }
} catch (error) {
  console.error("Failed to connect to endpoint:", error.message);
  console.log("Tip: Ensure your Next.js server is running ('npm run dev') at", url);
}

