// Rauchtest: öffnet die App in Chromium oder WebKit (Handy und Computer), besucht alle Bereiche,
// spielt eine Variante und eine kurze Computer-Partie und schlägt fehl, sobald ein JavaScript-Fehler auftritt.
// Start: node tests/smoke.mjs  (erwartet einen Server auf http://localhost:8765)
import { chromium, webkit } from "playwright";
// BROWSER=webkit prüft dieselben Abläufe mit der Safari-Engine
const ENGINE = process.env.BROWSER === "webkit" ? webkit : chromium;
const BASE = process.env.BASE || "http://localhost:8765/";
const W = ms => new Promise(r => setTimeout(r, ms));
const VIEWS = ["home","learn","courses","openings","openings:lex","tactics","tactics:hist","end","quiz","games","coords","guess","bots","tours","scout","memos","online:play","online:live","analyse","chess","profile:stats","league","profile:badges","profile:settings","profile:sync","online:account","legal"];
let failed = false;
const browser = await ENGINE.launch();
console.log("Browser: " + (process.env.BROWSER === "webkit" ? "WebKit (Safari)" : "Chromium"));
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
  const po = await page.evaluate(() => document.getElementById("sfBtn").textContent.trim());
  if (!/^Gegen \S+ weiterspielen$/.test(po)) errs.push("Weiterspielen-Knopf zeigt keinen Trainer: " + po);
  // „Darum nicht“: Stockfish ordnet einen Nicht-Buchzug ein (nur am Computer, damit der Test kurz bleibt)
  if (!vp.isMobile) {
    await page.evaluate(() => window.__ET.select("italienisch", 0)); await W(800);
    await page.evaluate(() => window.__ET.tryMove("a2", "a4"));
    let why = "";
    for (let k = 0; k < 60 && !/Stockfish|Darum nicht/.test(why); k++) { await W(500); why = await page.evaluate(() => document.getElementById("stText").textContent) }
    if (!/Stockfish|Darum nicht/.test(why)) errs.push("Nicht-Buchzug wurde nicht eingeordnet: " + why);
    else console.log("Darum nicht: " + why);
  }
  // Zugumstellung: 4.d3 statt 4.c3 im Giuoco Pianissimo führt nach 4…Sf6 5.c3 in die Buchstellung
  if (!vp.isMobile) {
    await page.evaluate(() => { const o = window.__ET.ALL().find(x => x.id === "italienisch"); window.__ET.select("italienisch", o.lines.findIndex(l => l.n === "Giuoco Pianissimo")) }); await W(800);
    for (const [a, b] of [["e2", "e4"], ["g1", "f3"], ["f1", "c4"]]) { await page.evaluate(([a, b]) => window.__ET.tryMove(a, b), [a, b]); await W(900) }
    await page.evaluate(() => window.__ET.tryMove("d2", "d3"));
    let ok = false;
    for (let k = 0; k < 40 && !ok; k++) { await W(400); ok = await page.evaluate(() => !!window.__ET.tp && window.__ET.hist().length === 8) }
    if (!ok) errs.push("Zugumstellung wurde nicht erkannt: " + await page.evaluate(() => document.getElementById("stText").textContent));
    else {
      await page.evaluate(() => window.__ET.tryMove("c2", "c3")); await W(1200);
      const h = await page.evaluate(() => window.__ET.hist().slice(0, 9).join(" "));
      if (h !== "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3") errs.push("Nach der Zugumstellung nicht zurück im Buch: " + h);
      else console.log("Zugumstellung: zurück im Buch");
    }
    // Spickzettel: ein PDF mit Italienisch erzeugen
    const pdf = await page.evaluate(async () => { try { const R = await window.__ET.cheatPdf(["italienisch"]); return R.pages + " Seiten, " + R.blob.size + " Bytes" } catch (e) { return "Fehler: " + e.message } });
    if (!/Seiten/.test(pdf)) errs.push("Spickzettel-PDF: " + pdf); else console.log("Spickzettel: " + pdf);
  }
  await page.evaluate(() => window.__ET.showView("profile:stats")); await W(400);
  console.log(`${vp.width}px: ${VIEWS.length} Bereiche, Variante: ${done}, XP ${xp}`);
  if (errs.length) { failed = true; console.error(errs.join("\n")) }
  await ctx.close();
}
await browser.close();
if (failed) { console.error("Rauchtest fehlgeschlagen"); process.exit(1) }
console.log("Rauchtest bestanden");
