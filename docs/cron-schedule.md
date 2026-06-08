# Cron Schedule

> All times in **UTC**. The system runs in America/Mexico_City timezone (UTC-6).

---

## CEO Agent — Personal Schedule

### Daily Pulse (Mon–Sat)
```
Schedule: 0 13 * * 1-6   (13:00 UTC = 07:00 CDMX)
Type:     no_agent script
Script:   daily-pulse
Cost:     $0.00 (no LLM)
Delivery: Telegram (CEO Bot)
```

Runs a Python analysis script that:
- Reads daily activity data
- Compares actuals vs weekly targets
- Delivers a structured metrics summary via Telegram

### Weekly Planning (Saturday)
```
Schedule: 0 20 * * 6   (20:00 UTC = 15:00 CDMX)
Type:     LLM agent (with Google Workspace skill)
Script:   weekly-prep (data collector)
Cost:     ~$0.06/month
Delivery: Telegram (CEO Bot)
```

Autonomous weekly planning session:
1. Reviews past week's performance data
2. Reads goal configuration (priorities, blocked windows, paused goals)
3. Generates next week's calendar with prioritized event blocks
4. Creates all events in Google Calendar via API
5. Delivers planning summary via Telegram

---

## CTO Agent — Technical Schedule

### Nightly Code Scan (Mon/Wed/Fri)
```
Schedule: 0 8 * * 1,3,5   (08:00 UTC = 02:00 CDMX)
Type:     Hybrid (no_agent script → LLM analysis)
Script:   repo-scanner
Cost:     ~$0.03/month
Delivery: Telegram (CTO Bot)
```

Two-phase pipeline:

**Phase 1 — Script** (0 tokens):
- Walks GitHub API recursive tree for 5 repos
- Counts files by extension
- Flags files over 500KB
- Outputs structured JSON

**Phase 2 — LLM** (~8K tokens):
- Receives JSON as context
- Produces code review with severity badges
- Saves report to disk
- Delivers via Telegram

### Tech Recon (Monday)
```
Schedule: 0 10 * * 1   (10:00 UTC = 04:00 CDMX)
Type:     LLM agent (web research)
Cost:     ~$0.15/month
Delivery: Telegram (CTO Bot)
```

Investigates queued tools from the discovery queue:
1. Reads queue for items marked `research: queued`
2. Web researches each tool (docs, GitHub, reviews)
3. Scores relevance (1-10) against active projects
4. Writes structured research briefs
5. Searches for trending AI tools
6. Delivers top recommendations via Telegram

### Morning Brief (Wednesday)
```
Schedule: 0 12 * * 3   (12:00 UTC = 06:00 CDMX)
Type:     no_agent script
Script:   weekly-digest
Cost:     $0.00 (no LLM)
Delivery: Telegram (CTO Bot)
```

Python script that reads multiple data sources and produces a compact weekly digest:
- GitHub activity (new repos, recent pushes)
- Tool recommendations from last Recon
- Research briefs ready for review
- Pending queue items
- Silent if nothing new to report

---

## Visual Calendar

```
UTC      Mon        Tue     Wed        Thu     Fri        Sat       Sun
──────────────────────────────────────────────────────────────────────────
08:00  │ CTO Scan  │       │CTO Scan  │       │CTO Scan  │          │
10:00  │ Recon     │       │          │       │          │          │
12:00  │           │       │Brief     │       │          │          │
13:00  │CEO Pulse  │CEO P. │CEO Pulse │CEO P. │CEO Pulse │CEO Pulse │
20:00  │           │       │          │       │          │CEO Plan  │
```

---

## Cost Breakdown

| Cron | Runs/month | LLM Tokens | Cost |
|------|-----------|------------|------|
| Daily Pulse | ~26 | 0 | $0.00 |
| Weekly Planning | ~4 | ~40K | $0.06 |
| Nightly Code Scan | ~13 | ~8K (LLM pass only) | $0.03 |
| Tech Recon | ~4 | ~50K | $0.15 |
| Morning Brief | ~4 | 0 | $0.00 |
| **Total** | **~51** | **~98K** | **~$0.24** |