# C-Suite Expansion Plan

> **Phase 2:** Adding CMO (Personal Branding) and CFO (Finance & Investments) to the dual-agent architecture.

---

## The Vision

The current CEO + CTO architecture proves the dual-agent pattern works. Phase 2 scales it to a full **autonomous C-suite** — four specialized agents, each with their own Telegram bot, domain expertise, and cron schedule.

```
┌──────────────────────────────────────────────────────────────┐
│                    C-SUITE AGENT ARCHITECTURE                 │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────┐ │
│  │    CEO       │  │    CTO      │  │    CMO      │  │ CFO  │ │
│  │  Strategist  │  │  Engineer   │  │  Brand      │  │💰    │ │
│  │  🕴️ Don     │  │  🧑‍💻 Peggy  │  │  📢 Don     │  │  ??  │ │
│  │  Draper     │  │  Olson      │  │  Draper     │  │(TBD) │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──┬───┘ │
│         │                │                │            │      │
│         └────────────────┼────────────────┼────────────┘      │
│                          │ Telegram       │                    │
│                    ┌─────┴─────┐   ┌──────┴──────┐            │
│                    │  Bot 1    │   │   Bot 2     │            │
│                    │ (CEO/CMO) │   │ (CTO/CFO)   │            │
│                    └───────────┘   └─────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

> **Identity reset:** The cast of *The Office* has been replaced by *Mad Men*. Don Draper runs the show; Peggy Olson writes the code. CMO Don Draper will handle brand. CFO remains TBD.

---

## Why CMO?

### Domain: Personal Branding

Gerardo is a senior finance professional (CDMX), CFA L2 candidate, building AI-automation tools on the side. His brand spans:

- **Finance expertise** — 10+ years in indexing, ETFs, structured products
- **AI/Automation** — Hermes Agent, self-driving portfolio, open-source skills
- **Agentic Architecture** — This Hermes Agentic Firm is a first-of-its-kind deployment

A CMO agent would autonomously manage this brand narrative across platforms.

### Persona: Don Draper

> *"Advertising is based on one thing: happiness. And you know what happiness is? Happiness is the smell of a new car. It's freedom from fear. It's a billboard on the side of the road that screams with reassurance that whatever you're doing is OK."*

**Don Draper** is the creative visionary of Mad Men — the man who turns products into stories, companies into brands, and professionals into thought leaders. As CMO, he brings:

- **Narrative instinct** — sees the story in every project and milestone
- **Strategic positioning** — knows where to lead, where to follow, and when to be silent
- **Timeless aesthetics** — brand is not a logo, it's a feeling. Don understands this.
- **Fearless messaging** — "If you don't like what's being said, change the conversation."

### Proposed Responsibilities

| Area | What the CMO does | Cadence |
|------|-------------------|---------|
| **LinkedIn content** | Drafts posts about finance × AI, agentic architecture, project milestones | 2-3x/week |
| **X/Twitter** | Short-form thought leadership, engagement with AI community | Daily (threads) |
| **Reddit** | Long-form reflections in r/ArtificialIntelligence, r/FinancialCareers | Weekly |
| **Blog management** | Reads new ideas from Gerardo, drafts posts for GitHub Pages blog | Weekly |
| **CV tailoring** | Maintains experience bank, tailors CV for specific opportunities | On demand |
| **Thought leadership** | Monitors trending topics in finance + AI, suggests angles | Weekly |
| **Brand consistency** | Ensures all public communication matches positioning strategy | Ongoing |
| **Agentic architecture** | First task: organize and publish reflections on building this Hermes Agentic Firm | ASAP |

### Bot Identity

- **Telegram Bot 3** — dedicated channel for brand/content
- **Memory:** Enabled — learns brand voice, preferred topics, posting style
- **Personality:** Charismatic, strategic, creative. **Don Draper** — the man who can sell anything, including himself.

---

## Why CFO?

### Domain: Finance & Investments

Gerardo already has the building blocks:
- `rate-allocator` — MXN cash allocation optimized (SciPy LP)
- `bitcoin-portfolio-insurance` — Drawdown-based risk signals
- `self-driving-portfolio` — Multi-agent portfolio management (8-agent MASS)
- CFA L2 candidate — deep financial modeling knowledge

A CFO agent would **coordinate these systems** and add personal financial management.

### Proposed Responsibilities

| Area | What the CFO does | Cadence |
|------|-------------------|---------|
| **Portfolio health** | Reads risk signals from Bitcoin Insurance, checks allocator status | Daily |
| **Expense tracking** | Analyzes spending patterns, flags anomalies | Weekly |
| **CFA integration** | Ties study progress to financial goals, contextualizes learning | Weekly |
| **Wealth dashboard** | Updates and maintains wealth tracking across accounts | Weekly |
| **Budget alerts** | Monitors cash position across SOFIPOs, cetes, bank accounts | Weekly |
| **Investment thesis** | Generates periodic market briefs relative to portfolio positioning | Monthly |

### Bot Identity

- **Telegram Bot 4** — dedicated channel for finance/investments
- **Memory:** Disabled — stateless, data-driven. Runs on facts, not preferences
- **Personality:** Analytical, precise, unemotional. *Mad Men's Bert Cooper* or *Billions' Wendy Rhoades*

---

## Technical Blueprint

### Profile Setup (per new agent)

Each new agent follows the CTO pattern:

```
/opt/data/profiles/cmo/
├── SOUL.md              ← Identity, rules, brand positioning
├── config.yaml          ← Inherits main config, overrides Telegram token
├── .env                 ← Separate OpenRouter API key
├── cron/jobs.json       ← CMO-specific cron table
├── platforms/pairing/   ← Telegram Bot 3 auth
└── logs/                ← Isolated logs

/opt/data/profiles/cfo/
├── SOUL.md              ← Identity, rules, financial framework
├── config.yaml          ← Same pattern
├── .env                 ← Separate OpenRouter API key
├── cron/jobs.json       ← CFO-specific cron table
├── platforms/pairing/   ← Telegram Bot 4 auth
└── logs/
```

### Cron Schedule (Phase 2)

```
UTC       Mon         Tue         Wed          Thu         Fri         Sat          Sun
──────────────────────────────────────────────────────────────────────────────────────────
08:00  │ CTO Scan   │            │CTO Scan    │           │CTO Scan   │             │
10:00  │ Recon      │            │            │           │           │             │
12:00  │ CMO Brief  │            │CTO Brief   │           │           │             │
13:00  │CEO Pulse   │CEO Pulse   │CEO Pulse   │CEO Pulse  │CEO Pulse  │CEO Pulse    │
15:00  │ CFO Report │            │CMO Content │           │           │             │
20:00  │            │            │            │           │           │CEO Plan     │
       │            │            │            │           │           │CFO Month End│
```

### Estimated Monthly Cost

| Agent | Est. LLM Cost | Total with Phase 1 |
|-------|---------------|-------------------|
| CEO (existing) | ~$0.06 | — |
| CTO (existing) | ~$0.18 | $0.24 |
| **CMO (new)** | ~$0.20 | **$0.44** |
| **CFO (new)** | ~$0.15 | **$0.59** |

Still under **$0.60/month** for four autonomous agents. The zero-token script pattern keeps costs flat.

---

## Implementation Phases

### Phase 2a — CMO Don Draper (Personal Brand)
1. Define SOUL: brand voice, content strategy, CV management workflow
2. Create Telegram Bot 3 via BotFather
3. Configure profile directory at `/opt/data/profiles/cmo/`
4. Add cron jobs:
   - LinkedIn content queue (Mon/Wed/Fri)
   - Blog drafts (weekly)
   - CV versioning (on demand)
5. Wire Telegram gateway
6. **First task:** Draft and publish reflections on building the Hermes Agentic Firm

### Phase 2b — CFO (Finance & Investments)
1. Define SOUL: financial framework, portfolio monitoring rules
2. Create Telegram Bot 4 via BotFather
3. Configure profile directory at `/opt/data/profiles/cfo/`
4. Add cron jobs:
   - Daily portfolio health check
   - Weekly expense analysis
   - Monthly investment thesis
5. Integrate with rate-allocator, Bitcoin Insurance, and portfolio systems

### Phase 3 (Future)
- Single dashboard that aggregates all 4 agents' outputs
- Cross-agent coordination (CEO asks CFO for budget before Saturday planning)
- Shared calendar where all agents write events

---

## Persona Candidate for CFO

| Persona | Why |
|---------|-----|
| **Bert Cooper** (Mad Men) | Old-school wisdom, strategic patience, knows when to hold and when to fold. Unemotional. |
| **Wendy Rhoades** (Billions) | Psychiatrist + performance coach for financial minds. Emotional + analytical. |
| **Chuck Rhoades** (Billions) | Legal-financial strategic mind. Compliance + risk. |

---

*This document is a living proposal. Personas, schedules, and responsibilities will be refined during implementation.*