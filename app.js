/* Eröffnungstrainer – App-Logik */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const strip=s=>String(s).replace(/[+#?!]/g,"");
const DEP={K:"K",Q:"D",R:"T",B:"L",N:"S"};
const de=s=>String(s).replace(/^[KQRBN]/,c=>DEP[c]).replace(/=([QRBN])/,(m,c)=>"="+DEP[c]);
const DAY=86400000;
const dstr=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today=()=>dstr(new Date());
const yesterday=()=>dstr(new Date(Date.now()-DAY));
const startOfDay=t=>{const d=new Date(t);d.setHours(0,0,0,0);return d.getTime()};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const pct=x=>Math.round(x*100)+"%";

const ICON={
  book:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  no:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',
  face:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="8" r="4.2"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg>',
  cpu:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M9 2h2v2h2V2h2v2h2a2 2 0 0 1 2 2v2h2v2h-2v2h2v2h-2v2a2 2 0 0 1-2 2h-2v2h-2v-2h-2v2H9v-2H7a2 2 0 0 1-2-2v-2H3v-2h2v-2H3V8h2V6a2 2 0 0 1 2-2h2zm-1 6v8h8V8z"/></svg>',
  bookL:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 8v9.3c-1.8-1-4.2-1.4-7-1.2V6.9c2.8-.2 5.2.2 7 1.1z"/></svg>',
  crown:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 11H5zm2 13h14v2H5z"/></svg>',
  pen:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M3 17.3V21h3.7L17.8 9.9l-3.7-3.7zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"/></svg>',
  medal:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h4l1 3 1-3h4l-3 7a6 6 0 1 1-4 0zM12 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 1.5 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>'
};
const NAVICON={
  daily:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm-2 8h14v10H5zm5.6 8.4-3.3-3.3 1.4-1.4 1.9 1.9 4.6-4.6 1.4 1.4z"/></svg>',
  review:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 4a8 8 0 0 0-7.9 7H1l4 4 4-4H6.1A6 6 0 1 1 12 18a6 6 0 0 1-4.2-1.8l-1.4 1.4A8 8 0 1 0 12 4zm-1 4v5l4.3 2.5.8-1.3-3.6-2.1V8z"/></svg>',
  traps:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2 1 21h22zm-1 7h2v6h-2zm0 8h2v2h-2z"/></svg>',
  quiz:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17h-2v-2h2zm2.1-7.8-.9.9c-.7.7-1.2 1.3-1.2 2.9h-2v-.5c0-1.1.4-2.1 1.2-2.8l1.2-1.3A2 2 0 1 0 10 9H8a4 4 0 1 1 7.1 2.2z"/></svg>',
  games:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 11H5zm2 13h14v2H5z"/></svg>',
  stats:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M4 20V10h3v10zm6.5 0V4h3v16zM17 20v-7h3v7z"/></svg>',
  ana:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M3 17.3V21h3.7L17.8 9.9l-3.7-3.7zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.7 1.7 1l.4 2.6h4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg>'
};

/* ---------------- Speicher ---------------- */
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const S={
  prog:store.get("et-prog",{}),srs:store.get("et-srs",{}),rep:store.get("et-rep",[]),daily:store.get("et-daily",null),
  streak:store.get("et-streak",{last:null,n:0,best:0}),stats:store.get("et-stats",{}),
  set:Object.assign({theme:"green",pieces:"cburnett",sound:store.get("et-sound",true),ideas:true,coords:true,sf:5},store.get("et-set",{})),
  custom:store.get("et-custom",{w:[],b:[]}),ana:store.get("et-ana",null)
};
const save=k=>store.set("et-"+k,S[k]);
const st=S.stats;
st.op=st.op||{};st.hard=st.hard||{};st.quiz=st.quiz||{n:0,ok:0};st.engine=st.engine||0;st.anaRuns=st.anaRuns||0;st.games=st.games||{};st.days=st.days||{};st.badges=st.badges||[];
const P=(id,i)=>(S.prog[id]||{})[i]||0;
const lk=(id,i)=>id+"#"+i;
const pk=k=>{const j=k.lastIndexOf("#");return [k.slice(0,j),+k.slice(j+1)]};
const Pk=k=>{const [id,i]=pk(k);return P(id,i)};

/* ---------------- Daten ---------------- */
const BASE=OPENINGS.concat(OPENINGS_NEW,OPENINGS_TRAPS).map(o=>{
  const Pl=(typeof PLANS!=="undefined"&&PLANS[o.id])||{};
  const lines=o.lines.map((L,i)=>{const notes=L[3]||(Pl.notes&&Pl.notes[i])||{};
    return {n:L[0],m:L[1].split(" "),p:L[2]||(Pl.lp&&Pl.lp[i])||"",notes,trap:o.id.startsWith("fallen_")||(o.g==="x"&&(/Falle|Matt/.test(L[0])||Object.keys(notes).length>0))}});
  return Object.assign({},o,{plan:o.plan||Pl.plan||[],lines});
});
let ALL=[];
function buildAll(){
  const cust=["w","b"].filter(s=>S.custom[s]&&S.custom[s].length).map(s=>({id:"custom_"+s,g:"c",side:s,name:"Meine Varianten · "+(s==="w"?"Weiß":"Schwarz"),eco:"eigene",d:"Von dir selbst eingespielte Varianten.",plan:["Eigene Varianten – den Plan hast du selbst notiert."],lines:S.custom[s].map(l=>({n:l.n,m:l.m.slice(),p:l.p||"",notes:{},trap:false}))}));
  ALL=BASE.concat(cust);
}
buildAll();
const byId=id=>ALL.find(o=>o.id===id);
const GROUPS=[["w","Mit Weiß"],["b","Mit Schwarz"],["x","Gambits & Fallen"],["c","Meine Varianten"]];
const trapKeys=()=>{const r=[];ALL.forEach(o=>o.lines.forEach((l,i)=>{if(l.trap)r.push(lk(o.id,i))}));return r};
function consistentIn(o,h){const r=[];o.lines.forEach((l,i)=>{if(l.m.length<h.length)return;for(let k=0;k<h.length;k++)if(strip(l.m[k])!==strip(h[k]))return;r.push(i)});return r}
function bookMovesIn(o,h){const s=new Set();consistentIn(o,h).forEach(i=>{const m=o.lines[i].m[h.length];if(m)s.add(strip(m))});return [...s]}
const fmtMoves=(arr,start)=>{start=start||0;let s="";arr.forEach((m,i)=>{const p=start+i;if(p%2===0)s+=(p/2+1)+"."+de(m)+" ";else s+=(i===0?(Math.floor(p/2)+1)+"..."+de(m):de(m))+" "});return s.trim()};

/* ---------------- Toast ---------------- */
const toastEl=document.createElement("div");
toastEl.style.cssText="position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:#fff;color:#262421;padding:10px 16px;border-radius:8px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.4);z-index:100;max-width:calc(100vw - 32px);display:none";
document.body.appendChild(toastEl);let toastT=null;
function toast(msg){toastEl.textContent=msg;toastEl.style.display="block";clearTimeout(toastT);toastT=setTimeout(()=>toastEl.style.display="none",3200)}

/* ---------------- Sound ---------------- */
let ac=null;
function sfx(kind){
  if(!S.set.sound)return;
  try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();}catch(e){return}
  const t=ac.currentTime;
  const knock=(at,freq,vol,dur)=>{const len=Math.floor(ac.sampleRate*dur);const buf=ac.createBuffer(1,len,ac.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,4);const s=ac.createBufferSource();s.buffer=buf;const f=ac.createBiquadFilter();f.type="bandpass";f.frequency.value=freq;f.Q.value=1.4;const g=ac.createGain();g.gain.value=vol;s.connect(f).connect(g).connect(ac.destination);s.start(at)};
  const tone=(at,freq,dur,vol,type)=>{const o=ac.createOscillator();o.type=type||"sine";o.frequency.value=freq;const g=ac.createGain();g.gain.setValueAtTime(vol,at);g.gain.exponentialRampToValueAtTime(.001,at+dur);o.connect(g).connect(ac.destination);o.start(at);o.stop(at+dur)};
  if(kind==="move"){knock(t,1100,1.6,.07);tone(t,180,.06,.25)}
  else if(kind==="capture"){knock(t,1500,2.2,.09);knock(t+.035,900,1.4,.06);tone(t,140,.08,.3)}
  else if(kind==="check"){knock(t,1100,1.6,.07);tone(t+.02,880,.12,.12,"triangle")}
  else if(kind==="wrong"){tone(t,220,.18,.18,"square");tone(t+.09,165,.22,.15,"square")}
  else if(kind==="done"){tone(t,659,.18,.18,"triangle");tone(t+.12,880,.18,.16,"triangle");tone(t+.24,1175,.3,.14,"triangle")}
  else if(kind==="badge"){tone(t,523,.2,.15,"triangle");tone(t+.1,784,.2,.15,"triangle");tone(t+.2,1047,.4,.15,"triangle")}
}
const playSound=r=>sfx(/[+#]/.test(r.san)?"check":r.captured?"capture":"move");

/* ---------------- Wiederholung (SM-2) ---------------- */
function srsReview(k,q){
  const now=Date.now();const s=S.srs[k]||{iv:0,ef:2.5,reps:0,lapses:0};
  if(q<3){s.reps=0;s.lapses=(s.lapses||0)+1;s.iv=1}
  else{s.reps++;s.iv=s.reps===1?1:s.reps===2?3:Math.max(1,Math.round(s.iv*s.ef))}
  s.ef=Math.max(1.3,s.ef+(0.1-(5-q)*(0.08+(5-q)*0.02)));
  s.due=startOfDay(now)+s.iv*DAY;s.last=now;S.srs[k]=s;save("srs");
}
const isDue=k=>{const s=S.srs[k];return !!(s&&s.due<=startOfDay(Date.now())+DAY-1)};
function scopeOpenings(){const r=S.rep.map(byId).filter(Boolean);return r.length?r:ALL}
function dueKeys(){const r=[];ALL.forEach(o=>o.lines.forEach((l,i)=>{const k=lk(o.id,i);if(isDue(k))r.push(k)}));return r.sort((a,b)=>S.srs[a].due-S.srs[b].due)}
function newKeys(n){
  const r=[];const pools=[scopeOpenings()];
  if(S.ana&&S.ana.stats)pools.push(Object.keys(S.ana.stats).map(byId).filter(Boolean));
  pools.push(ALL.filter(o=>o.g!=="c"));
  for(const pool of pools){
    const ks=shuffle([].concat(...pool.map(o=>o.lines.map((l,i)=>lk(o.id,i))))).filter(k=>!S.srs[k]&&Pk(k)<2&&!r.includes(k));
    for(const k of ks){if(r.length>=n)break;r.push(k)}
    if(r.length>=n)break;
  }
  return r;
}
function ensureDaily(){
  if(S.daily&&S.daily.date===today())return;
  const due=dueKeys().slice(0,10);const q=due.concat(newKeys(10-due.length));
  S.daily={date:today(),queue:q,done:[]};save("daily");
}
function streakNow(){const s=S.streak;return s.last===today()||s.last===yesterday()?s.n:0}
function markDailyDone(k){
  ensureDaily();if(!S.daily.queue.includes(k)||S.daily.done.includes(k))return;
  S.daily.done.push(k);save("daily");
  if(S.daily.done.length>=S.daily.queue.length&&S.streak.last!==today()){
    S.streak.n=S.streak.last===yesterday()?S.streak.n+1:1;S.streak.last=today();S.streak.best=Math.max(S.streak.best||0,S.streak.n);save("streak");
    toast(`Tagestraining geschafft! Serie: ${S.streak.n} ${S.streak.n===1?"Tag":"Tage"}`);
  }
}

/* ---------------- Statistik & Abzeichen ---------------- */
const opStat=id=>st.op[id]||(st.op[id]={att:0,clean:0,mv:0,err:0});
const saveStats=()=>save("stats");
const cleanCount=()=>{let n=0;ALL.forEach(o=>o.lines.forEach((l,i)=>{if(P(o.id,i)===2)n++}));return n};
const totalLines=()=>ALL.reduce((a,o)=>a+o.lines.length,0);
const opClean=o=>o.lines.every((l,i)=>P(o.id,i)===2);
const BADGES=[
  {id:"first",t:"Erster Schritt",d:"Eine Variante fehlerfrei gespielt",ok:()=>cleanCount()>=1},
  {id:"c25",t:"Fleißig",d:"25 Varianten fehlerfrei",ok:()=>cleanCount()>=25},
  {id:"c100",t:"Bücherwurm",d:"100 Varianten fehlerfrei",ok:()=>cleanCount()>=100},
  {id:"op",t:"Eröffnungskenner",d:"Eine komplette Eröffnung fehlerfrei",ok:()=>ALL.some(o=>o.g!=="c"&&opClean(o))},
  {id:"gambit",t:"Gambit-Meister",d:"Alle Gambits & Fallen fehlerfrei",ok:()=>ALL.filter(o=>o.g==="x").every(opClean)},
  {id:"trap",t:"Fallensteller",d:"Alle Fallen-Varianten fehlerfrei",ok:()=>trapKeys().every(k=>Pk(k)===2)},
  {id:"rep",t:"Repertoire sitzt",d:"Alle Varianten deines Repertoires fehlerfrei",ok:()=>S.rep.length>0&&S.rep.map(byId).filter(Boolean).every(opClean)},
  {id:"s3",t:"Dranbleiben",d:"3 Tage Tagestraining in Folge",ok:()=>(S.streak.best||0)>=3},
  {id:"s7",t:"Wochenserie",d:"7 Tage in Folge",ok:()=>(S.streak.best||0)>=7},
  {id:"s30",t:"Monatsmarathon",d:"30 Tage in Folge",ok:()=>(S.streak.best||0)>=30},
  {id:"quiz",t:"Quiz-Ass",d:"50 Quizfragen richtig beantwortet",ok:()=>st.quiz.ok>=50},
  {id:"sf",t:"Maschinenkämpfer",d:"5 Partien gegen Stockfish gespielt",ok:()=>st.engine>=5},
  {id:"ana",t:"Analytiker",d:"Eigene Partien analysiert",ok:()=>st.anaRuns>=1},
  {id:"custom",t:"Theoretiker",d:"Eine eigene Variante gespeichert",ok:()=>(S.custom.w.length+S.custom.b.length)>=1},
  {id:"hist",t:"Schachhistoriker",d:"Alle Musterpartien bis zum Ende nachgespielt",ok:()=>GAMES.every(g=>st.games[g.id])}
];
function checkBadges(){
  const got=BADGES.filter(b=>b.ok()).map(b=>b.id);const fresh=got.filter(id=>!st.badges.includes(id));
  if(fresh.length){st.badges=got;saveStats();const b=BADGES.find(x=>x.id===fresh[0]);setTimeout(()=>{toast("Neues Abzeichen: "+b.t);sfx("badge")},700)}
}

/* ---------------- Zustand Brett ---------------- */
let op=null,mode="train",hist=[],fens=[],mvs=[],flags=[],view=0,shown=null,target=null,forced=null,busy=false,done=false,mistakes=0,usedHelp=false,hintLvl=0,sel=null,timer=null,lock=false,badge=null,liveStatus=null,curStatus=null,tab="ex",flipped=false,sess=null,game=null,sfStart=0,sfEval=null,lastErrKey=null;
let moveFilter=null;
const boardEl=$("board"),sqsEl=$("sqs"),pcsEl=$("pcs"),ovl=$("ovl"),ideasEl=$("ideas"),marksEl=$("marks"),badgesEl=$("badges");
const live=()=>view===hist.length;
const consistent=h=>consistentIn(op,h);
const bookMoves=h=>bookMovesIn(op,h);
const findMove=(g,san)=>g.moves({verbose:true}).find(x=>strip(x.san)===strip(san));
const userTurnShown=()=>shown&&shown.turn()===op.side;
function baseOrient(){if(mode==="replay")return "w";if(mode==="edit")return $("edSide").value;return op.side}
const orient=()=>flipped?(baseOrient()==="w"?"b":"w"):baseOrient();

function pickTarget(){
  const c=consistent(hist);if(!c.length)return null;
  if(forced!==null&&c.includes(forced))return forced;
  if(target!==null&&c.includes(target))return target;
  const fresh=c.filter(i=>P(op.id,i)<2);const due=c.filter(i=>isDue(lk(op.id,i)));const pool=due.length?due:fresh.length?fresh:c;
  return rnd(pool);
}
function resetBoard(){clearTimeout(timer);const g=new Chess();hist=[];fens=[g.fen()];mvs=[];flags=[];view=0;shown=g;target=null;done=false;mistakes=0;usedHelp=false;hintLvl=0;sel=null;busy=false;lock=false;badge=null;sfEval=null;marks.a.clear();marks.c.clear()}
function commit(mv,flag){const g=new Chess(fens[hist.length]);const r=g.move(mv.san||mv);hist.push(r.san);mvs.push(r);fens.push(g.fen());flags.push(flag);return r}

/* ---------------- Training ---------------- */
function selectOpening(o,line,keepSess){
  if(!o)return;
  if(!keepSess)sess=null;
  stopEngine();mode="train";game=null;op=o;forced=(line===undefined||line===null)?null:line;flipped=false;
  store.set("et-last",o.id);showView("train");renderList();startTrain();
}
function startTrain(){
  resetBoard();mode="train";target=pickTarget();buildSquares();renderChrome();render();
  const fl=forced!==null&&op.lines[forced]?" Variante: "+op.lines[forced].n+".":"";
  if(shown.turn()!==op.side){setStatus("turn","Das Buch eröffnet","Weiß macht gleich den ersten Zug."+fl);engineSoon()}
  else setStatus("turn","Du bist am Zug","Spiel den ersten Zug: "+op.name+"."+fl);
}
function engineSoon(){busy=true;timer=setTimeout(bookMove,600)}
function bookMove(){
  busy=false;if(mode!=="train")return;target=pickTarget();if(target===null)return;
  const g=new Chess(fens[hist.length]);const mv=findMove(g,op.lines[target].m[hist.length]);
  const wasLive=live();const r=commit(mv,"b");
  if(wasLive){view=hist.length;shown=new Chess(fens[view]);hintLvl=0;render({fwd:r});playSound(r)}else render();
  if(hist.length===op.lines[target].m.length)return finish();
  const n=consistent(hist).length;
  const s=["turn","Du bist am Zug",n>1?`${n} Varianten sind noch möglich. Welcher Buchzug folgt?`:`Variante: ${op.lines[target].n}`];
  if(wasLive)setStatus(...s);else liveStatus=s;
}
function trainMove(mv,animate,help){
  const h=hist.slice(0,view);
  if(!bookMoves(h).includes(strip(mv.san))){wrongMove(mv,animate,h);return}
  if(!live()){clearTimeout(timer);busy=false;hist.length=view;mvs.length=view;fens.length=view+1;flags.length=view;done=false;target=null;mistakes++}
  const r=commit(mv,"u");view=hist.length;shown=new Chess(fens[view]);sel=null;hintLvl=0;
  if(help)opStat(op.id).err++;else opStat(op.id).mv++;
  badge={ply:view,sq:r.to,type:"book"};
  target=pickTarget();render(animate?{fwd:r}:null);playSound(r);
  if(target!==null&&hist.length===op.lines[target].m.length){finish();return}
  setStatus("good",de(r.san)+" ist ein Buchzug","Das Buch antwortet …");engineSoon();
}
function wrongMove(mv,animate,h){
  mistakes++;lock=true;sel=null;
  const s=opStat(op.id);s.err++;
  const key=op.id+"|"+h.join(" ");const H=st.hard[key]||(st.hard[key]={id:op.id,pre:h.slice(),n:0});H.n++;H.last=Date.now();saveStats();
  const tmp=new Chess(shown.fen());const r=tmp.move(mv.san);
  const keep=shown;shown=tmp;badge={ply:-1,sq:r.to,type:"no"};
  render(animate?{fwd:r}:null,{bad:[r.from,r.to]});sfx("wrong");
  setStatus("bad",de(r.san)+" ist nicht im Buch",mistakes>=2&&hintLvl===0?"Tipp: Mit »Hinweis« siehst du, welche Figur ziehen sollte.":"Versuch es noch einmal.");
  setTimeout(()=>{shown=keep;badge=null;lock=false;render({back:r});boardEl.classList.remove("shake");void boardEl.offsetWidth;boardEl.classList.add("shake")},750);
}
function finish(){
  done=true;const i=target;const k=lk(op.id,i);const clean=mistakes===0&&!usedHelp;
  S.prog[op.id]=S.prog[op.id]||{};S.prog[op.id][i]=Math.max(P(op.id,i),clean?2:1);save("prog");
  srsReview(k,clean?5:mistakes<=1?3:1);
  const s=opStat(op.id);s.att++;if(clean)s.clean++;st.days[today()]=(st.days[today()]||0)+1;saveStats();
  if(badge&&badge.ply===hist.length)badge.type="ok";
  if(sess){sess.res.push({k,clean});if(sess.type==="daily")markDailyDone(k)}else markDailyDone(k);
  const nxt=S.srs[k]?Math.round((S.srs[k].due-startOfDay(Date.now()))/DAY):1;
  setStatus("done","Variante geschafft: "+op.lines[i].n,(clean?"Fehlerfrei gespielt.":`Mit ${mistakes} ${mistakes===1?"Fehler":"Fehlern"} – sie kommt bald wieder.`)+` Nächste Wiederholung in ${nxt} ${nxt===1?"Tag":"Tagen"}.`);
  setTimeout(()=>sfx("done"),180);
  if(forced===i&&!sess)forced=null;
  render();renderChrome();renderList();renderNav();checkBadges();
}

/* ---------------- Sitzungen: Tagestraining, Wiederholung, Fallen, Plan ---------------- */
function startSession(type,keys,title){
  let q=keys||[];
  if(type==="daily"){ensureDaily();q=S.daily.queue.filter(k=>!S.daily.done.includes(k));title="Tagestraining";
    if(!q.length){showView("train");toast("Das heutige Training ist schon erledigt – hier sind fünf Extra-Varianten.");q=dueKeys().concat(newKeys(5)).slice(0,5);title="Extra-Training"}}
  if(type==="review"){q=dueKeys();title="Wiederholung";if(!q.length){q=newKeys(5);title="Neue Varianten";toast("Nichts fällig – du lernst fünf neue Varianten.")}}
  if(type==="traps"){q=shuffle(trapKeys());title="Fallen-Training"}
  q=q.filter(k=>{const [id,i]=pk(k);const o=byId(id);return o&&o.lines[i]});
  if(!q.length){toast("Keine Varianten für dieses Training gefunden.");return}
  sess={type,title:title||"Training",queue:q,idx:0,res:[]};runSessionItem();
}
function runSessionItem(){const [id,i]=pk(sess.queue[sess.idx]);selectOpening(byId(id),i,true)}
function sessNext(){
  sess.idx++;
  if(sess.idx>=sess.queue.length){
    const ok=sess.res.filter(r=>r.clean).length,n=sess.res.length,t=sess.title;sess=null;renderChrome();
    setStatus("done",t+" abgeschlossen",`${ok} von ${n} Varianten fehlerfrei. ${dueKeys().length?dueKeys().length+" Varianten sind noch fällig.":"Für heute ist alles wiederholt."}`);
    renderNav();return;
  }
  runSessionItem();
}
$("sessEnd").onclick=()=>{sess=null;renderChrome();setStatus("turn","Training beendet","Du kannst jederzeit weitermachen.")};

/* ---------------- Stockfish ---------------- */
const SF_URLS=["https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js","https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js"];
let sfW=null,sfLoading=null,sfToken=0;
function loadSF(){
  if(sfW)return Promise.resolve(sfW);if(sfLoading)return sfLoading;
  sfLoading=(async()=>{let last;
    for(const u of SF_URLS){try{
      const r=await fetch(u);if(!r.ok)throw new Error("HTTP "+r.status);const txt=await r.text();
      const w=new Worker(URL.createObjectURL(new Blob([txt],{type:"application/javascript"})));
      await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error("Zeitüberschreitung")),20000);w.onmessage=e=>{if(String(e.data).indexOf("uciok")>=0){clearTimeout(t);res()}};w.onerror=e=>{clearTimeout(t);rej(e)};w.postMessage("uci")});
      sfW=w;return w}catch(e){last=e}}
    sfLoading=null;throw last||new Error("Stockfish nicht erreichbar")})();
  return sfLoading;
}
function sfBest(fen){return new Promise(res=>{let score=null;sfW.onmessage=e=>{const s=String(e.data);const m=s.match(/score (cp|mate) (-?\d+)/);if(m)score={t:m[1],v:+m[2]};if(s.indexOf("bestmove")===0)res({best:s.split(" ")[1],score})};
  sfW.postMessage("ucinewgame");sfW.postMessage("setoption name Skill Level value "+S.set.sf);sfW.postMessage("position fen "+fen);sfW.postMessage("go movetime "+(250+S.set.sf*45))})}
async function startEngine(){
  if(!op)return;mode="engine";done=false;sel=null;view=hist.length;shown=new Chess(fens[view]);sfStart=hist.length;sfEval=null;badge=null;
  renderChrome();render();setStatus("sf","Stockfish wird geladen …","Beim ersten Mal kann das ein paar Sekunden dauern.");
  const tok=++sfToken;
  try{await loadSF()}catch(e){if(tok!==sfToken)return;mode="train";done=true;renderChrome();render();setStatus("bad","Stockfish konnte nicht geladen werden","Prüfe die Internetverbindung und versuch es erneut.");return}
  if(tok!==sfToken||mode!=="engine")return;
  if(gameOverCheck())return;
  if(shown.turn()!==op.side)sfThink();else setStatus("sf","Du bist am Zug",`Spiel die Stellung gegen Stockfish (Stufe ${S.set.sf}) weiter und setze den Plan um.`);
}
async function sfThink(){
  const tok=sfToken;busy=true;renderBars();setStatus("sf","Stockfish denkt …","");
  const r=await sfBest(fens[hist.length]);
  if(tok!==sfToken||mode!=="engine")return;busy=false;
  if(!r.best||r.best==="(none)"){gameOverCheck();return}
  const g=new Chess(fens[hist.length]);const mv=g.moves({verbose:true}).find(m=>m.from===r.best.slice(0,2)&&m.to===r.best.slice(2,4)&&(!m.promotion||m.promotion===(r.best[4]||"q")));
  if(!mv)return;
  const sfColor=g.turn();
  if(r.score){let v=r.score.v;if(sfColor==="b")v=-v;sfEval=r.score.t==="mate"?(v>0?"Matt in "+Math.abs(v)+" für Weiß":"Matt in "+Math.abs(v)+" für Schwarz"):(v===0?"0.0":(v>0?"+":"")+(v/100).toFixed(1))}
  const wasLive=live();const res=commit(mv,"e");
  if(wasLive){view=hist.length;shown=new Chess(fens[view]);render({fwd:res});playSound(res)}else render();
  if(gameOverCheck())return;
  setStatus("sf","Du bist am Zug",`Stockfish spielte ${de(res.san)}.`);
}
function engineUserMove(mv,animate){
  const r=commit(mv,"p");view=hist.length;shown=new Chess(fens[view]);sel=null;render(animate?{fwd:r}:null);playSound(r);
  if(gameOverCheck())return;sfThink();
}
function gameOverCheck(){
  const g=new Chess(fens[hist.length]);
  if(!g.game_over())return false;
  let t,s;
  if(g.in_checkmate()){const winner=g.turn()==="w"?"b":"w";t=winner===op.side?"Matt – du hast gewonnen!":"Matt – Stockfish gewinnt";s=winner===op.side?"Stark gespielt.":"Schau dir mit ← an, wo es kippte."}
  else{t="Remis";s=g.in_stalemate()?"Patt.":g.insufficient_material()?"Zu wenig Material.":"Stellungswiederholung oder 50-Züge-Regel."}
  endEngine();setStatus("done",t,s);return true;
}
function endEngine(){if(mode!=="engine")return;if(hist.length-sfStart>=8){st.engine++;saveStats();checkBadges()}sfToken++;busy=false;mode="train";done=true;renderChrome();render()}
function stopEngine(){if(mode==="engine"){sfToken++;busy=false;if(sfW)sfW.postMessage("stop")}}
$("sfBtn").onclick=()=>startEngine();
$("sfStop").onclick=()=>{endEngine();setStatus("done","Partie beendet","Du kannst die Züge mit ← und → nachspielen.")};
$("sfUndo").onclick=()=>{
  if(mode!=="engine"||busy)return;let n=0;
  while(hist.length>sfStart&&n<2){hist.pop();mvs.pop();fens.pop();flags.pop();n++;if(new Chess(fens[hist.length]).turn()===op.side)break}
  view=hist.length;shown=new Chess(fens[view]);render();setStatus("sf","Zug zurückgenommen","Du bist am Zug.");
};
$("againBtn").onclick=()=>{const i=target;forced=i;startTrain()};

/* ---------------- Musterpartien ---------------- */
function openGame(gm){
  stopEngine();sess=null;mode="replay";game=gm;op=byId(gm.ops[0])||ALL[0];flipped=false;forced=null;
  resetBoard();mode="replay";
  gm.moves.split(" ").forEach(m=>{const g=new Chess(fens[hist.length]);const mv=findMove(g,m);commit(mv,"g")});
  view=0;shown=new Chess(fens[0]);done=true;
  showView("train");buildSquares();renderChrome();render();
  setStatus("view",gm.title,`${gm.players}, ${gm.year}. Spiel die Partie mit → oder den Pfeiltasten nach.`);
}

/* ---------------- Eigene Variante ---------------- */
function openEditor(){
  stopEngine();sess=null;mode="edit";game=null;flipped=false;
  op={id:"__edit",g:"c",side:$("edSide").value,name:"Eigene Variante",eco:"Editor",d:"Spiel beide Seiten und speichere die Folge als eigene Trainingsvariante.",plan:[],lines:[]};
  resetBoard();mode="edit";showView("train");buildSquares();renderChrome();render();
  setStatus("turn","Spiel eine Zugfolge ein","Ziehe für beide Seiten. Mit ← kannst du zurück und einen anderen Zug wählen.");
}
function editMove(mv,animate){
  if(!live()){hist.length=view;mvs.length=view;fens.length=view+1;flags.length=view}
  const r=commit(mv,"p");view=hist.length;shown=new Chess(fens[view]);sel=null;render(animate?{fwd:r}:null);playSound(r);
  $("edCount").value=hist.length;setStatus("turn",`${hist.length} Halbzüge`,fmtMoves(hist.slice(-6),hist.length-Math.min(6,hist.length)));
}
$("edSide").onchange=()=>{if(mode==="edit"){op.side=$("edSide").value;buildSquares();render()}};
$("edUndo").onclick=()=>{if(mode!=="edit"||!hist.length)return;hist.pop();mvs.pop();fens.pop();flags.pop();view=hist.length;shown=new Chess(fens[view]);$("edCount").value=hist.length;render()};
$("edClear").onclick=()=>{if(mode!=="edit")return;resetBoard();mode="edit";$("edCount").value=0;render()};
$("edSave").onclick=()=>{
  if(mode!=="edit")return;
  if(hist.length<2){setStatus("bad","Zu kurz","Spiel mindestens zwei Halbzüge ein.");return}
  const side=$("edSide").value;const name=$("edName").value.trim()||("Variante "+(S.custom[side].length+1));
  S.custom[side].push({n:name,m:hist.slice(),p:$("edPlan").value.trim()});save("custom");buildAll();renderList();checkBadges();
  $("edName").value="";$("edPlan").value="";
  setStatus("done","Gespeichert: "+name,`Du findest sie unter „Meine Varianten · ${side==="w"?"Weiß":"Schwarz"}“ in der Liste.`);
};

/* ---------------- Navigation in Zügen ---------------- */
function setView(v){
  v=Math.max(0,Math.min(hist.length,v));if(v===view||lock)return;
  const wasLive=live();const old=view;view=v;shown=new Chess(fens[view]);sel=null;
  let anim=null;
  if(v===old+1){anim={fwd:mvs[old]};playSound(mvs[old])}else if(v===old-1){anim={back:mvs[v]};sfx("move")}
  render(anim);
  if(mode==="replay"){
    if(view===hist.length&&!st.games[game.id]){st.games[game.id]=true;saveStats();checkBadges()}
    setStatus("view",game.title,view?`Zug ${Math.ceil(view/2)} von ${Math.ceil(hist.length/2)}`:`${game.players}, ${game.year}.`,true);return;
  }
  if(mode==="edit"){$("edCount").value=hist.length;return}
  if(live()){if(liveStatus)setStatus(...liveStatus,true)}
  else{
    if(wasLive)liveStatus=curStatus;
    setStatus("view",`Du siehst Zug ${Math.ceil(view/2)||"0"}${view%2===1?" (Weiß)":view?" (Schwarz)":""}`,
      mode==="train"&&userTurnShown()?"Spiel von hier einen anderen Buchzug oder blättere mit → zurück.":"Blättere mit → zurück zur aktuellen Stellung.",true);
  }
}
$("navFirst").onclick=()=>setView(0);$("navPrev").onclick=()=>setView(view-1);$("navNext").onclick=()=>setView(view+1);$("navLast").onclick=()=>setView(hist.length);
$("flipBtn").onclick=()=>{flipped=!flipped;buildSquares();render()};
document.addEventListener("keydown",e=>{
  if($("v-train").hidden)return;
  if(e.target.closest&&e.target.closest("input,select,textarea"))return;
  const k={ArrowLeft:()=>setView(view-1),ArrowRight:()=>setView(view+1),ArrowUp:()=>setView(0),ArrowDown:()=>setView(hist.length),Home:()=>setView(0),End:()=>setView(hist.length),f:()=>$("flipBtn").click()}[e.key];
  if(k){e.preventDefault();k()}
});

/* ---------------- Zugerklärung ---------------- */
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
    if(p==="n"){
      out.push(from[1]===back?"Entwickelt den Springer.":"Der Springer sucht ein besseres Feld.");
      const cen=["d4","e4","d5","e5"].filter(s=>{const dx=Math.abs(fi(s)-fi(to)),dy=Math.abs(ri(s)-ri(to));return (dx===1&&dy===2)||(dx===2&&dy===1)});
      if(cen.length)out.push(`Er kontrolliert ${cen.join(" und ")}.`);
    }
    if(p==="b"){
      if(["g2","b2","g7","b7"].indexOf(to)>=0&&from[1]===back)out.push("Fianchetto: Der Läufer wirkt über die lange Diagonale.");
      else if(from[1]===back)out.push(`Entwickelt den Läufer nach ${to}.`);else out.push(`Der Läufer zieht nach ${to}.`);
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
    try{
      const parts=g.fen().split(" ");parts[1]=mv.color;parts[3]="-";const t=new Chess();
      if(t.load(parts.join(" "))){
        const att=t.moves({square:to,verbose:true}).filter(m=>m.captured&&m.captured!=="p"&&m.captured!=="k"&&m.to!==pinned);
        const seen={};const uniq=att.filter(m=>seen[m.to]?false:(seen[m.to]=1));
        if(uniq.length&&mv.san.indexOf("#")<0){out.push(`Greift ${uniq.slice(0,2).map(m=>`${ACC[m.captured]} auf ${m.to}`).join(" und ")} an.`);uniq.slice(0,2).forEach(m=>arrows.push([to,m.to]))}
      }
    }catch(e){}
  }
  if(mv.san.indexOf("#")>=0)out.push("Schachmatt!");else if(mv.san.indexOf("+")>=0)out.push("Mit Schach.");
  return {text:out.join(" "),arrows};
}
function lineNote(h,ply){if(!op||!op.lines)return "";for(const i of consistent(h)){const n=op.lines[i].notes;if(n&&n[ply])return n[ply]}return ""}
function renderExplain(){
  const el=$("tabEx");const h=hist.slice(0,view);let html="";
  if(view>0){
    const mv=mvs[view-1];const num=Math.ceil(view/2)+(view%2===1?".":"...");
    const note=mode==="train"?lineNote(h,view-1):"";
    const who={u:"dein Buchzug",b:"Buch",e:"Stockfish",p:mode==="edit"?"Editor":"dein Zug",g:"Partie"}[flags[view-1]]||"";
    const names=mode==="train"?consistent(h).map(i=>op.lines[i].n):[];
    html+=`<div class="excard"><div class="exh"><span>Zug ${view} von ${hist.length} · ${who}</span></div>
      <div class="exmove">${esc(num+" "+de(mv.san))}<span class="who">${mv.color==="w"?"Weiß":"Schwarz"}</span></div>
      <p>${esc(explain(fens[view-1],mv,view>1?mvs[view-2]:null).text)}</p>${note?`<p class="note">${esc(note)}</p>`:""}
      ${names.length?`<p class="leads">${names.length===1?"Variante":"Mögliche Varianten"}: ${esc(names.slice(0,4).join(" · "))}${names.length>4?" · +"+(names.length-4)+" weitere":""}</p>`:""}</div>`;
  }else{
    const txt=mode==="replay"?"Spiel die Partie mit → nach. Zu jedem Zug erscheint hier eine Erklärung.":mode==="edit"?"Spiel eine Zugfolge für beide Seiten ein.":(op.side==="w"?"Du spielst Weiß und machst den ersten Zug.":"Du spielst Schwarz. Das Buch beginnt mit dem ersten weißen Zug.")+" Zu jedem Zug erscheint hier eine Erklärung.";
    html+=`<div class="excard"><div class="exh"><span>Startstellung</span></div><p>${esc(txt)}</p></div>`;
  }
  if(mode==="replay"&&game){html+=`<div class="excard"><div class="exh"><span>${esc(game.title)}</span></div><p>${esc(game.d)}</p></div>`}
  if(mode==="engine"||mode==="train"){
    const hh=mode==="engine"?hist.slice(0,sfStart):h;
    const c=consistent(hh);
    if(c.length&&op.lines.length){
      const show=(done||mode==="engine")&&target!==null&&c.includes(target)?[target]:c.slice(0,4);
      html+=`<div class="excard"><div class="exh"><span>${show.length===1?"Plan nach der Eröffnung":"Pläne der möglichen Varianten"}</span></div><div class="lp">${show.map(i=>`<div><b>${esc(op.lines[i].n)}</b><span>${esc(op.lines[i].p||"")}</span></div>`).join("")}${c.length>show.length&&!done?`<div><span>und ${c.length-show.length} weitere Varianten</span></div>`:""}</div></div>`;
    }
    if(op.plan&&op.plan.length)html+=`<div class="excard"><div class="exh"><span>Strategischer Plan · ${esc(op.name)}</span></div><ul>${op.plan.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>`;
    const gs=GAMES.filter(g=>g.ops.indexOf(op.id)>=0);
    if(gs.length)html+=`<div class="excard"><div class="exh"><span>Musterpartie</span></div>${gs.map(g=>`<button class="gamebtn" data-game="${g.id}"><span class="avatar bookav" style="width:30px;height:30px">${ICON.crown}</span><span><b>${esc(g.title)}</b><small>${esc(g.players)} · ${esc(g.year)}</small></span></button>`).join("")}</div>`;
  }
  el.innerHTML=html;
  el.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>openGame(GAMES.find(g=>g.id===b.dataset.game)));
}
function setTab(t){tab=t;$("tabExBtn").setAttribute("aria-selected",String(t==="ex"));$("tabVarBtn").setAttribute("aria-selected",String(t==="var"));$("tabEx").hidden=t!=="ex";$("tabVar").hidden=t!=="var"}
$("tabExBtn").onclick=()=>setTab("ex");$("tabVarBtn").onclick=()=>setTab("var");

/* ---------------- Rendering Brett ---------------- */
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
function hintMove(){if(mode!=="train"||!hintLvl||lock||busy||!userTurnShown())return null;const b=bookMoves(hist.slice(0,view));return b.length?findMove(shown,b[0]):null}
function arrowPath(from,to,color,w){
  const a=xy(from),b=xy(to);const ax=a.x+.5,ay=a.y+.5,bx=b.x+.5,by=b.y+.5;
  const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy);if(!L)return "";const ux=dx/L,uy=dy/L,hl=.42,hw=w*1.5,sw=w;
  const ex=bx-ux*hl,ey=by-uy*hl,px=-uy,py=ux,sx=ax+ux*.28,sy=ay+uy*.28;
  return `<path d="M${sx-px*sw/2} ${sy-py*sw/2} L${ex-px*sw/2} ${ey-py*sw/2} L${ex-px*hw} ${ey-py*hw} L${bx} ${by} L${ex+px*hw} ${ey+py*hw} L${ex+px*sw/2} ${ey+py*sw/2} L${sx+px*sw/2} ${sy+py*sw/2}Z" fill="${color}"/>`;
}
function canMoveNow(){
  if(lock||busy)return false;
  if(mode==="train")return !(done&&live())&&userTurnShown();
  if(mode==="engine")return live()&&shown.turn()===op.side;
  if(mode==="edit")return true;
  return false;
}
const ownPiece=p=>p&&(mode==="edit"?p.color===shown.turn():p.color===op.side);
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
  let ideas="";
  if(S.set.ideas&&view>0&&!extra.bad&&!(hm&&hintLvl===2)){try{explain(fens[view-1],mvs[view-1]).arrows.forEach(([a,b])=>ideas+=arrowPath(a,b,"rgba(70,140,235,.62)",.13))}catch(e){}}
  ideasEl.innerHTML=ideas;
  renderMarks();
  badgesEl.innerHTML="";
  if(badge&&(badge.ply===view||badge.ply===-1)){const p=xy(badge.sq);const b=document.createElement("div");b.className="badge "+badge.type;b.style.left=((p.x+1)*12.5)+"%";b.style.top=(p.y*12.5)+"%";b.innerHTML=ICON[badge.type];badgesEl.appendChild(b)}
  renderMoves();renderVars();renderBars();renderExplain();
  const canAct=mode==="train"&&!done&&!busy&&!lock&&userTurnShown();
  $("hintBtn").disabled=$("showBtn").disabled=!canAct;
  $("navFirst").disabled=$("navPrev").disabled=view===0;
  $("navNext").disabled=$("navLast").disabled=live();
  $("actsDone").hidden=!(mode==="train"&&done&&target!==null&&op.lines&&op.lines.length);
  $("actsTrain").hidden=mode!=="train"||($("actsDone").hidden===false);
  $("sfUndo").disabled=busy||hist.length<=sfStart;
}
function renderChrome(){
  const inSess=!!sess;$("sessBar").hidden=!inSess;
  if(inSess){$("sessTitle").textContent=sess.title;$("sessCount").textContent=`${Math.min(sess.idx+1,sess.queue.length)}/${sess.queue.length}`;$("sessProg").style.width=(sess.idx/sess.queue.length*100)+"%"}
  $("actsSf").hidden=mode!=="engine";$("editor").hidden=mode!=="edit";
  $("nextBtn").hidden=!(mode==="train");
  $("nextBtn").textContent=sess?(sess.idx+1>=sess.queue.length?"Training abschließen":`Weiter (${sess.idx+2}/${sess.queue.length})`):"Nächste Variante";
  const eco=$("eco"),title=$("title"),desc=$("desc");
  if(mode==="replay"&&game){eco.textContent="Musterpartie · "+game.year;title.textContent=game.title;desc.textContent=game.players;$("phIcon").innerHTML=ICON.crown;$("menuName").textContent=game.title}
  else if(mode==="edit"){eco.textContent="Editor";title.textContent="Eigene Variante";desc.textContent=op.d;$("phIcon").innerHTML=ICON.pen;$("menuName").textContent="Eigene Variante"}
  else{eco.textContent=op.eco+" · Du spielst "+(op.side==="w"?"Weiß":"Schwarz")+(mode==="engine"?" · gegen Stockfish":"");title.textContent=op.name;desc.textContent=op.d;$("phIcon").innerHTML=ICON.bookL;$("menuName").textContent=op.name}
  const av=$("oppAv");
  if(mode==="engine"){av.className="avatar sfav";av.innerHTML=ICON.cpu;$("oppName").textContent="Stockfish · Stufe "+S.set.sf}
  else if(mode==="replay"&&game){av.className="avatar bookav";av.innerHTML=ICON.crown;const pl=game.players.split(" – ");$("oppName").textContent=orient()==="w"?pl[1]:pl[0]}
  else if(mode==="edit"){av.className="avatar bookav";av.innerHTML=ICON.pen;$("oppName").textContent="Gegenseite"}
  else{av.className="avatar bookav";av.innerHTML=ICON.bookL;$("oppName").textContent="Eröffnungsbuch"}
  if(mode==="replay"&&game){const pl=game.players.split(" – ");$("youName").textContent=orient()==="w"?pl[0]:pl[1];$("youTag").textContent=""; $("oppTag").textContent=""}
  else{$("youName").textContent="Du";const ys=mode==="edit"?$("edSide").value:op.side;$("youTag").textContent=ys==="w"?"(Weiß)":"(Schwarz)";$("oppTag").textContent=ys==="w"?"(Schwarz)":"(Weiß)"}
  $("footInfo").textContent=dueKeys().length?dueKeys().length+" fällig":"";
}
function renderBars(){
  const tm=shown.turn();const mySide=mode==="edit"?$("edSide").value:op.side;
  const active=live()&&!done&&mode!=="replay";
  const yourTurn=active&&(mode==="edit"?true:tm===op.side);const oppTurn=active&&!yourTurn;
  $("youClock").classList.toggle("on",!!yourTurn);$("oppClock").classList.toggle("on",!!oppTurn);
  if(mode==="replay"){$("youClock").textContent="Partie";$("oppClock").textContent="Partie";return}
  if(mode==="edit"){$("youClock").textContent=(tm==="w"?"Weiß":"Schwarz")+" zieht";$("oppClock").textContent="Editor";return}
  $("youClock").textContent=done?"Fertig":yourTurn?"Am Zug":live()?"Wartet":"Ansicht";
  $("oppClock").textContent=mode==="engine"?(busy?"Denkt …":"Stockfish"):oppTurn?"Denkt …":"Buch";
  void mySide;
}
function renderMoves(){
  const m=$("moves");m.innerHTML="";
  if(!hist.length){m.innerHTML='<div class="empty">Noch keine Züge gespielt.</div>';return}
  for(let i=0;i<hist.length;i+=2){
    const row=document.createElement("div");row.className="mrow";
    const n=document.createElement("span");n.className="n";n.textContent=(i/2+1)+".";row.appendChild(n);
    [i,i+1].forEach(k=>{
      if(k>=hist.length){row.appendChild(document.createElement("span"));return}
      const b=document.createElement("button");b.className="mv"+(k===view-1?" cur":"");
      b.innerHTML=(flags[k]==="u"?`<span class="tag">${ICON.book}</span>`:flags[k]==="e"?`<span class="tag sf">${ICON.cpu.replace(/width="22" height="22"/,'width="9" height="9"')}</span>`:"")+"<span></span>";
      b.lastChild.textContent=de(hist[k]);b.onclick=()=>setView(k+1);row.appendChild(b);
    });
    m.appendChild(row);
  }
  const cur=m.querySelector(".mv.cur");if(cur){const r=cur.offsetTop;if(r<m.scrollTop||r>m.scrollTop+m.clientHeight-30)m.scrollTop=r-m.clientHeight/2}
}
function renderVars(){
  const v=$("vars");v.innerHTML="";
  if(!op.lines||!op.lines.length){v.innerHTML='<div class="empty">Keine Varianten.</div>';$("varProg").textContent="";return}
  const c=new Set(consistent(hist));
  op.lines.forEach((l,i)=>{
    const row=document.createElement("div");row.className="varrow";
    const b=document.createElement("button");b.className="var"+(hist.length&&!c.has(i)&&mode==="train"?" out":"");b.setAttribute("aria-pressed",forced===i?"true":"false");
    const s=P(op.id,i);const due=isDue(lk(op.id,i));
    b.innerHTML=`<span class="mk ${s===2?"clean":s===1?"seen":""}">${s?ICON.ok:""}</span><span class="vn"></span>${due?'<span class="due">fällig</span>':""}<span class="vp">${Math.ceil(l.m.length/2)} Züge</span>`;
    b.querySelector(".vn").textContent=l.n;
    b.onclick=()=>{sess=null;forced=i;target=i;mode="train";startTrain()};
    row.appendChild(b);
    if(op.g==="c"){const d=document.createElement("button");d.className="vdel";d.textContent="Löschen";d.onclick=()=>{if(d.dataset.sure){const side=op.side;S.custom[side].splice(i,1);save("custom");buildAll();renderList();const o=byId("custom_"+side);if(o)selectOpening(o);else selectOpening(ALL[0])}else{d.dataset.sure="1";d.textContent="Sicher?"}};row.appendChild(d)}
    v.appendChild(row);
  });
  const cl=op.lines.filter((l,i)=>P(op.id,i)===2).length;$("varProg").textContent=`${cl}/${op.lines.length}`;
}

/* ---------------- Buttons ---------------- */
$("hintBtn").onclick=()=>{if($("hintBtn").disabled)return;hintLvl=Math.min(2,hintLvl+1);usedHelp=true;render();setStatus("turn",hintLvl===1?"Diese Figur zieht":"So geht der Buchzug",hintLvl===1?"Noch ein Klick auf »Hinweis« zeigt das Zielfeld.":"Spiel den markierten Zug.")};
$("showBtn").onclick=()=>{
  if($("showBtn").disabled)return;const hm=bookMoves(hist.slice(0,view));const mv=findMove(shown,hm[0]);if(!mv)return;
  usedHelp=true;mistakes++;trainMove(mv,true,true);
  if(!done)setStatus("bad","Der Buchzug war "+de(mv.san),"Merk ihn dir. Das Buch antwortet …");
};
$("restartBtn").onclick=()=>startTrain();
$("nextBtn").onclick=()=>{if(sess){if(!done){toast("Spiel die Variante erst zu Ende oder nutze »Lösung«.");return}sessNext()}else{forced=null;startTrain()}};

/* ---------------- Umwandlung ---------------- */
function pickPromotion(color){
  return new Promise(res=>{
    const ov=document.createElement("div");ov.className="promo";
    ov.innerHTML=`<div class="promo-box">${["q","r","b","n"].map(p=>`<button data-p="${p}" aria-label="${{q:"Dame",r:"Turm",b:"Läufer",n:"Springer"}[p]}"><span class="pp ${color}${p}"></span></button>`).join("")}</div>`;
    ov.addEventListener("pointerdown",e=>e.stopPropagation());
    ov.onclick=e=>{const b=e.target.closest("button");ov.remove();res(b?b.dataset.p:null)};
    boardEl.appendChild(ov);
  });
}
function tryMove(from,to,animate){
  if(!canMoveNow())return false;
  const cands=shown.moves({verbose:true}).filter(m=>m.from===from&&m.to===to);
  if(!cands.length)return false;
  const go=mv=>{if(mode==="train")trainMove(mv,animate);else if(mode==="engine")engineUserMove(mv,animate);else if(mode==="edit")editMove(mv,animate)};
  if(cands.length>1){lock=true;pickPromotion(cands[0].color).then(p=>{lock=false;const mv=cands.find(m=>m.promotion===p);if(mv)go(mv);else render()});return true}
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

/* ---------------- Ansichten & Seitenleiste ---------------- */
let curView="train";
function showView(v){
  curView=v;document.querySelectorAll(".view").forEach(el=>el.hidden=el.id!=="v-"+v);
  if(v!=="train")stopEngine();
  if(v==="stats")renderStats();if(v==="games")renderGames();if(v==="settings")renderSettings();if(v==="ana")renderAnaPage();if(v==="quiz")renderQuizIntro();
  renderNav();closeMenu();if(v!=="train")window.scrollTo(0,0);else sizeVar();
}
const NAV=[
  {id:"daily",t:"Tagestraining",ic:"g",act:()=>startSession("daily")},
  {id:"review",t:"Wiederholen",ic:"o",act:()=>startSession("review")},
  {id:"traps",t:"Fallen-Training",ic:"r",act:()=>startSession("traps")},
  {id:"quiz",t:"Quiz",ic:"p",act:()=>showView("quiz")},
  {id:"games",t:"Musterpartien",ic:"k",act:()=>showView("games")},
  {id:"ana",t:"Partien-Analyse",ic:"b",act:()=>showView("ana")},
  {id:"stats",t:"Statistik & Abzeichen",ic:"",act:()=>showView("stats")},
  {id:"edit",t:"Eigene Variante",ic:"",act:()=>openEditor()},
  {id:"settings",t:"Einstellungen",ic:"",act:()=>showView("settings")}
];
function renderNav(){
  const nm=$("navMain");ensureDaily();
  const dd=S.daily.done.length,dq=S.daily.queue.length,due=dueKeys().length,sk=streakNow();
  const cnt={daily:dd>=dq?`<span class="cnt okc">${sk?sk+" Tage ✓":"✓"}</span>`:`<span class="cnt">${dd}/${dq}</span>`,review:due?`<span class="cnt hot">${due}</span>`:`<span class="cnt">0</span>`,traps:`<span class="cnt">${trapKeys().length}</span>`,games:`<span class="cnt">${GAMES.length}</span>`,stats:`<span class="cnt">${st.badges.length}/${BADGES.length}</span>`};
  const isCur=n=>(n.id==="daily"&&sess&&sess.type==="daily"&&curView==="train")||(n.id==="review"&&sess&&sess.type==="review"&&curView==="train")||(n.id==="traps"&&sess&&sess.type==="traps"&&curView==="train")||(n.id==="edit"&&mode==="edit"&&curView==="train")||(["quiz","games","ana","stats","settings"].indexOf(n.id)>=0&&curView===n.id);
  nm.innerHTML=NAV.map(n=>`<button class="ni" data-nav="${n.id}" aria-current="${isCur(n)}"><span class="ic ${n.ic}">${NAVICON[n.id]}</span><span class="lbl">${n.t}</span>${cnt[n.id]||""}</button>`).join("");
  nm.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>NAV.find(n=>n.id===b.dataset.nav).act());
}
function weakInfo(id){if(!S.ana||!S.ana.stats)return null;const s=S.ana.stats[id];if(!s||s.n<3)return null;return (s.w+s.d/2)/s.n<0.45?s:null}
function parseMoveQuery(q){
  const toks=q.replace(/\d+\s*\.(\s*\.\.)?/g," ").replace(/0-0-0/g,"O-O-O").replace(/0-0/g,"O-O").split(/[\s,;]+/).filter(Boolean).map(t=>t.replace(/^([SLTD])/,c=>({S:"N",L:"B",T:"R",D:"Q"}[c])));
  if(!toks.length||!toks.every(t=>/^(O-O(-O)?|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](=[QRBNDTLS])?)[+#]?$/.test(t)))return null;
  const g=new Chess();const out=[];
  for(const t of toks){const m=findMove(g,t.replace(/=([DTLS])/,(x,c)=>"="+{D:"Q",T:"R",L:"B",S:"N"}[c]));if(!m)return {moves:out,bad:t};g.move(m.san);out.push(m.san)}
  return {moves:out};
}
function renderList(){
  const q=$("search").value.trim();const list=$("list");list.innerHTML="";
  const repOnly=$("repOnly").getAttribute("aria-pressed")==="true";
  const mq=q?parseMoveQuery(q):null;moveFilter=null;
  const info=$("searchInfo");info.hidden=true;
  if(mq&&mq.moves.length){
    moveFilter={};ALL.forEach(o=>{const c=consistentIn(o,mq.moves);if(c.length)moveFilter[o.id]=c});
    info.hidden=false;info.textContent=`${fmtMoves(mq.moves)} – ${Object.keys(moveFilter).length} Eröffnungen${mq.bad?` („${mq.bad}“ ist hier nicht möglich)`:""}`;
  }
  const ql=q.toLowerCase();
  GROUPS.forEach(([g,label])=>{
    const items=ALL.filter(o=>o.g===g&&(!repOnly||S.rep.indexOf(o.id)>=0)&&(moveFilter?!!moveFilter[o.id]:(!q||(o.name+" "+o.eco).toLowerCase().indexOf(ql)>=0||o.lines.some(l=>l.n.toLowerCase().indexOf(ql)>=0))));
    if(!items.length)return;
    const h=document.createElement("div");h.className="grp";h.innerHTML=`<span>${label}</span><span>${items.length}</span>`;list.appendChild(h);
    items.forEach(o=>{
      const row=document.createElement("div");row.className="oprow"+(op&&op.id===o.id&&curView==="train"&&mode!=="edit"&&mode!=="replay"?" cur":"");
      const cl=o.lines.filter((l,i)=>P(o.id,i)===2).length;const wk=weakInfo(o.id);const due=o.lines.some((l,i)=>isDue(lk(o.id,i)));
      const b=document.createElement("button");b.className="op";
      b.innerHTML=`<span class="kchip ${o.side}" title="Du spielst ${o.side==="w"?"Weiß":"Schwarz"}"></span><span class="op-main"><span class="op-name"></span><span class="op-eco"></span></span>${wk?'<span class="weak" title="Laut deiner Analyse eine Schwachstelle">schwach</span>':""}<span class="op-prog${cl===o.lines.length?" full":""}">${moveFilter?moveFilter[o.id].length+" V.":cl+"/"+o.lines.length}</span>`;
      b.querySelector(".op-name").textContent=o.name;b.querySelector(".op-eco").textContent=o.eco+" · "+(o.side==="w"?"Weiß":"Schwarz")+(due?" · fällig":"");
      b.onclick=()=>{selectOpening(o,moveFilter?rnd(moveFilter[o.id]):null)};
      const s=document.createElement("button");s.className="star";const inRep=S.rep.indexOf(o.id)>=0;s.setAttribute("aria-pressed",String(inRep));s.title=inRep?"Aus dem Repertoire entfernen":"Zum Repertoire hinzufügen";s.setAttribute("aria-label",s.title);s.innerHTML=ICON.star;
      s.onclick=()=>{const i=S.rep.indexOf(o.id);if(i>=0)S.rep.splice(i,1);else S.rep.push(o.id);save("rep");renderList();toast(i>=0?o.name+" aus dem Repertoire entfernt":o.name+" zum Repertoire hinzugefügt")};
      row.appendChild(b);row.appendChild(s);list.appendChild(row);
    });
  });
  if(!list.children.length)list.innerHTML=`<div class="empty">${repOnly&&!S.rep.length?"Noch kein Repertoire – tippe auf die Sterne, um Eröffnungen hinzuzufügen.":"Nichts gefunden."}</div>`;
}
$("search").addEventListener("input",renderList);
$("repOnly").onclick=()=>{const b=$("repOnly");b.setAttribute("aria-pressed",String(b.getAttribute("aria-pressed")!=="true"));renderList()};
function closeMenu(){$("side").classList.remove("open");$("scrim").hidden=true}
$("menuBtn").onclick=()=>{$("side").classList.add("open");$("scrim").hidden=false};
$("scrim").onclick=closeMenu;

/* ---------------- Statisches Mini-Brett ---------------- */
function staticBoard(fen,or,last){
  const g=new Chess(fen);const el=document.createElement("div");el.className="board";el.style.cursor="default";
  const sq=document.createElement("div");sq.className="sqs";const pcs=document.createElement("div");pcs.className="pcs";
  const XY=s=>{const f=fi(s),r=ri(s);return or==="b"?{x:7-f,y:r}:{x:f,y:7-r}};
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){const f=or==="b"?7-x:x,r=or==="b"?y:7-y;const n="abcdefgh"[f]+(r+1);const d=document.createElement("div");d.className="sq "+((x+y)%2===0?"l":"d")+(last&&(last.from===n||last.to===n)?" hl":"");
    if(x===0){const s=document.createElement("span");s.className="coord r";s.textContent=n[1];d.appendChild(s)}if(y===7){const s=document.createElement("span");s.className="coord f";s.textContent=n[0];d.appendChild(s)}sq.appendChild(d)}
  const b=g.board();for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!p)continue;const n="abcdefgh"[c]+(8-r);const d=document.createElement("div");d.className="pc "+p.color+p.type;const q=XY(n);d.style.transform=`translate(${q.x*100}%,${q.y*100}%)`;pcs.appendChild(d)}
  el.appendChild(sq);el.appendChild(pcs);
  requestAnimationFrame(()=>el.style.setProperty("--s",(el.clientWidth/8||50)+"px"));
  return el;
}

/* ---------------- Quiz ---------------- */
let quiz=null;
function quizPool(){const r=S.rep.map(byId).filter(Boolean);return (r.length?r:ALL).filter(o=>o.g!=="c"||o.lines.length)}
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
  const others=shuffle(pool.filter(([x,i])=>x!==o&&x.lines[i].p!==L.p)).slice(0,3);
  const {g,last}=posAfter(L.m);
  const opts=shuffle([{t:L.p,ok:true}].concat(others.map(([x,i])=>({t:x.lines[i].p,ok:false}))));
  return {fen:g.fen(),last,or:o.side,prompt:"Welcher Plan passt zu dieser Stellung?",opts,exp:`Das ist ${o.name} · ${L.n}.`,oid:o.id,li};
}
function qName(){
  for(let t=0;t<60;t++){
    const o=rnd(quizPool().filter(x=>x.g!=="c"));if(!o)break;const li=Math.floor(Math.random()*o.lines.length);const L=o.lines[li];
    const k=Math.min(L.m.length,6+Math.floor(Math.random()*4));const h=L.m.slice(0,k);
    const wrong=shuffle(ALL.filter(x=>x.g!=="c"&&x.name!==o.name&&!consistentIn(x,h).length)).slice(0,3);if(wrong.length<3)continue;
    const {g,last}=posAfter(h);
    const opts=shuffle([{t:o.name,ok:true}].concat(wrong.map(x=>({t:x.name,ok:false}))));
    return {fen:g.fen(),last,or:o.side,prompt:"Welche Eröffnung ist auf dem Brett?",opts,exp:`${o.name} · ${L.n}: ${fmtMoves(h)}`,oid:o.id,li};
  }
  return null;
}
function renderQuizIntro(){
  const v=$("v-quiz");
  v.innerHTML=`<div class="hero"><span class="ic" style="background:#8A63B8;box-shadow:0 4px 0 #5C4180">${NAVICON.quiz}</span><div><h2>Eröffnungs-Quiz</h2><p>Zehn gemischte Fragen: den Buchzug finden, die Eröffnung erkennen und den passenden Plan zuordnen. ${S.rep.length?"Die Fragen stammen aus deinem Repertoire.":"Markiere Eröffnungen mit einem Stern, damit die Fragen aus deinem Repertoire kommen."}</p></div></div>
  <div class="tiles"><div class="tile"><small>Beantwortet</small><b>${st.quiz.n}</b></div><div class="tile win"><small>Richtig</small><b>${st.quiz.ok}</b><span>${st.quiz.n?pct(st.quiz.ok/st.quiz.n):"–"}</span></div><div class="tile gold"><small>Bestes Quiz</small><b>${st.quiz.best||0}/10</b></div><div class="tile"><small>Pool</small><b>${quizPool().length}</b><span>Eröffnungen</span></div></div>
  <button class="big" id="quizGo" style="margin:0">Quiz starten</button>`;
  $("quizGo").onclick=()=>{quiz={i:0,ok:0,n:10};nextQuestion()};
}
function nextQuestion(){
  if(quiz.i>=quiz.n){st.quiz.best=Math.max(st.quiz.best||0,quiz.ok);saveStats();checkBadges();
    $("v-quiz").innerHTML=`<div class="hero"><span class="ic" style="background:#8A63B8;box-shadow:0 4px 0 #5C4180">${NAVICON.quiz}</span><div><h2>${quiz.ok} von ${quiz.n} richtig</h2><p>${quiz.ok>=8?"Ausgezeichnet!":quiz.ok>=5?"Gut gemacht – die falschen Fragen kommen beim Training wieder.":"Übung macht den Meister. Trainiere die Eröffnungen und versuch es erneut."}</p></div></div><div class="btnrow"><button class="btn grn" id="qAgain">Neues Quiz</button><button class="btn" id="qBack">Zurück zum Training</button></div>`;
    $("qAgain").onclick=()=>{quiz={i:0,ok:0,n:10};nextQuestion()};$("qBack").onclick=()=>{showView("train")};return}
  const type=quiz.i%3;const q=(type===0?qMove():type===1?qName():qPlan())||qMove();quiz.q=q;
  const v=$("v-quiz");
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

/* ---------------- Musterpartien-Seite ---------------- */
function renderGames(){
  const v=$("v-games");
  v.innerHTML=`<div class="hero"><span class="ic" style="background:var(--book);box-shadow:0 4px 0 #6E583F">${NAVICON.games}</span><div><h2>Musterpartien</h2><p>Berühmte Partien zeigen, wie die Pläne aus der Eröffnung in der Praxis aussehen. Jeder Zug wird beim Nachspielen erklärt.</p></div></div>
  <div class="grid3">${GAMES.map(g=>`<div class="gcard">${st.games[g.id]?'<span class="done-tag">Nachgespielt</span>':""}<h4>${esc(g.title)}</h4><div class="sub">${esc(g.players)} · ${esc(g.year)} · ${g.moves.split(" ").length} Halbzüge</div><p>${esc(g.d)}</p><div class="chips">${g.ops.map(id=>byId(id)).filter(Boolean).map(o=>`<button class="chip" data-op="${o.id}">${esc(o.name)}</button>`).join("")}</div><button class="btn grn" data-game="${g.id}">Nachspielen</button></div>`).join("")}</div>
  <p class="hint">Tipp: Zu jeder Eröffnung mit Musterpartie findest du im Training unter „Erklärung“ einen direkten Link.</p>`;
  v.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>openGame(GAMES.find(g=>g.id===b.dataset.game)));
  v.querySelectorAll("[data-op]").forEach(b=>b.onclick=()=>selectOpening(byId(b.dataset.op)));
}

/* ---------------- Statistik ---------------- */
function renderStats(){
  checkBadges();
  const v=$("v-stats");const tot=totalLines(),cl=cleanCount();
  let mv=0,er=0;Object.values(st.op).forEach(s=>{mv+=s.mv;er+=s.err});
  const acc=mv+er?mv/(mv+er):0;
  const days=[];for(let i=13;i>=0;i--){const d=dstr(new Date(Date.now()-i*DAY));days.push([d,st.days[d]||0])}
  const mx=Math.max(1,...days.map(d=>d[1]));
  const rows=ALL.filter(o=>st.op[o.id]&&(st.op[o.id].att||st.op[o.id].err)).map(o=>{const s=st.op[o.id];return {o,s,acc:s.mv+s.err?s.mv/(s.mv+s.err):1,cl:o.lines.filter((l,i)=>P(o.id,i)===2).length}}).sort((a,b)=>a.acc-b.acc);
  const hard=Object.entries(st.hard).filter(([k,H])=>byId(H.id)).sort((a,b)=>b[1].n-a[1].n).slice(0,10);
  v.innerHTML=`<div class="hero"><span class="ic">${NAVICON.stats}</span><div><h2>Statistik & Abzeichen</h2><p>Dein Lernfortschritt, deine Trefferquote und die Züge, die dir am schwersten fallen.</p></div></div>
  <div class="tiles">
    <div class="tile win"><small>Fehlerfrei gelernt</small><b>${cl}</b><span>von ${tot} Varianten (${pct(cl/tot)})</span></div>
    <div class="tile"><small>Trefferquote</small><b>${mv+er?pct(acc):"–"}</b><span>${mv} richtige, ${er} falsche Züge</span></div>
    <div class="tile gold"><small>Serie</small><b>${streakNow()}</b><span>Tage · Rekord ${S.streak.best||0}</span></div>
    <div class="tile"><small>Heute fällig</small><b>${dueKeys().length}</b><span>${Object.keys(S.srs).length} Varianten im Wiederholungsplan</span></div>
  </div>
  <div class="card"><h3>Aktivität der letzten 14 Tage</h3><div class="bars">${days.map(d=>`<i class="${d[1]?"":"zero"}" style="height:${Math.max(3,d[1]/mx*100)}%" title="${d[0]}: ${d[1]} Varianten"></i>`).join("")}</div><div class="bars-l">${days.map(d=>`<span>${+d[0].slice(8)}</span>`).join("")}</div></div>
  <div class="sec-h"><h3>Abzeichen</h3><small>${st.badges.length} von ${BADGES.length}</small></div>
  <div class="badges">${BADGES.map(b=>`<div class="bdg${st.badges.indexOf(b.id)>=0?" got":""}"><span class="md">${ICON.medal}</span><span><b>${esc(b.t)}</b><small>${esc(b.d)}</small></span></div>`).join("")}</div>
  <div class="sec-h"><h3>Schwierigste Züge</h3><small>Wo du am häufigsten falsch ziehst</small></div>
  ${hard.length?`<div class="tbl-wrap"><table><thead><tr><th>Eröffnung</th><th>Stellung nach</th><th>Richtig wäre</th><th style="text-align:right">Fehler</th><th></th></tr></thead><tbody>${hard.map(([k,H])=>{const o=byId(H.id);const bm=bookMovesIn(o,H.pre);return `<tr><td><div class="nm">${esc(o.name)}</div></td><td>${H.pre.length?esc(fmtMoves(H.pre.slice(-4),H.pre.length-Math.min(4,H.pre.length))):"Startstellung"}</td><td><b>${esc(bm.map(de).join(" / "))}</b></td><td class="num score-bad">${H.n}</td><td style="text-align:right"><button class="mini" data-hard="${esc(k)}">Üben</button></td></tr>`}).join("")}</tbody></table></div>`:`<div class="card">Noch keine Fehler gespeichert. Sobald du falsch ziehst, erscheint der Zug hier.</div>`}
  <div class="sec-h"><h3>Eröffnungen</h3><small>Sortiert nach Trefferquote</small></div>
  ${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Eröffnung</th><th style="text-align:right">Fehlerfrei</th><th style="text-align:right">Durchgänge</th><th style="text-align:right">Trefferquote</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr><td><div class="nm"><span class="kchip ${r.o.side}"></span>${esc(r.o.name)}</div></td><td class="num">${r.cl}/${r.o.lines.length}</td><td class="num">${r.s.att}</td><td class="num ${r.acc<.8?"score-bad":r.acc>.95?"score-good":""}">${pct(r.acc)}</td><td style="text-align:right"><button class="mini" data-op="${r.o.id}">Üben</button></td></tr>`).join("")}</tbody></table></div>`:`<div class="card">Noch keine Trainingsdaten. Starte mit dem Tagestraining!</div>`}
  <div class="card" id="syncCard"><h3>Fortschritt sichern und übertragen</h3>
    <p class="hint" style="margin:0 0 10px">Dein Fortschritt liegt nur in diesem Browser. Um ihn auf ein anderes Gerät zu bringen, exportiere ihn hier als Datei oder Code und importiere ihn dort.</p>
    <div class="btnrow"><button class="btn grn" id="expFile">Als Datei speichern</button><button class="btn" id="expCode">Code kopieren</button><label class="btn" style="cursor:pointer">Datei importieren<input type="file" id="impFile" accept=".json,application/json" hidden></label></div>
    <textarea class="code" id="impCode" placeholder="Oder Code hier einfügen und »Code importieren« drücken" style="margin-top:10px"></textarea>
    <div class="btnrow" style="margin-top:8px"><button class="btn" id="impGo">Code importieren</button><span class="hint" id="syncMsg"></span></div>
  </div>`;
  v.querySelectorAll("[data-op]").forEach(b=>b.onclick=()=>selectOpening(byId(b.dataset.op)));
  v.querySelectorAll("[data-hard]").forEach(b=>b.onclick=()=>{const H=st.hard[b.dataset.hard];const o=byId(H.id);const c=consistentIn(o,H.pre);selectOpening(o,c.length?c[0]:null)});
  wireSync();
}
function exportData(){return {app:"eroeffnungstrainer",v:1,date:new Date().toISOString(),prog:S.prog,srs:S.srs,rep:S.rep,daily:S.daily,streak:S.streak,stats:S.stats,set:S.set,custom:S.custom,ana:S.ana}}
function importData(d){
  if(!d||d.app!=="eroeffnungstrainer")throw new Error("Das ist keine Sicherung des Eröffnungstrainers.");
  ["prog","srs","rep","daily","streak","stats","set","custom","ana"].forEach(k=>{if(d[k]!==undefined)store.set("et-"+k,d[k])});
}
function wireSync(){
  const msg=t=>$("syncMsg").textContent=t;
  $("expFile").onclick=()=>{const blob=new Blob([JSON.stringify(exportData())],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="eroeffnungstrainer-"+today()+".json";document.body.appendChild(a);a.click();a.remove();msg("Datei gespeichert.")};
  $("expCode").onclick=()=>{const code=btoa(unescape(encodeURIComponent(JSON.stringify(exportData()))));const ta=$("impCode");ta.value=code;
    if(navigator.clipboard)navigator.clipboard.writeText(code).then(()=>msg("Code kopiert – füge ihn auf dem anderen Gerät ein.")).catch(()=>{ta.select();msg("Code markiert – kopiere ihn mit Strg+C bzw. Kopieren.")});else{ta.select();msg("Code markiert – bitte kopieren.")}};
  const apply=txt=>{try{let d;txt=txt.trim();try{d=JSON.parse(txt)}catch(e){d=JSON.parse(decodeURIComponent(escape(atob(txt))))}importData(d);msg("Importiert – die Seite lädt neu …");setTimeout(()=>location.reload(),700)}catch(e){msg("Import fehlgeschlagen: "+(e.message||e))}};
  $("impGo").onclick=()=>apply($("impCode").value);
  $("impFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>apply(String(r.result));r.readAsText(f)};
}

/* ---------------- Einstellungen ---------------- */
const THEMES=[["green","Grün","#EBECD0","#739552"],["brown","Holz","#F0D9B5","#B58863"],["blue","Blau","#DEE3E6","#8CA2AD"],["gray","Marmor","#E2E2DE","#9E9E98"]];
const PSETS=[["cburnett","Klassisch"],["staunty","Staunty"]];
function applySettings(){
  document.body.classList.remove("bt-green","bt-brown","bt-blue","bt-gray","ps-cburnett","ps-staunty");
  document.body.classList.add("bt-"+S.set.theme,"ps-"+S.set.pieces);
  document.body.classList.toggle("nocoords",!S.set.coords);
}
function renderSettings(){
  const v=$("v-settings");const sw=(id,on,t,d)=>`<div class="setrow"><span><b>${t}</b><small>${d}</small></span><button class="switch" id="${id}" aria-pressed="${on}" aria-label="${t}"></button></div>`;
  v.innerHTML=`<div class="hero"><span class="ic" style="background:var(--hover);box-shadow:0 4px 0 #1E1D1B">${NAVICON.settings}</span><div><h2>Einstellungen</h2><p>Brett, Figuren, Ton und die Spielstärke von Stockfish.</p></div></div>
  <div class="card"><h3>Brett</h3><div class="opts">${THEMES.map(t=>`<button class="optc" data-theme="${t[0]}" aria-pressed="${S.set.theme===t[0]}"><span class="mini-board">${[0,1,2,3,4,5,6,7].map(i=>`<i style="background:${((i+(i>3?1:0))%2)?t[3]:t[2]}"></i>`).join("")}</span>${t[1]}</button>`).join("")}</div></div>
  <div class="card"><h3>Figuren</h3><div class="opts">${PSETS.map(p=>`<button class="optc pv-${p[0]}" data-pset="${p[0]}" aria-pressed="${S.set.pieces===p[0]}"><span class="piece-prev">${["wk","wq","wn","bk","bq","bn"].map(x=>`<span class="pp ${x}"></span>`).join("")}</span>${p[1]}</button>`).join("")}</div><p class="hint" style="margin-top:8px">Figuren „Klassisch“: Colin M.L. Burnett (GPLv2+). „Staunty“: lichess-Set, CC BY-NC-SA 4.0.</p></div>
  <div class="card"><h3>Training</h3>
    ${sw("swSound",S.set.sound,"Ton","Geräusche für Züge, Fehler und Erfolge")}
    ${sw("swIdeas",S.set.ideas,"Ideen-Pfeile","Blaue Pfeile zeigen, was der letzte Zug angreift oder fesselt")}
    ${sw("swCoords",S.set.coords,"Koordinaten","Buchstaben und Zahlen am Brettrand")}
    <div class="setrow"><span><b>Stockfish-Stärke: <span id="sfLbl">${S.set.sf}</span></b><small>1 = Anfänger, 10 = Vereinsspieler, 20 = volle Stärke</small></span><input type="range" id="sfRange" min="1" max="20" value="${S.set.sf}" aria-label="Stockfish-Stärke"></div>
  </div>
  <div class="card"><h3>App installieren</h3><p class="hint" style="margin:0">iPhone: In Safari auf Teilen → „Zum Home-Bildschirm“. Android/Chrome: Menü → „App installieren“. Danach funktioniert das Training auch offline (Analyse und Stockfish brauchen Internet).</p></div>
  <div class="card"><h3>Zurücksetzen</h3><p class="hint" style="margin:0 0 10px">Löscht Fortschritt, Wiederholungsplan, Statistik und Abzeichen in diesem Browser. Einstellungen und eigene Varianten bleiben.</p><div class="btnrow"><button class="btn red" id="resetBtn">Fortschritt zurücksetzen</button><span class="hint" id="resetMsg"></span></div></div>`;
  v.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>{S.set.theme=b.dataset.theme;save("set");applySettings();renderSettings()});
  v.querySelectorAll("[data-pset]").forEach(b=>b.onclick=()=>{S.set.pieces=b.dataset.pset;save("set");applySettings();renderSettings()});
  const tg=(id,key)=>$(id).onclick=()=>{S.set[key]=!S.set[key];save("set");applySettings();$(id).setAttribute("aria-pressed",String(S.set[key]));if(op)render()};
  tg("swSound","sound");tg("swIdeas","ideas");tg("swCoords","coords");
  $("sfRange").oninput=e=>{S.set.sf=+e.target.value;$("sfLbl").textContent=S.set.sf;save("set")};
  $("resetBtn").onclick=()=>{const b=$("resetBtn");if(!b.dataset.sure){b.dataset.sure="1";b.textContent="Wirklich alles löschen?";$("resetMsg").textContent="Noch einmal tippen zum Bestätigen.";return}
    ["prog","srs","daily","streak","stats","ana"].forEach(k=>{try{localStorage.removeItem("et-"+k)}catch(e){}});location.reload()};
}

/* ================= Partien-Analyse (Chess.com & Lichess) ================= */
const FAM={"Sicilian Defense":"Sizilianisch","French Defense":"Französisch","Caro Kann Defense":"Caro-Kann","Italian Game":"Italienisch","Ruy Lopez Opening":"Spanisch","Ruy Lopez":"Spanisch","Scotch Game":"Schottisch","Queens Gambit Declined":"Damengambit abgelehnt","Queens Gambit Accepted":"Damengambit angenommen","Queens Gambit":"Damengambit","Queens Pawn Opening":"Damenbauernspiel","Queens Pawn Game":"Damenbauernspiel","Kings Pawn Opening":"Königsbauernspiel","Kings Pawn Game":"Königsbauernspiel","English Opening":"Englisch","Pirc Defense":"Pirc-Verteidigung","Modern Defense":"Moderne Verteidigung","Scandinavian Defense":"Skandinavisch","Kings Indian Defense":"Königsindisch","Kings Indian Attack":"Königsindischer Angriff","Nimzo Indian Defense":"Nimzo-Indisch","Queens Indian Defense":"Damenindisch","London System":"Londoner System","Philidor Defense":"Philidor","Petrovs Defense":"Russisch (Petrow)","Russian Game":"Russisch (Petrow)","Vienna Game":"Wiener Partie","Kings Gambit":"Königsgambit","Kings Gambit Accepted":"Königsgambit","Kings Gambit Declined":"Königsgambit abgelehnt","Bishops Opening":"Läuferspiel","Four Knights Game":"Vierspringerspiel","Three Knights Opening":"Dreispringerspiel","Alekhine Defense":"Aljechin","Dutch Defense":"Holländisch","Owens Defense":"Owen-Verteidigung","Nimzowitsch Defense":"Nimzowitsch-Verteidigung","Center Game":"Mittelgambit","Ponziani Opening":"Ponziani","Englund Gambit":"Englund-Gambit","Indian Game":"Indisch","Indian Defense":"Indisch","Zukertort Opening":"Zukertort (1.Sf3)","Reti Opening":"Réti","Catalan Opening":"Katalanisch","Grunfeld Defense":"Grünfeld","Benoni Defense":"Benoni","Slav Defense":"Slawisch","Semi Slav Defense":"Halbslawisch","Bird Opening":"Bird","Polish Opening":"Polnisch","Van t Kruijs Opening":"Van ’t Kruijs","Mieses Opening":"Mieses","Scotch Gambit":"Schottisches Gambit","Danish Gambit":"Nordisches Gambit","Two Knights Defense":"Zweispringerspiel","Giuoco Piano Game":"Giuoco Piano","Elephant Gambit":"Elefantengambit","Latvian Gambit":"Lettisches Gambit","Budapest Defense":"Budapester Gambit","Benko Gambit":"Wolga-Gambit","Trompowsky Attack":"Trompowsky","Colle System":"Colle-System","Damiano Defense":"Damiano","Kings Knight Opening":"Königsspringerspiel","Old Benoni Defense":"Alt-Benoni","Hungarian Opening":"Ungarisch (1.g3)","Nimzo Larsen Attack":"Nimzowitsch-Larsen","Grob Opening":"Grob","Saragossa Opening":"Saragossa","Sodium Attack":"Sodium","Ware Opening":"Ware","Barnes Opening":"Barnes","Anderssens Opening":"Anderssen","Clemenz Opening":"Clemenz","Kadas Opening":"Kadas","Dunst Opening":"Dunst","Rapport Jobava System":"Jobava-London","Tarrasch Defense":"Tarrasch-Verteidigung","Blackmar Diemer Gambit":"Blackmar-Diemer","Horwitz Defense":"Horwitz","Rat Defense":"Rattenverteidigung","Robatsch Defense":"Moderne Verteidigung","Bogo Indian Defense":"Bogo-Indisch","Torre Attack":"Torre-Angriff"};
function famLookup(en){en=en.replace(/['’]/g,"").replace(/-/g," ").replace(/\s+/g," ").trim();let best=null;for(const k in FAM){if((en+" ").indexOf(k+" ")===0&&(!best||k.length>best.length))best=k}return best?FAM[best]:(en||"Unbekannte Eröffnung")}
function famFromUrl(u){
  if(!u)return "Unbekannte Eröffnung";const m=u.split("/openings/")[1];if(!m)return "Unbekannte Eröffnung";
  const toks=m.replace(/\.\.\./g,"").split("-");const out=[];
  for(const t of toks){if(/^\d/.test(t))break;out.push(t);if(/^(Defense|Opening|Game|Gambit|Attack|System)$/.test(t))break;if(out.length>=4)break}
  return famLookup(out.join(" "));
}
const famFromName=n=>n?famLookup(n.split(":")[0]):"Unbekannte Eröffnung";
function pgnHeader(pgn,key){const m=pgn.match(new RegExp('\\['+key+' "([^"]*)"\\]'));return m?m[1]:""}
function pgnMoves(pgn){
  let s=pgn.replace(/^\s*\[[^\]]*\]\s*$/gm," ").replace(/\{[^}]*\}/g," ").replace(/;[^\n]*/g," ");
  let prev;do{prev=s;s=s.replace(/\([^()]*\)/g," ")}while(s!==prev);
  s=s.replace(/\$\d+/g," ").replace(/\d+\.(\.\.)?/g," ");
  return s.split(/\s+/).filter(x=>x&&!/^(1-0|0-1|1\/2-1\/2|\*)$/.test(x)).slice(0,40);
}
const DRAWS=["agreed","repetition","stalemate","insufficient","50move","timevsinsufficient"];
function normApiGame(g,user){
  if(g.rules&&g.rules!=="chess")return null;const u=user.toLowerCase();let color=null;
  if(g.white&&g.white.username.toLowerCase()===u)color="w";else if(g.black&&g.black.username.toLowerCase()===u)color="b";
  if(!color||!g.pgn)return null;const me=color==="w"?g.white:g.black;
  const res=me.result==="win"?"win":DRAWS.indexOf(me.result)>=0?"draw":"loss";
  return {color,res,fam:famFromUrl(g.eco||pgnHeader(g.pgn,"ECOUrl")),moves:pgnMoves(g.pgn),tc:g.time_class||"",url:g.url||"",opp:(color==="w"?g.black:g.white).username,date:(g.end_time||0)*1000,name:color==="w"?g.white.username:g.black.username};
}
function normLichess(g,user){
  if(g.variant&&g.variant!=="standard")return null;if(g.status==="aborted"||g.status==="noStart")return null;
  const u=user.toLowerCase();const wn=((g.players.white||{}).user||{}).name||"",bn=((g.players.black||{}).user||{}).name||"";
  let color=null;if(wn.toLowerCase()===u)color="w";else if(bn.toLowerCase()===u)color="b";if(!color)return null;
  const res=g.winner?((g.winner==="white")===(color==="w")?"win":"loss"):"draw";
  const sp={ultraBullet:"bullet",bullet:"bullet",blitz:"blitz",rapid:"rapid",classical:"rapid",correspondence:"daily"}[g.speed]||"";
  return {color,res,fam:famFromName(g.opening&&g.opening.name),moves:(g.moves||"").split(" ").filter(Boolean).slice(0,40),tc:sp,url:"https://lichess.org/"+g.id+(color==="b"?"/black":""),opp:color==="w"?bn:wn,date:g.createdAt||0,name:color==="w"?wn:bn};
}
function normPgnGame(pgn,user){
  const u=user.toLowerCase();const W=pgnHeader(pgn,"White"),B=pgnHeader(pgn,"Black"),R=pgnHeader(pgn,"Result");
  let color=null;if(W.toLowerCase()===u)color="w";else if(B.toLowerCase()===u)color="b";if(!color)return null;
  const res=R==="1/2-1/2"?"draw":(R==="1-0")===(color==="w")?"win":(R==="1-0"||R==="0-1")?"loss":null;if(!res)return null;
  const vr=pgnHeader(pgn,"Variant");if(vr&&vr.toLowerCase()!=="standard")return null;
  const tcs=pgnHeader(pgn,"TimeControl");let tc="";if(tcs&&tcs!=="-"){if(tcs.indexOf("/")>=0)tc="daily";else{const base=parseInt(tcs,10),inc=parseInt(tcs.split("+")[1]||"0",10);const tot=base+40*inc;tc=tot<180?"bullet":tot<600?"blitz":"rapid"}}else if(tcs==="-")tc="daily";
  const ds=(pgnHeader(pgn,"UTCDate")||pgnHeader(pgn,"Date")).replace(/\./g,"-");const date=Date.parse(ds)||0;
  const eu=pgnHeader(pgn,"ECOUrl");const on=pgnHeader(pgn,"Opening");
  return {color,res,fam:eu?famFromUrl(eu):famFromName(on),moves:pgnMoves(pgn),tc,url:pgnHeader(pgn,"Link")||pgnHeader(pgn,"Site"),opp:color==="w"?B:W,date,name:color==="w"?W:B};
}
function matchGame(gm){
  let best=null;
  for(const o of ALL){if(o.side!==gm.color||o.g==="c")continue;
    o.lines.forEach((l,i)=>{let k=0;while(k<l.m.length&&k<gm.moves.length&&strip(l.m[k])===strip(gm.moves[k]))k++;if(!best||k>best.k||(k===best.k&&o.g!=="x"&&best.o.g==="x"))best={o,i,k}})}
  if(!best||best.k<4)return null;
  let dev=null;const h=[];
  for(let k=0;k<gm.moves.length&&k<24;k++){const bm=bookMovesIn(best.o,h);if(!bm.length)break;
    if(bm.indexOf(strip(gm.moves[k]))<0){dev={ply:k,played:gm.moves[k],book:bm,mine:(k%2===0?"w":"b")===gm.color};break}h.push(gm.moves[k])}
  return {id:best.o.id,line:best.i,k:best.k,dev};
}
const mkey=t=>{const d=new Date(t);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")};
function analyze(games){
  const groups={};const tot={n:0,w:0,d:0,l:0,wN:0,bN:0};const opp={w:{},b:{}};
  for(const gm of games){
    const R=gm.res==="win"?"w":gm.res==="draw"?"d":"l";tot.n++;tot[R]++;tot[gm.color+"N"]++;
    const m=matchGame(gm);const key=m?"id:"+m.id:"fam:"+gm.color+":"+gm.fam;
    const G=groups[key]||(groups[key]={key,id:m?m.id:null,color:gm.color,name:m?byId(m.id).name:gm.fam,fams:{},n:0,w:0,d:0,l:0,devs:{},lossLines:{},months:{}});
    G.n++;G[R]++;G.fams[gm.fam]=(G.fams[gm.fam]||0)+1;
    if(gm.date){const mk=mkey(gm.date);const M=G.months[mk]||(G.months[mk]={n:0,pts:0});M.n++;M.pts+=R==="w"?1:R==="d"?.5:0}
    if(m&&m.dev&&m.dev.mine){const dk=m.dev.ply+"|"+m.dev.played;const D=G.devs[dk]||(G.devs[dk]={ply:m.dev.ply,played:m.dev.played,book:m.dev.book,n:0,l:0,url:gm.url});D.n++;if(R==="l"){D.l++;if(gm.url)D.url=gm.url}}
    if(m&&R!=="w")G.lossLines[m.line]=(G.lossLines[m.line]||0)+1;
    // Was spielen die Gegner?
    const ok=gm.color==="w"?gm.moves.slice(0,2):gm.moves.slice(0,1);
    if(ok.length===(gm.color==="w"?2:1)){const k2=ok.join(" ");const O=opp[gm.color][k2]||(opp[gm.color][k2]={mv:ok,n:0,w:0,d:0,l:0});O.n++;O[R]++}
  }
  const list=Object.values(groups).map(G=>{G.score=(G.w+G.d/2)/G.n;G.lost=(0.5-G.score)*G.n;G.topDev=Object.values(G.devs).sort((a,b)=>b.n-a.n)[0]||null;const ll=Object.entries(G.lossLines).sort((a,b)=>b[1]-a[1])[0];G.focusLine=ll?+ll[0]:null;G.alias=Object.entries(G.fams).sort((a,b)=>b[1]-a[1])[0][0];return G});
  return {tot,list,opp};
}
let anaResult=null,anaSource=store.get("et-anasrc","chesscom");
function renderAnaPage(){
  const v=$("v-ana");
  v.innerHTML=`<div class="hero"><span class="ic" style="background:var(--blue);box-shadow:0 4px 0 #3A5579">${NAVICON.ana}</span><div><h2>Partien-Analyse</h2><p>Gib deinen Benutzernamen ein. Die Seite lädt deine öffentlichen Partien und zeigt, gegen welche Eröffnungen du verlierst, wo du vom Buch abweichst und was deine Gegner gegen dich spielen. Ein Passwort ist nicht nötig.</p></div></div>
  <div class="card">
    <form class="form" id="anaForm">
      <label>Plattform<span class="seg" id="anaSrc"><button type="button" data-src="chesscom" aria-pressed="${anaSource==="chesscom"}">Chess.com</button><button type="button" data-src="lichess" aria-pressed="${anaSource==="lichess"}">Lichess</button></span></label>
      <label class="wide" for="anaUser">Benutzername<input id="anaUser" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="dein Name" required></label>
      <label for="anaMonths">Zeitraum<select id="anaMonths"><option value="1">Letzter Monat</option><option value="3" selected>3 Monate</option><option value="6">6 Monate</option><option value="12">12 Monate</option></select></label>
      <label for="anaType">Partien<select id="anaType"><option value="all">Alle</option><option value="bullet">Bullet</option><option value="blitz">Blitz</option><option value="rapid">Schnellschach</option><option value="daily">Täglich / Fern</option></select></label>
      <button class="big" type="submit" id="anaGo">Partien analysieren</button>
    </form>
    <details class="alt"><summary>Oder PGN-Datei hochladen</summary><p>Chess.com: Spielen → Archiv → Download. Lichess: Profil → Partien exportieren. Trag oben deinen Benutzernamen ein, damit klar ist, welche Seite du gespielt hast.</p><input type="file" id="pgnFile" accept=".pgn,text/plain"></details>
  </div>
  <div class="card status" id="anaStatus" hidden><b id="anaStTitle"></b><div class="prog"><i id="anaBar"></i></div><small id="anaStText"></small></div>
  <div id="anaErr" class="err" hidden></div>
  <div id="anaResult" class="page" style="max-width:none"></div>`;
  const u=S.ana&&S.ana.user;if(u)$("anaUser").value=u;
  v.querySelectorAll("[data-src]").forEach(b=>b.onclick=()=>{anaSource=b.dataset.src;store.set("et-anasrc",anaSource);v.querySelectorAll("[data-src]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)))});
  $("anaForm").addEventListener("submit",runAnalysis);
  $("pgnFile").addEventListener("change",runPgn);
  if(anaResult)renderAna(anaResult);
}
function wdl(G){return `<div class="wdl" title="${G.w} Siege, ${G.d} Remis, ${G.l} Niederlagen"><i class="w" style="width:${G.w/G.n*100}%"></i><i class="d" style="width:${G.d/G.n*100}%"></i><i class="l" style="width:${G.l/G.n*100}%"></i></div>`}
function trendHtml(G){
  const ks=Object.keys(G.months).sort().slice(-6);if(ks.length<2)return "";
  return `<div><div class="sub" style="margin-bottom:4px">Verlauf (Punkte pro Monat)</div><div class="trend">${ks.map(k=>{const M=G.months[k];const s=M.pts/M.n;return `<i class="${s<.4?"bad":s<.6?"mid":""}" style="height:${Math.max(8,s*100)}%" title="${k}: ${pct(s)} aus ${M.n} Partien"></i>`}).join("")}</div><div class="trend-l">${ks.map(k=>`<span>${["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"][+k.slice(5)-1]}</span>`).join("")}</div></div>`;
}
function devText(D){const mv=Math.floor(D.ply/2)+1;const num=mv+(D.ply%2===0?".":"...");return `Du spielst hier oft <b>${esc(num+" "+de(D.played))}</b> statt ${esc(D.book.slice(0,2).map(de).join(" oder "))} (${D.n}×).${D.url?` <a href="${esc(D.url)}" target="_blank" rel="noopener">Partie ansehen</a>`:""}`}
function suggestFor(color,mv){return ALL.filter(o=>o.side===color&&o.g!=="c"&&consistentIn(o,mv).length).sort((a,b)=>(S.rep.indexOf(b.id)>=0)-(S.rep.indexOf(a.id)>=0)||(a.g==="x")-(b.g==="x")).slice(0,3)}
function renderAna(R){
  anaResult=R;const el=$("anaResult");if(!el)return;const T=R.tot;
  if(!T.n){el.innerHTML=`<div class="card">Keine passenden Partien gefunden. Prüfe Benutzernamen, Zeitraum und Partietyp.</div>`;return}
  const weak=R.list.filter(G=>G.n>=3&&G.score<0.5).sort((a,b)=>b.lost-a.lost).slice(0,6);
  let html=`<div class="sec-h"><h3>Ergebnis für ${esc(R.user)}</h3><small>${esc(R.label)}</small></div>
  <div class="tiles"><div class="tile"><small>Partien</small><b>${T.n}</b><span>${T.wN} mit Weiß · ${T.bN} mit Schwarz</span></div><div class="tile win"><small>Siege</small><b>${T.w}</b><span>${pct(T.w/T.n)}</span></div><div class="tile"><small>Remis</small><b>${T.d}</b><span>${pct(T.d/T.n)}</span></div><div class="tile loss"><small>Niederlagen</small><b>${T.l}</b><span>${pct(T.l/T.n)}</span></div></div>`;
  html+=`<div class="sec-h"><h3>Hier verlierst du am meisten</h3><small>Mindestens 3 Partien, sortiert nach verlorenen Punkten</small></div>`;
  if(weak.length){
    const trainable=weak.filter(G=>G.id);
    if(trainable.length)html+=`<div class="okmsg" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><span>Erstelle aus deinen ${trainable.length} schwächsten Eröffnungen einen Trainingsplan. Sie kommen ins Repertoire und die kritischen Varianten werden sofort fällig.</span><button class="btn grn" id="planBtn">Trainingsplan erstellen</button></div>`;
    html+=`<div class="grid3">${weak.map(G=>{const o=G.id?byId(G.id):null;
      return `<div class="wkc"><div class="wkc-top"><span class="kchip ${G.color}"></span><div style="min-width:0"><h4>${esc(G.name)}</h4><div class="sub">Mit ${G.color==="w"?"Weiß":"Schwarz"} · ${G.n} Partien${G.alias&&G.alias!==G.name?" · "+esc(G.alias):""}</div></div><div class="pct">${pct(G.score)}<small>Punkte</small></div></div>
      ${wdl(G)}<div class="wdl-t"><span>${G.w} S</span><span>${G.d} R</span><span>${G.l} N</span></div>${trendHtml(G)}
      ${G.topDev?`<div class="dev">${devText(G.topDev)}</div>`:""}
      ${o?`<button class="btn grn" data-train="${G.id}" data-line="${G.focusLine===null?"":G.focusLine}">${G.focusLine!==null?"Üben: "+esc(o.lines[G.focusLine].n):"Jetzt üben"}</button>`:`<div class="hint">Für diese Eröffnung gibt es noch keine Übung. Du kannst sie unter „Eigene Variante“ selbst anlegen.</div>`}</div>`}).join("")}</div>`;
  }else html+=`<div class="card">Keine Eröffnung mit mindestens 3 Partien unter 50 % – stark!</div>`;
  // Gegner
  html+=`<div class="sec-h"><h3>Was deine Gegner gegen dich spielen</h3><small>Häufigste Antworten und passende Übungen</small></div><div class="grid3">`;
  for(const c of ["w","b"]){
    const rows=Object.values(R.opp[c]).sort((a,b)=>b.n-a.n).slice(0,5);if(!rows.length)continue;
    html+=`<div class="card"><h3>${c==="w"?"Wenn du Weiß spielst":"Wenn du Schwarz spielst"}</h3>${rows.map(O=>{const sc=(O.w+O.d/2)/O.n;const sg=suggestFor(c,O.mv);
      return `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(fmtMoves(O.mv))}</b><span class="sub">${O.n} Partien · <span class="${sc<.45?"score-bad":sc>.55?"score-good":""}">${pct(sc)}</span></span></div>${wdl(O)}${sg.length?`<div class="chips" style="margin-top:6px">${sg.map(o=>`<button class="chip" data-train="${o.id}" data-line="${consistentIn(o,O.mv)[0]}">${esc(o.name)}</button>`).join("")}</div>`:`<div class="hint" style="margin-top:4px">Noch keine passende Übung.</div>`}</div>`}).join("")}</div>`;
  }
  html+=`</div>`;
  for(const c of ["w","b"]){
    const rows=R.list.filter(G=>G.color===c).sort((a,b)=>b.n-a.n);if(!rows.length)continue;
    html+=`<div class="sec-h"><h3>Alle Eröffnungen mit ${c==="w"?"Weiß":"Schwarz"}</h3><small>${rows.length} Gruppen</small></div><div class="tbl-wrap"><table><thead><tr><th>Eröffnung</th><th style="text-align:right">Partien</th><th>Bilanz</th><th style="text-align:right">Punkte</th><th></th></tr></thead><tbody>
    ${rows.map(G=>`<tr><td><div class="nm">${esc(G.name)}${G.id?"":" <small>(keine Übung)</small>"}</div></td><td class="num">${G.n}</td><td>${wdl(G)}</td><td class="num ${G.score<0.45?"score-bad":G.score>0.55?"score-good":""}">${pct(G.score)}</td><td style="text-align:right">${G.id?`<button class="mini" data-train="${G.id}" data-line="${G.focusLine===null?"":G.focusLine}">Üben</button>`:""}</td></tr>`).join("")}</tbody></table></div>`;
  }
  html+=`<p class="hint">Partien werden über ihre ersten Züge den Übungen zugeordnet. Partien, die früh vom Buch abweichen, erscheinen unter dem Namen der Eröffnung.</p>`;
  el.innerHTML=html;
  el.querySelectorAll("[data-train]").forEach(b=>b.onclick=()=>{const o=byId(b.dataset.train);const ln=b.dataset.line===""?null:+b.dataset.line;selectOpening(o,ln)});
  const pb=$("planBtn");if(pb)pb.onclick=()=>{
    const ks=[];weak.filter(G=>G.id).forEach(G=>{if(S.rep.indexOf(G.id)<0)S.rep.push(G.id);const o=byId(G.id);const fl=G.focusLine!==null?G.focusLine:0;
      [fl].concat(o.lines.map((l,i)=>i).filter(i=>i!==fl&&P(o.id,i)<2).slice(0,2)).forEach(i=>{const k=lk(o.id,i);S.srs[k]=Object.assign({iv:0,ef:2.5,reps:0,lapses:0},S.srs[k]||{},{due:0});ks.push(k)})});
    save("rep");save("srs");S.daily=null;save("daily");toast("Trainingsplan erstellt: "+ks.length+" Varianten");startSession("plan",ks,"Trainingsplan")};
}
function anaStatus(t,txt,frac){$("anaStatus").hidden=false;$("anaStTitle").textContent=t;$("anaStText").textContent=txt||"";$("anaBar").style.width=Math.round((frac||0)*100)+"%"}
function anaError(msg){$("anaErr").hidden=false;$("anaErr").innerHTML=msg}
function finishAna(games,user,label){
  const R=analyze(games);R.user=user;R.label=label;
  const stats={};R.list.forEach(G=>{if(G.id){const s=stats[G.id]||(stats[G.id]={n:0,w:0,d:0,l:0});s.n+=G.n;s.w+=G.w;s.d+=G.d;s.l+=G.l}});
  S.ana={user,date:Date.now(),stats};save("ana");st.anaRuns++;saveStats();checkBadges();
  $("anaStatus").hidden=true;renderAna(R);renderList();
}
async function getJSON(url){const r=await fetch(url,{headers:{Accept:"application/json"}});if(r.status===404)throw new Error("notfound");if(r.status===429)throw new Error("ratelimit");if(!r.ok)throw new Error("http "+r.status);return r.json()}
async function runAnalysis(e){
  e.preventDefault();const user=$("anaUser").value.trim();if(!user)return;
  const months=+$("anaMonths").value,type=$("anaType").value;const tl={all:"alle Partien",bullet:"Bullet",blitz:"Blitz",rapid:"Schnellschach",daily:"Täglich"}[type];
  $("anaErr").hidden=true;$("anaResult").innerHTML="";$("anaGo").disabled=true;
  const label=`${anaSource==="lichess"?"Lichess":"Chess.com"} · ${months===1?"letzter Monat":"letzte "+months+" Monate"} · ${tl}`;
  try{
    const games=[];let realName=user;
    if(anaSource==="lichess"){
      anaStatus("Verbinde mit Lichess …","Partien werden geladen.",.1);
      const since=Date.now()-months*30*DAY;const perf={bullet:"bullet,ultraBullet",blitz:"blitz",rapid:"rapid,classical",daily:"correspondence"}[type];
      const url=`https://lichess.org/api/games/user/${encodeURIComponent(user)}?since=${since}&max=500&moves=true&opening=true${perf?"&perfType="+perf:""}`;
      const r=await fetch(url,{headers:{Accept:"application/x-ndjson"}});
      if(r.status===404)throw new Error("notfound");if(r.status===429)throw new Error("ratelimit");if(!r.ok)throw new Error("http "+r.status);
      const txt=await r.text();const lines=txt.split("\n").filter(Boolean);
      lines.forEach((ln,i)=>{try{const g=JSON.parse(ln);const n=normLichess(g,user);if(n){games.push(n);realName=n.name}}catch(_){}});
      anaStatus("Werte aus …",`${games.length} Partien`,1);
      if(!lines.length)throw new Error("empty");
    }else{
      anaStatus("Verbinde mit Chess.com …","Lade die Liste deiner Monatsarchive.",.03);
      const arch=await getJSON(`https://api.chess.com/pub/player/${encodeURIComponent(user.toLowerCase())}/games/archives`);
      const urls=(arch.archives||[]).slice(-months);if(!urls.length)throw new Error("empty");
      for(let i=0;i<urls.length;i++){
        const ym=urls[i].split("/").slice(-2).join("-");anaStatus(`Lade Partien (${i+1}/${urls.length})`,`Monat ${ym} · bisher ${games.length} Partien`,(i+.5)/urls.length);
        const data=await getJSON(urls[i]);
        for(const g of (data.games||[])){if(type!=="all"&&g.time_class!==type)continue;const n=normApiGame(g,user);if(n){games.push(n);realName=n.name}}
      }
    }
    finishAna(games,realName,label);
  }catch(err){
    $("anaStatus").hidden=true;const m=String(err&&err.message||err);const site=anaSource==="lichess"?"Lichess":"Chess.com";
    if(m==="notfound")anaError(`Den Benutzer <b>${esc(user)}</b> gibt es auf ${site} nicht. Prüfe die Schreibweise.`);
    else if(m==="empty")anaError(`Für <b>${esc(user)}</b> wurden keine öffentlichen Partien gefunden.`);
    else if(m==="ratelimit")anaError(`${site} meldet zu viele Anfragen. Warte eine Minute und versuch es erneut.`);
    else anaError(`${site} ist gerade nicht erreichbar. Prüfe die Internetverbindung oder lade deine Partien als PGN-Datei hoch.`);
  }finally{$("anaGo").disabled=false}
}
function runPgn(e){
  const f=e.target.files&&e.target.files[0];if(!f)return;const user=$("anaUser").value.trim();$("anaErr").hidden=true;
  if(!user){anaError("Trag zuerst oben deinen Benutzernamen ein, damit klar ist, welche Seite du gespielt hast.");e.target.value="";return}
  const rd=new FileReader();
  rd.onload=()=>{const txt=String(rd.result).replace(/\r/g,"");const parts=txt.split(/\n\s*\n(?=\[Event )/);const type=$("anaType").value;const games=[];
    for(const p of parts){const n=normPgnGame(p,user);if(n&&(type==="all"||n.tc===type))games.push(n)}
    if(!games.length){anaError(`In der Datei wurden keine Partien von <b>${esc(user)}</b> gefunden.`);return}
    finishAna(games,games[0].name||user,`PGN-Datei · ${games.length} Partien`)};
  rd.readAsText(f);
}

/* ---------------- Start ---------------- */
applySettings();
st.badges=BADGES.filter(b=>b.ok()).map(b=>b.id);saveStats();
renderNav();
const last=store.get("et-last",null);
try{selectOpening(byId(last)||ALL[0])}catch(err){window.__showErr(String(err&&err.stack||err))}
const hashView={"#analyse":"ana","#quiz":"quiz","#statistik":"stats","#partien":"games","#einstellungen":"settings"}[location.hash];
if(hashView)showView(hashView);else if(location.hash==="#taeglich")startSession("daily");
window.__ET={fen:()=>shown.fen(),orient:()=>orient(),mode:()=>mode,analyze,normPgnGame,normLichess,pgnMoves,famFromUrl,famFromName,explain,matchGame,ALL:()=>ALL,S,startSession,openGame,openEditor,startEngine,showView,parseMoveQuery,dueKeys,srsReview};
})();
