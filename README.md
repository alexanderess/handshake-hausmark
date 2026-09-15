# Hausmark RCCS — Homeowner Self-Assessment

A single-page, dependency-free web version of the **Hausmark RCCS Scorecard**, co-branded
with Handshake. It lets a homeowner score the interior design (ID) firm they are about to
sign with, and explains why escrow-backed payment matters before a deposit is paid.

Built from `Hausmark_RCCS_Scorecard.xlsx` (sheets: *RCCS Scorecard*, *Pillar Guide*).

## Running it

Static files, no build step. Open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
```

## What it does

- **11 weighted pillars** transcribed verbatim from the workbook, with the Pillar Guide's
  scoring descriptors shown on each option so scoring is consistent rather than a guess.
- **Live scoring** that mirrors the workbook formula exactly:
  `points = (answer / 10) × weight × 100`, where Yes / Good = 10, Partially = 5,
  No / Unsure = 0. Weights sum to 1.00, so a perfect assessment totals 100.
- **Score bands** — 80–100 strong confidence, 65–79 proceed with caution, below 65 high risk.
- **Critical red-flag check** on pillars 6 (Commitment Confidence) and 11 (Online Presence),
  reproducing the workbook's `RED FLAG` / `Caution` logic. A high total never clears a flag.
- **Weight as a visual** — option values, weight meters and breakdown bars are all scaled to
  the pillar's share of the 100 points, so pillar 6 (15) visibly outweighs pillar 1 (5).
- **Next-best-action** prompt: the heaviest unanswered pillar, or once complete, the largest
  recoverable gap.
- **Compare up to 3 firms** side by side, with per-pillar pips and best-in-row highlighting.
- **Escrow section** explaining why escrow protects the homeowner, and what Handshake
  Renovation Safeguard wraps around it.
- Answers persist in `localStorage` only — nothing leaves the browser. Print / save-as-PDF
  and copy-summary are both supported.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure and all copy |
| `assets/css/styles.css` | Design tokens, layout, light + dark themes, print styles |
| `assets/js/data.js` | The 11 pillars, weights, scoring descriptors, bands, worked example |
| `assets/js/app.js` | Scoring, red-flag logic, rendering, persistence |

## Design tokens

The palette is lifted from the source workbook's own cell fills and font colours, so the page
and the spreadsheet read as one system: `#121621` Hausmark ink, `#4E36F5` Handshake indigo,
`#8B5CF6` violet (critical-pillar marker), and the workbook's conditional-formatting
green / amber / red for Yes / Partially / No.

## Before this goes live

`handshake.finance` was unreachable from the build environment (blocked by the network egress
proxy), so the Handshake-side content could not be checked against the live site. Please verify
before publishing:

1. **Renovation Safeguard specifics.** The paragraph in the `#escrow` section describes escrow
   mechanics only — it deliberately states no coverage amounts, percentages, fees, timeframes
   or guarantees, because none could be confirmed. Add the real product specifics. The block is
   marked with a `NEEDS VERIFICATION` comment in `index.html`.
2. **Handshake brand assets.** The co-brand lockup is currently a typographic wordmark. Swap in
   the real Handshake logo and confirm the accent hex against the brand guidelines.
3. **Hausmark brand assets.** Same — replace the `Hausmark.` wordmark with the real mark, and
   confirm whether the Hausmark Seal has an official badge to show on pillar 10.
4. **"RCCS" expansion.** Deliberately never spelled out on the page, since the workbook does not
   define the acronym. Expand it if there is an official wording.
5. **ID Directory link.** The footer links to `handshake.finance/iddirectory-onboarding` as the
   designer-side call to action — confirm that is the right destination.
