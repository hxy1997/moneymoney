# GitHub Pages Workbench Implementation Brief

## Goal

Build a static GitHub Pages workbench for the Markdown equity reports in this repository. The page should open directly into report browsing, filtering, comparison, and long-form reading. It should follow `PRODUCT.md`, `DESIGN.md`, and `.impeccable/design.json`.

## Constraints

- Static only. No server-side runtime and no build step required for GitHub Pages.
- Keep paths relative so the site works from a GitHub Pages project subpath.
- Do not change the report Markdown content.
- Do not commit changes.
- Use native HTML/CSS/JS. CDN libraries are allowed.
- Prefer minimal dependencies:
  - `marked` for Markdown rendering.
  - `Fuse.js` for search.
  - Avoid chart libraries unless they clearly improve the UX. A CSS/SVG valuation strip is preferred.

## Files To Create

- `index.html`
- `assets/styles.css`
- `assets/app.js`
- `reports.json`

## Data Model

Create `reports.json` as a curated index for the existing reports:

- MSFT Microsoft report:
  - path: `reports/equity/us/MSFT/2026/2026-05-30_MSFT_Microsoft/report.md`
  - market: `US`
  - ticker: `MSFT`
  - company: `Microsoft`
  - title: `微软分析及评估报告`
  - date: `2026-05-30`
  - industry: `Software / Cloud / AI`
  - score: `8.62`
  - action: `持有`
  - currentValue label: `$450.24`
  - safetyValue label: `$417`
  - intrinsicValue label: `$501`
  - current numeric: `450.24`
  - safety numeric: `417`
  - intrinsic numeric: `501`
  - summary: short Chinese summary from the conclusion.

- RoboSense report:
  - path: `reports/equity/hk/2498/2026/2026-05-30_2498_RoboSense/report.md`
  - market: `HK`
  - ticker: `2498`
  - company: `RoboSense`
  - title: `速腾聚创分析及评估报告`
  - date: `2026-05-30`
  - industry: `LiDAR / Robotics / Edge AI`
  - score: `6.6`
  - action: `中性`
  - currentValue label: `HK$31.64`
  - safetyValue label: `HK$25.16`
  - intrinsicValue label: `HK$38.70`
  - current numeric: `31.64`
  - safety numeric: `25.16`
  - intrinsic numeric: `38.70`
  - summary: short Chinese summary from the conclusion.

## Layout

Desktop:

- Sticky top toolbar:
  - Product name: `Finance Reports`
  - Subtitle: `Equity research workbench`
  - Search input
  - Market segmented filter: All / US / HK
  - Year filter
  - Sort select
- Main shell:
  - Left rail report list.
  - Main reading workspace.

Main workspace:

- Selected report header: title, company, ticker, market, date, industry.
- Key metric row:
  - Score
  - Action
  - Current value
  - Safety value
  - Intrinsic value
- Valuation strip:
  - Horizontal line with labeled ticks for safety/current/intrinsic values.
  - Must handle current value between safety and intrinsic.
  - Include text labels so it is not color-only.
- Section navigator:
  - Extract `h2` headings from rendered Markdown.
  - Sticky inside the report area.
  - Scroll to matching section.
- Markdown report body:
  - Render headings, tables, links, inline code, emphasis, lists.
  - Tables should scroll horizontally on mobile.
  - Add external link attributes safely.

Mobile:

- Toolbar stacks cleanly.
- Filters become horizontal chips.
- Report list appears before selected report.
- Reading column remains comfortable.

## Interactions

- Search reports by ticker, company, title, market, industry, action, and summary.
- Filter by market and year.
- Sort by newest, score high-to-low, company A-Z.
- Click or keyboard-select a report from the list.
- Maintain selected report in `location.hash`.
- Show a helpful empty state when no reports match.
- Show a loading state while Markdown is fetched.
- Gracefully show an error state if a report cannot be loaded.
- Use visible focus states for all interactive elements.
- Respect `prefers-reduced-motion`.

## Visual Direction

Follow `DESIGN.md` closely:

- Background: pure white.
- Surface layers: cool gray whites.
- Primary: cobalt.
- Secondary: violet.
- Typography: system sans, refined and compact.
- Use fine borders and tonal layers instead of heavy shadows.
- No dark neon terminal, no SaaS card wall, no marketing hero, no decorative chart clutter, no gradient text, no glassmorphism.

## Acceptance Checks

- Opening `index.html` through a local web server renders the workbench.
- Both reports appear in the list.
- Search and filters work.
- Selecting each report fetches and renders the correct Markdown.
- Section navigation is populated and scrolls.
- Valuation strip renders for both reports.
- Desktop and mobile layouts do not overlap.
- `git status --short` shows only intended new/modified files.
