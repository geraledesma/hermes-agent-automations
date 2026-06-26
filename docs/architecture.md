# Architecture Reference

## Multi-Instance Hermes Deployment

This repository documents a production deployment running **two independent Hermes Agent instances** on a single VPS, each with its own Telegram bot, configuration, memory profile, and cron schedule.

The design philosophy: **separate concerns, share infrastructure, minimize cost.**

---

## Agent Profiles

### CEO Profile ("The Visionary")

**Persona:** Michael Scott — strategic, big-picture, runs the show. Handles scheduling, planning, and recurring operations.

**Location:** Default Hermes profile
**Config:** `config.yaml`
**Model:** DeepSeek V4 Flash via OpenRouter
**Telegram:** Dedicated bot (Bot 1)
**Memory:** Enabled — learns user preferences over time
**LLM Cost:** ~$0.06/month

**Cron Jobs:**

| Name | Schedule (UTC) | Type | Purpose |
|------|---------------|------|---------|
| `cron_ceo-daily-lint` | Daily 02:00 | LLM agent | Structural lint pass on wiki vault |
| `cron_ceo-weekly-lint` | Mon 02:00 | LLM agent | Deep lint + VPS alignment check |
| `cron_ceo-daily-brief` | Mon–Sat 13:00 | `no_agent` script | Daily metrics vs weekly targets |
| `cron_ceo-sat-review` | Sat 20:00 | LLM agent | Weekly review + Google Calendar generation |
| `cron_ceo-sun-reflection` | Sun 21:00 | LLM agent | Weekly retrospective → `reviews/weekly-*.md` |
| `cron_ceo-token-rotation-reminder` | 2026-08-30 13:00 (one-shot) | LLM agent | Alert: GitHub PATs expiring Sep 2026 |

**Directory Layout:**
```
/opt/data/
├── config.yaml              ← Main Hermes configuration
├── cron/
│   ├── jobs.json            ← CEO cron table
│   └── output/              ← Cron execution history
├── scripts/                 ← Shared automation scripts
├── skills/                  ← Installed Hermes skills
├── profiles/cto/            ← CTO profile (separate instance)
└── logs/
    ├── agent.log
    └── gateway.log
```

---

### CTO Profile ("The Technical Eye")

**Persona:** Ryan Howard — quiet, technical, direct. Started as the temp, now runs code review. Operates while the CEO sleeps.

**Location:** `/opt/data/profiles/cto/`
**Config:** `/opt/data/profiles/cto/config.yaml`
**Model:** DeepSeek V4 Flash via OpenRouter (separate API key)
**Telegram:** Dedicated bot (Bot 2 — fully isolated from CEO)
**Memory:** Disabled — stateless by design for cost efficiency
**LLM Cost:** ~$0.18/month

**Cron Jobs:**

| Name | Schedule (UTC) | Type | Purpose |
|------|---------------|------|---------|
| `cron_cto-daily-sync` | Daily 06:00 | LLM agent | `git pull` vault before operations |
| `cron_cto-daily-push` | Daily 07:00 | LLM agent | `git push` vault changes after nightly sessions |
| `cron_cto-nightly-scan` | Mon/Thu 08:00 | Hybrid: script + LLM | GitHub repo scan + adversarial code review |
| `cron_cto-tue-research` | Tue 10:00 | LLM agent | Web research on queued tools in `planning/*/RESEARCH.md` |
| `cron_cto-thu-debrief` | Thu 12:00 | `no_agent` script | Weekly technical digest: scan + research + queue |

**Directory Layout:**
```
/opt/data/profiles/cto/
├── SOUL.md                  ← CTO identity, rules, and personality
├── config.yaml              ← CTO-specific configuration
├── .env                     ← OpenRouter API key (isolated)
├── cron/
│   ├── jobs.json            ← CTO cron table
│   └── output/              ← Cron execution history
├── data/
│   ├── last_scan.json       ← Latest GitHub scan output
│   └── last_report.md       ← Latest code review report
├── platforms/pairing/       ← Telegram bot authentication
├── logs/                    ← Isolated agent + gateway logs
└── sessions/                ← CTO conversation history
```

---

## Tooling Architecture

### LLM Routing: OpenRouter

Both agents route through OpenRouter, providing:
- **Model-agnostic access** — swap models without config changes
- **Cost optimization** — use DeepSeek V4 Flash for routine work, upgrade to frontier models for complex reasoning
- **Separate API keys** per profile — independent rate limits and billing
- **Response caching** — identical prompts don't re-bill

### Delivery: Telegram Dual Gateways

Two Telegram bots run side by side:
- **Bot 1 (CEO)** — receives personal updates, daily metrics, planning confirmations
- **Bot 2 (CTO)** — receives code reviews, research briefs, technical alerts

This separation ensures the user can scan technical findings without personal chatter mixed in, and vice versa.

### Code Analysis: GitHub REST API

The CTO's scanner uses a fine-grained Personal Access Token scoped to:
- `Contents: Read` — walks repo file trees
- `Pull requests: Write` — (future) automated PRs for fixes

Token rotates every 90 days.

### Scheduling: Hermes Native Cron

Hermes cron supports two modes:

1. **`no_agent` mode** — runs a script, delivers stdout verbatim. Zero LLM cost. Used for data collection and digest generation.
2. **Agent mode** — runs an LLM with tools (web search, file access, terminal). Used for reasoning tasks like code review and research.

Cron B can consume Cron A's output via `context_from`, enabling zero-token data pipelines.

---

## Cost Optimization Deep Dive

The system is engineered for maximum value at minimum cost:

### Zero-Token Data Pipelines
```
Script (no_agent)
  └── Collects raw data from GitHub API / filesystem
      └── Outputs structured JSON
          └── Injected into LLM cron context (context_from)
              └── LLM only reasons, doesn't fetch
```

**Example:** The Nightly Code Scan script walks the entire GitHub API tree for 5 repos, counts files by extension, and outputs compact JSON. The LLM receives this pre-digested data and only needs to reason about anomalies — saving ~90% of tokens compared to having the LLM call the GitHub API itself.

### Why CTO Has No Memory
- **Memory chunk overhead:** Every turn loads ~2000 chars of memory context
- **Stateless = no overhead:** The CTO processes fresh data every run; it never needs to remember past conversations
- **Result:** ~5% reduction in context per turn, multiplied across dozens of sessions

### Frequency Reduction
- Night scan runs MWF instead of daily: 60% fewer LLM calls
- Tech Recon runs once per week
- Morning Brief runs once per week

### Estimated Monthly Costs

| Component | Type | Cost/mes |
|-----------|------|---------|
| `ceo-daily-lint` | LLM agent (~5K tokens × 30) | ~$0.15 |
| `ceo-weekly-lint` | LLM agent (~15K tokens × 4) | ~$0.06 |
| `ceo-daily-brief` | `no_agent` script | $0.00 |
| `ceo-sat-review` | LLM agent (~40K tokens × 4) | ~$0.06 |
| `ceo-sun-reflection` | LLM agent (~10K tokens × 4) | ~$0.02 |
| `cto-daily-sync` + `cto-daily-push` | LLM agent (~200 tokens × 60) | ~$0.01 |
| `cto-nightly-scan` | Hybrid (~8K tokens × 8) | ~$0.03 |
| `cto-tue-research` | LLM agent (~50K tokens × 4) | ~$0.15 |
| `cto-thu-debrief` | `no_agent` script | $0.00 |
| **Total** | | **~$0.49/mo** |

---

## Security Architecture

| Layer | Measure |
|-------|---------|
| **API keys** | Separate OpenRouter keys per profile |
| **Telegram** | Two independent bots — compromise of one doesn't affect the other |
| **GitHub** | Fine-grained PAT scoped to read-only (write only for future PR automation) |
| **Cron approvals** | `cron_mode: deny` — no cron can auto-approve dangerous commands |
| **Profile isolation** | CTO profile is a completely separate Hermes instance with its own config, keys, and database |
| **Secrets handling** | All secrets stored in `.env` files, never in config YAML