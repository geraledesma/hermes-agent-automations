# Scripts Reference

All scripts live in the Hermes scripts directory and are scheduled via Hermes native cron.

---

## repo-scanner

Zero-token GitHub repo pre-analysis for the CTO Night Scan pipeline.

**Type:** Python (`no_agent`)
**Owner:** CTO Agent
**Tokens consumed:** 0

### Pipeline Flow

```
repo-scanner (Python, $0)
    └── Walks GitHub API recursive tree for 5 repos
        └── Outputs structured JSON
            └── Injected into LLM cron context (context_from)
                └── LLM reasons about anomalies (~8K tokens)
                    └── Code review report via Telegram
```

### What It Does
1. Reads `GITHUB_TOKEN` from environment
2. Iterates over configured repos
3. For each repo:
   - Calls GitHub API for metadata (language, description, size, last update)
   - Fetches full recursive file tree from default branch
   - Counts files by extension
   - Flags files >500KB as oversized
4. Outputs compact JSON to stdout (→ injected into LLM cron context)
5. Also saves to `data/last_scan.json`

### Output Format
```json
{
  "scan_time": "2026-06-08T20:32:26Z",
  "repos_scanned": 5,
  "repos": [
    {
      "name": "project-alpha",
      "language": "Python",
      "description": "Description of project",
      "updated_at": "2026-06-06T21:59:12Z",
      "size_kb": 121731,
      "file_count": 69,
      "files_by_ext": { ".py": 46, ".md": 5, ".yaml": 5 },
      "files": [
        { "path": "src/main.py", "ext": ".py", "size": 12345 }
      ]
    }
  ]
}
```

---

## daily-pulse

CEO daily analysis runner.

**Type:** Bash (`no_agent`)
**Owner:** CEO Agent
**Tokens consumed:** 0

Triggers the daily analysis engine that evaluates metrics against weekly targets and delivers a structured summary.

---

## weekly-prep

Data collector for the Saturday Weekly Planning session.

**Type:** Bash (`no_agent`)
**Owner:** CEO Agent
**Tokens consumed:** 0

Collects current week's performance data and outputs JSON. The LLM uses this to:
- Review what happened this week
- Plan next week's calendar
- Skip paused goals

---

## weekly-digest

CTO's weekly digest generator for Telegram.

**Type:** Python (`no_agent`)
**Owner:** CTO Agent
**Tokens consumed:** 0

Reads multiple data sources to produce a compact Telegram message:
- GitHub scan data (new repos, recent pushes)
- Trend suggestions from Tech Recon
- Research briefs ready for review
- Queue status (pending, in progress, completed)

**Key design:** Silent if nothing new to report — no noise, no empty notifications.

---

## github-watcher

GitHub repository change detector.

**Type:** Python
**Owner:** Discovery System

Detects new repositories and recent pushes under a GitHub user account. Writes structured JSON for consumption by other components.