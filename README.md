# Hermes Agent Automations

Personal automation stack built on [Hermes Agent](https://github.com/NousResearch/hermes-agent) (Nous Research) — a self-improving autonomous agent platform hosted on a private VPS server. Hermes builds skills from completed tasks, improves them in future runs, and maintains a persistent user model across sessions.

Delivery via **Telegram gateway**: the agent sends updates, alerts, and reports directly to mobile.

---

## Infrastructure

| Component | Detail |
|---|---|
| Platform | Hermes Agent (Nous Research) |
| Server | Hostinger VPS (KVM · Ubuntu) |
| LLM routing | OpenRouter (model-agnostic — 200+ models) |
| Delivery | Telegram gateway (mobile · voice memo transcription) |
| Skill standard | [agentskills.io](https://agentskills.io) |
| Scheduling | Hermes native cron |

---

## Crown Activities

Recurring automations that run on a defined cron schedule with no manual intervention.

### Personal Calendar Management
Daily evaluation of hour-tracking vs. weekly objectives. If targets are not on pace, the agent autonomously reorganizes the calendar and portal to recover the deficit — no manual rescheduling needed.

- Reads daily log and compares actuals vs. weekly targets
- Identifies which activities are behind and by how much
- Proposes a reallocation of remaining hours in the week
- Delivers daily summary and catch-up plan via Telegram

### Web Scraping Pipelines
Structured data extraction on defined schedules. Feeds research and monitoring workflows.

### Execution Bridge — The Self-Driving Portfolio
Receives validated trading signals from the RQA-1 Risk Agent ([self-driving-portfolio](https://github.com/geraledesma/self-driving-portfolio)) and routes them to GBM HomeBroker for execution within IPS-defined risk parameters.

---

## Related Projects

- [self-driving-portfolio](https://github.com/geraledesma/self-driving-portfolio) — The Self-Driving Portfolio / Sapiens Investment Management · Hermes is the execution layer
- [bitcoin-portfolio-insurance](https://github.com/geraledesma/bitcoin-portfolio-insurance) — RQA-1 live component; generates drawdown signals that Hermes executes
- [time-coach-skill](https://github.com/geraledesma/time-coach-skill) — Claude Code skill that powers the calendar management logic ingested by Hermes

---

## Status

Active. Running on Hostinger VPS 24/7.
