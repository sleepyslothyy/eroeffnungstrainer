# Eröffnungstrainer

Schach-Eröffnungen trainieren – im Browser, auf dem Handy installierbar und offline nutzbar.

**Live:** https://sleepyslothyy.github.io/eroeffnungstrainer/

## Funktionen
- **59 Eröffnungen, 236 Varianten** für Weiß, Schwarz sowie Gambits & Fallen – alle Züge automatisch auf Legalität geprüft
- **Tagestraining & Wiederholung nach Lernkurve** (SM-2): Fehler kommen öfter, sichere Varianten seltener; Serien-Zähler
- **Eigenes Repertoire** per Stern, Training und Quiz nutzen dann nur diese Eröffnungen
- **Stockfish** nach dem Buchende: die Stellung weiterspielen, mit Bewertung und einstellbarer Stärke
- **Erklärungen** zu jedem Zug mit Ideen-Pfeilen, Plan nach der Variante und strategischem Plan
- **Fallen-Training**, **Quiz** (Buchzug, Eröffnung erkennen, Plan zuordnen) und **Musterpartien** mit Erklärungen
- **Eigene Varianten** einspielen und trainieren
- **Partien-Analyse** für Chess.com und Lichess (oder PGN): schwache Eröffnungen, typische Abweichungen mit Link zur Partie, Verlauf pro Monat, was Gegner gegen dich spielen, Trainingsplan aus Schwächen
- **Statistik & Abzeichen**, schwierigste Züge, Export/Import des Fortschritts
- Brettfarben, zwei Figurensets, Brett drehen, Rechtsklick-Pfeile, Zugsuche („1.d4 Sf6 2.c4“), Umwandlungsauswahl

## Technik
Reines HTML/CSS/JavaScript ohne Build-Schritt. Bibliotheken: [chess.js](https://github.com/jhlywa/chess.js) (BSD-2), [stockfish.js](https://github.com/nmrugg/stockfish.js) (GPLv3, wird zur Laufzeit von cdnjs geladen).
Figuren: „Klassisch“ von Colin M.L. Burnett (GPLv2+), „Staunty“ aus lichess (CC BY-NC-SA 4.0).
