import { useEffect, useMemo, useState } from "react"
import {
  allocate,
  verify,
  settle,
  type AllocationResult,
  type VerifyResult,
  type SettleResult,
} from "@/lib/fairdiv"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { STRINGS, detectLang, setLang, type Lang } from "@/i18n"

const AVATAR = [
  "bg-gradient-to-br from-orange-400 to-rose-500 shadow-orange-500/30",
  "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30",
  "bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sky-500/30",
  "bg-gradient-to-br from-fuchsia-400 to-violet-500 shadow-fuchsia-500/30",
  "bg-gradient-to-br from-amber-300 to-orange-500 shadow-amber-500/30",
  "bg-gradient-to-br from-indigo-400 to-purple-600 shadow-indigo-500/30",
]

const PRESETS = {
  roommates: {
    people: ["An", "Binh", "Chi"],
    items: [
      "Sofa",
      "TV",
      "Espresso machine",
      "Bookshelf",
      "Rice cooker",
      "Standing lamp",
      "Air fryer",
    ],
  },
  startup: {
    people: ["Founder A", "Founder B", "Founder C"],
    items: [
      "Domain name",
      "GitHub org",
      "Customer list",
      "Server credits",
      "Logo files",
      "Slack archive",
    ],
  },
  trip: {
    people: ["Mai", "Lan", "Huy"],
    items: [
      "Tent",
      "Stove",
      "First-aid kit",
      "Cooler",
      "Power bank",
      "Binoculars",
    ],
  },
  club: {
    people: ["Trung", "Phương", "Hà"],
    items: [
      "Speaker",
      "Projector",
      "Banner stand",
      "Mic set",
      "Trophies",
      "Camera",
    ],
  },
} as const

type Screen = "setup" | "vote" | "results"
type Theme = "light" | "dark"

function detectTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  try {
    const saved = localStorage.getItem("fairshare-theme") as Theme | null
    if (saved === "light" || saved === "dark") return saved
  } catch { }
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

function applyTheme(theme: Theme) {
  try {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  } catch { }
}

function saveTheme(theme: Theme) {
  try { localStorage.setItem("fairshare-theme", theme) } catch { }
}

function saveSetup(people: string[], items: string[]) {
  try {
    localStorage.setItem("fairshare", JSON.stringify({ people, items }))
  } catch { }
}
function loadSetup(): { people: string[]; items: string[] } {
  try {
    const raw = JSON.parse(localStorage.getItem("fairshare") || "null")
    if (raw && Array.isArray(raw.people) && Array.isArray(raw.items))
      return { people: raw.people, items: raw.items }
  } catch { }
  return { people: [], items: [] }
}

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => detectLang())
  const t = STRINGS[lang]
  const [theme, setThemeState] = useState<Theme>(() => detectTheme())
  const [screen, setScreen] = useState<Screen>("setup")
  const [people, setPeople] = useState<string[]>([])
  const [items, setItems] = useState<string[]>([])
  const [personInput, setPersonInput] = useState("")
  const [itemInput, setItemInput] = useState("")

  const [wants, setWants] = useState<Record<string, boolean[]>>({})
  const [voterIdx, setVoterIdx] = useState(0)
  const [handoff, setHandoff] = useState(true)

  const [prices, setPrices] = useState<number[]>([])
  const [pricesOn, setPricesOn] = useState(false)

  const [result, setResult] = useState<{
    people: string[]
    items: string[]
    wants: boolean[][]
    res: AllocationResult
    v: VerifyResult
  } | null>(null)

  useEffect(() => {
    const s = loadSetup()
    setPeople(s.people)
    setItems(s.items)
  }, [])

  useEffect(() => { saveSetup(people, items) }, [people, items])
  useEffect(() => { setPrices((prev) => items.map((_, i) => prev[i] ?? 0)) }, [items])
  useEffect(() => { setLang(lang) }, [lang])
  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#0a0a0a" : "#fafafa",
    )
    document.querySelector<HTMLLinkElement>("#app-favicon")?.setAttribute(
      "href",
      theme === "dark"
        ? "/favicon-dark-32.png?v=brand-dark-fba-2"
        : "/favicon-light-32.png?v=brand-light-005316-2",
    )
  }, [theme])

  function toggleTheme() {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const canStart = people.length >= 2 && items.length >= 1

  function addPerson() {
    const v = personInput.trim()
    if (!v || people.includes(v) || people.length >= 6) return
    setPeople([...people, v])
    setPersonInput("")
  }
  function addItem() {
    const v = itemInput.trim()
    if (!v || items.includes(v)) return
    setItems([...items, v])
    setItemInput("")
  }

  function startVoting() {
    const fresh: Record<string, boolean[]> = {}
    people.forEach((p) => (fresh[p] = items.map(() => false)))
    setWants(fresh)
    setVoterIdx(0)
    setHandoff(true)
    setScreen("vote")
  }

  function toggleWant(person: string, i: number) {
    setWants((w) => {
      const copy = { ...w, [person]: [...w[person]] }
      copy[person][i] = !copy[person][i]
      return copy
    })
  }

  function nextVoter() {
    if (voterIdx < people.length - 1) {
      setVoterIdx(voterIdx + 1)
      setHandoff(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      compute()
    }
  }

  function compute() {
    const wantsMatrix = people.map((p) => wants[p].slice())
    const res = allocate(people, items, wantsMatrix)
    const v = verify(people, items, wantsMatrix, res)
    setResult({ people, items, wants: wantsMatrix, res, v })
    setWants({})
    setVoterIdx(0)
    setScreen("results")
  }

  function startOver() {
    if (!confirm("Clear everyone and every item and start fresh?")) return
    setPeople([])
    setItems([])
    setResult(null)
    setScreen("setup")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24">
        <TopBar screen={screen} lang={lang} onLang={setLangState} theme={theme} onTheme={toggleTheme} t={t} />
        {screen === "setup" && (
          <Setup
            people={people}
            items={items}
            personInput={personInput}
            itemInput={itemInput}
            setPersonInput={setPersonInput}
            setItemInput={setItemInput}
            addPerson={addPerson}
            addItem={addItem}
            removePerson={(i) => setPeople(people.filter((_, idx) => idx !== i))}
            removeItem={(i) => setItems(items.filter((_, idx) => idx !== i))}
            loadPreset={(p) => {
              setPeople([...PRESETS[p].people])
              setItems([...PRESETS[p].items])
            }}
            canStart={canStart}
            prices={prices}
            setPrices={setPrices}
            pricesOn={pricesOn}
            setPricesOn={setPricesOn}
            onStart={startVoting}
            t={t}
          />
        )}
        {screen === "vote" && (
          <Vote
            people={people}
            items={items}
            wants={wants}
            voterIdx={voterIdx}
            handoff={handoff}
            onReady={() => setHandoff(false)}
            onToggle={toggleWant}
            onNext={nextVoter}
            onBack={() => setScreen("setup")}
            t={t}
          />
        )}
        {screen === "results" && result && (
          <Results
            data={result}
            onReVote={startVoting}
            onStartOver={startOver}
            prices={prices}
            t={t}
            lang={lang}
          />
        )}
      </div>
    </div>
  )
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span
      className={
        "rounded-full px-2.5 py-1 text-xs font-medium transition-colors " +
        (active
          ? "bg-accent text-foreground ring-1 ring-inset ring-violet-400/40"
          : done
            ? "text-emerald-400"
            : "text-muted-foreground")
      }
    >
      {label}
    </span>
  )
}

function TopBar({
  screen,
  lang,
  onLang,
  theme,
  onTheme,
  t,
}: {
  screen: Screen
  lang: Lang
  onLang: (l: Lang) => void
  theme: Theme
  onTheme: () => void
  t: typeof STRINGS.vi
}) {
  const order: Screen[] = ["setup", "vote", "results"]
  const idx = order.indexOf(screen)
  return (
    <header className="sticky top-0 z-40 -mx-5 mb-2 flex items-center gap-3 border-b border-border bg-background/70 px-5 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center overflow-hidden rounded-lg shadow-lg shadow-violet-500/30">
          <img
            src={theme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
            alt="FairShare"
            className="size-8 object-contain"
          />
        </span>
        <span className="text-lg font-semibold tracking-tight">{t.appName}</span>
      </div>
      <nav className="ml-2 hidden gap-1 sm:flex">
        <StepDot active={idx === 0} done={idx > 0} label={t.nav1} />
        <StepDot active={idx === 1} done={idx > 1} label={t.nav2} />
        <StepDot active={idx === 2} done={false} label={t.nav3} />
      </nav>
      <div className="ml-auto flex items-center gap-1">
        <div className="flex overflow-hidden rounded-md border border-border text-[11px] font-medium">
          <button
            onClick={() => onLang("vi")}
            className={
              "px-2 py-1 transition-colors " +
              (lang === "vi" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted")
            }
            aria-label="Tiếng Việt"
            title="Tiếng Việt"
          >
            VI
          </button>
          <button
            onClick={() => onLang("en")}
            className={
              "px-2 py-1 transition-colors " +
              (lang === "en" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted")
            }
            aria-label="English"
            title="English"
          >
            EN
          </button>
        </div>
        <button
          onClick={onTheme}
          className="grid size-7 place-items-center rounded-md border border-border text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
        >
          {theme === "dark" ? "☾" : "☀"}
        </button>
        <AboutDialog t={t} />
      </div>
    </header>
  )
}

function AboutDialog({ t }: { t: typeof STRINGS.vi }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="link" className="text-muted-foreground">
            {t.howIsThisFair}
          </Button>
        }
      />
      <DialogContent className="glass max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-gradient pb-1 text-2xl">
            {t.aboutTitle}
          </DialogTitle>
          <DialogDescription>{t.aboutDesc}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h3 className="mb-1 font-semibold text-foreground">{t.aboutPromise}</h3>
            <p>{t.aboutP1}</p>
          </section>
          <section>
            <h3 className="mb-1 font-semibold text-foreground">{t.aboutWhy}</h3>
            <p>{t.aboutP2}</p>
          </section>
          <section>
            <h3 className="mb-1 font-semibold text-foreground">{t.aboutNotTitle}</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong className="text-foreground">{t.aboutNotIntensity}</strong></li>
              <li><strong className="text-foreground">{t.aboutNotTruth}</strong></li>
              <li><strong className="text-foreground">{t.aboutNotTies}</strong></li>
            </ul>
          </section>
          <section>
            <h3 className="mb-1 font-semibold text-foreground">{t.aboutPrivacyTitle}</h3>
            <p>{t.aboutP3}</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Setup(props: {
  people: string[]
  items: string[]
  personInput: string
  itemInput: string
  setPersonInput: (v: string) => void
  setItemInput: (v: string) => void
  addPerson: () => void
  addItem: () => void
  removePerson: (i: number) => void
  removeItem: (i: number) => void
  loadPreset: (p: keyof typeof PRESETS) => void
  canStart: boolean
  prices: number[]
  setPrices: (n: number[]) => void
  pricesOn: boolean
  setPricesOn: (b: boolean) => void
  onStart: () => void
  t: typeof STRINGS.vi
}) {
  const { t } = props
  return (
    <div className="animate-rise space-y-6">
      <div className="py-10 text-center">
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          {t.title1}
          <br />
          <span className="text-gradient">{t.title2}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      <Card className="glass glass-hover">
        <CardHeader>
          <CardTitle>{t.peopleTitle}</CardTitle>
          <CardDescription>{t.peopleDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={props.personInput}
              placeholder={t.addPersonPh}
              maxLength={24}
              onChange={(e) => props.setPersonInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && props.addPerson()}
            />
            <Button onClick={props.addPerson}>Add</Button>
          </div>
          <ChipRow
            items={props.people}
            onRemove={props.removePerson}
            empty={t.noPeople}
          />
        </CardContent>
      </Card>

      <Card className="glass glass-hover">
        <CardHeader>
          <CardTitle>{t.itemsTitle}</CardTitle>
          <CardDescription>{t.itemsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={props.itemInput}
              placeholder={t.addItemPh}
              maxLength={40}
              onChange={(e) => props.setItemInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && props.addItem()}
            />
            <Button onClick={props.addItem}>Add</Button>
          </div>
          <ChipRow
            items={props.items}
            onRemove={props.removeItem}
            empty={t.noItems}
            variant="secondary"
          />
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">⚡ {t.presets}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {([
            ["roommates", t.presetRoommates],
            ["startup", t.presetStartup],
            ["trip", t.presetTrip],
            ["club", t.presetClub],
          ] as const).map(([k, label]) => (
            <Button
              key={k}
              variant="outline"
              size="sm"
              onClick={() => props.loadPreset(k)}
            >
              {label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <PriceSheetCard
        items={props.items}
        prices={props.prices}
        setPrices={props.setPrices}
        pricesOn={props.pricesOn}
        setPricesOn={props.setPricesOn}
        t={t}
      />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => props.loadPreset("roommates")}>
          {t.trySample}
        </Button>
        <Button
          disabled={!props.canStart}
          onClick={props.onStart}
          className="btn-glow text-white"
        >
          {t.start}
        </Button>
      </div>
    </div>
  )
}

function PriceSheetCard({
  items,
  prices,
  setPrices,
  pricesOn,
  setPricesOn,
  t,
}: {
  items: string[]
  prices: number[]
  setPrices: (n: number[]) => void
  pricesOn: boolean
  setPricesOn: (b: boolean) => void
  t: typeof STRINGS.vi
}) {
  if (items.length === 0) return null
  const filled = prices.filter((p) => p > 0).length

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-base">{t.moneyTitle}</CardTitle>
        <CardDescription>{t.moneyDesc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 text-xs leading-relaxed text-muted-foreground">
          {t.priceSheetHint}
        </p>
        {!pricesOn ? (
          <Button variant="outline" size="sm" onClick={() => setPricesOn(true)}>
            {t.moneyAdd}
            {filled > 0 ? ` · ${filled}/${items.length}` : ""}
          </Button>
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((it, i) => (
                <label
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm transition-colors"
                >
                  <span className="truncate">{it}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">$</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={prices[i] ?? 0}
                      onChange={(e) => {
                        const next = prices.slice()
                        next[i] = Math.max(0, Number(e.target.value) || 0)
                        setPrices(next)
                      }}
                      className="w-20 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-right text-sm outline-none focus:border-violet-400/60"
                    />
                  </div>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                {filled}/{items.length}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setPricesOn(false)}>
                {t.priceSheetClose}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function ChipRow({
  items,
  onRemove,
  empty,
  variant = "default",
}: {
  items: string[]
  onRemove: (i: number) => void
  empty: string
  variant?: "default" | "secondary"
}) {
  if (items.length === 0)
    return <p className="text-sm italic text-muted-foreground">{empty}</p>
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((name, i) => (
        <Badge
          key={i}
          variant={variant}
          className="gap-1.5 py-1.5 pl-3 pr-1.5 text-sm font-medium"
        >
          {name}
          <button
            aria-label={`remove ${name}`}
            onClick={() => onRemove(i)}
            className="grid size-5 cursor-pointer place-items-center rounded-full bg-white/15 text-xs transition-colors hover:bg-white/30"
          >
            ✕
          </button>
        </Badge>
      ))}
    </div>
  )
}

function Vote(props: {
  people: string[]
  items: string[]
  wants: Record<string, boolean[]>
  voterIdx: number
  handoff: boolean
  onReady: () => void
  onToggle: (person: string, i: number) => void
  onNext: () => void
  onBack: () => void
  t: typeof STRINGS.vi
}) {
  const { t } = props
  const voter = props.people[props.voterIdx]
  if (props.handoff) {
    return (
      <div className="animate-rise grid min-h-[60vh] place-items-center">
        <Card className="glass w-full max-w-md text-center">
          <CardHeader>
            <div className="mb-1 text-5xl">🤝</div>
            <CardDescription className="uppercase tracking-widest">
              {t.handoffEyebrow}
            </CardDescription>
            <CardTitle className="text-gradient pb-1 text-4xl">
              {voter}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.handoffLine}
            </p>
            <Button
              className="btn-glow w-full text-white"
              onClick={props.onReady}
            >
              {t.ready.replace("{name}", voter)}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="animate-rise space-y-6">
      <div className="flex items-end justify-between pt-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {t.votingAs}
          </p>
          <h2 className="text-gradient pb-1 text-3xl font-semibold">{voter}</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
          {t.voterN.replace("{i}", String(props.voterIdx + 1)).replace("{n}", String(props.people.length))}
        </span>
      </div>
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
        {t.ballotHint}
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
        {props.items.map((item, i) => {
          const on = props.wants[voter]?.[i]
          return (
            <button
              key={i}
              onClick={() => props.onToggle(voter, i)}
              className={
                "relative cursor-pointer rounded-xl border px-4 py-5 text-center transition-all duration-200 " +
                (on
                  ? "-translate-y-1 border-emerald-400/50 bg-emerald-400/10 shadow-[0_10px_30px_-12px] shadow-emerald-400/50"
                  : "glass glass-hover")
              }
            >
              {on && (
                <span className="absolute right-2.5 top-2.5 grid size-6 place-items-center rounded-full bg-emerald-400 text-sm font-bold text-emerald-950">
                  ✓
                </span>
              )}
              <div className="font-semibold">{item}</div>
              <div
                className={
                  "mt-1.5 text-xs " +
                  (on ? "font-semibold text-emerald-400" : "text-muted-foreground")
                }
              >
                {on ? t.want : t.wantTap}
              </div>
            </button>
          )
        })}
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={props.onBack}>
          {t.back}
        </Button>
        <Button className="btn-glow text-white" onClick={props.onNext}>
          {t.done}
        </Button>
      </div>
    </div>
  )
}

function Results({
  data,
  onReVote,
  onStartOver,
  prices,
  t,
  lang,
}: {
  data: {
    people: string[]
    items: string[]
    wants: boolean[][]
    res: AllocationResult
    v: VerifyResult
  }
  onReVote: () => void
  onStartOver: () => void
  prices: number[]
  t: typeof STRINGS.vi
  lang: Lang
}) {
  const { people, items, wants, res, v } = data

  const contested = useMemo(() => {
    for (let a = 0; a < people.length; a++)
      for (let b = 0; b < people.length; b++) {
        if (a === b || v.envy[a][b] <= 0) continue
        for (const i of res.bundles[b])
          if (wants[a][i])
            return { envier: people[a], envied: people[b], item: items[i], envierIdx: a, enviedIdx: b, itemIdx: i }
      }
    return null
  }, [people, items, wants, res, v])

  const allContested = useMemo(() => {
    const out: { envier: number; envied: number; item: number }[] = []
    for (let a = 0; a < people.length; a++)
      for (let b = 0; b < people.length; b++) {
        if (a === b || v.envy[a][b] <= 0) continue
        for (const i of res.bundles[b])
          if (wants[a][i]) out.push({ envier: a, envied: b, item: i })
      }
    return out
  }, [people, items, wants, res, v])

  const gotSomething = v.utilities.filter((u) => u > 0).length

  const [settleResult, setSettleResult] = useState<SettleResult | null>(null)

  function copyResult() {
    let txt = `${t.copyHeader}\n\n`
    people.forEach((name, p) => {
      const b = res.bundles[p].map((i) => items[i])
      txt += `${name}: ${b.length ? b.join(", ") : t.nothingLabel}\n`
    })
    if (res.unwanted.length)
      txt += `\nNobody wanted: ${res.unwanted.map((i) => items[i]).join(", ")}\n`
    if (settleResult) {
      txt += `\nCash settlement:\n`
      for (const tr of settleResult.transfers) {
        txt += `  ${people[tr.from]} → ${people[tr.to]}: $${tr.amount.toFixed(2)} (${tr.items.map((i) => items[i]).join(", ")})\n`
      }
    }
    txt += `\nFairness: ${v.isEF ? t.fairnessLineEF : t.fairnessLineEFX}\nSplit with FairShare.`
    navigator.clipboard?.writeText(txt)
  }

  return (
    <div className="animate-rise space-y-6">
      <div className="py-8 text-center">
        <Badge
          className={
            "mx-auto mb-5 max-w-full gap-1.5 px-4 py-1.5 text-sm ring-1 ring-inset whitespace-normal text-center " +
            (v.isEF
              ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30 hover:bg-emerald-400/10"
              : "bg-amber-400/10 text-amber-300 ring-amber-400/30 hover:bg-amber-400/10")
          }
        >
          <span>{v.isEF ? "✓" : "≈"}</span>
          {v.isEF ? t.efBadge : t.efxBadge}
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t.resultTitle} <span className="text-gradient">{t.resultTitleSpan}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {t.resultSub(gotSomething, people.length, items.length)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {people.map((name, p) => (
          <Card key={p} className="glass glass-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2.5 text-xl">
                  <span
                    className={
                      "grid size-8 place-items-center rounded-full text-sm font-semibold text-white shadow-lg " +
                      AVATAR[p % AVATAR.length]
                    }
                  >
                    {name[0]?.toUpperCase()}
                  </span>
                  {name}
                </CardTitle>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">
                  {res.bundles[p].length} {res.bundles[p].length === 1 ? t.itemWord : t.itemsWord}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {res.bundles[p].length ? (
                <ul className="space-y-2">
                  {res.bundles[p].map((i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2.5 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">✓</span>
                        {items[i]}
                      </span>
                      {(prices[i] ?? 0) > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ${(prices[i] ?? 0).toFixed(0)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-2 text-sm italic text-muted-foreground">
                  {t.nothingGot}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <GraphCard people={people} items={items} wants={wants} res={res} v={v} t={t} />

      {res.unwanted.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">{t.noOneWanted}</CardTitle>
            <CardDescription>{t.noOneWantedDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {res.unwanted.map((i) => (
                <Badge key={i} variant="secondary">
                  {items[i]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass">
        <CardHeader>
          <CardTitle>{t.fairnessCheck}</CardTitle>
          <CardDescription>{t.fairnessCheckDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t.fairnessHint}
          </p>
          <div className="overflow-x-auto">
            <EnvyMatrix
              people={people}
              envy={settleResult?.envy ?? v.envy}
              header={t.colHeader}
            />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.legendGreen} {t.legendAmber}
          </p>
        </CardContent>
      </Card>

      <MoneyCard
        items={items}
        allContested={allContested}
        prices={prices}
        settleResult={settleResult}
        setSettleResult={setSettleResult}
        people={people}
        v={v}
        wants={wants}
        res={res}
        t={t}
        lang={lang}
      />

      <div className="space-y-3">
        <div className="rounded-xl border border-white/[0.06] border-l-4 border-l-violet-400 bg-white/[0.04] p-4 text-sm leading-relaxed backdrop-blur">
          {v.isEF ? t.efNote : t.efxNote}
        </div>
        {contested && (
          <div className="rounded-xl border border-white/[0.06] border-l-4 border-l-amber-400 bg-white/[0.04] p-4 text-sm leading-relaxed backdrop-blur">
            {t.contestedLine(contested.envier, contested.envied, contested.item)}
          </div>
        )}
      </div>

      <Separator />
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" onClick={onReVote}>
          {t.reVote}
        </Button>
        <Button variant="ghost" onClick={onStartOver}>
          {t.startOver}
        </Button>
        <Button className="btn-glow text-white" onClick={copyResult}>
          {t.copy}
        </Button>
      </div>
    </div>
  )
}

function GraphCard({
  people,
  items,
  wants,
  res,
  v,
  t,
}: {
  people: string[]
  items: string[]
  wants: boolean[][]
  res: AllocationResult
  v: VerifyResult
  t: typeof STRINGS.vi
}) {
  const W = 560
  const H = 60 + Math.max(people.length, items.length) * 36
  const leftX = 24
  const rightX = W - 24
  const padY = 30
  const stepY = (H - padY * 2) / Math.max(people.length, items.length - 1 || 1)

  const personY = (i: number) => padY + i * stepY
  const itemY = (i: number) => padY + i * stepY

  const isContested = (a: number, i: number) => {
    for (let b = 0; b < people.length; b++) {
      if (a === b) continue
      if (v.envy[a][b] > 0 && res.bundles[b].includes(i) && wants[a][i]) return true
    }
    return false
  }

  const edges: { key: string; d: string; cls: string }[] = []
  for (let p = 0; p < people.length; p++) {
    for (let i = 0; i < items.length; i++) {
      const got = res.bundles[p].includes(i)
      if (got) {
        edges.push({
          key: `g-${p}-${i}`,
          d: `M ${leftX + 12} ${personY(p)} C ${(leftX + rightX) / 2} ${personY(p)}, ${(leftX + rightX) / 2} ${itemY(i)}, ${rightX - 12} ${itemY(i)}`,
          cls: "stroke-emerald-400/70",
        })
      } else if (wants[p][i]) {
        const contested = isContested(p, i)
        edges.push({
          key: `w-${p}-${i}`,
          d: `M ${leftX + 12} ${personY(p)} C ${(leftX + rightX) / 2} ${personY(p)}, ${(leftX + rightX) / 2} ${itemY(i)}, ${rightX - 12} ${itemY(i)}`,
          cls: contested ? "stroke-amber-400/55" : "stroke-white/12",
        })
      }
    }
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-base">{t.graphTitle}</CardTitle>
        <CardDescription>{t.graphDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[460px]">
            {edges.map((e) => (
              <path
                key={e.key}
                d={e.d}
                fill="none"
                strokeWidth={e.cls.includes("emerald") ? 1.6 : 1}
                className={e.cls}
                strokeDasharray={e.cls.includes("emerald") ? undefined : "3 4"}
              />
            ))}
            {people.map((name, p) => (
              <g key={`p-${p}`}>
                <circle
                  cx={leftX}
                  cy={personY(p)}
                  r="11"
                  className="fill-violet-500/30 stroke-violet-300/80"
                  strokeWidth="1.4"
                />
                <text
                  x={leftX}
                  y={personY(p) + 4}
                  textAnchor="middle"
                  className="fill-white text-[11px] font-semibold"
                >
                  {name[0]?.toUpperCase()}
                </text>
                <text
                  x={leftX + 18}
                  y={personY(p) + 4}
                  className="fill-muted-foreground text-[11px]"
                >
                  {name}
                </text>
              </g>
            ))}
            {items.map((it, i) => (
              <g key={`i-${i}`}>
                <circle
                  cx={rightX}
                  cy={itemY(i)}
                  r={it.length > 14 ? 8 : 7}
                  className="fill-white/8 stroke-white/30"
                  strokeWidth="1.2"
                />
                <text
                  x={rightX - 14}
                  y={itemY(i) + 4}
                  textAnchor="end"
                  className="fill-foreground/90 text-[11px] font-medium"
                >
                  {it.length > 18 ? it.slice(0, 17) + "…" : it}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4 rounded bg-emerald-400/80" /> {t.graphLegend.got}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4 rounded border-t border-dashed border-white/30" /> {t.graphLegend.want}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4 rounded bg-amber-400/80" /> {t.graphLegend.contested}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function MoneyCard(props: {
  items: string[]
  allContested: { envier: number; envied: number; item: number }[]
  prices: number[]
  settleResult: SettleResult | null
  setSettleResult: (r: SettleResult | null) => void
  people: string[]
  v: VerifyResult
  wants: boolean[][]
  res: AllocationResult
  t: typeof STRINGS.vi
  lang: Lang
}) {
  const { t, items, prices, allContested, settleResult } = props
  const contestedSet = new Set(allContested.map((c) => c.item))
  const anyPriced = prices.some((p) => p > 0)

  function calc() {
    const r = settle(
      props.people,
      props.items,
      props.wants,
      props.res,
      props.prices,
      props.allContested,
    )
    props.setSettleResult(r)
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-base">{t.moneyTitle}</CardTitle>
        <CardDescription>{t.moneyDesc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!anyPriced ? (
          <p className="text-sm text-muted-foreground">
            {props.lang === "vi"
              ? "Chưa chốt giá ở màn hình thiết lập — không tính được đền bù. Quay lại bước 1, cùng nhau nhập giá rồi bỏ phiếu lại."
              : "No prices were agreed on the setup screen — no settlement can be computed. Go back to step 1, agree on prices together, and vote again."}
          </p>
        ) : (
          <>
            <p className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 text-xs leading-relaxed text-muted-foreground">
              {props.lang === "vi"
                ? "Giá này cả nhà đã chốt ở bước 1, trước khi bỏ phiếu — nên không ai được lợi từ việc khai sai muốn. Món đang tranh chấp được viền vàng."
                : "These prices were agreed by everyone at step 1, before voting — so nobody can gain from a strategic ballot. Contested items are ringed in amber."}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((it, i) => (
                <div
                  key={i}
                  className={
                    "flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm transition-colors " +
                    (contestedSet.has(i) ? "ring-1 ring-inset ring-amber-400/30" : "")
                  }
                >
                  <span className="truncate">{it}</span>
                  <span className="font-mono text-muted-foreground">
                    ${(prices[i] ?? 0).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button size="sm" className="btn-glow text-white" onClick={calc}>
                {settleResult ? t.moneyRecalc : t.moneyCalc}
              </Button>
            </div>
          </>
        )}

        {settleResult && (
          <div className="space-y-3 rounded-lg border border-violet-400/20 bg-violet-500/5 p-4">
            {settleResult.transfers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {allContested.length === 0
                  ? (props.lang === "vi"
                      ? "Không có món tranh chấp — không cần đền bù."
                      : "No contested items — no settlement needed.")
                  : t.moneyNone}
              </p>
            ) : (
              <ul className="space-y-2">
                {settleResult.transfers.map((tr, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span>
                      <span className="font-semibold text-violet-200">
                        {t.moneyTransferLabel(props.people[tr.from], props.people[tr.to])}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({tr.items.map((i) => props.items[i]).join(", ")})
                      </span>
                    </span>
                    <span className="rounded-md bg-violet-500/15 px-2 py-0.5 font-mono text-violet-100">
                      ${tr.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {t.moneyNote}
            </p>
            <p className="text-xs">
              <span className="font-semibold text-violet-200">{t.moneyAfter}</span>{" "}
              {settleResult.isEF ? (
                <span className="text-emerald-300">envy-free ✓</span>
              ) : (
                <span className="text-amber-300">{t.moneyStillContested}</span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function EnvyMatrix({
  people,
  envy,
  header,
}: {
  people: string[]
  envy: number[][]
  header: string
}) {
  return (
    <table className="w-full min-w-[340px] border-separate border-spacing-1">
      <thead>
        <tr>
          <th className="p-2 text-right text-[11px] font-medium text-muted-foreground">
            {header}
          </th>
          {people.map((name, i) => (
            <th key={i} className="p-2 text-sm font-semibold text-muted-foreground">
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {people.map((rowName, a) => (
          <tr key={a}>
            <td className="whitespace-nowrap p-2 text-right text-sm font-semibold text-muted-foreground">
              {rowName}
            </td>
            {people.map((_, b) => {
              if (a === b)
                return (
                  <td
                    key={b}
                    className="rounded-md bg-white/[0.04] p-2.5 text-center text-sm text-muted-foreground"
                  >
                    —
                  </td>
                )
              const diff = envy[a][b]
              const cls =
                diff <= 0
                  ? "bg-emerald-400/12 text-emerald-300 ring-1 ring-inset ring-emerald-400/25"
                  : diff === 1
                    ? "bg-amber-400/12 text-amber-300 ring-1 ring-inset ring-amber-400/25"
                    : "bg-red-400/12 text-red-300 ring-1 ring-inset ring-red-400/25"
              const txt =
                diff <= 0 ? "no envy" : diff === 1 ? "+1 item" : `+${diff}`
              return (
                <td
                  key={b}
                  className={`rounded-md p-2.5 text-center text-sm font-semibold ${cls}`}
                >
                  {txt}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
