# Eröffnungstrainer

Schach-Eröffnungen trainieren – im Browser, als App installierbar und offline nutzbar.

**Live:** https://sleepyslothyy.github.io/eroeffnungstrainer/

## Bereiche (Tab-Balken unten)
- **Brett** – Training gegen das Eröffnungsbuch mit Erklärungen, Variantenbaum, Lichess-Datenbank, Bewertungsbalken, Zugeingabe per Tastatur, Blind-Modus und Stockfish 17.1 nach dem Buchende
- **Taktik** – Millionen echter Lichess-Rätsel (CC0): Taktik-Wertung, Levels und Ränge, Tagesziel mit Serie, 27 Themen-Pfade mit Sternen und Freischaltung, Taktik-Sprint (3 Minuten, 3 Leben), Fehler wiederholen, Taktik aus deinen Eröffnungen, Wertungsverlauf
- **Lernen** – Tagestraining mit Serie, Wiederholung nach Lernkurve (pro Variante und pro Stellung), deine eigenen Fehler, Fallen, Blitz-Drill, Blind-Training, Quiz, Endspiele, Musterpartien und Meisterpartien, eigene Varianten, Repertoire-Import (PGN / Lichess-Studie) und Teilen-Link
- **Eröffnungen** – 59 Eröffnungen mit 236 geprüften Varianten, Filter und Zugsuche („1.d4 Sf6 2.c4“)
- **Chess.com** (oder Lichess) – Profil und Wertungen, Wertungsverlauf, alle Partien mit Game Review (Genauigkeit, Zugbewertung, bessere Züge), schwache Eröffnungen mit typischen Abweichungen, Lücken im Repertoire, was Gegner gegen dich spielen, persönlicher Eröffnungsbaum, Tages- und Zufallsrätsel, Trainingsplan aus Schwächen
- **Profil** – Statistik, 28 Abzeichen, Einstellungen (Hell/Dunkel, Brett, Figuren, Stockfish-Stärke), Sync über privates GitHub-Gist, Export/Import

## Technik
Reines HTML/CSS/JavaScript ohne Build-Schritt.
- [chess.js](https://github.com/jhlywa/chess.js) (BSD-2)
- [Stockfish.js 17.1 lite](https://github.com/nmrugg/stockfish.js) (GPLv3, siehe `engine/COPYING.txt`)
- Figuren: „Klassisch“ von Colin M.L. Burnett (GPLv2+), „Staunty“ aus lichess (CC BY-NC-SA 4.0)
- Daten: öffentliche APIs von Chess.com und Lichess (Opening Explorer, Meisterdatenbank)
