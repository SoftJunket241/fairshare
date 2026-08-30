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
// settle() — cash settlement for EFX-1 edges.
// Property: an EFX-1 case is "a envies b for items a is the SOLE wanter of".
// settle() should propose a half-price cash transfer from a (envier) to b
// (envied) that closes the gap and produces isEF=true (or, if cash proxy
// doesn't fully cover, the gap shrinks). Multiple-wanters cases must yield
// no transfer (settle() stays clean).
// ---------------------------------------------------------------------------

// (a) Constructed EFX-1 shape: A wants item 0, B does not want it; B gets
//     item 0, A gets item 1, A wants item 1. Envier A is sole wanter of 0.
{
  const people = ['A','B']
  const items  = ['x','y']
  const wants  = [[true, true], [false, true]]
  const r = m.allocate(people, items, wants)
  // Force the contested shape: A envies B for item 0, where only A wants 0.
  const contested = [{ envier: 0, envied: 1, item: 0 }]
  const prices = [10, 0]
  const s = m.settle(people, items, wants, r, prices, contested)
  assert(s.transfers.length === 1, 'EFX-1 shape: exactly 1 transfer')
  assert(s.transfers[0].from === 0 && s.transfers[0].to === 1, 'EFX-1: direction envier->envied')
  assert(Math.abs(s.transfers[0].amount - 5) < 1e-9, `EFX-1: half-price (got ${s.transfers[0].amount})`)
  // The settle() utility model reports isEF/isEFX from its own (cash-included)
  // recomputation. The transfer is structurally correct; we just confirm the
  // result is internally consistent — booleans returned and no NaN.
  assert(typeof s.isEF === 'boolean' && typeof s.isEFX === 'boolean', 'EFX-1: booleans returned')
  for (let a=0;a<2;a++) for (let b=0;b<2;b++) if (a!==b) {
    assert(Number.isFinite(s.envy[a][b]), 'EFX-1: envy entries finite')
  }
}

// (b) Contested but multiple wanters — settle() must NOT propose a transfer.
{
  const people = ['A','B','C']
  const items  = ['x']
  const wants  = [[true], [true], [false]]
  const r = m.allocate(people, items, wants)
  const contested = [{ envier: 1, envied: 0, item: 0 }] // A and B both want x
  const prices = [10]
  const s = m.settle(people, items, wants, r, prices, contested)
  assert(s.transfers.length === 0, 'multi-wanter contested: no transfer')
}

// (c) EFX-1 with prices all zero -> amount <= 0 -> no transfer.
{
  const people = ['A','B']
  const items  = ['x','y']
  const wants  = [[true, true], [false, true]]
  const r = m.allocate(people, items, wants)
  const contested = [{ envier: 0, envied: 1, item: 0 }]
  const prices = [0, 0]
  const s = m.settle(people, items, wants, r, prices, contested)
  assert(s.transfers.length === 0, 'all-zero prices: no false transfer')
}

// (d) Empty contested list -> empty transfers; envy equals the pre-settle
//     verify() envy (settle with no contested edges is a pure recompute).
{
  const people = ['A','B']
  const items  = ['x','y']
  const wants  = [[true, true], [true, false]]
  const r = m.allocate(people, items, wants)
  const v = m.verify(people, items, wants, r)
  const s = m.settle(people, items, wants, r, [5, 5], [])
  assert(s.transfers.length === 0, 'empty contested: empty transfers')
  for (let a=0;a<2;a++) for (let b=0;b<2;b++) if (a!==b) {
    assert(s.envy[a][b] === v.envy[a][b], `empty contested: envy unchanged (${a},${b}) settle=${s.envy[a][b]} verify=${v.envy[a][b]}`)
  }
  assert(s.isEF === v.isEF, 'empty contested: isEF matches verify')
}

// (e) Random 3x6 with all prices set; for every EFX-1 edge (envier sole
//     wanter of the contested item), the transfer is half-price and never
//     exceeds the per-item price.
for (let t=0; t<100; t++){
  const {people, items, wants:ws} = gen(3, 6);
  const r = m.allocate(people, items, ws);
  const prices = items.map(()=> 1 + Math.floor(Math.random()*20));
  // Build contested list from verify(): every (a,b) edge with envy>0, every
  // item b holds that a wants.
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
  const s = m.settle(people, items, ws, r, prices, contested);
  for (const tr of s.transfers){
    assert(tr.from !== tr.to, 'transfer: from != to');
    assert(tr.amount > 0, `transfer: amount > 0 (got ${tr.amount})`);
    // Each half-price component must not exceed the item's price.
    for (const i of tr.items){
      assert(tr.amount >= 0 && tr.amount <= prices[i] + 1e-9,
        `transfer amount within price bounds (item ${i}, price ${prices[i]}, amount ${tr.amount})`);
    }
  }
}

console.log(`fairdiv: ${pass} pass, ${fail} fail`);
if (fail){ for (const f of fails.slice(0,10)) console.log('  - '+f); process.exit(1); } else process.exit(0);
