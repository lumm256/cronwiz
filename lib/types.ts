/**
 * Types matching the CRON_SYSTEM_PROMPT output schema.
 * Keep in sync with lib/prompts/cron-system.ts
 */

export type Platform =
  | "linux"
  | "aws"
  | "kubernetes"
  | "quartz"
  | "spring"
  | "github_actions"
  | "vercel"
  | "cloudflare_workers"
  | "salesforce"
  | "azure_functions"

export type SupportStatus = "native" | "workaround" | "unsupported"

export type InputType = "nl_to_cron" | "cron_to_nl" | "validation"

export interface FieldMeaning {
  value: string
  meaning: string
}

export interface CronExpression {
  platform: Platform
  code: string
  extra_lines: string[]
  support_status: SupportStatus
  workaround_hint: string | null
  platform_specific_warnings: string[]
  frequency_summary: string
}

export interface CronAnalysis {
  input_type: InputType
  intent_summary: string
  is_valid: boolean
  is_impossible_for_cron: boolean
  impossibility_reason: string | null
  validation_errors: string[]
  did_you_mean: Array<{ label: string; expression: string }>
  expressions: CronExpression[]
  human_readable: string
  /** 0-2 plain-language gotchas about this specific pattern */
  common_mistakes: string[]
}

/** Visual mapping used by ResultCard / cron-tool */
export const PLATFORM_LABELS: Record<Platform, string> = {
  linux: "Linux crontab",
  aws: "AWS EventBridge",
  kubernetes: "Kubernetes",
  quartz: "Quartz",
  spring: "Spring",
  github_actions: "GitHub Actions",
  vercel: "Vercel",
  cloudflare_workers: "Cloudflare Workers",
  salesforce: "Salesforce",
  azure_functions: "Azure Functions",
}

/** Default platforms shown after generate (top 7 most common) */
export const DEFAULT_VISIBLE_PLATFORMS: Platform[] = [
  "linux",
  "aws",
  "kubernetes",
  "github_actions",
  "vercel",
  "quartz",
  "cloudflare_workers",
]
