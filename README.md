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

## Design system

The frontend is matched to the Handshake product UI (reference: the ID Directory onboarding
form). The characteristics carried across:

- **A violet gradient band** across the top of a white card, the way their onboarding form
  headers each step. Here it carries the live assessment progress instead of "Step 1 of 2".
- **White rounded cards** (22px radius) on a light grey ground, with soft shadows.
- **One typeface** — Plus Jakarta Sans, 400 to 800. No serif, no mono; numerals use
  `font-variant-numeric: tabular-nums` so scores stay aligned in columns.
- **Violet uppercase section labels**, bold and letterspaced.
- **Pale-lavender notice boxes** with a violet hairline border.
- **Inputs** at 10px radius with a hairline border and a violet focus ring, and red required
  asterisks.

Tokens live at the top of `assets/css/styles.css`:

| Token | Light | Purpose |
| --- | --- | --- |
| `--violet` | `#7B2FF2` | primary accent |
| `--violet-mark` | `#9B5CE6` | Handshake logo purple |
| `--ink` | `#150B35` | Handshake wordmark near-black |
| `--band-from` / `--band-to` | `#7B2FF2` → `#8F4BF6` | the gradient band |
| `--hausmark-red` | `#DE1F26` | Hausmark mark only |

Two notes on the token structure. `--band-from`, `--band-to` and `--btn-bg` are deliberately
separate from the violet scale: that scale lightens for dark mode, which washed out any surface
carrying white text. And Hausmark red is never used as UI chrome — only inside the Hausmark mark
itself — so it can never be confused with the red "High risk" state.

## Logos

`assets/img/` holds four files: a light and a dark variant for each brand, swapped by CSS at
`.brand-logo--light` / `.brand-logo--dark`. Replacing a logo means replacing files, not markup.

**These are recreations, traced by eye from supplied images, not the real brand assets.** The
Handshake mark's geometry is close and the Hausmark seal is approximate; both wordmarks fall back
to system faces because an SVG loaded through `<img>` cannot use the page's webfont. Replace all
four with the official files before this goes anywhere public.

## Sourcing of the Handshake content

Direct HTTP access to `handshake.finance` is blocked by the build environment's network egress
proxy, so the pages could not be read first-hand. The escrow section was instead written from
web-search results summarising Handshake's own pages. Every claim on the page traces to one of:

| Claim on the page | Source |
| --- | --- |
| Funds held in a MAS-regulated escrow account at DBS | `handshake.finance/home-owner/`, `/mas-escrow-singapore-interior-design-construction/` |
| Dedicated custodian accounts, fully segregated client accounts | `handshake.finance/home-owner/` |
| Released only on the homeowner's approval of each milestone | `handshake.finance/home-owners/` |
| Disputes freeze the funds; no unilateral access | `handshake.finance/home-owner/` |
| Structured negotiation / mediation / arbitration, timelines set in advance | `handshake.finance/home-owners/` |
| CASE / Small Claims Tribunal / court may still follow | `handshake.finance/home-owners/` |
| No legitimate reason for a deposit above 20%; 4–5 stages, 10–15% upfront | `handshake.finance/renovation-deposit-singapore/` |
| Renovation insurance excludes deposit loss, contractor default, payment disputes, incomplete works | `handshake.finance/renovation-insurance-singapore/` |
| No licensing regime for interior design in Singapore | Handshake pre-seed announcement, June 2026 |
| The ID invites the homeowner to the project | `handshake.finance/interior-designers/` |

## Before this goes live

1. **Check the wording against the live pages.** The facts above came from search summaries, not
   from reading the pages directly. Confirm the exact figures and phrasing before publishing.
2. **"Renovation Safeguard" as a product name could not be confirmed.** No search result mentions
   it. The name is used here because it was specified in the brief; the substance underneath it is
   sourced as above. Confirm it is the correct public name for the offering.
3. **The ID Directory could not be confirmed either.** `handshake.finance/iddirectory-onboarding`
   returned no search results, and the designer-facing page that does surface is
   `handshake.finance/interior-designers/`. The footer currently links to the onboarding URL from
   the brief — confirm that is the live destination.
4. **Handshake brand assets.** The co-brand lockup is a typographic wordmark. Swap in the real
   Handshake logo and confirm the accent hex against the brand guidelines.
5. **Hausmark brand assets.** Same — replace the `Hausmark.` wordmark with the real mark, and
   confirm whether the Hausmark Seal has an official badge to show on pillar 10.
6. **"RCCS" expansion.** Deliberately never spelled out, since the workbook does not define the
   acronym. Expand it if there is an official wording.
