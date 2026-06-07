# Asterion Implementation Plan

Status: Draft  
Owner runtime: Codex now; any compatible agent later  
Source design: `docs/plans/2026-06-06-private-finance-agent-skill-system-design.md`

## 1. Purpose

This document is the long-running implementation ledger for Asterion.

It should be used by future agent sessions to:

- Know what to build next.
- Avoid drifting away from the approved architecture.
- Resume safely after interruption or context compaction.
- Track implementation status with stable task IDs.
- Keep private data out of git.

The source design document owns architecture decisions. This implementation document owns execution order, task status, verification, and handoff notes.

## 2. Status Legend

Use exactly these statuses:

| Status | Meaning |
|---|---|
| `todo` | Not started |
| `in_progress` | Currently being worked on |
| `blocked` | Cannot proceed without user input or external dependency |
| `review` | Implemented, awaiting user review or manual check |
| `done` | Implemented and verified |
| `deferred` | Intentionally postponed |

When changing a task status, update:

- the task row
- the phase progress summary
- the handoff notes, if the change affects the next agent

## 3. Global Guardrails

- Do not commit or publish real portfolio data.
- Do not create `portfolio.db` inside a tracked path unless it is fake demo data and clearly named as such.
- Keep real local data under ignored paths such as `data/`, `output/`, `.env`, or `*.local.yml`.
- Public artifacts must be generated through `public-report-publisher`.
- Use whitelist publishing, never blacklist publishing.
- Any agent must read `AGENTS.md`, `BOOTSTRAP.md`, and the source design before executing a full workflow.
- Scripts should be deterministic whenever the task is mechanical: DB init, migrations, export rendering, sensitive scanning, report copying.
- LLM reasoning belongs in skills and reports; canonical facts belong in SQLite.
- GitHub CLI (`gh`) may be used for repository creation, visibility checks, Pages setup checks, and non-sensitive metadata. It must not upload secrets, private DB files, or generated private artifacts.

## 4. Repository Targets

| Repo | Role | Implementation Status |
|---|---|---|
| `asterion-core` | Local runtime, skills, schema, scripts, bootstrap | `in_progress` |
| `asterion-pages` | Reusable static templates and front-end assets | `done` |
| `asterion-<instance>` | Concrete generated report instance, current `Finance` workspace can become one | `todo` |

## 5. GitHub CLI Usage Policy

GitHub CLI is optional but recommended for repeatable repository setup. Any `gh` command that changes remote state should be visible in the implementation notes before it is run.

Allowed `gh` use:

```bash
gh auth status
gh repo view OWNER/REPO --json name,visibility,defaultBranchRef
gh repo create asterion-core --private --source . --remote origin
gh repo create asterion-pages --public
gh repo create asterion-personal --private
gh repo edit OWNER/REPO --visibility private
gh api repos/OWNER/REPO/pages
```

Allowed with extra care:

- `gh secret set` only for repository automation tokens that are not portfolio data and only when the user explicitly asks.
- `gh workflow run` only for workflows that do not read local private data.
- `gh repo deploy-key add` only with least-privilege keys and after the key purpose is documented.

Not allowed:

- Uploading `portfolio.db`, `.env`, raw provider cache, private reports, or transaction data.
- Using broad personal access tokens when a deploy key or fine-grained token is enough.
- Enabling public visibility for an instance repo without explicit user approval.
- Running a publish workflow that bypasses `public-report-publisher` and sensitive scanning.

Default visibility:

| Repo | Default |
|---|---|
| `asterion-core` | private |
| `asterion-pages` | public or private, user choice |
| `asterion-<instance>` | private unless explicitly made public after sanitization |

## 6. Phase Progress

| Phase | Name | Status | Exit Criteria |
|---|---|---|---|
| P0 | Planning and repo boundary | `done` | Design and implementation docs exist |
| P1 | Core scaffold | `done` | `asterion-core` skeleton boots and passes `check` |
| P2 | SQLite foundation | `done` | Schema initializes and demo seed loads |
| P3 | Skill packaging | `done` | 11 skills exist with lean `SKILL.md` and references |
| P4 | Deterministic scripts | `done` | DB, mock daily, render, scan scripts run |
| P5 | Pages templates | `done` | Private/public daily HTML render from fake data |
| P6 | Instance publishing | `done` | Sanitized artifacts sync to instance repo |
| P7 | Real data adapters | `in_progress` | Market/news collectors can populate DB |
| P8 | Review and outcomes | `done` | Review capture and outcome tracking work |
| P9 | Hardening | `in_progress` | Tests, docs, privacy checks, handoff complete |

## 7. Work Breakdown

### P0. Planning and Repo Boundary

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| P0.1 | Finalize Asterion naming: `asterion-core`, `asterion-pages`, `asterion-<instance>` | `done` | Updated design doc | Design doc contains repository taxonomy |
| P0.2 | Define skill architecture and collaboration flow | `done` | Updated design doc | Design doc lists 11 skills and workflow diagram |
| P0.3 | Define SQLite schema | `done` | Updated design doc | Design doc contains full DDL |
| P0.4 | Define main-session vs subagent policy | `done` | Updated design doc | Design doc has orchestrator subagent policy |
| P0.5 | Create this implementation plan | `done` | This file | File exists and includes stable task IDs |

### P1. `asterion-core` Scaffold

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| C1 | Create `asterion-core` directory/repo skeleton | `done` | `/Users/hexingyuan/Documents/asterion-core` | `find` shows expected folders |
| C2 | Add `.gitignore` with private-data rules | `done` | `.gitignore` | `git check-ignore data/portfolio.db .env output/private/x` |
| C3 | Add `.env.example` | `done` | Example env file without secrets | No real token-like value present |
| C4 | Add `pyproject.toml` | `done` | Python project metadata and deps | `python3 -m compileall scripts` succeeds |
| C5 | Add `AGENTS.md` | `done` | Agent operating instructions | Mentions bootstrap, skills, privacy boundary |
| C6 | Add `BOOTSTRAP.md` | `done` | Human/agent startup guide | Contains standard commands |
| C7 | Add `bootstrap.sh` command router | `done` | Shell entrypoint | `./bootstrap.sh help` works |
| C8 | Add local runtime directories with `.gitkeep` only where safe | `done` | `data/` and `output/` placeholders | DB files are ignored |
| C9 | Add GitHub CLI setup notes | `done` | `BOOTSTRAP.md` section for `gh` | Includes auth, repo creation, visibility checks |
| C10 | Add optional repo creation commands | `done` | Documented `gh repo create` commands | Commands default to private for core and instances |
| C11 | Add Pages capability check | `done` | Documented `gh`/GitHub Pages verification steps | Does not publish private artifacts |

### P2. SQLite Foundation

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| DB1 | Extract schema from design doc into `db/schema.sql` | `done` | SQL schema file | `sqlite3 :memory: < db/schema.sql` succeeds |
| DB2 | Add migration table and initial migration file | `done` | `db/migrations/0001_initial.sql` | Migration applies once and records version |
| DB3 | Implement `scripts/init_db.py` | `done` | Creates local DB under `data/portfolio.db` | Running twice is idempotent |
| DB4 | Implement `scripts/migrate_db.py` | `done` | Applies pending migrations | Test migration DB validates |
| DB5 | Add fake seed data in `db/seed.example.sql` | `done` | Demo portfolio with fake securities | Demo DB loads 2 fake securities and positions |
| DB6 | Implement `scripts/recompute_positions.py` | `done` | Recomputes positions from transactions | Demo transactions produce expected positions |
| DB7 | Implement `scripts/query_portfolio.py` | `done` | Read-only portfolio snapshot query | Outputs JSON and never writes |
| DB8 | Add schema validation checks | `done` | `scripts/validate_db.py` | Validates required tables |

### P3. Skill Packaging

Each skill should keep `SKILL.md` lean. Detailed schemas, contracts, and examples should live under `references/`. Deterministic logic should live under `scripts/`.

| ID | Skill | Status | Required Files | Verification |
|---|---|---|---|---|
| S1 | `finance-system-orchestrator` | `done` | `SKILL.md`, `references/workflows.md`, `references/subagent-policy.md` | Skill names all downstream skills |
| S2 | `portfolio-data-manager` | `done` | `SKILL.md`, `references/schema.md`, scripts adapters | Skill points to DB scripts |
| S3 | `market-data-collector` | `done` | `SKILL.md`, `references/provider-strategy.md` | Skill supports mock provider first |
| S4 | `news-event-collector` | `done` | `SKILL.md`, `references/source-policy.md`, `references/event-taxonomy.md` | Skill defines source tier and event score |
| S5 | `technical-signal-analyst` | `done` | `SKILL.md`, `references/technical-rules.md`, `references/output-contract.md` | Skill defines technical report fields and trigger rules |
| S6 | `daily-portfolio-analyst` | `done` | `SKILL.md`, `references/decision-contract.md`, `references/action-rules.md` | Skill outputs structured recommendation JSON |
| S7 | `a-share-report-analyzer` | `done` | Existing skill copied or vendored into core | Existing references/scripts preserved |
| S8 | `review-journal-manager` | `done` | `SKILL.md`, `references/review-contract.md` | Skill separates recommendation from user decision |
| S9 | `outcome-backtester` | `done` | `SKILL.md`, `references/outcome-methodology.md` | Skill defines 1/3/5/20 day horizons |
| S10 | `html-report-renderer` | `done` | `SKILL.md`, templates/assets references | Skill handles private and public modes |
| S11 | `public-report-publisher` | `done` | `SKILL.md`, `references/privacy-rules.md`, scanner script | Skill fails closed on sensitive scan |

### P4. Deterministic Scripts

| ID | Script | Status | Owner Skill | Verification |
|---|---|---|---|---|
| PY1 | `scripts/check_environment.py` | `done` | orchestrator | Reports Python, sqlite, paths, env status |
| PY2 | `scripts/run_daily.py` | `done` | orchestrator | Runs mock daily pipeline end to end |
| PY3 | `scripts/build_daily_context.py` | `done` | daily analyst | Outputs stable JSON from fake DB |
| PY4 | `scripts/generate_recommendation_payload.py` | `done` | daily analyst | Produces recommendation JSON contract |
| PY5 | `scripts/validate_recommendations.py` | `done` | daily analyst | Fails on missing required fields |
| PY6 | `scripts/render_daily_html.py` | `done` | html renderer | Creates private/public HTML from same payload |
| PY7 | `scripts/render_daily_json.py` | `done` | html renderer | Creates public/private JSON artifacts |
| PY8 | `scripts/scan_sensitive.py` | `done` | public publisher | Detects fake secret/cost/quantity samples |
| PY9 | `scripts/publish_public_report.py` | `done` | public publisher | Copies only whitelist files |
| PY10 | `scripts/update_outcomes.py` | `done` | outcome backtester | Fills demo 1/3/5/20 day outcome rows |

### P5. `asterion-pages` Templates

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| PG1 | Create reusable daily private template | `done` | `templates/daily-private.html` | Renders complete fake private report |
| PG2 | Create reusable daily public template | `done` | `templates/daily-public.html` | Contains no private fields |
| PG3 | Create report index template | `done` | `templates/report-index.html` | Lists fake daily reports |
| PG4 | Create shared CSS | `done` | `assets/styles.css` | Static responsive styles exist |
| PG5 | Create optional JS for filters/tabs | `done` | `assets/app.js` | Works without server-side runtime |
| PG6 | Add fake examples | `done` | `examples/daily/2099-01-01/index.html` | Uses fake data only and passes scanner |

### P6. Instance Repository Publishing

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| I1 | Define instance repo contract | `done` | Docs in `BOOTSTRAP.md` or publisher reference | Explains `asterion-<instance>` role |
| I2 | Add whitelist copy logic | `done` | Publisher script | Cannot copy files outside whitelist |
| I3 | Add sensitive scan gate | `done` | Scan report JSON | Publish fails on seeded sensitive text |
| I4 | Add dry-run mode | `done` | `--dry-run` option | Prints copy plan without writes |
| I5 | Add publish log in DB | `done` | `public_exports` rows | Export row includes scan status |
| I6 | Test against temporary fake instance | `done` | Temp dir output | `daily-reports.json` and HTML copied |
| I7 | Add optional `gh` instance repo bootstrap | `done` | Documented commands or script wrapper | Creates/checks instance repo without private files |
| I8 | Add optional GitHub Pages setup guidance | `done` | `BOOTSTRAP.md` or publisher reference | Explains manual/CLI setup and safety checks |

### P7. Real Market and News Adapters

MVP should start with mock providers. Real providers come after the DB, skill, and render loop are stable.

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| M1 | Implement mock market provider | `done` | Deterministic fake OHLCV | Daily mock run stable |
| M2 | Implement A-share provider adapter | `done` | Eastmoney market snapshots | 招商银行 `600036` writes 80 rows |
| M3 | Implement yfinance US/HK fallback if needed | `todo` | Market snapshots | Handles unsupported ticker gracefully |
| M4 | Calculate technical indicators | `done` | `technical_indicators` rows | 招商银行 writes 80 indicator rows |
| M4.1 | Interpret technical signals in daily reports | `done` | `technical` fields and recommendation triggers | 招商银行 report includes trend, MA, volume, support/resistance section |
| M5 | Implement mock news provider | `done` | Deterministic fake news | `collect_news.py --provider mock` available |
| M6 | Implement web/news collector adapter | `done` | `news_items` rows | Bing News RSS and CNInfo store source URL and collected time |
| M7 | Link news to securities | `done` | `news_security_links` rows | 招商银行 RSS + CNInfo tests link 10 items |
| M8 | Score event impact | `done` | `impact_score`, confidence | Initial deterministic relevance/impact score implemented |
| M9 | Add decision-first news layer | `done` | Top events and evidence appendix in daily payload/HTML | Report shows source, time, title, URL, impact, confidence |
| M10 | Add deep research freshness check | `done` | CLI reads `research_reports` for `a-share-report-analyzer` freshness | Does not auto-run deep reports; user can force refresh manually |
| M11 | Add broad-market overview | `done` | Eastmoney index snapshots for 上证/科创50/创业板指 | Daily report shows pct change, amount, volume ratio, trend |
| M12 | Add MACD/BOLL technical indicators | `done` | `technical_indicators` MACD and BOLL fields | 招商银行 report shows MACD and BOLL interpretation |
| M13 | Add chip distribution estimate | `done` | OHLCV volume-price distribution estimate in payload/HTML | Report labels estimate and does not treat it as true holder cost |
| M14 | Add shadcn-style tabbed report UI | `done` | Static HTML tabs and refined report styling | Multiple holdings render as separate tabs without build step |
| M15 | Add market fear-greed proxy | `done` | Asterion CN Fear & Greed in payload/HTML | Score derived from 上证/科创50/创业板涨跌、趋势、量能 |
| M16 | Add watchlist strategy storage and CLI | `done` | `watchlist` schema fields plus `./bootstrap.sh watchlist` | Stores target buy zone, trigger, forbid rule, note, priority |
| M17 | Add watchlist daily strategy payload | `done` | `watchlist_candidates` in context/recommendation JSON/HTML | Watchlist candidates are excluded when already held in the active portfolio |
| M18 | Redesign daily report as decision desk | `done` | Light workstation UI with market radar, sentiment standards, holdings table, watchlist panel, unified tabs | 2026-06-07 private report renders in Chrome and public scan passes |
| M19 | Add local TypeScript dashboard | `done` | Vite/React/TS app plus local Python API over SQLite | `dashboard build` and `dashboard serve` provide history browsing, watchlist form, and report workbench |

### P8. Review and Outcome Loop

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| R1 | Implement pending review list | `done` | JSON/table output | Shows unreviewed recommendations |
| R2 | Implement review recording | `done` | `reviews` rows | Preserves original recommendation |
| R3 | Add review section to private HTML | `done` | Static review instructions or exportable form placeholder | Does not imply auto-trading |
| R4 | Implement outcome horizon scheduler | `done` | Due outcome query | Finds recommendations due for 1/3/5/20 day review |
| R5 | Implement outcome update | `done` | `outcome_tracking` rows | Demo data computes returns |
| R6 | Implement strategy performance summary | `done` | `strategy_performance` rows/report | Aggregates by action/rule |

### P9. Hardening and Handoff

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| H1 | Add unit tests for deterministic scripts | `done` | Test suite | `./bootstrap.sh test` runs 17 tests |
| H2 | Add integration demo run | `done` | Fake DB to fake HTML pipeline | One command completes |
| H3 | Add privacy regression fixtures | `done` | Scanner test cases | Sensitive samples fail |
| H4 | Add bootstrap smoke test | `done` | `./bootstrap.sh check` | Passes on clean clone |
| H5 | Add handoff notes section updates | `done` | This doc updated | Latest status visible |
| H6 | Add user-facing quickstart | `done` | `BOOTSTRAP.md` | New agent can follow it |

## 8. Implementation Order

Follow this order unless the user explicitly changes priority:

1. Finish P0 planning docs.
2. Build P1 core scaffold.
3. Build P2 SQLite foundation.
4. Build P3 skill skeletons.
5. Build P4 mock deterministic pipeline.
6. Build P5 pages templates.
7. Build P6 instance publishing with privacy scan.
8. Add P7 real data adapters.
9. Add P8 review and outcomes.
10. Complete P9 hardening.

Do not start real provider integration before the mock pipeline can run end to end.

## 9. Handoff Protocol

At the end of any implementation session, update this section.

### Current Handoff

Date: 2026-06-06  
Last agent: Codex  
Current state:

- Design doc exists and includes Asterion naming, repository taxonomy, skill architecture, SQLite schema, subagent policy, privacy rules, and bootstrap contract.
- This implementation plan has been created as the execution ledger.
- `asterion-core` exists at `/Users/hexingyuan/Documents/asterion-core` as a local git repository.
- P1 core scaffold is complete.
- P2 SQLite foundation is complete: schema, initial migration, fake seed, init, migrate, validate, position recompute, and read-only query helpers are implemented.
- P3 skill packaging is complete: 11 skill folders exist, including vendored `a-share-report-analyzer` and the new `technical-signal-analyst`.
- P4 deterministic scripts are complete: mock daily context, recommendations, validation, rendering, sensitive scan, publisher, and outcome update scripts are implemented.
- P6 instance publishing is complete: whitelist copy, dry-run, sensitive scan gate, temp instance smoke test, DB export logging, and optional GitHub CLI guidance are implemented.
- P8 review/outcome loop is complete: pending review list, review recording, private HTML review affordance, outcome update, and strategy-performance summary are implemented.
- P5 `asterion-pages` exists at `/Users/hexingyuan/Documents/asterion-pages` with reusable templates, shared assets, fake examples, and a local git repo.
- P7 is partially complete: CN A-share Eastmoney daily K-line adapter, index snapshots for 上证/科创50/创业板指, technical indicator calculation including MACD/BOLL, chip distribution estimation, technical signal interpretation, mock news, Bing News RSS collection, CNInfo official announcement collection, news-security linking, initial impact scoring, watchlist candidate analysis, and public-standard-first sentiment framing are implemented. 招商银行 `600036` has been used as the real smoke test.
- Daily report information-layer upgrade is implemented: report body shows decision-first Top events, and the appendix keeps source-linked evidence for verification.
- Deep A-share research refresh policy is implemented: `research check` reads `research_reports` on an approximately monthly cadence, but stale status only prompts the user; the normal daily run must not auto-run deep research.
- P9 has started: `./bootstrap.sh test` runs 17 regression tests for recommendation contract, watchlist candidate contract, dashboard API helpers, sensitive scanning, hidden metadata skip, publisher date filtering, CNInfo helper behavior, research freshness, and HTML evidence/watchlist rendering.
- A 招商银行 morning report demo has been regenerated with the user's local private position, market overview, market sentiment, public benchmark notes, decision-desk UI, shadcn-style tabs, MACD/BOLL, chip distribution estimate, and deep-research freshness. Public sanitizer removes cost-derived and holding-thesis text; public scan passes on `output/public/daily/2026-06-07/index.html`.
- Current `Finance` workspace remains an instance repository candidate.

Next recommended task:

1. Continue P7 with US/HK fallback if broader markets are needed, or improve CNInfo classification by mapping announcement categories into event severity.
2. Continue P9 by adding integration tests around `demo-run`, `market fetch`, `news collect`, and `announcements collect`, then optional GitHub remote setup.

Open questions:

- Should `asterion-pages` be created immediately, or should templates live temporarily in `asterion-core` until the first render works?

### Resume Checklist

Any future agent should:

1. Read the source design doc.
2. Read this implementation plan.
3. Run `git status --short`.
4. Inspect the latest handoff notes.
5. Pick the first `todo` task in the current phase unless the user redirects.
6. Update task status before and after meaningful work.
7. Never touch real private data unless explicitly asked.

## 10. Definition of Done for MVP

MVP is done when:

- `asterion-core` can initialize a local fake SQLite DB.
- The 11 skills exist and describe their workflows.
- A mock daily run produces structured recommendations.
- Private and public HTML reports render from fake data.
- Sensitive scan blocks intentionally seeded private fields.
- Public publisher can dry-run and publish sanitized artifacts to a fake instance repo.
- `AGENTS.md` and `BOOTSTRAP.md` let a fresh agent understand how to run the system.
- This implementation plan reflects all completed work and has no stale handoff notes.
