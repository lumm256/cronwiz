import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cron Not Working? A Debugging Checklist for Every Platform (2026) | cronwiz.dev",
  description: "Cron not working on Linux, AWS, Kubernetes, or GitHub Actions? Walk through this platform-specific debugging checklist to find and fix the issue.",
  alternates: { canonical: "https://cronwiz.dev/blog/cron-not-working" },
  openGraph: {
    title: "Cron Not Working? A Debugging Checklist for Every Platform",
    description: "Platform-specific debugging checklist for cron issues on Linux, AWS, Kubernetes, GitHub Actions, and Vercel.",
    url: "https://cronwiz.dev/blog/cron-not-working",
    type: "article",
  },
}

export default function CronNotWorking() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
          <li>/</li>
          <li className="text-foreground truncate">Debugging Checklist</li>
        </ol>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
        Cron Not Working? A Debugging Checklist for Every Platform
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Updated May 2026 · 7 min read
      </p>

      <p className="text-muted-foreground leading-relaxed mb-6">
        When cron is not working, the symptoms are always the same: nothing happens, and there are no useful error messages. But the root cause is different depending on your platform.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        This guide is a structured debugging checklist. Jump to your platform or read through all of them.
      </p>

      <hr className="border-border mb-8" />

      {/* Linux */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        Linux Crontab
      </h2>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-3 mb-6">
        <li>
          <strong className="text-foreground">Is the cron daemon running?</strong>
          <br />Run <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">systemctl status cron</code>. If stopped, start it with <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">systemctl start cron</code>.
        </li>
        <li>
          <strong className="text-foreground">Is the syntax valid?</strong>
          <br />Paste your expression into <Link href="/validate" className="text-primary hover:underline">our validator</Link>. Even one extra space can break it.
        </li>
        <li>
          <strong className="text-foreground">Check the logs.</strong>
          <br /><code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">grep CRON /var/log/syslog</code> (Debian/Ubuntu) or <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">journalctl -u cron</code> (systemd). If no entries appear at the expected time, the expression itself is the issue.
        </li>
        <li>
          <strong className="text-foreground">Does the script run manually?</strong>
          <br />Run it by hand: <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">/bin/bash /path/to/script.sh</code>. If it fails, fix the script before blaming cron.
        </li>
        <li>
          <strong className="text-foreground">PATH and environment.</strong>
          <br />Cron runs with minimal PATH. Use absolute paths everywhere. Add <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">PATH=/usr/local/bin:/usr/bin:/bin</code> at the top of your crontab.
        </li>
        <li>
          <strong className="text-foreground">Output redirection.</strong>
          <br />Add <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">&gt;&gt; /tmp/cron.log 2&gt;&amp;1</code> to your cron command to capture errors.
        </li>
      </ol>

      {/* AWS */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        AWS EventBridge (CloudWatch Events)
      </h2>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-3 mb-6">
        <li>
          <strong className="text-foreground">Is it a 6-field expression?</strong>
          <br />AWS uses <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">min hour dom month dow year</code>. A 5-field Linux expression will be rejected or misinterpreted.
        </li>
        <li>
          <strong className="text-foreground">Did you use ? correctly?</strong>
          <br />AWS requires <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">?</code> in either day-of-month or day-of-week. Using <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">*</code> in both is an error.
        </li>
        <li>
          <strong className="text-foreground">Everything is UTC.</strong>
          <br />AWS EventBridge does not support timezones. If your rule says 9:00, it means 9:00 UTC. Period.
        </li>
        <li>
          <strong className="text-foreground">Is the rule enabled?</strong>
          <br />Check the rule state in the EventBridge console. Rules can be disabled without deletion.
        </li>
        <li>
          <strong className="text-foreground">Check target permissions.</strong>
          <br />The rule might fire but the target (Lambda, SQS, etc.) might not have the right IAM permissions to execute.
        </li>
      </ol>

      {/* Kubernetes */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        Kubernetes CronJob
      </h2>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-3 mb-6">
        <li>
          <strong className="text-foreground">Check CronJob status.</strong>
          <br /><code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">kubectl get cronjob &lt;name&gt;</code> — look at the LAST SCHEDULE and ACTIVE columns.
        </li>
        <li>
          <strong className="text-foreground">Is the job suspended?</strong>
          <br />Check <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">spec.suspend</code>. If true, the CronJob exists but never creates Jobs.
        </li>
        <li>
          <strong className="text-foreground">timeZone requires v1.27+.</strong>
          <br />If you set <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">timeZone: America/New_York</code> on an older cluster, it is silently ignored and the job runs in UTC.
        </li>
        <li>
          <strong className="text-foreground">Container image pull errors.</strong>
          <br /><code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">kubectl describe job &lt;job-name&gt;</code> — look for ImagePullBackOff or CrashLoopBackOff.
        </li>
        <li>
          <strong className="text-foreground">Concurrency policy.</strong>
          <br />If set to <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">Forbid</code> and a previous run is still active, new runs are skipped silently.
        </li>
      </ol>

      {/* GitHub Actions */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        GitHub Actions
      </h2>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-3 mb-6">
        <li>
          <strong className="text-foreground">UTC only.</strong>
          <br />GitHub Actions schedule always runs in UTC. There is no timezone setting.
        </li>
        <li>
          <strong className="text-foreground">5-minute minimum, plus jitter.</strong>
          <br />Jobs can be delayed 5-30 minutes under load. If your workflow requires precise timing, GitHub Actions is not the right tool.
        </li>
        <li>
          <strong className="text-foreground">Disabled after 60 days of inactivity.</strong>
          <br />If the repository has no commits or activity for 60 days, scheduled workflows are automatically disabled.
        </li>
        <li>
          <strong className="text-foreground">Must be on default branch.</strong>
          <br />Schedule triggers only work on the default branch (usually <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">main</code>). A schedule in a feature branch does nothing.
        </li>
      </ol>

      {/* Vercel */}
      <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">
        Vercel Cron
      </h2>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-3 mb-6">
        <li>
          <strong className="text-foreground">Check your plan.</strong>
          <br />Hobby: 1 cron/day max. Pro: 1-min minimum interval.
        </li>
        <li>
          <strong className="text-foreground">vercel.json must be correct.</strong>
          <br />Cron jobs are defined in <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">vercel.json</code> under <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">crons</code>. Syntax errors in the file silently disable cron.
        </li>
        <li>
          <strong className="text-foreground">UTC only.</strong>
          <br />Vercel cron runs in UTC. No timezone support.
        </li>
        <li>
          <strong className="text-foreground">Function timeout.</strong>
          <br />The API route invoked by the cron must complete within the function timeout (Hobby: 10s, Pro: 60s).
        </li>
      </ol>

      <hr className="border-border my-10" />

      <h2 className="text-xl font-semibold text-foreground mb-4">
        Universal Debugging Steps
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Regardless of platform:
      </p>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mb-6">
        <li><Link href="/explain" className="text-primary hover:underline">Explain the expression</Link> — make sure it means what you think</li>
        <li><Link href="/test" className="text-primary hover:underline">Preview the next 10 runs</Link> — confirm the dates make sense</li>
        <li><Link href="/validate" className="text-primary hover:underline">Validate across platforms</Link> — catch syntax differences</li>
        <li>Check logs for silent failures (permission, network, timeout)</li>
        <li>Simplify first: test with <code className="text-primary bg-code-bg px-1.5 py-0.5 rounded text-sm">* * * * *</code> to confirm the mechanism works, then refine</li>
      </ol>

      <p className="text-muted-foreground leading-relaxed">
        Want automated monitoring for all your cron jobs? <Link href="/#waitlist" className="text-primary hover:underline">Join the cronwiz waitlist</Link> — we are building AI-powered cron monitoring that alerts you in plain English when jobs miss, fail, or slow down.
      </p>
    </>
  )
}
