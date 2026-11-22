/* Zugbäume: alle realistischen Gegnerzüge mit Häufigkeit.
   Notation: Züge in SAN, "(…)" = Alternative zum vorherigen Zug, "@n" = ungefähre Häufigkeit des Gegnerzugs, "{…}" = Name ab dieser Stellung.
   Jedes Blatt wird beim Start zu einer Variante der Eröffnung; bestehende Varianten behalten ihre Nummer. */
const TREES={
"italienisch":`e4 e5 Nf3 Nc6 Bc4 {Italienisch}
 Bc5@55 {Giuoco Piano}
  (Nf6@38 {Zweispringerspiel} Ng5
    d5@82 (Bc5@12 {Traxler-Gegenangriff} Bxf7+ Ke7 Bb3 Rf8 O-O d6 c3) (Nxe4@6 Nxe4 d5 Bxd5 Qxd5 Nbc3)
    exd5 Na5@60 {5…Sa5}
      (Nxd5@18 {Fegatello} Nxf7 Kxf7 Qf3+ Ke6 Nc3 Nb4@65 (Ne7@35 d4 c6 Bg5 h6 Bxe7 Bxe7 O-O-O) a3 Nxc2+ Kd1 Nxa1 Nxd5)
      (Nd4@12 {Fritz-Variante} c3 b5 Bf1 Nxd5 cxd4)
      (b5@10 {Ulvestad-Variante} Bf1 Nd4@65 (h6@35 Nxf7 Kxf7 dxc6) c3 Nxd5 cxd4)
    Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5 Bd6@55 (Bc5@25 c3) (Qc7@20 d4) d4 exd3 Nxd3 Qc7 h3 O-O O-O)
  (Be7@7 {Ungarische Verteidigung} d4 d6@60 (exd4@40 Nxd4 Nf6 Nc3 d6 O-O O-O h3) d5 Nb8 Bd3 Nf6 c4)
 c3 Nf6@65
  (d6@15 d4 exd4 cxd4 Bb6 Nc3 Nf6 O-O O-O h3)
  (Qe7@12 d4 Bb6 O-O d6 h3 Nf6 Re1)
  (Bb6@8 d4 Qe7 O-O d6 h3 Nf6 Re1)
 d4 exd4 cxd4 Bb4+@80 (Bb6@20 d5 Ne7 e5 Ng4 d6)
 Bd2 Bxd2+@80 (Nxe4@20 Bxb4 Nxb4 Bxf7+ Kxf7 Qb3+ d5 Ne5+ Ke6 Qxb4)
 Nbxd2 d5@80 (Nxe4@20 Nxe4 d5 Bd3 dxe4 Bxe4 O-O O-O)
 exd5 Nxd5 Qb3 Nce7@70 (Na5@30 Qa4+ c6 Bxd5 Qxd5 O-O) O-O O-O Rfe1`,
"spanisch":`e4 e5 Nf3 Nc6 Bb5 {Spanisch}
 a6@68 {Morphy-Verteidigung}
  (Nf6@20 {Berliner Verteidigung} O-O Nxe4@65 (d6@10 d4 Bd7 Nc3 Be7 Re1) (Bc5@25 c3 O-O@60 (Nxe4@40 Qe2 Nf6 d4 Bb6 dxe5) d4 Bb6 Re1)
     d4 Nd6@80 (Be7@20 Qe2 Nd6 Bxc6 bxc6 dxe5 Nb7 Nc3) Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8 Nc3)
  (Bc5@6 {Klassische Verteidigung} c3 Nf6@70 (f5@30 d4 fxe4 Bxc6 dxc6 Nxe5 Bd6 Qh5+ g6 Qe2) O-O O-O d4 Bb6 Re1)
  (d6@6 {Steinitz-Verteidigung} d4 Bd7@60 (exd4@40 Nxd4 Bd7 Nc3 Nf6 O-O) Nc3 Nf6 O-O Be7 Re1)
  (Nd4@3 {Bird-Verteidigung} Nxd4 exd4 O-O Bc5 d3 c6 Ba4)
  (g6@3 {Fianchetto-Verteidigung} c3 a6 Ba4 d6 d4 Bd7 O-O)
 Ba4 Nf6@85
  (d6@15 {Moderne Steinitz-Verteidigung} c3 Bd7@70 (f5@30 exf5 Bxf5 O-O Bd3 Re1 Be7 Bc2) d4 Nf6 O-O Be7 Re1)
 O-O Be7@65 {Geschlossene Variante}
  (Nxe4@20 {Offene Variante} d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5@55 (Be7@45 Re1 O-O Nd4) Nbd2 O-O Bc2)
  (Bc5@8 {Möller-Verteidigung} c3 b5 Bb3 d6 a4 Rb8 d4 Bb6 Na3)
  (b5@15 Bb3 Bc5@50 {Arkhangelsk-Variante} (Bb7@50 Re1 Bc5 c3 d6 d4 Bb6 Bg5) a4 Rb8 c3 d6 d4 Bb6 Na3)
 Re1 b5 Bb3 d6@70
  (O-O@30 c3 d5@60 {Marshall-Angriff} (d6@40 h3) exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6 d4 Bd6 Re1 Qh4 g3 Qh3 Be3)
 c3 O-O h3 Na5@40 {Tschigorin-System}
  (Bb7@25 {Zaitsev-System} d4 Re8 Nbd2 Bf8 a4 h6 Bc2)
  (Nb8@20 {Breyer-System} d4 Nbd7 Nbd2 Bb7 Bc2 Re8 Nf1 Bf8 Ng3)
  (h6@15 {Smyslow-System} d4 Re8 Nbd2 Bf8 a3)
 Bc2 c5 d4 Qc7@60 (Nd7@40 Nbd2 cxd4 cxd4 Nc6 Nb3) Nbd2 cxd4 cxd4 Nc6 Nb3`,
"schottisch":`e4 e5 Nf3 Nc6 d4 exd4 Nxd4 {Schottisch}
 Bc5@40 {Klassische Variante}
  (Nf6@42 {Schmidt-Variante} Nxc6 bxc6 e5 Qe7@85 (Nd5@15 c4 Nb6 Bd3) Qe2 Nd5 c4 Ba6@55 {Mieses-Variante} (Nb6@45 Nc3 Qe6 Qe4) b3 g6@60 (O-O-O@40 g3) f4)
  (Qh4@8 {Steinitz-Variante} Nb5 Bb4+ Bd2 Qxe4+ Be2 Kd8 O-O)
  (Bb4+@4 c3 Bc5 Be3 Bb6 Nf5) (Nxd4@10 Qxd4 Ne7@40 (d6@30 Nc3 Nf6 Bg5) (Qf6@30 e5 Qb6 Qxb6 axb6 Nc3) Nc3)
 Be3 Qf6@75 (Bb6@25 Nf5 Bxe3 Nxe3 Nf6 Nc3)
 c3 Nge7 Bc4 Ne5@55 (O-O@45 O-O) Be2 Qg6 O-O`,
"londoner":`d4 d5@45
 (e6@6 Bf4 d5 e3 Nf6 Nf3 c5 c3)
 (g6@5 Bf4 Bg7 e3 d6 Nf3 Nd7 h3)
 (f5@4 {Holländischer Aufbau} Bf4 Nf6 e3 e6 Nf3 b6 Be2)
 (Nf6@40 Bf4 g6@35 {Gegen Königsindisch-Aufbau}
   (e6@30 e3 c5@40 (d5@35 Nf3 c5 c3 Nc6 Nbd2) (b6@25 Nf3 Bb7 h3 c5 c3 Be7 Nbd2) c3 Nc6 Nd2 d5 Ngf3 Bd6 Bg3)
   (d5@35 e3 e6@55 (c5@45 c3 Nc6 Nd2) Nf3 c5 c3 Nc6 Nbd2)
   e3 Bg7 Nf3 O-O Be2 d6 h3)
 Bf4 {Londoner System}
 Nf6@55
  (c5@30 e3 Nc6@100 c3 Qb6@40 (Nf6@60 Nd2 e6 Ngf3 Bd6 Bg3) Qb3 c4 Qc2 Bf5 Qc1)
  (Bf5@15 e3 e6 Bd3 Bxd3 Qxd3 Nf6 Nf3 c5 c3)
 e3 e6@40
  (c5@30 c3 Nc6 Nd2 e6@60 (Qb6@40 Qb3 c4 Qc2) Ngf3 Bd6 Bg3 O-O Bd3)
  (Bf5@15 Bd3 Bxd3 Qxd3 e6 Nf3 c5 c3 Nc6 Nbd2)
  (g6@15 Nf3 Bg7 h3 O-O Be2 c5 c3)
 Nf3 c5@50 (Bd6@30 Bg3 O-O Bd3 c5 c3 Nc6 Nbd2) (Be7@20 Bd3 O-O O-O c5 c3)
 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3`,
"damengambit":`d4 d5 c4 {Damengambit}
 e6@40 {Abgelehntes Damengambit}
  (c6@30 {Slawische Antwort} Nf3 Nf6@75
     (e6@15 Nc3 Nf6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3)
     (dxc4@10 e3 b5 a4 e6 axb5 cxb5 b3)
   Nc3 dxc4@40 (e6@35 {Halbslawisch} e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3) (a6@15 {Tschebanenko} e3 b5 b3 Bg4 h3 Bxf3 Qxf3) (Bf5@10 cxd5 cxd5 Qb3) (g6@5 {Schlechter-Variante} e3 Bg7 Be2 O-O O-O)
   a4 Bf5@80 (Bg4@20 Ne5 Bh5 g3 e6 Bg2) e3 e6@80 (Na6@20 Bxc4 Nb4 O-O e6 Qe2) Bxc4 Bb4 O-O O-O Qe2)
  (dxc4@16 {Angenommenes Damengambit} Nf3 Nf6@75 (a6@25 e3 Nf6 Bxc4 e6 O-O c5 Qe2) e3 e6@80 (Bg4@20 Bxc4 e6 h3 Bh5 Nc3) Bxc4 c5 O-O a6 a4 Nc6 Qe2 cxd4 Rd1 Be7 exd4)
  (e5@6 {Albins Gegengambit} dxe5 d4 Nf3 Nc6 g3 Bg4@50 (Be6@50 Nbd2 Qd7 Bg2) Bg2 Qd7 O-O O-O-O Qb3)
  (Bf5@3 {Baltische Verteidigung} Nc3 e6 Nf3 c6 Qb3 Qb6 c5 Qc7 Bf4)
  (Nc6@4 {Tschigorin-Verteidigung} Nf3 Bg4 cxd5 Bxf3 gxf3 Qxd5 e3 e5 Nc3 Bb4 Bd2)
 Nc3 Nf6@70
  (c5@15 {Tarrasch-Verteidigung} cxd5 exd5@85 (cxd4@15 Qa4+ Bd7 Qxd4 exd5 Qxd5) Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O)
  (c6@15 {Halbslawisch} e3 Nf6@80 (f5@20 {Stonewall} Bd3 Nf6 Nf3) Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3)
 Bg5 Be7@75 (Bb4@8 {Manhattan-Variante} cxd5 exd5 e3 h6 Bh4) (Nbd7@17 e3 c6@55 {Cambridge Springs} (Be7@45 Nf3 O-O Rc1) Nf3 Qa5 Nd2 Bb4 Qc2 O-O Be2)
 e3 O-O Nf3 h6@50 (b6@20 cxd5 exd5 Bd3 Bb7 O-O) (Nbd7@30 Rc1 c6 Bd3 dxc4 Bxc4 Nd5 Bxe7 Qxe7 O-O)
 Bh4 b6@55 {Tartakower-Variante} (Ne4@45 {Lasker-Verteidigung} Bxe7 Qxe7 Rc1 c6 Be2 Nxc3 Rxc3 dxc4 Bxc4)
 cxd5 Nxd5 Bxe7 Qxe7 Nxd5 exd5 Rc1 Be6 Qa4`,
"englisch":`c4 e5@30 {Umgekehrtes Sizilianisch}
 (Nf6@32 Nc3 e6@35 (g6@30 g3 Bg7 Bg2 O-O Nf3 d6 O-O) (e5@20 Nf3 Nc6 g3) (c5@15 Nf3 Nc6 g3 d5 cxd5 Nxd5 Bg2)
    Nf3 d5@50 (Bb4@50 Qc2 O-O a3 Bxc3 Qxc3) d4 Be7 Bg5)
 (c5@18 {Symmetrievariante} Nc3 Nc6@70 (Nf6@30 g3 d5 cxd5 Nxd5 Bg2 Nc7 Nf3) g3 g6 Bg2 Bg7 Nf3 e6@40 (Nf6@30 O-O O-O d4) (d6@30 O-O) O-O Nge7 d3)
 (g6@10 Nc3 Bg7 g3 d6 Bg2 e5 d3 Nc6 Rb1)
 (f5@4 Nc3 Nf6 g3 g6 Bg2 Bg7 Nf3 O-O O-O d6 d4)
 (c6@4 Nf3 d5 e3 Nf6 Nc3 e6 d4)
 (e6@10 Nc3 d5@60 (Nf6@40 Nf3 d5 d4) d4 Nf6 Bg5 Be7 e3)
 Nc3 Nf6@65 (Nc6@35 g3 g6@50 (Nf6@30 Bg2 Bc5 e3 O-O Nge2) (f5@20 Bg2 Nf6 d3 Bc5 e3) Bg2 Bg7 d3 d6 Rb1)
 Nf3 Nc6@70 (e4@30 Nd4 d5 cxd5 Qxd5 e3)
 g3 d5@50 (Bb4@35 Bg2 O-O O-O e4 Ne1 Bxc3 dxc3 h6 Nc2) (Bc5@15 Bg2 d6 O-O O-O d3)
 cxd5 Nxd5 Bg2 Nb6 O-O Be7 d3 O-O a3 Be6 b4`,
"wiener":`e4 e5 Nc3 {Wiener Partie}
 Nf6@55
  (Nc6@30 Bc4 Bc5@50 (Nf6@50 d3 Bb4@40 (Bc5@60 f4 d6 Nf3) Bg5 h6 Bxf6 Bxc3+ bxc3 Qxf6 Ne2)
     Qg4 Kf8@40 (Qf6@30 Nd5 Qxf2+ Kd1 Kf8 Nh3 Qd4 d3) (g6@30 Qg3 d6 d3 Nf6 Bg5)
     Qg3 Nf6 d3 d6 Bg5)
  (Bb4@5 Nf3 Nc6 Bc4 d6 O-O)
  (Bc5@15 Nf3 d6@60 (Nc6@40 Nxe5 Nxe5 d4 Bd6 dxe5 Bxe5 Bd3) d4 exd4 Nxd4 Nf6 Bg5)
 f4 {Wiener Gambit} d5@70
  (exf4@20 e5 Ng8 Nf3 d6 d4 dxe5 dxe5 Qxd1+ Nxd1)
  (d6@10 Nf3 Nc6 Bb5 Bd7 d3)
 fxe5 Nxe4 Nf3 Be7@45 (Nc6@35 Bb5 Bc5 d4 Bb4 Bd2) (Bc5@20 d4 Bb4 Bd2)
 d4 O-O Bd3 f5@40 (Nxc3@30 bxc3 c5 O-O) (c5@30 O-O) exf6 Bxf6 O-O`,
"katalanisch":`d4 Nf6 c4 e6 g3 {Katalanisch}
 d5@60
  (Bb4+@20 {Bogo-Katalanisch} Bd2 Be7@50 (a5@25 Bg2 d5 Nf3 O-O O-O) (Qe7@25 Bg2 Nc6 Nf3 Bxd2+ Nbxd2 d6 O-O) Bg2 d5 Nf3 O-O O-O)
  (c5@12 {Benoni-Aufbau} d5 exd5 cxd5 d6 Nc3 g6 Bg2 Bg7 Nf3 O-O O-O)
  (b6@8 {Damenindischer Aufbau} Bg2 Bb7 Nf3 Bb4+ Bd2 Be7 O-O)
 Bg2 Be7@45 {Geschlossener Katalane}
  (dxc4@40 {Offener Katalane} Nf3 a6@35 (Bb4+@25 Bd2 a5 Qc2 Bxd2+ Qxd2 c6 a4) (c5@25 O-O Nc6 Qa4 Bd7 Qxc4 b5 Qd3) (Nc6@15 Qa4 Bb4+ Bd2 Nd5 Bxb4 Nxb4 O-O) O-O Nc6@50 (b5@50 Ne5 Nd5 a4 Bb7 Nc3) e3 Rb8 Qe2 b5 b3)
  (Bb4+@15 Bd2 Be7 Nf3 O-O O-O c6 Qc2 Nbd7 Bf4)
 Nf3 O-O O-O dxc4@55 (c6@25 Qc2 b6 Rd1 Ba6 b3) (Nbd7@20 Qc2 c6 Nbd2 b6 e4)
 Qc2 a6@60 (b5@15 a4 b4 Nfd2 c6 Nxc4) (c5@25 dxc5 Bxc5 Qxc4 Qe7 Nc3)
 a4 Bd7 Qxc4 Bc6 Bg5 a5 Nc3`,
"kia":`Nf3 {Königsindischer Angriff}
 d5@40
  (Nf6@35 g3 g6@45 (d5@35 Bg2 c6@40 (e6@30 O-O Be7 d3 O-O Nbd2 c5 e4) (c5@30 O-O Nc6 d3 e5 e4) O-O Bg4 d3 Nbd7 Nbd2 e5 e4) (b6@20 Bg2 Bb7 O-O e6 d3 c5 e4) Bg2 Bg7 O-O O-O d3 d6 e4 e5 Nc3)
  (c5@15 g3 Nc6@50 (g6@50 Bg2 Bg7 O-O Nc6 d3 d6 e4) Bg2 g6 O-O Bg7 d3 e6 e4 Nge7 Re1)
  (e6@10 g3 d5 Bg2 Nf6 O-O Be7 d3 O-O Nbd2 c5 e4)
 g3 Nf6@50
  (c5@25 Bg2 Nc6 O-O e6@50 (e5@50 d3 Nf6 Nbd2 Be7 e4) d3 Nf6 Nbd2 Be7 e4)
  (Bg4@15 Bg2 Nd7 O-O e5 d3 Ngf6 Nbd2 c6 e4)
  (g6@10 Bg2 Bg7 O-O e5 d3 Ne7 e4)
 Bg2 e6@35 (c6@30 O-O Bg4 d3 Nbd7 Nbd2 e5 e4) (g6@20 O-O Bg7 d3 O-O Nbd2 c5 e4) (Bf5@15 O-O e6 d3 Be7 Nbd2 O-O Qe1 h6 e4)
 O-O Be7 d3 O-O Nbd2 c5 e4 Nc6 Re1`,
"trompowsky":`d4 Nf6@75 (d5@25 {Pseudo-Trompowsky} Bg5 h6@30 (c6@35 e3 Qb6 Nd2 Qxb2 Bd3) (f6@35 Bh4 Nh6 e3) Bh4 c6 e3 Qb6 Qc1)
 Bg5 {Trompowsky}
 Ne4@40
  (e6@30 e4 h6@60 (c5@40 d5 Qb6 Nd2 Qxb2 Bd3) Bxf6 Qxf6 Nc3 d6 Qd2 g5 O-O-O)
  (d5@15 Bxf6 exf6 e3 Bd6 c4 dxc4 Bxc4 O-O Nc3)
  (c5@15 Bxf6 gxf6 d5 Qb6 Qc1 f5 c3)
 Bf4 c5@50 (d5@50 e3 c5 Bd3 Nf6 c3)
 f3 Qa5+ c3 Nf6 Nd2 cxd4 Nb3 Qb6 Qxd4`,
"najdorf":`e4 c5 {Sizilianisch}
 Nf3@72
  (Nc3@12 {Geschlossenes Sizilianisch} d6 f4@40 (g3@35 Nc6 Bg2 g6 d3 Bg7) (Nf3@25 Nf6 d4 cxd4 Nxd4 a6) Nc6 Nf3 g6 Bb5 Bd7)
  (c3@12 {Alapin-Variante} Nf6 e5@85 (d3@15 Nc6 Nf3 g6) Nd5 d4@75 (Nf3@25 Nc6 Bc4 Nb6) cxd4 Nf3@60 (cxd4@40 d6 Nf3 Nc6) Nc6 cxd4 d6)
  (d4@4 {Morra-Gambit} cxd4 c3@75 (Nf3@25 d6 Nxd4 Nf6 Nc3 a6) Nf6 e5 Nd5 cxd4 d6 Nf3 Nc6)
 d6 d4@85
  (Bb5+@15 {Moskauer Variante} Bd7 Bxd7+ Qxd7 O-O@60 (c4@40 Nc6 Nc3 g6 d4 cxd4 Nxd4 Bg7) Nc6 c3 Nf6)
 cxd4 Nxd4 Nf6 Nc3 a6 {Najdorf}
 Be3@30 {Englischer Angriff}
  (Bg5@18 {6.Lg5} e6 f4@80 (Qf3@20 Be7 O-O-O Qc7) Be7 Qf3 Qc7 O-O-O Nbd7 g4@60 (Bd3@40 b5) b5 Bxf6 Nxf6 g5 Nd7)
  (Be2@15 {Klassisch 6.Le2} e5 Nb3@80 (Nf3@20 h6 O-O Be7) Be7 O-O@60 (Be3@40 Be6) O-O)
  (Bc4@12 {Sosin-Angriff} e6 Bb3@80 (O-O@20 Be7 Bb3 O-O) b5 O-O Be7 Qf3 Qc7)
  (h3@10 {Adams-Angriff} e5 Nde2@55 (Nb3@35 Be7) (Nf5@10 Bxf5 exf5 d5) h5)
  (f3@8 e5 Nb3 Be6 Be3 Be7)
  (f4@7 e5 Nf3 Nbd7 a4 Be7 Bd3 O-O)
  (g3@5 e5 Nde2 Be7 Bg2 O-O)
  (a4@4 e5 Nf3 Be7 Bc4 O-O)
 e5 Nb3@75 (Nf3@25 Be7 Bc4 O-O O-O Be6)
 Be6 f3@75 (Qd2@25 Nbd7 f3 Be7)
 Be7 Qd2 O-O O-O-O@75 (g4@25 b5 g5 Nh5) Nbd7 g4@60 (Kb1@25 b5) (h4@15 b5) b5 g5 b4 Ne2 Ne8 f4 a5`,
"drachen":`e4 c5 {Sizilianisch}
 Nf3@72
  (Nc3@14 {Geschlossenes Sizilianisch} Nc6 g3 g6 Bg2 Bg7 d3 d6)
  (c3@14 {Alapin-Variante} Nf6 e5 Nd5 d4 cxd4 Nf3@60 (cxd4@40 d6 Nf3 Nc6) Nc6 cxd4 d6)
 d6 d4@85 (Bb5+@15 {Moskauer Variante} Bd7 Bxd7+ Qxd7 O-O Nc6 c3 Nf6)
 cxd4 Nxd4 Nf6 Nc3 g6 {Drachen}
 Be3@55
  (Be2@20 {Klassische Variante} Bg7 O-O@60 (Be3@40 Nc6 O-O O-O) O-O Be3 Nc6 Nb3 Be6 f4 Qc8)
  (Bc4@15 Bg7)
  (g3@5 {Fianchetto-Variante} Nc6 Nde2 Bg7 Bg2 O-O O-O Rb8)
  (f4@10 {Levenfish-Variante} Nc6 Nxc6 bxc6 e5 Nd7)
 Bg7 f3@80 (Be2@20 Nc6 O-O O-O)
 O-O Qd2 Nc6 {Jugoslawischer Angriff}
 Bc4@40 {9.Lc4} (O-O-O@45 {9.O-O-O} d5 exd5 Nxd5 Nxc6 bxc6 Bd4@60 (Nxd5@40 cxd5 Qxd5 Qc7) e5 Bc5 Be6) (g4@15 Be6)
 Bd7 O-O-O Rc8 Bb3 Ne5 Kb1@50 (h4@50 h5) Re8`,
"franzoesisch":`e4 e6 {Französisch}
 d4@85 (Nf3@7 d5 Nc3 Nf6 e5 Nfd7 d4 c5) (d3@8 {Königsindischer Angriff} d5 Nd2 Nf6 Ngf3 c5 g3 Nc6 Bg2 Be7 O-O O-O)
 d5
 Nc3@45 {Klassisch 3.Sc3}
  (e5@25 {Vorstoßvariante} c5 c3@85 (Nf3@15 cxd4 Bd3 Nc6 O-O f6) Nc6 Nf3 Qb6 a3@35 (Bd3@25 cxd4 cxd4 Bd7) (Be2@25 cxd4 cxd4 Nh6) (Na3@15 cxd4 cxd4 Bxa3 bxa3 Nge7) c4 Nbd2 Bd7)
  (exd5@15 {Abtauschvariante} exd5 Nf3@40 (Bd3@35 Nc6 c3 Bd6 Nf3 Nge7) (c4@25 Nf6 Nc3 Bb4) Nf6 Bd3 Bd6 O-O O-O)
  (Nd2@15 {Tarrasch-Variante} c5 exd5@65 (Ngf3@35 cxd4 exd5 Qxd5) Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6 Nb3 Nc6)
 Bb4 {Winawer-Variante} e5@75 (exd5@12 exd5 Bd3 Ne7) (a3@5 Bxc3+ bxc3 dxe4 Qg4 Nf6 Qxg7 Rg8 Qh6 c5) (Ne2@8 dxe4 a3 Be7 Nxe4 Nf6)
 c5 a3@80 (Bd2@20 Ne7 a3 Bxc3 Bxc3 Nbc6)
 Bxc3+ bxc3 Ne7 Qg4@50 (Nf3@35 Nbc6 Bd3 Qa5) (a4@15 Nbc6 Nf3 Qa5 Bd2 Bd7) O-O Bd3 Nbc6 Qh5 Ng6 Nf3 Qc7 Be3 c4 Bxg6 fxg6`,
"carokann":`e4 c6 {Caro-Kann}
 d4@75 (c4@6 d5 exd5 cxd5 cxd5 Nf6) (d3@4 d5 Nd2 e5 Ngf3 Bd6) (Nc3@15 {Zweispringervariante} d5 Nf3@70 (d4@30 dxe4 Nxe4 Bf5) Bg4 h3 Bxf3 Qxf3 e6)
 d5
 Nc3@40 {Klassische Variante}
  (Nd2@10 dxe4 Nxe4 Bf5 Ng3 Bg6)
  (f3@5 {Fantasie-Variante} e6 Nc3 Bb4)
  (e5@28 {Vorstoßvariante} Bf5 Nf3@50 (h4@25 h5 c4 e6 Nc3 Ne7) (Nc3@25 e6 g4 Bg6 Nge2 c5) e6 Be2 c5 O-O Nc6 c3 cxd4 cxd4 Nge7)
  (exd5@22 {Abtauschvariante} cxd5 Bd3@55 (c4@45 {Panow-Angriff} Nf6 Nc3 e6 Nf3 Bb4) Nc6 c3 Nf6 Bf4 Bg4 Qb3 Qd7 Nd2 e6)
 dxe4 Nxe4 Bf5 Ng3 Bg6 h4@70 (Nf3@30 Nd7 h4 h6)
 h6 Nf3@70 (h5@30 Bh7 Nf3 Nd7)
 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6 Bd2@60 (Bf4@40 Ngf6 O-O-O Be7) Ngf6 O-O-O Be7 Kb1 O-O`,
"skandinavisch":`e4 d5 {Skandinavisch}
 exd5@85 (e5@6 Bf5 d4 e6) (Nc3@3 d4 Nce2 e5) (d4@4 {Blackmar-Diemer-Gambit} dxe4 Nc3 Nf6 f3 exf3 Nxf3 Bf5) (Nf3@2 dxe4 Ng5 Nf6)
 Qxd5 Nc3@70
  (Nf3@15 Bg4 Be2 Nc6 d4 O-O-O)
  (d4@15 Nf6 Nf3 Bg4 Be2 e6 O-O Nc6)
 Qa5 d4@60 (Nf3@40 Nf6 d4 c6 Bc4 Bf5)
 Nf6 Nf3@70 (Bc4@15 c6 Nf3 Bf5 Bd2 e6) (Bd2@15 c6 Bc4 Bf5)
 c6 Bc4@70 (Bd2@30 Bf5 Bc4 e6)
 Bf5 Bd2 e6 Qe2@40 (Nd5@30 Qd8 Nxf6+ Qxf6) (O-O@30 Nbd7) Bb4`,
"koenigsindisch":`d4 Nf6
 c4@72 (Nf3@22 g6 g3@40 {Fianchetto-Variante} (c4@40 Bg7 Nc3 O-O e4 d6) (Bf4@20 Bg7 e3 d6) Bg7 Bg2 O-O O-O d6 c4 Nbd7 Nc3 e5) (Bf4@6 g6 e3 Bg7)
 g6 Nc3@75 (Nf3@15 Bg7 g3 O-O Bg2 d6 O-O Nbd7 Nc3 e5) (g3@10 Bg7 Bg2 O-O Nf3 d6)
 Bg7 e4 d6 {Königsindisch}
 Nf3@50 {Klassische Variante}
  (f3@20 {Sämisch-Variante} O-O Be3 e5 d5@55 (Nge2@45 c6 Qd2 Nbd7) Nh5 Qd2 f5)
  (f4@10 {Vierbauernangriff} O-O Nf3 c5 d5 e6 Be2 exd5 cxd5 Bg4)
  (Be2@15 {Awerbach-Variante} O-O Bg5 Na6 Qd2 e5 d5 c6)
  (h3@5 O-O Be3 e5 d5 a5)
 O-O Be2@75 (h3@15 e5 d5 a5) (Be3@10 e5 d5 Ng4 Bg5 f6 Bh4 Na6)
 e5 O-O@60 (d5@17 {Petrosjan-System} a5) (dxe5@10 {Abtausch} dxe5 Qxd8 Rxd8) (Be3@13 {Gligoric-System} Ng4 Bg5 f6 Bh4 Nc6)
 Nc6 d5@85 (Be3@15 Ng4 Bg5 f6 Bh4 g5 Bg3 Nh6)
 Ne7 Ne1@40 (b4@35 {Bajonett-Angriff} Nh5 Re1 f5) (Nd2@25 a5 a3 Nd7) Nd7 f3 f5`,
"nimzo":`d4 Nf6 c4@78 (Nf3@22 e6 c4@60 (g3@20 b6 Bg2 Bb7) (Bf4@20 c5 e3 Nc6) b6 g3 Ba6 b3 Bb4+ Bd2 Be7)
 e6 Nc3@60
  (Nf3@30 {Damenindisch} b6 g3@60 (a3@20 Bb7 Nc3 d5) (e3@20 Bb7 Bd3 Bb4+) Ba6 b3 Bb4+ Bd2 Be7)
  (g3@10 {Katalanisch} d5 Bg2 Be7 Nf3 O-O)
 Bb4 {Nimzo-Indisch}
 Qc2@35 {Klassische Variante}
  (e3@33 {Rubinstein-Variante} O-O Bd3@70 (Ne2@30 d5 a3 Be7 cxd5 exd5 g3 c6) d5 Nf3 c5 O-O Nc6 a3 Bxc3 bxc3 dxc4 Bxc4 Qc7)
  (a3@10 {Sämisch-Variante} Bxc3+ bxc3 c5 e3@60 (f3@40 d5 cxd5 exd5 e3 O-O) Nc6 Bd3 O-O)
  (f3@10 {Kmoch-Variante} d5 a3@70 (cxd5@30 exd5 Bg5 h6 Bh4 c5) Bxc3+ bxc3 c5)
  (Bg5@7 {Leningrader Variante} h6 Bh4 c5 d5 d6)
  (Nf3@5 O-O Bg5 c5)
  (g3@4 c5 Nf3 cxd4 Nxd4 O-O Bg2 d5)
  (Bd2@3 O-O a3 Bxc3 Bxc3 d6)
 O-O a3@75 (Nf3@25 d5 a3 Bxc3+ Qxc3 dxc4)
 Bxc3+ Qxc3 b6 Bg5@50 (Nf3@30 Bb7 e3 d6) (f3@20 d5 cxd5 exd5)
 Bb7 f3@50 (Nf3@30 d6) (e3@20 d6) h6 Bh4 d5`,
"slawisch":`d4 d5 c4@88 (Nf3@12 Nf6 c4 c6)
 c6 {Slawisch}
 Nf3@50
  (Nc3@30 Nf6 e3@50 {Meraner System} (Nf3@50 dxc4 a4 Bf5 e3 e6) e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 Bb7)
  (cxd5@15 {Abtauschvariante} cxd5 Nc3@60 (Bf4@40 Nc6 e3 Nf6 Nf3 Bf5) Nf6 Bf4@70 (Nf3@30 Nc6 Bf4 Bf5) Nc6 e3 Bf5)
  (e3@5 Bf5 Nc3 e6 Nf3 Nd7)
 Nf6 Nc3@55 (Qc2@8 dxc4 Qxc4 Bf5) (g3@5 Bf5 Bg2 e6) (e3@22 Bf5 Nc3 e6 Nh4 Bg6 Nxg6 hxg6) (cxd5@15 cxd5 Nc3 Nc6)
 dxc4 a4@80 (e3@10 b5 a4 b4) (e4@10 b5 e5 Nd5)
 Bf5 e3@60 (Ne5@40 Nbd7 Nxc4 Qc7 g3 e5)
 e6 Bxc4 Bb4 O-O O-O Qe2 Nbd7 e4@60 (Nh4@40 Bg6 Nxg6 hxg6) Bg6 Bd3 Bh5`,
"hollaendisch":`d4 f5 {Holländisch}
 g3@35 {Leningrader System}
  (c4@25 Nf6 g3@60 (Nc3@40 g6 Nf3 Bg7 g3 O-O) g6 Bg2 Bg7 Nf3@60 (Nc3@40 O-O Nh3 d6) O-O O-O d6)
  (Nf3@15 Nf6 g3 g6 Bg2 Bg7 O-O O-O c4 d6)
  (Bg5@13 Nf6 Bxf6@70 (Nd2@30 d5 Bxf6 exf6 e3 c6) exf6 e3 d5 c4 c6)
  (Nc3@7 d5 Bf4 Nf6 e3 e6)
  (e4@12 {Staunton-Gambit} fxe4 Nc3 Nf6 Bg5@70 (f3@30 d5 fxe4 dxe4 Bg5 Bf5) g6 f3 exf3 Nxf3 Bg7)
 Nf6 Bg2 g6 Nf3@60 (c4@40 Bg7 Nc3@60 (Nf3@40 O-O O-O d6 Nc3 Qe8) O-O Nh3@50 (Nf3@50 d6 O-O Qe8) d6)
 Bg7 O-O O-O c4 d6 Nc3 Qe8 d5@50 (Re1@25 Qf7) (b3@25 a5) a5`,
"aljechin":`e4 Nf6 {Aljechin-Verteidigung}
 e5@85 (Nc3@15 d5 exd5@60 (e5@40 Nfd7 d4 e6) Nxd5 Bc4 Nb6 Bb3 c5)
 Nd5 d4@80 (c4@10 Nb6 c5 Nd5 Bc4 e6 Nc3 Nxc3 dxc3 Nc6) (Nc3@10 Nxc3 dxc3 d6)
 d6 Nf3@55 {Moderne Variante}
  (c4@35 Nb6 exd6@55 {Abtauschvariante} (f4@45 {Vierbauernangriff} dxe5 fxe5 Nc6 Be3 Bf5 Nc3 e6 Nf3 Be7) cxd6 Nc3 g6 Be3 Bg7 Rc1 O-O b3 Nc6)
  (exd6@10 exd6 Nf3 Be7)
 Bg4 Be2@75 (h3@25 Bxf3 Qxf3 dxe5 dxe5 e6)
 e6 O-O Be7 h3 Bh5 c4 Nb6 Nc3@60 (exd6@40 cxd6) O-O`,
"gruenfeld":`d4 Nf6 c4@80 (Nf3@20 g6 c4@50 (g3@50 Bg7 Bg2 d5 O-O O-O) Bg7 Nc3 d5)
 g6 Nc3@80 (Nf3@15 Bg7) (g3@5 Bg7 Bg2 d5)
 d5 {Grünfeld-Indisch}
 cxd5@45 {Abtauschvariante}
  (Nf3@25 Bg7 Qb3@50 {Russisches System} (Bf4@25 O-O e3 c5) (e3@25 O-O Be2 c5) dxc4 Qxc4 O-O e4 Bg4 Be3 Nfd7)
  (Bf4@20 {4.Lf4} Bg7 e3 c5 dxc5 Qa5 Rc1 dxc4 Bxc4 O-O)
  (Bg5@10 Ne4 Bh4 Nxc3 bxc3 dxc4)
  (Qb3@5 dxc4 Qxc4 Bg7 e4 O-O)
  (e3@5 Bg7 Nf3 O-O)
 Nxd5 e4 Nxc3 bxc3 Bg7 Nf3@50 (Bc4@50 c5 Ne2 Nc6 Be3 O-O)
 c5 Be3@50 (Rb1@50 O-O Be2 cxd4 cxd4 Qa5+)
 Qa5 Qd2 O-O Rc1 cxd4 cxd4 Qxd2+ Kxd2 e6`,
"pirc":`e4 d6 d4@85 (Nc3@15 Nf6 d4 g6)
 Nf6 Nc3@80 (Bd3@10 g6 Nf3 Bg7 O-O O-O) (f3@10 e5 d5 Be7)
 g6 {Pirc-Verteidigung}
 f4@25 {Österreichischer Angriff}
  (Be3@25 {150-Angriff} Bg7 Qd2@70 (f3@30 c6 Qd2 b5) c6 f3 b5)
  (Nf3@30 {Klassisches System} Bg7 Be2@70 (h3@30 O-O Be3 a6) O-O O-O c6 a4 a5)
  (Bg5@10 Bg7 Qd2 h6 Bh4 c6)
  (Be2@10 Bg7 h4 c5)
  (f3@5 c6 Be3 Qb6)
  (h3@5 Bg7 Be3 a6)
 Bg7 Nf3 O-O Bd3@60 (Be2@40 c5 dxc5 Qa5) Na6 O-O c5 d5 Rb8`,
"petrow":`e4 e5 Nf3@80 (Nc3@10 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7) (Bc4@10 Nf6 d3 c6 Nf3 d5 Bb3 Bd6)
 Nf6 {Russisch (Petrow)}
 Nxe5@55
  (d4@20 {Steinitz-Variante} Nxe4 Bd3@70 (dxe5@30 d5 Nbd2 Nxd2 Bxd2 Be7) d5 Nxe5 Nd7 Nxd7 Bxd7 O-O Bd6)
  (Nc3@20 {Vierspringerspiel} Nc6 Bb5@50 (d4@50 exd4 Nxd4 Bb4 Nxc6 bxc6 Bd3 d5) Nd4 Ba4@60 (Nxd4@40 exd4 e5 dxc3 exf6 Qxf6) Bc5 Nxe5 O-O Nd3 Bb6)
  (Bc4@5 Nxe4 Nc3 Nxc3 dxc3 f6)
 d6 Nf3@85 (Nxf7@10 {Cochrane-Gambit} Kxf7 d4 c5) (Nc4@5 Nxe4)
 Nxe4 d4@45 {Klassisch 5.d4} (Nc3@30 {5.Sc3} Nxc3 dxc3 Be7) (c4@15 {Kaufmann-Variante} Nc6 Nc3 Nxc3 dxc3 Be7) (Qe2@10 Qe7 d3 Nf6)
 d5 Bd3 Nc6 O-O Be7 c4 Nb4 Be2@60 (cxd5@40 Nxd3 Qxd3 Qxd5) O-O Nc3 Bf5`,
"sweschnikow":`e4 c5 {Sizilianisch}
 Nf3@72
  (Nc3@12 {Geschlossenes Sizilianisch} Nc6 g3 g6 Bg2 Bg7 d3 d6)
  (c3@12 {Alapin-Variante} Nf6 e5 Nd5 d4 cxd4 Nf3@60 (cxd4@40 Nc6 Nf3 d6) Nc6 cxd4 d6)
  (d4@4 {Morra-Gambit} cxd4 c3 Nf6 e5 Nd5 cxd4 Nc6)
 Nc6 d4@70
  (Bb5@25 {Rossolimo-Variante} e6 O-O@75 (Bxc6@25 bxc6 d3 Ne7) Nge7 Re1 a6 Bf1 d5)
  (Nc3@5 Nf6 d4 cxd4 Nxd4 e5)
 cxd4 Nxd4 Nf6 Nc3@90 (Nxc6@10 bxc6 e5 Nd5 c4 Nb6)
 e5 {Sweschnikow-Variante} Ndb5@90 (Nf3@5 Bb4 Bc4 O-O) (Nb3@5 Bb4 Bd3 d5)
 d6 Bg5@65 (Nd5@35 {7.Sd5} Nxd5 exd5 Nb8 c4 Be7 Be2 O-O O-O f5)
 a6 Na3 b5 Bxf6@60 (Nd5@40 Be7 Bxf6 Bxf6 c3 O-O Nc2 Bg5)
 gxf6 Nd5@80 (Bd3@20 Ne7 Nd5 Nxd5 exd5 Bg7)
 f5 Bd3@60 (exf5@20 Bxf5 c3 Bg7) (c3@20 Bg7 exf5 Bxf5)
 Be6 O-O Bxd5 exd5 Ne7`,
"taimanow":`e4 c5 {Sizilianisch}
 Nf3@72
  (Nc3@12 {Geschlossenes Sizilianisch} e6 g3@50 (f4@50 d5 Nf3 Nf6 e5 Nfd7) d5 d3 Nc6 Bg2 Nf6)
  (c3@12 {Alapin-Variante} d5 exd5 Qxd5 d4 Nf6 Nf3 e6)
  (d4@4 {Morra-Gambit} cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6)
 e6 d4@75 (c3@15 Nf6 e5 Nd5 d4 cxd4 cxd4 d6) (Nc3@10 Nc6 d4 cxd4 Nxd4 Qc7)
 cxd4 Nxd4 Nc6 {Taimanow-Variante}
 Nc3@60
  (Nb5@20 d6 c4 Nf6 N1c3 a6 Na3 Be7 Be2 O-O)
  (Be2@10 Qc7 O-O a6 Kh1 Nf6)
  (Nxc6@10 bxc6 Bd3 d5 O-O Nf6)
 Qc7 Be3@50
  (Be2@25 a6 O-O Nf6 Kh1 Bb4)
  (g3@25 a6 Bg2 Nf6 O-O Nxd4 Qxd4 Bc5)
 a6 Qd2@60 (Bd3@25 Nf6 O-O Ne5 h3 Bc5) (Be2@15 Nf6 O-O Bb4)
 Nf6 O-O-O Bb4 f3 Ne5 Nb3 b5`,
"halbslawisch":`d4 d5 c4@85 (Nf3@15 Nf6 c4 c6 Nc3 e6)
 c6 Nf3@55
  (Nc3@30 Nf6 e3@50 (Nf3@50 e6) e6 Nf3 Nbd7)
  (cxd5@10 {Abtauschvariante} cxd5 Nc3 Nf6 Bf4 Nc6)
  (e3@5 Nf6 Nc3 e6)
 Nf6 Nc3@75 (e3@25 e6 Nbd2@40 (Bd3@60 dxc4 Bxc4 c5) c5)
 e6 {Halbslawisch}
 e3@45 {Meraner System}
  (Bg5@35 {Moskauer Variante} h6 Bxf6@50 (Bh4@50 {Anti-Moskauer Gambit} dxc4 e4 g5 Bg3 b5) Qxf6 e3 Nd7 Bd3 dxc4 Bxc4 g6)
  (Qb3@10 dxc4 Qxc4 b5 Qd3 a6)
  (cxd5@10 exd5 Bg5 Be7 e3 Bf5)
 Nbd7 Bd3@60 (Qc2@40 {Anti-Meraner} Bd6 Bd3@60 (b3@40 O-O Be2 b6) O-O O-O dxc4 Bxc4 b5)
 dxc4 Bxc4 b5 Bd3 Bb7 O-O@60 (e4@40 b4 Na4 c5 e5 Nd5) a6 e4 c5 d5 c4`,
"benoni":`d4 Nf6 c4@80 (Nf3@20 c5 d5@50 (c3@25 cxd4 cxd4 d5) (e3@25 g6 c4 Bg7) e6 c4 exd5 cxd5 d6 Nc3 g6)
 c5 d5@85 (Nf3@10 cxd4 Nxd4 e5 Nb5 d5) (e3@5 g6 Nc3 Bg7)
 e6 Nc3@85 (Nf3@15 exd5 cxd5 d6 Nc3 g6)
 exd5 cxd5 d6 {Moderne Benoni}
 e4@60
  (Nf3@30 g6 g3@55 {Fianchetto-Variante} (Bf4@45 Bg7 e3 O-O Nd2 Nh5) Bg7 Bg2 O-O O-O Re8 Bf4 a6)
  (Bf4@10 g6 e4 Bg7 Nf3 O-O Be2 Bg4)
 g6 Nf3@50
  (f4@30 {Vierbauernangriff} Bg7 Bb5+ Nfd7 a4 O-O Nf3 Na6 O-O Nb4)
  (Bd3@20 Bg7 Nge2 O-O O-O a6 a4 Qc7)
 Bg7 Be2@70 (h3@30 O-O Bd3 b5)
 O-O O-O Re8 Nd2 Na6`,
"koenigsgambit":`e4 e5 f4 {Königsgambit}
 exf4@60 {Angenommenes Königsgambit}
  (d5@15 {Falkbeer-Gegengambit} exd5 exf4@60 (e4@40 d3 Nf6 dxe4 Nxe4 Nf3 Bc5 Qe2) Nf3 Nf6 Bb5+ c6 dxc6 Nxc6 d4)
  (Bc5@15 {Abgelehnt mit 2…Lc5} Nf3 d6 c3 Nf6@60 (Bg4@40 fxe5 dxe5 Qa4+) d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2)
  (d6@6 Nf3 exf4@60 (Nc6@40 Bc4) d4)
  (Nf6@5 fxe5 Nxe4 Nf3 d5 d4)
  (Nc6@4 Nf3 exf4 d4)
 Nf3 g5@35
  (d6@25 {Fischer-Verteidigung} d4 g5@70 (Nf6@30 Nc3) h4 g4 Ng1)
  (d5@20 {Moderne Verteidigung} exd5 Nf6@70 (Qxd5@30 Nc3 Qa5 d4) Nc3 Nxd5 Nxd5 Qxd5 d4)
  (Nf6@20 {Schallopp-Verteidigung} e5 Nh5 Qe2 Be7 d4)
 h4 g4 Ne5 {Kieseritzky-Gambit} Nf6@50 (d6@25 Nxg4 Nf6 Nxf6+ Qxf6 Nc3) (h5@25 Bc4 Rh7 d4)
 Bc4 d5 exd5 Bd6 d4`,
"evans":`e4 e5 Nf3 Nc6 Bc4 Bc5 b4 {Evans-Gambit}
 Bxb4@75 (Bb6@25 {Abgelehntes Evans-Gambit} a4 a6@60 (a5@40 b5 Nd4 Nxd4 Bxd4 c3 Bb6 d4) Nc3 Nf6 Nd5)
 c3 Ba5@60 (Be7@25 d4 Na5 Be2 exd4 Qxd4) (Bc5@15 d4 exd4 O-O d6 cxd4 Bb6 Nc3)
 d4 exd4@50 (d6@50 {Lasker-Verteidigung} Qb3 Qd7 dxe5)
 O-O Nge7@30 (d6@45 cxd4 Bb6 Nc3) (Bb6@25 cxd4 d6 Nc3)
 cxd4 d5 exd5 Nxd5 Ba3`,
"friedliver":`e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 {Zweispringerspiel, 4.Sg5}
 d5@82 (Bc5@12 {Traxler-Gegenangriff} Bxf7+ Ke7 Bb3 Rf8 O-O d6 c3) (Nxe4@6 Nxe4 d5 Bxd5 Qxd5 Nbc3)
 exd5 Nxd5@25 {Fegatello}
  (Na5@55 {5…Sa5} Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5 Bd6@55 (Bc5@25 c3) (Qc7@20 d4) d4 exd3 Nxd3 Qc7 h3 O-O O-O)
  (Nd4@10 {Fritz-Variante} c3 b5 Bf1 Nxd5 cxd4)
  (b5@10 {Ulvestad-Variante} Bf1 Nd4@65 (h6@35 Nxf7 Kxf7 dxc6) c3 Nxd5 cxd4)
 Nxf7 Kxf7 Qf3+ Ke6@85 (Kg8@15 Bxd5+ Qxd5@50 (Be6@50 Bxe6#) Qxd5+)
 Nc3 Nb4@65 (Ne7@35 d4 c6 Bg5 h6 Bxe7 Bxe7 O-O-O)
 a3 Nxc2+ Kd1 Nxa1 Nxd5`,
"daenisch":`e4 e5 d4 exd4 c3 {Nordisches Gambit}
 dxc3@55 (d3@10 Bxd3 Nc6 Nf3 d6 O-O) (Qe7@5 cxd4 Qxe4+ Be2) (d5@30 {Abgelehnt mit 3…d5} exd5 Qxd5@75 (Nf6@25 Bb5+ c6 dxc6 bxc6 Bc4) cxd4 Nc6 Nf3 Bg4 Be2 Bb4+ Nc3)
 Bc4 cxb2@60 (Nf6@25 Nxc3 Nc6 Nf3 d6 Qb3) (Nc6@15 Nxc3 Bb4 Nf3 d6 O-O)
 Bxb2 d5@70 (Bb4+@30 Nc3 Nf6 Ne2) Bxd5 Nf6 Bxf7+ Kxf7 Qxd8 Bb4+ Qd2 Bxd2+ Nxd2`,
"bird":`f4 {Bird-Eröffnung}
 d5@45
  (Nf6@30 Nf3 g6@50 (d5@50 e3 g6 b3) e3 Bg7 Be2 O-O O-O d6 d3)
  (e5@15 {From-Gambit} fxe5 d6@80 (Nc6@20 Nf3 d6 exd6 Bxd6 d4) exd6 Bxd6 Nf3 g5@70 (Nf6@30 g3) d4 g4 Ne5 Bxe5 dxe5 Qxd1+ Kxd1)
  (g6@10 Nf3 Bg7 e3 Nf6 Be2 O-O O-O d6 d3)
  (c5@5 Nf3 Nc6 e3 g6 Bb5 Bg7 O-O)
 Nf3 Nf6@60 (g6@20 e3 Bg7 Be2 Nf6 O-O) (c5@20 e3 Nc6 Bb5)
 e3 g6@40 (Bg4@30 Be2) (c5@30 b3)
 b3 Bg7 Bb2 O-O Be2 c5 O-O Nc6 Qe1`,
"morra":`e4 c5 d4 cxd4 c3 {Smith-Morra-Gambit}
 dxc3@65
  (Nf6@15 e5 Nd5 Nf3 Nc6 cxd4 d6 Bc4 Nb6 Bb5)
  (d3@10 Bxd3 Nc6 Nf3 g6 c4 Bg7 h3)
  (d5@10 exd5 Qxd5 cxd4 Nc6 Nf3 Bg4 Nc3 Qa5 Be2)
 Nxc3 Nc6@60
  (d6@25 Bc4 Nf6@50 (e6@50 Nf3 Nf6 O-O) e5 dxe5 Bxf7+ Kxf7 Qxd8)
  (e6@15 Nf3 a6@50 (d6@50 Bc4 Nf6 O-O) Bc4 b5 Bb3 Bb7 O-O)
 Nf3 d6@55
  (e6@30 Bc4 a6@50 (Nge7@50 O-O Ng6 Be3 Be7 h4) O-O Nge7 Bg5 f6 Be3 b5 Bb3)
  (Nf6@15 e5 Ng4 h3 Ngxe5 Nxe5 Nxe5 Bf4)
 Bc4 e6@50
  (Nf6@30 e5 dxe5 Qxd8+ Nxd8 Nb5)
  (a6@20 O-O Nf6 Qe2 Bg4 Rd1)
 O-O Nf6@50 (a6@30 Qe2 Nge7 Rd1 b5 Bb3) (Be7@20 Qe2 Nf6 Rd1 e5 h3)
 Qe2 Be7 Rd1 e5 h3 O-O Be3`,
"englund":`d4 e5 {Englund-Gambit}
 dxe5@80 (Nf3@15 e4 Nfd2 d5 e3 Nf6) (e4@5 exd4 Qxd4 Nc6 Qe3 Nf6)
 Nc6 Nf3@75 (Bf4@15 Qe7 Nf3 Qb4+ Bd2 Qxb2 Nc3 Bb4) (e4@10 Nxe5 f4 Nc6)
 Qe7 Bf4@40 {Die Falle}
  (Qd5@25 f6 exf6 Nxf6 Qb3 d5)
  (Nc3@25 Nxe5 e4 Nf6)
  (Bg5@10 f6 exf6 Nxf6 Nc3 d5)
 Qb4+ Bd2@75 (c3@25 Qxb2 Nbd2 Qxc3)
 Qxb2 Bc3@60 {Mattfalle} (Nc3@40 Bb4 Rb1 Qa3 Rb3 Qa5)
 Bb4 Qd2@70 (Bxb4@30 Nxb4)
 Bxc3 Qxc3 Qc1#`,
"budapester":`d4 Nf6 c4 e5 {Budapester Gambit}
 dxe5@88 (d5@12 Bc5 Nc3 d6 e4 O-O)
 Ng4 Bf4@40 {Rubinstein-Variante}
  (Nf3@35 {4.Sf3} Bc5 e3 Nc6 Be2@60 (Nc3@40 O-O Be2 Re8) Ngxe5 Nxe5 Nxe5 O-O O-O)
  (e4@20 {Aljechin-Variante} Nxe5 f4@70 (Nf3@30 Nxf3+ Qxf3 Bc5) Nec6 Be3 Bb4+ Nc3 Qe7)
  (e3@5 Nxe5 Nf3 Nbc6)
 Nc6 Nf3 Bb4+ Nbd2@70 (Nc3@30 Qe7 Qd5 Bxc3+ bxc3 f6)
 Qe7 a3 Ngxe5 Nxe5@60 (axb4@40 {Die Falle} Nd3#)
 Nxe5 e3 Bxd2+ Qxd2 d6`,
"albin":`d4 d5 c4 e5 {Albins Gegengambit}
 dxe5@85 (Nc3@10 exd4 Qxd4 Nc6 Qxd5 Be6) (e3@5 exd4 exd4 Nf6 Nc3 Be7)
 d4 Nf3@70
  (e3@15 {Lasker-Falle} Bb4+ Bd2 dxe3 Bxb4@70 (fxe3@30 Qh4+ g3 Qe4) exf2+ Ke2 fxg1=N+ Rxg1@70 (Ke1@30 Qh4+ g3 Qe4+) Bg4+)
  (e4@10 Nc6 f4 Bb4+)
  (a3@5 Nc6 Nf3 Be6)
 Nc6 g3@50 (Nbd2@35 Bg4 h3 Bxf3 Nxf3 Bc5) (a3@15 Be6 Nbd2 Qd7)
 Bg4
 Bg2 Qd7 O-O O-O-O`,
"jaenisch":`e4 e5 Nf3 Nc6 Bb5 f5 {Jänisch-Gambit}
 Nc3@45 {Hauptvariante 4.Sc3}
  (d3@30 {Ruhig mit 4.d3} fxe4 dxe4 Nf6 O-O Bc5 Nc3 d6)
  (exf5@15 e4 Qe2 Qe7 Bxc6 dxc6 Nd4 Qe5)
  (d4@10 fxe4 Nxe5 Nxe5 dxe5 c6)
  (Qe2@5 fxe4 Qxe4 Nf6)
  (Bxc6@5 dxc6 Nc3 Nf6)
 fxe4 Nxe4 d5 Nxe5@70 (Ng3@30 e4 Nh4 Nf6)
 dxe4 Nxc6 Qg5 Qe2 Nf6`,
"stafford":`e4 e5 Nf3 Nf6 Nxe5 Nc6 {Stafford-Gambit}
 Nxc6@85 (Nf3@15 Nxe4)
 dxc6 d3@35
  (Nc3@35 Bc5 Be2 h5 d3 Ng4 Bxg4 hxg4)
  (e5@20 Ne4 d3 Bc5 dxe4@50 (Be3@50 Bxe3 fxe3 Qh4+) Bxf2+ Ke2 Bg4+)
  (f3@10 Nh5 g3 f5)
  (Qe2@5 Qe7)
  (d4@5 Nxe4 Bd3 Qh4)
 Bc5 Be2@75 (Bg5@25 {Mattfalle} Nxe4 Bxd8 Bxf2+ Ke2 Bg4#)
 h5 Nc3 Ng4`,
"benko":`d4 Nf6 c4 c5 {Wolga-Gambit}
 d5@88 (Nf3@12 cxd4 Nxd4 e6)
 b5 cxb5@55 {Angenommen}
  (Nf3@30 {Abgelehnt mit 4.Sf3} bxc4 Nc3 d6 e4 g6)
  (Qc2@15 bxc4 e4 d6 Bxc4 g6)
  (a4@8 bxc4 Nc3 d6 e4 g6)
 a6 bxa6@45 (b6@20 {5.b6} e6 Nc3 Nxd5 Nxd5 exd5 Qxd5 Nc6) (e3@20 g6 Nc3 Bg7 a4 O-O) (Nc3@15 axb5 e4 b4 Nb5 d6)
 g6 Nc3 Bxa6 e4@60 {Kf1-Variante} (g3@40 d6 Bg2 Bg7 Nf3 Nbd7)
 Bxf1 Kxf1 d6 g3 Bg7 Kg2 O-O`,
"offen_siz_w":`e4 c5 Nf3 {Offenes Sizilianisch}
 d6@45
  (Nc6@28 d4 cxd4 Nxd4 Nf6@55
     (g6@22 {Beschleunigter Drachen} c4 Bg7 Be3 Nf6 Nc3 O-O Be2 d6 O-O)
     (e6@15 {Taimanow über 2…Sc6} Nc3 Qc7 Be3 a6 Qd2 Nf6 O-O-O)
     (Qb6@8 Nb3 Nf6 Nc3 e6 Be3 Qc7 f4)
   Nc3 e5@55 {Sweschnikow}
     (d6@30 {Klassisches Sizilianisch} Bg5 e6@70 (Bd7@30 Qd2 Rc8 O-O-O Nxd4 Qxd4 Qa5 f4) Qd2 a6 O-O-O Bd7 f4)
     (e6@15 Ndb5 d6 Bf4 e5 Bg5 a6 Na3 b5 Nd5)
   Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6 Nd5 f5@70 (Bg7@30 Bd3 Ne7 Nxe7 Qxe7 O-O) Bd3)
  (e6@22 d4 cxd4 Nxd4 Nc6@40 {Taimanow}
     (a6@35 {Kan} Bd3 Nf6@50 (Bc5@25 Nb3 Ba7 Qe2 Nc6 Be3) (Qc7@25 O-O Nf6 Qe2 d6 c4) O-O Qc7 Qe2 d6 c4)
     (Nf6@25 {Sizilianisch Vierspringer} Nc3 Nc6@60 (Bb4@40 {Pin-Variante} e5 Nd5 Bd2 Nxc3 bxc3 Be7 Qg4) Nxc6 bxc6 e5 Nd5 Ne4 Qc7 f4 Qb6 c4)
   Nc3 Qc7 Be3 a6 Qd2 Nf6 O-O-O Bb4@60 (b5@40 f3 Ne5 Kb1) f3 Ne5 Nb3 b5 Qe1)
  (g6@3 {Hyperbeschleunigter Drachen} d4 cxd4 Qxd4 Nf6 e5 Nc6 Qa4 Nd5 Qe4)
  (a6@2 {O'Kelly-Variante} c3 d5 exd5 Qxd5 d4 Nf6 Be2)
 d4 cxd4 Nxd4 Nf6 Nc3
 a6@45 {Najdorf}
  (g6@20 {Drachen} Be3 Bg7 f3 O-O@65 (Nc6@35 Qd2 O-O O-O-O) Qd2 Nc6 O-O-O d5@50 (Nxd4@25 Bxd4 Be6 Kb1 Qc7 h4) (Bd7@25 Bc4 Rc8 Bb3) exd5 Nxd5 Nxc6 bxc6 Bd4)
  (Nc6@20 {Klassisches Sizilianisch} Bg5 e6@70 (Bd7@30 Qd2 Rc8 O-O-O Nxd4 Qxd4 Qa5 f4) Qd2 a6@60 (Be7@40 O-O-O O-O f4 Nxd4 Qxd4 Qa5 Bc4) O-O-O Bd7 f4 b5 Bxf6 gxf6 Kb1)
  (e6@12 {Scheveninger} Be3 a6@45 (Nc6@30 f3 Be7 Qd2 O-O O-O-O) (Be7@25 f3 O-O Qd2 Nc6 O-O-O) f3 b5 Qd2 Nbd7 g4)
  (e5@3 Bb5+ Bd7 Bxd7+ Qxd7 Nf3 Nc6 O-O)
 Be3 e5@55 (e6@30 f3 b5@50 (Be7@25 Qd2 O-O O-O-O) (Nbd7@25 Qd2 b5 g4) Qd2 Nbd7 g4 h6 O-O-O Bb7 h4) (Ng4@15 Bg5 h6 Bh4 g5 Bg3 Bg7 h3 Ne5 Nf5)
 Nb3 Be6 f3 Be7@70 (h5@30 Qd2 Nbd7 Nd5 Bxd5 exd5 g6 Be2)
 Qd2 O-O O-O-O Nbd7@60 (Qc7@20 g4 Rc8 Kb1 b5 g5 Nh5 Nd5) (b5@20 g4 b4 Nd5 Bxd5 exd5)
 g4 b5 g5 b4 Ne2 Ne8 f4 a5 f5`,
"gegen_franz_w":`e4 e6 d4 d5 Nc3
 Nf6@35 {Klassisch}
  (Bb4@40 {Winawer} e5 c5@75 (Ne7@12 a3 Bxc3+ bxc3 c5 Qg4) (b6@8 a3 Bf8 Nf3 Ne7 h4) (Qd7@5 a3 Bxc3+ bxc3 b6 Qg4)
     a3 Bxc3+@85 (Ba5@15 b4 cxb4 Nb5 bxa3+ c3 Bc7 Bxa3)
     bxc3 Ne7@75 (Qc7@15 Qg4 f5 Qg3 Ne7 Qxg7) (Qa5@10 Bd2 Qa4 Qg4)
     Qg4 O-O@45 (Qc7@40 {Vergifteter Bauer} Qxg7 Rg8 Qxh7 cxd4 Ne2 Nbc6 f4) (Kf8@15 Nf3)
     Bd3 Nbc6@70 (f5@30 exf6 Rxf6 Bg5 Rf7 Qh5) Qh5 Ng6 Nf3 Qc7 Be3 c4 Bxg6 fxg6 Qg4)
  (dxe4@20 {Rubinstein} Nxe4 Nd7@65 (Bd7@20 {Fort-Knox} Nf3 Bc6 Bd3 Nd7 O-O Ngf6 Ng3) (Nf6@15 Nxf6+ Qxf6@50 (gxf6@50 Nf3 b6 g3 Bb7 Bg2) Nf3 h6 Bd3)
     Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5@70 (b6@30 Qe2 Bb7 Bg5 Be7 O-O-O) dxc5 Bxc5 O-O)
  (Nc6@3 Nf3 Nf6 e5 Nd7 Be3 f6 exf6)
  (c5@2 exd5 exd5 Nf3 Nc6 Bb5 Bd6 dxc5 Bxc5 O-O)
 Bg5 Be7@55
  (Bb4@25 {McCutcheon} e5 h6 Bd2 Bxc3@85 (Nfd7@15 Qg4 g6 a3 Bf8 Nf3) bxc3 Ne4 Qg4 g6@60 (Kf8@40 h4 c5 Rh3) Bd3 Nxd2 Kxd2 c5 h4)
  (dxe4@20 {Burn-Variante} Nxe4 Be7@60 (Nbd7@40 Nf3 Be7 Nxf6+ Bxf6 h4) Bxf6 Bxf6 Nf3 Nd7@50 (O-O@50 Qd2 Nd7 O-O-O) Qd2 O-O O-O-O)
 e5 Nfd7@85 (Ne4@15 Nxe4 Bxg5 Nxg5 Qxg5 g3)
 Bxe7 Qxe7 f4 O-O@50 (a6@30 Nf3 c5 Qd2 Nc6 dxc5 Qxc5 Qf2) (c5@20 Nf3 Nc6 dxc5 O-O Bd3 Nxc5 O-O)
 Nf3 c5 dxc5 Nc6@60 (Nxc5@40 Bd3 f6 exf6 Qxf6 O-O) Qd2 Nxc5 O-O-O`,
"gegen_caro_w":`e4 c6 d4 d5
 e5 {Vorstoßvariante}
 (Nc3 {Klassisch} dxe4@92 (g6@4 e5 Bg7 f4 h5 Nf3) (b5@4 a3 e6 Nf3 Nf6 Bd3) Nxe4
   Bf5@55
   (Nd7@30 {Karpow-Variante} Bc4 Ngf6 Ng5 e6 Qe2 Nb6 Bd3 h6 N5f3 c5@60 (a5@40 a4 c5 c3) dxc5 Bxc5 Ne5)
   (Nf6@15 Nxf6+ exf6@55 (gxf6@45 c3 Bf5 Nf3 e6 g3) c3 Bd6 Bd3 O-O Qc2 Re8+ Ne2)
   Ng3 Bg6 h4 h6@85 (h5@15 Nh3 e6 Nf4 Bh7 Bc4) Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6@70 (Ngf6@30 Bf4 e6 O-O-O) Bf4 Ngf6@60 (Qa5+@40 Bd2 Qc7 O-O-O) O-O-O Be7 Kb1 O-O Ne4)
 (exd5 {Panow-Angriff} cxd5 c4 Nf6@80 (e6@10 Nc3 Nf6 Nf3 Bb4 cxd5 exd5 Bd3) (dxc4@10 Bxc4 Nf6 Nf3 e6 O-O)
   Nc3 Nc6@40 (e6@35 Nf3 Bb4@60 (Be7@40 cxd5 Nxd5 Bd3 Nc6 O-O) cxd5 Nxd5 Qc2 Nc6 Bd3) (g6@25 cxd5 Nxd5@60 (Bg7@40 Bc4 O-O Nge2 Nbd7 O-O) Qb3 Nb6 d5 Bg7 Be3)
   Nf3 Bg4@55 (e6@25 c5 Be7 Bb5 O-O O-O) (Be6@20 c5 g6 Bb5 Bg7 Ne5)
   cxd5 Nxd5 Qb3 Bxf3@60 (Nb6@40 d5 Bxf3 gxf3 Nd4 Bb5+) gxf3 e6@65 (Nb6@35 Be3 e6 O-O-O) Qxb7 Nxd4 Bb5+ Nxb5 Qc6+ Ke7 Qxb5)
  Bf5@80 (c5@15 {Botwinnik-Carls} dxc5 e6@60 (Nc6@40 Nf3 Bg4 Bb5) Nf3 Bxc5 Bd3 Nc6 O-O) (Bg4@5 Nf3 e6 Be2 c5 c3)
  Nf3 e6@85 (c5@10 Be2 e6 O-O Nc6 c3) (Nd7@5 Be2 e6 O-O Ne7 Nbd2)
  Be2 c5@45 (Nd7@35 O-O Ne7@65 (h6@35 Nbd2 Ne7 Nb3) Nbd2 h6 Nb3) (Ne7@20 O-O c5@50 (h6@50 Nbd2 Nd7 Nb3) c3 Nec6 Be3)
  Be3 Qb6@40 (Nd7@30 O-O Ne7 c3 Nc6 Nbd2) (cxd4@30 Nxd4 Ne7 c4 Nbc6 Nc3)
  Nc3 Nc6@80 (Qxb2@20 {Vergifteter Bauer} Nb5 Na6 O-O)
  O-O`,
"gegen_skandi_w":`e4 d5 exd5
 Qxd5@65
  (Nf6@35 d4 Nxd5@65 (Bg4@25 {Portugiesisch} f3 Bf5 Bb5+ Nbd7 c4 e6 dxe6 fxe6 Nc3) (g6@10 c4 Bg7 Nc3 O-O Nf3)
     Nf3 g6@40 (Bg4@35 Be2 e6 O-O Nc6 c4 Nb6 Nc3) (Bf5@25 Bd3 Bxd3 Qxd3 e6 O-O Be7 c4 Nf6 Nc3)
     Be2 Bg7 O-O O-O c4 Nb6 Nc3 Nc6@55 (Bg4@45 c5 N6d7 h3 Bxf3 Bxf3) d5 Ne5 Nxe5 Bxe5 Bh6)
 Nc3 Qa5@45
  (Qd6@35 d4 Nf6@75 (c6@25 Nf3 Bf5 Ne5 Nd7 Nc4) Nf3 a6@45 (c6@30 Ne5 Bf5 Bc4 e6 O-O) (g6@25 Nb5 Qb6 c4 Bg7 c5)
     Be2 Nc6@60 (Bg4@40 O-O Nc6 h3 Bh5 Be3) O-O Bg4@50 (Bf5@50 Be3 e6 Nh4) Be3 O-O-O h3)
  (Qd8@15 d4 Nf6 Nf3 Bg4@45 (c6@30 Bc4 Bf5 Ne5 e6 g4) (g6@25 Bc4 Bg7 O-O O-O h3) h3 Bxf3 Qxf3 c6 Be3 e6 Bd3)
  (Qe5+@3 Be2 c6 d4 Qa5 Nf3)
  (Qe6+@2 Be2 Qg6 Nf3 Qxg2 Rg1 Qh3 Rg3)
 d4 Nf6@75 (c6@15 Nf3 Bf5@60 (Bg4@40 h3 Bh5 g4 Bg6 Ne5) Bc4 e6 Bd2 Nf6 Qe2) (e5@10 dxe5 Qxe5+ Be2 Bb4 Nf3 Qe7 O-O)
 Nf3 c6@50 (Bf5@25 Bd2 c6 Bc4 e6 Qe2 Bb4 O-O-O) (Bg4@25 h3 Bh5 g4 Bg6 Ne5 e6 Bd2)
 Bc4 Bf5@65 (Bg4@35 h3 Bh5 g4 Bg6 Ne5 e6 h4)
 Bd2 e6 Qe2 Bb4@60 (Nbd7@40 d5 cxd5 Nxd5 Qd8 Nxf6+ Nxf6 O-O-O)
 O-O-O Nbd7@60 (O-O@40 a3 Bxc3 Bxc3 Qc7 Ne5)
 a3 Bxc3 Bxc3 Qc7 d5`,
"gegen_ki_w":`d4 Nf6 c4 g6 Nc3
 Bg7@80 (d5@20 {Grünfeld} cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Nf3 c5 Be3)
 e4 d6@95 (O-O@5 e5 Ne8 f4 d6 Nf3)
 Nf3 O-O@85 (c5@8 d5 O-O Be2 e6 O-O exd5 cxd5) (Bg4@7 Be2 Nfd7 Be3 c5 d5)
 Be2 e5@65 (c5@15 d5 e6 O-O exd5 cxd5 Re8 Nd2) (Na6@10 O-O e5 Be3 Ng4 Bg5 Qe8 dxe5) (Bg4@10 Be3 Nfd7 Rc1 c5 d5)
 O-O Nc6@60 (Nbd7@20 Be3 c6 d5 c5 Ne1) (exd4@10 Nxd4 Re8 f3 c6 Kh1) (Na6@10 Be3 Ng4 Bg5 Qe8 dxe5 dxe5 h3)
 d5 Ne7 b4 Nh5@60 (a5@40 bxa5 Rxa5 a4 c5 Ra3)
 Re1 f5@55 (a5@25 bxa5 f5 Nd2) (Nf4@20 Bf1 a5 bxa5)
 Ng5 Nf6 Bf3`,
"vierspringer":`e4 e5 Nf3 Nc6 Nc3
 Nf6@75
  (Bc5@10 Nxe5 Nxe5@80 (Bxf2+@20 Kxf2 Nxe5 d4 Ng6 Bc4) d4 Bd6@70 (Bxd4@30 Qxd4 Qf6 Nb5 Kd8 Qc5) dxe5 Bxe5 Bd3)
  (g6@8 d4 exd4 Nd5 Bg7 Bg5 Nce7 Nxd4)
  (Bb4@7 Nd5 Nf6@60 (Ba5@40 Bc4 d6 c3) Nxb4 Nxb4 Nxe5 Qe7 d4)
 Bb5 Bb4@40
  (Nd4@40 {Rubinstein} Ba4 Bc5@60 (c6@40 Nxe5 d6 Nf3 Bg4 d3) Nxe5 O-O Nd3 Bb6 e5 Ne8 Nd5 d6 Ne3)
  (Bc5@8 O-O O-O Nxe5 Nxe5 d4 Bd6 f4)
  (a6@7 Bxc6 dxc6 Nxe5 Nxe4 Nxe4 Qd4 O-O)
  (d6@5 d4 Bd7 O-O Be7 Re1)
 O-O O-O d3 d6@70 (Bxc3@30 bxc3 d6 Re1 Qe7 Bg5)
 Bg5 Bxc3@60 (Ne7@40 Nh4 c6 Bc4 d5 Bb3)
 bxc3 Qe7@55 {Metger-Variante} (h6@45 Bh4 Bd7 Rb1)
 Re1 Nd8 d4 Ne6 Bc1`,
"reti":`Nf3 d5@40
 (Nf6@35 c4 g6@40 (e6@30 g3 d5@50 (b6@25 Bg2 Bb7 O-O Be7 Nc3) (c5@25 Bg2 Nc6 O-O Be7 Nc3) Bg2 Be7 O-O O-O b3) (c5@20 Nc3 Nc6@60 (d5@40 cxd5 Nxd5 e4 Nb4 Bc4) g3 g6 Bg2 Bg7 O-O) (e5@10 Nc3 Nc6 g3 d5 cxd5 Nxd5 Bg2)
   g3 Bg7 Bg2 O-O O-O d6@60 (d5@40 cxd5 Nxd5 d4 c5 dxc5) Nc3 e5@60 (Nc6@40 d4 a6 d5 Na5 Nd2) d3 Nc6 Rb1)
 (c5@12 c4 Nc6@60 (g6@40 Nc3 Bg7 g3 Nc6 Bg2) Nc3 g6 g3 Bg7 Bg2 Nf6 O-O)
 (e6@5 c4 Nf6 g3 d5 Bg2 Be7 O-O)
 (g6@5 c4 Bg7 Nc3 c5 g3 Nc6 Bg2)
 (f5@3 {Holländisch-Aufbau} d3 Nf6 e4 fxe4 dxe4 e5 Bc4)
 c4 e6@35
  (d4@20 e3 Nc6@60 (c5@40 exd4 cxd4 g3 Nc6 Bg2) exd4 Nxd4 Nxd4 Qxd4 Nc3 c6@50 (e5@50 d3 Bb4 Be2) d3 Nf6 Be3 Qd8 Be2)
  (dxc4@15 e3 Nf6@60 (c5@25 Bxc4 Nc6 O-O Nf6 Qe2) (e5@15 Bxc4 e4 Nd4 Nf6 Nc3) Bxc4 e6 O-O c5 b3 Nc6 Bb2)
  (c6@20 b3 Nf6@60 (Bf5@25 g3 Nf6 Bg2 e6 O-O) (Bg4@15 Bb2 Nd7 g3 Ngf6 Bg2) g3 Bf5@50 (Bg4@50 Bg2 e6 O-O Nbd7 Bb2) Bg2 e6 O-O Nbd7 Bb2)
  (Nf6@10 cxd5 Nxd5 g3 g6 Bg2 Bg7 O-O)
 g3 Nf6 Bg2 Be7 O-O O-O b3 c5@45 (b6@25 Bb2 Bb7 e3 c5 Nc3) (d4@15 e3 c5 exd4 cxd4 d3) (c6@15 Bb2 Nbd7 d3 b6 Nbd2)
 Bb2 Nc6 e3`,
"colle":`d4 d5@55
 (Nf6@45 Nf3 e6@40 (g6@35 e3 Bg7 Bd3 O-O O-O d6 Nbd2 Nbd7 e4) (d5@15 e3 e6 Bd3 c5 b3) (c5@10 c3 e6 e3 d5 Bd3)
   e3 c5@40 (d5@30 Bd3 c5 b3 Nc6 O-O Bd6 Bb2 O-O Nbd2) (b6@30 Bd3 Bb7 O-O c5 Nbd2 Be7 c3)
   Bd3 d5 b3 Nc6 O-O Bd6 Bb2 O-O Nbd2 b6 a3)
 Nf3 Nf6@70 (c5@15 e3 Nc6 Bb5 e6 O-O Bd6 c4) (Bf5@10 e3 e6 Bd3 Bxd3 Qxd3 Nf6 O-O) (Bg4@5 Ne5 Bf5 c4 e6 Nc3)
 e3 e6@40 (Bg4@20 c4 e6@60 (c6@40 Nc3 e6 h3 Bh5 Qb3) Qb3 Qc8 Nc3 c6 Ne5) (Bf5@20 Bd3 e6@60 (Bxd3@40 cxd3 e6 O-O Be7 Nc3) Bxf5 exf5 Qd3 Qc8 b3) (g6@10 Bd3 Bg7 O-O O-O Nbd2 c5 c3) (c5@10 c3 e6 Bd3 Nc6 Nbd2 Bd6 O-O)
 Bd3 c5@60 (Bd6@20 O-O O-O c4 c6 Nc3 dxc4 Bxc4) (Be7@20 O-O O-O Nbd2 c5 c3 Nc6 dxc5 Bxc5 e4)
 c3 Nc6 Nbd2 Bd6@60 (Be7@40 O-O O-O dxc5 Bxc5 e4)
 O-O O-O dxc5 Bxc5 e4 Qc7@50 (dxe4@50 Nxe4 Nxe4 Bxe4 Qxd1 Rxd1) Qe2 Bd7 e5`,
"jobava":`d4 d5@55
 (Nf6@45 Nc3 g6@35 (d5@40 Bf4 e6 e3 Bd6 Nb5 Bxf4 exf4) (e6@15 e4 d5 e5 Nfd7 f4) (c5@10 d5 d6 e4 g6 Nf3)
   Bf4 Bg7 e3 d6@60 (O-O@40 h4 d6 h5 Nxh5 Bh2) h4 h5@50 (c5@30 h5 Nxh5 Bh2) (O-O@20 h5 Nxh5 Bh2) Nf3 O-O Be2)
 Nc3 Nf6@70 (c5@10 e4 dxe4 dxc5 Qxd1+ Nxd1) (Bf5@10 Bf4 e6 e3 Nf6 Nb5 Na6 a3) (e6@10 e4 Nf6 e5 Nfd7 f4)
 Bf4 e6@35 (c5@30 e3 cxd4@50 (a6@25 Nf3 Nc6 Ne5) (Nc6@25 Nb5 e5 dxe5) exd4 a6 Nf3 Nc6 Ne5) (Bf5@20 e3 e6 Nb5 Na6 a3) (a6@15 e3 e6 Nf3 c5 Ne5)
 e3 Bd6@55 (Bb4@25 Bd3 c5 Ne2 Nc6 a3) (c5@20 Nb5 Na6 Nf3 Be7 c3)
 Nb5 Bxf4@70 (Bb4+@30 c3 Ba5 a4 a6 Na3)
 exf4 a6@50 (O-O@30 Bd3 c5 c3 Nc6 Nf3) (Nc6@20 Nf3 O-O c3)
 Nc3 c5 Nf3 Nc6 Be2`,
"gegen_holl_w":`d4 f5 g3 Nf6@85 (g6@8 Bg2 Bg7 Nf3 Nf6 O-O O-O c4 d6 Nc3) (e6@7 Bg2 Nf6 Nf3 d5 O-O Bd6 c4 c6 b3)
 Bg2 g6@45 {Leningrader System}
  (e6@50 Nf3 d5@40 {Stonewall}
     (Be7@45 {Klassisch} O-O O-O c4 d6@60 (d5@40 b3 c6 Bb2 Qe8 Nbd2) Nc3 Qe8 b3 a5@50 (Qh5@50 Ba3 Nc6 e3) Ba3)
     (d6@15 O-O Be7 c4 O-O Nc3 Qe8 Re1)
   O-O Bd6@60 (Be7@40 c4 O-O b3 c6 Bb2 Qe8 Ne5) c4 c6 b3 Qe7@60 (O-O@40 Bb2 Qe7 Ne5) Bb2 O-O Ne5 b6@50 (Nbd7@50 Nd3 b6 Nd2) Nd2)
  (d6@5 Nf3 g6 O-O Bg7 c4 O-O Nc3)
 Nf3 Bg7 O-O O-O c4 d6 Nc3 Qe8@45 (c6@30 d5 e5 dxe6 Bxe6 b3) (Nc6@25 d5 Ne5 Nxe5 dxe5 Qb3 h6 c5)
 d5 a5@50 (Na6@30 Rb1 c5 dxc6 bxc6 b4) (Qf7@20 Qb3 Na6 Bf4)
 Be3 Na6 Qb3`,
"e5_schwarz":`e4 e5
 Nf3@75
  (Nc3@8 {Wiener Partie} Nf6 f4@45 (Bc4@30 Nxe4 Qh5 Nd6 Bb3 Nc6 Nb5 g6 Qf3 f5) (g3@15 d5 exd5 Nxd5 Bg2 Nxc3 bxc3 Bd6) (Nf3@10 Nc6 d4 exd4 Nxd4 Bb4)
     d5 fxe5 Nxe4 Nf3@70 (Qf3@30 Nc6 Bb5 Nxc3 bxc3 Qh4+) Be7 d4 O-O Bd3 f5)
  (f4@4 {Königsgambit} exf4 Nf3@80 (Bc4@20 Nf6 Nc3 c6 Bb3 d5) d6 d4@70 (Bc4@30 h6 d4 g5 O-O Bg7) g5 h4@80 (Nc3@20 Bg7 h4 h6) g4 Ng1 f3 gxf3@70 (Nc3@30 fxg2 Bxg2 Be7) Be7)
  (Bc4@5 {Läuferspiel} Nf6 d3@60 (Nf3@25 Nxe4 Nc3 Nxc3 dxc3 f6) (Nc3@15 Bb4 Nf3 d6) c6 Nf3 d5 Bb3 Bd6)
  (d4@4 {Mittelgambit} exd4 Qxd4@60 (c3@40 {Nordisches Gambit} d5 exd5 Qxd5 cxd4 Nc6 Nf3 Bg4) Nc6 Qe3 Nf6 Nc3 Bb4 Bd2 O-O O-O-O Re8)
  (Qh5@4 {Damenausflug} Nc6 Bc4 g6 Qf3 Nf6 Ne2 Bg7 Nbc3 d6)
 Nc6
 Bc4@35 {Italienisch}
  (Bb5@30 {Spanisch} a6 Ba4@85 (Bxc6@15 {Abtauschvariante} dxc6 O-O f6 d4 Bg4)
     Nf6 O-O Be7 Re1@80 (d3@10 b5 Bb3 d6 a4 Bd7) (Qe2@10 b5 Bb3 O-O c3 d5)
     b5 Bb3 d6 c3 O-O h3@85 (d4@15 Bg4 d5 Na5 Bc2 c6)
     Na5 Bc2 c5 d4@85 (d3@15 Nc6 Nbd2 Re8) Qc7 Nbd2 cxd4 cxd4 Nc6)
  (d4@20 exd4 Nxd4@70 {Schottisch}
     (Bc4@20 {Schottisches Gambit} Nf6 e5@60 (O-O@40 Nxe4 Re1 d5 Bxd5 Qxd5 Nc3 Qa5) d5 Bb5 Ne4 Nxd4 Bd7 Bxc6 bxc6 O-O Bc5)
     (c3@10 {Göring-Gambit} d5 exd5 Qxd5 cxd4 Bg4 Be2 Bb4+ Nc3 Bxf3)
   Nf6 Nxc6@75 (Nc3@25 Bb4 Nxc6 bxc6 Bd3 d5 exd5 cxd5 O-O O-O Bg5 c6)
   bxc6 e5 Qe7 Qe2 Nd5 c4 Nb6 Nc3@40 (Nd2@35 Qe6 b3 a5) (b3@25 a5 Bb2 a4) Qe6 Qe4 Bb4 Bd2 O-O)
  (Nc3@10 {Vierspringerspiel} Nf6 Bb5@45 (d4@40 exd4 Nxd4 Bb4 Nxc6 bxc6 Bd3 d5) (g3@15 d5 exd5 Nxd5 Bg2 Nxc3 bxc3 Bd6)
     Nd4 Ba4@50 (Nxd4@30 exd4 e5 dxc3 exf6 Qxf6) (O-O@20 Nxb5 Nxb5 c6) Bc5 Nxe5 O-O)
  (c3@5 {Ponziani} Nf6 d4 Nxe4 d5 Ne7 Nxe5 Ng6)
 Bc5 c3@45 (O-O@25 Nf6 d3 d6 c3 O-O) (d3@15 Nf6 c3 d6 O-O O-O) (b4@8 {Evans-Gambit} Bxb4 c3 Ba5 d4 d6) (Nc3@7 Nf6 d3 d6)
 Nf6 d3@75 (d4@25 exd4 cxd4@60 (e5@40 d5 Bb5 Ne4 cxd4 Bb4+) Bb4+ Bd2 Bxd2+ Nbxd2 d5)
 d6 O-O a6 a4@60 (Bb3@25 Ba7 Nbd2 O-O) (Re1@15 Ba7 h3 O-O) Ba7`,
"beschl_drachen":`e4 c5 Nf3@75
 (Nc3@10 {Geschlossenes Sizilianisch} Nc6 g3@50 (f4@30 g6 Nf3 Bg7 Bb5 Nd4) (Nge2@20 g6 d4 cxd4 Nxd4 Bg7) g6 Bg2 Bg7 d3 d6 f4 e6)
 (c3@10 {Alapin-Variante} Nf6 e5 Nd5 d4 cxd4 Nf3@60 (cxd4@40 Nc6 Nf3 d6 Bc4 Nb6) Nc6 cxd4 d6 Bc4 Nb6 Bb5 dxe5)
 (d4@5 {Morra-Gambit} cxd4 c3 Nf6 e5 Nd5 cxd4 Nc6)
 Nc6 d4@60
  (Bb5@30 {Rossolimo} g6 O-O@50 (Bxc6@40 dxc6 d3 Bg7 h3 Nf6 Nc3 O-O) (c3@10 Nf6 e5 Nd5 O-O Bg7) Bg7 Re1 Nf6 e5 Nd5 Nc3 Nc7 Bxc6 dxc6 Ne4 b6)
  (Nc3@10 g6 d4 cxd4 Nxd4 Bg7 Be3 Nf6)
 cxd4 Nxd4 g6
 c4@40 {Maróczy-Aufbau}
  (Nc3@40 {Klassisch 5.Sc3} Bg7 Be3@75 (Nb3@25 Nf6 Be2 O-O O-O d6) Nf6 Bc4@70 (Be2@30 O-O O-O d5 exd5 Nb4) O-O Bb3 a5 f3@50 (a4@30 Ng4 Qxg4 Nxd4) (O-O@20 d6 h3 Bd7) d5)
  (Nxc6@15 bxc6 Qd4@60 (Bd3@40 Bg7 O-O Nf6 c4 O-O) Nf6 e5 Nd5 e6 f6 exd7+ Bxd7)
  (Be2@5 Bg7 Be3 Nf6 Nc3 O-O)
 Bg7 Be3@70 (Nc2@30 d6 Be2 Nh6 O-O O-O)
 Nf6 Nc3@90 (Nxc6@10 bxc6 Nc3 O-O Be2 d6)
 O-O Be2 d6 O-O Bd7 Qd2@60 (Rc1@40 Nxd4 Bxd4 Bc6)
 Nxd4 Bxd4 Bc6 f3 a5`,
"dg_abgelehnt":`d4 d5 c4@75 (Nf3@15 Nf6 c4 e6 Nc3 Be7) (Bf4@10 {Londoner System} Nf6 e3 e6 Nf3 c5 c3 Nc6)
 e6 Nc3@65 (Nf3@30 Nf6 g3@40 {Katalanisch} (Nc3@60 Be7) Be7 Bg2 O-O O-O dxc4 Qc2 a6 a4 Bd7) (cxd5@5 exd5 Nc3 c6)
 Nf6 Bg5@45
  (Nf3@35 Be7 Bf4@40 (Bg5@60 O-O e3 h6 Bh4 b6) O-O e3 c5 dxc5 Bxc5 a3 Nc6 Qc2 Qa5)
  (cxd5@20 {Abtauschvariante} exd5 Bg5 c6 e3 Be7 Bd3 Nbd7 Qc2 O-O Nge2@50 (Nf3@50 Re8 O-O Nf8) Re8 O-O Nf8)
 Be7 e3@75 (Nf3@25 O-O e3 h6 Bh4 b6)
 O-O Nf3@85 (Rc1@15 h6 Bh4 b6 cxd5 Nxd5)
 h6 Bh4@85 (Bxf6@15 Bxf6 Rc1 c6 Bd3 Nd7 O-O dxc4)
 b6 {Tartakower-Verteidigung} cxd5@45 (Be2@30 Bb7 Bxf6 Bxf6 cxd5 exd5 b4 c5) (Rc1@15 Bb7 Be2 dxc4 Bxc4 Nbd7) (Bd3@10 Bb7 O-O Nbd7 Qe2 c5)
 Nxd5 Bxe7 Qxe7 Nxd5 exd5 Rc1 Be6 Qa4 c5 Qa3 Rc8`,
"modern":`e4 g6 d4@85 (Nc3@10 Bg7 d4 d6) (Nf3@5 Bg7 d4 d6)
 Bg7 Nc3@60
  (c4@15 {Awerbach-Aufbau} d6 Nc3@70 (Nf3@30 Bg4 Be2 Nc6 Be3 e5) Nc6 Be3 e5 d5 Nd4 Nge2 c5)
  (Nf3@20 d6 c3@40 (Bc4@30 Nf6 Qe2 O-O O-O Bg4) (Be2@30 Nf6 Nc3 O-O O-O Bg4) Nf6 Bd3 O-O O-O Nc6)
  (c3@5 d6 f4 Nf6 Bd3 O-O)
 d6 Be3@35 {150-Angriff}
  (Nf3@30 {Klassisch} a6 Be2@60 (a4@40 b6 Bc4 e6) b5 O-O Bb7 a4 b4 Nd5 e6)
  (f4@20 {Pseudo-Österreichisch} Nc6 Be3 Nf6 Nf3 O-O Be2 e5)
  (Bc4@10 Nf6 Qe2 O-O e5 Nfd7)
  (Be2@5 Nc6 d5 Ne5 f4 Nd7)
 a6 Qd2 Nd7 f3@60 (O-O-O@20 b5 h4 h5) (Nf3@20 b5 Bd3 Bb7)
 b5 h4@50 (Nh3@25 Bb7 Nf2 c5) (O-O-O@25 Bb7 h4 h5)
 h5 Nh3 Bb7`,
"philidor":`e4 e5 Nf3 d6 d4@75 (Bc4@20 Be7 d4@60 (c3@20 Nf6 d3 O-O O-O c6) (Nc3@20 Nf6 d3 O-O O-O c6) exd4 Nxd4 Nf6 Nc3 O-O O-O a6) (Nc3@5 Nf6 d4 Nbd7)
 Nf6 Nc3@50
  (dxe5@35 Nxe4 Nbd2@40 (Qd5@40 Nc5 Bg5 Be7 exd6 Qxd6) (Bd3@20 Nc5 O-O Nxd3 Qxd3 Be7) Nxd2 Bxd2 Be7 Bd3 Nc6 O-O O-O)
  (Bc4@15 exd4 Nxd4 Be7 O-O O-O Nc3 Re8)
 Nbd7 {Hanham-Aufbau} Bc4@70 (Be2@20 Be7 O-O O-O a4 c6) (g4@10 h6 h3 Be7 Be3 c6)
 Be7 O-O@80 (dxe5@15 Nxe5 Nxe5 dxe5 Qxd8+ Bxd8) (Ng5@5 O-O Bxf7+ Rxf7 Ne6 Qe8 Nxc7 Qd8 Nxa8 b6)
 O-O Re1@50 (a4@35 c6 Re1 b6 Ba2 a6) (Qe2@15 c6 a4 Qc7 h3 b6)
 c6 a4 b6 Ba2@50 (d5@50 c5 b3 Ne8) a6 h3 Bb7`,
"damenindisch":`d4 Nf6 c4@80 (Nf3@20 e6 c4 b6)
 e6 Nf3@45 (Nc3@45 {Nimzo-Indisch} Bb4) (g3@10 d5 Bg2 Be7 Nf3 O-O)
 b6 g3@40 {Fianchetto-Variante}
  (a3@25 {Petrosjan-System} Bb7 Nc3 d5 cxd5 Nxd5 Qc2@70 (e3@30 Be7 Bb5+ c6 Bd3 O-O) Nd7 Nxd5 exd5 Bg5 f6 Bf4 c5)
  (Nc3@20 Bb4 Bg5@60 (Qc2@40 Bb7 a3 Bxc3+ Qxc3 Ne4) Bb7 e3 h6 Bh4 g5 Bg3 Ne4 Qc2 Bxc3+ bxc3 d6)
  (e3@15 Bb7 Bd3 d5 O-O Bd6 Nc3 O-O b3 Nbd7 Bb2 a6)
 Ba6 b3@65 (Qa4@15 c5 Bg2 Bb7 dxc5 bxc5 O-O Be7) (Qc2@10 Bb7 Bg2 c5 d5 exd5 cxd5 Nxd5 O-O Nc6) (Nbd2@10 Bb7 Bg2 c5 e4 cxd4 O-O Be7)
 Bb4+ Bd2 Be7 Bg2 c6 Bc3@70 (O-O@30 d5 Ne5 Nfd7 Nxd7 Nxd7 Nc3 O-O)
 d5 Ne5@65 (Nbd2@35 Nbd7 O-O O-O Re1 c5)
 Nfd7 Nxd7 Nxd7 Nd2 O-O O-O Rc8`,
"blackmar":`d4 d5 e4 dxe4@70 (e6@15 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3) (c6@10 Nc3 dxe4 f3 exf3 Nxf3 Nf6 Bd3) (e5@5 dxe5 dxe4 Qxd8+ Kxd8 Nc3)
 Nc3 Nf6@75 (e5@10 dxe5 Qxd1+ Nxd1 Nc6 Bf4) (Bf5@10 f3 Nf6 fxe4 Nxe4 Nxe4 Bxe4 Nf3) (c6@5 f3 exf3 Nxf3 Nf6 Bd3)
 f3 {Blackmar-Diemer-Gambit} exf3@60 (e3@20 {Ziegler-Variante} Bxe3 Bf5 Nge2 e6 Ng3 Bg6 h4) (e5@10 dxe5 Qxd1+ Kxd1 Nfd7 Nxe4) (Bf5@10 fxe4 Nxe4 Nxe4 Bxe4 Nf3)
 Nxf3 e6@30 {Euwe-Verteidigung}
  (g6@25 {Bogoljubow-Verteidigung} Bc4 Bg7 O-O O-O Qe1 Nc6 Qh4)
  (Bg4@20 {Teichmann-Verteidigung} h3 Bxf3 Qxf3 c6 Be3 e6 Bd3 Nbd7 O-O)
  (Bf5@15 {Gunderam-Verteidigung} Ne5 e6 g4 Bg6 h4 Bb4 h5 Be4 Rh3)
  (c6@10 {Ziegler-Verteidigung} Bc4 Bf5 O-O e6 Ne5)
 Bg5 Be7 Bd3 c5@45 (O-O@30 O-O Nbd7 Qe1 c5 Rd1) (h6@25 Bh4 O-O Qe2 c5 Rd1)
 O-O cxd4 Ne4 Nbd7 Nxf6+ Nxf6 Ne5`,
"halloween":`e4 e5 Nf3 Nc6 Nc3 Nf6 Nxe5 {Halloween-Gambit}
 Nxe5@80 (Bb4@10 Nxc6 dxc6 Bd3 O-O O-O) (Nxe4@10 Nxe4 Nxe5 d4 Ng6 Bd3)
 d4 Ng6@50
  (Nc6@40 d5 Ne5@60 (Bb4@40 dxc6 Nxe4 Qd4 Qe7 Be3) f4 Ng6 e5 Ng8 d6)
  (Neg4@10 e5 Ng8 h3 N4h6 Bc4)
 e5 Ng8 Bc4 d5 Bxd5 N8e7 Bb3 c6@50 (Nf5@50 Qf3 c6 O-O) Qf3`,
"lettisch":`e4 e5 Nf3 f5 {Lettisches Gambit}
 Nxe5@50
  (Bc4@25 fxe4 Nxe5 d5 Qh5+ g6 Nxg6 Nf6 Qe5+ Be7 Bb5+ c6 Nxe7 Qxe7 Qxe7+ Kxe7)
  (d4@10 fxe4 Nxe5 Nf6 Bg5@50 (Bc4@30 d5 Bb3 Be6) (Be2@20 d6 Nc4 Be7) d6 Nc4 Be7)
  (exf5@10 e4 Ne5 Nf6 Be2 d6 Bh5+ Ke7)
  (Nc3@5 fxe4 Nxe4 d5 Ng3 e4 Nd4 Nf6)
 Qf6
 d4@55 (Nc4@45 fxe4 Nc3 Qg6 d3 Bb4 dxe4 Qxe4+ Ne3 Nf6)
 d6 Nc4 fxe4 Nc3@70 (Be2@30 Qg6 O-O Be7 f3 exf3)
 Qg6 f3@60 (d5@40 Nf6 Bf4 Be7)
 exf3 Qxf3 Nc6`,
"traxler":`e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 {Traxler-Gegenangriff}
 Bxf7+@45
  (Nxf7@35 Bxf2+ Kxf2@70 (Kf1@30 Qe7 Nxh8 d5 exd5 Nd4)
     Nxe4+ Kg1@60 (Ke1@25 Qh4+ g3 Nxg3 hxg3 Qxg3+ Kf1 Rf8) (Ke3@15 Qh4 g3 Nxg3 Nxh8 Nd4)
     Qh4 g3 Nxg3 hxg3 Qxg3+ Kf1 Rf8)
  (d4@20 d5 dxc5 dxc4 Qxd8+ Nxd8)
 Ke7 Bd5@70 (Bb3@20 Rf8 O-O d6 c3 Qe8) (Bc4@10 d5 exd5 Nd4)
 Rf8 O-O@55 (c3@25 d6 d4 exd4 cxd4 Bb4+) (Nf3@20 d6 c3 Bg4 h3 Bh5)
 d6 c3@60 (h3@25 Qe8 c3 Nd8) (Nc3@15 Qe8 d3 Nd4)
 Qe8 d4 Bb6`,
"alapin_w":`e4 c5 c3 {Alapin-Variante}
 Nf6@40
  (d5@35 {2…d5} exd5 Qxd5 d4 Nf6@50
     (Nc6@30 Nf3 Bg4@60 (cxd4@40 cxd4 e5 Nc3 Bb4 Bd2) Be2 cxd4 cxd4 e6 Nc3 Qa5 O-O)
     (e6@20 Nf3 Nf6 Be2 Be7 O-O O-O Be3)
   Nf3 Bg4@50 (e6@35 Be2 Nc6 O-O cxd4 cxd4 Be7 Nc3 Qd6 Nb5) (cxd4@15 cxd4 e6 Nc3 Qd6 Bd3)
   Be2 e6 h3 Bh5 O-O Nc6 Be3 cxd4 cxd4 Be7 Nc3 Qd6 Nb5)
  (e6@10 d4 d5 exd5 exd5 Nf3 Nc6 Bb5 Bd6 dxc5 Bxc5 O-O)
  (d6@8 d4 Nf6 Bd3 Nc6 Nf3 g6 O-O Bg7 h3)
  (g6@4 d4 cxd4 cxd4 d5 e5 Nc6 Nc3 Bg7 Bb5)
  (Nc6@3 d4 d5 exd5 Qxd5 Nf3 Bg4 Be2 cxd4 cxd4 e6 Nc3)
 e5 Nd5 d4 cxd4@85 (e6@10 Nf3 d6 Bd3 Nc6 O-O) (d6@5 Nf3 Nc6 Bc4 Nb6 Bb3)
 Nf3 Nc6@50 (e6@30 cxd4 b6 Nc3 Nxc3 bxc3 Qc7 Bd2) (d6@20 Bc4 Nb6 Bb3 dxe5 Nxe5)
 Bc4 Nb6 Bb3 d5@55 (dxc3@20 Nxc3 d6 exd6 Qxd6 O-O) (d6@25 exd6 Qxd6 O-O Be6 Na3)
 exd6 Qxd6 O-O Be6 Bxe6 Qxe6 Nxd4 Nxd4 Qxd4`,
"gegen_london_b":`d4 d5 Bf4@50 {Londoner System}
 (Nf3@50 Nf6 Bf4@70 (c4@20 e6 Nc3 Be7) (e3@10 e6 Bd3 c5 b3 Nc6)
   c5 e3@85 (c3@15 Nc6 e3 Qb6 Qb3 c4 Qc2 Bf5)
   Nc6 c3@45 (Nbd2@35 cxd4 exd4 Bf5 c3 e6 Qb3 Qd7) (Bb5@20 Qb6 a4 a6 Bxc6+ Qxc6)
   Qb6 Qb3@65 (Qc2@25 Bg4 Nbd2 e6) (Qc1@10 Bf5 dxc5 Qxc5)
   c4 Qc2 Bf5 Qc1 e6)
 Nf6 e3@70 (Nc3@20 {Jobava-London} e6 e3@60 (Nb5@40 Na6 e3 Be7) Bb4 Bd3 c5) (Nd2@10 c5 c3 Nc6 e3 Qb6)
 c5 c3@50 (Nf3@30 Nc6 c3 Qb6 Qb3 c4 Qc2 Bf5) (Nd2@20 cxd4 exd4 Nc6 c3 Bf5)
 Nc6 Nd2@60 (Nf3@40 Qb6 Qb3@70 (Qc2@30 Bg4 Nbd2 e6) c4 Qc2 Bf5 Qc1 e6)
 e6 Ngf3 Bd6 Bg3@80 (Bxd6@20 Qxd6 Bd3 e5)
 O-O Bd3 b6 Ne5@50 (Qe2@30 Bb7 Ne5 Nd7) (O-O@20 Bb7 Qe2 Qe7)
 Bb7`,
"gegen_englisch_b":`c4 e5 {Umgekehrtes Sizilianisch}
 Nc3@60 (g3@25 Nf6 Bg2 d5 cxd5 Nxd5 Nc3@60 (Nf3@40 Nc6 O-O Nb6 d3 Be7) Nb6 Nf3 Nc6 O-O Be7 d3 O-O) (Nf3@10 e4 Nd4 Nc6 Nxc6 dxc6 d3 Bf5) (e3@5 Nf6 Nc3 d5 cxd5 Nxd5)
 Nf6 Nf3@45 (g3@45 d5 cxd5 Nxd5 Bg2 Nb6 Nf3@60 (d3@40 Be7 Nf3 Nc6 O-O O-O) Nc6 O-O Be7 d3 O-O) (e3@10 Bb4 Nge2 O-O a3 Be7)
 Nc6 g3@50 {Englisches Vierspringerspiel} (e3@25 Bb4 Qc2 Bxc3 Qxc3 Qe7 a3 d5) (d3@15 Bb4 Bd2 O-O g3 Re8) (a3@10 d5 cxd5 Nxd5 Qc2 Nxc3 bxc3 Bd6)
 d5 cxd5 Nxd5 Bg2 Nb6 O-O Be7 d3@50 (Rb1@30 O-O b4 Bf6) (a3@20 O-O b4 Be6)
 O-O a3@60 (Be3@40 Be6 Rc1 f6) Be6 b4 a5`,
"gegen_pirc_w":`e4 d6 d4 Nf6@85 (e5@10 dxe5 dxe5 Qxd8+ Kxd8 Nf3 Nd7 Bc4) (c6@5 Nf3 Nf6 Nc3 Bg4 h3 Bxf3 Qxf3)
 Nc3 g6@75 {Pirc-Verteidigung} (c6@12 {Tschechische Pirc} f4 Qa5 Bd3 e5 Nf3 exf4 Bxf4) (e5@13 Nf3 Nbd7 Bc4 Be7 O-O O-O a4)
 Be3 Bg7@65 (c6@25 Qd2 b5 Bd3 Nbd7 Nf3) (a6@10 f3 b5 Qd2 Nbd7 g4)
 Qd2 c6@40 (O-O@40 O-O-O c6@50 (Nc6@50 f3 e5 d5 Nd4 Nge2) f3 b5 h4 h5 Bh6) (Ng4@20 Bg5 h6 Bh4 g5 Bg3 f5 h3)
 f3 b5@50 (O-O@30 g4 b5 h4 h5 g5) (Nbd7@20 g4 b5 h4 h5 g5)
 Nge2 Nbd7 Bh6 Bxh6@60 (O-O@40 h4 e5 Bxg7 Kxg7 h5)
 Qxh6 Bb7 a3 e5 O-O-O`
};
/* Eröffnungen, die es bisher nur als Baum gibt */
const TREE_OPENINGS=[
{id:"kia",g:"w",side:"w",name:"Königsindischer Angriff",eco:"A07–A08",d:"Ein Aufbau statt Theorie: Sf3, g3, Lg2, O-O, d3, Sbd2 und e4. Funktioniert gegen fast jede schwarze Antwort.",lines:[]},
{id:"halbslawisch",g:"b",side:"b",name:"Halbslawisch",eco:"D43–D49",d:"...c6 und ...e6 zusammen: eine der stabilsten Antworten auf 1.d4, die trotzdem scharfe Varianten wie Meraner und Botwinnik erlaubt.",lines:[]},
{id:"alapin_w",g:"w",side:"w",name:"Sizilianisch: Alapin (2.c3)",eco:"B22",d:"Die bequeme Antwort auf Sizilianisch: 2.c3 bereitet d4 vor und umgeht die große Theorie von Najdorf, Drachen und Sweschnikow.",lines:[]},
{id:"gegen_london_b",g:"b",side:"b",name:"Gegen das Londoner System",eco:"D02 · A46",d:"Mit …d5, …c5, …Sc6 und …Db6 greift Schwarz den Bauern b2 und das Zentrum an, bevor der weiße Aufbau steht.",lines:[]},
{id:"gegen_englisch_b",g:"b",side:"b",name:"Gegen Englisch (1.c4 e5)",eco:"A20–A29",d:"Umgekehrtes Sizilianisch: Schwarz nimmt mit …e5, …Sf6, …Sc6 und …d5 das Zentrum und spielt mit einem Tempo weniger die weißen Sizilianer-Pläne.",lines:[]},
{id:"gegen_pirc_w",g:"w",side:"w",name:"Gegen Pirc: 150-Angriff",eco:"B07–B09",d:"Le3, Dd2, f3 und lange Rochade: Weiß tauscht den Läufer g7 mit Lh6 ab und greift am Königsflügel an.",lines:[]}
];
