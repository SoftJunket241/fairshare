// Quick correctness + property smoke for fairdiv.ts via Node 24 type-stripping.
import * as m from './src/lib/fairdiv.ts';

function shuffle(a) { for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function rbool(p=0.4){ return Math.random()<p; }

let pass=0, fail=0; const fails=[];
function assert(c, msg){
  if (c) pass++; else { fail++; fails.push(msg); }
}

function gen(n,mItems, p=0.4){
  const people=Array.from({length:n},(_,i)=>'P'+i);
  const items=Array.from({length:mItems},(_,i)=>'I'+i);
  const wants=Array.from({length:n},()=>Array.from({length:mItems},()=>rbool(p)));
  return {people, items, wants};
}

function exhaust(n,mItems){
  const total=1<<(n*mItems);
  for (let mask=0; mask<total; mask++){
    const {people, items, wants:ws}=gen(n,mItems);
    let k=0;
    for (let i=0;i<n;i++) for (let j=0;j<mItems;j++){ ws[i][j] = ((mask>>k)&1)===1; k++; }
    const r=m.allocate(people, items, ws);
    const v=m.verify(people, items, ws, r);
    return {r,v};
  }
}

// Exhaustive 2x2 (16 cases)
for (let mask=0; mask<16; mask++){
  const ws=[[!!(mask&1),!!(mask&2)],[!!(mask&4),!!(mask&8)]];
  const r=m.allocate(['A','B'],['x','y'],ws);
  const v=m.verify(['A','B'],['x','y'],ws,r);
  // Invariants
  const bundles=r.bundles, assignment=r.assignment, utilities=r.utilities;
  // 1) assignment consistency
  for (let i=0;i<2;i++){ if (assignment[i]!==-1) assert(bundles[assignment[i]].includes(i),`assign ${i}`); }
  // 2) utilities match verify
  for (let a=0;a<2;a++){ let u=0; for (const i of bundles[a]) if (ws[a][i]) u++; assert(utilities[a]===u,`util ${a}`); assert(v.utilities[a]===u,`v.util ${a}`); }
  // 3) EFX claim matches verify
  if (v.isEF) { for (let a=0;a<2;a++) for (let b=0;b<2;b++) if (a!==b) assert(v.envy[a][b]<=0,`EF implies envy<=0 (${a},${b})`); }
  if (v.isEFX) { for (let a=0;a<2;a++) for (let b=0;b<2;b++) if (a!==b) assert(v.envy[a][b]<=1,`EFX implies envy<=1 (${a},${b})`); }
  // 4) verify isEFX for 2x2 dichotomy is always true (per the math)
  assert(v.isEFX===true,`2x2 EFX universal truth: mask=${mask} got ${v.isEFX}`);
}

// Random 3x6 — 200 trials
for (let t=0; t<200; t++){
  const {people, items, wants:ws}=gen(3,6);
  const r=m.allocate(people, items, ws);
  const v=m.verify(people, items, ws, r);
  for (let a=0;a<3;a++) for (let b=0;b<3;b++) if (a!==b) {
    if (v.envy[a][b]>0 && ws[a].filter((_,i)=>r.bundles[b].includes(i) && ws[a][i]).length===0){
      assert(false,`envy[${a}][${b}]=${v.envy[a][b]} but no overlapping wanted item`);
    }
  }
}

// Random 5x10 — 100 trials, just don't crash
for (let t=0; t<100; t++){
  const {people, items, wants:ws}=gen(5,10);
  const r=m.allocate(people, items, ws);
  const v=m.verify(people, items, ws, r);
  assert(typeof v.isEF==='boolean' && typeof v.isEFX==='boolean', 'returns booleans');
}

// ---------------------------------------------------------------------------
// discuss() — the discussion-prompt helper. With the cash-as-executable-
// transfer framing removed, discuss() is what the UI calls to surface
// contested items + the household-agreed reference price. It does not
// propose a transfer direction; it produces a list of talking points.
// ---------------------------------------------------------------------------

// (a) EFX-1 with a priced item -> one prompt naming the item, the envier,
//     the envied, and the reference price. No "from/to" or "half" is
//     emitted — discuss() does not pick a transfer direction or split.
{
  const people = ['A','B']
  const items  = ['x','y']
  const wants  = [[true, true], [false, true]]
  const r = m.allocate(people, items, wants)
  const contested = [{ envier: 0, envied: 1, item: 0 }]
  const prices = [10, 0]
  const d = m.discuss(people, items, wants, r, prices, contested)
  assert(d.prompts.length === 1, `EFX-1 priced: 1 prompt (got ${d.prompts.length})`)
  assert(d.prompts[0].item === 0, 'EFX-1 priced: item index correct')
  assert(d.prompts[0].envier === 0 && d.prompts[0].envied === 1, 'EFX-1 priced: envier/envied labelled')
  assert(d.prompts[0].price === 10, 'EFX-1 priced: reference price carried')
  assert(d.unresolved.length === 0, 'EFX-1 priced: nothing in unresolved')
}

// (b) Contested item with price=0 -> not surfaced as a prompt; it lands in
//     the unresolved list so the UI can flag "no reference price agreed".
{
  const people = ['A','B']
  const items  = ['x','y']
  const wants  = [[true, true], [false, true]]
  const r = m.allocate(people, items, wants)
  const contested = [{ envier: 0, envied: 1, item: 0 }]
  const prices = [0, 0]
  const d = m.discuss(people, items, wants, r, prices, contested)
  assert(d.prompts.length === 0, 'unpriced contested: no prompt produced')
  assert(d.unresolved.length === 1 && d.unresolved[0] === 0, 'unpriced contested: item in unresolved')
}

// (c) Random 3x6 with all prices set: every contested item with a price
//     becomes a prompt, and every prompt's price matches the input.
for (let t=0; t<100; t++){
  const {people, items, wants:ws} = gen(3, 6);
  const r = m.allocate(people, items, ws);
  const prices = items.map(()=> 1 + Math.floor(Math.random()*20));
  const v = m.verify(people, items, ws, r);
  const contested = [];
  for (let a=0;a<3;a++) for (let b=0;b<3;b++){
    if (a===b || v.envy[a][b]<=0) continue;
    for (let i=0;i<items.length;i++){
      if (r.bundles[b].includes(i) && ws[a][i]) {
        contested.push({ envier: a, envied: b, item: i });
      }
    }
  }
  if (contested.length === 0) continue;
  const d = m.discuss(people, items, ws, r, prices, contested);
  for (const p of d.prompts){
    assert(p.price === prices[p.item], `prompt price matches input (item ${p.item})`);
    assert(p.envier !== p.envied, 'prompt: envier != envied');
  }
  // The number of priced contested items should equal the number of prompts.
  const pricedContested = contested.filter(c => (prices[c.item] ?? 0) > 0);
  assert(d.prompts.length === pricedContested.length, 'prompt count = priced contested count');
}

console.log(`fairdiv: ${pass} pass, ${fail} fail`);
if (fail){ for (const f of fails.slice(0,10)) console.log('  - '+f); process.exit(1); } else process.exit(0);
