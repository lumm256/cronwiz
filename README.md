# cronwiz.dev

AI-powered cron expression generator, explainer, validator, and (coming soon) monitor.

Type schedules in plain English — get production-ready cron for Linux, AWS, Kubernetes, GitHub Actions, Vercel, Cloudflare Workers, and Quartz/Spring.

**Live at [cronwiz.dev](https://cronwiz.dev)**

## Features

- **Generate** — describe a schedule in plain English, get cron expressions for 7+ platforms
- **Explain** — paste any cron expression, get a plain-English breakdown
- **Validate** — check syntax compatibility across all platforms at once
- **Test** — preview the next 10 scheduled runs instantly (client-side, no API)
- **Monitor** — AI cron job monitoring (coming Q3 2026)

## Tech Stack

- [Next.js 16](https://nextjs.org/) + React 19 + Tailwind 4
- [shadcn/ui](https://ui.shadcn.com/) components
- AI: Claude via [kie.ai](https://kie.ai)
- Email: [Resend](https://resend.com) + Cloudflare Email Routing
- Hosting: [Vercel](https://vercel.com)

## Getting Started

```bash
git clone https://github.com/lumm256/cronwiz.git
cd cronwiz
pnpm install
cp .env.example .env.local  # fill in your keys
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `KIE_API_KEY` | kie.ai API key for Claude access |
| `RESEND_API_KEY` | Resend email API key |
| `RESEND_AUDIENCE_ID` | Resend audience for waitlist |
| `RESEND_FROM_ADDRESS` | Sender address (e.g. hi@cronwiz.dev) |
| `RESEND_NOTIFY_FROM_ADDRESS` | Notification sender |
| `NOTIFY_EMAIL` | Owner email for signup notifications |

## Project Structure

```
app/
├── page.tsx              # Homepage with cron generator
├── explain/              # Cron explainer tool
├── validate/             # Cross-platform validator
├── test/                 # Next-run previewer (client-side)
├── blog/                 # SEO blog posts
├── vs/                   # Alternative comparison pages
└── api/
    ├── generate/         # Streaming AI cron generation
    └── waitlist/         # Email waitlist signup
components/               # Reusable UI components
lib/
├── prompts/              # AI system prompts (core IP)
├── kie.ts                # kie.ai client
├── types.ts              # Shared TypeScript types
└── resend.ts             # Email client
```

## License

MIT

---

# cronwiz.dev（中文）

AI 驱动的 cron 表达式生成器、解析器、验证器，以及即将上线的监控工具。

用自然语言描述调度需求，一键生成 Linux、AWS、Kubernetes、GitHub Actions、Vercel、Cloudflare Workers、Quartz/Spring 等 7+ 平台的 cron 表达式。

**在线体验：[cronwiz.dev](https://cronwiz.dev)**

## 功能

- **生成** — 用自然语言描述，生成多平台 cron 表达式
- **解析** — 粘贴任意 cron 表达式，获取自然语言解释
- **验证** — 一次检查所有平台的语法兼容性
- **测试** — 即时预览接下来 10 次运行时间（纯客户端，无需 API）
- **监控** — AI cron 任务监控（2026 Q3 上线）

## 技术栈

- Next.js 16 + React 19 + Tailwind 4
- shadcn/ui 组件库
- AI：通过 kie.ai 调用 Claude
- 邮件：Resend + Cloudflare Email Routing
- 部署：Vercel

## 本地开发

```bash
git clone https://github.com/lumm256/cronwiz.git
cd cronwiz
pnpm install
cp .env.example .env.local  # 填入你的密钥
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 许可证

MIT
