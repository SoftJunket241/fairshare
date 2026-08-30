# FairShare

> The move-out split, settled by mathematics instead of a shouting match.

Every shared flat ends the same way. The lease is up, the truck is rented, and
the one conversation nobody scheduled arrives: *who gets the espresso
machine?* Someone bought it. Someone uses it more. Someone is sure they'd
miss it most. It is a three-minute argument that people are still having
about the same machine in the group chat a year later.

FairShare exists because that argument is not actually about the espresso
machine. It is about whether the split can be *trusted* — whether the person
who ends up without it has a reason to feel cheated, or a proof that they
don't.

## The idea

FairShare's premise is simple: **an unfairness you can verify is easier to
accept than a fairness you have to take on faith.**

So instead of a splitting app that says *"trust us, it's fair"*, FairShare
does something more honest:

- **The math chooses.** Everyone privately marks the items they actually
  want. The allocation is computed by an algorithm with a published proof
  behind it — not by a heuristic, not by whoever argues loudest.
- **The math shows its work.** An independent verifier recomputes every
  fairness claim from scratch, directly from the ballots. The app never
  asks you to trust the allocator; it shows you the envy matrix and lets
  you check it yourself.
- **The math admits its limits.** When an item everyone wants can't be cut
  in half, perfect envy-freeness may be mathematically impossible. FairShare
  says so — and then offers a cash settlement to close the gap, and tells
  you honestly whether even that was enough.

That last point is the soul of the project. A tool that claims perfect
fairness is selling something; a tool that can tell you *"this is the
strongest fairness mathematics allows here, and here's the receipt"* is
doing something rarer. It turns a fight over furniture into a fact people
can agree on.

There is even a quiet social claim in the privacy design: the ballot — *who
wants what* — is the most sensitive data a household produces. It encodes
desires, rivalries, and self-images people never say out loud. FairShare
keeps ballots in memory only and erases them once the split is computed,
because a fairness tool that leaks your household's private wants would be
a strange kind of fair.

## The math

For **dichotomous** (binary) valuations — the roommate case where every
item is either wanted or not — there is a clean, deterministic result:

> *Babaioff, Ezra & Feige (2020), "Fair and Truthful Mechanisms for
> Dichotomous Valuations."* A Lorenz-dominating allocation is simultaneously
> EFX, EF1, max Nash welfare, max utilitarian welfare, and truthful.

That single sentence carries three remarkable promises at once:

1. **EFX** — nobody envies anyone else's share by more than one indivisible
   item. (Remove any single item from the envied share and the envy is gone.)
2. **Truthful** — nobody gains by lying on their ballot. In a house full of
   people tempted to overclaim, honesty is the best strategy *provably*,
   not as a matter of trust.
3. **Welfare-maximal** — the same split maximizes Nash and utilitarian
   welfare. Fairness with no efficiency sacrifice.

The engine (`src/lib/fairdiv.ts`) implements a leximin / Lorenz-dominating
allocation via cost-reducing augmenting paths (the optimal semi-matching
technique of Harvey et al.). The algorithm is greedy + rebalancing:

1. Greedy warm start — give each wanted item to the person with the
   smallest current load.
2. Repeatedly find an augmenting path that drops the highest-loaded
   person's load by 2, walking through a sequence of items each person
   already has and would swap for a wanted one. Apply the path.
3. Stop when no reducing path exists — the load vector is leximin-optimal.

That final state is the property the paper proves is EFX (and EF1) for
binary valuations.

### Cash settlement for the EFX-1 case

EFX is, in general, not achievable with a simple rule on arbitrary
valuations. The honest statement is: *"A is not envious of B once A gets
some of what they want, or equivalently, once A is fully compensated for
B's bundle."* For binary valuations, when the envier is the **sole** wanter
of the contested item, the gap can be closed by a half-price transfer from
the envier to the envied:

- `settle()` (also in `src/lib/fairdiv.ts`) inspects the contested edges
  flagged by the verifier. For each edge where the envier is the only
  person who wants every contested item, it proposes a transfer of
  `sum(prices[i] / 2)`.
- It then recomputes the envy matrix **including the cash proxy** (cash
  valued 1:1 with items, scaled by the median price) and reports the
  resulting `isEF` / `isEFX` so the user can see what the post-money
  verdict actually is.

## The verifier pattern

`verify()` is independent of `allocate()`. Given a `wants` matrix and an
allocation result, it recomputes every utility, every envy entry, and every
aggregate (`isEF`, `isEFX`, Nash welfare, utilitarian welfare, worst-off)
from scratch. The allocator could be lying; the verifier would catch it.

This is the same shape a cryptographic proof would take — except the
witness is the recomputation, not a SNARK. It is a small pattern with a
large consequence: the app's fairness claims are not marketing, they are
checkable arithmetic, and the checking is built into the product rather
than promised in the README.

## Privacy by design

The ballot is the most sensitive part of the run: it reveals who wants
what, which leaks more about the household than people realise. FairShare
keeps ballots in memory only.

- `localStorage["fairshare"]` carries **only** `{ people, items }` — the
  roster and the item list, not the wants matrix.
- The Playwright e2e (`e2e.cjs`) opens DevTools, dumps
  `localStorage["fairshare"]`, parses it, and asserts
  `!("wants" in parsed)`. If the wants matrix ever leaks to storage, the
  test goes red.

## How the tests work

```
$ node test-fairdiv.mjs
fairdiv: 276 pass, 0 fail
```

`test-fairdiv.mjs` runs through Node 24's native TypeScript type-stripping
(`import * as m from './src/lib/fairdiv.ts';`):

- 16-mask exhaustive sweep over 2×2 dichotomies (the "universal truth"
  that EFX is always achievable for 2×2 binary).
- 200 random 3×6 trials, asserting the verifier's envy matrix matches
  the bundles the allocator returned.
- 100 random 5×10 trials, asserting the engine doesn't crash and the
  booleans are booleans.
- A dedicated `settle()` block: EFX-1 shape → exactly one transfer at
  half-price; multi-wanter contested → no transfer; all-zero prices → no
  transfer; empty contested → envy matches `verify()`; 100 random 3×6
  trials confirming every transfer's amount is within the per-item price
  bounds.

```
$ node e2e.cjs
```

The Playwright end-to-end test runs against a built `dist/` server. It
fills the ballots, clicks through allocation, opens the money card, asserts
the post-settlement verdict renders, and confirms the localStorage
contract from above.

## Tech

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 + shadcn/ui (on `@base-ui/react`)
- `@fontsource-variable/geist` for type
- Node 24 native TS type-stripping for the test runner (no `tsx`/`ts-node`)

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # outputs dist/
npm run preview      # serves dist/ on http://localhost:4173
node test-fairdiv.mjs
node e2e.cjs         # after `npm run build`
```

## Layout

```
src/
  App.tsx              # single-file UI, all surfaces (ballot, results, money)
  lib/fairdiv.ts       # the engine: allocate / verify / settle
  components/ui/       # shadcn primitives on @base-ui/react
test-fairdiv.mjs       # property test for the engine (276 assertions)
e2e.cjs                # Playwright end-to-end + privacy-by-design check
shots/                 # rendered screenshots referenced from the UI
public/
  favicon.svg          # F mark
```
