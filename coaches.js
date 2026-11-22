/* Kurstrainer und Kursthemen.
   Alle Trainer sind erfundene Figuren. Jeder Kurs hat eigene Farben, ein Emblem, ein Hintergrundmuster,
   eigene Rangnamen (Fortschritt) und einen Trainer, der zum Thema passt.
   Platzhalter in Sprüchen: {n} {line} {ch} {rank} {next} {left} {cl} {open} {due} {weak} {ok} {medal} {stop} {progress} */

const COACHES={
  mila:{n:"Mila",r:"Deine erste Trainerin",bg:["#1F8F85","#58C29A"],
    look:{k:"mila",skin:"#F2C9A8",hair:"#7A4A2A",shirt:"#2E9C8F"},
    say:{
      intro:"Hallo, ich bin Mila! Erst zeige ich dir die Züge, dann spielst du sie selbst – Schritt für Schritt.",
      p0:"Lass uns mit dem ersten Kapitel anfangen. Ein paar Varianten am Tag reichen völlig.",
      p1:"Ein guter Anfang! Schon sicher: {clV}.",
      p2:"Du wirst richtig sicher. Noch {leftV} bis „{next}“.",
      p3:"Mehr als die Hälfte geschafft – jetzt lohnt sich das Wiederholen besonders.",
      p4:"Fast fertig! Noch {openV}, dann hast du alles.",
      p5:"Du hast den ganzen Kurs gemeistert. Ich bin stolz auf dich! Eine Prüfung ab und zu hält alles frisch.",
      due:"Heute fällig: {dueV} – das dauert nur ein paar Minuten.",
      weak:"Bei {weakV} hat es noch gehakt. Die üben wir gezielt.",
      tips:["Entwickle zuerst Springer und Läufer, dann die Dame.","Rochiere früh – in der Ecke steht dein König sicherer.","Frag dich vor jedem Zug: Was droht mein Gegner?"],
      start:["Schön, dass du da bist! Heute: {nV}.","Los geht's mit {nV} – ganz in Ruhe."],
      line:["Jetzt kommt „{line}“.","Nächste Variante: „{line}“."],
      good:["Genau so!","Prima, das sitzt.","Richtig – gut aufgepasst."],
      bad:["Nicht schlimm – schau noch einmal genau hin.","Fast! Welche Figur ist noch nicht entwickelt?","Fehler sind zum Lernen da. Probier's nochmal."],
      learned:["Jetzt du – aus dem Gedächtnis!"],
      clean:["Fehlerfrei! {progress}","Wunderbar gespielt. {progress}"],
      dirty:["Mit ein paar Stolperern – sie kommt bald wieder. {progress}"],
      rank:["Du bist jetzt „{rank}“! Weiter so."],
      chapter:["Kapitel „{ch}“ geschafft – eine {stop} mehr!"],
      end:["Alles fehlerfrei – ein toller Tag!","{ok} von {n} fehlerfrei. Morgen sitzt der Rest.","{ok} von {n} – das wird! Morgen wiederholen wir die Wackelkandidaten."],
      rest:"Für heute ist dein Plan erfüllt. Jetzt Pause – im Schlaf festigt sich, was du geübt hast. Morgen geht's weiter!",
      exam:["Medaille: {medal}! Du kannst das Kapitel wirklich.","Diesmal keine Medaille – übe die Varianten und versuch es nochmal."]
    }},
  bruno:{n:"Bruno",r:"Baumeister der Aufbausysteme",bg:["#C9781E","#F0B24A"],
    look:{k:"bruno",skin:"#E0AC86",hair:"#5A3B22",shirt:"#3B6EA5"},
    say:{
      intro:"Moin, ich bin Bruno. Bei mir gibt's keinen Theorie-Wust, sondern einen Bauplan, der gegen fast alles steht.",
      p0:"Die Baustelle ist eingerichtet. Wir legen das Fundament im ersten Kapitel.",
      p1:"Fundament gegossen: {clV} sicher verbaut.",
      p2:"Die Wände wachsen. Noch {leftV} bis „{next}“.",
      p3:"Rohbau steht! Jetzt geht's ans Dach.",
      p4:"Bald ist Richtfest – noch {openV}.",
      p5:"Schlüsselübergabe! Dein Aufbau steht wie eine Eins. Ab und zu eine Prüfung, damit nichts bröckelt.",
      due:"Zum Nachmauern fällig: {dueV}. Kurze Wiederholung, dann hält's.",
      weak:"Risse in {weakV} – die bessern wir gezielt aus.",
      tips:["Ein System lebt vom gleichen Aufbau: erst die Figuren hinstellen, dann über Pläne nachdenken.","Merk dir die Bauernstruktur – sie sagt dir, wohin deine Figuren gehören.","Wenn der Gegner früh angreift: erst die Rochade, dann reagieren."],
      start:["Ran an die Arbeit: {nV} auf dem Plan.","Helm auf! Heute bauen wir {nV}."],
      line:["Bauabschnitt: „{line}“.","Als Nächstes: „{line}“."],
      good:["Sitzt, passt, wackelt nicht.","Stein auf Stein – genau richtig.","Sauber gemauert."],
      bad:["Moment – das steht nicht im Bauplan.","Der Stein passt da nicht hin. Welcher Zug gehört zum Aufbau?","Kein Drama, wir mauern neu."],
      learned:["Bauplan gesehen – jetzt baust du selbst."],
      clean:["Wie mit der Wasserwaage! {progress}","Sauber hochgezogen. {progress}"],
      dirty:["Steht – aber mit Nacharbeit. Die kommt bald wieder. {progress}"],
      rank:["Beförderung: Du bist jetzt „{rank}“!"],
      chapter:["Bauabschnitt „{ch}“ abgenommen!"],
      end:["Alles fehlerfrei – Feierabend mit gutem Gewissen!","{ok} von {n} sauber. Gute Schicht.","{ok} von {n} – morgen bessern wir nach."],
      rest:"Feierabend! Der Beton muss erst aushärten – im Schlaf festigt sich das Gelernte. Morgen bauen wir weiter.",
      exam:["Bauabnahme bestanden: {medal}!","Die Abnahme hat noch Mängel gefunden. Nacharbeiten und nochmal!"]
    }},
  greta:{n:"Greta",r:"Hüterin der Festung",bg:["#4D5B70","#8D9BB2"],
    look:{k:"greta",skin:"#F5D2B8",hair:"#D9A441",shirt:"#5D6B7A"},
    say:{
      intro:"Ich bin Greta. Wer bei mir lernt, steht sicher: feste Mauern zuerst, Abenteuer später.",
      p0:"Noch ist hier nur ein Bauplatz. Lass uns den Grundstein legen.",
      p1:"Die ersten Mauern stehen – {clV} sicher.",
      p2:"Deine Verteidigung wächst. Noch {leftV} bis „{next}“.",
      p3:"Die Festung nimmt Form an. Jetzt halten wir sie instand.",
      p4:"Noch {openV}, dann ist die Mauer geschlossen.",
      p5:"Uneinnehmbar! Halte die Wacht mit einer Prüfung ab und zu.",
      due:"Mauerpflege fällig: {dueV}. Eine kurze Runde Wiederholung.",
      weak:"Brüchige Stellen in {weakV} – die verstärken wir jetzt.",
      tips:["Solide heißt nicht passiv: Erst sicher stehen, dann den richtigen Moment für den Gegenschlag abwarten.","Tausche, wenn du unter Druck stehst – weniger Figuren, weniger Gefahr.","Ein gesunder Bauer im Zentrum ist mehr wert als ein schneller Angriff."],
      start:["Auf die Mauern! {nV} heute.","Ruhig und konzentriert: {nV}."],
      line:["Wachposten: „{line}“.","Jetzt sichern wir „{line}“."],
      good:["Die Mauer hält.","Solide. Genau so.","Kein Durchkommen für den Gegner."],
      bad:["Da ist ein Loch in der Mauer – noch einmal.","Ruhig bleiben. Welcher Zug hält alles zusammen?","Kein Grund zur Eile – such den sicheren Zug."],
      learned:["Jetzt hältst du die Stellung allein."],
      clean:["Nichts kam durch. {progress}","Fest wie Granit. {progress}"],
      dirty:["Gehalten, aber knapp – die üben wir bald noch einmal. {progress}"],
      rank:["Deine Festung wächst: „{rank}“!"],
      chapter:["„{ch}“ ist gesichert – ein {stop} mehr steht."],
      end:["Keine Lücke – vorbildlich!","{ok} von {n} fehlerfrei. Die Mauer steht.","{ok} von {n} – morgen schließen wir die Lücken."],
      rest:"Die Wache für heute ist vorbei. Ruhe festigt die Mauern – im Schlaf verankert sich das Gelernte.",
      exam:["Belagerung abgewehrt: {medal}!","Die Mauer hat nachgegeben. Ausbessern und neu versuchen."]
    }},
  konrad:{n:"Kapitän Konrad",r:"Navigator der großen Pläne",bg:["#244E7A","#4F86BF"],
    look:{k:"konrad",skin:"#E8B896",hair:"#E9E6E1",shirt:"#1F3354"},
    say:{
      intro:"Kapitän Konrad an Deck. Eine Eröffnung ist wie eine Seekarte: Wer den Plan kennt, verliert nie die Richtung.",
      p0:"Leinen los! Unser erstes Ziel ist Kapitel 1.",
      p1:"Wir haben abgelegt – {clV} im Kielwasser.",
      p2:"Guter Wind! Noch {leftV} bis „{next}“.",
      p3:"Halbe Strecke. Jetzt heißt es: Kurs halten.",
      p4:"Land in Sicht! Noch {openV}.",
      p5:"Wir sind im Hafen. Eine Prüfungsfahrt ab und zu hält die Mannschaft in Form.",
      due:"Kurskorrektur fällig: {dueV}.",
      weak:"Vom Kurs abgekommen: {weakV}. Wir steuern gegen.",
      tips:["Kenne den Plan hinter der Eröffnung: Wohin gehören die Bauern, wohin die Figuren?","Strategie ist Geduld. Verbessere deine schlechteste Figur.","Wer das Zentrum beherrscht, bestimmt den Kurs der Partie."],
      start:["Alle Mann an Deck: {nV} auf der Route.","Klar zum Auslaufen – {nV}."],
      line:["Kurs auf „{line}“.","Nächster Hafen: „{line}“."],
      good:["Kurs gehalten.","Sauber navigiert.","Genau nach Karte."],
      bad:["Wir treiben ab – zurück auf Kurs!","Ein Blick auf die Karte: Was ist hier der Plan?","Gegenwind. Noch einmal, ganz ruhig."],
      learned:["Du kennst die Route – jetzt steuerst du."],
      clean:["Präzise Fahrt. {progress}","Ohne Umweg ans Ziel. {progress}"],
      dirty:["Angekommen, aber mit Umwegen – die Route fahren wir bald wieder. {progress}"],
      rank:["Befördert: „{rank}“!"],
      chapter:["„{ch}“ erreicht – {stop} in Sicht!"],
      end:["Fehlerfreie Fahrt – Respekt!","{ok} von {n} auf Kurs. Gute Wache.","{ok} von {n} – morgen korrigieren wir den Kurs."],
      rest:"Heute sind wir weit genug gesegelt. Vor Anker gehen: Im Schlaf festigt sich die Route. Morgen weiter!",
      exam:["Prüfungsfahrt bestanden: {medal}!","Die Prüfungsfahrt ging daneben. Route üben und nochmal raus."]
    }},
  linus:{n:"Linus Langbogen",r:"Meister der langen Diagonale",bg:["#2E7A4C","#6DB585"],
    look:{k:"linus",skin:"#F3D1B0",hair:"#E2C26B",shirt:"#3C7D4A"},
    say:{
      intro:"Linus hier. Ich schieße nicht aus der Nähe – mein Läufer zielt aus der Ecke über das ganze Brett.",
      p0:"Spann die Sehne: Kapitel 1 wartet.",
      p1:"Erste Treffer! {clV} im Ziel.",
      p2:"Deine Pfeile fliegen weiter. Noch {leftV} bis „{next}“.",
      p3:"Mehr als die Hälfte im Ziel. Jetzt geht's um Präzision.",
      p4:"Noch {openV} – du triffst fast alles.",
      p5:"Ins Schwarze, jedes Mal. Eine Prüfung ab und zu hält die Hand ruhig.",
      due:"Probeschuss fällig: {dueV}.",
      weak:"Fehlschüsse in {weakV} – die zielen wir neu ein.",
      tips:["Der Fianchetto-Läufer ist deine stärkste Figur – tausche ihn nicht leichtfertig.","Greif das Zentrum von der Seite an: mit c4, f4 oder …c5 statt mit Bauern direkt davor.","Geduld: Erst die Diagonale öffnen, dann trifft der Läufer."],
      start:["Zielscheibe aufgestellt: {nV}.","Pfeile bereit? {nV} heute."],
      line:["Ziel: „{line}“.","Jetzt anvisieren: „{line}“."],
      good:["Treffer.","Volltreffer!","Genau ins Ziel."],
      bad:["Daneben – ruhig atmen, neu zielen.","Der Pfeil flog vorbei. Welche Diagonale ist wichtig?","Noch einmal anlegen."],
      learned:["Du hast gesehen, wohin es geht. Jetzt schießt du."],
      clean:["Ins Schwarze! {progress}","Kein Fehlschuss. {progress}"],
      dirty:["Getroffen, aber nicht im Zentrum – die üben wir bald wieder. {progress}"],
      rank:["Neuer Rang: „{rank}“!"],
      chapter:["„{ch}“ getroffen – eine {stop} mehr!"],
      end:["Jeder Schuss ein Treffer!","{ok} von {n} im Ziel. Gute Übung.","{ok} von {n} – morgen schärfen wir den Blick."],
      rest:"Genug geschossen für heute. Die Hand braucht Ruhe – im Schlaf festigt sich, was du geübt hast.",
      exam:["Wettkampf gewonnen: {medal}!","Diesmal reicht es nicht aufs Treppchen. Üben und neu antreten."]
    }},
  rex:{n:"Rex",r:"Trainer für Königsangriffe",bg:["#B8322A","#EE7A3C"],
    look:{k:"rex",skin:"#C98B62",hair:"#E0542F",shirt:"#C7372B"},
    say:{
      intro:"Rex mein Name, Angriff mein Spiel! Bei mir lernst du, wie man den gegnerischen König jagt.",
      p0:"Noch kein Schuss gefallen? Dann los – Kapitel 1!",
      p1:"Der Funke ist übergesprungen! {clV} im Kasten.",
      p2:"Es brennt! Noch {leftV} bis „{next}“.",
      p3:"Über die Hälfte – der Angriff rollt!",
      p4:"Noch {openV}, dann steht der König im Feuer.",
      p5:"Phönix! Du hast alles gemeistert. Halte das Feuer mit einer Prüfung am Leben.",
      due:"Abgekühlt: {dueV}. Kurz wiederholen, dann brennt's wieder.",
      weak:"Rohrkrepierer in {weakV} – die schärfen wir jetzt!",
      tips:["Angreifen heißt: mehr Figuren am Königsflügel als der Gegner.","Lange Rochade, dann die Bauern stürmen lassen – g4, h4, h5!","Öffne Linien zum König, auch wenn es einen Bauern kostet."],
      start:["Volle Kraft voraus – {nV}!","Angriff! Heute {nV}."],
      line:["Angriffsziel: „{line}“.","Jetzt geht's los: „{line}“."],
      good:["Bumm! Genau so.","Druck, Druck, Druck!","Das brennt."],
      bad:["Zu zahm! Welcher Zug macht Druck?","Der Angriff stockt – nochmal!","Nicht zögern, nochmal ansetzen."],
      learned:["Gesehen? Jetzt greifst du selbst an!"],
      clean:["Durchgebrochen! {progress}","Wie ein Sturm! {progress}"],
      dirty:["Angekommen, aber mit Stottern – die kommt bald wieder. {progress}"],
      rank:["Feuer frei: Du bist „{rank}“!"],
      chapter:["„{ch}“ erobert!"],
      end:["Alles weggeräumt – fehlerfrei!","{ok} von {n} – starker Angriff.","{ok} von {n} – morgen wird schärfer angegriffen."],
      rest:"Stark gekämpft! Jetzt Pause – auch Angreifer brauchen Schlaf, damit das Gelernte sitzt. Morgen geht's weiter!",
      exam:["Sturm erfolgreich: {medal}!","Der Angriff wurde abgewehrt. Nachladen und nochmal!"]
    }},
  nova:{n:"Nova",r:"Trainerin für Kampfstellungen",bg:["#5631A8","#9B72E8"],
    look:{k:"nova",skin:"#8D5B3E",hair:"#9B6CF0",shirt:"#4B2C83"},
    say:{
      intro:"Hi, ich bin Nova. Ausgeglichen ist langweilig – ich zeige dir Stellungen, in denen es knistert.",
      p0:"Spannung aufbauen: Wir starten mit Kapitel 1.",
      p1:"Es knistert! {clV} geladen.",
      p2:"Die Spannung steigt. Noch {leftV} bis „{next}“.",
      p3:"Halb aufgeladen – jetzt wird's elektrisch.",
      p4:"Noch {openV} bis zur vollen Ladung.",
      p5:"Voll aufgeladen! Eine Prüfung ab und zu hält die Spannung.",
      due:"Ladung verloren: {dueV}. Kurz wiederholen!",
      weak:"Wackelkontakt in {weakV} – den löten wir jetzt.",
      tips:["Ungleichgewicht ist deine Chance: Wer die Stellung besser versteht, gewinnt.","Gegenspiel ist wichtiger als Material – oft ist ein Bauernopfer für Initiative richtig.","Halte die Spannung, statt früh zu tauschen."],
      start:["Strom an! {nV}.","Bereit für Chaos? {nV} heute."],
      line:["Hochspannung: „{line}“.","Jetzt wird's wild: „{line}“."],
      good:["Zack – Treffer!","Volle Energie.","Genau der richtige Funke."],
      bad:["Kurzschluss – nochmal!","Fast. Wo ist das Gegenspiel?","Nicht so zahm – such den aktiven Zug."],
      learned:["Jetzt du – volle Konzentration!"],
      clean:["Blitzsauber! {progress}","Elektrisierend gespielt. {progress}"],
      dirty:["Etwas Funkenflug – die kommt bald wieder. {progress}"],
      rank:["Energielevel: „{rank}“!"],
      chapter:["„{ch}“ voll aufgeladen!"],
      end:["Fehlerfrei – pure Energie!","{ok} von {n}. Starke Ladung!","{ok} von {n} – morgen laden wir nach."],
      rest:"Akku für heute voll geladen. Jetzt abschalten – im Schlaf speichert dein Gehirn die Ladung ab.",
      exam:["Volle Ladung: {medal}!","Die Sicherung ist rausgeflogen. Nochmal aufladen!"]
    }},
  ilka:{n:"Dr. Ilka Glut",r:"Vulkanologin des Sizilianers",bg:["#A6370F","#F08A24"],
    look:{k:"ilka",skin:"#F0C4A0",hair:"#2E2622",shirt:"#E0782C"},
    say:{
      intro:"Dr. Glut, Vulkanforscherin. Sizilianisch ist wie der Ätna: Unter der ruhigen Oberfläche baut sich Druck auf – bis es ausbricht.",
      p0:"Messgeräte bereit. Wir beginnen die Expedition in Kapitel 1.",
      p1:"Erste Messwerte: {clV} stabil.",
      p2:"Der Druck steigt. Noch {leftV} bis „{next}“.",
      p3:"Die Lava steigt – über die Hälfte erforscht.",
      p4:"Kurz vor dem Ausbruch: noch {openV}.",
      p5:"Ausbruch! Du beherrschst den Vulkan. Kontrollmessungen per Prüfung halten das Wissen frisch.",
      due:"Veraltete Messwerte: {dueV}. Kurze Wiederholung.",
      weak:"Unregelmäßigkeiten in {weakV} – die untersuchen wir genauer.",
      tips:["Im Sizilianer hat Schwarz die halboffene c-Linie – nutze sie mit Turm und Dame.","Der Durchbruch …d5 ist oft das Signal zum Ausbruch: Bereite ihn gut vor.","Weiß greift am Königsflügel an, du am Damenflügel – wer schneller ist, gewinnt."],
      start:["Expedition gestartet: {nV}.","Schutzbrille auf – {nV} heute."],
      line:["Messpunkt: „{line}“.","Wir untersuchen „{line}“."],
      good:["Messwert bestätigt.","Exakt nach Lehrbuch.","Der Druck steigt – gut so."],
      bad:["Fehlmessung – nochmal.","Hypothese verworfen. Was sagt die Theorie?","Ruhig, Versuch wiederholen."],
      learned:["Beobachtung abgeschlossen – jetzt dein Experiment."],
      clean:["Eruption nach Plan! {progress}","Messreihe fehlerfrei. {progress}"],
      dirty:["Ergebnis mit Abweichungen – Wiederholung folgt bald. {progress}"],
      rank:["Neue Stufe: „{rank}“!"],
      chapter:["Krater „{ch}“ vollständig kartiert!"],
      end:["Alle Messungen fehlerfrei!","{ok} von {n} sauber gemessen.","{ok} von {n} – morgen wiederholen wir die Versuche."],
      rest:"Messreihe für heute abgeschlossen. Laut Forschung festigt Schlaf das Gelernte – also: Feierabend!",
      exam:["Gutachten bestanden: {medal}!","Die Messungen reichen noch nicht. Weiterforschen und nochmal!"]
    }},
  rika:{n:"Rika Rotsegel",r:"Piratin der Gambits",bg:["#0F6E78","#D9A93A"],
    look:{k:"rika",skin:"#B9784F",hair:"#6B2E1F",shirt:"#F3EEE4"},
    say:{
      intro:"Ahoi! Rika Rotsegel. Ein Bauer über Bord ist kein Verlust – wenn dafür der ganze Schatz winkt.",
      p0:"Anker lichten! Die erste Insel heißt Kapitel 1.",
      p1:"Erste Beute an Bord: {clV}.",
      p2:"Volle Segel! Noch {leftV} bis „{next}“.",
      p3:"Die halbe Schatzkarte ist entschlüsselt.",
      p4:"Der Schatz ist nah – noch {openV}.",
      p5:"Der Schatz gehört dir! Eine Kaperfahrt ab und zu, damit die Klinge scharf bleibt.",
      due:"Rost im Laderaum: {dueV}. Kurz polieren!",
      weak:"Leck in {weakV} – das flicken wir jetzt.",
      tips:["Ein Gambit lohnt sich nur mit Tempo: Entwickle schnell und greif an, bevor der Gegner aufräumt.","Nimmt der Gegner den Bauern, öffnen sich Linien für deine Figuren.","Kennst du die Fallen? Im Gambit verliert der Gegner oft schon im 10. Zug."],
      start:["Klar zum Entern – {nV}!","Ahoi! Heute {nV}."],
      line:["Kurs auf „{line}“!","Nächste Prise: „{line}“."],
      good:["Arr, so geht das!","Volltreffer – Beute!","Gut geentert."],
      bad:["Über Bord damit – nochmal!","Falscher Kurs, Matrose! Wo ist die Initiative?","Nicht kapern lassen – noch ein Versuch."],
      learned:["Du hast die Karte gesehen – jetzt segelst du."],
      clean:["Saubere Kaperfahrt! {progress}","Beute gesichert! {progress}"],
      dirty:["Durchgekommen, aber mit Löchern im Rumpf – die kommt bald wieder. {progress}"],
      rank:["Neuer Titel an Bord: „{rank}“!"],
      chapter:["{stop} „{ch}“ geplündert!"],
      end:["Keine Planke verloren – fehlerfrei!","{ok} von {n} – reiche Beute.","{ok} von {n} – morgen segeln wir nochmal raus."],
      rest:"Genug Beute für heute! Anker werfen – im Schlaf wird die Schatzkarte ins Gedächtnis gebrannt.",
      exam:["Schatz gefunden: {medal}!","Kein Gold diesmal. Karte studieren und nochmal los!"]
    }}
};

/* Themen pro Kurs: Trainer, zwei Farben, Emblem, Muster, Name der Stationen und sechs Ränge */
const COURSE_THEME={
  w_start:{co:"mila",c1:"#1F8F85",c2:"#58C29A",ic:"cap",pat:"dots",stop:"Etappe",rk:["Erstklässler","Fleißiger Schüler","Klassenbester","Musterschüler","Abiturient","Ehrenabsolvent"]},
  b_start:{co:"mila",c1:"#3F4FB8",c2:"#7C8CF0",ic:"moon",pat:"stars",stop:"Sternstation",rk:["Sternschnuppe","Abendstern","Nordstern","Sternbild","Milchstraße","Galaxie"]},
  w_system:{co:"bruno",c1:"#B8681A",c2:"#EDB04A",ic:"brick",pat:"bricks",stop:"Bauabschnitt",rk:["Handlanger","Lehrling","Geselle","Polier","Baumeister","Architekt"]},
  b_system:{co:"bruno",c1:"#3F6680",c2:"#7FA6C2",ic:"bridge",pat:"grid",stop:"Brückenpfeiler",rk:["Nietenzähler","Stahlbauer","Brückenmonteur","Statiker","Brückenmeister","Chefingenieur"]},
  w_quiet_e4:{co:"greta",c1:"#4F7F4B",c2:"#93C08A",ic:"tower",pat:"diag",stop:"Turm",rk:["Grundstein","Palisade","Steinmauer","Wehrturm","Burg","Festung"]},
  b_solid:{co:"greta",c1:"#4D5B70",c2:"#8D9BB2",ic:"shield",pat:"zigzag",stop:"Bastion",rk:["Feldlager","Erdwall","Bollwerk","Zitadelle","Trutzburg","Uneinnehmbar"]},
  b_classic:{co:"konrad",c1:"#244E7A",c2:"#4F86BF",ic:"anchor",pat:"waves",stop:"Hafen",rk:["Kadett","Fähnrich","Leutnant","Kommandant","Kapitän","Admiral"]},
  w_d4:{co:"konrad",c1:"#145E73",c2:"#3E9AB3",ic:"compass",pat:"rings",stop:"Leuchtturm",rk:["Kompassleser","Kartenzeichner","Navigator","Erster Offizier","Kapitän","Flottenführer"]},
  w_flank:{co:"linus",c1:"#2E7A4C",c2:"#6DB585",ic:"target",pat:"diag",stop:"Zielscheibe",rk:["Pfeilschnitzer","Bogenträger","Schütze","Scharfschütze","Meisterschütze","Langbogen-Legende"]},
  w_e4:{co:"konrad",c1:"#7E5A1A",c2:"#D2A24A",ic:"wheel",pat:"waves",stop:"Insel",rk:["Landratte","Deckschrubber","Matrose","Navigator","Kapitän","Weltumsegler"]},
  w_attack:{co:"rex",c1:"#B8322A",c2:"#EE7A3C",ic:"flame",pat:"zigzag",stop:"Angriffswelle",rk:["Funke","Flamme","Feuersturm","Flächenbrand","Inferno","Phönix"]},
  b_counter:{co:"nova",c1:"#7A3BA8",c2:"#D062B8",ic:"bolt",pat:"diag",stop:"Gewitterzelle",rk:["Wetterleuchten","Donnergrollen","Blitzschlag","Gewitter","Superzelle","Sturmkönig"]},
  b_hyper:{co:"linus",c1:"#1F7A6B",c2:"#5CBFA8",ic:"eye",pat:"rings",stop:"Aussichtspunkt",rk:["Späher","Wächter","Bogenschütze","Fernschütze","Adlerauge","Herr der Diagonalen"]},
  b_sharp:{co:"nova",c1:"#5631A8",c2:"#9B72E8",ic:"nova",pat:"stars",stop:"Sonnensystem",rk:["Funken","Kurzschluss","Hochspannung","Kettenreaktion","Supernova","Urknall"]},
  b_sicilian:{co:"ilka",c1:"#A6370F",c2:"#F08A24",ic:"volcano",pat:"dots",stop:"Krater",rk:["Glut","Rauch","Ascheregen","Lavastrom","Ausbruch","Feuerberg"]},
  gambits:{co:"rika",c1:"#0F6E78",c2:"#D9A93A",ic:"flag",pat:"waves",stop:"Insel",rk:["Blinder Passagier","Schiffsjunge","Enterer","Bootsmann","Freibeuter","Piratenkönig"]},
  w_gambit:{co:"rika",c1:"#9C2B22",c2:"#E2873C",ic:"chest",pat:"diag",stop:"Schatzinsel",rk:["Kartenfinder","Schatzsucher","Goldgräber","Schatzjäger","Schatzmeister","Legende der Meere"]},
  b_gambit:{co:"rika",c1:"#33276F",c2:"#1E9C9C",ic:"sail",pat:"waves",stop:"Riff",rk:["Sturmvogel","Seeteufel","Kaperfahrer","Korsar","Schrecken der Meere","Meeresgeist"]}
};
/* Schwellen für die sechs Ränge: Anteil fehlerfrei gelernter Varianten des Kurses */
const RANK_TH=[0,.08,.25,.5,.75,1];

/* Embleme (Linien-Icons, 24×24) */
const CRS_IC={
  cap:"M22 9 12 4 2 9l10 5 10-5z M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5 M22 9v5",
  moon:"M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z M18 3v4 M16 5h4",
  brick:"M3 6h18v12H3z M3 10h18 M3 14h18 M9 6v4 M15 10v4 M9 14v4",
  bridge:"M2 17h20 M4 17v-5 M20 17v-5 M2 12h20 M4 12c3-5 13-5 16 0 M9 12v5 M15 12v5",
  tower:"M5 21V8h3V5h2v3h4V5h2v3h3v13z M10 21v-4a2 2 0 0 1 4 0v4",
  shield:"M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z M12 8v8 M8 12h8",
  anchor:"M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M12 7v14 M5 13a7 7 0 0 0 14 0 M3 13h4 M17 13h4",
  compass:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M15.5 8.5l-2 5-5 2 2-5z",
  target:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 12l8-8 M17 4h3v3",
  wheel:"M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 2v20 M2 12h20 M5 5l14 14 M19 5 5 19",
  flame:"M12 22c4 0 7-3 7-7 0-4-3-6-4-9-1 2-2 3-3 3 0-2-1-4-3-6 0 4-4 6-4 11 0 5 3 8 7 8z",
  bolt:"M13 2 4 14h7l-1 8 9-12h-7z",
  eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  nova:"M12 2v5 M12 17v5 M2 12h5 M17 12h5 M5 5l3.5 3.5 M15.5 15.5 19 19 M19 5l-3.5 3.5 M8.5 15.5 5 19 M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  volcano:"M2 21 9 9h6l7 12z M9 9l1.5 3 1.5-2 1.5 2L15 9 M10 6c0-2 1-3 2-3 M14 5c1-1 2-1 3-1",
  flag:"M5 21V3 M5 4h13l-3 4 3 4H5",
  chest:"M3 10h18v10H3z M3 10a9 5 0 0 1 18 0 M3 14h18 M11 13h2v3h-2z",
  sail:"M4 18h16l-2 3H6z M12 3v15 M12 4l7 11h-7 M12 6l-5 9h5",
  redo:"M3 12a9 9 0 1 0 3-6.7 M3 4v5h5",
  medal:"M8 3h8l-2 6h-4z M12 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 13v4"
};
const crsIcon=(k,s)=>`<svg width="${s||24}" height="${s||24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${CRS_IC[k]||CRS_IC.cap}"/></svg>`;

/* Hintergrundmuster (weiß, halbtransparent) */
const CRS_PAT={
  dots:["18","18","<circle cx='3' cy='3' r='1.6' fill='#fff' fill-opacity='.22'/>"],
  stars:["44","44","<path d='M11 4l1.3 4.2L16.5 9.5l-4.2 1.3L11 15l-1.3-4.2L5.5 9.5l4.2-1.3z' fill='#fff' fill-opacity='.2'/><circle cx='33' cy='31' r='1.4' fill='#fff' fill-opacity='.25'/><circle cx='30' cy='8' r='.9' fill='#fff' fill-opacity='.25'/>"],
  bricks:["32","16","<path d='M0 .5h32M0 8.5h32M8 0v8M24 8v8' stroke='#fff' stroke-opacity='.17' fill='none'/>"],
  grid:["22","22","<path d='M0 .5h22M.5 0v22' stroke='#fff' stroke-opacity='.15' fill='none'/>"],
  diag:["14","14","<path d='M-2 16 16-2M-2 2 2-2M12 16l4-4' stroke='#fff' stroke-opacity='.12' stroke-width='3'/>"],
  zigzag:["24","14","<path d='M0 10l6-6 6 6 6-6 6 6' fill='none' stroke='#fff' stroke-opacity='.16' stroke-width='2'/>"],
  waves:["40","16","<path d='M0 8c5-6 15-6 20 0s15 6 20 0' fill='none' stroke='#fff' stroke-opacity='.17' stroke-width='2'/>"],
  rings:["56","56","<circle cx='28' cy='28' r='11' fill='none' stroke='#fff' stroke-opacity='.14' stroke-width='2'/><circle cx='28' cy='28' r='22' fill='none' stroke='#fff' stroke-opacity='.08' stroke-width='2'/>"]
};
const crsPat=k=>{const p=CRS_PAT[k]||CRS_PAT.dots;return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${p[0]}' height='${p[1]}'>${p[2]}</svg>`)}")`};

/* Trainer-Gesicht als SVG. mood: neutral, happy, joy, worry */
function coachSvg(id,mood){
  const C=COACHES[id]||COACHES.mila,L=C.look,sk=L.skin,hr=L.hair;
  const dark="#2B2321",lip="#7A3B2E";
  const brow=mood==="worry"?"M24.5 25.2q2.6-.2 5-1.6 M34.5 23.6q2.4 1.4 5 1.6":mood==="joy"?"M24.5 24.6q2.5-2.2 5-.4 M34.5 24.2q2.5-1.8 5 .4":"M24.5 25.3q2.5-1.5 5 0 M34.5 25.3q2.5-1.5 5 0";
  const mouth=mood==="joy"?`<path d="M26.5 35.2h11q-.6 5.6-5.5 5.6t-5.5-5.6z" fill="${lip}"/><path d="M28.5 35.2h7v1.4h-7z" fill="#fff" opacity=".9"/>`
    :mood==="happy"?`<path d="M27 35.6q5 4.4 10 0" stroke="${lip}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`
    :mood==="worry"?`<path d="M28.5 38q3.5-2.4 7 0" stroke="${lip}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`
    :`<path d="M28.5 36.6q3.5 1.6 7 0" stroke="${lip}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
  const eyeL=`<ellipse cx="27" cy="30.5" rx="1.7" ry="${mood==="joy"?1.2:2}" fill="${dark}"/>`,eyeR=`<ellipse cx="37" cy="30.5" rx="1.7" ry="${mood==="joy"?1.2:2}" fill="${dark}"/>`;
  let back="",top="",extra="",beard="",eyes=eyeL+eyeR;
  const shirt=`<path d="M7 66c1-13 11-20 25-20s24 7 25 20z" fill="${L.shirt}"/>`;
  switch(L.k){
    case "mila":
      back=`<path d="M18.5 34c-2.5-13 4-20 13.5-20s16 7 13.5 20z" fill="${hr}"/>`;
      top=`<circle cx="32" cy="12.6" r="5.4" fill="${hr}"/><path d="M18.6 29.5c.3-9.4 6-15 13.4-15s13.1 5.6 13.4 15c-3-5.2-7-8.2-12-8.4-2.2 2.6-7 4.6-14.8 8.4z" fill="${hr}"/>`;
      extra=`<g fill="none" stroke="#3A2F2A" stroke-width="1.3"><circle cx="27" cy="30.4" r="3.7"/><circle cx="37" cy="30.4" r="3.7"/><path d="M30.7 30.2h2.6"/></g>`;
      break;
    case "bruno":
      beard=`<path d="M19.5 31c.2 9.5 5.6 14 12.5 14s12.3-4.5 12.5-14c-2.2 4-5.6 5.6-12.5 5.6S21.7 35 19.5 31z" fill="#6B4A2E"/>`;
      top=`<path d="M17.5 25c0-9 6.6-14 14.5-14s14.5 5 14.5 14z" fill="#F2B705"/><path d="M32 11.2v13.6" stroke="#D99A00" stroke-width="2.2"/><rect x="14" y="23.6" width="36" height="3.8" rx="1.9" fill="#E0A500"/>`;
      break;
    case "greta":
      back=`<g fill="${hr}"><ellipse cx="18.2" cy="38" rx="3.1" ry="4.2"/><ellipse cx="17.6" cy="45.4" rx="2.7" ry="3.6"/><ellipse cx="45.8" cy="38" rx="3.1" ry="4.2"/><ellipse cx="46.4" cy="45.4" rx="2.7" ry="3.6"/></g>`;
      top=`<path d="M18.5 31c-1-11.4 5-17.2 13.5-17.2S46.5 19.6 45.5 31c-1.6-6.2-6.2-9.6-13.5-9.6S20.1 24.8 18.5 31z" fill="${hr}"/><path d="M19.6 24.2q12.4-6.4 24.8 0" stroke="#C9CED6" stroke-width="2.2" fill="none"/><circle cx="32" cy="21.1" r="1.8" fill="#5BA4E6" stroke="#C9CED6" stroke-width="1"/>`;
      break;
    case "konrad":
      beard=`<path d="M19.4 30.4c.5 9.6 6 15.2 12.6 15.2s12.1-5.6 12.6-15.2c-2.5 3.6-6 5.1-12.6 5.1s-10.1-1.5-12.6-5.1z" fill="${hr}"/><path d="M27 35q5-2.8 10 0-5 1.2-10 0z" fill="#D6D0C6"/>`;
      top=`<path d="M17.5 23c0-6.6 6.5-10.4 14.5-10.4S46.5 16.4 46.5 23z" fill="#F4F2EE"/><rect x="17" y="21.2" width="30" height="4.2" rx="1.6" fill="#1F3354"/><circle cx="32" cy="23.3" r="2.1" fill="#E2B33C"/><path d="M19.2 25.4h25.6c-1.6 2.4-4.4 3.2-12.8 3.2s-11.2-.8-12.8-3.2z" fill="#16202E"/>`;
      break;
    case "rex":
      top=`<path d="M18 28l-1.4-9.5 5.2 4 1.8-9.5 5.2 6.2L32 9.6l3.2 9.6 5.2-6.2 1.8 9.5 5.2-4L46 28c-3.2-4.2-8-6.4-14-6.4s-10.8 2.2-14 6.4z" fill="${hr}"/><rect x="18.6" y="22.6" width="26.8" height="4" rx="2" fill="#FFF"/><rect x="18.6" y="24" width="26.8" height="1.2" fill="#C7372B"/>`;
      break;
    case "nova":
      back=`<path d="M14.5 34c-3.5-15 6-24.6 17.5-24.6S53 19 49.5 34l-3.2-6-1 5.2-3.2-8.4-2 4.2-3.2-6.2-3 5.2-3-5.2-2 4.2-3.2-6.2-2.2 7.2z" fill="${hr}"/>`;
      top=`<path d="M19.6 25.6q6-6.4 12.4-3.2 5.6-4.2 12.4 3.2-6.4-2-12.4-1-6-1-12.4 1z" fill="${hr}"/>`;
      extra=`<path d="M18.6 35.6l-1.6 3.1h2.2l-1.6 3.1" stroke="#FFD34D" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M45.4 35.6l-1.6 3.1h2.2l-1.6 3.1" stroke="#FFD34D" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
      break;
    case "ilka":
      top=`<path d="M18 33c-1.2-12.4 5-18.6 14-18.6s15.2 6.2 14 18.6c-.8-3-2-4.4-3-5.4 0-4.2-4.2-7.2-11-7.2s-11 3-11 7.2c-1 1-2.2 2.4-3 5.4z" fill="${hr}"/><rect x="19.4" y="18.8" width="25.2" height="7" rx="3.5" fill="#3A3A3A"/><circle cx="26.8" cy="22.3" r="3.9" fill="#F59E0B" stroke="#3A3A3A" stroke-width="1.6"/><circle cx="37.2" cy="22.3" r="3.9" fill="#F59E0B" stroke="#3A3A3A" stroke-width="1.6"/><circle cx="25.6" cy="21.2" r="1" fill="#FFF" opacity=".7"/><circle cx="36" cy="21.2" r="1" fill="#FFF" opacity=".7"/>`;
      break;
    case "rika":
      back=`<path d="M18.4 30c-2.4 8.4-1.6 16.6 2 21h7.6V38z M45.6 30c2.4 8.4 1.6 16.6-2 21H36V38z" fill="${hr}"/>`;
      top=`<path d="M11.5 23c6.4 2.4 10.4-1 20.5-1s14.1 3.4 20.5 1c-2-8.4-10.2-12.6-20.5-12.6S13.5 14.6 11.5 23z" fill="#2B2B2B"/><path d="M11.5 23c6.4 2.4 10.4-1 20.5-1s14.1 3.4 20.5 1" stroke="#E2B33C" stroke-width="1.6" fill="none"/>`;
      extra=`<path d="M21.5 24.5 42.5 31.5" stroke="#1E1E1E" stroke-width="1.2"/><ellipse cx="37" cy="30.6" rx="3.5" ry="3.1" fill="#1E1E1E"/>`;
      eyes=eyeL;
      break;
    case "linus":
      back=`<path d="M12.5 42c-1.4-18 7-30 19.5-30s20.9 12 19.5 30c-3.2-2.8-6.2-5.4-7.4-9.4 0-8.4-5-12.8-12.1-12.8s-12.1 4.4-12.1 12.8c-1.2 4-4.2 6.6-7.4 9.4z" fill="#2F6B3D"/><path d="M45 15q9-6.4 11-13-6.4 4.4-13 9.6z" fill="#E8D9A8"/>`;
      top=`<path d="M20.4 25q5.4-6.4 11.6-4.2 6.2-2.2 11.6 4.2-5.6-2.2-11.6-1.2-6-1-11.6 1.2z" fill="${hr}"/>`;
      break;
  }
  const head=`<path d="M27 40h10v8.4c0 2-2.2 3.2-5 3.2s-5-1.2-5-3.2z" fill="${sk}" opacity=".88"/><circle cx="19.2" cy="31.2" r="3" fill="${sk}"/><circle cx="44.8" cy="31.2" r="3" fill="${sk}"/><ellipse cx="32" cy="29.4" rx="13" ry="14.4" fill="${sk}"/>`;
  const cheeks=`<circle cx="23.6" cy="34.4" r="2.3" fill="#F0846F" opacity=".28"/><circle cx="40.4" cy="34.4" r="2.3" fill="#F0846F" opacity=".28"/>`;
  return `<svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">${shirt}${back}${head}${cheeks}${eyes}<path d="${brow}" stroke="${dark}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>${beard}${mouth}${top}${extra}</svg>`;
}
