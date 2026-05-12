import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  // Don't throw at module load — just warn. Lets the rest of the app build/run.
  console.warn("[resend] RESEND_API_KEY is not set. Waitlist will fail.")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Address user-facing emails come from. Should be a real inbox you can read.
export const RESEND_FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS || "onboarding@resend.dev"

// Address owner-facing notifications come from. noreply is fine here — you
// don't reply to your own internal alerts. Falls back to FROM_ADDRESS if unset.
export const RESEND_NOTIFY_FROM_ADDRESS =
  process.env.RESEND_NOTIFY_FROM_ADDRESS || RESEND_FROM_ADDRESS

export const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || ""

export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || ""
