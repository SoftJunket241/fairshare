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
   feeling go away. The app verifies this property (called EFX) on the
   actual result, every time, and shows you the check. For binary (want /
   don't-want) preferences and indivisible items, this is a meaningful
   fairness property.

2. **A ballot with a research footing, not a promise about strategy.** The
   yes/no ballot is a deliberate trade-off (explained below). The
   mechanism Babaioff, Ezra & Feige (2020) design for these ballots is
   provably truthful — honesty is the best strategy *in their mechanism*.
   FairShare uses a binary allocation routine inspired by this line of work and verifies its EFX result;
   it does not implement their exact mechanism and does not certify
   truthfulness of the running app.

3. **A result you can inspect.** FairShare shows who received each item
   and independently checks the EFX condition from the ballots. It does
   not ask the household to trust an unexplained score.

4. **An answer to "why did they get it and not me?"** Right under the
   result, FairShare re-checks its own work and answers, for every pair of
   people: *"if you swapped shares, would you actually be better off?"*
   When the answer is no, you see it. When the answer is "only by that one
   item," you see that too — with the item named.

5. **No favoritism by code.** The split isn't computed by whoever argues
   loudest, or by a heuristic that happens to prefer whoever entered the
   data. It is computed by a deterministic, published rule and checked
   against the EFX definition on the result shown. The result is
   independent of who runs the app.

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
won't pretend otherwise. It offers an optional negotiation tool — money —
as conversation prompts, under strict conditions:

- **Prices come from the household, together, before voting.** The price
  sheet is filled in the open, by everyone, *before* the split runs —
  never quietly by one person after the fact. Agreeing on a reference
  price before voting makes the later negotiation more transparent: if
  prices were set after you knew who envied what, you could mark "want"
  on an item you don't care about just to tilt the later bargaining. Set
  first and in the open, that play has less room to operate.
- **The app surfaces prompts, not transfers.** For every contested item
  with an agreed reference price, FairShare shows the people involved
  and the shared reference price. It recommends no payer, no recipient,
  no outcome — the household decides how to resolve it. If an item is
  contested but no price was agreed, the app flags it explicitly so the
  household knows a number is missing before they can have that
  conversation.
- **The pre-cash split is the part with a mathematical guarantee.** The
  app's EFX check runs against the allocation itself, before any cash
  enters the picture. The prompts below that are a *starting point for
  a conversation*, not a guarantee. The app does not certify EFX (or
  envy-freeness) for any post-cash outcome — its job is to show the
  prompts honestly and let the household decide.

Money here is not "buying silence" and it is not a claim that cash equals
sentiment. It is the honest admission that for a contested indivisible
item with an agreed reference price, that price can give the household
one shared starting point for negotiation.

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
item either wanted or not — Babaioff, Ezra & Feige (2020), [*Fair and
Truthful Mechanisms for Dichotomous Valuations*](https://doi.org/10.1145/3391403.3399487), design a mechanism
they call the Prioritized Egalitarian (PE) mechanism. The PE mechanism
is *truthful*: a participant's dominant strategy is to report honestly.
When agents do report truthfully, the PE mechanism returns a
Lorenz-dominating allocation; that allocation happens to carry EFX,
EF1, max Nash welfare, and max utilitarian welfare properties. (Those
are properties of the *PE mechanism's output*, not of the allocation
FairShare computes.) FairShare does not implement the PE mechanism, so
it does not claim any of those properties as guarantees about the
running app. What FairShare *does* guarantee is narrower:

- FairShare independently checks EFX on the allocation it returns.
  The check is run on the actual ballots and the actual result, in
  front of you, every time.
- FairShare does **not** currently claim a formal equivalence to PE,
  to Lorenz domination, to welfare optimality, or to truthfulness.
  Every further property of the theory needs assumptions the app
  has not been audited against.

**How the engine finds it.** `src/lib/fairdiv.ts` uses a deterministic
leximin-style allocation routine inspired by augmenting-path
techniques (the optimal semi-matching line of work, including Harvey
et al.):

1. Greedy warm start: give each wanted item to the wanter with the
   smallest current load.
2. Repeatedly find an augmenting path that drops the highest-loaded
   person's load by 2, walking through items each person holds and would
   swap for a wanted one. Apply the path.
3. Stop when no reducing path exists.

The result is a load vector that is leximin-small. We are *not*
asserting that the implementation is a faithful reproduction of the
PE mechanism or of any specific Lorenz-dominating routine from the
literature; the EFX property of the output is what `verify()` checks
on every run, and the only mathematical claim attached to the result
is that one.

**The verifier.** `verify()` is independent of `allocate()`: given the
wants matrix and the allocation, it recomputes every utility, every envy
entry, and every aggregate from scratch. In the UI, this is the fairness
check — the piece that re-derives, for every pair of roommates, the
answer to *"if you swapped shares, would you actually receive more of
the things you wanted?"* Nothing about the result is taken on trust;
every number shown is recomputed from the ballots.

**Conversation prompts.** `discuss()` inspects the contested edges the verifier
flags. For each contested item where the household has agreed a reference
price, it surfaces a conversation prompt naming the envier, the envied,
the item, and the reference price. Items with no agreed price land in an
unresolved list the UI flags explicitly. The function proposes no payer,
no payee, no amount. Cash is not part of the original paper's result:
the prices are a negotiation tool this app adds on top, agreed by the
household before voting, and the prompts are a *starting point for a
conversation*, not a guarantee. The app re-checks EFX on the
pre-cash allocation; the cash row is the household's own call.

## How the tests work

```
$ node test-fairdiv.mjs
fairdiv: property tests pass, 0 fail
```

`test-fairdiv.mjs` runs through Node 24's native TypeScript type-stripping
(`import * as m from './src/lib/fairdiv.ts';`):

- 16-mask exhaustive sweep over 2×2 dichotomies (the "universal truth"
  that EFX is always achievable for 2×2 binary).
- 200 random 3×6 trials, asserting the verifier's envy matrix matches
  the bundles the allocator returned.
- 100 random 5×10 trials, asserting the engine doesn't crash and the
  booleans are booleans.
- A dedicated `discuss()` block: every contested item with an agreed price
  becomes a conversation prompt labelled by envier, envied, item, and
  reference price; items with no price land in an unresolved list; the
  function proposes no payer, no payee, no amount.
- 100 random 3×6 trials confirming every prompt's price matches the input
  and the prompt's price matches the input price.

```
$ node e2e.cjs
```

The Playwright end-to-end test runs against a built `dist/` server. It
fills the ballots, clicks through allocation, opens the money card, asserts
the conversation prompts render, and confirms the localStorage
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
  lib/fairdiv.ts       # the engine: allocate / verify / discuss
  components/ui/       # shadcn primitives on @base-ui/react
test-fairdiv.mjs       # property test for the engine (each run should pass, 0 fail)
e2e.cjs                # Playwright end-to-end + privacy-by-design check
shots/                 # rendered screenshots referenced from the UI
public/
  favicon.svg          # F mark
```
