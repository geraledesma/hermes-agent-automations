# Cron Schedule Reference

All times in **UTC** (America/Mexico_City = UTC-6 without DST).

---

## CEO Cron Jobs

### CEO — Daily Brief
```json
{
  "id": "7202a5d999b1",
  "name": "CEO — Daily Brief",
  "schedule": "0 13 * * 1-6",
  "type": "no_agent (script)",
  "script": "tc-daily.sh",
  "deliver": "origin",
  "status": "scheduled (last: error — OAuth expired)"
}
```
- Mon–Sat 13:00 UTC (07:00 CDMX)
- Runs Time Coach daily_analysis.py
- Delivers personal productivity summary via Telegram

### CEO — Saturday Review
```json
{
  "id": "b99dee0f5050",
  "name": "CEO — Saturday Review",
  "schedule": "0 20 * * 6",
  "type": "LLM agent",
  "skills": ["google-workspace"],
  "toolsets": ["terminal", "file", "web"],
  "deliver": "telegram",
  "status": "scheduled (last: ok)"
}
```
- Saturday 20:00 UTC (15:00 CDMX)
- Autonomous weekly planning: reviews current week, creates next week's events
- Uses Google Calendar API to create P0/P1/P2 events

---

## CTO Cron Jobs

### CTO — GitHub Night Scan
```json
{
  "id": "9b7977ee2756",
  "name": "CTO — GitHub Night Scan",
  "schedule": "0 8 * * 1,3,5",
  "type": "script + LLM (hybrid)",
  "script": "cto-scan-repo",
  "deliver": "telegram",
  "status": "scheduled (never run)"
}
```
- Mon/Wed/Fri 08:00 UTC (02:00 CDMX)
- Script collects data (0 tokens), LLM produces code review report

### CTO — Tech Recon
```json
{
  "id": "fb40bc3db6c2",
  "name": "CTO — Tech Recon",
  "schedule": "0 10 * * 1",
  "type": "LLM agent",
  "deliver": "telegram",
  "status": "scheduled (never run)"
}
```
- Monday 10:00 UTC (04:00 CDMX)
- Web research on queued tools + trending AI tools

### CTO — Morning Brief
```json
{
  "id": "df1d14eb34c2",
  "name": "CTO — Morning Brief",
  "schedule": "0 12 * * 3",
  "type": "no_agent (script)",
  "script": "morning_brief",
  "deliver": "telegram",
  "no_agent": true,
  "status": "scheduled (never run)"
}
```
- Wednesday 12:00 UTC (06:00 CDMX)
- Python script: silent if nothing new, otherwise weekly digest

---

## Visual Schedule

```
UTC      Mon       Tue       Wed       Thu       Fri       Sat       Sun
──────────────────────────────────────────────────────────────────────────
08:00  │ CTO Scan │         │CTO Scan │         │CTO Scan │          │
10:00  │ Recon    │         │         │         │         │          │
12:00  │          │         │Brief    │         │         │          │
13:00  │CEO Brief │CEO Brief│CEO Brief│CEO Brief│CEO Brief│CEO Brief │
20:00  │          │         │         │         │         │CEO Review│
```

---

## Cost per Cron (estimated)

| Cron | Tokens/month | Cost/month |
|------|-------------|------------|
| CEO — Daily Brief | 0 (no_agent) | $0.00 |
| CEO — Saturday Review | ~40K | ~$0.06 |
| CTO — GitHub Night Scan | ~8K (LLM only) | ~$0.03 |
| CTO — Tech Recon | ~50K | ~$0.15 |
| CTO — Morning Brief | 0 (no_agent) | $0.00 |
| **Total** | **~98K** | **~$0.24** |