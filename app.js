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
const SKEL='<div class="skel"></div><div class="skel w80"></div><div class="skel w60"></div>';
/* Gespeicherte Werte mit falschem Typ (alte Versionen, kaputte Sicherung) werden durch den Standardwert ersetzt */
const sameType=(v,d)=>v!==null&&typeof v===typeof d&&Array.isArray(v)===Array.isArray(d);
function fixT(o,def){for(const k in def){if(def[k]!==null&&def[k]!==undefined&&!sameType(o[k],def[k]))o[k]=def[k]}return o}
const store={get(k,d){try{const s=localStorage.getItem(k);if(s==null)return d;const v=JSON.parse(s);return d!=null&&!sameType(v,d)?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const KEYS=["prog","srs","pos","rep","daily","streak","stats","set","custom","ana","puz"];
const S={
  prog:store.get("et-prog",{}),srs:store.get("et-srs",{}),pos:store.get("et-pos",{}),rep:store.get("et-rep",[]),daily:store.get("et-daily",null),
  streak:store.get("et-streak",{last:null,n:0,best:0}),stats:store.get("et-stats",{}),
  set:Object.assign({revMs:300,theme:"green",pieces:"cburnett",sound:store.get("et-sound",true),ideas:true,coords:true,sf:5,design:"dark",evalbar:false,realistic:true,blitzSec:5,liToken:"",ghToken:"",gist:"",autoNext:true,autoQueen:false,swipe:true,font:100,calm:false,autoSync:true,tbHide:true},store.get("et-set",{})),
  custom:store.get("et-custom",{w:[],b:[]}),ana:store.get("et-ana",null),puz:store.get("et-puz",[])
};
{const SD={revMs:300,theme:"green",pieces:"cburnett",sound:true,ideas:true,coords:true,sf:5,design:"dark",evalbar:false,realistic:true,blitzSec:5,liToken:"",ghToken:"",gist:"",autoNext:true,autoQueen:false,swipe:true,font:100,calm:false,autoSync:true,tbHide:true};fixT(S.set,SD)}
fixT(S.streak,{last:"",n:0,best:0});if(S.streak.last==="")S.streak.last=null;
fixT(S.custom,{w:[],b:[]});S.custom.w=S.custom.w.filter(l=>l&&Array.isArray(l.m));S.custom.b=S.custom.b.filter(l=>l&&Array.isArray(l.m));
S.rep=S.rep.filter(x=>typeof x==="string");S.puz=S.puz.filter(x=>x&&typeof x==="object"&&x.key);
if(S.daily&&(typeof S.daily!=="object"||!Array.isArray(S.daily.queue)||!Array.isArray(S.daily.done)))S.daily=null;
if(S.ana&&(typeof S.ana!=="object"||Array.isArray(S.ana)))S.ana=null;
let savedAt=store.get("et-savedAt",0);
const save=k=>{store.set("et-"+k,S[k]);savedAt=Date.now();store.set("et-savedAt",savedAt)};
const st=S.stats;
fixT(st,{op:{},hard:{},quiz:{n:0,ok:0},engine:0,anaRuns:0,games:{},days:{},badges:[]});
fixT(st,{reviews:0,puzOk:0,blitz:0,blind:0,ends:{},imports:0});
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
const histUci=h=>{const g=new Chess();return h.map(s=>{const m=g.move(s);return m.from+m.to+(m.promotion||"")})};

/* ---------------- Toast ---------------- */
const toastEl=document.createElement("div");toastEl.className="toast";toastEl.setAttribute("role","status");
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
    celebrate("streak",S.streak.n,"Tagestraining geschafft!");
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
  opt=opt||{};const multi=Math.max(1,opt.multi||1);
  const job=()=>new Promise(res=>{
    let score=null,pv=null;const lines=[];const guard=setTimeout(()=>{try{sfW.postMessage("stop")}catch(e){}},(opt.ms||400)+6000);
    sfW.onmessage=e=>{const s=String(e.data);
      if(s.indexOf("info")===0&&s.indexOf(" pv ")>0&&s.indexOf("bound")<0){const m=s.match(/score (cp|mate) (-?\d+)/);if(m){const k=+((s.match(/ multipv (\d+)/)||[0,1])[1]);const d=+((s.match(/ depth (\d+)/)||[0,0])[1]);const p=s.match(/ pv (.+)$/);
        lines[k-1]={score:{t:m[1],v:+m[2]},pv:p?p[1].split(" "):[],depth:d};if(k===1){score=lines[0].score;pv=lines[0].pv}}}
      if(s.indexOf("bestmove")===0){clearTimeout(guard);res({best:s.split(" ")[1],score,pv,lines:lines.filter(Boolean)})}};
    sfW.postMessage("setoption name Skill Level value "+(opt.skill==null?20:opt.skill));
    sfW.postMessage("setoption name MultiPV value "+multi);
    sfW.postMessage("position fen "+fen);sfW.postMessage(opt.depth?"go depth "+opt.depth:"go movetime "+(opt.ms||400));
  });
  const p=sfChain.then(()=>loadSF()).then(job);sfChain=p.catch(()=>{});return p;
}
/* Gewinnwahrscheinlichkeit (Lichess-Formel) aus Sicht von Weiß */
const cpOf=(sc,turn)=>{if(!sc)return 0;let v=sc.t==="mate"?(sc.v>0?10000-sc.v*10:-10000-sc.v*10):sc.v;return turn==="w"?v:-v};
const winPct=cp=>50+50*(2/(1+Math.exp(-0.00368208*Math.max(-1500,Math.min(1500,cp))))-1);
const fmtEval=(cp,mateTxt)=>mateTxt||((cp===0?"0.0":(cp>0?"+":"")+(cp/100).toFixed(1)));

/* ================= Brett-Zustand ================= */
let op=null,mode="train",hist=[],fens=[],mvs=[],flags=[],view=0,shown=null,target=null,forced=null,busy=false,done=false,mistakes=0,usedHelp=false,hintLvl=0,sel=null,timer=null,lock=false,badge=null,liveStatus=null,curStatus=null,tab="ex",flipped=false,sess=null,game=null,sfStart=0,sfEval=null,drill=null,puz=null,tried=new Set(),blindOn=false,peeked=false,vtab="list",evalCp=null,evalTok=0,blitzT=null,blitzLeft=0,startFen=null;
const boardEl=$("board"),sqsEl=$("sqs"),pcsEl=$("pcs"),ovl=$("ovl"),ideasEl=$("ideas"),marksEl=$("marks"),badgesEl=$("badges");
const live=()=>view===hist.length;
const consistent=h=>op&&op.lines?consistentIn(op,h):[];
const bookMoves=h=>bookMovesIn(op,h);
const findMove=(g,san)=>g.moves({verbose:true}).find(x=>strip(x.san)===strip(san));
const userTurnShown=()=>shown&&shown.turn()===op.side;
function baseOrient(){if(mode==="replay")return game&&game.orient||"w";if(mode==="edit")return $("edSide").value;return op.side}
const orient=()=>flipped?(baseOrient()==="w"?"b":"w"):baseOrient();
function expected(){if(mode==="puzzle"){const k=hist.length-(puz&&puz.base||0);return puz&&puz.sol[k]?[strip(puz.sol[k])]:[]}return bookMoves(hist.slice(0,view))}

function pickTarget(){
  const c=consistent(hist);if(!c.length)return null;
  if(forced!==null&&c.indexOf(forced)>=0)return forced;
  if(target!==null&&c.indexOf(target)>=0)return target;
  const fresh=c.filter(i=>P(op.id,i)<2);const due=c.filter(i=>isDue(lk(op.id,i)));const pool=due.length?due:fresh.length?fresh:c;
  return rnd(pool);
}
function resetBoard(fen){
  sfEnd=null;clearTimeout(timer);stopBlitz();cancelAuto();if(wrongT){clearTimeout(wrongT);wrongT=null;wrongRevert=null}const g=new Chess(fen||undefined);startFen=fen||null;
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
  if(!live()){clearTimeout(timer);busy=false;truncate(view);done=false;target=null;mistakes++;if(sfEnd){sfEnd=null;renderChrome()}}
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
  if(mode==="puzzle")reportPuzzle(false);
  const myMode=mode;
  wrongRevert=()=>{clearTimeout(wrongT);wrongT=null;wrongRevert=null;if(mode!==myMode){lock=false;return}shown=keep;badge=null;lock=false;render({back:r});boardEl.classList.remove("shake");void boardEl.offsetWidth;boardEl.classList.add("shake")};
  wrongT=setTimeout(wrongRevert,750);
}
let wrongT=null,wrongRevert=null;
function finish(){
  done=true;stopBlitz();const i=target;const k=lk(op.id,i);const clean=mistakes===0&&!usedHelp;const firstClean=clean&&P(op.id,i)<2;
  S.prog[op.id]=S.prog[op.id]||{};S.prog[op.id][i]=Math.max(P(op.id,i),clean?2:1);save("prog");
  srsReview(k,clean?5:mistakes<=1?3:1);
  const s=opStat(op.id);s.att++;if(clean)s.clean++;st.days[today()]=(st.days[today()]||0)+1;
  if(clean&&sess&&sess.blitz)st.blitz++;if(clean&&blindOn&&!peeked)st.blind++;saveStats();
  if(badge&&badge.ply===hist.length)badge.type="ok";
  if(sess){sess.res.push({k,clean});if(sess.type==="daily"){markDailyDone(k);const qk=sess.queue[sess.idx];if(qk&&qk!==k)markDailyDone(qk)}}else markDailyDone(k);
  const nxt=S.srs[k]?Math.round((S.srs[k].due-startOfDay(Date.now()))/DAY):1;
  setStatus("done","Variante geschafft: "+op.lines[i].n,(clean?"Fehlerfrei gespielt.":`Mit ${mistakes} ${mistakes===1?"Fehler":"Fehlern"} – sie kommt bald wieder.`)+` Nächste Wiederholung in ${nxt} ${nxt===1?"Tag":"Tagen"}.`);
  setTimeout(()=>sfx("done"),180);
  if(forced===i&&!sess)forced=null;
  render();renderChrome();renderList();renderTabbar();checkBadges();
  if(firstClean)confetti();
  scheduleAuto(sess?1500:2600);
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
  setTimeout(()=>sfx("done"),150);render();renderChrome();checkBadges();if(sess)scheduleAuto(1500);
}

/* ---- Rätsel (Tagesrätsel, eigene Fehler aus Game Review) ---- */
function startPuzzle(p){
  stopEngine();sess=sess&&(sess.type==="mine"||sess.type==="tactic")?sess:null;game=null;drill=null;puz=p;p.reported=false;mode="puzzle";flipped=false;
  resetBoard(p.fen||undefined);mode="puzzle";
  if(p.pre){for(const m of p.pre){const gg=new Chess(fens[hist.length]);const mv=findMove(gg,m);if(!mv)break;commit(mv,"g")}view=hist.length;shown=new Chess(fens[view])}
  p.base=hist.length;
  const g=new Chess(fens[view]);op={id:"__puz",g:"c",side:g.turn(),name:p.title,eco:p.eco||"Rätsel",d:p.sub||"",plan:[],lines:[]};
  if(curView!=="train")showView("train");buildSquares();renderChrome();render();
  setStatus("turn",p.prompt||"Finde den besten Zug",`${g.turn()==="w"?"Weiß":"Schwarz"} am Zug.`);
}
function reportPuzzle(ok){if(puz&&puz.onResult&&!puz.reported){puz.reported=true;return puz.onResult(ok)}return null}
function puzzleMove(mv,animate){
  const exp=expected();
  if(exp.indexOf(strip(mv.san))<0){
    // Matt in einem Zug ist immer richtig
    const t=new Chess(shown.fen());t.move(mv.san);if(!t.in_checkmate()){wrongMove(mv,animate,[]);return}
  }
  const r=commit(mv,"p");view=hist.length;shown=new Chess(fens[view]);sel=null;hintLvl=0;render(animate?{fwd:r}:null);playSound(r);
  if(hist.length-puz.base>=puz.sol.length||new Chess(fens[view]).in_checkmate()){
    done=true;const clean=mistakes===0&&!usedHelp;if(clean&&!puz.onResult)st.puzOk++;saveStats();
    if(puz.key){const pz=S.puz.find(x=>x.key===puz.key);if(pz){pz.tries=(pz.tries||0)+1;if(clean)pz.solved=(pz.solved||0)+1;save("puz")}}
    if(sess)sess.res.push({k:"puz",clean});
    setStatus("done",clean?"Gelöst!":"Gelöst – mit Hilfe",puz.after||"");sfx("done");
    const wasRep=puz.reported;const res=reportPuzzle(clean);if(!wasRep&&puz.onSolved)puz.onSolved(clean,res);
    render();renderChrome();checkBadges();if(sess)scheduleAuto(1500);return;
  }
  busy=true;setStatus("good","Richtig!","Der Gegner antwortet …");
  setTimeout(()=>{busy=false;if(mode!=="puzzle")return;const g=new Chess(fens[hist.length]);const m=findMove(g,puz.sol[hist.length-puz.base]);if(!m)return;const rr=commit(m,"b");view=hist.length;shown=new Chess(fens[view]);render({fwd:rr});playSound(rr);setStatus("turn","Weiter","Finde den nächsten Zug.")},500);
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
  if(sess.next){sess.next();return}
  sess.idx++;
  if(sess.idx>=sess.queue.length){
    const ok=sess.res.filter(r=>r.clean).length,n=sess.res.length,t=sess.title;sess=null;blindOn=false;applyBlind();renderChrome();
    if(n&&ok===n)confetti();
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
  if(!op)return;sfEnd=null;evalCp=null;mode="engine";done=false;sel=null;view=hist.length;shown=new Chess(fens[view]);sfStart=fromEnd?0:hist.length;sfEval=null;badge=null;
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
  let res,why;
  if(g.in_checkmate()){const winner=g.turn()==="w"?"b":"w";res=winner===op.side?"win":"loss";why="Schachmatt";t=res==="win"?"Matt – du hast gewonnen!":"Matt – Stockfish gewinnt";s=res==="win"?"Stark gespielt! Mit »Partie analysieren« siehst du deine besten Züge.":"Mit »Partie analysieren« siehst du, wo es kippte."}
  else{res="draw";why=g.in_stalemate()?"Patt":g.insufficient_material()?"zu wenig Material":g.in_threefold_repetition()?"Stellungswiederholung":"50-Züge-Regel";t="Remis";s=why+". Mit »Partie analysieren« siehst du die Bewertung jedes Zugs."}
  if(op.endId){st.ends[op.endId]=true;saveStats()}
  endEngine(res,why);setStatus(res==="win"?"done":res==="draw"?"view":"bad",t,s);return true;
}
let sfEnd=null;
function endEngine(res,why){if(mode!=="engine")return;sfEnd={res:res||"loss",why:why||"Aufgabe",id:"sf-"+Date.now(),n:hist.length};if(hist.length-sfStart>=8){st.engine++;saveStats();checkBadges()}if(op.endId){st.ends[op.endId]=true;saveStats();checkBadges()}sfToken++;busy=false;mode="train";done=true;renderChrome();render()}
function stopEngine(){if(mode==="engine"){sfToken++;busy=false;try{sfW&&sfW.postMessage("stop")}catch(e){}}}
$("sfBtn").onclick=()=>startEngine();
$("sfStop").onclick=()=>{const b=$("sfStop");if(mode!=="engine")return;
  if(!b.dataset.sure){b.dataset.sure="1";b.textContent="Wirklich aufgeben?";clearTimeout(b._t);b._t=setTimeout(()=>{delete b.dataset.sure;b.textContent="Aufgeben"},3000);return}
  delete b.dataset.sure;b.textContent="Aufgeben";clearTimeout(b._t);
  endEngine("loss","Aufgabe");setStatus("bad","Du hast aufgegeben","Stockfish gewinnt. Mit »Partie analysieren« siehst du, wo es kippte.")};
$("sfAna").onclick=()=>analyzeSfGame();
$("sfAgain").onclick=()=>{if(!sfEnd)return;if(op.endId){const e=ENDGAMES.find(x=>x.id===op.endId);if(e){startEndgame(e);return}}
  truncate(Math.min(sfStart,hist.length));view=hist.length;shown=new Chess(fens[view]);sfEnd=null;badge=null;startEngine()};
/* Beendete Stockfish-Partie (inkl. Eröffnung) im Game Review analysieren */
function analyzeSfGame(){
  if(!sfEnd)return;if(!sfEnd.n){toast("In dieser Partie wurde noch kein Zug gespielt.");return}const me=op.side,sfN=`${sfName||"Stockfish"} (Stufe ${S.set.sf})`;
  const moves=hist.slice(0,sfEnd.n);const res=sfEnd.res;
  const result=res==="draw"?"1/2-1/2":(res==="win")===(me==="w")?"1-0":"0-1";
  reviewGame({id:sfEnd.id,fen:startFen||null,color:me,res,result,term:sfEnd.why,fam:op.endId?"Endspiel: "+op.name:op.name,moves,tc:"",url:"",opp:sfN,oppR:null,myR:null,date:Date.now(),name:"Du",acc:null,white:me==="w"?"Du":sfN,black:me==="w"?sfN:"Du"});
}
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
  gm.n=hist.length;gm.vari=null;view=gm.startView||0;shown=new Chess(fens[view]);done=true;
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
  v=Math.max(0,Math.min(hist.length,v));if(v===view||lock)return;cancelAuto();
  const wasLive=live();const old=view;view=v;shown=new Chess(fens[view]);sel=null;
  let anim=null;if(v===old+1){anim={fwd:mvs[old]};playSound(mvs[old])}else if(v===old-1){anim={back:mvs[v]};sfx("move")}
  render(anim);
  if(mode==="replay"){
    if(view===hist.length&&game&&game.id&&GAMES.some(g=>g.id===game.id)&&!st.games[game.id]){st.games[game.id]=true;saveStats();checkBadges()}
    replayStatus();return;
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
const exMemo=new Map();
function explain(f,mv,prev){const k=f+"|"+mv.san+"|"+(prev?prev.san:"");let r=exMemo.get(k);if(!r){r=explainRaw(f,mv,prev);if(exMemo.size>500)exMemo.clear();exMemo.set(k,r)}return r}
function explainRaw(fenBefore,mv,prev){
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
  if(tab!=="ex")return;
  const el=$("tabEx");const h=hist.slice(0,view);let html="";
  const R=game&&game.review;
  if(view>0){
    const mv=mvs[view-1];const num=Math.ceil(view/2)+(view%2===1?".":"...");
    const note=mode==="train"?lineNote(h,view-1):"";
    const who={u:"dein Zug",b:"Buch",e:"Stockfish",p:mode==="edit"?"Editor":"dein Zug",g:"Partie",v:"deine Analyse"}[flags[view-1]]||"";
    const names=mode==="train"&&!op.endId?consistent(h).map(i=>op.lines[i].n):[];
    const rvc=R&&inMainMove(view-1)&&R.cls[view-1]?reviewMoveHtml(view-1):"";const rev="";
    if(rvc)html+=rvc;else
    html+=`<div class="excard"><div class="exh"><span>Zug ${view} von ${hist.length} · ${who}</span></div>
      <div class="exmove">${esc(num+" "+de(mv.san))}<span class="who">${mv.color==="w"?"Weiß":"Schwarz"}</span></div>${rev}
      <p>${esc(explain(fens[view-1],mv,view>1?mvs[view-2]:null).text)}</p>${note?`<p class="note">${esc(note)}</p>`:""}
      ${names.length?`<p class="leads">${names.length===1?"Variante":"Mögliche Varianten"}: ${esc(names.slice(0,4).join(" · "))}${names.length>4?" · +"+(names.length-4)+" weitere":""}</p>`:""}</div>`;
  }else{
    const txt=mode==="replay"?"Spiel die Partie mit → nach. Zu jedem Zug erscheint hier eine Erklärung.":mode==="edit"?"Spiel eine Zugfolge für beide Seiten ein.":mode==="puzzle"?"Finde den besten Zug.":(op.side==="w"?"Du spielst Weiß.":"Du spielst Schwarz.")+" Zu jedem Zug erscheint hier eine Erklärung.";
    html+=`<div class="excard"><div class="exh"><span>${startFen?"Ausgangsstellung":"Startstellung"}</span></div><p>${esc(txt)}</p></div>`;
  }
  if(mode==="replay"&&game){
    html+=engineLinesHtml();
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
  wireReviewPanel(el);
}
function setTab(t){tab=t;["ex","var","db"].forEach(x=>{$("tab"+{ex:"Ex",var:"Var",db:"Db"}[x]+"Btn").setAttribute("aria-selected",String(t===x));$({ex:"tabEx",var:"tabVar",db:"tabDb"}[x]).hidden=t!==x});if(t==="db")renderDb(true);else if(t==="var")renderVars();else renderExplain()}
$("tabExBtn").onclick=()=>setTab("ex");$("tabVarBtn").onclick=()=>setTab("var");$("tabDbBtn").onclick=()=>setTab("db");
$("vList").onclick=()=>{vtab="list";$("vList").setAttribute("aria-pressed","true");$("vTree").setAttribute("aria-pressed","false");renderVars()};
$("vTree").onclick=()=>{vtab="tree";$("vTree").setAttribute("aria-pressed","true");$("vList").setAttribute("aria-pressed","false");renderVars()};

/* ================= Lichess-Datenbank ================= */
const exCache={},exPend={};let exAuthFail=null;
function explorer(db,h,timeoutMs){
  const key=db+"|"+h.join(" ");if(exCache[key])return Promise.resolve(exCache[key]);
  if(exAuthFail!==null&&exAuthFail===(S.set.liToken||""))return Promise.reject(new Error("auth"));
  if(exPend[key])return exPend[key];
  const pr=explorerFetch(db,h,timeoutMs,key).finally(()=>{delete exPend[key]});exPend[key]=pr;return pr;
}
async function explorerFetch(db,h,timeoutMs,key){
  const play=histUci(h).join(",");
  const url=db==="masters"?`https://explorer.lichess.ovh/masters?play=${play}&moves=12&topGames=8`:`https://explorer.lichess.ovh/lichess?variant=standard&speeds=blitz,rapid,classical&ratings=1600,1800,2000,2200,2500&play=${play}&moves=12&topGames=0&recentGames=0`;
  const ctl=window.AbortController?new AbortController():null;const tt=timeoutMs?setTimeout(()=>ctl&&ctl.abort(),timeoutMs):null;
  const headers={};if(S.set.liToken)headers.Authorization="Bearer "+S.set.liToken;
  const r=await fetch(url,{headers,signal:ctl?ctl.signal:undefined});if(tt)clearTimeout(tt);
  if(r.status===401||r.status===403){exAuthFail=S.set.liToken||"";throw new Error("auth")}if(r.status===429)throw new Error("ratelimit");if(!r.ok)throw new Error("http");
  const d=await r.json();exCache[key]=d;return d;
}
const dbBar=m=>{const n=m.white+m.draws+m.black||1;const w=m.white/n*100,d=m.draws/n*100,l=m.black/n*100;return `<div class="dbbar"><i class="w" style="width:${w}%">${w>=14?Math.round(w)+"%":""}</i><i class="d" style="width:${d}%">${d>=14?Math.round(d)+"%":""}</i><i class="l" style="width:${l}%">${l>=14?Math.round(l)+"%":""}</i></div>`};
const fmtN=n=>n>=1e6?(n/1e6).toFixed(1)+" Mio.":n>=1e3?Math.round(n/1e3)+" Tsd.":String(n);
let dbTok=0,dbKey="";
async function renderDb(force){
  const el=$("tabDb");if(tab!=="db"||!el)return;const h=hist.slice(0,view);
  const key=(op?op.id:"")+"|"+h.join(" ");if(!force&&key===dbKey)return;dbKey=key;const tok=++dbTok;
  const myRows=myTreeAt(h);
  const bk=op&&op.lines&&op.lines.length?bookMoves(h):[];
  el.innerHTML=`<div class="excard"><div class="exh"><span>Lichess-Spieler (1600–2500)</span></div><div id="dbL">${SKEL}</div></div><div class="excard"><div class="exh"><span>Meisterpartien</span></div><div id="dbM">${SKEL}</div></div>${myRows}`;
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
  $("coach").style.removeProperty("--k");$("face").style.background="";
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
  if(mode==="replay")return !!game;
  return false;
}
const ownPiece=p=>p&&(mode==="edit"||mode==="replay"?p.color===shown.turn():p.color===op.side);
function updateEvalBar(){
  const bar=$("evalBar");const R=game&&game.review;
  const on=S.set.evalbar||mode==="engine"||(mode==="replay"&&R);
  $("evalBtn").setAttribute("aria-pressed",String(!!S.set.evalbar));bar.hidden=!on;if(!on)return;
  // Weißer Anteil = Gewinnchance von Weiß; er liegt immer auf der Seite, auf der Weiß am Brett sitzt
  const setBar=cp=>{const w=winPct(cp);const wBottom=orient()==="w";const f=$("evalFill");f.style.height=w+"%";f.style.bottom=wBottom?"0":"auto";f.style.top=wBottom?"auto":"0";
    $("evalTxt").textContent=Math.abs(cp)>=9000?"M"+mateN(cp):(Math.abs(cp)/100).toFixed(1);bar.classList.toggle("wlead",cp>=0);bar.classList.toggle("txtbot",(cp>=0)===wBottom);bar.title=`Bewertung: ${fmtEv(cp)} (${cp>=0?"Weiß":"Schwarz"} steht besser)`};
  if(R&&R.evals[view]!=null&&(!game.vari||view<=game.vari.base)){setBar(R.evals[view]);return}
  if(evCache.has(fens[view])){setBar(evCache.get(fens[view]));return}
  if(mode==="engine"&&live()&&evalCp!=null){setBar(evalCp);return}
  const tok=++evalTok;const fen=fens[view];
  setTimeout(()=>{if(tok!==evalTok)return;sfRun(fen,{ms:350}).then(r=>{const g=new Chess(fen);const cp=cpOf(r.score,g.turn());evCache.set(fen,cp);if(tok!==evalTok)return;setBar(cp)}).catch(()=>{$("evalTxt").textContent="–"})},250);
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
    el.classList.toggle("hsq",!!(hm&&hintLvl===1&&hm.from===n));
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
  if(R&&view>0&&inMainMove(view-1)&&R.best[view-1]&&["inacc","mist","blun","miss"].indexOf(R.cls[view-1])>=0){const b=R.best[view-1];ideas+=arrowPath(b.slice(0,2),b.slice(2,4),"rgba(129,182,76,.85)",.16)}
  else if(S.set.ideas&&view>0&&!extra.bad&&!(hm&&hintLvl===2)&&!blindOn){try{explain(fens[view-1],mvs[view-1]).arrows.forEach(([a,b])=>ideas+=arrowPath(a,b,"rgba(70,140,235,.62)",.13))}catch(e){}}
  ideasEl.innerHTML=ideas;
  renderMarks();
  badgesEl.innerHTML="";
  let bdg=badge&&(badge.ply===view||badge.ply===-1)?badge:null;
  if(!bdg&&R&&view>0&&inMainMove(view-1)&&R.cls[view-1])bdg={sq:mvs[view-1].to,type:"rv-"+R.cls[view-1]};
  if(bdg){const p=xy(bdg.sq);const b=document.createElement("div");
    if(bdg.type.indexOf("rv-")===0){const c=CLS[bdg.type.slice(3)];b.className="badge cls "+c[1];b.textContent=c[2];b.style.fontSize="calc(var(--s)*.2)"}else{b.className="badge "+bdg.type;b.innerHTML=ICON[bdg.type]}
    b.style.left=((p.x+1)*12.5)+"%";b.style.top=(p.y*12.5)+"%";badgesEl.appendChild(b)}
  renderMoves();renderVars();renderBars();renderExplain();updateEvalBar();if(tab==="db")renderDb();applyBlind();
  const canAct=(mode==="train"||mode==="puzzle")&&!done&&!busy&&!lock&&userTurnShown()&&!op.endId;
  $("hintBtn").disabled=$("showBtn").disabled=!canAct;$("backBtn").disabled=!(mode==="train"&&!drill&&!lock&&!op.endId&&flags.indexOf("u")>=0);renderMaterial();$("restartBtn").disabled=mode==="puzzle"&&!done;
  $("navFirst").disabled=$("navPrev").disabled=view===0;
  $("navNext").disabled=$("navLast").disabled=live();
  $("actsDone").hidden=!!sfEnd||!(mode==="train"&&done&&!op.endId&&((target!==null&&op.lines&&op.lines.length)||drill));
  $("actsTrain").hidden=!(mode==="train"||mode==="puzzle")||($("actsDone").hidden===false)||!!op.endId||!!sfEnd;
  $("actsSfEnd").hidden=!(sfEnd&&mode==="train");
  $("sfUndo").disabled=busy||hist.length<=sfStart;
  $("moveInput").disabled=false;updateRevActs();
}
function renderChrome(){
  const inSess=!!sess;$("sessBar").hidden=!inSess;
  if(inSess&&sess.next){$("sessTitle").textContent=sess.title;$("sessCount").textContent=sess.countText();$("sessProg").style.width=(sess.progress()*100)+"%"}
  else if(inSess){$("sessTitle").textContent=sess.title;$("sessCount").textContent=`${Math.min(sess.idx+1,sess.queue.length)}/${sess.queue.length}`;$("sessProg").style.width=(sess.idx/sess.queue.length*100)+"%"}
  $("actsSf").hidden=mode!=="engine";$("editor").hidden=mode!=="edit";
  $("nextBtn").hidden=!((mode==="train"&&!op.endId)||(mode==="puzzle"&&sess))||!!(sess&&sess.kind==="sprint");
  $("nextBtn").textContent=sess?(sess.next?"Nächste Aufgabe":sess.idx+1>=sess.queue.length?"Training abschließen":`Weiter (${sess.idx+2}/${sess.queue.length})`):"Nächste Variante";
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
  else if(sfEnd||op.endId){av.className="avatar sfav";av.innerHTML=ICON.cpu;$("oppName").textContent=(sfName||"Stockfish")+" · Stufe "+S.set.sf}
  else{av.className="avatar bookav";av.innerHTML=ICON.bookL;$("oppName").textContent="Eröffnungsbuch"}
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
  $("oppClock").textContent=mode==="engine"?(busy?"Denkt …":"Stockfish"):oppTurn?"Denkt …":mode==="puzzle"?"Rätsel":sfEnd||op.endId?"Stockfish":"Buch";
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
      if(R&&R.cls[k]&&inMainMove(k)){const c=CLS[R.cls[k]];tag=`<span class="cls ${c[1]}">${c[2]}</span>`}
      if(flags[k]==="v")b.classList.add("vmv");
      b.innerHTML=tag+"<span></span>";b.lastChild.textContent=de(hist[k]);b.onclick=()=>setView(k+1);row.appendChild(b);
    });
    m.appendChild(row);
  }
  const cur=m.querySelector(".mv.cur");if(cur){if(m.scrollWidth>m.clientWidth+2){m.scrollLeft=cur.offsetLeft-m.clientWidth/2+cur.offsetWidth/2}else{const r=cur.offsetTop;if(r<m.scrollTop||r>m.scrollTop+m.clientHeight-30)m.scrollTop=r-m.clientHeight/2}}else if(m.scrollWidth>m.clientWidth+2)m.scrollLeft=m.scrollWidth
}
function renderVars(){
  const v=$("vars"),tr=$("tree");v.hidden=vtab!=="list";tr.hidden=vtab!=="tree";
  if(!op.lines||!op.lines.length){v.innerHTML='<div class="empty">Keine Varianten.</div>';tr.innerHTML="";$("varProg").textContent="";return}
  const cl=op.lines.filter((l,i)=>P(op.id,i)===2).length;$("varProg").textContent=`${cl}/${op.lines.length}`;
  if(tab!=="var")return;
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
  usedHelp=true;mistakes++;if(mode==="puzzle"){reportPuzzle(false);puzzleMove(mv,true);return}trainMove(mv,true,true);
  if(!done)setStatus("bad","Der Buchzug war "+de(mv.san),"Merk ihn dir. Das Buch antwortet …");
};
$("backBtn").onclick=()=>{if(!$("backBtn").disabled)takeBack()};
function takeBack(){
  if(mode!=="train"||drill||lock)return;let k=-1;for(let i=hist.length-1;i>=0;i--)if(flags[i]==="u"){k=i;break}if(k<0)return;
  clearTimeout(timer);busy=false;stopBlitz();cancelAuto();
  truncate(k);view=hist.length;shown=new Chess(fens[view]);done=false;sel=null;hintLvl=0;badge=null;liveStatus=null;target=pickTarget();
  render();renderChrome();sfx("move");setStatus("turn","Zug zurückgenommen","Du bist wieder am Zug. Probier einen anderen Buchzug.");startBlitz();
}
/* ---- Automatisch weiter ---- */
let autoT=null;
function cancelAuto(){if(autoT){clearTimeout(autoT);autoT=null}const b=$("nextBtn");if(b)b.classList.remove("auto")}
function scheduleAuto(ms){cancelAuto();if(!S.set.autoNext)return;const b=$("nextBtn");if(!b||b.hidden||curView!=="train")return;
  b.style.setProperty("--auto",ms+"ms");void b.offsetWidth;b.classList.add("auto");
  autoT=setTimeout(()=>{autoT=null;b.classList.remove("auto");if(curView==="train"&&!b.hidden&&(done||(mode==="puzzle"&&puz&&puz.reported)))b.click()},ms)}
document.addEventListener("pointerdown",e=>{if(autoT&&!(e.target.closest&&e.target.closest("#nextBtn")))cancelAuto()},true);
/* ---- Materialanzeige ---- */
const PV={p:1,n:3,b:3,r:5,q:9};
function pieceCount(g){const c={w:{p:0,n:0,b:0,r:0,q:0},b:{p:0,n:0,b:0,r:0,q:0}};g.board().forEach(r=>r.forEach(p=>{if(p&&p.type!=="k")c[p.color][p.type]++}));return c}
let matBase={fen:null,c:null};
function renderMaterial(){
  if(matBase.fen!==fens[0]){matBase={fen:fens[0],c:pieceCount(new Chess(fens[0]))}}
  const c=pieceCount(shown),c0=matBase.c;const me=mode==="replay"?orient():mode==="edit"?$("edSide").value:op.side;const opp=me==="w"?"b":"w";
  const promo=col=>["q","r","b","n"].reduce((a,t)=>a+Math.max(0,c[col][t]-c0[col][t]),0);
  const lost=col=>["q","r","b","n","p"].map(t=>{const n=Math.max(0,c0[col][t]-c[col][t]-(t==="p"?promo(col):0));return n?`<span class="mg">${`<i class="pp ${col}${t}"></i>`.repeat(n)}</span>`:""}).join("");
  const val=col=>Object.keys(PV).reduce((a,t)=>a+PV[t]*c[col][t],0);const d=val(me)-val(opp);
  $("youMat").innerHTML=lost(opp)+(d>0?`<em>+${d}</em>`:"");$("oppMat").innerHTML=lost(me)+(d<0?`<em>+${-d}</em>`:"");
}
$("restartBtn").onclick=()=>{if(drill){startPosition(op,drill.pre,drill.info);return}if(mode==="puzzle"){startPuzzle(puz);return}startTrain()};
$("nextBtn").onclick=()=>{cancelAuto();if(sess){if(!done&&!(mode==="puzzle"&&puz&&puz.reported)){toast("Löse die Aufgabe erst oder nutze »Lösung«.");return}sessNext()}else{forced=null;drill=null;startTrain()}};

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
  const go=mv=>{if(mode==="train")trainMove(mv,animate);else if(mode==="puzzle")puzzleMove(mv,animate);else if(mode==="engine")engineUserMove(mv,animate);else if(mode==="edit")editMove(mv,animate);else if(mode==="replay")anaMove(mv,animate)};
  if(cands.length>1){const pre=cands.find(m=>m.promotion===(promo||(S.set.autoQueen?"q":"")));if(pre){go(pre);return true}
    lock=true;pickPromotion(cands[0].color).then(p=>{lock=false;const mv=cands.find(m=>m.promotion===p);if(mv)go(mv);else render()});return true}
  go(cands[0]);return true;
}

/* ---------------- Zeiger, Pfeile ---------------- */
const marks={a:new Set(),c:new Set()};
function renderMarks(){let s="";marks.c.forEach(q=>{const p=xy(q);s+=`<circle cx="${p.x+.5}" cy="${p.y+.5}" r=".44" fill="none" stroke="rgba(235,97,80,.85)" stroke-width=".07"/>`});marks.a.forEach(k=>{s+=arrowPath(k.slice(0,2),k.slice(2,4),"rgba(255,170,0,.8)",.16)});marksEl.innerHTML=s}
let drag=null,rStart=null,swipe=null,hovSq=null;
function setHov(n){if(n===hovSq)return;if(hovSq){const o=sqsEl.querySelector(`[data-sq="${hovSq}"]`);if(o)o.classList.remove("hov")}hovSq=n;if(n){const e=sqsEl.querySelector(`[data-sq="${n}"]`);if(e)e.classList.add("hov")}}
function sqFromEvent(e){const r=boardEl.getBoundingClientRect();return sqAtXY(Math.floor((e.clientX-r.left)/r.width*8),Math.floor((e.clientY-r.top)/r.height*8))}
boardEl.addEventListener("contextmenu",e=>e.preventDefault());
boardEl.addEventListener("pointerdown",e=>{
  if(!op)return;const name=sqFromEvent(e);if(!name)return;
  if(e.button===2){rStart=name;return}
  if(e.button>0)return;
  if(wrongRevert){wrongRevert();return}
  if(marks.a.size||marks.c.size){marks.a.clear();marks.c.clear();renderMarks()}
  const startSwipe=()=>{swipe={x:e.clientX,y:e.clientY,t:Date.now()};try{boardEl.setPointerCapture(e.pointerId)}catch(_){}};
  if(!canMoveNow()){startSwipe();return}
  const p=shown.get(name);
  if(sel&&sel!==name&&!ownPiece(p)){const s=sel;sel=null;if(!tryMove(s,name,true)){render();startSwipe()}return}
  if(ownPiece(p)){
    e.preventDefault();sel=name;render();
    const el=pcsEl.querySelector(`.pc[data-sq="${name}"]`);
    drag={from:name,el,moved:false,x:e.clientX,y:e.clientY,touch:e.pointerType==="touch"};
    try{boardEl.setPointerCapture(e.pointerId)}catch(_){}
  }else{if(sel){sel=null;render()}startSwipe()}
});
boardEl.addEventListener("pointermove",e=>{
  if(!drag||!drag.el)return;
  if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<4)return;
  drag.moved=true;const r=boardEl.getBoundingClientRect();const s=r.width/8;
  // Am Handy schwebt die Figur vergrößert über dem Finger, das Zielfeld wird markiert
  const lift=drag.touch?s*.55:0,sc=drag.touch?1.6:1.08;
  drag.el.classList.add("lift");drag.el.style.transform=`translate(${e.clientX-r.left-s/2}px,${e.clientY-r.top-s/2-lift}px) scale(${sc})`;
  setHov(sqFromEvent(e));
});
function snapBack(d){setHov(null);if(!d.el)return render();d.el.classList.remove("lift");d.el.classList.add("anim");d.el.style.transform=tf(d.from)}
boardEl.addEventListener("pointerup",e=>{
  if(e.button===2&&rStart){const to=sqFromEvent(e);if(to){if(to===rStart){marks.c.has(to)?marks.c.delete(to):marks.c.add(to)}else{const k=rStart+to;marks.a.has(k)?marks.a.delete(k):marks.a.add(k)}renderMarks()}rStart=null;return}
  if(swipe){const s=swipe;swipe=null;const dx=e.clientX-s.x,dy=e.clientY-s.y;
    if(S.set.swipe&&Math.abs(dx)>40&&Math.abs(dx)>1.5*Math.abs(dy)&&Date.now()-s.t<800){setView(view+(dx<0?1:-1))}return}
  if(!drag)return;const d=drag;drag=null;setHov(null);if(!d.moved)return;const to=sqFromEvent(e);
  if(to&&to!==d.from){sel=null;if(!tryMove(d.from,to,false))snapBack(d)}else snapBack(d);
});
boardEl.addEventListener("pointercancel",()=>{swipe=null;if(drag){const d=drag;drag=null;snapBack(d)}});
window.addEventListener("resize",sizeVar);
if(window.ResizeObserver)new ResizeObserver(sizeVar).observe(boardEl);

/* ================= Ansichten & Tab-Balken ================= */
let curView="train";
const VIEW_TAB={tactics:"tactics",train:"train",learn:"learn",quiz:"learn",games:"learn",import:"learn",end:"learn",openings:"openings",chess:"chess",profile:"profile"};
function showView(v){
  if(v!==curView)cancelAuto();const tbb=$("tabbar");if(tbb)tbb.classList.remove("hide");
  curView=v;document.querySelectorAll(".view").forEach(el=>el.hidden=el.id!=="v-"+v);
  if(v!=="train"){stopEngine();stopBlitz()}
  ({tactics:renderTactics,learn:renderLearn,openings:renderOpenings,chess:renderChess,profile:renderProfile,quiz:renderQuizIntro,games:renderGames,import:renderImport,end:renderEndPage}[v]||(()=>{}))();
  renderTabbar();applyBlind();if(v!=="train")window.scrollTo(0,0);else sizeVar();
}
const TABS=[["train","Brett","board"],["learn","Lernen","learn"],["tactics","Taktik","bolt"],["openings","Eröffnungen","list"],["chess","Chess.com","chess"],["profile","Profil","profile"]];
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
  const {mf,mq}=filterOpenings(q,repOnly);
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
  const lastOp=byId(store.get("et-last",null));const hr=new Date().getHours();const greet=hr<5?"Gute Nacht":hr<11?"Guten Morgen":hr<18?"Hallo":"Guten Abend";
  const cl=lastOp&&lastOp.lines?lastOp.lines.filter((l,i)=>P(lastOp.id,i)===2).length:0;const tz=pzToday();
  const chips=[["review","review","Fällig",due,due>0],["tactics","bolt","Taktik heute",tz.n+"/"+PZ.goal,tz.n<PZ.goal],["mine","mistake","Eigene Fehler",mine,mine>0]].map(c=>`<button class="cchip${c[4]?" hot":""}" data-act="${c[0]}">${NI[c[1]]}<span>${c[2]}</span><b>${c[3]}</b></button>`).join("");
  v.innerHTML=`<div class="greet"><h2>${greet}!</h2><small>${streakNow()?`🔥 ${streakNow()} ${streakNow()===1?"Tag":"Tage"} Serie · `:""}Taktik ${PZ.r}</small></div>
  ${lastOp&&lastOp.lines&&lastOp.lines.length?`<button class="cont" data-act="continue"><span class="cont-b" id="contBoard"></span><span class="cont-t"><small>Weitermachen</small><b>${esc(lastOp.name)}</b><span>${cl}/${lastOp.lines.length} Varianten fehlerfrei · Du spielst ${lastOp.side==="w"?"Weiß":"Schwarz"}</span><span class="prog"><i style="width:${cl/lastOp.lines.length*100}%"></i></span></span><span class="cont-go">▶</span></button>`:""}
  <div class="cchips">${chips}</div>
  <div class="daily-hero">${ringSvg(dq?dd/dq:0)}<div><h2>${dd>=dq?"Heute geschafft!":"Tagestraining"}</h2><p>${dd>=dq?"Super – morgen geht es weiter. Du kannst trotzdem weiter üben.":`${dq-dd} von ${dq} Varianten offen. Zuerst die fälligen, dann neue aus deinem Repertoire.`}</p><div class="btnrow" style="margin-top:10px"><button class="btn grn" data-act="daily">${dd>=dq?"Extra-Training":"Weiter trainieren"}</button></div></div><div class="flame"><span>${streakNow()}</span><small>Tage Serie</small></div></div>
  <div class="sec-h"><h3>Wiederholen</h3><small>Nach Lernkurve: Fehler kommen öfter</small></div>
  <div class="hubgrid">
    ${card("review","review","#C8742E","Fällige Varianten","Komplette Varianten, die laut Wiederholungsplan heute dran sind.",due,due>0)}
    ${card("positions","target","#B9483C","Schwache Stellungen","Nur die einzelnen Züge, bei denen du oft danebenliegst.",dp,dp>0)}
    ${card("mine","mistake","#3E6FB0","Deine Fehler","Stellungen aus deinen eigenen Chess.com-Partien, in denen du falsch gespielt hast.",mine,mine>0)}
    ${card("traps","traps","#B9483C","Fallen-Training","Alle Fallen und Tricks – stellen und vermeiden.",trapKeys().length)}
  </div>
  <div class="sec-h"><h3>Trainingsarten</h3><small>Abwechslung macht sicher</small></div>
  <div class="hubgrid">
    ${card("analyse","review","#26C2A3","Partie analysieren","Game Review für eine Chess.com-, Lichess- oder PGN-Partie: Zugbewertungen, Genauigkeit, bessere Züge.")}
    ${card("tactics","bolt","#81B64C","Taktik-Training",`Echte Lichess-Rätsel mit Wertung, Levels und Themen-Pfaden. Deine Wertung: ${PZ.r}.`,pzToday().n+"/"+PZ.goal)}
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
  const cb=$("contBoard");if(cb&&lastOp){try{const g=new Chess();let last=null;lastOp.lines[0].m.slice(0,8).forEach(m=>{last=g.move(m,{sloppy:true})||last});cb.appendChild(staticBoard(g.fen(),lastOp.side,last))}catch(e){}}
  v.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{const a=b.dataset.act;
    if(a==="continue"){selectOpening(lastOp);return}
    if(a==="analyse"){showView("chess");const t=$("anaIn");if(t){t.scrollIntoView({block:"center"});t.focus()}return}
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
  <div class="grid3">${ENDGAMES.map(e=>{return `<div class="gcard">${st.ends[e.id]?'<span class="done-tag">Gespielt</span>':""}<h4>${esc(e.t)}</h4><div id="eb-${e.id}"></div><p>${esc(e.goal)}</p><button class="btn grn" data-end="${e.id}">Gegen Stockfish spielen (${e.side==="w"?"Weiß":"Schwarz"})</button></div>`}).join("")}</div>`;
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
  if(navigator.share){navigator.share({title:"Mein Eröffnungsrepertoire",url:link}).catch(e=>{if(!e||e.name!=="AbortError")linkBox(link)})}
  else if(navigator.clipboard){navigator.clipboard.writeText(link).then(done).catch(()=>linkBox(link))}
  else linkBox(link);
}
/* Link zum Kopieren in einem eigenen Fenster (statt blockierendem prompt) */
function linkBox(link){
  const ov=document.createElement("div");ov.className="onb";ov.innerHTML=`<div class="onb-box" role="dialog" aria-modal="true" aria-label="Link kopieren"><h2 style="font-size:20px">Link kopieren</h2><p class="hint">Halte den Link gedrückt oder tippe auf »Kopieren«.</p><input class="txt" readonly style="width:100%" value="${esc(link)}"><div class="btnrow onb-act"><button class="btn grn" data-cp>Kopieren</button><button class="btn" data-x>Schließen</button></div></div>`;
  document.body.appendChild(ov);const inp=ov.querySelector("input");inp.focus();inp.select();
  ov.querySelector("[data-x]").onclick=()=>ov.remove();ov.onclick=e=>{if(e.target===ov)ov.remove()};
  ov.querySelector("[data-cp]").onclick=()=>{inp.select();let ok=false;try{ok=document.execCommand("copy")}catch(e){}toast(ok?"Link kopiert":"Bitte den Link markieren und kopieren.");if(ok)ov.remove()};
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
  document.body.classList.toggle("nocoords",!S.set.coords);document.body.classList.toggle("calm",!!S.set.calm);
  document.documentElement.style.setProperty("--fz",String((S.set.font||100)/100));
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
  <div class="card"><h3>Komfort</h3>
    ${sw("swAuto",S.set.autoNext,"Automatisch weiter","Nach einer gelösten Variante oder Aufgabe startet kurz darauf die nächste")}
    ${sw("swQueen",S.set.autoQueen,"Automatisch Dame","Bei der Umwandlung ohne Nachfrage eine Dame nehmen")}
    ${sw("swSwipe",S.set.swipe,"Wischen auf dem Brett","Nach links wischen: Zug vor, nach rechts: Zug zurück")}
    ${sw("swTb",S.set.tbHide,"Tab-Leiste ausblenden","Beim Herunterscrollen am Handy verschwindet die Leiste unten")}
    ${sw("swSync",S.set.autoSync,"Chess.com automatisch abgleichen","Beim Öffnen neue Partien laden und mit Stockfish analysieren")}
    <div class="setrow"><span><b>Analyse-Tiefe</b><small>Rechenzeit pro Zug im Game Review</small></span><span class="seg">${[[150,"Schnell"],[300,"Normal"],[800,"Gründlich"]].map(f=>`<button data-rv="${f[0]}" aria-pressed="${(S.set.revMs||300)===f[0]}">${f[1]}</button>`).join("")}</span></div>
    ${sw("swCalm",S.set.calm,"Weniger Animationen","Keine Bewegungen, kein Konfetti")}
    <div class="setrow"><span><b>Schriftgröße</b><small>Gilt für Texte und Knöpfe, nicht für das Brett</small></span><span class="seg" id="fzSeg">${[[90,"A−"],[100,"A"],[115,"A+"],[130,"A++"]].map(f=>`<button data-fz="${f[0]}" aria-pressed="${S.set.font===f[0]}">${f[1]}</button>`).join("")}</span></div>
    <div class="setrow"><span><b>Ersteinrichtung</b><small>Spielstärke, Farbe und Chess.com-Name neu wählen</small></span><button class="btn" id="onbAgain" style="padding:8px 12px">Starten</button></div>
  </div>
  <div class="card"><h3>Lichess-Token (optional)</h3><p class="hint" style="margin:0 0 8px">Nur nötig, falls Lichess die Datenbank ohne Anmeldung sperrt. Erstelle einen Token ohne besondere Rechte auf <a href="https://lichess.org/account/oauth/token/create?description=Eroeffnungstrainer" target="_blank" rel="noopener">lichess.org</a> und füge ihn hier ein. Er bleibt nur in diesem Browser.</p><input class="txt" id="liTok" placeholder="lip_…" value="${esc(S.set.liToken)}" autocomplete="off"></div>
  <div class="card"><h3>App installieren</h3><p class="hint" style="margin:0">iPhone: In Safari auf Teilen → „Zum Home-Bildschirm“. Android/Chrome: Menü → „App installieren“. Danach funktioniert das Training auch offline.</p></div>
  <div class="card"><h3>Zurücksetzen</h3><p class="hint" style="margin:0 0 10px">Löscht Fortschritt, Wiederholungsplan, Statistik und Abzeichen in diesem Browser. Einstellungen und eigene Varianten bleiben.</p><div class="btnrow"><button class="btn red" id="resetBtn">Fortschritt zurücksetzen</button><span class="hint" id="resetMsg"></span></div></div>`;
  v.querySelectorAll("[data-design]").forEach(b=>b.onclick=()=>{S.set.design=b.dataset.design;save("set");applySettings();renderProfile()});
  v.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>{S.set.theme=b.dataset.theme;save("set");applySettings();renderProfile()});
  v.querySelectorAll("[data-pset]").forEach(b=>b.onclick=()=>{S.set.pieces=b.dataset.pset;save("set");applySettings();renderProfile()});
  const tg=(id,key)=>$(id).onclick=()=>{S.set[key]=!S.set[key];save("set");applySettings();$(id).setAttribute("aria-pressed",String(S.set[key]));if(op&&curView==="train")render()};
  tg("swSound","sound");tg("swIdeas","ideas");tg("swCoords","coords");tg("swEval","evalbar");tg("swReal","realistic");
  tg("swAuto","autoNext");tg("swQueen","autoQueen");tg("swSwipe","swipe");tg("swTb","tbHide");tg("swSync","autoSync");tg("swCalm","calm");
  v.querySelectorAll("[data-fz]").forEach(b=>b.onclick=()=>{S.set.font=+b.dataset.fz;save("set");applySettings();v.querySelectorAll("[data-fz]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)))});
  $("onbAgain").onclick=()=>openOnboarding();
  v.querySelectorAll("[data-rv]").forEach(b=>b.onclick=()=>{S.set.revMs=+b.dataset.rv;save("set");v.querySelectorAll("[data-rv]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)))});
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

/* ================= Chess.com- & Lichess-Zentrale ================= */
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
function pgnMoves(pgn,max){
  let s=pgn.replace(/^\s*\[[^\]]*\]\s*$/gm," ").replace(/\{[^}]*\}/g," ").replace(/;[^\n]*/g," ");
  let prev;do{prev=s;s=s.replace(/\([^()]*\)/g," ")}while(s!==prev);
  s=s.replace(/\$\d+/g," ").replace(/\d+\.(\.\.)?/g," ");
  return s.split(/\s+/).filter(x=>x&&!/^(1-0|0-1|1\/2-1\/2|\*)$/.test(x)).map(x=>x.replace(/[?!]+$/,"")).slice(0,max||400);
}
const DRAWS=["agreed","repetition","stalemate","insufficient","50move","timevsinsufficient"];
const TERM={checkmated:"Matt",resigned:"Aufgabe",timeout:"Zeit",abandoned:"Abbruch",agreed:"Einigung",repetition:"Wiederholung",stalemate:"Patt",insufficient:"Material","50move":"50 Züge",timevsinsufficient:"Zeit/Material",mate:"Matt",resign:"Aufgabe",outoftime:"Zeit",draw:"Remis"};
function normApiGame(g,user){
  if(g.rules&&g.rules!=="chess")return null;const u=user.toLowerCase();let color=null;
  if(g.white&&g.white.username.toLowerCase()===u)color="w";else if(g.black&&g.black.username.toLowerCase()===u)color="b";
  if(!color||!g.pgn)return null;const me=color==="w"?g.white:g.black,them=color==="w"?g.black:g.white;
  const res=me.result==="win"?"win":DRAWS.indexOf(me.result)>=0?"draw":"loss";
  return {id:g.uuid||g.url||String(g.end_time),color,res,term:TERM[res==="win"?them.result:me.result]||"",fam:famFromUrl(g.eco||pgnHeader(g.pgn,"ECOUrl")),moves:pgnMoves(g.pgn),tc:g.time_class||"",url:g.url||"",opp:them.username,oppR:them.rating,myR:me.rating,date:(g.end_time||0)*1000,name:me.username,acc:g.accuracies?g.accuracies[color==="w"?"white":"black"]:null,white:g.white.username,black:g.black.username};
}
function normLichess(g,user){
  if(g.variant&&g.variant!=="standard")return null;if(g.status==="aborted"||g.status==="noStart")return null;
  const u=user.toLowerCase();const W=g.players.white||{},B=g.players.black||{};const wn=(W.user||{}).name||"",bn=(B.user||{}).name||"";
  let color=null;if(wn.toLowerCase()===u)color="w";else if(bn.toLowerCase()===u)color="b";if(!color)return null;
  const res=g.winner?((g.winner==="white")===(color==="w")?"win":"loss"):"draw";
  const sp={ultraBullet:"bullet",bullet:"bullet",blitz:"blitz",rapid:"rapid",classical:"rapid",correspondence:"daily"}[g.speed]||"";
  const me=color==="w"?W:B,them=color==="w"?B:W;
  return {id:g.id,color,res,term:TERM[g.status]||"",fam:famFromName(g.opening&&g.opening.name),moves:(g.moves||"").split(" ").filter(Boolean),tc:sp,url:"https://lichess.org/"+g.id+(color==="b"?"/black":""),opp:color==="w"?bn:wn,oppR:them.rating,myR:me.rating,date:g.createdAt||0,name:color==="w"?wn:bn,acc:me.analysis?me.analysis.accuracy:null,white:wn,black:bn};
}
function normPgnGame(pgn,user){
  const u=user.toLowerCase();const W=pgnHeader(pgn,"White"),B=pgnHeader(pgn,"Black"),R=pgnHeader(pgn,"Result");
  let color=null;if(W.toLowerCase()===u)color="w";else if(B.toLowerCase()===u)color="b";if(!color)return null;
  const res=R==="1/2-1/2"?"draw":(R==="1-0")===(color==="w")?"win":(R==="1-0"||R==="0-1")?"loss":null;if(!res)return null;
  const vr=pgnHeader(pgn,"Variant");if(vr&&vr.toLowerCase()!=="standard")return null;if(pgnHeader(pgn,"FEN"))return null;
  const tcs=pgnHeader(pgn,"TimeControl");let tc="";if(tcs&&tcs!=="-"){if(tcs.indexOf("/")>=0)tc="daily";else{const base=parseInt(tcs,10),inc=parseInt(tcs.split("+")[1]||"0",10);const tot=base+40*inc;tc=tot<180?"bullet":tot<600?"blitz":"rapid"}}else if(tcs==="-")tc="daily";
  const ds=(pgnHeader(pgn,"UTCDate")||pgnHeader(pgn,"Date")).replace(/\./g,"-");const date=Date.parse(ds)||0;
  const eu=pgnHeader(pgn,"ECOUrl");const url=pgnHeader(pgn,"Link")||pgnHeader(pgn,"Site");
  return {id:url||(W+B+ds+Math.random()),color,res,term:"",fam:eu?famFromUrl(eu):famFromName(pgnHeader(pgn,"Opening")),moves:pgnMoves(pgn),tc,url,opp:color==="w"?B:W,oppR:+pgnHeader(pgn,color==="w"?"BlackElo":"WhiteElo")||null,myR:+pgnHeader(pgn,color==="w"?"WhiteElo":"BlackElo")||null,date,name:color==="w"?W:B,acc:null,white:W,black:B};
}
function matchGame(gm){
  let best=null;
  for(const o of ALL){if(o.side!==gm.color||o.g==="c")continue;
    o.lines.forEach((l,i)=>{let k=0;while(k<l.m.length&&k<gm.moves.length&&strip(l.m[k])===strip(gm.moves[k]))k++;if(!best||k>best.k||(k===best.k&&o.g!=="x"&&best.o.g==="x"))best={o,i,k}})}
  if(!best||best.k<4)return null;
  let dev=null;const h=[];
  for(let k=0;k<gm.moves.length&&k<24;k++){const bm=bookMovesIn(best.o,h);if(!bm.length)break;
    if(bm.indexOf(strip(gm.moves[k]))<0){dev={ply:k,played:gm.moves[k],book:bm,mine:(k%2===0?"w":"b")===gm.color,pre:h.slice()};break}h.push(gm.moves[k])}
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
    if(m&&m.dev&&m.dev.mine){const dk=m.dev.ply+"|"+m.dev.played;const D=G.devs[dk]||(G.devs[dk]={ply:m.dev.ply,played:m.dev.played,book:m.dev.book,pre:m.dev.pre,n:0,l:0,url:gm.url,opp:gm.opp,date:gm.date});D.n++;if(R==="l"){D.l++;if(gm.url){D.url=gm.url;D.opp=gm.opp;D.date=gm.date}}}
    if(m&&R!=="w")G.lossLines[m.line]=(G.lossLines[m.line]||0)+1;
    const ok=gm.color==="w"?gm.moves.slice(0,2):gm.moves.slice(0,1);
    if(ok.length===(gm.color==="w"?2:1)){const k2=ok.join(" ");const O=opp[gm.color][k2]||(opp[gm.color][k2]={mv:ok,n:0,w:0,d:0,l:0});O.n++;O[R]++}
  }
  const list=Object.values(groups).map(G=>{G.score=(G.w+G.d/2)/G.n;G.lost=(0.5-G.score)*G.n;G.topDev=Object.values(G.devs).sort((a,b)=>b.n-a.n)[0]||null;const ll=Object.entries(G.lossLines).sort((a,b)=>b[1]-a[1])[0];G.focusLine=ll?+ll[0]:null;G.alias=Object.entries(G.fams).sort((a,b)=>b[1]-a[1])[0][0];return G});
  return {tot,list,opp};
}
/* Abweichungen vom Buch als Übungen speichern */
function collectBookPuzzles(R){
  let added=0;
  R.list.forEach(G=>{if(!G.id)return;Object.values(G.devs).forEach(D=>{if(D.l<1&&D.n<2)return;const key="bk:"+G.id+":"+D.pre.join(" ");
    if(S.puz.some(p=>p.key===key))return;S.puz.unshift({key,kind:"book",id:G.id,pre:D.pre,played:D.played,opp:D.opp||"",url:D.url||"",date:D.date||Date.now()});added++})});
  S.puz=S.puz.slice(0,200);save("puz");return added;
}

/* ---- Zustand Zentrale ---- */
const CH={src:(S.ana&&S.ana.src)||store.get("et-anasrc","chesscom"),user:(S.ana&&S.ana.user)||"",profile:null,games:store.get("et-games",[]).filter(g=>g&&typeof g.m==="string"&&g.id).map(g=>Object.assign({},g,{moves:g.m.split(" ")})),result:null,tab:"overview",months:3,type:"all",treeColor:"w",treePath:[],gFilter:"all",rTc:null};
if(CH.games.length)CH.result=null;
const siteName=()=>CH.src==="lichess"?"Lichess":"Chess.com";
function saveGames(){store.set("et-games",CH.games.slice(0,400).map(g=>Object.assign({},g,{moves:undefined,m:g.moves.join(" ")})))}
async function getJSON(url,opt){const r=await fetch(url,Object.assign({headers:{Accept:"application/json"}},opt||{}));if(r.status===404)throw new Error("notfound");if(r.status===429)throw new Error("ratelimit");if(r.status===401||r.status===403)throw new Error("auth");if(!r.ok)throw new Error("http "+r.status);return r.json()}

async function loadProfile(){
  const u=CH.user;if(!u)return;
  try{
    if(CH.src==="lichess"){const d=await getJSON("https://lichess.org/api/user/"+encodeURIComponent(u));
      const pf=d.perfs||{};CH.profile={name:d.username,title:d.title||"",avatar:null,country:(d.profile&&d.profile.flag)||"",joined:d.createdAt,last:d.seenAt,url:"https://lichess.org/@/"+d.username,
        rates:[["bullet","Bullet",pf.bullet],["blitz","Blitz",pf.blitz],["rapid","Schnell",pf.rapid],["classical","Klassisch",pf.classical],["correspondence","Fern",pf.correspondence],["puzzle","Rätsel",pf.puzzle]].filter(x=>x[2]&&x[2].games).map(x=>({k:x[0],t:x[1],r:x[2].rating,games:x[2].games,prov:x[2].prov})),
        record:d.count?{w:d.count.win,l:d.count.loss,d:d.count.draw}:null};
    }else{
      const base="https://api.chess.com/pub/player/"+encodeURIComponent(u.toLowerCase());
      const [p,s]=await Promise.all([getJSON(base),getJSON(base+"/stats").catch(()=>({}))]);
      const R=(k,t)=>s[k]&&s[k].last?{k,t,r:s[k].last.rating,best:s[k].best&&s[k].best.rating,rec:s[k].record}:null;
      CH.profile={name:p.username||u,display:p.name||"",title:p.title||"",avatar:p.avatar||null,country:(p.country||"").split("/").pop(),joined:(p.joined||0)*1000,last:(p.last_online||0)*1000,url:p.url,followers:p.followers,league:p.league,
        rates:[R("chess_bullet","Bullet"),R("chess_blitz","Blitz"),R("chess_rapid","Schnell"),R("chess_daily","Täglich")].filter(Boolean).concat(s.tactics&&s.tactics.highest?[{k:"tactics",t:"Taktik",r:s.tactics.highest.rating,best:null}]:[]).concat(s.puzzle_rush&&s.puzzle_rush.best?[{k:"rush",t:"Puzzle Rush",r:s.puzzle_rush.best.score,best:null,raw:true}]:[])};
    }
  }catch(e){CH.profile={error:String(e&&e.message||e)}}
}
async function loadGames(status){
  const u=CH.user,months=CH.months,type=CH.type;const games=[];
  if(CH.src==="lichess"){
    status("Verbinde mit Lichess …","",.1);
    const since=Date.now()-months*30*DAY;const perf={bullet:"bullet,ultraBullet",blitz:"blitz",rapid:"rapid,classical",daily:"correspondence"}[type];
    const headers={Accept:"application/x-ndjson"};if(S.set.liToken)headers.Authorization="Bearer "+S.set.liToken;
    const r=await fetch(`https://lichess.org/api/games/user/${encodeURIComponent(u)}?since=${since}&max=400&moves=true&opening=true&accuracy=true${perf?"&perfType="+perf:""}`,{headers});
    if(r.status===404)throw new Error("notfound");if(r.status===429)throw new Error("ratelimit");if(!r.ok)throw new Error("http "+r.status);
    const lines=(await r.text()).split("\n").filter(Boolean);
    lines.forEach(ln=>{try{const n=normLichess(JSON.parse(ln),u);if(n)games.push(n)}catch(_){}});
  }else{
    status("Verbinde mit Chess.com …","Lade die Liste deiner Monatsarchive.",.03);
    const arch=await getJSON(`https://api.chess.com/pub/player/${encodeURIComponent(u.toLowerCase())}/games/archives`);
    const urls=(arch.archives||[]).slice(-months);if(!urls.length)throw new Error("empty");
    for(let i=urls.length-1;i>=0;i--){
      const ym=urls[i].split("/").slice(-2).join("-");status(`Lade Partien (${urls.length-i}/${urls.length})`,`Monat ${ym} · bisher ${games.length} Partien`,(urls.length-i-.5)/urls.length);
      const data=await getJSON(urls[i]);
      for(const g of (data.games||[]).slice().reverse()){if(type!=="all"&&g.time_class!==type)continue;const n=normApiGame(g,u);if(n)games.push(n)}
    }
  }
  games.sort((a,b)=>b.date-a.date);return games;
}
function finishLoad(games,label){
  CH.games=games;saveGames();
  const R=analyze(games);R.label=label;CH.result=R;
  const stats={};R.list.forEach(G=>{if(G.id){const s=stats[G.id]||(stats[G.id]={n:0,w:0,d:0,l:0});s.n+=G.n;s.w+=G.w;s.d+=G.d;s.l+=G.l}});
  if(games[0]&&games[0].name)CH.user=games[0].name;
  S.ana={user:CH.user,src:CH.src,date:Date.now(),stats,label};save("ana");st.anaRuns++;saveStats();
  const np=collectBookPuzzles(R);if(np)toast(np+" neue Übungen aus deinen Partien unter Lernen → Deine Fehler");
  checkBadges();renderList();renderTabbar();
}

function renderChess(){
  const v=$("v-chess");const P0=CH.profile;
  const srcSeg=`<span class="seg"><button data-src="chesscom" aria-pressed="${CH.src==="chesscom"}">Chess.com</button><button data-src="lichess" aria-pressed="${CH.src==="lichess"}">Lichess</button></span>`;
  let prof="";
  if(P0&&!P0.error){
    prof=`<div class="card"><div class="prof">${P0.avatar?`<img src="${esc(P0.avatar)}" alt="" referrerpolicy="no-referrer">`:`<span class="ph0">${esc((P0.name||"?")[0].toUpperCase())}</span>`}<div style="min-width:0;flex:1"><h2>${P0.title?`<span class="title">${esc(P0.title)}</span>`:""}${esc(P0.name)}</h2><p>${P0.display?esc(P0.display)+" · ":""}${P0.country?esc(P0.country)+" · ":""}${P0.joined?"Dabei seit "+fmtDate(P0.joined):""}${P0.last?" · zuletzt online "+fmtDate(P0.last):""}</p>${P0.url?`<p><a href="${esc(P0.url)}" target="_blank" rel="noopener">Profil auf ${siteName()} öffnen</a></p>`:""}</div><button class="btn" id="chSwitch">Konto wechseln</button></div>
    ${P0.rates&&P0.rates.length?`<div class="rates" style="margin-top:12px">${P0.rates.map(r=>`<div class="rate"><small>${esc(r.t)}</small><b>${r.r}${r.prov?"?":""}</b><span>${r.best?"Bestwert "+r.best:r.games?r.games+" Partien":r.rec?`${r.rec.win} S · ${r.rec.draw} R · ${r.rec.loss} N`:""}</span></div>`).join("")}</div>`:""}</div>`;
  }
  if(CH.user&&(!P0||(!P0.name&&!P0.error))){if(!P0){CH.profile={};loadProfile().then(()=>{if(curView==="chess")renderChess()})}
    v.innerHTML=`<div class="hero"><span class="ic">${NI.chess}</span><div><h2>${siteName()}-Zentrale</h2><p>Lade das Profil von ${esc(CH.user)} …</p></div></div><div class="card">${SKEL}</div><div class="card">${SKEL}</div>`;return}
  const linked=!!CH.user&&P0&&!!P0.name;
  v.innerHTML=`<div class="hero"><span class="ic" style="background:${CH.src==="lichess"?"#5C5A57":"#81B64C"}">${NI.chess}</span><div><h2>${siteName()}-Zentrale</h2><p>Verknüpfe dein Konto über den Benutzernamen (kein Passwort nötig). Du bekommst deine Wertungen, alle Partien mit Game Review, die Eröffnungen, in denen du verlierst, deinen persönlichen Eröffnungsbaum und Übungen aus deinen eigenen Fehlern.</p></div></div>
  ${linked?prof:`<div class="card"><form class="form" id="chForm" style="grid-template-columns:minmax(0,1fr) minmax(0,2fr) auto"><label>Plattform${srcSeg}</label><label class="wide" for="chUser">Benutzername<input id="chUser" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="dein ${siteName()}-Name" value="${esc(CH.user)}" required></label><button class="btn grn" type="submit" style="padding:12px 18px">Verknüpfen</button></form>${P0&&P0.error?`<div class="err" style="margin-top:10px">${P0.error==="notfound"?`Den Benutzer gibt es auf ${siteName()} nicht.`:`${siteName()} ist gerade nicht erreichbar. Prüfe die Internetverbindung.`}</div>`:""}</div>`}
  ${linked?`<div class="card"><div class="btnrow"><label class="fld" style="flex:1;min-width:140px">Zeitraum<select id="chMonths">${[1,3,6,12].map(m=>`<option value="${m}" ${CH.months===m?"selected":""}>${m===1?"Letzter Monat":m+" Monate"}</option>`).join("")}</select></label><label class="fld" style="flex:1;min-width:140px">Partien<select id="chType">${[["all","Alle"],["bullet","Bullet"],["blitz","Blitz"],["rapid","Schnellschach"],["daily","Täglich"]].map(t=>`<option value="${t[0]}" ${CH.type===t[0]?"selected":""}>${t[1]}</option>`).join("")}</select></label><button class="btn grn" id="chLoad" style="align-self:flex-end;padding:12px 18px">${CH.games.length?"Partien neu laden":"Partien laden & analysieren"}</button></div>
    <details class="alt"><summary>Oder PGN-Datei hochladen</summary><p>${siteName()}: Archiv herunterladen und hier auswählen.</p><input type="file" id="pgnFile" accept=".pgn,text/plain"></details>
    <div class="status" id="chStatus" hidden style="margin-top:12px"><b id="chStT"></b><div class="prog"><i id="chBar"></i></div><small id="chStX"></small></div><div id="chErr" class="err" hidden style="margin-top:10px"></div></div>`:""}
  ${anaInputHtml()}
  ${linked&&CH.games.length?`<div class="subtabs">${[["overview","Übersicht"],["games","Partien"],["tree","Eröffnungsbaum"],["puzzle","Rätsel"]].map(t=>`<button data-ct="${t[0]}" aria-pressed="${CH.tab===t[0]}">${t[1]}</button>`).join("")}</div><div id="chBody" class="page" style="max-width:none"></div>`:linked?`<div class="subtabs"><button data-ct="puzzle" aria-pressed="true">Rätsel</button></div><div id="chBody" class="page" style="max-width:none"></div>`:""}`;
  wireAnaInput();
  v.querySelectorAll("[data-src]").forEach(b=>b.onclick=()=>{CH.src=b.dataset.src;store.set("et-anasrc",CH.src);CH.profile=null;renderChess()});
  const f=$("chForm");if(f)f.onsubmit=async e=>{e.preventDefault();const u=$("chUser").value.trim();if(!u)return;CH.user=u;CH.profile={};f.querySelector("button[type=submit]").disabled=true;await loadProfile();
    if(CH.profile&&!CH.profile.error){S.ana=Object.assign({},S.ana||{},{user:CH.profile.name,src:CH.src});CH.user=CH.profile.name;save("ana");if(CH.games.length&&CH.games[0].name&&CH.games[0].name.toLowerCase()!==CH.user.toLowerCase()){CH.games=[];CH.result=null;saveGames()}}
    renderChess();if(CH.profile&&!CH.profile.error&&!CH.games.length)$("chLoad").click()};
  const sw=$("chSwitch");if(sw)sw.onclick=()=>{CH.profile=null;CH.user="";CH.games=[];CH.result=null;saveGames();renderChess()};
  v.querySelectorAll("[data-ct]").forEach(b=>b.onclick=()=>{CH.tab=b.dataset.ct;renderChess()});
  const ld=$("chLoad");if(ld)ld.onclick=async()=>{
    CH.months=+$("chMonths").value;CH.type=$("chType").value;ld.disabled=true;$("chErr").hidden=true;
    const status=(t,x,f)=>{$("chStatus").hidden=false;$("chStT").textContent=t;$("chStX").textContent=x||"";$("chBar").style.width=Math.round((f||0)*100)+"%"};
    try{const g=await loadGames(status);if(!g.length)throw new Error("empty");finishLoad(g,`${siteName()} · ${CH.months===1?"letzter Monat":"letzte "+CH.months+" Monate"}`);CH.tab="overview";renderChess()}
    catch(err){$("chStatus").hidden=true;const m=String(err&&err.message||err);$("chErr").hidden=false;
      $("chErr").textContent=m==="notfound"?`Den Benutzer gibt es auf ${siteName()} nicht.`:m==="empty"?"Keine passenden Partien in diesem Zeitraum gefunden.":m==="ratelimit"?`${siteName()} meldet zu viele Anfragen. Warte eine Minute.`:`${siteName()} ist gerade nicht erreichbar. Prüfe die Verbindung oder lade eine PGN-Datei hoch.`}
    finally{ld.disabled=false}};
  const pf=$("pgnFile");if(pf)pf.onchange=e=>{const file=e.target.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{const parts=String(rd.result).replace(/\r/g,"").split(/\n\s*\n(?=\[Event )/);const gs=[];parts.forEach(p=>{const n=normPgnGame(p,CH.user);if(n&&(CH.type==="all"||n.tc===CH.type))gs.push(n)});
    if(!gs.length){$("chErr").hidden=false;$("chErr").textContent=`In der Datei wurden keine Partien von ${CH.user} gefunden.`;return}gs.sort((a,b)=>b.date-a.date);finishLoad(gs,`PGN-Datei · ${gs.length} Partien`);renderChess()};rd.readAsText(file)};
  const body=$("chBody");if(!body)return;
  if(!CH.result&&CH.games.length){CH.result=analyze(CH.games);CH.result.label=(S.ana&&S.ana.label)||"Gespeicherte Partien"}
  const t=CH.games.length?CH.tab:"puzzle";
  ({overview:renderChOverview,games:renderChGames,tree:renderChTree,puzzle:renderChPuzzle}[t])(body);
}
if(CH.user&&!CH.profile){/* Profil wird beim Öffnen geladen */}

/* ---- Übersicht ---- */
function wdl(G){return `<div class="wdl" title="${G.w} Siege, ${G.d} Remis, ${G.l} Niederlagen"><i class="w" style="width:${G.w/G.n*100}%"></i><i class="d" style="width:${G.d/G.n*100}%"></i><i class="l" style="width:${G.l/G.n*100}%"></i></div>`}
function trendHtml(G){
  const ks=Object.keys(G.months).sort().slice(-6);if(ks.length<2)return "";
  return `<div><div class="sub" style="margin-bottom:4px">Verlauf (Punkte pro Monat)</div><div class="trend">${ks.map(k=>{const M=G.months[k];const s=M.pts/M.n;return `<i class="${s<.4?"bad":s<.6?"mid":""}" style="height:${Math.max(8,s*100)}%" title="${k}: ${pct(s)} aus ${M.n} Partien"></i>`}).join("")}</div><div class="trend-l">${ks.map(k=>`<span>${MON[+k.slice(5)-1]}</span>`).join("")}</div></div>`;
}
function devText(D){const mv=Math.floor(D.ply/2)+1;const num=mv+(D.ply%2===0?".":"...");return `Du spielst hier oft <b>${esc(num+" "+de(D.played))}</b> statt ${esc(D.book.slice(0,2).map(de).join(" oder "))} (${D.n}×).${D.url?` <a href="${esc(D.url)}" target="_blank" rel="noopener">Partie ansehen</a>`:""}`}
function suggestFor(color,mv){return ALL.filter(o=>o.side===color&&consistentIn(o,mv).length).sort((a,b)=>(S.rep.indexOf(b.id)>=0)-(S.rep.indexOf(a.id)>=0)||(a.g==="x")-(b.g==="x")).slice(0,3)}
function ratingChart(tc){
  const pts=CH.games.filter(g=>g.tc===tc&&g.myR&&g.date).sort((a,b)=>a.date-b.date);if(pts.length<3)return "";
  const W=600,H=180,p=28;const x0=pts[0].date,x1=pts[pts.length-1].date||x0+1;const ys=pts.map(g=>g.myR);const lo=Math.floor((Math.min(...ys)-20)/50)*50,hi=Math.ceil((Math.max(...ys)+20)/50)*50;
  const X=t=>p+(t-x0)/Math.max(1,x1-x0)*(W-p-8),Y=r=>8+(hi-r)/Math.max(1,hi-lo)*(H-8-22);
  const d=pts.map((g,i)=>(i?"L":"M")+X(g.date).toFixed(1)+" "+Y(g.myR).toFixed(1)).join(" ");
  const ticks=[];for(let r=lo;r<=hi;r+=Math.max(50,Math.round((hi-lo)/4/50)*50))ticks.push(r);
  const last=pts[pts.length-1];const first=pts[0];const diff=last.myR-first.myR;
  return `<div class="card"><div class="sec-h"><h3>Wertungsverlauf</h3><small>${{bullet:"Bullet",blitz:"Blitz",rapid:"Schnellschach",daily:"Täglich"}[tc]||tc} · ${pts.length} Partien · <b class="${diff>=0?"score-good":"score-bad"}">${diff>=0?"+":""}${diff}</b></small></div>
  <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${ticks.map(r=>`<line x1="${p}" x2="${W}" y1="${Y(r)}" y2="${Y(r)}" stroke="var(--line)" stroke-width="1"/><text x="2" y="${Y(r)+4}" font-size="11" fill="var(--muted)">${r}</text>`).join("")}
  <path d="${d} L${X(last.date)} ${H-22} L${X(first.date)} ${H-22}Z" fill="rgba(129,182,76,.15)"/><path d="${d}" fill="none" stroke="#81B64C" stroke-width="2.2"/><circle cx="${X(last.date)}" cy="${Y(last.myR)}" r="4" fill="#81B64C"/>
  <text x="${p}" y="${H-5}" font-size="11" fill="var(--muted)">${fmtDate(first.date)}</text><text x="${W-4}" y="${H-5}" font-size="11" fill="var(--muted)" text-anchor="end">${fmtDate(last.date)}</text></svg>
  <div class="chips" style="margin-top:6px">${["bullet","blitz","rapid","daily"].filter(t=>CH.games.filter(g=>g.tc===t).length>=3).map(t=>`<button class="chip" data-rtc="${t}" style="${t===tc?"background:var(--green);color:#fff":""}">${{bullet:"Bullet",blitz:"Blitz",rapid:"Schnell",daily:"Täglich"}[t]}</button>`).join("")}</div></div>`;
}
function renderChOverview(el){
  const R=CH.result;const T=R.tot;
  const tcCount={};CH.games.forEach(g=>{tcCount[g.tc]=(tcCount[g.tc]||0)+1});const tc=CH.rTc&&tcCount[CH.rTc]?CH.rTc:Object.keys(tcCount).sort((a,b)=>tcCount[b]-tcCount[a])[0];
  const weak=R.list.filter(G=>G.n>=3&&G.score<0.5).sort((a,b)=>b.lost-a.lost).slice(0,6);
  // Lücken im Repertoire
  const repOps=S.rep.map(byId).filter(Boolean);const gaps=[];
  ["w","b"].forEach(c=>Object.values(R.opp[c]).filter(O=>O.n>=2).forEach(O=>{const cov=repOps.some(o=>o.side===c&&consistentIn(o,O.mv).length);if(!cov)gaps.push({c,O})}));
  gaps.sort((a,b)=>b.O.n-a.O.n);
  const accs=CH.games.filter(g=>g.acc!=null);const avgAcc=accs.length?accs.reduce((a,g)=>a+g.acc,0)/accs.length:null;
  let html=`<div class="sec-h"><h3>Bilanz</h3><small>${esc(R.label||"")}</small></div>
  <div class="tiles"><div class="tile"><small>Partien</small><b>${T.n}</b><span>${T.wN} mit Weiß · ${T.bN} mit Schwarz</span></div><div class="tile win"><small>Siege</small><b>${T.w}</b><span>${pct(T.w/T.n)}</span></div><div class="tile"><small>Remis</small><b>${T.d}</b><span>${pct(T.d/T.n)}</span></div><div class="tile loss"><small>Niederlagen</small><b>${T.l}</b><span>${pct(T.l/T.n)}${avgAcc!=null?` · Ø Genauigkeit ${avgAcc.toFixed(1)}`:""}</span></div></div>
  ${ratingChart(tc)}
  <div class="sec-h"><h3>Hier verlierst du am meisten</h3><small>Mindestens 3 Partien, sortiert nach verlorenen Punkten</small></div>`;
  if(weak.length){const trainable=weak.filter(G=>G.id);
    if(trainable.length)html+=`<div class="okmsg" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><span>Erstelle aus deinen ${trainable.length} schwächsten Eröffnungen einen Trainingsplan. Sie kommen ins Repertoire und die kritischen Varianten werden sofort fällig.</span><button class="btn grn" id="planBtn">Trainingsplan erstellen</button></div>`;
    html+=`<div class="grid3">${weak.map(G=>{const o=G.id?byId(G.id):null;
      return `<div class="wkc"><div class="wkc-top"><span class="kchip ${G.color}"></span><div style="min-width:0"><h4>${esc(G.name)}</h4><div class="sub">Mit ${G.color==="w"?"Weiß":"Schwarz"} · ${G.n} Partien${G.alias&&G.alias!==G.name?" · "+esc(G.alias):""}</div></div><div class="pct">${pct(G.score)}<small>Punkte</small></div></div>
      ${wdl(G)}<div class="wdl-t"><span>${G.w} S</span><span>${G.d} R</span><span>${G.l} N</span></div>${trendHtml(G)}
      ${G.topDev?`<div class="dev">${devText(G.topDev)}</div>`:""}
      ${o?`<button class="btn grn" data-train="${G.id}" data-line="${G.focusLine===null?"":G.focusLine}">${G.focusLine!==null?"Üben: "+esc(o.lines[G.focusLine].n):"Jetzt üben"}</button>`:`<div class="hint">Für diese Eröffnung gibt es noch keine Übung. Importiere sie unter Lernen → Repertoire importieren.</div>`}</div>`}).join("")}</div>`;
  }else html+=`<div class="card">Keine Eröffnung mit mindestens 3 Partien unter 50 % – stark!</div>`;
  if(gaps.length)html+=`<div class="sec-h"><h3>Lücken in deinem Repertoire</h3><small>${S.rep.length?"Häufige Züge deiner Gegner ohne Antwort im Repertoire":"Markiere Eröffnungen mit Stern, um Lücken zu sehen"}</small></div><div class="grid3">${gaps.slice(0,6).map(({c,O})=>{const sg=suggestFor(c,O.mv);const sc=(O.w+O.d/2)/O.n;return `<div class="card"><div style="display:flex;justify-content:space-between;gap:8px"><b>${c==="w"?"Mit Weiß":"Mit Schwarz"}: ${esc(fmtMoves(O.mv))}</b><span class="sub">${O.n} Partien · ${pct(sc)}</span></div>${wdl(O)}${sg.length?`<div class="chips" style="margin-top:8px">${sg.map(o=>`<button class="chip" data-star2="${o.id}" title="Zum Repertoire hinzufügen und üben">☆ ${esc(o.name)}</button>`).join("")}</div>`:`<p class="hint" style="margin:6px 0 0">Keine passende Übung – importiere eine.</p>`}</div>`}).join("")}</div>`;
  html+=`<div class="sec-h"><h3>Was deine Gegner gegen dich spielen</h3><small>Häufigste Antworten und passende Übungen</small></div><div class="grid3">`;
  for(const c of ["w","b"]){const rows=Object.values(R.opp[c]).sort((a,b)=>b.n-a.n).slice(0,5);if(!rows.length)continue;
    html+=`<div class="card"><h3>${c==="w"?"Wenn du Weiß spielst":"Wenn du Schwarz spielst"}</h3>${rows.map(O=>{const sc=(O.w+O.d/2)/O.n;const sg=suggestFor(c,O.mv);
      return `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(fmtMoves(O.mv))}</b><span class="sub">${O.n} Partien · <span class="${sc<.45?"score-bad":sc>.55?"score-good":""}">${pct(sc)}</span></span></div>${wdl(O)}${sg.length?`<div class="chips" style="margin-top:6px">${sg.map(o=>`<button class="chip" data-train="${o.id}" data-line="${consistentIn(o,O.mv)[0]}">${esc(o.name)}</button>`).join("")}</div>`:""}</div>`}).join("")}</div>`}
  html+=`</div>`;
  for(const c of ["w","b"]){const rows=R.list.filter(G=>G.color===c).sort((a,b)=>b.n-a.n);if(!rows.length)continue;
    html+=`<div class="sec-h"><h3>Alle Eröffnungen mit ${c==="w"?"Weiß":"Schwarz"}</h3><small>${rows.length} Gruppen</small></div><div class="tbl-wrap"><table><thead><tr><th>Eröffnung</th><th style="text-align:right">Partien</th><th>Bilanz</th><th style="text-align:right">Punkte</th><th></th></tr></thead><tbody>
    ${rows.map(G=>`<tr><td><div class="nm">${esc(G.name)}${G.id?"":" <small>(keine Übung)</small>"}</div></td><td class="num">${G.n}</td><td>${wdl(G)}</td><td class="num ${G.score<0.45?"score-bad":G.score>0.55?"score-good":""}">${pct(G.score)}</td><td style="text-align:right">${G.id?`<button class="mini" data-train="${G.id}" data-line="${G.focusLine===null?"":G.focusLine}">Üben</button>`:""}</td></tr>`).join("")}</tbody></table></div>`}
  el.innerHTML=html;
  el.querySelectorAll("[data-train]").forEach(b=>b.onclick=()=>{const o=byId(b.dataset.train);const ln=b.dataset.line===""?null:+b.dataset.line;selectOpening(o,ln)});
  el.querySelectorAll("[data-rtc]").forEach(b=>b.onclick=()=>{CH.rTc=b.dataset.rtc;renderChOverview(el)});
  el.querySelectorAll("[data-star2]").forEach(b=>b.onclick=()=>{const o=byId(b.dataset.star2);if(S.rep.indexOf(o.id)<0){S.rep.push(o.id);save("rep")}toast(o.name+" ist jetzt im Repertoire");selectOpening(o)});
  const pb=$("planBtn");if(pb)pb.onclick=()=>{
    const ks=[];weak.filter(G=>G.id).forEach(G=>{if(S.rep.indexOf(G.id)<0)S.rep.push(G.id);const o=byId(G.id);const fl=G.focusLine!==null?G.focusLine:0;
      [fl].concat(o.lines.map((l,i)=>i).filter(i=>i!==fl&&P(o.id,i)<2).slice(0,2)).forEach(i=>{const k=lk(o.id,i);S.srs[k]=Object.assign({iv:0,ef:2.5,reps:0,lapses:0},S.srs[k]||{},{due:0});ks.push(k)})});
    save("rep");save("srs");S.daily=null;save("daily");toast("Trainingsplan erstellt: "+ks.length+" Varianten");startSession("plan",ks,"Trainingsplan")};
}

/* ---- Partienliste & Game Review ---- */
const REV=store.get("et-reviews",{});
function renderChGames(el){
  const F=[["all","Alle"],["win","Siege"],["loss","Niederlagen"],["draw","Remis"],["w","Mit Weiß"],["b","Mit Schwarz"]];
  const list=CH.games.filter(g=>CH.gFilter==="all"||g.res===CH.gFilter||g.color===CH.gFilter).slice(0,150);
  el.innerHTML=`<div class="filters">${F.map(f=>`<button class="chip" data-gf="${f[0]}" style="${CH.gFilter===f[0]?"background:var(--green);color:#fff":""}">${f[1]}</button>`).join("")}</div>
  <p class="hint" style="margin:0">Tippe auf eine Partie für das Game Review: Stockfish bewertet jeden Zug (von Brillant bis Patzer), zeigt bessere Züge, deine Genauigkeit und geschätzte Elo. Mit eigenen Zügen auf dem Brett analysierst du Varianten.</p>
  <div class="glist">${list.map((g,i)=>{const rv=REV[g.id];return `<button class="gi" data-gi="${CH.games.indexOf(g)}"><span class="res ${g.res}">${g.res==="win"?"S":g.res==="loss"?"N":"½"}</span><span style="min-width:0"><b>${g.color==="w"?"♔":"♚"} gegen ${esc(g.opp)}${g.oppR?` (${g.oppR})`:""}</b><small>${esc(g.fam)} · ${{bullet:"Bullet",blitz:"Blitz",rapid:"Schnell",daily:"Täglich"}[g.tc]||g.tc}${g.term?" · "+esc(g.term):""} · ${g.date?fmtDate(g.date):""}</small></span><span class="acc">${rv&&rv.acc?rv.acc[g.color].toFixed(1)+" %":g.acc!=null?g.acc.toFixed(1)+" %":""}</span><span class="mini">Review</span></button>`}).join("")||'<div class="card">Keine Partien.</div>'}</div>`;
  el.querySelectorAll("[data-gf]").forEach(b=>b.onclick=()=>{CH.gFilter=b.dataset.gf;renderChGames(el)});
  el.querySelectorAll("[data-gi]").forEach(b=>b.onclick=()=>reviewGame(CH.games[+b.dataset.gi]));
}
async function reviewGame(g){
  const R={evals:[],cls:[],best:[],doneN:0,acc:null,engine:""};
  const cached=REV[g.id];if(cached&&cached.n===g.moves.length&&cached.v===REV_V){Object.assign(R,cached,{doneN:g.moves.length})}
  const gm={fen:g.fen||null,id:"rv-"+g.id,title:`${g.white} – ${g.black}`,players:`${g.white}${g.color==="w"&&g.myR?" ("+g.myR+")":g.color==="b"&&g.oppR?" ("+g.oppR+")":""} – ${g.black}${g.color==="b"&&g.myR?" ("+g.myR+")":g.color==="w"&&g.oppR?" ("+g.oppR+")":""}`,year:g.date?fmtDate(g.date):"",moves:g.moves,url:g.url,orient:g.color,d:`${g.fam} · ${g.foreign?"Ergebnis "+(g.result||"–"):g.res==="win"?"gewonnen":g.res==="loss"?"verloren":"Remis"}${g.term?" ("+g.term+")":""}`,review:R};
  openGame(gm);
  if(R.doneN>=g.moves.length&&R.acc){setStatus("view","Game Review",`Genauigkeit: Weiß ${R.acc.w.toFixed(1)} · Schwarz ${R.acc.b.toFixed(1)}`,true);return}
  setStatus("view","Game Review läuft …","Stockfish bewertet jeden Zug. Du kannst schon blättern.",true);
  let res;try{res=await reviewCore(g,R,i=>{if(game===gm&&(i%3===0))render()},()=>game===gm)}catch(e){if(game===gm)setStatus("bad","Stockfish konnte nicht geladen werden","Ohne Engine ist kein Review möglich.");return}
  if(!res)return;
  if(game===gm){render();if(view>0||gm.vari){replayStatus()}else{const N=playerNames();setStatus("view","Game Review fertig",g.foreign?`Genauigkeit: ${N.w} ${R.acc.w.toFixed(1)} · ${N.b} ${R.acc.b.toFixed(1)}. Mit → oder »Moment ▶« durch die Partie.`:`Deine Genauigkeit: ${R.acc[g.color].toFixed(1)} % (≈ ${estRating(R.acc[g.color])} Elo). ${res.added?res.added+(res.added===1?" Fehler wurde":" Fehler wurden")+" als Übung gespeichert (Lernen → Deine Fehler).":"Keine groben Fehler – stark!"}`,true)}}
  renderTabbar();
}
/* Bewertet eine Partie mit Stockfish (ohne Brett), klassifiziert jeden Zug wie ein Game Review
   (Brillant, Großartig, Bester Zug, Exzellent, Gut, Buch, Ungenau, Fehler, Verpasst, Patzer, Erzwungen),
   speichert das Review und eigene Fehler als Übungen */
const REV_V=2;
async function reviewCore(g,R,onStep,alive){
  R=R||{};Object.assign(R,{evals:[],cls:[],best:[],pv:[],alt:[],drops:[],doneN:0,acc:null,engine:"",v:REV_V});
  const c0=new Chess(g.fen||undefined);const F=[c0.fen()],M=[];R.fen=g.fen||null;
  for(const m of g.moves){const mv=findMove(c0,m);if(!mv)break;M.push(c0.move(mv.san));F.push(c0.fen())}
  const n=M.length,sans=M.map(m=>m.san);R.n=n;
  await loadSF();R.engine=sfName;const ms=S.set.revMs||300;
  for(let i=0;i<=n;i++){
    if(alive&&!alive())return null;
    const c=new Chess(F[i]);
    if(c.game_over()){R.evals[i]=c.in_checkmate()?(c.turn()==="w"?-10000:10000):0;R.best[i]=null;R.pv[i]=[];R.alt[i]=null}
    else{const r=await sfRun(F[i],{ms,multi:2});if(alive&&!alive())return null;
      R.evals[i]=cpOf(r.score,c.turn());R.best[i]=r.best;R.pv[i]=(r.pv||[]).slice(0,10);R.alt[i]=r.lines&&r.lines[1]?cpOf(r.lines[1].score,c.turn()):null}
    if(i>0)R.cls[i-1]=classifyMove(R,F,M,sans,i-1);
    R.doneN=i;if(onStep)onStep(i,n);
  }
  const accOf=s=>{const a=[];R.drops.forEach((d,i)=>{if((i%2===0?"w":"b")===s&&R.cls[i]!=="book"&&R.cls[i]!=="forced")a.push(moveAcc(d))});return a.length?a.reduce((x,y)=>x+y,0)/a.length:100};
  R.acc={w:accOf("w"),b:accOf("b")};R.phase=phaseAcc(R,F);R.doneN=n;
  REV[g.id]={n,v:REV_V,fen:R.fen,evals:R.evals,cls:R.cls,best:R.best,pv:R.pv,alt:R.alt,drops:R.drops,acc:R.acc,phase:R.phase,engine:R.engine};
  const ks=Object.keys(REV);if(ks.length>30)delete REV[ks[0]];store.set("et-reviews",REV);
  let added=0;if(!g.foreign)R.cls.forEach((k,i)=>{if((k==="mist"||k==="blun"||k==="miss")&&(i%2===0?"w":"b")===g.color&&R.best[i]){const key="rv:"+g.id+":"+i;if(S.puz.some(p=>p.key===key))return;
    const bm=new Chess(F[i]).moves({verbose:true}).find(m=>m.from+m.to+(m.promotion||"")===R.best[i]);if(!bm)return;
    S.puz.unshift({key,kind:"engine",fen:F[i],best:bm.san,played:M[i].san,cls:CLS[k][0],opp:g.opp,date:g.date,opening:g.fam,url:g.url});added++}});
  S.puz=S.puz.slice(0,200);save("puz");st.reviews++;saveStats();checkBadges();
  return {R,added,n};
}

/* ---- Eigener Eröffnungsbaum ---- */
function treeStats(color,h){
  const res={};let tot={n:0,w:0,d:0,l:0};
  CH.games.forEach(g=>{if(color&&g.color!==color)return;if(g.moves.length<=h.length)return;for(let k=0;k<h.length;k++)if(strip(g.moves[k])!==strip(h[k]))return;
    const m=g.moves[h.length];const R=g.res==="win"?"w":g.res==="draw"?"d":"l";const x=res[m]||(res[m]={san:m,n:0,w:0,d:0,l:0});x.n++;x[R]++;tot.n++;tot[R]++});
  return {moves:Object.values(res).sort((a,b)=>b.n-a.n),tot};
}
function myTreeAt(h){
  if(!CH.games.length)return "";const t=treeStats(null,h);if(!t.tot.n)return `<div class="excard"><div class="exh"><span>Deine Partien</span></div><p class="sub">Diese Stellung kam in deinen geladenen Partien nicht vor.</p></div>`;
  return `<div class="excard"><div class="exh"><span>Deine Partien (${t.tot.n})</span></div>${t.moves.slice(0,8).map(m=>`<div class="dbrow" data-san="${esc(m.san)}"><b>${esc(de(m.san))}</b><small>${m.n}×</small>${dbBar({white:m.w,draws:m.d,black:m.l})}</div>`).join("")}<p class="leads">Balken: deine Siege · Remis · Niederlagen</p></div>`;
}
function renderChTree(el){
  const h=CH.treePath;const t=treeStats(CH.treeColor,h);
  const ow=ALL.filter(o=>o.side===CH.treeColor&&o.g!=="c"&&h.length&&consistentIn(o,h).length);
  el.innerHTML=`<div class="filters"><span class="seg"><button data-tcol="w" aria-pressed="${CH.treeColor==="w"}">Mit Weiß</button><button data-tcol="b" aria-pressed="${CH.treeColor==="b"}">Mit Schwarz</button></span></div>
  <div class="card"><div class="crumbs"><button data-tp="0">Start</button>${h.map((m,i)=>`<button data-tp="${i+1}">${esc(fmtMoves([m],i))}</button>`).join("")}</div>
  <p class="hint" style="margin:8px 0">${t.tot.n} deiner Partien gingen durch diese Stellung. Tippe auf einen Zug, um tiefer zu gehen.</p>
  ${t.moves.length?t.moves.map(m=>{const sc=(m.w+m.d/2)/m.n;return `<div class="ptr" data-tm="${esc(m.san)}"><b>${esc(fmtMoves([m.san],h.length))}</b><small>${m.n} Part.</small>${dbBar({white:m.w,draws:m.d,black:m.l})}<small class="${sc<.45?"score-bad":sc>.55?"score-good":""}">${pct(sc)}</small></div>`}).join(""):'<p class="sub">Hier enden deine Partien.</p>'}
  ${ow.length?`<div class="btnrow" style="margin-top:10px"><span class="sub">Üben ab hier:</span>${ow.slice(0,4).map(o=>`<button class="chip" data-tro="${o.id}">${esc(o.name)}</button>`).join("")}</div>`:""}
  ${h.length?`<div class="btnrow" style="margin-top:10px"><button class="btn" id="trBoard">Stellung im Editor öffnen</button></div>`:""}</div>`;
  el.querySelectorAll("[data-tcol]").forEach(b=>b.onclick=()=>{CH.treeColor=b.dataset.tcol;CH.treePath=[];renderChTree(el)});
  el.querySelectorAll("[data-tp]").forEach(b=>b.onclick=()=>{CH.treePath=h.slice(0,+b.dataset.tp);renderChTree(el)});
  el.querySelectorAll("[data-tm]").forEach(b=>b.onclick=()=>{CH.treePath=h.concat([b.dataset.tm]);renderChTree(el)});
  el.querySelectorAll("[data-tro]").forEach(b=>b.onclick=()=>{const o=byId(b.dataset.tro);const c=consistentIn(o,h);selectOpening(o,c[0])});
  const tb=$("trBoard");if(tb)tb.onclick=()=>{$("edSide").value=CH.treeColor;openEditor();h.forEach(m=>{const mv=findMove(shown,m);if(mv)editMove(mv,false)})};
}

/* ---- Rätsel ---- */
async function renderChPuzzle(el){
  el.innerHTML=`<div class="card"><h3>Rätsel des Tages von Chess.com</h3><div id="pzDaily">${SKEL}</div></div>
  <div class="card"><h3>Zufallsrätsel</h3><p class="hint" style="margin:0 0 10px">Ein zufälliges Rätsel aus dem Chess.com-Archiv.</p><button class="btn grn" id="pzRnd">Zufallsrätsel lösen</button></div>
  <div class="card"><h3>Deine Fehler</h3><p class="hint" style="margin:0 0 10px">${S.puz.length} Stellungen aus deinen eigenen Partien – Buchabweichungen und Fehler aus dem Game Review.</p><button class="btn grn" id="pzMine" ${S.puz.length?"":"disabled"}>Fehler üben</button></div>`;
  const play=(d,label)=>{
    const sol=pgnMoves(d.pgn||"");const g=new Chess(d.fen);const ok=[];for(const m of sol){const mv=g.move(m,{sloppy:true});if(!mv)break;ok.push(mv.san)}
    if(!ok.length){toast("Das Rätsel konnte nicht gelesen werden.");return}
    startPuzzle({fen:d.fen,sol:ok,title:label+": "+(d.title||"Rätsel"),eco:"Chess.com-Rätsel",sub:d.url?"Original auf Chess.com":"",prompt:"Finde den besten Zug",after:d.url?"Das Rätsel stammt von Chess.com.":""});
  };
  $("pzMine").onclick=()=>startSession("mine");
  $("pzRnd").onclick=async()=>{try{play(await getJSON("https://api.chess.com/pub/puzzle/random"),"Zufallsrätsel")}catch(e){toast("Chess.com ist gerade nicht erreichbar.")}};
  try{const d=await getJSON("https://api.chess.com/pub/puzzle");const box=$("pzDaily");if(!box)return;
    box.innerHTML=`<div class="puzzle-card"><div id="pzB"></div><div><b style="font-size:16px">${esc(d.title||"Tagesrätsel")}</b><p class="hint">${d.publish_time?fmtDate(d.publish_time*1000):""} · ${new Chess(d.fen).turn()==="w"?"Weiß":"Schwarz"} am Zug</p><button class="btn grn" id="pzGo">Lösen</button> ${d.url?`<a href="${esc(d.url)}" target="_blank" rel="noopener" style="margin-left:8px">auf Chess.com</a>`:""}</div></div>`;
    $("pzB").appendChild(staticBoard(d.fen,new Chess(d.fen).turn()));$("pzGo").onclick=()=>play(d,"Tagesrätsel")}
  catch(e){const box=$("pzDaily");if(box)box.innerHTML='<p class="sub">Chess.com ist gerade nicht erreichbar.</p>'}
}

/* ================= Partieanalyse (Game Review wie auf Chess.com) ================= */
Object.assign(CLS,{brill:["Brillant","c-brill","!!"],great:["Großartig","c-great","!"],miss:["Verpasst","c-miss","✗"],forced:["Erzwungen","c-forced","→"]});
CLS.exc[2]="+";
const REV_ORDER=["brill","great","best","exc","good","book","inacc","mist","miss","blun"];
const REV_COL={brill:"#26C2A3",great:"#749BBF",best:"#81B64C",exc:"#5DA34A",good:"#77A39A",book:"#A88865",inacc:"#E8B931",mist:"#E58F2A",miss:"#EE6B55",blun:"#CA3431",forced:"#8B8987"};
const KEY_CLS=["brill","great","miss","blun","mist"];
const moveAcc=d=>Math.max(0,Math.min(100,103.1668*Math.exp(-0.04354*d)-3.1669));
const PVAL={p:1,n:3,b:3,r:5,q:9,k:0};
function matBal(fen,color){const g=new Chess(fen);let s=0;g.board().forEach(r=>r.forEach(p=>{if(p)s+=(p.color===color?1:-1)*PVAL[p.type]}));return s}
const uciMove=(g,u)=>u?g.moves({verbose:true}).find(m=>m.from+m.to+(m.promotion||"")===u):null;
/* Materialbilanz (aus Sicht von color) nach jedem Halbzug einer Engine-Variante */
function lineBal(fen,pv,color,plies){const g=new Chess(fen);const out=[];for(let i=0;i<Math.min(plies,(pv||[]).length);i++){const m=uciMove(g,pv[i]);if(!m)break;g.move(m.san);out.push(matBal(g.fen(),color))}return out}
function pvSan(fen,pv,n){const g=new Chess(fen);const out=[];for(const u of (pv||[]).slice(0,n||8)){const m=uciMove(g,u);if(!m)break;out.push(g.move(m.san).san)}return out}
const plyOf=fen=>{const p=fen.split(" ");return (+p[5]-1)*2+(p[1]==="b"?1:0)};
const mateN=cp=>Math.abs(cp)>=9000?Math.max(1,Math.round((10000-Math.abs(cp))/10)):0;
const fmtEv=cp=>cp==null?"–":mateN(cp)?(cp>0?"+":"−")+"M"+mateN(cp):fmtEval(cp);

/* ---- Klassifizierung eines Zuges (Index k = Zug von Stellung k nach k+1) ---- */
function classifyMove(R,F,M,sans,k){
  const mv=M[k],side=mv.color,sw=v=>side==="w"?winPct(v):100-winPct(v);
  const before=sw(R.evals[k]),after=sw(R.evals[k+1]);const drop=Math.max(0,before-after);R.drops[k]=drop;
  const uci=mv.from+mv.to+(mv.promotion||"");
  if(new Chess(F[k]).moves().length===1)return "forced";
  if(!R.fen&&k<30&&anyBook(sans.slice(0,k+1)))return "book";
  const isBest=uci===R.best[k];
  // Brillant: bester (oder gleichwertiger) Zug, der echt Material opfert – und die Stellung bleibt gut
  const mates=(side==="w"?R.evals[k+1]:-R.evals[k+1])>=9000;
  if((isBest||drop<2)&&after>=50&&(before<97||mates)&&!mv.promotion){
    // Opfer: Der Gegner schlägt in der besten Fortsetzung eine Figur (kein Bauer) und das Material bleibt danach weniger
    const b0=matBal(F[k],side);const pv=R.pv[k+1]||[];const g=new Chess(F[k+1]);const bal=[];let pieceTaken=false;
    for(let i=0;i<Math.min(4,pv.length);i++){const m=uciMove(g,pv[i]);if(!m)break;const r=g.move(m.san);if(i%2===0&&r.captured&&r.captured!=="p")pieceTaken=true;bal.push(matBal(g.fen(),side))}
    if(pieceTaken&&bal.length>=2){const b2=bal[1],b4=bal[Math.min(3,bal.length-1)];if(b2<=b0-1&&b4<=b0-1)return "brill"}
  }
  // Großartig: der einzige gute Zug (die zweitbeste Fortsetzung ist deutlich schlechter)
  if(isBest&&R.alt[k]!=null&&before>15&&before<97){const recap=k>0&&M[k-1].captured&&M[k-1].to===mv.to;if(!recap&&before-sw(R.alt[k])>=18)return "great"}
  if(isBest)return "best";
  // Verpasst: Der Gegner hatte gerade gepatzt, die Chance wird nicht genutzt
  const prev=k>0?R.cls[k-1]:null;
  if(drop>=10&&before>=65&&after>=30&&["inacc","mist","blun","miss"].indexOf(prev)>=0)return "miss";
  return drop<2?"exc":drop<5?"good":drop<10?"inacc":drop<20?"mist":"blun";
}
/* Genauigkeit nach Partiephase */
function phaseAcc(R,F){
  const out={w:{},b:{}};const acc={w:{o:[],m:[],e:[]},b:{o:[],m:[],e:[]}};let lastBook=-1;R.cls.forEach((c,i)=>{if(c==="book")lastBook=i});
  R.cls.forEach((c,k)=>{if(!c||c==="forced")return;const g=new Chess(F[k]);let np=0;g.board().forEach(r=>r.forEach(p=>{if(p&&p.type!=="p"&&p.type!=="k")np+=PVAL[p.type]}));
    const ph=np<=26?"e":(k<=Math.max(lastBook,15)&&k<30)?"o":"m";if(c==="book")return;acc[k%2===0?"w":"b"][ph].push(moveAcc(R.drops[k]||0))});
  ["w","b"].forEach(s=>["o","m","e"].forEach(p=>{const a=acc[s][p];out[s][p]=a.length?a.reduce((x,y)=>x+y,0)/a.length:null}));return out;
}
function estRating(acc){const P=[[0,100],[40,300],[50,500],[60,800],[70,1150],[75,1400],[80,1650],[85,1950],[90,2300],[95,2700],[100,3000]];
  for(let i=1;i<P.length;i++)if(acc<=P[i][0]){const [a0,r0]=P[i-1],[a1,r1]=P[i];return Math.round((r0+(acc-a0)/(a1-a0)*(r1-r0))/50)*50}return 3000}

/* ---- Hauptlinie vs. eigene Analyse-Variante ---- */
const inMainMove=k=>!(game&&game.vari)||k<game.vari.base;
const mainFens=()=>game&&game.vari?game.vari.main.fens:fens;
const mainMvs=()=>game&&game.vari?game.vari.main.mvs:mvs;
const sideName=c=>c==="w"?"Weiß":"Schwarz";
function playerNames(){const t=(game&&game.title||"Weiß – Schwarz").split(" – ");return {w:t[0]||"Weiß",b:t[1]||"Schwarz"}}

/* ---- Text zu einem Zug wie beim Coach ---- */
function reviewMoveInfo(k){
  const R=game.review,F=mainFens(),M=mainMvs();const mv=M[k];if(!mv||!R.cls[k])return null;
  const c=R.cls[k],side=mv.color,opp=side==="w"?"b":"w",san=de(mv.san);
  const bestMv=uciMove(new Chess(F[k]),R.best[k]);const bestSan=bestMv?de(bestMv.san):"";
  const bestLine=bestMv?fmtMoves(pvSan(F[k],R.pv[k],6),plyOf(F[k])):"";
  const replyLine=fmtMoves(pvSan(F[k+1],R.pv[k+1],5),plyOf(F[k+1]));
  const myCp=v=>v==null?0:side==="w"?v:-v;
  const reason=()=>{
    const ca=myCp(R.evals[k+1]);if(ca<=-9000)return `Danach setzt ${sideName(opp)} in ${mateN(ca)} ${mateN(ca)===1?"Zug":"Zügen"} matt: ${replyLine}.`;
    const g=new Chess(F[k+1]);let lost=null;(R.pv[k+1]||[]).slice(0,4).forEach((u,i)=>{const m=uciMove(g,u);if(!m)return;const r=g.move(m.san);if(i%2===0&&r.captured&&(!lost||PVAL[r.captured]>PVAL[lost]))lost=r.captured});
    const bA=matBal(F[k+1],side);const bl=lineBal(F[k+1],R.pv[k+1],side,4);const low=bl.length>=2?Math.min(bl[1],bl[Math.min(3,bl.length-1)]):bA;
    if(lost&&bA-low>=2)return `Danach verliert ${sideName(side)} ${ACC[lost]}: ${replyLine}.`;
    const cb=myCp(R.evals[k]);if(cb>=9000)return `Dabei gab es ein Matt in ${mateN(cb)}.`;
    const w=side==="w"?winPct(R.evals[k+1]):100-winPct(R.evals[k+1]);
    return w<40?`Danach steht ${sideName(opp)} klar besser (${fmtEv(R.evals[k+1])}).`:w<50?`Damit gibt ${sideName(side)} den Vorteil ab (${fmtEv(R.evals[k+1])}).`:`Der Vorteil schrumpft (${fmtEv(R.evals[k+1])}).`;
  };
  const gain=()=>{const cb=myCp(R.evals[k]);if(cb>=9000)return `führte zum Matt in ${mateN(cb)}`;const b0=matBal(F[k],side);const bl=lineBal(F[k],R.pv[k],side,5);if(bl.length&&bl[bl.length-1]-b0>=2)return "gewann Material";return "hielt den Vorteil"};
  const T={
    brill:[`${san} ist brillant!`,`Ein starkes Opfer – ${sideName(side)} gibt Material und steht trotzdem ${myCp(R.evals[k+1])>150?"klar besser":"gut"} (${fmtEv(R.evals[k+1])}).`],
    great:[`${san} ist großartig!`,`Der einzige Zug, der die Stellung hält – die Alternativen wären deutlich schlechter.`],
    best:[`${san} ist der beste Zug`,explain(F[k],mv,k>0?M[k-1]:null).text],
    exc:[`${san} ist exzellent`,`Fast so stark wie der beste Zug ${bestSan}.`],
    good:[`${san} ist gut`,`Solide. Etwas genauer war ${bestSan}.`],
    book:[`${san} ist ein Buchzug`,`Bekannte Eröffnungstheorie.`],
    forced:[`${san} war erzwungen`,`Es gab nur diesen einen legalen Zug.`],
    inacc:[`${san} ist eine Ungenauigkeit`,`${reason()} Besser war ${bestSan}.`],
    mist:[`${san} ist ein Fehler`,`${reason()} Besser war ${bestSan}.`],
    miss:[`${san} verpasst eine Chance`,`Nach dem Fehler des Gegners ${gain()} ${bestSan}. ${reason()}`],
    blun:[`${san} ist ein Patzer`,`${reason()} Besser war ${bestSan}.`]
  }[c];
  return {c,title:T[0],text:T[1],bestSan,bestLine,replyLine,ev:R.evals[k+1],side,san,num:Math.floor(k/2)+1+(k%2?"...":".")};
}
/* Coach-Blase im Review */
function paintCoach(c){const co=$("coach");co.style.setProperty("--k",REV_COL[c]);const f=$("face");f.innerHTML=`<b style="font-size:${CLS[c][2].length>1?13:16}px;color:#fff">${CLS[c][2]}</b>`;f.style.background=REV_COL[c]}
function replayStatus(){
  const R=game&&game.review;
  if(game&&game.vari&&view>game.vari.base){if(game.lastJudge&&game.lastJudge.ply===view){const j=game.lastJudge;setStatus("view",j.t,j.s,true);if(j.c)paintCoach(j.c)}else setStatus("view","Eigene Analyse",`Zug ${view-game.vari.base} der Variante. »Zur Partie« bringt dich zurück.`,true);return}
  if(R&&view>0&&R.cls[view-1]){const I=reviewMoveInfo(view-1);if(I){setStatus("view",I.title,I.text,true);paintCoach(I.c);return}}
  const n=game.n||hist.length;
  setStatus("view",R?(R.doneN>=n?"Game Review":"Game Review läuft …"):game.title,view?`Zug ${Math.ceil(view/2)} von ${Math.ceil(n/2)}`:(R&&R.acc?`Genauigkeit: ${playerNames().w} ${R.acc.w.toFixed(1)} · ${playerNames().b} ${R.acc.b.toFixed(1)}`:`${game.players||""}${game.year?", "+game.year:""}`),true);
}

/* ---- Panel: Zugkarte, Engine-Linien, Zusammenfassung ---- */
function reviewMoveHtml(k){
  const I=reviewMoveInfo(k);if(!I)return "";
  const showBest=["inacc","mist","blun","miss","good","exc"].indexOf(I.c)>=0&&I.bestSan;
  return `<div class="excard rvcard" style="--k:${REV_COL[I.c]}"><div class="rvh"><span class="cls big ${CLS[I.c][1]}">${CLS[I.c][2]}</span><div><b>${esc(I.num+" "+I.san)} · ${CLS[I.c][0]}</b><small>Bewertung danach: ${fmtEv(I.ev)}</small></div></div>
    <p>${esc(I.text)}</p>${showBest?`<p class="rvbest"><span class="cls c-best">★</span>Bester Zug: <b>${esc(I.bestSan)}</b>${I.bestLine?` <span class="ln">${esc(I.bestLine)}</span>`:""}</p>`:""}
    ${["inacc","mist","blun","miss"].indexOf(I.c)>=0&&I.replyLine?`<p class="leads">Erwartete Fortsetzung nach ${esc(I.san)}: ${esc(I.replyLine)}</p>`:""}</div>`;
}
const engCache=new Map(),evCache=new Map(),engPend=new Set();
function engineLinesHtml(){return `<div class="excard"><div class="exh"><span>Stockfish · beste Züge</span><span id="engInfo"></span></div><div id="engLines">${SKEL}</div></div>`}
function fillEngineLines(){
  const el=$("engLines");if(!el)return;const fen=shown.fen();const g=new Chess(fen);
  if(g.game_over()){el.innerHTML=`<p class="sub">${g.in_checkmate()?"Schachmatt.":"Remis."}</p>`;return}
  const draw=r=>{if(!$("engLines")||shown.fen()!==fen)return;const turn=g.turn();
    $("engLines").innerHTML=(r.lines||[]).map(l=>{const cp=cpOf(l.score,turn);const sans=pvSan(fen,l.pv,8);if(!sans.length)return "";return `<button class="eline" data-u="${esc(l.pv[0])}"><b class="ev ${cp>=0?"w":"b"}">${fmtEv(cp)}</b><span>${esc(fmtMoves(sans,plyOf(fen)))}</span></button>`}).join("")||'<p class="sub">Keine Linien.</p>';
    const d=r.lines&&r.lines[0]?r.lines[0].depth:0;if($("engInfo"))$("engInfo").textContent=d&&d<100?"Tiefe "+d:"";
    $("engLines").querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>{const m=uciMove(new Chess(shown.fen()),b.dataset.u);if(m)tryMove(m.from,m.to,true,m.promotion)})};
  if(engCache.has(fen)){draw(engCache.get(fen));return}
  if(engPend.has(fen))return;
  const myView=view;setTimeout(()=>{if(view!==myView||shown.fen()!==fen||engPend.has(fen))return;engPend.add(fen);
    sfRun(fen,{ms:700,multi:3}).finally(()=>engPend.delete(fen)).then(r=>{engCache.set(fen,r);if(engCache.size>300)engCache.delete(engCache.keys().next().value);if(r.score)evCache.set(fen,cpOf(r.score,g.turn()));draw(r)}).catch(()=>{if($("engLines"))$("engLines").innerHTML='<p class="sub">Stockfish konnte nicht geladen werden.</p>'})},200);
}
function reviewSummaryHtml(R){
  const n=game.n||R.n||hist.length,N=playerNames();
  const C={w:{},b:{}};R.cls.forEach((k,i)=>{if(!k)return;const s=i%2===0?"w":"b";C[s][k]=(C[s][k]||0)+1});
  const pts=R.evals.map((v,i)=>v==null?null:[i,winPct(v)]).filter(Boolean);const X=i=>(i/Math.max(1,n)*100).toFixed(2);
  const area=pts.length?`M0 100 ${pts.map(p=>"L"+X(p[0])+" "+(100-p[1]).toFixed(2)).join(" ")} L${X(pts[pts.length-1][0])} 100Z`:"";
  const dots=R.cls.map((c,k)=>KEY_CLS.indexOf(c)>=0&&R.evals[k+1]!=null?`<i class="gdot" style="left:${X(k+1)}%;top:${(100-winPct(R.evals[k+1])).toFixed(2)}%;background:${REV_COL[c]}"></i>`:"").join("");
  const vline=Math.min(view,game.vari?game.vari.base:view);
  const done=R.doneN>=n&&R.acc;
  const accBox=s=>`<div class="rvacc ${s}"><small>${esc(N[s])}</small><b>${done?R.acc[s].toFixed(1):"…"}</b>${done?`<span>≈ ${estRating(R.acc[s])} Elo</span>`:""}</div>`;
  const rows=REV_ORDER.map(k=>`<b>${C.w[k]||0}</b><span class="c"><span class="cls ${CLS[k][1]}">${CLS[k][2]}</span>${CLS[k][0]}</span><b>${C.b[k]||0}</b>`).join("");
  const ph=R.phase,phc=v=>v==null?'<span class="phz none">–</span>':`<span class="phz" style="background:${v>=85?REV_COL.best:v>=70?REV_COL.good:v>=55?REV_COL.inacc:REV_COL.blun}">${v.toFixed(0)}</span>`;
  const phases=ph?`<div class="rvph"><span></span><small>${esc(N.w)}</small><small>${esc(N.b)}</small>${[["o","Eröffnung"],["m","Mittelspiel"],["e","Endspiel"]].map(p=>`<span>${p[1]}</span>${phc(ph.w[p[0]])}${phc(ph.b[p[0]])}`).join("")}</div>`:"";
  const keys=R.cls.map((c,k)=>KEY_CLS.indexOf(c)>=0?`<button class="keym" data-kv="${k+1}"><span class="cls ${CLS[c][1]}">${CLS[c][2]}</span>${Math.floor(k/2)+1}${k%2?"...":"."} ${esc(de(mainMvs()[k]?mainMvs()[k].san:""))}</button>`:"").join("");
  return `<div class="excard"><div class="exh"><span>Game Review${R.doneN<n?` · analysiere ${R.doneN}/${n}`:""}</span><span>${esc(R.engine||"")}</span></div>
  ${R.doneN<n?`<div class="prog" style="margin:4px 0 10px"><i style="width:${R.doneN/n*100}%"></i></div>`:""}
  <div class="rvaccs">${accBox("w")}${accBox("b")}</div>
  <div class="graphw"><svg class="graph" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Bewertungsverlauf – antippen springt zum Zug"><path d="${area}" fill="#F2F1EC"/><line x1="0" y1="50" x2="100" y2="50" stroke="#888" stroke-width=".4"/><line x1="${X(vline)}" y1="0" x2="${X(vline)}" y2="100" stroke="#81B64C" stroke-width=".8"/></svg>${dots}</div>
  <div class="revsum" style="margin-top:10px"><span class="sub" style="text-align:center">${esc(N.w)}</span><span></span><span class="sub" style="text-align:center">${esc(N.b)}</span>${rows}</div>
  ${done&&phases?`<div class="exh" style="margin-top:12px"><span>Genauigkeit nach Phase</span></div>${phases}`:""}
  ${keys?`<div class="exh" style="margin-top:12px"><span>Wichtige Momente</span></div><div class="keyms">${keys}</div>`:""}</div>`;
}
function wireReviewPanel(el){
  el.querySelectorAll("[data-kv]").forEach(b=>b.onclick=()=>{if(game&&game.vari)exitVari();setView(+b.dataset.kv)});
  const gr=el.querySelector(".graph");if(gr)gr.onclick=e=>{const r=gr.getBoundingClientRect();const n=game.n||hist.length;if(game&&game.vari)exitVari();setView(Math.round((e.clientX-r.left)/r.width*n))};
  if(mode==="replay")fillEngineLines();
}

/* ---- Eigene Züge im Review: Analyse-Variante, Nochmal versuchen, Bester Zug ---- */
function anaMove(mv,animate){
  const G=game;if(!G)return;
  if(G.vari&&view<G.vari.base)exitVari(true);
  if(!G.vari)G.vari={base:view,main:{hist:hist.slice(),fens:fens.slice(),mvs:mvs.slice(),flags:flags.slice()}};
  truncate(view);const r=commit(mv,"v");view=hist.length;shown=new Chess(fens[view]);sel=null;
  render(animate?{fwd:r}:null);playSound(r);renderChrome();replayStatus();judgeVariMove(view-1);
}
function exitVari(keepView){
  const G=game;if(!G||!G.vari)return;const m=G.vari.main;const base=G.vari.base;
  hist=m.hist;fens=m.fens;mvs=m.mvs;flags=m.flags;G.vari=null;G.retry=null;G.lastJudge=null;
  view=keepView?Math.min(view,hist.length):Math.min(base+1,hist.length);shown=new Chess(fens[view]);sel=null;
  render();renderChrome();replayStatus();
}
async function evalFen(fen){if(evCache.has(fen))return evCache.get(fen);const g=new Chess(fen);if(g.in_checkmate())return g.turn()==="w"?-10000:10000;if(g.game_over())return 0;const r=await sfRun(fen,{ms:350});const cp=cpOf(r.score,g.turn());evCache.set(fen,cp);return cp}
async function judgeVariMove(k){
  const G=game;const R=G.review;const fb=fens[k],fa=fens[k+1],mv=mvs[k];const ply=k+1;
  let before,best=null;
  if(R&&k===G.vari.base&&R.evals[k]!=null){before=R.evals[k];best=R.best[k]}else{try{before=await evalFen(fb)}catch(e){return}}
  let after;try{after=await evalFen(fa)}catch(e){return}
  if(game!==G||!G.vari||fens[k+1]!==fa)return;
  const sw=v=>mv.color==="w"?winPct(v):100-winPct(v);const drop=Math.max(0,sw(before)-sw(after));const uci=mv.from+mv.to+(mv.promotion||"");
  const c=best&&uci===best?"best":drop<2?"exc":drop<5?"good":drop<10?"inacc":drop<20?"mist":"blun";
  const san=de(mv.san);let t,s;
  if(G.retry&&G.retry.k===k){const ok=["best","exc"].indexOf(c)>=0;
    t=ok?`Richtig – ${san} ist ${c==="best"?"der beste Zug":"exzellent"}!`:`${san}: ${CLS[c][0]} – noch nicht das Beste`;
    s=ok?"Stark gefunden. »Zur Partie« bringt dich zurück.":`Bewertung ${fmtEv(after)}. Versuch es mit ← und einem anderen Zug oder tippe »Bester Zug«.`;
    if(ok){G.retry=null;sfx("done");if(c==="best")confetti()}else sfx("wrong");
  }else{t=`${san}: ${CLS[c][0]}`;s=`Bewertung ${fmtEv(after)}${best&&c!=="best"&&uciMove(new Chess(fb),best)?` · Bester Zug wäre ${de(uciMove(new Chess(fb),best).san)}`:""}`}
  G.lastJudge={ply,t,s,c};if(view===ply){setStatus("view",t,s,true);paintCoach(c)}
}
function updateRevActs(){
  const box=$("actsRev");if(!box)return;const R=game&&game.review;const on=mode==="replay"&&!!game;box.hidden=!on;if(!on)return;
  const inV=!!game.vari;const k=view-1;const c=R&&k>=0&&inMainMove(k)?R.cls[k]:null;
  const keys=R?R.cls.map((x,i)=>KEY_CLS.indexOf(x)>=0?i+1:-1).filter(i=>i>0):[];const cur=inV?game.vari.base:view;
  $("rvPrev").disabled=!keys.some(i=>i<cur);$("rvNext").disabled=!keys.some(i=>i>cur);
  $("rvRetry").textContent=inV?"Zur Partie":"Nochmal";$("rvRetry").disabled=!inV&&!(c&&["inacc","mist","blun","miss"].indexOf(c)>=0);
  $("rvBest").disabled=inV||!(R&&k>=0&&R.best[k]&&c&&c!=="best"&&c!=="book"&&c!=="forced");
  $("rvPrev").hidden=$("rvNext").hidden=!R;$("rvBest").hidden=!R;
}
$("rvPrev").onclick=()=>{const R=game&&game.review;if(!R)return;if(game.vari)exitVari();const ks=R.cls.map((x,i)=>KEY_CLS.indexOf(x)>=0?i+1:-1).filter(i=>i>0&&i<view);if(ks.length)setView(ks[ks.length-1])};
$("rvNext").onclick=()=>{const R=game&&game.review;if(!R)return;if(game.vari)exitVari();const ks=R.cls.map((x,i)=>KEY_CLS.indexOf(x)>=0?i+1:-1).filter(i=>i>view);if(ks.length)setView(ks[0])};
$("rvRetry").onclick=()=>{if(!game)return;if(game.vari){exitVari();return}const k=view-1;if(k<0)return;const mv=mvs[k];setView(k);game.retry={k};
  setStatus("turn","Finde einen besseren Zug",`${sideName(mv.color)} am Zug – in der Partie kam ${de(mv.san)}.`,true);paintCoach("great")};
$("rvBest").onclick=()=>{const R=game&&game.review;if(!R||game.vari)return;const k=view-1;const m=uciMove(new Chess(fens[k]),R.best[k]);if(!m)return;setView(k);anaMove(m,true)};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&game&&game.vari&&mode==="replay"&&!$("v-train").hidden)exitVari()});

/* ---- Partie per Link oder PGN analysieren ---- */
function anaFromPgn(pgn){
  const H=k=>pgnHeader(pgn,k);const moves=pgnMoves(pgn);if(!moves.length)return null;if(H("FEN")&&H("SetUp")!=="0")return null;
  const W=H("White")||"Weiß",B=H("Black")||"Schwarz",res=H("Result");const u=(CH.user||"").toLowerCase();
  const color=B.toLowerCase()===u&&u?"b":"w";const r=res==="1/2-1/2"?"draw":res==="1-0"?(color==="w"?"win":"loss"):res==="0-1"?(color==="b"?"win":"loss"):"draw";
  const url=H("Link")||(/^https?:/.test(H("Site"))?H("Site"):"");
  let h=0;const key=W+B+H("Date")+moves.join("");for(let i=0;i<key.length;i++)h=(h*31+key.charCodeAt(i))|0;
  let fam=famFromName(H("Opening"));if(/Unbekannt/.test(fam)){let bestN=3;ALL.forEach(o=>{if(o.g==="c"||!o.lines)return;o.lines.forEach(l=>{let i=0;while(i<l.m.length&&i<moves.length&&strip(l.m[i])===strip(moves[i]))i++;if(i>bestN){bestN=i;fam=o.name}})})}
  return {id:url||("pgn"+h),result:res||"",foreign:!u||(W.toLowerCase()!==u&&B.toLowerCase()!==u),color,res:r,term:"",fam,moves,tc:"",url,opp:color==="w"?B:W,oppR:+H(color==="w"?"BlackElo":"WhiteElo")||null,myR:+H(color==="w"?"WhiteElo":"BlackElo")||null,date:Date.parse((H("UTCDate")||H("Date")).replace(/\./g,"-"))||0,name:color==="w"?W:B,acc:null,white:W,black:B};
}
async function analyzeInput(txt,msg){
  txt=(txt||"").trim();if(!txt){msg("Füge einen Link oder eine PGN ein.");return}
  const cc=txt.match(/chess\.com\/(?:[a-z]{2}\/)?(?:analysis\/)?game\/(live|daily)\/(\d+)/i)||txt.match(/chess\.com\/(?:[a-z]{2}\/)?(live|daily)\/game\/(\d+)/i);
  const li=txt.match(/lichess\.org\/([A-Za-z0-9]{8})/);
  if(cc){const id=cc[2];let g=CH.games.find(x=>x.url&&x.url.indexOf(id)>=0);
    if(!g){if(!CH.user||CH.src!=="chesscom"){msg("Per Link geht das nur mit deinem verknüpften Chess.com-Konto. Sonst auf Chess.com unter Teilen → PGN kopieren und hier einfügen.");return}
      msg("Suche die Partie in deinem Chess.com-Archiv …");
      try{const arch=await getJSON(`https://api.chess.com/pub/player/${encodeURIComponent(CH.user.toLowerCase())}/games/archives`);const urls=(arch.archives||[]).slice(-12).reverse();
        for(const u of urls){const d=await getJSON(u);const f=(d.games||[]).find(x=>x.url&&x.url.indexOf(id)>=0);if(f){g=normApiGame(f,CH.user);break}}}catch(e){msg("Chess.com ist gerade nicht erreichbar.");return}
      if(!g){msg("Diese Partie ist nicht in deinem Archiv der letzten 12 Monate. Kopiere auf Chess.com die PGN (Teilen → PGN) und füge sie hier ein.");return}}
    msg("");reviewGame(g);return}
  if(li&&txt.indexOf("[")<0){msg("Lade die Partie von Lichess …");
    try{const r=await fetch(`https://lichess.org/game/export/${li[1]}?clocks=false&evals=false`,{headers:{Accept:"application/x-chess-pgn"}});if(!r.ok)throw 0;const g=anaFromPgn(await r.text());if(!g)throw 0;msg("");reviewGame(g)}catch(e){msg("Die Lichess-Partie konnte nicht geladen werden.")}return}
  const parts=txt.replace(/\r/g,"").split(/\n\s*\n(?=\[Event )/);const g=anaFromPgn(parts[0].indexOf("[")<0&&!/\d\./.test(parts[0])?"":parts[0]);
  if(!g){msg("Das sieht nicht nach einer gültigen PGN oder einem Partie-Link aus.");return}
  msg("");reviewGame(g);
}
function anaInputHtml(){return `<div class="card"><h3>Partie analysieren</h3><p class="hint" style="margin:0 0 8px">Chess.com- oder Lichess-Link einfügen oder die PGN einer beliebigen Partie. Stockfish bewertet jeden Zug wie im Game Review.</p><textarea class="code" id="anaIn" placeholder="https://www.chess.com/game/live/… oder [Event &quot;…&quot;] 1. e4 e5 …" autocapitalize="off" spellcheck="false"></textarea><div class="btnrow" style="margin-top:8px"><button class="btn grn" id="anaGo">Analysieren</button><span class="hint" id="anaMsg"></span></div></div>`}
function wireAnaInput(){const b=$("anaGo");if(!b)return;b.onclick=async()=>{b.disabled=true;try{await analyzeInput($("anaIn").value,t=>{if($("anaMsg"))$("anaMsg").textContent=t})}finally{b.disabled=false}}}

/* ================= Taktik: Lichess-Rätsel mit Fortschrittssystem ================= */
const PZ=Object.assign({r:1200,n:0,ok:0,xp:0,hist:[],themes:{},paths:{},seen:{},fails:[],sprintBest:0,day:{date:"",n:0},streak:{last:null,n:0,best:0},goal:10},store.get("et-tac",{}));
fixT(PZ,{r:1200,n:0,ok:0,xp:0,hist:[],themes:{},paths:{},seen:{},fails:[],sprintBest:0,day:{date:"",n:0},streak:{last:null,n:0,best:0},goal:10});fixT(PZ.day,{date:"",n:0});fixT(PZ.streak,{last:"",n:0,best:0});if(PZ.streak.last==="")PZ.streak.last=null;PZ.hist=PZ.hist.filter(x=>x&&typeof x==="object");PZ.fails=PZ.fails.filter(x=>x&&x.p);for(const k in PZ.paths)if(!PZ.paths[k]||typeof PZ.paths[k]!=="object")delete PZ.paths[k];
let pzCache=store.get("et-pzcache",[]);
const savePZ=()=>{store.set("et-tac",PZ);savedAt=Date.now();store.set("et-savedAt",savedAt)};
const savePzCache=()=>store.set("et-pzcache",pzCache.slice(-400));
const DIFF=[["easiest",-600],["easier",-300],["normal",0],["harder",300],["hardest",600]];
const diffFor=r=>DIFF.reduce((b,d)=>Math.abs(1500+d[1]-r)<Math.abs(1500+b[1]-r)?d:b)[0];
const RANKS=[[1,"Bauer"],[6,"Springer"],[11,"Läufer"],[16,"Turm"],[21,"Dame"],[26,"König"],[31,"Großmeister"]];
const xpForLevel=l=>Math.round(60*Math.pow(l-1,1.45));
const levelOf=xp=>{let l=1;while(xpForLevel(l+1)<=xp)l++;return l};
const rankOf=l=>RANKS.filter(r=>l>=r[0]).pop()[1];
const TTH={mateIn1:["Matt in 1","Finde den direkten Mattzug."],hangingPiece:["Ungedeckte Figur","Schlage, was ungeschützt herumsteht."],fork:["Gabel","Eine Figur greift zwei Ziele gleichzeitig an."],pin:["Fesselung","Eine Figur darf nicht ziehen, weil dahinter etwas Wertvolleres steht."],
  skewer:["Spieß","Wie eine Fesselung – nur steht die wertvollere Figur vorne."],mateIn2:["Matt in 2","Zwei Züge bis zum Matt."],discoveredAttack:["Abzugsangriff","Eine Figur zieht weg und öffnet eine Linie."],backRankMate:["Grundreihenmatt","Der König ist hinter seinen Bauern gefangen."],promotion:["Umwandlung","Bring den Bauern durch."],endgame:["Endspiel","Taktik mit wenig Material."],
  sacrifice:["Opfer","Material geben für mehr."],deflection:["Ablenkung","Lock einen Verteidiger von seiner Aufgabe weg."],attraction:["Hinlenkung","Zwing eine Figur auf ein schlechtes Feld."],doubleCheck:["Doppelschach","Zwei Figuren geben gleichzeitig Schach."],trappedPiece:["Gefangene Figur","Eine Figur hat kein Fluchtfeld mehr."],
  smotheredMate:["Ersticktes Matt","Der Springer setzt den eingeklemmten König matt."],xRayAttack:["Röntgenangriff","Wirkung durch eine Figur hindurch."],clearance:["Räumung","Mach ein Feld oder eine Linie frei."],interference:["Verstellung","Unterbrich die Verbindung zwischen Verteidigern."],quietMove:["Stiller Zug","Kein Schach, kein Schlagen – aber tödlich."],defensiveMove:["Verteidigung","Finde den einzigen rettenden Zug."],mateIn3:["Matt in 3","Drei Züge bis zum Matt."],zugzwang:["Zugzwang","Der Gegner muss ziehen und verliert dadurch."]};
const TIERS=[{need:0,keys:["mateIn1","hangingPiece","fork","pin"]},{need:5,keys:["skewer","mateIn2","discoveredAttack","backRankMate","promotion","endgame"]},{need:18,keys:["sacrifice","deflection","attraction","doubleCheck","trappedPiece"]},{need:35,keys:["smotheredMate","xRayAttack","clearance","interference","quietMove","defensiveMove","mateIn3","zugzwang"]}];
const PATH_STEPS=5,PATH_N=4;
const OPENING_ANGLE={italienisch:"Italian_Game",evans:"Italian_Game",friedliver:"Italian_Game",spanisch:"Ruy_Lopez",jaenisch:"Ruy_Lopez",schottisch:"Scotch_Game",damengambit:"Queens_Gambit_Declined",dg_abgelehnt:"Queens_Gambit_Declined",englisch:"English_Opening",wiener:"Vienna_Game",najdorf:"Sicilian_Defense",drachen:"Sicilian_Defense",sweschnikow:"Sicilian_Defense",taimanow:"Sicilian_Defense",beschl_drachen:"Sicilian_Defense",offen_siz_w:"Sicilian_Defense",morra:"Sicilian_Defense",franzoesisch:"French_Defense",gegen_franz_w:"French_Defense",carokann:"Caro-Kann_Defense",gegen_caro_w:"Caro-Kann_Defense",skandinavisch:"Scandinavian_Defense",gegen_skandi_w:"Scandinavian_Defense",koenigsindisch:"Kings_Indian_Defense",gegen_ki_w:"Kings_Indian_Defense",nimzo:"Nimzo-Indian_Defense",slawisch:"Slav_Defense",hollaendisch:"Dutch_Defense",gegen_holl_w:"Dutch_Defense",aljechin:"Alekhine_Defense",gruenfeld:"Grunfeld_Defense",pirc:"Pirc_Defense",modern:"Modern_Defense",petrow:"Russian_Game",stafford:"Russian_Game",koenigsgambit:"Kings_Gambit_Accepted",daenisch:"Danish_Gambit",bird:"Bird_Opening",benko:"Benko_Gambit",budapester:"Budapest_Defense",albin:"Queens_Gambit_Declined",katalanisch:"Catalan_Opening",vierspringer:"Four_Knights_Game",philidor:"Philidor_Defense",damenindisch:"Queens_Indian_Defense",benoni:"Benoni_Defense",englund:"Englund_Gambit",reti:"Zukertort_Opening",e5_schwarz:"Kings_Knight_Opening"};
const pathOf=k=>PZ.paths[k]||(PZ.paths[k]={step:0,n:0});
const totalStars=()=>Object.values(PZ.paths).reduce((a,p)=>a+Math.min(PATH_STEPS,p.step),0);
const tierUnlocked=i=>totalStars()>=TIERS[i].need;
function pzToday(){if(PZ.day.date!==today())PZ.day={date:today(),n:0};return PZ.day}

/* Rätsel von Lichess laden (Batch) und normalisieren */
function normLichessPuzzle(x){
  try{
    const g=new Chess();const mv=(x.game.pgn||"").split(" ").filter(Boolean);let last=null;
    for(const m of mv){last=g.move(m);if(!last)return null}
    const fen=g.fen();const sol=[];const t=new Chess(fen);
    for(const u of x.puzzle.solution){const m=t.moves({verbose:true}).find(z=>z.from===u.slice(0,2)&&z.to===u.slice(2,4)&&(!z.promotion||z.promotion===(u[4]||"q")));if(!m)return null;t.move(m.san);sol.push(m.san)}
    return {id:x.puzzle.id,pre:mv,sol,rating:x.puzzle.rating,themes:x.puzzle.themes||[],plays:x.puzzle.plays,game:x.game.id,side:new Chess(fen).turn()};
  }catch(e){return null}
}
async function fetchPuzzles(angle,difficulty,nb){
  const headers={Accept:"application/json"};if(S.set.liToken)headers.Authorization="Bearer "+S.set.liToken;
  const r=await fetch(`https://lichess.org/api/puzzle/batch/${encodeURIComponent(angle)}?nb=${nb||10}&difficulty=${difficulty}`,{headers});
  if(r.status===429)throw new Error("ratelimit");if(r.status===404||r.status===400)throw new Error("angle");if(!r.ok)throw new Error("http");
  const d=await r.json();const arr=(d.puzzles||(Array.isArray(d)?d:[d])).map(normLichessPuzzle).filter(Boolean);
  arr.forEach(p=>{p.angle=angle;p.diff=difficulty;if(!pzCache.some(c=>c.id===p.id))pzCache.push(p)});savePzCache();return arr;
}
const queues={};
async function nextPuzzle(angle,difficulty){
  const k=angle+"|"+difficulty;const q=queues[k]||(queues[k]=[]);
  while(q.length&&PZ.seen[q[0].id])q.shift();
  if(q.length<3){
    const pr=fetchPuzzles(angle,difficulty,12).then(a=>{a.forEach(x=>{if(!PZ.seen[x.id]&&!q.some(y=>y.id===x.id))q.push(x)})});
    if(!q.length){let err=null;try{await pr}catch(e){err=e}
      if(!q.length){
        // offline oder keine neuen Aufgaben: zwischengespeicherte Aufgaben verwenden
        const fit=c=>angle==="mix"||c.angle===angle||c.themes.indexOf(angle)>=0;
        const off=pzCache.filter(c=>!PZ.seen[c.id]&&fit(c));if(off.length)return rnd(off);
        const any=pzCache.filter(fit);if(any.length)return rnd(any);
        throw err||new Error("empty")}}
    else pr.catch(()=>{})}
  return q.shift();
}
function recordTactic(p,ok,opts){
  opts=opts||{};PZ.seen[p.id]=1;const sk=Object.keys(PZ.seen);if(sk.length>3000)delete PZ.seen[sk[0]];
  PZ.n++;if(ok)PZ.ok++;const d=pzToday();d.n++;
  let delta=0;
  if(opts.rated!==false){const n=PZ.n;const K=n<20?40:n<60?28:18;const E=1/(1+Math.pow(10,(p.rating-PZ.r)/400));delta=Math.round(K*((ok?1:0)-E));PZ.r=Math.max(400,PZ.r+delta);PZ.hist.push([Date.now(),PZ.r]);if(PZ.hist.length>600)PZ.hist.shift()}
  const lvBefore=levelOf(PZ.xp);let xp=0;if(ok){xp=10+Math.max(0,Math.round((p.rating-PZ.r+300)/60));PZ.xp+=xp}
  p.themes.forEach(t=>{const T=PZ.themes[t]||(PZ.themes[t]={n:0,ok:0});T.n++;if(ok)T.ok++});
  if(!ok&&!PZ.fails.some(f=>f.id===p.id))PZ.fails.unshift({id:p.id,p,ok:0});
  if(ok){const f=PZ.fails.find(x=>x.id===p.id);if(f){f.ok++;if(f.ok>=2)PZ.fails=PZ.fails.filter(x=>x!==f)}}
  PZ.fails=PZ.fails.slice(0,150);
  if(d.n===PZ.goal&&PZ.streak.last!==today()){PZ.streak.n=PZ.streak.last===yesterday()?PZ.streak.n+1:1;PZ.streak.last=today();PZ.streak.best=Math.max(PZ.streak.best,PZ.streak.n);setTimeout(()=>celebrate("streak",PZ.streak.n,"Taktik-Tagesziel erreicht!"),900)}
  st.days[today()]=(st.days[today()]||0)+1;saveStats();savePZ();
  const lvAfter=levelOf(PZ.xp);if(lvAfter>lvBefore)setTimeout(()=>{celebrate("level",lvAfter,`Level ${lvAfter} erreicht`,`Rang: ${rankOf(lvAfter)}`);sfx("badge")},1200);
  checkBadges();return {delta,xp};
}
const ratedText=(ok,res,p)=>`${ok?"Gelöst":"Nicht gelöst"} · Aufgabe ${p.rating} · Wertung ${PZ.r} (${res.delta>=0?"+":""}${res.delta})${res.xp?` · +${res.xp} XP`:""}`;
function playTactic(p,cfg){
  cfg=cfg||{};
  startPuzzle({pre:p.pre,sol:p.sol,title:cfg.title||"Taktik",eco:cfg.eco||("Aufgabe "+p.rating),sub:cfg.sub||(p.themes.map(t=>TTH[t]?TTH[t][0]:null).filter(Boolean).slice(0,3).join(" · ")||"Lichess-Rätsel"),
    prompt:`${p.side==="w"?"Weiß":"Schwarz"} am Zug – finde den besten Zug`,
    after:`Lichess-Rätsel ${p.id} aus einer echten Partie.`,
    onResult:ok=>{const res=recordTactic(p,ok,{rated:cfg.rated!==false});if(cfg.onResult)cfg.onResult(ok,res);
      if(!ok&&!cfg.silentFail)setStatus("bad","Leider falsch",cfg.rated!==false?ratedText(false,res,p)+". Versuch es weiter oder tippe auf »Weiter«.":"Versuch es weiter oder tippe auf »Weiter«.");
      return res},
    onSolved:(clean,res)=>{if(clean&&res)setStatus("done","Richtig gelöst!",cfg.rated!==false?ratedText(true,res,p):`+${res.xp} XP`)}
  });
}
/* Sitzungen */
function tacticSession(kind,arg){
  const s={type:"tactic",kind,title:"",idx:0,res:[],solved:0,failed:0,cur:null};
  if(kind==="rated")s.title="Taktik-Training";
  if(kind==="theme"){s.title="Pfad: "+TTH[arg][0];s.theme=arg}
  if(kind==="opening"){s.title="Taktik: "+byId(arg).name;s.angle=OPENING_ANGLE[arg]}
  if(kind==="fails"){if(!PZ.fails.length){toast("Keine offenen Fehler – stark!");return}s.title="Taktik-Fehler wiederholen";s.list=PZ.fails.slice(0,20).map(f=>f.p)}
  if(kind==="sprint"){s.title="Taktik-Sprint";s.lives=3;s.end=Date.now()+180000;s.level=0}
  s.next=()=>loadNextTactic(s);
  s.countText=()=>kind==="sprint"?`${s.solved} gelöst · ${"♥".repeat(Math.max(0,s.lives))}`:kind==="theme"?`Stufe ${Math.min(PATH_STEPS,pathOf(s.theme).step+1)}/${PATH_STEPS} · ${pathOf(s.theme).n}/${PATH_N}`:`${s.solved} gelöst · ${s.failed} falsch`;
  s.progress=()=>kind==="sprint"?Math.max(0,(s.end-Date.now())/180000):kind==="theme"?pathOf(s.theme).n/PATH_N:0;
  sess=s;showView("train");
  if(kind==="sprint")startSprintTimer(s);
  loadNextTactic(s);
}
let sprintT=null;
function startSprintTimer(s){clearInterval(sprintT);const t=$("timer");sprintT=setInterval(()=>{if(sess!==s){clearInterval(sprintT);t.hidden=true;return}const left=Math.max(0,s.end-Date.now());t.hidden=false;t.textContent=Math.floor(left/60000)+":"+String(Math.floor(left/1000)%60).padStart(2,"0");t.classList.toggle("low",left<20000);$("sessProg").style.width=(left/180000*100)+"%";if(left<=0){clearInterval(sprintT);endSprint(s)}},250)}
function endSprint(s){
  if(sess!==s)return;const best=s.solved>PZ.sprintBest;if(best)PZ.sprintBest=s.solved;savePZ();checkBadges();
  sess=null;done=true;lock=false;busy=false;$("timer").hidden=true;renderChrome();render();
  setStatus("done",`Sprint vorbei: ${s.solved} gelöst`,best?"Neuer Rekord!":`Dein Rekord: ${PZ.sprintBest}`);sfx("done");
}
async function loadNextTactic(s){
  if(sess!==s)return;
  setStatus("turn","Lade Aufgabe …","");busy=true;renderChrome();
  let p=null;
  try{
    if(s.kind==="fails"){if(s.idx>=s.list.length){sess=null;busy=false;renderChrome();setStatus("done","Fehler wiederholt",`${s.solved} von ${s.list.length} gelöst.`);return}p=s.list[s.idx]}
    else if(s.kind==="theme"){const ps=pathOf(s.theme);p=await nextPuzzle(s.theme,DIFF[Math.min(PATH_STEPS-1,ps.step)][0])}
    else if(s.kind==="opening"){try{p=await nextPuzzle(s.angle,diffFor(PZ.r))}catch(e){if(String(e.message)==="angle"){toast("Für diese Eröffnung gibt es keine eigene Auswahl – gemischte Aufgaben.");s.angle="mix";p=await nextPuzzle("mix",diffFor(PZ.r))}else throw e}}
    else if(s.kind==="sprint"){const lv=Math.min(4,Math.floor(s.solved/4));p=await nextPuzzle("mix",DIFF[lv][0])}
    else p=await nextPuzzle("mix",diffFor(PZ.r));
  }catch(e){busy=false;if(sess===s){sess=null;renderChrome()}setStatus("bad","Keine Aufgabe verfügbar",String(e&&e.message)==="ratelimit"?"Lichess meldet zu viele Anfragen – warte eine Minute.":String(e&&e.message)==="empty"?"Lichess hat gerade keine neuen Aufgaben geliefert – versuch es gleich noch einmal.":"Für neue Aufgaben braucht es eine Internetverbindung.");return}
  if(!p){busy=false;if(sess===s){sess=null;renderChrome()}setStatus("bad","Keine Aufgabe verfügbar","Versuch es gleich noch einmal.");return}
  if(sess!==s)return;busy=false;s.cur=p;
  const rated=s.kind==="rated"||s.kind==="opening";
  playTactic(p,{title:s.title,rated,silentFail:s.kind==="sprint",
    onResult:(ok)=>{s.res.push({clean:ok});if(ok)s.solved++;else s.failed++;
      if(s.kind==="theme"&&ok){const ps=pathOf(s.theme);ps.n++;if(ps.n>=PATH_N){ps.step=Math.min(PATH_STEPS,ps.step+1);ps.n=0;savePZ();setTimeout(()=>toast(ps.step>=PATH_STEPS?`Pfad „${TTH[s.theme][0]}“ gemeistert!`:`Stufe ${ps.step} geschafft – ★ ${ps.step}/${PATH_STEPS}`),600);if(ps.step>=PATH_STEPS){setTimeout(()=>{if(sess===s){sess=null;renderChrome();setStatus("done","Pfad gemeistert!","Alle fünf Sterne gesammelt. Neue Pfade schaltest du mit Sternen frei.")}},1500)}}savePZ()}
      if(s.kind==="sprint"){if(!ok){s.lives--;sfx("wrong")}renderChrome();
        if(s.lives<=0){setTimeout(()=>endSprint(s),600);return}
        setTimeout(()=>{if(sess===s)s.next()},ok?500:900)}
      if(s.kind==="fails")s.idx++;
      renderChrome();
    }});
}

/* Ansicht */
function tacticChart(){
  const pts=PZ.hist;if(pts.length<3)return '<p class="hint">Der Wertungsverlauf erscheint nach ein paar Aufgaben im Wertungstraining.</p>';
  const W=600,H=160,p=34;const ys=pts.map(x=>x[1]);const lo=Math.floor((Math.min(...ys)-20)/50)*50,hi=Math.ceil((Math.max(...ys)+20)/50)*50;
  const X=i=>p+i/(pts.length-1)*(W-p-8),Y=r=>8+(hi-r)/Math.max(1,hi-lo)*(H-30);
  const d=pts.map((x,i)=>(i?"L":"M")+X(i).toFixed(1)+" "+Y(x[1]).toFixed(1)).join(" ");
  const ticks=[];for(let r=lo;r<=hi;r+=Math.max(50,Math.round((hi-lo)/4/50)*50))ticks.push(r);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${ticks.map(r=>`<line x1="${p}" x2="${W}" y1="${Y(r)}" y2="${Y(r)}" stroke="var(--line)"/><text x="2" y="${Y(r)+4}" font-size="11" fill="var(--muted)">${r}</text>`).join("")}<path d="${d} L${X(pts.length-1)} ${H-22} L${X(0)} ${H-22}Z" fill="rgba(129,182,76,.15)"/><path d="${d}" fill="none" stroke="#81B64C" stroke-width="2.2"/><circle cx="${X(pts.length-1)}" cy="${Y(pts[pts.length-1][1])}" r="4" fill="#81B64C"/><text x="${p}" y="${H-5}" font-size="11" fill="var(--muted)">erste Aufgabe</text><text x="${W-4}" y="${H-5}" font-size="11" fill="var(--muted)" text-anchor="end">heute</text></svg>`;
}
function renderTactics(){
  const v=$("v-tactics");const lv=levelOf(PZ.xp);const a=xpForLevel(lv),b=xpForLevel(lv+1);const d=pzToday();const stars=totalStars();
  const tierHtml=TIERS.map((T,ti)=>{const open=tierUnlocked(ti);return `<div class="sec-h"><h3>${["Grundlagen","Aufbau","Fortgeschritten","Meisterklasse"][ti]}</h3><small>${open?"freigeschaltet":"gesperrt – ab "+T.need+" Sternen (du hast "+stars+")"}</small></div>
    <div class="hubgrid">${T.keys.map(k=>{const ps=pathOf(k);const done=ps.step>=PATH_STEPS;const th=PZ.themes[k];
      return `<button class="hc tpath" data-path="${k}" ${open?"":"disabled"} style="${open?"":"opacity:.45;cursor:not-allowed"}"><b>${TTH[k][0]}</b><small>${TTH[k][1]}</small><span class="stars">${[0,1,2,3,4].map(i=>`<i class="${i<ps.step?"on":""}">★</i>`).join("")}</span><small>${done?"Gemeistert":open?`Stufe ${ps.step+1}: ${ps.n}/${PATH_N} gelöst`:"gesperrt"}${th?` · ${pct(th.ok/th.n)} richtig`:""}</small></button>`}).join("")}</div>`}).join("");
  const repOps=S.rep.map(byId).filter(o=>o&&OPENING_ANGLE[o.id]);
  const weakT=Object.entries(PZ.themes).filter(([k,t])=>t.n>=4&&TTH[k]).sort((x,y)=>x[1].ok/x[1].n-y[1].ok/y[1].n).slice(0,5);
  v.innerHTML=`<div class="tac-hero">
    <div class="tac-r"><small>Taktik-Wertung</small><b>${PZ.r}</b><span>${PZ.n} Aufgaben · ${PZ.n?pct(PZ.ok/PZ.n):"–"} gelöst</span></div>
    <div class="tac-lv"><div style="display:flex;justify-content:space-between;align-items:baseline"><b>Level ${lv} · ${rankOf(lv)}</b><small>${PZ.xp-a}/${b-a} XP</small></div><div class="xpbar"><i style="width:${(PZ.xp-a)/(b-a)*100}%"></i></div>
      <div class="tac-mini"><span><b>${d.n}/${PZ.goal}</b> heute</span><span><b>${PZ.streak.last===today()||PZ.streak.last===yesterday()?PZ.streak.n:0}</b> Tage Serie</span><span><b>${stars}</b> ★ Sterne</span><span><b>${PZ.sprintBest}</b> Sprint-Rekord</span></div></div>
  </div>
  <div class="hubgrid">
    <button class="hc" data-tac="rated"><span class="ic" style="background:#81B64C">${NI.bolt}</span><b>Wertungstraining</b><small>Endlos Aufgaben passend zu deiner Wertung. Jede Lösung verändert deine Taktik-Wertung.</small><span class="meta">${PZ.r}</span></button>
    <button class="hc" data-tac="sprint"><span class="ic" style="background:#E6912C">${NI.review}</span><b>Taktik-Sprint</b><small>3 Minuten, 3 Leben: Löse so viele Aufgaben wie möglich. Sie werden immer schwerer.</small><span class="meta">${PZ.sprintBest}</span></button>
    <button class="hc" data-tac="fails" ${PZ.fails.length?"":"disabled"}><span class="ic" style="background:#B9483C">${NI.target}</span><b>Fehler wiederholen</b><small>Aufgaben, die du nicht gelöst hast. Zweimal richtig, dann verschwinden sie.</small><span class="meta${PZ.fails.length?" hot":""}">${PZ.fails.length}</span></button>
  </div>
  ${repOps.length?`<div class="sec-h"><h3>Taktik aus deinen Eröffnungen</h3><small>Aufgaben aus Partien mit deinem Repertoire</small></div><div class="chips">${repOps.map(o=>`<button class="chip" data-tacop="${o.id}">${esc(o.name)}</button>`).join("")}</div>`:`<p class="hint">Tipp: Markiere Eröffnungen mit einem Stern, dann bekommst du hier Taktikaufgaben aus genau diesen Eröffnungen.</p>`}
  <div class="sec-h"><h3>Themen-Pfade</h3><small>Je ${PATH_N} Aufgaben pro Stufe, 5 Stufen bis zum Meister</small></div>
  ${tierHtml}
  <div class="card"><h3>Wertungsverlauf</h3>${tacticChart()}</div>
  ${weakT.length?`<div class="card"><h3>Deine schwächsten Motive</h3>${weakT.map(([k,t])=>`<div class="setrow"><span><b>${TTH[k][0]}</b><small>${t.ok} von ${t.n} gelöst</small></span><span style="display:flex;gap:10px;align-items:center"><b class="${t.ok/t.n<.5?"score-bad":""}">${pct(t.ok/t.n)}</b>${tierUnlocked(TIERS.findIndex(T=>T.keys.indexOf(k)>=0))?`<button class="mini" data-path="${k}">Üben</button>`:""}</span></div>`).join("")}</div>`:""}
  <div class="card"><h3>Tagesziel</h3><div class="btnrow"><span class="hint">Aufgaben pro Tag:</span>${[5,10,20,30].map(n=>`<button class="chip" data-goal="${n}" style="${PZ.goal===n?"background:var(--green);color:#fff":""}">${n}</button>`).join("")}</div><p class="hint" style="margin:8px 0 0">Die Aufgaben stammen aus der freien Lichess-Rätseldatenbank (CC0). Bereits geladene Aufgaben funktionieren auch offline. Mit einem Lichess-Token (Profil → Einstellungen) bekommst du nur Aufgaben, die du dort noch nicht gesehen hast.</p></div>`;
  v.querySelectorAll("[data-tac]").forEach(b=>b.onclick=()=>tacticSession(b.dataset.tac));
  v.querySelectorAll("[data-path]").forEach(b=>b.onclick=()=>{if(b.disabled)return;const k=b.dataset.path;if(pathOf(k).step>=PATH_STEPS){pathOf(k).step=PATH_STEPS-1;pathOf(k).n=0;toast("Pfad wird auf der höchsten Stufe wiederholt.")}tacticSession("theme",k)});
  v.querySelectorAll("[data-tacop]").forEach(b=>b.onclick=()=>tacticSession("opening",b.dataset.tacop));
  v.querySelectorAll("[data-goal]").forEach(b=>b.onclick=()=>{PZ.goal=+b.dataset.goal;savePZ();renderTactics()});
}
BADGES.push(
  {id:"t1",t:"Taktik-Einsteiger",d:"25 Taktikaufgaben gelöst",ok:()=>PZ.ok>=25},
  {id:"t2",t:"Taktik-Kenner",d:"250 Taktikaufgaben gelöst",ok:()=>PZ.ok>=250},
  {id:"t1500",t:"Taktik 1500",d:"Taktik-Wertung von 1500 erreicht",ok:()=>PZ.r>=1500},
  {id:"t1800",t:"Taktik 1800",d:"Taktik-Wertung von 1800 erreicht",ok:()=>PZ.r>=1800},
  {id:"t2100",t:"Taktik 2100",d:"Taktik-Wertung von 2100 erreicht",ok:()=>PZ.r>=2100},
  {id:"sprint15",t:"Sprinter",d:"15 Aufgaben in einem Sprint",ok:()=>PZ.sprintBest>=15},
  {id:"path",t:"Pfadfinder",d:"Einen Themen-Pfad gemeistert",ok:()=>Object.values(PZ.paths).some(p=>p.step>=PATH_STEPS)},
  {id:"stars50",t:"Sternensammler",d:"50 Sterne in Themen-Pfaden",ok:()=>totalStars()>=50}
);
KEYS.push("tac");S.tac=PZ;

/* ================= Komfort & Erscheinungsbild ================= */
/* ---- Konfetti (Canvas, ~2 s, respektiert »Weniger Animationen«) ---- */
function calmNow(){return !!S.set.calm||!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}
function confetti(){
  if(calmNow())return;
  const c=document.createElement("canvas");c.className="confetti";c.setAttribute("aria-hidden","true");document.body.appendChild(c);
  const dpr=Math.min(2,window.devicePixelRatio||1),W=innerWidth,H=innerHeight;c.width=W*dpr;c.height=H*dpr;
  const x=c.getContext("2d");if(!x){c.remove();return}x.scale(dpr,dpr);
  const cols=["#81B64C","#E9B949","#FA412D","#5A7FB5","#FFFFFF","#C8742E"];
  const P=Array.from({length:110},()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.38,vx:(Math.random()-.5)*10,vy:-Math.random()*11-4,s:5+Math.random()*5,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[Math.random()*cols.length|0]}));
  const t0=performance.now(),D=2200;
  const f=t=>{const dt=t-t0;x.clearRect(0,0,W,H);x.globalAlpha=Math.max(0,1-dt/D);
    for(const p of P){p.vy+=.32;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.66);x.restore()}
    if(dt<D)requestAnimationFrame(f);else c.remove()};
  requestAnimationFrame(f);
}
/* ---- Große Feier-Einblendung für Serie und Level ---- */
const FLAME='<svg class="flame-ic" viewBox="0 0 64 64" aria-hidden="true"><path class="f1" d="M32 4c4 10 16 16 16 32a16 16 0 0 1-32 0c0-7 3-12 7-16 0 6 3 9 6 10-2-9 0-18 3-26z" fill="#F08A24"/><path class="f2" d="M32 30c3 5 8 8 8 15a8 8 0 0 1-16 0c0-4 2-7 4-9 0 3 2 5 3 5-1-4 0-8 1-11z" fill="#FFD25A"/></svg>';
const STARIC='<svg class="flame-ic" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5l8 17 18 2-13 13 4 19-17-9-17 9 4-19L6 24l18-2z" fill="#E9B949"/></svg>';
function celebrate(kind,n,title,sub){
  const el=document.createElement("div");el.className="celeb";el.setAttribute("role","status");
  el.innerHTML=`<div class="celeb-in">${kind==="streak"?FLAME:STARIC}<b>${kind==="streak"?`${n} ${n===1?"Tag":"Tage"} Serie`:esc(title)}</b><small>${esc(kind==="streak"?title:(sub||""))}</small></div>`;
  el.onclick=()=>el.remove();document.body.appendChild(el);confetti();sfx("badge");
  setTimeout(()=>el.classList.add("out"),2300);setTimeout(()=>el.remove(),2800);
}

/* ---- Ersteinrichtung ---- */
const ONB_REP={
  1:{w:["italienisch","londoner","fallen_w"],b:["e5_schwarz","skandinavisch","fallen_b"]},
  2:{w:["italienisch","damengambit","schottisch"],b:["carokann","franzoesisch","dg_abgelehnt"]},
  3:{w:["spanisch","offen_siz_w","katalanisch"],b:["najdorf","nimzo","gruenfeld"]}
};
function openOnboarding(){
  if(document.querySelector(".onb"))return;
  const ov=document.createElement("div");ov.className="onb";
  ov.innerHTML=`<div class="onb-box" role="dialog" aria-modal="true" aria-labelledby="onbH">
    <h2 id="onbH">Willkommen!</h2><p class="hint">Drei kurze Fragen, dann stellt die App dein Training zusammen. Alles lässt sich später ändern.</p>
    <h3>Wie stark spielst du?</h3>
    <div class="seg onb-seg" data-k="lvl"><button data-v="1" aria-pressed="false">Einsteiger<small>unter 1000</small></button><button data-v="2" aria-pressed="true">Fortgeschritten<small>1000–1600</small></button><button data-v="3" aria-pressed="false">Stark<small>über 1600</small></button></div>
    <h3>Welche Farbe willst du üben?</h3>
    <div class="seg onb-seg" data-k="col"><button data-v="w" aria-pressed="false">Weiß</button><button data-v="b" aria-pressed="false">Schwarz</button><button data-v="wb" aria-pressed="true">Beide</button></div>
    <h3>Dein Chess.com-Name <small>(optional)</small></h3>
    <input class="txt" id="onbUser" placeholder="z. B. Hikaru" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(CH.user||"")}">
    <div class="btnrow onb-act"><button class="btn grn" id="onbGo">Los geht's</button><button class="btn" id="onbSkip">Überspringen</button></div>
  </div>`;
  document.body.appendChild(ov);
  const val={lvl:"2",col:"wb"};
  ov.querySelectorAll(".onb-seg").forEach(sg=>sg.querySelectorAll("button").forEach(b=>b.onclick=()=>{val[sg.dataset.k]=b.dataset.v;sg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)))}));
  const close=()=>{store.set("et-onb",1);ov.remove()};
  $("onbSkip").onclick=close;
  $("onbGo").onclick=()=>{
    const lv=+val.lvl;const ids=[];val.col.split("").forEach(c=>ONB_REP[lv][c].forEach(id=>{if(byId(id))ids.push(id)}));
    const added=ids.filter(id=>S.rep.indexOf(id)<0);S.rep=S.rep.concat(added);save("rep");
    if(PZ.n===0){PZ.r={1:800,2:1200,3:1600}[lv];savePZ()}
    S.set.sf={1:3,2:6,3:10}[lv];save("set");
    const u=$("onbUser").value.trim();
    close();renderList();
    if(ids[0])store.set("et-last",ids[0]);
    if(u){CH.user=u;CH.src="chesscom";CH.profile=null;S.ana=Object.assign({},S.ana||{},{user:u,src:"chesscom"});save("ana");store.set("et-sync",0);autoSync(true)}
    toast(added.length?`${added.length} Eröffnungen in dein Repertoire gelegt – schau unter Lernen.`:"Alles eingerichtet!");
    showView("learn");
  };
}

/* ---- Chess.com/Lichess beim Öffnen abgleichen und neue Partien im Hintergrund analysieren ---- */
let syncing=false;
async function autoSync(force){
  if(syncing||!CH.user||(!force&&!S.set.autoSync))return;
  const lastSync=store.get("et-sync",0);if(!force&&Date.now()-lastSync<30*60*1000)return;
  syncing=true;store.set("et-sync",Date.now());
  try{
    const known=new Set(CH.games.map(g=>g.id));const keepM=CH.months,keepT=CH.type;
    let fresh;CH.months=known.size?1:keepM;CH.type="all";
    try{fresh=await loadGames(()=>{})}finally{CH.months=keepM;CH.type=keepT}
    const neu=fresh.filter(g=>!known.has(g.id));
    if(!neu.length){syncing=false;return}
    const all=neu.concat(CH.games).sort((a,b)=>b.date-a.date);
    finishLoad(all,(S.ana&&S.ana.label)||`${siteName()} · automatisch abgeglichen`);
    if(curView==="chess")renderChess();
    let added=0,done=0;
    for(const g of neu.slice(0,2)){if(REV[g.id])continue;try{const r=await reviewCore(g,null,null,null);if(r){added+=r.added;done++}}catch(e){break}}
    toast(`${neu.length} neue ${neu.length===1?"Partie":"Partien"} geladen${done?`, ${done} analysiert`:""}${added?` – ${added} ${added===1?"Fehler":"Fehler"} zum Üben unter Lernen`:""}.`);
    renderTabbar();if(curView==="learn")renderLearn();
  }catch(e){/* offline oder API-Fehler: still ignorieren */}
  syncing=false;
}

/* ---- Tab-Leiste beim Herunterscrollen ausblenden (Handy) ---- */
(function(){let lastY=window.scrollY||0;
  window.addEventListener("scroll",()=>{const tb=$("tabbar");if(!tb)return;const y=window.scrollY;
    if(!S.set.tbHide||window.innerWidth>820){tb.classList.remove("hide");lastY=y;return}
    const atEnd=window.innerHeight+y>=document.documentElement.scrollHeight-8;
    if(y>lastY+6&&y>80&&!atEnd)tb.classList.add("hide");else if(y<lastY-6||y<80||atEnd)tb.classList.remove("hide");lastY=y},{passive:true});
})();
/* ---- Eröffnungskopf am Handy antippen: Beschreibung ein-/ausklappen ---- */
document.querySelector(".ph").addEventListener("click",e=>{e.currentTarget.classList.toggle("open")});

/* ================= Start ================= */
applySettings();
st.badges=BADGES.filter(b=>{try{return b.ok()}catch(e){return false}}).map(b=>b.id);saveStats();
const last=store.get("et-last",null);
try{
  op=byId(last)||ALL[0];
  if(!checkShareHash()){
    const hv={"#analyse":"chess","#chess":"chess","#quiz":"quiz","#statistik":"profile","#profil":"profile","#partien":"games","#lernen":"learn","#eroeffnungen":"openings","#einstellungen":"profile"}[location.hash];
    if(location.hash==="#taeglich")startSession("daily");
    else{selectOpening(op);showView(hv||"learn")}
  }
}catch(err){window.__showErr(String(err&&err.stack||err))}
renderTabbar();
{const sp=$("splash");if(sp){setTimeout(()=>{sp.classList.add("out");setTimeout(()=>sp.remove(),400)},300)}}
const firstRun=!store.get("et-onb",0)&&!last&&!Object.keys(S.prog).length;
if(firstRun)setTimeout(openOnboarding,350);else store.set("et-onb",1);
setTimeout(()=>autoSync(false),2500);
window.__ET={autoSync,confetti,celebrate,openOnboarding,takeBack,applySettings,render:()=>render(),setTab:t=>setTab(t),select:(id,l)=>selectOpening(ALL.find(o=>o.id===id),l),hint:()=>$("hintBtn").click(),expected:()=>expected(),fen:()=>shown.fen(),orient:()=>orient(),mode:()=>mode,S,CH,analyze,normPgnGame,normLichess,normApiGame,pgnMoves,pgnLines,explain,matchGame,ALL:()=>ALL,startSession,openGame,openEditor,startEngine,showView,parseMoveQuery,dueKeys,reviewGame,startPuzzle,startEndgame,game:()=>game};
})();
