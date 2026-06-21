# Hermes Agent Automations

> **Multi-instance autonomous agent architecture** — two AI agents (CEO + CTO) running 24/7 on a private VPS, communicating via Telegram, scheduling crons, scanning code, managing calendars, and discovering new tools — all autonomously.

Built on [Hermes Agent](https://github.com/NousResearch/hermes-agent) by Nous Research. Demonstrates production-grade deployment of autonomous AI agents with separate identities, dedicated Telegram gateways, and zero-token optimization patterns.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                  VPS (Hostinger · Ubuntu)                    │
│                                                             │
│  ┌─────────────────────┐   ┌───────────────────────┐       │
│  │    CEO AGENT        │   │     CTO AGENT          │       │
│  │  (The Visionary)    │   │  (The Technical Eye)   │       │
│  │                     │   │                        │       │
│  │  🕴️ Michael Scott   │   │  🧑‍💻 Ryan Howard       │       │
│  │                     │   │                        │       │
│  │  Telegram Bot 1 ◀───┼───┼──▶ User (Manager)     │       │
│  │  OpenRouter LLM     │   │  Telegram Bot 2 ◀─────┤       │
│  │  Calendar Mgmt      │   │  GitHub API Scanner   │       │
│  │  Weekly Planning    │   │  Code Review Engine   │       │
│  │  Routine Ops        │   │  Tech Recon Agent     │       │
│  └─────────┬───────────┘   └───────────┬───────────┘       │
│            │                           │                    │
│            └─────────── Shared ─────────┘                   │
│                        ║                                    │
│              ┌──────────────────────┐                       │
│              │  Scripts · Configs   │                       │
│              │  Cron Tables         │                       │
│              │  Discovery System    │                       │
│              └──────────────────────┘                       │
└────────────────────────────────────────────────────────────┘
```

### Dual-Profile Design

<p align="center">
  <img src="docs/ceo-profile.jpg" width="150" style="border-radius: 8px; margin: 10px 20px;" />
  <img src="docs/cto-profile.jpg" width="150" style="border-radius: 8px; margin: 10px 20px;" />
</p>

Two independent Hermes Agent instances, each with its own:

| Feature | CEO (Personal) | CTO (Technical) |
|---------|---------------|-----------------|
| **Persona** | 🕴️ Michael Scott | 🧑‍💻 Ryan Howard |
| **Role** | Strategic executor | Autonomous engineer |
| **Domain** | Scheduling, planning, ops | Code review, research, tooling |
| **LLM** | DeepSeek V4 Flash (OpenRouter) | Same model, separate API key |
| **Telegram** | Dedicated bot | Dedicated bot (isolated) |
| **Memory** | Enabled (learns preferences) | Disabled (stateless scanner) |
| **Cost profile** | ~$0.06/mo | ~$0.18/mo |

---

## 🌐 Ecosystem

This repo is the orchestration core. It connects to several companion repos that the CTO Agent reads and operates on via GitHub API, plus the private knowledge layer that both agents use on every session.

### Active Projects (CTO-managed)

| Repo | Description |
|------|-------------|
| [**mxn-rate-allocator**](https://github.com/geraledesma/mxn-rate-allocator) | MXN savings optimizer — LP/MILP allocation across SOFIPOs, CETES, and funding accounts |
| [**bitcoin-portfolio-insurance**](https://github.com/geraledesma/bitcoin-portfolio-insurance) | Drawdown-based risk budgeting signal generator for BTC/USDC dynamic allocation |
| [**self-driving-portfolio**](https://github.com/geraledesma/self-driving-portfolio) | Multi-agent portfolio management — 8-agent MASS architecture inspired by BlackRock |
| [**wealth-dashboard**](https://github.com/geraledesma/wealth-dashboard) | Personal net-worth dashboard — PDF parsing + multi-account aggregation |

### Private Companions

| Repo | Role |
|------|------|
| **hermes-obsidian-vault_priv** *(private)* | Knowledge and operations layer — wiki, roadmaps, agent policy docs, and the vault the CEO/CTO read at the start of every session |

### Archived / Historical

Repos that reached end-of-life and whose functionality was absorbed into Hermes's internal skill system:

| Repo | Archived | History |
|------|----------|---------|
| **time-coach** *(private)* | 2026-06-20 | Python time-tracking app — superseded by Hermes's internal time-coach skill |
| **time-coach-skill** *(private)* | 2026-06-20 | Claude Code skill blueprint — prototype absorbed by the CTO's internal skill system |

---

## What Each Agent Does

### 🕴️ CEO Agent (The Visionary)

The CEO handles strategic operations — time management, calendar orchestration, and recurring workflows. It thinks in terms of **schedules, priorities, and execution**.

- **Daily Pulse** (Mon–Sat, 13:00 UTC) — Runs a Python analysis script that evaluates daily metrics against weekly targets, delivering a structured summary. Zero LLM tokens.
- **Weekly Planning** (Sat, 20:00 UTC) — Autonomous calendar generation: reviews the past week, then creates next week's schedule with prioritized events (P0 routines, P1 deep work, P2 secondary goals). Uses Google Calendar API. Paused goals are automatically skipped.
- **Personality:** Strategic, decisive, runs the show. Michael Scott energy — talks in plans and big-picture thinking.

### 🧑‍💻 CTO Agent (The Technical Eye)

The CTO is a stateless technical co-pilot that operates while the CEO sleeps. It reviews code, researches tools, and delivers technical briefs.

- **Nightly Code Scan** (Mon/Wed/Fri, 08:00 UTC) — Scans 5 repos via GitHub API, analyzes file structure, extension distribution, and flags anomalies. A `no_agent` script does the heavy lifting (zero tokens), then an LLM pass produces a structured code review report with severity badges.
- **Tech Recon** (Mon, 10:00 UTC) — Web research agent that investigates queued tools from a discovery queue. Evaluates each tool's relevance, writes structured briefs, and searches for trending AI tools.
- **Morning Brief** (Wed, 12:00 UTC) — Weekly digest consolidating GitHub activity, tool recommendations, and research briefs. Silent if nothing new (zero tokens, pure Python).
- **Personality:** Quiet, technical, direct. "Ryan started as the temp, now he runs the code review." Numbers and severity badges speak louder than adjectives.

---

## Infrastructure Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Agent Framework** | [Hermes Agent](https://github.com/NousResearch/hermes-agent) | Autonomous AI agent platform with tool execution, memory, cron, skills |
| **LLM Routing** | [OpenRouter](https://openrouter.ai) | Model-agnostic access to 200+ LLMs |
| **Model** | DeepSeek V4 Flash | Cost-efficient reasoning for routine agent work |
| **Hosting** | Hostinger VPS (KVM · Ubuntu) | 24/7 dedicated server |
| **Delivery** | Telegram Bot API | Dual gateways (CEO + CTO) deliver to mobile |
| **Calendar** | Google Calendar API | Read/write event management for scheduling |
| **Code Analysis** | GitHub REST API | Fine-grained PAT for repo tree walks and file inspection |
| **Scheduling** | Hermes Native Cron | Configurable cron expressions with script + agent hybrid mode |
| **Skills** | Hermes Skill System | Reusable modules (Google Workspace, etc.) |
| **Tool Discovery** | Web search + custom queue | Queue-based research pipeline with scoring |

---

## Cost Optimization Patterns

The system is designed for maximum capability at minimum cost:

| Pattern | Implementation | Savings |
|---------|---------------|---------|
| **Zero-token pre-processing** | Scripts collect and structure data before the LLM ever sees it | ~90% on scan crons |
| **Stateless CTO** | No memory, no user profile — no context injection overhead | ~5% per turn |
| **Reduced frequency** | Night scan: MWF instead of daily (60% fewer runs) | ~60% |
| **Efficient model** | DeepSeek V4 Flash for all routine work | ~10x cheaper than frontier |
| **no_agent mode** | Python scripts that produce final output — zero LLM cost | Full LLM cost eliminated |

**Estimated monthly operating cost:** ~$0.24 (yes, twenty-four cents)

---

## Scripts & Automation

All automation lives in a centralized scripts directory and runs via Hermes cron:

| Script | Language | Owner | What It Does |
|--------|----------|-------|-------------|
| `repo-scanner` | Python | CTO | Walks GitHub API tree, counts files by extension, outputs JSON (zero tokens) |
| `daily-pulse` | Bash | CEO | Runs daily analysis script for metrics reporting |
| `weekly-prep` | Bash | CEO | Collects data for Saturday weekly planning |
| `weekly-digest` | Python | CTO | Reads scan data + queue + briefs, produces compact Telegram message |
| `github-watcher` | Python | CEO | Detects new repos and recent pushes via GitHub API |
| `reminder-engine` | Python | CEO | Sends pending reminders |

---

## Discovery System

An autonomous tool discovery pipeline that lets the user submit tools via Telegram ("investiga X") and gets back structured research briefs without any manual effort.

**Pipeline:**
1. User sends tool name via Telegram → added to queue
2. Monday morning: CTO Recon agent web-researches all queued items
3. Writes structured briefs (what it is, relevance scoring, recommendations)
4. Wednesday: Morning Brief delivers digest with findings

**Example research briefs generated:**
- External tool evaluation (web scraping, crawling frameworks)
- AI agent framework analysis
- Integration research (social media APIs, plugin ecosystems)
- Process optimization recommendations

---

## Status

**Active.** Running 24/7 on Hostinger VPS since May 2026.

### Design Principles
- **Two brains are better than one** — separate agents for strategy and execution
- **Cost-conscious automation** — zero-token scripts for routine work, LLM only for reasoning
- **Mobile-first delivery** — everything arrives on Telegram for async consumption
- **Self-documenting** — this repo is the source of truth for the architecture
- **Extensible** — adding a new cron job or agent profile takes minutes

---

*Built with Hermes Agent by Nous Research. Deployed on Hostinger. Powered by OpenRouter.*