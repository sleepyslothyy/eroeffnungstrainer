/* Eröffnungsdaten: Varianten, Pläne, Fallen und Musterpartien */
const OPENINGS = [
// ---------- Mit Weiß ----------
{id:"italienisch",g:"w",side:"w",name:"Italienisch",eco:"C50–C54",d:"Klassisches Figurenspiel: schnelle Entwicklung, Druck auf f7 und der Kampf um das Zentrum mit c3 und d4.",lines:[
["Giuoco Piano, Hauptvariante","e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5 exd5 Nxd5"],
["Giuoco Pianissimo","e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 a4"],
["Zweispringerspiel, 5...Na5","e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5"],
["Ungarische Verteidigung","e4 e5 Nf3 Nc6 Bc4 Be7 d4 d6 d5 Nb8 Bd3 Nf6 c4"]]},
{id:"spanisch",g:"w",side:"w",name:"Spanisch",eco:"C60–C99",d:"Die Ruy-Lopez-Partie: Der Läufer auf b5 übt langfristigen Druck auf den Springer c6 und damit auf e5 aus.",lines:[
["Geschlossene Variante","e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3"],
["Marshall-Angriff","e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6"],
["Berliner Mauer","e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8"],
["Klassische Verteidigung","e4 e5 Nf3 Nc6 Bb5 Bc5 c3 Nf6 O-O O-O d4 Bb6"],
["Steinitz-Verteidigung","e4 e5 Nf3 Nc6 Bb5 d6 d4 Bd7 Nc3 Nf6 O-O Be7 Re1"]]},
{id:"schottisch",g:"w",side:"w",name:"Schottisch",eco:"C44–C45",d:"Weiß öffnet sofort mit d4 das Zentrum und tauscht den e5-Bauern ab. Klare Strukturen, offenes Spiel.",lines:[
["Klassische Variante","e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bc4"],
["Mieses-Variante","e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4"],
["Potter-Variante","e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nb3 Bb6 a4 a6 Nc3"],
["Steinitz-Variante 4...Dh4","e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5 Bb4+ Bd2 Qxe4+ Be2 Kd8 O-O"]]},
{id:"londoner",g:"w",side:"w",name:"Londoner System",eco:"D02 / A46",d:"Ein festes System: Lf4, e3, c3 und Sd2/Sf3. Wenig Theorie, solide Struktur gegen fast alles.",lines:[
["Gegen ...e6 und ...c5","d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3"],
["Gegen Königsindisch-Aufbau","d4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 h3"],
["Gegen ...c5 und ...Db6","d4 d5 Bf4 c5 e3 Nc6 c3 Qb6 Qb3 c4 Qc2"]]},
{id:"damengambit",g:"w",side:"w",name:"Damengambit",eco:"D06–D69",d:"1.d4 d5 2.c4: Weiß bietet einen Flügelbauern an, um das Zentrum zu dominieren. Grundlage des Damenbauernspiels.",lines:[
["Abgelehnt, Tartakower","d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6"],
["Angenommen","d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6"],
["Slawische Antwort","d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O"],
["Tarrasch-Verteidigung","d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O"],
["Tschigorin-Verteidigung","d4 d5 c4 Nc6 Nf3 Bg4 cxd5 Bxf3 gxf3 Qxd5 e3 e5 Nc3 Bb4 Bd2"]]},
{id:"englisch",g:"w",side:"w",name:"Englisch",eco:"A10–A39",d:"1.c4 kontrolliert d5 vom Flügel aus. Flexibel, oft mit Fianchetto auf g2 und langsamem Aufbau.",lines:[
["Umgekehrtes Sizilianisch","c4 e5 Nc3 Nf6 Nf3 Nc6 g3 d5 cxd5 Nxd5 Bg2 Nb6 O-O Be7 d3 O-O"],
["Gegen 1...Sf6 und ...e6","c4 Nf6 Nc3 e6 Nf3 d5 d4 Be7 Bg5"],
["Symmetrievariante","c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3 e6 O-O Nge7"],
["Gegen ...g6","c4 g6 Nc3 Bg7 g3 d6 Bg2 e5 d3 Nc6 Rb1"]]},
{id:"wiener",g:"w",side:"w",name:"Wiener Partie",eco:"C25–C29",d:"2.Sc3 statt 2.Sf3: Weiß hält sich den Vorstoß f4 offen und spielt oft auf schnellen Königsangriff.",lines:[
["Wiener Gambit","e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7 d4 O-O Bd3"],
["Wiener Gambit, 3...exf4","e4 e5 Nc3 Nf6 f4 exf4 e5 Ng8 Nf3 d6 d4 dxe5 dxe5 Qxd1+ Nxd1"],
["Mit Lc4 und Dg4","e4 e5 Nc3 Nc6 Bc4 Bc5 Qg4 Kf8 Qg3 Nf6 d3 d6 Bg5"],
["Gegen 2...Lc5","e4 e5 Nc3 Bc5 Nf3 d6 d4 exd4 Nxd4 Nf6 Bg5"]]},

// ---------- Mit Schwarz ----------
{id:"najdorf",g:"b",side:"b",name:"Sizilianisch Najdorf",eco:"B90–B99",d:"Mit 5...a6 hält Schwarz b5 unter Kontrolle und wartet, bevor er sein Zentrum festlegt. Scharf und reich an Theorie.",lines:[
["Englischer Angriff","e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Be7 Qd2 O-O"],
["6.Lg5","e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Be7 Qf3 Qc7 O-O-O Nbd7"],
["Klassisch 6.Le2","e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e5 Nb3 Be7 O-O O-O"],
["Moskauer Variante 3.Lb5+","e4 c5 Nf3 d6 Bb5+ Bd7 Bxd7+ Qxd7 O-O Nc6 c3 Nf6"],
["Alapin 2.c3","e4 c5 c3 Nf6 e5 Nd5 d4 cxd4 Nf3 Nc6 cxd4 d6"],
["Geschlossen 2.Sc3","e4 c5 Nc3 d6 f4 Nc6 Nf3 g6 Bb5 Bd7"]]},
{id:"drachen",g:"b",side:"b",name:"Sizilianisch Drachen",eco:"B70–B79",d:"Fianchetto auf g7: Der Läufer zielt über die lange Diagonale auf b2 und den weißen Damenflügel.",lines:[
["Jugoslawischer Angriff, 9.Lc4","e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Rc8 Bb3 Ne5"],
["Jugoslawischer Angriff, 9...d5","e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 O-O-O d5 exd5 Nxd5 Nxc6 bxc6"],
["Klassische Variante","e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be2 Bg7 O-O O-O Be3 Nc6 Nb3 Be6 f4 Qc8"]]},
{id:"franzoesisch",g:"b",side:"b",name:"Französisch",eco:"C00–C19",d:"1...e6 und 2...d5: Ein festes Zentrum, Gegenspiel mit ...c5. Der Läufer c8 ist das Sorgenkind.",lines:[
["Winawer","e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 O-O"],
["Vorstoßvariante","e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 c4 Nbd2 Bd7"],
["Abtauschvariante","e4 e6 d4 d5 exd5 exd5 Nf3 Nf6 Bd3 Bd6 O-O O-O"],
["Tarrasch 3.Sd2","e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6 Nb3 Nc6"]]},
{id:"carokann",g:"b",side:"b",name:"Caro-Kann",eco:"B10–B19",d:"Wie Französisch, aber der Läufer c8 kommt vor ...e6 ins Spiel. Solide, mit guter Bauernstruktur.",lines:[
["Klassisch 4...Lf5","e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3"],
["Vorstoßvariante","e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 O-O Nc6 c3 cxd4 cxd4 Nge7"],
["Abtausch","e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4 Qb3 Qd7 Nd2 e6"],
["Panow-Angriff","e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Bb4"],
["Zweispringervariante","e4 c6 Nc3 d5 Nf3 Bg4 h3 Bxf3 Qxf3 e6"]]},
{id:"skandinavisch",g:"b",side:"b",name:"Skandinavisch",eco:"B01",d:"1...d5 greift e4 sofort an. Die Dame kommt früh heraus, dafür entwickelt Schwarz sich schnell und klar.",lines:[
["Hauptvariante 3...Da5","e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 c6 Bc4 Bf5 Bd2 e6"],
["3...Da5 mit 4.Sf3","e4 d5 exd5 Qxd5 Nc3 Qa5 Nf3 Nf6 d4 c6 Bc4 Bf5"],
["3.Sf3 mit langer Rochade","e4 d5 exd5 Qxd5 Nf3 Bg4 Be2 Nc6 d4 O-O-O"],
["3.d4","e4 d5 exd5 Qxd5 d4 Nf6 Nf3 Bg4 Be2 e6 O-O Nc6"]]},
{id:"koenigsindisch",g:"b",side:"b",name:"Königsindisch",eco:"E60–E99",d:"Schwarz überlässt Weiß zunächst das Zentrum, um es mit ...e5 oder ...c5 anzugreifen. Häufig Königsangriff mit ...f5.",lines:[
["Klassisch, 9.d5","d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7"],
["Petrosjan 7.d5","d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 d5 a5"],
["Sämisch","d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 d5 Nh5 Qd2 f5"],
["Vierbauernangriff","d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5 d5 e6 Be2 exd5 cxd5"],
["Fianchetto-Variante","d4 Nf6 Nf3 g6 g3 Bg7 Bg2 O-O O-O d6 c4 Nbd7 Nc3 e5"]]},
{id:"nimzo",g:"b",side:"b",name:"Nimzo-Indisch",eco:"E20–E59",d:"3...Lb4 fesselt den Springer c3 und kämpft um e4. Schwarz gibt oft das Läuferpaar für eine bessere Struktur.",lines:[
["Klassisch 4.Dc2","d4 Nf6 c4 e6 Nc3 Bb4 Qc2 O-O a3 Bxc3+ Qxc3 b6 Bg5 Bb7"],
["Rubinstein 4.e3","d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O Nc6"],
["Sämisch 4.a3","d4 Nf6 c4 e6 Nc3 Bb4 a3 Bxc3+ bxc3 c5 e3 Nc6 Bd3 O-O"],
["Kmoch 4.f3","d4 Nf6 c4 e6 Nc3 Bb4 f3 d5 a3 Bxc3+ bxc3 c5"],
["Gegen 3.Sf3: Damenindisch","d4 Nf6 c4 e6 Nf3 b6 g3 Ba6 b3 Bb4+ Bd2 Be7"]]},
{id:"slawisch",g:"b",side:"b",name:"Slawisch",eco:"D10–D19",d:"2...c6 stützt d5, ohne den Läufer c8 einzusperren. Eine der solidesten Antworten auf das Damengambit.",lines:[
["Hauptvariante 4...dxc4","d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O O-O Qe2 Nbd7"],
["Meraner Variante","d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3"],
["Abtauschvariante","d4 d5 c4 c6 cxd5 cxd5 Nc3 Nf6 Bf4 Nc6 e3 Bf5"],
["4.e3 Lf5","d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 Nc3 e6 Nh4 Bg6 Nxg6 hxg6"]]},
{id:"hollaendisch",g:"b",side:"b",name:"Holländisch",eco:"A80–A99",d:"1...f5 kontrolliert e4 und bereitet einen Königsangriff vor. Unausgeglichen und kampfbetont.",lines:[
["Leningrader System","d4 f5 g3 Nf6 Bg2 g6 Nf3 Bg7 O-O O-O c4 d6 Nc3 Qe8"],
["Leningrader, Sh3","d4 f5 g3 Nf6 Bg2 g6 c4 Bg7 Nc3 O-O Nh3 d6"],
["Gegen 2.Lg5","d4 f5 Bg5 Nf6 Bxf6 exf6 e3 d5 c4 c6 Nc3"],
["Staunton-Gambit","d4 f5 e4 fxe4 Nc3 Nf6 Bg5 g6 f3 exf3 Nxf3 Bg7"]]},
{id:"aljechin",g:"b",side:"b",name:"Aljechin-Verteidigung",eco:"B02–B05",d:"1...Sf6 lockt die weißen Bauern nach vorn, um sie später als Angriffsziele zu nutzen. Provokant und hypermodern.",lines:[
["Moderne Variante","e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4 Be2 e6 O-O Be7 h3 Bh5 c4 Nb6"],
["Vierbauernangriff","e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 dxe5 fxe5 Nc6 Be3 Bf5 Nc3 e6 Nf3"],
["Abtauschvariante","e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 exd6 cxd6 Nc3 g6 Be3 Bg7 Rc1 O-O b3"],
["Gegen 2.Sc3","e4 Nf6 Nc3 d5 exd5 Nxd5 Bc4 Nb6 Bb3 c5"]]},
{id:"gruenfeld",g:"b",side:"b",name:"Grünfeld-Indisch",eco:"D70–D99",d:"Schwarz erlaubt ein großes weißes Zentrum und greift es mit ...c5 und dem Läufer g7 an.",lines:[
["Abtausch mit Sf3","d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Nf3 c5 Be3 Qa5 Qd2 O-O Rc1"],
["Abtausch mit Lc4","d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 c5 Ne2 Nc6 Be3 O-O O-O"],
["4.Lf4","d4 Nf6 c4 g6 Nc3 d5 Bf4 Bg7 e3 c5 dxc5 Qa5 Rc1 dxc4 Bxc4 O-O"],
["Russisches System","d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 Bg4 Be3 Nfd7"]]},
{id:"pirc",g:"b",side:"b",name:"Pirc-Verteidigung",eco:"B07–B09",d:"...d6, ...Sf6 und ...g6: Schwarz baut sich flexibel auf und kontert später im Zentrum.",lines:[
["Österreichischer Angriff","e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 O-O Bd3 Na6 O-O c5 d5"],
["150-Angriff","e4 d6 d4 Nf6 Nc3 g6 Be3 Bg7 Qd2 c6 f3 b5"],
["Klassisches System","e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Be2 O-O O-O c6 a4"],
["Mit 4.Lg5","e4 d6 d4 Nf6 Nc3 g6 Bg5 Bg7 Qd2 h6 Bh4 c6"]]},
{id:"petrow",g:"b",side:"b",name:"Russisch (Petrow)",eco:"C42–C43",d:"Schwarz spiegelt mit 2...Sf6 und greift e4 an. Sehr solide, aber mit einigen Fallen.",lines:[
["Klassisch 5.d4","e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Nc6 O-O Be7 c4 Nb4"],
["5.Sc3","e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 Nc3 Nxc3 dxc3 Be7 Be3 O-O Qd2 Nd7 O-O-O"],
["Steinitz 3.d4","e4 e5 Nf3 Nf6 d4 Nxe4 Bd3 d5 Nxe5 Nd7 Nxd7 Bxd7 O-O Bd6"],
["Cochrane-Gambit","e4 e5 Nf3 Nf6 Nxe5 d6 Nxf7 Kxf7 d4 c5"]]},

// ---------- Gambits & Fallen ----------
{id:"koenigsgambit",g:"x",side:"w",name:"Königsgambit",eco:"C30–C39",d:"2.f4: Romantisches Schach des 19. Jahrhunderts. Weiß opfert einen Bauern für offene f-Linie und Initiative.",lines:[
["Kieseritzky","e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bd6 d4"],
["Fischer-Verteidigung","e4 e5 f4 exf4 Nf3 d6 d4 g5 h4 g4 Ng1 f3 gxf3 Be7"],
["Falkbeer-Gegengambit","e4 e5 f4 d5 exd5 exf4 Nf3 Nf6 Bb5+ c6 dxc6 Nxc6 d4"],
["Abgelehnt mit 2...Lc5","e4 e5 f4 Bc5 Nf3 d6 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2"]]},
{id:"evans",g:"x",side:"w",name:"Evans-Gambit",eco:"C51–C52",d:"Im Italiener opfert Weiß mit 4.b4 einen Bauern, um mit c3 und d4 Tempo für das Zentrum zu gewinnen.",lines:[
["Angenommen, 5...La5","e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O Nge7 cxd4 d5 exd5 Nxd5"],
["Lasker-Verteidigung 6...d6","e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 d6 Qb3 Qd7 dxe5"],
["Rückzug 5...Le7","e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Be7 d4 Na5 Be2 exd4 Qxd4"],
["Abgelehnt","e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 a4 a6 Nc3 Nf6 Nd5"]]},
{id:"friedliver",g:"x",side:"w",name:"Fegatello (Fried Liver)",eco:"C57",d:"Im Zweispringerspiel stürmt Weiß mit Sg5 auf f7. Spektakuläre Opfer, wenn Schwarz ungenau zurückschlägt.",lines:[
["Fegatello mit Sxf7","e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6 Nc3 Nb4 a3 Nxc2+ Kd1 Nxa1 Nxd5"],
["Hauptvariante 5...Sa5","e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5"],
["Fritz-Variante 5...Sd4","e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nd4 c3 b5 Bf1 Nxd5 cxd4"],
["Traxler 4...Lc5","e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Bxf7+ Ke7 Bb3 Rf8 O-O d6 c3"]]},
{id:"daenisch",g:"x",side:"w",name:"Nordisches Gambit",eco:"C21",d:"Das Dänische Gambit opfert zwei Bauern für zwei Läufer, die auf das schwarze Lager zielen.",lines:[
["Doppelt angenommen","e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2 d5 Bxd5 Nf6 Bxf7+ Kxf7 Qxd8 Bb4+ Qd2 Bxd2+ Nxd2"],
["Abgelehnt 3...d5","e4 e5 d4 exd4 c3 d5 exd5 Qxd5 cxd4 Nc6 Nf3 Bg4 Be2 Bb4+ Nc3"],
["Einfach angenommen","e4 e5 d4 exd4 c3 dxc3 Nxc3 Nc6 Bc4 Nf6 Nf3 d6 Qb3 Qd7"]]},
{id:"bird",g:"x",side:"w",name:"Bird-Eröffnung",eco:"A02–A03",d:"1.f4 kontrolliert e5 wie ein umgekehrtes Holländisch. Selten, unbequem für Gegner ohne Vorbereitung.",lines:[
["Gegen 1...d5","f4 d5 Nf3 Nf6 e3 g6 b3 Bg7 Bb2 O-O Be2 c5 O-O"],
["From-Gambit","f4 e5 fxe5 d6 exd6 Bxd6 Nf3 g5 d4 g4 Ne5 Bxe5 dxe5 Qxd1+ Kxd1"],
["Gegen 1...Sf6","f4 Nf6 Nf3 g6 e3 Bg7 Be2 O-O O-O d6 d3"]]},
{id:"budapester",g:"x",side:"b",name:"Budapester Gambit",eco:"A51–A52",d:"2...e5 gegen das Damengambit-Schema. Schwarz gewinnt den Bauern meist zurück und hat eine berühmte Mattfalle.",lines:[
["Rubinstein 4.Lf4","d4 Nf6 c4 e5 dxe5 Ng4 Bf4 Nc6 Nf3 Bb4+ Nbd2 Qe7 a3 Ngxe5 Nxe5 Nxe5 e3 Bxd2+ Qxd2 d6"],
["Die Falle: 8.axb4?? Sd3#","d4 Nf6 c4 e5 dxe5 Ng4 Bf4 Nc6 Nf3 Bb4+ Nbd2 Qe7 a3 Ngxe5 axb4 Nd3#"],
["4.Sf3","d4 Nf6 c4 e5 dxe5 Ng4 Nf3 Bc5 e3 Nc6 Be2 Ngxe5 Nxe5 Nxe5 O-O O-O"],
["Aljechin 4.e4","d4 Nf6 c4 e5 dxe5 Ng4 e4 Nxe5 f4 Nec6 Be3 Bb4+ Nc3 Qe7"]]},
{id:"albin",g:"x",side:"b",name:"Albins Gegengambit",eco:"D08–D09",d:"2...e5 gegen das Damengambit. Der Bauer d4 wird zum Keil im weißen Lager. Mit der berühmten Lasker-Falle.",lines:[
["Hauptvariante 4.Sf3","d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 g3 Bg4 Bg2 Qd7 O-O O-O-O"],
["4.Sf3 Sc6 5.Sbd2","d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 Nbd2 Bg4 h3 Bxf3 Nxf3 Bc5"],
["Lasker-Falle","d4 d5 c4 e5 dxe5 d4 e3 Bb4+ Bd2 dxe3 Bxb4 exf2+ Ke2 fxg1=N+ Rxg1 Bg4+"]]},
{id:"jaenisch",g:"x",side:"b",name:"Jänisch-Gambit",eco:"C63",d:"Schliemann-Verteidigung: 3...f5 gegen Spanisch. Scharfes Gegenspiel über die f-Linie.",lines:[
["Hauptvariante 4.Sc3","e4 e5 Nf3 Nc6 Bb5 f5 Nc3 fxe4 Nxe4 d5 Nxe5 dxe4 Nxc6 Qg5 Qe2 Nf6"],
["Ruhig mit 4.d3","e4 e5 Nf3 Nc6 Bb5 f5 d3 fxe4 dxe4 Nf6 O-O Bc5"],
["4.exf5","e4 e5 Nf3 Nc6 Bb5 f5 exf5 e4 Qe2 Qe7 Bxc6 dxc6 Nd4 Qe5"]]},
{id:"stafford",g:"x",side:"b",name:"Stafford-Gambit",eco:"C42",d:"Ein Trickgambit aus dem Russischen: Schwarz opfert e5 und stellt Fallen rund um f2 und e4.",lines:[
["Mattfalle 6.Lg5??","e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 d3 Bc5 Bg5 Nxe4 Bxd8 Bxf2+ Ke2 Bg4#"],
["Damenfalle 5.e5","e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 e5 Ne4 d3 Bc5 dxe4 Bxf2+ Ke2 Bg4+"],
["5.Sc3 mit ...h5","e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 Nc3 Bc5 Be2 h5 d3 Ng4 Bxg4 hxg4"],
["5.d3 mit 6.Le2","e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 d3 Bc5 Be2 h5 Nc3 Ng4"]]},
{id:"benko",g:"x",side:"b",name:"Wolga-Gambit (Benko)",eco:"A57–A59",d:"Schwarz opfert den b-Bauern für offene a- und b-Linien und langfristigen Druck am Damenflügel.",lines:[
["Angenommen, Kf1-Variante","d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 g6 Nc3 Bxa6 e4 Bxf1 Kxf1 d6 g3 Bg7 Kg2 O-O"],
["5.b6","d4 Nf6 c4 c5 d5 b5 cxb5 a6 b6 e6 Nc3 Nxd5 Nxd5 exd5 Qxd5 Nc6"],
["Abgelehnt 4.Sf3","d4 Nf6 c4 c5 d5 b5 Nf3 bxc4 Nc3 d6 e4 g6"]]}
];

const OPENINGS_NEW = [
// ---------- Mit Weiß ----------
{id:"offen_siz_w",g:"w",side:"w",name:"Offenes Sizilianisch",eco:"B20–B99",d:"Mit 3.d4 öffnet Weiß das Spiel gegen Sizilianisch und bekommt Raum und Entwicklungsvorsprung.",
plan:["Die offene d-Linie und den Raumvorteil nutzen.","Gegen ...g6 lange Rochade und Bauernsturm mit h4–h5.","Gegen ...e6 und ...a6 Aufbau mit Ld3, O-O und c4 (Maróczy-Bindung).","Den Springer auf d4 zentral halten und das Feld d5 besetzen."],
lines:[
["Gegen Najdorf: Englischer Angriff","e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Be7 Qd2 O-O O-O-O","Weiß stürmt mit g4–g5 am Königsflügel, Schwarz greift mit ...b5–b4 am Damenflügel an. Wer schneller ist, gewinnt."],
["Gegen Drachen: Jugoslawischer Angriff","e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 O-O-O","Weiß spielt h4–h5, Lh6 und tauscht den Drachenläufer, um die h-Linie zu öffnen."],
["Gegen Sweschnikow","e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6 Nd5","Weiß besetzt d5 dauerhaft und spielt c3, Sc2 und a4 gegen die schwarzen Damenflügelbauern."],
["Gegen Taimanow","e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be3 a6 Qd2 Nf6 O-O-O","Lange Rochade und Angriff mit f4 oder g4; Schwarz kontert mit ...b5 und ...Lb4."],
["Gegen Kan","e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Bd3 Nf6 O-O Qc7 Qe2 d6 c4","Maróczy-Struktur: Weiß hat Raum und spielt Sc3, Kh1 und f4."],
["Gegen beschleunigten Drachen","e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7 Be3 Nf6 Nc3 O-O Be2","Die Maróczy-Bindung verhindert ...d5. Weiß spielt O-O, Dd2 und Tac1 und hält Schwarz eingeengt."]]},
{id:"gegen_franz_w",g:"w",side:"w",name:"Gegen Französisch",eco:"C00–C19",d:"Mit 3.Sc3 kämpft Weiß um e4 und baut Druck im Zentrum auf.",
plan:["Raumvorteil mit e5 und Angriff am Königsflügel.","Gegen ...c5 das Zentrum mit Sf3, f4 und Le3 stützen.","Der dunkelfeldrige Läufer ist oft stark, weil Schwarz seinen guten Läufer tauscht.","Angriffsideen: Dg4 gegen g7, Ld3 gegen h7, f4–f5."],
lines:[
["Winawer mit 7.Dg4","e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 O-O Bd3 Nbc6 Qh5","Weiß greift den Königsflügel mit Sf3–g5 und h4 an; Schwarz spielt im Zentrum mit ...f5 oder ...c4."],
["Klassisch 4.Lg5","e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O Nf3 c5","Weiß hat Raum und spielt Dd2, O-O-O und dxc5 mit Angriff gegen den schwarzen König."],
["McCutcheon 4...Lb4","e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bd2 Bxc3 bxc3 Ne4 Qg4","Weiß greift g7 an und nutzt das Läuferpaar; Schwarz hat die weiße Struktur beschädigt."],
["Rubinstein 3...dxe4","e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5 dxc5 Bxc5 O-O","Weiß hat Entwicklungsvorsprung; Plan: De2, Lg5 und Tad1 mit Druck auf der d-Linie."],
["Steinitz 4.e5","e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 cxd4 Nxd4 Bc5 Qd2","Weiß rochiert lang und greift mit g4 und f5 an, während Schwarz im Zentrum Druck macht."]]},
{id:"gegen_caro_w",g:"w",side:"w",name:"Gegen Caro-Kann",eco:"B10–B19",d:"Aktive Systeme gegen den soliden Caro-Kann: Vorstoß, klassisch mit h4 und Panow-Angriff.",
plan:["Gegen ...Lf5 mit h4–h5 Tempo gewinnen.","Im Vorstoß Raum am Königsflügel und Figuren auf aktive Felder.","Im Panow-Angriff isolierter Damenbauer mit aktivem Figurenspiel.","Lange Rochade ist in vielen Linien eine gute Option."],
lines:[
["Vorstoß: Kurz-System gegen ...c5","e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 Be3 Qb6 Nc3 Nc6 O-O","Weiß gibt eventuell b2 und bekommt dafür schnelle Entwicklung; Plan: Sa4, c3 und dxc5."],
["Vorstoß gegen ...Sd7","e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 Nd7 O-O Ne7 Nbd2 h6 Nb3","Weiß hat Raum; Plan: Ld2, c4 oder Sh4 gegen den Läufer f5."],
["Klassisch mit h4","e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6 Bf4","Weiß rochiert lang und spielt Se4 und c4 mit Raumvorteil."],
["Gegen 4...Sd7","e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Bc4 Ngf6 Ng5 e6 Qe2 Nb6 Bd3 h6 N5f3","Weiß hat Raum und spielt Ld2, O-O-O und Se5."],
["Panow-Angriff","e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Nf3 Bg4 cxd5 Nxd5 Qb3","Druck auf d5 und b7: Weiß gewinnt Initiative und spielt gegen den Damenflügel."]]},
{id:"gegen_skandi_w",g:"w",side:"w",name:"Gegen Skandinavisch",eco:"B01",d:"Mit Sc3 Tempo gegen die schwarze Dame gewinnen und das Zentrum mit d4 aufbauen.",
plan:["Mit Sc3 Tempo gegen die Dame gewinnen.","Zentrum mit d4 aufbauen und schnell rochieren.","Weiß hat mehr Raum und oft Angriff am Königsflügel.","Den Läufer f5 mit Ld3 oder Se5 und g4 bekämpfen."],
lines:[
["Gegen 3...Da5","e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 c6 Bc4 Bf5 Bd2 e6 Qe2 Bb4 O-O-O","Lange Rochade, dann Se5, g4 und Angriff am Königsflügel."],
["Gegen 3...Dd6","e4 d5 exd5 Qxd5 Nc3 Qd6 d4 Nf6 Nf3 a6 Be2 Nc6 O-O","Weiß hat mehr Raum und spielt Te1, h3 und Lg5 oder d5."],
["Gegen 3...Dd8","e4 d5 exd5 Qxd5 Nc3 Qd8 d4 Nf6 Nf3 Bg4 h3 Bxf3 Qxf3 c6 Be3 e6 Bd3","Weiß hat das Läuferpaar und spielt O-O oder O-O-O mit Raumvorteil."],
["Gegen 2...Sf6","e4 d5 exd5 Nf6 d4 Nxd5 Nf3 g6 Be2 Bg7 O-O O-O c4 Nb6 Nc3","Weiß hat ein großes Zentrum; Plan: Le3, h3 und d5."]]},
{id:"gegen_ki_w",g:"w",side:"w",name:"Gegen Königsindisch",eco:"E60–E99",d:"Weiß nutzt den Raum im Zentrum und greift am Damenflügel an.",
plan:["Raum im Zentrum mit e4 und d5 nutzen.","Am Damenflügel mit b4 und c5 angreifen.","Den schwarzen Königsangriff mit Se1–d3 und f3 bremsen.","Im Sämisch lange Rochade und Bauernsturm g4–h4."],
lines:[
["Klassisch, Bajonettangriff","d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 b4","Weiß spielt c5, a4 und Sd2; Schwarz greift mit ...Sh5 und ...f5 an. Ein Wettrennen."],
["Klassisch gegen 7...Sbd7","d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nbd7 Be3 c6 d5","Geschlossenes Zentrum: Weiß spielt Sd2, b4 und c5."],
["Sämisch","d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 d5 Nh5 Qd2 f5 O-O-O","Weiß greift mit g4 und h4 am Königsflügel an."],
["Gegen ...c5 (Benoni-Stil)","d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 c5 d5 e6 O-O exd5 cxd5 Re8 Nd2","Weiß plant f4 und e5; Schwarz spielt ...Sa6–c7 und ...b5."]]},
{id:"katalanisch",g:"w",side:"w",name:"Katalanisch",eco:"E01–E09",d:"Damengambit mit Fianchetto: Der Läufer g2 drückt dauerhaft auf die lange Diagonale.",
plan:["Läufer g2 übt Druck auf b7 und das Zentrum aus.","Den Bauern c4 mit Dc2 oder Da4+ zurückgewinnen.","Später e4 für volle Zentrumskontrolle.","Ruhiges, positionelles Spiel mit langfristigem Druck."],
lines:[
["Offen 4...dxc4","d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 Be7 O-O O-O Qc2 a6 Qxc4 b5 Qc2 Bb7 Bd2","Weiß spielt Tc1 und La5 mit Druck auf dem Damenflügel."],
["Geschlossen","d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2 c6 Nbd2 b6 e4","Weiß hat mit e4 das Zentrum erweitert und spielt b3 und Lb2."],
["Mit 4...Lb4+","d4 Nf6 c4 e6 g3 d5 Bg2 Bb4+ Bd2 Be7 Nf3 O-O O-O c6 Qc2","Weiß spielt Lf4, Td1 und Sbd2 mit leichtem Druck."],
["Gegen 3...c5","d4 Nf6 c4 e6 g3 c5 d5 exd5 cxd5 d6 Nc3 g6 Bg2 Bg7 Nf3 O-O O-O","Benoni-Struktur: Weiß spielt Lf4 und Sd2–c4 mit Druck auf d6."]]},
{id:"vierspringer",g:"w",side:"w",name:"Vierspringerspiel",eco:"C46–C49",d:"Symmetrische Entwicklung mit vier Springern – solide und lehrreich.",
plan:["Symmetrisch entwickeln und auf kleine Vorteile spielen.","Lg5 fesselt den Springer f6.","Bei Spiegelung auf schnelle Rochade achten.","Den Gabeltrick Sxe5 gegen ...Lc5 kennen."],
lines:[
["Spanische Variante","e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 d6 Bg5 Bxc3 bxc3","Weiß hat das Läuferpaar gegen Doppelbauern; Plan: Te1, d4 und h3."],
["Rubinstein 4...Sd4","e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Nd4 Ba4 Bc5 Nxe5 O-O Nd3 Bb6 e5 Ne8","Weiß hat einen Mehrbauern; Schwarz hat aktive Figuren und Initiative."],
["Schottisch 4.d4","e4 e5 Nf3 Nc6 Nc3 Nf6 d4 exd4 Nxd4 Bb4 Nxc6 bxc6 Bd3 d5 exd5 cxd5 O-O O-O Bg5","Weiß fesselt den Springer und spielt gegen den Bauern d5."],
["Gabeltrick gegen 3...Lc5","e4 e5 Nf3 Nc6 Nc3 Bc5 Nxe5 Nxe5 d4 Bd6 dxe5 Bxe5 Bd3","Weiß hat das Läuferpaar und das Zentrum; Plan: O-O und f4."]]},
{id:"reti",g:"w",side:"w",name:"Réti-Eröffnung",eco:"A04–A09",d:"1.Sf3 und c4: Weiß greift das Zentrum vom Flügel an.",
plan:["Flexibel mit Sf3, c4, g3 und Lg2.","Das Zentrum vom Flügel angreifen.","Doppelfianchetto mit b3 und Lb2 ist typisch.","Erst später e4 oder d4 im richtigen Moment."],
lines:[
["Gegen 2...d4","Nf3 d5 c4 d4 e3 Nc6 exd4 Nxd4 Nxd4 Qxd4 Nc3","Weiß hat Entwicklungsvorsprung; Plan: d3, Le2 und O-O."],
["Gegen ...e6","Nf3 d5 c4 e6 g3 Nf6 Bg2 Be7 O-O O-O b3 c5 Bb2 Nc6 e3","Doppelfianchetto: Druck auf das Zentrum mit d4 oder Sc3."],
["Gegen 2...dxc4","Nf3 d5 c4 dxc4 e3 Nf6 Bxc4 e6 O-O c5 b3 Nc6 Bb2","Weiß spielt d4 oder Sc3 mit angenehmer Stellung."],
["Gegen 1...Sf6","Nf3 Nf6 c4 g6 g3 Bg7 Bg2 O-O O-O d6 Nc3 e5 d3","Weiß spielt Tb1 und b4 am Damenflügel."]]},
{id:"colle",g:"w",side:"w",name:"Colle-System",eco:"D04–D05",d:"Fester Aufbau mit d4, e3, Ld3, Sbd2 und c3 – Ziel ist der Durchbruch e4.",
plan:["Pyramide c3–d4–e3 und Läufer d3 auf h7 gerichtet.","Ziel ist der Durchbruch e3–e4.","Danach Angriff am Königsflügel mit Se5 und Df3 oder De2.","Einfach zu lernen, aber Schwarz hat gute Gegenwehr."],
lines:[
["Klassisch","d4 d5 Nf3 Nf6 e3 e6 Bd3 c5 c3 Nc6 Nbd2 Bd6 O-O O-O dxc5 Bxc5 e4","Weiß hat e4 erzwungen und greift mit e5 und Angriff auf h7 an."],
["Gegen ...Lg4","d4 d5 Nf3 Nf6 e3 Bg4 c4 e6 Qb3 Qc8 Nc3","Weiß greift b7 an und spielt Ld2 und Le2."],
["Zukertort mit b3","d4 Nf6 Nf3 e6 e3 c5 Bd3 d5 b3 Nc6 O-O Bd6 Bb2 O-O Nbd2","Weiß plant Se5, f4 und Angriff am Königsflügel."]]},
{id:"trompowsky",g:"w",side:"w",name:"Trompowsky",eco:"A45",d:"2.Lg5 bringt den Läufer sofort ins Spiel und vermeidet viel Theorie.",
plan:["Den Springer f6 abtauschen und die schwarze Struktur schwächen.","Zentrum mit e3 oder e4 und c3 aufbauen.","Gegen das Läuferpaar die Stellung geschlossen halten.","Wenig Theorie, viel Praxis."],
lines:[
["2...Se4","d4 Nf6 Bg5 Ne4 Bf4 c5 f3 Qa5+ c3 Nf6 Nd2 cxd4 Nb3","Weiß gewinnt den Bauern zurück und hat ein gutes Zentrum."],
["2...e6","d4 Nf6 Bg5 e6 e4 h6 Bxf6 Qxf6 Nc3 d6 Qd2 g5 O-O-O","Weiß rochiert lang und greift mit h4 und f4 an."],
["2...d5","d4 Nf6 Bg5 d5 Bxf6 exf6 e3 Bd6 c4 dxc4 Bxc4 O-O Nc3","Weiß spielt Sge2 und O-O mit besserer Bauernstruktur."],
["2...c5","d4 Nf6 Bg5 c5 Bxf6 gxf6 d5 Qb6 Qc1 f5 c3 Bg7 e3","Weiß spielt Sd2, Sf3 und Ld3 und hält die Stellung geschlossen."]]},
{id:"jobava",g:"w",side:"w",name:"Jobava-London",eco:"D00",d:"Londoner System mit Sc3 statt c3 – aggressiver, mit Sb5-Ideen gegen c7.",
plan:["Sc3 und Lf4 zielen gemeinsam auf c7.","Oft lange Rochade und Bauernsturm h4–h5.","Schnelles Spiel, das Schwarz früh vor Probleme stellt.","Der Läufer f1 kommt nach d3, b5 oder e2."],
lines:[
["Gegen ...e6","d4 d5 Nc3 Nf6 Bf4 e6 e3 Bd6 Nb5 Bxf4 exf4 a6 Nc3","Weiß kontrolliert e5 und spielt Sf3, Ld3 und O-O."],
["Gegen ...c5","d4 d5 Nc3 Nf6 Bf4 c5 e3 cxd4 exd4 a6 Nf3 Nc6 Ne5","Isolierter Bauer d4: Weiß spielt Ld3, O-O und Druck auf der e-Linie."],
["Gegen ...g6","d4 Nf6 Nc3 g6 Bf4 Bg7 e3 d6 h4 h5 Nf3 O-O Be2","Weiß spielt Dd2 und Lh6 mit Angriff am Königsflügel."]]},
{id:"gegen_holl_w",g:"w",side:"w",name:"Gegen Holländisch",eco:"A80–A99",d:"Mit Fianchetto und c4 dem Holländer die Diagonale h1–a8 und das Feld e4 streitig machen.",
plan:["Fianchetto g3–Lg2 bekämpft e4.","Mit c4 und d5 Raum gewinnen.","e2–e4 ist der Haupthebel im Zentrum.","Gegen den Stonewall den Vorposten e5 besetzen."],
lines:[
["Gegen Leningrad","d4 f5 g3 Nf6 Bg2 g6 Nf3 Bg7 O-O O-O c4 d6 Nc3 Qe8 d5","Weiß hat Raum; Plan: Sd4 und e4 mit Druck auf e6."],
["Gegen Stonewall","d4 f5 g3 Nf6 Bg2 e6 Nf3 d5 O-O Bd6 c4 c6 b3 Qe7 Bb2 O-O Ne5","Weiß besetzt e5 und tauscht den guten schwarzen Läufer."],
["Gegen klassisch ...Le7","d4 f5 g3 Nf6 Bg2 e6 Nf3 Be7 O-O O-O c4 d6 Nc3 Qe8 b3","Weiß spielt Lb2 und e4 mit Druck im Zentrum."],
["Staunton-Gambit","d4 f5 e4 fxe4 Nc3 Nf6 Bg5 e6 Nxe4 Be7 Bxf6 Bxf6 Nf3","Weiß hat Entwicklung für den Bauern; Plan: Ld3, O-O und Te1."]]},

// ---------- Mit Schwarz ----------
{id:"e5_schwarz",g:"b",side:"b",name:"1...e5 (Offene Spiele)",eco:"C20–C99",d:"Das klassische 1...e5: Schwarz kämpft direkt um das Zentrum und entwickelt schnell.",
plan:["Schnell entwickeln: ...Sc6, ...Sf6, ...Lc5 oder ...Le7, ...O-O.","Den Bauern e5 stützen oder mit ...exd4 das Zentrum öffnen.","Der befreiende Hebel ...d5 im richtigen Moment.","Gegen Gambits Material behalten, aber Entwicklung nicht vernachlässigen."],
lines:[
["Gegen Italienisch","e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O a6 a4 Ba7","Der Läufer ist gesichert; Schwarz spielt ...O-O, ...h6 und ...Le6."],
["Gegen Spanisch","e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5","Tschigorin-Plan: ...Dc7, ...Sc6 und Spiel am Damenflügel."],
["Gegen Schottisch","e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4 Nb6","Schwarz spielt ...a5, ...g6 und ...Lg7 gegen das weiße Zentrum."],
["Gegen Wiener","e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7 d4 O-O","Schwarz spielt ...f6 oder ...c5 und hat aktive Figuren."],
["Gegen Königsgambit","e4 e5 f4 exf4 Nf3 d6 d4 g5 h4 g4 Ng1 f3 gxf3 Be7","Schwarz gibt den Bauern zurück und spielt ...Lxh4+ und ...Sf6 mit guter Entwicklung."],
["Gegen Schottisches Gambit","e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5 d5 Bb5 Ne4 Nxd4 Bd7","Schwarz spielt ...Lc5 und ...O-O mit gutem Spiel."]]},
{id:"sweschnikow",g:"b",side:"b",name:"Sizilianisch Sweschnikow",eco:"B33",d:"...e5 gegen den Springer d4: Schwarz akzeptiert ein Loch auf d5 für aktives Figurenspiel.",
plan:["Für das Loch auf d5 bekommt Schwarz aktive Figuren und das Läuferpaar.","...f5 ist der wichtigste Befreiungshebel.","Den Springer auf d5 mit ...Lg7 und ...Se7 bekämpfen.","Dynamisch: Schwarz spielt auf Initiative."],
lines:[
["Hauptvariante 9.Lxf6","e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6 Nd5 f5","Schwarz plant ...Lg7, ...fxe4 und Druck auf das Zentrum."],
["9.Sd5","e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Nd5 Be7 Bxf6 Bxf6 c3","Schwarz hat das Läuferpaar; Plan: ...O-O, ...Tb8 und ...Lg5."],
["7.Sd5","e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Nd5 Nxd5 exd5 Nb8 c4 a6 Nc3 Be7","Schwarz spielt ...O-O, ...f5 und Spiel am Königsflügel."],
["Gegen 3.Lb5 (Rossolimo)","e4 c5 Nf3 Nc6 Bb5 g6 O-O Bg7 Re1 e5 Bxc6 dxc6 d3 Qe7","Schwarz spielt ...Sf6, ...h6 und ...O-O mit solidem Spiel."]]},
{id:"taimanow",g:"b",side:"b",name:"Sizilianisch Taimanow",eco:"B44–B49",d:"...e6 und ...Sc6: flexibel, mit Druck auf d4 und schnellem Damenflügelspiel.",
plan:["Flexibler Aufbau mit ...e6, ...Sc6, ...Dc7 und ...a6.","Schnelles Damenflügelspiel mit ...b5.","Gegen die lange Rochade Druck auf c3 mit ...Lb4.","Später ...d5 oder ...d6 je nach Stellung."],
lines:[
["6.Le3","e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be3 a6 Qd2 Nf6 O-O-O Bb4 f3 Ne5","Schwarz greift mit ...b5, ...Sc4 und ...Lxc3 an."],
["6.Le2","e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be2 a6 O-O Nf6 Be3 Bb4","Schwarz spielt ...Se5 und ...b5 mit solidem Spiel."],
["6.g3","e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 g3 a6 Bg2 Nf6 O-O Nxd4 Qxd4 Bc5","Schwarz hat aktive Figuren und spielt ...d6 und ...O-O."],
["5.Sb5","e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nb5 d6 c4 Nf6 N1c3 a6 Na3 Be7","Igelstruktur: ...O-O, ...b6, ...Lb7 und warten auf ...d5 oder ...b5."]]},
{id:"beschl_drachen",g:"b",side:"b",name:"Beschleunigter Drachen",eco:"B34–B39",d:"...g6 ohne ...d6: Schwarz spart ein Tempo und kann oft ...d5 in einem Zug spielen.",
plan:["Läufer g7 und schnelle Rochade.","Das Ziel ...d5 möglichst in einem Zug durchsetzen.","Gegen die Maróczy-Bindung geduldig mit ...a5 und ...Sc5 spielen.","Damenflügelspiel über die c-Linie."],
lines:[
["Maróczy-Aufbau","e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7 Be3 Nf6 Nc3 O-O Be2 d6 O-O Bd7","Schwarz spielt ...Sxd4, ...Lc6 und ...a5 gegen die Maróczy-Bindung."],
["Klassisch 5.Sc3","e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6 Bc4 O-O Bb3 a5","Schwarz spielt ...a4 und ...d6 mit aktivem Damenflügelspiel."],
["5.Sxc6","e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nxc6 bxc6 Qd4 Nf6 e5 Nd5 e6 f6","Scharf: Die schwarzen Bauern sind beschädigt, aber aktiv."]]},
{id:"dg_abgelehnt",g:"b",side:"b",name:"Damengambit abgelehnt",eco:"D30–D69",d:"2...e6: der klassische, solide Weg gegen das Damengambit.",
plan:["d5 mit ...e6 und ...c6 stützen.","Befreiende Hebel sind ...c5 oder ...e5.","Figuren tauschen, um den Raumnachteil zu lindern (Lasker).","Solide Struktur – Geduld entscheidet."],
lines:[
["Orthodox, Tartakower","d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6 cxd5 Nxd5","Schwarz spielt ...Lb7 und ...c5, oft mit hängenden Bauern."],
["Lasker-Verteidigung","d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 Ne4 Bxe7 Qxe7","Schwarz tauscht Figuren und befreit sich mit ...e5 oder ...c5."],
["Abtauschvariante","d4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 c6 e3 Be7 Bd3 Nbd7 Qc2 O-O","Schwarz spielt ...Te8, ...Sf8 und ...Se4 gegen den Minoritätsangriff."],
["4.Lf4","d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 Bf4 O-O e3 c5 dxc5 Bxc5","Schwarz spielt ...Sc6, ...Da5 und gleicht aus."],
["Ragosin 4...Lb4","d4 d5 c4 e6 Nc3 Nf6 Nf3 Bb4 Bg5 h6 Bxf6 Qxf6 e3 O-O","Schwarz hat das Läuferpaar und spielt ...dxc4 und ...c5."]]},
{id:"benoni",g:"b",side:"b",name:"Moderne Benoni",eco:"A60–A79",d:"...c5 und ...e6: Schwarz akzeptiert eine unausgeglichene Struktur für die Damenflügelmehrheit.",
plan:["Die Damenflügelmehrheit mit ...a6 und ...b5 mobilisieren.","Druck auf e4 über die e-Linie und den Läufer g7.","Springer nach c5 oder e5.","Achtung vor dem weißen Durchbruch e4–e5."],
lines:[
["Klassisch","d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 Nf3 Bg7 Be2 O-O O-O Re8 Nd2 Na6","Schwarz spielt ...Sc7, ...b5 und Druck auf e4."],
["Fianchetto","d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 Nf3 g6 g3 Bg7 Bg2 O-O O-O Re8","Schwarz spielt ...a6, ...Sbd7 und ...b5."],
["Taimanow-Angriff","d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f4 Bg7 Bb5+ Nfd7 a4 O-O","Scharf: Schwarz spielt ...Sa6 und ...Sc7 und muss e5 verhindern."]]},
{id:"modern",g:"b",side:"b",name:"Moderne Verteidigung",eco:"B06",d:"1...g6: Schwarz fianchettiert sofort und überlässt Weiß zunächst das Zentrum.",
plan:["Flexibel bleiben, ohne frühes ...Sf6.","Damenflügelexpansion mit ...a6, ...b5 und ...Lb7.","Später Zentrumskonter mit ...c5 oder ...e5.","Der Läufer g7 ist das Herz der Stellung."],
lines:[
["Gegen den 150-Aufbau","e4 g6 d4 Bg7 Nc3 d6 Be3 a6 Qd2 Nd7 f3 b5","Schwarz spielt ...Lb7, ...c5 und Damenflügelspiel."],
["Klassisch","e4 g6 d4 Bg7 Nc3 d6 Nf3 a6 Be2 b5 O-O Bb7 a4 b4 Nd5","Schwarz spielt ...e6, ...Sd7 und ...c5."],
["Gegen c4 (Awerbach)","e4 g6 d4 Bg7 c4 d6 Nc3 Nc6 Be3 e5 d5 Nd4","Der Springer d4 ist stark; Schwarz spielt ...c5 oder ...Se7."],
["Gegen 4.f4","e4 g6 d4 Bg7 Nc3 d6 f4 Nc6 Be3 Nf6 Nf3 O-O","Schwarz plant ...e5 oder ...Lg4 gegen das Zentrum."]]},
{id:"philidor",g:"b",side:"b",name:"Philidor-Verteidigung",eco:"C41",d:"2...d6: solide Stütze für e5, oft mit dem Hanham-Aufbau.",
plan:["e5 mit ...d6, ...Sbd7 und ...c6 halten.","Kurze Rochade, dann ...b5 oder ...exd4 je nach Lage.","Solide, aber etwas passiv.","Vorsicht vor Lxf7+-Tricks vor der Rochade."],
lines:[
["Hanham-Aufbau","e4 e5 Nf3 d6 d4 Nf6 Nc3 Nbd7 Bc4 Be7 O-O O-O Re1 c6 a4 b6","Schwarz spielt ...Lb7, ...Dc7 und ...Tfe8 mit fester Struktur."],
["3...exd4","e4 e5 Nf3 d6 d4 exd4 Nxd4 Nf6 Nc3 Be7 Bf4 O-O Qd2 a6 O-O-O d5","Schwarz öffnet das Zentrum mit ...d5 gegen die lange Rochade."],
["Gegen 4.dxe5","e4 e5 Nf3 d6 d4 Nf6 dxe5 Nxe4 Nbd2 Nxd2 Bxd2 Be7","Ruhiges Spiel: Schwarz spielt ...O-O und ...Sc6."],
["Gegen 3.Lc4","e4 e5 Nf3 d6 Bc4 Be7 d4 exd4 Nxd4 Nf6 Nc3 O-O O-O","Schwarz spielt ...Te8 und ...Lf8 mit solider Struktur."]]},
{id:"damenindisch",g:"b",side:"b",name:"Damenindisch",eco:"E12–E19",d:"...b6 und ...Lb7: Schwarz kontrolliert e4 mit Figuren statt mit Bauern.",
plan:["Kontrolle über e4 mit Lb7, Sf6 und Lb4.","Später ...d5 oder ...c5 im Zentrum.","Solide Bauernstruktur ohne Schwächen.","Gleichwertige Stellungen mit langsamem Ausgleich."],
lines:[
["Fianchetto 4...La6","d4 Nf6 c4 e6 Nf3 b6 g3 Ba6 b3 Bb4+ Bd2 Be7 Bg2 c6 Bc3 d5","Schwarz spielt ...Sbd7, ...O-O und ...c5."],
["Petrosjan 4.a3","d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5 cxd5 Nxd5 Qc2 Nd7","Schwarz spielt ...c5 und ...Le7 und verhindert e4."],
["4.e3","d4 Nf6 c4 e6 Nf3 b6 e3 Bb7 Bd3 d5 O-O Bd6 Nc3 O-O","Schwarz spielt ...Sbd7, ...De7 und ...c5."],
["4.Sc3","d4 Nf6 c4 e6 Nf3 b6 Nc3 Bb4 Bg5 Bb7 e3 h6 Bh4 g5 Bg3 Ne4","Schwarz hat Raum am Königsflügel und spielt ...Lxc3 und ...d6."]]},

// ---------- Gambits & Fallen ----------
{id:"morra",g:"x",side:"w",name:"Smith-Morra-Gambit",eco:"B21",d:"Weiß opfert gegen Sizilianisch einen Bauern für schnelle Entwicklung und offene Linien.",
plan:["Für den Bauern Entwicklung: Sc3, Sf3, Lc4, O-O, De2, Td1.","Offene c- und d-Linien für die Türme.","Typische Ideen: e5-Durchbruch, Sd5 und Lf4.","Den Damentausch vermeiden – Initiative zählt."],
lines:[
["Angenommen, klassisch","e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 d6 Bc4 e6 O-O Nf6 Qe2 Be7 Rd1 e5 h3","Weiß hat Raum und Druck auf der d-Linie; Plan: Le3, Tac1 und Sd5."],
["Mit ...a6","e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 d6 Bc4 a6 O-O Nf6 Qe2 Bg4 Rd1","Weiß spielt h3, Le3 und Tac1 mit aktiven Figuren."],
["Abgelehnt 3...Sf6","e4 c5 d4 cxd4 c3 Nf6 e5 Nd5 cxd4 d6 Nf3 Nc6 Bc4","Weiß hat ein Alapin-artiges Zentrum mit e5; Plan: O-O und De2."],
["Abgelehnt 3...d5","e4 c5 d4 cxd4 c3 d5 exd5 Qxd5 cxd4 Nc6 Nf3 Bg4 Nc3","Isolierter Damenbauer: Weiß spielt Le2, O-O und Le3."]]},
{id:"blackmar",g:"x",side:"w",name:"Blackmar-Diemer-Gambit",eco:"D00",d:"1.d4 d5 2.e4: Weiß opfert einen Bauern für die offene f-Linie und Angriff.",
plan:["f-Linie öffnen und mit Lc4 oder Ld3, O-O und De1–h4 angreifen.","Der Springer e5 ist oft ein Angriffsvorposten.","Material ist zweitrangig, die Initiative entscheidet.","Schwarz muss die Verteidigung genau kennen."],
lines:[
["Euwe 5...e6","d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 e6 Bg5 Be7 Bd3 c5 O-O","Weiß spielt De1–h4 und Tad1 mit Angriff."],
["Bogoljubow 5...g6","d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 g6 Bc4 Bg7 O-O O-O Qe1","Weiß spielt Dh4, Lh6 und Angriff über die f-Linie."],
["Teichmann 5...Lg4","d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Bg4 h3 Bxf3 Qxf3 c6 Be3 e6 Bd3","Weiß hat das Läuferpaar und spielt O-O-O mit Angriff."],
["Gegen 2...e6","d4 d5 e4 e6 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3","Französische Struktur: Weiß hat Raum und spielt Le3 und Dd2."]]},
{id:"halloween",g:"x",side:"w",name:"Halloween-Gambit",eco:"C47",d:"Weiß opfert im Vierspringerspiel einen ganzen Springer für ein riesiges Bauernzentrum.",
plan:["Für die Figur ein großes Bauernzentrum mit d4, e5 und f4.","Die schwarzen Springer immer wieder verjagen.","Schnell Lc4, O-O und Angriff auf f7.","Riskant: Gegen genaue Verteidigung steht Weiß schlechter."],
lines:[
["5...Sg6","e4 e5 Nf3 Nc6 Nc3 Nf6 Nxe5 Nxe5 d4 Ng6 e5 Ng8 Bc4 d5 Bxd5 N8e7 Bb3","Weiß hat das Zentrum und Angriffschancen gegen f7."],
["5...Sc6","e4 e5 Nf3 Nc6 Nc3 Nf6 Nxe5 Nxe5 d4 Nc6 d5 Ne5 f4 Ng6 e5 Ng8 d6","Weiß hat Bauern bis d6 vorgeschoben; Schwarz steht eingeengt."]]},
{id:"englund",g:"x",side:"b",name:"Englund-Gambit",eco:"A40",d:"1.d4 e5?!: Ein Trickgambit mit einer berühmten Mattfalle.",
plan:["Den Bauern e5 mit ...Sc6 und ...De7 zurückgewinnen.","Fallen auf der Diagonale e1–a5 stellen.","Gegen gutes Spiel bleibt Schwarz einen Bauern zurück.","Eine Überraschungswaffe für Blitzpartien."],
lines:[
["Die Falle: 4.Lf4? Db4+","d4 e5 dxe5 Nc6 Nf3 Qe7 Bf4 Qb4+ Bd2 Qxb2 Bc3 Bb4 Qd2 Bxc3 Qxc3 Qc1#","Matt mit ...Dc1#! Weiß hat zu gierig gespielt."],
["4.Dd5","d4 e5 dxe5 Nc6 Nf3 Qe7 Qd5 f6 exf6 Nxf6 Qb3 d5","Schwarz hat Entwicklungsvorsprung für den Bauern."],
["4.Sc3","d4 e5 dxe5 Nc6 Nf3 Qe7 Nc3 Nxe5 e4 Nf6 Nxe5 Qxe5 Bd3 Bc5","Schwarz hat den Bauern zurück und eine gesunde Stellung."]]},
{id:"lettisch",g:"x",side:"b",name:"Lettisches Gambit",eco:"C40",d:"2...f5?!: Das schärfste Gegengambit gegen 2.Sf3.",
plan:["Mit ...f5 sofort e4 angreifen.","Schnelles Gegenspiel über die f-Linie.","Den König notfalls in der Mitte lassen und mit Figuren angreifen.","Objektiv riskant, praktisch gefährlich."],
lines:[
["3.Sxe5 Df6","e4 e5 Nf3 f5 Nxe5 Qf6 d4 d6 Nc4 fxe4 Nc3 Qg6 f3 exf3 Qxf3","Schwarz hat aktive Figuren, aber Entwicklungsrückstand."],
["3.d4","e4 e5 Nf3 f5 d4 fxe4 Nxe5 Nf6 Bg5 d6 Nc4 Be7","Schwarz hat den Bauern e4 und spielt ...O-O."],
["3.exf5","e4 e5 Nf3 f5 exf5 e4 Ne5 Nf6 Be2 d6 Bh5+ Ke7","Der schwarze König steht in der Mitte, aber Schwarz hat Raum und aktive Figuren."]]},
{id:"traxler",g:"x",side:"b",name:"Traxler-Gegenangriff",eco:"C57",d:"4...Lc5!? im Zweispringerspiel: Schwarz ignoriert Sg5 und greift f2 an.",
plan:["Gegenangriff auf f2 statt Verteidigung von f7.","Schnelle Figurenaktivität und offene f-Linie.","Der eigene König steht oft in der Mitte – das gehört zur Idee.","Sehr genau spielen: Ein Tempo entscheidet."],
lines:[
["5.Sxf7 Lxf2+","e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Nxf7 Bxf2+ Kxf2 Nxe4+ Kg1 Qh4 g3 Nxg3 hxg3 Qxg3+ Kf1 Rf8","Schwarz hat starken Angriff gegen den weißen König."],
["5.Lxf7+","e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Bxf7+ Ke7 Bd5 Rf8 O-O d6","Schwarz hat Entwicklung und Druck über die f-Linie."],
["5.d4","e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 d4 d5 dxc5 dxc4 Qxd8+ Nxd8","Damenloses Spiel mit gleichen Chancen."]]}
];

const PLANS = {
italienisch:{plan:["Schnelle Entwicklung, kurze Rochade, dann mit c3 und d4 das Zentrum aufbauen.","Der Läufer c4 zielt auf f7; Sg5-Ideen nur, wenn f7 wirklich schwach ist.","In ruhigen Stellungen (d3) wandert der Springer über d2–f1–g3 an den Königsflügel.","Der Hebel a4 gewinnt Raum am Damenflügel und schafft dem Läufer ein Rückzugsfeld."],
 lp:["Nach dem Abtausch auf d5 hat Weiß einen isolierten Damenbauern: aktive Figuren, Druck über die e-Linie und Angriff am Königsflügel.","Langsames Manövrieren mit Sbd2–f1–g3, h3 und später d4. Wer den richtigen Hebel zuerst findet, steht besser.","Weiß hat einen Mehrbauern, Schwarz Entwicklungsvorsprung. Weiß konsolidiert mit d4 und f4 und hält den Springer auf e5.","Weiß hat nach d5 mehr Raum und spielt c4, Sc3 und später f4 oder Druck am Damenflügel."]},
spanisch:{plan:["Druck auf e5 über den Läufer b5 und später Te1.","Klassischer Aufbau mit c3, h3 und d4 für ein stabiles Zentrum.","Der Springer wandert über d2–f1–g3 an den Königsflügel.","Der Läufer auf b3 oder c2 ist langfristig eine wichtige Angriffsfigur."],
 lp:["Weiß spielt d4, Sbd2–f1–g3 und greift am Königsflügel an; Schwarz sucht Gegenspiel mit ...c5 und ...Sa5.","Schwarz hat einen Bauern geopfert und greift an. Weiß verteidigt mit d4, Te1 und g3 und will das Material behalten.","Damenloses Endspiel: Weiß hat die bessere Bauernmehrheit am Königsflügel, Schwarz das Läuferpaar. Weiß schiebt die Mehrheit langsam vor.","Nach d4 gewinnt Weiß Raum; der Läufer b6 wird mit Lg5 oder a4–a5 befragt.","Schwarz steht passiv. Weiß hat mehr Raum, öffnet mit dxe5 oder d5 und spielt am Königsflügel."]},
schottisch:{plan:["Das Zentrum früh öffnen und den Springer auf d4 zentral halten.","Schnelle Entwicklung mit Le3, Sc3 und Dd2.","Gegen ...Sf6 mit e5 Raum gewinnen und die schwarzen Springer vertreiben.","Auf schwache schwarze Bauern wie die Doppelbauern auf c6 zielen."],
 lp:["Weiß deckt d4 mit c3 und spielt Lc4, O-O und Sd2 – eine gesunde Stellung mit Zentrumskontrolle.","Weiß hat Raum durch e5 und c4; Schwarz hat Doppelbauern, aber aktive Figuren. Weiß spielt g3 und Lg2.","Der Springer auf b3 befragt den Läufer. Weiß gewinnt Raum am Damenflügel mit a4–a5.","Schwarz hat den Bauern, aber sein König steht in der Mitte. Weiß greift mit Sc3, Te1 und Lf3 sofort an."]},
londoner:{plan:["Immer gleicher Aufbau: d4, Lf4, e3, Sf3, c3, Ld3 und Sbd2.","Gegen ...Ld6 wird der Läufer oft nach g3 zurückgezogen.","Später Se5 mit f4 oder Angriff mit h4–h5, wenn Schwarz kurz rochiert.","Gegen ...c5 die Struktur mit c3 halten und dxc5 nur im richtigen Moment."],
 lp:["Klassische Londoner Pyramide. Weiß plant Se5, f4 und Df3 für einen Königsangriff.","Gegen den Königsindischen Aufbau hält Weiß d4 und spielt c3, O-O und später c4 oder e4.","Nach ...c4 ist die Bauernkette fest; Weiß bereitet e4 vor."]},
damengambit:{plan:["Druck auf d5 mit c4, Sc3 und Lg5.","Der Minoritätsangriff b4–b5 gegen die schwarze Bauernkette ist ein Standardplan.","Mit e3, Ld3 und kurzer Rochade solide entwickeln.","Gegen den isolierten Damenbauern das Feld vor ihm (d4) blockieren."],
 lp:["Weiß hält Druck auf d5 und spielt Tc1, cxd5 und später den Minoritätsangriff.","Weiß hat das Zentrum und die bessere Entwicklung: De2, Td1 und dxc5 mit Druck auf der d-Linie.","Weiß hat ein starkes Zentrum mit der Option e4: De2, e4 und Druck in der Mitte.","Schwarz hat einen isolierten Damenbauern. Weiß blockiert d4, tauscht Figuren und greift d5 an.","Weiß hat das Läuferpaar und das Zentrum: Le2, O-O und mit e4 öffnen."]},
englisch:{plan:["Kontrolle von d5 mit c4, Sc3 und Lg2.","Der Damenflügelvorstoß b4–b5 ist typisch.","Weiß bleibt flexibel und wählt erst spät zwischen d3 und d4.","Gegen ...e5 wie ein Sizilianer mit vertauschten Farben spielen."],
 lp:["Umgekehrter Drachen: Weiß greift am Damenflügel mit a3, b4 und Tb1 an.","Das geht ins Damengambit über; Weiß spielt e3, Tc1 und Druck auf d5.","Symmetrisch: Weiß spielt d4 oder a3–b4 für Raum am Damenflügel.","Weiß greift mit Tb1 und b4–b5 am Damenflügel an, Schwarz mit ...f5 am Königsflügel."]},
wiener:{plan:["f4 vorbereiten und die f-Linie öffnen.","Den Springer e4 mit Sf3, d3 oder Df3 bekämpfen.","Schnelle kurze Rochade und Angriff auf f7.","Der Läufer f1 kommt oft nach c4 oder d3."],
 lp:["Weiß hat Raum durch e5; Plan: O-O, Se2 oder De1 und Angriff über die f-Linie.","Damentausch – ein ruhiges Endspiel, in dem Weiß etwas mehr Raum hat.","Der schwarze König steht auf f8; Weiß spielt f4 und Sf3 und greift über die f-Linie an.","Offenes Spiel mit Druck auf der Diagonale und schneller Rochade."]},
najdorf:{plan:["Mit ...a6 das Feld b5 kontrollieren und je nach weißem Aufbau ...e5 oder ...e6 spielen.","Gegenspiel am Damenflügel mit ...b5–b4 und Druck auf der c-Linie.","Sbd7 und Le7 sind die Standardfiguren.","Oft gegenseitige Angriffe: Tempo ist wichtiger als Material."],
 lp:["Weiß rochiert lang und stürmt mit g4–g5. Schwarz greift mit ...b5–b4 und ...Tc8 an.","Sehr scharf: Weiß droht e5 oder f5. Schwarz kontert mit ...b5 und ...Lb7.","Ruhige Stellung: Schwarz kontrolliert d5 mit ...Le6 und spielt ...Sbd7, ...Dc7 und ...b5.","Ruhiger Aufbau: Schwarz spielt ...g6, ...Lg7 und ...O-O mit solidem Spiel.","Schwarz entwickelt mit ...Lg4 oder ...e6 und kämpft gegen das weiße Zentrum.","Geschlossenes System: Schwarz spielt ...Lg7, ...e6 und ...Sge7 und hält d4 unter Kontrolle."]},
drachen:{plan:["Der Läufer g7 zielt über die lange Diagonale auf b2.","Gegenangriff über die c-Linie mit ...Tc8 und dem Qualitätsopfer ...Txc3.","Typisch ist ...Se5–c4, um den weißen Läufer zu tauschen.","Gegen den Königsangriff schnell sein: ...b5 und ...Da5."],
 lp:["Schwarz greift über die c-Linie an: ...Sc4, ...Da5 und das Qualitätsopfer ...Txc3.","Schwarz öffnet das Zentrum mit ...d5 und bekommt nach ...bxc6 Druck über die b-Linie.","Ruhiger Aufbau: Schwarz spielt ...Sa5 oder ...a5 mit stabilem Spiel."]},
franzoesisch:{plan:["Das Zentrum mit ...c5 und ...Sc6 angreifen.","Der Hebel ...f6 gegen den weißen Bauern e5 ist ein Hauptplan.","Den schlechten Läufer c8 über ...b6–La6 oder ...Ld7–e8–h5 aktivieren.","Schwarz spielt meist am Damenflügel, Weiß am Königsflügel."],
 lp:["Schwarz hat die weiße Struktur beschädigt. Plan: ...Da5, ...Sbc6 und Spiel gegen die Doppelbauern.","Schwarz hat den Bauernkeil c4; Plan: ...Sa5, ...Sb3 und ...f6 gegen das Zentrum.","Symmetrische Struktur: Schwarz spielt ...Lg4, ...Te8 und ...c6 mit gleichem Spiel.","Schwarz hat aktives Spiel mit ...Sc6, ...Le7 und ...O-O."]},
carokann:{plan:["Solide Struktur mit ...c6 und ...d5; der Läufer c8 kommt vor ...e6 heraus.","Der Hebel ...c5 befreit das Spiel.","In vielen Linien rochiert Schwarz lang.","Endspiele sind für Schwarz dank guter Bauernstruktur oft angenehm."],
 lp:["Schwarz spielt ...e6, ...Sgf6, ...Le7 oder ...Dc7 und ...O-O-O. Solide, aber mit Raumnachteil.","Schwarz greift das weiße Zentrum mit ...c5 an und baut mit ...Sc6 und ...Sge7 Druck auf.","Ruhige Stellung; Schwarz plant ...Ld6, ...O-O und den Minoritätsangriff ...b5–b4.","Isolierter Damenbauer bei Weiß: Schwarz blockiert d5 und tauscht Figuren.","Schwarz hat das Läuferpaar abgegeben, aber eine sehr solide Struktur: ...Sf6, ...Le7 und ...O-O."]},
skandinavisch:{plan:["Die Dame steht auf a5 oder d6 und wird nicht weiter gejagt.","Solider Aufbau mit ...c6, ...Lf5 und ...e6.","Kurze oder lange Rochade je nach Stellung.","Gegenspiel mit ...Sbd7 und ...c5."],
 lp:["Sehr solide Struktur; Plan: ...Sbd7, ...Lb4 oder ...Le7 und kurze Rochade.","Gleiches Prinzip: ...e6, ...Sbd7 und ...Lb4 mit solidem Spiel.","Schwarz rochiert lang und greift mit ...Lxf3 und ...e5 das Zentrum an.","Schwarz tauscht auf f3, spielt ...Le7 und ...O-O mit ruhigem Spiel."]},
koenigsindisch:{plan:["Erst entwickeln und rochieren, dann mit ...e5 das Zentrum angreifen.","Nach geschlossenem Zentrum (d5) Königsangriff mit ...Se8, ...f5–f4 und ...g5.","Weiß spielt am Damenflügel mit c5 – es ist ein Wettrennen.","Der Läufer g7 wird nie leichtfertig getauscht."],
 lp:["Klassischer Wettlauf: Schwarz spielt ...Se8, ...f5 und greift am Königsflügel an; Weiß mit b4 und c5.","Schwarz bleibt flexibel mit ...a5 und ...Sa6–c5 und spielt später ...f5.","Schwarz hat ...f5 gespielt und will mit ...f4 und ...g5 den Königsflügel öffnen.","Benoni-Struktur: Schwarz greift am Damenflügel mit ...b5 und ...Te8 an.","Ruhiges Spiel: Schwarz bereitet ...exd4 oder ...c6 und ...Te8 vor."]},
nimzo:{plan:["Mit ...Lb4 den Springer c3 fesseln und um e4 kämpfen.","Für das Läuferpaar bekommt Schwarz eine bessere Bauernstruktur.","Typisch sind ...b6–Lb7 und ...d6 mit Blockade.","Gegen Doppelbauern auf c3 und c4 spielt Schwarz ...Sa5 und ...La6."],
 lp:["Schwarz spielt ...Lb7, ...d6 und ...Sbd7 mit Kontrolle über e4.","Klassische Struktur: Schwarz spielt ...dxc4 oder ...cxd4 und hat gutes Figurenspiel.","Schwarz greift die Schwäche c4 mit ...b6, ...La6 und ...Sa5 an.","Weiß will e4 spielen; Schwarz verhindert es mit ...d5 und ...c5.","Schwarz kontrolliert e4 mit ...Lb7, ...O-O und ...d5."]},
slawisch:{plan:["Mit ...c6 d5 stützen und den Läufer c8 vor ...e6 entwickeln.","Den Bauern c4 halten oder mit ...b5 verteidigen, wenn möglich.","Die Hebel ...c5 oder ...e5 befreien das Spiel.","Solide und zäh – Endspiele sind oft gut für Schwarz."],
 lp:["Schwarz plant ...Lg6, ...De7 und ...e5 als Befreiung.","Schwarz spielt ...a6, ...c5 und ...Lb7 mit dynamischem Spiel am Damenflügel.","Symmetrische Struktur: Schwarz entwickelt mit ...e6 und ...Ld6 und tauscht die Läufer.","Schwarz hat eine solide Struktur und die halboffene h-Linie."]},
hollaendisch:{plan:["Mit ...f5 e4 kontrollieren und den Königsflügel angreifen.","Im Leningrader System: ...De8–h5 und ...e5.","Der Läufer g7 ist die Schlüsselfigur.","Vorsicht mit der geschwächten Diagonale e8–h5."],
 lp:["Schwarz plant ...e5, ...Dh5 und ...Sc6 für einen Königsangriff.","Schwarz spielt ...c6, ...e5 und ...De8.","Schwarz hat das Läuferpaar und spielt ...Ld6, ...O-O und ...f5–f4.","Schwarz behält den Mehrbauern und rochiert kurz; Weiß hat Entwicklungsvorsprung."]},
aljechin:{plan:["Die weißen Bauern provozieren und dann mit ...d6 und ...c5 angreifen.","Der Springer b6 und Druck auf d4 sind zentral.","Schwarz spielt oft ...Lg4 und ...e6.","Der Raumnachteil gehört zur Idee – keine Panik."],
 lp:["Schwarz spielt ...Sc6, ...O-O und ...d5 oder ...dxe5 mit Druck auf d4.","Schwarz greift das überdehnte Zentrum mit ...Le7, ...O-O und später ...f6 an.","Pirc-ähnliche Struktur: Schwarz spielt ...Sc6, ...Lf5 und ...e5.","Schwarz hat bequemes Spiel mit ...Sc6, ...e6 und Ideen mit ...c4."]},
gruenfeld:{plan:["Das weiße Zentrum zulassen und dann mit ...c5, ...Sc6 und ...Lg4 angreifen.","Der Läufer g7 zielt auf d4 und die große Diagonale.","Druck auf d4, bis Weiß ihn aufgeben muss.","Im Endspiel spielt Schwarz oft auf den Freibauern am Damenflügel."],
 lp:["Schwarz spielt ...Sc6, ...Td8 und hält den Druck auf d4.","Schwarz spielt ...Lg4 und ...cxd4 mit Druck gegen das weiße Zentrum.","Schwarz hat Initiative am Damenflügel und spielt ...Td8 und ...Sc6.","Schwarz spielt ...Sb6, ...Sc6 und Druck auf d4."]},
pirc:{plan:["Flexibler Aufbau mit ...d6, ...Sf6, ...g6 und ...Lg7.","Das Zentrum mit ...e5 oder ...c5 kontern.","Gegen lange Rochade am Damenflügel mit ...b5 angreifen.","Nicht zu passiv werden."],
 lp:["Nach d5 plant Schwarz ...e6 und ...Te8, um das Zentrum zu öffnen.","Schwarz greift mit ...b5–b4 und ...Sbd7 an, bevor Weiß am Königsflügel durchbricht.","Schwarz spielt ...Sbd7 und ...e5 mit solidem Spiel.","Schwarz spielt ...b5 und ...Sbd7 und bekämpft den Läufer h4 mit ...g5."]},
petrow:{plan:["Spiegelsymmetrie: solide Entwicklung mit ...Le7 und ...O-O.","Der Springer e4 ist ein starker Vorposten, muss aber gestützt werden.","Nach 3.Sxe5 nie sofort ...Sxe4 – zuerst ...d6!","Gleiche Stellungen mit wenig Risiko."],
 lp:["Symmetrisches Spiel; Schwarz hält den Springer e4 und tauscht auf c4.","Weiß rochiert lang; Schwarz spielt ...Sf6 und ...c5 mit Gegenspiel am Damenflügel.","Schwarz entwickelt sich schnell und hat gleiches Spiel.","Schwarz hat eine Figur mehr; der König geht mit ...Kg8 in Sicherheit, Material wird bei Bedarf zurückgegeben."]},
koenigsgambit:{plan:["Die f-Linie öffnen und schnell entwickeln.","Den Bauern f4 zurückgewinnen oder für Angriff opfern.","Kurze Rochade, dann Angriff über f7.","Tempo ist wichtiger als Material."],
 lp:["Weiß hat einen starken Springer auf e5; Plan: Lxf4, O-O und Druck auf f7.","Weiß hat Material für Entwicklung gegeben; Plan: Lxf4 oder Ld3 und O-O.","Weiß hat einen Mehrbauern; Plan: O-O, Le2 und den Mehrbauern halten.","Weiß hat ein schönes Zentrum; Plan: O-O, Te1 und f4–f5."]},
evans:{plan:["Mit b4 Tempo gewinnen, um c3 und d4 zu spielen.","Schnelles Zentrum und Angriff auf f7.","Die Diagonalen a3–f8 und c4–f7 sind die weißen Waffen.","Die Initiative ist wichtiger als der Bauer."],
 lp:["Weiß hat Entwicklung für den Bauern; Plan: La3, Db3 und Angriff in der Mitte.","Weiß hat mehr Raum und spielt Lb5 oder Te1.","Weiß hat ein starkes Zentrum und spielt O-O, Te1 und Sc3.","Weiß hat Raum am Damenflügel gewonnen; Plan: a5, O-O und d3."]},
friedliver:{plan:["Angriff auf f7 mit Sg5 und Lc4.","Nach Sxf7 den schwarzen König im Zentrum halten.","Schnell Sc3, d4 und Te1 für Angriff.","Gegen ...Sa5 lieber Material behalten und konsolidieren."],
 lp:["Weiß hat Material zurückgewonnen und der schwarze König steht im Freien. Plan: d4, Lf4 und Angriff.","Weiß hat einen Mehrbauern; Plan: d4, f4 und den Springer auf e5 halten.","Weiß gewinnt Material und konsolidiert mit d4 und O-O.","Weiß hat einen Bauern mehr und der schwarze König steht in der Mitte. Plan: d4 und Sc3."]},
daenisch:{plan:["Zwei Bauern opfern für zwei aktive Läufer.","Angriff auf f7 und den schwarzen König.","Schnelle Entwicklung mit Sc3, Sf3 und Db3.","Gegen gute Verteidigung ist ein ausgeglichenes Endspiel in Ordnung."],
 lp:["Endspielartig mit gleichem Material; Weiß hat die etwas aktiveren Figuren.","Weiß hat einen isolierten Damenbauern, aber aktive Figuren. Plan: O-O und Le3.","Weiß hat Entwicklung für den Bauern; Plan: O-O, Td1 und Sd5."]},
bird:{plan:["e5 mit f4 und Sf3 kontrollieren.","Das Fianchetto b3–Lb2 zielt auf den Königsflügel.","Später Se5 und Angriff mit g4 oder Df3.","Gegen 1...e5 (From-Gambit) genau spielen."],
 lp:["Weiß plant Se5, Df3 oder De1–h4 mit Angriff am Königsflügel.","Weiß hat den Bauern behalten und Schwarz das Rochaderecht verloren. Weiß spielt Sc3 und Lf4.","Weiß spielt De1–h4 mit Angriff oder c4 mit Damenflügelspiel."]},
budapester:{plan:["Den Bauern e5 schnell zurückgewinnen.","Aktive Figuren: ...Lb4+, ...De7 und ...Sxe5.","Die Mattfalle mit ...Sd3# kennen.","Später ...a5 und ...Ta6–h6 als Turmschwenk."],
 lp:["Schwarz hat den Bauern zurück; Plan: ...O-O, ...a5 und ...Ta6–h6.","Matt! Weiß hat den Läufer geschlagen und übersehen, dass der Bauer e2 gefesselt ist.","Schwarz hat den Bauern zurück und spielt ...d6 und ...Te8.","Schwarz greift das weiße Zentrum mit ...d6 und ...O-O an."],
 notes:{1:{14:"Fehler! Nach axb4 kann der Springer nach d3 springen – der Bauer e2 ist durch die Dame e7 gefesselt.",15:"Matt: Der Bauer e2 darf wegen der Fesselung nicht schlagen."}}},
albin:{plan:["Der Bauer d4 ist ein Keil im weißen Lager.","Lange Rochade und Angriff am Königsflügel mit ...h5–h4.","Entwicklung mit ...Sc6, ...Lg4 und ...Sge7.","Die Lasker-Falle nach 4.e3? kennen."],
 lp:["Schwarz plant ...h5–h4, ...Lh3 und Angriff am Königsflügel.","Schwarz hat aktive Figuren; Plan: ...Sge7–g6 und Rückgewinn von e5.","Die Unterverwandlung mit Schach gewinnt die Dame – Schwarz gewinnt entscheidend Material."],
 notes:{2:{6:"4.e3? ist ein Fehler – jetzt kommt die Lasker-Falle.",13:"Unterverwandlung in einen Springer mit Schach! Eine Dame würde hier nicht Schach geben.",15:"Der Läufer greift über f3 hinweg die Dame d1 an – Schwarz gewinnt sie."}}},
jaenisch:{plan:["Gegenspiel über die f-Linie.","Schnelle Entwicklung mit ...Sf6 und ...Lc5.","Druck auf e4 und den weißen Königsflügel.","Die scharfen Varianten genau kennen."],
 lp:["Schwarz hat aktive Figuren und Angriffschancen gegen den weißen König.","Schwarz hat aktive Figuren und spielt ...d6 und ...O-O.","Schwarz hat den Bauern e4 und spielt ...Lxf5 und ...O-O-O."]},
stafford:{plan:["Schnelle Entwicklung und Fallen rund um f2.","...Lc5, ...Sg4 und ...h5 sind typische Angriffsideen.","Gegen genaues Spiel steht Schwarz schlechter – die Fallen zu kennen ist alles.","Den Springer nie ohne Grund auf e4 stehen lassen."],
 lp:["Matt mit ...Lg4#! Weiß hat die Dame geschlagen und den König verloren.","Schwarz gewinnt die Dame: ...Lg4+ greift durch den König hindurch die Dame d1 an.","Schwarz hat mit ...hxg4 die h-Linie geöffnet und greift an.","Schwarz greift mit ...Sg4 und ...Df6 den Punkt f2 an."],
 notes:{0:{12:"Weiß schlägt die Dame – aber jetzt folgt ein Matt in zwei Zügen.",15:"Matt! Der König hat kein Feld mehr."}}},
benko:{plan:["Bauernopfer für offene a- und b-Linien.","Der Läufer g7 und die Türme auf a8 und b8 drücken auf den Damenflügel.","Typisch sind ...Da5, ...Tfb8 und ...Sbd7–b6.","Endspiele sind wegen des anhaltenden Drucks gut für Schwarz."],
 lp:["Schwarz spielt ...Sbd7, ...Da5 und ...Tfb8 mit langfristigem Druck.","Schwarz hat den Bauern zurück; Plan: ...Le7 und ...O-O.","Schwarz hat den Bauern auf c4 und spielt ...Lg7 und ...O-O."]}
};

const OPENINGS_TRAPS = [
{id:"fallen_w",g:"x",side:"w",name:"Fallen für Weiß",eco:"diverse",d:"Klassische Fallen, die Weiß stellen kann – und zwei, die Weiß kennen muss, um nicht hineinzulaufen.",
plan:["Fallen funktionieren nur, wenn die Stellung sonst gesund bleibt.","Nach einer verpassten Falle normal weiterentwickeln.","Gegen bekannte schwarze Fallen den sicheren Zug kennen."],
lines:[
["Légal-Matt","e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6 Nxe5 Bxd1 Bxf7+ Ke7 Nd5#","Weiß opfert die Dame und setzt mit drei Leichtfiguren matt.",{8:"Scheinbar ein Damenopfer: Der Springer verlässt die Fesselung.",12:"Matt mit drei Leichtfiguren!"}],
["Schäfermatt","e4 e5 Bc4 Nc6 Qh5 Nf6 Qxf7#","Das schnellste Matt nach f7. Gegen ...g6 oder ...De7 funktioniert es nicht – dann hat Weiß die Dame zu früh entwickelt.",{6:"Matt auf f7 – Läufer c4 deckt die Dame."}],
["Monticelli-Falle","d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Bb4+ Bd2 Bxd2+ Qxd2 O-O Nc3 Ne4 Qc2 Nxc3 Ng5","Weiß droht Dxh7# und Lxb7 zugleich und gewinnt Material.",{18:"Doppeldrohung: Dxh7# und Lxb7."}],
["Blackburne-Shilling umgehen","e4 e5 Nf3 Nc6 Bc4 Nd4 Nxd4 exd4 O-O Bc5 c3","Statt Sxe5?? (Falle!) tauscht Weiß ruhig auf d4 und steht besser.",{6:"Nicht 4.Sxe5? – nach 4...Dg5 droht Schwarz viel."}],
["Elefantenfalle vermeiden","d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3 c6 Nf3","Weiß schlägt nicht cxd5 und Sxd5?, weil danach Lxd8 Lb4+ eine Figur kostet.",{8:"Der sichere Zug. cxd5 exd5 Sxd5?? wäre die Elefantenfalle."}]]},
{id:"fallen_b",g:"x",side:"b",name:"Fallen für Schwarz",eco:"diverse",d:"Bekannte Fallen, die Schwarz in populären Eröffnungen stellen kann.",
plan:["Fallen entstehen aus gesunden Zügen – Schwarz riskiert dabei wenig.","Wenn der Gegner nicht hineinfällt, normal weiterspielen.","Typische Motive: Fesselungen, Doppelangriffe und Matt auf h2."],
lines:[
["Elefantenfalle","d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5 Nxd5 Bxd8 Bb4+ Qd2 Bxd2+ Kxd2 Kxd8","Schwarz gewinnt eine Figur: Für die Dame bekommt er Dame, Läufer und Springer zurück.",{10:"Weiß schlägt den scheinbar gefesselten Springer – ein Fehler.",11:"Der Springer war nicht wirklich gefesselt!",13:"Zwischenschach – Schwarz holt die Dame zurück."}],
["Sibirische Falle","e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Qc7 O-O Nf6 Qe2 Ng4 h3 Nd4 Nxd4 Qh2#","Im Smith-Morra-Gambit: Matt auf h2 durch Dame und Springer.",{17:"Der Springer greift die Dame an und öffnet zugleich die Diagonale.",19:"Matt auf h2!"}],
["Blackburne-Shilling-Gambit","e4 e5 Nf3 Nc6 Bc4 Nd4 Nxe5 Qg5 Nxf7 Qxg2 Rf1 Qxe4+ Be2 Nf3#","Ein ersticktes Matt mit dem Springer, nachdem Weiß gierig f7 geschlagen hat.",{6:"Weiß schlägt den Köder.",13:"Ersticktes Matt!"}],
["Noahs Arche","e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Qxd4 c5 Qd5 Be6 Qc6+ Bd7 Qd5 c4","Im Spanier wird der weiße Läufer auf b3 eingesperrt und geht verloren.",{14:"Weiß holt den Bauern zurück – aber jetzt kommt ...c5.",21:"Der Läufer b3 ist gefangen."}]]}
];
const GAMES = [
{id:"opera",title:"Die Opernpartie",players:"Paul Morphy – Herzog Karl & Graf Isouard",year:"Paris 1858",ops:["philidor","e5_schwarz"],moves:"e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#",d:"Die berühmteste Lehrpartie über Entwicklung: Morphy bringt alle Figuren ins Spiel, während Schwarz Zeit verliert, und setzt mit einem Damenopfer matt."},
{id:"immortal",title:"Die Unsterbliche Partie",players:"Adolf Anderssen – Lionel Kieseritzky",year:"London 1851",ops:["koenigsgambit","e5_schwarz"],moves:"e4 e5 f4 exf4 Bc4 Qh4+ Kf1 b5 Bxb5 Nf6 Nf3 Qh6 d3 Nh5 Nh4 Qg5 Nf5 c6 g4 Nf6 Rg1 cxb5 h4 Qg6 h5 Qg5 Qf3 Ng8 Bxf4 Qf6 Nc3 Bc5 Nd5 Qxb2 Bd6 Bxg1 e5 Qxa1+ Ke2 Na6 Nxg7+ Kd8 Qf6+ Nxf6 Be7#",d:"Königsgambit in Reinform: Anderssen opfert beide Türme und die Dame und setzt mit drei Leichtfiguren matt."},
{id:"evergreen",title:"Die Immergrüne Partie",players:"Adolf Anderssen – Jean Dufresne",year:"Berlin 1852",ops:["evans","italienisch"],moves:"e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O d3 Qb3 Qf6 e5 Qg6 Re1 Nge7 Ba3 b5 Qxb5 Rb8 Qa4 Bb6 Nbd2 Bb7 Ne4 Qf5 Bxd3 Qh5 Nf6+ gxf6 exf6 Rg8 Rad1 Qxf3 Rxe7+ Nxe7 Qxd7+ Kxd7 Bf5+ Ke8 Bd7+ Kf8 Bxe7#",d:"Ein Musterbeispiel für das Evans-Gambit: Entwicklungsvorsprung, offene Linien und ein spektakulärer Mattangriff."},
{id:"reti_tartakower",title:"Réti gegen Tartakower",players:"Richard Réti – Savielly Tartakower",year:"Wien 1910",ops:["carokann","gegen_caro_w"],moves:"e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Qd3 e5 dxe5 Qa5+ Bd2 Qxe5 O-O-O Nxe4 Qd8+ Kxd8 Bg5+ Kc7 Bd8#",d:"Eine Miniatur im Caro-Kann: Schwarz schlägt gierig zu und läuft in ein Damenopfer mit Läufermatt."},
{id:"lasker_thomas",title:"Königsjagd von London",players:"Edward Lasker – George Thomas",year:"London 1912",ops:["hollaendisch","gegen_holl_w"],moves:"d4 e6 Nf3 f5 Nc3 Nf6 Bg5 Be7 Bxf6 Bxf6 e4 fxe4 Nxe4 b6 Ne5 O-O Bd3 Bb7 Qh5 Qe7 Qxh7+ Kxh7 Nxf6+ Kh6 Neg4+ Kg5 h4+ Kf4 g3+ Kf3 Be2+ Kg2 Rh2+ Kg1 Kd2#",d:"Nach einem Damenopfer wird der schwarze König über das ganze Brett bis nach g1 gejagt und durch einen Abzug matt gesetzt."}
];

