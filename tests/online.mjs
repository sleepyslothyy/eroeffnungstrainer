// Online-Test mit Test-Attrappe statt Firebase: zwei Spieler, die Geräteuhr von Spieler B geht 40 s vor.
// Prüft gleiche Uhren auf beiden Geräten, Aufholen nach hängendem Live-Abo, Offline-Phase und Wiederverbinden.
// Start: node tests/online.mjs  (erwartet einen Server auf http://localhost:8765)
import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:8765/";
const W = ms => new Promise(r => setTimeout(r, ms));
const fails = [];
const check = (ok, msg) => { console.log((ok ? "ok   " : "FEHLER ") + msg); if (!ok) fails.push(msg); };

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const errs = [];
await ctx.addInitScript(() => {
  window.__MOCKNET = true; localStorage.setItem("et-onb", "1");
  localStorage.setItem("et-set", JSON.stringify({ autoSync: false, sound: false }));
  Object.defineProperty(navigator, "share", { value: undefined });
});
await ctx.route(/^(?!http:\/\/localhost)/, r => r.abort());
const page = async (name, skew) => {
  const p = await ctx.newPage(); p.on("pageerror", e => errs.push(name + ": " + e.message));
  if (skew) await p.addInitScript(s => { const n0 = Date.now.bind(Date); Date.now = () => n0() + s; }, skew);
  await p.goto(BASE); await W(900); return p;
};
const register = async (p, name, mail) => {
  await p.evaluate(() => __ET.showView("online:account")); await W(400);
  await p.evaluate(() => document.querySelector('[data-am="reg"]').click()); await W(100);
  await p.evaluate(([n, m]) => { auName.value = n; auMail.value = m; auPw.value = "geheim123"; authForm.requestSubmit(); }, [name, mail]); await W(1400);
};
const move = async (p, a, c, w) => { await p.evaluate(([a, c]) => __ET.tryMove(a, c), [a, c]); await W(w || 500); };
const n = p => p.evaluate(() => __ET.hist().length);
const secs = t => { const [m, s] = t.split(":").map(Number); return m * 60 + s; };

const A = await page("A"); await A.evaluate(() => localStorage.removeItem("mocknet-db")); await register(A, "Alice", "a@t.de");
const B = await page("B", 40000); await register(B, "Bob", "b@t.de");
await A.evaluate(() => { __ET.ON.col = "w"; __ET.ON.tc = "3+0"; });
const gid = await A.evaluate(() => __ET.createGame(null)); await W(800);
await B.evaluate(id => __ET.openOnlineGame(id), gid); await W(1200);

await move(A, "e2", "e4"); await move(B, "e7", "e5"); await move(A, "g1", "f3"); await W(3000);
const ca = await A.evaluate(() => oppClock.textContent), cb = await B.evaluate(() => youClock.textContent);
check(Math.abs(secs(ca) - secs(cb)) <= 1, `Bobs Uhr gleich auf beiden Geräten trotz 40 s Uhrversatz (${ca} / ${cb})`);

await B.evaluate(() => { window.__MOCKDEAF = true; }); await move(B, "b8", "c6", 300); await move(A, "f1", "c4", 300);
await W(6500);
check(await n(B) === await n(A), "B holt hängendes Live-Abo über die Server-Abfrage auf");
await B.evaluate(() => { window.__MOCKDEAF = false; });

await B.evaluate(() => { window.__MOCKOFF = true; window.__MOCKDEAF = true; }); await move(B, "g8", "f6", 1500);
check(await B.evaluate(() => stTitle.textContent) === "Verbindung unterbrochen", "Offline: Hinweis auf unterbrochene Verbindung");
check(await n(B) === 5, "Offline: Zug wird zurückgenommen, Brett bleibt synchron");
await B.evaluate(() => { window.__MOCKOFF = false; window.__MOCKDEAF = false; dispatchEvent(new Event("online")); }); await W(1500);
await move(B, "g8", "f6", 900);
check(await n(A) === 6 && await n(B) === 6, "Nach dem Wiederverbinden geht der Zug durch");

check(errs.length === 0, "keine JavaScript-Fehler" + (errs.length ? ": " + errs.join(" | ") : ""));
await b.close();
if (fails.length) { console.error(`${fails.length} Prüfung(en) fehlgeschlagen`); process.exit(1); }
console.log("Online-Test bestanden");
