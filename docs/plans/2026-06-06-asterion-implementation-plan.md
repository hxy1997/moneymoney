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
| `asterion-pages` | Reusable static templates and front-end assets | `todo` |
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
| P3 | Skill packaging | `done` | 10 skills exist with lean `SKILL.md` and references |
| P4 | Deterministic scripts | `in_progress` | DB, mock daily, render, scan scripts run |
| P5 | Pages templates | `todo` | Private/public daily HTML render from fake data |
| P6 | Instance publishing | `todo` | Sanitized artifacts sync to instance repo |
| P7 | Real data adapters | `todo` | Market/news collectors can populate DB |
| P8 | Review and outcomes | `todo` | Review capture and outcome tracking work |
| P9 | Hardening | `todo` | Tests, docs, privacy checks, handoff complete |

## 7. Work Breakdown

### P0. Planning and Repo Boundary

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| P0.1 | Finalize Asterion naming: `asterion-core`, `asterion-pages`, `asterion-<instance>` | `done` | Updated design doc | Design doc contains repository taxonomy |
| P0.2 | Define skill architecture and collaboration flow | `done` | Updated design doc | Design doc lists 10 skills and workflow diagram |
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
| S5 | `daily-portfolio-analyst` | `done` | `SKILL.md`, `references/decision-contract.md`, `references/action-rules.md` | Skill outputs structured recommendation JSON |
| S6 | `a-share-report-analyzer` | `done` | Existing skill copied or vendored into core | Existing references/scripts preserved |
| S7 | `review-journal-manager` | `done` | `SKILL.md`, `references/review-contract.md` | Skill separates recommendation from user decision |
| S8 | `outcome-backtester` | `done` | `SKILL.md`, `references/outcome-methodology.md` | Skill defines 1/3/5/20 day horizons |
| S9 | `html-report-renderer` | `done` | `SKILL.md`, templates/assets references | Skill handles private and public modes |
| S10 | `public-report-publisher` | `done` | `SKILL.md`, `references/privacy-rules.md`, scanner script | Skill fails closed on sensitive scan |

### P4. Deterministic Scripts

| ID | Script | Status | Owner Skill | Verification |
|---|---|---|---|---|
| PY1 | `scripts/check_environment.py` | `done` | orchestrator | Reports Python, sqlite, paths, env status |
| PY2 | `scripts/run_daily.py` | `done` | orchestrator | Runs mock daily pipeline end to end |
| PY3 | `scripts/build_daily_context.py` | `done` | daily analyst | Outputs stable JSON from fake DB |
| PY4 | `scripts/generate_recommendation_payload.py` | `done` | daily analyst | Produces recommendation JSON contract |
| PY5 | `scripts/validate_recommendations.py` | `done` | daily analyst | Fails on missing required fields |
| PY6 | `scripts/render_daily_html.py` | `todo` | html renderer | Creates private/public HTML from same payload |
| PY7 | `scripts/render_daily_json.py` | `todo` | html renderer | Creates public/private JSON artifacts |
| PY8 | `scripts/scan_sensitive.py` | `todo` | public publisher | Detects fake secret/cost/quantity samples |
| PY9 | `scripts/publish_public_report.py` | `todo` | public publisher | Copies only whitelist files |
| PY10 | `scripts/update_outcomes.py` | `todo` | outcome backtester | Fills demo 1/3/5/20 day outcome rows |

### P5. `asterion-pages` Templates

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| PG1 | Create reusable daily private template | `todo` | `templates/daily-private.html` | Renders complete fake private report |
| PG2 | Create reusable daily public template | `todo` | `templates/daily-public.html` | Contains no private fields |
| PG3 | Create report index template | `todo` | `templates/report-index.html` | Lists fake daily reports |
| PG4 | Create shared CSS | `todo` | `assets/styles.css` | Desktop/mobile no overlap in browser QA |
| PG5 | Create optional JS for filters/tabs | `todo` | `assets/app.js` | Works without server-side runtime |
| PG6 | Add fake examples | `todo` | `examples/daily/2099-01-01/index.html` | Uses fake data only |

### P6. Instance Repository Publishing

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| I1 | Define instance repo contract | `todo` | Docs in `BOOTSTRAP.md` or publisher reference | Explains `asterion-<instance>` role |
| I2 | Add whitelist copy logic | `todo` | Publisher script | Cannot copy files outside whitelist |
| I3 | Add sensitive scan gate | `todo` | Scan report JSON | Publish fails on seeded sensitive text |
| I4 | Add dry-run mode | `todo` | `--dry-run` option | Prints copy plan without writes |
| I5 | Add publish log in DB | `todo` | `public_exports` rows | Export row includes scan status |
| I6 | Test against temporary fake instance | `todo` | Temp dir output | `daily-reports.json` and HTML copied |
| I7 | Add optional `gh` instance repo bootstrap | `todo` | Documented commands or script wrapper | Creates/checks instance repo without private files |
| I8 | Add optional GitHub Pages setup guidance | `todo` | `BOOTSTRAP.md` or publisher reference | Explains manual/CLI setup and safety checks |

### P7. Real Market and News Adapters

MVP should start with mock providers. Real providers come after the DB, skill, and render loop are stable.

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| M1 | Implement mock market provider | `todo` | Deterministic fake OHLCV | Daily mock run stable |
| M2 | Implement AkShare/Tushare A-share adapter | `todo` | Market snapshots | Handles missing provider/API key gracefully |
| M3 | Implement yfinance US/HK fallback if needed | `todo` | Market snapshots | Handles unsupported ticker gracefully |
| M4 | Calculate technical indicators | `todo` | `technical_indicators` rows | Values match fixture |
| M5 | Implement mock news provider | `todo` | Deterministic fake news | Daily mock run stable |
| M6 | Implement web/news collector adapter | `todo` | `news_items` rows | Stores source URL and collected time |
| M7 | Link news to securities | `todo` | `news_security_links` rows | Fixture news links to expected ticker |
| M8 | Score event impact | `todo` | `impact_score`, confidence | Score deterministic for fixture |

### P8. Review and Outcome Loop

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| R1 | Implement pending review list | `todo` | JSON/table output | Shows unreviewed recommendations |
| R2 | Implement review recording | `todo` | `reviews` rows | Preserves original recommendation |
| R3 | Add review section to private HTML | `todo` | Static review instructions or exportable form placeholder | Does not imply auto-trading |
| R4 | Implement outcome horizon scheduler | `todo` | Due outcome query | Finds recommendations due for 1/3/5/20 day review |
| R5 | Implement outcome update | `todo` | `outcome_tracking` rows | Demo data computes returns |
| R6 | Implement strategy performance summary | `todo` | `strategy_performance` rows/report | Aggregates by action/rule |

### P9. Hardening and Handoff

| ID | Task | Status | Output | Verification |
|---|---|---|---|---|
| H1 | Add unit tests for deterministic scripts | `todo` | Test suite | Tests pass locally |
| H2 | Add integration demo run | `todo` | Fake DB to fake HTML pipeline | One command completes |
| H3 | Add privacy regression fixtures | `todo` | Scanner test cases | Sensitive samples fail |
| H4 | Add bootstrap smoke test | `todo` | `./bootstrap.sh check` | Passes on clean clone |
| H5 | Add handoff notes section updates | `todo` | This doc updated | Latest status visible |
| H6 | Add user-facing quickstart | `todo` | `BOOTSTRAP.md` | New agent can follow it |

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
- P3 skill packaging is complete: 10 skill folders exist, including vendored `a-share-report-analyzer`.
- P4 is partially complete: `check_environment.py`, `run_daily.py`, `build_daily_context.py`, `generate_recommendation_payload.py`, and `validate_recommendations.py` are implemented. Render, JSON export, sensitive scan, publisher, and outcome scripts remain.
- Current `Finance` workspace remains an instance repository candidate.

Next recommended task:

1. Continue P4 with renderer and privacy scripts: `render_daily_html.py`, `render_daily_json.py`, `scan_sensitive.py`, and `publish_public_report.py`.
2. Do not add real provider adapters until the mock daily pipeline exists.

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
- The 10 skills exist and describe their workflows.
- A mock daily run produces structured recommendations.
- Private and public HTML reports render from fake data.
- Sensitive scan blocks intentionally seeded private fields.
- Public publisher can dry-run and publish sanitized artifacts to a fake instance repo.
- `AGENTS.md` and `BOOTSTRAP.md` let a fresh agent understand how to run the system.
- This implementation plan reflects all completed work and has no stale handoff notes.
