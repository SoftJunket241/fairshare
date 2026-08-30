export interface AllocationResult {
  assignment: number[]
  bundles: number[][]
  utilities: number[]
  unwanted: number[]
}

export interface VerifyResult {
  utilities: number[]
  envy: number[][]
  isEF: boolean
  isEFX: boolean
  nashWelfare: number
  utilitarian: number
  worstOff: number
}

export function allocate(
  people: string[],
  items: string[],
  wants: boolean[][],
): AllocationResult {
  const n = people.length
  const m = items.length

  const assignment = new Array<number>(m).fill(-1)
  const load = new Array<number>(n).fill(0)

  for (let i = 0; i < m; i++) {
    let best = -1
    for (let p = 0; p < n; p++) {
      if (wants[p][i]) {
        if (best === -1 || load[p] < load[best]) best = p
      }
    }
    if (best !== -1) {
      assignment[i] = best
      load[best]++
    }
  }

  let improved = true
  let guard = 0
  const maxIter = (n * m + n) * (m + 1) + 1000
  while (improved) {
    improved = false
    if (++guard > maxIter) break

    const order = [...Array(n).keys()].sort((a, b) => load[b] - load[a])
    for (const hi of order) {
      const path = findReducingPath(hi, wants, assignment, load, n, m)
      if (path) {
        applyPath(path, assignment, load)
        improved = true
        break
      }
    }
  }

  const bundles: number[][] = Array.from({ length: n }, () => [])
  const unwanted: number[] = []
  for (let i = 0; i < m; i++) {
    if (assignment[i] === -1) unwanted.push(i)
    else bundles[assignment[i]].push(i)
  }

  return { assignment, bundles, utilities: load.slice(), unwanted }
}

interface Move {
  item: number
  from: number
  to: number
}

function findReducingPath(
  hi: number,
  wants: boolean[][],
  assignment: number[],
  load: number[],
  n: number,
  m: number,
): Move[] | null {
  const target = load[hi] - 2
  if (target < 0) return null

  const visitedPerson = new Array<boolean>(n).fill(false)
  const prev: (Move | null)[] = new Array(n).fill(null)
  visitedPerson[hi] = true
  const queue: number[] = [hi]

  while (queue.length) {
    const u = queue.shift() as number
    if (u !== hi && load[u] <= target) {
      const moves: Move[] = []
      let cur = u
      while (prev[cur]) {
        const mv = prev[cur] as Move
        moves.push({ item: mv.item, from: mv.from, to: cur })
        cur = mv.from
      }
      moves.reverse()
      return moves
    }
    for (let i = 0; i < m; i++) {
      if (assignment[i] !== u) continue
      for (let v = 0; v < n; v++) {
        if (v === u || visitedPerson[v]) continue
        if (wants[v][i]) {
          visitedPerson[v] = true
          prev[v] = { item: i, from: u, to: v }
          queue.push(v)
        }
      }
    }
  }
  return null
}

function applyPath(moves: Move[], assignment: number[], load: number[]): void {
  for (const mv of moves) {
    assignment[mv.item] = mv.to
  }
  if (moves.length) {
    load[moves[0].from]--
    load[moves[moves.length - 1].to]++
  }
}

export function verify(
  people: string[],
  _items: string[],
  wants: boolean[][],
  result: AllocationResult,
): VerifyResult {
  const n = people.length

  const valueOf = (a: number, itemList: number[]) =>
    itemList.reduce((s, i) => s + (wants[a][i] ? 1 : 0), 0)

  const utilities = new Array<number>(n).fill(0)
  for (let a = 0; a < n; a++) utilities[a] = valueOf(a, result.bundles[a])

  const envy: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(0),
  )
  let isEF = true
  let isEFX = true

  for (let a = 0; a < n; a++) {
    for (let b = 0; b < n; b++) {
      if (a === b) continue
      const own = utilities[a]
      const other = valueOf(a, result.bundles[b])
      const diff = other - own
      envy[a][b] = diff
      if (diff > 0) {
        isEF = false
        if (diff > 1) isEFX = false
      }
    }
  }

  const utilitarian = utilities.reduce((s, u) => s + u, 0)
  const nashWelfare = utilities.reduce((prod, u) => prod * u, 1)
  const worstOff = Math.min(...utilities)

  return { utilities, envy, isEF, isEFX, nashWelfare, utilitarian, worstOff }
}

export interface Transfer {
  from: number
  to: number
  amount: number
  items: number[]
}

export interface SettleResult {
  transfers: Transfer[]
  utilities: number[]
  isEF: boolean
  isEFX: boolean
  envy: number[][]
}

export function settle(
  people: string[],
  _items: string[],
  wants: boolean[][],
  result: AllocationResult,
  prices: number[],
  contested: { envier: number; envied: number; item: number }[],
): SettleResult {
  const n = people.length

  const edgeItems = new Map<string, number[]>()
  const key = (a: number, b: number) => `${a}->${b}`
  for (const c of contested) {
    const k = key(c.envier, c.envied)
    const arr = edgeItems.get(k) ?? []
    arr.push(c.item)
    edgeItems.set(k, arr)
  }

  const transfers: Transfer[] = []
  for (const [k, itemList] of edgeItems) {
    const [aStr, bStr] = k.split("->")
    const a = Number(aStr)
    const b = Number(bStr)
    const onlyWanter = itemList.every(
      (i) => wants[a][i] && !wants.some((w, p) => p !== a && w[i]),
    )
    if (!onlyWanter) continue
    const amount = itemList.reduce((s, i) => s + (prices[i] ?? 0) / 2, 0)
    if (amount <= 0) continue
    transfers.push({ from: a, to: b, amount, items: itemList })
  }

  const cash: number[] = new Array(n).fill(0)
  for (const t of transfers) cash[t.to] += t.amount

  const valueOf = (a: number, itemList: number[]) =>
    itemList.reduce((s, i) => s + (wants[a][i] ? 1 : 0), 0)

  const medianPrice = (() => {
    const ps = prices.filter((p) => p > 0).slice().sort((x, y) => x - y)
    if (ps.length === 0) return 0
    return ps[Math.floor(ps.length / 2)] || 1
  })()
  const utilities = new Array<number>(n).fill(0)
  for (let p = 0; p < n; p++) {
    utilities[p] = valueOf(p, result.bundles[p])
    if (medianPrice > 0) utilities[p] += cash[p] / medianPrice
  }

  const envy: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(0),
  )
  let isEF = true
  let isEFX = true
  for (let a = 0; a < n; a++) {
    for (let b = 0; b < n; b++) {
      if (a === b) continue
      const own = utilities[a]
      const other = valueOf(a, result.bundles[b]) + (cash[b] > 0 ? cash[b] / medianPrice : 0)
      const diff = other - own
      envy[a][b] = diff
      if (diff > 0) {
        isEF = false
        if (diff > 1) isEFX = false
      }
    }
  }

  return { transfers, utilities, isEF, isEFX, envy }
}
