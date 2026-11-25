// Prüft die Logik der Erinnerungen ohne Firebase. Start: node tools/remind/test-core.mjs
import { localNow, decide, pickMessage, TRAINERS } from "./remind-core.mjs";
let bad = 0;
const ok = (c, t) => { if (!c) { bad++; console.error("FEHLER: " + t) } };
const t0 = Date.parse("2026-11-25T17:30:00Z"); // 18:30 in Berlin
const L = localNow(t0, "Europe/Berlin");
ok(L.day === "2026-11-25" && L.hour === 18 && L.yesterday === "2026-11-24", "Ortszeit Berlin " + JSON.stringify(L));
ok(localNow(t0, "America/New_York").hour === 12, "Ortszeit New York");
ok(localNow(t0, "Mars/Olympus").hour === 18, "unbekannte Zeitzone fällt auf Berlin zurück");
const base = { on: true, tok: "x", hour: 18, due: [t0 - 3600e3, t0 + 3600e3, t0 + 2 * 864e5], sn: 4, sl: "2026-11-24" };
let w = decide(base, L, t0);
ok(w && w.kind === "both" && w.due === 2 && w.streak === 4, "fällig und Serie: " + JSON.stringify(w));
ok(decide({ ...base, hour: 19 }, L, t0) === null, "vor der gewünschten Stunde nichts");
ok(decide({ ...base, last: "2026-11-25" }, L, t0) === null, "höchstens einmal am Tag");
ok(decide({ ...base, due: [], sl: "2026-11-25" }, L, t0) === null, "heute schon trainiert, nichts fällig");
w = decide({ ...base, due: [] }, L, t0);
ok(w && w.kind === "streak", "nur die Serie");
w = decide({ ...base, sl: "2026-11-20" }, L, t0);
ok(w && w.kind === "due" && w.due === 2, "Serie schon gerissen: nur fällig");
ok(decide({ ...base, due: [], sn: 0, sl: null }, L, t0) === null, "kein Anlass");
w = decide({ ...base, test: true, hour: 22 }, L, t0);
ok(w && w.kind === "test", "Probe vom Server kommt sofort");
const late = localNow(Date.parse("2026-11-25T22:30:00Z"), "Europe/Berlin");
ok(decide(base, late, Date.parse("2026-11-25T22:30:00Z")) === null, "nach 23 Uhr nichts mehr");
for (const co of TRAINERS) for (const kind of ["due", "streak", "both", "test"]) for (const n of [1, 5]) {
  const m = pickMessage({ kind, due: n, streak: n }, { co });
  ok(m.title && m.body && !/undefined|NaN/.test(m.body), `${co}/${kind}/${n}: ${m.body}`);
  ok(!/1 Varianten|1 Tagen/.test(m.body), `Einzahl ${co}/${kind}: ${m.body}`);
}
ok(pickMessage({ kind: "due", due: 3 }, { co: "unbekannt" }).title === "Mila", "unbekannter Trainer fällt auf Mila zurück");
console.log(pickMessage({ kind: "both", due: 5, streak: 7 }, { co: "rika" }));
if (bad) { console.error(bad + " Fehler"); process.exit(1) }
console.log("Erinnerungslogik ok");
