// Erinnerungen ohne echte Server: Firebase als Test-Attrappe, FCM-Token als Attrappe, Push-Nachricht über das DevTools-Protokoll.
// Prüft Einschalten, Uhrzeit, Abgleich der Fälligkeiten, Probe-Nachricht, Anzeige einer FCM-Nachricht im Service Worker,
// Tippen auf die Nachricht (startet das Tagestraining) und Ausschalten.
// Start: node tests/push.mjs  (Server auf http://localhost:8765; braucht das volle Chromium, nicht die Headless-Shell)
import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:8765/";
const ORIGIN = new URL(BASE).origin;
const W = ms => new Promise(r => setTimeout(r, ms));
const fails = [];
const check = (ok, msg) => { console.log((ok ? "ok   " : "FEHLER ") + msg); if (!ok) fails.push(msg); };

const b = await chromium.launch({ channel: "chromium" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
await ctx.grantPermissions(["notifications"], { origin: ORIGIN });
await ctx.route(u => !u.href.startsWith(BASE), r => r.abort());
await ctx.addInitScript(() => {
  window.__MOCKNET = true; localStorage.setItem("et-onb", "1");
  localStorage.setItem("et-set", JSON.stringify({ autoSync: false, sound: false, learnFirst: false }));
  window.__PUSHCALLS = [];
  window.__PUSHTEST = { m: {}, M: {
    isSupported: async () => true,
    getToken: async (m, o) => { window.__PUSHCALLS.push("getToken" + (o && o.serviceWorkerRegistration ? "+sw" : "")); return "tok-test-1"; },
    deleteToken: async () => { window.__PUSHCALLS.push("deleteToken"); return true; } } };
});
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", e => errs.push(e.message));
await page.goto(BASE); await W(1200);
check(await page.evaluate(() => navigator.serviceWorker.register("sw.js").then(() => navigator.serviceWorker.ready).then(r => !!r.active)), "Service Worker läuft");
await page.evaluate(() => localStorage.removeItem("mocknet-db"));
const card = () => page.evaluate(() => document.getElementById("pushCard").textContent.replace(/\s+/g, " ").trim());
await page.evaluate(() => __ET.showView("profile:settings")); await W(500);
check(/brauchst du ein Konto/.test(await card()), "Ohne Konto: Hinweis auf die Anmeldung");

await page.evaluate(() => __ET.showView("online:account")); await W(400);
await page.evaluate(() => document.querySelector('[data-am="reg"]').click()); await W(100);
await page.evaluate(() => { auName.value = "Paula"; auMail.value = "p@t.de"; auPw.value = "geheim123"; authForm.requestSubmit(); }); await W(1500);
const uid = await page.evaluate(() => __ET.ON.user && __ET.ON.user.uid);
check(!!uid, "Konto angelegt");
const db = () => page.evaluate(() => JSON.parse(localStorage.getItem("mocknet-db") || "{}"));
const doc = async () => (await db())[`users/${uid}/private/push`] || {};

await page.evaluate(() => __ET.showView("profile:settings")); await W(500);
await page.click("#swPush"); await W(1200);
let d = await doc();
check(d.on === true && d.tok === "tok-test-1" && d.hour === 18 && typeof d.tz === "string", `Einschalten speichert Token, Uhrzeit und Zeitzone (${JSON.stringify({ on: d.on, tok: d.tok, hour: d.hour, tz: d.tz })})`);
check((await db())[`users/${uid}`].push === true, "Profil ist für den stündlichen Lauf markiert");
check((await page.evaluate(() => window.__PUSHCALLS)).includes("getToken+sw"), "Token wird mit dem eigenen Service Worker geholt");

await page.selectOption("#pushH", "20"); await W(500);
check((await doc()).hour === 20, "Uhrzeit wird übernommen");

await page.evaluate(() => { __ET.S.srs["italienisch#0"] = { iv: 1, due: Date.now() - 1000, ease: 2.5 }; Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
await W(700);
d = await doc();
check(Array.isArray(d.due) && d.due.length >= 1 && d.co === "mila", `Beim Verlassen der App werden Fälligkeiten abgeglichen (${d.due && d.due.length} Termine)`);
await page.evaluate(() => Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true }));

await page.click("#pushTest"); await W(700);
const notes = () => page.evaluate(() => navigator.serviceWorker.ready.then(r => r.getNotifications()).then(L => L.map(n => ({ t: n.title, b: n.body, tag: n.tag, u: n.data && n.data.u }))));
check((await notes()).some(n => n.tag === "zz-test"), "Probe auf diesem Gerät erscheint");
await page.click("#pushSrv"); await W(500);
check((await doc()).test === true, "Probe vom Server ist angefordert");

const cdp = await ctx.newCDPSession(page);
const regs = [];
cdp.on("ServiceWorker.workerRegistrationUpdated", e => regs.push(...e.registrations));
await cdp.send("ServiceWorker.enable"); await W(500);
const rid = (regs.find(r => !r.isDeleted) || {}).registrationId;
await cdp.send("ServiceWorker.deliverPushMessage", { origin: ORIGIN, registrationId: rid, data: JSON.stringify({ data: { t: "Kapitän Konrad", b: "Alle Mann an Deck! 5 Varianten sind fällig.", n: "5", u: "./#taeglich", tag: "zz-remind" }, from: "1", fcmMessageId: "x" }) });
await W(1000);
const n = (await notes()).find(x => x.tag === "zz-remind");
check(!!n && n.t === "Kapitän Konrad" && n.u === "./#taeglich", "FCM-Nachricht wird angezeigt: " + (n ? `${n.t}: ${n.b}` : "keine"));

await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new MessageEvent("message", { data: { type: "go", hash: "#taeglich" } }))); await W(1000);
check(await page.evaluate(() => !!__ET.sess && __ET.mode() === "train"), "Tippen auf die Nachricht startet das Tagestraining");

await page.evaluate(() => __ET.showView("profile:settings")); await W(500);
await page.click("#swPush"); await W(900);
d = await doc();
check(d.on === false && d.tok === null && (await db())[`users/${uid}`].push === false && (await page.evaluate(() => window.__PUSHCALLS)).includes("deleteToken"), "Ausschalten löscht Token und Markierung");
check(errs.length === 0, "keine JavaScript-Fehler" + (errs.length ? ": " + errs.join(" | ") : ""));
await b.close();
if (fails.length) { console.error("Erinnerungs-Test fehlgeschlagen"); process.exit(1); }
console.log("Erinnerungs-Test bestanden");
