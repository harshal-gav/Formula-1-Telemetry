/**
 * Dodo Payments Client Utilities (Browser-Side)
 * Handles Hosted Checkout redirection and Customer Portal URL generation
 */

const DODO_ENV = process.env.NEXT_PUBLIC_DODO_ENV || "test";
const DODO_PRODUCT_ID = process.env.NEXT_PUBLIC_DODO_PRODUCT_ID || "pdt_f1pro_monthly";
const DODO_BUSINESS_ID = process.env.NEXT_PUBLIC_DODO_BUSINESS_ID || "bus_demo123";

export interface CreateCheckoutUrlOptions {
  uid: string;
  email: string;
  returnUrl?: string;
  productId?: string;
}

export const dodo = {
  /**
   * Generates a Dodo Payments Hosted Checkout URL with metadata query parameters
   * according to official Dodo Payments specification:
   * 'metadata_*' query params are automatically saved to session/subscription metadata.
   */
  getCheckoutUrl({
    uid,
    email,
    returnUrl,
    productId = DODO_PRODUCT_ID,
  }: CreateCheckoutUrlOptions): string {
    const isTest = DODO_ENV !== "live";
    const baseUrl = isTest
      ? `https://test.checkout.dodopayments.com/buy/${productId}`
      : `https://checkout.dodopayments.com/buy/${productId}`;

    const defaultReturnUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/account?payment=success`
        : "http://localhost:3000/account?payment=success";

    const params = new URLSearchParams({
      email: email,
      metadata_uid: uid,
      metadata_userId: uid,
      metadata_email: email,
      redirect_url: returnUrl || defaultReturnUrl,
    });

    return `${baseUrl}?${params.toString()}`;
  },

  /**
   * Generates the Dodo Customer Portal login URL for an authenticated user.
   */
  getCustomerPortalUrl(email?: string | null): string {
    const isTest = DODO_ENV !== "live";
    const baseUrl = isTest
      ? `https://test.customer.dodopayments.com/login/${DODO_BUSINESS_ID}`
      : `https://customer.dodopayments.com/login/${DODO_BUSINESS_ID}`;

    if (email) {
      return `${baseUrl}?email=${encodeURIComponent(email)}`;
    }
    return baseUrl;
  },

  /**
   * Directly opens checkout in the current or new tab
   */
  redirectToCheckout(options: CreateCheckoutUrlOptions): void {
    if (typeof window === "undefined") return;
    const url = this.getCheckoutUrl(options);
    window.location.href = url;
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

