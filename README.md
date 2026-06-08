# Hermes Agent Automations

Personal automation stack built on [Hermes Agent](https://github.com/NousResearch/hermes-agent) (Nous Research) — a multi-instance autonomous agent platform hosted on a private VPS. This repo documents the **CEO + CTO dual-agent architecture** and all crown activities running 24/7.

Delivery via **Telegram gateways** (two bots): the CEO sends personal/time reports, the CTO sends code reviews and technical briefs directly to mobile.

---

## Architecture

### Dual-Profile Model

```
┌──────────────────────────────────────────────────────┐
│                    VPS (Hostinger)                    │
│                                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐    │
│  │     CEO PROFILE     │  │     CTO PROFILE     │    │
│  │  (Personal Agent)   │  │  (Technical Agent)  │    │
│  │                     │  │                     │    │
│  │  Telegram Bot 1 ◀──┼──┼──▶ User (Gerardo)   │    │
│  │  OpenRouter (CEO)  │  │  Telegram Bot 2 ◀───┤    │
│  │  Time Coach        │  │  OpenRouter (CTO)   │    │
│  │  Calendar Mgmt     │  │  GitHub API         │    │
│  │  Job Scout         │  │  Code Review        │    │
│  │  DiscoveryBot      │  │  Tech Recon         │    │
│  └─────────────────────┘  └─────────────────────┘    │
│                                                       │
│  ┌─────────────────────────────────────────────┐     │
│  │            Shared Resources                 │     │
│  │  /opt/data/                                │     │
│  │  ├── config.yaml          (CEO config)      │     │
│  │  ├── profiles/cto/        (CTO profile)     │     │
│  │  ├── home/.hermes/scripts/ (all scripts)    │     │
│  │  ├── discoverybot/        (tool discovery)  │     │
│  │  ├── time-coach/          (calendar engine) │     │
│  │  └── cron/jobs.json       (CEO cron table)  │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

| Component | CEO | CTO |
|-----------|-----|-----|
| **Role** | Personal assistant | Technical co-pilot |
| **Model** | DeepSeek V4 Flash (OpenRouter) | DeepSeek V4 Flash (OpenRouter) |
| **Telegram** | Bot 1 — personal channel | Bot 2 — technical channel |
| **Domain** | Calendar, CFA, job search | Code review, repo scan, tech research |
| **Memory** | Enabled | Disabled (stateless scanner) |
| **Crons** | 2 active | 3 active |

---

## Crown Activities (CEO)

### CEO — Daily Brief
- **Schedule:** Mon–Sat, 13:00 UTC (07:00 CDMX)
- **Type:** `no_agent` script
- **Script:** `tc-daily.sh` → runs `/opt/data/time-coach/daily_analysis.py`
- **Delivery:** Telegram (origin chat)
- **Purpose:** Evaluates daily hour tracking vs weekly objectives. Reads Google Calendar events, compares actuals vs targets, and delivers a summary with catch-up recommendations.
- **Status:** ⚠️ Google OAuth token expired (needs manual re-auth)

### CEO — Saturday Review
- **Schedule:** Saturday, 20:00 UTC (15:00 CDMX)
- **Type:** LLM agent with `google-workspace` skill
- **Script:** `saturday-prep.sh` → runs `/opt/data/time-coach/scripts/weekly_prep.py`
- **Toolsets:** terminal, file, web
- **Delivery:** Telegram
- **Purpose:** Autonomous weekly planning:
  - Reviews current week performance
  - Creates next week's calendar events in Google Calendar (Claude calendar)
  - P0: Blocked windows (routine, meals, chores)
  - P1: CFA study sessions (respects HARD/DELOAD/BUFFER targets)
  - P1: Job search sessions
  - P2: Bitcoin Insurance, Reading sessions
  - Respects `paused: true` flags in goals.yaml
  - Status: ✅ Working (last run: Jun 8)

---

## Crown Activities (CTO)

### CTO — GitHub Night Scan
- **Schedule:** Mon/Wed/Fri, 08:00 UTC (02:00 CDMX)
- **Type:** Hybrid (no_agent script → LLM analysis)
- **Script:** `cto-scan-repo` (Python, 0 tokens)
- **Delivery:** Telegram (CTO Bot)
- **Repos scanned (5):**
  - `mxn-rate-allocator` — Cash allocation optimizer
  - `bitcoin-portfolio-insurance` — Drawdown allocator
  - `self-driving-portfolio` — 8-agent MASS portfolio manager
  - `hermes-agent-automations` — This repo
  - `wealth-dashboard` — Wealth tracking dashboard
- **Pipeline:**
  1. `cto-scan-repo` script runs (no LLM cost) → walks GitHub API tree, counts files by extension, runs linters
  2. JSON output injected into LLM cron context
  3. LLM produces code review report finding real logic bugs (not lint/style)
  4. Report saved to `/opt/data/profiles/cto/data/last_report.md`
  5. Delivered via Telegram

### CTO — Tech Recon
- **Schedule:** Monday, 10:00 UTC (04:00 CDMX)
- **Type:** LLM agent (web research)
- **Delivery:** Telegram (CTO Bot)
- **Purpose:** Investigates queued tools from DiscoveryBot queue.yaml:
  - Reads `queue.yaml` for items with `research: queued`
  - Web searches each tool, evaluates relevance against projects.yaml (score 1-10)
  - Writes structured briefs to `briefs/{id}.md`
  - Also searches for trending AI tools from `trending_topics.yaml`
  - Delivers top 2 tool recommendations via Telegram

### CTO — Morning Brief
- **Schedule:** Wednesday, 12:00 UTC (06:00 CDMX)
- **Type:** `no_agent` script
- **Script:** `morning_brief` (Python)
- **Delivery:** Telegram (CTO Bot)
- **Purpose:** Consolidated weekly digest:
  - GitHub activity (new repos, recent pushes from `last_scan.json`)
  - 2 trending tool suggestions from `last_trends.json`
  - Research briefs ready for review
  - Pending queue items
  - Silent if nothing new to report

---

## DiscoveryBot System

Autonomous tool discovery subsystem. The user sends "investiga X" via Telegram, items go to a queue, and the CTO researches them asynchronously.

### File Structure
```
/opt/data/discoverybot/
├── DISCOVERYBOT_SPEC.md    ← Full technical specification
├── queue.yaml              ← Tool queue (pending/done/abandoned)
├── projects.yaml           ← 11 repos with relevance weights
├── trending_topics.yaml    ← Search queries, sources, exclusions
├── briefs/                 ← Completed research (markdown)
│   ├── firecrawl.md
│   ├── gbrain.md
│   ├── obsidian-git-backup.md
│   └── xurl-twitter.md
├── scans/
│   ├── last_scan.json      ← GitHub Scout output
│   ├── last_trends.json    ← Recent trend suggestions
│   └── recon_done.json     ← Recon summary
└── pulse/
    ├── github_scout        ← Script: GitHub API scanner
    ├── morning_brief       ← Script: weekly digest generator
    └── recon               ← Prompt: LLM research executor
```

### Queue Items
| Item | Status | Research |
|------|--------|----------|
| X/Twitter integration | pending | ✅ done |
| Firecrawl | pending | ✅ done |
| Gbrain | pending | ✅ done |
| Obsidian Git Backup | pending | ✅ done |
| Curation skill | ✅ done | — |
| DiscoveryBot pipeline | ✅ done | — |

---

## Scripts

All located at `/opt/data/home/.hermes/scripts/`:

| Script | Type | Owner | Purpose |
|--------|------|-------|---------|
| `cto-scan-repo` | Python | CTO | Zero-token GitHub repo pre-analysis |
| `tc-daily.sh` | Bash | CEO | Time Coach daily analysis runner |
| `saturday-prep.sh` | Bash | CEO | Weekly prep data collector |
| `morning_brief` | Python | CTO | DiscoveryBot weekly digest |
| `github_scout` | Python | CEO | GitHub repo change detector |
| `pending_reminder` | Python | CEO | Pending item reminders |
| `job-scout-cron-a.sh` | Bash | CEO | (Deprecated — will be removed) |

---

## Infrastructure

| Component | Detail |
|-----------|--------|
| **Platform** | Hermes Agent (Nous Research) |
| **Server** | Hostinger VPS (KVM · Ubuntu) |
| **LLM routing** | OpenRouter (DeepSeek V4 Flash) |
| **CEO Delivery** | Telegram Bot 1 (personal) |
| **CTO Delivery** | Telegram Bot 2 (technical) |
| **Skill standard** | [agentskills.io](https://agentskills.io) |
| **Scheduling** | Hermes native cron |
| **Code review** | GitHub API (fine-grained PAT) |
| **Calendar** | Google Calendar API (Time Coach) |
| **Timezone** | America/Mexico_City (UTC-6) |

---

## Related Projects

- [self-driving-portfolio](https://github.com/geraledesma/self-driving-portfolio) — 8-agent MASS portfolio management system. Hermes is the execution layer.
- [bitcoin-portfolio-insurance](https://github.com/geraledesma/bitcoin-portfolio-insurance) — RQA-1 risk component; generates drawdown signals.
- [time-coach-skill](https://github.com/geraledesma/time-coach-skill) — Claude Code skill for calendar management logic.
- [rate-allocator](https://github.com/geraledesma/rate-allocator) — Optimal MXN cash allocation (SciPy LP + Streamlit).
- [headhunter-skill](https://github.com/geraledesma/headhunter-skill) — Claude Code skill for autonomous job search management.
- [wealth-dashboard](https://github.com/geraledesma/wealth-dashboard) — Wealth tracking dashboard.
- [geraledesma.github.io](https://github.com/geraledesma/geraledesma.github.io) — Personal blog.

---

## Status

**Active.** Running on Hostinger VPS 24/7 since May 2026.

### Known Issues
- Google OAuth token expired (Jun 6) — CEO Daily Brief failing until manual re-auth
- CTO gateway not installed as system service — dies on VPS reboot
- Some deprecated scripts pending cleanup (`job-scout-cron-a.sh`, old `github_scout`)
- X/Twitter source integration pending (xurl CLI + Developer Portal setup)