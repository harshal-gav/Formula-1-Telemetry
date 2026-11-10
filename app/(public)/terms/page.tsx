import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service and User Agreement for Formula 1 Telemetry.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-zinc-300 w-full max-w-full overflow-hidden">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <span className="text-xs font-mono uppercase text-racing-red font-bold tracking-wider">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          Last Updated: 2026 • Effective Date: 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Intellectual Property & Brand Disclaimer</h2>
          <p>
            Formula 1 Telemetry (operating at formula1telemetry.com) is an independent platform developed for statistical research, motorsport telemetry visualization, and educational purposes.
          </p>
          <p className="text-xs bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-zinc-400">
            This platform is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with Formula 1, the FIA (Fédération Internationale de l&apos;Automobile), Formula One Licensing B.V., Formula One World Championship Limited, or any of their subsidiaries or affiliates. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are registered trademarks of Formula One Licensing B.V.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Acceptance of Terms</h2>
          <p>
            By accessing or using formula1telemetry.com (&quot;the Service&quot;), creating an account, or subscribing to our Pro analytics tier, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Services & Data Feeds</h2>
          <p>
            The Service provides race calendars, lap charts, telemetry traces, tyre degradation simulations, and AI heuristic predictions. All historical and telemetry data is provided &quot;as is&quot; for statistical and research purposes without warranties of real-time accuracy or completeness.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Subscriptions & Billing</h2>
          <p>
            The Pro subscription ($9.99 USD per month) provides access to advanced engineering tools, telemetry comparisons, and predictive heuristics. Billing and payment processing are securely handled by our PCI-DSS Level 1 compliant payment processor.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs font-mono text-zinc-400">
            <li>Subscriptions automatically renew every month unless cancelled before the renewal date.</li>
            <li>You can cancel your subscription at any time directly through the Refund & Cancellation page.</li>
            <li>All prices are exclusive of applicable local taxes (VAT/GST/Sales tax) calculated at checkout.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Account Security</h2>
          <p>
            You are responsible for safeguarding your login credentials. You agree not to share your account or attempt to bypass subscription security controls.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">6. Limitation of Liability</h2>
          <p>
            In no event shall Formula 1 Telemetry or its operators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Service or reliance on any telemetry calculations or outcome predictions.
          </p>
        </section>
      </div>
    </div>
  );
}
