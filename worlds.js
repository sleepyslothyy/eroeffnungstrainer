/* Kurswelten: eine eigene Illustration pro Kurs, Schrift pro Trainerwelt, Rangabzeichen und Motive für die Abenteuerkarte.
   Stil: Silhouetten in Weiß- und Schwarztönen über der Kursfarbe (Klassen w0–w3 / b1–b4) plus wenige Akzentfarben.
   Alle Szenen nutzen viewBox 0 0 320 200 und kommen ohne IDs aus, damit sie beliebig oft auf einer Seite stehen können. */

/* Schrift je Trainerwelt (Dateien unter lib/fonts, Lizenzen daneben) */
const WFONT={
  mila:{f:"ZZ Caveat",s:1.42,ls:"0"},
  bruno:{f:"ZZ Bungee",s:.84,ls:".01em"},
  greta:{f:"ZZ Cinzel",s:.94,ls:".02em"},
  konrad:{f:"ZZ Fell",s:1.12,ls:".01em"},
  linus:{f:"ZZ Uncial",s:.94,ls:"0"},
  rex:{f:"ZZ Bangers",s:1.1,ls:".04em"},
  nova:{f:"ZZ Orbitron",s:.82,ls:".03em"},
  ilka:{f:"ZZ Elite",s:.96,ls:"0"},
  rika:{f:"ZZ Pirata",s:1.14,ls:".01em"}
};

/* Weltangaben pro Kurs: Name des Berichts nach einer Einheit, Ziel am Ende der Route, Motive für die Karte */
const WORLD={
  w_start:{name:"Die Schachschule",log:"Klassenbuch",goal:"Abschlussfeier",deco:["book","star","pawn"]},
  b_start:{name:"Die Sternwarte",log:"Sternenprotokoll",goal:"Die Galaxie",deco:["star","moon","star"]},
  w_system:{name:"Die Baustelle",log:"Bautagebuch",goal:"Richtfest",deco:["brick","cone","brick"]},
  b_system:{name:"Die große Brücke",log:"Baustellenbericht",goal:"Brückeneröffnung",deco:["gear","wave","gear"]},
  w_quiet_e4:{name:"Die Burg im Grünen",log:"Wachbuch",goal:"Die Festung",deco:["tree","flower","tree"]},
  b_solid:{name:"Die Bastion",log:"Festungschronik",goal:"Die Zitadelle",deco:["shield","rock","shield"]},
  b_classic:{name:"Der Hafen",log:"Hafenbuch",goal:"Die Admiralsflagge",deco:["wave","gull","anchor"]},
  w_d4:{name:"Der Leuchtturm",log:"Logbuch",goal:"Der Heimathafen",deco:["wave","star","gull"]},
  w_flank:{name:"Der Bogenwald",log:"Trefferliste",goal:"Der goldene Pfeil",deco:["tree","target","tree"]},
  w_e4:{name:"Die Weltreise",log:"Reisetagebuch",goal:"Einmal um die Welt",deco:["wave","palm","gull"]},
  w_attack:{name:"Die Feuerprobe",log:"Kampfbericht",goal:"Der Phönix",deco:["flame","spark","flame"]},
  b_counter:{name:"Das Gewitter",log:"Wetterbericht",goal:"Das Auge des Sturms",deco:["cloud","bolt","cloud"]},
  b_hyper:{name:"Der Wachturm",log:"Beobachtungsbuch",goal:"Der höchste Turm",deco:["tree","bird","rock"]},
  b_sharp:{name:"Die Supernova",log:"Missionsbericht",goal:"Der Urknall",deco:["star","planet","star"]},
  b_sicilian:{name:"Der Vulkan",log:"Messprotokoll",goal:"Der Gipfelkrater",deco:["rock","spark","rock"]},
  gambits:{name:"Die Piratenbucht",log:"Kaperbericht",goal:"Die Piratenkrone",deco:["wave","gull","coin"]},
  w_gambit:{name:"Die Schatzinsel",log:"Schatzbuch",goal:"Die Schatzkammer",deco:["palm","coin","wave"]},
  b_gambit:{name:"Das Geisterschiff",log:"Geisterchronik",goal:"Die Geisterflotte",deco:["wave","moon","rock"]}
};
/* Dateien der Schriften (für den Bildexport der Urkunde) */
const WFONT_FILE={"ZZ Caveat":"caveat-bold","ZZ Bungee":"bungee","ZZ Cinzel":"cinzel-bold","ZZ Fell":"im-fell-english-sc","ZZ Uncial":"uncial-antiqua","ZZ Bangers":"bangers","ZZ Orbitron":"orbitron-bold","ZZ Elite":"special-elite","ZZ Pirata":"pirata-one"};
/* Tonstufen der Szenen für eigenständige SVG-Dateien (auf der Seite stehen dieselben Regeln in style.css unter .scn) */
const SCN_CSS=".w0{fill:#fff;opacity:.96}.w1{fill:#fff;opacity:.62}.w2{fill:#fff;opacity:.34}.w3{fill:#fff;opacity:.15}.b1{fill:#000;opacity:.14}.b2{fill:#000;opacity:.26}.b3{fill:#000;opacity:.42}.b4{fill:#000;opacity:.62}.sw2{stroke:rgba(255,255,255,.36)}.sw3{stroke:rgba(255,255,255,.18)}.chalk{font-family:'ZZ Caveat',cursive;font-size:19px;fill:#FDF6D8}.sm{font-family:'ZZ Fell',Georgia,serif;font-size:11px;fill:rgba(255,255,255,.85)}";

/* kleine Helfer für die Szenen */
const _rng=seed=>{let s=seed>>>0;return ()=>(s=(s*1664525+1013904223)>>>0)/4294967296};
function _stars(n,seed,ymax,big){const r=_rng(seed);let o="";for(let i=0;i<n;i++){const x=(r()*320).toFixed(1),y=(r()*ymax).toFixed(1),s=(.5+r()*(big||1.4)).toFixed(2);o+=`<circle cx="${x}" cy="${y}" r="${s}" class="${r()<.35?"w0":"w1"}${i%3?"":" tw"}"${i%3?"":` style="animation-delay:-${(i*.53%3.2).toFixed(2)}s"`}/>`}return o}
function _waves(y,amp,len,cls,sw,x0){let d=`M${x0||-10} ${y}`;for(let x=(x0||-10);x<360;x+=len)d+=` q${len/4} ${-amp} ${len/2} 0 t${len/2} 0`;return `<path d="${d}" class="${cls} wv" fill="none" stroke-width="${sw||2}" stroke-linecap="round"/>`}
function _seaFill(y,amp,len,cls){let d=`M-10 ${y}`;for(let x=-10;x<330;x+=len)d+=` q${len/4} ${-amp} ${len/2} 0 t${len/2} 0`;return `<path d="${d} V210 H-10z" class="${cls}"/>`}
const _flame=(x,y,w,h,col)=>`<path class="fl" d="M${x} ${y}c${-w} ${-h*.35} ${-w*.55} ${-h*.75} 0 ${-h}c${w*.12} ${h*.28} ${w*.75} ${h*.42} ${w*.62} ${h*.7}c${-.05*w} ${h*.18} ${-.2*w} ${h*.26} ${-.62*w} ${h*.3}z" fill="${col}"/>`;
/* Bauer als Silhouette: cx = Mitte, by = Unterkante, s = Größe (20 = 64 px hoch); cls = Tonklasse oder Farbe (#…); face = "s" Lächeln, "o" Staunen */
function _pawn(cx,by,s,cls,face){const k=s/20,f=n=>(+n).toFixed(1),X=a=>f(cx+a*k),Y=b=>f(by+b*k);
  const paint=cls&&cls[0]==="#"?`fill="${cls}"`:`class="${cls||"w0"}"`;
  let o=`<g ${paint}><rect x="${X(-22)}" y="${Y(-9)}" width="${f(44*k)}" height="${f(9*k)}" rx="${f(4*k)}"/><path d="M${X(-13)} ${Y(-9)}C${X(-11)} ${Y(-20)} ${X(-7)} ${Y(-28)} ${X(-6)} ${Y(-37)}H${X(6)}C${X(7)} ${Y(-28)} ${X(11)} ${Y(-20)} ${X(13)} ${Y(-9)}z"/><rect x="${X(-12)}" y="${Y(-44)}" width="${f(24*k)}" height="${f(7*k)}" rx="${f(3.5*k)}"/><circle cx="${f(cx)}" cy="${Y(-57)}" r="${f(14*k)}"/></g>`;
  if(face){const ey=Y(-58),m=face==="o"?`<ellipse cx="${f(cx)}" cy="${Y(-51.5)}" rx="${f(2.2*k)}" ry="${f(2.8*k)}" fill="#2B2321"/>`:`<path d="M${X(-4.5)} ${Y(-52.5)}q${f(4.5*k)} ${f(3.6*k)} ${f(9*k)} 0" fill="none" stroke="#2B2321" stroke-width="${f(1.7*k)}" stroke-linecap="round"/>`;
    o+=`<circle cx="${X(-4.8)}" cy="${ey}" r="${f(1.9*k)}" fill="#2B2321"/><circle cx="${X(4.8)}" cy="${ey}" r="${f(1.9*k)}" fill="#2B2321"/>${m}<circle cx="${X(-8.5)}" cy="${Y(-53.5)}" r="${f(2.2*k)}" fill="#F7A8B8" opacity=".8"/><circle cx="${X(8.5)}" cy="${Y(-53.5)}" r="${f(2.2*k)}" fill="#F7A8B8" opacity=".8"/>`}
  return o}
/* Doktorhut auf einem Kopf (Mittelpunkt hx/hy, Radius r) */
const _cap=(hx,hy,r)=>{const t=hy-r,f=n=>n.toFixed(1);return `<path d="M${f(hx-r*.95)} ${f(t+r*.55)}c0 ${f(-r*.5)} ${f(r*.45)} ${f(-r*.75)} ${f(r*.95)} ${f(-r*.75)}s${f(r*.95)} ${f(r*.25)} ${f(r*.95)} ${f(r*.75)}z" fill="#2B2B33"/><path d="M${f(hx-r*1.35)} ${f(t-r*.05)}L${f(hx)} ${f(t-r*.6)}L${f(hx+r*1.35)} ${f(t-r*.05)}L${f(hx)} ${f(t+r*.5)}z" fill="#2B2B33"/><path d="M${f(hx+r*1.35)} ${f(t-r*.05)}v${f(r*.9)}" stroke="#FFD166" stroke-width="1.6" stroke-linecap="round"/><circle cx="${f(hx+r*1.35)}" cy="${f(t+r*.95)}" r="2" fill="#FFD166"/>`};

const SCENES={
  /* Kreidetafel im Klassenzimmer, ein Bauer mit Doktorhut */
  w_start:()=>{let g="";for(let r=0;r<4;r++)for(let c=0;c<4;c++)if((r+c)%2===0)g+=`<rect x="${136+c*14}" y="${52+r*14}" width="14" height="14" fill="rgba(255,255,255,.2)"/>`;
    return `<rect y="164" width="320" height="40" class="b1"/>
    <circle cx="62" cy="50" r="17" class="w0"/><circle cx="62" cy="50" r="17" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2"/><path d="M62 50V40M62 50l7 5" stroke="#3A3A3A" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="118" y="32" width="178" height="116" rx="7" fill="#8A5A33"/><rect x="118" y="32" width="178" height="116" rx="7" fill="none" stroke="rgba(0,0,0,.25)"/><rect x="125" y="39" width="164" height="102" rx="3" fill="#23453B"/>
    ${g}<rect x="136" y="52" width="56" height="56" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="1.4"/>
    <path d="M143 101V73h15" fill="none" stroke="#FDF6D8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M154 68.5l5 4.5-5 4.5" fill="none" stroke="#FDF6D8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="205" y="68" class="scn-t chalk">1.e4 e5</text><text x="205" y="91" class="scn-t chalk">2.Sf3 Sc6</text><text x="205" y="114" class="scn-t chalk">3.Lc4 …</text>
    <path d="M138 128q30-6 60 0" fill="none" stroke="rgba(253,246,216,.55)" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="121" y="145" width="172" height="6" rx="2" fill="#6E4524"/><rect x="150" y="141" width="13" height="4" rx="1.5" fill="#FFF"/><rect x="171" y="142" width="8" height="3" rx="1.5" fill="#F7C6D9"/>
    <rect x="96" y="150" width="34" height="7" rx="1.5" fill="#F2B544"/><rect x="99" y="157" width="30" height="7" rx="1.5" fill="#E2725B"/><rect x="94" y="143" width="30" height="7" rx="1.5" fill="#6BB7E8"/>
    ${_pawn(62,166,19,"w0","s")}${_cap(62,166-57*.95,14*.95)}`},
  /* Sternwarte unter Mondsichel, ein Sternbild in Springerform */
  b_start:()=>`${_stars(46,7,150,1.3)}<circle cx="245" cy="55" r="46" class="w3"/><circle cx="245" cy="55" r="34" class="w3"/>
    <path d="M242.5 25.1A30 30 0 1 0 272.1 67.8 26 26 0 0 1 242.5 25.1z" fill="#FFF3C4"/>
    <g stroke="rgba(255,255,255,.6)" stroke-width="1.3" fill="none"><path d="M118 44 140 66 164 60 176 86 200 80"/></g>
    <g class="w0"><circle cx="118" cy="44" r="2.6"/><circle cx="140" cy="66" r="2.2"/><circle cx="164" cy="60" r="2.8"/><circle cx="176" cy="86" r="2.2"/><circle cx="200" cy="80" r="3"/></g>
    <path d="M40 28l44 18" stroke="rgba(255,255,255,.7)" stroke-width="1.6" stroke-linecap="round"/><circle cx="84" cy="46" r="2.2" class="w0"/>
    <path d="M-10 158c50-20 100-26 150-16s110 4 190-8V210H-10z" class="b2"/><path d="M-10 178c60-10 120-8 180 0s100 6 160 0V210H-10z" class="b3"/>
    <rect x="206" y="148" width="48" height="16" rx="2" class="w2"/><path d="M210 148a20 20 0 0 1 40 0z" class="w1"/><rect x="227" y="129" width="6" height="19" class="b2"/>
    <path d="M233 136l26-16" stroke="rgba(255,255,255,.85)" stroke-width="5" stroke-linecap="round"/><rect x="216" y="154" width="6" height="6" rx="1" fill="#FFD166"/><rect x="238" y="154" width="6" height="6" rx="1" fill="#FFD166"/>`,
  /* Baustelle: der Kran hebt einen goldenen Bauern */
  w_system:()=>`<circle cx="58" cy="46" r="24" class="w3"/><circle cx="58" cy="46" r="15" class="w2"/>
    <rect y="166" width="320" height="40" class="b2"/>
    <rect x="148" y="136" width="88" height="30" class="w1"/><rect x="148" y="106" width="88" height="30" class="w2"/><rect x="148" y="84" width="46" height="22" class="w3"/>
    <g class="b2"><rect x="158" y="144" width="12" height="12" rx="1"/><rect x="186" y="144" width="12" height="12" rx="1"/><rect x="214" y="144" width="12" height="12" rx="1"/><rect x="158" y="114" width="12" height="12" rx="1"/><rect x="214" y="114" width="12" height="12" rx="1"/></g>
    <g stroke="rgba(255,255,255,.6)" stroke-width="1.6" fill="none"><path d="M144 166V84M240 166V104M144 136h96M144 106h96M144 136l30-30M210 136l30-30"/></g>
    <rect x="262" y="40" width="12" height="126" fill="none" stroke="rgba(255,255,255,.92)" stroke-width="2"/><path d="M262 46l12 12-12 12 12 12-12 12 12 12-12 12 12 12-12 12 12 12" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.5"/>
    <rect x="118" y="34" width="192" height="8" fill="none" stroke="rgba(255,255,255,.92)" stroke-width="2"/><path d="M118 42l8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.3"/>
    <rect x="256" y="24" width="24" height="15" rx="2" fill="#FFD166"/><rect x="262" y="27" width="10" height="6" rx="1" fill="rgba(0,0,0,.25)"/><rect x="288" y="42" width="20" height="12" class="b3"/>
    <path d="M160 42v50" stroke="rgba(255,255,255,.9)" stroke-width="1.5"/><path d="M160 92q0 6 5 6t4-5" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="2"/>
    <path d="M165 98l-11 17M165 98l9 17" stroke="rgba(255,255,255,.7)" stroke-width="1.2"/>
    ${_pawn(160,140,13,"#FFD166","")}
    <path d="M38 166l9-32h7l9 32z" fill="#FF8A3D"/><path d="M42.5 152h17" stroke="#FFF" stroke-width="4"/><rect x="34" y="163" width="33" height="5" rx="2" fill="#FF8A3D"/>
    <g class="w1"><rect x="80" y="158" width="18" height="8" rx="1"/><rect x="100" y="158" width="18" height="8" rx="1"/><rect x="90" y="150" width="18" height="8" rx="1"/></g>`,
  /* Hängebrücke über dem Fluss */
  b_system:()=>{const q=(a,b,c,t)=>(1-t)*(1-t)*a+2*(1-t)*t*b+t*t*c;let h="";for(let i=1;i<12;i++){const t=i/12;const x=q(126,191,256,t),y=q(42,118,42,t);h+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)}V126"/>`}
    for(let i=1;i<6;i++){const t=i/6;const x=q(-4,70,126,t),y=q(112,92,42,t);h+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)}V126"/>`;const x2=q(256,290,324,t),y2=q(42,80,100,t);h+=`<path d="M${x2.toFixed(1)} ${y2.toFixed(1)}V126"/>`}
    return `<path d="M60 52q5-5 10 0q5-5 10 0M90 40q4-4 8 0q4-4 8 0" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M-10 140c50-22 110-28 170-18s110 0 170-12V210H-10z" class="b1"/>
    <rect y="148" width="320" height="60" class="w3"/>${_waves(160,3,26,"sw2",1.6)}${_waves(176,3,30,"sw2",1.6)}${_waves(192,3,34,"sw3",1.6)}
    <rect x="114" y="132" width="24" height="26" class="b2"/><rect x="244" y="132" width="24" height="26" class="b2"/>
    <g stroke="rgba(255,255,255,.65)" stroke-width="1.1">${h}</g>
    <path d="M-4 112Q70 92 126 42Q191 118 256 42Q290 80 324 100" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="2.4"/>
    <rect y="126" width="320" height="9" class="b3"/><path d="M0 121h320" stroke="rgba(255,255,255,.5)" stroke-width="1.4"/>
    <rect x="120" y="38" width="12" height="96" class="w0"/><rect x="250" y="38" width="12" height="96" class="w0"/>
    <rect x="116" y="66" width="20" height="5" class="w1"/><rect x="246" y="66" width="20" height="5" class="w1"/><rect x="116" y="96" width="20" height="5" class="w1"/><rect x="246" y="96" width="20" height="5" class="w1"/>
    <circle cx="126" cy="36" r="3.4" fill="#FF6B5B"/><circle cx="256" cy="36" r="3.4" fill="#FF6B5B"/>`},
  /* Burg aus Türmen in Turmform (Schach!), mit Garten */
  w_quiet_e4:()=>{const rook=(x,y,w,h,cls)=>{const m=w/5;return `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/><rect x="${x-3}" y="${y-8}" width="${w+6}" height="10"/><rect x="${x-3}" y="${y-17}" width="${m+1}" height="10"/><rect x="${x+w/2-m/2}" y="${y-17}" width="${m}" height="10"/><rect x="${x+w+2-m}" y="${y-17}" width="${m+1}" height="10"/></g>`};
    return `<circle cx="66" cy="48" r="26" class="w3"/><circle cx="66" cy="48" r="16" class="w2"/>
    <path d="M-10 150c40-24 100-32 160-22s110 6 170-8V210H-10z" class="w3"/>
    ${rook(160,92,24,66,"w0")}${rook(256,92,24,66,"w0")}
    <g class="w1"><rect x="182" y="114" width="76" height="44"/>${[0,1,2,3,4,5].map(k=>`<rect x="${184+k*12.4}" y="107" width="7" height="8"/>`).join("")}</g>
    ${rook(206,64,28,94,"w0")}
    <path d="M220 46V24" stroke="rgba(255,255,255,.95)" stroke-width="2"/><path d="M220 24h18l-5 5 5 5h-18z" fill="#F25C54"/>
    <path d="M172 75V60" stroke="rgba(255,255,255,.9)" stroke-width="1.6"/><path d="M172 60h12l-3 3.5 3 3.5h-12z" fill="#FFD166"/>
    <path d="M268 75V60" stroke="rgba(255,255,255,.9)" stroke-width="1.6"/><path d="M268 60h12l-3 3.5 3 3.5h-12z" fill="#FFD166"/>
    <g class="b2"><rect x="168" y="104" width="8" height="13" rx="4"/><rect x="264" y="104" width="8" height="13" rx="4"/><rect x="216" y="80" width="8" height="14" rx="4"/><rect x="216" y="104" width="8" height="12" rx="4"/></g>
    <path d="M210 158v-17a10 10 0 0 1 20 0v17z" class="b3"/>
    <g class="b1"><rect x="172" y="92" width="12" height="66"/><rect x="268" y="92" width="12" height="66"/><rect x="220" y="64" width="14" height="94"/></g>
    <path d="M-10 172c70-14 150-12 220-2s80 4 110 0V210H-10z" class="b1"/>
    <path d="M214 158c-4 14-20 28-42 46h60c-10-18-14-32-12-46z" class="w3"/>
    <g><rect x="117" y="150" width="4" height="14" fill="#6E4524"/><circle cx="119" cy="142" r="14" class="w1"/><rect x="297" y="152" width="4" height="12" fill="#6E4524"/><circle cx="299" cy="145" r="11" class="w1"/><rect x="139" y="160" width="3" height="9" fill="#6E4524"/><circle cx="140.5" cy="154" r="9" class="w2"/></g>
    <g fill="#FFD166"><circle cx="100" cy="176" r="2.2"/><circle cx="110" cy="182" r="2.2"/><circle cx="290" cy="178" r="2.2"/></g><g fill="#F7A8B8"><circle cx="104" cy="183" r="2.2"/><circle cx="300" cy="183" r="2.2"/></g>`},
  /* Bastion mit Wappenschild */
  b_solid:()=>{let br="";for(let r=0;r<5;r++){const y=124+r*16;br+=`<path d="M0 ${y}h320" />`;for(let x=(r%2?14:0);x<320;x+=28)br+=`<path d="M${x} ${y}v16"/>`}
    return `<g stroke="rgba(255,255,255,.75)" stroke-width="4" stroke-linecap="round"><path d="M166 34L292 156M294 34L168 156"/></g>
    <g fill="#FFD166"><path d="M160 28l12 3-6 8z"/><path d="M300 28l-12 3 6 8z"/></g>
    <g class="b2"><rect y="120" width="320" height="90"/>${[0,1,2,3,4,5,6,7,8,9,10].map(k=>`<rect x="${k*32-6}" y="106" width="20" height="16"/>`).join("")}</g>
    <g stroke="rgba(0,0,0,.2)" stroke-width="1.2" fill="none">${br}</g>
    <path d="M230 36l54 15v40c0 36-25 57-54 67-29-10-54-31-54-67V51z" class="w0"/>
    <path d="M230 47l44 12v32c0 29-20 46-44 55-24-9-44-26-44-55V59z" style="fill:var(--c1)"/>
    <path d="M230 47l44 12v32c0 29-20 46-44 55z" class="b1"/>
    <g class="w0"><rect x="216" y="118" width="28" height="7" rx="2"/><path d="M220 118l3-26h14l3 26z"/><rect x="216" y="86" width="28" height="7" rx="1"/><rect x="216" y="78" width="6" height="9"/><rect x="227" y="78" width="6" height="9"/><rect x="238" y="78" width="6" height="9"/></g>
    <path d="M166 160h128l-10 10 10 10H166l10-10z" fill="#FFD166"/><path d="M176 170h108" stroke="rgba(0,0,0,.2)" stroke-width="1.4"/>
    <g><rect x="40" y="132" width="6" height="18" fill="#6E4524"/>${_flame(43,132,7,22,"#FF8A3D")}${_flame(43,130,4,13,"#FFD166")}<rect x="100" y="132" width="6" height="18" fill="#6E4524"/>${_flame(103,132,7,22,"#FF8A3D")}${_flame(103,130,4,13,"#FFD166")}</g>
    ${_stars(14,3,90,1)}`},
  /* Hafen: Anker auf der Mole und ein Segelschiff */
  b_classic:()=>`<path d="M180 38q5-5 10 0q5-5 10 0M208 26q4-4 8 0q4-4 8 0M60 52q4-4 8 0q4-4 8 0" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.6" stroke-linecap="round"/>
    ${_seaFill(140,4,34,"w3")}${_waves(156,3,28,"sw2",1.6)}${_waves(174,3,32,"sw2",1.6)}
    <path d="M236 134V52M274 134V62" stroke="#4A3428" stroke-width="3"/>
    <path d="M218 60h36q4 14 0 30h-36q4-16 0-30z" class="w0"/><path d="M216 96h40q4 14 0 30h-40q4-16 0-30z" class="w0"/><path d="M260 70h28q3 12 0 24h-28q3-12 0-24z" class="w1"/><path d="M258 100h32q3 12 0 24h-32q3-12 0-24z" class="w1"/>
    <path d="M236 52h16l-4 4 4 4h-16z" fill="#F25C54"/>
    <path d="M190 134h126l-14 24h-98z" class="b3"/><path d="M196 140h114" stroke="#FFD166" stroke-width="2"/><g fill="#FFD166"><circle cx="222" cy="147" r="2.2"/><circle cx="246" cy="147" r="2.2"/><circle cx="270" cy="147" r="2.2"/></g>
    <g class="b3"><rect x="-4" y="124" width="178" height="10" rx="1"/><rect x="18" y="134" width="7" height="62"/><rect x="62" y="134" width="7" height="62"/><rect x="106" y="134" width="7" height="62"/><rect x="150" y="134" width="7" height="62"/></g>
    <rect x="156" y="110" width="12" height="15" rx="3" class="b4"/><path d="M168 116q20 2 30 18" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.8"/>
    <g fill="none" stroke="rgba(255,255,255,.96)" stroke-linecap="round"><circle cx="112" cy="44" r="7" stroke-width="4"/><path d="M112 51v72M96 64h32" stroke-width="5"/><path d="M86 98q26 32 52 0" stroke-width="5"/></g>
    <g class="w0"><path d="M80 92l11 2-6 8z"/><path d="M144 92l-11 2 6 8z"/></g>`,
  /* Leuchtturm auf der Klippe mit Lichtkegel und Kompassrose */
  w_d4:()=>{const L=y=>222+(140-y)*(6/70),Rr=y=>254-(140-y)*(6/70);const band=(a,b)=>`<path d="M${L(b).toFixed(1)} ${b}L${Rr(b).toFixed(1)} ${b}L${Rr(a).toFixed(1)} ${a}L${L(a).toFixed(1)} ${a}z" fill="#F25C54"/>`;
    return `${_stars(18,11,90,1)}
    <path d="M236 57L-10 6V112z" class="w3 beam"/><path d="M236 57L-10 32V84z" class="w3"/>
    <g opacity=".85"><circle cx="72" cy="150" r="30" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.4"/><path d="M72 116l5 29 29 5-29 5-5 29-5-29-29-5 29-5z" class="w2"/><path d="M72 116l5 29-5 5z" class="w0"/><text x="68.5" y="112" class="scn-t sm">N</text></g>
    ${_seaFill(150,3,30,"b1")}${_waves(166,3,26,"sw2",1.6)}${_waves(184,3,30,"sw2",1.6)}
    <path d="M186 210L204 152l24-14 34 2 28 12 40 8V210z" class="b3"/><path d="M204 152l24-14 14 1-10 18z" class="b2"/>
    <path d="M222 140L228 70H248L254 140z" fill="#FFF"/>${band(120,132)}${band(96,108)}${band(74,82)}<path d="M238 70H248L254 140H241z" fill="rgba(0,0,0,.12)"/>
    <rect x="221" y="64" width="34" height="6" rx="1" fill="#2B2B33"/><circle cx="238" cy="57" r="17" class="w2"/><rect x="228" y="49" width="20" height="15" rx="2" fill="#FFE9A8"/><path d="M233 49v15M243 49v15" stroke="rgba(0,0,0,.25)" stroke-width="1.4"/>
    <path d="M224 49L238 36L252 49z" fill="#F25C54"/><circle cx="238" cy="34" r="2.2" fill="#2B2B33"/><rect x="234" y="128" width="8" height="12" rx="3" fill="#8A5A33"/>`},
  /* Bogenschießen im Wald: Zielscheibe mit Pfeilen, Flugbahn von der Flanke */
  w_flank:()=>{const pine=(x,y,s)=>`<path d="M${x} ${y-s*2.4}l${s*.8} ${s}h${-s*.35}l${s*.75} ${s*.9}h${-s*.4}l${s*.8} ${s}h${-s*2.1}l${s*.8} ${-s}h${-s*.4}l${s*.75} ${-s*.9}h${-s*.35}z"/><rect x="${x-s*.12}" y="${y-2}" width="${s*.24}" height="${s*.5}"/>`;
    let t="<g class=\"b1\">";[10,38,66,96,124,152,268,290,312].forEach((x,i)=>t+=pine(x,152,14+(i%3)*4));t+="</g><g class=\"b2\">";[24,52,84,112,140,282,304].forEach((x,i)=>t+=pine(x,172,18+(i%2)*5));t+="</g>";
    return `${t}<rect y="168" width="320" height="40" class="b2"/>
    <path d="M30 172C70 90 130 60 196 84" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.6" stroke-dasharray="3 6" stroke-linecap="round"/>
    <path d="M222 138l-16 40M244 138l16 40M233 140v38" stroke="#8A5A33" stroke-width="4" stroke-linecap="round"/>
    <circle cx="233" cy="100" r="42" fill="#FFF"/><circle cx="233" cy="100" r="34" fill="#F25C54"/><circle cx="233" cy="100" r="26" fill="#FFF"/><circle cx="233" cy="100" r="18" fill="#F25C54"/><circle cx="233" cy="100" r="9" fill="#FFD166"/>
    <path d="M233 58a42 42 0 0 1 0 84z" fill="rgba(0,0,0,.08)"/>
    <g stroke="#3B2A20" stroke-width="2.4" stroke-linecap="round"><path d="M186 74L230 98"/><path d="M196 140L237 104"/></g>
    <g fill="#7CC6FE"><path d="M186 74l-7-1 3 6zM190 76l-7-1 3 6z"/></g><g fill="#FFD166"><path d="M196 140l-2 7 6-2zM199 137l-2 7 6-2z"/></g>`},
  /* Weltreise: Galeone bei Sonnenuntergang, Inseln und Kurslinie */
  w_e4:()=>`<path d="M10 40C90 8 170 70 300 26" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.6" stroke-dasharray="3 6" stroke-linecap="round"/><path d="M296 20l8 8M304 20l-8 8" stroke="#F25C54" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="252" cy="128" r="62" class="w3"/><circle cx="252" cy="128" r="42" fill="#FFD08A"/>
    ${_seaFill(132,3,30,"b1")}${_waves(150,3,26,"sw2",1.6)}${_waves(168,3,30,"sw2",1.6)}${_waves(186,3,34,"sw3",1.6)}
    <path d="M14 134q32-26 66 0z" class="b2"/><path d="M44 116q-2-14 6-26" fill="none" stroke="#6E4524" stroke-width="3" stroke-linecap="round"/><path d="M50 90q-14-4-22 4 12-1 22-4zM50 90q10-10 22-6-12 3-22 6zM50 90q4-12 14-14-6 8-14 14z" fill="rgba(0,0,0,.3)"/>
    <path d="M172 126V46M202 126V54M146 126V70" stroke="#4A3428" stroke-width="2.6"/>
    <path d="M156 52h32q4 12 0 26h-32q4-14 0-26z" class="w0"/><path d="M154 84h36q4 14 0 30h-36q4-16 0-30z" class="w0"/><path d="M190 60h26q3 11 0 22h-26q3-11 0-22z" class="w1"/><path d="M188 88h30q3 12 0 24h-30q3-12 0-24z" class="w1"/><path d="M134 76h24q3 10 0 20h-24q3-10 0-20z" class="w1"/>
    <path d="M232 112L206 72v40z" class="w2"/>
    <path d="M172 46h14l-3 4 3 4h-14z" fill="#F25C54"/>
    <path d="M118 126h122l-14 22h-96z" class="b3"/><path d="M124 132h110" stroke="#FFD166" stroke-width="2"/>
    <path d="M60 58q5-5 10 0q5-5 10 0" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.6" stroke-linecap="round"/>`,
  /* Angriff: der König im Feuer, Angriffspfeile */
  w_attack:()=>`<circle cx="240" cy="118" r="78" fill="#FFD166" opacity=".1"/><circle cx="240" cy="128" r="54" fill="#FFD166" opacity=".12"/>
    <g fill="#FFD166" opacity=".9"><circle cx="150" cy="60" r="2"/><circle cx="292" cy="44" r="2.4"/><circle cx="170" cy="30" r="1.6"/><circle cx="300" cy="96" r="1.8"/><circle cx="196" cy="40" r="1.4"/><circle cx="282" cy="20" r="1.5"/></g>
    <g transform="translate(240 178) scale(.8) translate(-240 -167)"><g class="b4"><rect x="236" y="12" width="8" height="30" rx="1.5"/><rect x="226" y="20" width="28" height="8" rx="1.5"/><path d="M211 49c11-8 47-8 58 0l-8 33h-42z"/><rect x="213" y="80" width="54" height="9" rx="3"/><path d="M222 89c-1 24-6 44-15 62h66c-9-18-14-38-15-62z"/><rect x="201" y="147" width="78" height="8" rx="3"/><rect x="193" y="154" width="94" height="13" rx="5"/></g>
    <path d="M216 47c2-1 4-1.6 6-2l-6 31h-2z" fill="#FFD166" opacity=".5"/></g>
    ${_flame(206,180,22,56,"#FF5A36")}${_flame(240,180,28,70,"#FF5A36")}${_flame(275,180,22,54,"#FF5A36")}${_flame(186,180,15,38,"#FF5A36")}${_flame(298,180,15,36,"#FF5A36")}
    ${_flame(214,180,17,44,"#FF8A3D")}${_flame(244,180,20,56,"#FF8A3D")}${_flame(271,180,16,40,"#FF8A3D")}
    ${_flame(226,180,10,28,"#FFD166")}${_flame(250,180,12,36,"#FFD166")}${_flame(267,180,9,24,"#FFD166")}
    <rect y="176" width="320" height="30" class="b2"/>
    <g stroke="rgba(255,255,255,.92)" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M40 158L180 112"/><path d="M62 50L188 90"/><path d="M30 110L180 102"/></g>
    <g class="w0"><path d="M188 109l-13-4 4 10z"/><path d="M196 93l-12-7 0 11z"/><path d="M189 101.5l-12-6 1 11z"/></g>
    <g class="w1"><circle cx="40" cy="158" r="6"/><circle cx="62" cy="46" r="6"/><circle cx="30" cy="108" r="6"/></g>`,
  /* Gewitter: Wolken, Blitze und ein springender Springer */
  b_counter:()=>{let rain="";const r=_rng(5);for(let i=0;i<34;i++){const x=r()*320,y=60+r()*110;rain+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)}l-5 12"/>`}
    return `<g stroke="rgba(255,255,255,.35)" stroke-width="1.4" stroke-linecap="round">${rain}</g>
    <g class="b1"><circle cx="70" cy="52" r="26"/><circle cx="110" cy="44" r="30"/><circle cx="160" cy="52" r="30"/><circle cx="210" cy="40" r="28"/><circle cx="256" cy="52" r="26"/><circle cx="296" cy="44" r="24"/><rect x="50" y="52" width="270" height="22"/></g>
    <g class="w2"><circle cx="86" cy="36" r="24"/><circle cx="130" cy="26" r="30"/><circle cx="182" cy="34" r="28"/><circle cx="230" cy="24" r="26"/><circle cx="276" cy="34" r="24"/><rect x="70" y="34" width="230" height="22"/></g>
    <path class="bolt" d="M182 60L160 108h18l-14 44 44-58h-20l14-34z" fill="#FFE066"/><path d="M182 60L160 108h18l-14 44 2-44h-12z" fill="rgba(255,255,255,.35)"/>
    <path class="bolt b2l" d="M262 62l-12 26h10l-8 24 24-32h-11l8-18z" fill="#FFE066" opacity=".9"/>
    <rect y="168" width="320" height="40" class="b2"/>
    <g class="w0"><rect x="62" y="156" width="54" height="11" rx="4"/><path d="M72 156c-2-18 6-30 18-38l-12-4c-6-1-11 5-15 1-4-5 2-11 10-17 9-6 13-16 24-18l4-9 5 10c16 7 23 23 21 44-1 13-6 21-7 31z"/></g>
    <circle cx="88" cy="110" r="2.2" fill="#2B2321"/><path d="M94 100l8-4" stroke="rgba(0,0,0,.2)" stroke-width="2"/>`},
  /* Weitblick: Läuferturm auf dem Hügel, die lange Diagonale */
  b_hyper:()=>`<circle cx="276" cy="40" r="26" class="w3"/><circle cx="276" cy="40" r="16" class="w2"/>
    <path d="M118 52L330 156V176L118 62z" class="w3"/><path d="M118 57L322 160" stroke="rgba(255,255,255,.8)" stroke-width="1.6" stroke-dasharray="5 6" stroke-linecap="round"/><path d="M318 152l8 10-12 1z" fill="#FFD166"/>
    <path d="M-10 160c40-24 90-36 140-30s100 10 200-6V210H-10z" class="b1"/><path d="M-10 178c80-14 160-16 230-4s70 8 110 4V210H-10z" class="b2"/>
    <g class="w0"><rect x="76" y="148" width="52" height="13" rx="5"/><path d="M86 148l6-58h20l6 58z"/><rect x="84" y="82" width="36" height="10" rx="4"/><path d="M102 30c-16 13-19 33-12 52h24c7-19 4-39-12-52z"/><circle cx="102" cy="25" r="5"/></g>
    <path d="M96 56l14-12" stroke="rgba(0,0,0,.3)" stroke-width="3.5" stroke-linecap="round"/><path d="M102 30c16 13 19 33 12 52h-12z" class="b1"/>
    <rect x="98" y="104" width="8" height="14" rx="4" class="b2"/><rect x="99" y="128" width="6" height="10" rx="3" fill="#FFD166"/>
    <path d="M150 90q4-4 8 0q4-4 8 0M180 74q5-5 10 0q5-5 10 0" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.6" stroke-linecap="round"/>`,
  /* Supernova im All, Ringplanet und Komet */
  b_sharp:()=>{let rays="";for(let i=0;i<16;i++){const a=i*Math.PI/8,l=i%2?40:76;rays+=`<path d="M${(226+Math.cos(a)*14).toFixed(1)} ${(92+Math.sin(a)*14).toFixed(1)}L${(226+Math.cos(a)*l).toFixed(1)} ${(92+Math.sin(a)*l).toFixed(1)}"/>`}
    return `${_stars(60,17,200,1.4)}<circle cx="226" cy="92" r="78" class="w3"/><circle cx="226" cy="92" r="52" class="w3"/><circle cx="226" cy="92" r="32" class="w2"/>
    <g class="rays" stroke="rgba(255,255,255,.7)" stroke-width="1.8" stroke-linecap="round">${rays}</g>
    <ellipse cx="226" cy="92" rx="96" ry="3" class="w1"/><ellipse cx="226" cy="92" rx="3" ry="70" class="w1"/><circle cx="226" cy="92" r="15" class="w0"/><circle cx="226" cy="92" r="8" fill="#FFF6D8"/>
    <path d="M14 150a56 12 -12 0 1 108-24" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3.5"/>
    <circle cx="68" cy="146" r="32" class="b2"/><path d="M68 114a32 32 0 0 1 0 64 26 32 0 0 0 0-64z" class="w3"/><path d="M44 130q24 8 48 0M40 150q28 8 56 0" stroke="rgba(255,255,255,.2)" stroke-width="3" fill="none"/>
    <path d="M122 126a56 12 -12 0 1-108 24" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3.5"/>
    <circle cx="132" cy="40" r="8" class="w1"/><circle cx="129" cy="37" r="3" class="w3"/>
    <path d="M24 52l42 16" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-linecap="round"/><circle cx="68" cy="69" r="3" class="w0"/>`},
  /* Der Ätna bricht aus: Lava, Rauch und Glut */
  b_sicilian:()=>`<g class="w2"><circle cx="196" cy="40" r="18"/><circle cx="222" cy="28" r="22"/><circle cx="250" cy="40" r="18"/><circle cx="236" cy="12" r="16"/><circle cx="206" cy="16" r="13"/></g><g class="b1"><circle cx="186" cy="52" r="12"/><circle cx="262" cy="54" r="12"/></g>
    <path d="M110 172L186 76h52l76 96z" class="b3"/><path d="M186 76h26l14 96H110z" class="b2"/>
    <ellipse cx="212" cy="76" rx="26" ry="5" fill="#FF6B1A"/>
    <g class="lava"><path d="M212 76c-12-18-7-38 0-50 7 12 12 32 0 50z" fill="#FFD166"/><path d="M212 76c-6-10-4-22 0-30 4 8 6 20 0 30z" fill="#FFF3C4"/></g>
    <path d="M198 78c-4 20-15 30-13 50s-7 24-9 44" fill="none" stroke="#FF8A3D" stroke-width="6" stroke-linecap="round"/><path d="M228 78c6 18 2 34 12 52s4 26 10 42" fill="none" stroke="#FF6B1A" stroke-width="5" stroke-linecap="round"/>
    <path d="M198 78c-4 20-15 30-13 50" fill="none" stroke="#FFD166" stroke-width="2" stroke-linecap="round"/>
    <g fill="#FFB02E"><circle cx="196" cy="34" r="4"/><circle cx="234" cy="22" r="5"/><circle cx="252" cy="44" r="3.4"/><circle cx="214" cy="14" r="3"/><circle cx="182" cy="56" r="2.6"/></g>
    ${_seaFill(170,3,30,"b1")}${_waves(184,3,28,"sw2",1.6)}
    <g class="w1"><rect x="92" y="160" width="10" height="9"/><rect x="106" y="158" width="10" height="11"/><rect x="296" y="160" width="10" height="9"/></g><g fill="#F25C54"><path d="M91 160l6-5 6 5zM105 158l6-5 6 5zM295 160l6-5 6 5z"/></g>
    <circle cx="60" cy="54" r="20" class="w3"/>`,
  /* Piratenschiff, ein Bauer treibt im Rettungsring */
  gambits:()=>`<circle cx="58" cy="44" r="22" class="w3"/><circle cx="58" cy="44" r="13" class="w2"/>
    <path d="M198 132V40M242 132V54" stroke="#3B2A20" stroke-width="3.2"/>
    <path d="M176 56q22 7 44 0v32q-22 7-44 0z" class="w0"/><path d="M172 96q26 7 52 0v30q-26 7-52 0z" class="w0"/><path d="M224 66q18 6 36 0v24q-18 6-36 0z" class="w1"/><path d="M222 98q20 6 40 0v24q-20 6-40 0z" class="w1"/>
    <rect x="186" y="104" width="12" height="9" rx="1" transform="rotate(-8 192 108)" fill="#E8D9A8"/>
    <rect x="192" y="58" width="13" height="6" rx="1" fill="#3B2A20"/>
    <rect x="198" y="28" width="26" height="16" rx="1" fill="#1E1E1E"/><g fill="#FFF"><circle cx="211" cy="32.5" r="2.6"/><path d="M208.2 41l1-5.6h3.6l1 5.6z"/><rect x="207" y="40.5" width="8" height="1.8" rx=".8"/></g>
    <path d="M150 132h134l-16 26h-102z" class="b4"/><rect x="252" y="116" width="32" height="16" rx="1" class="b4"/>
    <g fill="#FFD166"><circle cx="176" cy="142" r="3"/><circle cx="196" cy="142" r="3"/><circle cx="216" cy="142" r="3"/><circle cx="236" cy="142" r="3"/><circle cx="256" cy="142" r="3"/></g>
    ${_seaFill(150,5,34,"b1")}
    <circle cx="86" cy="152" r="16" fill="none" stroke="#FFF" stroke-width="7"/><circle cx="86" cy="152" r="16" fill="none" stroke="#F25C54" stroke-width="7" stroke-dasharray="12.57 12.57"/>
    ${_pawn(86,150,11,"w0","o")}
    <path d="M60 140l-8-6M112 140l8-6M62 130l-6-10M110 130l6-10" stroke="rgba(255,255,255,.75)" stroke-width="1.6" stroke-linecap="round"/>
    ${_seaFill(166,4,30,"b2")}${_waves(182,3,28,"sw2",1.6)}`,
  /* Schatzinsel: Palme, X auf dem Sand, offene Truhe voller Gold */
  w_gambit:()=>`<circle cx="264" cy="44" r="32" class="w3"/><circle cx="264" cy="44" r="20" fill="#FFE08A"/>
    ${_seaFill(144,3,30,"b1")}${_waves(160,3,26,"sw2",1.6)}${_waves(180,3,30,"sw2",1.6)}
    <path d="M84 166q66-46 160-12 28 10 40 22H74z" fill="#F2D49B"/><path d="M180 140q50 6 104 36H200z" fill="rgba(0,0,0,.1)"/>
    <path d="M150 160q-8-44 12-86" fill="none" stroke="#8A5A33" stroke-width="7" stroke-linecap="round"/><path d="M150 160q-8-44 12-86" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="2" stroke-dasharray="3 5"/>
    <g fill="#2E9E6A"><path d="M162 74q-30-14-48 6 24-6 48-6z"/><path d="M162 74q-14-26-40-22 22 6 40 22z"/><path d="M162 74q10-28 38-24-22 6-38 24z"/><path d="M162 74q32-8 46 14-24-10-46-14z"/></g><path d="M162 74q-2-24 18-34-12 14-18 34z" fill="#3BB37A"/>
    <g fill="#8A5A33"><circle cx="158" cy="80" r="4"/><circle cx="166" cy="82" r="4"/></g>
    <path d="M120 150l14 10M134 150l-14 10" stroke="#F25C54" stroke-width="4" stroke-linecap="round"/>
    <circle cx="222" cy="132" r="24" class="w3"/>
    <rect x="202" y="134" width="40" height="22" rx="2" fill="#8A5A33"/><path d="M202 134l6-20h40l-6 20z" fill="#6E4524"/>
    <g fill="#FFD166"><circle cx="212" cy="132" r="5"/><circle cx="222" cy="129" r="5.5"/><circle cx="232" cy="132" r="5"/><circle cx="217" cy="126" r="4.5"/><circle cx="227" cy="125" r="4.5"/></g>
    <g fill="#FFD166"><rect x="210" y="134" width="3" height="22"/><rect x="231" y="134" width="3" height="22"/><rect x="219" y="140" width="6" height="7" rx="1"/></g>
    <path d="M64 70q5-5 10 0q5-5 10 0" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.6" stroke-linecap="round"/>`,
  /* Geisterschiff im Nebel unter dem Vollmond */
  b_gambit:()=>`${_stars(30,23,110,1.1)}<circle cx="236" cy="56" r="44" class="w3"/><circle cx="236" cy="56" r="32" fill="#F4F1E6" opacity=".9"/><g class="b1"><circle cx="226" cy="48" r="5"/><circle cx="246" cy="66" r="7"/><circle cx="244" cy="44" r="3"/></g>
    <path d="M168 126V40M204 126V52" stroke="rgba(255,255,255,.42)" stroke-width="3"/>
    <path d="M148 50h40v38l-6-5-6 6-6-5-6 6-6-5-6 6-4-4z" class="w2"/><path d="M146 92h44v28l-6-4-6 5-6-4-6 5-6-4-6 5-8-5z" class="w2"/><path d="M190 60h30v28l-5-4-5 5-5-4-5 5-5-4z" class="w3"/>
    <path d="M118 126h114l-14 22h-86z" class="w2"/><path d="M124 132h102" stroke="rgba(255,255,255,.4)" stroke-width="2"/>
    <g fill="#7CF5E6" class="glow"><circle cx="140" cy="122" r="3.4"/><circle cx="222" cy="120" r="3.4"/></g><g class="w3"><circle cx="140" cy="122" r="9"/><circle cx="222" cy="120" r="9"/></g>
    <rect y="146" width="320" height="64" class="b2"/>
    <path d="M-10 132c60-10 120 4 190-2s110-10 150-2v12c-60-6-110 0-160 4s-120-2-180-2z" class="w3"/><path d="M-10 160c80-8 150 6 220 0s80-6 120-2v10c-50-4-90 2-130 6s-130-2-210-4z" class="w3"/>
    <path d="M-10 210V184l30-18 24 10 30-14 40 22 10 26z" class="b3"/><path d="M330 210V180l-26-16-30 18-20-8-24 26z" class="b3"/>`
};
function sceneSvg(id,cls){const f=SCENES[id]||SCENES.w_start;return `<svg class="scn${cls?" "+cls:""}" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${f()}</svg>`}

/* Kleine Motive für die Abenteuerkarte (24×24, Linien) */
const MAPDECO={
  book:"M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z M20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z",
  star:"M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z",
  pawn:"M8 21h8 M9 21c0-4 1-7 2-9h2c1 2 2 5 2 9 M10 12h4 M12 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
  moon:"M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z",
  brick:"M3 7h18v10H3z M3 12h18 M9 7v5 M15 12v5",
  cone:"M9 4h6l4 15H5z M7 12h10 M3 20h18",
  gear:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M19 5l-2 2 M7 17l-2 2",
  wave:"M2 10q2.5-3 5 0t5 0 5 0 5 0 M2 16q2.5-3 5 0t5 0 5 0 5 0",
  tree:"M12 3l6 9h-4l4 6H6l4-6H6z M12 18v3",
  flower:"M12 12a2 2 0 1 0 0-.1 M12 8a2.5 2.5 0 1 1 0-.1 M16 12a2.5 2.5 0 1 1 0-.1 M12 16a2.5 2.5 0 1 1 0-.1 M8 12a2.5 2.5 0 1 1 0-.1 M12 18v4",
  shield:"M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z",
  rock:"M3 19l4-8 4 2 3-6 7 12z",
  gull:"M3 12q4-5 9 0q5-5 9 0",
  anchor:"M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M12 7v14 M5 13a7 7 0 0 0 14 0",
  target:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  palm:"M12 21c0-6 1-10 3-13 M15 8c-3-3-7-3-10 0 M15 8c1-3 4-5 7-4 M15 8c3-1 6 0 7 3",
  flame:"M12 22c4 0 7-3 7-7 0-4-3-6-4-9-1 2-2 3-3 3 0-2-1-4-3-6 0 4-4 6-4 11 0 5 3 8 7 8z",
  spark:"M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5 18 18 M18 6l-2.5 2.5 M8.5 15.5 6 18",
  cloud:"M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.5A3.5 3.5 0 0 0 7 18z",
  bolt:"M13 2 4 14h7l-1 8 9-12h-7z",
  bird:"M3 12q4-5 9 0q5-5 9 0",
  planet:"M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M2 14c3 2 17-2 20-6",
  coin:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 8v8 M9.5 10h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"
};
const decoIcon=(k,s)=>`<svg width="${s||22}" height="${s||22}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${MAPDECO[k]||MAPDECO.star}"/></svg>`;

/* Rangabzeichen: sechs Formen von schlicht bis prunkvoll – Kreis, Raute, Schild, Sechseck, Stern, Lorbeerkranz mit Krone.
   Gefüllt mit der Kursfarbe, Emblem in der Mitte, Punkte zählen die Stufe. state: "on" erreicht, "cur" aktuell, "off" noch nicht */
const _poly=(n,r1,r2,cx,cy,rot)=>{let d="";for(let j=0;j<n*2;j++){const r=j%2?r2:r1,a=(rot||0)+j*Math.PI/n;d+=(j?"L":"M")+(cx+Math.sin(a)*r).toFixed(1)+" "+(cy-Math.cos(a)*r).toFixed(1)}return d+"z"};
const _laurel=col=>{let o="";for(const sd of [-1,1])for(let j=0;j<6;j++){const th=(162-j*22)*Math.PI/180,x=32+sd*Math.sin(th)*24,y=36-Math.cos(th)*24,rot=sd*((162-j*22)-90+22);
  o+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.3" ry="7" transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${col}"/>`}return o};
function rankBadge(icon,i,size,state){
  const s=size||48,off=state==="off",k=Math.max(0,Math.min(5,i|0));
  const A=off?"var(--rb-a,#DADBE0)":"var(--c1)",B=off?"var(--rb-b,#C9CBD2)":"var(--c2)",R=off?"var(--rb-r,rgba(0,0,0,.06))":"#fff",G=off?"var(--rb-b,#C9CBD2)":"#F6C453",ink=off?"var(--rb-ink,#9A9CA6)":"#fff";
  const ring=(d,w)=>`<path d="${d}" fill="${A}"/><path d="${d}" fill="none" stroke="${R}" stroke-width="${w||3}" stroke-linejoin="round"/>`;
  let body="",cy=32;
  if(k===0)body=`<circle cx="32" cy="32" r="24" fill="${A}"/><circle cx="32" cy="32" r="18" fill="${B}" opacity=".45"/><circle cx="32" cy="32" r="24" fill="none" stroke="${R}" stroke-width="3"/>`;
  else if(k===1)body=ring("M32 5.5 58.5 32 32 58.5 5.5 32z")+`<path d="M32 14 50 32 32 50 14 32z" fill="${B}" opacity=".45"/>`;
  else if(k===2)body=ring("M32 4l23 7.5v19c0 15-10 25-23 30C19 55.5 9 45.5 9 30.5v-19z")+`<path d="M32 11l16 5.2v14.2c0 11-7 18.5-16 22.4-9-3.9-16-11.4-16-22.4V16.2z" fill="${B}" opacity=".45"/>`;
  else if(k===3)body=ring("M32 4 56.2 18v28L32 60 7.8 46V18z")+`<path d="M32 12.5 48.8 22.2v19.6L32 51.5 15.2 41.8V22.2z" fill="${B}" opacity=".45"/>`;
  else if(k===4)body=`<path d="${_poly(12,30,24,32,32,0)}" fill="${G}"/><circle cx="32" cy="32" r="20" fill="${A}"/><circle cx="32" cy="32" r="15" fill="${B}" opacity=".45"/><circle cx="32" cy="32" r="20" fill="none" stroke="${R}" stroke-width="2.5"/>`;
  else{cy=35;body=_laurel(G)+`<circle cx="32" cy="35" r="19" fill="${A}"/><circle cx="32" cy="35" r="14" fill="${B}" opacity=".45"/><circle cx="32" cy="35" r="19" fill="none" stroke="${G}" stroke-width="3"/><path d="M20 15.5l4.6 4.8L32 11l7.4 9.3 4.6-4.8-2 9.5H22z" fill="${G}" stroke="${off?"none":"rgba(0,0,0,.18)"}" stroke-width=".8" stroke-linejoin="round"/>`}
  const em=CRS_IC[icon]||CRS_IC.cap,dy=k>0&&k<5?-3:0;
  const pips=k>0&&k<5?`<g fill="${ink}">${Array.from({length:k},(_,j)=>`<circle cx="${(32-(k-1)*3.6+j*7.2).toFixed(1)}" cy="${k===2?47.5:k===1?47:48}" r="1.9"/>`).join("")}</g>`:"";
  return `<svg class="rbadge${state?" "+state:""}" width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true">${body}<g transform="translate(${32-10.8} ${(cy-10.8+dy).toFixed(1)}) scale(.9)" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${em}"/></g>${pips}</svg>`;
}
