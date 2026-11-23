/* Trainer als Figuren: Brustbilder mit Outfit, Markenzeichen und teils einem tierischen Begleiter.
   Alle Trainer sind erfundene Figuren. Zeichenfläche 200×220, Kopf um (100,92).
   Ausschnitte: "face" (Kopf und Schultern, für runde Avatare) und "bust" (ganzes Brustbild mit Begleiter).
   Stimmungen: neutral, happy, joy, worry, think, wow */

/* Steckbriefe: voller Name, Titel, Motto, Begleiter, Fakten und Charakterwerte (0–10) */
const TRAINER={
  mila:{nick:"Mila",full:"Mila Morgenstern",title:"Schachlehrerin und Sternguckerin",motto:"Jeder Großmeister hat mal mit dem ersten Zug angefangen.",
    buddy:"Professor Uhu – eine Eule, die jeden Fehler sieht",
    facts:[["Spezialität","Erklären, bis es Klick macht"],["Lieblingsfigur","Der Springer – er hüpft über alles drüber"],["Geheimwaffe","Eselsbrücken für jede Variante"]],
    stats:[["Geduld",10],["Erklären",10],["Humor",7],["Angriffslust",4]]},
  bruno:{nick:"Bruno",full:"Bruno Betonfest",title:"Baumeister der Aufbausysteme",motto:"Erst das Fundament, dann das Feuerwerk.",
    facts:[["Spezialität","Aufbauten, die gegen alles stehen"],["Lieblingsfigur","Der Turm – solide wie eine Mauer"],["Markenzeichen","Bleistift hinterm Ohr, Hammer griffbereit"]],
    stats:[["Stabilität",10],["Kraft",9],["Geduld",8],["Theorie-Liebe",2]]},
  greta:{nick:"Greta",full:"Greta Eisenwall",title:"Hüterin der Festung",motto:"Hier kommt keiner durch.",
    facts:[["Spezialität","Stellungen, die nicht einstürzen"],["Lieblingsfigur","Der König – hinter dicken Mauern"],["Markenzeichen","Die Narbe über der Braue – von einem Läuferopfer, das nicht durchkam"]],
    stats:[["Verteidigung",10],["Disziplin",10],["Geduld",9],["Risiko",2]]},
  konrad:{nick:"Konrad",full:"Kapitän Konrad Kompass",title:"Navigator der großen Pläne",motto:"Wer den Plan kennt, kennt den Kurs.",
    facts:[["Spezialität","Strategische Pläne und ruhiges Steuern"],["Lieblingsfigur","Die Dame – das Flaggschiff"],["Seemannsgarn","Hat angeblich ein Endspiel mitten im Orkan gewonnen"]],
    stats:[["Planung",10],["Erfahrung",10],["Ruhe",9],["Tempo",4]]},
  linus:{nick:"Linus",full:"Linus Langbogen",title:"Meister der langen Diagonale",motto:"Die lange Diagonale trifft immer.",
    facts:[["Spezialität","Fianchetto-Läufer aus dem Hinterhalt"],["Lieblingsfigur","Der Läufer – schießt übers ganze Brett"],["Markenzeichen","Die Feder an der Kapuze – für jeden Treffer eine Kerbe im Bogen"]],
    stats:[["Präzision",10],["Weitblick",9],["Geduld",8],["Nahkampf",3]]},
  rex:{nick:"Rex",full:"Rex Flammenherz",title:"Trainer für Königsangriffe",motto:"Angriff ist die beste Verteidigung!",
    facts:[["Spezialität","Königsangriffe mit allem, was geht"],["Lieblingsfigur","Die Dame – immer vorne mit dabei"],["Markenzeichen","Das Stirnband – trägt es seit seinem ersten Matt in zwölf Zügen"]],
    stats:[["Angriff",10],["Mut",10],["Lautstärke",9],["Geduld",2]]},
  nova:{nick:"Nova",full:"Nova Sternfeuer",title:"Pilotin für scharfe Stellungen",motto:"Je schärfer die Stellung, desto heller leuchte ich.",
    buddy:"Bit – ein kleiner Roboter, der Varianten in Lichtgeschwindigkeit rechnet",
    facts:[["Spezialität","Taktik im Höchsttempo"],["Lieblingsfigur","Der Springer – taucht aus dem Nichts auf"],["Geheimwaffe","Der Gegenangriff im Hyperraum"]],
    stats:[["Taktik",10],["Tempo",9],["Risiko",9],["Ruhe",3]]},
  ilka:{nick:"Ilka",full:"Dr. Ilka Glut",title:"Vulkanologin des Sizilianers",motto:"Wo es brodelt, wird es spannend.",
    facts:[["Spezialität","Sizilianische Ausbrüche messen – und auslösen"],["Lieblingsfigur","Der c-Bauer – er bringt alles ins Rollen"],["Markenzeichen","Hitzebrille auf der Stirn, Ruß auf der Wange"]],
    stats:[["Forschergeist",10],["Hitze",10],["Mut",9],["Ordnung",2]]},
  rika:{nick:"Rika",full:"Kapitänin Rika Rotsegel",title:"Piratin der Gambits",motto:"Ein Bauer über Bord – und die Beute gehört uns!",
    buddy:"Gambit – ein Papagei, der bei jedem Opfer „Arrr!“ ruft",
    facts:[["Spezialität","Gambits, Überfälle und Fallen"],["Lieblingsfigur","Der Bauer – am liebsten über Bord"],["Markenzeichen","Augenklappe, Goldzahn und Papagei Gambit"]],
    stats:[["Wagemut",10],["List",9],["Beute",8],["Pünktlichkeit",2]]}
};

/* ---- Zeichen-Bausteine ---- */
const _P=(d,f,x)=>`<path d="${d}" fill="${f}"${x?" "+x:""}/>`;
const _S=(d,c,w,x)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${x?" "+x:""}/>`;
const _C=(cx,cy,r,f,x)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"${x?" "+x:""}/>`;
const _E=(cx,cy,rx,ry,f,x)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}"${x?" "+x:""}/>`;
const TR_FACE={
  oval:["M100 47C124 47 140 65 140 92C140 116 126 136 100 139C74 136 60 116 60 92C60 65 76 47 100 47Z","M100 47C124 47 140 65 140 92C140 116 126 136 100 139C118 131 130 115 131 92C132 69 120 53 100 47Z"],
  square:["M100 47C126 47 141 65 141 92C141 112 135 128 120 136Q110 140 100 140Q90 140 80 136C65 128 59 112 59 92C59 65 74 47 100 47Z","M100 47C126 47 141 65 141 92C141 112 135 128 120 136Q110 140 104 140C120 132 131 115 132 92C133 69 120 53 100 47Z"]
};
const TR_TORSO="M16 222C18 184 46 160 84 151H116C154 160 182 184 184 222Z";
/* Kopf: Ohren, Hals, Gesicht mit Schattenseite */
function _trHead(o){
  const F=TR_FACE[o.jaw||"oval"],nw=o.neck||14;
  return `${_P(`M${100-nw} 120V151Q100 159 ${100+nw} 151V120Z`,o.sk)}${_P(`M${100-nw} 125Q100 143 ${100+nw} 125V139Q100 150 ${100-nw} 139Z`,"#000",'opacity=".13"')}
  ${_E(60.5,97,7.5,10.5,o.sk)}${_E(139.5,97,7.5,10.5,o.sk)}${_E(61.5,97,3.4,5.8,o.sh,'opacity=".7"')}${_E(138.5,97,3.4,5.8,o.sh,'opacity=".7"')}
  ${_P(F[0],o.sk)}${_P(F[1],"#000",'opacity=".07"')}${_E(86,64,13,6,"#fff",'opacity=".14"')}`;
}
/* Augen mit Glanzpunkten. o.lid: Oberlid 0–1 (cool/verschmitzt), o.lash: Wimpern, o.only: nur ein Auge ("L") */
function _trEyes(m,o){
  const dk=o.dark||"#2A1D1A";
  const one=(cx,cy,side)=>{
    if(m==="joy")return _S(`M${cx-9} ${cy+2.5}Q${cx} ${cy-8.5} ${cx+9} ${cy+2.5}`,dk,3.6);
    const ry=m==="wow"?11.8:10.4,ir=m==="wow"?5.6:6.8,lk=o.look||[0,0];
    const dx=lk[0]+(m==="think"?2.2:0),dy=lk[1]+(m==="think"?-2.4:m==="worry"?-.8:0);
    const lid=m==="wow"?0:m==="worry"?Math.min(o.lid||0,.12):(o.lid||0);
    let s=`<g class="ey">${_E(cx,cy,9.6,ry,"#fff")}${_C(cx+dx,cy+dy+1,ir,o.iris)}${_C(cx+dx,cy+dy+1,(ir*.5).toFixed(2),"#140F0F")}${_C(cx+dx+2.5,cy+dy-2.2,2.3,"#fff")}${_C(cx+dx-2.3,cy+dy+3.6,1.05,"#fff",'opacity=".85"')}`;
    if(lid>0){const ly=cy-ry+lid*ry*1.5;s+=_P(`M${cx-11} ${cy-ry-2}H${cx+11}V${ly}Q${cx} ${ly-3} ${cx-11} ${ly+1.5}Z`,o.sk)+_S(`M${cx-10.5} ${ly+1.2}Q${cx} ${ly-3.2} ${cx+10.5} ${ly}`,dk,3.2)}
    else s+=_S(`M${cx-10.6} ${cy-1}Q${cx} ${cy-ry-3.2} ${cx+10.6} ${cy-1}`,dk,3.2);
    if(o.lash)s+=_S(`M${cx+side*10.2} ${cy-3.5}l${side*4.2} -3.4`,dk,2.4);
    return s+"</g>"};
  return (o.only==="L"?"":one(118,96,1))+one(82,96,-1);
}
/* Augenbrauen: o.w Dicke, o.raise einseitig hochgezogen ("L"/"R"), o.angry kampflustig */
function _trBrows(m,o){
  const y=o.y||80,w=o.w||4.6,c=o.c;
  const shape=(lift,tilt)=>[`M71 ${y+tilt}Q81 ${y-5-lift} 91 ${y-1-lift-tilt}`,`M129 ${y+tilt}Q119 ${y-5-lift} 109 ${y-1-lift-tilt}`];
  let L,R;
  if(m==="worry"){L=`M71 ${y+1}Q81 ${y-1} 91 ${y-6}`;R=`M129 ${y+1}Q119 ${y-1} 109 ${y-6}`}
  else if(m==="wow"){[L,R]=shape(6,0)}
  else if(m==="joy"||m==="happy"){[L,R]=shape(2.5,0)}
  else if(o.angry&&m!=="think"){L=`M71 ${y-3}Q81 ${y-3} 91 ${y+2}`;R=`M129 ${y-3}Q119 ${y-3} 109 ${y+2}`}
  else{[L,R]=shape(0,0)}
  if(m==="think"||o.raise){const up=`M129 ${y-1}Q119 ${y-11} 109 ${y-5}`,upL=`M71 ${y-1}Q81 ${y-11} 91 ${y-5}`;if(o.raise==="L")L=upL;else R=up}
  return _S(L,c,w)+_S(R,c,w);
}
/* Mund: o.smirk schiefes Grinsen, o.gold Goldzahn */
function _trMouth(m,o){
  const y=o.y||121,lip=o.lip||"#A04A3E",dk="#4A1A17";let s;
  switch(m){
    case "joy":s=_P(`M85 ${y-3}Q100 ${y-6} 115 ${y-3}Q114 ${y+16} 100 ${y+16}Q86 ${y+16} 85 ${y-3}Z`,dk)+_P(`M88 ${y-2.6}Q100 ${y-5} 112 ${y-2.6}L111 ${y+1.8}Q100 ${y+.2} 89 ${y+1.8}Z`,"#fff")+_P(`M92 ${y+12.5}Q100 ${y+5} 108 ${y+12.5}Q100 ${y+16} 92 ${y+12.5}Z`,"#E46A6A");break;
    case "happy":s=_P(`M87 ${y-2}Q100 ${y+2.5} 113 ${y-3}Q111 ${y+10} 100 ${y+10}Q89 ${y+10} 87 ${y-2}Z`,dk)+_P(`M89.5 ${y-1.4}Q100 ${y+2} 110.5 ${y-2.2}L110 ${y+2}Q100 ${y+4.6} 90 ${y+2.4}Z`,"#fff");break;
    case "worry":s=_S(`M89 ${y+4}Q94.5 ${y-1} 100 ${y+1.6}Q105.5 ${y+4.4} 111 ${y}`,lip,3.1);break;
    case "think":s=_S(`M92 ${y+2.5}Q102 ${y+.5} 109 ${y-3.5}`,lip,3.1);break;
    case "wow":s=_E(100,y+3.5,5.4,7,dk)+_E(100,y+7.5,3.2,2.2,"#E46A6A");break;
    default:s=o.smirk?_S(`M89 ${y+1.5}Q100 ${y+6} 112 ${y-4}`,lip,3.3):_S(`M88.5 ${y}Q100 ${y+8.5} 111.5 ${y-.5}`,lip,3.3);
  }
  if(o.gold&&(m==="joy"||m==="happy"))s+=`<rect x="103" y="${y-2.4}" width="5" height="4.2" rx="1" fill="#F2C94C"/>`;
  return `<g class="mo">${s}</g>`;
}
const _trNose=sh=>_S("M101 101Q96.5 110.5 99.5 113.4Q102.5 114.6 106 112.4",sh,2.7);
const _trBlush=(op)=>_E(72,113,7.5,4.2,"#F07A69",`opacity="${op||.26}"`)+_E(128,113,7.5,4.2,"#F07A69",`opacity="${op||.26}"`);
const _trFreckles=c=>[[76,108],[80.5,111.5],[86,109],[114,109],[119.5,111.5],[124,108],[96,104],[104,104]].map(p=>_C(p[0],p[1],1.15,c)).join("");
/* Bauer im Kleinformat (für Anstecker, Hut, Emblem) */
const _trPawn=(x,y,s,f)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${f}"><circle cx="0" cy="-9" r="4.2"/><path d="M-3.6-4.6h7.2l1.4 8.6h-10z"/><rect x="-6.2" y="3.6" width="12.4" height="3.2" rx="1.4"/></g>`;
const _trRook=(x,y,s,f)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${f}"><rect x="-6" y="4" width="12" height="3" rx="1"/><path d="M-4.5 4l1-9h7l1 9z"/><path d="M-5.6-8h3v2.4h2V-8h1.2v2.4h2V-8h3v4h-11.2z"/></g>`;
const _trFlame=(x,y,w,h,c)=>`<path d="M${x} ${y}c${-w} ${-h*.35} ${-w*.55} ${-h*.75} 0 ${-h}c${w*.12} ${h*.28} ${w*.75} ${h*.42} ${w*.62} ${h*.7}c${-.05*w} ${h*.18} ${-.2*w} ${h*.26} ${-.62*w} ${h*.3}z" fill="${c}"/>`;

/* ---- Die Figuren ---- */
const TR_ART={
  /* Mila Morgenstern: Dutt mit Bleistift, runde Brille, Sommersprossen, Strickjacke mit Bauern-Anstecker, Buch und Eule */
  mila(m,full){
    const sk="#F7D0B2",sh="#DDA582",hr="#8A4B2A",hd="#6B3820",hl="#B06A40";
    let s="";
    s+=`<g transform="rotate(-24 100 32)"><rect x="70" y="28.5" width="58" height="7" rx="1.6" fill="#FFC93C"/><rect x="70" y="28.5" width="8" height="7" rx="1.6" fill="#F28C9C"/><rect x="77" y="28.5" width="3.4" height="7" fill="#C9CED6"/><path d="M128 28.5l9 3.5-9 3.5z" fill="#F3D9B1"/><path d="M134 30.8l3 1.2-3 1.2z" fill="#333"/></g>`;
    s+=_C(100,32,17,hd)+_S("M88 24Q100 16 112 24",hl,3,'opacity=".7"')+_S("M86 36Q100 44 114 36",hr,3);
    s+=_P(TR_TORSO,"#22365A");
    [[96,186],[106,204],[92,212],[104,170]].forEach(p=>s+=`<path d="M${p[0]} ${p[1]-3.6}l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#FFD166"/>`);
    s+=_P("M16 222C18 184 46 160 84 151L92 156L82 222Z","#2E9C8F")+_P("M184 222C182 184 154 160 116 151L108 156L118 222Z","#2E9C8F")+_P("M184 222C182 196 168 176 150 166L146 222Z","#000",'opacity=".13"');
    s+=_S("M30 186Q38 198 34 222M170 186Q162 198 166 222",`#000`,1.5,'opacity=".12"');
    s+=_P("M84 151Q90 168 100 158Q110 168 116 151Q108 156 100 156Q92 156 84 151Z","#F4F1EA");
    s+=_trPawn(52,196,1,"#F2C94C");
    s+=_P("M58 100C50 64 72 40 100 40C128 40 150 64 142 100C148 126 144 148 136 158H64C56 148 52 126 58 100Z",hr);
    s+=_trHead({sk,sh});
    s+=_trFreckles("#C98663")+_trBlush();
    s+=_trEyes(m,{iris:"#3D8C62",sk,lash:1,lid:.05});
    s+=_trBrows(m,{c:hd,w:4.4});
    s+=_trNose(sh)+_trMouth(m,{lip:"#B4544A"});
    s+=_P("M58 98C56 62 76 44 104 45C127 46 143 62 142 88C134 73 122 65 108 64C98 73 80 81 62 100Z",hr)+_S("M104 50C118 51 130 58 137 70",hl,3,'opacity=".75"')+_P("M136 74C143 96 142 118 135 133C135 113 133 97 128 82Z",hr);
    s+=`<g fill="#fff" opacity=".12"><circle cx="82" cy="95" r="13.5"/><circle cx="118" cy="95" r="13.5"/></g>`+_S("M73 91l7-7M109 91l7-7","#fff",2,'opacity=".6"');
    s+=_S("M68.5 95a13.5 13.5 0 1 0 27 0a13.5 13.5 0 1 0-27 0M104.5 95a13.5 13.5 0 1 0 27 0a13.5 13.5 0 1 0-27 0M95.5 94Q100 90.5 104.5 94M68.5 92L61 89.5M131.5 92L139 89.5","#2E2A33",3);
    if(full){
      s+=`<g transform="rotate(-9 146 200)"><rect x="122" y="176" width="50" height="58" rx="3" fill="#C8463A"/><rect x="122" y="176" width="7" height="58" fill="#9E3128"/><rect x="168" y="178" width="4" height="54" fill="#F3E9D2"/><path d="M150 196l2.4 5 5.4.7-4 3.7 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.7 5.4-.7z" fill="#FFD166"/></g>`;
      s+=`<g class="sk"><path d="M150 166l-3 5M156 167v5M164 167v5M170 166l3 5" stroke="#F2A93B" stroke-width="2.4" stroke-linecap="round"/>${_E(160,146,17,21,"#8A6A4A")}${_E(160,152,11,13,"#EBDDC3")}${_S("M155 148l2 2 2-2M161 148l2 2 2-2M157 155l2 2 2-2M163 155l2 2 2-2","#B89A78",1.3)}
        ${_P("M144 130l2-12 8 8z","#8A6A4A")}${_P("M176 130l-2-12-8 8z","#8A6A4A")}
        ${_C(153,135,7,"#fff")}${_C(167,135,7,"#fff")}${_C(153.5,135.5,4.4,"#F2B705")}${_C(166.5,135.5,4.4,"#F2B705")}${_C(153.5,135.5,2.3,"#1A1414")}${_C(166.5,135.5,2.3,"#1A1414")}${_C(155,134,1.1,"#fff")}${_C(168,134,1.1,"#fff")}
        ${_P("M157 141h6l-3 5z","#F2A93B")}${_P("M146 112l14-5 14 5-14 5z","#2B2B33")}${_P("M152 114v4c0 1 3.5 2 8 2s8-1 8-2v-4l-8 3z","#2B2B33")}${_S("M174 112v7","#FFD166",1.4)}</g>`;
    }
    return s;
  },
  /* Bruno Betonfest: Bauhelm mit Turm-Aufkleber, Vollbart, Warnweste über Karohemd, Bleistift hinterm Ohr, Hammer */
  bruno(m,full){
    const sk="#D99F7A",sh="#B98060",bd="#5A3B22",bl="#7A5234";
    let s="";
    if(full)s+=`<g transform="rotate(-14 46 170)"><rect x="41" y="128" width="10" height="100" rx="4" fill="#9A6A3E"/><rect x="41" y="128" width="4" height="100" fill="#fff" opacity=".15"/><path d="M26 118h40v16H26z" fill="#5E6670"/><path d="M26 118h40v5H26z" fill="#fff" opacity=".18"/><path d="M66 118q12 2 16 12-8-3-16-1z" fill="#5E6670"/></g>`;
    s+=_P("M10 222C12 180 42 158 82 150H118C158 158 188 180 190 222Z","#2F5F96");
    s+=_S("M92 160V222M108 160V222M84 178H116M84 198H116","#1B3A5E",2,'opacity=".55"');
    s+=_P("M84 151L93 170L100 157L107 170L116 151Q100 158 84 151Z","#244A78");
    s+=_P("M10 222C12 180 42 158 82 150L88 156L84 222Z","#FF8A1F")+_P("M190 222C188 180 158 158 118 150L112 156L116 222Z","#FF8A1F")+_P("M190 222C188 196 172 176 152 166L146 222Z","#000",'opacity=".14"');
    s+=_P("M13 190L84 188V196L12 199Z","#E3E8EE")+_P("M187 190L116 188V196L188 199Z","#E3E8EE")+_P("M12 207L84 205V213L12 216Z","#E3E8EE")+_P("M188 207L116 205V213L188 216Z","#E3E8EE");
    s+=`<rect x="124" y="164" width="20" height="14" rx="2" fill="#E06E0E"/>`+_S("M130 160v8M136 160v8","#2B2B33",2.4);
    s+=`<g transform="rotate(38 146 92)"><rect x="128" y="88.5" width="36" height="7" rx="1.6" fill="#FFC93C"/><path d="M164 88.5l8 3.5-8 3.5z" fill="#F3D9B1"/><path d="M169.5 91l2.5 1-2.5 1z" fill="#333"/></g>`;
    s+=_trHead({sk,sh,jaw:"square",neck:17});
    s+=_P("M59 80Q58 96 62 106L68 104Q65 92 66 80Z",bd)+_P("M141 80Q142 96 138 106L132 104Q135 92 134 80Z",bd);
    s+=_trEyes(m,{iris:"#6B4A2B",sk,lid:.12});
    s+=_trBrows(m,{c:bd,w:7.2,y:79});
    s+=_trNose(sh);
    s+=_P("M59 96C59 128 78 148 100 148C122 148 141 128 141 96C136 111 128 119 116 118Q108 115 100 117Q92 115 84 118C72 119 64 111 59 96Z",bd)+_S("M74 126Q80 136 90 140M126 126Q120 136 110 140",bl,2.2);
    s+=_trMouth(m,{lip:"#8E4A3A",y:123});
    s+=_P("M81 115Q90.5 107.5 100 112.5Q109.5 107.5 119 115Q115 121.5 106 119.5Q100 116.5 94 119.5Q85 121.5 81 115Z","#4A2F1A");
    s+=_P("M56 76C56 46 76 30 100 30C124 30 144 46 144 76Z","#F5B800")+_P("M95 31H105V76H95Z","#D99A00",'opacity=".55"')+_P("M44 74Q100 65 156 74Q158 82 150 85Q100 77 50 85Q42 82 44 74Z","#D99A00")+_S("M68 52Q76 38 92 34","#fff",4.4,'opacity=".55"');
    s+=_C(74,62,7.5,"#fff")+_trRook(74,61.5,.62,"#2B2B33");
    return s;
  },
  /* Greta Eisenwall: Rüstung mit Turm-Wappen, Umhang, Kranzzopf und langer Zopf, Narbe über der Braue, Schild */
  greta(m,full){
    const sk="#F6D7C3",sh="#DDAE94",hr="#E8B54A",hd="#C8922F",hl="#F8D987";
    let s="";
    s+=_P("M4 222C6 176 40 148 84 144H116C160 148 194 176 196 222Z","#23468A");
    s+=_P(TR_TORSO,"#B9C3CF")+_P("M184 222C182 196 166 176 146 166L140 222Z","#000",'opacity=".14"');
    s+=_P("M76 158H124L130 222H70Z","#2F5DA8")+_P("M124 158L130 222H116L118 158Z","#000",'opacity=".14"')+_trRook(100,192,1.6,"#F4F1EA");
    s+=_S("M76 158H124","#E9B949",3);
    s+=_P("M10 198C8 168 34 150 68 150C72 162 66 174 56 182C44 190 28 194 10 198Z","#C9D2DD")+_S("M14 190C30 186 44 182 56 174","#8D99A9",2)+_C(30,170,2.4,"#8D99A9")+_C(48,162,2.4,"#8D99A9")+_S("M22 162Q36 154 54 154","#fff",3,'opacity=".5"');
    s+=_P("M190 198C192 168 166 150 132 150C128 162 134 174 144 182C156 190 172 194 190 198Z","#AEB8C5")+_S("M186 190C170 186 156 182 144 174","#7E8A9A",2)+_C(170,170,2.4,"#7E8A9A")+_C(152,162,2.4,"#7E8A9A");
    s+=_P("M82 144Q100 156 118 144L123 158Q100 172 77 158Z","#8D99A9")+_S("M80 151Q100 164 120 151","#fff",1.6,'opacity=".45"');
    s+=_trHead({sk,sh,neck:13});
    s+=_trEyes(m,{iris:"#3F86D9",sk,lash:1,lid:.22});
    s+=_trBrows(m,{c:hd,w:4.6,angry:1});
    s+=_S("M121 72L127 89","#D98C8C",2.2)+_S("M120.5 78l5-1.6M122.6 84l5-1.6","#D98C8C",1.5);
    s+=_trNose(sh)+_trBlush(.18)+_trMouth(m,{lip:"#B65A55",smirk:1});
    s+=_P("M60 92C60 62 78 46 100 46C122 46 140 62 140 92C134 74 120 63 100 63C80 63 66 74 60 92Z",hr)+_S("M100 47V62",hd,2);
    let br="";for(let i=0;i<9;i++){const a=(-160+i*17.5)*Math.PI/180,x=100+Math.cos(a)*41,y=78+Math.sin(a)*35,r=(i*17.5-70).toFixed(0);br+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7.5" ry="5" fill="${i%2?hr:hd}" transform="rotate(${r} ${x.toFixed(1)} ${y.toFixed(1)})"/>`}
    s+=br+_S("M66 58Q100 30 134 58","#fff",2,'opacity=".25"');
    let tl="";for(let i=0;i<7;i++){const y=124+i*13,x=64-i*1.4;tl+=_E(x,y,6.4-i*.25,8,i%2?hr:hd,`transform="rotate(${i%2?12:-12} ${x} ${y})"`)}
    s+=tl+_C(55.6,214,4,"#2F5DA8");
    if(full)s+=`<g transform="rotate(6 166 196)">${_P("M138 166Q166 158 194 166V194Q194 222 166 238Q138 222 138 194Z","#2F5DA8")}${_P("M166 160Q182 162 194 166V194Q194 222 166 238Z","#000",'opacity=".15"')}${_S("M138 166Q166 158 194 166V194Q194 222 166 238Q138 222 138 194Z","#E9B949",4)}${_trRook(166,196,1.7,"#F4F1EA")}</g>`;
    return s;
  },
  /* Kapitän Konrad Kompass: Kapitänsmütze mit Anker, weißer Vollbart, hochgezogene Braue, Mantel mit Goldknöpfen, Fernrohr */
  konrad(m,full){
    const sk="#EDC4A1",sh="#CF9C7A",bw="#F3F0EA",bdk="#D2CCC2";
    let s="";
    s+=_P(TR_TORSO,"#1E3557")+_P("M184 222C182 196 166 176 146 166L140 222Z","#000",'opacity=".18"');
    s+=_P("M84 151L100 198L116 151Q100 160 84 151Z","#F7F5F0")+_P("M96.5 160H103.5L105.5 192L100 199L94.5 192Z","#141414");
    s+=_P("M84 151L100 198L72 178L76 156Z","#16263F")+_P("M116 151L100 198L128 178L124 156Z","#16263F");
    [[78,192],[78,210],[122,192],[122,210]].forEach(p=>s+=_C(p[0],p[1],3.8,"#E2B33C")+_C(p[0]-1,p[1]-1,1.2,"#fff",'opacity=".6"'));
    s+=_P("M20 178Q38 160 66 157L70 168Q46 170 30 188Z","#E2B33C")+_S("M28 186l-3 9M34 180l-2 10M40 176l-1 10M46 173v10M52 171l1 10","#E2B33C",2.4);
    s+=_P("M180 178Q162 160 134 157L130 168Q154 170 170 188Z","#E2B33C")+_S("M172 186l3 9M166 180l2 10M160 176l1 10M154 173v10M148 171l-1 10","#E2B33C",2.4);
    s+=_trHead({sk,sh,jaw:"square",neck:15});
    s+=_S("M65 96l-5-2M65 101l-5 1","#C08A68",1.8)+_S("M135 96l5-2M135 101l5 1","#C08A68",1.8);
    s+=_trEyes(m,{iris:"#3D74B5",sk,lid:.18});
    s+=_trBrows(m,{c:"#E9E5DE",w:7,y:82,raise:m==="neutral"||m==="happy"?"R":0});
    s+=_trNose(sh);
    s+=_P("M58 98C58 133 78 154 100 154C122 154 142 133 142 98C136 112 126 120 114 118Q100 114 86 118C74 120 64 112 58 98Z",bw)+_P("M100 154C122 154 142 133 142 98C138 116 128 130 110 137Z",bdk,'opacity=".8"');
    s+=_trMouth(m,{lip:"#9A5546",y:124});
    s+=_P("M76 116Q88 104 100 112Q112 104 124 116Q130 118 135 111Q134 125 120 125Q108 123 100 117.5Q92 123 80 125Q66 125 65 111Q70 118 76 116Z",bw)+_S("M90 112Q96 110 100 114","#D2CCC2",1.6);
    s+=`<g transform="translate(0 -9)">`+_P("M50 70C50 46 72 34 100 34C132 34 152 46 152 64L148 72L52 74Z","#F7F7F4")+_P("M128 36C146 42 152 52 152 64L148 72L132 72C136 56 134 44 128 36Z","#000",'opacity=".07"');
    s+=_P("M53 61H147L148 74H52Z","#1E3557")+_S("M56 70Q100 64 144 70","#E2B33C",2);
    s+=_C(100,66,7.5,"#E2B33C")+_S("M100 61.5v9M96.5 63.6h7M95.5 67.5q4.5 5 9 0","#1E3557",1.6);
    s+=_P("M50 74Q100 88 150 74L153 80Q100 99 47 80Z","#141A24")+_S("M60 80Q100 91 140 80","#fff",1.4,'opacity=".25"')+`</g>`;
    if(full)s+=`<g transform="rotate(-24 150 196)"><rect x="110" y="188" width="86" height="15" rx="4" fill="#C99A3C"/><rect x="110" y="188" width="86" height="5" rx="2" fill="#fff" opacity=".28"/><rect x="130" y="186" width="6" height="19" rx="1.5" fill="#8C6A24"/><rect x="160" y="186" width="6" height="19" rx="1.5" fill="#8C6A24"/><rect x="194" y="184" width="10" height="23" rx="3" fill="#8C6A24"/><rect x="100" y="191" width="12" height="9" rx="2" fill="#2B2B33"/></g>`;
    return s;
  },
  /* Linus Langbogen: Kapuze mit Feder, Sommersprossen, verschmitzter Blick, Köcher und Langbogen */
  linus(m,full){
    const sk="#F4D3B6",sh="#D9A888",hr="#B5562B",hd="#2F6B3D",hD="#245530",hL="#3F8A52";
    let s="";
    if(full){
      s+=_S("M156 18Q206 118 160 222","#8A5A33",6)+_S("M156 18L160 222","#EDE3CF",1.3);
      s+=_S("M34 168L58 112M44 172L70 116M54 176L80 122","#C9A273",3);
      s+=_P("M52 108l6 4 2-12zM64 112l6 4 2-12zM76 118l5 4 3-11z","#D9453A")+_P("M56 104l6 4 2-12zM68 108l6 4 2-12z","#F3EBD7");
    }
    s+=_P("M48 122C40 72 64 28 104 24C142 24 162 58 156 106C154 126 148 142 140 152L60 152C54 142 50 134 48 122Z",hD);
    s+=_P("M104 24Q134 4 156 12Q142 22 130 36Z",hd);
    s+=_P(TR_TORSO,hd)+_P("M184 222C182 196 166 176 146 166L140 222Z","#000",'opacity=".15"');
    s+=_P("M84 156L100 178L116 156L121 222H79Z","#8A5A33");
    s+=_P("M126 154L146 160L70 222L48 222Z","#5A3A22")+`<rect x="88" y="182" width="16" height="13" rx="2" fill="none" stroke="#D9B451" stroke-width="2.6" transform="rotate(-40 96 188.5)"/>`;
    s+=_P("M92 152l8-6 8 6-8 8z","#D9B451");
    s+=_trHead({sk,sh,neck:13});
    s+=_trFreckles("#C98663")+_trBlush(.2);
    s+=_trEyes(m,{iris:"#5E8E36",sk,lid:.34,look:[1.6,0]});
    s+=_trBrows(m,{c:"#8E3F1C",w:4.4,raise:m==="neutral"?"L":0});
    s+=_trNose(sh)+_trMouth(m,{lip:"#A8574A",smirk:1});
    s+=_P("M64 88Q70 66 90 61Q84 71 86 79Q96 65 112 63Q108 73 110 79Q121 69 136 76Q131 64 118 57Q100 51 82 57Q68 66 64 88Z",hr);
    s+=_P("M56 104C54 70 74 44 100 44C126 44 146 70 144 104L138 102C138 72 122 54 100 54C78 54 62 72 62 102Z",hL);
    s+=`<g class="fe">`+_P("M132 52Q152 28 176 24Q160 40 142 60Z","#F3EBD7")+_P("M164 28Q172 25 176 24Q170 31 160 36Z","#D9453A")+_S("M140 54Q156 38 172 27","#C9BFA6",1.4)+`</g>`;
    return s;
  },
  /* Rex Flammenherz: Flammenhaar, Stirnband, Narbe, Lederjacke mit Flammen, Shirt mit Königskrone */
  rex(m,full){
    const sk="#B87A55",sh="#975D3E";
    let s="";
    if(full)s+=`<g class="fl" opacity=".95">${_trFlame(22,222,16,70,"#FF5A36")}${_trFlame(178,222,16,74,"#FF5A36")}${_trFlame(34,222,12,48,"#FFA43D")}${_trFlame(168,222,12,52,"#FFA43D")}${_trFlame(14,222,8,34,"#FFD166")}${_trFlame(186,222,8,36,"#FFD166")}</g>`;
    s+=_P(TR_TORSO,"#26262C")+_P("M184 222C182 196 166 176 146 166L140 222Z","#000",'opacity=".25"');
    s+=_P("M84 152Q100 162 116 152L121 222H79Z","#D83A2E")+_P("M88 204V190L94 196L100 185L106 196L112 190V204Z","#fff");
    s+=_P("M84 150L64 144L52 172L80 180Z","#3C3C44")+_P("M116 150L136 144L148 172L120 180Z","#33333A");
    s+=_S("M80 180L79 222M120 180L121 222","#5A5A64",2);
    s+=`${_trFlame(40,190,7,22,"#FF7A2F")}${_trFlame(48,186,5,14,"#FFC14D")}${_trFlame(160,190,7,22,"#FF7A2F")}${_trFlame(152,186,5,14,"#FFC14D")}`;
    s+=_P("M58 96L46 58L66 68L60 34L80 52L86 18L100 44L114 14L120 48L140 30L136 62L156 54L142 96Z","#E2412A");
    s+=_trHead({sk,sh,jaw:"square",neck:15});
    s+=_S("M123 107l9 6M125.5 113l5-6","#8A4E36",2.2);
    s+=_trEyes(m,{iris:"#E0912B",sk,lid:.3});
    s+=_trBrows(m,{c:"#3A1F16",w:5.6,angry:1});
    s+=_trNose(sh)+_trMouth(m,{lip:"#6E3428",smirk:1});
    s+=_P("M60 80L54 60L70 66L68 44L84 58L90 32L102 52L114 28L118 56L134 42L132 66L146 62L140 82Q100 66 60 80Z","#FF7A2F")+_P("M70 66L68 50L78 60ZM90 40L94 54L86 54ZM114 34L116 52L108 50ZM132 48L130 62L124 58Z","#FFC14D");
    s+=_P("M58 78Q100 64 142 78L142 89Q100 75 58 89Z","#fff")+_P("M58 82.5Q100 69 142 82.5V85Q100 71.5 58 85Z","#D83A2E");
    s+=_P("M140 80Q156 74 168 84Q158 86 152 90Q162 97 164 108Q151 101 140 90Z","#fff")+_S("M146 84Q156 82 164 86","#D83A2E",1.6);
    return s;
  },
  /* Nova Sternfeuer: violetter Lockenschopf mit Sternspangen, Visier auf der Stirn, Headset, Raumanzug, Roboter Bit */
  nova(m,full){
    const sk="#8A5638",sh="#6A3F27",hr="#7C4FE0",hd="#5B34B8",hl="#A584F5";
    let s="";
    s+=`<g fill="${hd}">${[[52,92,22],[48,66,22],[62,42,24],[86,28,24],[114,28,24],[138,42,24],[152,66,22],[148,92,22],[70,64,30],[130,64,30],[100,48,30]].map(c=>_C(c[0],c[1],c[2],hd)).join("")}</g>`;
    s+=`<g fill="${hr}">${[[56,86,19],[54,64,19],[66,44,20],[88,32,20],[112,32,20],[134,44,20],[146,64,19],[144,86,19],[100,56,30]].map(c=>_C(c[0],c[1],c[2],hr)).join("")}</g>`;
    s+=_S("M60 50Q66 40 76 36M118 30Q128 30 136 38M144 70Q150 78 148 88",hl,3,'opacity=".8"');
    s+=_P(TR_TORSO,"#EEF1F6")+_P("M184 222C182 196 166 176 146 166L140 222Z","#000",'opacity=".1"');
    s+=_P("M18 202Q58 188 84 192L82 200Q56 198 20 212Z","#7C4FE0")+_P("M182 202Q142 188 116 192L118 200Q144 198 180 212Z","#7C4FE0");
    s+=_C(134,194,12,"#1C1A3A")+_C(134,194,5.5,"#F6C453")+_S("M124 197Q134 189 144 191","#F6C453",1.6)+_C(128,188,1,"#fff")+_C(140,200,1,"#fff");
    s+=_P("M74 148Q100 166 126 148L131 162Q100 184 69 162Z","#9AA4B2")+_S("M74 154Q100 171 126 154","#fff",2,'opacity=".6"');
    s+=_trHead({sk,sh,neck:13});
    s+=_trEyes(m,{iris:"#6E44C7",sk,lash:1,lid:.1,dark:"#1A0F0C"});
    s+=_trBrows(m,{c:"#2A1712",w:4.4});
    s+=_trNose(sh)+_trBlush(.16)+_trMouth(m,{lip:"#6B2E2A"});
    s+=_P("M62 88C62 62 80 50 100 50C120 50 138 62 138 88C132 71 118 63 100 63C82 63 68 71 62 88Z",hr);
    s+=_P("M54 66Q100 44 146 66L144 77Q100 57 56 77Z","#3FD8F0",'opacity=".6"')+_S("M54 66Q100 44 146 66M56 77Q100 57 144 77","#E8FBFF",2)+_S("M70 64l8-5M118 59l8 3","#fff",2,'opacity=".8"');
    [[64,44],[136,40],[118,24]].forEach(p=>s+=`<path d="M${p[0]} ${p[1]-5}l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z" fill="#FFD34D"/>`);
    s+=_C(57,98,10,"#DDE3EA")+_C(57,98,6,"#9AA4B2")+_S("M55 108Q58 126 80 129","#9AA4B2",3)+_C(81.5,129,3.4,"#333");
    s+=_S("M143 108l-4 8h5l-4 9","#F6C453",2.4);
    if(full)s+=`<g class="sk"><ellipse cx="168" cy="82" rx="9" ry="3" fill="#3FD8F0" opacity=".45"/>${_S("M168 48V40","#9AA4B2",2)}${_C(168,38,3.4,"#B794F6",'class="ant"')}${_C(168,62,16,"#F2F4F8")}${_P("M168 46a16 16 0 0 1 0 32a12 16 0 0 0 0-32z","#000",'opacity=".1"')}<rect x="157" y="55" width="22" height="13" rx="6" fill="#1C1A3A"/>${m==="worry"?_S("M161 62h4M171 62h4","#3FD8F0",2):_S("M161 63q2-3 4 0M171 63q2-3 4 0","#3FD8F0",2)}${_E(152,64,3,6,"#C9D0DB")}${_E(184,64,3,6,"#C9D0DB")}</g>`;
    return s;
  },
  /* Dr. Ilka Glut: wilde Locken, Hitzebrille auf der Stirn, Ruß auf der Wange, Hitzeschutzanzug mit Thermometer */
  ilka(m,full){
    const sk="#EEC6A6",sh="#D29B7A",hr="#E2652A",hd="#B64B1B",hl="#F79A52";
    let s="";
    if(full)s+=`<g class="em">${[[30,60,2.4],[170,50,2],[180,110,2.6],[22,120,2],[160,24,1.6],[44,30,1.8]].map(p=>_C(p[0],p[1],p[2],"#FFB347",'opacity=".85"')).join("")}</g>`;
    s+=`<g fill="${hd}">${[[50,110,18],[46,84,18],[54,58,20],[74,38,20],[100,30,22],[126,38,20],[146,58,20],[154,84,18],[150,110,18],[56,136,16],[144,136,16],[100,80,44]].map(c=>_C(c[0],c[1],c[2],hd)).join("")}</g>`;
    s+=`<g fill="${hr}">${[[54,104,15],[52,80,15],[60,58,16],[78,42,16],[100,36,18],[122,42,16],[140,58,16],[148,80,15],[146,104,15]].map(c=>_C(c[0],c[1],c[2],hr)).join("")}</g>`;
    s+=_S("M46 76q-4 6 2 10M152 72q5 6-1 11M62 46q4-6 10-4M126 34q6-2 10 3",hl,2.6);
    s+=_P(TR_TORSO,"#C8CED6")+_P("M184 222C182 196 166 176 146 166L140 222Z","#000",'opacity=".14"');
    s+=_S("M36 214L60 170M150 216L170 180","#fff",4,'opacity=".45"');
    s+=_P("M18 196L182 186V198L18 208Z","#FF8A1F")+_P("M18 200L182 190V193L18 203Z","#FFE3C2",'opacity=".7"');
    s+=`<rect x="46" y="164" width="24" height="18" rx="2" fill="#AEB6C2"/>`+_S("M53 172V150","#E8EDF3",3.4)+_C(53,173,3.6,"#E24B3A")+_S("M53 172V158","#E24B3A",1.6)+_S("M62 170V152","#2B6CB0",2.6);
    s+=`<rect x="116" y="164" width="38" height="13" rx="2" fill="#fff"/><text x="135" y="173.5" text-anchor="middle" font-family="Rubik, sans-serif" font-size="7" font-weight="800" fill="#B64B1B">DR. GLUT</text>`;
    s+=_P("M70 148Q100 168 130 148L136 164Q100 186 64 164Z","#9EA6B2");
    s+=_trHead({sk,sh,neck:13});
    s+=_E(125,115,7.5,4,"#5C5C64",'opacity=".45"')+_E(131,111,3,2,"#5C5C64",'opacity=".35"');
    s+=_trEyes(m,{iris:"#3EA36C",sk,lash:1});
    s+=_trBrows(m,{c:hd,w:4.6});
    s+=_trNose(sh)+_trBlush(.22)+_trMouth(m,{lip:"#B4544A"});
    s+=_P("M60 94C58 66 78 48 102 48C124 48 142 64 140 92C136 80 128 72 118 70Q116 80 108 84Q106 74 98 70Q92 80 82 84Q84 74 80 70Q68 76 60 94Z",hr);
    s+=_P("M55 70Q100 56 145 70L145 79Q100 65 55 79Z","#2F2F33");
    s+=_C(82,68,12,"#2F2F33")+_C(118,68,12,"#2F2F33")+_C(82,68,8.5,"#FFB347")+_C(118,68,8.5,"#FFB347")+_S("M77 64.5l5-4M113 64.5l5-4","#fff",2.4,'opacity=".75"');
    return s;
  },
  /* Kapitänin Rika Rotsegel: Dreispitz mit Bauernwappen und Feder, rote Wellen, Augenklappe, Goldzahn, Papagei Gambit */
  rika(m,full){
    const sk="#D9A07A",sh="#B98060",hr="#C9341F",hd="#9E2413",hl="#E8603F";
    let s="";
    s+=_P("M56 96C50 66 70 44 100 44C130 44 150 66 144 96Z",hd);
    s+=_P(TR_TORSO,"#B0261D")+_P("M184 222C182 196 166 176 146 166L140 222Z","#000",'opacity=".18"');
    s+=_P("M84 152Q100 160 116 152L114 222H86Z","#F5EFE2")+_S("M90 166Q100 172 110 166M89 180Q100 186 111 180M90 194Q100 200 110 194","#D8CDB6",2);
    s+=_S("M84 151L78 222M116 151L122 222","#E8B84A",3);
    s+=_P("M128 154L150 162L76 222L52 222Z","#5A3A22")+`<rect x="98" y="185" width="14" height="12" rx="2" fill="none" stroke="#E8B84A" stroke-width="2.6" transform="rotate(-42 105 191)"/>`;
    s+=_C(72,200,3.2,"#E8B84A")+_C(70,214,3.2,"#E8B84A");
    s+=_P("M54 100C44 140 50 180 62 216L84 216C72 180 70 150 74 118Z",hr)+_P("M146 100C156 140 150 180 138 216L116 216C128 180 130 150 126 118Z",hr)+_S("M60 130Q56 160 66 196M140 130Q144 160 134 196",hl,2.4,'opacity=".7"');
    s+=_trHead({sk,sh,neck:13});
    s+=_C(61,111,6.4,"none",'stroke="#E8B84A" stroke-width="2.6"');
    s+=_trEyes(m,{iris:"#2E9D6A",sk,lash:1,lid:.16,only:"L"});
    s+=_E(118,96,11.5,10.5,"#18181A")+_S("M60 78Q96 84 140 100","#18181A",2.6);
    s+=_trBrows(m,{c:hd,w:4.6,raise:m==="neutral"?"L":0});
    s+=_trNose(sh)+_trBlush(.2)+_trMouth(m,{lip:"#9A3B32",smirk:1,gold:1});
    s+=_P("M58 96C58 66 78 48 100 50C120 48 140 62 142 88C130 70 112 66 98 70C84 74 70 82 58 96Z",hr)+_S("M70 62Q84 52 102 52",hl,2.6,'opacity=".7"');
    s+=_C(60,128,2.6,"#2E9D6A")+_C(59,136,2.6,"#E8B84A")+_C(60,144,2.6,"#2E9D6A");
    s+=`<g class="fe">`+_P("M64 54C40 20 18 12 2 16C22 26 38 42 52 64Z","#E2412A")+_S("M54 56Q34 30 10 18M44 48l-10-2M38 40l-10-3M30 32l-9-3","#B52A18",1.6)+`</g>`;
    s+=_P("M58 62C60 36 80 26 100 26C120 26 140 36 142 62Z","#2A221E")+_P("M120 28C134 34 142 46 142 62H126C128 48 126 36 120 28Z","#000",'opacity=".2"');
    s+=_P("M26 72C38 50 64 46 100 52C136 46 162 50 174 72C162 64 142 62 132 68C120 60 80 60 68 68C58 62 38 64 26 72Z","#1A1412")+_S("M26 72C38 50 64 46 100 52C136 46 162 50 174 72","#E8B84A",2.4);
    s+=_trPawn(100,47,1.05,"#F5EFE2")+_S("M92 49l16 6M108 49l-16 6","#F5EFE2",2);
    if(full)s+=`<g class="sk">${_P("M33 174L24 210L36 204L40 178Z","#2A7FD4")}${_P("M24 210L28 216L34 205Z","#E2412A")}${_P("M28 170C24 150 32 134 46 130C58 128 64 138 62 152C60 166 50 176 38 178Z","#2DB24F")}${_P("M32 152Q42 142 54 150Q50 168 36 174Z","#1E8A3B")}${_C(50,124,12.5,"#2DB24F")}${_P("M41 116Q50 106 59 113Q52 116 46 123Z","#E2412A")}${_C(53,122,4.6,"#fff")}${_C(54,122,2.3,"#1A1414")}${_C(54.8,121,.9,"#fff")}${_P("M61 120Q73 122 68 134Q64 129 59 128Z","#F2E3C3")}${_P("M60 127Q65 128 67 133Q62 132 59 130Z","#3A3A3A")}${_S("M36 178l-2 5M42 178l1 5","#7A7A7A",2.2)}</g>`;
    return s;
  }
};

/* Trainer zeichnen. crop: "face" (Avatar) oder "bust" (Brustbild mit Begleiter und Requisiten) */
function coachSvg(id,mood,crop){
  const k=TR_ART[id]?id:"mila",m=["neutral","happy","joy","worry","think","wow"].includes(mood)?mood:"neutral",bust=crop==="bust";
  const vb=bust?"0 0 200 220":"30 26 140 140";
  return `<svg class="tr tr-${k} m-${m}${bust?" bust":""}" viewBox="${vb}" width="100%" height="100%" preserveAspectRatio="xMidYMid ${bust?"meet":"slice"}" style="--bd:-${(Math.random()*5).toFixed(2)}s" aria-hidden="true">${TR_ART[k](m,bust)}</svg>`;
}
