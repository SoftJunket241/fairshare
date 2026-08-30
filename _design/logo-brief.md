# FairShare — Logo Design Brief

> Project context for the designer. The brand, the meaning, the constraints, the
> three concepts the team already considered. Take what's useful, throw away the
> rest. This brief is a starting point, not a contract.

---

## 1. What FairShare is

A web app that splits shared household items among roommates when they move out.
Everyone votes privately what they want; the algorithm returns a split that is
**checked to be EFX** (envy-free up to any one item) — a strong fairness
guarantee for indivisible goods under binary preferences, re-verified against
the ballots on every run.

The product is bilingual (Vietnamese / English), works on mobile, and is being
submitted to a math / computer-science competition with the judging criteria:

- Novelty
- Polish / completeness
- Practical value
- Technical quality

The mark has to hold up in a **16 px browser tab**, a **40 px app header**, and
the **favicon on a dark ground**. Every judge will see it at 16 px first.

---

## 2. The brand in one sentence

**The split that mathematics vouches for.**

The app's two-color vocabulary is the brand's two-color vocabulary:

| Color | Token | Meaning |
|---|---|---|
| Violet | `oklch(0.63 0.216 292)` | Envy-free — the common, calm case |
| Amber | `oklch(0.78 0.16 85)` | Envy by exactly one item — the gap math can't close |
| Dark ground | `oklch(0.145 0.008 285)` | The app's default surface |

A green cell in the envy matrix means "no envy". An amber cell means "envies by
one item." The mark should feel like a single cell of that matrix, lifted off
the page.

---

## 3. Voice

- **Honest, not glossy.** The app's "About" dialog says "we don't ask you to
  trust us, the verifier recomputes from scratch." The logo shouldn't oversell.
- **Two-color discipline.** No gradients, no third accent, no neumorphism.
  The favicon at 16 px has to read; that means two flat shapes max.
- **The mark IS the result.** Not a stylized letter that happens to be F. Not a
  stock shield. It should look like a thing this app would draw.

---

## 4. Three concepts the team already considered

These are documented in `_design/logo-concepts.html` (open it in a browser — it
is a styled identity sheet, not source). All three are SVG, all three use the
two app tokens, all three were stress-tested at 16 / 28 / 40 / 64 px.

### Concept 01 — The Verdict Mark
Two equal circles = two people. A small square = the contested item. A faint
amber dashed line = the one-item gap.

- **Strength:** The mark *is* an EFX verdict.
- **Weakness:** Without the wordmark it can read as a generic "two-people" icon.

### Concept 02 — The Honest Split
A horizontal bar partitioned into three cells — two violet, one amber — with a
hairline ground line. Mirrors the results screen exactly.

- **Strength:** The bar IS the result. Survives any size.
- **Weakness:** At 16 px the amber cell can read as a progress-bar tail.

### Concept 03 — The F Mark
A custom-drawn letter F whose horizontal arms separate into two stacks; the
top arm is two violet bars, the bottom arm is one amber bar.

- **Strength:** Most "logo-shaped"; works as a real wordmark.
- **Weakness:** The narrative is the most indirect of the three.

The current shipped favicon (`public/favicon.svg`) is Concept 03. None of the
three is final — the team is open to a fourth direction.

---

## 5. What to push on

These are the failure modes of the three existing concepts. A better mark
sidesteps at least two of them.

- **Concept 01** can read as a generic "people" icon at 16 px.
- **Concept 02** can read as a progress bar or a bar chart.
- **Concept 03** can read as a chunky letter that doesn't connect to the
  product until you read the wordmark.

If a fourth direction solves one of these without introducing a new problem,
it's worth exploring. Specifically:

1. **The mark should look like a thing FairShare would draw.** A single
   contested cell, a leximin bar, a Lorenz curve, an envy matrix cell, a
   cash-settle arrow — anything that is recognizably a *result* of the app,
   not a generic pictogram.
2. **Two colors, flat fills.** No gradients. The amber must stay amber at
   16 px and on the dark ground.
3. **Read at 16 px in a browser tab.** If you have to squint, the design
   failed.
4. **The "honest" voice.** The mark should feel like a verdict, not a
   marketing logo. Restrained, not exuberant.

---

## 6. Deliverables (what to send back)

Pick whichever the prompt tool supports, but at minimum:

- **SVG** of the chosen mark, in a `viewBox="0 0 40 40"` square.
- **A second SVG** at `viewBox="0 0 16 16"` for the favicon, or instructions
  for how the 40×40 collapses cleanly.
- **Two color usage:**
  - Violet `oklch(0.63 0.216 292)` (or the lighter tab variant
    `oklch(0.82 0.13 292)` if needed for contrast on a light tab).
  - Amber `oklch(0.78 0.16 85)` (or the lighter `oklch(0.85 0.16 85)` for
    the same reason).
- **A one-line description** of what the mark depicts, in plain English —
  the team will use it in the about dialog.
- **A note on the dark ground.** The app's default surface is
  `oklch(0.145 0.008 285)`. The mark should sit on that ground cleanly; if
  it needs an enclosing rounded square, that's fine, but the inner mark
  must still read without the enclosure.

---

## 7. Where the mark lives in the product

- `public/favicon.svg` — the 16 px tab icon
- App header — 40 px, sits next to the "FairShare" wordmark
- Open Graph share card (if added later) — 256 px
- The about dialog icon (if added) — 24 px

That's it. The mark is not used as a watermark, not used as a button, not
animated. One job: identify the product.

---

## 8. Files to read before designing

- `src/lib/fairdiv.ts` — the algorithm (so the mark echoes the math, not
  just the words).
- `README.md` — the project pitch.
- `_design/logo-concepts.html` — the three concepts the team has already
  tried.
- `shots/final-desktop-results.png` — what the mark sits next to in the
  shipped UI.

---

## 9. Constraints we cannot negotiate

- The shipped favicon is referenced from `index.html` and the manifest; the
  team will wire up whatever you send back.
- The app is open-source. The mark should be either original to the project
  or properly licensed.
- Two colors. No gradients. Flat fills. 16 px legibility.

Everything else is a suggestion.
