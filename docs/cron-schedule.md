# Cron Schedule

> All times in **UTC**. CDMX = UTC−6.  
> Source of truth: `wiki/system/crons.md` in the vault. This file is secondary documentation.

---

## CEO Agent — 4 jobs

| Cron | Schedule (UTC) | Hora CDMX | Tipo | Script/Skill | Costo/mes | Descripción |
|------|---------------|-----------|------|-------------|-----------|-------------|
| `cron_ceo-goal-review` | `0 18 * * 0` (Domingo) | 12:00 | LLM agent | skill: `company-goals` | ~$0.03 | Weekly company goals S-MART review |
| `cron_ceo-daily-brief` | `0 13 * * 1-6` (Lun–Sáb) | 07:00 | `no_agent` script | `tc-daily.sh` | $0.00 | Resumen diario: agenda, metas, tareas |
| `cron_ceo-sun-wrap` | `0 20 * * 0` (Domingo) | 14:00 | LLM agent | script + LLM + google-workspace + time-coach | ~$0.06 | Cierre semanal: create_week.py crea eventos → LLM resume |
| `cron_ceo-token-rotation-reminder` | `0 13 30 8 *` (one-shot) | 07:00 · 2026-08-30 | LLM agent | — | $0.00 | Aviso tokens GitHub: CTO sep-06, CEO sep-24 |

**Deshabilitados:** daily-lint, weekly-lint, sat-review, sun-reflection — migrados/fusionados.

---

## CTO Agent — 6 jobs

| Cron | Schedule (UTC) | Hora CDMX | Tipo | Script/Skill | Costo/mes | Descripción |
|------|---------------|-----------|------|-------------|-----------|-------------|
| `cron_cto-daily-sync` | `0 6 * * *` (diario) | 00:00 | `no_agent` script | `vault-sync.sh` | $0.00 | `git pull` vault |
| `cron_cto-daily-push` | `0 7 * * *` (diario) | 01:00 | `no_agent` script | `vault-push.sh` | $0.00 | `git push` vault + `git pull` public repo |
| `cron_cto-nightly-scan` | `0 8 * * 1,4` (Lun/Jue) | 02:00 | Hybrid: script → LLM | `cto-scan-repo` | ~$0.03 | Scan repos + code review adversarial |
| `cron_cto-wiki-lint` | `0 10 * * 1,3,5` (Lun/Mié/Vie) | 04:00 | LLM agent | skill: `weekly-lint` | ~$0.04 | Lint wiki + VPS alignment + vault→public sync |
| `cron_cto-tue-research` | `0 10 * * 2` (Martes) | 04:00 | LLM agent | web + file + terminal | ~$0.15 | Tech recon: cola RESEARCH.md |
| `cron_cto-thu-debrief` | `0 12 * * 4` (Jueves) | 06:00 | `no_agent` script | `morning_brief` | $0.00 | Brief técnico: scan + research + queue |

---

## Distribution

| UTC | CDMX | Lun | Mar | Mié | Jue | Vie | Sáb | Dom |
|-----|------|-----|-----|-----|-----|-----|-----|-----|
| 06:00 | 00:00 | T sync | T sync | T sync | T sync | T sync | T sync | T sync |
| 07:00 | 01:00 | T push | T push | T push | T push | T push | T push | T push |
| 08:00 | 02:00 | T scan | — | — | T scan | — | — | — |
| 10:00 | 04:00 | T lint | T research | T lint | — | T lint | — | — |
| 12:00 | 06:00 | — | — | — | T debrief | — | — | — |
| 13:00 | 07:00 | C brief | C brief | C brief | C brief | C brief | C brief | — |
| 18:00 | 12:00 | — | — | — | — | — | — | C goals |
| 20:00 | 14:00 | — | — | — | — | — | — | C wrap |

`C` = CEO · `T` = CTO

---

## Budget

| Agent | Jobs | `no_agent: true` | `no_agent: false` | Cost/month |
|-------|------|------------------|-------------------|-----------|
| CEO | 4 | 1 (25%) | 3 (75%) | ~$0.09 |
| CTO | 6 | 3 (50%) | 3 (50%) | ~$0.22 |
| **Total** | **10** | **4** | **6** | **~$0.31** |

Model: DeepSeek V4 Flash via OpenRouter.

---

## Notes

- **Madrugada rule:** jobs without attention required = 00:00–06:00 CDMX. Jobs with output for the user = ≥07:00 CDMX.
- **`no_agent: true`** — executes script directly, $0.00 tokens. Use whenever reasoning is not needed.
- **VPS alignment:** `cron_cto-wiki-lint` verifies VPS↔vault drift every Mon/Wed/Fri.
- **Token rotation:** CTO token expires 2026-09-06 · CEO token expires 2026-09-24. Playbook in vault `wiki/guides/github.md`.