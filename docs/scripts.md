# Scripts Reference

## cto-scan-repo

Zero-token GitHub repo pre-analysis for CTO Night Scan.

**Path:** `/opt/data/home/.hermes/scripts/cto-scan-repo`
**Type:** Python (no_agent)
**Owner:** CTO
**Tokens consumed:** 0

### What it does
1. Reads `GITHUB_TOKEN` from env
2. Iterates over 5 configured repos
3. Calls GitHub API to get repo metadata and full file tree (recursive)
4. Counts files by extension, flags large files (>500KB)
5. Outputs compact JSON to stdout (→ injected into LLM cron context)
6. Also saves to `/opt/data/profiles/cto/data/last_scan.json`

### Output format
```json
{
  "scan_time": "2026-06-08T20:32:26+00:00",
  "repos_scanned": 5,
  "repos": [
    {
      "name": "mxn-rate-allocator",
      "language": "Jupyter Notebook",
      "description": "Optimal MXN cash allocation...",
      "updated_at": "2026-06-06T21:59:12Z",
      "size_kb": 121731,
      "file_count": 69,
      "files_by_ext": { ".py": 46, ".md": 5, ".yaml": 5, ... },
      "files": [ ... ]
    }
  ]
}
```

---

## tc-daily.sh

Runs the Time Coach daily analysis script.

**Path:** `/opt/data/home/.hermes/scripts/tc-daily.sh`
**Contents:** `#!/bin/bash\n/opt/data/.venv/bin/python3 /opt/data/time-coach/daily_analysis.py`

---

## saturday-prep.sh

Data collector for Saturday Week Review & Planning.

**Path:** `/opt/data/home/.hermes/scripts/saturday-prep.sh`
**Contents:** Runs `weekly_prep.py` and outputs JSON for the LLM cron to consume.

---

## morning_brief

DiscoveryBot's weekly digest generator.

**Path:** `/opt/data/home/.hermes/scripts/morning_brief`
**Type:** Python (no_agent — silent if nothing to report)
**Owner:** CTO

Reads queue.yaml, scan data, trends, and briefs to produce a structured Telegram message:
1. GitHub activity (new repos, recent pushes)
2. Trending tool suggestions
3. Briefs ready for review
4. Pending queue items
5. Completed items

---

## github_scout

GitHub repo change detector.

**Path:** `/opt/data/home/.hermes/scripts/github_scout`
**Type:** Python
**Owner:** DiscoveryBot

Scans all repos under @geraledesma, detects new repos and recent pushes, writes `last_scan.json`.