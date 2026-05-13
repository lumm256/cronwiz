# cronwiz.dev — Session Handoff (2026-05-13)

> **新 Claude session 第一句话**：
> `@/Users/pengzhonghua/Desktop/cronwiz-handoff.md 接着干 — 从 Sprint 1 开始`

---

## TL;DR — 接手 30 秒看完

- **产品**：AI Cron Generator + (即将上线) AI Cron Monitor
- **域名**：https://cronwiz.dev (live，跑在 Vercel)
- **代码**：`/Users/pengzhonghua/Documents/mycode/vercel/cronwiz/`
- **下一步**：Sprint 1 — Landing page SEO 改造（H1 + 6 个 H2 + FAQ schema + /llms.txt）
- **用户决策**：H1 选 A、工具拆 /explain、愿意写 3 篇博客
- **真实预期**：Year 1 MRR $200-1500（已和用户对齐，不要重新画大饼）

---

## 用户画像 + CLAUDE.md 行为规则

- 中国独立开发者，首次做 SaaS
- 程序员 + SEO 实战经验（之前流量站做到 DR 35 但月入 < $100）
- 下班 2h/天，全部业余时间投入
- **CLAUDE.md 硬规则**：
  1. 全程**中文回答**
  2. 用**审视目光**看用户的话，发现思维盲点直接指出
  3. 觉得离谱就**骂回去**帮他清醒（用户主动要求）
  4. 不要 sycophant、不要灌鸡汤
  5. 一旦看到**坏味道** / procrastination / 红海跳坑 → 立刻 push back
- 用户已经历过的"幻觉"：
  - 想做 colorifyai/formulabot/VBA → 被数据劝退
  - 想直接做 Local Directory SaaS → 被识别为 shiny object syndrome
  - 想"用户付费 $19/mo Pro 100 monitors" → 被数据校准到 $5/mo 单档
- 用户已接受的现实：
  - Cron monitor 是个小生意，不会发大财
  - 真实 Year 1 上限 $1000-1500/mo
  - Generator 是 funnel，Monitor 才是产品

---

## 当前技术架构

### 代码仓库
```
/Users/pengzhonghua/Documents/mycode/vercel/cronwiz/
├── app/
│   ├── page.tsx                  ← 主页（含 cron-tool 组件）
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── generate/route.ts     ← Cron 生成 streaming API（已接 kie.ai）
│       └── waitlist/route.ts     ← Resend Audience + 邮件通知
├── components/
│   ├── cron-tool.tsx             ← 主工具（**当前同时做 generate 和 explain，待拆**）
│   ├── waitlist.tsx              ← 邮件订阅（已接 /api/waitlist）
│   ├── comparison.tsx            ← ⚠ v0.dev 残留 bug，对比表行重复
│   ├── faq.tsx
│   ├── features.tsx
│   ├── footer.tsx
│   └── use-cases.tsx
└── lib/
    ├── prompts/cron-system.ts    ← Core IP，含 7 平台规则
    ├── kie.ts                    ← kie.ai 客户端（fetch + Anthropic SSE 解析）
    ├── types.ts                  ← CronAnalysis 类型
    ├── resend.ts                 ← Resend client + 4 个 env vars 导出
    └── utils.ts
```

### Stack
- Next.js 16 + React 19 + Tailwind 4 + pnpm
- shadcn/ui 组件
- 部署：Vercel
- AI：kie.ai 代理 → `claude-sonnet-4-6`
- Email：Resend 出 + Cloudflare Email Routing 入
- 数据库：暂无（v0.5 Monitor 才需要）

### .env.local（已配置，DO NOT COMMIT）
```
KIE_API_KEY=re_xxx                  # kie.ai 代理（用户已 rotate 提醒过）
RESEND_API_KEY=re_xxx
RESEND_AUDIENCE_ID=b3a6585d-...     # cronwiz waitlist audience
RESEND_FROM_ADDRESS=hi@cronwiz.dev
RESEND_NOTIFY_FROM_ADDRESS=noreply@cronwiz.dev
NOTIFY_EMAIL=pengzhonghua520@gmail.com
```

### Vercel env（已部署到 production）
同上 5 个 env vars 都已在 Vercel Settings → Environment Variables。

### API 路由说明
- `POST /api/generate` — **streaming** plain text response（NOT JSON）
  - 接受 `{input: string}`，返回 SSE 解析后的 Claude 输出文本
  - 客户端需要 stream-read + 末端 JSON 提取
  - 用 `nodejs` runtime + `maxDuration: 90` + heartbeat newline 防 Vercel 超时
  - 限流 10 req/IP/min（内存版，单实例够用）
- `POST /api/waitlist` — JSON 响应
  - 接受 `{email: string}`
  - 加入 Resend Audience + 发确认邮件给用户 + 发通知邮件给 owner（带 reply-to=signup email）

### 邮箱基础设施
- `hi@cronwiz.dev`：Cloudflare Email Routing 转发到 pengzhonghua520@gmail.com
- 出站全部走 Resend（DKIM/SPF 已验证）
- 域名服务商：Spaceship（Namecheap 系）

---

## 战略决策（已锁定，不要再讨论）

### 定位（用户已选 A）
```
H1: "AI Cron Expression Generator with Job Monitoring"
Sub: "Type schedules in plain English, validate any expression, 
     and monitor cron jobs across 7 platforms. Free for indies."

理由：双关键词主导，同时覆盖：
  - cron expression generator (1,600 vol $5.99 CPC) — SEO 主力
  - cron monitoring (110 vol $8.83 CPC) — 商业意图
```

### 定价（已锁定）
```
Free  : 3 monitors, 7-day history, email alerts
Plus  : $5/mo, 25 monitors, AI explainer, Slack/Discord, 90-day history

不做 Pro $19、Team $49 — 等前 100 付费用户后再加
```

### ICP（重要 — 不是只面向开发者）
1. **Self-hoster / homelabber**（r/selfhosted, r/homelab）
2. **Sysadmin**（r/sysadmin）
3. **Indie hackers 跑小 SaaS**（IndieHackers, r/SideProject）
4. **AWS / K8s 用户**（r/aws, r/kubernetes）— 用 vertical pages 接

**已排除**：
- 大企业 DevOps（不是目标）
- WordPress 站主（vertical page 上线后才能接）

---

## 真实关键词数据（DataForSEO 已查，不要再猜）

### Tier 3 黄金 SEO 词（KD 0-23，先打这些）
```
keyword                    vol    KD   CPC    优先级
cron explainer             480    21   $0     ⭐⭐⭐⭐⭐
cron tester                320    17   $0     ⭐⭐⭐⭐⭐
cron not working           260     3   $0     ⭐⭐⭐⭐⭐
cron job not running       260     0   $0     ⭐⭐⭐⭐⭐
cron validator             210    23   $0     ⭐⭐⭐⭐
cron expression explainer   50    31   $0     ⭐⭐⭐
```

### Tier 1 商业头部（KD 55，长线目标）
```
cron expression generator  1,600  55   $5.99  ⭐⭐⭐⭐⭐ ← H1 必含
cron expression builder    1,600  55   $5.99  
cron generator             1,600  55   $0
crontab generator          1,600  55   $0
```

### Tier 2 monitor 商业（量小但 CPC 高）
```
cron monitoring            110    78   $8.83
cron job monitoring        110    78   $8.83
monitor cron jobs          110    78   $8.83
```

### SERP 头部词竞争（"cron expression generator"）
1. crontab.guru (DR ~70)
2. crontab.cronhub.io
3. freeformatter.com
4. cronexpressiontogo.com
5. crontab-generator.org
6. cronmaker.com
7. appsmith.com
8. hyperping.com
9. uptimerobot.com
10. serveravatar.com

→ **12-24 个月 SEO 持久战，短期内 page 3-5**

### DataForSEO 调用方式
```bash
# 凭据在 ~/.netrc（machine api.dataforseo.com）
# 脚本已在 ~/.claude/skills/saas-opportunity-research/scripts/
bash keyword_volume.sh "kw1" "kw2"      # 搜索量 + CPC
bash keyword_difficulty.sh "kw1" "kw2"  # KD
bash serp_top10.sh "keyword"            # SERP top 10
bash keyword_expand.sh "seed" 50 0.5 30 # 长尾扩展
```

---

## TODO — Sprint 1 (本周开始)

### Sprint 1：主页 SEO 改造（6-9h）

**优先级 1：H1 + Subtitle**
- [ ] 改 `app/page.tsx` hero H1 为 "AI Cron Expression Generator with Job Monitoring"
- [ ] 改 sub 为 "Type schedules in plain English, validate any expression, and monitor cron jobs across 7 platforms. Free for indies."
- [ ] CTA 文案改为 "↓ Try the generator now — no signup"

**优先级 2：加 6 个 H2 区块**
- [ ] H2.1: "Generate Cron Expressions in Plain English" (主词: cron expression generator)
- [ ] H2.2: "Explain Existing Cron Expressions" + CTA 跳 /explain (主词: cron explainer)
- [ ] H2.3: "Validate Cron Syntax Across Platforms" + CTA 跳 /validate (主词: cron validator)
- [ ] H2.4: "Why Does My Cron Job Not Run?" (主词: cron job not running) — 黄金 SEO 区块
- [ ] H2.5: "Coming Soon: AI Cron Monitoring" — waitlist hook
- [ ] H2.6: "How is cronwiz different from Cronitor and Healthchecks?" — alternative 词

**优先级 3：FAQ schema**
- [ ] 加 JSON-LD FAQPage schema（10 个 Q&A）
- [ ] 含 GEO 友好问题：
  - Why is my cron job not running?
  - What is a cron expression?
  - How is cronwiz different from Cronitor?
  - Is cronwiz free?
  - Which cron format should I use?
  - Can I use cron in GitHub Actions / Vercel / etc?

**优先级 4：GEO 优化**
- [ ] 加 `/llms.txt`（Anthropic 推的标准）— 列站点结构 + 简介
- [ ] Meta description + title 加入主关键词
- [ ] Open Graph + Twitter Card meta tags

**优先级 5：comparison.tsx bug 修复**
- [ ] 删掉 v0.dev 生成的重复行（"Multi-platform output" 和 "Plain English input" 重复）
- [ ] 改为干净 7 行：Plain English / Multi-platform / Plan warnings / Edge case / Reverse explain / Free / Cron monitoring

### Sprint 2：3 个新工具页（下周，6-9h）

- [ ] `/explain` — cron → English (KD 21, 480 vol)
  - 重用现有 `cron-tool.tsx` 逻辑，反向 prompt
  - 这意味着主页 cron-tool 改为**只做 generate**，把 explain 模式提取到独立组件
  - 用户已确认可以拆
- [ ] `/validate` — 语法验证 (KD 23, 210 vol)
  - 客户端正则 + LLM 兜底（可选）
- [ ] `/test` — Next 10 runs 预览 (KD 17, 320 vol)
  - 用 `cron-parser` 库（npm 包），无需 LLM

### Sprint 3：3 篇博客（第 3 周，~10h）

用户已同意。Claude 起草，用户 review 改语气。

- [ ] `/blog/cron-job-not-running` (KD 0, 260 vol) — 最高优先
- [ ] `/blog/cron-not-working` (KD 3, 260 vol)
- [ ] `/blog/best-cron-monitoring-tools-2026` — GEO 钩子 listicle
  - 含 cronwiz 但定位 "best for indies under $10/mo"，不夸大
  - 诚实评 Cronitor / Healthchecks / Cronhub

### Sprint 4：Alternative 页面（第 4 周，4-6h）

- [ ] `/vs/cronitor` (KD 45)
- [ ] `/vs/healthchecks`

### Sprint 5+：AI Cron Monitor MVP（Month 2-3）

不在当前 sprint 范围。先做 SEO，等流量 + waitlist 数据。
12 个月里程碑目标：30-80 付费用户，$150-400 MRR。

---

## ⚠ 待修复的已知问题

1. **comparison.tsx 重复行**（v0.dev 残留 bug）
2. **主页 cron-tool 同时做 generate 和 explain**，需要拆
3. **底部 "Star us on GitHub →" 链接是 #**，没指向实际仓库
   - 用户未来需建 GitHub repo（暂未做）
4. **Twitter handle `@cronwiz_dev` 未确认是否已占用**
   - 用户应当先占了再发分发帖
5. **网站还没有真正分发**
   - r/devops 被 Rule 4 卡住
   - 调整定位 + Sprint 1-3 完成后再分发

---

## 用户已踩的坑 / 已被劝退的方向（不要旧事重提）

- ❌ Local Directory SaaS（PDF 方案）— 已识别为 shiny object，劝退
- ❌ VBA Generator — 用户无 VBA 基础，劝退
- ❌ colorifyai (KDP 涂色书) — 用户无 KDP 知识
- ❌ formulabot (Excel) — 红海 + 微软入场
- ❌ 直接做 Monitor 不做 Generator — 用户希望渐进
- ❌ Pro $19 / Team $49 定价 — 简化为单档 $5
- ❌ 在 r/devops 硬发 — Rule 4 不放过，留到 weekly self-promo

---

## 用户的真实优势（接手 Claude 应认知）

- ✅ SEO 实战（罕见 indie skill）
- ✅ Next.js / React 能独立调试
- ✅ 已会 DataForSEO + Firecrawl API
- ✅ 已配齐邮件基础设施
- ✅ 真实独立判断（识别出"AI 直接生成 cron 我为啥用你"这种 sharp 问题）

## 用户的真实弱点（接手 Claude 应留意）

- ⚠ 容易 shiny object（频繁尝试切换方向）
- ⚠ 倾向于"再调研一下"逃避动手
- ⚠ 写博客可能拖延 — push 紧一些
- ⚠ 第一次做 SaaS，没"扛过失败"的经验

---

## 现成可调用的工具 / Skill

### 已配置 MCP / Skill
- `~/.claude/skills/saas-opportunity-research/` — SaaS 调研方法 + 关键词脚本
- DataForSEO 凭据在 `~/.netrc`
- Firecrawl MCP（如可用）— 抓 SERP / 竞品页

### 项目目录中的辅助文件
- `~/Desktop/cronwiz-v0.1-skeleton/` — 早期 skeleton（已迁移到正式项目，保留作为参考）
- 本文件：`~/Desktop/cronwiz-handoff.md`

---

## 给接手 Claude 的 First Message Template

新 session 用户大概率说"接着干"。直接做：

1. Read 本文件
2. 看 Sprint 1 TODO 列表
3. 确认起点：从哪个 H 改起？
4. 一次做一两个改动，让用户 review
5. 不要又回头讨论 positioning / 定价 / 方向 — **已锁定**

如果用户冒出"我想换方向 / 重新考虑"——立刻 push back，引他们回 Sprint 1。
按 CLAUDE.md "骂醒"原则。

---

**最后更新**：2026-05-13
**当前进度**：Generator + Waitlist live，准备 Sprint 1 SEO 改造
**下次见面第一句话**：拿这文件喂下一个 Claude，说"从 Sprint 1.1 开始改 H1"
