export type Lang = "vi" | "en"

type StringDict = {
  appName: string
  nav1: string
  nav2: string
  nav3: string
  howIsThisFair: string
  eyebrow: string
  title1: string
  title2: string
  subtitle: string
  peopleTitle: string
  peopleDesc: string
  itemsTitle: string
  itemsDesc: string
  addPersonPh: string
  addItemPh: string
  noPeople: string
  noItems: string
  trySample: string
  start: string
  needMore: string
  handoffEyebrow: string
  handoffLine: string
  ready: string
  votingAs: string
  voterN: string
  ballotHint: string
  want: string
  wantTap: string
  back: string
  done: string
  efBadge: string
  efxBadge: string
  resultTitle: string
  resultTitleSpan: string
  resultSub: (got: number, n: number, m: number) => string
  noOneWanted: string
  noOneWantedDesc: string
  fairnessCheck: string
  fairnessCheckDesc: string
  fairnessHint: string
  legendGreen: string
  legendAmber: string
  colHeader: string
  efNote: React.ReactNode
  efxNote: React.ReactNode
  reVote: string
  startOver: string
  copy: string
  aboutTitle: string
  aboutDesc: string
  aboutP1: React.ReactNode
  aboutWhy: string
  aboutP2: React.ReactNode
  aboutNotTitle: string
  aboutNotIntensity: string
  aboutNotTruth: string
  aboutNotTies: string
  aboutPrivacyTitle: string
  aboutP3: React.ReactNode
  presets: string
  presetRoommates: string
  presetStartup: string
  presetTrip: string
  presetClub: string
  moneyTitle: string
  moneyDesc: string
  moneyAdd: string
  moneyCalc: string
  moneyRecalc: string
  moneyNone: string
  moneyNote: string
  priceSheetHint: string
  priceSheetClose: string
  moneyTransferLabel: (a: string, b: string) => string
  moneyAfter: string
  moneyStillContested: string
  graphTitle: string
  graphDesc: string
  graphLegend: { got: string; want: string; contested: string }
  aboutPromise: string
  nothingGot: string
  contestedLine: (envier: string, envied: string, item: string) => React.ReactNode
  copyHeader: string
  nothingLabel: string
  itemWord: string
  itemsWord: string
  fairnessLineEF: string
  fairnessLineEFX: string
}

export const STRINGS: Record<Lang, StringDict> = {
  vi: {
    appName: "FairShare",
    nav1: "1 · Thiết lập",
    nav2: "2 · Bỏ phiếu",
    nav3: "3 · Kết quả",
    howIsThisFair: "Công bằng kiểu gì?",

    eyebrow: "Có bảo chứng toán học · Đảm bảo EFX",
    title1: "Chuyển nhà.",
    title2: "Ai được đồ nào?",
    subtitle:
      "Bạn mua nhiều thứ cùng nhau. Chia cũng không nên mất tình bạn. Ai cũng bỏ phiếu riêng tư, và thuật toán tìm cách chia không ai có lý do để hờn.",

    peopleTitle: "🧑‍🤝‍🧑 Bạn cùng phòng",
    peopleDesc: "Tối thiểu 2",
    itemsTitle: "📦 Đồ chung",
    itemsDesc: "Những thứ sắp chia",
    addPersonPh: "vd. An",
    addItemPh: "vd. Sofa",
    noPeople: "Chưa có ai.",
    noItems: "Chưa có đồ.",
    trySample: "Thử ví dụ",
    start: "Bắt đầu bỏ phiếu riêng tư →",
    needMore: "Cần ≥ 2 người và ≥ 1 món.",

    handoffEyebrow: "Đưa thiết bị cho",
    handoffLine:
      "Các bạn khác: quay mặt đi. Phiếu không bao giờ được lưu — chỉ tồn tại trong bộ nhớ và bị xóa ngay khi tính xong.",
    ready: "Tôi là {name}, sẵn sàng →",

    votingAs: "Đang bỏ phiếu với tư cách",
    voterN: "Người {i} / {n}",
    ballotHint:
      "Chạm vào mỗi món bạn thực sự muốn giữ. Bỏ qua phần còn lại. Nói dối chẳng có lợi — xem mục “Công bằng kiểu gì?”.",
    want: "tôi muốn món này",
    wantTap: "chạm nếu muốn",
    back: "← Quay lại thiết lập",
    done: "Xong →",

    efBadge: "✓ Không ghen tị — không ai ước mình được phần của người khác",
    efxBadge: "≈ Công bằng tới giới hạn toán học (EFX)",
    resultTitle: "Đây là", resultTitleSpan: "cách chia",
    resultSub: (got: number, n: number, m: number) =>
      `${n} người, ${m} món. ${got} / ${n} người nhận được ít nhất một món họ muốn, và cách chia này chứng minh được là công bằng nhất trong điều kiện đồ không thể cắt đôi.`,
    noOneWanted: "🤷 Không ai muốn mấy món này",
    noOneWantedDesc:
      "Bán, tặng, hoặc tung đồng xu. Thuật toán không ép ai nhận đồ họ không muốn.",
    fairnessCheck: "🔎 Kiểm tra công bằng",
    fairnessCheckDesc: "tính lại từ kết quả thực tế",
    fairnessHint:
      "Bảng này trả lời một câu hỏi: nếu bạn đổi phần của mình với bất kỳ ai khác, bạn có thực sự được hơn không? Ô xanh nghĩa là không — bạn đang ổn với phần mình.",
    legendGreen: "Màu xanh = không ghen tị.",
    legendAmber:
      "Màu vàng = ghen tị đúng một món — chênh lệch thuộc về một món không thể cắt đôi; nếu bỏ món đó ra, bạn ngang hoặc hơn.",
    colHeader: "↓ người nhìn / chia →",
    efNote: (
      <>
        <strong className="text-violet-300">Mọi người đều không ghen tị.</strong>{" "}
        Theo đúng phiếu, không ai định giá phần của người khác cao hơn phần mình — kết quả tốt nhất có thể, và không phải lúc nào cũng đạt được.
      </>
    ),
    efxNote: (
      <>
        <strong className="text-amber-300">Cách chia này là EFX — công bằng tới đúng một món.</strong>{" "}
        Một cách chia hoàn toàn không ghen tị không tồn tại với tập muốn này (có món ai cũng muốn mà không thể cắt đôi). Ở chỗ vẫn còn ghen tị, mức chênh đúng bằng một món — điều mạnh nhất toán học cho phép ở đây.
      </>
    ),

    reVote: "Bỏ phiếu lại",
    startOver: "Bắt đầu lại",
    copy: "Sao chép kết quả",

    aboutTitle: "Công bằng — thật sự là sao?",
    aboutDesc: "Phiên bản trung thực của app “chia đồ”.",
    aboutP1: (
      <>
        Mọi người đánh dấu đồ họ muốn. Kết quả là{" "}
        <strong className="text-foreground">không ghen tị tới một món (EFX)</strong>:
        nếu bạn vẫn cảm thấy ai đó được hơn, toàn bộ chênh lệch là đúng một món
        không thể cắt đôi. Bỏ món đó ra thì bạn ngang hoặc hơn.
      </>
    ),
    aboutWhy: "Tại sao chỉ có / không, không cho điểm 0–100?",
    aboutP2: (
      <>
        Nếu bắt điểm 0–100, người hiểu hệ thống có thể bơm điểm để thắng bạn cùng
        phòng thật thà. Với phiếu{" "}
        <strong className="text-foreground">có / không</strong> đơn giản, thành thật
        là chiến lược tốt nhất và kết quả vẫn EFX và hiệu quả — được chứng minh bởi
        Babaioff, Ezra & Feige (2020) cho định giá nhị phân. Chúng tôi thu thập{" "}
        <em>ít</em> thông tin hơn vì đó mới là thứ có thể xử lý trung thực.
      </>
    ),
    aboutNotTitle: "Chúng tôi KHÔNG khẳng định",
    aboutNotIntensity: "Không đọc được mức độ. Hai người cùng muốn sofa trông giống nhau — đó là cái giá của một hệ thống không thể bị gian lận.",
    aboutNotTruth: "Trung thực là kết quả miền, không phải phép thuật. Với định giá 0–100 tổng quát, trung thực và EF1 chứng minh được là bất khả thi. Cam kết của chúng tôi đúng vì chúng tôi giới hạn ở có/không.",
    aboutNotTies: "Hoà được phá theo thứ tự quyết định trước. Ngẫu nhiên hoá sẽ thêm công bằng tung đồng xu — một tính năng hay cho tương lai.",
    aboutPrivacyTitle: "Riêng tư",
    aboutP3: (
      <>
        Phiếu <strong className="text-foreground">không bao giờ được ghi vào bộ nhớ</strong>.
        Chỉ danh sách người + đồ được lưu, để refresh không mất thiết lập; phiếu
        sống trong bộ nhớ và bị xoá ngay khi tính xong.
      </>
    ),

    presets: "Tình huống có sẵn",
    presetRoommates: "Chuyển nhà chung",
    presetStartup: "Startup tan rã",
    presetTrip: "Sau chuyển đi",
    presetClub: "CLB cuối năm",

    moneyTitle: "💸 Đền bù món tranh chấp",
    moneyDesc: "giá do cả nhà cùng nhập, trước khi bấm chia — không phải do một người tự quyết",
    moneyAdd: "+ Mở bảng giá",
    moneyCalc: "Tính đền bù",
    moneyRecalc: "Tính lại",
    moneyNone: "Chưa có món nào thoả điều kiện đền bù (chỉ đền khi có đúng một người muốn món đó).",
    moneyNote:
      "Các món đang tranh chấp được viền vàng. Giá nên chốt cùng nhau trước khi chia để không ai được lợi từ việc khai sai muốn. Với món chỉ một người muốn, người kia nhận nửa giá — một bên giữ đồ, một bên giữ tiền, ngang bằng. Không phải mọi món đều có thể đền bằng tiền; kết quả cuối nói thật điều đó.",
    priceSheetHint:
      "Mở nếu có khả năng sẽ tranh chấp. Cả nhà cùng chốt giá tham khảo cho từng món NGAY BÂY GIỜ, trước khi bỏ phiếu — vì giá chốt sau khi biết ai ghen ai sẽ mở cửa cho khai sai muốn. Bỏ trống cũng được; bạn có thể quay lại bước này bất cứ lúc nào.",
    priceSheetClose: "Đóng bảng giá",
    moneyTransferLabel: (a: string, b: string) => `${a} trả ${b}`,
    moneyAfter: "Sau khi đền bù:",
    moneyStillContested: "Vẫn còn ghen tị — tăng giá món tranh chấp hoặc dùng đồng xu.",

    graphTitle: "🕸 Bản đồ chia đồ",
    graphDesc: "ai nhận được gì, ai bỏ lỡ món mình muốn",
    graphLegend: {
      got: "được chia",
      want: "muốn nhưng không được",
      contested: "tranh chấp",
    },
    aboutPromise: "Cam kết",
    nothingGot: "Muốn món này nhưng không được chia — xem bảng công bằng bên dưới.",
    contestedLine: (envier, envied, item) => (
      <>
        <strong className="text-amber-300">{envier}</strong> có thể cảm thấy{" "}
        <strong>{envied}</strong> được hơn — và toàn bộ khoảng cách là{" "}
        <strong>{item}</strong>. Món đó không thể thuộc về cả hai. Nếu{" "}
        {envier} thực sự muốn nó hơn, đó là cuộc trò chuyện cần có — toán không
        quyết được ai <em>thích</em> hơn, và cũng không giả vờ làm được.
      </>
    ),
    copyHeader: "FairShare — cách chúng tôi chia đồ",
    nothingLabel: "(không có món nào họ muốn)",
    itemWord: "món",
    itemsWord: "món",
    fairnessLineEF: "Không ghen tị — không ai ước mình được phần của người khác.",
    fairnessLineEFX:
      "EFX — công bằng tới một món không thể cắt đôi, điều mạnh nhất toán học cho phép.",
  },
  en: {
    appName: "FairShare",
    nav1: "1 · Setup",
    nav2: "2 · Vote",
    nav3: "3 · Result",
    howIsThisFair: "How is this fair?",

    eyebrow: "Provably fair · EFX guaranteed",
    title1: "Moving out.",
    title2: "Who gets what?",
    subtitle:
      "You bought a lot of this together. Splitting it shouldn't cost you the friendship. Everyone votes privately, and the math finds a split nobody can reasonably resent.",

    peopleTitle: "🧑‍🤝‍🧑 Roommates",
    peopleDesc: "2 or more",
    itemsTitle: "📦 Shared items",
    itemsDesc: "the things you're splitting",
    addPersonPh: "e.g. An",
    addItemPh: "e.g. Sofa",
    noPeople: "No roommates yet.",
    noItems: "No items yet.",
    trySample: "Try an example",
    start: "Start private voting →",
    needMore: "Need ≥ 2 people and ≥ 1 item.",

    handoffEyebrow: "Pass the device to",
    handoffLine:
      "Others: look away. Ballots are never saved — they exist only in memory and are erased once the split is computed.",
    ready: "I'm {name}, ready →",

    votingAs: "Voting as",
    voterN: "Voter {i} of {n}",
    ballotHint:
      "Tap every item you'd actually want to keep. Skip the rest. There's no advantage to lying — see the “How is this fair?” note.",
    want: "I want this",
    wantTap: "tap if you want it",
    back: "← Back to setup",
    done: "Done →",

    efBadge: "✓ Envy-free — nobody wishes they had someone else's share",
    efxBadge: "≈ Fair to the mathematical maximum (EFX)",
    resultTitle: "Here's", resultTitleSpan: "the split",
    resultSub: (got: number, n: number, m: number) =>
      `${n} people, ${m} items. ${got} of ${n} got at least one thing they wanted, and the split is provably as fair as indivisible items allow.`,
    noOneWanted: "🤷 Nobody wanted these",
    noOneWantedDesc:
      "Sell, donate, or coin-flip. The algorithm won't force anyone to take stuff they don't want.",
    fairnessCheck: "🔎 The fairness check",
    fairnessCheckDesc: "computed from the actual result",
    fairnessHint:
      "This table answers one question: if you swapped your share with anyone else, would you actually be better off? A green cell means no — you're doing fine with what you have.",
    legendGreen: "Green = no envy.",
    legendAmber:
      "Amber = envies by one item — the entire gap belongs to a single item that couldn't be cut in half; remove it and you're even or ahead.",
    colHeader: "sees ↓ / share →",
    efNote: (
      <>
        <strong className="text-violet-300">Everyone is envy-free.</strong>{" "}
        Given what each person voted for, nobody values another's share more
        than their own — the best outcome possible, and it isn't always achievable.
      </>
    ),
    efxNote: (
      <>
        <strong className="text-amber-300">This split is EFX — fair up to a single item.</strong>{" "}
        A perfectly envy-free split doesn't exist for your set of wants (some
        item everyone wanted can't be cut in half). Where envy remains, it's
        exactly one item's worth — the strongest fairness mathematics allows here.
      </>
    ),

    reVote: "Re-vote",
    startOver: "Start over",
    copy: "Copy result",

    aboutTitle: "How is this fair — really?",
    aboutDesc: "The honest version of a “split the stuff” app.",
    aboutP1: (
      <>
        Everyone marks what they want. The result is{" "}
        <strong className="text-foreground">envy-free up to one item (EFX)</strong>:
        if you still think someone did better, the entire difference is a single
        item that couldn't be cut in half. Remove that one item and you're even
        or ahead.
      </>
    ),
    aboutWhy: "Why yes/no, not 0–100?",
    aboutP2: (
      <>
        If we asked you to <em>rate</em> items 0–100, someone who understands
        the system could inflate scores and beat an honest roommate. With a
        simple <strong className="text-foreground">want / don't-want</strong> vote,
        honesty is your best strategy and the result is still EFX and efficient
        — proven by Babaioff, Ezra & Feige (2020) for dichotomous valuations.
        We collect <em>less</em> information because it's the kind we can
        handle honestly.
      </>
    ),
    aboutNotTitle: "What we're NOT claiming",
    aboutNotIntensity: "Can't read intensity. Two people who both want the sofa look identical — that's the price of a system that can't be gamed.",
    aboutNotTruth: "Truthfulness is a domain result, not magic. For general 0–100 valuations, truthfulness and EF1 are provably incompatible. Our guarantee holds because we restrict to yes/no.",
    aboutNotTies: "Ties broken deterministically. Randomizing would add coin-flip fairness too — a good future feature.",
    aboutPrivacyTitle: "Privacy",
    aboutP3: (
      <>
        Ballots are <strong className="text-foreground">never written to storage</strong>.
        Only people + items are saved so a refresh doesn't lose setup; votes
        live in memory and are erased once the split is computed.
      </>
    ),

    presets: "Situations",
    presetRoommates: "Roommates move out",
    presetStartup: "Startup breakup",
    presetTrip: "After a trip",
    presetClub: "Year-end club",

    moneyTitle: "💸 Settle contested items",
    moneyDesc: "prices the whole household agrees on, entered before the split runs — never decided by one person",
    moneyAdd: "+ Open the price sheet",
    moneyCalc: "Settle",
    moneyRecalc: "Recalculate",
    moneyNone: "Nothing qualifies for a cash settlement here (cash only applies when exactly one person wanted the item).",
    moneyNote:
      "Contested items are ringed in amber. Agree on prices together, before voting, so nobody can game a ballot. For an item only one person wanted, the other side receives half its price — one keeps the item, one keeps the money, and the two come out even. Not everything can be settled with cash; the final line says so honestly.",
    priceSheetHint:
      "Open this if a dispute is likely. Agree on a reference price for each item NOW, before anyone votes — prices set after you know who envies whom would open the door to strategic ballots. Leaving it empty is fine; you can come back to this step at any time.",
    priceSheetClose: "Close the price sheet",
    moneyTransferLabel: (a: string, b: string) => `${a} pays ${b}`,
    moneyAfter: "After settlement:",
    moneyStillContested: "Envy remains — raise the price on contested items, or coin-flip.",

    graphTitle: "🕸 The split, mapped",
    graphDesc: "who got what, and who missed the item they wanted",
    graphLegend: {
      got: "got it",
      want: "wanted but missed",
      contested: "contested",
    },
    aboutPromise: "The promise",
    nothingGot:
      "Wanted it but didn't get it — see the fairness check below.",
    contestedLine: (envier, envied, item) => (
      <>
        <strong className="text-amber-300">{envier}</strong> may feel{" "}
        <strong>{envied}</strong> did slightly better — and the entire gap is{" "}
        <strong>{item}</strong>. It couldn't go to both. If {envier} would
        rather have it, that's a conversation to have — the math can't decide
        who wants it <em>more</em>, and it doesn't pretend to.
      </>
    ),
    copyHeader: "FairShare — how we split our stuff",
    nothingLabel: "(nothing they solely wanted)",
    itemWord: "item",
    itemsWord: "items",
    fairnessLineEF: "Envy-free — nobody wishes they had someone else's share.",
    fairnessLineEFX:
      "EFX — fair up to one indivisible item, the strongest fairness math allows.",
  },
} as const satisfies Record<Lang, StringDict>

export type Strings = typeof STRINGS.vi

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en"
  try {
    const saved = localStorage.getItem("fairshare-lang") as Lang | null
    if (saved === "vi" || saved === "en") return saved
  } catch { }
  return "en"
}

export function setLang(l: Lang) {
  try { localStorage.setItem("fairshare-lang", l) } catch { }
}
