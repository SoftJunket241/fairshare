const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const URL = "http://localhost:4173/";
const dir = path.resolve(__dirname, "shots");
fs.mkdirSync(dir, { recursive: true });
const SHOT = (n) => path.join(dir, n);

let fail = 0;
const check = (c, m) => { console.log((c ? "  ok  " : "  FAIL ") + m); if (!c) fail++; };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1100 } });
  page.on("dialog", (d) => d.accept());
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(400);

  console.log("== SETUP ==");
  await page.screenshot({ path: SHOT("r01-setup.png") });
  check(await page.getByRole("button", { name: "Try an example" }).isVisible(), "Try an example visible");
  check(await page.getByRole("button", { name: "Roommates move out" }).isVisible(), "preset visible");
  check(await page.getByRole("button", { name: "VI" }).isVisible(), "lang toggle visible");

  console.log("== LANG TOGGLE ==");
  await page.getByRole("button", { name: "VI" }).click();
  await page.waitForTimeout(150);
  const viText = await page.locator("body").innerText();
  check(viText.includes("Chuyển nhà"), "VI translation active");
  await page.screenshot({ path: SHOT("r01b-vi.png") });
  await page.getByRole("button", { name: "EN" }).click();
  await page.waitForTimeout(150);

  console.log("== ABOUT ==");
  await page.getByRole("button", { name: "How is this fair?" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: SHOT("r02-about.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);

  console.log("== PRESET ==");
  await page.getByRole("button", { name: "Roommates move out" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: SHOT("r03-preset.png") });

  console.log("== PRICE SHEET (setup screen, before voting) ==");
  await page.getByRole("button", { name: /\+ Open the price sheet/ }).click();
  await page.waitForTimeout(200);
  // Set a price on the first item — agreed by everyone BEFORE anyone votes
  const priceInputs = page.locator("input[type='number']");
  await priceInputs.first().fill("120");
  await page.screenshot({ path: SHOT("r03b-pricesheet.png") });
  await page.getByRole("button", { name: "Close the price sheet" }).click();
  await page.waitForTimeout(200);

  console.log("== VOTING ==");
  await page.getByRole("button", { name: /Start private voting/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: SHOT("r04-handoff.png") });

  const votes = [[0, 1, 2], [1, 3, 5], [1, 4, 6]];
  for (let v = 0; v < 3; v++) {
    await page.getByRole("button", { name: /ready/ }).click();
    await page.waitForTimeout(200);
    const items = ["Sofa","TV","Espresso machine","Bookshelf","Rice cooker","Standing lamp","Air fryer"];
    for (const idx of votes[v]) {
      // ballot card is a <button> with class containing cursor-pointer; find by item name prefix
      const card = page.locator("button.cursor-pointer", { hasText: items[idx] });
      await card.first().click();
    }
    await page.waitForTimeout(200);
    if (v === 0) await page.screenshot({ path: SHOT("r05-ballot.png") });
    await page.getByRole("button", { name: "Done →" }).click();
    await page.waitForTimeout(250);
  }

  console.log("== RESULTS ==");
  await page.waitForTimeout(400);
  await page.screenshot({ path: SHOT("r06-results-top.png") });
  await page.evaluate(() => window.scrollTo({ top: 700 }));
  await page.waitForTimeout(200);
  await page.screenshot({ path: SHOT("r06-results-graph.png") });
  await page.evaluate(() => window.scrollTo({ top: 1400 }));
  await page.waitForTimeout(200);
  await page.screenshot({ path: SHOT("r06-results-money.png") });
  await page.screenshot({ path: SHOT("r06-results-full.png"), fullPage: true });
  const verdict = await page.locator("body").innerText();
  check(verdict.includes("Here's") || verdict.includes("the split"), "results screen shown");
  check(verdict.includes("The split, mapped") || verdict.includes("bản đồ"), "graph card present");

  const stored = await page.evaluate(() => localStorage.getItem("fairshare"));
  const parsed = JSON.parse(stored);
  check(!("wants" in parsed), "localStorage has NO ballots");

  console.log("== MONEY ==");
  // The results screen exposes a "Show prompts" action. It does not propose
  // a transfer direction; it only surfaces contested items with the
  // household-agreed reference price as a starting point for negotiation.
  await page.getByRole("button", { name: /Show prompts|Re-list|Gợi ý|Conversation prompts|Settle/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: SHOT("r07-settle.png"), fullPage: true });
  const body3 = await page.locator("body").innerText();
  // The roommate preset happens to produce no contested items in this
  // particular vote. The card must still render, and it must not use any
  // executable-payment language ("pays", "transfer", "settlement").
  const lower3 = body3.toLowerCase();
  check(
    body3.includes("Contested items") || body3.includes("prompts") || body3.includes("Gợi ý"),
    "money card renders on results screen"
  );
  check(
    !lower3.includes("pays") && !lower3.includes("transfer") && !lower3.includes("settlement"),
    "no executable payment language in money card"
  );

  console.log("== CONTESTED LAPTOP ==");
  await page.getByRole("button", { name: "Start over" }).click();
  await page.waitForTimeout(300);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(400);
  await page.getByPlaceholder("e.g. An").fill("An");
  await page.getByRole("button", { name: "Add" }).first().click();
  await page.getByPlaceholder("e.g. An").fill("Binh");
  await page.getByRole("button", { name: "Add" }).first().click();
  await page.getByPlaceholder("e.g. Sofa").fill("Laptop");
  await page.getByRole("button", { name: "Add" }).last().click();
  await page.waitForTimeout(200);

  // Agree a price before voting — the only way discussion prompts can
  // surface a reference price.
  await page.getByRole("button", { name: /\+ Open the price sheet/ }).click();
  await page.waitForTimeout(200);
  await page.locator('input[type="number"]').first().fill("500");
  await page.getByRole("button", { name: "Close the price sheet" }).click();
  await page.waitForTimeout(200);

  await page.getByRole("button", { name: /Start private voting/ }).click();
  await page.waitForTimeout(200);
  for (let v = 0; v < 2; v++) {
    await page.getByRole("button", { name: /ready/ }).click();
    await page.waitForTimeout(200);
    await page.locator("button.cursor-pointer", { hasText: "Laptop" }).first().click();
    await page.waitForTimeout(150);
    await page.getByRole("button", { name: "Done →" }).click();
    await page.waitForTimeout(250);
  }
  const body2 = await page.locator("body").innerText();
  check(body2.includes("EFX"), "contested shows EFX verdict");
  check(body2.includes("Laptop"), "explanation names Laptop");

  // Open the discussion prompts and verify: the contested item appears in
  // the prompts list (it has an agreed price, so discuss() surfaces it
  // regardless of how many people want it), and there is still no
  // executable-payment language.
  await page.getByRole("button", { name: /Show prompts|Re-list|Conversation prompts|Settle|Gợi ý/ }).click();
  await page.waitForTimeout(300);
  const bodyPrompts = await page.locator("body").innerText();
  const lowerP = bodyPrompts.toLowerCase();
  check(bodyPrompts.includes("Laptop"), "prompts list names the contested item");
  check(!lowerP.includes("pays") && !lowerP.includes("transfer") && !lowerP.includes("settlement"), "no executable payment language in prompts card");
  await page.screenshot({ path: SHOT("r08-contested.png"), fullPage: true });

  console.log("== ERRORS ==");
  check(errors.length === 0, `no JS errors (${errors.length})`);
  errors.forEach((e) => console.log("   " + e));

  await browser.close();
  console.log(fail === 0 ? "\nALL CHECKS PASSED" : `\n${fail} FAILED`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error("CRASH:", e.message); process.exit(2); });
