/* Eröffnungstrainer – App-Logik (Version 4) */
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
const MON=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const fmtDate=t=>{const d=new Date(t);return d.getDate()+". "+MON[d.getMonth()]+" "+d.getFullYear()};
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9äöüß]+/g,"-").replace(/^-|-$/g,"")||"x";

const SV=(p,w)=>`<svg ${w?`width="${w}" height="${w}"`:""} viewBox="0 0 24 24" fill="currentColor">${p}</svg>`;
const ICON={
  book:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  no:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',
  face:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="8" r="4.2"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg>',
  cpu:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M9 2h2v2h2V2h2v2h2a2 2 0 0 1 2 2v2h2v2h-2v2h2v2h-2v2a2 2 0 0 1-2 2h-2v2h-2v-2h-2v2H9v-2H7a2 2 0 0 1-2-2v-2H3v-2h2v-2H3V8h2V6a2 2 0 0 1 2-2h2zm-1 6v8h8V8z"/></svg>',
  bookL:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 8v9.3c-1.8-1-4.2-1.4-7-1.2V6.9c2.8-.2 5.2.2 7 1.1z"/></svg>',
  crown:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 11H5zm2 13h14v2H5z"/></svg>',
  pen:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M3 17.3V21h3.7L17.8 9.9l-3.7-3.7zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"/></svg>',
  puzzle:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.5a2.7 2.7 0 0 1 0 5.4H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.7 2.7 0 0 1 5.4 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/></svg>',
  medal:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h4l1 3 1-3h4l-3 7a6 6 0 1 1-4 0zM12 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 1.5 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>'
};
const NI={
  board:SV('<path d="M3 3h18v18H3zm2 2v4h4V5zm4 4v4h4V9zm4-4v4h4V5zm-8 8v4h4v-4zm8 0v4h4v-4z"/>'),
  learn:SV('<path d="M12 3 1 9l11 6 9-4.9V17h2V9zM5 13.2v4L12 21l7-3.8v-4L12 17z"/>'),
  list:SV('<path d="M3 5h2v2H3zm4 0h14v2H7zM3 11h2v2H3zm4 0h14v2H7zm-4 6h2v2H3zm4 0h14v2H7z"/>'),
  chess:SV('<path d="M4 20V10h3v10zm6.5 0V4h3v16zM17 20v-7h3v7z"/>'),
  profile:SV('<circle cx="12" cy="8" r="4.2"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/>'),
  daily:SV('<path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm-2 8h14v10H5zm5.6 8.4-3.3-3.3 1.4-1.4 1.9 1.9 4.6-4.6 1.4 1.4z"/>'),
  review:SV('<path d="M12 4a8 8 0 0 0-7.9 7H1l4 4 4-4H6.1A6 6 0 1 1 12 18a6 6 0 0 1-4.2-1.8l-1.4 1.4A8 8 0 1 0 12 4zm-1 4v5l4.3 2.5.8-1.3-3.6-2.1V8z"/>'),
  target:SV('<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-14a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2z"/>'),
  traps:SV('<path d="M12 2 1 21h22zm-1 7h2v6h-2zm0 8h2v2h-2z"/>'),
  bolt:SV('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  eye:SV('<path d="M2 5.3 3.3 4 20 20.7 18.7 22l-3.1-3.1A11 11 0 0 1 12 19.5C6.5 19.5 2.7 15 1.5 12a12 12 0 0 1 4-5zM12 4.5c5.5 0 9.3 4.5 10.5 7.5a12.3 12.3 0 0 1-3.3 4.5l-3-3A4.5 4.5 0 0 0 10.5 7.8L8.4 5.6A10.7 10.7 0 0 1 12 4.5z"/>'),
  quiz:SV('<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17h-2v-2h2zm2.1-7.8-.9.9c-.7.7-1.2 1.3-1.2 2.9h-2v-.5c0-1.1.4-2.1 1.2-2.8l1.2-1.3A2 2 0 1 0 10 9H8a4 4 0 1 1 7.1 2.2z"/>'),
  games:SV('<path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 11H5zm2 13h14v2H5z"/>'),
  mistake:SV('<path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.5a2.7 2.7 0 0 1 0 5.4H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.7 2.7 0 0 1 5.4 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/>'),
  king:SV('<path d="M11 2h2v2h2v2h-2v2.1A4 4 0 0 1 16 12c0 1.2-.5 2.3-1.3 3H17v2H7v-2h2.3A4 4 0 0 1 8 12a4 4 0 0 1 3-3.9V6H9V4h2zM6 19h12v3H6z"/>'),
  edit:SV('<path d="M3 17.3V21h3.7L17.8 9.9l-3.7-3.7zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"/>'),
  import:SV('<path d="M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z"/>'),
  share:SV('<path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z"/>'),
  settings:SV('<path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.7 1.7 1l.4 2.6h4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.5zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>')
};

/* ---------------- Speicher ---------------- */
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const KEYS=["prog","srs","pos","rep","daily","streak","stats","set","custom","ana","puz"];
const S={
  prog:store.get("et-prog",{}),srs:store.get("et-srs",{}),pos:store.get("et-pos",{}),rep:store.get("et-rep",[]),daily:store.get("et-daily",null),
  streak:store.get("et-streak",{last:null,n:0,best:0}),stats:store.get("et-stats",{}),
  set:Object.assign({theme:"green",pieces:"cburnett",sound:store.get("et-sound",true),ideas:true,coords:true,sf:5,design:"dark",evalbar:false,realistic:true,blitzSec:5,liToken:"",ghToken:"",gist:""},store.get("et-set",{})),
  custom:store.get("et-custom",{w:[],b:[]}),ana:store.get("et-ana",null),puz:store.get("et-puz",[])
};
let savedAt=store.get("et-savedAt",0);
const save=k=>{store.set("et-"+k,S[k]);savedAt=Date.now();store.set("et-savedAt",savedAt)};
const st=S.stats;
st.op=st.op||{};st.hard=st.hard||{};st.quiz=st.quiz||{n:0,ok:0};st.engine=st.engine||0;st.anaRuns=st.anaRuns||0;st.games=st.games||{};st.days=st.days||{};st.badges=st.badges||[];
st.reviews=st.reviews||0;st.puzOk=st.puzOk||0;st.blitz=st.blitz||0;st.blind=st.blind||0;st.ends=st.ends||{};st.imports=st.imports||0;
const P=(id,i)=>(S.prog[id]||{})[i]||0;
const lk=(id,i)=>id+"#"+i;
const pk=k=>{const j=k.lastIndexOf("#");return [k.slice(0,j),+k.slice(j+1)]};
const Pk=k=>{const [id,i]=pk(k);return P(id,i)};

/* ---------------- Daten ---------------- */
const BASE=OPENINGS.concat(OPENINGS_NEW,OPENINGS_TRAPS).map(o=>{
  const Pl=(typeof PLANS!=="undefined"&&PLANS[o.id])||{};
  const lines=o.lines.map((L,i)=>{const notes=L[3]||(Pl.notes&&Pl.notes[i])||{};
    return {n:L[0],m:L[1].split(" "),p:L[2]||(Pl.lp&&Pl.lp[i])||"",notes,trap:o.id.indexOf("fallen_")===0||(o.g==="x"&&(/Falle|Matt/.test(L[0])||Object.keys(notes).length>0))}});
  return Object.assign({},o,{plan:o.plan||Pl.plan||[],lines});
});
let ALL=[];
function buildAll(){
  const cust=[];
  ["w","b"].forEach(s=>{const groups={};(S.custom[s]||[]).forEach((l,ci)=>{const g=l.g||"Meine Varianten";(groups[g]=groups[g]||[]).push(Object.assign({},l,{ci}))});
    Object.keys(groups).forEach(g=>cust.push({id:"custom_"+s+"_"+slug(g),g:"c",side:s,grp:g,name:g+" · "+(s==="w"?"Weiß":"Schwarz"),eco:"eigene",d:"Von dir eingespielte oder importierte Varianten.",plan:["Eigene Varianten – den Plan hast du selbst notiert."],
      lines:groups[g].map(l=>({n:l.n,m:l.m.slice(),p:l.p||"",notes:{},trap:false,ci:l.ci}))}))});
  ALL=BASE.concat(cust);
}
// alte Struktur (eine Gruppe pro Seite) bleibt kompatibel
buildAll();
const byId=id=>ALL.find(o=>o.id===id)||(id==="custom_w"||id==="custom_b"?ALL.find(o=>o.id.indexOf(id+"_")===0):null);
const GROUPS=[["w","Mit Weiß"],["b","Mit Schwarz"],["x","Gambits & Fallen"],["c","Eigene Varianten"]];
const trapKeys=()=>{const r=[];ALL.forEach(o=>o.lines.forEach((l,i)=>{if(l.trap)r.push(lk(o.id,i))}));return r};
function consistentIn(o,h){const r=[];o.lines.forEach((l,i)=>{if(l.m.length<h.length)return;for(let k=0;k<h.length;k++)if(strip(l.m[k])!==strip(h[k]))return;r.push(i)});return r}
function bookMovesIn(o,h){const s=new Set();consistentIn(o,h).forEach(i=>{const m=o.lines[i].m[h.length];if(m)s.add(strip(m))});return [...s]}
const fmtMoves=(arr,start)=>{start=start||0;let s="";arr.forEach((m,i)=>{const p=start+i;if(p%2===0)s+=(p/2+1)+"."+de(m)+" ";else s+=(i===0?(Math.floor(p/2)+1)+"..."+de(m):de(m))+" "});return s.trim()};
const anyBook=h=>ALL.some(o=>o.g!=="c"&&consistentIn(o,h).length&&o.lines.some(l=>l.m.length>h.length-1));
const sanToUci=(fen,san)=>{const g=new Chess(fen);const m=g.moves({verbose:true}).find(x=>strip(x.san)===strip(san));return m?m.from+m.to+(m.promotion||""):null};
const histUci=h=>{const g=new Chess();return h.map(s=>{const m=g.move(s);return m.from+m.to+(m.promotion||"")})};

/* ---------------- Toast ---------------- */
const toastEl=document.createElement("div");
toastEl.style.cssText="position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:#fff;color:#262421;padding:10px 16px;border-radius:8px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.4);z-index:100;max-width:calc(100vw - 32px);display:none";
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
  else if(kind==="tick"){tone(t,1200,.04,.06,"square")}
}
const playSound=r=>sfx(/[+#]/.test(r.san)?"check":r.captured?"capture":"move");

/* ---------------- Wiederholung (SM-2) für Varianten und Stellungen ---------------- */
function sm2(s,q){
  s=s||{iv:0,ef:2.5,reps:0,lapses:0};
  if(q<3){s.reps=0;s.lapses=(s.lapses||0)+1;s.iv=1}else{s.reps++;s.iv=s.reps===1?1:s.reps===2?3:Math.max(1,Math.round(s.iv*s.ef))}
  s.ef=Math.max(1.3,s.ef+(0.1-(5-q)*(0.08+(5-q)*0.02)));s.due=startOfDay(Date.now())+s.iv*DAY;s.last=Date.now();return s;
}
function srsReview(k,q){S.srs[k]=sm2(S.srs[k],q);save("srs")}
const endToday=()=>startOfDay(Date.now())+DAY-1;
const isDue=k=>{const s=S.srs[k];return !!(s&&s.due<=endToday())};
function posReview(id,pre,q){const k=id+"|"+pre.join(" ");const s=sm2(S.pos[k],q);s.id=id;s.pre=pre.slice();s.n=(s.n||0)+1;if(q<3)s.err=(s.err||0)+1;S.pos[k]=s;save("pos")}
const duePositions=()=>Object.entries(S.pos).filter(([k,s])=>byId(s.id)&&(s.due<=endToday()||((s.err||0)/(s.n||1))>=.34)).sort((a,b)=>((b[1].err||0)/(b[1].n||1))-((a[1].err||0)/(a[1].n||1))).map(([k])=>k);
function scopeOpenings(){const r=S.rep.map(byId).filter(Boolean);return r.length?r:ALL}
function dueKeys(){const r=[];ALL.forEach(o=>o.lines.forEach((l,i)=>{const k=lk(o.id,i);if(isDue(k))r.push(k)}));return r.sort((a,b)=>S.srs[a].due-S.srs[b].due)}
function newKeys(n,pool0){
  const r=[];const pools=pool0?[pool0]:[scopeOpenings()];
  if(!pool0){if(S.ana&&S.ana.stats)pools.push(Object.keys(S.ana.stats).map(byId).filter(Boolean));pools.push(ALL.filter(o=>o.g!=="c"))}
  for(const pool of pools){
    const ks=shuffle([].concat(...pool.map(o=>o.lines.map((l,i)=>lk(o.id,i))))).filter(k=>!S.srs[k]&&Pk(k)<2&&r.indexOf(k)<0);
    for(const k of ks){if(r.length>=n)break;r.push(k)}if(r.length>=n)break;
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
  ensureDaily();if(S.daily.queue.indexOf(k)<0||S.daily.done.indexOf(k)>=0)return;
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
  {id:"review",t:"Selbstkritisch",d:"5 eigene Partien mit Game Review geprüft",ok:()=>st.reviews>=5},
  {id:"puz",t:"Rätselknacker",d:"20 Rätsel und eigene Fehler gelöst",ok:()=>st.puzOk>=20},
  {id:"blitz",t:"Blitzschnell",d:"10 Varianten im Blitz-Drill fehlerfrei",ok:()=>st.blitz>=10},
  {id:"blind",t:"Blindspieler",d:"5 Varianten blind fehlerfrei",ok:()=>st.blind>=5},
  {id:"end",t:"Endspieltechniker",d:"Alle Endspiel-Übungen gespielt",ok:()=>ENDGAMES.every(e=>st.ends[e.id])},
  {id:"custom",t:"Theoretiker",d:"Eine eigene Variante gespeichert oder importiert",ok:()=>(S.custom.w.length+S.custom.b.length)>=1},
  {id:"hist",t:"Schachhistoriker",d:"Alle Musterpartien bis zum Ende nachgespielt",ok:()=>GAMES.every(g=>st.games[g.id])}
];
function checkBadges(){
  const got=BADGES.filter(b=>{try{return b.ok()}catch(e){return false}}).map(b=>b.id);const fresh=got.filter(id=>st.badges.indexOf(id)<0);
  if(fresh.length){st.badges=got;saveStats();const b=BADGES.find(x=>x.id===fresh[0]);setTimeout(()=>{toast("Neues Abzeichen: "+b.t);sfx("badge")},700)}
}

/* ---------------- Endspiele ---------------- */
const ENDGAMES=[
  {id:"kq",t:"Matt mit Dame",fen:"8/8/8/3k4/8/8/8/3QK3 w - - 0 1",side:"w",goal:"Setze den schwarzen König mit Dame und König matt. Dränge ihn mit der Dame an den Rand, ohne Patt zu geben.",plan:["Die Dame schneidet den König ab – immer einen Springerzug entfernt.","Der eigene König kommt zur Unterstützung.","Vorsicht vor Patt, wenn der König am Rand steht."]},
  {id:"kr",t:"Matt mit Turm",fen:"8/8/8/4k3/8/8/8/R3K3 w - - 0 1",side:"w",goal:"Setze mit Turm und König matt. Der Turm verkleinert die Box, der König geht in Opposition.",plan:["Der Turm schneidet eine Reihe oder Linie ab.","Der König stellt sich dem gegnerischen König gegenüber (Opposition).","Dann Schach mit dem Turm und die Box wird kleiner."]},
  {id:"lucena",t:"Lucena-Stellung",fen:"1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1",side:"w",goal:"Gewinne mit dem Brückenbau: Td1+, dann den Turm auf die vierte Reihe, um die Schachs abzuschirmen.",plan:["Zuerst den schwarzen König mit Td1+ weiter abdrängen.","Turm auf die vierte Reihe (Td4) – das ist die Brücke.","Mit dem König heraus und Schachs mit dem Turm abblocken."]},
  {id:"philidor",t:"Philidor-Stellung",fen:"4k3/8/r7/3PK3/8/8/8/7R b - - 0 1",side:"b",goal:"Halte das Remis als Schwarz: Turm auf der sechsten Reihe, bis der weiße Bauer vorrückt – dann Schachs von hinten.",plan:["Der Turm bleibt auf der sechsten Reihe und hält den weißen König fern.","Sobald der Bauer auf die sechste Reihe zieht, geht der Turm auf die erste Reihe.","Von hinten Schach geben – der weiße König findet keinen Schutz."]},
  {id:"berlin",t:"Berliner Endspiel",moves:"e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8",side:"w",goal:"Das Endspiel aus der Berliner Mauer: Spiele mit Weiß auf die Bauernmehrheit am Königsflügel.",plan:["Nc3, h3 und Ld2 oder Tad1 – solide entwickeln.","Mehrheit am Königsflügel mit f4–f5 oder g4 mobilisieren.","Schwarz hat das Läuferpaar – Stellung nicht zu früh öffnen."]}
];

/* ---------------- Stockfish 17.1 (gleicher Server) mit Rückfall auf Stockfish 10 ---------------- */
const SF_LOCAL="engine/stockfish-17.1-lite-single-03e3232.js";
const SF_CDN=["https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js","https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js"];
let sfW=null,sfLoading=null,sfChain=Promise.resolve(),sfName="";
function initWorker(w,ms){return new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error("Zeitüberschreitung")),ms);w.onmessage=e=>{if(String(e.data).indexOf("uciok")>=0){clearTimeout(t);res(w)}};w.onerror=e=>{clearTimeout(t);rej(e)};w.postMessage("uci")})}
function loadSF(){
  if(sfW)return Promise.resolve(sfW);if(sfLoading)return sfLoading;
  sfLoading=(async()=>{
    try{const w=new Worker(SF_LOCAL);await initWorker(w,30000);sfW=w;sfName="Stockfish 17.1";return w}catch(e){}
    for(const u of SF_CDN){try{const r=await fetch(u);if(!r.ok)continue;const txt=await r.text();const w=new Worker(URL.createObjectURL(new Blob([txt],{type:"application/javascript"})));await initWorker(w,20000);sfW=w;sfName="Stockfish 10";return w}catch(e){}}
    sfLoading=null;throw new Error("Stockfish nicht erreichbar");
  })();
  return sfLoading;
}
/* Ergebnis: best (UCI), score aus Sicht der Seite am Zug, pv */
function sfRun(fen,opt){
  opt=opt||{};
  const job=()=>new Promise(res=>{
    let score=null,pv=null;const guard=setTimeout(()=>{try{sfW.postMessage("stop")}catch(e){}},(opt.ms||400)+6000);
    sfW.onmessage=e=>{const s=String(e.data);const m=s.match(/score (cp|mate) (-?\d+)/);if(m){score={t:m[1],v:+m[2]};const p=s.match(/ pv (.+)$/);if(p)pv=p[1].split(" ")}
      if(s.indexOf("bestmove")===0){clearTimeout(guard);res({best:s.split(" ")[1],score,pv})}};
    sfW.postMessage("setoption name Skill Level value "+(opt.skill==null?20:opt.skill));
    sfW.postMessage("position fen "+fen);sfW.postMessage(opt.depth?"go depth "+opt.depth:"go movetime "+(opt.ms||400));
  });
  const p=sfChain.then(()=>loadSF()).then(job);sfChain=p.catch(()=>{});return p;
}
/* Gewinnwahrscheinlichkeit (Lichess-Formel) aus Sicht von Weiß */
const cpOf=(sc,turn)=>{if(!sc)return 0;let v=sc.t==="mate"?(sc.v>0?10000-sc.v*10:-10000-sc.v*10):sc.v;return turn==="w"?v:-v};
const winPct=cp=>50+50*(2/(1+Math.exp(-0.00368208*Math.max(-1500,Math.min(1500,cp))))-1);
const fmtEval=(cp,mateTxt)=>mateTxt||((cp===0?"0.0":(cp>0?"+":"")+(cp/100).toFixed(1)));
