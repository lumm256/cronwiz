import { z } from "zod"
import {
  resend,
  RESEND_FROM_ADDRESS,
  RESEND_AUDIENCE_ID,
  NOTIFY_EMAIL,
} from "@/lib/resend"

const waitlistSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
})

// Basic in-memory IP throttle. Resets when the serverless function cold-starts —
// good enough to stop a quick scripted flood; real rate limiting goes to Vercel KV later.
const recentIPs = new Map<string, number>()
const THROTTLE_MS = 10_000

function getIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

export async function POST(req: Request) {
  try {
    const ip = getIP(req)
    const last = recentIPs.get(ip)
    if (last && Date.now() - last < THROTTLE_MS) {
      return Response.json(
        { error: "Too many requests, slow down." },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => null)
    const parsed = waitlistSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: "Please enter a valid email." },
        { status: 400 },
      )
    }

    const { email } = parsed.data
    recentIPs.set(ip, Date.now())

    // 1. Add to Resend Audience (if configured) — gives you a real waitlist DB
    if (RESEND_AUDIENCE_ID) {
      const audienceResult = await resend.contacts.create({
        email,
        audienceId: RESEND_AUDIENCE_ID,
        unsubscribed: false,
      })
      // 422 / "already exists" is fine — dedup is desired behavior
      if (audienceResult.error && audienceResult.error.name !== "validation_error") {
        console.error("[waitlist] audience error:", audienceResult.error)
      }
    }

    // 2. Send confirmation email to the user
    const confirmResult = await resend.emails.send({
      from: `cronwiz <${RESEND_FROM_ADDRESS}>`,
      to: email,
      subject: "You're on the cronwiz waitlist",
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
          <div style="display: inline-block; padding: 4px 10px; border-radius: 6px; background: #10b981; color: white; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; margin-bottom: 24px;">YOU'RE IN</div>
          <h1 style="font-size: 22px; margin: 0 0 16px; font-weight: 600;">Welcome to cronwiz</h1>
          <p style="margin: 0 0 16px; line-height: 1.6; color: #334155;">Thanks for joining the cronwiz waitlist. You'll be among the first to know when <strong>AI Cron Monitoring</strong> launches — plain-English alerts for cron jobs that miss, fail, or slow down.</p>
          <p style="margin: 0 0 24px; line-height: 1.6; color: #334155;">In the meantime, the free <a href="https://cronwiz.dev" style="color: #10b981; text-decoration: none; font-weight: 500;">cron expression generator</a> is live — give it a try with "every weekday at 9am pacific time".</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">— the cronwiz.dev team</p>
        </div>
      `,
    })

    if (confirmResult.error) {
      console.error("[waitlist] confirmation send error:", confirmResult.error)
      return Response.json(
        { error: "Could not send confirmation email." },
        { status: 500 },
      )
    }

    // 3. Notify the owner (you) so you see signups land in real time
    if (NOTIFY_EMAIL && NOTIFY_EMAIL !== email) {
      await resend.emails
        .send({
          from: `cronwiz waitlist <${RESEND_FROM_ADDRESS}>`,
          to: NOTIFY_EMAIL,
          subject: `🎯 New waitlist signup: ${email}`,
          text: `${email}\n\nJoined at: ${new Date().toISOString()}\nIP: ${ip}`,
        })
        .catch((err) => {
          // Non-fatal — don't fail the user's request if owner notify fails
          console.error("[waitlist] owner notify error:", err)
        })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error("[waitlist] unexpected error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}
