
/* ================= Ansichten & Tab-Balken ================= */
let curView="train";
const VIEW_TAB={train:"train",learn:"learn",quiz:"learn",games:"learn",import:"learn",end:"learn",openings:"openings",chess:"chess",profile:"profile"};
function showView(v){
  curView=v;document.querySelectorAll(".view").forEach(el=>el.hidden=el.id!=="v-"+v);
  if(v!=="train"){stopEngine();stopBlitz()}
  ({learn:renderLearn,openings:renderOpenings,chess:renderChess,profile:renderProfile,quiz:renderQuizIntro,games:renderGames,import:renderImport,end:renderEndPage}[v]||(()=>{}))();
  renderTabbar();applyBlind();if(v!=="train")window.scrollTo(0,0);else sizeVar();
}
const TABS=[["train","Brett","board"],["learn","Lernen","learn"],["openings","Eröffnungen","list"],["chess","Chess.com","chess"],["profile","Profil","profile"]];
function renderTabbar(){
  ensureDaily();const due=dueKeys().length;const open=S.daily.queue.length-S.daily.done.length;
  $("tabbar").innerHTML=TABS.map(([id,t,ic])=>`<button class="tb" data-tab="${id}" aria-current="${VIEW_TAB[curView]===id}">${NI[ic]}<span>${t}</span>${id==="learn"&&(open>0||due>0)?`<span class="dotn">${Math.max(open,due)}</span>`:""}</button>`).join("");
  $("tabbar").querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{const t=b.dataset.tab;if(t==="train"&&!op)selectOpening(ALL[0]);else showView(t)});
}
function weakInfo(id){if(!S.ana||!S.ana.stats)return null;const s=S.ana.stats[id];if(!s||s.n<3)return null;return (s.w+s.d/2)/s.n<0.45?s:null}
function parseMoveQuery(q){
  const toks=q.replace(/\d+\s*\.(\s*\.\.)?/g," ").replace(/0-0-0/g,"O-O-O").replace(/0-0/g,"O-O").split(/[\s,;]+/).filter(Boolean).map(t=>t.replace(/^([SLTD])/,c=>({S:"N",L:"B",T:"R",D:"Q"}[c])));
  if(!toks.length||!toks.every(t=>/^(O-O(-O)?|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](=[QRBNDTLS])?)[+#]?$/.test(t)))return null;
  const g=new Chess();const out=[];
  for(const t of toks){const m=findMove(g,t.replace(/=([DTLS])/,(x,c)=>"="+{D:"Q",T:"R",L:"B",S:"N"}[c]));if(!m)return {moves:out,bad:t};g.move(m.san);out.push(m.san)}
  return {moves:out};
}
function filterOpenings(q,repOnly,group){
  const mq=q?parseMoveQuery(q):null;let mf=null;
  if(mq&&mq.moves.length){mf={};ALL.forEach(o=>{const c=consistentIn(o,mq.moves);if(c.length)mf[o.id]=c})}
  const ql=(q||"").toLowerCase();
  const items=ALL.filter(o=>(!group||o.g===group)&&(!repOnly||S.rep.indexOf(o.id)>=0)&&(mf?!!mf[o.id]:(!q||(o.name+" "+o.eco).toLowerCase().indexOf(ql)>=0||o.lines.some(l=>l.n.toLowerCase().indexOf(ql)>=0))));
  return {items,mf,mq};
}
function toggleRep(o){const i=S.rep.indexOf(o.id);if(i>=0)S.rep.splice(i,1);else S.rep.push(o.id);save("rep");toast(i>=0?o.name+" aus dem Repertoire entfernt":o.name+" zum Repertoire hinzugefügt");renderList();if(curView==="openings")renderOpenings()}
function renderList(){
  const q=$("search").value.trim();const list=$("list");list.innerHTML="";
  const repOnly=$("repOnly").getAttribute("aria-pressed")==="true";
  const {mf,mq}=filterOpenings(q,repOnly);moveFilter=mf;
  const info=$("searchInfo");info.hidden=!mf;if(mf)info.textContent=`${fmtMoves(mq.moves)} – ${Object.keys(mf).length} Eröffnungen${mq.bad?` („${mq.bad}“ ist hier nicht möglich)`:""}`;
  GROUPS.forEach(([g,label])=>{
    const items=filterOpenings(q,repOnly,g).items;if(!items.length)return;
    const h=document.createElement("div");h.className="grp";h.innerHTML=`<span>${label}</span><span>${items.length}</span>`;list.appendChild(h);
    items.forEach(o=>{
      const row=document.createElement("div");row.className="oprow"+(op&&op.id===o.id&&curView==="train"&&mode==="train"?" cur":"");
      const cl=o.lines.filter((l,i)=>P(o.id,i)===2).length;const wk=weakInfo(o.id);const due=o.lines.some((l,i)=>isDue(lk(o.id,i)));
      const b=document.createElement("button");b.className="op";
      b.innerHTML=`<span class="kchip ${o.side}"></span><span class="op-main"><span class="op-name"></span><span class="op-eco"></span></span>${wk?'<span class="weak">schwach</span>':""}<span class="op-prog${cl===o.lines.length?" full":""}">${mf?mf[o.id].length+" V.":cl+"/"+o.lines.length}</span>`;
      b.querySelector(".op-name").textContent=o.name;b.querySelector(".op-eco").textContent=o.eco+" · "+(o.side==="w"?"Weiß":"Schwarz")+(due?" · fällig":"");
      b.onclick=()=>selectOpening(o,mf?rnd(mf[o.id]):null);
      const s=document.createElement("button");s.className="star";const inRep=S.rep.indexOf(o.id)>=0;s.setAttribute("aria-pressed",String(inRep));s.setAttribute("aria-label",inRep?"Aus dem Repertoire entfernen":"Zum Repertoire hinzufügen");s.innerHTML=ICON.star;s.onclick=()=>toggleRep(o);
      row.appendChild(b);row.appendChild(s);list.appendChild(row);
    });
  });
  if(!list.children.length)list.innerHTML=`<div class="empty">${repOnly&&!S.rep.length?"Noch kein Repertoire – tippe auf die Sterne.":"Nichts gefunden."}</div>`;
}
$("search").addEventListener("input",renderList);
$("repOnly").onclick=()=>{const b=$("repOnly");b.setAttribute("aria-pressed",String(b.getAttribute("aria-pressed")!=="true"));renderList()};

/* ---------------- Eröffnungen (Karten) ---------------- */
let opFilter="all",opQuery="";
function renderOpenings(){
  const v=$("v-openings");
  const F=[["all","Alle"],["rep","Repertoire"],["w","Weiß"],["b","Schwarz"],["x","Gambits & Fallen"],["c","Eigene"],["due","Fällig"],["weak","Schwach"]];
  v.innerHTML=`<div class="hero"><span class="ic">${NI.list}</span><div><h2>Eröffnungen</h2><p>${ALL.length} Eröffnungen mit ${totalLines()} Varianten. Mit dem Stern nimmst du eine Eröffnung in dein Repertoire auf. Die Suche versteht auch Züge wie „1.d4 Sf6 2.c4“.</p></div></div>
  <input class="txt" id="opSearch" type="search" placeholder="Name, ECO oder Züge" value="${esc(opQuery)}" aria-label="Eröffnung suchen">
  <div class="filters">${F.map(f=>`<button class="chip" data-f="${f[0]}" style="${opFilter===f[0]?"background:var(--green);color:#fff":""}">${f[1]}</button>`).join("")}</div>
  <div id="opInfo" class="hint"></div><div class="opgrid" id="opGrid"></div>`;
  const draw=()=>{
    const {items,mf,mq}=filterOpenings(opQuery,opFilter==="rep",["w","b","x","c"].indexOf(opFilter)>=0?opFilter:null);
    let list=items;if(opFilter==="due")list=list.filter(o=>o.lines.some((l,i)=>isDue(lk(o.id,i))));if(opFilter==="weak")list=list.filter(o=>weakInfo(o.id));
    $("opInfo").textContent=mf?`${fmtMoves(mq.moves)} – ${list.length} Eröffnungen${mq.bad?` („${mq.bad}“ ist hier nicht möglich)`:""}`:`${list.length} Eröffnungen`;
    $("opGrid").innerHTML=list.map(o=>{const cl=o.lines.filter((l,i)=>P(o.id,i)===2).length;const due=o.lines.filter((l,i)=>isDue(lk(o.id,i))).length;const wk=weakInfo(o.id);const inRep=S.rep.indexOf(o.id)>=0;
      return `<div class="opc" data-op="${o.id}" role="button" tabindex="0"><div class="top"><span class="kchip ${o.side}" style="margin-top:3px"></span><div style="min-width:0;flex:1;padding-right:24px"><h4>${esc(o.name)}</h4><div class="sub">${esc(o.eco)} · ${o.side==="w"?"Weiß":"Schwarz"} · ${o.lines.length} Varianten</div></div></div>
      <div class="moves1">${esc(fmtMoves(o.lines[0].m.slice(0,6)))}</div><div class="pbar2"><i style="width:${cl/o.lines.length*100}%"></i></div>
      <div class="tags">${inRep?'<span class="tag2 green">Repertoire</span>':""}${due?`<span class="tag2 orange">${due} fällig</span>`:""}${wk?'<span class="tag2 red">schwach</span>':""}<span class="tag2">${cl}/${o.lines.length} gelernt</span></div>
      <button class="star" data-star="${o.id}" aria-pressed="${inRep}" aria-label="Repertoire">${ICON.star}</button></div>`}).join("")||'<div class="card">Nichts gefunden.</div>';
    $("opGrid").querySelectorAll("[data-op]").forEach(c=>{c.onclick=e=>{if(e.target.closest("[data-star]"))return;const o=byId(c.dataset.op);selectOpening(o,mf?rnd(mf[o.id]):null)};c.onkeydown=e=>{if(e.key==="Enter")c.click()}});
    $("opGrid").querySelectorAll("[data-star]").forEach(s=>s.onclick=e=>{e.stopPropagation();toggleRep(byId(s.dataset.star))});
  };
  $("opSearch").oninput=e=>{opQuery=e.target.value;draw()};
  v.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{opFilter=b.dataset.f;renderOpenings()});
  draw();
}

/* ---------------- Lernen ---------------- */
function ringSvg(frac){const r=36,c=2*Math.PI*r;return `<svg class="ring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="${r}" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="8"/><circle cx="42" cy="42" r="${r}" fill="none" stroke="#81B64C" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-frac)}" transform="rotate(-90 42 42)"/><text x="42" y="47" text-anchor="middle" font-size="16" font-weight="800" fill="currentColor">${Math.round(frac*100)}%</text></svg>`}
function renderLearn(){
  ensureDaily();const v=$("v-learn");const dd=S.daily.done.length,dq=S.daily.queue.length;const due=dueKeys().length;const dp=duePositions().length;const mine=S.puz.filter(p=>!p.solved||p.solved<2).length;
  const card=(id,ic,col,t,d,meta,hot)=>`<button class="hc" data-act="${id}"><span class="ic" style="background:${col}">${NI[ic]}</span><b>${t}</b><small>${d}</small>${meta!=null?`<span class="meta${hot?" hot":""}">${meta}</span>`:""}</button>`;
  v.innerHTML=`<div class="daily-hero">${ringSvg(dq?dd/dq:0)}<div><h2>${dd>=dq?"Heute geschafft!":"Tagestraining"}</h2><p>${dd>=dq?"Super – morgen geht es weiter. Du kannst trotzdem weiter üben.":`${dq-dd} von ${dq} Varianten offen. Zuerst die fälligen, dann neue aus deinem Repertoire.`}</p><div class="btnrow" style="margin-top:10px"><button class="btn grn" data-act="daily">${dd>=dq?"Extra-Training":"Weiter trainieren"}</button></div></div><div class="flame"><span>${streakNow()}</span><small>Tage Serie</small></div></div>
  <div class="sec-h"><h3>Wiederholen</h3><small>Nach Lernkurve: Fehler kommen öfter</small></div>
  <div class="hubgrid">
    ${card("review","review","#C8742E","Fällige Varianten","Komplette Varianten, die laut Wiederholungsplan heute dran sind.",due,due>0)}
    ${card("positions","target","#B9483C","Schwache Stellungen","Nur die einzelnen Züge, bei denen du oft danebenliegst.",dp,dp>0)}
    ${card("mine","mistake","#3E6FB0","Deine Fehler","Stellungen aus deinen eigenen Chess.com-Partien, in denen du falsch gespielt hast.",mine,mine>0)}
    ${card("traps","traps","#B9483C","Fallen-Training","Alle Fallen und Tricks – stellen und vermeiden.",trapKeys().length)}
  </div>
  <div class="sec-h"><h3>Trainingsarten</h3><small>Abwechslung macht sicher</small></div>
  <div class="hubgrid">
    ${card("blitz","bolt","#E6912C","Blitz-Drill",`10 Varianten mit nur ${S.set.blitzSec} Sekunden pro Zug – damit die Züge automatisch kommen.`)}
    ${card("blind","eye","#5C5A57","Blind-Training","Die Figuren sind unsichtbar, nur die Notation hilft dir.")}
    ${card("quiz","quiz","#8A63B8","Quiz","Buchzug finden, Eröffnung erkennen und Plan zuordnen.",st.quiz.ok?st.quiz.ok+" ✓":null)}
    ${card("end","king","#5D9948","Endspiele","Grundmatts, Lucena, Philidor und das Berliner Endspiel gegen Stockfish.",Object.keys(st.ends).length+"/"+ENDGAMES.length)}
    ${card("games","games","#A88865","Musterpartien","Berühmte Partien und echte Meisterpartien aus der Datenbank.",GAMES.length)}
  </div>
  <div class="sec-h"><h3>Dein Repertoire</h3><small>${S.rep.length} Eröffnungen markiert</small></div>
  <div class="hubgrid">
    ${card("edit","edit","#4A4744","Eigene Variante","Spiel eine Zugfolge ein und trainiere sie wie jede andere.")}
    ${card("import","import","#4A4744","Repertoire importieren","PGN-Datei oder Lichess-Studie mit allen Varianten einlesen.")}
    ${card("share","share","#4A4744","Repertoire teilen","Erzeugt einen Link, mit dem andere dein Repertoire übernehmen.")}
  </div>`;
  v.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{const a=b.dataset.act;
    if(["daily","review","positions","mine","traps","blitz","blind"].indexOf(a)>=0)startSession(a);
    else if(a==="edit")openEditor();else if(a==="share")shareRepertoire();else showView(a)});
}

/* ---------------- Statisches Mini-Brett ---------------- */
function staticBoard(fen,or,last){
  const g=new Chess(fen);const el=document.createElement("div");el.className="board";el.style.cursor="default";
  const sq=document.createElement("div");sq.className="sqs";const pcs=document.createElement("div");pcs.className="pcs";
  const XY=s=>{const f=fi(s),r=ri(s);return or==="b"?{x:7-f,y:r}:{x:f,y:7-r}};
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){const f=or==="b"?7-x:x,r=or==="b"?y:7-y;const n="abcdefgh"[f]+(r+1);const d=document.createElement("div");d.className="sq "+((x+y)%2===0?"l":"d")+(last&&(last.from===n||last.to===n)?" hl":"");
    if(x===0){const s=document.createElement("span");s.className="coord r";s.textContent=n[1];d.appendChild(s)}if(y===7){const s=document.createElement("span");s.className="coord f";s.textContent=n[0];d.appendChild(s)}sq.appendChild(d)}
  const b=g.board();for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!p)continue;const n="abcdefgh"[c]+(8-r);const d=document.createElement("div");d.className="pc "+p.color+p.type;const q=XY(n);d.style.transform=`translate(${q.x*100}%,${q.y*100}%)`;pcs.appendChild(d)}
  el.appendChild(sq);el.appendChild(pcs);requestAnimationFrame(()=>el.style.setProperty("--s",(el.clientWidth/8||50)+"px"));
  return el;
}

/* ---------------- Quiz ---------------- */
let quiz=null;
function quizPool(){const r=S.rep.map(byId).filter(Boolean);return (r.length?r:ALL).filter(o=>o.lines.length)}
function posAfter(moves){const g=new Chess();let last=null;moves.forEach(m=>{last=g.move(m)});return {g,last}}
function qMove(){
  for(let t=0;t<60;t++){
    const o=rnd(quizPool());const li=Math.floor(Math.random()*o.lines.length);const L=o.lines[li];
    const ks=[];for(let k=1;k<L.m.length;k++)if((k%2===0?"w":"b")===o.side)ks.push(k);if(!ks.length)continue;
    const k=rnd(ks);const h=L.m.slice(0,k);const {g,last}=posAfter(h);const book=bookMovesIn(o,h);
    const legal=g.moves({verbose:true});const correct=legal.find(m=>strip(m.san)===strip(L.m[k]));if(!correct)continue;
    const dis=shuffle(legal.filter(m=>book.indexOf(strip(m.san))<0)).sort((a,b)=>(b.piece!=="p")-(a.piece!=="p")).slice(0,3);if(dis.length<3)continue;
    const opts=shuffle([correct].concat(dis)).map(m=>({t:de(m.san),ok:book.indexOf(strip(m.san))>=0}));
    return {fen:g.fen(),last,or:o.side,prompt:`${o.name}: Welcher Zug ist hier der Buchzug für ${o.side==="w"?"Weiß":"Schwarz"}?`,opts,exp:`${de(correct.san)} – ${explain(g.fen(),correct).text} (Variante: ${L.n})`,oid:o.id,li};
  }
  return qName();
}
function qPlan(){
  const pool=[];ALL.forEach(o=>o.lines.forEach((l,i)=>{if(l.p)pool.push([o,i])}));
  const mine=quizPool();const cand=pool.filter(([o])=>mine.indexOf(o)>=0);const [o,li]=rnd(cand.length?cand:pool);const L=o.lines[li];
  const others=shuffle(pool.filter(([x,i])=>x!==o&&x.lines[i].p!==L.p)).slice(0,3);const {g,last}=posAfter(L.m);
  return {fen:g.fen(),last,or:o.side,prompt:"Welcher Plan passt zu dieser Stellung?",opts:shuffle([{t:L.p,ok:true}].concat(others.map(([x,i])=>({t:x.lines[i].p,ok:false})))),exp:`Das ist ${o.name} · ${L.n}.`,oid:o.id,li};
}
function qName(){
  for(let t=0;t<60;t++){
    const o=rnd(quizPool().filter(x=>x.g!=="c"));if(!o)break;const li=Math.floor(Math.random()*o.lines.length);const L=o.lines[li];
    const k=Math.min(L.m.length,6+Math.floor(Math.random()*4));const h=L.m.slice(0,k);
    const wrong=shuffle(ALL.filter(x=>x.g!=="c"&&x.name!==o.name&&!consistentIn(x,h).length)).slice(0,3);if(wrong.length<3)continue;
    const {g,last}=posAfter(h);
    return {fen:g.fen(),last,or:o.side,prompt:"Welche Eröffnung ist auf dem Brett?",opts:shuffle([{t:o.name,ok:true}].concat(wrong.map(x=>({t:x.name,ok:false})))),exp:`${o.name} · ${L.n}: ${fmtMoves(h)}`,oid:o.id,li};
  }
  return null;
}
function renderQuizIntro(){
  const v=$("v-quiz");
  v.innerHTML=`<button class="back" data-back>← Lernen</button><div class="hero"><span class="ic" style="background:#8A63B8;box-shadow:0 4px 0 #5C4180">${NI.quiz}</span><div><h2>Eröffnungs-Quiz</h2><p>Zehn gemischte Fragen: Buchzug finden, Eröffnung erkennen und den passenden Plan zuordnen. ${S.rep.length?"Die Fragen stammen aus deinem Repertoire.":"Markiere Eröffnungen mit einem Stern, damit die Fragen aus deinem Repertoire kommen."}</p></div></div>
  <div class="tiles"><div class="tile"><small>Beantwortet</small><b>${st.quiz.n}</b></div><div class="tile win"><small>Richtig</small><b>${st.quiz.ok}</b><span>${st.quiz.n?pct(st.quiz.ok/st.quiz.n):"–"}</span></div><div class="tile gold"><small>Bestes Quiz</small><b>${st.quiz.best||0}/10</b></div><div class="tile"><small>Pool</small><b>${quizPool().length}</b><span>Eröffnungen</span></div></div>
  <button class="big" id="quizGo" style="margin:0">Quiz starten</button>`;
  wireBack(v);$("quizGo").onclick=()=>{quiz={i:0,ok:0,n:10};nextQuestion()};
}
function wireBack(v){const b=v.querySelector("[data-back]");if(b)b.onclick=()=>showView("learn")}
function nextQuestion(){
  if(quiz.i>=quiz.n){st.quiz.best=Math.max(st.quiz.best||0,quiz.ok);saveStats();checkBadges();
    $("v-quiz").innerHTML=`<div class="hero"><span class="ic" style="background:#8A63B8;box-shadow:0 4px 0 #5C4180">${NI.quiz}</span><div><h2>${quiz.ok} von ${quiz.n} richtig</h2><p>${quiz.ok>=8?"Ausgezeichnet!":quiz.ok>=5?"Gut gemacht – die falschen Fragen kommen beim Training wieder.":"Übung macht den Meister. Trainiere die Eröffnungen und versuch es erneut."}</p></div></div><div class="btnrow"><button class="btn grn" id="qAgain">Neues Quiz</button><button class="btn" id="qBack">Zurück zu Lernen</button></div>`;
    $("qAgain").onclick=()=>{quiz={i:0,ok:0,n:10};nextQuestion()};$("qBack").onclick=()=>showView("learn");return}
  const type=quiz.i%3;const q=(type===0?qMove():type===1?qName():qPlan())||qMove();quiz.q=q;const v=$("v-quiz");
  v.innerHTML=`<div class="qhead"><h3>${esc(q.prompt)}</h3><span class="qprog">Frage ${quiz.i+1}/${quiz.n} · ${quiz.ok} richtig</span></div>
  <div class="quiz"><div class="qboard" id="qBoard"></div><div class="qopts">${q.opts.map((o,i)=>`<button class="qopt" data-i="${i}">${esc(o.t)}</button>`).join("")}<div class="qexp" id="qExp" hidden></div><div class="btnrow" id="qNextRow" hidden><button class="btn grn" id="qNext">${quiz.i+1>=quiz.n?"Ergebnis":"Nächste Frage"}</button><button class="btn" id="qTrain">Variante üben</button></div></div></div>`;
  $("qBoard").appendChild(staticBoard(q.fen,q.or,q.last));
  v.querySelectorAll(".qopt").forEach(b=>b.onclick=()=>{
    const o=q.opts[+b.dataset.i];st.quiz.n++;if(o.ok){st.quiz.ok++;quiz.ok++;sfx("done")}else sfx("wrong");saveStats();
    v.querySelectorAll(".qopt").forEach(x=>{x.disabled=true;const oo=q.opts[+x.dataset.i];if(oo.ok)x.classList.add("right");else if(x===b)x.classList.add("wrong")});
    $("qExp").hidden=false;$("qExp").textContent=(o.ok?"Richtig! ":"Leider falsch. ")+q.exp;$("qNextRow").hidden=false;
  });
  $("qNext").onclick=()=>{quiz.i++;nextQuestion()};$("qTrain").onclick=()=>selectOpening(byId(q.oid),q.li);
}

/* ---------------- Musterpartien & Meisterpartien ---------------- */
function renderGames(){
  const v=$("v-games");const opts=ALL.filter(o=>o.g!=="c").map(o=>`<option value="${o.id}">${esc(o.name)}</option>`).join("");
  v.innerHTML=`<button class="back" data-back>← Lernen</button><div class="hero"><span class="ic" style="background:var(--book);box-shadow:0 4px 0 #6E583F">${NI.games}</span><div><h2>Musterpartien</h2><p>Berühmte Partien zeigen, wie die Pläne aus der Eröffnung in der Praxis aussehen. Jeder Zug wird beim Nachspielen erklärt.</p></div></div>
  <div class="grid3">${GAMES.map(g=>`<div class="gcard">${st.games[g.id]?'<span class="done-tag">Nachgespielt</span>':""}<h4>${esc(g.title)}</h4><div class="sub">${esc(g.players)} · ${esc(g.year)} · ${g.moves.split(" ").length} Halbzüge</div><p>${esc(g.d)}</p><div class="chips">${g.ops.map(id=>byId(id)).filter(Boolean).map(o=>`<button class="chip" data-op="${o.id}">${esc(o.name)}</button>`).join("")}</div><button class="btn grn" data-game="${g.id}">Nachspielen</button></div>`).join("")}</div>
  <div class="card"><h3>Echte Meisterpartien zu einer Eröffnung</h3><p class="hint" style="margin:0 0 10px">Aus der Lichess-Meisterdatenbank (über 2 Millionen Partien von Spielern ab 2200). Gesucht wird nach der Stellung am Ende einer Variante.</p>
  <div class="btnrow"><select class="txt" id="mOp" style="max-width:320px">${opts}</select><select class="txt" id="mLine" style="max-width:320px"></select><button class="btn grn" id="mGo">Suchen</button></div><div id="mRes" style="margin-top:10px"></div></div>`;
  wireBack(v);
  v.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>openGame(GAMES.find(g=>g.id===b.dataset.game)));
  v.querySelectorAll("[data-op]").forEach(b=>b.onclick=()=>selectOpening(byId(b.dataset.op)));
  const fillLines=()=>{const o=byId($("mOp").value);$("mLine").innerHTML=o.lines.map((l,i)=>`<option value="${i}">${esc(l.n)}</option>`).join("")};
  if(op&&byId(op.id)&&op.g!=="c")$("mOp").value=op.id;fillLines();$("mOp").onchange=fillLines;
  $("mGo").onclick=async()=>{const o=byId($("mOp").value);const L=o.lines[+$("mLine").value];const res=$("mRes");res.innerHTML='<p class="sub">Suche …</p>';
    let h=L.m.slice();let d=null;
    try{for(let k=0;k<6&&h.length;k++){d=await explorer("masters",h);if(d.topGames&&d.topGames.length)break;h=h.slice(0,-2)}}catch(e){res.innerHTML=`<div class="err">${String(e.message)==="auth"?"Lichess verlangt eine Anmeldung: Trag unter Profil → Einstellungen einen Lichess-Token ein.":"Die Lichess-Datenbank ist gerade nicht erreichbar."}</div>`;return}
    if(!d||!d.topGames||!d.topGames.length){res.innerHTML='<p class="sub">Keine Meisterpartien gefunden.</p>';return}
    res.innerHTML=`<p class="sub">Stellung nach ${esc(fmtMoves(h))}</p>`+d.topGames.map(g=>`<div class="mgame" data-mid="${esc(g.id)}" data-t="${esc(g.white.name+" – "+g.black.name)}" data-y="${esc(g.year||"")}"><span><b>${esc(g.white.name)}</b> (${g.white.rating}) – <b>${esc(g.black.name)}</b> (${g.black.rating})</span><small>${g.winner==="white"?"1–0":g.winner==="black"?"0–1":"½–½"} · ${esc(g.year||"")}</small></div>`).join("");
    op=o;res.querySelectorAll("[data-mid]").forEach(x=>x.onclick=()=>loadMasterGame(x.dataset.mid,x.dataset.t,x.dataset.y,h.length))};
}

/* ---------------- Endspiele ---------------- */
function renderEndPage(){
  const v=$("v-end");
  v.innerHTML=`<button class="back" data-back>← Lernen</button><div class="hero"><span class="ic" style="background:#5D9948">${NI.king}</span><div><h2>Endspiele</h2><p>Grundtechniken und ein typisches Eröffnungs-Endspiel. Du spielst gegen Stockfish – stell die Stärke unter Profil → Einstellungen ein.</p></div></div>
  <div class="grid3">${ENDGAMES.map(e=>{const fen=e.fen||(()=>{const g=new Chess();e.moves.split(" ").forEach(m=>g.move(m));return g.fen()})();return `<div class="gcard">${st.ends[e.id]?'<span class="done-tag">Gespielt</span>':""}<h4>${esc(e.t)}</h4><div id="eb-${e.id}"></div><p>${esc(e.goal)}</p><button class="btn grn" data-end="${e.id}">Gegen Stockfish spielen (${e.side==="w"?"Weiß":"Schwarz"})</button></div>`}).join("")}</div>`;
  wireBack(v);
  ENDGAMES.forEach(e=>{const fen=e.fen||(()=>{const g=new Chess();e.moves.split(" ").forEach(m=>g.move(m));return g.fen()})();$("eb-"+e.id).appendChild(staticBoard(fen,e.side))});
  v.querySelectorAll("[data-end]").forEach(b=>b.onclick=()=>startEndgame(ENDGAMES.find(e=>e.id===b.dataset.end)));
}

/* ---------------- Repertoire importieren (PGN mit Varianten, Lichess-Studien) ---------------- */
function pgnLines(text){
  const games=text.replace(/\r/g,"").split(/\n\s*\n(?=\[)/).filter(s=>s.trim());const out=[];
  games.forEach((pgn,gi)=>{
    const name=pgnHeader(pgn,"ChapterName")||pgnHeader(pgn,"Event")||("Kapitel "+(gi+1));
    const fenH=pgnHeader(pgn,"FEN");if(fenH)return; // nur Partien ab Grundstellung
    let s=pgn.replace(/^\s*\[[^\]]*\]\s*$/gm," ").replace(/\{[^}]*\}/g," ").replace(/;[^\n]*/g," ").replace(/\$\d+/g," ").replace(/\(/g," ( ").replace(/\)/g," ) ");
    const toks=s.split(/\s+/).map(t=>t.replace(/^\d+\.+/,"")).filter(t=>t&&!/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)&&!/^\d+\.*$/.test(t));
    const lines=[];
    const walk=(base,i)=>{let cur=base.slice();while(i<toks.length){const t=toks[i];if(t==="("){i=walk(cur.slice(0,-1),i+1);continue}if(t===")"){lines.push(cur);return i+1}cur.push(t.replace(/[?!]+$/,""));i++}lines.push(cur);return i};
    walk([],0);
    lines.forEach((l,li)=>{const g=new Chess();const ok=[];for(const m of l){const mv=g.move(m,{sloppy:true});if(!mv)break;ok.push(mv.san)}if(ok.length>=2)out.push({name:lines.length>1?name+" ("+(li+1)+")":name,m:ok})});
  });
  // Präfixe und Dubletten entfernen
  const keyOf=l=>l.m.join(" ");const uniq=[];const seen={};out.sort((a,b)=>b.m.length-a.m.length).forEach(l=>{const k=keyOf(l);if(seen[k])return;if(uniq.some(u=>keyOf(u).indexOf(k+" ")===0))return;seen[k]=1;uniq.push(l)});
  return uniq;
}
function renderImport(){
  const v=$("v-import");
  v.innerHTML=`<button class="back" data-back>← Lernen</button><div class="hero"><span class="ic" style="background:#4A4744">${NI.import}</span><div><h2>Repertoire importieren</h2><p>Lies dein bestehendes Repertoire mit allen Nebenvarianten ein – aus einer PGN-Datei (z. B. aus ChessBase, Chessable-Export oder Lichess) oder direkt aus einer öffentlichen Lichess-Studie.</p></div></div>
  <div class="card"><div class="form" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr)">
    <label class="wide">Name des Ordners<input id="imName" placeholder="z. B. Mein Caro-Kann" maxlength="40"></label>
    <label>Ich trainiere<select id="imSide"><option value="w">Weiß</option><option value="b">Schwarz</option></select></label>
  </div>
  <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">
    <label class="fld">Lichess-Studie (Link)<input id="imUrl" placeholder="https://lichess.org/study/…"></label>
    <label class="fld">PGN-Datei<input type="file" id="imFile" accept=".pgn,text/plain"></label>
    <label class="fld">Oder PGN einfügen<textarea class="code" id="imText" placeholder="1. e4 e5 2. Nf3 (2. Nc3 Nf6) 2... Nc6 3. Bb5 *"></textarea></label>
    <div class="btnrow"><button class="btn grn" id="imGo">Varianten einlesen</button><span class="hint" id="imMsg"></span></div>
  </div></div><div id="imPrev"></div>`;
  wireBack(v);
  let lines=[];
  const preview=()=>{const p=$("imPrev");if(!lines.length){p.innerHTML='<div class="err">Keine gültigen Varianten gefunden. Prüfe, ob die PGN ab der Grundstellung beginnt.</div>';return}
    p.innerHTML=`<div class="card"><h3>${lines.length} Varianten gefunden</h3><div style="max-height:260px;overflow:auto;font-family:var(--mono);font-size:12.5px;color:var(--text-2)">${lines.slice(0,80).map(l=>`<div style="padding:3px 0;border-bottom:1px solid var(--line)"><b style="font-family:var(--font)">${esc(l.name)}</b> ${esc(fmtMoves(l.m))}</div>`).join("")}${lines.length>80?`<div>… und ${lines.length-80} weitere</div>`:""}</div><div class="btnrow" style="margin-top:10px"><button class="btn grn" id="imSave">Importieren</button></div></div>`;
    $("imSave").onclick=()=>{const side=$("imSide").value;const grp=$("imName").value.trim()||"Import "+today();lines.forEach(l=>S.custom[side].push({n:l.name,m:l.m,p:"",g:grp}));save("custom");st.imports++;saveStats();buildAll();renderList();checkBadges();
      const o=ALL.find(x=>x.g==="c"&&x.side===side&&x.grp===grp);if(o&&S.rep.indexOf(o.id)<0){S.rep.push(o.id);save("rep")}toast(lines.length+" Varianten importiert");if(o)selectOpening(o)}};
  $("imGo").onclick=async()=>{
    const msg=$("imMsg");msg.textContent="";let txt=$("imText").value.trim();
    const url=$("imUrl").value.trim();
    if(url){const m=url.match(/study\/([A-Za-z0-9]{8})/);if(!m){msg.textContent="Das ist kein Lichess-Studien-Link.";return}
      msg.textContent="Lade Studie …";try{const headers={};if(S.set.liToken)headers.Authorization="Bearer "+S.set.liToken;const r=await fetch(`https://lichess.org/api/study/${m[1]}.pgn`,{headers});if(!r.ok)throw new Error(r.status);txt=await r.text();if(!$("imName").value)$("imName").value=pgnHeader(txt,"Event").split(":")[0]||"Lichess-Studie";msg.textContent=""}
      catch(e){msg.textContent="Die Studie konnte nicht geladen werden. Ist sie öffentlich?";return}}
    if(!txt){msg.textContent="Wähle eine Datei, füge PGN ein oder gib einen Studien-Link an.";return}
    lines=pgnLines(txt);preview();
  };
  $("imFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$("imText").value=String(r.result);if(!$("imName").value)$("imName").value=f.name.replace(/\.pgn$/i,"")};r.readAsText(f)};
}

/* ---------------- Repertoire teilen ---------------- */
const b64e=s=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const b64d=s=>decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/"))));
function shareRepertoire(){
  const data={rep:S.rep.filter(id=>id.indexOf("custom_")<0),c:{w:S.custom.w.map(l=>[l.n,l.m.join(" "),l.g||""]),b:S.custom.b.map(l=>[l.n,l.m.join(" "),l.g||""])}};
  if(!data.rep.length&&!data.c.w.length&&!data.c.b.length){toast("Markiere zuerst Eröffnungen mit einem Stern oder lege eigene Varianten an.");return}
  const link=location.origin+location.pathname+"#r="+b64e(JSON.stringify(data));
  const done=()=>toast("Link kopiert – schick ihn per WhatsApp oder Mail.");
  if(navigator.share){navigator.share({title:"Mein Eröffnungsrepertoire",url:link}).catch(()=>{})}
  else if(navigator.clipboard){navigator.clipboard.writeText(link).then(done).catch(()=>prompt("Link kopieren:",link))}
  else prompt("Link kopieren:",link);
}
function checkShareHash(){
  const m=location.hash.match(/^#r=([A-Za-z0-9_-]+)/);if(!m)return false;
  let d;try{d=JSON.parse(b64d(m[1]))}catch(e){toast("Der geteilte Link ist ungültig.");return false}
  const v=$("v-import");showView("import");
  const n=(d.rep||[]).length,nc=(d.c&&d.c.w.length||0)+(d.c&&d.c.b.length||0);
  v.insertAdjacentHTML("afterbegin",`<div class="banner"><span><b>Geteiltes Repertoire</b><br><span class="sub">${n} Eröffnungen${nc?` und ${nc} eigene Varianten`:""}. ${(d.rep||[]).map(id=>byId(id)).filter(Boolean).slice(0,6).map(o=>esc(o.name)).join(", ")}${n>6?" …":""}</span></span><button class="btn grn" id="shAcc">Übernehmen</button></div>`);
  $("shAcc").onclick=()=>{(d.rep||[]).forEach(id=>{if(byId(id)&&S.rep.indexOf(id)<0)S.rep.push(id)});save("rep");
    ["w","b"].forEach(s=>(d.c&&d.c[s]||[]).forEach(a=>{if(!S.custom[s].some(l=>l.m.join(" ")===a[1]))S.custom[s].push({n:a[0],m:a[1].split(" "),p:"",g:a[2]||"Geteilt"})}));save("custom");buildAll();renderList();
    history.replaceState(null,"",location.pathname);toast("Repertoire übernommen");showView("openings");opFilter="rep";renderOpenings()};
  return true;
}

/* ---------------- Profil: Statistik, Abzeichen, Einstellungen, Sync ---------------- */
let profTab="stats";
function renderProfile(){
  const v=$("v-profile");
  v.innerHTML=`<div class="hero"><span class="ic">${NI.profile}</span><div><h2>Profil</h2><p>Dein Fortschritt, deine Abzeichen und alle Einstellungen.</p></div></div>
  <div class="subtabs"><button data-pt="stats" aria-pressed="${profTab==="stats"}">Statistik</button><button data-pt="badges" aria-pressed="${profTab==="badges"}">Abzeichen</button><button data-pt="settings" aria-pressed="${profTab==="settings"}">Einstellungen</button><button data-pt="sync" aria-pressed="${profTab==="sync"}">Sichern & Sync</button></div><div id="profBody" class="page" style="max-width:none"></div>`;
  v.querySelectorAll("[data-pt]").forEach(b=>b.onclick=()=>{profTab=b.dataset.pt;renderProfile()});
  ({stats:renderStats,badges:renderBadges,settings:renderSettings,sync:renderSync}[profTab])($("profBody"));
}
function renderStats(v){
  checkBadges();const tot=totalLines(),cl=cleanCount();
  let mv=0,er=0;Object.values(st.op).forEach(s=>{mv+=s.mv;er+=s.err});const acc=mv+er?mv/(mv+er):0;
  const days=[];for(let i=13;i>=0;i--){const d=dstr(new Date(Date.now()-i*DAY));days.push([d,st.days[d]||0])}const mx=Math.max(1,...days.map(d=>d[1]));
  const rows=ALL.filter(o=>st.op[o.id]&&(st.op[o.id].att||st.op[o.id].err)).map(o=>{const s=st.op[o.id];return {o,s,acc:s.mv+s.err?s.mv/(s.mv+s.err):1,cl:o.lines.filter((l,i)=>P(o.id,i)===2).length}}).sort((a,b)=>a.acc-b.acc);
  const hard=Object.entries(st.hard).filter(([k,H])=>byId(H.id)).sort((a,b)=>b[1].n-a[1].n).slice(0,10);
  v.innerHTML=`<div class="tiles">
    <div class="tile win"><small>Fehlerfrei gelernt</small><b>${cl}</b><span>von ${tot} Varianten (${pct(cl/tot)})</span></div>
    <div class="tile"><small>Trefferquote</small><b>${mv+er?pct(acc):"–"}</b><span>${mv} richtige, ${er} falsche Züge</span></div>
    <div class="tile gold"><small>Serie</small><b>${streakNow()}</b><span>Tage · Rekord ${S.streak.best||0}</span></div>
    <div class="tile"><small>Heute fällig</small><b>${dueKeys().length}</b><span>${duePositions().length} schwache Stellungen</span></div></div>
  <div class="card"><h3>Aktivität der letzten 14 Tage</h3><div class="bars">${days.map(d=>`<i class="${d[1]?"":"zero"}" style="height:${Math.max(3,d[1]/mx*100)}%" title="${d[0]}: ${d[1]} Varianten"></i>`).join("")}</div><div class="bars-l">${days.map(d=>`<span>${+d[0].slice(8)}</span>`).join("")}</div></div>
  <div class="sec-h"><h3>Schwierigste Züge</h3><small>Wo du am häufigsten falsch ziehst</small></div>
  ${hard.length?`<div class="tbl-wrap"><table><thead><tr><th>Eröffnung</th><th>Stellung nach</th><th>Richtig wäre</th><th style="text-align:right">Fehler</th><th></th></tr></thead><tbody>${hard.map(([k,H])=>{const o=byId(H.id);const bm=bookMovesIn(o,H.pre);return `<tr><td><div class="nm">${esc(o.name)}</div></td><td>${H.pre.length?esc(fmtMoves(H.pre.slice(-4),H.pre.length-Math.min(4,H.pre.length))):"Startstellung"}</td><td><b>${esc(bm.map(de).join(" / "))}</b></td><td class="num score-bad">${H.n}</td><td style="text-align:right"><button class="mini" data-hard="${esc(k)}">Üben</button></td></tr>`}).join("")}</tbody></table></div>`:`<div class="card">Noch keine Fehler gespeichert.</div>`}
  <div class="sec-h"><h3>Eröffnungen</h3><small>Sortiert nach Trefferquote</small></div>
  ${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Eröffnung</th><th style="text-align:right">Fehlerfrei</th><th style="text-align:right">Durchgänge</th><th style="text-align:right">Trefferquote</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr><td><div class="nm"><span class="kchip ${r.o.side}"></span>${esc(r.o.name)}</div></td><td class="num">${r.cl}/${r.o.lines.length}</td><td class="num">${r.s.att}</td><td class="num ${r.acc<.8?"score-bad":r.acc>.95?"score-good":""}">${pct(r.acc)}</td><td style="text-align:right"><button class="mini" data-op="${r.o.id}">Üben</button></td></tr>`).join("")}</tbody></table></div>`:`<div class="card">Noch keine Trainingsdaten. Starte mit dem Tagestraining!</div>`}`;
  v.querySelectorAll("[data-op]").forEach(b=>b.onclick=()=>selectOpening(byId(b.dataset.op)));
  v.querySelectorAll("[data-hard]").forEach(b=>b.onclick=()=>{const H=st.hard[b.dataset.hard];startPosition(byId(H.id),H.pre)});
}
function renderBadges(v){
  checkBadges();
  v.innerHTML=`<div class="sec-h"><h3>Abzeichen</h3><small>${st.badges.length} von ${BADGES.length}</small></div><div class="badges">${BADGES.map(b=>`<div class="bdg${st.badges.indexOf(b.id)>=0?" got":""}"><span class="md">${ICON.medal}</span><span><b>${esc(b.t)}</b><small>${esc(b.d)}</small></span></div>`).join("")}</div>`;
}
const THEMES=[["green","Grün","#EBECD0","#739552"],["brown","Holz","#F0D9B5","#B58863"],["blue","Blau","#DEE3E6","#8CA2AD"],["gray","Marmor","#E2E2DE","#9E9E98"]];
const PSETS=[["cburnett","Klassisch"],["staunty","Staunty"]];
function applySettings(){
  document.body.classList.remove("bt-green","bt-brown","bt-blue","bt-gray","ps-cburnett","ps-staunty","theme-light");
  document.body.classList.add("bt-"+S.set.theme,"ps-"+S.set.pieces);if(S.set.design==="light")document.body.classList.add("theme-light");
  document.body.classList.toggle("nocoords",!S.set.coords);
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=S.set.design==="light"?"#F1EFEA":"#21201D";
}
function renderSettings(v){
  const sw=(id,on,t,d)=>`<div class="setrow"><span><b>${t}</b><small>${d}</small></span><button class="switch" id="${id}" aria-pressed="${on}" aria-label="${t}"></button></div>`;
  v.innerHTML=`<div class="card"><h3>Design</h3><div class="seg"><button data-design="dark" aria-pressed="${S.set.design!=="light"}">Dunkel</button><button data-design="light" aria-pressed="${S.set.design==="light"}">Hell</button></div></div>
  <div class="card"><h3>Brett</h3><div class="opts">${THEMES.map(t=>`<button class="optc" data-theme="${t[0]}" aria-pressed="${S.set.theme===t[0]}"><span class="mini-board">${[0,1,2,3,4,5,6,7].map(i=>`<i style="background:${((i+(i>3?1:0))%2)?t[3]:t[2]}"></i>`).join("")}</span>${t[1]}</button>`).join("")}</div></div>
  <div class="card"><h3>Figuren</h3><div class="opts">${PSETS.map(p=>`<button class="optc pv-${p[0]}" data-pset="${p[0]}" aria-pressed="${S.set.pieces===p[0]}"><span class="piece-prev">${["wk","wq","wn","bk","bq","bn"].map(x=>`<span class="pp ${x}"></span>`).join("")}</span>${p[1]}</button>`).join("")}</div><p class="hint" style="margin-top:8px">„Klassisch“: Colin M.L. Burnett (GPLv2+). „Staunty“: lichess-Set, CC BY-NC-SA 4.0.</p></div>
  <div class="card"><h3>Training</h3>
    ${sw("swSound",S.set.sound,"Ton","Geräusche für Züge, Fehler und Erfolge")}
    ${sw("swIdeas",S.set.ideas,"Ideen-Pfeile","Blaue Pfeile zeigen, was der letzte Zug angreift oder fesselt")}
    ${sw("swCoords",S.set.coords,"Koordinaten","Buchstaben und Zahlen am Brettrand")}
    ${sw("swEval",S.set.evalbar,"Bewertungsbalken","Stockfish bewertet jede Stellung neben dem Brett")}
    ${sw("swReal",S.set.realistic,"Realistische Gegnerzüge","Das Buch spielt häufige Antworten öfter – nach Lichess-Statistik")}
    <div class="setrow"><span><b>Blitz-Drill: <span id="blLbl">${S.set.blitzSec}</span> s pro Zug</b><small>Zeit pro Zug im Blitz-Drill</small></span><input type="range" id="blRange" min="2" max="15" value="${S.set.blitzSec}" aria-label="Sekunden pro Zug"></div>
    <div class="setrow"><span><b>Stockfish-Stärke: <span id="sfLbl">${S.set.sf}</span></b><small>1 = Anfänger, 10 = Vereinsspieler, 20 = volle Stärke</small></span><input type="range" id="sfRange" min="1" max="20" value="${S.set.sf}" aria-label="Stockfish-Stärke"></div>
  </div>
  <div class="card"><h3>Lichess-Token (optional)</h3><p class="hint" style="margin:0 0 8px">Nur nötig, falls Lichess die Datenbank ohne Anmeldung sperrt. Erstelle einen Token ohne besondere Rechte auf <a href="https://lichess.org/account/oauth/token/create?description=Eroeffnungstrainer" target="_blank" rel="noopener">lichess.org</a> und füge ihn hier ein. Er bleibt nur in diesem Browser.</p><input class="txt" id="liTok" placeholder="lip_…" value="${esc(S.set.liToken)}" autocomplete="off"></div>
  <div class="card"><h3>App installieren</h3><p class="hint" style="margin:0">iPhone: In Safari auf Teilen → „Zum Home-Bildschirm“. Android/Chrome: Menü → „App installieren“. Danach funktioniert das Training auch offline.</p></div>
  <div class="card"><h3>Zurücksetzen</h3><p class="hint" style="margin:0 0 10px">Löscht Fortschritt, Wiederholungsplan, Statistik und Abzeichen in diesem Browser. Einstellungen und eigene Varianten bleiben.</p><div class="btnrow"><button class="btn red" id="resetBtn">Fortschritt zurücksetzen</button><span class="hint" id="resetMsg"></span></div></div>`;
  v.querySelectorAll("[data-design]").forEach(b=>b.onclick=()=>{S.set.design=b.dataset.design;save("set");applySettings();renderProfile()});
  v.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>{S.set.theme=b.dataset.theme;save("set");applySettings();renderProfile()});
  v.querySelectorAll("[data-pset]").forEach(b=>b.onclick=()=>{S.set.pieces=b.dataset.pset;save("set");applySettings();renderProfile()});
  const tg=(id,key)=>$(id).onclick=()=>{S.set[key]=!S.set[key];save("set");applySettings();$(id).setAttribute("aria-pressed",String(S.set[key]));if(op&&curView==="train")render()};
  tg("swSound","sound");tg("swIdeas","ideas");tg("swCoords","coords");tg("swEval","evalbar");tg("swReal","realistic");
  $("sfRange").oninput=e=>{S.set.sf=+e.target.value;$("sfLbl").textContent=S.set.sf;save("set")};
  $("blRange").oninput=e=>{S.set.blitzSec=+e.target.value;$("blLbl").textContent=S.set.blitzSec;save("set")};
  $("liTok").onchange=e=>{S.set.liToken=e.target.value.trim();save("set");toast("Lichess-Token gespeichert")};
  $("resetBtn").onclick=()=>{const b=$("resetBtn");if(!b.dataset.sure){b.dataset.sure="1";b.textContent="Wirklich alles löschen?";$("resetMsg").textContent="Noch einmal tippen zum Bestätigen.";return}
    ["prog","srs","pos","daily","streak","stats","ana","puz"].forEach(k=>{try{localStorage.removeItem("et-"+k)}catch(e){}});location.reload()};
}
function exportData(){const d={app:"eroeffnungstrainer",v:2,date:new Date().toISOString(),savedAt};KEYS.forEach(k=>d[k]=S[k]);d.set=Object.assign({},S.set,{ghToken:"",liToken:""});return d}
function importData(d){
  if(!d||d.app!=="eroeffnungstrainer")throw new Error("Das ist keine Sicherung des Eröffnungstrainers.");
  KEYS.forEach(k=>{if(d[k]!==undefined){if(k==="set")d[k]=Object.assign({},d[k],{ghToken:S.set.ghToken,liToken:S.set.liToken,gist:S.set.gist});store.set("et-"+k,d[k])}});
  store.set("et-savedAt",d.savedAt||Date.now());
}
async function gistSync(msg){
  const tok=S.set.ghToken;if(!tok){msg("Trag zuerst einen GitHub-Token ein.");return}
  const H={Authorization:"Bearer "+tok,Accept:"application/vnd.github+json","Content-Type":"application/json"};
  const FN="eroeffnungstrainer.json";
  try{
    msg("Verbinde mit GitHub …");
    let gid=S.set.gist,remote=null;
    if(!gid){const r=await fetch("https://api.github.com/gists?per_page=100",{headers:H});if(r.status===401)throw new Error("Der Token ist ungültig.");const list=await r.json();const g=list.find(x=>x.files&&x.files[FN]);if(g)gid=g.id}
    if(gid){const r=await fetch("https://api.github.com/gists/"+gid,{headers:H});if(r.ok){const g=await r.json();if(g.files[FN]){try{remote=JSON.parse(g.files[FN].content)}catch(e){}}}else gid=""}
    if(remote&&(remote.savedAt||0)>savedAt){importData(remote);S.set.gist=gid;store.set("et-set",Object.assign(store.get("et-set",{}),{gist:gid}));msg("Neuerer Stand von GitHub geladen – die Seite lädt neu …");setTimeout(()=>location.reload(),900);return}
    const body=JSON.stringify({description:"Eröffnungstrainer – Fortschritt",public:false,files:{[FN]:{content:JSON.stringify(exportData())}}});
    const r=await fetch(gid?"https://api.github.com/gists/"+gid:"https://api.github.com/gists",{method:gid?"PATCH":"POST",headers:H,body});
    if(r.status===401||r.status===403)throw new Error("Der Token hat keine Berechtigung für Gists.");if(!r.ok)throw new Error("GitHub meldet Fehler "+r.status);
    const g=await r.json();S.set.gist=g.id;save("set");msg("Synchronisiert: "+new Date().toLocaleTimeString("de-DE"));
  }catch(e){msg("Sync fehlgeschlagen: "+(e.message||e))}
}
function renderSync(v){
  v.innerHTML=`<div class="card"><h3>Mit GitHub synchronisieren</h3><p class="hint" style="margin:0 0 10px">Speichert deinen Fortschritt in einem privaten Gist in deinem GitHub-Konto. Auf jedem Gerät, auf dem du denselben Token einträgst, wird der neueste Stand übernommen. Erstelle dafür einen Token mit dem Recht „gist“: <a href="https://github.com/settings/tokens/new?scopes=gist&description=Eroeffnungstrainer" target="_blank" rel="noopener">Token erstellen</a>.</p>
    <input class="txt" id="ghTok" placeholder="ghp_…" value="${esc(S.set.ghToken)}" autocomplete="off"><div class="btnrow" style="margin-top:10px"><button class="btn grn" id="ghSync">Jetzt synchronisieren</button><span class="hint" id="ghMsg">${S.set.gist?"Verknüpft mit Gist "+esc(S.set.gist.slice(0,7))+"…":""}</span></div></div>
  <div class="card"><h3>Sichern und übertragen</h3><p class="hint" style="margin:0 0 10px">Ohne GitHub: Exportiere den Fortschritt als Datei oder Code und importiere ihn auf dem anderen Gerät.</p>
    <div class="btnrow"><button class="btn grn" id="expFile">Als Datei speichern</button><button class="btn" id="expCode">Code kopieren</button><label class="btn" style="cursor:pointer">Datei importieren<input type="file" id="impFile" accept=".json,application/json" hidden></label></div>
    <textarea class="code" id="impCode" placeholder="Oder Code hier einfügen und »Code importieren« drücken" style="margin-top:10px"></textarea>
    <div class="btnrow" style="margin-top:8px"><button class="btn" id="impGo">Code importieren</button><span class="hint" id="syncMsg"></span></div></div>
  <div class="card"><h3>Repertoire teilen</h3><p class="hint" style="margin:0 0 10px">Erzeugt einen Link mit deinen markierten Eröffnungen und eigenen Varianten.</p><button class="btn grn" id="shBtn">Link erstellen</button></div>`;
  const msg=t=>$("syncMsg").textContent=t;
  $("ghTok").onchange=e=>{S.set.ghToken=e.target.value.trim();save("set")};
  $("ghSync").onclick=()=>{S.set.ghToken=$("ghTok").value.trim();save("set");gistSync(t=>$("ghMsg").textContent=t)};
  $("shBtn").onclick=shareRepertoire;
  $("expFile").onclick=()=>{const blob=new Blob([JSON.stringify(exportData())],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="eroeffnungstrainer-"+today()+".json";document.body.appendChild(a);a.click();a.remove();msg("Datei gespeichert.")};
  $("expCode").onclick=()=>{const code=b64e(JSON.stringify(exportData()));const ta=$("impCode");ta.value=code;
    if(navigator.clipboard)navigator.clipboard.writeText(code).then(()=>msg("Code kopiert.")).catch(()=>{ta.select();msg("Code markiert – bitte kopieren.")});else{ta.select();msg("Code markiert – bitte kopieren.")}};
  const apply=txt=>{try{let d;txt=txt.trim();try{d=JSON.parse(txt)}catch(e){d=JSON.parse(b64d(txt))}importData(d);msg("Importiert – die Seite lädt neu …");setTimeout(()=>location.reload(),700)}catch(e){msg("Import fehlgeschlagen: "+(e.message||e))}};
  $("impGo").onclick=()=>apply($("impCode").value);
  $("impFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>apply(String(r.result));r.readAsText(f)};
}
