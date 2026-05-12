import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  // Don't throw at module load — just warn. Lets the rest of the app build/run.
  console.warn("[resend] RESEND_API_KEY is not set. Waitlist will fail.")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const RESEND_FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS || "onboarding@resend.dev"

export const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || ""

export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || ""
