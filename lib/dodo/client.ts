/**
 * Dodo Payments Client Utilities (Browser-Side)
 * Handles Streamlined Hosted Checkout redirection and Customer Portal URL generation
 */

const DODO_ENV = process.env.NEXT_PUBLIC_DODO_ENV || "live";
const DODO_PRODUCT_ID = process.env.NEXT_PUBLIC_DODO_PRODUCT_ID || "pdt_0Nrc4RnF3tw1VPyaV9mdL";
const DODO_BUSINESS_ID = process.env.NEXT_PUBLIC_DODO_BUSINESS_ID || "bus_0Nrc40wuqB1Gqg18ZsuvV";

export interface CreateCheckoutUrlOptions {
  uid: string;
  email: string;
  name?: string;
  returnUrl?: string;
  productId?: string;
}

export const dodo = {
  /**
   * Generates a streamlined Dodo Payments fallback Hosted Checkout URL
   * with minimalAddress=true, prefilled fullName and email, and metadata.
   */
  getCheckoutUrl({
    uid,
    email,
    name,
    returnUrl,
    productId = DODO_PRODUCT_ID,
  }: CreateCheckoutUrlOptions): string {
    const isTest = DODO_ENV === "test";
    const baseUrl = isTest
      ? `https://test.checkout.dodopayments.com/buy/${productId}`
      : `https://checkout.dodopayments.com/buy/${productId}`;

    const defaultReturnUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/account?payment=success`
        : "https://www.formula1telemetry.com/account?payment=success";

    const customerName =
      name && name.trim().length > 0
        ? name.trim()
        : email.split("@")[0] || "Formula 1 Pro Member";

    const params = new URLSearchParams({
      email: email,
      fullName: customerName,
      minimalAddress: "true",
      metadata_uid: uid,
      metadata_userId: uid,
      metadata_email: email,
      redirect_url: returnUrl || defaultReturnUrl,
    });

    return `${baseUrl}?${params.toString()}`;
  },

  /**
   * Creates an optimized server-side Checkout Session via /api/dodo/checkout.
   * Strips out name, email, phone number, and billing address fields so the user
   * can directly enter their card or Apple Pay/Google Pay and pay instantly.
   */
  async createCheckoutSession(options: CreateCheckoutUrlOptions): Promise<string> {
    try {
      const res = await fetch("/api/dodo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: options.uid,
          email: options.email,
          name: options.name,
          returnUrl: options.returnUrl,
          productId: options.productId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          return data.checkoutUrl;
        }
      }
    } catch (err) {
      console.warn("[Dodo Client] Failed to create dynamic checkout session, falling back to static URL:", err);
    }

    return this.getCheckoutUrl(options);
  },

  /**
   * Initiates streamlined checkout by requesting a session and redirecting.
   */
  async redirectToCheckout(options: CreateCheckoutUrlOptions): Promise<void> {
    if (typeof window === "undefined") return;
    const checkoutUrl = await this.createCheckoutSession(options);
    window.location.href = checkoutUrl;
  },

  /**
   * Generates the Dodo Customer Portal login URL for an authenticated user.
   */
  getCustomerPortalUrl(email?: string | null): string {
    const isTest = DODO_ENV === "test";
    const baseUrl = isTest
      ? `https://test.customer.dodopayments.com/login/${DODO_BUSINESS_ID}`
      : `https://customer.dodopayments.com/login/${DODO_BUSINESS_ID}`;

    if (email) {
      return `${baseUrl}?email=${encodeURIComponent(email)}`;
    }
    return baseUrl;
  },

  /**
   * Opens Customer Portal in a new tab
   */
  openCustomerPortal(email?: string | null): void {
    if (typeof window === "undefined") return;
    const url = this.getCustomerPortalUrl(email);
    window.open(url, "_blank", "noopener,noreferrer");
  },
};
