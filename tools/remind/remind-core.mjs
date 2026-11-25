// Reine Logik der Erinnerungen (ohne Firebase), damit sie sich im Rauchtest prüfen lässt.

/* Ortszeit in der Zeitzone des Geräts: Tag, Stunde, Vortag und Ende des Tages (ms) */
export function localNow(now, tz) {
  let f;
  try { f = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }); }
  catch (e) { return localNow(now, "Europe/Berlin"); }
  const p = o => Object.fromEntries(f.formatToParts(o).map(x => [x.type, x.value]));
  const a = p(new Date(now)), y = p(new Date(now - 864e5));
  const hour = +a.hour % 24, minute = +a.minute;
  return { day: `${a.year}-${a.month}-${a.day}`, yesterday: `${y.year}-${y.month}-${y.day}`, hour, minute,
    eod: now + ((23 - hour) * 3600 + (59 - minute) * 60 + 59) * 1000 };
}

/* Soll heute erinnert werden? d = users/{uid}/private/push
   hour: gewünschte Stunde, last: Tag der letzten Erinnerung, due: Fälligkeiten (ms), sn/sl: Serie (Tage, letzter Tag) */
export function decide(d, L, now) {
  if (d.test) return { kind: "test", due: 0 };
  const hour = Number.isInteger(d.hour) ? d.hour : 18;
  if (L.hour < hour || L.hour >= 23) return null;
  if (d.last === L.day) return null;
  const due = (Array.isArray(d.due) ? d.due : []).filter(t => typeof t === "number" && t <= L.eod).length;
  const done = d.sl === L.day;
  const risk = !done && (d.sn || 0) > 0 && d.sl === L.yesterday;
  if (!due && !risk) return null;
  if (done && !due) return null;
  return { kind: due && risk ? "both" : due ? "due" : "streak", due, streak: d.sn || 0 };
}

const NAMES = { mila: "Mila", bruno: "Bruno", greta: "Greta", konrad: "Kapitän Konrad", linus: "Linus", rex: "Rex", nova: "Nova", ilka: "Dr. Ilka Glut", rika: "Rika Rotsegel" };
const V = n => `${n} ${n === 1 ? "Variante" : "Varianten"}`;
const T = s => s === 1 ? "einem Tag" : `${s} Tagen`;
const ist = n => n === 1 ? "ist" : "sind";
const SAY = {
  mila: {
    due: n => `${V(n)} ${ist(n)} fällig. Kurz wiederholen – dann ${n === 1 ? "sitzt sie" : "sitzen sie"} für lange Zeit.`,
    streak: s => `Deine Serie von ${T(s)} läuft heute ab. Eine kleine Einheit genügt!`,
    both: (n, s) => `${V(n)} ${ist(n)} fällig, und deine Serie von ${T(s)} wartet. Fünf Minuten reichen!`,
    test: () => "Probe aus der Schachschule: Deine Erinnerungen kommen an."
  },
  bruno: {
    due: n => `Die Baustelle ruft: ${V(n)} ${n === 1 ? "will" : "wollen"} nachgezogen werden.`,
    streak: s => `Nicht nachlassen – deine Serie von ${T(s)} braucht heute noch einen Stein.`,
    both: (n, s) => `${V(n)} ${ist(n)} fällig, deine Serie von ${T(s)} steht auf dem Spiel. Ran an den Bau!`,
    test: () => "Bruno prüft die Leitung: Die Erinnerung kommt an."
  },
  greta: {
    due: n => `Die Mauern brauchen Pflege: ${V(n)} ${ist(n)} fällig.`,
    streak: s => `Deine Serie von ${T(s)} hält nur, wenn du heute trainierst.`,
    both: (n, s) => `${V(n)} ${ist(n)} fällig, und die Serie von ${T(s)} will verteidigt werden.`,
    test: () => "Greta meldet: Die Burgglocke funktioniert."
  },
  konrad: {
    due: n => `Alle Mann an Deck! ${V(n)} ${ist(n)} fällig.`,
    streak: s => `Kurs halten: Deine Serie von ${T(s)} braucht heute noch eine Einheit.`,
    both: (n, s) => `${V(n)} an Bord und eine Serie von ${T(s)} – heute nicht vom Kurs abkommen!`,
    test: () => "Kapitän an Mannschaft: Die Funkverbindung steht."
  },
  linus: {
    due: n => `Die Zielscheibe steht: ${V(n)} ${n === 1 ? "wartet" : "warten"} auf deinen Schuss.`,
    streak: s => `Deine Serie von ${T(s)} – heute noch ein Treffer, und sie hält.`,
    both: (n, s) => `${V(n)} im Visier, eine Serie von ${T(s)} im Köcher. Spann den Bogen!`,
    test: () => "Linus trifft ins Schwarze: Deine Erinnerungen kommen an."
  },
  rex: {
    due: n => `${V(n)}! Feuer frei, bevor ${n === 1 ? "sie abkühlt" : "sie abkühlen"}!`,
    streak: s => `Deine Serie von ${T(s)} brennt noch – leg heute nach!`,
    both: (n, s) => `${V(n)} glühen schon, und deine Serie von ${T(s)} brennt. Volle Attacke!`,
    test: () => "Rex testet den Funken: Er zündet!"
  },
  nova: {
    due: n => `Systemcheck: ${V(n)} ${n === 1 ? "braucht" : "brauchen"} Wartung.`,
    streak: s => `Warnung: Deine Serie von ${T(s)} verliert heute die Verbindung.`,
    both: (n, s) => `${V(n)} im Wartungsmodus, die Serie von ${T(s)} im Countdown. Start frei!`,
    test: () => "Signal empfangen. Deine Erinnerungen sind online."
  },
  ilka: {
    due: n => `Die Messwerte steigen: ${V(n)} ${ist(n)} fällig.`,
    streak: s => `Deine Serie von ${T(s)} kühlt heute ab, wenn du nicht trainierst.`,
    both: (n, s) => `${V(n)} ${n === 1 ? "brodelt" : "brodeln"}, und die Serie von ${T(s)} steht kurz vor dem Ausbruch.`,
    test: () => "Messung abgeschlossen: Deine Erinnerungen kommen an."
  },
  rika: {
    due: n => `Arrr! ${V(n)} ${n === 1 ? "liegt" : "liegen"} im Laderaum – hol sie dir!`,
    streak: s => `Deine Serie von ${T(s)} geht heute über Bord, wenn du nicht anheuerst!`,
    both: (n, s) => `${V(n)} als Beute und eine Serie von ${T(s)} auf See. Alle Segel setzen!`,
    test: () => "Ahoi! Deine Flaschenpost ist angekommen."
  }
};

export function pickMessage(what, d) {
  const co = SAY[d.co] ? d.co : "mila";
  const S = SAY[co];
  const body = what.kind === "test" ? S.test() : what.kind === "both" ? S.both(what.due, what.streak) : what.kind === "due" ? S.due(what.due) : S.streak(what.streak);
  return { title: NAMES[co], body };
}
export const TRAINERS = Object.keys(SAY);
