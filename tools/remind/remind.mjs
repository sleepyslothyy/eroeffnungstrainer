// Erinnerungen: läuft stündlich in GitHub Actions (.github/workflows/remind.yml).
// Liest users/{uid}/private/push aller Nutzer mit push == true und schickt über Firebase Cloud Messaging eine Nachricht,
// sobald die eingestellte Uhrzeit erreicht ist und Wiederholungen fällig sind oder die Serie heute reißen würde.
// Höchstens eine Erinnerung pro Tag. Ohne das Secret FIREBASE_SERVICE_ACCOUNT endet das Skript ohne Fehler.
// Test ohne Versand: DRY_RUN=1; nur ein Konto: ONLY_UID=<uid>; NOW=<ISO-Zeit> für eine andere Uhrzeit.
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { pickMessage, localNow, decide } from "./remind-core.mjs";

const SA = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!SA || !SA.trim()) {
  console.log("Erinnerungen sind noch nicht eingerichtet: Das Secret FIREBASE_SERVICE_ACCOUNT fehlt (siehe README).");
  process.exit(0);
}
let cred;
try { cred = JSON.parse(SA); } catch (e) {
  console.error("FIREBASE_SERVICE_ACCOUNT ist kein gültiges JSON. Bitte den kompletten Inhalt der Schlüsseldatei als Secret eintragen.");
  process.exit(1);
}
const DRY = process.env.DRY_RUN === "1";
const ONLY = (process.env.ONLY_UID || "").trim();
const NOW = process.env.NOW ? new Date(process.env.NOW).getTime() : Date.now();

initializeApp({ credential: cert(cred) });
const db = getFirestore();
const fcm = getMessaging();

const snap = await db.collection("users").where("push", "==", true).get();
let sent = 0, skipped = 0, gone = 0, failed = 0;
for (const u of snap.docs) {
  if (ONLY && u.id !== ONLY) continue;
  const ref = db.doc(`users/${u.id}/private/push`);
  const d = (await ref.get()).data();
  if (!d || !d.on || !d.tok) { skipped++; continue; }
  const L = localNow(NOW, d.tz || "Europe/Berlin");
  const what = decide(d, L, NOW);
  if (!what) { skipped++; continue; }
  const msg = pickMessage(what, d, L);
  const payload = {
    token: d.tok,
    webpush: {
      headers: { TTL: String(6 * 3600), Urgency: "normal" },
      data: { t: msg.title, b: msg.body, u: "./#taeglich", n: String(what.due || 0), tag: "zz-remind" }
    }
  };
  if (DRY) { console.log(`[Probe] ${u.id}: ${what.kind} · ${msg.title}: ${msg.body}`); sent++; continue; }
  try {
    await fcm.send(payload);
    const upd = { sentAt: NOW, sent: (d.sent || 0) + 1 };
    if (what.kind === "test") upd.test = false; else upd.last = L.day;
    await ref.set(upd, { merge: true });
    sent++;
  } catch (e) {
    const code = (e && (e.code || e.errorInfo && e.errorInfo.code)) || "";
    if (/registration-token-not-registered|invalid-registration-token|invalid-argument/.test(code)) {
      await ref.set({ on: false, tok: null, goneAt: NOW }, { merge: true });
      await u.ref.set({ push: false }, { merge: true });
      gone++;
    } else {
      console.error(`Senden an ${u.id} fehlgeschlagen: ${code} ${e && e.message}`);
      failed++;
    }
  }
}
console.log(`Erinnerungen: ${sent} gesendet, ${skipped} ohne Anlass, ${gone} abgemeldete Geräte entfernt, ${failed} Fehler.`);
if (failed && !sent) process.exit(1);
