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

export interface NegotiationPrompt {
  /** Person who, on the EFX check, would still want at least one item in the other's share. */
  envier: number
  /** Person whose share contains the contested item. */
  envied: number
  /** Contested item. */
  item: number
  /** Reference price agreed for that item. */
  price: number
  /** Half the reference price — the value the household has anchored on. */
  half: number
}

export interface DiscussResult {
  /** Negotiation prompts, one per contested item that has an agreed price. */
  prompts: NegotiationPrompt[]
  /** Items that are contested but have no agreed price, or have multiple wanters. */
  unresolved: number[]
}

export function discuss(
  _people: string[],
  _items: string[],
  _wants: boolean[][],
  _result: AllocationResult,
  prices: number[],
  contested: { envier: number; envied: number; item: number }[],
): DiscussResult {
  const prompts: NegotiationPrompt[] = []
  const unresolvedSet = new Set<number>()
  for (const c of contested) {
    const price = prices[c.item] ?? 0
    if (price > 0) {
      prompts.push({
        envier: c.envier,
        envied: c.envied,
        item: c.item,
        price,
        half: price / 2,
      })
    } else {
      unresolvedSet.add(c.item)
    }
  }
  return { prompts, unresolved: [...unresolvedSet] }
}
