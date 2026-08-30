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

## What the algorithm does for you

You don't need to know the math to benefit from it. Here is what FairShare
gives a household, in plain terms:

1. **A split where no envy is more than one item deep.** Everyone marks
   what they want; wherever someone still feels a neighbor did better, you
   can point to one item in that neighbor's share whose removal makes the
   feeling go away. The check for this property (called EFX) is run on the
   actual result, every time, and shown to you. For indivisible goods and
   want/don't-want preferences, this is a strong fairness guarantee.

2. **A ballot with a research footing, not a promise about strategy.** The
   yes/no ballot is a deliberate trade-off (explained below). The
   mechanism Babaioff, Ezra & Feige (2020) design for these ballots is
   provably truthful — honesty is the best strategy *in their mechanism*.
   FairShare computes a same-family split and verifies its EFX-ness;
   it does not implement their exact mechanism and does not certify
   truthfulness of the running app.

3. **A split that wastes nothing.** The family of allocations the engine
   computes is the efficient one for binary ballots: no reassignment could
   give someone more of what they wanted without taking from someone else
   who wanted it. This efficiency property is a property of the
   allocation family (proved in the literature), not something the app
   re-checks per run — the per-run check is the EFX one.

4. **An answer to "why did they get it and not me?"** Right under the
   result, FairShare re-checks its own work and answers, for every pair of
   people: *"if you swapped shares, would you actually be better off?"*
   When the answer is no, you see it. When the answer is "only by that one
   item," you see that too — with the item named.

5. **No favoritism by code.** The split isn't computed by whoever argues
   loudest, or by a heuristic that happens to prefer whoever entered the
   data. It's computed by a fixed rule with a published proof behind it,
   from Babaioff, Ezra & Feige (2020), and the result is independent of
   who runs the app.

That last item is worth dwelling on, because it is the actual product. A
splitting app that says *"trust us, it's fair"* is asking for the same leap
of faith the group chat was asking for. FairShare instead shows its work:
the fairness check is recomputed from the ballots, in front of you, every
time.

## The two honest compromises

FairShare is not magic, and two of its design choices are deliberate
trade-offs. Stating them plainly is part of the product.

### 1. Want / don't-want — no intensity

"I'd fight for that espresso machine" and "eh, it'd be nice to have" both
look like a single checkmark. FairShare cannot tell them apart, and this is
a choice, not an oversight.

If we asked you to rate items 0–100 instead, a strategic roommate would
rate everything 100 — the intuitive dynamic that made the group-chat
argument unresolvable. But that's an intuition, not a theorem. The
theorem worth naming goes the other way: once the items you want can
differ in value by even a little, combining truthfulness with
fairness/efficiency is already hard in general — that's a result from
mechanism design, not something an app can promise away. The yes/no
ballot gives up intensity for a rule that is easy to check and has a
better research footing (see Babaioff, Ezra & Feige 2020). We collect
*less* information on purpose; the trade is deliberate.

When two people both want the same item with different intensities, no
mechanism — ours or any other — can read that difference from a yes/no
ballot. That's not a bug to fix; it's a conversation for the household.
FairShare's job is to make sure that conversation is about *one* named
item, with a fair split already settled around it.

### 2. Cash can price an item, not a feeling

Some splits end with a contested item and no envy-free solution. FairShare
won't pretend otherwise. It offers the one tool that exists for indivisible
goods — money — under strict conditions, and tells you honestly whether
even that closed the gap:

- **Prices come from the household, together, before voting.** The price
  sheet is filled in the open, by everyone, *before* the split runs —
  never quietly by one person after the fact. Agreeing on a market
  reference price up front is what keeps the ballot honest: if prices
  were set after you knew who envied what, you could mark "want" on an
  item you don't care about just to collect a settlement. Set first and
  in the open, that play stops being worth anything.
- **Cash only applies where it is honest.** If exactly one person wanted
  the contested item, the other side receives **half its agreed price**:
  one side keeps the item, the other keeps the money, and the two come
  out even. If two or more people wanted it, the app deliberately
  proposes nothing — no automatic cash amount can stand in for a
  negotiation between people who all want the same thing, so the call
  is left to the household: split the difference, coin-flip, rotate
  ownership over time.
- **The settlement is a proposed split, not a certified EFX.** The
  pre-cash allocation is the part the app checks against the EFX
  definition; the cash row is a negotiation aid, not a guarantee. The
  app does not certify EFX (or envy-freeness) for the post-settlement
  row — its job is to show the proposed split honestly and let the
  household decide.

Money here is not "buying silence" and it is not a claim that cash equals
sentiment. It is the honest admission that for one class of conflicts —
sole wanter, indivisible item — a market reference price is the only
conversion that both sides can verify.

## How the fairness check talks to you

Most splitting apps show you a result and ask you to trust it. FairShare
re-computes the fairness claim from the ballots every time and translates
it into one question a person actually cares about:

> *If you swapped your share with anyone else's, would you actually be
> better off?*

The envy table answers this for every pair of roommates. A green cell
means "no — you're doing fine with what you have." An amber cell means
"only by one related item" — and that item is named in the notes below
the table, in a sentence written for a person, not a proof system: who
may feel hard done by, which item in the other share would close the
envy if it were removed, and why that item couldn't go to both people
anyway (the item can't be split).

If you don't trust the table, you can check it by hand: the check is plain
arithmetic on the ballots you just entered — count what each person marked
as wanted, count what they got, count what they'd have gotten from the
other share. Every number the app shows is one you can reproduce with a
pencil.

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

## For the technically curious

Everything above works without knowing any of this. But if you want to
check the machinery — the citations, the algorithm, the proofs behind each
promise — it's all below.

**The result being used.** For *dichotomous* (binary) valuations — every
item either wanted or not — Babaioff, Ezra & Feige (2020), *Fair and
Truthful Mechanisms for Dichotomous Valuations*, show that a
**Lorenz-dominating** allocation is simultaneously EFX, EF1, max Nash
welfare, max utilitarian welfare, and truthful. In their paper,
"truthful" is a property of the *mechanism* — a participant's dominant
strategy is to report honestly. FairShare does not implement that exact
mechanism, so it does not inherit the truthfulness property as a
guarantee; it does inherit the EFX / EF1 / welfare family of properties
for the *kind* of allocation it computes, and `verify()` checks EFX
against the result.

**How the engine finds it.** `src/lib/fairdiv.ts` computes a leximin /
Lorenz-dominating allocation via cost-reducing augmenting paths — the
optimal semi-matching technique of Harvey et al.:

1. Greedy warm start: give each wanted item to the wanter with the
   smallest current load.
2. Repeatedly find an augmenting path that drops the highest-loaded
   person's load by 2, walking through items each person holds and would
   swap for a wanted one. Apply the path.
3. Stop when no reducing path exists: the load vector is leximin-optimal,
   which is exactly the state the paper proves is EFX for binary
   valuations.

**The verifier.** `verify()` is independent of `allocate()`: given the
wants matrix and the allocation, it recomputes every utility, every envy
entry, and every aggregate from scratch. In the UI, this is the fairness
check — the piece that re-derives, for every pair of roommates, the
answer to *"if you swapped shares, would you actually receive more of
the things you wanted?"* Nothing about the result is taken on trust;
every number shown is recomputed from the ballots.

**Cash settlement.** `settle()` inspects the contested edges the verifier
flags. For each edge where the envier is the **sole** wanter of every
contested item, it proposes `sum(prices[i] / 2)` from envier to envied.
Cash is not part of the original paper's result: the prices are a
negotiation tool this app adds on top, agreed by the household before
voting, and the post-settlement row is a *proposed split*, not a
guarantee. The pre-cash allocation is the part that the paper's EFX
guarantee attaches to; with cash in the mix, the app stops short of
certifying EFX and leaves the final call to the household. Edges with
multiple wanters produce no transfer, by design: when several people
all want the same item, no automatic cash amount can stand in for the
negotiation, and the app stays silent.

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
