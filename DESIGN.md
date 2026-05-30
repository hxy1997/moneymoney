---
name: Finance Reports
description: A refined research workbench for browsing, comparing, and reading equity reports.
colors:
  bg: "oklch(1 0 0)"
  surface: "oklch(0.975 0.004 265)"
  surface-raised: "oklch(0.955 0.008 265)"
  ink: "oklch(0.205 0.025 265)"
  muted: "oklch(0.48 0.025 265)"
  line: "oklch(0.86 0.018 270)"
  primary: "oklch(0.476 0.175 261.2)"
  primary-soft: "oklch(0.93 0.035 262)"
  violet: "oklch(0.52 0.145 292)"
  violet-soft: "oklch(0.94 0.032 292)"
  danger: "oklch(0.53 0.14 30)"
  success: "oklch(0.46 0.12 160)"
typography:
  display:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif"
    fontSize: "32px"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif"
    fontSize: "24px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 620
    lineHeight: 1.35
  body:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 560
    lineHeight: 1.25
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "9px 14px"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 13px"
  report-list-item:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "9px 12px"
---

# Design System: Finance Reports

## 1. Overview

**Creative North Star: "The White Research Desk"**

Finance Reports should feel like a precise research workbench placed on a white desk: calm, structured, and ready for sustained reading. The visual system is product-first, so it uses familiar dashboard patterns, restrained density, and a disciplined hierarchy rather than showpiece decoration.

The interface rejects dark neon trading terminal language, generic SaaS card mosaics, and decorative charting. Its polish comes from typography, rule lines, exact spacing, and rare blue-violet emphasis. The layout should make a reader confident that the reports are maintained, comparable, and easy to cite.

**Key Characteristics:**
- White and cool gray surfaces with visible structure.
- Blue as the main focus and action color, violet as a secondary comparison color.
- Dense but calm report browsing, with long-form Markdown reading as the center of gravity.
- Components that behave like a workbench: searchable, sortable, keyboard-friendly, and responsive.

## 2. Colors

The palette is restrained: pure white carries the surface, cool grays define layers, and cobalt-violet accents mark focus, selection, and charts.

### Primary
- **Cobalt Focus** (`oklch(0.476 0.175 261.2)`): primary actions, focus rings, active filters, report selection, and important links. Use on less than 10 percent of any screen.

### Secondary
- **Research Violet** (`oklch(0.52 0.145 292)`): comparison lines, selected section indicators, secondary chart series, and subtle active states where cobalt is already present.

### Tertiary
- **Risk Red** (`oklch(0.53 0.14 30)`): valuation pressure, risk labels, and negative states.
- **Quality Green** (`oklch(0.46 0.12 160)`): positive quality signals and favorable valuation states.

### Neutral
- **Pure Desk White** (`oklch(1 0 0)`): body background and primary reading surface.
- **Cool Sheet** (`oklch(0.975 0.004 265)`): toolbars, sidebar wells, table header bands, and inactive chips.
- **Raised Gray** (`oklch(0.955 0.008 265)`): subtle grouped surfaces and hover states.
- **Ink Blue-Black** (`oklch(0.205 0.025 265)`): primary text.
- **Muted Blue-Gray** (`oklch(0.48 0.025 265)`): secondary labels and timestamps.
- **Violet Rule** (`oklch(0.86 0.018 270)`): borders, dividers, table rules, and inactive control strokes.

### Named Rules

**The White Desk Rule.** The body background stays pure white. Mood comes from cobalt, violet, type, and structure, not from tinted cream or dark mode.

**The Rare Accent Rule.** Cobalt and violet are functional marks. They indicate action, selection, or comparison. They are not decorative washes.

## 3. Typography

**Display Font:** system UI sans stack with SF Pro Display when available  
**Body Font:** system UI sans stack with SF Pro Text when available  
**Label/Mono Font:** use the same sans stack unless displaying literal code, ticker symbols, or file paths

**Character:** The typography is crisp and institutional. One tuned sans family keeps product controls, financial data, and long-form Chinese/English report text consistent.

### Hierarchy

- **Display** (650, 32px, 1.1): page title and selected report title on desktop.
- **Headline** (650, 24px, 1.2): major report sections and empty-state headings.
- **Title** (620, 16px, 1.35): report list titles, metric labels with emphasis, panel headings.
- **Body** (400, 15px, 1.7): Markdown report prose, with line length capped at 65-75ch in the reading column.
- **Label** (560, 12px, 1.25): metadata, filter labels, table captions, and compact status text. Avoid all-caps except for ticker symbols and short market codes.

### Named Rules

**The Reading Column Rule.** Long-form report text gets the best measure and line height on the page. Controls may be dense, but prose must breathe.

## 4. Elevation

The system is flat by default and uses tonal layering plus fine borders instead of decorative shadows. Depth appears through surface shifts, dividers, and active states. Shadows are reserved for popovers or sticky elements that genuinely float above scrolling content.

### Shadow Vocabulary

- **Popover Shadow** (`0 8px 24px color-mix(in oklch, var(--ink) 12%, transparent)`): dropdowns, command-style search results, and mobile filter panels only.
- **Sticky Hairline** (`0 1px 0 var(--line)`): sticky top bar, section navigator, and table headers.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are not raised at rest. Hover may tint a row, but it should not turn every item into a floating card.

## 5. Components

### Buttons

- **Shape:** precise rounded rectangle, 8px radius.
- **Primary:** cobalt fill with white text, 9px 14px padding, used for one dominant action such as opening the selected report source.
- **Hover / Focus:** hover deepens the cobalt slightly; focus uses a 2px cobalt ring with a 2px white offset.
- **Secondary / Ghost:** white background, violet-gray border, cobalt text. Use for filters, source links, and non-destructive actions.

### Chips

- **Style:** compact, 6px radius, cool sheet background, violet rule border.
- **State:** selected chips use pale cobalt or pale violet fill plus a dark text label and a check or active marker. Never rely on color alone.

### Cards / Containers

- **Corner Style:** 8px for repeated report rows and metric blocks, 12px only for larger grouped surfaces.
- **Background:** white for content, cool sheet for secondary areas, raised gray for hover and grouped context.
- **Shadow Strategy:** no shadows at rest. Use borders and tonal contrast.
- **Border:** 1px violet rule for tool regions and list boundaries.
- **Internal Padding:** 12px for compact list rows, 16px for metrics, 24px for report header areas.

### Inputs / Fields

- **Style:** white fill, 1px violet rule border, 8px radius, 9px 12px padding.
- **Focus:** cobalt border and visible focus ring.
- **Error / Disabled:** risk red border for errors with text explanation; disabled controls lower opacity and keep readable labels.

### Navigation

- **Style:** sticky top toolbar with white background, hairline border, and compact controls.
- **Report List:** left rail on desktop, stacked list on mobile. Active item uses a pale cobalt background, bold title, and icon or marker.
- **Section Navigation:** sticky within the reading pane. Current section uses cobalt text plus underline or marker.
- **Mobile Treatment:** filters collapse into a horizontal chip row and the report list precedes the selected report summary.

### Signature Component: Valuation Strip

A horizontal valuation strip compares safety value, current value, and intrinsic value. Use fine lines, labeled ticks, and a single active marker. It must include text labels so risk and opportunity are not communicated by color alone.

## 6. Do's and Don'ts

### Do:

- **Do** keep the body background `oklch(1 0 0)` and use cool gray layers for structure.
- **Do** use cobalt for focus, selected state, primary action, and links.
- **Do** use violet as a secondary comparison color, especially in charts and section markers.
- **Do** make report reading the center of the page, with prose capped around 65-75ch.
- **Do** show keyboard focus clearly on buttons, chips, list items, and section links.
- **Do** use skeleton rows for report loading and clear empty states for no search results.

### Don't:

- **Don't** make this a dark neon trading terminal.
- **Don't** make it a generic SaaS card wall.
- **Don't** make a marketing landing page or hero-first brochure.
- **Don't** fill the interface with decorative charts that do not support filtering, comparison, or judgment.
- **Don't** use purple-blue gradient spectacle, glassmorphism, or oversized soft shadows.
- **Don't** use thick colored side-stripe borders as list accents.
- **Don't** rely on color alone for action, valuation, risk, market, or selection state.
