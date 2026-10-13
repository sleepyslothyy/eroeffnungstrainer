
/* ================= Brett-Zustand ================= */
let op=null,mode="train",hist=[],fens=[],mvs=[],flags=[],view=0,shown=null,target=null,forced=null,busy=false,done=false,mistakes=0,usedHelp=false,hintLvl=0,sel=null,timer=null,lock=false,badge=null,liveStatus=null,curStatus=null,tab="ex",flipped=false,sess=null,game=null,sfStart=0,sfEval=null,drill=null,puz=null,tried=new Set(),blindOn=false,peeked=false,vtab="list",evalCp=null,evalTok=0,blitzT=null,blitzLeft=0,startFen=null;
let moveFilter=null;
const boardEl=$("board"),sqsEl=$("sqs"),pcsEl=$("pcs"),ovl=$("ovl"),ideasEl=$("ideas"),marksEl=$("marks"),badgesEl=$("badges");
const START=new Chess().fen();
const live=()=>view===hist.length;
const consistent=h=>op&&op.lines?consistentIn(op,h):[];
const bookMoves=h=>bookMovesIn(op,h);
const findMove=(g,san)=>g.moves({verbose:true}).find(x=>strip(x.san)===strip(san));
const userTurnShown=()=>shown&&shown.turn()===op.side;
function baseOrient(){if(mode==="replay")return game&&game.orient||"w";if(mode==="edit")return $("edSide").value;return op.side}
const orient=()=>flipped?(baseOrient()==="w"?"b":"w"):baseOrient();
function expected(){if(mode==="puzzle")return puz&&puz.sol[hist.length]?[strip(puz.sol[hist.length])]:[];return bookMoves(hist.slice(0,view))}

function pickTarget(){
  const c=consistent(hist);if(!c.length)return null;
  if(forced!==null&&c.indexOf(forced)>=0)return forced;
  if(target!==null&&c.indexOf(target)>=0)return target;
  const fresh=c.filter(i=>P(op.id,i)<2);const due=c.filter(i=>isDue(lk(op.id,i)));const pool=due.length?due:fresh.length?fresh:c;
  return rnd(pool);
}
function resetBoard(fen){
  clearTimeout(timer);stopBlitz();const g=new Chess(fen||undefined);startFen=fen||null;
  hist=[];fens=[g.fen()];mvs=[];flags=[];view=0;shown=g;target=null;done=false;mistakes=0;usedHelp=false;hintLvl=0;sel=null;busy=false;lock=false;badge=null;sfEval=null;tried=new Set();peeked=false;evalCp=null;
  marks.a.clear();marks.c.clear();
}
function commit(mv,flag){const g=new Chess(fens[hist.length]);const r=g.move(mv.san||mv);hist.push(r.san);mvs.push(r);fens.push(g.fen());flags.push(flag);return r}
function truncate(n){hist.length=n;mvs.length=n;fens.length=n+1;flags.length=n}

/* ================= Training ================= */
function selectOpening(o,line,keepSess){
  if(!o)return;
  if(!keepSess)sess=null;
  stopEngine();mode="train";game=null;drill=null;puz=null;op=o;forced=(line===undefined||line===null)?null:line;flipped=false;
  store.set("et-last",o.id);showView("train");renderList();startTrain();
}
function startTrain(){
  resetBoard();mode="train";drill=null;target=pickTarget();buildSquares();renderChrome();render();
  const fl=forced!==null&&op.lines[forced]?" Variante: "+op.lines[forced].n+".":"";
  if(shown.turn()!==op.side){setStatus("turn","Das Buch eröffnet","Weiß macht gleich den ersten Zug."+fl);engineSoon()}
  else{setStatus("turn","Du bist am Zug","Spiel den ersten Zug: "+op.name+"."+fl);startBlitz()}
}
function engineSoon(){busy=true;timer=setTimeout(bookMove,sess&&sess.blitz?250:600)}
async function bookMove(){
  if(mode!=="train"){busy=false;return}
  const c=consistent(hist);if(!c.length){busy=false;return}
  let tgt=pickTarget();
  if(S.set.realistic&&forced===null&&!drill){
    const nexts=[...new Set(c.map(i=>op.lines[i].m[hist.length]).filter(Boolean).map(strip))];
    if(nexts.length>1){
      const data=await explorer("lichess",hist.slice(),1500).catch(()=>null);
      if(mode!=="train")return;
      if(data&&data.moves){const w=nexts.map(s=>{const m=data.moves.find(x=>strip(x.san)===s);const n=m?(m.white+m.draws+m.black):0;const fresh=c.some(i=>strip(op.lines[i].m[hist.length]||"")===s&&P(op.id,i)<2);return (n+1)*(fresh?2:1)});
        const tot=w.reduce((a,b)=>a+b,0);let r=Math.random()*tot,pick=nexts[0];for(let i=0;i<nexts.length;i++){r-=w[i];if(r<=0){pick=nexts[i];break}}
        const cand=c.filter(i=>strip(op.lines[i].m[hist.length]||"")===pick);if(cand.length)tgt=cand.indexOf(tgt)>=0?tgt:rnd(cand.filter(i=>P(op.id,i)<2).length?cand.filter(i=>P(op.id,i)<2):cand);}
    }
  }
  busy=false;target=tgt;if(target===null)return;
  const g=new Chess(fens[hist.length]);const mv=findMove(g,op.lines[target].m[hist.length]);
  const wasLive=live();const r=commit(mv,"b");
  if(wasLive){view=hist.length;shown=new Chess(fens[view]);hintLvl=0;render({fwd:r});playSound(r)}else render();
  if(hist.length===op.lines[target].m.length)return finish();
  const n=consistent(hist).length;
  const s=["turn","Du bist am Zug",n>1?`${n} Varianten sind noch möglich. Welcher Buchzug folgt?`:`Variante: ${op.lines[target].n}`];
  if(wasLive){setStatus(...s);startBlitz()}else liveStatus=s;
}
function trainMove(mv,animate,help){
  const h=hist.slice(0,view);
  const ok=bookMoves(h).indexOf(strip(mv.san))>=0;
  if(!tried.has(view)&&!help){tried.add(view);posReview(op.id,h,ok&&hintLvl===0?5:1)}
  if(!ok){wrongMove(mv,animate,h);return}
  stopBlitz();
  if(!live()){clearTimeout(timer);busy=false;truncate(view);done=false;target=null;mistakes++}
  const r=commit(mv,"u");view=hist.length;shown=new Chess(fens[view]);sel=null;hintLvl=0;
  if(help)opStat(op.id).err++;else opStat(op.id).mv++;
  badge={ply:view,sq:r.to,type:"book"};
  target=pickTarget();render(animate?{fwd:r}:null);playSound(r);
  if(drill){finishDrill(mistakes===0&&!usedHelp);return}
  if(target!==null&&hist.length===op.lines[target].m.length){finish();return}
  setStatus("good",de(r.san)+" ist ein Buchzug","Das Buch antwortet …");engineSoon();
}
function wrongMove(mv,animate,h){
  mistakes++;lock=true;sel=null;
  if(mode==="train"){const s=opStat(op.id);s.err++;const key=op.id+"|"+h.join(" ");const H=st.hard[key]||(st.hard[key]={id:op.id,pre:h.slice(),n:0});H.n++;H.last=Date.now();saveStats()}
  const tmp=new Chess(shown.fen());const r=tmp.move(mv.san);
  const keep=shown;shown=tmp;badge={ply:-1,sq:r.to,type:"no"};
  render(animate?{fwd:r}:null,{bad:[r.from,r.to]});sfx("wrong");
  setStatus("bad",de(r.san)+(mode==="puzzle"?" ist nicht die Lösung":" ist nicht im Buch"),mistakes>=2&&hintLvl===0?"Tipp: Mit »Hinweis« siehst du, welche Figur ziehen sollte.":"Versuch es noch einmal.");
  setTimeout(()=>{shown=keep;badge=null;lock=false;render({back:r});boardEl.classList.remove("shake");void boardEl.offsetWidth;boardEl.classList.add("shake")},750);
}
function finish(){
  done=true;stopBlitz();const i=target;const k=lk(op.id,i);const clean=mistakes===0&&!usedHelp;
  S.prog[op.id]=S.prog[op.id]||{};S.prog[op.id][i]=Math.max(P(op.id,i),clean?2:1);save("prog");
  srsReview(k,clean?5:mistakes<=1?3:1);
  const s=opStat(op.id);s.att++;if(clean)s.clean++;st.days[today()]=(st.days[today()]||0)+1;
  if(clean&&sess&&sess.blitz)st.blitz++;if(clean&&blindOn&&!peeked)st.blind++;saveStats();
  if(badge&&badge.ply===hist.length)badge.type="ok";
  if(sess){sess.res.push({k,clean});if(sess.type==="daily")markDailyDone(k)}else markDailyDone(k);
  const nxt=S.srs[k]?Math.round((S.srs[k].due-startOfDay(Date.now()))/DAY):1;
  setStatus("done","Variante geschafft: "+op.lines[i].n,(clean?"Fehlerfrei gespielt.":`Mit ${mistakes} ${mistakes===1?"Fehler":"Fehlern"} – sie kommt bald wieder.`)+` Nächste Wiederholung in ${nxt} ${nxt===1?"Tag":"Tagen"}.`);
  setTimeout(()=>sfx("done"),180);
  if(forced===i&&!sess)forced=null;
  render();renderChrome();renderList();renderTabbar();checkBadges();
}

/* ---- Stellungs-Drill: nur einen Zug in einer bestimmten Stellung finden ---- */
function startPosition(o,pre,info){
  if(!o)return;stopEngine();mode="train";game=null;puz=null;op=o;flipped=false;
  const c=consistentIn(o,pre);forced=c.length?c[0]:null;
  resetBoard();drill={pre:pre.slice(),info:info||null};
  pre.forEach(m=>{const g=new Chess(fens[hist.length]);const mv=findMove(g,m);if(mv)commit(mv,"b")});
  view=hist.length;shown=new Chess(fens[view]);target=pickTarget();
  showView("train");buildSquares();renderChrome();render();
  if(shown.turn()!==op.side){finishDrill(true,true);return}
  setStatus("turn",info&&info.title||"Finde den Buchzug",info&&info.sub||`${op.name}: Welcher Zug gehört hier ins Repertoire?`);startBlitz();
}
function finishDrill(clean,skip){
  done=true;stopBlitz();if(!skip){if(clean)st.puzOk+=drill&&drill.info&&drill.info.mine?1:0;saveStats()}
  if(drill&&drill.info&&drill.info.mine&&clean){const pz=S.puz.find(p=>p.key===drill.info.key);if(pz){pz.solved=(pz.solved||0)+1;save("puz")}}
  if(sess)sess.res.push({k:"pos",clean});
  setStatus("done",clean?"Richtig!":"Gelöst – mit Hilfe",(drill&&drill.info&&drill.info.after)||"Diese Stellung kommt in der Wiederholung wieder, bis sie sitzt.");
  setTimeout(()=>sfx("done"),150);render();renderChrome();checkBadges();
}

/* ---- Rätsel (Tagesrätsel, eigene Fehler aus Game Review) ---- */
function startPuzzle(p){
  stopEngine();sess=sess&&sess.type==="mine"?sess:null;game=null;drill=null;puz=p;mode="puzzle";flipped=false;
  const g=new Chess(p.fen);op={id:"__puz",g:"c",side:g.turn(),name:p.title,eco:p.eco||"Rätsel",d:p.sub||"",plan:[],lines:[]};
  resetBoard(p.fen);mode="puzzle";
  showView("train");buildSquares();renderChrome();render();
  setStatus("turn",p.prompt||"Finde den besten Zug",`${g.turn()==="w"?"Weiß":"Schwarz"} am Zug.`);
}
function puzzleMove(mv,animate){
  const exp=expected();
  if(exp.indexOf(strip(mv.san))<0){
    // Matt in einem Zug ist immer richtig
    const t=new Chess(shown.fen());t.move(mv.san);if(!t.in_checkmate()){wrongMove(mv,animate,[]);return}
  }
  const r=commit(mv,"u");view=hist.length;shown=new Chess(fens[view]);sel=null;hintLvl=0;render(animate?{fwd:r}:null);playSound(r);
  if(hist.length>=puz.sol.length||new Chess(fens[view]).in_checkmate()){
    done=true;const clean=mistakes===0&&!usedHelp;if(clean)st.puzOk++;saveStats();
    if(puz.key){const pz=S.puz.find(x=>x.key===puz.key);if(pz){pz.tries=(pz.tries||0)+1;if(clean)pz.solved=(pz.solved||0)+1;save("puz")}}
    if(sess)sess.res.push({k:"puz",clean});
    setStatus("done",clean?"Gelöst!":"Gelöst – mit Hilfe",puz.after||"");sfx("done");render();renderChrome();checkBadges();return;
  }
  busy=true;setStatus("good","Richtig!","Der Gegner antwortet …");
  setTimeout(()=>{busy=false;if(mode!=="puzzle")return;const g=new Chess(fens[hist.length]);const m=findMove(g,puz.sol[hist.length]);if(!m)return;const rr=commit(m,"b");view=hist.length;shown=new Chess(fens[view]);render({fwd:rr});playSound(rr);setStatus("turn","Weiter","Finde den nächsten Zug.")},500);
}

/* ---- Sitzungen ---- */
function startSession(type,keys,title,extra){
  let q=keys||[];
  if(type==="daily"){ensureDaily();q=S.daily.queue.filter(k=>S.daily.done.indexOf(k)<0);title="Tagestraining";
    if(!q.length){toast("Das heutige Training ist erledigt – hier sind fünf Extra-Varianten.");q=dueKeys().concat(newKeys(5)).slice(0,5);title="Extra-Training"}}
  if(type==="review"){q=dueKeys();title="Wiederholung";if(!q.length){q=newKeys(5);title="Neue Varianten";toast("Nichts fällig – du lernst fünf neue Varianten.")}}
  if(type==="traps"){q=shuffle(trapKeys());title="Fallen-Training"}
  if(type==="blitz"){q=shuffle(scopeOpenings().length?[].concat(...scopeOpenings().map(o=>o.lines.map((l,i)=>lk(o.id,i)))):[]).slice(0,10);title=`Blitz-Drill (${S.set.blitzSec} s pro Zug)`}
  if(type==="blind"){q=dueKeys().concat(shuffle([].concat(...scopeOpenings().map(o=>o.lines.map((l,i)=>lk(o.id,i)))).filter(k=>Pk(k)===2))).slice(0,5);if(q.length<5)q=q.concat(newKeys(5-q.length));title="Blind-Training"}
  if(type==="positions"){q=duePositions().slice(0,15);title="Schwache Stellungen";if(!q.length){toast("Noch keine schwachen Stellungen – trainiere ein paar Varianten.");return}}
  if(type==="mine"){q=S.puz.filter(p=>!p.solved||p.solved<2).slice(0,15).map(p=>"puz:"+p.key);title="Deine Fehler";if(!q.length){toast("Keine offenen Fehler. Prüfe Partien mit dem Game Review in der Chess.com-Zentrale.");return}}
  q=q.filter(k=>{if(k.indexOf("puz:")===0)return true;if(k.indexOf("|")>0)return !!S.pos[k];const [id,i]=pk(k);const o=byId(id);return o&&o.lines[i]});
  if(!q.length){toast("Keine Varianten für dieses Training gefunden.");return}
  sess=Object.assign({type,title:title||"Training",queue:q,idx:0,res:[],blitz:type==="blitz",blind:type==="blind"},extra||{});
  blindOn=sess.blind;runSessionItem();
}
function runSessionItem(){
  const k=sess.queue[sess.idx];
  if(k.indexOf("puz:")===0){const p=S.puz.find(x=>x.key===k.slice(4));if(!p){sessNext();return}
    if(p.kind==="book")startPosition(byId(p.id),p.pre,{title:"Aus deiner Partie",sub:`Gegen ${p.opp}: du spieltest ${de(p.played)}. Was ist der Buchzug?`,mine:true,key:p.key,after:`In der Partie stand ${de(p.played)}. ${p.url?"Die Partie findest du in der Chess.com-Zentrale.":""}`});
    else startPuzzle({fen:p.fen,sol:[p.best],title:"Dein Fehler",eco:p.opening||"Eigene Partie",sub:`Gegen ${p.opp}, ${p.date?fmtDate(p.date):""}`,prompt:`Du spieltest ${de(p.played)} (${p.cls}). Finde den besseren Zug.`,after:`Stockfish empfiehlt ${de(p.best)}.`,key:p.key});
    blindOn=false;return}
  if(k.indexOf("|")>0){const s=S.pos[k];startPosition(byId(s.id),s.pre);return}
  const [id,i]=pk(k);selectOpening(byId(id),i,true);
}
function sessNext(){
  sess.idx++;
  if(sess.idx>=sess.queue.length){
    const ok=sess.res.filter(r=>r.clean).length,n=sess.res.length,t=sess.title;sess=null;blindOn=false;applyBlind();renderChrome();
    setStatus("done",t+" abgeschlossen",`${ok} von ${n} fehlerfrei. ${dueKeys().length?dueKeys().length+" Varianten sind noch fällig.":"Für heute ist alles wiederholt."}`);
    renderTabbar();return;
  }
  runSessionItem();
}
$("sessEnd").onclick=()=>{sess=null;blindOn=false;applyBlind();stopBlitz();renderChrome();setStatus("turn","Training beendet","Du kannst jederzeit weitermachen.")};

/* ---- Blitz-Timer ---- */
function stopBlitz(){clearInterval(blitzT);blitzT=null;const t=$("timer");if(t)t.hidden=true}
function startBlitz(){
  stopBlitz();if(!(sess&&sess.blitz)||mode!=="train"||done||!live()||!userTurnShown())return;
  blitzLeft=S.set.blitzSec*10;const t=$("timer");t.hidden=false;
  const draw=()=>{t.textContent=(blitzLeft/10).toFixed(1)+" s";t.classList.toggle("low",blitzLeft<=20)};draw();
  blitzT=setInterval(()=>{blitzLeft--;draw();if(blitzLeft===20)sfx("tick");
    if(blitzLeft<=0){stopBlitz();if(mode==="train"&&!done&&live()){usedHelp=true;mistakes++;const exp=expected();const mv=findMove(shown,exp[0]);if(mv){trainMove(mv,true,true);if(!done)setStatus("bad","Zeit abgelaufen","Der Buchzug war "+de(mv.san)+".")}}}},100);
}

/* ---- Blind-Modus ---- */
function applyBlind(){document.body.classList.toggle("blind",!!blindOn&&$("v-train")&&!$("v-train").hidden);$("blindBtn").setAttribute("aria-pressed",String(!!blindOn))}
$("blindBtn").onclick=()=>{if(sess&&sess.blind){peeked=true;usedHelp=true;document.body.classList.add("peek");setTimeout(()=>document.body.classList.remove("peek"),1500);toast("Figuren kurz eingeblendet");return}blindOn=!blindOn;applyBlind()};

/* ================= Stockfish-Partie ================= */
let sfToken=0;
async function startEngine(fromEnd){
  if(!op)return;mode="engine";done=false;sel=null;view=hist.length;shown=new Chess(fens[view]);sfStart=fromEnd?0:hist.length;sfEval=null;badge=null;
  renderChrome();render();setStatus("sf","Stockfish wird geladen …","Beim ersten Mal lädt die Engine (ca. 7 MB).");
  const tok=++sfToken;
  try{await loadSF()}catch(e){if(tok!==sfToken)return;mode="train";done=true;renderChrome();render();setStatus("bad","Stockfish konnte nicht geladen werden","Prüfe die Internetverbindung und versuch es erneut.");return}
  if(tok!==sfToken||mode!=="engine")return;
  if(gameOverCheck())return;
  renderChrome();
  if(shown.turn()!==op.side)sfThink();else setStatus("sf","Du bist am Zug",`${sfName} (Stufe ${S.set.sf}). Setze den Plan um!`);
}
async function sfThink(){
  const tok=sfToken;busy=true;renderBars();setStatus("sf","Stockfish denkt …","");
  const fen=fens[hist.length];const r=await sfRun(fen,{skill:S.set.sf,ms:250+S.set.sf*45});
  if(tok!==sfToken||mode!=="engine")return;busy=false;
  if(!r.best||r.best==="(none)"){gameOverCheck();return}
  const g=new Chess(fen);const mv=g.moves({verbose:true}).find(m=>m.from===r.best.slice(0,2)&&m.to===r.best.slice(2,4)&&(!m.promotion||m.promotion===(r.best[4]||"q")));
  if(!mv)return;
  const cp=cpOf(r.score,g.turn());sfEval=r.score&&r.score.t==="mate"?("Matt in "+Math.abs(r.score.v)):fmtEval(cp);evalCp=cp;
  const wasLive=live();const res=commit(mv,"e");
  if(wasLive){view=hist.length;shown=new Chess(fens[view]);render({fwd:res});playSound(res)}else render();
  if(gameOverCheck())return;
  setStatus("sf","Du bist am Zug",`Stockfish spielte ${de(res.san)}.`);
}
function engineUserMove(mv,animate){const r=commit(mv,"p");view=hist.length;shown=new Chess(fens[view]);sel=null;render(animate?{fwd:r}:null);playSound(r);if(gameOverCheck())return;sfThink()}
function gameOverCheck(){
  const g=new Chess(fens[hist.length]);if(!g.game_over())return false;
  let t,s;
  if(g.in_checkmate()){const winner=g.turn()==="w"?"b":"w";t=winner===op.side?"Matt – du hast gewonnen!":"Matt – Stockfish gewinnt";s=winner===op.side?"Stark gespielt.":"Schau dir mit ← an, wo es kippte."}
  else{t="Remis";s=g.in_stalemate()?"Patt.":g.insufficient_material()?"Zu wenig Material.":"Stellungswiederholung oder 50-Züge-Regel."}
  if(op.endId){st.ends[op.endId]=true;saveStats()}
  endEngine();setStatus("done",t,s);return true;
}
function endEngine(){if(mode!=="engine")return;if(hist.length-sfStart>=8){st.engine++;saveStats();checkBadges()}if(op.endId){st.ends[op.endId]=true;saveStats();checkBadges()}sfToken++;busy=false;mode="train";done=true;renderChrome();render()}
function stopEngine(){if(mode==="engine"){sfToken++;busy=false;try{sfW&&sfW.postMessage("stop")}catch(e){}}}
$("sfBtn").onclick=()=>startEngine();
$("sfStop").onclick=()=>{endEngine();setStatus("done","Partie beendet","Du kannst die Züge mit ← und → nachspielen.")};
$("sfUndo").onclick=()=>{
  if(mode!=="engine"||busy)return;let n=0;
  while(hist.length>sfStart&&n<2){truncate(hist.length-1);n++;if(new Chess(fens[hist.length]).turn()===op.side)break}
  view=hist.length;shown=new Chess(fens[view]);render();setStatus("sf","Zug zurückgenommen","Du bist am Zug.");
};
$("againBtn").onclick=()=>{if(drill){startPosition(op,drill.pre,drill.info);return}const i=target;forced=i;startTrain()};
function startEndgame(e){
  stopEngine();sess=null;game=null;drill=null;puz=null;flipped=false;
  op={id:"__end_"+e.id,endId:e.id,g:"c",side:e.side,name:e.t,eco:"Endspiel",d:e.goal,plan:e.plan,lines:[]};
  resetBoard(e.fen);mode="train";
  if(e.moves){e.moves.split(" ").forEach(m=>{const g=new Chess(fens[hist.length]);const mv=findMove(g,m);if(mv)commit(mv,"g")});view=hist.length;shown=new Chess(fens[view])}
  showView("train");buildSquares();startEngine(true);
}

/* ================= Partien nachspielen / Review ================= */
function openGame(gm){
  stopEngine();sess=null;drill=null;puz=null;mode="replay";game=gm;op=byId((gm.ops||[])[0])||{id:"__game",g:"c",side:"w",name:gm.title,eco:"Partie",d:gm.d||"",plan:[],lines:[]};flipped=false;forced=null;
  resetBoard(gm.fen||undefined);mode="replay";
  const mv0=Array.isArray(gm.moves)?gm.moves:gm.moves.split(" ");
  for(const m of mv0){const g=new Chess(fens[hist.length]);const mv=findMove(g,m);if(!mv)break;commit(mv,"g")}
  view=gm.startView||0;shown=new Chess(fens[view]);done=true;
  showView("train");buildSquares();renderChrome();render();
  setStatus("view",gm.title,`${gm.players||""}${gm.year?", "+gm.year:""}. Spiel die Partie mit → oder den Pfeiltasten nach.`);
}

/* ================= Eigene Variante ================= */
function openEditor(){
  stopEngine();sess=null;mode="edit";game=null;drill=null;puz=null;flipped=false;
  op={id:"__edit",g:"c",side:$("edSide").value,name:"Eigene Variante",eco:"Editor",d:"Spiel beide Seiten und speichere die Folge als eigene Trainingsvariante.",plan:[],lines:[]};
  resetBoard();mode="edit";showView("train");buildSquares();renderChrome();render();
  setStatus("turn","Spiel eine Zugfolge ein","Ziehe für beide Seiten. Mit ← kannst du zurück und einen anderen Zug wählen.");
}
function editMove(mv,animate){
  if(!live())truncate(view);
  const r=commit(mv,"p");view=hist.length;shown=new Chess(fens[view]);sel=null;render(animate?{fwd:r}:null);playSound(r);
  setStatus("turn",`${hist.length} Halbzüge`,fmtMoves(hist.slice(-6),hist.length-Math.min(6,hist.length)));
}
$("edSide").onchange=()=>{if(mode==="edit"){op.side=$("edSide").value;buildSquares();render();renderChrome()}};
$("edUndo").onclick=()=>{if(mode!=="edit"||!hist.length)return;truncate(hist.length-1);view=hist.length;shown=new Chess(fens[view]);render()};
$("edClear").onclick=()=>{if(mode!=="edit")return;resetBoard();mode="edit";render()};
$("edSave").onclick=()=>{
  if(mode!=="edit")return;
  if(hist.length<2){setStatus("bad","Zu kurz","Spiel mindestens zwei Halbzüge ein.");return}
  const side=$("edSide").value;const grp=$("edGroup").value.trim()||"Meine Varianten";const name=$("edName").value.trim()||("Variante "+(S.custom[side].length+1));
  S.custom[side].push({n:name,m:hist.slice(),p:$("edPlan").value.trim(),g:grp});save("custom");buildAll();renderList();checkBadges();
  $("edName").value="";$("edPlan").value="";
  setStatus("done","Gespeichert: "+name,`Du findest sie unter „${grp} · ${side==="w"?"Weiß":"Schwarz"}“ bei den eigenen Varianten.`);
};

/* ================= Navigation in Zügen ================= */
function setView(v){
  v=Math.max(0,Math.min(hist.length,v));if(v===view||lock)return;
  const wasLive=live();const old=view;view=v;shown=new Chess(fens[view]);sel=null;
  let anim=null;if(v===old+1){anim={fwd:mvs[old]};playSound(mvs[old])}else if(v===old-1){anim={back:mvs[v]};sfx("move")}
  render(anim);
  if(mode==="replay"){
    if(view===hist.length&&game&&game.id&&GAMES.some(g=>g.id===game.id)&&!st.games[game.id]){st.games[game.id]=true;saveStats();checkBadges()}
    setStatus("view",game.title,view?`Zug ${Math.ceil(view/2)} von ${Math.ceil(hist.length/2)}`:`${game.players||""}${game.year?", "+game.year:""}`,true);return;
  }
  if(mode==="edit")return;
  if(live()){if(liveStatus)setStatus(...liveStatus,true);startBlitz()}
  else{
    stopBlitz();if(wasLive)liveStatus=curStatus;
    setStatus("view",`Du siehst Zug ${Math.ceil(view/2)||"0"}${view%2===1?" (Weiß)":view?" (Schwarz)":""}`,
      mode==="train"&&userTurnShown()&&!drill?"Spiel von hier einen anderen Buchzug oder blättere mit → zurück.":"Blättere mit → zurück zur aktuellen Stellung.",true);
  }
}
$("navFirst").onclick=()=>setView(0);$("navPrev").onclick=()=>setView(view-1);$("navNext").onclick=()=>setView(view+1);$("navLast").onclick=()=>setView(hist.length);
$("flipBtn").onclick=()=>{flipped=!flipped;buildSquares();render();renderChrome()};
$("evalBtn").onclick=()=>{S.set.evalbar=!S.set.evalbar;save("set");render()};
document.addEventListener("keydown",e=>{
  if($("v-train").hidden)return;
  if(e.target.closest&&e.target.closest("input,select,textarea"))return;
  const k={ArrowLeft:()=>setView(view-1),ArrowRight:()=>setView(view+1),ArrowUp:()=>setView(0),ArrowDown:()=>setView(hist.length),Home:()=>setView(0),End:()=>setView(hist.length),f:()=>$("flipBtn").click()}[e.key];
  if(k){e.preventDefault();k()}
});
/* Zug per Tastatur */
$("moveInput").addEventListener("keydown",e=>{
  if(e.key!=="Enter")return;e.preventDefault();const raw=e.target.value.trim();if(!raw)return;
  const t=raw.replace(/^\d+\.+\s*/,"").replace(/0-0-0/,"O-O-O").replace(/0-0/,"O-O").replace(/^([SLTD])/,c=>({S:"N",L:"B",T:"R",D:"Q"}[c])).replace(/=([DTLS])/,(x,c)=>"="+{D:"Q",T:"R",L:"B",S:"N"}[c]);
  let mv=findMove(shown,t);
  if(!mv&&/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(t))mv=shown.moves({verbose:true}).find(m=>m.from===t.slice(0,2)&&m.to===t.slice(2,4)&&(!m.promotion||m.promotion===(t[4]||"q")));
  if(!mv){toast(`„${raw}“ ist hier kein legaler Zug.`);return}
  e.target.value="";if(!tryMove(mv.from,mv.to,true,mv.promotion))toast("Gerade kannst du nicht ziehen.");
});

/* ================= Zugerklärung ================= */
const ACC={p:"den Bauern",n:"den Springer",b:"den Läufer",r:"den Turm",q:"die Dame",k:"den König"};
const fi=s=>s.charCodeAt(0)-97,ri=s=>+s[1]-1,sqn=(f,r)=>(f>=0&&f<8&&r>=0&&r<8)?"abcdefgh"[f]+(r+1):null;
function ray(g,from,df,dr){const out=[];let f=fi(from)+df,r=ri(from)+dr;while(f>=0&&f<8&&r>=0&&r<8){const s=sqn(f,r);const p=g.get(s);if(p)out.push({s,p});f+=df;r+=dr}return out}
function explain(fenBefore,mv,prev){
  const g=new Chess(fenBefore);g.move(mv.san);
  const white=mv.color==="w",to=mv.to,from=mv.from,p=mv.piece,out=[],arrows=[];const them=white?"b":"w";
  if(mv.flags.indexOf("k")>=0)out.push("Kurze Rochade: Der König steht in Sicherheit und der Turm kommt ins Spiel.");
  else if(mv.flags.indexOf("q")>=0)out.push("Lange Rochade: Der König geht auf den Damenflügel, der Turm steht sofort auf der d-Linie.");
  else{
    if(mv.captured){if(prev&&prev.to===to&&prev.captured)out.push(`Schlägt auf ${to} zurück und stellt das Material wieder her.`);else out.push(`Schlägt ${ACC[mv.captured]} auf ${to}.`)}
    const f=to[0],rk=+to[1],back=white?"1":"8";
    if(p==="p"&&!mv.captured){
      if(mv.promotion)out.push(`Der Bauer verwandelt sich in ${mv.promotion==="n"?"einen Springer":mv.promotion==="q"?"eine Dame":mv.promotion==="r"?"einen Turm":"einen Läufer"}.`);
      else if((f==="e"||f==="d")&&(rk===4||rk===5))out.push("Besetzt das Zentrum und öffnet Linien für Dame und Läufer.");
      else if(f==="c"&&(rk===4||rk===5))out.push(`Greift das Zentrum vom Flügel aus an und kämpft um ${white?"d5":"d4"}.`);
      else if(f==="f"&&(rk===4||rk===5))out.push(`Kämpft um ${white?"e5":"e4"} und bereitet die Öffnung der f-Linie vor.`);
      else if((f==="g"||f==="b")&&(rk===3||rk===6))out.push("Bereitet das Fianchetto des Läufers vor.");
      else if(f==="h"&&(rk===3||rk===6))out.push(`Verhindert Figuren auf ${white?"g4":"g5"} und schafft dem König Luft.`);
      else if(f==="a"&&(rk===3||rk===6))out.push(`Kontrolliert ${white?"b4":"b5"} und bereitet einen Vorstoß am Damenflügel vor.`);
      else if(f==="c"&&(rk===3||rk===6))out.push(white?"Stützt d4 und öffnet der Dame die Diagonale nach a4 und b3.":"Stützt d5 und öffnet der Dame die Diagonale nach a5 und b6.");
      else if((f==="e"||f==="d")&&(rk===3||rk===6))out.push("Stützt das Zentrum und öffnet dem Läufer eine Diagonale.");
      else if((f==="h"||f==="g")&&(rk===4||rk===5))out.push("Ein Bauernsturm gegen den gegnerischen Königsflügel.");
      else if((f==="a"||f==="b")&&(rk===4||rk===5))out.push("Gewinnt Raum am Damenflügel.");
      else out.push("Gewinnt Raum und engt den Gegner ein.");
    }
    if(p==="n"){out.push(from[1]===back?"Entwickelt den Springer.":"Der Springer sucht ein besseres Feld.");
      const cen=["d4","e4","d5","e5"].filter(s=>{const dx=Math.abs(fi(s)-fi(to)),dy=Math.abs(ri(s)-ri(to));return (dx===1&&dy===2)||(dx===2&&dy===1)});if(cen.length)out.push(`Er kontrolliert ${cen.join(" und ")}.`)}
    if(p==="b"){
      if(["g2","b2","g7","b7"].indexOf(to)>=0&&from[1]===back)out.push("Fianchetto: Der Läufer wirkt über die lange Diagonale.");else if(from[1]===back)out.push(`Entwickelt den Läufer nach ${to}.`);else out.push(`Der Läufer zieht nach ${to}.`);
      const tgt=white?"f7":"f2";const dx=fi(tgt)-fi(to),dy=ri(tgt)-ri(to);
      if(Math.abs(dx)===Math.abs(dy)&&dx!==0){const r=ray(g,to,Math.sign(dx),Math.sign(dy));if(r.length&&r[0].s===tgt){out.push(`Er zielt auf den empfindlichen Punkt ${tgt}.`);arrows.push([to,tgt])}}
    }
    if(p==="q")out.push(from===(white?"d1":"d8")?"Die Dame kommt ins Spiel.":"Die Dame wechselt das Feld.");
    if(p==="r"&&!mv.captured){let own=0,opp=0;for(let r=1;r<=8;r++){const q=g.get(f+r);if(q&&q.type==="p"){if(q.color===mv.color)own++;else opp++}}out.push(own?"Der Turm kommt ins Spiel.":`Der Turm besetzt die ${opp?"halboffene":"offene"} ${f}-Linie.`)}
    if(p==="k")out.push("Der König zieht.");
    let pinned=null;
    if(p==="b"||p==="r"||p==="q"){
      const dirs=(p==="b"?[]:[[1,0],[-1,0],[0,1],[0,-1]]).concat(p==="r"?[]:[[1,1],[1,-1],[-1,1],[-1,-1]]);
      for(const [a,b] of dirs){const r=ray(g,to,a,b);if(r.length>=2&&r[0].p.color===them&&r[0].p.type!=="k"&&r[1].p.color===them&&(r[1].p.type==="k"||(r[1].p.type==="q"&&r[0].p.type!=="q"))){pinned=r[0].s;arrows.push([to,r[1].s]);out.push(`Fesselt ${ACC[r[0].p.type]} auf ${r[0].s} an ${r[1].p.type==="k"?"den König":"die Dame"}.`);break}}
    }
    try{const parts=g.fen().split(" ");parts[1]=mv.color;parts[3]="-";const t=new Chess();
      if(t.load(parts.join(" "))){const att=t.moves({square:to,verbose:true}).filter(m=>m.captured&&m.captured!=="p"&&m.captured!=="k"&&m.to!==pinned);const seen={};const uniq=att.filter(m=>seen[m.to]?false:(seen[m.to]=1));
        if(uniq.length&&mv.san.indexOf("#")<0){out.push(`Greift ${uniq.slice(0,2).map(m=>`${ACC[m.captured]} auf ${m.to}`).join(" und ")} an.`);uniq.slice(0,2).forEach(m=>arrows.push([to,m.to]))}}}catch(e){}
  }
  if(mv.san.indexOf("#")>=0)out.push("Schachmatt!");else if(mv.san.indexOf("+")>=0)out.push("Mit Schach.");
  return {text:out.join(" "),arrows};
}
function lineNote(h,ply){if(!op||!op.lines)return "";for(const i of consistent(h)){const n=op.lines[i].notes;if(n&&n[ply])return n[ply]}return ""}
const CLS={book:["Buchzug","c-book","B"],best:["Bester Zug","c-best","★"],exc:["Exzellent","c-exc","!"],good:["Gut","c-good","✓"],inacc:["Ungenauigkeit","c-inacc","?!"],mist:["Fehler","c-mist","?"],blun:["Patzer","c-blun","??"]};
function renderExplain(){
  const el=$("tabEx");const h=hist.slice(0,view);let html="";
  const R=game&&game.review;
  if(view>0){
    const mv=mvs[view-1];const num=Math.ceil(view/2)+(view%2===1?".":"...");
    const note=mode==="train"?lineNote(h,view-1):"";
    const who={u:"dein Zug",b:"Buch",e:"Stockfish",p:mode==="edit"?"Editor":"dein Zug",g:"Partie"}[flags[view-1]]||"";
    const names=mode==="train"&&!op.endId?consistent(h).map(i=>op.lines[i].n):[];
    let rev="";
    if(R&&R.cls[view-1]){const c=CLS[R.cls[view-1]];rev=`<p style="display:flex;gap:8px;align-items:center"><span class="cls ${c[1]}">${c[2]}</span><b>${c[0]}</b>${R.evals[view]!=null?` · Bewertung ${fmtEval(R.evals[view])}`:""}</p>`;
      if(["inacc","mist","blun"].indexOf(R.cls[view-1])>=0&&R.best[view-1]){const bm=new Chess(fens[view-1]).moves({verbose:true}).find(m=>m.from+m.to+(m.promotion||"")===R.best[view-1]);if(bm)rev+=`<p class="note">Besser war ${esc(de(bm.san))}.</p>`}}
    html+=`<div class="excard"><div class="exh"><span>Zug ${view} von ${hist.length} · ${who}</span></div>
      <div class="exmove">${esc(num+" "+de(mv.san))}<span class="who">${mv.color==="w"?"Weiß":"Schwarz"}</span></div>${rev}
      <p>${esc(explain(fens[view-1],mv,view>1?mvs[view-2]:null).text)}</p>${note?`<p class="note">${esc(note)}</p>`:""}
      ${names.length?`<p class="leads">${names.length===1?"Variante":"Mögliche Varianten"}: ${esc(names.slice(0,4).join(" · "))}${names.length>4?" · +"+(names.length-4)+" weitere":""}</p>`:""}</div>`;
  }else{
    const txt=mode==="replay"?"Spiel die Partie mit → nach. Zu jedem Zug erscheint hier eine Erklärung.":mode==="edit"?"Spiel eine Zugfolge für beide Seiten ein.":mode==="puzzle"?"Finde den besten Zug.":(op.side==="w"?"Du spielst Weiß.":"Du spielst Schwarz.")+" Zu jedem Zug erscheint hier eine Erklärung.";
    html+=`<div class="excard"><div class="exh"><span>${startFen?"Ausgangsstellung":"Startstellung"}</span></div><p>${esc(txt)}</p></div>`;
  }
  if(mode==="replay"&&game){
    if(R)html+=reviewSummaryHtml(R);
    if(game.d)html+=`<div class="excard"><div class="exh"><span>${esc(game.title)}</span></div><p>${esc(game.d)}</p>${game.url?`<p class="leads"><a href="${esc(game.url)}" target="_blank" rel="noopener">Partie auf ${game.url.indexOf("lichess")>=0?"Lichess":"Chess.com"} öffnen</a></p>`:""}</div>`;
  }
  if((mode==="engine"||mode==="train")&&!op.endId){
    const hh=mode==="engine"?hist.slice(0,sfStart):h;const c=consistent(hh);
    if(c.length&&op.lines.length){const show=(done||mode==="engine")&&target!==null&&c.indexOf(target)>=0?[target]:c.slice(0,4);
      html+=`<div class="excard"><div class="exh"><span>${show.length===1?"Plan nach der Eröffnung":"Pläne der möglichen Varianten"}</span></div><div class="lp">${show.map(i=>`<div><b>${esc(op.lines[i].n)}</b><span>${esc(op.lines[i].p||"")}</span></div>`).join("")}${c.length>show.length&&!done?`<div><span>und ${c.length-show.length} weitere Varianten</span></div>`:""}</div></div>`}
    const gs=GAMES.filter(g=>g.ops.indexOf(op.id)>=0);
    if(gs.length)html+=`<div class="excard"><div class="exh"><span>Musterpartie</span></div>${gs.map(g=>`<button class="gamebtn" data-game="${g.id}"><span class="avatar bookav" style="width:30px;height:30px">${ICON.crown}</span><span><b>${esc(g.title)}</b><small>${esc(g.players)} · ${esc(g.year)}</small></span></button>`).join("")}<p class="leads">Weitere Meisterpartien findest du im Reiter „Datenbank“.</p></div>`;
  }
  if(op.plan&&op.plan.length&&mode!=="replay")html+=`<div class="excard"><div class="exh"><span>${op.endId?"So gehst du vor":"Strategischer Plan · "+esc(op.name)}</span></div><ul>${op.plan.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>`;
  el.innerHTML=html;
  el.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>openGame(GAMES.find(g=>g.id===b.dataset.game)));
  const gr=el.querySelector(".graph");if(gr)gr.onclick=e=>{const r=gr.getBoundingClientRect();setView(Math.round((e.clientX-r.left)/r.width*hist.length))};
}
function reviewSummaryHtml(R){
  const cnt=c=>{const o={w:{},b:{}};R.cls.forEach((k,i)=>{if(!k)return;const s=i%2===0?"w":"b";o[s][k]=(o[s][k]||0)+1});return o};const C=cnt();
  const pts=R.evals.map((v,i)=>v==null?null:[i,winPct(v)]).filter(Boolean);const n=Math.max(1,hist.length);
  const path=pts.map((p,i)=>(i?"L":"M")+(p[0]/n*100).toFixed(2)+" "+(100-p[1]).toFixed(2)).join(" ");
  const area=pts.length?`M0 100 ${pts.map(p=>"L"+(p[0]/n*100).toFixed(2)+" "+(100-p[1]).toFixed(2)).join(" ")} L${(pts[pts.length-1][0]/n*100).toFixed(2)} 100Z`:"";
  const rows=["book","best","exc","good","inacc","mist","blun"].map(k=>`<b>${C.w[k]||0}</b><span class="c"><span class="cls ${CLS[k][1]}">${CLS[k][2]}</span>${CLS[k][0]}</span><b>${C.b[k]||0}</b>`).join("");
  return `<div class="excard"><div class="exh"><span>Game Review${R.doneN<hist.length?` · analysiere ${R.doneN}/${hist.length}`:""}</span><span>${esc(R.engine||"")}</span></div>
  <svg class="graph" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${area}" fill="#F2F1EC"/><line x1="0" y1="50" x2="100" y2="50" stroke="#888" stroke-width=".4"/><line x1="${(view/n*100).toFixed(2)}" y1="0" x2="${(view/n*100).toFixed(2)}" y2="100" stroke="#81B64C" stroke-width=".8"/></svg>
  <div class="revsum" style="margin-top:10px"><b style="font-size:20px">${R.acc&&R.acc.w!=null?R.acc.w.toFixed(1):"–"}</b><span class="c">Genauigkeit</span><b style="font-size:20px">${R.acc&&R.acc.b!=null?R.acc.b.toFixed(1):"–"}</b><span class="sub" style="text-align:center">Weiß</span><span></span><span class="sub" style="text-align:center">Schwarz</span>${rows}</div></div>`;
}
function setTab(t){tab=t;["ex","var","db"].forEach(x=>{$("tab"+{ex:"Ex",var:"Var",db:"Db"}[x]+"Btn").setAttribute("aria-selected",String(t===x));$({ex:"tabEx",var:"tabVar",db:"tabDb"}[x]).hidden=t!==x});if(t==="db")renderDb()}
$("tabExBtn").onclick=()=>setTab("ex");$("tabVarBtn").onclick=()=>setTab("var");$("tabDbBtn").onclick=()=>setTab("db");
$("vList").onclick=()=>{vtab="list";$("vList").setAttribute("aria-pressed","true");$("vTree").setAttribute("aria-pressed","false");renderVars()};
$("vTree").onclick=()=>{vtab="tree";$("vTree").setAttribute("aria-pressed","true");$("vList").setAttribute("aria-pressed","false");renderVars()};

/* ================= Lichess-Datenbank ================= */
const exCache={};
async function explorer(db,h,timeoutMs){
  const key=db+"|"+h.join(" ");if(exCache[key])return exCache[key];
  const play=histUci(h).join(",");
  const url=db==="masters"?`https://explorer.lichess.ovh/masters?play=${play}&moves=12&topGames=8`:`https://explorer.lichess.ovh/lichess?variant=standard&speeds=blitz,rapid,classical&ratings=1600,1800,2000,2200,2500&play=${play}&moves=12&topGames=0&recentGames=0`;
  const ctl=window.AbortController?new AbortController():null;const tt=timeoutMs?setTimeout(()=>ctl&&ctl.abort(),timeoutMs):null;
  const headers={};if(S.set.liToken)headers.Authorization="Bearer "+S.set.liToken;
  const r=await fetch(url,{headers,signal:ctl?ctl.signal:undefined});if(tt)clearTimeout(tt);
  if(r.status===401||r.status===403)throw new Error("auth");if(r.status===429)throw new Error("ratelimit");if(!r.ok)throw new Error("http");
  const d=await r.json();exCache[key]=d;return d;
}
const dbBar=m=>{const n=m.white+m.draws+m.black||1;const w=m.white/n*100,d=m.draws/n*100,l=m.black/n*100;return `<div class="dbbar"><i class="w" style="width:${w}%">${w>=14?Math.round(w)+"%":""}</i><i class="d" style="width:${d}%">${d>=14?Math.round(d)+"%":""}</i><i class="l" style="width:${l}%">${l>=14?Math.round(l)+"%":""}</i></div>`};
const fmtN=n=>n>=1e6?(n/1e6).toFixed(1)+" Mio.":n>=1e3?Math.round(n/1e3)+" Tsd.":String(n);
let dbTok=0;
async function renderDb(){
  const el=$("tabDb");if(tab!=="db"||!el)return;const h=hist.slice(0,view);const tok=++dbTok;
  const myRows=myTreeAt(h);
  const bk=op&&op.lines&&op.lines.length?bookMoves(h):[];
  el.innerHTML=`<div class="excard"><div class="exh"><span>Lichess-Spieler (1600–2500)</span></div><div id="dbL"><p class="sub">Lädt …</p></div></div><div class="excard"><div class="exh"><span>Meisterpartien</span></div><div id="dbM"><p class="sub">Lädt …</p></div></div>${myRows}`;
  const rowsHtml=d=>d.moves.length?d.moves.map(m=>`<div class="dbrow${bk.indexOf(strip(m.san))>=0?" book":""}" data-san="${esc(m.san)}"><b>${esc(de(m.san))}</b><small>${fmtN(m.white+m.draws+m.black)}</small>${dbBar(m)}</div>`).join(""):'<p class="sub">Keine Partien in dieser Stellung.</p>';
  const err=e=>String(e&&e.message)==="auth"?`<p class="sub">Lichess verlangt für die Datenbank eine Anmeldung. Trag unter Profil → Einstellungen einen kostenlosen Lichess-Token ein.</p>`:`<p class="sub">Die Lichess-Datenbank ist gerade nicht erreichbar.</p>`;
  explorer("lichess",h).then(d=>{if(tok!==dbTok)return;$("dbL").innerHTML=rowsHtml(d)+`<p class="leads">${fmtN(d.white+d.draws+d.black)} Partien · ● = Buchzug im Trainer</p>`;wireDbRows()}).catch(e=>{if(tok===dbTok)$("dbL").innerHTML=err(e)});
  explorer("masters",h).then(d=>{if(tok!==dbTok)return;$("dbM").innerHTML=rowsHtml(d)+(d.topGames&&d.topGames.length?`<div class="exh" style="margin-top:8px"><span>Top-Partien</span></div>`+d.topGames.map(g=>`<div class="mgame" data-mid="${esc(g.id)}" data-t="${esc(g.white.name+" – "+g.black.name)}" data-y="${esc(g.year||"")}"><span>${esc(g.white.name)} (${g.white.rating}) – ${esc(g.black.name)} (${g.black.rating})</span><small>${g.winner==="white"?"1–0":g.winner==="black"?"0–1":"½–½"} · ${esc(g.year||"")}</small></div>`).join(""):"");wireDbRows();
    $("dbM").querySelectorAll("[data-mid]").forEach(x=>x.onclick=()=>loadMasterGame(x.dataset.mid,x.dataset.t,x.dataset.y,h.length))}).catch(e=>{if(tok===dbTok)$("dbM").innerHTML=err(e)});
}
function wireDbRows(){$("tabDb").querySelectorAll("[data-san]").forEach(x=>x.onclick=()=>{if(mode==="replay"||mode==="edit"||(mode==="train"&&!done&&userTurnShown())){const mv=findMove(shown,x.dataset.san);if(mv&&!tryMove(mv.from,mv.to,true,mv.promotion))toast("Dieser Zug ist hier nicht spielbar.")}else toast("Zum Ausprobieren eignet sich der Editor unter Lernen → Eigene Variante.")})}
async function loadMasterGame(id,title,year,ply){
  try{const r=await fetch("https://explorer.lichess.ovh/masters/pgn/"+id);if(!r.ok)throw 0;const pgn=await r.text();
    openGame({title:title,players:title,year:year,moves:pgnMoves(pgn,400),d:`Meisterpartie aus der Lichess-Datenbank (${pgnHeader(pgn,"Event")}).`,url:"https://lichess.org/"+id,ops:[op&&op.id],startView:ply})}
  catch(e){toast("Die Partie konnte nicht geladen werden.")}
}

/* ================= Rendering Brett ================= */
function setStatus(k,t,s,noStore){
  curStatus=[k,t,s];if(!noStore&&live())liveStatus=null;
  $("coach").dataset.k=k;$("stTitle").textContent=t;$("stText").textContent=s||"";
  $("face").innerHTML=k==="done"||k==="good"?ICON.ok.replace('viewBox','width="20" height="20" viewBox'):k==="bad"?ICON.no.replace('viewBox','width="18" height="18" viewBox'):k==="sf"?ICON.cpu:ICON.face;
  const ev=$("evalTag");if(mode==="engine"&&sfEval){ev.hidden=false;ev.textContent="Bewertung: "+sfEval}else ev.hidden=true;
}
function xy(sq){const f=fi(sq),r=ri(sq);return orient()==="b"?{x:7-f,y:r}:{x:f,y:7-r}}
function sqAtXY(x,y){if(x<0||y<0||x>7||y>7)return null;const b=orient()==="b";const f=b?7-x:x,r=b?y:7-y;return "abcdefgh"[f]+(r+1)}
function buildSquares(){
  sqsEl.innerHTML="";
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
    const name=sqAtXY(x,y);const d=document.createElement("div");d.className="sq "+((x+y)%2===0?"l":"d");d.dataset.sq=name;
    if(x===0){const s=document.createElement("span");s.className="coord r";s.textContent=name[1];d.appendChild(s)}
    if(y===7){const s=document.createElement("span");s.className="coord f";s.textContent=name[0];d.appendChild(s)}
    sqsEl.appendChild(d);
  }
  sizeVar();
}
function sizeVar(){boardEl.style.setProperty("--s",(boardEl.clientWidth/8||60)+"px")}
const tf=sq=>{const p=xy(sq);return `translate(${p.x*100}%,${p.y*100}%)`};
function rookMove(r,rev){if(!r||!(r.flags.indexOf("k")>=0||r.flags.indexOf("q")>=0))return null;const rank=r.color==="w"?"1":"8";const k=r.flags.indexOf("k")>=0;const a=(k?"h":"a")+rank,b=(k?"f":"d")+rank;return rev?{from:b,to:a}:{from:a,to:b}}
function hintMove(){if((mode!=="train"&&mode!=="puzzle")||!hintLvl||lock||busy||!userTurnShown())return null;const b=expected();return b.length?findMove(shown,b[0]):null}
function arrowPath(from,to,color,w){
  const a=xy(from),b=xy(to);const ax=a.x+.5,ay=a.y+.5,bx=b.x+.5,by=b.y+.5;
  const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy);if(!L)return "";const ux=dx/L,uy=dy/L,hl=.42,hw=w*1.5,sw=w;
  const ex=bx-ux*hl,ey=by-uy*hl,px=-uy,py=ux,sx=ax+ux*.28,sy=ay+uy*.28;
  return `<path d="M${sx-px*sw/2} ${sy-py*sw/2} L${ex-px*sw/2} ${ey-py*sw/2} L${ex-px*hw} ${ey-py*hw} L${bx} ${by} L${ex+px*hw} ${ey+py*hw} L${ex+px*sw/2} ${ey+py*sw/2} L${sx+px*sw/2} ${sy+py*sw/2}Z" fill="${color}"/>`;
}
function canMoveNow(){
  if(lock||busy)return false;
  if(mode==="train")return !(done&&live())&&userTurnShown()&&!(drill&&!live());
  if(mode==="puzzle")return !done&&live()&&userTurnShown();
  if(mode==="engine")return live()&&shown.turn()===op.side;
  if(mode==="edit")return true;
  return false;
}
const ownPiece=p=>p&&(mode==="edit"?p.color===shown.turn():p.color===op.side);
function updateEvalBar(){
  const bar=$("evalBar");const R=game&&game.review;
  const on=S.set.evalbar||mode==="engine"||(mode==="replay"&&R);
  $("evalBtn").setAttribute("aria-pressed",String(!!S.set.evalbar));bar.hidden=!on;if(!on)return;
  const setBar=cp=>{const w=winPct(cp);const top=orient()==="w";$("evalFill").style.height=(top?w:100-w)+"%";$("evalFill").style.bottom=top?"0":"auto";$("evalFill").style.top=top?"auto":"0";$("evalTxt").textContent=Math.abs(cp)>=9000?"M":(Math.abs(cp)/100).toFixed(1);bar.classList.toggle("wadv",(cp>=0)===top)};
  if(R&&R.evals[view]!=null){setBar(R.evals[view]);return}
  if(mode==="engine"&&live()&&evalCp!=null){setBar(evalCp);return}
  const tok=++evalTok;const fen=fens[view];
  setTimeout(()=>{if(tok!==evalTok)return;sfRun(fen,{ms:350}).then(r=>{if(tok!==evalTok)return;const g=new Chess(fen);setBar(cpOf(r.score,g.turn()))}).catch(()=>{$("evalTxt").textContent="–"})},250);
}
function render(anim,extra){
  extra=extra||{};
  const last=extra.bad?null:(view>0?mvs[view-1]:null);
  const hm=hintMove();
  const targets=sel?shown.moves({square:sel,verbose:true}):[];
  let chk=null;if(shown.in_check()){const b=shown.board();for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(p&&p.type==="k"&&p.color===shown.turn())chk="abcdefgh"[c]+(8-r)}}
  for(const el of sqsEl.children){
    const n=el.dataset.sq;
    el.classList.toggle("hl",!!((last&&(last.from===n||last.to===n))||sel===n));
    el.classList.toggle("bad",!!(extra.bad&&extra.bad.indexOf(n)>=0));
    el.classList.toggle("ring",!!(hm&&hintLvl===1&&hm.from===n));
    el.classList.toggle("check",chk===n);
    const old=el.querySelector(".dot");if(old)old.remove();
    const t=targets.find(m=>m.to===n);
    if(t){const d=document.createElement("span");d.className="dot"+(shown.get(n)?" cap":"");el.appendChild(d)}
  }
  pcsEl.innerHTML="";const moving=[];let pairs=[];
  if(anim&&anim.fwd){pairs=[{from:anim.fwd.from,to:anim.fwd.to}];const rk=rookMove(anim.fwd);if(rk)pairs.push(rk)}
  if(anim&&anim.back){pairs=[{from:anim.back.to,to:anim.back.from}];const rk=rookMove(anim.back,true);if(rk)pairs.push(rk)}
  const board=shown.board();
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=board[r][c];if(!p)continue;const sq="abcdefgh"[c]+(8-r);
    const d=document.createElement("div");d.className="pc "+p.color+p.type;d.dataset.sq=sq;
    const pr=pairs.find(x=>x.to===sq);
    if(pr){d.style.transform=tf(pr.from);moving.push([d,sq])}else{d.style.transform=tf(sq);if(anim&&anim.back&&sq===anim.back.to&&anim.back.captured)d.classList.add("fadein")}
    pcsEl.appendChild(d);
  }
  if(moving.length){void pcsEl.offsetWidth;moving.forEach(([d,sq])=>{d.classList.add("anim");d.style.transform=tf(sq)})}
  ovl.innerHTML=hm&&hintLvl===2?arrowPath(hm.from,hm.to,"rgba(255,170,0,.85)",.18):"";
  let ideas="";const R=game&&game.review;
  if(R&&view>0&&R.best[view-1]&&["inacc","mist","blun"].indexOf(R.cls[view-1])>=0){const b=R.best[view-1];ideas+=arrowPath(b.slice(0,2),b.slice(2,4),"rgba(129,182,76,.85)",.16)}
  else if(S.set.ideas&&view>0&&!extra.bad&&!(hm&&hintLvl===2)&&!blindOn){try{explain(fens[view-1],mvs[view-1]).arrows.forEach(([a,b])=>ideas+=arrowPath(a,b,"rgba(70,140,235,.62)",.13))}catch(e){}}
  ideasEl.innerHTML=ideas;
  renderMarks();
  badgesEl.innerHTML="";
  let bdg=badge&&(badge.ply===view||badge.ply===-1)?badge:null;
  if(!bdg&&R&&view>0&&R.cls[view-1])bdg={sq:mvs[view-1].to,type:"rv-"+R.cls[view-1]};
  if(bdg){const p=xy(bdg.sq);const b=document.createElement("div");
    if(bdg.type.indexOf("rv-")===0){const c=CLS[bdg.type.slice(3)];b.className="badge cls "+c[1];b.textContent=c[2];b.style.fontSize="calc(var(--s)*.2)"}else{b.className="badge "+bdg.type;b.innerHTML=ICON[bdg.type]}
    b.style.left=((p.x+1)*12.5)+"%";b.style.top=(p.y*12.5)+"%";badgesEl.appendChild(b)}
  renderMoves();renderVars();renderBars();renderExplain();updateEvalBar();if(tab==="db")renderDb();applyBlind();
  const canAct=(mode==="train"||mode==="puzzle")&&!done&&!busy&&!lock&&userTurnShown()&&!op.endId;
  $("hintBtn").disabled=$("showBtn").disabled=!canAct;$("restartBtn").disabled=mode==="puzzle"&&!done;
  $("navFirst").disabled=$("navPrev").disabled=view===0;
  $("navNext").disabled=$("navLast").disabled=live();
  $("actsDone").hidden=!(mode==="train"&&done&&!op.endId&&((target!==null&&op.lines&&op.lines.length)||drill));
  $("actsTrain").hidden=!(mode==="train"||mode==="puzzle")||($("actsDone").hidden===false)||!!op.endId;
  $("sfUndo").disabled=busy||hist.length<=sfStart;
  $("moveInput").disabled=mode==="replay";
}
function renderChrome(){
  const inSess=!!sess;$("sessBar").hidden=!inSess;
  if(inSess){$("sessTitle").textContent=sess.title;$("sessCount").textContent=`${Math.min(sess.idx+1,sess.queue.length)}/${sess.queue.length}`;$("sessProg").style.width=(sess.idx/sess.queue.length*100)+"%"}
  $("actsSf").hidden=mode!=="engine";$("editor").hidden=mode!=="edit";
  $("nextBtn").hidden=!((mode==="train"&&!op.endId)||(mode==="puzzle"&&sess));
  $("nextBtn").textContent=sess?(sess.idx+1>=sess.queue.length?"Training abschließen":`Weiter (${sess.idx+2}/${sess.queue.length})`):"Nächste Variante";
  const eco=$("eco"),title=$("title"),desc=$("desc");
  if(mode==="replay"&&game){eco.textContent=(game.review?"Game Review":"Partie")+(game.year?" · "+game.year:"");title.textContent=game.title;desc.textContent=game.players||"";$("phIcon").innerHTML=ICON.crown}
  else if(mode==="edit"){eco.textContent="Editor";title.textContent="Eigene Variante";desc.textContent=op.d;$("phIcon").innerHTML=ICON.pen}
  else if(mode==="puzzle"){eco.textContent=op.eco;title.textContent=op.name;desc.textContent=op.d;$("phIcon").innerHTML=ICON.puzzle}
  else{eco.textContent=op.eco+" · Du spielst "+(op.side==="w"?"Weiß":"Schwarz")+(mode==="engine"?" · gegen "+(sfName||"Stockfish"):"");title.textContent=op.name;desc.textContent=op.d;$("phIcon").innerHTML=op.endId?ICON.crown:ICON.bookL}
  const av=$("oppAv");
  if(mode==="engine"){av.className="avatar sfav";av.innerHTML=ICON.cpu;$("oppName").textContent=(sfName||"Stockfish")+" · Stufe "+S.set.sf}
  else if(mode==="replay"&&game){av.className="avatar bookav";av.innerHTML=ICON.crown}
  else if(mode==="edit"){av.className="avatar bookav";av.innerHTML=ICON.pen;$("oppName").textContent="Gegenseite"}
  else if(mode==="puzzle"){av.className="avatar bookav";av.innerHTML=ICON.puzzle;$("oppName").textContent="Gegner"}
  else{av.className="avatar bookav";av.innerHTML=ICON.bookL;$("oppName").textContent=op.endId?"Stockfish":"Eröffnungsbuch"}
  if(mode==="replay"&&game){const pl=(game.players||" – ").split(" – ");const o=orient();$("youName").textContent=(o==="w"?pl[0]:pl[1])||"";$("oppName").textContent=(o==="w"?pl[1]:pl[0])||"";$("youTag").textContent="";$("oppTag").textContent=""}
  else{$("youName").textContent="Du";const ys=mode==="edit"?$("edSide").value:op.side;$("youTag").textContent=ys==="w"?"(Weiß)":"(Schwarz)";$("oppTag").textContent=ys==="w"?"(Schwarz)":"(Weiß)"}
  const d=dueKeys().length;$("footInfo").textContent=d?d+" fällig":"";
}
function renderBars(){
  const tm=shown.turn();const active=live()&&!done&&mode!=="replay";
  const yourTurn=active&&(mode==="edit"?true:tm===op.side);const oppTurn=active&&!yourTurn;
  $("youClock").classList.toggle("on",!!yourTurn);$("oppClock").classList.toggle("on",!!oppTurn);
  if(mode==="replay"){$("youClock").textContent=game&&game.review?"Review":"Partie";$("oppClock").textContent=game&&game.review?"Review":"Partie";return}
  if(mode==="edit"){$("youClock").textContent=(tm==="w"?"Weiß":"Schwarz")+" zieht";$("oppClock").textContent="Editor";return}
  $("youClock").textContent=done?"Fertig":yourTurn?"Am Zug":live()?"Wartet":"Ansicht";
  $("oppClock").textContent=mode==="engine"?(busy?"Denkt …":"Stockfish"):oppTurn?"Denkt …":mode==="puzzle"?"Rätsel":"Buch";
}
function renderMoves(){
  const m=$("moves");m.innerHTML="";const R=game&&game.review;
  if(!hist.length){m.innerHTML='<div class="empty">Noch keine Züge gespielt.</div>';return}
  const off=startFen&&new Chess(startFen).turn()==="b"?1:0;const n0=startFen?+startFen.split(" ")[5]||1:1;
  for(let i=-off;i<hist.length;i+=2){
    const row=document.createElement("div");row.className="mrow";
    const n=document.createElement("span");n.className="n";n.textContent=(n0+Math.floor((i+off)/2))+".";row.appendChild(n);
    [i,i+1].forEach(k=>{
      if(k<0||k>=hist.length){row.appendChild(document.createElement("span"));return}
      const b=document.createElement("button");b.className="mv"+(k===view-1?" cur":"");
      let tag=flags[k]==="u"?`<span class="tag">${ICON.book}</span>`:flags[k]==="e"?`<span class="tag sf">${ICON.cpu.replace(/width="22" height="22"/,'width="9" height="9"')}</span>`:"";
      if(R&&R.cls[k]){const c=CLS[R.cls[k]];tag=`<span class="cls ${c[1]}">${c[2]}</span>`}
      b.innerHTML=tag+"<span></span>";b.lastChild.textContent=de(hist[k]);b.onclick=()=>setView(k+1);row.appendChild(b);
    });
    m.appendChild(row);
  }
  const cur=m.querySelector(".mv.cur");if(cur){const r=cur.offsetTop;if(r<m.scrollTop||r>m.scrollTop+m.clientHeight-30)m.scrollTop=r-m.clientHeight/2}
}
function renderVars(){
  const v=$("vars"),tr=$("tree");v.hidden=vtab!=="list";tr.hidden=vtab!=="tree";
  if(!op.lines||!op.lines.length){v.innerHTML='<div class="empty">Keine Varianten.</div>';tr.innerHTML="";$("varProg").textContent="";return}
  const cl=op.lines.filter((l,i)=>P(op.id,i)===2).length;$("varProg").textContent=`${cl}/${op.lines.length}`;
  if(vtab==="tree"){renderTree();return}
  v.innerHTML="";const c=new Set(consistent(hist));
  op.lines.forEach((l,i)=>{
    const row=document.createElement("div");row.className="varrow";
    const b=document.createElement("button");b.className="var"+(hist.length&&!c.has(i)&&mode==="train"?" out":"");b.setAttribute("aria-pressed",forced===i?"true":"false");
    const s=P(op.id,i);const due=isDue(lk(op.id,i));
    b.innerHTML=`<span class="mk ${s===2?"clean":s===1?"seen":""}">${s?ICON.ok:""}</span><span class="vn"></span>${due?'<span class="due">fällig</span>':""}<span class="vp">${Math.ceil(l.m.length/2)} Züge</span>`;
    b.querySelector(".vn").textContent=l.n;
    b.onclick=()=>{sess=null;drill=null;forced=i;target=i;mode="train";startTrain()};
    row.appendChild(b);
    if(op.g==="c"&&l.ci!=null){const d=document.createElement("button");d.className="vdel";d.textContent="Löschen";d.onclick=()=>{if(d.dataset.sure){const side=op.side;S.custom[side].splice(l.ci,1);save("custom");buildAll();renderList();const o=ALL.find(x=>x.g==="c"&&x.side===side);selectOpening(o||ALL[0])}else{d.dataset.sure="1";d.textContent="Sicher?"}};row.appendChild(d)}
    v.appendChild(row);
  });
}
function renderTree(){
  const root={kids:{},lines:[]};
  op.lines.forEach((l,i)=>{let n=root;l.m.forEach((m,k)=>{n.kids[m]=n.kids[m]||{m,ply:k,kids:{},lines:[]};n=n.kids[m];n.lines.push(i)});n.end=(n.end||[]).concat(i)});
  const cls=idxs=>{const s=idxs.map(i=>P(op.id,i));return s.every(x=>x===2)?"ok":s.some(x=>x>0)?"half":""};
  const node=n=>{let seq=[n];while(Object.keys(seq[seq.length-1].kids).length===1&&!seq[seq.length-1].end){seq.push(Object.values(seq[seq.length-1].kids)[0])}
    const lastN=seq[seq.length-1];const label=fmtMoves(seq.map(s=>s.m),seq[0].ply);
    const kids=Object.values(lastN.kids);
    return `<li><button class="tn ${cls(lastN.lines)}" data-l="${lastN.lines[0]}">${esc(label)}${lastN.end?` <span class="ln">${esc(op.lines[lastN.end[0]].n)}</span>`:""}</button>${kids.length?`<ul>${kids.map(node).join("")}</ul>`:""}</li>`};
  $("tree").innerHTML=`<ul>${Object.values(root.kids).map(node).join("")}</ul><p class="leads" style="font-family:var(--font)">Grün: alles fehlerfrei, orange: angefangen. Antippen übt die Variante.</p>`;
  $("tree").querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{sess=null;drill=null;forced=+b.dataset.l;target=forced;mode="train";startTrain()});
}

/* ---------------- Buttons ---------------- */
$("hintBtn").onclick=()=>{if($("hintBtn").disabled)return;hintLvl=Math.min(2,hintLvl+1);usedHelp=true;render();setStatus("turn",hintLvl===1?"Diese Figur zieht":"So geht der Zug",hintLvl===1?"Noch ein Klick auf »Hinweis« zeigt das Zielfeld.":"Spiel den markierten Zug.")};
$("showBtn").onclick=()=>{
  if($("showBtn").disabled)return;const ex=expected();const mv=findMove(shown,ex[0]);if(!mv)return;
  usedHelp=true;mistakes++;if(mode==="puzzle"){puzzleMove(mv,true);return}trainMove(mv,true,true);
  if(!done)setStatus("bad","Der Buchzug war "+de(mv.san),"Merk ihn dir. Das Buch antwortet …");
};
$("restartBtn").onclick=()=>{if(drill){startPosition(op,drill.pre,drill.info);return}if(mode==="puzzle"){startPuzzle(puz);return}startTrain()};
$("nextBtn").onclick=()=>{if(sess){if(!done){toast("Löse die Aufgabe erst oder nutze »Lösung«.");return}sessNext()}else{forced=null;drill=null;startTrain()}};

/* ---------------- Umwandlung & Züge ---------------- */
function pickPromotion(color){
  return new Promise(res=>{
    const ov=document.createElement("div");ov.className="promo";
    ov.innerHTML=`<div class="promo-box">${["q","r","b","n"].map(p=>`<button data-p="${p}" aria-label="${{q:"Dame",r:"Turm",b:"Läufer",n:"Springer"}[p]}"><span class="pp ${color}${p}"></span></button>`).join("")}</div>`;
    ov.addEventListener("pointerdown",e=>e.stopPropagation());
    ov.onclick=e=>{const b=e.target.closest("button");ov.remove();res(b?b.dataset.p:null)};
    boardEl.appendChild(ov);
  });
}
function tryMove(from,to,animate,promo){
  if(!canMoveNow())return false;
  const cands=shown.moves({verbose:true}).filter(m=>m.from===from&&m.to===to);
  if(!cands.length)return false;
  const go=mv=>{if(mode==="train")trainMove(mv,animate);else if(mode==="puzzle")puzzleMove(mv,animate);else if(mode==="engine")engineUserMove(mv,animate);else if(mode==="edit")editMove(mv,animate)};
  if(cands.length>1){const pre=promo&&cands.find(m=>m.promotion===promo);if(pre){go(pre);return true}
    lock=true;pickPromotion(cands[0].color).then(p=>{lock=false;const mv=cands.find(m=>m.promotion===p);if(mv)go(mv);else render()});return true}
  go(cands[0]);return true;
}

/* ---------------- Zeiger, Pfeile ---------------- */
const marks={a:new Set(),c:new Set()};
function renderMarks(){let s="";marks.c.forEach(q=>{const p=xy(q);s+=`<circle cx="${p.x+.5}" cy="${p.y+.5}" r=".44" fill="none" stroke="rgba(235,97,80,.85)" stroke-width=".07"/>`});marks.a.forEach(k=>{s+=arrowPath(k.slice(0,2),k.slice(2,4),"rgba(255,170,0,.8)",.16)});marksEl.innerHTML=s}
let drag=null,rStart=null;
function sqFromEvent(e){const r=boardEl.getBoundingClientRect();return sqAtXY(Math.floor((e.clientX-r.left)/r.width*8),Math.floor((e.clientY-r.top)/r.height*8))}
boardEl.addEventListener("contextmenu",e=>e.preventDefault());
boardEl.addEventListener("pointerdown",e=>{
  if(!op)return;const name=sqFromEvent(e);if(!name)return;
  if(e.button===2){rStart=name;return}
  if(e.button>0)return;
  if(marks.a.size||marks.c.size){marks.a.clear();marks.c.clear();renderMarks()}
  if(!canMoveNow())return;
  const p=shown.get(name);
  if(sel&&sel!==name&&!ownPiece(p)){const s=sel;sel=null;if(!tryMove(s,name,true))render();return}
  if(ownPiece(p)){
    e.preventDefault();sel=name;render();
    const el=pcsEl.querySelector(`.pc[data-sq="${name}"]`);
    drag={from:name,el,moved:false,x:e.clientX,y:e.clientY};
    try{boardEl.setPointerCapture(e.pointerId)}catch(_){}
  }else if(sel){sel=null;render()}
});
boardEl.addEventListener("pointermove",e=>{
  if(!drag||!drag.el)return;
  if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<4)return;
  drag.moved=true;const r=boardEl.getBoundingClientRect();const s=r.width/8;
  drag.el.classList.add("lift");drag.el.style.transform=`translate(${e.clientX-r.left-s/2}px,${e.clientY-r.top-s/2}px) scale(1.08)`;
});
function snapBack(d){if(!d.el)return render();d.el.classList.remove("lift");d.el.classList.add("anim");d.el.style.transform=tf(d.from)}
boardEl.addEventListener("pointerup",e=>{
  if(e.button===2&&rStart){const to=sqFromEvent(e);if(to){if(to===rStart){marks.c.has(to)?marks.c.delete(to):marks.c.add(to)}else{const k=rStart+to;marks.a.has(k)?marks.a.delete(k):marks.a.add(k)}renderMarks()}rStart=null;return}
  if(!drag)return;const d=drag;drag=null;if(!d.moved)return;const to=sqFromEvent(e);
  if(to&&to!==d.from){sel=null;if(!tryMove(d.from,to,false))snapBack(d)}else snapBack(d);
});
boardEl.addEventListener("pointercancel",()=>{if(drag){const d=drag;drag=null;snapBack(d)}});
window.addEventListener("resize",sizeVar);
if(window.ResizeObserver)new ResizeObserver(sizeVar).observe(boardEl);
