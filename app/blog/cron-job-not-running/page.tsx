import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Why Is My Cron Job Not Running? 8 Causes & Fixes (2026) | cronwiz.dev",
  description: "Your cron job isn't firing? Here are the 8 most common reasons — from timezone mismatches to platform-specific limits — and how to fix each one.",
  alternates: { canonical: "https://cronwiz.dev/blog/cron-job-not-running" },
  openGraph: {
    title: "Why Is My Cron Job Not Running? 8 Causes & Fixes",
    description: "The 8 most common reasons your scheduled job silently fails — and how to fix each one.",
    url: "https://cronwiz.dev/blog/cron-job-not-running",
    type: "article",
  },
}

export default function CronJobNotRunning() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
          <li>/</li>
          <li className="text-foreground truncate">8 Causes & Fixes</li>
        </ol>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
        Why Is My Cron Job Not Running? 8 Causes & Fixes
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Updated May 2026 · 6 min read
      </p>

      <p className="text-muted-foreground leading-relaxed mb-6">
        You wrote the expression, deployed the job, and... nothing happened. Your cron job is not running and there are no errors in the logs. This is one of the most frustrating debugging experiences because cron failures are almost always <strong className="text-foreground">silent</strong>.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Here are the 8 most common causes, ordered from most to least frequent, based on real questions from r/sysadmin, r/devops, and Stack Overflow.
      </p>

      <hr className="border-border mb-8" />

      {/* Cause 1 */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        1. Timezone Mismatch
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        This is the #1 cause. You write <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">0 9 * * *</code> expecting 9am your local time, but the server runs in UTC. Your job fires at 9am UTC — which might be 1am or 4am in your timezone.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Platforms affected:</strong> GitHub Actions (UTC only), AWS EventBridge (UTC only), Vercel (UTC only). Linux crontab and Kubernetes v1.27+ let you set a timezone.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Fix:</strong> Always convert to UTC explicitly. Use <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">TZ=America/New_York</code> on Linux, or <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">timeZone: America/New_York</code> in Kubernetes CronJob spec.
      </p>

      {/* Cause 2 */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        2. Day-of-Week Numbering Confusion
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Linux crontab uses 0=Sunday (or 7=Sunday). Quartz and Spring use 1=Sunday, 2=Monday. If you set <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">5</code> for Friday on Linux, it works. On Quartz, <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">5</code> means Thursday.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Fix:</strong> Use 3-letter abbreviations (<code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">MON</code>, <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">FRI</code>) when the platform supports them — they are unambiguous.
      </p>

      {/* Cause 3 */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        3. Platform-Specific Minimum Intervals
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Some platforms silently reject or throttle cron jobs below their minimum interval:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
        <li><strong className="text-foreground">GitHub Actions:</strong> 5-minute minimum. <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">*/1 * * * *</code> is accepted but only fires every ~5 min</li>
        <li><strong className="text-foreground">Vercel Hobby:</strong> 1 cron job per day maximum</li>
        <li><strong className="text-foreground">Vercel Pro:</strong> Minimum 1-minute intervals</li>
        <li><strong className="text-foreground">Cloudflare Workers Free:</strong> Max 3 triggers per Worker</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Fix:</strong> Check your plan limits before deploying. <Link href="/validate" className="text-primary hover:underline">Our validator</Link> warns about these automatically.
      </p>

      {/* Cause 4 */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        4. AWS Day-of-Month vs Day-of-Week Conflict
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        AWS EventBridge (and Quartz) require a <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">?</code> in either day-of-month or day-of-week. Using <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">*</code> in both is an error — but on Linux it is perfectly valid.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Fix:</strong> If you target AWS, replace the unused field with <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">?</code>. Example: <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">0 9 * * ?</code> (every day at 9am, day-of-week ignored).
      </p>

      {/* Cause 5 */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        5. DST Transitions
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        A job scheduled at 2:30am might run <strong className="text-foreground">twice</strong> during fall-back or <strong className="text-foreground">skip entirely</strong> during spring-forward, depending on how the platform handles timezone transitions.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Fix:</strong> Schedule critical jobs at times that are not affected by DST (e.g., 4am or noon). Or use UTC-only platforms.
      </p>

      {/* Cause 6 */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        6. Impossible Dates Accepted Silently
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">0 0 31 2 *</code> (February 31st) is syntactically valid on most platforms but will <strong className="text-foreground">never</strong> fire. The system accepts it without warning.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Fix:</strong> Test your expression with a <Link href="/test" className="text-primary hover:underline">next-run previewer</Link> to verify it actually produces future dates.
      </p>

      {/* Cause 7 */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        7. Script Permissions or PATH Issues
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        On Linux, cron runs with a minimal environment. Your script might rely on <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">PATH</code> entries, environment variables, or file permissions that are set in your interactive shell but not in cron.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Fix:</strong> Use absolute paths in your cron command. Set <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">PATH=/usr/local/bin:/usr/bin:/bin</code> at the top of your crontab. Check that the script has execute permissions.
      </p>

      {/* Cause 8 */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        8. The Cron Daemon Is Not Running
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        On Linux servers, the cron daemon (<code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">crond</code> or <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">cron</code>) might be stopped or disabled. Docker containers often do not include a cron daemon by default.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Fix:</strong> Run <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">systemctl status cron</code> (or <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">service cron status</code>) to verify. In Docker, install and start cron explicitly or use the platform&apos;s native scheduler.
      </p>

      <hr className="border-border my-10" />

      <h2 className="text-xl font-semibold text-foreground mb-4">
        Still Stuck?
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Paste your expression into <Link href="/explain" className="text-primary hover:underline">our cron explainer</Link> to see exactly what it means, or use the <Link href="/validate" className="text-primary hover:underline">cross-platform validator</Link> to check if your syntax is correct for your target platform.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        If you want to get alerted when your cron jobs miss their schedule, <Link href="/#waitlist" className="text-primary hover:underline">join the waitlist</Link> for cronwiz AI Cron Monitoring — launching Q3 2026 at $5/month.
      </p>
    </>
  )
}
