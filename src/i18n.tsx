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
  efxHeadline: string
  resultTitle: string
  resultTitleSpan: string
  resultSub: (got: number, n: number, m: number) => string
  noOneWanted: string
  noOneWantedDesc: string
  fairnessCheck: string
  fairnessCheckDesc: string
  fairnessHint: string
  efxWhat: React.ReactNode
  legendGreen: string
  legendAmber: string
  colHeader: string
  efNote: React.ReactNode
  efxNote: React.ReactNode
  needsReview: string
  settleHeadline: string
  settleNote: string
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
  moneyNote: string
  priceSheetHint: string
  priceSheetClose: string
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

    eyebrow: "Có nền tảng toán học · Kiểm tra EFX",
    title1: "Chuyển nhà.",
    title2: "Ai được đồ nào?",
    subtitle:
      "Bạn mua nhiều thứ cùng nhau. Chia cũng không nên mất tình bạn. Ai cũng bỏ phiếu riêng tư, thuật toán tìm cách chia không ai có lý do để hờn — và tự kiểm lại từng bước.",

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
      "Chạm vào mỗi món bạn thực sự muốn giữ. Bỏ qua phần còn lại. Vì sao có/không thay vì cho điểm — xem mục “Công bằng kiểu gì?”.",
    want: "tôi muốn món này",
    wantTap: "chạm nếu muốn",
    back: "← Quay lại thiết lập",
    done: "Xong →",

    efBadge: "✓ Không ghen tị — không ai ước mình được phần của người khác",
    efxBadge: "≈ Công bằng theo nghĩa EFX (bỏ đi một món liên quan trong phần kia thì hết ghen tị)",
    efxHeadline: "Đây là cách chia mà máy đề xuất — máy cũng tự kiểm lại.",
    resultTitle: "Đây là", resultTitleSpan: "cách chia",
    resultSub: (got: number, n: number, m: number) =>
      `${n} người, ${m} món. ${got} / ${n} người nhận được ít nhất một món họ muốn trong phần chia đồ. Máy đã chia xong rồi tự kiểm lại kết quả theo định nghĩa EFX (xem bên dưới); với đồ không thể cắt đôi, đó là bảo đảm công bằng mạnh mà lý thuyết cho phép ở đây.`,
    noOneWanted: "🤷 Không ai muốn mấy món này",
    noOneWantedDesc:
      "Bán, tặng, hoặc tung đồng xu. Thuật toán không ép ai nhận đồ họ không muốn.",
    fairnessCheck: "🔎 Kiểm tra công bằng",
    fairnessCheckDesc: "tính lại từ kết quả thực tế",
    fairnessHint:
      "Bảng này trả lời một câu hỏi: nếu bạn đổi phần của mình với bất kỳ ai khác, bạn có thực sự được hơn không? Ô xanh nghĩa là không — bạn đang ổn với phần mình.",
    efxWhat: (
      <>
        <strong className="text-foreground">EFX</strong> nghĩa là{" "}
        <em>không ghen tị tới bất kỳ một món nào</em>: ở bất kỳ cặp so sánh nào còn ghen
        tị, bạn đều có thể chỉ ra một món trong phần của người kia mà nếu món đó bị
        bỏ đi, bạn không còn thấy phần kia hơn phần mình. Đó là bảo đảm mạnh cho
        hàng hoá không thể chia, trong bối cảnh sở thích nhị phân (muốn / không
        muốn) — và FairShare chỉ khẳng định điều kiện EFX trên kết quả của chính
        nó; mọi tính chất khác của lý thuyết cần nhiều giả định hơn.
      </>
    ),
    legendGreen: "Màu xanh = không ghen tị.",
    legendAmber:
      "Màu vàng = ghen tị nhưng chỉ ở mức EFX: bỏ đi một món liên quan trong phần kia thì hết ghen tị.",
    colHeader: "↓ người nhìn / chia →",
    efNote: (
      <>
        <strong className="text-violet-300">Mọi người đều không ghen tị.</strong>{" "}
        Theo đúng phiếu, không ai định giá phần của người khác cao hơn phần mình — kết quả tốt nhất có thể, và không phải lúc nào cũng đạt được.
      </>
    ),
    efxNote: (
      <>
        <strong className="text-amber-300">Cách chia này thoả mãn EFX.</strong>{" "}
        Một cách chia hoàn toàn không ghen tị không tồn tại với tập muốn này (có món ai cũng muốn mà không thể cắt đôi). Ở những cặp còn ghen tị, bạn đều chỉ ra được một món trong phần kia mà nếu bỏ món đó đi thì hết ghen tị — với sở thích nhị phân và đồ không thể chia, đây là một bảo đảm công bằng mạnh.
      </>
    ),
    needsReview:
      "Cách chia này không đạt điều kiện EFX — có ghen tị mà không thuộc dạng 'chỉ cần bỏ một món'. Hãy thử bỏ phiếu lại, thay đổi rót, hoặc thảo luận thêm.",
    settleHeadline: "💡 Gợi ý mở đầu thương lượng",
    settleNote:
      "Đây là điểm bắt đầu cuộc trò chuyện, không phải đề xuất thanh toán: app không định hướng ai trả ai, không tính toán đồng tiền nào, và không gắn kết quả có tiền với bất kỳ bảo đảm toán học nào. Phần chia trước khi có tiền là phần app kiểm tra EFX; từ đây trở đi là việc của cả nhà.",
    reVote: "Bỏ phiếu lại",
    startOver: "Bắt đầu lại",
    copy: "Sao chép kết quả",

    aboutTitle: "Công bằng — thật sự là sao?",
    aboutDesc: "Phiên bản trung thực của app “chia đồ”.",
    aboutP1: (
      <>
        Mọi người đánh dấu đồ họ muốn. Kết quả được kiểm tra là{" "}
        <strong className="text-foreground">không ghen tị tới một món (EFX)</strong>:
        ở bất kỳ cặp so sánh nào còn ghen tị, bạn đều chỉ ra được một món trong
        phần của người kia mà nếu món đó bị bỏ đi, bạn không còn thấy phần kia
        hơn phần mình. Đồ không thể cắt đôi, sở thích chỉ ghi nhận muốn/không
        muốn — trong điều kiện đó đây là một bảo đảm công bằng mạnh.
      </>
    ),
    aboutWhy: "Tại sao chỉ có / không, không cho điểm 0–100?",
    aboutP2: (
      <>
        Đây là một đánh đổi có chủ ý: mất thông tin về mức độ thích, đổi lại luật
        chia dễ kiểm tra và có nền tảng nghiên cứu tốt hơn. Bài báo Babaioff, Ezra
        &amp; Feige (2020) chứng minh cơ chế của họ — với định giá nhị phân — vừa
        công bằng vừa{" "}
        <strong className="text-foreground">thành thật là chiến lược tốt nhất</strong>{" "}
        (không ai được lợi hơn khi khai sai). FairShare không chạy đúng cơ chế đó
        mà chỉ tính một cách chia cùng loại (một routine leximin-style, lấy cảm hứng từ kỹ thuật augmenting-path) và{" "}
        <strong className="text-foreground">tự kiểm lại tính EFX của kết quả</strong> —
        tính "thành thật là tối ưu" là tính chất của cơ chế trong bài báo, không phải
        thứ app này chứng minh được cho chính nó.
      </>
    ),
    aboutNotTitle: "Chúng tôi KHÔNG khẳng định",
    aboutNotIntensity: "Không đọc được mức độ. Hai người cùng muốn sofa trông giống nhau — đó là cái giá của một phiếu đơn giản, dễ kiểm tra.",
    aboutNotTruth: "Không khẳng định app này không thể bị khai sai. Với định giá tổng quát, thậm chí chỉ cần các món 'muốn' khác giá trị nhau một chút, thì việc kết hợp trung thực với công bằng/tối ưu đã khó khăn — đó là kết quả của lý thuyết cơ chế, không phải lời hứa của app. Nền tảng của FairShare nằm ở chỗ giới hạn sở thích thành có/không.",
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
    presetTrip: "Sau chuyến đi",
    presetClub: "CLB cuối năm",

    moneyTitle: "💸 Món tranh chấp — gợi ý mở đầu thương lượng",
    moneyDesc: "giá do cả nhà cùng nhập, trước khi bấm chia — không phải do một người tự quyết",
    moneyAdd: "+ Mở bảng giá",
    moneyCalc: "Gợi ý để thương lượng",
    moneyRecalc: "Gợi ý lại",
    moneyNote:
      "Tiền không nằm trong kết quả của bài báo gốc — đây là công cụ thương lượng của app, không phải phần của bảo đảm toán học. Giá do cả nhà chốt trước khi bỏ phiếu, nên mọi người cùng nhìn thấy cùng một con số tham khảo.",
    priceSheetHint:
      "Mở nếu có khả năng sẽ tranh chấp. Cả nhà cùng chốt giá tham khảo cho từng món NGAY BÂY GIỜ, trước khi bỏ phiếu — vì giá chốt sau khi biết ai ghen ai sẽ làm cuộc thương lượng sau đó kém minh bạch. Bỏ trống cũng được; bạn có thể quay lại bước này bất cứ lúc nào.",
    priceSheetClose: "Đóng bảng giá",

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
        <strong>{envied}</strong> được hơn — nhưng chỉ ở mức EFX: nếu bỏ{" "}
        <strong>{item}</strong> khỏi phần của {envied} thì sự so sánh ấy hết
        nghiêng về {envied}. Món đó không thể thuộc về cả hai. Nếu {envier}{" "}
        thực sự muốn nó hơn, đó là cuộc trò chuyện cần có — toán không quyết
        được ai <em>thích</em> hơn, và cũng không giả vờ làm được.
      </>
    ),
    copyHeader: "FairShare — cách chúng tôi chia đồ",
    nothingLabel: "(không có món nào họ muốn)",
    itemWord: "món",
    itemsWord: "món",
    fairnessLineEF: "Không ghen tị — không ai ước mình được phần của người khác.",
    fairnessLineEFX:
      "EFX — với bất kỳ cặp còn ghen tị, bỏ đi một món liên quan trong phần kia thì hết ghen tị.",
  },
  en: {
    appName: "FairShare",
    nav1: "1 · Setup",
    nav2: "2 · Vote",
    nav3: "3 · Result",
    howIsThisFair: "How is this fair?",

    eyebrow: "Mathematically grounded · EFX-checked",
    title1: "Moving out.",
    title2: "Who gets what?",
    subtitle:
      "You bought a lot of this together. Splitting it shouldn't cost you the friendship. Everyone votes privately, the math finds a split nobody can reasonably resent — and re-checks its own work.",

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
      "Tap every item you'd actually want to keep. Skip the rest. Why yes/no instead of scoring — see the “How is this fair?” note.",
    want: "I want this",
    wantTap: "tap if you want it",
    back: "← Back to setup",
    done: "Done →",

    efBadge: "✓ Envy-free — nobody wishes they had someone else's share",
    efxBadge: "≈ EFX — remove any one related item and the envy is gone",
    efxHeadline: "This is the split the machine proposed — it re-checked it too.",
    resultTitle: "Here's", resultTitleSpan: "the split",
    resultSub: (got: number, n: number, m: number) =>
      `${n} people, ${m} items. ${got} of ${n} got at least one thing they wanted in the initial item allocation. The split was computed, then re-checked against the EFX definition (below); for binary wants and indivisible items, that's a meaningful fairness property.`,
    noOneWanted: "🤷 Nobody wanted these",
    noOneWantedDesc:
      "Sell, donate, or coin-flip. The algorithm won't force anyone to take stuff they don't want.",
    fairnessCheck: "🔎 The fairness check",
    fairnessCheckDesc: "computed from the actual result",
    fairnessHint:
      "This table answers one question: if you swapped your share with anyone else, would you actually be better off? A green cell means no — you're doing fine with what you have.",
    efxWhat: (
      <>
        <strong className="text-foreground">EFX</strong> means{" "}
        <em>envy-free up to any one item</em>: wherever envy remains between a
        pair, you can always point to one item in the other's share whose removal
        would make you no longer prefer their share over your own. That's a
        meaningful property for indivisible goods under binary (want / don't-want)
        preferences — and FairShare's engine re-verifies EFX on every output;
      </>
    ),
    legendGreen: "Green = no envy.",
    legendAmber:
      "Amber = envy at the EFX level: remove one related item from the other share and the envy is gone.",
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
        <strong className="text-amber-300">This split satisfies EFX.</strong>{" "}
        A perfectly envy-free split doesn't exist for your set of wants (some
        item everyone wanted can't be cut in half). For every pair where envy
        remains, there is one item in the other share whose removal eliminates
        it — a meaningful property, for indivisible goods and binary wants.
      </>
    ),
    needsReview:
      "This allocation does not satisfy EFX — some envy exceeds what removing one item can fix. Try re-voting, changing the preset, or discussing further.",
    settleHeadline: "💡 Conversation prompts",
    settleNote:
      "These are starting points for a talk, not payment proposals: the app picks no payer, no payee, no amount, and attaches no mathematical guarantee to any cash outcome. The pre-cash split is the part the app checks against EFX; from here on it's the household's call.",
    reVote: "Re-vote",
    startOver: "Start over",
    copy: "Copy result",

    aboutTitle: "How is this fair — really?",
    aboutDesc: "The honest version of a “split the stuff” app.",
    aboutP1: (
      <>
        Everyone marks what they want. The result is checked to be{" "}
        <strong className="text-foreground">envy-free up to one item (EFX)</strong>:
        wherever envy remains between a pair, you can point to one item in the
        other's share whose removal would make you no longer prefer their share
        over your own. Items can't be cut in half and preferences are recorded
        as want/don't-want only — in that setting, this is a meaningful
        fairness property.
      </>
    ),
    aboutWhy: "Why yes/no, not 0–100?",
    aboutP2: (
      <>
        This is a deliberate trade-off: you lose information about intensity,
        and in exchange the split is easier to check and has a better research
        footing. Babaioff, Ezra &amp; Feige (2020) prove that their mechanism,
        under binary valuations, is both fair and one where{" "}
        <strong className="text-foreground">honesty is the best strategy</strong>{" "}
        (no one gains by misreporting). FairShare does not run that exact
        mechanism — it computes an allocation in the same family
        (a leximin-style routine inspired by augmenting-path techniques) and{" "}
        <strong className="text-foreground">re-checks the EFX property of the
        result</strong>. The "honesty is optimal" property belongs to the
        paper's mechanism, not something this app proves about itself.
      </>
    ),
    aboutNotTitle: "What we're NOT claiming",
    aboutNotIntensity: "Can't read intensity. Two people who both want the sofa look identical — that's the price of a simple, checkable ballot.",
    aboutNotTruth: "Not claiming this app can't be gamed. For general valuations — even ones where the items you want differ in value by only a little — combining truthfulness with fairness/efficiency is already hard; that's a result from mechanism design, not a promise an app can make. FairShare's footing comes from restricting preferences to yes/no.",
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

    moneyTitle: "💸 Contested items — conversation prompts",
    moneyDesc: "prices the whole household agrees on, entered before the split runs — never decided by one person",
    moneyAdd: "+ Open the price sheet",
    moneyCalc: "Show prompts",
    moneyRecalc: "Re-list",
    moneyNote:
      "Cash is not part of the original paper's result — it's a negotiation tool this app adds, not part of the mathematical guarantee. Prices are agreed by everyone before voting, so everyone is talking from the same reference numbers.",
    priceSheetHint:
      "Open this if a dispute is likely. Agree on a reference price for each item NOW, before anyone votes — prices set after you know who envies whom would make the later bargaining less transparent. Leaving it empty is fine; you can come back to this step at any time.",
    priceSheetClose: "Close the price sheet",

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
        <strong>{envied}</strong> did slightly better — but only at the EFX
        level: remove <strong>{item}</strong> from {envied}'s share and that
        comparison no longer tilts toward {envied}. It couldn't go to both. If{" "}
        {envier} would rather have it, that's a conversation to have — the math
        can't decide who wants it <em>more</em>, and it doesn't pretend to.
      </>
    ),
    copyHeader: "FairShare — how we split our stuff",
    nothingLabel: "(nothing they solely wanted)",
    itemWord: "item",
    itemsWord: "items",
    fairnessLineEF: "Envy-free — nobody wishes they had someone else's share.",
    fairnessLineEFX:
      "EFX — for any pair with envy, removing one related item from the other share removes the envy.",
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
