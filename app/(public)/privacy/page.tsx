import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Formula 1 Telemetry. Learn how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-zinc-300 w-full max-w-full overflow-hidden">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <span className="text-xs font-mono uppercase text-racing-red font-bold tracking-wider">
          Data Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          Last Updated: 2026 • Effective Date: 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            We adhere to a strict data minimization policy. We only collect information essential to operate your user account and process subscriptions:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs font-mono text-zinc-400">
            <li><strong>Account Data:</strong> Email address, display name, and unique user identifier (UID) managed securely via encrypted user authentication.</li>
            <li><strong>Subscription Metadata:</strong> Subscription status, plan tier (&apos;free&apos; or &apos;pro&apos;), current billing period, and subscription reference identifiers.</li>
            <li><strong>Technical Analytics:</strong> Anonymized usage events and measurement logs to improve application performance and reliability.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Payment Processing & PCI-DSS Compliance</h2>
          <p>
            We do not store, process, or transmit credit card numbers or financial account information on our servers. All payment transactions are encrypted and conducted directly through an authorized, PCI-DSS Level 1 compliant merchant of record and payment processor.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Local Browser Storage</h2>
          <p>
            To optimize performance and eliminate loading latency, our application caches telemetry results and race calendar data directly inside your browser&apos;s <code className="text-xs font-mono text-zinc-300 bg-zinc-900 px-1 py-0.5 rounded">localStorage</code>. This data remains on your physical device and is never uploaded to remote databases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Data Security & Architecture</h2>
          <p>
            We employ industry-standard security protocols, strict database isolation, and end-to-end SSL/TLS encryption across all network transfers. All sensitive payment details remain tokenized and isolated from internal application systems.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Your Rights & Data Deletion</h2>
          <p>
            You have the right to request access to your personal information or request the complete deletion of your account and associated profile data at any time through your account settings.
          </p>
        </section>
      </div>
    </div>
  );
}
