# Cron Schedule

> All times in **UTC**. CDMX = UTC−6.  
> Source of truth: `wiki/system/crons.md` in the vault. This file is secondary documentation.

---

## CEO Agent — 6 jobs

| Cron | Schedule (UTC) | Hora CDMX | Tipo | Script/Skill | Costo/mes |
|------|---------------|-----------|------|-------------|-----------|
| `cron_ceo-daily-lint` | `0 2 * * *` (diario) | 20:00 noche ant. | LLM agent | — | ~$0.15 |
| `cron_ceo-weekly-lint` | `0 2 * * 1` (Lunes) | 20:00 dom. ant. | LLM agent | skill: `weekly-lint` | incluido |
| `cron_ceo-daily-brief` | `0 13 * * 1-6` (Lun–Sáb) | 07:00 | no_agent script | `tc-daily.sh` | $0.00 |
| `cron_ceo-sat-review` | `0 20 * * 6` (Sábado) | 14:00 | LLM agent | skill: `google-workspace` + `saturday-prep.sh` | ~$0.06 |
| `cron_ceo-sun-reflection` | `0 21 * * 0` (Domingo) | 15:00 | LLM agent | — | ~$0.02 |
| `cron_ceo-token-rotation-reminder` | `0 13 30 8 *` (one-shot) | 07:00 · 2026-08-30 | LLM agent | — | $0.00 |

### Qué hace cada job

**daily-lint** → Lint estructural del wiki vault: wikilinks rotos, author tracking, completitud de index, frontmatter gaps, tags fuera de taxonomía, páginas >200 líneas, contenido stale, contradicciones. Guarda `wiki/reviews/lint-YYYY-MM-DD.md`.

**weekly-lint** → Lint profundo (mismo checklist + verificación de alineamiento VPS vs vault): lee jobs.json del CEO y CTO, compara schedules contra `wiki/system/crons.md`, verifica SOUL.md del CTO contra repo, reporta drift. Requiere toolset `terminal`.

**daily-brief** → Script Python que lee actividad del día, compara vs targets semanales, entrega resumen estructurado por Telegram.

**sat-review** → Revisión semanal autónoma: revisa métricas de la semana, genera agenda de la próxima semana en Google Calendar, entrega resumen.

**sun-reflection** → Lee TASKS.md, wiki/log.md (últimos 7 días), lint reports, goals. Documenta logros, lecciones, bloqueos en `wiki/reviews/weekly-YYYY-MM-DD.md`.

**token-rotation-reminder** → One-shot. Avisa que CTO token vence 2026-09-06 y CEO token vence 2026-09-24.

---

## CTO Agent — 5 jobs

| Cron | Schedule (UTC) | Hora CDMX | Tipo | Script/Skill | Costo/mes |
|------|---------------|-----------|------|-------------|-----------|
| `cron_cto-daily-sync` | `0 6 * * *` (diario) | 00:00 | LLM agent | terminal | $0.01 |
| `cron_cto-daily-push` | `0 7 * * *` (diario) | 01:00 | LLM agent | terminal | $0.01 |
| `cron_cto-nightly-scan` | `0 8 * * 1,4` (Lun/Jue) | 02:00 | Hybrid: script → LLM | `cto-scan-repo` | ~$0.03 |
| `cron_cto-tue-research` | `0 10 * * 2` (Martes) | 04:00 | LLM agent | web + file + terminal | ~$0.15 |
| `cron_cto-thu-debrief` | `0 12 * * 4` (Jueves) | 06:00 | no_agent script | `morning_brief` | $0.00 |

### Qué hace cada job

**daily-sync** → `git pull origin main` del vault antes de que cualquier otro job opere. Reporta ✅ o ⚠️.

**daily-push** → `git add -A && git commit -m 'auto: vault sync' && git push` tras sesiones nocturnas. Silencioso si no hay cambios.

**nightly-scan** → Phase 1 (script): walk GitHub API, cuenta archivos por extensión, detecta >500KB, emite JSON. Phase 2 (LLM): code review adversarial con severity badges `[CRIT]`/`[HIGH]`/`[MED]`/`[LOW]`. Max 8 hallazgos. Guarda `last_report.md`.

**tue-research** → Lee cola `planning/*/RESEARCH.md` buscando `Estado: researching`. Investiga herramientas con web search, evalúa relevancia 1–10 vs proyectos activos, actualiza el RESEARCH.md con hallazgos, entrega por Telegram.

**thu-debrief** → Script que consolida: actividad GitHub de la semana, recomendaciones del research del martes, reportes de scan del lunes y jueves, items pendientes en cola. Silencioso si no hay novedades.

---

## Calendario visual

```
UTC      Lun          Mar        Mié      Jue          Vie      Sáb         Dom
─────────────────────────────────────────────────────────────────────────────────
02:00  │ C:lint+wlint│ C:lint   │ C:lint │ C:lint     │ C:lint │ C:lint    │ C:lint
06:00  │ T:sync      │ T:sync   │ T:sync │ T:sync     │ T:sync │ T:sync    │ T:sync
07:00  │ T:push      │ T:push   │ T:push │ T:push     │ T:push │ T:push    │ T:push
08:00  │ T:scan      │          │        │ T:scan     │        │           │
10:00  │             │ T:recon  │        │            │        │           │
12:00  │             │          │        │ T:debrief  │        │           │
13:00  │ C:brief     │ C:brief  │ C:brief│ C:brief    │ C:brief│ C:brief   │
20:00  │             │          │        │            │        │ C:review  │
21:00  │             │          │        │            │        │           │ C:reflect
```

---

## Cost Breakdown

| Cron | Runs/mes | Tokens LLM | Costo |
|------|----------|------------|-------|
| `ceo-daily-lint` | ~30 | ~5K/run | ~$0.15 |
| `ceo-weekly-lint` | ~4 | ~15K/run | ~$0.06 |
| `ceo-daily-brief` | ~26 | 0 | $0.00 |
| `ceo-sat-review` | ~4 | ~40K | ~$0.06 |
| `ceo-sun-reflection` | ~4 | ~10K | ~$0.02 |
| `ceo-token-rotation-reminder` | 1 (one-shot) | ~1K | ~$0.00 |
| `cto-daily-sync` | ~30 | ~200/run | ~$0.01 |
| `cto-daily-push` | ~30 | ~200/run | ~$0.01 |
| `cto-nightly-scan` | ~8 | ~8K/run | ~$0.03 |
| `cto-tue-research` | ~4 | ~50K | ~$0.15 |
| `cto-thu-debrief` | ~4 | 0 | $0.00 |
| **Total** | **~145** | **~620K** | **~$0.49** |

---

## Notas operativas

- `wiki/system/crons.md` en el vault es la fuente de verdad canónica. Este archivo es documentación secundaria.
- El weekly-lint verifica alineamiento VPS vs vault (`wiki/system/crons.md`). Si hay drift, lo reporta.
- Cuando se modifique un job en el VPS, actualizar `wiki/system/crons.md` primero.
- Token rotation: CTO token vence 2026-09-06 · CEO token vence 2026-09-24. Playbook: `wiki/guides/github.md`.
