#!/usr/bin/env node

/**
 * Dodo Payments Webhook Local Testing Script
 * Signs a test payload using official Svix and dispatches to localhost:3000/api/dodo/webhook
 */

import { Webhook } from "svix";

const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : defaultValue;
}

const uid = getArg("--uid", "test_user_uid_123");
const eventType = getArg("--event", "subscription.active");
// Standard Svix test secret
const secret = getArg("--secret", process.env.DODO_WEBHOOK_SECRET || "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw");
const url = getArg("--url", "http://localhost:3000/api/dodo/webhook");

const webhookId = `msg_${Date.now()}`;
const timestampDate = new Date();

const payloadObject = {
  business_id: "bus_test_formula1",
  type: eventType,
  timestamp: timestampDate.toISOString(),
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

let signature;
try {
  const wh = new Webhook(secret);
  signature = wh.sign(webhookId, timestampDate, rawBody);
} catch (err) {
  console.error("Svix signing failed:", err.message);
  process.exit(1);
}

const timestampSeconds = Math.floor(timestampDate.getTime() / 1000).toString();

console.log("-----------------------------------------------------------------");
console.log("🏎️  Dispatching Test Dodo Webhook to:", url);
console.log("Event Type :", eventType);
console.log("Target UID :", uid);
console.log("Webhook-Id :", webhookId);
console.log("Signature  :", signature);
console.log("-----------------------------------------------------------------");

try {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "webhook-id": webhookId,
      "webhook-timestamp": timestampSeconds,
      "webhook-signature": signature,
    },
    body: rawBody,
  });

  const responseText = await response.text();
  console.log(`Response Status: ${response.status} ${response.statusText}`);
  console.log(`Response Body  :`, responseText);
  console.log("-----------------------------------------------------------------");
  if (response.ok) {
    console.log("✅ Webhook signature verified and event processed successfully!");
  } else {
    console.log("ℹ️  Response:", responseText);
  }
} catch (error) {
  console.error("Failed to connect to endpoint:", error.message);
}
