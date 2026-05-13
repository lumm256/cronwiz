import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | cronwiz.dev",
  description: "Privacy policy for cronwiz.dev — how we handle your data.",
  alternates: { canonical: "https://cronwiz.dev/privacy" },
}

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: May 13, 2026</p>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <h2 className="text-xl font-semibold text-foreground">1. What we collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-foreground">Cron inputs:</strong> The text you type into our generator, explainer, and validator is sent to our API for processing. We do not store these inputs after the request completes.</li>
          <li><strong className="text-foreground">Email address:</strong> If you join our waitlist, we store your email address in our Resend audience to notify you about product launches.</li>
          <li><strong className="text-foreground">Analytics:</strong> We use Vercel Analytics to collect anonymous, aggregated usage data (page views, device type, country). No personal identifiers are tracked.</li>
          <li><strong className="text-foreground">IP address:</strong> Temporarily used for rate limiting (10 requests per minute). Not stored permanently.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">2. What we do NOT collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We do not use cookies for tracking</li>
          <li>We do not sell or share your data with third parties</li>
          <li>We do not use advertising trackers</li>
          <li>We do not require account creation to use our free tools</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">3. Third-party services</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-foreground">Vercel:</strong> Hosting and analytics (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy policy</a>)</li>
          <li><strong className="text-foreground">kie.ai:</strong> AI processing via Claude (<a href="https://kie.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">kie.ai</a>)</li>
          <li><strong className="text-foreground">Resend:</strong> Email delivery (<a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy policy</a>)</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">4. Data retention</h2>
        <p>
          Waitlist emails are retained until you unsubscribe or request deletion. Cron inputs are processed in memory and not persisted. Analytics data is retained per Vercel&apos;s standard policy.
        </p>

        <h2 className="text-xl font-semibold text-foreground">5. Your rights</h2>
        <p>
          You can request deletion of your email from our waitlist at any time by emailing{" "}
          <a href="mailto:hi@cronwiz.dev" className="text-primary hover:underline">hi@cronwiz.dev</a>.
        </p>

        <h2 className="text-xl font-semibold text-foreground">6. Changes</h2>
        <p>
          We may update this policy as our product evolves. Material changes will be announced via our waitlist email.
        </p>

        <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
        <p>
          Questions? Email{" "}
          <a href="mailto:hi@cronwiz.dev" className="text-primary hover:underline">hi@cronwiz.dev</a>.
        </p>
      </div>
    </>
  )
}
