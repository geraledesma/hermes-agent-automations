# Architecture Reference

## Multi-Instance Hermes Deployment

This setup runs **two independent Hermes Agent instances** on the same VPS, each with its own Telegram bot, configuration, and cron schedule.

---

## CEO Profile

**Location:** `/opt/data/` (default profile)
**Config:** `/opt/data/config.yaml`
**Model:** `deepseek/deepseek-v4-flash` via OpenRouter
**Telegram Bot:** Bot 1 (personal assistant channel)
**Memory:** Enabled

### Cron Jobs

| Name | Schedule (UTC) | Type | Delivery |
|------|---------------|------|----------|
| CEO — Daily Brief | Mon–Sat 13:00 | no_agent script | Telegram |
| CEO — Saturday Review | Sat 20:00 | LLM + google-workspace | Telegram |

### Directory Layout
```
/opt/data/
├── config.yaml              ← Main Hermes config
├── cron/
│   ├── jobs.json            ← CEO cron table
│   └── output/              ← Cron execution history
├── home/.hermes/scripts/    ← All shared scripts
├── time-coach/              ← Time Coach engine
│   ├── daily_analysis.py
│   ├── scripts/weekly_prep.py
│   └── data/
├── discoverybot/            ← Tool discovery subsystem
├── skills/                  ← Installed skills
├── profiles/cto/            ← CTO profile (separate instance)
└── logs/
    ├── agent.log
    └── gateway.log
```

---

## CTO Profile

**Location:** `/opt/data/profiles/cto/`
**Config:** `/opt/data/profiles/cto/config.yaml`
**Model:** `deepseek/deepseek-v4-flash` via OpenRouter
**Telegram Bot:** Bot 2 (technical channel)
**Memory:** Disabled (stateless by design — zero cost on curation)

### Cron Jobs

| Name | Schedule (UTC) | Type | Delivery |
|------|---------------|------|----------|
| CTO — GitHub Night Scan | Mon/Wed/Fri 08:00 | Hybrid: script + LLM | Telegram |
| CTO — Tech Recon | Mon 10:00 | LLM (web research) | Telegram |
| CTO — Morning Brief | Wed 12:00 | no_agent script | Telegram |

### Directory Layout
```
/opt/data/profiles/cto/
├── SOUL.md                  ← CTO identity & rules
├── config.yaml              ← CTO-specific config
├── .env                     ← OpenRouter API key (CTO)
├── cron/
│   ├── jobs.json            ← CTO cron table
│   └── output/              ← Cron execution history
├── data/
│   ├── last_scan.json       ← Latest GitHub scan output
│   └── last_report.md       ← Latest code review report
├── platforms/pairing/       ← Telegram bot auth
├── logs/                    ← CTO agent + gateway logs
└── sessions/                ← CTO conversation history
```

---

## Cost Optimization

| Technique | Implementation | Savings |
|-----------|---------------|---------|
| Zero-token pre-analysis | `cto-scan-repo` script walks GitHub API tree before LLM sees it | ~90% on scan crons |
| no_agent scripts | Morning Brief, Daily Brief — pure Python output | Full LLM cost eliminated for routine tasks |
| Reduced frequency | Night scan: daily → MWF (60% fewer runs) | ~60% |
| Cheap model | DeepSeek V4 Flash for all routine work | ~10x cheaper than frontier models |
| Memory disabled on CTO | No context injection overhead | ~5% reduction per turn |
| Stateless design | CTO doesn't persist user profile | ~3-5% |

**Estimated monthly cost:** ~$0.03 for CTO nightly scans + ~$0.15 for Tech Recon = **~$0.18/month total**

---

## Security

- **GitHub PAT:** Fine-grained token scoped to `Contents: Read` + `Pull requests: Write` (90-day expiry)
- **Telegram tokens:** Separate bots for CEO and CTO — if one is compromised, the other is unaffected
- **OpenRouter keys:** Separate API keys per profile
- **Approvals:** `cron_mode: deny` — no cron can auto-approve dangerous commands
- **Memory:** CTO has memory disabled — no user data stored in its profile