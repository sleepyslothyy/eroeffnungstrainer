// Klick-Durchlauf: besucht jeden Bereich in beiden Designs auf Handy und Computer, klickt die Knöpfe jeder Seite
// und schlägt fehl bei JavaScript-Fehlern oder wenn eine Seite breiter als der Bildschirm wird.
// Start: node tests/sweep.mjs  (Server auf http://localhost:8765, BROWSER=webkit für die Safari-Engine)
import { chromium, webkit } from "playwright";
const ENGINE = process.env.BROWSER === "webkit" ? webkit : chromium;
const BASE = process.env.BASE || "http://localhost:8765/";
const W = ms => new Promise(r => setTimeout(r, ms));
const VIEWS = ["home", "learn", "plans", "memos", "courses", "openings", "openings:lex", "tactics", "tactics:hist", "end", "quiz", "games", "coords", "guess",
  "bots", "tours", "scout", "online:play", "online:live", "analyse", "chess", "profile:stats", "league", "profile:badges", "profile:settings", "profile:sync",
  "online:account", "repedit", "import", "legal"];
// Knöpfe, die Daten löschen, Konten ändern, aufgeben oder die Seite verlassen, bleiben unberührt
const SKIP = "löschen|abmelden|zurücksetzen|entfernen|aufgeben|konto|importieren|wiederherstellen|alles neu|daten|abbrechen|sperren|admin";
const PER_VIEW = +(process.env.PER_VIEW || 10);
let failed = false;
const browser = await ENGINE.launch();
console.log("Klick-Durchlauf in " + (process.env.BROWSER === "webkit" ? "WebKit (Safari)" : "Chromium"));
for (const design of ["dark", "light"]) for (const vp of [{ width: 390, height: 844, isMobile: true, hasTouch: true }, { width: 1280, height: 860 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
  const page = await ctx.newPage();
  const errs = [];
  let where = "Start";
  page.on("pageerror", e => errs.push(`${where}: ${e.message}`));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|net::ERR|ERR_FAILED|Fetch API|NetworkError|Load failed/i.test(m.text())) errs.push(`${where}: console: ${m.text()}`) });
  page.on("dialog", d => d.dismiss().catch(() => {}));
  await page.route(u => !u.href.startsWith(BASE), r => r.abort());
  await page.addInitScript(d => {
    localStorage.setItem("et-onb", "1");
    localStorage.setItem("et-set", JSON.stringify({ autoSync: false, learnFirst: false, sound: false, design: d, voice: false }));
    localStorage.setItem("et-rep", JSON.stringify(["italienisch", "carokann", "najdorf"]));
  }, design);
  await page.goto(BASE); await W(1300);
  const show = v => page.evaluate(v => { document.querySelectorAll(".onb,.trv,.crs-ov").forEach(x => x.remove()); window.__ET.showView(v) }, v);
  let clicks = 0;
  for (const v of VIEWS) {
    where = v;
    await show(v); await W(200);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (over > 1) errs.push(`Seite ${v} ist ${over}px zu breit (${design}, ${vp.width}px)`);
    const n = await page.evaluate(skip => {
      const re = new RegExp(skip, "i");
      return [...document.querySelectorAll(".view:not([hidden]) button")].filter(b => b.offsetParent && !b.disabled && !re.test(b.textContent + " " + (b.getAttribute("aria-label") || ""))).length;
    }, SKIP);
    for (let i = 0; i < Math.min(n, PER_VIEW); i++) {
      await show(v); await W(80);
      const label = await page.evaluate(([i, skip]) => {
        const re = new RegExp(skip, "i");
        const L = [...document.querySelectorAll(".view:not([hidden]) button")].filter(b => b.offsetParent && !b.disabled && !re.test(b.textContent + " " + (b.getAttribute("aria-label") || "")));
        const b = L[i]; if (!b) return null;
        const t = (b.textContent.trim() || b.getAttribute("aria-label") || b.id || b.className).replace(/\s+/g, " ").slice(0, 40);
        b.click(); return t;
      }, [i, SKIP]);
      if (label === null) break;
      where = `${v} → „${label}“`; clicks++;
      await W(160);
      const o2 = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (o2 > 1) errs.push(`${where}: Seite ${o2}px zu breit (${design}, ${vp.width}px)`);
      await page.keyboard.press("Escape").catch(() => {});
      where = v;
    }
  }
  // zum Schluss eine Variante im Training, damit auch das Brett mitläuft
  where = "Training";
  await page.evaluate(() => window.__ET.select("italienisch", 0)); await W(600);
  for (const id of ["hintBtn", "showBtn", "backBtn", "restartBtn", "flipBtn", "navFirst", "navLast"]) { await page.evaluate(id => { const b = document.getElementById(id); if (b && b.offsetParent) b.click() }, id); await W(150) }
  console.log(`${design}, ${vp.width}px: ${VIEWS.length} Bereiche, ${clicks} Klicks, ${errs.length} Probleme`);
  if (errs.length) { failed = true; console.error([...new Set(errs)].slice(0, 25).join("\n")) }
  await ctx.close();
}
await browser.close();
if (failed) { console.error("Klick-Durchlauf fehlgeschlagen"); process.exit(1) }
console.log("Klick-Durchlauf bestanden");
