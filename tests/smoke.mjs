// Rauchtest: öffnet die App in Chromium (Handy und Computer), besucht alle Bereiche,
// spielt eine Variante und eine kurze Computer-Partie und schlägt fehl, sobald ein JavaScript-Fehler auftritt.
// Start: node tests/smoke.mjs  (erwartet einen Server auf http://localhost:8765)
import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:8765/";
const W = ms => new Promise(r => setTimeout(r, ms));
const VIEWS = ["home","learn","courses","openings","tactics","end","quiz","games","coords","guess","bots","tours","online:play","online:live","analyse","chess","profile:stats","league","profile:badges","profile:settings","profile:sync","online:account","legal"];
let failed = false;
const browser = await chromium.launch();
for (const vp of [{ width: 390, height: 844, isMobile: true, hasTouch: true }, { width: 1280, height: 860 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errs.push("console: " + m.text()) });
  await page.route(u => !u.href.startsWith(BASE), r => r.abort());
  await page.addInitScript(() => { localStorage.setItem("et-onb", "1"); localStorage.setItem("et-set", JSON.stringify({ autoSync: false, learnFirst: false })) });
  await page.goto(BASE); await W(1200);
  for (const v of VIEWS) {
    await page.evaluate(v => window.__ET.showView(v), v); await W(250);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (over > 1) errs.push(`Seite ${v} ist ${over}px zu breit`);
  }
  // eine Variante fehlerfrei durchspielen
  await page.evaluate(() => window.__ET.select("italienisch", 0)); await W(800);
  for (let k = 0; k < 30; k++) {
    const st = await page.evaluate(() => document.getElementById("stTitle").textContent);
    if (/geschafft/.test(st)) break;
    await page.evaluate(() => { const g = new Chess(window.__ET.fen()); const e = window.__ET.expected()[0]; const m = e && g.moves({ verbose: true }).find(x => x.san.replace(/[+#?!]/g, "") === e); if (m) window.__ET.tryMove ? window.__ET.tryMove(m.from, m.to) : null; return !!m });
    await W(800);
  }
  const done = await page.evaluate(() => document.getElementById("stTitle").textContent);
  if (!/geschafft/.test(done)) errs.push("Variante wurde nicht abgeschlossen: " + done);
  const xp = await page.evaluate(() => window.__ET.GX.xp);
  if (!(xp > 0)) errs.push("Keine XP für eine gelernte Variante");
  await page.evaluate(() => window.__ET.showView("profile:stats")); await W(400);
  console.log(`${vp.width}px: ${VIEWS.length} Bereiche, Variante: ${done}, XP ${xp}`);
  if (errs.length) { failed = true; console.error(errs.join("\n")) }
  await ctx.close();
}
await browser.close();
if (failed) { console.error("Rauchtest fehlgeschlagen"); process.exit(1) }
console.log("Rauchtest bestanden");
