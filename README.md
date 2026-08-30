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

1. **A split nobody can resent by more than one item.** Everyone marks what
   they want; the result guarantees that if you still feel someone did
   better, the *entire* difference is one indivisible item — the machine
   itself. This is the strongest no-hard-feelings guarantee that exists
   when items can't be cut in half.

2. **No reason to lie on your ballot.** This is not a promise about the
   app's honesty — it is a property of the mechanism, proven in the
   literature: over-claiming an item you barely want cannot get you a
   better outcome. Honesty is the best strategy, provably.

3. **A split that wastes nothing.** The same allocation that is fair is
   also efficient: no reassignment could give someone more of what they
   wanted without taking from someone else who wanted it.

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
rate everything 100, and the mechanism would reward the loudest bidder —
exactly the dynamic that made the group-chat argument unresolvable. A
yes/no ballot *provably* removes the incentive to inflate (see Babaioff,
Ezra & Feige 2020). The price is expressiveness: we lose the ability to
distinguish deep attachment from mild preference. We collect *less*
information because it is the only kind we can handle honestly.

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
  out even. If two or more people wanted it, no cash amount can close
  the gap for both — so FairShare proposes nothing and says so.
- **The final verdict is re-checked, not assumed.** After a settlement,
  the fairness check runs again with the cash included. If envy is gone,
  you see a green verdict. If it isn't, FairShare says *"envy remains"*
  rather than dressing the result up.

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
"only by one item," and that item is named in the notes below the table,
in a sentence written for a person, not for a proof system: who may feel
hard done by, what the entire gap consists of, and why that gap couldn't
be closed (the item can't belong to both).

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
welfare, max utilitarian welfare, and truthful. Those five properties
package into the plain-English promises above: no more than one item of
envy (EFX), honesty is dominant (truthful), and nothing is wasted
(welfare-maximal).

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
check — the piece that re-derives, for every pair of roommates, the answer
to *"if you swapped shares, would you actually receive more of the things
you wanted?"* Nothing about the result is taken on trust; every number
shown is recomputed from the ballots.

**Cash settlement.** `settle()` inspects the contested edges the verifier
flags. For each edge where the envier is the **sole** wanter of every
contested item, it proposes `sum(prices[i] / 2)` from envier to envied,
then recomputes the envy matrix with cash valued 1:1 against items
(scaled by the median price) and reports the post-money `isEF` / `isEFX`
honestly — including "still envious" when that's the truth. Edges with
multiple wanters produce no transfer, by design: no cash amount can
close a gap between two people who both want the item.

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
