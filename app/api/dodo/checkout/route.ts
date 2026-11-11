import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { uid, email, name, returnUrl, productId } = body;

    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const env = process.env.NEXT_PUBLIC_DODO_ENV || "live";
    const defaultProductId =
      process.env.DODO_PRODUCT_ID ||
      process.env.NEXT_PUBLIC_DODO_PRODUCT_ID ||
      "pdt_0Nrc4RnF3tw1VPyaV9mdL";

    const targetProductId = productId || defaultProductId;
    const isLive = env === "live" || (apiKey && apiKey.startsWith("dodo_live_"));
    const apiBase = isLive
      ? "https://live.dodopayments.com"
      : "https://test.dodopayments.com";

    const host = req.headers.get("host") || "www.formula1telemetry.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const defaultReturn = `${protocol}://${host}/account?payment=success`;
    const finalReturnUrl = returnUrl || defaultReturn;

    const customerEmail = email || "subscriber@formula1telemetry.com";
    const customerName =
      name && name.trim().length > 0
        ? name.trim()
        : customerEmail.split("@")[0] || "Formula 1 Pro Member";

    // Fallback static URL with minimal address query parameters
    const staticBase = isLive
      ? `https://checkout.dodopayments.com/buy/${targetProductId}`
      : `https://test.checkout.dodopayments.com/buy/${targetProductId}`;

    const staticParams = new URLSearchParams({
      email: customerEmail,
      fullName: customerName,
      minimalAddress: "true",
      metadata_uid: uid || "",
      metadata_userId: uid || "",
      metadata_email: customerEmail,
      redirect_url: finalReturnUrl,
    });
    const fallbackUrl = `${staticBase}?${staticParams.toString()}`;

    if (!apiKey) {
      console.warn("[Dodo Checkout API] DODO_PAYMENTS_API_KEY missing, using fallback URL");
      return NextResponse.json({
        checkoutUrl: fallbackUrl,
        mode: "fallback",
      });
    }

    // Call Dodo Payments Checkout Sessions API
    // Configured to strip out name, email, phone number, and billing address fields so user can pay directly!
    const sessionPayload = {
      product_cart: [{ product_id: targetProductId, quantity: 1 }],
      return_url: finalReturnUrl,
      customer: {
        email: customerEmail,
        name: customerName,
      },
      billing: {
        country: "US",
        street: "1 Paddock Way",
        city: "Austin",
        state: "TX",
        zipcode: "78719",
      },
      minimal_address: true,
      feature_flags: {
        single_page: true,
        allow_phone_number_collection: false,
        allow_discount_code: false,
        allow_tax_id: false,
      },
      metadata: {
        uid: uid || "",
        userId: uid || "",
        email: customerEmail,
      },
    };

    const dodoRes = await fetch(`${apiBase}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionPayload),
    });

    if (!dodoRes.ok) {
      const errText = await dodoRes.text();
      console.error("[Dodo Checkout API] Session creation failed:", dodoRes.status, errText);
      return NextResponse.json({
        checkoutUrl: fallbackUrl,
        mode: "fallback",
        warning: `Dodo API responded with ${dodoRes.status}`,
      });
    }

    const data = await dodoRes.json();
    const checkoutUrl = data.checkout_url || fallbackUrl;

    return NextResponse.json({
      checkoutUrl,
      sessionId: data.session_id,
      mode: "session",
    });
  } catch (err: any) {
    console.error("[Dodo Checkout API] Unexpected error:", err.message);
    return NextResponse.json(
      { error: "Failed to initialize streamlined checkout", details: err.message },
      { status: 500 }
    );
  }
}

