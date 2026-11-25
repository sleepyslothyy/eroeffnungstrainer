/* Bereichsbilder: jede Seite der App bekommt eine eigene Szene im Stil der Kurswelten (viewBox 0 0 320 200).
   Nutzt die Helfer aus worlds.js (_stars, _waves, _seaFill, _pawn, _flame) und dieselben Tonklassen (w0–w3, b1–b4). */

const SECT={
  train:{c1:"#6A48EE",c2:"#B06BFF",pat:"dots"},
  open:{c1:"#0E9F7E",c2:"#7CD992",pat:"rings"},
  tac:{c1:"#F08A24",c2:"#E5484D",pat:"diag"},
  end:{c1:"#3446C9",c2:"#8B5CF0",pat:"stars"},
  quiz:{c1:"#D6336C",c2:"#F783AC",pat:"dots"},
  games:{c1:"#8F5F35",c2:"#D9A066",pat:"grid"},
  bots:{c1:"#2B8A5E",c2:"#79D79A",pat:"grid"},
  ana:{c1:"#0B7A90",c2:"#3BC9DB",pat:"grid"},
  online:{c1:"#1A6FD1",c2:"#6CB8FF",pat:"dots"},
  tour:{c1:"#E8590C",c2:"#F8C23A",pat:"diag"},
  league:{c1:"#C2255C",c2:"#F59F00",pat:"stars"},
  prof:{c1:"#5F3DC4",c2:"#E64980",pat:"dots"},
  coord:{c1:"#2B8A3E",c2:"#A9D63B",pat:"grid"},
  lex:{c1:"#7B2D96",c2:"#D16BE8",pat:"diag"},
  crsmap:{c1:"#1460A8",c2:"#4FB0F5",pat:"waves"},
  scout:{c1:"#3B3D9E",c2:"#1FA39C",pat:"stars"},
  memo:{c1:"#8E4F12",c2:"#CF9128",pat:"dots"}
};

const _star4=(x,y,r,f)=>`<path d="M${x} ${y-r}l${r*.28} ${r*.72} ${r*.72} ${r*.28}-${r*.72} ${r*.28}-${r*.28} ${r*.72}-${r*.28}-${r*.72}-${r*.72}-${r*.28} ${r*.72}-${r*.28}z" fill="${f}"/>`;
const _crown=(x,y,s,f)=>`<path d="M${x-14*s} ${y}l-3 ${-17*s} ${9*s} ${8*s} ${8*s} ${-14*s} ${8*s} ${14*s} ${9*s} ${-8*s} -3 ${17*s}z" fill="${f}"/><rect x="${x-14.5*s}" y="${y}" width="${29*s}" height="${4.5*s}" rx="${1.5*s}" fill="${f}"/>`;
const _knight=(x,y,s,cls)=>`<g transform="translate(${x} ${y}) scale(${s})" class="${cls}"><rect x="-27" y="38" width="54" height="11" rx="4"/><path d="M-17 38c-2-18 6-30 18-38l-12-4c-6-1-11 5-15 1-4-5 2-11 10-17 9-6 13-16 24-18l4-9 5 10c16 7 23 23 21 44-1 13-6 21-7 31z"/></g>`;
const _king=(x,y,s,cls)=>`<g transform="translate(${x} ${y}) scale(${s})" class="${cls}"><rect x="-3.5" y="-46" width="7" height="20" rx="1"/><rect x="-10" y="-40" width="20" height="6" rx="1"/><path d="M-20-12c0-11 9-17 20-17s20 6 20 17z"/><rect x="-22" y="-14" width="44" height="8" rx="3"/><path d="M-15-6l-6 40h42l-6-40z"/><rect x="-27" y="32" width="54" height="10" rx="4"/></g>`;
const _queen=(x,y,s,cls)=>`<g transform="translate(${x} ${y}) scale(${s})" class="${cls}"><circle cx="0" cy="-44" r="5"/><path d="M-22-30l7 22h30l7-22-12 10-8-16-8 16z"/><rect x="-18" y="-10" width="36" height="7" rx="3"/><path d="M-14-3l-6 37h40l-6-37z"/><rect x="-26" y="32" width="52" height="10" rx="4"/></g>`;

const SECT_SCN={
  /* Notizen: eine Pinnwand mit drei Zetteln – einer zeigt eine kleine Stellung mit Pfeil */
  memo:()=>`<rect x="136" y="30" width="176" height="142" rx="10" class="b2"/>
    <rect x="136" y="30" width="176" height="142" rx="10" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="3"/>
    <g transform="rotate(-7 182 78)"><rect x="150" y="48" width="64" height="60" rx="3" class="w1"/><path d="M158 66h46M158 76h40M158 86h44M158 96h28" stroke="rgba(0,0,0,.26)" stroke-width="3" stroke-linecap="round"/></g>
    <g transform="rotate(6 262 80)"><rect x="228" y="46" width="68" height="64" rx="3" class="w0"/>
      <g transform="translate(240 58)"><rect width="44" height="44" fill="rgba(0,0,0,.1)"/><path d="M0 0h11v11H0zM22 0h11v11H22zM11 11h11v11H11zM33 11h11v11H33zM0 22h11v11H0zM22 22h11v11H22zM11 33h11v11H11zM33 33h11v11H33z" fill="rgba(0,0,0,.3)"/><circle cx="27.5" cy="16.5" r="4.2" fill="rgba(0,0,0,.78)"/><path d="M8 38L25 20" stroke="#F25C54" stroke-width="3" stroke-linecap="round"/><path d="M26 19l-7 1.5 5.5 5.5z" fill="#F25C54"/></g></g>
    <g transform="rotate(-3 214 138)"><rect x="176" y="112" width="78" height="50" rx="3" class="w1"/><path d="M186 128h54M186 138h44M186 148h50" stroke="rgba(0,0,0,.26)" stroke-width="3" stroke-linecap="round"/></g>
    <circle cx="181" cy="51" r="5.5" fill="#F25C54"/><circle cx="179.5" cy="49.5" r="1.8" fill="rgba(255,255,255,.75)"/>
    <circle cx="262" cy="49" r="5.5" fill="#4DABF7"/><circle cx="260.5" cy="47.5" r="1.8" fill="rgba(255,255,255,.75)"/>
    <circle cx="215" cy="115" r="5.5" fill="#FFD166"/><circle cx="213.5" cy="113.5" r="1.8" fill="rgba(255,255,255,.75)"/>
    <g transform="rotate(-38 290 156)"><rect x="262" y="150" width="54" height="9" rx="2" class="w2"/><path d="M316 150l10 4.5-10 4.5z" fill="#FFD166"/><rect x="258" y="150" width="7" height="9" rx="2" fill="#F25C54"/></g>`,
  /* Gegner-Check: das Fernrohr nimmt den gegnerischen König ins Visier */
  scout:()=>`${_star4(150,38,5,"rgba(255,255,255,.8)")}${_star4(214,26,4,"rgba(255,255,255,.6)")}${_star4(236,58,3,"rgba(255,255,255,.5)")}${_star4(306,30,6,"#FFE066")}
    <path d="M128 200V176Q190 150 250 160T320 152V200z" class="b2"/>
    <path d="M244 166Q276 144 320 148V200H244z" class="b1"/>
    ${_king(284,124,.6,"w1")}
    <circle cx="284" cy="118" r="31" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2.5" stroke-dasharray="6 6" class="tw"/>
    <path d="M284 78V90M284 146V158M241 118H253" stroke="rgba(255,255,255,.85)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M226 112L250 117" stroke="#FFD166" stroke-width="2.5" stroke-dasharray="3 5" stroke-linecap="round"/>
    <g stroke="rgba(255,255,255,.92)" stroke-width="4" stroke-linecap="round"><path d="M178 140L160 172M178 140L196 162M178 140V170"/></g>
    <g transform="rotate(-18 186 126)"><rect x="140" y="116" width="76" height="18" rx="5" class="w0"/><rect x="211" y="112" width="14" height="26" rx="4" fill="#FFD166"/><rect x="131" y="119" width="12" height="12" rx="3" fill="#FFD166"/><rect x="168" y="114" width="6" height="22" rx="2" fill="#FFD166" opacity=".9"/></g>
    <circle cx="178" cy="140" r="5" fill="#FFD166"/>`,
  /* Training: eine Treppe hinauf zur Krone, der Bauer ist schon unterwegs */
  train:()=>{let st="";for(let i=0;i<5;i++){const x=128+i*36,y=172-(i+1)*24;st+=`<rect x="${x}" y="${y}" width="36" height="${200-y}" class="${i%2?"w1":"w2"}"/><rect x="${x}" y="${y}" width="36" height="5" class="w0"/>`}
    return `<circle cx="290" cy="58" r="54" class="w3"/><circle cx="290" cy="58" r="34" class="w3"/>${_stars(20,41,120,1.1)}
    <rect y="172" width="320" height="30" class="b2"/>${st}
    ${_crown(290,40,1.15,"#FFD166")}${_star4(262,22,6,"#FFE9A8")}${_star4(312,70,5,"#FFE9A8")}${_star4(268,64,3.5,"#fff")}
    ${_pawn(182,124,12,"w0","s")}<g class="w1"><circle cx="150" cy="168" r="2.4"/><circle cx="160" cy="160" r="2.4"/><circle cx="170" cy="150" r="2.4"/></g>`},
  /* Eröffnungen: aus einem offenen Buch wächst der Variantenbaum */
  open:()=>`<circle cx="226" cy="74" r="62" class="w3"/>
    <g fill="none" stroke="rgba(255,255,255,.95)" stroke-linecap="round"><path d="M226 150V112" stroke-width="7"/><path d="M226 116L194 86M226 116L258 88" stroke-width="5"/><path d="M194 86L172 60M194 86L204 52M258 88L250 54M258 88L284 64M226 116V70" stroke-width="3.4"/><path d="M172 60L160 44M172 60L176 38M284 64L298 48M226 70L218 40M226 70L238 42" stroke-width="2.2"/></g>
    <g class="w0"><circle cx="226" cy="116" r="5"/><circle cx="194" cy="86" r="4.4"/><circle cx="258" cy="88" r="4.4"/><circle cx="226" cy="70" r="4"/></g>
    <g fill="#FFE066">${[[160,44],[176,38],[204,52],[218,40],[238,42],[250,54],[298,48]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5.6"/>`).join("")}</g><g fill="#B7F5C8">${[[154,52],[184,30],[212,30],[244,32],[290,40],[306,58]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4.2"/>`).join("")}</g>
    <g font-family="Rubik, sans-serif" font-weight="800" font-size="9" fill="#0B5D49"><text x="190" y="89">e4</text><text x="253.5" y="91">d4</text><text x="221" y="73">c4</text></g>
    <rect y="178" width="320" height="30" class="b1"/>
    <path d="M226 152C204 140 172 140 146 148V182C172 176 204 176 226 188z" class="w0"/><path d="M226 152C248 140 280 140 306 148V182C280 176 248 176 226 188z" class="w1"/><path d="M226 152V188" stroke="rgba(0,0,0,.2)" stroke-width="2"/>
    <g stroke="rgba(0,0,0,.14)" stroke-width="1.6"><path d="M160 156Q186 150 212 156M160 164Q186 158 212 164M160 172Q186 166 212 172M240 156Q266 150 292 156M240 164Q266 158 292 164"/></g>`,
  /* Taktik: die Springergabel – König und Dame zugleich im Visier */
  tac:()=>`<path d="M196 24L170 92h22l-16 60 52-80h-26l18-48z" fill="#FFD166" opacity=".55"/>
    ${_knight(178,120,1.25,"w0")}<circle cx="171" cy="78" r="2.6" fill="#2B2321"/>
    <g fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2.6" stroke-dasharray="4 7" stroke-linecap="round"><path d="M200 82Q230 40 262 52"/><path d="M206 120Q246 132 268 146"/></g>
    <g fill="none" stroke="#FFE066" stroke-width="3"><circle cx="276" cy="58" r="26"/><circle cx="282" cy="146" r="26"/></g>
    ${_king(276,66,.62,"b3")}${_queen(282,152,.62,"b3")}
    ${_star4(234,30,6,"#fff")}${_star4(306,104,5,"#fff")}${_star4(140,40,4,"#FFE066")}
    <rect y="184" width="320" height="20" class="b2"/>`,
  /* Endspiele: der Bauer auf dem Weg zur Dame, die am Horizont leuchtet */
  end:()=>`${_stars(30,77,110,1.2)}<circle cx="232" cy="96" r="56" fill="#FFD166" opacity=".16"/><circle cx="232" cy="96" r="32" fill="#FFD166" opacity=".22"/>
    ${_queen(232,98,.5,"w0")}
    <path d="M-10 132c50-16 110-22 160-16s110 8 180-6V210H-10z" class="b1"/><path d="M-10 150c60-12 120-12 180-4s110 2 160-4V210H-10z" class="b2"/>
    <path d="M222 120h20L310 210H150z" class="w2"/><path d="M232 124V136M232 146V162M232 174V196" stroke="rgba(255,255,255,.85)" stroke-width="3" stroke-linecap="round"/>
    ${_pawn(204,190,12,"w0","s")}${_star4(270,70,5,"#FFE9A8")}${_star4(196,62,4,"#FFE9A8")}`,
  /* Quiz: Bühne frei für die nächste Frage */
  quiz:()=>`<path d="M180-10L150 180H230z" class="w3"/><path d="M300-10L246 180H326z" class="w3"/>
    <ellipse cx="236" cy="182" rx="96" ry="16" class="b2"/>
    <path d="M214 74c0-22 14-36 34-36s34 14 34 32c0 26-30 26-30 48v6" fill="none" stroke="rgba(255,255,255,.97)" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><circle cx="252" cy="152" r="9.5" class="w0"/>
    <path d="M168 104c0-10 6-16 15-16s15 6 15 14c0 12-13 12-13 22v3" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="7" stroke-linecap="round" transform="rotate(-14 183 110)"/>
    <g>${[[150,40,"#FFD166"],[300,48,"#fff"],[196,24,"#8CE99A"],[286,112,"#FFD166"],[160,140,"#74C0FC"],[310,150,"#fff"]].map((p,i)=>`<rect x="${p[0]}" y="${p[1]}" width="7" height="4" rx="1" fill="${p[2]}" transform="rotate(${i*37} ${p[0]} ${p[1]})"/>`).join("")}</g>
    <rect x="288" y="160" width="26" height="10" rx="3" class="b3"/><path d="M291 160a10 9 0 0 1 20 0z" fill="#FF6B6B"/>`,
  /* Musterpartien: ein Museum für berühmte Züge */
  games:()=>{let ch="";for(let r=0;r<4;r++)for(let c=0;c<4;c++)if((r+c)%2)ch+=`<rect x="${206+c*16}" y="${40+r*16}" width="16" height="16" fill="rgba(0,0,0,.28)"/>`;
    return `<path d="M238-10L180 150H296z" class="w3"/>
    <rect x="192" y="26" width="92" height="92" rx="3" fill="#E9B949"/><rect x="198" y="32" width="80" height="80" fill="#F4E8CF"/>${ch}<rect x="198" y="32" width="80" height="80" fill="none" stroke="#B58A26" stroke-width="2"/>
    ${_king(246,94,.42,"b4")}<path d="M222 70l12 8" stroke="#E5484D" stroke-width="3" stroke-linecap="round"/>
    <rect y="150" width="320" height="60" class="b2"/>
    <rect x="132" y="112" width="40" height="40" class="w1"/><rect x="126" y="106" width="52" height="8" rx="2" class="w0"/>${_king(152,92,.48,"w0")}<g fill="#FFD166"><circle cx="152" cy="62" r="3"/></g>
    <path d="M188 160Q228 176 268 160Q290 154 306 160" fill="none" stroke="#C92A2A" stroke-width="4"/><g fill="#E9B949"><rect x="184" y="146" width="6" height="40" rx="2"/><rect x="264" y="146" width="6" height="40" rx="2"/><circle cx="187" cy="144" r="5"/><circle cx="267" cy="144" r="5"/></g>`},
  /* Gegen den Computer: der Spieltisch unter der Lampe */
  bots:()=>{let ch="";for(let r=0;r<4;r++)for(let c=0;c<8;c++)if((r+c)%2)ch+=`<path d="M${198+c*10-r*2.4} ${128+r*6}h10l-2.4 6h-10z" fill="rgba(0,0,0,.25)"/>`;
    return `<path d="M232 0V34" stroke="rgba(255,255,255,.8)" stroke-width="2"/><path d="M212 50q20-26 40 0z" class="w0"/><path d="M212 50L160 140H304L252 50z" class="w3"/>
    <rect y="176" width="320" height="30" class="b2"/>
    <path d="M150 166h164" stroke="rgba(0,0,0,.35)" stroke-width="5"/><path d="M168 168v24M296 168v24" stroke="rgba(0,0,0,.35)" stroke-width="5"/>
    <path d="M180 128h104l10 26H170z" class="b3"/><path d="M196 128h80l-6 26h-78z" fill="#F4E8CF"/>${ch}
    ${_king(206,138,.3,"w0")}${_king(262,134,.3,"b4")}
    <g class="b2"><path d="M120 110h24v50h-6v32h-4v-32h-10v32h-4z"/><path d="M344 110h-24v50h6v32h4v-32h10v32h4z"/></g>`},
  /* Analyse: die Lupe über der Bewertungskurve */
  ana:()=>`<g stroke="rgba(255,255,255,.22)" stroke-width="1"><path d="M140 40H316M140 80H316M140 120H316M140 160H316M180 30V170M220 30V170M260 30V170M300 30V170"/></g>
    <path d="M140 120C160 118 170 96 188 100S214 140 232 128S258 60 276 70S300 96 316 90V170H140z" class="w3"/>
    <path d="M140 120C160 118 170 96 188 100S214 140 232 128S258 60 276 70S300 96 316 90" fill="none" stroke="rgba(255,255,255,.97)" stroke-width="4" stroke-linecap="round"/>
    <circle cx="250" cy="96" r="34" fill="rgba(255,255,255,.18)"/><circle cx="250" cy="96" r="34" fill="none" stroke="#fff" stroke-width="7"/><path d="M274 120l26 26" stroke="#fff" stroke-width="11" stroke-linecap="round"/><path d="M276 122l22 22" stroke="#0B7A90" stroke-width="3" stroke-linecap="round" opacity=".4"/>
    ${_star4(262,82,8,"#FFE066")}<path d="M234 88a18 18 0 0 1 10-10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
    <rect y="180" width="320" height="30" class="b2"/>`,
  /* Online: eine Partie quer über den Globus */
  online:()=>`<circle cx="236" cy="104" r="62" class="w2"/><circle cx="236" cy="104" r="62" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2"/>
    <g fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.6"><ellipse cx="236" cy="104" rx="26" ry="62"/><ellipse cx="236" cy="104" rx="50" ry="62"/><path d="M174 104H298M182 72H290M182 136H290"/></g>
    <path d="M198 66c10-6 22-2 28 6s-2 16 6 22-6 14-16 10-26-4-26-16 0-16 8-22zM252 118c10-4 22 0 24 10s-8 16-18 12-14-18-6-22z" class="w1"/>
    <path d="M178 58Q236-6 296 54" fill="none" stroke="#FFD166" stroke-width="3" stroke-dasharray="5 7" stroke-linecap="round"/>
    ${_pawn(178,64,8,"w0","s")}${_pawn(296,60,8,"b3","")}
    <path d="M150 162q8-8 16 0M144 170q14-14 28 0" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2.4" stroke-linecap="round"/>
    <rect y="184" width="320" height="20" class="b2"/>`,
  /* Turniere: der Pokal unter der Wimpelkette */
  tour:()=>`<path d="M120 20Q220 54 320 14" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.6"/>${[[134,26,"#fff"],[160,34,"#FFE066"],[186,40,"#fff"],[212,43,"#FF8787"],[238,42,"#fff"],[264,38,"#FFE066"],[290,30,"#fff"]].map(p=>`<path d="M${p[0]-8} ${p[1]}h16l-8 14z" fill="${p[2]}"/>`).join("")}
    <circle cx="230" cy="110" r="58" class="w3"/>
    <path d="M196 64h68v18c0 24-15 40-34 40s-34-16-34-40z" fill="#F6C453"/><path d="M230 64h34v18c0 24-15 40-34 40z" fill="#D9A21E"/>
    <path d="M196 72h-12c-8 0-12 6-12 14 0 12 12 20 26 22" fill="none" stroke="#F6C453" stroke-width="6"/><path d="M264 72h12c8 0 12 6 12 14 0 12-12 20-26 22" fill="none" stroke="#D9A21E" stroke-width="6"/>
    <rect x="224" y="120" width="12" height="22" fill="#D9A21E"/><rect x="206" y="140" width="48" height="10" rx="3" fill="#F6C453"/><rect x="198" y="150" width="64" height="20" rx="3" class="b3"/><rect x="214" y="156" width="32" height="8" rx="2" fill="#F6C453" opacity=".8"/>
    <path d="M212 74c-2 14 2 28 10 36" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>${_star4(230,92,9,"#fff")}
    <rect y="170" width="320" height="40" class="b2"/>${_star4(170,110,5,"#FFE9A8")}${_star4(296,120,6,"#FFE9A8")}`,
  /* Wochenliga: das Siegertreppchen */
  league:()=>`${_stars(18,13,90,1)}<circle cx="232" cy="80" r="50" class="w3"/>
    <rect x="200" y="104" width="64" height="80" class="w0"/><rect x="136" y="128" width="64" height="56" class="w1"/><rect x="264" y="144" width="56" height="40" class="w2"/>
    <g font-family="Rubik, sans-serif" font-weight="900" text-anchor="middle" fill="rgba(0,0,0,.35)"><text x="232" y="150" font-size="30">1</text><text x="168" y="166" font-size="24">2</text><text x="292" y="174" font-size="20">3</text></g>
    ${_pawn(232,104,12,"#FFD166","s")}${_pawn(168,128,10,"#E3E8EE","")}${_pawn(292,144,9,"#E8A56B","")}${_crown(232,52,.8,"#FFD166")}
    <rect y="184" width="320" height="20" class="b2"/>${_star4(204,40,5,"#fff")}${_star4(262,36,4,"#fff")}`,
  /* Profil: die Vitrine mit Pokal, Medaille und Fortschritt */
  prof:()=>`<rect x="138" y="86" width="178" height="7" class="b3"/><rect x="138" y="160" width="178" height="7" class="b3"/>
    <path d="M160 52h34v8c0 12-7 20-17 20s-17-8-17-20z" fill="#F6C453"/><rect x="172" y="78" width="10" height="4" fill="#D9A21E"/><rect x="166" y="82" width="22" height="4" rx="1.5" fill="#F6C453"/>
    <path d="M222 30l8 22h8l8-22" fill="#E5484D"/><circle cx="234" cy="66" r="15" fill="#F6C453"/><circle cx="234" cy="66" r="10" fill="none" stroke="#D9A21E" stroke-width="2.4"/>${_star4(234,66,6,"#fff")}
    ${_knight(286,74,.32,"w0")}
    <rect x="152" y="118" width="64" height="42" rx="4" class="w0"/><g fill="#7048E8"><rect x="160" y="142" width="8" height="12" rx="1"/><rect x="172" y="134" width="8" height="20" rx="1"/><rect x="184" y="128" width="8" height="26" rx="1"/><rect x="196" y="124" width="8" height="30" rx="1"/></g>
    <rect x="232" y="120" width="12" height="40" fill="#FFD166"/><rect x="246" y="114" width="10" height="46" fill="#fff" opacity=".85"/><rect x="258" y="124" width="12" height="36" fill="#74C0FC"/><rect x="272" y="130" width="22" height="30" rx="2" transform="rotate(-12 283 145)" fill="#FF8787"/>
    <rect y="184" width="320" height="20" class="b2"/>`,
  /* Koordinaten: ein Feld im Fadenkreuz */
  coord:()=>{let g="";for(let i=0;i<=8;i++){g+=`<path d="M${150+i*20} 30V190M150 ${30+i*20}H310"/>`}
    let t="";"abcdefgh".split("").forEach((l,i)=>t+=`<text x="${160+i*20}" y="200">${l}</text>`);for(let i=0;i<8;i++)t+=`<text x="140" y="${46+i*20}">${8-i}</text>`;
    return `<g stroke="rgba(255,255,255,.35)" stroke-width="1.4">${g}</g><g font-family="Rubik, sans-serif" font-weight="800" font-size="10" fill="rgba(255,255,255,.85)" text-anchor="middle">${t}</g>
    <rect x="230" y="110" width="20" height="20" fill="#FFE066" opacity=".9"/><circle cx="240" cy="120" r="26" fill="none" stroke="#fff" stroke-width="3"/><circle cx="240" cy="120" r="14" fill="none" stroke="#fff" stroke-width="2"/><path d="M240 86v18M240 136v18M206 120h18M256 120h18" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <rect x="262" y="70" width="34" height="22" rx="6" class="w0"/><path d="M268 92l-6 8 12-8z" class="w0"/><text x="279" y="86" font-family="Rubik, sans-serif" font-weight="800" font-size="12" fill="#2B8A3E" text-anchor="middle">e4</text>`},
  /* Lexikon: ein Regal voller Eröffnungsbücher */
  lex:()=>{const cols=["#FFD166","#fff","#8CE99A","#74C0FC","#FF8787","#fff","#E599F7","#FFD166","#fff","#63E6BE"];let b="";
    [[64,"0"],[126,"1"]].forEach(([y,k])=>{let x=150;for(let i=0;i<10;i++){const w=10+(i*7%6),h=44-(i*5%12);b+=`<rect x="${x}" y="${y+46-h}" width="${w}" height="${h}" rx="1.5" fill="${cols[(i+ +k*3)%10]}" opacity="${i%3?.92:.75}"/><rect x="${x+2}" y="${y+46-h+6}" width="${w-4}" height="2" fill="rgba(0,0,0,.18)"/>`;x+=w+2;if(x>300)break}});
    return `<circle cx="230" cy="96" r="70" class="w3"/><rect x="144" y="110" width="172" height="6" class="b3"/><rect x="144" y="172" width="172" height="6" class="b3"/>${b}
    <rect y="178" width="320" height="30" class="b2"/>`},
  /* Kursübersicht: eine Seekarte mit allen Welten */
  crsmap:()=>`${_waves(40,3,30,"sw3",1.6)}${_waves(120,3,34,"sw3",1.6)}${_waves(170,3,28,"sw3",1.6)}
    <path d="M150 60c10-16 40-18 52-4 10 12-4 26-22 26s-38-8-30-22z" class="w1"/><path d="M236 40c14-12 44-10 54 4 8 14-6 26-26 24s-38-14-28-28z" class="w1"/><path d="M212 120c12-14 46-14 58 0 10 12-4 30-28 30s-42-16-30-30z" class="w1"/><path d="M146 136c8-10 28-10 34 0 6 10-4 18-18 18s-22-8-16-18z" class="w1"/>
    <path d="M176 66Q214 40 262 54Q262 90 240 128Q206 136 164 144" fill="none" stroke="#FFD166" stroke-width="2.6" stroke-dasharray="4 7" stroke-linecap="round"/>
    <g class="w0"><rect x="168" y="52" width="14" height="16"/><rect x="166" y="48" width="4" height="5"/><rect x="173" y="48" width="4" height="5"/><rect x="180" y="48" width="4" height="5"/></g>
    <path d="M254 54l10-18 10 18z" fill="#FF6B1A"/><path d="M262 38q2-8 0-14" stroke="rgba(255,255,255,.7)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M236 128V100M236 100l14 10-14 4" stroke="#fff" stroke-width="2.4" fill="#fff"/><path d="M226 130h22l-4 6h-14z" class="b3"/>
    <path d="M160 146q-2-12 6-20" stroke="#8A5A33" stroke-width="2.6" fill="none"/><path d="M166 126q-10-4-16 2 8 0 16-2zM166 126q8-8 16-4-8 2-16 4z" fill="#2E9E6A"/>
    <g transform="translate(296 168)"><circle r="16" class="w3"/><path d="M0-14l3 11 11 3-11 3-3 11-3-11-11-3 11-3z" class="w0"/></g>`
};
/* Bereichsbild als Kopf einer Seite */
function sectSvg(k){const f=SECT_SCN[k];return f?`<svg class="scn" viewBox="0 0 320 200" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">${f()}</svg>`:""}
