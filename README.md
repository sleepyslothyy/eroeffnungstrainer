# Zugzwang

Schach-Eröffnungen lernen, Taktik trainieren, online spielen und Partien analysieren – im Browser, als App installierbar und offline nutzbar.

**Live:** https://sleepyslothyy.github.io/eroeffnungstrainer/

## Bereiche (fünf Tabs, am Computer in der Seitenleiste)
- **Start** – Begrüßung, Weitermachen, „Heute“ mit Tagestraining, Taktik-Ziel und Wiederholungen, Hinweise auf laufende Online-Partien, Schnellstart und dein Stand
- **Training** – Übersicht mit Sammlungen (Eröffnungen, Taktik, Drills, Endspiele & Partien, Repertoire), dazu Eröffnungen, Taktik, Endspiele, Quiz und Musterpartien
  - 59 Eröffnungen mit 236 geprüften Varianten, Wiederholung nach Lernkurve, schwache Stellungen, Fallen, Blitz- und Blind-Drill
  - Millionen echter Lichess-Rätsel (CC0) mit Wertung, Levels, Themen-Pfaden und Taktik-Sprint
- **Spielen** – Online gegen Freunde (Einladungslink oder Herausforderung, Uhren, Remis, Revanche), gegen den Computer in sechs Stufen (auch ab einer Eröffnung) und Live-Partien zum Zuschauen
- **Analyse** – Game Review per Link oder PGN, Analysebrett mit FEN, zuletzt analysierte Partien und die Chess.com-/Lichess-Zentrale
- **Profil** – Statistik, Abzeichen, Bestenliste, Freunde, Einstellungen (Akzentfarbe Lila/Rot/Grün, Hell/Dunkel, Brett, Figuren, Komfort), Konto, Daten und Rechtliches

## Partieanalyse (Game Review)
- Partien aus Chess.com/Lichess, per Link oder als PGN – Stockfish 17.1 bewertet jeden Zug
- Zugbewertungen wie auf Chess.com: Brillant, Großartig, Bester Zug, Exzellent, Gut, Buchzug, Ungenauigkeit, Fehler, Verpasst, Patzer, Erzwungen
- Coach-Erklärung zu jedem Zug (was er verliert, erlaubtes Matt, bessere Fortsetzung), Genauigkeit und geschätzte Elo pro Spieler, Genauigkeit nach Partiephase, Bewertungsgraph, wichtige Momente
- Partien gegen Stockfish (auch nach einer Eröffnung oder im Endspiel): Aufgeben, Revanche und anschließende Partieanalyse
- »Bester Zug«, »Nochmal versuchen«, eigene Varianten direkt auf dem Brett mit Live-Bewertung und den drei besten Stockfish-Linien

## Konten & Online-Partien (Firebase)
- Registrierung mit Benutzername, E-Mail und Passwort; Passwort vergessen; Konto löschen
- Trainingsfortschritt wird im Konto gespeichert und auf allen Geräten synchronisiert
- Bestenliste aller Spieler (Online-Wertung nach Elo, Siege, Partien, Taktik, Varianten, Serie), Freundschaftsanfragen mit Online-Status, Live-Liste aller laufenden Partien mit Zuschauen und Zuschauerzahl
- Live-Partien gegen Freunde per Einladungslink oder direkter Herausforderung, Freundesliste, Bedenkzeiten mit Uhr, Remis, Aufgeben, Abbrechen, Revanche, Zuschauen und anschließende Partieanalyse

## Komfort
- Startseite „Weitermachen“ mit letzter Eröffnung, fälligen Wiederholungen und Tagesziel; Ersteinrichtung beim ersten Öffnen
- Handy-Layout mit Knöpfen direkt unter dem Brett, Zugliste als Streifen
- Wischen auf dem Brett zum Blättern, vergrößerte Figur beim Ziehen mit dem Finger, Zug zurücknehmen, automatisch Dame
- Automatisch weiter nach gelösten Varianten und Aufgaben, Materialanzeige, Konfetti und Serien-Feier
- Chess.com/Lichess beim Öffnen automatisch abgleichen, neue Partien im Hintergrund analysieren
- Querformat und Tablets, Schriftgröße, „Weniger Animationen“

## Rechtliches
Datenschutzerklärung, Impressum und Lizenzen stehen in der App unter Profil → Rechtliches (auch per `#datenschutz` und `#impressum`). Die Angaben fürs Impressum stehen in `IMPRESSUM` am Anfang von Teil 12 in `app.js`.

## Technik
Reines HTML/CSS/JavaScript ohne Build-Schritt.
- Schrift: [Inter](https://rsms.me/inter/) (SIL OFL 1.1), lokal unter `lib/fonts` – keine Anfragen an Google Fonts
- [chess.js](https://github.com/jhlywa/chess.js) (BSD-2)
- [Stockfish.js 17.1 lite](https://github.com/nmrugg/stockfish.js) (GPLv3, siehe `engine/COPYING.txt`)
- Figuren: „Klassisch“ von Colin M.L. Burnett (GPLv2+), „Staunty“ aus lichess (CC BY-NC-SA 4.0)
- [Firebase JS SDK](https://github.com/firebase/firebase-js-sdk) 10.12.2 (Apache-2.0), lokal unter `lib/firebase`
- Daten: öffentliche APIs von Chess.com und Lichess (Opening Explorer, Meisterdatenbank)
