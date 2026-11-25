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
  pin:SV('<path d="M14.5 2.5 21.5 9.5 19.4 10.9 16.6 13.7 17 18.5 15.6 19.9 11.4 15.7 5.4 21.7 4.3 21.7 4.3 20.6 10.3 14.6 6.1 10.4 7.5 9 12.3 9.4 15.1 6.6Z"/>'),
  print:SV('<path d="M7 3h10v4H7zM5 8h14a3 3 0 0 1 3 3v6h-4v4H6v-4H2v-6a3 3 0 0 1 3-3zm3 7v4h8v-4zm10-4.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>'),
  board:SV('<path d="M3 3h18v18H3zm2 2v4h4V5zm4 4v4h4V9zm4-4v4h4V5zm-8 8v4h4v-4zm8 0v4h4v-4z"/>'),
  online:SV('<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-3a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h3a15.7 15.7 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16zm3-8h-3a8 8 0 0 1 4.4-3.6C8 5.6 7.5 6.8 8.1 8zM12 20c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h3a8 8 0 0 1-4.4 3.6zM16.3 14a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z"/>'),
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
  book:SV('<path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z"/>'),
  home:SV('<path d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z"/>'),
  swords:SV('<path d="M12 2a3 3 0 0 0-1.6 5.5L8 9v2h2.2c-.3 2.4-1.4 4.6-3.2 6.2V19h10v-1.8c-1.8-1.6-2.9-3.8-3.2-6.2H16V9l-2.4-1.5A3 3 0 0 0 12 2zM6 20h12v2H6z"/>'),
  search:SV('<path d="M10 3a7 7 0 0 1 5.6 11.2l5.1 5.1-1.4 1.4-5.1-5.1A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>'),
  bot:SV('<path d="M11 2h2v3h4a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h4zM8.5 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 15v2h8v-2zM1 10h2v5H1zm20 0h2v5h-2z"/>'),
  legal:SV('<path d="M6 2h9l5 5v15H6zm8 1.5V8h4.5zM8 11v2h10v-2zm0 4v2h10v-2zm0-8v2h4V7z"/>'),
  more:SV('<circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/>'),
  flip:SV('<path d="M7 3 3 7l4 4V8h10V6H7zm10 10v3H7v2h10v3l4-4z"/>'),
  sound:SV('<path d="M3 9h4l5-4v14l-5-4H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/>'),
  copy:SV('<path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11z"/>'),
  palette:SV('<path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 9.8C22 5.5 17.5 2 12 2zM6.5 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>'),
  settings:SV('<path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.7 1.7 1l.4 2.6h4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.5zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>')
};
/* Jedes Symbol kennt seinen Namen – so bekommt es im Stylesheet seine eigene Farbe */
for(const k in NI)NI[k]=NI[k].replace("<svg",`<svg data-i="${k}"`);

/* ---------------- Speicher ---------------- */
const SKEL='<div class="skel"></div><div class="skel w80"></div><div class="skel w60"></div>';
/* Gespeicherte Werte mit falschem Typ (alte Versionen, kaputte Sicherung) werden durch den Standardwert ersetzt */
const sameType=(v,d)=>v!==null&&typeof v===typeof d&&Array.isArray(v)===Array.isArray(d);
function fixT(o,def){for(const k in def){if(def[k]!==null&&def[k]!==undefined&&!sameType(o[k],def[k]))o[k]=def[k]}return o}
const store={get(k,d){try{const s=localStorage.getItem(k);if(s==null)return d;const v=JSON.parse(s);return d!=null&&!sameType(v,d)?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const KEYS=["prog","srs","pos","rep","daily","streak","stats","set","custom","ana","puz","memo"];
const S={
  prog:store.get("et-prog",{}),srs:store.get("et-srs",{}),pos:store.get("et-pos",{}),rep:store.get("et-rep",[]),daily:store.get("et-daily",null),
  streak:store.get("et-streak",{last:null,n:0,best:0}),stats:store.get("et-stats",{}),
  set:Object.assign({revMs:300,theme:"green",pieces:"cburnett",sound:store.get("et-sound",true),ideas:true,coords:true,sf:5,design:"dark",evalbar:false,realistic:true,blitzSec:5,liToken:"",ghToken:"",gist:"",autoNext:true,autoQueen:false,swipe:true,font:100,calm:false,autoSync:true,tbHide:true,accent:"violet",learnFirst:true,premove:true,why:true,crsBoard:true,voice:false,voiceMv:false,voiceIn:false},store.get("et-set",{})),
  custom:store.get("et-custom",{w:[],b:[]}),ana:store.get("et-ana",null),puz:store.get("et-puz",[]),memo:store.get("et-memo",{})
};
{const SD={revMs:300,theme:"green",pieces:"cburnett",sound:true,ideas:true,coords:true,sf:5,design:"dark",evalbar:false,realistic:true,blitzSec:5,liToken:"",ghToken:"",gist:"",autoNext:true,autoQueen:false,swipe:true,font:100,calm:false,autoSync:true,tbHide:true,accent:"violet",learnFirst:true,premove:true,why:true,crsBoard:true,voice:false,voiceMv:false,voiceIn:false};fixT(S.set,SD);if(["violet","red","green"].indexOf(S.set.accent)<0)S.set.accent="violet"}
fixT(S.streak,{last:"",n:0,best:0});if(S.streak.last==="")S.streak.last=null;
fixT(S.custom,{w:[],b:[]});S.custom.w=S.custom.w.filter(l=>l&&Array.isArray(l.m));S.custom.b=S.custom.b.filter(l=>l&&Array.isArray(l.m));
S.rep=S.rep.filter(x=>typeof x==="string");S.puz=S.puz.filter(x=>x&&typeof x==="object"&&x.key);
if(S.daily&&(typeof S.daily!=="object"||!Array.isArray(S.daily.queue)||!Array.isArray(S.daily.done)))S.daily=null;
if(S.ana&&(typeof S.ana!=="object"||Array.isArray(S.ana)))S.ana=null;
for(const k in S.memo){const m=S.memo[k];if(!m||typeof m!=="object"||typeof m.t!=="string"||!m.t.trim())delete S.memo[k]}
let savedAt=store.get("et-savedAt",0);
const save=k=>{store.set("et-"+k,S[k]);savedAt=Date.now();store.set("et-savedAt",savedAt);cloudDirty()};
const st=S.stats;
fixT(st,{op:{},hard:{},quiz:{n:0,ok:0},engine:0,anaRuns:0,games:{},days:{},badges:[]});
fixT(st,{reviews:0,puzOk:0,blitz:0,blind:0,ends:{},imports:0,plans:{}});
const P=(id,i)=>(S.prog[id]||{})[i]||0;
const lk=(id,i)=>id+"#"+i;
const pk=k=>{const j=k.lastIndexOf("#");return [k.slice(0,j),+k.slice(j+1)]};
const Pk=k=>{const [id,i]=pk(k);return P(id,i)};

/* ---------------- Daten ---------------- */
/* ---- Zugbäume (trees.js): jedes Blatt wird eine Variante, dazu die Häufigkeit jedes Gegnerzugs ----
   Bestehende Varianten behalten ihre Nummer, damit Fortschritt, Wiederholungen und Notizen gültig bleiben. */
const TREE_SRC=typeof TREES!=="undefined"?TREES:{};
const plyNo=i=>i%2===0?(i/2+1)+".":(Math.floor(i/2)+1)+"…";
function parseTreeSrc(src){
  const root={san:null,w:0,label:null,kids:[],parent:null};
  const toks=String(src).match(/\(|\)|\{[^}]*\}|[^\s(){}]+/g)||[];let cur=root;const stack=[];
  for(const t of toks){
    if(t==="("){stack.push(cur);cur=cur.parent;continue}
    if(t===")"){cur=stack.pop()||root;continue}
    if(t[0]==="{"){cur.label=t.slice(1,-1).trim();continue}
    let m=t,w=0;const at=m.indexOf("@");if(at>0){w=+m.slice(at+1);m=m.slice(0,at)}
    let k=cur.kids.find(c=>strip(c.san)===strip(m));
    if(!k){k={san:m,w,label:null,kids:[],parent:cur};cur.kids.push(k)}else if(w)k.w=Math.max(k.w,w);
    cur=k;
  }
  return root;
}
function mergeTree(o){
  const src=TREE_SRC[o.id];if(!src)return;
  const root=parseTreeSrc(src);const tw={};const leaves=[];
  const oppAt=len=>(len%2===0?"w":"b")!==o.side;
  (function walk(n,pre,name,br){
    if(n.label)name=n.label;
    const opp=oppAt(pre.length);
    /* Häufigkeiten nur für Gegnerzüge – eigene Alternativen (z. B. 3.e5 oder 3.Sc3 gegen Caro-Kann) wählst du selbst */
    if(n.kids.length>1&&opp){const sum=n.kids.reduce((s,k)=>s+(k.w||0),0);const t=tw[pre.map(strip).join(" ")]={};n.kids.forEach(k=>{t[strip(k.san)]=sum?(k.w||0)/sum:1/n.kids.length})}
    if(!n.kids.length){leaves.push({m:pre,name,br});return}
    n.kids.forEach(k=>walk(k,pre.concat(k.san),name,n.kids.length>1&&opp?br.concat(plyNo(pre.length)+de(k.san)):br));
  })(root,[],o.name,[]);
  /* Alte Varianten, die mitten im Baum aufhören, laufen bis zum Ende der Hauptfortsetzung weiter.
     So gibt es keine doppelte Kurzfassung mehr, und keine Variante endet nach einem Gegnerzug. Nummer und Fortschritt bleiben. */
  o.lines.forEach(l=>{
    if(l.trap)return;let n=root;
    for(const s of l.m){n=n.kids.find(k=>strip(k.san)===strip(s));if(!n)return}
    const add=[];
    while(n.kids.length){const k=oppAt(l.m.length+add.length)?n.kids.reduce((a,b)=>(b.w||0)>(a.w||0)?b:a):n.kids[0];add.push(k.san);n=k}
    if(add.length){l.ext=l.m.length;l.m=l.m.concat(add)}
  });
  const names=new Set(o.lines.map(l=>l.n));
  leaves.forEach(L=>{
    if(o.lines.some(l=>l.m.length>=L.m.length&&L.m.every((x,i)=>strip(x)===strip(l.m[i]))))return;
    let n=L.name;for(let j=L.br.length-1;names.has(n)&&j>=0;j--)n=L.name+" · "+L.br.slice(j).join(" ");
    for(let k=2;names.has(n);k++)n=L.name+" ("+k+")";
    names.add(n);
    o.lines.push({n,m:L.m.slice(),p:"",notes:{},trap:o.g==="x"&&/Falle|Matt/.test(n),tree:true});
  });
  o.tw=tw;
}
/* Häufigkeit eines Gegnerzugs nach den Zügen h (Anteil 0–1), oder null, wenn der Baum dazu nichts weiß */
const twOf=(o,h,san)=>{const t=o&&o.tw&&o.tw[h.map(strip).join(" ")];return t&&t[strip(san)]!=null?t[strip(san)]:null};
/* Wie oft eine ganze Variante in der Praxis vorkommt: Produkt der Häufigkeiten aller Gegnerzüge */
function lineProb(o,i){const l=o.lines[i];if(!o.tw||!l)return null;let p=1,any=false;for(let k=0;k<l.m.length;k++){const w=twOf(o,l.m.slice(0,k),l.m[k]);if(w!=null){p*=w;any=true}}return any?p:null}
/* Gewicht einer Variante für die Auswahl: so oft, wie sie in Partien vorkommt – seltene haben eine Untergrenze und kommen trotzdem dran */
const lineW=(o,i)=>{const p=lineProb(o,i);return p==null?.05:Math.max(p,.002)};
const wrnd=(a,f)=>{if(!a.length)return null;const w=a.map(f);const t=w.reduce((x,y)=>x+y,0);if(!(t>0))return rnd(a);let r=Math.random()*t;for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i]}return a[a.length-1]};
const fmtPct=p=>{const x=p*100;return x>=10?Math.round(x)+" %":x>=1?x.toFixed(1).replace(".",",")+" %":x>=.1?x.toFixed(1).replace(".",",")+" %":"< 0,1 %"};
const BASE=OPENINGS.concat(OPENINGS_NEW,typeof TREE_OPENINGS!=="undefined"?TREE_OPENINGS:[],OPENINGS_TRAPS).map(o=>{
  const Pl=(typeof PLANS!=="undefined"&&PLANS[o.id])||{};
  const lines=o.lines.map((L,i)=>{const notes=L[3]||(Pl.notes&&Pl.notes[i])||{};
    return {n:L[0],m:L[1].split(" "),p:L[2]||(Pl.lp&&Pl.lp[i])||"",notes,trap:o.id.indexOf("fallen_")===0||(o.g==="x"&&(/Falle|Matt/.test(L[0])||Object.keys(notes).length>0))}});
  const r=Object.assign({},o,{plan:o.plan||Pl.plan||[],lines});mergeTree(r);return r;
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
const byId=id=>ALL.find(o=>o.id===id)||(id==="custom_w"||id==="custom_b"?ALL.find(o=>o.id.indexOf(id+"_")===0):null)||(typeof lexOp==="function"&&/^lxe?:/.test(String(id))?lexOp(id):null);
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
const playSound=r=>{sfx(/[+#]/.test(r.san)?"check":r.captured?"capture":"move");if(S.set.voiceMv)vcMove(r)};

/* ---------------- Wiederholung (SM-2) für Varianten und Stellungen ---------------- */
function sm2(s,q){
  s=s||{iv:0,ef:2.5,reps:0,lapses:0};
  if(q<3){s.reps=0;s.lapses=(s.lapses||0)+1;s.iv=1}else{s.reps++;s.iv=s.reps===1?1:s.reps===2?3:Math.max(1,Math.round(s.iv*s.ef))}
  s.ef=Math.max(1.3,s.ef+(0.1-(5-q)*(0.08+(5-q)*0.02)));s.due=startOfDay(Date.now())+s.iv*DAY;s.last=Date.now();return s;
}
function srsReview(k,q){const o=S.srs[k];
  /* Mehrmals am selben Tag richtig: zählt fürs Lernen, verlängert den Abstand aber nicht – erst der Abruf an einem späteren Tag zeigt echtes Behalten (verteiltes Üben) */
  if(o&&o.last&&o.last>=startOfDay(Date.now())&&q>=3){o.last=Date.now();o.due=Math.max(o.due||0,startOfDay(Date.now())+DAY);save("srs");return}
  if(o&&o.last){st.rlog.push([Date.now(),Math.round((Date.now()-o.last)/DAY*10)/10,q>=3?1:0]);if(st.rlog.length>1500)st.rlog.splice(0,st.rlog.length-1500)}S.srs[k]=sm2(S.srs[k],q);save("srs")}
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
    /* gewichtet gemischt (Efraimidis–Spirakis): häufige Varianten kommen eher dran, die Reihenfolge bleibt aber zufällig */
    const ks=[].concat(...pool.map(o=>o.lines.map((l,i)=>({k:lk(o.id,i),r:Math.pow(Math.random(),1/lineW(o,i))})))).sort((a,b)=>b.r-a.r).map(x=>x.k).filter(k=>!S.srs[k]&&Pk(k)<2&&r.indexOf(k)<0);
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
    celebrate("streak",S.streak.n,"Tagestraining geschafft!");streakMilestone();
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
  if(fresh.length){st.badges=got;saveStats();const b=BADGES.find(x=>x.id===fresh[0]);wlog("badge",`Abzeichen „${b.t}“ erhalten`);setTimeout(()=>{toast("Neues Abzeichen: "+b.t);sfx("badge")},700)}
}

/* ---------------- Endspiele ---------------- */
const END_CH=[["mate","Grundmatts","Die Mattführungen, die jeder Spieler beherrschen muss."],["pawn","Bauernendspiele","Opposition, Schlüsselfelder und Quadratregel."],["rook","Turm- und Damenendspiele","Lucena, Philidor und Dame gegen Turm."],["open","Endspiele aus der Eröffnung","Typische Endspiele, die direkt aus deinen Eröffnungen entstehen."]];
const ENDGAMES=[
  {id:"kq",c:"mate",t:"Matt mit Dame",fen:"8/8/8/3k4/8/8/8/3QK3 w - - 0 1",side:"w",goal:"Setze den schwarzen König mit Dame und König matt. Dränge ihn mit der Dame an den Rand, ohne Patt zu geben.",plan:["Die Dame schneidet den König ab – immer einen Springerzug entfernt.","Der eigene König kommt zur Unterstützung.","Vorsicht vor Patt, wenn der König am Rand steht."]},
  {id:"kr",c:"mate",t:"Matt mit Turm",fen:"8/8/8/4k3/8/8/8/R3K3 w - - 0 1",side:"w",goal:"Setze mit Turm und König matt. Der Turm verkleinert die Box, der König geht in Opposition.",plan:["Der Turm schneidet eine Reihe oder Linie ab.","Der König stellt sich dem gegnerischen König gegenüber (Opposition).","Dann Schach mit dem Turm und die Box wird kleiner."]},
  {id:"lucena",c:"rook",t:"Lucena-Stellung",fen:"1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1",side:"w",goal:"Gewinne mit dem Brückenbau: Td1+, dann den Turm auf die vierte Reihe, um die Schachs abzuschirmen.",plan:["Zuerst den schwarzen König mit Td1+ weiter abdrängen.","Turm auf die vierte Reihe (Td4) – das ist die Brücke.","Mit dem König heraus und Schachs mit dem Turm abblocken."]},
  {id:"philidor",c:"rook",t:"Philidor-Stellung",fen:"4k3/8/r7/3PK3/8/8/8/7R b - - 0 1",side:"b",goal:"Halte das Remis als Schwarz: Turm auf der sechsten Reihe, bis der weiße Bauer vorrückt – dann Schachs von hinten.",plan:["Der Turm bleibt auf der sechsten Reihe und hält den weißen König fern.","Sobald der Bauer auf die sechste Reihe zieht, geht der Turm auf die erste Reihe.","Von hinten Schach geben – der weiße König findet keinen Schutz."]},
  {id:"krr",c:"mate",t:"Matt mit zwei Türmen",fen:"8/8/8/4k3/8/8/8/R3K2R w - - 0 1",side:"w",goal:"Die Treppe: Die Türme geben abwechselnd Schach und drängen den König Reihe für Reihe an den Rand.",plan:["Ein Turm sperrt eine Reihe ab, der andere gibt auf der nächsten Reihe Schach.","Kommt der König einem Turm zu nahe, zieht dieser weit weg auf die andere Seite.","Der eigene König wird gar nicht gebraucht."]},
  {id:"kbb",c:"mate",t:"Matt mit zwei Läufern",fen:"8/8/8/4k3/8/8/8/2B1KB2 w - - 0 1",side:"w",goal:"Mit zwei Läufern und König in die Ecke drängen und matt setzen. Die Läufer stehen nebeneinander und bilden eine Wand.",plan:["Läufer nebeneinander auf benachbarte Diagonalen – sie bilden eine Sperre.","Der König kommt dicht heran und nimmt dem gegnerischen König Felder.","In der Ecke abschließen und auf Patt achten."]},
  {id:"keysq",c:"pawn",t:"König vor dem Bauern",fen:"4k3/8/4K3/4P3/8/8/8/8 w - - 0 1",side:"w",goal:"Ein Bauer, König davor auf der sechsten Reihe: Das gewinnt immer. Bring den Bauern zur Dame.",plan:["Der König geht seitlich am Bauern vorbei, nicht nach vorn ins Patt.","Opposition: Der König steht dem gegnerischen König mit einem Feld Abstand gegenüber.","Erst wenn das Umwandlungsfeld kontrolliert ist, zieht der Bauer."]},
  {id:"square",c:"pawn",t:"Die Quadratregel",fen:"8/8/8/P7/8/5k2/8/7K w - - 0 1",side:"w",goal:"Der schwarze König steht außerhalb des Quadrats deines Bauern. Lauf einfach los – er holt ihn nicht mehr ein.",plan:["Das Quadrat reicht vom Bauern bis zur Grundreihe – hier a5 bis d8.","Steht der König außerhalb und du bist am Zug, läuft der Bauer durch.","Nach der Umwandlung mit Dame und König matt setzen."]},
  {id:"kqkr",c:"rook",t:"Dame gegen Turm",fen:"8/2r5/8/4k3/8/8/8/K2Q4 w - - 0 1",side:"w",goal:"Die Dame gewinnt gegen den Turm – trenne Turm und König mit Schachs und Gabeln.",plan:["Den König an den Rand drängen, bis der Turm nicht mehr neben ihm stehen kann.","Auf Gabeln achten: Schach und gleichzeitig Angriff auf den Turm.","Nach dem Turmgewinn normal matt setzen."]},
  {id:"berlin",c:"open",t:"Berliner Endspiel",moves:"e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8",side:"w",goal:"Das Endspiel aus der Berliner Mauer: Spiele mit Weiß auf die Bauernmehrheit am Königsflügel.",plan:["Nc3, h3 und Ld2 oder Tad1 – solide entwickeln.","Mehrheit am Königsflügel mit f4–f5 oder g4 mobilisieren.","Schwarz hat das Läuferpaar – Stellung nicht zu früh öffnen."]}
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
let op=null,mode="train",hist=[],fens=[],mvs=[],flags=[],view=0,shown=null,target=null,forced=null,busy=false,done=false,mistakes=0,usedHelp=false,hintLvl=0,sel=null,timer=null,lock=false,badge=null,liveStatus=null,curStatus=null,tab="ex",flipped=false,sess=null,game=null,sfStart=0,sfEval=null,drill=null,puz=null,tried=new Set(),blindOn=false,peeked=false,vtab="list",evalCp=null,evalTok=0,blitzT=null,blitzLeft=0,startFen=null,learn=false,learnNext=null;
const boardEl=$("board"),sqsEl=$("sqs"),pcsEl=$("pcs"),ovl=$("ovl"),ideasEl=$("ideas"),marksEl=$("marks"),badgesEl=$("badges");
const live=()=>view===hist.length;
const consistent=h=>op&&op.lines?consistentIn(op,h):[];
const bookMoves=h=>bookMovesIn(op,h);
const findMove=(g,san)=>g.moves({verbose:true}).find(x=>strip(x.san)===strip(san));
const userTurnShown=()=>shown&&shown.turn()===op.side;
function baseOrient(){if(mode==="online")return ON.color||"w";if(mode==="replay")return game&&game.orient||"w";if(mode==="edit")return $("edSide").value;return op.side}
const orient=()=>flipped?(baseOrient()==="w"?"b":"w"):baseOrient();
function expected(){if(mode==="puzzle"){const k=hist.length-(puz&&puz.base||0);return puz&&puz.sol[k]?[strip(puz.sol[k])]:[]}if(tp&&mode==="train"&&view>tp.p)return view===hist.length?tpOptions(tp,fens[view]):[];return bookMoves(hist.slice(0,view))}

function pickTarget(){
  const c=consistent(hist);if(!c.length)return null;
  if(forced!==null&&c.indexOf(forced)>=0)return forced;
  if(target!==null&&c.indexOf(target)>=0)return target;
  const fresh=c.filter(i=>P(op.id,i)<2);const due=c.filter(i=>isDue(lk(op.id,i)));const pool=due.length?due:fresh.length?fresh:c;
  return wrnd(pool,i=>lineW(op,i));
}
function resetBoard(fen){
  clearTimeout(learnNext);learnNext=null;learn=false;
  sfEnd=null;clearTimeout(timer);stopBlitz();cancelAuto();if(wrongT){clearTimeout(wrongT);wrongT=null;wrongRevert=null}whyStop();whyTok++;whyCur=null;tp=null;tpNote=null;const g=new Chess(fen||undefined);startFen=fen||null;
  hist=[];fens=[g.fen()];mvs=[];flags=[];view=0;shown=g;target=null;done=false;mistakes=0;usedHelp=false;hintLvl=0;sel=null;busy=false;lock=false;badge=null;sfEval=null;tried=new Set();peeked=false;evalCp=null;
  marks.a.clear();marks.c.clear();xpl=null;pickWait=false;memoOpen.clear();VC.km.clear();
}
function commit(mv,flag){const g=new Chess(fens[hist.length]);const r=g.move(mv.san||mv);hist.push(r.san);mvs.push(r);fens.push(g.fen());flags.push(flag);return r}
function truncate(n){hist.length=n;mvs.length=n;fens.length=n+1;flags.length=n;if(tp){if(n<=tp.p)tp=null;else tpSync(n)}}

/* ================= Training ================= */
function selectOpening(o,line,keepSess){
  if(!o)return;
  if(!keepSess)sess=null;
  stopEngine();mode="train";game=null;drill=null;puz=null;op=o;forced=(line===undefined||line===null)?null:line;flipped=false;
  store.set("et-last",o.id);showView("train");renderList();startTrain();
}
function learnWanted(){if(sess&&sess.plan)return mode==="train"&&!drill&&target!==null&&sess.roles[sess.idx]==="new"&&sess.method==="show";return mode==="train"&&!drill&&!op.endId&&target!==null&&op.lines&&op.lines.length&&!(sess&&(sess.blitz||sess.blind))&&S.set.learnFirst!==false&&P(op.id,target)===0&&!S.srs[lk(op.id,target)]}
function startTrain(noLearn,forceLearn){
  if(op&&op.playOn)op=op.playOn.src;
  resetBoard();mode="train";drill=null;target=pickTarget();learn=!noLearn&&(learnWanted()||(!!forceLearn&&target!==null));if(learn)forced=target;if(learn&&shown.turn()===op.side)hintLvl=2;buildSquares();renderChrome();render();
  const fl=forced!==null&&op.lines[forced]?" Variante: "+op.lines[forced].n+".":"";
  if(learn){setStatus("turn","Lernmodus: "+op.lines[target].n,shown.turn()===op.side?learnTxt():"Schau zu und spiel die markierten Züge nach. Danach prüfst du dich ohne Hilfe.");if(shown.turn()!==op.side)engineSoon();return}
  if(shown.turn()!==op.side){setStatus("turn","Das Buch eröffnet","Weiß macht gleich den ersten Zug."+fl);engineSoon()}
  else{setStatus("turn","Du bist am Zug","Spiel den ersten Zug: "+op.name+"."+fl);startBlitz()}
}
function engineSoon(){busy=true;timer=setTimeout(bookMove,sess&&sess.blitz?250:600)}
async function bookMove(){
  if(mode!=="train"){busy=false;return}
  const c=consistent(hist);if(!c.length){busy=false;return}
  let tgt=pickTarget();
  const nexts=[...new Set(c.map(i=>op.lines[i].m[hist.length]).filter(Boolean).map(strip))];
  /* »Ich wähle«: Bei mehreren Gegnerzügen zeigt das Brett alle als Schatten, du tippst einen an */
  if(S.set.pickOpp&&forced===null&&!drill&&!learn&&!sess&&nexts.length>1&&live()){
    busy=false;pickWait=true;render();renderChrome();const opp=op.side==="w"?"Schwarz":"Weiß";
    setStatus("turn","Wähle den Zug von "+opp,`${opp} hat hier ${nexts.length} Buchzüge. Die Schatten auf dem Brett zeigen sie${op.tw?" mit ihrer Häufigkeit":""}. Tippe einen an, dann bist du dran.`);return;
  }
  if(S.set.realistic&&forced===null&&!drill&&nexts.length>1){
    const candOf=s=>c.filter(i=>strip(op.lines[i].m[hist.length]||"")===s);
    /* offene Varianten kommen öfter, sichere seltener – aber nie gar nicht */
    const need=s=>{const cs=candOf(s);return .3+cs.filter(i=>P(op.id,i)<2||isDue(lk(op.id,i))).length/Math.max(1,cs.length)};
    let w=null;
    const tws=nexts.map(s=>twOf(op,hist,s));
    if(tws.some(x=>x!=null)){const lo=Math.min(...tws.filter(x=>x!=null));w=nexts.map((s,i)=>(tws[i]!=null?tws[i]:Math.min(.05,lo/2))*need(s))}
    else{
      const data=await explorer("lichess",hist.slice(),1500).catch(()=>null);
      if(mode!=="train")return;
      if(data&&data.moves)w=nexts.map(s=>{const m=data.moves.find(x=>strip(x.san)===s);const n=m?(m.white+m.draws+m.black):0;const fresh=c.some(i=>strip(op.lines[i].m[hist.length]||"")===s&&P(op.id,i)<2);return (n+1)*(fresh?2:1)});
    }
    if(w){const tot=w.reduce((a,b)=>a+b,0);let r=Math.random()*tot,pick=nexts[0];for(let i=0;i<nexts.length;i++){r-=w[i];if(r<=0){pick=nexts[i];break}}
      const cand=candOf(pick);const cf=cand.filter(i=>P(op.id,i)<2);if(cand.length)tgt=cand.indexOf(tgt)>=0?tgt:wrnd(cf.length?cf:cand,i=>lineW(op,i));}
  }
  busy=false;target=tgt;playBook();
}
function playBook(){
  if(target===null)return;
  const g=new Chess(fens[hist.length]);const mv=findMove(g,op.lines[target].m[hist.length]);
  const wasLive=live();const r=commit(mv,"b");
  if(wasLive){view=hist.length;shown=new Chess(fens[view]);hintLvl=learn?2:0;render({fwd:r});playSound(r)}else render();
  if(hist.length===op.lines[target].m.length)return finish();
  if(learn){const s=["turn","Lernmodus: "+op.lines[target].n,learnTxt()];if(wasLive)setStatus(...s);else liveStatus=s;return}
  const n=consistent(hist).length;
  const lastW=twOf(op,hist.slice(0,-1),hist[hist.length-1]);
  const s=["turn","Du bist am Zug",(lastW!=null&&lastW<.995?`${op.side==="w"?"Schwarz":"Weiß"} wählte ${de(r.san)} (≈ ${fmtPct(lastW)} der Partien). `:"")+(n>1?`${n} Varianten sind noch möglich. Welcher Buchzug folgt?`:`Variante: ${op.lines[target].n}`)];
  if(tpNote){s[2]=tpNote+" "+s[2];tpNote=null}
  if(wasLive){setStatus(...s);startBlitz()}else liveStatus=s;
}
function trainMove(mv,animate,help){
  pickWait=false;const h=hist.slice(0,view);
  if(tp&&view>tp.p){tpMove(mv,animate,help,h);return}
  if(tp)tp=null;
  const ok=bookMoves(h).indexOf(strip(mv.san))>=0;
  if(!ok&&!help){const T=tpFind(h,mv.san);if(T){if(T.direct)tpGo(T,mv,animate,h);else tpCheck(T,mv,animate,h);return}}
  if(!tried.has(view)&&!help&&!learn){tried.add(view);posReview(op.id,h,ok&&hintLvl===0?5:1)}
  if(!ok){wrongMove(mv,animate,h);return}
  stopBlitz();
  if(!live()){clearTimeout(timer);busy=false;truncate(view);done=false;target=null;mistakes++;if(sfEnd){sfEnd=null;renderChrome()}}
  const r=commit(mv,"u");view=hist.length;shown=new Chess(fens[view]);sel=null;hintLvl=0;
  if(learn){}else if(help){opStat(op.id).err++;dqAdd(0,1)}else{opStat(op.id).mv++;dqAdd(1,0)}
  badge={ply:view,sq:r.to,type:"book"};
  target=pickTarget();render(animate?{fwd:r}:null);playSound(r);
  if(drill){finishDrill(mistakes===0&&!usedHelp);return}
  if(target!==null&&hist.length===op.lines[target].m.length){finish();return}
  setStatus("good",de(r.san)+" ist ein Buchzug",learn?explain(fens[view-1],r,view>1?mvs[view-2]:null).text:"Das Buch antwortet …");crsOnMove(true);engineSoon();
}
function wrongMove(mv,animate,h){
  mistakes++;lock=true;sel=null;
  if(mode==="train"&&!learn){const s=opStat(op.id);s.err++;dqAdd(0,1);if(!tp){const key=op.id+"|"+h.join(" ");const H=st.hard[key]||(st.hard[key]={id:op.id,pre:h.slice(),n:0});H.n++;H.last=Date.now()}saveStats()}
  const tmp=new Chess(shown.fen());const r=tmp.move(mv.san);
  const keep=shown;shown=tmp;badge={ply:-1,sq:r.to,type:"no"};
  render(animate?{fwd:r}:null,{bad:[r.from,r.to]});sfx("wrong");
  const wTitle=de(r.san)+(mode==="puzzle"?" ist nicht die Lösung":" ist nicht im Buch"),wTail=mistakes>=2&&hintLvl===0?"Tipp: Mit »Hinweis« siehst du, welche Figur ziehen sollte.":"Versuch es noch einmal.";
  setStatus("bad",wTitle,wTail);
  if(mode==="train"&&S.set.why!==false&&!(sess&&sess.blitz))whyCheck(keep.fen(),r,wTitle,wTail);
  if(mode==="puzzle")reportPuzzle(false);else if(mode==="train")crsOnMove(false);
  if(mode==="train"&&sess&&sess.plan&&sess.method==="guess"&&sess.roles[sess.idx]==="new"){const myIdx=sess.idx;setTimeout(()=>{if(mode==="train"&&!done&&sess&&sess.idx===myIdx){hintLvl=2;usedHelp=true;render();setStatus("turn","So geht der Zug","Dein Versuch war nicht der Buchzug. Spiel jetzt den markierten Zug – gleich danach weißt du ihn selbst.")}},820)}
  const myMode=mode;
  wrongRevert=()=>{clearTimeout(wrongT);wrongT=null;wrongRevert=null;if(mode!==myMode){lock=false;return}shown=keep;badge=null;lock=false;render({back:r});boardEl.classList.remove("shake");void boardEl.offsetWidth;boardEl.classList.add("shake")};
  wrongT=setTimeout(wrongRevert,750);
}
let wrongT=null,wrongRevert=null;
/* ---- Zugumstellungen: eine andere Reihenfolge, die in dieselbe Buchstellung führt, gilt als richtig.
   tp hält das Fenster zwischen Abweichung und Rückkehr ins Buch: feste Gegnerzüge (opp), noch offene eigene Züge (rest), Zielstellung (goal).
   Kommt die Stellung wieder ins Buch, zeigt die Zugliste die Buchreihenfolge, damit Wiederholung, Schlüsselzüge und Erklärungen weiter passen. */
let tp=null,tpNote=null,tpTok=0;const tpMemo=new Map();
const pk3=fen=>fen.split(" ").slice(0,3).join(" ");
function fenAfter(fen,sans){const g=new Chess(fen);for(const s of sans){const m=findMove(g,s);if(!m)return null;g.move(m.san)}return g.fen()}
function tpCanFinish(T,fen,rest,oi){
  if(oi>=T.opp.length)return !rest.length&&pk3(fen)===T.goal;
  const f1=fenAfter(fen,[T.opp[oi]]);if(!f1||!rest.length)return false;
  return rest.some((x,k)=>{const f2=fenAfter(f1,[x]);return !!f2&&tpCanFinish(T,f2,rest.filter((_,j)=>j!==k),oi+1)});
}
/* Eigene Züge, mit denen das Fenster noch aufgeht (am Zug, nach dem festen Gegnerzug) */
function tpOptions(T,fen){return T.rest.filter((x,k)=>{const f=fenAfter(fen,[x]);return !!f&&tpCanFinish(T,f,T.rest.filter((_,j)=>j!==k),T.oi)}).map(strip)}
/* Stellung nach `ply` Halbzügen jeder Variante – gemeinsame Anfänge werden nur einmal berechnet */
function tpIndex(ply){
  const ix=new Map();
  op.lines.forEach((l,i)=>{if(l.m.length<ply)return;let fen=new Chess().fen();
    for(let k=1;k<=ply;k++){const key=op.id+"|"+l.m.slice(0,k).map(strip).join(" ");let f=tpMemo.get(key);if(!f){f=fenAfter(fen,[l.m[k-1]]);if(!f)return;tpMemo.set(key,f)}fen=f}
    const pk=pk3(fen);if(!ix.has(pk))ix.set(pk,i)});
  if(tpMemo.size>6000)tpMemo.clear();return ix;
}
function tpFind(h,san){
  if(mode!=="train"||!op||!op.lines||!op.lines.length||op.endId||learn||drill||startFen||(sess&&sess.blitz))return null;
  const p=h.length,s=strip(san),f0=fens[p];if(!f0)return null;
  const c=consistentIn(op,h);const pref=(forced!==null?[forced]:[target].concat(c)).filter((x,k,a)=>x!==null&&c.indexOf(x)>=0&&a.indexOf(x)===k);
  const fU=fenAfter(f0,[san]);if(!fU)return null;
  /* 1) Vertauschte eigene Züge innerhalb der nächsten drei eigenen Züge derselben Variante */
  for(const i of pref){const L=op.lines[i].m;
    for(let j=1;j<=2;j++){const e=p+2*j;if(e>=L.length)break;
      const us=[],os=[];for(let k=p;k<=e;k++)((k-p)%2?os:us).push(L[k]);
      for(let x=1;x<=j;x++){if(strip(us[x])!==s)continue;
        const goalF=fenAfter(f0,L.slice(p,e+1));if(!goalF)continue;
        const T={i,p,end:e+1,goal:pk3(goalF),opp:os,users:us.slice(),rest:us.filter((_,k)=>k!==x),oi:0,book:L.slice(p,e+1),first:san,warn:null,tok:++tpTok};
        if(tpCanFinish(T,fU,T.rest,0))return T;
      }
    }
  }
  /* 2) Dieselbe Stellung steht in einer anderen Variante derselben Eröffnung (gleiche Zugzahl) */
  if(forced===null){const i=tpIndex(p+1).get(pk3(fU));if(i!=null&&c.indexOf(i)<0)return {direct:true,i,p,end:p+1,goal:pk3(fU),book:op.lines[i].m.slice(0,p+1),first:san,tok:++tpTok}}
  return null;
}
/* Fenster nach Zurücknehmen oder Zurückblättern neu berechnen */
function tpSync(n){const T=tp;const played=hist.slice(T.p,n);let rest=T.users.slice(),oi=0;
  played.forEach((m,k)=>{if(k%2){oi++;return}const j=rest.findIndex(x=>strip(x)===strip(m));if(j>=0)rest.splice(j,1)});T.rest=rest;T.oi=oi}
/* Vor dem Annehmen prüft Stockfish die Zwischenstellung: Eine Reihenfolge, die Material kostet, ist keine Zugumstellung, sondern ein Fehler */
let tpChk=0;
function tpCheck(T,mv,animate,h){
  const op0=op,v0=view,len0=hist.length,tok=++tpChk,f0=fens[v0],sg=new Chess(f0).turn()==="w"?1:-1;
  const tmp=new Chess(f0);const r=tmp.move(mv.san);if(!r)return;const fU=tmp.fen(),fB=fenAfter(f0,[T.book[0]]);
  const keep=shown;shown=tmp;lock=true;sel=null;badge={ply:-1,sq:r.to,type:"book"};stopBlitz();render(animate?{fwd:r}:null);playSound(r);
  setStatus("turn","Zugumstellung?","Stockfish prüft kurz, ob diese Reihenfolge hält …");
  const go=(eU,eB)=>{
    if(tok!==tpChk||mode!=="train"||op!==op0||hist.length!==len0)return;
    shown=keep;lock=false;badge=null;if(view!==v0){render();return}
    const d=eU&&eB?(eB.cp-eU.cp)*sg:null;
    if(d!=null&&d>=150){wrongMove(mv,false,h);return}
    T.warns=[];
    if(d!=null&&d>=60&&eU.pv&&eU.pv[0]&&S.set.why!==false){const g=new Chess(fU);const m=uciPlay(g,eU.pv[0]);
      if(m&&strip(m.san)!==strip(T.opp[0]))T.warns[0]=`Vorsicht: Diese Reihenfolge erlaubt ${sg>0?"Schwarz":"Weiß"} ${numSan(fU,m.san)} (Stockfish ${fmtEv(eU.cp)} statt ${fmtEv(eB.cp)} mit der Buchreihenfolge).`}
    T.warn=T.warns.filter(Boolean).join(" ");
    tpGo(T,mv,false,h,true);
  };
  const late=new Promise(res=>setTimeout(()=>res(null),4000));
  Promise.race([Promise.all([whyEval(fU),fB?whyEval(fB):null]),late]).then(v=>v?go(v[0],v[1]):go(null,null)).catch(()=>go(null,null));
}
function tpGo(T,mv,animate,h,quiet){
  if(!live()){clearTimeout(timer);busy=false;truncate(view);done=false;target=null;mistakes++;if(sfEnd){sfEnd=null;renderChrome()}}
  stopBlitz();if(!tried.has(view)){tried.add(view);posReview(op.id,h,3)}
  const r=commit(mv,"u");view=hist.length;shown=new Chess(fens[view]);sel=null;hintLvl=0;badge={ply:view,sq:r.to,type:"book"};
  opStat(op.id).mv++;dqAdd(1,0);render(animate?{fwd:r}:null);if(!quiet)playSound(r);crsOnMove(true);
  if(T.direct){tpRejoin(T);return}
  tp=T;target=T.i;
  const plan=[];T.opp.forEach((o,k)=>{plan.push(o);if(T.rest[k])plan.push(T.rest[k])});
  setStatus("good","Zugumstellung erkannt",`${numSan(fens[view-1],r.san)} führt nach ${fmtMoves(plan,T.p+1)} in dieselbe Stellung wie das Buch: ${fmtMoves(T.book,T.p)}.`+(T.warn?" "+T.warn:""));
  busy=true;timer=setTimeout(tpOpp,window.__FAST?1:1300);tpWarn(T,r.san);
}
function tpTxt(T){const fen=fens[hist.length];const o=tpOptions(T,fen);
  const how=T.rest.length===1&&o.length?`Mit ${numSan(fen,o[0])} kommst du in die Buchstellung`:`Mit ${T.rest.map(de).join(" und ")} in beliebiger Reihenfolge kommst du in die Buchstellung`;
  return `Zugumstellung: ${how} (im Buch ${fmtMoves(T.book,T.p)}).`+(T.warn?" "+T.warn:"")}
function tpOpp(){
  busy=false;const T=tp;if(!T||mode!=="train")return;
  const mv=findMove(new Chess(fens[hist.length]),T.opp[T.oi]);if(!mv){tp=null;return}
  const wasLive=live();const r=commit(mv,"b");T.oi++;
  if(wasLive){view=hist.length;shown=new Chess(fens[view]);hintLvl=0;render({fwd:r});playSound(r)}else render();
  const s=["turn","Du bist am Zug",tpTxt(T)];if(wasLive){setStatus(...s);startBlitz()}else liveStatus=s;
}
function tpMove(mv,animate,help,h){
  const T=tp;
  if(!live()){clearTimeout(timer);busy=false;truncate(view);done=false;mistakes++;if(sfEnd){sfEnd=null;renderChrome()}if(!tp){trainMove(mv,animate,help);return}}
  if(tpOptions(T,fens[view]).indexOf(strip(mv.san))<0){wrongMove(mv,animate,h);return}
  stopBlitz();const r=commit(mv,"u");view=hist.length;shown=new Chess(fens[view]);sel=null;hintLvl=0;badge={ply:view,sq:r.to,type:"book"};
  const j=T.rest.findIndex(x=>strip(x)===strip(r.san));if(j>=0)T.rest.splice(j,1);
  if(help){opStat(op.id).err++;dqAdd(0,1)}else{opStat(op.id).mv++;dqAdd(1,0)}
  render(animate?{fwd:r}:null);playSound(r);crsOnMove(true);
  if(hist.length>=T.end){tpRejoin(T);return}
  setStatus("good",de(r.san)+" passt","Das Buch antwortet …");busy=true;timer=setTimeout(tpOpp,window.__FAST?1:600);
}
/* Zurück ins Buch: gleiche Stellung, Zugliste in Buchreihenfolge, dann geht die Variante normal weiter */
function tpRejoin(T){
  tp=null;const last=mvs[mvs.length-1];
  if(pk3(fens[hist.length])!==T.goal){target=pickTarget();return}
  const from=T.direct?0:T.p;truncate(from);
  for(const s of T.book){const g=new Chess(fens[hist.length]);const m=findMove(g,s);if(!m)break;commit(m,g.turn()===op.side?"u":"b")}
  view=hist.length;shown=new Chess(fens[view]);badge=last?{ply:view,sq:last.to,type:"book"}:null;
  const c=consistent(hist);target=c.indexOf(T.i)>=0?T.i:pickTarget();
  const line=op.lines[T.i];
  tpNote=T.direct?`Zugumstellung: Diese Stellung kennt das Buch aus der Variante „${line.n}“ (${fmtMoves(T.book,0)}). Die Zugliste zeigt jetzt diese Reihenfolge.`
    :`Zugumstellung geschafft – du stehst in der Buchstellung nach ${fmtMoves(T.book,T.p)}. Die Zugliste zeigt jetzt die Buchreihenfolge.${T.warn?" "+T.warn:""}`;
  render();renderChrome();
  if(target!==null&&hist.length===op.lines[target].m.length){tpNote=null;finish();return}
  setStatus("good",T.direct?"Zugumstellung":"Zurück im Buch",tpNote);engineSoon();
}
/* Die Lichess-Statistik: Spielt der Gegner nach der eigenen Reihenfolge überhaupt den Zug, der in die Buchstellung führt?
   (Die Stockfish-Warnung entsteht schon in tpCheck, bevor die Reihenfolge angenommen wird.) */
function tpWarn(T,san){
  if(S.set.why===false)return;const f0=fens[T.p];if(!f0)return;const me=new Chess(f0).turn(),opp=me==="w"?"Schwarz":"Weiß";
  const fU=fenAfter(f0,[san]);if(!fU)return;const h=hist.slice(0,T.p);T.warns=T.warns||[];
  const add=(k,txt)=>{T.warns[k]=txt;T.warn=T.warns.filter(Boolean).join(" ");
    if(tp===T&&curStatus&&live()&&String(curStatus[2]).indexOf("Zugumstellung")>=0&&String(curStatus[2]).indexOf(txt)<0)setStatus(curStatus[0],curStatus[1],curStatus[2]+" "+txt)};
  explorer("lichess",h.concat([san]),2500).then(d=>{
    if(!d||!d.moves||!d.moves.length)return;const n=m=>m.white+m.draws+m.black,tot=d.white+d.draws+d.black;if(tot<300)return;
    const om=d.moves.find(m=>strip(m.san)===strip(T.opp[0])),share=om?n(om)/tot:0,top=d.moves[0];
    if(share>=.15||!top||strip(top.san)===strip(T.opp[0]))return;
    add(1,`Achtung: Nach ${numSan(f0,san)} antwortet ${opp} nur in ${fmtPct(share)} der Partien mit ${numSan(fU,T.opp[0])}, meist kommt ${numSan(fU,top.san)} (${fmtPct(n(top)/tot)}). Die Buchreihenfolge führt sicherer in diese Stellung.`)}).catch(()=>{});
}
/* ---- „Darum nicht“: Stockfish ordnet einen Nicht-Buchzug ein – spielbar, ungenau oder ein Fehler mit Widerlegung ---- */
let whyTok=0,whyCur=null,whyT=[],whyKeep=null;const whyMemo=new Map();
const numSan=(fen,san)=>{const p=fen.split(" ");return p[5]+(p[1]==="w"?".":"…")+de(san)};
const uciPlay=(g,u)=>u&&u.length>=4?g.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]||"q"}):null;
async function whyEval(fen){
  if(whyMemo.has(fen))return whyMemo.get(fen);
  const g=new Chess(fen);let res;
  if(g.in_checkmate())res={cp:g.turn()==="w"?-10000:10000,pv:[],mate:0};
  else if(g.game_over())res={cp:0,pv:[],mate:null};
  else{const r=await sfRun(fen,{ms:420});res={cp:cpOf(r.score,g.turn()),pv:r.pv||[],mate:r.score&&r.score.t==="mate"?r.score.v:null}}
  whyMemo.set(fen,res);if(whyMemo.size>400)whyMemo.delete(whyMemo.keys().next().value);return res;
}
/* Was der Zug kostet: Material entlang der besten Fortsetzung, bis die Stellung ruhig ist */
function whyLoss(fen0,fenW,pv,me){
  const g=new Chess(fenW),c0=pieceCount(new Chess(fen0)),seq=[];
  for(let i=0;i<Math.min(pv.length,8);i++){const m=uciPlay(g,pv[i]);if(!m)break;seq.push(pv[i]);if(i>=1&&!m.captured&&!g.in_check())break}
  const c1=pieceCount(g),th=me==="w"?"b":"w",dU={},dO={};let L=0;
  for(const t in PV){dU[t]=c0[me][t]-c1[me][t];dO[t]=c0[th][t]-c1[th][t];L+=PV[t]*(dU[t]-dO[t])}
  const minU=dU.n+dU.b,minO=dO.n+dO.b;let txt=null;
  if(L>=6&&dU.q>dO.q)txt="du verlierst die Dame";
  else if(L>=1.5&&dU.r>dO.r&&minO>minU)txt="du verlierst die Qualität";
  else if(L>=4&&dU.r>dO.r)txt="du verlierst einen Turm";
  else if(L>=1.5&&minU>minO)txt="du verlierst "+(dU.n>dO.n?"einen Springer":"einen Läufer")+(dO.p>dU.p?" für "+(dO.p-dU.p===1?"einen Bauern":"Bauern"):"");
  else if(L>=.9)txt="du verlierst "+(L>=2.5?"Material":L>=1.9?"zwei Bauern":"einen Bauern");
  return {txt,seq:seq.slice(0,4)};
}
async function whyCheck(fen0,r,title,tail){
  const tok=++whyTok;whyCur=null;const v0=view,g0=new Chess(fen0),me=g0.turn(),th=me==="w"?"Schwarz":"Weiß";
  const book=expected(),bm=book.length?findMove(new Chess(fen0),book[0]):null;
  const gW=new Chess(fen0);gW.move(r.san);const fenW=gW.fen();let fenB=null;if(bm){const gB=new Chess(fen0);gB.move(bm.san);fenB=gB.fen()}
  let eW,eB;try{eW=await whyEval(fenW);eB=fenB?await whyEval(fenB):null}catch(e){return}
  if(tok!==whyTok||mode!=="train"||view!==v0||!curStatus||(curStatus[1]!==title&&curStatus[1]!=="So geht der Zug"))return;
  const sg=me==="w"?1:-1,cW=eW.cp*sg,cB=eB?eB.cp*sg:cW,d=cB-cW,wTxt=numSan(fen0,r.san);
  let rep=null;if(eW.pv&&eW.pv[0]){const g=new Chess(fenW);const m=uciPlay(g,eW.pv[0]);if(m)rep=numSan(fenW,m.san)}
  let kind,txt,seq=[];
  if(eW.mate!=null&&eW.mate>0){kind="bad";seq=eW.pv.slice(0,4);txt=`Darum nicht: ${th} setzt danach ${eW.mate===1?"sofort":`in ${eW.mate} Zügen`} matt${rep?` – los geht es mit ${rep}`:""}.`}
  else if(d<70&&cW>-75){kind="ok";txt=`${wTxt} ist auch spielbar (Stockfish ${fmtEv(eW.cp)}), steht hier aber nicht im Buch.`}
  else if(d<150){kind="meh";seq=eW.pv.slice(0,2);txt=`${wTxt} ist ungenau: Stockfish sieht ${fmtEv(eW.cp)} statt ${fmtEv(eB?eB.cp:eW.cp)}${rep?`, stark ist die Antwort ${rep}`:""}.`}
  else{kind="bad";const ls=whyLoss(fen0,fenW,eW.pv||[],me);seq=ls.seq.length?ls.seq:eW.pv.slice(0,2);txt=`Darum nicht: ${rep?`Auf ${wTxt} folgt ${rep} – `:""}${ls.txt||`${th} steht danach klar besser (${fmtEv(eW.cp)})`}.`}
  const sub=txt+" "+(curStatus[1]===title?tail:"Spiel jetzt den markierten Zug.");
  setStatus(curStatus[0],curStatus[1],sub);{const cc=crsSess();vcSay(txt,cc?coIdOf(cc):"mila")}
  whyCur={tok,view:v0,fen:fen0,san:r.san,seq,kind};
  const b=$("whyBtn");b.hidden=!(kind!=="ok"&&seq.length);b.textContent=kind==="bad"?"Zeigen, warum":"Antwort zeigen";
}
/* Widerlegung kurz auf dem Brett vorspielen, danach zurück zur Trainingsstellung */
function whyStop(){whyT.forEach(clearTimeout);whyT=[];if(whyKeep){shown=whyKeep;whyKeep=null;badge=null;lock=false;return true}return false}
function whyShow(){
  const W=whyCur;if(!W||W.tok!==whyTok||mode!=="train"||lock||busy||view!==W.view||!live())return;
  cancelAuto();whyKeep=shown;lock=true;const g=new Chess(W.fen),bad=[];const r1=g.move(W.san);if(!r1){whyStop();return}bad.push(r1.from,r1.to);
  const step=(res,i)=>{shown=new Chess(g.fen());badge=i===0?{ply:-1,sq:res.to,type:"no"}:null;render({fwd:res},{bad});
    if(i>0)ideasEl.innerHTML+=arrowPath(res.from,res.to,i%2?"rgba(229,72,77,.88)":"rgba(255,255,255,.62)",.16)};
  step(r1,0);const gap=calmNow()?900:800;let t=0;
  W.seq.forEach((u,i)=>{t+=gap;whyT.push(setTimeout(()=>{const m=uciPlay(g,u);if(m)step(m,i+1)},t))});
  whyT.push(setTimeout(()=>{if(whyStop())render()},t+1800));
}
$("whyBtn").onclick=whyShow;
/* ---- Schlüsselzüge (keymoves.js): echte Erklärungen zu den wichtigsten Momenten, im Ton des Trainers ---- */
let KMAP=null;
function keyWhy(n){
  if(startFen||n<1||n>hist.length)return null;
  if(!KMAP){KMAP=new Map();if(typeof KEYMOVES!=="undefined")for(const [q,t] of KEYMOVES)KMAP.set(q.split(" ").map(strip).join(" "),t)}
  return KMAP.get(hist.slice(0,n).map(strip).join(" "))||null;
}
function kmPaint(){
  const el=$("kmSay");if(!el)return;
  const on=view>0&&!!op&&!op.endId&&(mode==="train"||(mode==="replay"&&game&&!game.review&&!game.free));
  /* Am aktuellen Stand: der eigene Zug und die sofortige Antwort des Buchs gemeinsam, sonst nur der gezeigte Zug */
  const ns=on?(live()&&mode==="train"&&view>1&&flags[view-2]==="u"?[view-1,view]:[view]).filter(n=>keyWhy(n)):[];
  if(!ns.length){if(!el.hidden){el.hidden=true;el.dataset.k=""}return}
  const c=mode==="train"?crsSess():null,co=c?coIdOf(c):"mila",k=co+"|"+ns.join(",")+"|"+hist.slice(0,view).join(" ");if(el.dataset.k===k&&!el.hidden)return;el.dataset.k=k;
  const L=(typeof KM_LEAD!=="undefined"&&KM_LEAD[co])||["Merk dir:"],lead=L[(view+hist[view-1].length)%L.length];
  el.innerHTML=`<span class="km-h"><span class="km-k" aria-hidden="true">${crsIcon("key",12)}</span>${ns.length>1?"Schlüsselzüge":"Schlüsselzug"} · ${esc(TRAINER[co].nick)}</span>`+
    ns.map((n,i)=>`<span class="km-i"><b class="km-m">${esc(numSan(fens[n-1],hist[n-1]))}</b> ${i===0?`<em>${esc(lead)}</em> `:""}${esc(keyWhy(n))}</span>`).join("");
  el.hidden=false;
  if(live()&&S.set.voice){const kk=n=>n+"|"+hist.slice(0,n).join(" "),nw=ns.filter(n=>!VC.km.has(kk(n)));if(nw.length){const txt=lead+" "+nw.map(n=>keyWhy(n)).join(" "),keys=nw.map(kk);setTimeout(()=>vcSpeak(txt,co,"km",false,keys),0)}}
}
/* ================= Eigene Notizen an Stellungen =================
   Eine Notiz hängt an der Stellung (Brett, Zugrecht, Rochaderechte), nicht an der Zugfolge – sie erscheint also auch nach einer Zugumstellung.
   Im Training ist sie verdeckt, solange du in dieser Stellung selbst am Zug bist: Antippen deckt sie auf, sonst bliebe vom Abrufen nichts übrig. */
const memoKey=fen=>fen.split(" ").slice(0,3).join(" ");
const memoAt=fen=>fen?S.memo[memoKey(fen)]||null:null;
const memoOpen=new Set();
function memoAllowed(){if(!shown||!op)return false;if(mode==="online")return !!(ON.g&&ON.g.status==="over");return ["train","replay","edit","engine"].indexOf(mode)>=0}
const PIN_IC='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.5 2.5 21.5 9.5 19.4 10.9 16.6 13.7 17 18.5 15.6 19.9 11.4 15.7 5.4 21.7 4.3 21.7 4.3 20.6 10.3 14.6 6.1 10.4 7.5 9 12.3 9.4 15.1 6.6Z"/></svg>';
function memoPaint(){
  const el=$("memoBox");if(!el)return;
  const fen=memoAllowed()?shown.fen():null,m=memoAt(fen);
  if(!m){if(!el.hidden){el.hidden=true;el.innerHTML="";el.dataset.k=""}return}
  const key=memoKey(fen),cover=mode==="train"&&!done&&!learn&&!xpl&&live()&&userTurnShown()&&!memoOpen.has(key);
  const k=key+"|"+cover+"|"+m.d+"|"+m.t.length;if(el.dataset.k===k&&!el.hidden)return;el.dataset.k=k;
  el.className="memo"+(cover?" cover":"");
  el.innerHTML=cover?`<button class="memo-rev" type="button"><span class="memo-pin">${PIN_IC}</span><span><b>Deine Notiz zu dieser Stellung</b><small>Antippen zum Aufdecken – erst überlegen, dann lesen.</small></span></button>`
    :`<span class="memo-pin">${PIN_IC}</span><div class="memo-c"><b class="memo-h">Deine Notiz</b><p>${esc(m.t)}</p></div><button class="memo-ed" type="button" aria-label="Notiz bearbeiten">${NI.edit||"✎"}</button>`;
  const rv=el.querySelector(".memo-rev");if(rv)rv.onclick=()=>{memoOpen.add(key);el.dataset.k="";memoPaint()};
  const ed=el.querySelector(".memo-ed");if(ed)ed.onclick=()=>memoEdit();
  el.hidden=false;
}
function memoEdit(){
  if(!memoAllowed()){toast(mode==="online"?"Während einer laufenden Online-Partie sind Notizen aus – fair bleiben!":"Notizen gibt es in Training, Analyse und Partien gegen den Computer.");return}
  const fen=shown.fen(),key=memoKey(fen),m=S.memo[key];
  const seq=!startFen&&view<=hist.length?hist.slice(0,view):null,last=view>0&&live()?mvs[view-1]:null;
  const ov=document.createElement("div");ov.className="onb";
  ov.innerHTML=`<div class="onb-box memo-dlg" role="dialog" aria-modal="true" aria-label="Notiz zu dieser Stellung"><h2>Notiz zu dieser Stellung</h2>
    <p class="hint">${seq&&seq.length?esc(fmtMoves(seq,0)):"Ausgangsstellung"}${op&&op.name&&!/^__/.test(op.id||"")?" · "+esc(op.name):""}</p>
    <div class="memo-bd"></div>
    <label class="fld">Was willst du dir hier merken?<textarea id="memoTxt" maxlength="280" rows="3" placeholder="z. B. Max spielt hier immer Lb4 – dann erst h6.">${esc(m?m.t:"")}</textarea></label>
    <small class="memo-cnt" id="memoCnt"></small>
    <div class="btnrow onb-act">${m?'<button class="btn red" data-del>Löschen</button>':""}<button class="btn" data-x>Abbrechen</button><button class="btn grn" data-ok>Speichern</button></div></div>`;
  document.body.appendChild(ov);
  ov.querySelector(".memo-bd").appendChild(staticBoard(fen,orient(),last));
  const ta=ov.querySelector("#memoTxt"),cnt=ov.querySelector("#memoCnt");const upd=()=>{cnt.textContent=ta.value.length+" / 280"};upd();ta.oninput=upd;setTimeout(()=>ta.focus(),60);
  const close=()=>{ov.remove();document.removeEventListener("keydown",esc_)};const esc_=e=>{if(e.key==="Escape")close()};document.addEventListener("keydown",esc_);
  ov.onclick=e=>{if(e.target===ov)close()};ov.querySelector("[data-x]").onclick=close;
  ov.querySelector("[data-ok]").onclick=()=>{const t=ta.value.trim().slice(0,280);
    if(!t){if(m){delete S.memo[key];save("memo");toast("Notiz gelöscht")}close();memoPaint();return}
    S.memo[key]={t,d:Date.now(),h:seq?seq.join(" "):"",f:fen,o:op&&!/^__/.test(op.id||"")?op.id:"",n:op&&!/^__/.test(op.id||"")?op.name:"",s:orient()};
    memoOpen.add(key);save("memo");close();memoPaint();toast(m?"Notiz geändert":"Notiz gespeichert – sie erscheint, sobald diese Stellung wieder auftaucht.")};
  const del=ov.querySelector("[data-del]");if(del)del.onclick=()=>{delete S.memo[key];save("memo");close();memoPaint();toast("Notiz gelöscht")};
}
let xpl=null,pickWait=false;
function finish(){
  if(learn){done=true;stopBlitz();const i=target;learn=false;if(badge&&badge.ply===hist.length)badge.type="ok";
    setStatus("done","Gelernt: "+op.lines[i].n,"Jetzt ohne Hilfe: Gleich spielst du die Variante noch einmal aus dem Gedächtnis.");crsOnFinish(true,true);setTimeout(()=>sfx("done"),180);render();renderChrome();
    clearTimeout(learnNext);if(sess&&sess.plan){crsAskExplain(i);return}learnNext=setTimeout(()=>startLearnTest(i),S.set.calm?600:1800);return}
  done=true;stopBlitz();const i=target;const k=lk(op.id,i);const clean=mistakes===0&&!usedHelp;const firstClean=clean&&P(op.id,i)<2;
  S.prog[op.id]=S.prog[op.id]||{};S.prog[op.id][i]=Math.max(P(op.id,i),clean?2:1);save("prog");
  srsReview(k,clean?5:mistakes<=1?3:1);
  const s=opStat(op.id);s.att++;if(clean)s.clean++;st.days[today()]=(st.days[today()]||0)+1;gain("line",{clean,first:firstClean});
  if(clean&&sess&&sess.blitz)st.blitz++;if(clean&&blindOn&&!peeked)st.blind++;saveStats();
  if(badge&&badge.ply===hist.length)badge.type="ok";
  if(sess){sess.res.push({k,clean,i:sess.idx});if(sess.type==="daily"){markDailyDone(k);const qk=sess.queue[sess.idx];if(qk&&qk!==k)markDailyDone(qk)}}else markDailyDone(k);
  const nxt=S.srs[k]?Math.round((S.srs[k].due-startOfDay(Date.now()))/DAY):1;
  setStatus("done","Variante geschafft: "+op.lines[i].n,(clean?"Fehlerfrei gespielt.":`Mit ${mistakes} ${mistakes===1?"Fehler":"Fehlern"} – sie kommt bald wieder.`)+` Nächste Wiederholung in ${nxt} ${nxt===1?"Tag":"Tagen"}.`);
  crsOnFinish(clean,false,k);
  setTimeout(()=>sfx("done"),180);
  if(forced===i&&!sess)forced=null;
  render();renderChrome();renderList();renderTabbar();checkBadges();
  if(firstClean)confetti();
  scheduleAuto(sess?(sess.plan&&clean?5000:1500):2600);
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
  if(drill&&drill.info&&drill.info.mine&&clean){const pz=S.puz.find(p=>p.key===drill.info.key);if(pz){pz.solved=(pz.solved||0)+1;save("puz")}gain("puz")}
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
    done=true;const clean=mistakes===0&&!usedHelp;if(clean&&!puz.onResult){st.puzOk++;if(puz.key)gain("puz")}saveStats();
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
  const [id,i]=pk(k);selectOpening(byId(id),i,true);crsOnItem();
}
function sessNext(){
  if(sess.next){sess.next();return}
  if(sess.plan){const r=sess.res[sess.res.length-1],ro=sess.roles[sess.idx];
    if(r&&r.i===sess.idx&&!r.clean&&ro!=="new"){sess.rq[r.k]=(sess.rq[r.k]||0)+1;if(sess.rq[r.k]<=2){sess.queue.push(r.k);sess.roles.push("relearn")}}}
  sess.idx++;
  if(sess.idx>=sess.queue.length){
    const ok=sess.res.filter(r=>r.clean).length,n=sess.res.length,t=sess.title;const cc=crsSess(),cs=sess;sess=null;blindOn=false;applyBlind();renderChrome();
    if(n&&ok===n)confetti();
    setStatus("done",t+" abgeschlossen",`${ok} von ${n} fehlerfrei. ${dueKeys().length?dueKeys().length+" Varianten sind noch fällig.":"Für heute ist alles wiederholt."}`);
    crsOnEnd(cc,cs,ok,n);renderTabbar();return;
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
function applyBlind(){document.body.classList.toggle("blind",!!blindOn&&$("v-train")&&!$("v-train").hidden);$("blindBtn").setAttribute("aria-pressed",String(!!blindOn));$("blindBtn").hidden=!(blindOn||(sess&&sess.blind))}
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
  const hi=op.playOn?(op.playOn.course?"du":"on"):"hi";
  const G=op.playOn&&op.playOn.goal;
  if(G){botQuip=`Ziel: ${G.t}. ${ptStatus(G,[])}.`;vcSay(`Planaufgabe: ${G.t}`,op.botCo);const po=op.playOn;if(po.e0==null)whyEval(fens[hist.length]).then(e=>{if(po.e0==null)po.e0=e.cp*(op.side==="w"?1:-1)}).catch(()=>{})}
  if(shown.turn()!==op.side){if(op.botCo&&!G)botQuip=botSay(hi);sfThink()}else setStatus("sf",G?"Planaufgabe: "+G.t:"Du bist am Zug",G?`${G.d} ${ptStatus(G,[])}.`:op.botCo?botSay(hi):`${sfName} (Stufe ${S.set.sf}). Setze den Plan um!`);
}
async function sfThink(){
  const tok=sfToken;busy=true;renderBars();renderChrome();setStatus("sf",`${botNick()} denkt …`,botQuip||"");botQuip="";
  const fen=fens[hist.length];const styled=op&&op.bot&&op.botStyle&&op.botStyle!=="bal";const r=await sfRun(fen,{skill:S.set.sf,ms:250+S.set.sf*45,multi:styled?4:1});if(styled)r.best=botPick(fen,r)||r.best;
  if(tok!==sfToken||mode!=="engine")return;busy=false;
  if(!r.best||r.best==="(none)"){gameOverCheck();return}
  const g=new Chess(fen);const mv=g.moves({verbose:true}).find(m=>m.from===r.best.slice(0,2)&&m.to===r.best.slice(2,4)&&(!m.promotion||m.promotion===(r.best[4]||"q")));
  if(!mv)return;
  const cp=cpOf(r.score,g.turn());sfEval=r.score&&r.score.t==="mate"?("Matt in "+Math.abs(r.score.v)):fmtEval(cp);evalCp=cp;
  const wasLive=live();const res=commit(mv,"e");
  if(wasLive){view=hist.length;shown=new Chess(fens[view]);render({fwd:res});playSound(res)}else render();
  if(gameOverCheck())return;
  const chk=/[+#]/.test(res.san);if(op.botCo){botMood=chk?"wow":res.captured?"happy":"neutral";renderChrome()}
  const G=op.playOn&&op.playOn.goal;
  setStatus("sf",G?"Planaufgabe: "+G.t:"Du bist am Zug",`${botNick()} spielte ${de(res.san)}.${op.botCo&&(chk||res.captured)?" "+botSay(chk?"chk":"cap"):""}${G?" "+ptStatus(G,mvs.slice(sfStart).filter(m=>m.color===op.side))+".":""}`);
}
function engineUserMove(mv,animate){const r=commit(mv,"p");if(op&&op.botCo){botMood=r.captured?"worry":/[+#]/.test(r.san)?"wow":"think";botQuip=r.captured?botSay("ouch"):""}view=hist.length;shown=new Chess(fens[view]);sel=null;render(animate?{fwd:r}:null);playSound(r);if(gameOverCheck())return;if(ptAfterMove())return;sfThink()}
function gameOverCheck(){
  const g=new Chess(fens[hist.length]);if(!g.game_over())return false;
  let t,s;
  let res,why;
  if(g.in_checkmate()){const winner=g.turn()==="w"?"b":"w";res=winner===op.side?"win":"loss";why="Schachmatt";t=res==="win"?"Matt – du hast gewonnen!":`Matt – ${op.botCo?botNick():"Stockfish"} gewinnt`;s=res==="win"?"Stark gespielt! Mit »Partie analysieren« siehst du deine besten Züge.":"Mit »Partie analysieren« siehst du, wo es kippte."}
  else{res="draw";why=g.in_stalemate()?"Patt":g.insufficient_material()?"zu wenig Material":g.in_threefold_repetition()?"Stellungswiederholung":"50-Züge-Regel";t="Remis";s=why+". Mit »Partie analysieren« siehst du die Bewertung jedes Zugs."}
  if(op.endId){st.ends[op.endId]=true;saveStats()}
  {const G=op.playOn&&op.playOn.goal;if(G){const n=mvs.slice(sfStart).filter(m=>m.color===op.side).length;ptLock++;busy=false;ptFinish(G,res==="win",n,null,res==="win"?null:`${why}. Damit ist die Planaufgabe vorbei.`,res==="win");return true}}
  if(op.botCo){botMood=res==="win"?"worry":res==="draw"?"think":"joy";renderChrome();if(res!=="draw")s=botSay(res==="win"?"lose":"win")+" "+s}
  endEngine(res,why);setStatus(res==="win"?"done":res==="draw"?"view":"bad",t,s);return true;
}
let sfEnd=null;
function endEngine(res,why){if(mode!=="engine")return;sfEnd={res:res||"loss",why:why||"Aufgabe",id:"sf-"+Date.now(),n:hist.length};const isGoal=!!(op.playOn&&op.playOn.goal);if(!isGoal&&hist.length-sfStart>=4)gain("game",{id:sfEnd.id,src:op.bot?"bot":op.endId?"end":"sf",res:sfEnd.res,color:op.side,n:hist.length,fam:op.endId?"Endspiel":op.bot?(/^Partie gegen/.test(op.name)?famOfMoves(hist):op.name.split(" gegen ")[0]):op.name,opp:op.botName||"Stockfish",moves:hist.slice(),term:sfEnd.why});if(!isGoal&&hist.length-sfStart>=8){st.engine++;saveStats();checkBadges()}if(op.endId){st.ends[op.endId]=true;saveStats();checkBadges()}if(op.playOn&&op.playOn.course)crsDuelResult(op.playOn,sfEnd.res);sfToken++;busy=false;mode="train";done=true;renderChrome();render()}
function stopEngine(){if(mode==="engine"){sfToken++;busy=false;try{sfW&&sfW.postMessage("stop")}catch(e){}}}
$("sfBtn").onclick=()=>playOn();
$("sfStop").onclick=()=>{const b=$("sfStop");if(mode!=="engine")return;
  const gl=op.playOn&&op.playOn.goal?"Abbrechen":"Aufgeben";
  if(!b.dataset.sure){b.dataset.sure="1";b.textContent=gl==="Abbrechen"?"Wirklich abbrechen?":"Wirklich aufgeben?";clearTimeout(b._t);b._t=setTimeout(()=>{delete b.dataset.sure;b.textContent=gl},3000);return}
  delete b.dataset.sure;b.textContent=gl;clearTimeout(b._t);
  if(op.playOn&&op.playOn.goal){ptLock++;endEngine("loss","Abgebrochen");setStatus("view","Planaufgabe abgebrochen",`Mit »Nochmal versuchen« startest du sie neu. Tipp: ${op.playOn.goal.d}`);return}
  endEngine("loss","Aufgabe");setStatus("bad","Du hast aufgegeben",`${op.botCo?botNick():"Stockfish"} gewinnt. Mit »Partie analysieren« siehst du, wo es kippte.`)};
$("sfAna").onclick=()=>analyzeSfGame();
$("sfAgain").onclick=()=>{if(!sfEnd)return;if(op.endId){const e=ENDGAMES.find(x=>x.id===op.endId);if(e){startEndgame(e);return}}
  truncate(Math.min(sfStart,hist.length));view=hist.length;shown=new Chess(fens[view]);sfEnd=null;badge=null;startEngine()};
/* Beendete Stockfish-Partie (inkl. Eröffnung) im Game Review analysieren */
function analyzeSfGame(){
  if(!sfEnd)return;if(!sfEnd.n){toast("In dieser Partie wurde noch kein Zug gespielt.");return}const me=op.side,sfN=`${op.botName||sfName||"Stockfish"} (Stufe ${S.set.sf})`;
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
function openEditor(o){
  o=o||{};if(o.side)$("edSide").value=o.side;if(o.group!=null)$("edGroup").value=o.group;
  stopEngine();sess=null;mode="edit";game=null;drill=null;puz=null;flipped=false;
  op={id:"__edit",g:"c",side:$("edSide").value,name:"Eigene Variante",eco:"Editor",d:"Spiel beide Seiten und speichere die Folge als eigene Trainingsvariante.",plan:[],lines:[]};
  resetBoard();mode="edit";
  if(o.pre&&o.pre.length){for(const m of o.pre){const g=new Chess(fens[hist.length]);const mv=findMove(g,m);if(!mv)break;commit(mv,"p")}view=hist.length;shown=new Chess(fens[view])}
  showView("train");buildSquares();renderChrome();render();
  setStatus("turn",o.pre&&o.pre.length?"Neue Abzweigung":"Spiel eine Zugfolge ein",o.pre&&o.pre.length?`Ab ${fmtMoves(o.pre.slice(-2),o.pre.length-Math.min(2,o.pre.length))}: Spiel die neue Fortsetzung und speichere sie.`:"Ziehe für beide Seiten. Mit ← kannst du zurück und einen anderen Zug wählen.");
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
  if(mode==="online"){onlineStatus();return}
  if(mode==="train"&&xpl){xplStatus();return}
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
      <p>${esc(explain(fens[view-1],mv,view>1?mvs[view-2]:null).text)}</p>${(()=>{const kw=mode==="train"||mode==="replay"?keyWhy(view):null;return kw?`<p class="kmx"><b>Warum?</b> ${esc(kw)}</p>`:""})()}${note?`<p class="note">${esc(note)}</p>`:""}
      ${names.length?`<p class="leads">${names.length===1?"Variante":"Mögliche Varianten"}: ${esc(names.slice(0,4).join(" · "))}${names.length>4?" · +"+(names.length-4)+" weitere":""}</p>`:""}</div>`;
  }else{
    const txt=mode==="replay"?"Spiel die Partie mit → nach. Zu jedem Zug erscheint hier eine Erklärung.":mode==="edit"?"Spiel eine Zugfolge für beide Seiten ein.":mode==="puzzle"?"Finde den besten Zug.":(op.side==="w"?"Du spielst Weiß.":"Du spielst Schwarz.")+" Zu jedem Zug erscheint hier eine Erklärung.";
    html+=`<div class="excard"><div class="exh"><span>${startFen?"Ausgangsstellung":"Startstellung"}</span></div><p>${esc(txt)}</p></div>`;
  }
  if(mode==="replay"&&game&&game.free){
    html=engineLinesHtml()+theoryHtml()+html;
  }else if(mode==="replay"&&game){
    html+=theoryHtml(true)+engineLinesHtml();
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
  if(mode==="online"&&ON.g&&ON.g.status!=="over"){el.innerHTML='<div class="excard"><p>Während einer laufenden Online-Partie ist die Datenbank aus – fair bleiben! Nach der Partie ist sie wieder da.</p></div>';dbKey="";dbTok++;return}
  const key=(op?op.id:"")+"|"+h.join(" ");if(!force&&key===dbKey)return;dbKey=key;const tok=++dbTok;
  const myRows=myTreeAt(h);
  const bk=op&&op.lines&&op.lines.length?bookMoves(h):[];
  el.innerHTML=`<div class="excard"><div class="exh"><span>Lichess-Spieler (1600–2500)</span></div><div id="dbL">${SKEL}</div></div><div class="excard"><div class="exh"><span>Meisterpartien</span></div><div id="dbM">${SKEL}</div></div>${myRows}`;
  const rowsHtml=d=>d.moves.length?d.moves.map(m=>`<div class="dbrow${bk.indexOf(strip(m.san))>=0?" book":""}" data-san="${esc(m.san)}"><b>${esc(de(m.san))}</b><small>${fmtN(m.white+m.draws+m.black)}</small>${dbBar(m)}</div>`).join(""):'<p class="sub">Keine Partien in dieser Stellung.</p>';
  const err=e=>String(e&&e.message)==="auth"?`<p class="sub">Lichess verlangt für die Datenbank eine Anmeldung. Trag unter Profil → Einstellungen einen kostenlosen Lichess-Token ein.</p>`:`<p class="sub">Die Lichess-Datenbank ist gerade nicht erreichbar.</p>`;
  explorer("lichess",h).then(d=>{if(tok!==dbTok||!$("dbL"))return;$("dbL").innerHTML=rowsHtml(d)+`<p class="leads">${fmtN(d.white+d.draws+d.black)} Partien · ● = Buchzug im Trainer</p>`;wireDbRows()}).catch(e=>{if(tok===dbTok&&$("dbL"))$("dbL").innerHTML=err(e)});
  explorer("masters",h).then(d=>{if(tok!==dbTok||!$("dbM"))return;$("dbM").innerHTML=rowsHtml(d)+(d.topGames&&d.topGames.length?`<div class="exh" style="margin-top:8px"><span>Top-Partien</span></div>`+d.topGames.map(g=>`<div class="mgame" data-mid="${esc(g.id)}" data-t="${esc(g.white.name+" – "+g.black.name)}" data-y="${esc(g.year||"")}"><span>${esc(g.white.name)} (${g.white.rating}) – ${esc(g.black.name)} (${g.black.rating})</span><small>${g.winner==="white"?"1–0":g.winner==="black"?"0–1":"½–½"} · ${esc(g.year||"")}</small></div>`).join(""):"");wireDbRows();
    $("dbM").querySelectorAll("[data-mid]").forEach(x=>x.onclick=()=>loadMasterGame(x.dataset.mid,x.dataset.t,x.dataset.y,h.length))}).catch(e=>{if(tok===dbTok&&$("dbM"))$("dbM").innerHTML=err(e)});
}
function wireDbRows(){$("tabDb").querySelectorAll("[data-san]").forEach(x=>x.onclick=()=>{if(mode==="replay"||mode==="edit"||(mode==="train"&&!done&&userTurnShown())){const mv=findMove(shown,x.dataset.san);if(mv&&!tryMove(mv.from,mv.to,true,mv.promotion))toast("Dieser Zug ist hier nicht spielbar.")}else toast("Zum Ausprobieren eignet sich der Editor unter Training → Eigene Variante.")})}
async function loadMasterGame(id,title,year,ply){
  try{const r=await fetch("https://explorer.lichess.ovh/masters/pgn/"+id);if(!r.ok)throw 0;const pgn=await r.text();
    openGame({title:title,players:title,year:year,moves:pgnMoves(pgn,400),d:`Meisterpartie aus der Lichess-Datenbank (${pgnHeader(pgn,"Event")}).`,url:"https://lichess.org/"+id,ops:[op&&op.id],startView:ply})}
  catch(e){toast("Die Partie konnte nicht geladen werden.")}
}

/* ================= Rendering Brett ================= */
function setStatus(k,t,s,noStore){
  curStatus=[k,t,s];if(!noStore&&live())liveStatus=null;$("whyBtn").hidden=true;
  $("coach").style.removeProperty("--k");$("face").style.background="";
  $("coach").dataset.k=k;$("stTitle").textContent=t;$("stText").textContent=s||"";
  const cc=mode==="train"?crsSess():null,mood=k==="bad"?"worry":k==="done"?"joy":k==="good"?"happy":k==="view"?"think":"neutral";
  if(cc)coachPaint(cc,mood);
  else{coachClear();const bot=(mode==="engine"||sfEnd)&&op&&op.botCo;facePaint(bot?op.botCo:"mila",bot?botMood:mood)}
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
function hintMove(){if((mode!=="train"&&mode!=="puzzle")||!hintLvl||lock||busy||!userTurnShown())return null;const lm=learn&&mode==="train"&&target!==null&&live()&&op.lines[target]&&op.lines[target].m[view];const b=lm?[strip(lm)]:expected();return b.length?findMove(shown,b[0]):null}
function startLearnTest(i){clearTimeout(learnNext);learnNext=null;if(mode==="train"&&curView==="train"&&done&&target===i){forced=i;startTrain(true);setStatus("turn","Prüfung: "+op.lines[i].n,shown.turn()===op.side?"Spiel die Variante ohne Hilfe.":"Das Buch beginnt – spiel die Variante ohne Hilfe.")}}
$("lmLearn").onclick=()=>{if(learn||target===null)return;forced=target;startTrain(false,true)};
$("lmTest").onclick=()=>{if(!learn||target===null)return;forced=target;startTrain(true);setStatus("turn","Prüfung: "+op.lines[target].n,"Spiel die Variante ohne Hilfe.")};
function learnTxt(){const m=target!==null&&op.lines[target]&&op.lines[target].m[hist.length];if(!m)return "";const mv=findMove(shown,m);return mv?`Spiel ${de(mv.san)}: ${explain(shown.fen(),mv,hist.length?mvs[hist.length-1]:null).text}`:""}
function arrowPath(from,to,color,w){
  const a=xy(from),b=xy(to);const ax=a.x+.5,ay=a.y+.5,bx=b.x+.5,by=b.y+.5;
  const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy);if(!L)return "";const ux=dx/L,uy=dy/L,hl=.42,hw=w*1.5,sw=w;
  const ex=bx-ux*hl,ey=by-uy*hl,px=-uy,py=ux,sx=ax+ux*.28,sy=ay+uy*.28;
  return `<path d="M${sx-px*sw/2} ${sy-py*sw/2} L${ex-px*sw/2} ${ey-py*sw/2} L${ex-px*hw} ${ey-py*hw} L${bx} ${by} L${ex+px*hw} ${ey+py*hw} L${ex+px*sw/2} ${ey+py*sw/2} L${sx+px*sw/2} ${sy+py*sw/2}Z" fill="${color}"/>`;
}
function canMoveNow(){
  if(lock||busy)return false;
  if(mode==="train"&&(xpl||(pickWait&&live())))return false;
  if(mode==="train")return !(done&&live())&&userTurnShown()&&!(drill&&!live());
  if(mode==="puzzle")return !done&&live()&&userTurnShown();
  if(mode==="engine")return live()&&shown.turn()===op.side;
  if(mode==="edit")return true;
  if(mode==="replay")return !!game;
  if(mode==="online")return onCanMove()||onCanPremove();
  if(mode==="guess")return live()&&!!guess&&!done&&shown.turn()===guess.side;
  return false;
}
const ownPiece=p=>p&&(mode==="edit"||mode==="replay"?p.color===shown.turn():mode==="online"?p.color===ON.color:p.color===op.side);
function updateEvalBar(){
  const bar=$("evalBar");const R=game&&game.review;
  const onlineLive=mode==="online"&&ON.g&&ON.g.status!=="over";
  const on=(S.set.evalbar&&!onlineLive)||mode==="engine"||(mode==="replay"&&(R||(game&&game.free)));
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
  lastIdeas=ideas;ideasEl.innerHTML=ideas+engArrow();
  renderMarks();
  badgesEl.innerHTML="";
  let bdg=badge&&(badge.ply===view||badge.ply===-1)?badge:null;
  if(!bdg&&R&&view>0&&inMainMove(view-1)&&R.cls[view-1])bdg={sq:mvs[view-1].to,type:"rv-"+R.cls[view-1]};
  if(bdg){const p=xy(bdg.sq);const b=document.createElement("div");
    if(bdg.type.indexOf("rv-")===0){const c=CLS[bdg.type.slice(3)];b.className="badge cls "+c[1];b.textContent=c[2];b.style.fontSize="calc(var(--s)*.2)"}else{b.className="badge "+bdg.type;b.innerHTML=ICON[bdg.type]}
    b.style.left=((p.x+1)*12.5)+"%";b.style.top=(p.y*12.5)+"%";badgesEl.appendChild(b)}
  drawGhosts();
  renderMoves();renderVars();renderBars();renderExplain();updateEvalBar();if(tab==="db")renderDb();applyBlind();kmPaint();memoPaint();planPaint();
  const canAct=(mode==="train"||mode==="puzzle")&&!done&&!busy&&!lock&&userTurnShown()&&!op.endId&&!(mode==="train"&&(xpl||(pickWait&&live())));
  $("hintBtn").disabled=$("showBtn").disabled=!canAct;$("backBtn").disabled=!(mode==="train"&&!drill&&!lock&&!op.endId&&flags.indexOf("u")>=0);renderMaterial();$("restartBtn").disabled=mode==="puzzle"&&!done;
  $("navFirst").disabled=$("navPrev").disabled=view===0;
  $("navNext").disabled=$("navLast").disabled=live();
  $("actsDone").hidden=!!sfEnd||!(mode==="train"&&done&&!op.endId&&((target!==null&&op.lines&&op.lines.length)||drill));
  if(!$("actsDone").hidden){const co=playOnCo(),b=$("sfBtn");if(b.dataset.co!==co){b.dataset.co=co;b.innerHTML=`<span class="btn-av co-${co}" aria-hidden="true">${coachSvg(co,"happy")}</span><span class="btn-l">Gegen ${esc(TRAINER[co].nick)} weiterspielen</span>`;b.title=`Spiel die Stellung gegen ${TRAINER[co].full} zu Ende (Stufe ${S.set.sf})`}}
  if(xpl&&mode==="train")$("actsDone").hidden=true;
  $("actsTrain").hidden=!(mode==="train"||mode==="puzzle")||($("actsDone").hidden===false)||!!op.endId||!!sfEnd||!!(xpl&&mode==="train");
  $("actsXpl").hidden=!(xpl&&mode==="train");if(xpl){$("xBack").disabled=view===0}
  $("actsSfEnd").hidden=!(sfEnd&&mode==="train");if(sfEnd){const gl=op&&op.playOn&&op.playOn.goal?"Nochmal versuchen":"Revanche";if($("sfAgain").textContent!==gl)$("sfAgain").textContent=gl}
  $("sfUndo").disabled=busy||hist.length<=sfStart;
  $("moveInput").disabled=false;updateRevActs();
  const lmOk=mode==="train"&&!drill&&!op.endId&&op.lines&&op.lines.length&&target!==null&&!(sess&&(sess.blitz||sess.blind))&&!sfEnd&&!xpl;
  $("lmRow").hidden=!lmOk;if(lmOk){$("lmLearn").setAttribute("aria-pressed",String(learn));$("lmTest").setAttribute("aria-pressed",String(!learn))}
}
function renderChrome(){
  const inSess=!!sess;$("sessBar").hidden=!inSess;
  {const cc=crsSess()||(op&&op.playOn&&op.playOn.course?COURSES.find(x=>x.id===op.playOn.course)||null:null),vt=$("v-train");vt.className=vt.className.replace(/\bth-\S+/g,"").replace(/\s+/g," ").trim();vt.classList.toggle("crs-on",!!cc);if(cc)vt.classList.add("th-"+cc.id);
   $("sessIc").hidden=!cc;$("sessRank").hidden=!cc;if(cc){const r=crsRank(cc);$("sessIc").innerHTML=rkB(cc,r.i,30,"on");$("sessRank").textContent=r.name;$("sessRank").title=`Rang ${r.i+1} von 6`}}
  if(inSess&&sess.next){$("sessTitle").textContent=sess.title;$("sessCount").textContent=sess.countText();$("sessProg").style.width=(sess.progress()*100)+"%"}
  else if(inSess){$("sessTitle").textContent=sess.title;$("sessCount").textContent=`${Math.min(sess.idx+1,sess.queue.length)}/${sess.queue.length}`;$("sessProg").style.width=(sess.idx/sess.queue.length*100)+"%"}
  if(inSess&&sess.plan){const ro=sess.roles[Math.min(sess.idx,sess.roles.length-1)];$("sessCount").textContent=`${PHASE[ro]?PHASE[ro].t:""} · ${Math.min(sess.idx+1,sess.queue.length)}/${sess.queue.length}`}
  $("actsSf").hidden=mode!=="engine";if(mode==="engine"){const b=$("sfStop"),gl=op&&op.playOn&&op.playOn.goal?"Abbrechen":"Aufgeben";if(!b.dataset.sure&&b.textContent!==gl)b.textContent=gl}$("editor").hidden=mode!=="edit";
  $("nextBtn").hidden=!((mode==="train"&&!op.endId&&op.id!=="__bot")||(mode==="puzzle"&&sess))||!!(sess&&sess.kind==="sprint");
  $("nextBtn").textContent=sess?(sess.next?"Nächste Aufgabe":sess.idx+1>=sess.queue.length?"Training abschließen":`Weiter (${sess.idx+2}/${sess.queue.length})`):"Nächste Variante";
  const eco=$("eco"),title=$("title"),desc=$("desc");
  if(mode==="replay"&&game){eco.textContent=(game.free?"Analyse":game.review?"Game Review":"Partie")+(game.year?" · "+game.year:"");title.textContent=game.title;desc.textContent=game.players||"";$("phIcon").innerHTML=ICON.crown}
  else if(mode==="edit"){eco.textContent="Editor";title.textContent="Eigene Variante";desc.textContent=op.d;$("phIcon").innerHTML=ICON.pen}
  else if(mode==="puzzle"){eco.textContent=op.eco;title.textContent=op.name;desc.textContent=op.d;$("phIcon").innerHTML=ICON.puzzle}
  else{eco.textContent=op.eco+" · Du spielst "+(op.side==="w"?"Weiß":"Schwarz")+(mode==="engine"?" · gegen "+(op.botCo?botNick():(sfName||"Stockfish")):"");title.textContent=op.name;desc.textContent=op.d;$("phIcon").innerHTML=op.endId?ICON.crown:ICON.bookL}
  const av=$("oppAv");if(!((mode==="engine"||sfEnd)&&op&&op.botCo))av.dataset.k="";
  if((mode==="engine"||sfEnd)&&op.botCo){const k=op.botCo+":"+botMood;if(av.dataset.k!==k){av.className="avatar sfav trav co-"+op.botCo;av.innerHTML=coachSvg(op.botCo,botMood);av.dataset.k=k}$("oppName").textContent=(op.botName||botNick())+" · Stufe "+S.set.sf}
  else if(mode==="engine"){av.className="avatar sfav";av.innerHTML=ICON.cpu;av.dataset.k="";$("oppName").textContent=(op.botName||sfName||"Stockfish")+" · Stufe "+S.set.sf}
  else if(mode==="replay"&&game){av.className="avatar bookav";av.innerHTML=ICON.crown}
  else if(mode==="edit"){av.className="avatar bookav";av.innerHTML=ICON.pen;$("oppName").textContent="Gegenseite"}
  else if(mode==="puzzle"){av.className="avatar bookav";av.innerHTML=ICON.puzzle;$("oppName").textContent="Gegner"}
  else if(mode==="guess"){av.className="avatar bookav";av.innerHTML=ICON.crown;$("oppName").textContent=op.guessName||"Gegner"}
  else if(sfEnd||op.endId){av.className="avatar sfav";av.innerHTML=ICON.cpu;$("oppName").textContent=(op.botName||sfName||"Stockfish")+" · Stufe "+S.set.sf}
  else{av.className="avatar bookav";av.innerHTML=ICON.bookL;$("oppName").textContent="Eröffnungsbuch"}
  if(mode==="replay"&&game){const pl=(game.players||" – ").split(" – ");const o=orient();$("youName").textContent=(o==="w"?pl[0]:pl[1])||"";$("oppName").textContent=(o==="w"?pl[1]:pl[0])||"";$("youTag").textContent="";$("oppTag").textContent=""}
  else{$("youName").textContent="Du";const ys=mode==="edit"?$("edSide").value:op.side;$("youTag").textContent=ys==="w"?"(Weiß)":"(Schwarz)";$("oppTag").textContent=ys==="w"?"(Schwarz)":"(Weiß)"}
  const d=dueKeys().length;$("footInfo").textContent=d?d+" fällig":"";
  if(mode==="online")onlineChrome();else $("actsOn").hidden=true;
}
function renderBars(){
  if(mode==="online"){onlineClocks();return}
  if(mode==="train"&&xpl){$("youClock").classList.remove("on");$("oppClock").classList.remove("on");$("youClock").textContent="Erkunden";$("oppClock").textContent="Buch";return}
  if(mode==="train"&&pickWait&&live()){$("youClock").classList.remove("on");$("oppClock").classList.add("on");$("youClock").textContent="Wartet";$("oppClock").textContent="Du wählst";return}
  const tm=shown.turn();const active=live()&&!done&&mode!=="replay";
  const yourTurn=active&&(mode==="edit"?true:tm===op.side);const oppTurn=active&&!yourTurn;
  $("youClock").classList.toggle("on",!!yourTurn);$("oppClock").classList.toggle("on",!!oppTurn);
  if(mode==="replay"){const t=game&&game.free?"Analyse":game&&game.review?"Review":"Partie";$("youClock").textContent=t;$("oppClock").textContent=t;return}
  if(mode==="edit"){$("youClock").textContent=(tm==="w"?"Weiß":"Schwarz")+" zieht";$("oppClock").textContent="Editor";return}
  $("youClock").textContent=done?"Fertig":yourTurn?"Am Zug":live()?"Wartet":"Ansicht";
  $("oppClock").textContent=mode==="guess"?"Meister":mode==="engine"?(busy?"Denkt …":op&&op.botCo?(done?"Fertig":"Wartet"):"Stockfish"):oppTurn?"Denkt …":mode==="puzzle"?"Rätsel":sfEnd||op.endId?(op.botCo?"Fertig":"Stockfish"):"Buch";
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
  /* Mit Zugbaum: häufigste Varianten oben, damit man bei vielen Varianten das Wichtige zuerst sieht */
  const pr=op.tw?op.lines.map((l,i)=>lineProb(op,i)):null;
  const order=op.lines.map((l,i)=>i);if(pr)order.sort((a,b)=>(pr[b]==null?0:pr[b])-(pr[a]==null?0:pr[a])||a-b);
  order.forEach(i=>{const l=op.lines[i];
    const row=document.createElement("div");row.className="varrow";
    const b=document.createElement("button");b.className="var"+(hist.length&&!c.has(i)&&mode==="train"?" out":"");b.setAttribute("aria-pressed",forced===i?"true":"false");
    const s=P(op.id,i);const due=isDue(lk(op.id,i));
    const lp=lineProb(op,i);
    b.innerHTML=`<span class="mk ${s===2?"clean":s===1?"seen":""}">${s?ICON.ok:""}</span><span class="vn"></span>${due?'<span class="due">fällig</span>':""}<span class="vp">${lp!=null?`<span title="So oft landet eine Partie in dieser Variante">≈ ${fmtPct(lp)}</span> · `:""}${Math.ceil(l.m.length/2)} Züge</span>`;
    b.querySelector(".vn").textContent=l.n;
    b.onclick=()=>{sess=null;drill=null;forced=i;target=i;mode="train";startTrain()};
    row.appendChild(b);
    if(op.g==="c"&&l.ci!=null){const d=document.createElement("button");d.className="vdel";d.textContent="Löschen";d.onclick=()=>{if(d.dataset.sure){const side=op.side;S.custom[side].splice(l.ci,1);save("custom");buildAll();renderList();const o=ALL.find(x=>x.g==="c"&&x.side===side);selectOpening(o||ALL[0])}else{d.dataset.sure="1";d.textContent="Sicher?"}};row.appendChild(d)}
    v.appendChild(row);
  });
}
function renderTree(){
  const root={kids:{},lines:[],pre:[]};
  op.lines.forEach((l,i)=>{let n=root;l.m.forEach((m,k)=>{const key=strip(m);n.kids[key]=n.kids[key]||{m,ply:k,kids:{},lines:[],pre:l.m.slice(0,k)};n=n.kids[key];n.lines.push(i)});n.end=(n.end||[]).concat(i)});
  const cls=idxs=>{const s=idxs.map(i=>P(op.id,i));return s.every(x=>x===2)?"ok":s.some(x=>x>0)?"half":""};
  const wOf=n=>twOf(op,n.pre,n.m);
  const sortK=ks=>ks.sort((a,b)=>(wOf(b)||0)-(wOf(a)||0));
  const node=(n,sib)=>{let seq=[n];while(Object.keys(seq[seq.length-1].kids).length===1&&!seq[seq.length-1].end){seq.push(Object.values(seq[seq.length-1].kids)[0])}
    const lastN=seq[seq.length-1];const label=fmtMoves(seq.map(s=>s.m),seq[0].ply);
    const kids=sortK(Object.values(lastN.kids));const w=sib>1?wOf(n):null;
    const pre=lastN.pre.concat(lastN.m).map(strip).join(" ");
    return `<li><span class="tnw"><button class="tn ${cls(lastN.lines)}" data-l="${lastN.lines[0]}">${w!=null?`<span class="tpct${w<.15?" lo":""}" title="So oft wird dieser Zug hier gespielt">${fmtPct(w)}</span>`:""}${esc(label)}${lastN.end?` <span class="ln">${esc(op.lines[lastN.end[0]].n)}</span>`:""}</button>${kids.length>1?`<button class="tx" data-x="${esc(pre)}" title="Ab hier am Brett erkunden" aria-label="Ab hier am Brett erkunden">${NI.target}</button>`:""}</span>${kids.length?`<ul>${kids.map(k=>node(k,kids.length)).join("")}</ul>`:""}</li>`};
  const top=sortK(Object.values(root.kids));
  $("tree").innerHTML=`<ul>${top.map(k=>node(k,top.length)).join("")}</ul><p class="leads" style="font-family:var(--font)">Grün: alles fehlerfrei, orange: angefangen. ${op.tw?"Die Prozentzahl zeigt, wie oft der Gegner diesen Zug an dieser Stelle spielt. ":""}Antippen übt die Variante, das Zielsymbol erkundet die Stellung am Brett.</p>`;
  $("tree").querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{sess=null;drill=null;forced=+b.dataset.l;target=forced;mode="train";startTrain()});
  $("tree").querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{const pre=b.dataset.x?b.dataset.x.split(" "):[];const c=consistentIn(op,pre);if(!c.length)return;startExplore(op.lines[c[0]].m.slice(0,pre.length))});
}

/* ---------------- Am Brett erkunden: alle Buchzüge als Schatten ---------------- */
const ghostOn=()=>mode==="train"&&!!op&&!!op.lines&&(!!xpl||(pickWait&&live()));
function ghostOpts(){
  if(!ghostOn())return [];
  const h=hist.slice(0,view);const c=consistentIn(op,h);const by=new Map();
  c.forEach(i=>{const m=op.lines[i].m[h.length];if(m&&!by.has(strip(m)))by.set(strip(m),m)});
  const opp=shown.turn()!==op.side;const arr=[...by.values()].map(san=>({san,w:twOf(op,h,san),opp}));
  if(arr.length>1){const known=arr.filter(a=>a.w!=null);if(known.length<arr.length){const lo=known.length?Math.min(...known.map(a=>a.w))/2:1/arr.length;arr.forEach(a=>{if(a.w==null)a.w=lo})}const s=arr.reduce((t,a)=>t+a.w,0);arr.forEach(a=>a.w=a.w/s)}
  else arr.forEach(a=>a.w=1);
  return arr.map(a=>Object.assign(a,{mv:findMove(shown,a.san)})).filter(a=>a.mv);
}
function ghostAt(sq){
  const o=ghostOpts();let c=o.filter(a=>a.mv.to===sq);
  if(!c.length){c=o.filter(a=>a.mv.from===sq);if(c.length>1)c=[]}
  return c.length?c.reduce((a,b)=>b.w>a.w?b:a).san:null;
}
function drawGhosts(){
  boardEl.classList.remove("picking");
  if(!ghostOn()||lock)return;const o=ghostOpts();if(!o.length)return;
  boardEl.classList.add("picking");const top=o.reduce((a,b)=>b.w>a.w?b:a);let svg="";
  [...o].sort((a,b)=>a.w-b.w).forEach(a=>{const m=a.mv;
    svg+=arrowPath(m.from,m.to,a.opp?`rgba(232,142,40,${(.4+.5*a.w).toFixed(2)})`:"rgba(70,140,235,.85)",a.opp?.07+.12*a.w:.16);
    const g=document.createElement("div");g.className="pc gh"+(a.opp?"":" me")+" "+m.color+(m.promotion||m.piece);g.style.transform=tf(m.to);pcsEl.appendChild(g);
    const p=xy(m.to);const ch=document.createElement("div");ch.className="gchip"+(a.opp?"":" me")+(a===top&&o.length>1?" top":"");
    ch.style.left=((p.x+1)*12.5)+"%";ch.style.top=(p.y*12.5)+"%";ch.textContent=a.opp?(o.length>1?fmtPct(a.w).replace(" ",""):"100%"):"Du";badgesEl.appendChild(ch)});
  ovl.insertAdjacentHTML("beforeend",svg);
}
function ghostPlay(san){
  if(xpl){
    if(view<hist.length)truncate(view);const mv=findMove(shown,san);if(!mv)return;
    const r=commit(mv,shown.turn()===op.side?"u":"b");view=hist.length;shown=new Chess(fens[view]);sel=null;badge=null;
    render({fwd:r});playSound(r);xplStatus();return;
  }
  if(pickWait&&live()){
    pickWait=false;const c=consistent(hist);const cand=c.filter(i=>strip(op.lines[i].m[hist.length]||"")===strip(san));if(!cand.length)return;
    const fresh=cand.filter(i=>P(op.id,i)<2);target=cand.indexOf(target)>=0?target:rnd(fresh.length?fresh:cand);playBook();renderChrome();
  }
}
function startExplore(pre){
  if(!op||!op.lines||!op.lines.length||op.endId||op.g==="c"&&!op.lines.length)return;
  stopEngine();sess=null;drill=null;game=null;puz=null;mode="train";forced=null;
  if(curView!=="train")showView("train");
  resetBoard();xpl={};target=null;
  (pre||[]).forEach(m=>{const g=new Chess(fens[hist.length]);const mv=findMove(g,m);if(mv)commit(mv,g.turn()===op.side?"u":"b")});
  view=hist.length;shown=new Chess(fens[view]);
  buildSquares();renderChrome();render();xplStatus();
}
function xplStatus(){
  if(!xpl)return;const o=ghostOpts();const opp=op.side==="w"?"Schwarz":"Weiß";
  const last=view?`Nach ${plyNo(view-1)}${de(hist[view-1])}: `:"";let t;
  if(!o.length)t=last+"Hier endet die Variante. Mit »Zurück« probierst du eine andere Abzweigung, oder du trainierst genau diese Variante.";
  else if(!o[0].opp)t=last+(o.length>1?`Dein Repertoire erlaubt ${o.length} Züge (blaue Schatten). Tippe einen an.`:`Dein Zug ist ${plyNo(view)}${de(o[0].mv.san)} (blauer Schatten). Tippe ihn an.`);
  else if(o.length>1)t=last+`${opp} hat ${o.length} Buchzüge. Die orangen Schatten zeigen sie${op.tw?", die Prozentzahl ist ihre Häufigkeit":""}. Tippe an, was du sehen willst.`;
  else t=last+`${opp} spielt hier ${plyNo(view)}${de(o[0].mv.san)}. Tippe den Schatten an.`;
  const c=consistentIn(op,hist.slice(0,view));const nm=c.length===1?op.lines[c[0]].n:op.name;
  setStatus("view","Erkunden: "+nm,t,true);
}
/* beste Variante zur gezeigten Stellung: die in der Praxis häufigste */
function bestLineAt(h){const c=consistentIn(op,h);if(!c.length)return null;return c.reduce((a,b)=>(lineProb(op,b)||0)>(lineProb(op,a)||0)?b:a)}
$("xBack").onclick=()=>{if(xpl&&view>0)setView(view-1)};
$("xTrain").onclick=()=>{if(!xpl)return;const i=bestLineAt(hist.slice(0,view));if(i===null)return;xpl=null;sess=null;forced=i;target=i;startTrain()};
$("xEnd").onclick=()=>{xpl=null;forced=null;startTrain()};
$("xplBtn").onclick=()=>startExplore([]);
$("themeMi").onclick=()=>{$("bMenu").hidden=true;$("moreBtn").setAttribute("aria-expanded","false");
  if(mode!=="train"||!op||!op.lines||!op.lines.length||op.g==="c"||op.endId||/^__/.test(op.id||"")){toast("Themenpartien gibt es für die Eröffnungen im Training.");return}
  const li=target!==null&&op.lines[target]?target:themeStem(op).length>=2?-1:0;ON.theme={id:op.id,li};ON.col=op.side;store.set("et-ontheme",ON.theme);store.set("et-oncol",ON.col);
  showView("online:play");toast(li>=0?`Themenpartie „${op.lines[li].n}“ – wähle Bedenkzeit und Gegner.`:`Themenpartie ${op.name} – wähle Bedenkzeit und Gegner.`);
  setTimeout(()=>{const el=$("onTheme");if(el)el.scrollIntoView({behavior:calmNow()?"auto":"smooth",block:"center"})},120)};
$("memoMi").onclick=()=>{$("bMenu").hidden=true;$("moreBtn").setAttribute("aria-expanded","false");memoEdit()};
$("xplMi").onclick=()=>{$("bMenu").hidden=true;$("moreBtn").setAttribute("aria-expanded","false");if(op&&op.lines&&op.lines.length&&!op.endId)startExplore(hist.slice(0,view).length&&consistentIn(op,hist.slice(0,view)).length?hist.slice(0,view):[]);else toast("Erkunden geht in einer Eröffnung mit Varianten.")};
function renderPickSeg(){$("poAuto").setAttribute("aria-pressed",String(!S.set.pickOpp));$("poPick").setAttribute("aria-pressed",String(!!S.set.pickOpp))}
$("poAuto").onclick=()=>{S.set.pickOpp=false;save("set");renderPickSeg();if(pickWait&&live()&&mode==="train"){pickWait=false;engineSoon()}};
$("poPick").onclick=()=>{S.set.pickOpp=true;save("set");renderPickSeg();if(mode==="train"&&busy&&live()&&!done&&shown.turn()!==op.side){clearTimeout(timer);busy=false;bookMove()}};
renderPickSeg();
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&xpl&&mode==="train"&&!$("v-train").hidden){e.preventDefault();$("xEnd").click()}});

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
  truncate(k);view=hist.length;shown=new Chess(fens[view]);done=false;sel=null;hintLvl=0;badge=null;liveStatus=null;target=tp?tp.i:pickTarget();
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
$("nextBtn").onclick=()=>{cancelAuto();if(learnNext&&done){startLearnTest(target);return}if(sess){if(!done&&!(mode==="puzzle"&&puz&&puz.reported)){toast("Löse die Aufgabe erst oder nutze »Lösung«.");return}sessNext()}else{forced=null;drill=null;startTrain()}};

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
  if(mode==="online"&&!onCanMove())return setPremove(from,to);
  const cands=shown.moves({verbose:true}).filter(m=>m.from===from&&m.to===to);
  if(!cands.length)return false;
  const go=mv=>{if(mode==="train")trainMove(mv,animate);else if(mode==="puzzle")puzzleMove(mv,animate);else if(mode==="engine")engineUserMove(mv,animate);else if(mode==="edit")editMove(mv,animate);else if(mode==="replay")anaMove(mv,animate);else if(mode==="online")onlineMove(mv,animate);else if(mode==="guess")guessMove(mv,animate)};
  if(cands.length>1){const pre=cands.find(m=>m.promotion===(promo||(S.set.autoQueen?"q":"")));if(pre){go(pre);return true}
    lock=true;pickPromotion(cands[0].color).then(p=>{lock=false;const mv=cands.find(m=>m.promotion===p);if(mv)go(mv);else render()});return true}
  go(cands[0]);return true;
}

/* ---------------- Zeiger, Pfeile ---------------- */
const marks={a:new Set(),c:new Set()};
function renderMarks(){let s="";if(mode==="online"&&ON.pre)s+=arrowPath(ON.pre.from,ON.pre.to,"rgba(110,140,255,.85)",.17);marks.c.forEach(q=>{const p=xy(q);s+=`<circle cx="${p.x+.5}" cy="${p.y+.5}" r=".44" fill="none" stroke="rgba(235,97,80,.85)" stroke-width=".07"/>`});marks.a.forEach(k=>{s+=arrowPath(k.slice(0,2),k.slice(2,4),"rgba(255,170,0,.8)",.16)});marksEl.innerHTML=s}
let drag=null,rStart=null,swipe=null,hovSq=null;
function setHov(n){if(n===hovSq)return;if(hovSq){const o=sqsEl.querySelector(`[data-sq="${hovSq}"]`);if(o)o.classList.remove("hov")}hovSq=n;if(n){const e=sqsEl.querySelector(`[data-sq="${n}"]`);if(e)e.classList.add("hov")}}
function sqFromEvent(e){const r=boardEl.getBoundingClientRect();return sqAtXY(Math.floor((e.clientX-r.left)/r.width*8),Math.floor((e.clientY-r.top)/r.height*8))}
boardEl.addEventListener("contextmenu",e=>e.preventDefault());
boardEl.addEventListener("pointerdown",e=>{
  if(!op)return;const name=sqFromEvent(e);if(!name)return;
  if(e.button===2){rStart=name;return}
  if(e.button>0)return;
  if(wrongRevert){wrongRevert();return}
  if(mode==="online"&&ON.pre){ON.pre=null;sel=null;render();return}
  if(marks.a.size||marks.c.size){marks.a.clear();marks.c.clear();renderMarks()}
  const startSwipe=()=>{swipe={x:e.clientX,y:e.clientY,t:Date.now()};try{boardEl.setPointerCapture(e.pointerId)}catch(_){}};
  if(ghostOn()){const s=ghostAt(name);if(s){e.preventDefault();ghostPlay(s);return}}
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

/* ================= Navigation: 5 Bereiche mit Unterbereichen ================= */
let curView="home";
const SECTIONS=[["home","Start","home"],["train","Training","learn"],["play","Spielen","swords"],["analyse","Analyse","search"],["me","Profil","profile"]];
function subnavOf(sec){
  return {train:[["learn","Übersicht"],["courses","Kurse"],["openings","Eröffnungen"],["tactics","Taktik"],["end","Endspiele"],["quiz","Quiz"],["games","Musterpartien"]],
    play:[["online:play","Online"],["bots","Computer"],["tours","Turniere"],["scout","Gegner-Check"],["online:live","Live"]],
    analyse:[["analyse","Partie analysieren"],["chess",siteName()]],
    me:[["profile:stats","Statistik"],["league","Liga"],["profile:badges","Abzeichen"],["online:leader","Bestenliste"],["online:friends","Freunde"],["profile:settings","Einstellungen"],["online:account","Konto"],["profile:sync","Daten"]].concat(isAdmin()?[["online:admin","Admin"]]:[],[["legal","Rechtliches"]])}[sec]||[];
}
/* Zu welchem Bereich gehört die aktuelle Ansicht? Das Brett erbt den Bereich von dem, was gerade läuft */
function sectionOf(v){
  v=v||curView;
  if(v==="home")return "home";
  if(v==="online")return ["leader","friends","account","admin"].indexOf(ON.tab)>=0?"me":"play";
  if(v==="bots"||v==="tours"||v==="scout")return "play";if(v==="player")return "me";
  if(v==="analyse"||v==="chess")return "analyse";
  if(v==="profile"||v==="legal"||v==="league")return "me";
  if(v==="train"){if(mode==="online")return "play";if(mode==="replay")return game&&(game.review||game.free)?"analyse":"train";if(op&&op.bot)return op.playOn&&op.playOn.goal?"train":"play";return "train"}
  return "train";
}
const routeKey=()=>curView==="online"?"online:"+ON.tab:curView==="profile"?"profile:"+profTab:curView;
/* zuletzt besuchte Unterseite pro Bereich, damit ein Tab-Wechsel dorthin zurückführt */
const secLast=store.get("et-seclast",{});
function showView(v){
  v=String(v||"home");const [base,sub]=v.split(":");
  if(base==="online"&&sub)ON.tab=sub==="admin"&&!isAdmin()?"play":sub;
  if(base==="player"&&sub)playerUid=sub;
  if(base==="tactics")tacTab=sub==="hist"?"hist":"train";
  if(base==="openings"&&sub)opTab=sub==="lex"?"lex":"mine";
  if(base==="profile"&&sub)profTab=["stats","badges","settings","sync"].indexOf(sub)>=0?sub:"stats";
  if(base!==curView)cancelAuto();
  const prev=curView;curView=base;
  document.querySelectorAll(".view").forEach(el=>{const on=el.id==="v-"+base;el.hidden=!on;if(on&&prev!==base&&!calmNow()){el.classList.remove("enter");void el.offsetWidth;el.classList.add("enter")}});
  if(base!=="train"){stopEngine();stopBlitz();if(VR.on)vrStop()}
  ({home:renderHome,tactics:renderTactics,learn:renderLearn,online:renderOnline,openings:renderOpenings,chess:renderChess,profile:renderProfile,quiz:renderQuizIntro,games:renderGames,import:renderImport,end:renderEndPage,bots:renderBots,scout:renderScout,memos:renderMemos,plans:renderPlans,analyse:renderAnalyse,legal:renderLegal,courses:renderCourses,repedit:renderRepEdit,coords:renderCoords,guess:renderGuessPick,player:renderPlayer,tours:renderTours,league:renderLeague}[base]||(()=>{}))();
  if(base!=="train"){const sec=sectionOf();secLast[sec]=routeKey();store.set("et-seclast",secLast)}
  renderTabbar();applyBlind();if(base!=="train")window.scrollTo(0,0);else sizeVar();
}
function secBadge(id){
  if(id==="train"){ensureDaily();const due=dueKeys().length;const open=S.daily.queue.length-S.daily.done.length;return Math.max(open,due)}
  if(id==="play")return ON.badge||0;
  if(id==="me")return (typeof SOC!=="undefined"&&SOC.inc&&SOC.inc.length)||0;
  return 0;
}
function goSection(id){
  if(id==="home"){showView("home");return}
  const cur=sectionOf();
  /* nochmal auf den aktiven Tab: zurück zur ersten Unterseite */
  if(cur===id&&curView!=="train"){const first=(subnavOf(id)[0]||[])[0];if(first&&routeKey()!==first){showView(first);return}}
  const last=secLast[id];const ok=last&&subnavOf(id).some(x=>x[0]===last||x[0].split(":")[0]===last);
  showView(ok?last:(subnavOf(id)[0]||["home"])[0]);
}
function renderTabbar(){
  const sec=sectionOf();
  $("tabbar").innerHTML=SECTIONS.map(([id,t,ic])=>{const n=secBadge(id);return `<button class="tb" data-tab="${id}" aria-label="${t}" aria-current="${sec===id}">${NI[ic]}<span class="tl">${t}</span>${n>0?`<span class="dotn">${n>99?"99+":n}</span>`:""}</button>`}).join("");
  $("tabbar").querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>goSection(b.dataset.tab));
  renderSubnav();renderSideNav();try{turnTitle()}catch(e){}
}
function renderSubnav(){
  const el=$("subnav");if(!el)return;const sec=sectionOf();const items=subnavOf(sec);
  if(curView==="train"||!items.length){el.hidden=true;el.innerHTML="";return}
  const rk=routeKey();el.hidden=false;
  el.innerHTML=`<div class="subnav-in">${items.map(([k,t])=>{const cur=k===rk||(k===curView&&k.indexOf(":")<0);const n=k==="online:play"?ON.badge:k==="online:friends"&&typeof SOC!=="undefined"&&SOC.inc?SOC.inc.length:0;return `<button class="pill" data-go="${k}" aria-current="${cur}">${esc(t)}${n?` <span class="dotn2">${n}</span>`:""}</button>`}).join("")}</div>`;
  el.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showView(b.dataset.go));
  const c=el.querySelector('[aria-current="true"]');if(c&&el.firstChild.scrollWidth>el.clientWidth){const box=el.firstChild;box.scrollLeft=c.offsetLeft-box.clientWidth/2+c.offsetWidth/2}
}
function renderSideNav(){
  const el=$("sideNav");if(!el)return;const sec=sectionOf();const rk=routeKey();
  el.innerHTML=SECTIONS.map(([id,t,ic])=>{const n=secBadge(id);const on=sec===id;const subs=on?subnavOf(id):[];
    return `<button class="ni" data-tab="${id}" aria-current="${on}"><span class="ic">${NI[ic]}</span><span class="lbl">${t}</span>${n>0?`<span class="cnt hot">${n}</span>`:""}</button>${subs.length?`<div class="nisub">${subs.map(([k,st])=>`<button data-go="${k}" aria-current="${curView!=="train"&&(k===rk||k===curView)}">${esc(st)}</button>`).join("")}</div>`:""}`}).join("");
  el.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>goSection(b.dataset.tab));
  el.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showView(b.dataset.go));
  const ops=$("sideOps");if(ops)ops.hidden=sec!=="train";
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
  v.innerHTML=`${pageHead("Eröffnungen",`${ALL.length} Eröffnungen, ${totalLines()} Varianten. Mit dem Stern kommt eine Eröffnung in dein Repertoire.`,"list","open")}
  <input class="txt" id="opSearch" type="search" placeholder="Name, ECO oder Züge" value="${esc(opQuery)}" aria-label="Eröffnung suchen">
  <div class="filters">${F.map(f=>`<button class="chip${opFilter===f[0]?" on":""}" data-f="${f[0]}">${f[1]}</button>`).join("")}</div>
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
function ringSvg(frac){const r=36,c=2*Math.PI*r;return `<svg class="ring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="${r}" fill="none" style="stroke:var(--line)" stroke-width="8"/><circle cx="42" cy="42" r="${r}" fill="none" style="stroke:var(--acc)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-frac)}" transform="rotate(-90 42 42)"/><text x="42" y="47" text-anchor="middle" font-size="16" font-weight="800" fill="currentColor">${Math.round(frac*100)}%</text></svg>`}
function pageHead(title,sub,ic,sec){
  if(sec&&typeof SECT!=="undefined"&&SECT[sec])return `<header class="hero shero sec-${sec}"><div class="shero-scn" aria-hidden="true">${sectSvg(sec)}</div><div class="shero-c">${ic?`<span class="ic">${NI[ic]}</span>`:""}<div><h2>${title}</h2>${sub?`<p>${sub}</p>`:""}</div></div></header>`;
  return `<header class="hero">${ic?`<span class="ic">${NI[ic]}</span>`:""}<div><h2>${title}</h2>${sub?`<p>${sub}</p>`:""}</div></header>`}
/* Leere Zustände: ein Trainer schaut vorbei, statt nur ein Symbol */
const EMPTY_CO={search:"konrad",profile:"mila",swords:"rex",online:"nova",edit:"bruno",bolt:"linus"};
function emptyState(ic,title,text,act){const co=EMPTY_CO[ic];
  return `<div class="empty-st${co?" co-"+co:""}">${co?`<span class="es-tr">${coachImg(co,"think")}</span>`:`<span class="es-ic">${NI[ic]||""}</span>`}<b>${title}</b>${text?`<p>${text}</p>`:""}${act||""}</div>`}
/* Training: Sammlungen statt einer langen Kachelwand */
function renderLearn(){
  ensureDaily();const v=$("v-learn");const due=dueKeys().length;const dp=duePositions().length;const mine=S.puz.filter(p=>!p.solved||p.solved<2).length;
  const tot=totalLines(),cl=cleanCount();const tz=pzToday();const ends=Object.keys(st.ends).length;
  const item=(act,ic,t,d,meta,hot)=>`<button class="ci" data-act="${act}"><span class="ci-ic">${NI[ic]}</span><span class="ci-t"><b>${t}</b><small>${d}</small></span>${meta!=null&&meta!==""?`<span class="ci-m${hot?" hot":""}">${meta}</span>`:""}<span class="ci-go" aria-hidden="true">›</span></button>`;
  const coll=(id,ic,t,sub,frac,items)=>`<section class="coll" data-coll="${id}"><div class="coll-h"><span class="coll-ic">${NI[ic]}</span><div><h3>${t}</h3><small>${sub}</small></div>${frac!=null?`<span class="coll-p"><span class="prog"><i style="width:${Math.round(frac*100)}%"></i></span><small>${Math.round(frac*100)} %</small></span>`:""}</div><div class="coll-items">${items}</div></section>`;
  const lc=COURSES.find(x=>x.id===st.crsLast);
  v.innerHTML=pageHead("Training","Such dir aus, was du heute üben willst.","learn","train")+(lc?crsHomeTile(lc):"")+
  `<div class="colls">`+
  coll("op","book","Eröffnungen",`${cl} von ${tot} Varianten fehlerfrei · ${S.rep.length} im Repertoire`,tot?cl/tot:0,
    item("courses","learn","Kurse",`${COURSES.length} Kurse mit eigenem Trainer – für jeden Spielstil`,`${COURSES.filter(c=>{const p=courseProg(c);return p.n&&p.cl===p.n}).length}/${COURSES.length}`)+
    item("openings","list","Alle Eröffnungen",`${ALL.length} Eröffnungen mit Suche und Filtern`)+
    item("review","review","Fällige Varianten","Wiederholung nach Lernkurve",due,due>0)+
    item("positions","target","Schwache Stellungen","Nur die Züge, bei denen du danebenliegst",dp,dp>0)+
    item("traps","traps","Fallen-Training","Fallen stellen und vermeiden",trapKeys().length))+
  coll("tac","bolt","Taktik",`Wertung ${PZ.r} · heute ${tz.n} von ${PZ.goal}`,Math.min(1,tz.n/PZ.goal),
    item("tactics","bolt","Taktik-Training","Rätsel, Sprint, Themen-Pfade und Levels",tz.n+"/"+PZ.goal,tz.n<PZ.goal)+
    item("mine","mistake","Deine Fehler","Stellungen aus deinen eigenen Partien",mine,mine>0))+
  coll("drill","daily","Drills","Damit die Züge automatisch kommen",null,
    item("blitz","bolt","Blitz-Drill",`10 Varianten, ${S.set.blitzSec} Sekunden pro Zug`)+
    item("blind","eye","Blind-Training","Figuren unsichtbar, nur die Notation hilft")+
    item("plans","target","Planaufgaben","Nach der Theorie: ein Ziel gegen deinen Trainer",PT.length?PT.filter(ptOk).length+"/"+PT.length:null)+
    item("quiz","quiz","Quiz","Buchzug, Eröffnung und Plan erkennen",st.quiz.ok?st.quiz.ok+" ✓":null)+
    item("coords","target","Koordinaten","Felder in 30 Sekunden finden oder benennen",CO.best.find||null))+
  coll("end","king","Endspiele & Partien",`${ends} von ${ENDGAMES.length} Endspielen gespielt`,ENDGAMES.length?ends/ENDGAMES.length:0,
    item("end","king","Endspiele","Grundmatts, Lucena, Philidor gegen Stockfish",ends+"/"+ENDGAMES.length)+
    item("games","games","Musterpartien","Berühmte Partien und Meisterpartien",GAMES.length)+
    item("guess","games","Finde den Meisterzug","Rate die Züge berühmter Partien"))+
  coll("rep","edit","Dein Repertoire","Eigene Varianten, Import und Teilen",null,
    item("edit","edit","Eigene Variante","Zugfolge einspielen und trainieren")+
    item("repedit","list","Varianten-Baum","Eigene Varianten ansehen, abzweigen und löschen",ALL.filter(o=>o.g==="c").reduce((a,o)=>a+o.lines.length,0)||null)+
    item("import","import","Repertoire importieren","PGN-Datei oder Lichess-Studie")+
    item("share","share","Repertoire teilen","Link für Freunde erzeugen")+
    item("memos","pin","Deine Notizen","Merkzettel zu Stellungen aus Training und Analyse",Object.keys(S.memo).length||null)+
    item("cheat","print","Spickzettel als PDF","Dein Repertoire zum Ausdrucken oder Mitnehmen"))+
  `</div>`;
  v.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{const a=b.dataset.act;
    if(["daily","review","positions","mine","traps","blitz","blind"].indexOf(a)>=0)startSession(a);
    else if(a.indexOf("course:")===0){courseOpen=a.slice(7);showView("courses")}
    else if(a==="edit")openEditor();else if(a==="share")shareRepertoire();else if(a==="cheat")cheatDialog();else showView(a)});
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
  v.innerHTML=`${pageHead(`Eröffnungs-Quiz`,`Zehn gemischte Fragen: Buchzug finden, Eröffnung erkennen und den passenden Plan zuordnen. ${S.rep.length?"Die Fragen stammen aus deinem Repertoire.":"Markiere Eröffnungen mit einem Stern, damit die Fragen aus deinem Repertoire kommen."}`,"quiz","quiz")}
  <div class="tiles"><div class="tile"><small>Beantwortet</small><b>${st.quiz.n}</b></div><div class="tile win"><small>Richtig</small><b>${st.quiz.ok}</b><span>${st.quiz.n?pct(st.quiz.ok/st.quiz.n):"–"}</span></div><div class="tile gold"><small>Bestes Quiz</small><b>${st.quiz.best||0}/10</b></div><div class="tile"><small>Pool</small><b>${quizPool().length}</b><span>Eröffnungen</span></div></div>
  <button class="big" id="quizGo" style="margin:0">Quiz starten</button>`;
  wireBack(v);$("quizGo").onclick=()=>{quiz={i:0,ok:0,n:10};nextQuestion()};
}
function wireBack(v){const b=v.querySelector("[data-back]");if(b)b.onclick=()=>showView("learn")}
function nextQuestion(){
  if(quiz.i>=quiz.n){st.quiz.best=Math.max(st.quiz.best||0,quiz.ok);saveStats();checkBadges();
    $("v-quiz").innerHTML=`${pageHead(`${quiz.ok} von ${quiz.n} richtig`,`${quiz.ok>=8?"Ausgezeichnet!":quiz.ok>=5?"Gut gemacht – die falschen Fragen kommen beim Training wieder.":"Übung macht den Meister. Trainiere die Eröffnungen und versuch es erneut."}`,"quiz","quiz")}<div class="btnrow"><button class="btn grn" id="qAgain">Neues Quiz</button><button class="btn" id="qBack">Zurück zum Training</button></div>`;
    $("qAgain").onclick=()=>{quiz={i:0,ok:0,n:10};nextQuestion()};$("qBack").onclick=()=>showView("learn");return}
  const type=quiz.i%3;const q=(type===0?qMove():type===1?qName():qPlan())||qMove();quiz.q=q;const v=$("v-quiz");
  v.innerHTML=`<div class="qhead"><h3>${esc(q.prompt)}</h3><span class="qprog">Frage ${quiz.i+1}/${quiz.n} · ${quiz.ok} richtig</span></div>
  <div class="quiz"><div class="qboard" id="qBoard"></div><div class="qopts">${q.opts.map((o,i)=>`<button class="qopt" data-i="${i}">${esc(o.t)}</button>`).join("")}<div class="qexp" id="qExp" hidden></div><div class="btnrow" id="qNextRow" hidden><button class="btn grn" id="qNext">${quiz.i+1>=quiz.n?"Ergebnis":"Nächste Frage"}</button><button class="btn" id="qTrain">Variante üben</button></div></div></div>`;
  $("qBoard").appendChild(staticBoard(q.fen,q.or,q.last));
  v.querySelectorAll(".qopt").forEach(b=>b.onclick=()=>{
    const o=q.opts[+b.dataset.i];st.quiz.n++;if(o.ok){st.quiz.ok++;quiz.ok++;sfx("done")}else sfx("wrong");saveStats();gain("quiz",{ok:o.ok});
    v.querySelectorAll(".qopt").forEach(x=>{x.disabled=true;const oo=q.opts[+x.dataset.i];if(oo.ok)x.classList.add("right");else if(x===b)x.classList.add("wrong")});
    $("qExp").hidden=false;$("qExp").textContent=(o.ok?"Richtig! ":"Leider falsch. ")+q.exp;$("qNextRow").hidden=false;
  });
  $("qNext").onclick=()=>{quiz.i++;nextQuestion()};$("qTrain").onclick=()=>selectOpening(byId(q.oid),q.li);
}

/* ---------------- Musterpartien & Meisterpartien ---------------- */
function renderGames(){
  const v=$("v-games");const opts=ALL.filter(o=>o.g!=="c").map(o=>`<option value="${o.id}">${esc(o.name)}</option>`).join("");
  v.innerHTML=`${pageHead("Musterpartien","Berühmte Partien, Zug für Zug erklärt.","games","games")}
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
  const v=$("v-end");const done=Object.keys(st.ends).length;
  v.innerHTML=pageHead("Endspiele",`${done} von ${ENDGAMES.length} gespielt. Du spielst gegen Stockfish.`,"king","end")+
  END_CH.map(([c,t,d])=>{const es=ENDGAMES.filter(e=>(e.c||"open")===c);if(!es.length)return "";const n=es.filter(e=>st.ends[e.id]).length;
    return `<div class="sec-h"><h3>${t}</h3><small>${n}/${es.length} · ${d}</small></div><div class="grid3">${es.map(e=>`<div class="gcard">${st.ends[e.id]?'<span class="done-tag">Gespielt</span>':""}<h4>${esc(e.t)}</h4><div id="eb-${e.id}"></div><p>${esc(e.goal)}</p><button class="btn grn" data-end="${e.id}">Gegen Stockfish spielen (${e.side==="w"?"Weiß":"Schwarz"})</button></div>`).join("")}</div>`}).join("");
  ENDGAMES.forEach(e=>{const box=$("eb-"+e.id);if(!box)return;const fen=e.fen||(()=>{const g=new Chess();e.moves.split(" ").forEach(m=>g.move(m));return g.fen()})();box.appendChild(staticBoard(fen,e.side))});
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
  v.innerHTML=`<button class="back" data-back>← Training</button>${pageHead(`Repertoire importieren`,`Lies dein bestehendes Repertoire mit allen Nebenvarianten ein – aus einer PGN-Datei (z. B. aus ChessBase, Chessable-Export oder Lichess) oder direkt aus einer öffentlichen Lichess-Studie.`,"import","open")}
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
  checkBadges();const v=$("v-profile");
  const H={stats:["Statistik","Dein Fortschritt im Training.","chess"],badges:["Abzeichen",`${st.badges.length} von ${BADGES.length} gesammelt.`,"medal2"],settings:["Einstellungen","Aussehen, Brett, Training und Komfort.","settings"],sync:["Daten","Sichern, übertragen und teilen.","import"]}[profTab];
  v.innerHTML=pageHead(H[0],H[1],H[2]==="medal2"?"games":H[2],profTab==="stats"||profTab==="badges"?"prof":"")+`<div id="profBody" class="page" style="max-width:none"></div>`;
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
  v.innerHTML=`<div class="badges">${BADGES.map(b=>`<div class="bdg${st.badges.indexOf(b.id)>=0?" got":""}"><span class="md">${ICON.medal}</span><span><b>${esc(b.t)}</b><small>${esc(b.d)}</small></span></div>`).join("")}</div>`;
}
const THEMES=[["green","Grün","#EBECD0","#739552"],["brown","Holz","#F0D9B5","#B58863"],["blue","Blau","#DEE3E6","#8CA2AD"],["gray","Marmor","#E2E2DE","#9E9E98"]];
const PSETS=[["cburnett","Klassisch"],["staunty","Staunty"]];
function applySettings(){
  document.body.classList.remove("bt-green","bt-brown","bt-blue","bt-gray","ps-cburnett","ps-staunty","theme-light");
  document.body.classList.add("bt-"+S.set.theme,"ps-"+S.set.pieces);if(S.set.design==="light")document.body.classList.add("theme-light");
  document.body.classList.remove("acc-violet","acc-red","acc-green");document.body.classList.add("acc-"+(S.set.accent||"violet"));
  document.body.classList.toggle("nocoords",!S.set.coords);document.body.classList.toggle("cbrd",S.set.crsBoard!==false);document.body.classList.toggle("calm",!!S.set.calm);
  document.documentElement.style.setProperty("--fz",String((S.set.font||100)/100));
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=S.set.design==="light"?"#F4F3F0":"#1B1A18";
}
const VOICE_TEST={mila:"Hallo! Ich bin Mila. Merk dir: Erst die Figuren entwickeln, dann angreifen.",bruno:"Bruno hier. Wir bauen Zug für Zug – ein festes Fundament hält alles aus.",greta:"Greta. Deine Burg steht, wenn jeder Stein an seinem Platz liegt.",konrad:"Kapitän Konrad an Bord! Kurs halten, Springer f3, volle Fahrt voraus.",linus:"Linus Langbogen. Zielen, ruhig atmen – der Läufer trifft auf f7.",rex:"Rex! Angriff! Wer zögert, verliert das Feuer.",nova:"Nova, Systeme online. Berechnung läuft – die Diagonale ist frei.",ilka:"Dr. Ilka Glut. Die Messwerte steigen, der Vulkan erwacht.",rika:"Arrr, Rika Rotsegel! Ein Bauer weniger, dafür Wind in den Segeln."};
function vcCoach(){const c=typeof crsSess==="function"&&mode==="train"?crsSess():null;if(c)return coIdOf(c);const l=st.crsLast&&typeof COURSES!=="undefined"?COURSES.find(x=>x.id===st.crsLast):null;return l?coIdOf(l):"mila"}
function renderSettings(v){
  const sw=(id,on,t,d)=>`<div class="setrow"><span><b>${t}</b><small>${d}</small></span><button class="switch" id="${id}" aria-pressed="${on}" aria-label="${t}"></button></div>`;
  v.innerHTML=`<div class="card"><h3>Aussehen</h3><div class="setrow"><span><b>Akzentfarbe</b><small>Farbe für Knöpfe und Hervorhebungen</small></span></div>${accentPicker()}<div class="setrow" style="margin-top:6px"><span><b>Modus</b><small>Dunkel schont abends die Augen</small></span><span class="seg"><button data-design="dark" aria-pressed="${S.set.design!=="light"}">Dunkel</button><button data-design="light" aria-pressed="${S.set.design==="light"}">Hell</button></span></div></div>
  <div class="card"><h3>Brett</h3><div class="opts">${THEMES.map(t=>`<button class="optc" data-theme="${t[0]}" aria-pressed="${S.set.theme===t[0]}"><span class="mini-board">${[0,1,2,3,4,5,6,7].map(i=>`<i style="background:${((i+(i>3?1:0))%2)?t[3]:t[2]}"></i>`).join("")}</span>${t[1]}</button>`).join("")}</div></div>
  <div class="card"><h3>Figuren</h3><div class="opts">${PSETS.map(p=>`<button class="optc pv-${p[0]}" data-pset="${p[0]}" aria-pressed="${S.set.pieces===p[0]}"><span class="piece-prev">${["wk","wq","wn","bk","bq","bn"].map(x=>`<span class="pp ${x}"></span>`).join("")}</span>${p[1]}</button>`).join("")}</div><p class="hint" style="margin-top:8px">„Klassisch“: Colin M.L. Burnett (GPLv2+). „Staunty“: lichess-Set, CC BY-NC-SA 4.0.</p></div>
  <div class="card"><h3>Training</h3>
    ${sw("swLearn",S.set.learnFirst!==false,"Neue Varianten vorzeigen","Unbekannte Varianten erst mit Pfeilen lernen, dann ohne Hilfe prüfen")}
    ${sw("swSound",S.set.sound,"Ton","Geräusche für Züge, Fehler und Erfolge")}
    ${sw("swIdeas",S.set.ideas,"Ideen-Pfeile","Blaue Pfeile zeigen, was der letzte Zug angreift oder fesselt")}
    ${sw("swWhy",S.set.why!==false,"Falsche Züge erklären","Stockfish prüft Nicht-Buchzüge: spielbar, ungenau oder ein Fehler – mit Widerlegung")}
    ${sw("swCoords",S.set.coords,"Koordinaten","Buchstaben und Zahlen am Brettrand")}
    ${sw("swCb",S.set.crsBoard!==false,"Kursbretter","Im Kurs nimmt das Brett die Farben der Kurswelt an")}
    ${sw("swEval",S.set.evalbar,"Bewertungsbalken","Stockfish bewertet jede Stellung neben dem Brett")}
    ${sw("swReal",S.set.realistic,"Realistische Gegnerzüge","Das Buch spielt häufige Antworten öfter – nach Lichess-Statistik")}
    <div class="setrow"><span><b>Blitz-Drill: <span id="blLbl">${S.set.blitzSec}</span> s pro Zug</b><small>Zeit pro Zug im Blitz-Drill</small></span><input type="range" id="blRange" min="2" max="15" value="${S.set.blitzSec}" aria-label="Sekunden pro Zug"></div>
    <div class="setrow"><span><b>Stockfish-Stärke: <span id="sfLbl">${S.set.sf}</span></b><small>1 = Anfänger, 10 = Vereinsspieler, 20 = volle Stärke</small></span><input type="range" id="sfRange" min="1" max="20" value="${S.set.sf}" aria-label="Stockfish-Stärke"></div>
  </div>
  <div class="card"><h3>Stimme</h3>
    ${VC.ok?sw("swVoice",!!S.set.voice,"Trainer sprechen","Schlüsselzüge, Erklärungen und Sprüche liest dein Trainer vor – jeder mit eigener Stimmlage")+sw("swVoiceMv",!!S.set.voiceMv,"Züge ansagen","Jeder Zug wird angesagt, z. B. „Springer f3“ – praktisch im Blind-Training"):`<div class="setrow"><span><b>Sprachausgabe</b><small>Dieser Browser kann keinen Text vorlesen.</small></span></div>`}
    ${VC.rec?sw("swVoiceIn",!!S.set.voiceIn,"Spracheingabe","Mikrofon unter dem Brett: „Springer f3“, „e schlägt d5“, „kurze Rochade“"):`<div class="setrow"><span><b>Spracheingabe</b><small>Dieser Browser erkennt keine Sprache. In Chrome und Safari geht es.</small></span></div>`}
    ${VC.ok?`<div class="setrow"><span><b>Probehören</b><small>So klingt ${esc(TRAINER[vcCoach()].nick)}</small></span><button class="btn" id="voiceTest" style="padding:8px 12px">Anhören</button></div>`:""}
  </div>
  <div class="card"><h3>Komfort</h3>
    ${sw("swAuto",S.set.autoNext,"Automatisch weiter","Nach einer gelösten Variante oder Aufgabe startet kurz darauf die nächste")}
    ${sw("swQueen",S.set.autoQueen,"Automatisch Dame","Bei der Umwandlung ohne Nachfrage eine Dame nehmen")}
    ${sw("swSwipe",S.set.swipe,"Wischen auf dem Brett","Nach links wischen: Zug vor, nach rechts: Zug zurück")}
    ${sw("swSync",S.set.autoSync,"Chess.com automatisch abgleichen","Beim Öffnen neue Partien laden und mit Stockfish analysieren")}
    <div class="setrow"><span><b>Analyse-Tiefe</b><small>Rechenzeit pro Zug im Game Review</small></span><span class="seg">${[[150,"Schnell"],[300,"Normal"],[800,"Gründlich"]].map(f=>`<button data-rv="${f[0]}" aria-pressed="${(S.set.revMs||300)===f[0]}">${f[1]}</button>`).join("")}</span></div>
    ${sw("swCalm",S.set.calm,"Weniger Animationen","Keine Bewegungen, kein Konfetti")}
    <div class="setrow"><span><b>Schriftgröße</b><small>Gilt für Texte und Knöpfe, nicht für das Brett</small></span><span class="seg" id="fzSeg">${[[90,"A−"],[100,"A"],[115,"A+"],[130,"A++"]].map(f=>`<button data-fz="${f[0]}" aria-pressed="${S.set.font===f[0]}">${f[1]}</button>`).join("")}</span></div>
    <div class="setrow"><span><b>Ersteinrichtung</b><small>Spielstärke, Farbe und Chess.com-Name neu wählen</small></span><button class="btn" id="onbAgain" style="padding:8px 12px">Starten</button></div>
  </div>
  <div class="card"><h3>Lichess-Token (optional)</h3><p class="hint" style="margin:0 0 8px">Nur nötig, falls Lichess die Datenbank ohne Anmeldung sperrt. Erstelle einen Token ohne besondere Rechte auf <a href="https://lichess.org/account/oauth/token/create?description=Eroeffnungstrainer" target="_blank" rel="noopener">lichess.org</a> und füge ihn hier ein. Er bleibt nur in diesem Browser.</p><input class="txt" id="liTok" placeholder="lip_…" value="${esc(S.set.liToken)}" autocomplete="off"></div>
  <div class="card"><h3>Rechtliches</h3><p class="hint" style="margin:0 0 10px">Datenschutzerklärung, Impressum und verwendete Open-Source-Software.</p><div class="btnrow"><button class="btn" data-go="legal">Datenschutz & Impressum</button></div></div>
  <div class="card"><h3>App installieren</h3><p class="hint" style="margin:0">iPhone: In Safari auf Teilen → „Zum Home-Bildschirm“. Android/Chrome: Menü → „App installieren“. Danach funktioniert das Training auch offline.</p></div>
  <div class="card"><h3>Zurücksetzen</h3><p class="hint" style="margin:0 0 10px">Löscht Fortschritt, Wiederholungsplan, Statistik und Abzeichen in diesem Browser. Einstellungen und eigene Varianten bleiben.</p><div class="btnrow"><button class="btn red" id="resetBtn">Fortschritt zurücksetzen</button><span class="hint" id="resetMsg"></span></div></div>`;
  v.querySelectorAll("[data-design]").forEach(b=>b.onclick=()=>{S.set.design=b.dataset.design;save("set");applySettings();renderProfile()});
  wireAccent(v,()=>renderProfile());v.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showView(b.dataset.go));
  v.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>{S.set.theme=b.dataset.theme;save("set");applySettings();renderProfile()});
  v.querySelectorAll("[data-pset]").forEach(b=>b.onclick=()=>{S.set.pieces=b.dataset.pset;save("set");applySettings();renderProfile()});
  const tg=(id,key)=>$(id).onclick=()=>{S.set[key]=!S.set[key];save("set");applySettings();$(id).setAttribute("aria-pressed",String(S.set[key]));if(op&&curView==="train")render()};
  tg("swSound","sound");tg("swIdeas","ideas");tg("swWhy","why");tg("swCb","crsBoard");tg("swCoords","coords");tg("swEval","evalbar");tg("swReal","realistic");
  if($("swVoice"))tg("swVoice","voice");if($("swVoiceMv"))tg("swVoiceMv","voiceMv");if($("swVoiceIn"))$("swVoiceIn").onclick=()=>{S.set.voiceIn=!S.set.voiceIn;save("set");$("swVoiceIn").setAttribute("aria-pressed",String(S.set.voiceIn));if(!S.set.voiceIn)vrStop();vrUi()};
  if($("voiceTest"))$("voiceTest").onclick=()=>{const co=vcCoach();VC.unlocked=true;vcSay(VOICE_TEST[co]||VOICE_TEST.mila,co,true)};
  tg("swLearn","learnFirst");tg("swAuto","autoNext");tg("swQueen","autoQueen");tg("swSwipe","swipe");tg("swSync","autoSync");tg("swCalm","calm");
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
/* Restzeiten nach jedem Halbzug aus [%clk h:mm:ss] (Chess.com, Lichess) und Grund-/Zusatzzeit aus TimeControl */
function pgnClk(pgn,n){const body=String(pgn||"").replace(/^\s*\[[^\]]*\]\s*$/gm," ");const a=[...body.matchAll(/\[%clk\s+(\d+):(\d+):(\d+(?:\.\d+)?)\]/g)].map(m=>+m[1]*3600+ +m[2]*60+ +m[3]);return n&&a.length===n?a:null}
function tcbOf(tc){const m=String(tc||"").match(/^(\d+)(?:\+(\d+))?$/);return m?{base:+m[1],inc:+(m[2]||0)}:null}
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
  const out={id:g.uuid||g.url||String(g.end_time),color,res,term:TERM[res==="win"?them.result:me.result]||"",fam:famFromUrl(g.eco||pgnHeader(g.pgn,"ECOUrl")),moves:pgnMoves(g.pgn),tc:g.time_class||"",url:g.url||"",opp:them.username,oppR:them.rating,myR:me.rating,date:(g.end_time||0)*1000,name:me.username,acc:g.accuracies?g.accuracies[color==="w"?"white":"black"]:null,white:g.white.username,black:g.black.username,clk:null,tcb:tcbOf(g.time_control)};
  if(!/^\d+\//.test(g.time_control||""))out.clk=pgnClk(g.pgn,out.moves.length);return out;
}
function normLichess(g,user){
  if(g.variant&&g.variant!=="standard")return null;if(g.status==="aborted"||g.status==="noStart")return null;
  const u=user.toLowerCase();const W=g.players.white||{},B=g.players.black||{};const wn=(W.user||{}).name||"",bn=(B.user||{}).name||"";
  let color=null;if(wn.toLowerCase()===u)color="w";else if(bn.toLowerCase()===u)color="b";if(!color)return null;
  const res=g.winner?((g.winner==="white")===(color==="w")?"win":"loss"):"draw";
  const sp={ultraBullet:"bullet",bullet:"bullet",blitz:"blitz",rapid:"rapid",classical:"rapid",correspondence:"daily"}[g.speed]||"";
  const me=color==="w"?W:B,them=color==="w"?B:W;
  return {id:g.id,color,res,term:TERM[g.status]||"",fam:famFromName(g.opening&&g.opening.name),moves:(g.moves||"").split(" ").filter(Boolean),tc:sp,url:"https://lichess.org/"+g.id+(color==="b"?"/black":""),opp:color==="w"?bn:wn,oppR:them.rating,myR:me.rating,date:g.createdAt||0,name:color==="w"?wn:bn,acc:me.analysis?me.analysis.accuracy:null,white:wn,black:bn,
    clk:Array.isArray(g.clocks)&&g.clocks.length===(g.moves||"").split(" ").filter(Boolean).length?g.clocks.map(c=>c/100):null,tcb:g.clock?{base:Math.round(g.clock.initial),inc:Math.round(g.clock.increment)}:null};
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
    const r=await fetch(`https://lichess.org/api/games/user/${encodeURIComponent(u)}?since=${since}&max=400&moves=true&opening=true&accuracy=true&clocks=true${perf?"&perfType="+perf:""}`,{headers});
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
  const np=collectBookPuzzles(R);if(np)toast(np+" neue Übungen aus deinen Partien unter Training → Deine Fehler");
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
    v.innerHTML=`${pageHead(`${siteName()}-Zentrale`,`Lade das Profil von ${esc(CH.user)} …`,"chess","ana")}<div class="card">${SKEL}</div><div class="card">${SKEL}</div>`;return}
  const linked=!!CH.user&&P0&&!!P0.name;
  v.innerHTML=`${pageHead(`${siteName()}-Zentrale`,`Verknüpfe dein Konto über den Benutzernamen (kein Passwort nötig). Du bekommst deine Wertungen, alle Partien mit Game Review, die Eröffnungen, in denen du verlierst, deinen persönlichen Eröffnungsbaum und Übungen aus deinen eigenen Fehlern.`,"chess","ana")}
  ${linked?prof:`<div class="card"><form class="form" id="chForm" style="grid-template-columns:minmax(0,1fr) minmax(0,2fr) auto"><label>Plattform${srcSeg}</label><label class="wide" for="chUser">Benutzername<input id="chUser" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="dein ${siteName()}-Name" value="${esc(CH.user)}" required></label><button class="btn grn" type="submit" style="padding:12px 18px">Verknüpfen</button></form>${P0&&P0.error?`<div class="err" style="margin-top:10px">${P0.error==="notfound"?`Den Benutzer gibt es auf ${siteName()} nicht.`:`${siteName()} ist gerade nicht erreichbar. Prüfe die Internetverbindung.`}</div>`:""}</div>`}
  ${linked?`<div class="card"><div class="btnrow"><label class="fld" style="flex:1;min-width:140px">Zeitraum<select id="chMonths">${[1,3,6,12].map(m=>`<option value="${m}" ${CH.months===m?"selected":""}>${m===1?"Letzter Monat":m+" Monate"}</option>`).join("")}</select></label><label class="fld" style="flex:1;min-width:140px">Partien<select id="chType">${[["all","Alle"],["bullet","Bullet"],["blitz","Blitz"],["rapid","Schnellschach"],["daily","Täglich"]].map(t=>`<option value="${t[0]}" ${CH.type===t[0]?"selected":""}>${t[1]}</option>`).join("")}</select></label><button class="btn grn" id="chLoad" style="align-self:flex-end;padding:12px 18px">${CH.games.length?"Partien neu laden":"Partien laden & analysieren"}</button></div>
    <details class="alt"><summary>Oder PGN-Datei hochladen</summary><p>${siteName()}: Archiv herunterladen und hier auswählen.</p><input type="file" id="pgnFile" accept=".pgn,text/plain"></details>
    <div class="status" id="chStatus" hidden style="margin-top:12px"><b id="chStT"></b><div class="prog"><i id="chBar"></i></div><small id="chStX"></small></div><div id="chErr" class="err" hidden style="margin-top:10px"></div></div>`:""}
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
  <div class="chips" style="margin-top:6px">${["bullet","blitz","rapid","daily"].filter(t=>CH.games.filter(g=>g.tc===t).length>=3).map(t=>`<button class="chip${t===tc?" on":""}" data-rtc="${t}">${{bullet:"Bullet",blitz:"Blitz",rapid:"Schnell",daily:"Täglich"}[t]}</button>`).join("")}</div></div>`;
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
      ${o?`<button class="btn grn" data-train="${G.id}" data-line="${G.focusLine===null?"":G.focusLine}">${G.focusLine!==null?"Üben: "+esc(o.lines[G.focusLine].n):"Jetzt üben"}</button>`:`<div class="hint">Für diese Eröffnung gibt es noch keine Übung. Importiere sie unter Training → Repertoire importieren.</div>`}</div>`}).join("")}</div>`;
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
  el.innerHTML=`<div class="filters">${F.map(f=>`<button class="chip${CH.gFilter===f[0]?" on":""}" data-gf="${f[0]}">${f[1]}</button>`).join("")}</div>
  <p class="hint" style="margin:0">Tippe auf eine Partie für das Game Review: Stockfish bewertet jeden Zug (von Brillant bis Patzer), zeigt bessere Züge, deine Genauigkeit und geschätzte Elo. Mit eigenen Zügen auf dem Brett analysierst du Varianten.</p>
  <div class="glist">${list.map((g,i)=>{const rv=REV[g.id];return `<button class="gi" data-gi="${CH.games.indexOf(g)}"><span class="res ${g.res}">${g.res==="win"?"S":g.res==="loss"?"N":"½"}</span><span style="min-width:0"><b>${g.color==="w"?"♔":"♚"} gegen ${esc(g.opp)}${g.oppR?` (${g.oppR})`:""}</b><small>${esc(g.fam)} · ${{bullet:"Bullet",blitz:"Blitz",rapid:"Schnell",daily:"Täglich"}[g.tc]||g.tc}${g.term?" · "+esc(g.term):""} · ${g.date?fmtDate(g.date):""}</small></span><span class="acc">${rv&&rv.acc?rv.acc[g.color].toFixed(1)+" %":g.acc!=null?g.acc.toFixed(1)+" %":""}</span><span class="mini">Review</span></button>`}).join("")||'<div class="card">Keine Partien.</div>'}</div>`;
  el.querySelectorAll("[data-gf]").forEach(b=>b.onclick=()=>{CH.gFilter=b.dataset.gf;renderChGames(el)});
  el.querySelectorAll("[data-gi]").forEach(b=>b.onclick=()=>reviewGame(CH.games[+b.dataset.gi]));
}
const ANAH=store.get("et-anahist",[]).filter(x=>x&&x.id&&Array.isArray(x.moves));
function anaHistPush(g){const i=ANAH.findIndex(x=>x.id===g.id);if(i>=0)ANAH.splice(i,1);ANAH.unshift(Object.assign({},g,{seenAt:Date.now()}));ANAH.length=Math.min(ANAH.length,20);store.set("et-anahist",ANAH)}
async function reviewGame(g){
  if(g&&g.moves&&g.moves.length)anaHistPush(g);
  const R={evals:[],cls:[],best:[],doneN:0,acc:null,engine:""};
  const cached=REV[g.id];if(cached&&cached.n===g.moves.length&&cached.v===REV_V){Object.assign(R,cached,{doneN:g.moves.length})}
  const gm={fen:g.fen||null,id:"rv-"+g.id,title:`${g.white} – ${g.black}`,players:`${g.white}${g.color==="w"&&g.myR?" ("+g.myR+")":g.color==="b"&&g.oppR?" ("+g.oppR+")":""} – ${g.black}${g.color==="b"&&g.myR?" ("+g.myR+")":g.color==="w"&&g.oppR?" ("+g.oppR+")":""}`,year:g.date?fmtDate(g.date):"",moves:g.moves,url:g.url,orient:g.color,d:`${g.fam} · ${g.foreign?"Ergebnis "+(g.result||"–"):g.res==="win"?"gewonnen":g.res==="loss"?"verloren":"Remis"}${g.term?" ("+g.term+")":""}`,review:R,clk:Array.isArray(g.clk)&&g.clk.length===g.moves.length?g.clk:null,tcb:g.tcb||null};
  openGame(gm);
  if(R.doneN>=g.moves.length&&R.acc){setStatus("view","Game Review",`Genauigkeit: Weiß ${R.acc.w.toFixed(1)} · Schwarz ${R.acc.b.toFixed(1)}`,true);return}
  setStatus("view","Game Review läuft …","Stockfish bewertet jeden Zug. Du kannst schon blättern.",true);
  let res;try{res=await reviewCore(g,R,i=>{if(game===gm&&(i%3===0))render()},()=>game===gm)}catch(e){if(game===gm)setStatus("bad","Stockfish konnte nicht geladen werden","Ohne Engine ist kein Review möglich.");return}
  if(!res)return;
  if(game===gm){render();if(view>0||gm.vari){replayStatus()}else{const N=playerNames();setStatus("view","Game Review fertig",g.foreign?`Genauigkeit: ${N.w} ${R.acc.w.toFixed(1)} · ${N.b} ${R.acc.b.toFixed(1)}. Mit → oder »Moment ▶« durch die Partie.`:`Deine Genauigkeit: ${R.acc[g.color].toFixed(1)} % (geschätzte Spielstärke ≈ ${eloTxt(R,g.color)}). ${res.added?res.added+(res.added===1?" Fehler wurde":" Fehler wurden")+" als Übung gespeichert (Training → Deine Fehler).":"Keine groben Fehler – stark!"}`,true)}}
  renderTabbar();
}
/* Bewertet eine Partie mit Stockfish (ohne Brett), klassifiziert jeden Zug wie ein Game Review
   (Brillant, Großartig, Bester Zug, Exzellent, Gut, Buch, Ungenau, Fehler, Verpasst, Patzer, Erzwungen),
   speichert das Review und eigene Fehler als Übungen */
const REV_V=3;
async function reviewCore(g,R,onStep,alive){
  R=R||{};Object.assign(R,{evals:[],cls:[],best:[],pv:[],alt:[],drops:[],doneN:0,acc:null,engine:"",v:REV_V});
  const c0=new Chess(g.fen||undefined);const F=[c0.fen()],M=[];R.fen=g.fen||null;
  for(const m of g.moves){const mv=findMove(c0,m);if(!mv)break;M.push(c0.move(mv.san));F.push(c0.fen())}
  const n=M.length,sans=M.map(m=>m.san);R.n=n;
  await Promise.all([loadSF(),ecoLoad().catch(()=>null)]);R.engine=sfName;const ms=S.set.revMs||300;
  if(!R.fen){const op0=ecoPath(F,40);R.open=op0?{eco:op0.e.eco,en:op0.e.en,ply:op0.ply}:null}
  for(let i=0;i<=n;i++){
    if(alive&&!alive())return null;
    const c=new Chess(F[i]);
    if(c.game_over()){R.evals[i]=c.in_checkmate()?(c.turn()==="w"?-10000:10000):0;R.best[i]=null;R.pv[i]=[];R.alt[i]=null}
    else{const r=await sfRun(F[i],{ms,multi:2});if(alive&&!alive())return null;
      R.evals[i]=cpOf(r.score,c.turn());R.best[i]=r.best;R.pv[i]=(r.pv||[]).slice(0,10);R.alt[i]=r.lines&&r.lines[1]?cpOf(r.lines[1].score,c.turn()):null}
    if(i>0)R.cls[i-1]=classifyMove(R,F,M,sans,i-1);
    R.doneN=i;if(onStep)onStep(i,n);
  }
  /* Startet die Partie mit Schwarz am Zug (eigene Stellung), Seiten tauschen */
  const blackFirst=new Chess(F[0]).turn()==="b";const evW=blackFirst?[0].concat(R.evals):R.evals;const bk=(blackFirst?[false]:[]).concat(R.cls.map(c=>c==="book")),fc=(blackFirst?[false]:[]).concat(R.cls.map(c=>c==="forced"));
  R.feat=reviewFeatures(evW,bk,fc);
  R.acc={w:R.feat.w?R.feat.w.acc:100,b:R.feat.b?R.feat.b.acc:100};R.phase=phaseAcc(R,F);R.doneN=n;
  R.elo={w:estElo(R,"w"),b:estElo(R,"b")};R.book=R.cls.reduce((a,c,i)=>c==="book"&&i===a?i+1:a,0);
  REV[g.id]={n,v:REV_V,fen:R.fen,evals:R.evals,cls:R.cls,best:R.best,pv:R.pv,alt:R.alt,drops:R.drops,acc:R.acc,phase:R.phase,engine:R.engine,feat:R.feat,elo:R.elo,open:R.open,book:R.book};
  const ks=Object.keys(REV);if(ks.length>30)delete REV[ks[0]];store.set("et-reviews",REV);
  let added=0;if(!g.foreign)R.cls.forEach((k,i)=>{if((k==="mist"||k==="blun"||k==="miss")&&(i%2===0?"w":"b")===g.color&&R.best[i]){const key="rv:"+g.id+":"+i;if(S.puz.some(p=>p.key===key))return;
    const bm=new Chess(F[i]).moves({verbose:true}).find(m=>m.from+m.to+(m.promotion||"")===R.best[i]);if(!bm)return;
    S.puz.unshift({key,kind:"engine",fen:F[i],best:bm.san,played:M[i].san,cls:CLS[k][0],opp:g.opp,date:g.date,opening:g.fam,url:g.url});added++}});
  S.puz=S.puz.slice(0,200);save("puz");st.reviews++;saveStats();checkBadges();gain("review");
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

/* ================= Theoriebuch: alle benannten Eröffnungen (Lichess chess-openings, CC0) ================= */
/* Deutsche Eröffnungsnamen aus den englischen Lichess-Namen.
   Familien über ein Wörterbuch, Varianten über Regeln: „Najdorf Variation“ → „Najdorf-Variante“,
   „Classical Variation“ → „Klassische Variante“, „English Attack“ → „Englischer Angriff“. Unbekanntes bleibt englisch. */
(function(root){
const FAM={"Alekhine Defense":"Aljechin-Verteidigung","Amar Opening":"Amar-Eröffnung","Amazon Attack":"Amazonen-Angriff","Amsterdam Attack":"Amsterdamer Angriff","Anderssen's Opening":"Anderssen-Eröffnung","Australian Defense":"Australische Verteidigung","Barnes Defense":"Barnes-Verteidigung","Barnes Opening":"Barnes-Eröffnung","Basque Opening":"Baskische Eröffnung","Benko Gambit":"Benko-Gambit","Benko Gambit Accepted":"Benko-Gambit, angenommen","Benko Gambit Declined":"Benko-Gambit, abgelehnt","Benoni Defense":"Benoni-Verteidigung","Bird Opening":"Bird-Eröffnung","Bishop's Opening":"Läuferspiel","Blackmar-Diemer Gambit":"Blackmar-Diemer-Gambit","Blackmar-Diemer Gambit Accepted":"Blackmar-Diemer-Gambit, angenommen","Blackmar-Diemer Gambit Declined":"Blackmar-Diemer-Gambit, abgelehnt","Blumenfeld Countergambit":"Blumenfeld-Gambit","Blumenfeld Countergambit Accepted":"Blumenfeld-Gambit, angenommen","Bogo-Indian Defense":"Bogoljubow-Indisch","Bongcloud Attack":"Bongcloud-Angriff","Borg Defense":"Borg-Verteidigung","Canard Opening":"Canard-Eröffnung","Caro-Kann Defense":"Caro-Kann","Carr Defense":"Carr-Verteidigung","Catalan Opening":"Katalanisch","Center Game":"Mittelgambit","Center Game Accepted":"Mittelgambit, angenommen","Clemenz Opening":"Clemenz-Eröffnung","Colle System":"Colle-System","Creepy Crawly Formation":"Creepy-Crawly-Aufbau","Czech Defense":"Tschechische Verteidigung","Danish Gambit":"Nordisches Gambit","Danish Gambit Accepted":"Nordisches Gambit, angenommen","Danish Gambit Declined":"Nordisches Gambit, abgelehnt","Dresden Opening":"Dresdner Eröffnung","Duras Gambit":"Duras-Gambit","Dutch Defense":"Holländisch","Döry Defense":"Döry-Verteidigung","East Indian Defense":"Ostindische Verteidigung","Elephant Gambit":"Elefantengambit","English Defense":"Englische Verteidigung","English Opening":"Englisch","English Orangutan":"Orang-Utan (Englisch)","Englund Gambit":"Englund-Gambit","Englund Gambit Declined":"Englund-Gambit, abgelehnt","Formation":"Aufbau","Four Knights Game":"Vierspringerspiel","French Defense":"Französisch","Fried Fox Defense":"Fried-Fox-Verteidigung","Global Opening":"Global-Eröffnung","Goldsmith Defense":"Goldsmith-Verteidigung","Grob Opening":"Grob-Angriff","Grünfeld Defense":"Grünfeld-Indisch","Gunderam Defense":"Gunderam-Verteidigung","Hippopotamus Defense":"Nilpferd-Verteidigung","Horwitz Defense":"Horwitz-Verteidigung","Hungarian Opening":"Ungarische Eröffnung","Indian Defense":"Indische Verteidigung","Irish Gambit":"Irisches Gambit","Italian Game":"Italienisch","Kangaroo Defense":"Känguru-Verteidigung","King's Gambit":"Königsgambit","King's Gambit Accepted":"Königsgambit, angenommen","King's Gambit Declined":"Königsgambit, abgelehnt","King's Indian Attack":"Königsindischer Angriff","King's Indian Defense":"Königsindisch","King's Knight Opening":"Königsspringerspiel","King's Pawn Game":"Königsbauernspiel","King's Pawn Opening":"Königsbauerneröffnung","Kádas Opening":"Kádas-Eröffnung","Lasker Simul Special":"Lasker-Simultan-Spezial","Latvian Gambit":"Lettisches Gambit","Latvian Gambit Accepted":"Lettisches Gambit, angenommen","Lemming Defense":"Lemming-Verteidigung","Lion Defense":"Löwen-Verteidigung","London System":"Londoner System","Marienbad System":"Marienbader System","Mexican Defense":"Mexikanische Verteidigung","Mieses Opening":"Mieses-Eröffnung","Mikenas Defense":"Mikenas-Verteidigung","Modern Defense":"Moderne Verteidigung","Montevideo Defense":"Montevideo-Verteidigung","Neo-Grünfeld Defense":"Neo-Grünfeld-Indisch","Nimzo-Indian Defense":"Nimzowitsch-Indisch","Nimzo-Larsen Attack":"Nimzowitsch-Larsen-Angriff","Nimzowitsch Defense":"Nimzowitsch-Verteidigung","Old Indian Defense":"Altindisch","Owen Defense":"Owen-Verteidigung","Paleface Attack":"Bleichgesicht-Angriff","Petrov's Defense":"Russisch (Petrow)","Philidor Defense":"Philidor-Verteidigung","Pirc Defense":"Pirc-Ufimzew","Polish Defense":"Polnische Verteidigung","Polish Opening":"Polnische Eröffnung","Ponziani Opening":"Ponziani-Eröffnung","Portuguese Opening":"Portugiesische Eröffnung","Pseudo Queen's Indian Defense":"Pseudo-Damenindisch","Pterodactyl Defense":"Pterodaktylus-Verteidigung","Queen's Gambit":"Damengambit","Queen's Gambit Accepted":"Angenommenes Damengambit","Queen's Gambit Declined":"Abgelehntes Damengambit","Queen's Indian Accelerated":"Beschleunigtes Damenindisch","Queen's Indian Defense":"Damenindisch","Queen's Pawn Game":"Damenbauernspiel","Queen's Pawn":"Damenbauernspiel","Rapport-Jobava System":"Rapport-Jobava-System","Rat Defense":"Ratten-Verteidigung","Richter-Veresov Attack":"Richter-Weressow-Angriff","Robatsch Defense":"Robatsch-Verteidigung","Rubinstein Opening":"Rubinstein-Eröffnung","Ruy Lopez":"Spanisch","Réti Opening":"Réti-Eröffnung","Saragossa Opening":"Saragossa-Eröffnung","Scandinavian Defense":"Skandinavisch","Scotch Game":"Schottisch","Semi-Slav Defense":"Halbslawisch","Semi-Slav Defense Accepted":"Halbslawisch, angenommen","Sicilian Defense":"Sizilianisch","Slav Defense":"Slawisch","Slav Indian":"Slawisch-Indisch","Sodium Attack":"Natrium-Angriff","St. George Defense":"St.-Georgs-Verteidigung","Tarrasch Defense":"Tarrasch-Verteidigung","Three Knights Opening":"Dreispringerspiel","Torre Attack":"Torre-Angriff","Trompowsky Attack":"Trompowsky-Angriff","Valencia Opening":"Valencia-Eröffnung","Van Geet Opening":"Van-Geet-Eröffnung","Van't Kruijs Opening":"Van't-Kruijs-Eröffnung","Vienna Gambit":"Wiener Gambit","Vienna Game":"Wiener Partie","Vulture Defense":"Geier-Verteidigung","Wade Defense":"Wade-Verteidigung","Ware Defense":"Ware-Verteidigung","Ware Opening":"Ware-Eröffnung","Yusupov-Rubinstein System":"Jussupow-Rubinstein-System","Zaire Defense":"Zaire-Verteidigung","Zukertort Defense":"Zukertort-Verteidigung","Zukertort Opening":"Zukertort-Eröffnung","Giuoco Piano":"Giuoco Piano","Two Knights Defense":"Zweispringerspiel im Nachzug"};
/* Kopfwörter mit Genus: f/m/n */
const HEAD={Variations:["Varianten","p"],Lines:["Linien","p"],Attacks:["Angriffe","p"],Variation:["Variante","f"],Attack:["Angriff","m"],Gambit:["Gambit","n"],Defense:["Verteidigung","f"],System:["System","n"],Line:["Linie","f"],Countergambit:["Gegengambit","n"],Counterattack:["Gegenangriff","m"],Formation:["Aufbau","m"],Trap:["Falle","f"],Opening:["Eröffnung","f"],Game:["Partie","f"],Setup:["Aufbau","m"],Structure:["Struktur","f"],Complex:["Komplex","m"],Bind:["Klammer","f"],Retreat:["Rückzug","m"],Sacrifice:["Opfer","n"],Approach:["Ansatz","m"],Plan:["Plan","m"],Continuation:["Fortsetzung","f"],Expansion:["Ausdehnung","f"],Center:["Zentrum","n"],Wall:["Mauer","f"],Fianchetto:["Fianchetto","n"]};
/* Adjektive (Stamm) – werden nach Genus gebeugt; Städte enden auf -er und bleiben ungebeugt */
const ADJ={Classical:"klassisch",Modern:"modern",Closed:"geschlossen",Open:"offen",Normal:"normal",Orthodox:"orthodox",Symmetrical:"symmetrisch",Accelerated:"beschleunigt",Reversed:"umgekehrt",Quiet:"ruhig",Traditional:"traditionell",Positional:"positionell",Delayed:"verzögert",Central:"zentral",Old:"alt",English:"englisch",Spanish:"spanisch",Russian:"russisch",Austrian:"österreichisch",Czech:"tschechisch",Yugoslav:"jugoslawisch",Scotch:"schottisch",Sicilian:"sizilianisch",Dutch:"holländisch",Indian:"indisch",Scandinavian:"skandinavisch",French:"französisch",Italian:"italienisch",Polish:"polnisch",Hungarian:"ungarisch",Danish:"nordisch",Swedish:"schwedisch",Norwegian:"norwegisch",Swiss:"schweizerisch",Hanham:"Hanham",Main:"Haupt",Double:"doppelt",Exchange:"Abtausch",Advance:"Vorstoß",Short:"kurz",Long:"lang",Little:"klein",Great:"groß",Big:"groß",Small:"klein",Wild:"wild",Mad:"verrückt",Hyper:"hyper",Pseudo:"pseudo",Semi:"halb",Neo:"neo",New:"neu",Rare:"selten",Early:"früh",Wing:"Flügel",Kingside:"Königsflügel",Queenside:"Damenflügel",Poisoned:"vergiftet",Fake:"falsch",Lesser:"klein",Romantic:"romantisch",Aggressive:"aggressiv",Solid:"solide",Sharp:"scharf",Hybrid:"hybrid",Universal:"universell",Improved:"verbessert",Refined:"verfeinert",Anti:"Anti",Inverted:"umgekehrt",Extended:"erweitert",Deferred:"verzögert",Black:"schwarz",White:"weiß",Royal:"königlich",African:"afrikanisch",American:"amerikanisch",Argentine:"argentinisch",Brazilian:"brasilianisch",Canadian:"kanadisch",Chinese:"chinesisch",Mexican:"mexikanisch",Portuguese:"portugiesisch",Greek:"griechisch",Icelandic:"isländisch",Irish:"irisch",Scottish:"schottisch",Welsh:"walisisch",Siberian:"sibirisch",Ukrainian:"ukrainisch",Rousseau:"Rousseau",Latvian:"lettisch",Lithuanian:"litauisch",Estonian:"estnisch",Finnish:"finnisch",German:"deutsch",Belgian:"belgisch",Japanese:"japanisch",Korean:"koreanisch",Australian:"australisch",Venezuelan:"venezolanisch",Peruvian:"peruanisch",Uruguayan:"uruguayisch",Colombian:"kolumbianisch",Cuban:"kubanisch",Bulgarian:"bulgarisch",Romanian:"rumänisch",Serbian:"serbisch",Croatian:"kroatisch",Slovak:"slowakisch",Slav:"slawisch",Catalan:"katalanisch",Basque:"baskisch",Venetian:"venezianisch",Arabian:"arabisch",Persian:"persisch",Egyptian:"ägyptisch",Hippopotamus:"Nilpferd"};
const CITY={Berlin:"Berliner",Vienna:"Wiener",London:"Londoner",Leningrad:"Leningrader",Moscow:"Moskauer",Paris:"Pariser",Prague:"Prager",Budapest:"Budapester",Hamburg:"Hamburger",Dresden:"Dresdner",Riga:"Rigaer",Warsaw:"Warschauer",Amsterdam:"Amsterdamer",Marienbad:"Marienbader",Karlsbad:"Karlsbader",Rotterdam:"Rotterdamer",Copenhagen:"Kopenhagener",Stockholm:"Stockholmer",Zurich:"Züricher",Nuremberg:"Nürnberger",Breslau:"Breslauer",Hastings:"Hastings",Cambridge:"Cambridge",Chicago:"Chicago",Kiev:"Kiewer",Odessa:"Odessaer",Baku:"Bakuer",Cologne:"Kölner",Munich:"Münchner",Frankfurt:"Frankfurter",Leipzig:"Leipziger",Petersburg:"Petersburger",Belgrade:"Belgrader",Zagreb:"Zagreber",Bucharest:"Bukarester",Rome:"Römer",Venice:"Venezianer",Milan:"Mailänder",Madrid:"Madrider",Lisbon:"Lissabonner",Oslo:"Osloer",Helsinki:"Helsinkier",Tallinn:"Tallinner",Vilnius:"Vilniuser",Minsk:"Minsker",Lvov:"Lemberger",Lviv:"Lemberger",Krakow:"Krakauer",Graz:"Grazer",Linz:"Linzer",Basel:"Basler",Bern:"Berner",Geneva:"Genfer",Brussels:"Brüsseler",Antwerp:"Antwerpener",Utrecht:"Utrechter",Leiden:"Leidener"};
/* Hauptwort-Stämme für Komposita: „Exchange Variation“ → „Abtauschvariante“ */
const STEM={Exchange:"Abtausch",Advance:"Vorstoß",Main:"Haupt",Knight:"Springer",Knights:"Springer",Bishop:"Läufer",Bishops:"Läufer",Queen:"Damen",King:"Königs",Rook:"Turm",Pawn:"Bauern",Pawns:"Bauern",Wing:"Flügel",Center:"Zentrums",Centre:"Zentrums",Fianchetto:"Fianchetto",Counter:"Gegen",Kingside:"Königsflügel",Queenside:"Damenflügel",Stonewall:"Stonewall",Hedgehog:"Igel",Dragon:"Drachen",Hippopotamus:"Nilpferd",Hippo:"Nilpferd",Tiger:"Tiger",Rat:"Ratten",Mouse:"Maus",Bear:"Bären",Lion:"Löwen",Hedge:"Hecken",Cow:"Kuh",Monkey:"Affen",Elephant:"Elefanten",Snake:"Schlangen",Spider:"Spinnen",Frog:"Frosch",Ice:"Eis",Fire:"Feuer",Pin:"Fessel",Wall:"Mauer",Castle:"Rochade",Castling:"Rochade",Retreat:"Rückzug",Development:"Entwicklungs",Panther:"Panther",Shark:"Hai",Swan:"Schwan",Fork:"Gabel",Battery:"Batterie"};
const NUM={Two:"Zwei",Three:"Drei",Four:"Vier",Five:"Fünf"};
const WORD={Sideline:"Nebenvariante",Accepted:"angenommen",Declined:"abgelehnt",Refused:"abgelehnt",Deferred:"verzögert",Delayed:"verzögert",Reversed:"mit vertauschten Farben",with:"mit",without:"ohne",and:"und",or:"oder",the:"",The:"",of:"",Main:"Haupt",Line:"Linie"};
const PIECE={N:"S",B:"L",R:"T",Q:"D",K:"K"};
const san=w=>/^(\d+\.+)?[NBRQK]?[a-h]?[1-8]?x?[a-h][1-8](=[NBRQ])?[+#]?$|^O-O(-O)?[+#]?$|^\d\.$/.test(w)?w.replace(/[NBRQK](?=[a-hx1-8])/g,c=>PIECE[c]).replace(/=([NBRQ])/,(m,c)=>"="+PIECE[c]):null;
function decl(stem,g){if(/(er|Haupt|Abtausch|Vorstoß|Flügel|Anti|Königsflügel|Damenflügel|Nilpferd|Rousseau|Hanham)$/.test(stem)&&!/^(ander|sauber)$/.test(stem))return null;return stem+(g==="f"||g==="p"?"e":g==="m"?"er":"es")}
/* einen Kommateil übersetzen */
const PHRASE=[["King's English","Königsenglisch"],["New York","New-York"],["Defensive System","Verteidigungssystem"],["Hedgehog System","Igelsystem"],["Main Line","Hauptvariante"],["Mainline","Hauptvariante"],["Pawn Storm","Bauernsturm"],["Poisoned Pawn","Vergifteter Bauer"],["Big Clamp","Große Klammer"],["Rossolimo","Rossolimo"]];
function part(p){
  p=p.trim();if(!p)return p;PHRASE.forEach(([a,b])=>{if(p.indexOf(a)>=0&&a!==b&&!(a==="Main Line"&&p==="Main Line"))p=p.split(a).join(b)});
  if(p==="Hauptvariante")return p;
  if(p==="Main Line")return "Hauptvariante";if(p==="Main Line Accepted")return "Hauptvariante, angenommen";
  const w=p.split(/\s+/);
  // „with …“, „without …“ und reine Zugangaben
  if(w[0]==="with"||w[0]==="without")return (w[0]==="with"?"mit ":"ohne ")+part(w.slice(1).join(" "));
  if(w.every(x=>san(x)))return w.map(san).join(" ");
  // Kopfwort suchen (letztes Wort, das ein HEAD ist)
  let hi=-1;for(let i=w.length-1;i>=0;i--){if(HEAD[w[i]]){hi=i;break}if(!/^(Accepted|Declined|Refused|Deferred|Reversed)$/.test(w[i]))break}
  const tail=w.slice(hi+1).map(x=>WORD[x]||x).filter(Boolean);
  if(w.length===1&&ADJ[w[0]]&&/^[a-zäöü]/.test(ADJ[w[0]])){const a=decl(ADJ[w[0]],"f")||ADJ[w[0]];return a[0].toUpperCase()+a.slice(1)+" Variante"}
  if(w.length===1&&CITY[w[0]])return CITY[w[0]]+" Variante";
  if(hi<0)return w.map(x=>san(x)||WORD[x]||(ADJ[x]&&/^[a-zäöü]/.test(ADJ[x])?ADJ[x]:x)).join(" ");
  const [hd,g]=HEAD[w[hi]];const pre=w.slice(0,hi);
  // Zahlwort + Springer/Läufer: „Two Knights“ → „Zweispringer“
  const adjs=[],stems=[],names=[];
  for(let i=0;i<pre.length;i++){const x=pre[i].replace(/'s$/,"");
    if(NUM[x]&&STEM[(pre[i+1]||"").replace(/'s$/,"")]){stems.push(NUM[x]+STEM[pre[i+1].replace(/'s$/,"")].toLowerCase());i++;continue}
    if(CITY[x]){adjs.push(CITY[x]);continue}
    if(STEM[x]&&!names.length&&(i===pre.length-1||STEM[(pre[i+1]||"").replace(/'s$/,"")]||NUM[pre[i+1]])){stems.push(STEM[x]);continue}
    if(ADJ[x]&&/^[a-zäöü]/.test(ADJ[x])&&!names.length&&!stems.length){adjs.push(decl(ADJ[x],g)||ADJ[x]);continue}
    if(STEM[x]){stems.push(STEM[x]);continue}
    names.push(san(x)||x)}
  let noun;
  if(names.length)noun=names.concat(stems).join("-")+"-"+hd;
  else if(stems.length){const s=stems.join("");noun=s+(/[a-zäöüß]$/.test(s)?hd.toLowerCase():"-"+hd);noun=noun[0].toUpperCase()+noun.slice(1)}
  else noun=hd;
  const out=(adjs.length?adjs.map(a=>a[0].toUpperCase()+a.slice(1)).join(" ")+" ":"")+noun;
  return out+(tail.length?", "+tail.join(" "):"");
}
function deName(en){
  if(!en)return en;const i=en.indexOf(":");let fam=i<0?en:en.slice(0,i),rest=i<0?"":en.slice(i+1);
  // „French Defense, Classical, 4. Bg5“: Familie bis zum ersten Komma, falls nur der Teil bekannt ist
  if(!FAM[fam]&&fam.indexOf(",")>0&&FAM[fam.split(",")[0]]){rest=fam.slice(fam.indexOf(",")+1)+(rest?","+rest:"");fam=fam.split(",")[0]}
  const f=FAM[fam]||part(fam);
  if(!rest.trim())return f;
  // Zugangaben wie „4. Bg5“ zusammenhalten
  const parts=rest.split(",").map(s=>s.trim()).filter(Boolean);const tr=[];
  for(let k=0;k<parts.length;k++){let p=parts[k];tr.push(part(p))}
  return f+": "+tr.join(", ");
}
root.deName=deName;
if(typeof module!=="undefined")module.exports={deName};
})(typeof window!=="undefined"?window:globalThis);

const ECO={ready:false,loading:null,list:[],byHash:new Map(),pos:null,fams:null};
const h32=s=>{let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)}return h>>>0};
const posH=fen=>h32(fen.split(" ").slice(0,4).join(" "));
/* eco.js wird erst geladen, wenn es gebraucht wird (Analyse, Review, Lexikon) */
function ecoLoad(){
  if(ECO.ready)return Promise.resolve(ECO);
  if(!ECO.loading)ECO.loading=new Promise((res,rej)=>{
    if(window.ECO_DB){try{ecoParse();res(ECO)}catch(e){rej(e)}return}
    const sc=document.createElement("script");sc.src="eco.js";sc.async=true;
    sc.onload=()=>{try{ecoParse();res(ECO)}catch(e){ECO.loading=null;rej(e)}};sc.onerror=()=>{ECO.loading=null;sc.remove();rej(new Error("eco"))};document.head.appendChild(sc)});
  return ECO.loading;
}
function ecoParse(){
  const D=window.ECO_DB;
  ECO.list=D.e.split("\n").map((l,i)=>{const t=l.split("\t");return {i,eco:t[0],en:t[1],de:deName(t[1]),m:t[2]?t[2].split(" "):[],h:parseInt(t[3],36)}});
  ECO.list.forEach(e=>{const x=ECO.byHash.get(e.h);if(!x||e.m.length<x.m.length)ECO.byHash.set(e.h,e)});
  const b=atob(D.p);const u=new Uint32Array(b.length>>2);for(let i=0;i<u.length;i++)u[i]=(b.charCodeAt(i*4)|(b.charCodeAt(i*4+1)<<8)|(b.charCodeAt(i*4+2)<<16)|(b.charCodeAt(i*4+3)<<24))>>>0;
  ECO.pos=new Set(u);ECO.ready=true;
}
const ecoAt=fen=>ECO.ready?ECO.byHash.get(posH(fen))||null:null;
const ecoIn=fen=>ECO.ready&&ECO.pos.has(posH(fen));
/* tiefste benannte Stellung entlang einer Zugfolge (Zugumstellungen werden erkannt) */
function ecoPath(fl,upto){let best=null,ply=0;if(!ECO.ready)return null;const n=Math.min(fl.length-1,upto==null?60:upto);for(let i=1;i<=n;i++){const e=ecoAt(fl[i]);if(e){best=e;ply=i}}return best?{e:best,ply}:null}
/* Theoriezüge in einer Stellung: alle Züge, die zu einer Stellung aus dem Buch führen */
function ecoMoves(fen,path){
  if(!ECO.ready)return [];const g=new Chess(fen);const out=[];
  /* Gewicht: wie viele benannte Varianten hinter dem Zug liegen (bei bekannter Zugfolge) */
  const sub=san=>{if(!path)return 0;const pre=path.concat(san);let n=0;ECO.list.forEach(e=>{if(e.m.length<pre.length)return;for(let i=0;i<pre.length;i++)if(e.m[i]!==pre[i])return;n++});return n};
  g.moves({verbose:true}).forEach(m=>{g.move(m);const f=g.fen();if(ecoIn(f))out.push({san:m.san,uci:m.from+m.to+(m.promotion||""),e:ecoAt(f),n:sub(m.san)});g.undo()});
  return out.sort((a,b)=>b.n-a.n||(b.e?1:0)-(a.e?1:0));
}
const ecoFam=e=>e?deName(e.en.split(":")[0].split(",")[0]):"";
const ecoShort=e=>{if(!e)return "";const d=e.de;return d.length>70?d.slice(0,68)+"…":d};

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
  if(!R.fen&&k<40&&(ECO.ready?ecoIn(F[k+1])&&(k===0||R.cls[k-1]==="book"):anyBook(sans.slice(0,k+1))))return "book";
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
/*FEAT-START*/
/* Kennzahlen je Seite aus den Bewertungen (aus Sicht von Weiß, ein Wert pro Stellung):
   Genauigkeit wie bei Lichess (Mittel aus volatilitätsgewichtetem und harmonischem Mittel),
   Ø Centipawn-Verlust und Fehlerquoten ohne Buch- und erzwungene Züge */
function reviewFeatures(ev,book,forced){
  const wp=ev.map(v=>winPct(v==null?0:v));const n=ev.length-1;const out={w:{n:0,loss:0,blun:0,mist:0,inacc:0,acc:[],wts:[]},b:{n:0,loss:0,blun:0,mist:0,inacc:0,acc:[],wts:[]}};
  if(n<1)return {w:null,b:null};
  const ws=Math.max(2,Math.min(8,Math.floor(n/10)));const wins=[];const first=wp.slice(0,ws);for(let i=0;i<Math.min(ws,wp.length)-2;i++)wins.push(first);for(let i=0;i+ws<=wp.length;i++)wins.push(wp.slice(i,i+ws));
  const sd=a=>{const m=a.reduce((x,y)=>x+y,0)/a.length;return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/a.length)};
  const W=wins.map(a=>Math.max(.5,Math.min(12,sd(a))));const cl=v=>Math.max(-1000,Math.min(1000,v==null?0:v));
  for(let k=0;k<n;k++){const s=k%2===0?"w":"b";const o=out[s];
    const before=s==="w"?wp[k]:100-wp[k],after=s==="w"?wp[k+1]:100-wp[k+1];
    const a=after>=before?100:Math.max(0,Math.min(100,103.1668*Math.exp(-0.04354*(before-after))-3.1669+1));
    o.acc.push(a);o.wts.push(W[Math.min(k,W.length-1)]);
    if((book&&book[k])||(forced&&forced[k]))continue;
    const cb=s==="w"?cl(ev[k]):-cl(ev[k]),ca=s==="w"?cl(ev[k+1]):-cl(ev[k+1]);
    o.n++;o.loss+=Math.max(0,cb-ca);const d=before-after;if(d>=20)o.blun++;else if(d>=10)o.mist++;else if(d>=5)o.inacc++;
  }
  const fin=o=>{const A=o.acc;if(!A.length)return null;const sw=o.wts.reduce((x,y)=>x+y,0);const wm=A.reduce((x,a,i)=>x+a*o.wts[i],0)/sw;const hm=A.length/A.reduce((x,a)=>x+1/Math.max(1,a),0);
    return {acc:(wm+hm)/2,acpl:o.n?o.loss/o.n:0,n:o.n,blun:o.blun,mist:o.mist,inacc:o.inacc,moves:A.length}};
  return {w:fin(out.w),b:fin(out.b)};
}
/*FEAT-END*/
/* Geschätzte Spielstärke in einer Partie (Lichess-Skala). Angepasst an 640 gewertete Lichess-Partien (1.280 Spieler,
   Wertung 780–2590), jede Stellung mit Stockfish 17.1 bewertet wie im Game Review, geprüft mit 5-facher Kreuzvalidierung:
   mittlerer Fehler 280 Punkte (bisherige Formel 553, „immer Durchschnitt“ 372). Eingänge: eigener und gegnerischer
   Ø Centipawn-Verlust (ohne Buch- und erzwungene Züge) und die Partielänge. Mehr Kennzahlen brachten keinen Gewinn. */
const ELO_W=[3668.447,-331.93,-199.401,35.834];const ELO_MAE=280;
function featOf(R){if(R.feat)return R.feat;if(!R.evals||!R.cls||R.fen)return null;try{R.feat=reviewFeatures(R.evals,R.cls.map(c=>c==="book"),R.cls.map(c=>c==="forced"))}catch(e){return null}return R.feat}
function estElo(R,s){const F=featOf(R);const f=F&&F[s],o=F&&F[s==="w"?"b":"w"];if(!f||!o||f.n<5)return null;const L=x=>Math.log(x+10);
  const x=[1,L(f.acpl),L(o.acpl),Math.log(Math.max(10,(R.evals||[]).length-1))];
  const v=ELO_W.reduce((a,w,i)=>a+w*x[i],0);return Math.round(Math.max(400,Math.min(2900,v))/25)*25}
function eloTxt(R,s){const e=estElo(R,s);return e?e+" Elo":"–"}
/* Spielstärke über mehrere Partien: Mittel der Einzelschätzungen (der Fehler schrumpft mit der Zahl der Partien) */
function strengthHtml(){
  const rv=myReviews().map(x=>estElo(x.R,x.c)).filter(Boolean).slice(0,20);if(rv.length<2)return "";
  const n=rv.length,avg=rv.reduce((a,b)=>a+b,0)/n,err=Math.round(ELO_MAE/Math.sqrt(n)/25)*25;const r5=rv.slice(0,Math.min(5,n)),o5=rv.slice(Math.min(5,n));
  const tr=o5.length>=3?Math.round((r5.reduce((a,b)=>a+b,0)/r5.length-o5.reduce((a,b)=>a+b,0)/o5.length)/25)*25:null;
  return `<div class="card strength"><div class="sec-h" style="margin:0 0 8px"><h3>Geschätzte Spielstärke</h3><small>aus ${n} analysierten Partien</small></div>
    <div class="str-row"><b>≈ ${Math.round(avg/25)*25}</b><span>Spanne etwa ${Math.round((avg-err)/25)*25}–${Math.round((avg+err)/25)*25}${tr!=null?` · Trend der letzten 5 Partien: <em class="${tr>=0?"up":"down"}">${tr>=0?"+":""}${tr}</em>`:""}</span></div>
    <p class="hint" style="margin:6px 0 0">Berechnet aus deinem Ø Centipawn-Verlust (und dem deiner Gegner) in den Game Reviews, abgeglichen mit 640 echten Lichess-Partien bekannter Wertung (Lichess-Skala). Eine einzelne Partie schwankt stark – je mehr Partien, desto genauer.</p></div>`;
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
/* Bedenkzeit des Halbzugs k (Sekunden) aus den Restzeiten */
function spentAt(G,k){const c=G&&G.clk;if(!c||c[k]==null)return null;const inc=(G.tcb&&G.tcb.inc)||0;const prev=k>=2?c[k-2]:G.tcb?G.tcb.base:null;if(prev==null)return null;return Math.max(0,prev-c[k]+inc)}
const fmtSec=t=>{if(t==null)return "–";if(t<10)return t.toFixed(1).replace(".",",")+" s";if(t<60)return Math.round(t)+" s";const m=Math.floor(t/60),ss=Math.round(t%60);return m>=60?Math.floor(m/60)+":"+String(m%60).padStart(2,"0")+" h":m+":"+String(ss).padStart(2,"0")+" min"};
function timeStats(G,R){
  const c=G&&G.clk;if(!c)return null;const out={w:{sum:0,n:0,max:0,maxK:-1,tn:0,tnErr:0},b:{sum:0,n:0,max:0,maxK:-1,tn:0,tnErr:0}};const base=G.tcb?G.tcb.base:Math.max(c[0]||0,c[1]||0);
  for(let k=0;k<c.length;k++){const s=k%2===0?"w":"b";const t=spentAt(G,k);if(t==null)continue;const o=out[s];o.sum+=t;o.n++;if(t>o.max){o.max=t;o.maxK=k}
    const low=c[k-2]!=null?c[k-2]:base;const crit=Math.max(20,base*.1);if(low<crit){o.tn++;if(R&&["mist","blun","miss"].indexOf(R.cls[k])>=0)o.tnErr++}}
  return out;
}
/* Coach-Blase im Review */
function paintCoach(c){const co=$("coach");co.style.setProperty("--k",REV_COL[c]);const f=$("face");f.innerHTML=`<b style="font-size:${CLS[c][2].length>1?13:16}px;color:#fff">${CLS[c][2]}</b>`;f.style.background=REV_COL[c]}
function replayStatus(){
  if(game&&game.free){freeStatus();return}
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
    ${["inacc","mist","blun","miss"].indexOf(I.c)>=0&&I.replyLine?`<p class="leads">Erwartete Fortsetzung nach ${esc(I.san)}: ${esc(I.replyLine)}</p>`:""}
    ${spentAt(game,k)!=null?`<p class="rvtime">⏱ ${fmtSec(spentAt(game,k))} Bedenkzeit · noch ${fmtSec(game.clk[k])} auf der Uhr</p>`:""}</div>`;
}
const engCache=new Map(),evCache=new Map(),engPend=new Set();
/* Theorie zur aktuellen Stellung: Name der Eröffnung und Buchzüge */
const THEO={all:false};
function theoryHtml(compact){
  if(!ECO.ready){ecoLoad().then(()=>{if(mode==="replay"&&tab==="ex")renderExplain()}).catch(()=>{});return ""}
  if(game&&game.fen&&!game.free)return "";
  const fl=fens.slice(0,view+1);const p=ecoPath(fl);const here=ecoAt(fens[view]);const inBook=view===0||ecoIn(fens[view]);
  const mv=inBook?ecoMoves(fens[view],game&&game.fen?null:hist.slice(0,view)):[];
  const cur=p?p.e.de:"";const rest=x=>{if(!x.e)return "Theorie";const d=x.e.de;if(cur&&d.indexOf(cur+", ")===0)return d.slice(cur.length+2);if(cur&&d===cur)return "Hauptlinie";return d.replace(/^[^:]*: /,"")||d};
  const more=mv.length>5&&!THEO.all;
  if(compact&&!p)return "";
  if(compact)return `<div class="excard theo"><div class="exh"><span>Eröffnung</span><span>${esc(p.e.eco)}</span></div><p class="theo-n"><b>${esc(p.e.de)}</b>${here?"":` <small>(bis Zug ${Math.ceil(p.ply/2)})</small>`}</p>${inBook&&mv.length?`<div class="theo-mv">${mv.slice(0,8).map(x=>`<button class="chip" data-tu="${x.uci}" title="${esc(x.e?x.e.de:"Theorie")}">${esc(fmtMoves([x.san],view))}</button>`).join("")}</div>`:""}</div>`;
  return `<div class="excard theo"><div class="exh"><span>Theorie</span><span>${p?esc(p.e.eco):""}</span></div>
    ${p?`<p class="theo-n"><b>${esc(p.e.de)}</b>${p.e.de!==p.e.en?`<small>${esc(p.e.en)}</small>`:""}</p>`:`<p class="sub">Grundstellung</p>`}
    ${inBook?(mv.length?`<div class="theo-l">${mv.slice(0,more?5:40).map(x=>`<button class="theo-r" data-tu="${x.uci}"><b>${esc(fmtMoves([x.san],view))}</b><span>${esc(rest(x))}</span>${x.n>1?`<small>${x.n}</small>`:""}</button>`).join("")}${more?`<button class="linkb" data-theoall="1">Alle ${mv.length} Theoriezüge</button>`:""}</div>`:`<p class="sub">Ende der bekannten Theorie.</p>`):`<p class="sub">Diese Stellung steht nicht mehr im Theoriebuch${p?` – zuletzt bekannt nach Zug ${Math.ceil(p.ply/2)}`:""}.</p>`}</div>`;
}
let lastIdeas="";
function engArrow(){if(mode!=="replay"||S.set.engArrow===false||blindOn)return "";const r=engCache.get(shown.fen());const u=r&&r.lines&&r.lines[0]&&r.lines[0].pv[0];if(!u)return "";
  const R=game&&game.review;if(R&&view>0&&inMainMove(view-1)&&R.best[view-1]&&["inacc","mist","blun","miss"].indexOf(R.cls[view-1])>=0)return "";
  return arrowPath(u.slice(0,2),u.slice(2,4),"rgba(64,128,226,.78)",.15)}
function engineLinesHtml(){return `<div class="excard"><div class="exh"><span>Stockfish · beste Züge</span><span id="engInfo"></span></div><div id="engLines">${SKEL}</div></div>`}
const DEEP={fen:"",on:false};
function fillEngineLines(){
  const el=$("engLines");if(!el)return;const fen=shown.fen();const g=new Chess(fen);
  if(DEEP.on&&DEEP.fen!==fen){try{sfW.postMessage("stop")}catch(e){}}
  if(g.game_over()){el.innerHTML=`<p class="sub">${g.in_checkmate()?"Schachmatt.":"Remis."}</p>`;return}
  const draw=r=>{if(!$("engLines")||shown.fen()!==fen)return;const turn=g.turn();
    $("engLines").innerHTML=(r.lines||[]).map(l=>{const cp=cpOf(l.score,turn);const sans=pvSan(fen,l.pv,8);if(!sans.length)return "";return `<button class="eline" data-u="${esc(l.pv[0])}"><b class="ev ${cp>=0?"w":"b"}">${fmtEv(cp)}</b><span>${esc(fmtMoves(sans,plyOf(fen)))}</span></button>`}).join("")||'<p class="sub">Keine Linien.</p>';
    const d=r.lines&&r.lines[0]?r.lines[0].depth:0;if($("engInfo"))$("engInfo").textContent=d&&d<100?"Tiefe "+d:"";
    if(shown.fen()===fen)ideasEl.innerHTML=lastIdeas+engArrow();
    $("engLines").querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>{const m=uciMove(new Chess(shown.fen()),b.dataset.u);if(m)tryMove(m.from,m.to,true,m.promotion)})};
  if(engCache.has(fen)){draw(engCache.get(fen));return}
  if(engPend.has(fen))return;
  const myView=view;setTimeout(()=>{if(view!==myView||shown.fen()!==fen||engPend.has(fen))return;engPend.add(fen);
    sfRun(fen,{ms:700,multi:3}).finally(()=>engPend.delete(fen)).then(r=>{engCache.set(fen,r);if(engCache.size>300)engCache.delete(engCache.keys().next().value);if(r.score)evCache.set(fen,cpOf(r.score,g.turn()));draw(r);deepen()}).catch(()=>{if($("engLines"))$("engLines").innerHTML='<p class="sub">Stockfish konnte nicht geladen werden.</p>'})},200);
  /* bleibt die Stellung stehen, rechnet Stockfish noch zwei Durchgänge tiefer (nicht während das Review läuft) */
  function deepen(){const R=game&&game.review;if(R&&R.doneN<(game.n||hist.length))return;let step=0;const go=()=>{if(step>=2||shown.fen()!==fen||mode!=="replay")return;const ms=step===0?2200:5000;step++;
    setTimeout(()=>{if(shown.fen()!==fen||mode!=="replay")return;engPend.add(fen);DEEP.fen=fen;DEEP.on=true;sfRun(fen,{ms,multi:3}).finally(()=>{engPend.delete(fen);DEEP.on=false}).then(r=>{const old=engCache.get(fen);if(old&&old.lines&&old.lines[0]&&r.lines&&r.lines[0]&&r.lines[0].depth<old.lines[0].depth)return;engCache.set(fen,r);if(r.score)evCache.set(fen,cpOf(r.score,g.turn()));draw(r);go()}).catch(()=>{})},400)};go()}
}
function reviewSummaryHtml(R){
  const n=game.n||R.n||hist.length,N=playerNames();
  const C={w:{},b:{}};R.cls.forEach((k,i)=>{if(!k)return;const s=i%2===0?"w":"b";C[s][k]=(C[s][k]||0)+1});
  const pts=R.evals.map((v,i)=>v==null?null:[i,winPct(v)]).filter(Boolean);const X=i=>(i/Math.max(1,n)*100).toFixed(2);
  const area=pts.length?`M0 100 ${pts.map(p=>"L"+X(p[0])+" "+(100-p[1]).toFixed(2)).join(" ")} L${X(pts[pts.length-1][0])} 100Z`:"";
  const dots=R.cls.map((c,k)=>KEY_CLS.indexOf(c)>=0&&R.evals[k+1]!=null?`<i class="gdot" style="left:${X(k+1)}%;top:${(100-winPct(R.evals[k+1])).toFixed(2)}%;background:${REV_COL[c]}"></i>`:"").join("");
  const vline=Math.min(view,game.vari?game.vari.base:view);
  const done=R.doneN>=n&&R.acc;
  const F2=R.feat||{};
  const accBox=s=>`<div class="rvacc ${s}"><small>${esc(N[s])}</small><b>${done?R.acc[s].toFixed(1):"…"}</b>${done?`<span title="${estElo(R,s)?`Geschätzte Spielstärke in dieser Partie (Lichess-Skala), Spanne etwa ${Math.max(400,estElo(R,s)-ELO_MAE)}–${estElo(R,s)+ELO_MAE}`:"Zu wenige eigene Züge für eine Schätzung"}">≈ ${eloTxt(R,s)}</span>${F2[s]?`<span class="rvx">Ø ${Math.round(F2[s].acpl)} cp Verlust</span>`:""}`:""}</div>`;
  const opn=R.open?`<div class="rvopen"><span class="eco">${esc(R.open.eco)}</span><span><b>${esc(deName(R.open.en))}</b><small>${R.book?`Theorie bis Zug ${Math.ceil(R.book/2)}`:"Früh aus der Theorie"}</small></span></div>`:"";
  const rows=REV_ORDER.map(k=>`<b>${C.w[k]||0}</b><span class="c"><span class="cls ${CLS[k][1]}">${CLS[k][2]}</span>${CLS[k][0]}</span><b>${C.b[k]||0}</b>`).join("");
  const ph=R.phase,phc=v=>v==null?'<span class="phz none">–</span>':`<span class="phz" style="background:${v>=85?REV_COL.best:v>=70?REV_COL.good:v>=55?REV_COL.inacc:REV_COL.blun}">${v.toFixed(0)}</span>`;
  const phases=ph?`<div class="rvph"><span></span><small>${esc(N.w)}</small><small>${esc(N.b)}</small>${[["o","Eröffnung"],["m","Mittelspiel"],["e","Endspiel"]].map(p=>`<span>${p[1]}</span>${phc(ph.w[p[0]])}${phc(ph.b[p[0]])}`).join("")}</div>`:"";
  const keys=R.cls.map((c,k)=>KEY_CLS.indexOf(c)>=0?`<button class="keym" data-kv="${k+1}"><span class="cls ${CLS[c][1]}">${CLS[c][2]}</span>${Math.floor(k/2)+1}${k%2?"...":"."} ${esc(de(mainMvs()[k]?mainMvs()[k].san:""))}</button>`:"").join("");
  return `<div class="excard"><div class="exh"><span>Game Review${R.doneN<n?` · analysiere ${R.doneN}/${n}`:""}</span><span>${esc(R.engine||"")}</span></div>
  ${R.doneN<n?`<div class="prog" style="margin:4px 0 10px"><i style="width:${R.doneN/n*100}%"></i></div>`:""}
  ${opn}<div class="rvaccs">${accBox("w")}${accBox("b")}</div>
  <div class="graphw"><svg class="graph" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Bewertungsverlauf – antippen springt zum Zug"><path d="${area}" fill="#F2F1EC"/><line x1="0" y1="50" x2="100" y2="50" stroke="#888" stroke-width=".4"/><line x1="${X(vline)}" y1="0" x2="${X(vline)}" y2="100" stroke="#81B64C" stroke-width=".8"/></svg>${dots}</div>
  <div class="revsum" style="margin-top:10px"><span class="sub" style="text-align:center">${esc(N.w)}</span><span></span><span class="sub" style="text-align:center">${esc(N.b)}</span>${rows}</div>
  ${done&&phases?`<div class="exh" style="margin-top:12px"><span>Genauigkeit nach Phase</span></div>${phases}`:""}
  ${(()=>{const T=timeStats(game,R);if(!T||!T.w.n||!T.b.n)return "";const row=(l,f)=>`<span>${l}</span><b>${f("w")}</b><b>${f("b")}</b>`;
    return `<div class="exh" style="margin-top:12px"><span>Zeit</span></div><div class="rvtm"><span></span><small>${esc(N.w)}</small><small>${esc(N.b)}</small>${row("Ø pro Zug",s=>fmtSec(T[s].sum/T[s].n))}${row("Längste Überlegung",s=>T[s].maxK>=0?`<button class="linkb" data-kv="${T[s].maxK+1}">${fmtSec(T[s].max)}</button>`:"–")}${row("Züge in Zeitnot",s=>T[s].tn+(T[s].tnErr?` <em>(${T[s].tnErr} Fehler)</em>`:""))}</div>`})()}
  ${keys?`<div class="exh" style="margin-top:12px"><span>Wichtige Momente</span></div><div class="keyms">${keys}</div>`:""}</div>`;
}
function wireReviewPanel(el){
  el.querySelectorAll("[data-kv]").forEach(b=>b.onclick=()=>{if(game&&game.vari)exitVari();setView(+b.dataset.kv)});
  el.querySelectorAll("[data-theoall]").forEach(b=>b.onclick=()=>{THEO.all=true;renderExplain()});
  el.querySelectorAll("[data-tu]").forEach(b=>b.onclick=()=>{THEO.all=false;const m=uciMove(new Chess(shown.fen()),b.dataset.tu);if(m)tryMove(m.from,m.to,true,m.promotion)});
  const gr=el.querySelector(".graph");if(gr)gr.onclick=e=>{const r=gr.getBoundingClientRect();const n=game.n||hist.length;if(game&&game.vari)exitVari();setView(Math.round((e.clientX-r.left)/r.width*n))};
  if(mode==="replay")fillEngineLines();
}

/* ---- Eigene Züge im Review: Analyse-Variante, Nochmal versuchen, Bester Zug ---- */
function anaMove(mv,animate){
  const G=game;if(!G)return;if(G.free){freeMove(mv,animate);return}
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
  const box=$("actsRev");if(!box)return;const R=game&&game.review;const on=mode==="replay"&&!!game&&!game.free;box.hidden=!on;if(!on)return;
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
function famOfMoves(moves){let bestN=3,fam="Unbekannte Eröffnung";
  if(ECO.ready){try{const g=new Chess();const fl=[g.fen()];for(const m of moves.slice(0,30)){if(!g.move(m))break;fl.push(g.fen())}const p=ecoPath(fl,30);if(p)fam=ecoFam(p.e)}catch(e){}}ALL.forEach(o=>{if(o.g==="c"||!o.lines)return;o.lines.forEach(l=>{let i=0;while(i<l.m.length&&i<moves.length&&strip(l.m[i])===strip(moves[i]))i++;if(i>bestN){bestN=i;fam=o.name}})});return fam}
function anaFromPgn(pgn){
  const H=k=>pgnHeader(pgn,k);const moves=pgnMoves(pgn);if(!moves.length)return null;if(H("FEN")&&H("SetUp")!=="0")return null;
  const W=H("White")||"Weiß",B=H("Black")||"Schwarz",res=H("Result");const u=(CH.user||"").toLowerCase();
  const color=B.toLowerCase()===u&&u?"b":"w";const r=res==="1/2-1/2"?"draw":res==="1-0"?(color==="w"?"win":"loss"):res==="0-1"?(color==="b"?"win":"loss"):"draw";
  const url=H("Link")||(/^https?:/.test(H("Site"))?H("Site"):"");
  let h=0;const key=W+B+H("Date")+moves.join("");for(let i=0;i<key.length;i++)h=(h*31+key.charCodeAt(i))|0;
  let fam=famFromName(H("Opening"));if(/Unbekannt/.test(fam))fam=famOfMoves(moves);
  return {clk:pgnClk(pgn,moves.length),tcb:tcbOf(H("TimeControl")),id:url||("pgn"+h),result:res||"",foreign:!u||(W.toLowerCase()!==u&&B.toLowerCase()!==u),color,res:r,term:"",fam,moves,tc:"",url,opp:color==="w"?B:W,oppR:+H(color==="w"?"BlackElo":"WhiteElo")||null,myR:+H(color==="w"?"WhiteElo":"BlackElo")||null,date:Date.parse((H("UTCDate")||H("Date")).replace(/\./g,"-"))||0,name:color==="w"?W:B,acc:null,white:W,black:B};
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
    try{const r=await fetch(`https://lichess.org/game/export/${li[1]}?clocks=true&evals=false`,{headers:{Accept:"application/x-chess-pgn"}});if(!r.ok)throw 0;const g=anaFromPgn(await r.text());if(!g)throw 0;msg("");reviewGame(g)}catch(e){msg("Die Lichess-Partie konnte nicht geladen werden.")}return}
  const parts=txt.replace(/\r/g,"").split(/\n\s*\n(?=\[Event )/);const g=anaFromPgn(parts[0].indexOf("[")<0&&!/\d\./.test(parts[0])?"":parts[0]);
  if(!g){msg("Das sieht nicht nach einer gültigen PGN oder einem Partie-Link aus.");return}
  msg("");reviewGame(g);
}
function anaInputHtml(){return `<div class="card"><h3>Link oder PGN</h3><p class="hint" style="margin:0 0 8px">Chess.com- oder Lichess-Link einfügen oder die PGN einer beliebigen Partie. Stockfish bewertet jeden Zug wie im Game Review.</p><textarea class="code" id="anaIn" placeholder="https://www.chess.com/game/live/… oder [Event &quot;…&quot;] 1. e4 e5 …" autocapitalize="off" spellcheck="false"></textarea><div class="btnrow" style="margin-top:8px"><button class="btn grn" id="anaGo">Analysieren</button><span class="hint" id="anaMsg"></span></div></div>`}
function wireAnaInput(){const b=$("anaGo");if(!b)return;b.onclick=async()=>{b.disabled=true;try{await analyzeInput($("anaIn").value,t=>{if($("anaMsg"))$("anaMsg").textContent=t})}finally{b.disabled=false}}}

/* ================= Taktik: Lichess-Rätsel mit Fortschrittssystem ================= */
const PZ=Object.assign({r:1200,n:0,ok:0,xp:0,hist:[],themes:{},paths:{},seen:{},fails:[],sprintBest:0,rushBest:{s5:0,surv:0},day:{date:"",n:0},streak:{last:null,n:0,best:0},goal:10},store.get("et-tac",{}));
fixT(PZ,{r:1200,n:0,ok:0,xp:0,hist:[],themes:{},paths:{},seen:{},fails:[],sprintBest:0,rushBest:{s5:0,surv:0},day:{date:"",n:0},streak:{last:null,n:0,best:0},goal:10});fixT(PZ.day,{date:"",n:0});fixT(PZ.streak,{last:"",n:0,best:0});if(PZ.streak.last==="")PZ.streak.last=null;PZ.hist=PZ.hist.filter(x=>x&&typeof x==="object");PZ.fails=PZ.fails.filter(x=>x&&x.p);for(const k in PZ.paths)if(!PZ.paths[k]||typeof PZ.paths[k]!=="object")delete PZ.paths[k];
fixT(PZ.rushBest,{s5:0,surv:0});fixT(PZ,{log:[]});PZ.log=PZ.log.filter(x=>x&&typeof x==="object"&&Array.isArray(x.sol));
let pzCache=store.get("et-pzcache",[]);
const savePZ=()=>{store.set("et-tac",PZ);savedAt=Date.now();store.set("et-savedAt",savedAt);cloudDirty()};
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
  tlogAdd(p,ok,{d:delta,x:xp,rated:opts.rated!==false,k:opts.kind});
  if(!ok&&!PZ.fails.some(f=>f.id===p.id))PZ.fails.unshift({id:p.id,p,ok:0});
  if(ok){const f=PZ.fails.find(x=>x.id===p.id);if(f){f.ok++;if(f.ok>=2)PZ.fails=PZ.fails.filter(x=>x!==f)}}
  PZ.fails=PZ.fails.slice(0,150);
  if(d.n===PZ.goal&&PZ.streak.last!==today()){PZ.streak.n=PZ.streak.last===yesterday()?PZ.streak.n+1:1;PZ.streak.last=today();PZ.streak.best=Math.max(PZ.streak.best,PZ.streak.n);setTimeout(()=>celebrate("streak",PZ.streak.n,"Taktik-Tagesziel erreicht!"),900)}
  st.days[today()]=(st.days[today()]||0)+1;saveStats();savePZ();gain("tactic",{ok,xp});
  const lvAfter=levelOf(PZ.xp);if(lvAfter>lvBefore)setTimeout(()=>{celebrate("level",lvAfter,`Level ${lvAfter} erreicht`,`Rang: ${rankOf(lvAfter)}`);sfx("badge")},1200);
  checkBadges();return {delta,xp};
}
const ratedText=(ok,res,p)=>`${ok?"Gelöst":"Nicht gelöst"} · Aufgabe ${p.rating} · Wertung ${PZ.r} (${res.delta>=0?"+":""}${res.delta})${res.xp?` · +${res.xp} XP`:""}`;
function playTactic(p,cfg){
  cfg=cfg||{};
  p._t0=Date.now();
  startPuzzle({fen:p.fen||null,pre:p.pre,sol:p.sol,title:cfg.title||"Taktik",eco:cfg.eco||("Aufgabe "+p.rating),sub:cfg.sub||(p.themes.map(t=>TTH[t]?TTH[t][0]:null).filter(Boolean).slice(0,3).join(" · ")||"Lichess-Rätsel"),
    prompt:`${p.side==="w"?"Weiß":"Schwarz"} am Zug – finde den besten Zug`,
    after:`Lichess-Rätsel ${p.id} aus einer echten Partie.`,
    onResult:ok=>{const res=recordTactic(p,ok,{rated:cfg.rated!==false,kind:cfg.kind});if(cfg.onResult)cfg.onResult(ok,res);
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
  if(kind==="hist"){if(!arg||!arg.length)return;s.title="Aus deinem Verlauf";s.list=arg}
  if(kind==="sprint"||kind==="sprint5"||kind==="survival"){s.rush=true;s.dur=kind==="sprint"?180000:kind==="sprint5"?300000:0;s.title=kind==="survival"?"Taktik-Rush: Überleben":`Taktik-Rush: ${s.dur/60000} Minuten`;s.lives=3;s.end=s.dur?Date.now()+s.dur:0;s.level=0}
  s.next=()=>loadNextTactic(s);
  s.countText=()=>s.rush?`${s.solved} gelöst · ${"♥".repeat(Math.max(0,s.lives))}`:kind==="theme"?`Stufe ${Math.min(PATH_STEPS,pathOf(s.theme).step+1)}/${PATH_STEPS} · ${pathOf(s.theme).n}/${PATH_N}`:`${s.solved} gelöst · ${s.failed} falsch`;
  s.progress=()=>s.rush?(s.dur?Math.max(0,(s.end-Date.now())/s.dur):Math.max(0,s.lives/3)):kind==="theme"?pathOf(s.theme).n/PATH_N:0;
  sess=s;showView("train");
  if(s.rush&&s.dur)startSprintTimer(s);
  loadNextTactic(s);
}
let sprintT=null;
function startSprintTimer(s){clearInterval(sprintT);const t=$("timer");sprintT=setInterval(()=>{if(sess!==s){clearInterval(sprintT);t.hidden=true;return}const left=Math.max(0,s.end-Date.now());t.hidden=false;t.textContent=Math.floor(left/60000)+":"+String(Math.floor(left/1000)%60).padStart(2,"0");t.classList.toggle("low",left<20000);$("sessProg").style.width=(left/s.dur*100)+"%";if(left<=0){clearInterval(sprintT);endSprint(s)}},250)}
function endSprint(s){
  if(sess!==s)return;const rk=s.kind==="sprint"?null:s.kind==="sprint5"?"s5":"surv";const prev=rk?PZ.rushBest[rk]||0:PZ.sprintBest;const best=s.solved>prev;if(best){if(rk)PZ.rushBest[rk]=s.solved;else PZ.sprintBest=s.solved}savePZ();checkBadges();clearInterval(sprintT);
  sess=null;done=true;lock=false;busy=false;$("timer").hidden=true;renderChrome();render();
  setStatus("done",`Rush vorbei: ${s.solved} gelöst`,best?"Neuer Rekord!":`Dein Rekord: ${Math.max(prev,s.solved)}`);sfx("done");if(best&&s.solved>=10)confetti();
}
async function loadNextTactic(s){
  if(sess!==s)return;
  setStatus("turn","Lade Aufgabe …","");busy=true;renderChrome();
  let p=null;
  try{
    if(s.kind==="fails"||s.kind==="hist"){if(s.idx>=s.list.length){sess=null;busy=false;renderChrome();setStatus("done",s.kind==="hist"?"Durchgang beendet":"Fehler wiederholt",`${s.solved} von ${s.list.length} gelöst.`);return}p=s.list[s.idx]}
    else if(s.kind==="theme"){const ps=pathOf(s.theme);p=await nextPuzzle(s.theme,DIFF[Math.min(PATH_STEPS-1,ps.step)][0])}
    else if(s.kind==="opening"){try{p=await nextPuzzle(s.angle,diffFor(PZ.r))}catch(e){if(String(e.message)==="angle"){toast("Für diese Eröffnung gibt es keine eigene Auswahl – gemischte Aufgaben.");s.angle="mix";p=await nextPuzzle("mix",diffFor(PZ.r))}else throw e}}
    else if(s.rush){const lv=Math.min(4,Math.floor(s.solved/4));p=await nextPuzzle("mix",DIFF[lv][0])}
    else p=await nextPuzzle("mix",diffFor(PZ.r));
  }catch(e){busy=false;if(sess===s){sess=null;renderChrome()}setStatus("bad","Keine Aufgabe verfügbar",String(e&&e.message)==="ratelimit"?"Lichess meldet zu viele Anfragen – warte eine Minute.":String(e&&e.message)==="empty"?"Lichess hat gerade keine neuen Aufgaben geliefert – versuch es gleich noch einmal.":"Für neue Aufgaben braucht es eine Internetverbindung.");return}
  if(!p){busy=false;if(sess===s){sess=null;renderChrome()}setStatus("bad","Keine Aufgabe verfügbar","Versuch es gleich noch einmal.");return}
  if(sess!==s)return;busy=false;s.cur=p;
  const rated=s.kind==="rated"||s.kind==="opening";
  playTactic(p,{title:s.title,rated,kind:s.kind,silentFail:!!s.rush,
    onResult:(ok)=>{s.res.push({clean:ok});if(ok)s.solved++;else s.failed++;
      if(s.kind==="theme"&&ok){const ps=pathOf(s.theme);ps.n++;if(ps.n>=PATH_N){ps.step=Math.min(PATH_STEPS,ps.step+1);ps.n=0;savePZ();setTimeout(()=>toast(ps.step>=PATH_STEPS?`Pfad „${TTH[s.theme][0]}“ gemeistert!`:`Stufe ${ps.step} geschafft – ★ ${ps.step}/${PATH_STEPS}`),600);if(ps.step>=PATH_STEPS){setTimeout(()=>{if(sess===s){sess=null;renderChrome();setStatus("done","Pfad gemeistert!","Alle fünf Sterne gesammelt. Neue Pfade schaltest du mit Sternen frei.")}},1500)}}savePZ()}
      if(s.rush){if(!ok){s.lives--;sfx("wrong")}renderChrome();
        if(s.lives<=0){setTimeout(()=>endSprint(s),600);return}
        setTimeout(()=>{if(sess===s)s.next()},ok?500:900)}
      if(s.kind==="fails"||s.kind==="hist")s.idx++;
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
  v.innerHTML=`${pageHead("Taktik","Löse Aufgaben, steig im Level auf und schärfe dein Gespür für Muster.","bolt","tac")}<div class="tac-hero">
    <div class="tac-r"><small>Taktik-Wertung</small><b>${PZ.r}</b><span>${PZ.n?`${PZ.n} Aufgaben · ${pct(PZ.ok/PZ.n)} gelöst`:"Noch keine Aufgabe gelöst"}</span></div>
    <div class="tac-lv"><div style="display:flex;justify-content:space-between;align-items:baseline"><b>Level ${lv} · ${rankOf(lv)}</b><small>${PZ.xp-a}/${b-a} XP</small></div><div class="xpbar"><i style="width:${(PZ.xp-a)/(b-a)*100}%"></i></div>
      <div class="tac-mini"><span><b>${d.n}/${PZ.goal}</b> heute</span><span><b>${PZ.streak.last===today()||PZ.streak.last===yesterday()?PZ.streak.n:0}</b> Tage Serie</span><span><b>${stars}</b> ★ Sterne</span><span><b>${Math.max(PZ.sprintBest,PZ.rushBest.s5||0,PZ.rushBest.surv||0)}</b> Rush-Rekord</span></div></div>
  </div>
  <div class="hubgrid">
    <button class="hc" data-tac="rated"><span class="ic" style="background:#81B64C">${NI.bolt}</span><b>Wertungstraining</b><small>Endlos Aufgaben passend zu deiner Wertung. Jede Lösung verändert deine Taktik-Wertung.</small><span class="meta">${PZ.r}</span></button>
    <div class="hc rushc"><span class="ic">${NI.review}</span><b>Taktik-Rush</b><small>Löse so viele Aufgaben wie möglich – sie werden immer schwerer. Drei Fehler, und es ist vorbei.</small><span class="rush-b">${[["sprint","3 Min",PZ.sprintBest],["sprint5","5 Min",PZ.rushBest.s5],["survival","Überleben",PZ.rushBest.surv]].map(r=>`<button class="btn" data-tac="${r[0]}">${r[1]}<small>Rekord ${r[2]||0}</small></button>`).join("")}</span></div>
    <button class="hc" data-tac="fails" ${PZ.fails.length?"":"disabled"}><span class="ic" style="background:#B9483C">${NI.target}</span><b>Fehler wiederholen</b><small>Aufgaben, die du nicht gelöst hast. Zweimal richtig, dann verschwinden sie.</small><span class="meta${PZ.fails.length?" hot":""}">${PZ.fails.length}</span></button>
  </div>
  ${repOps.length?`<div class="sec-h"><h3>Taktik aus deinen Eröffnungen</h3><small>Aufgaben aus Partien mit deinem Repertoire</small></div><div class="chips">${repOps.map(o=>`<button class="chip" data-tacop="${o.id}">${esc(o.name)}</button>`).join("")}</div>`:`<p class="hint">Tipp: Markiere Eröffnungen mit einem Stern, dann bekommst du hier Taktikaufgaben aus genau diesen Eröffnungen.</p>`}
  <div class="sec-h"><h3>Themen-Pfade</h3><small>Je ${PATH_N} Aufgaben pro Stufe, 5 Stufen bis zum Meister</small></div>
  ${tierHtml}
  <div class="card"><h3>Wertungsverlauf</h3>${tacticChart()}</div>
  ${weakT.length?`<div class="card"><h3>Deine schwächsten Motive</h3>${weakT.map(([k,t])=>`<div class="setrow"><span><b>${TTH[k][0]}</b><small>${t.ok} von ${t.n} gelöst</small></span><span style="display:flex;gap:10px;align-items:center"><b class="${t.ok/t.n<.5?"score-bad":""}">${pct(t.ok/t.n)}</b>${tierUnlocked(TIERS.findIndex(T=>T.keys.indexOf(k)>=0))?`<button class="mini" data-path="${k}">Üben</button>`:""}</span></div>`).join("")}</div>`:""}
  <div class="card"><h3>Tagesziel</h3><div class="btnrow"><span class="hint">Aufgaben pro Tag:</span>${[5,10,20,30].map(n=>`<button class="chip${PZ.goal===n?" on":""}" data-goal="${n}">${n}</button>`).join("")}</div><p class="hint" style="margin:8px 0 0">Die Aufgaben stammen aus der freien Lichess-Rätseldatenbank (CC0). Bereits geladene Aufgaben funktionieren auch offline. Mit einem Lichess-Token (Profil → Einstellungen) bekommst du nur Aufgaben, die du dort noch nicht gesehen hast.</p></div>`;
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
  {id:"sprint15",t:"Sprinter",d:"15 Aufgaben in einem 3-Minuten-Rush",ok:()=>PZ.sprintBest>=15},
  {id:"surv20",t:"Überlebenskünstler",d:"20 Aufgaben im Überlebens-Rush",ok:()=>(PZ.rushBest.surv||0)>=20},
  {id:"path",t:"Pfadfinder",d:"Einen Themen-Pfad gemeistert",ok:()=>Object.values(PZ.paths).some(p=>p.step>=PATH_STEPS)},
  {id:"stars50",t:"Sternensammler",d:"50 Sterne in Themen-Pfaden",ok:()=>totalStars()>=50}
);
KEYS.push("tac");S.tac=PZ;

/* ================= Komfort & Erscheinungsbild ================= */
/* ---- Konfetti (Canvas, ~2 s, respektiert »Weniger Animationen«) ---- */
function calmNow(){return !!S.set.calm||!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}
function confetti(colors){
  if(calmNow())return;
  const c=document.createElement("canvas");c.className="confetti";c.setAttribute("aria-hidden","true");document.body.appendChild(c);
  const dpr=Math.min(2,window.devicePixelRatio||1),W=innerWidth,H=innerHeight;c.width=W*dpr;c.height=H*dpr;
  const x=c.getContext("2d");if(!x){c.remove();return}x.scale(dpr,dpr);
  const cols=Array.isArray(colors)&&colors.length?colors:["#81B64C","#E9B949","#FA412D","#5A7FB5","#FFFFFF","#C8742E"];
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
    <h2 id="onbH">Willkommen bei ${BRAND}!</h2><p class="hint">Ein paar kurze Fragen, dann stellt die App dein Training zusammen. Alles lässt sich später in den Einstellungen ändern.</p>
    <h3>Deine Farbe</h3>${accentPicker()}
    <h3>Wie stark spielst du?</h3>
    <div class="seg onb-seg" data-k="lvl"><button data-v="1" aria-pressed="false">Einsteiger<small>unter 1000</small></button><button data-v="2" aria-pressed="true">Mittel<small>1000–1600</small></button><button data-v="3" aria-pressed="false">Stark<small>über 1600</small></button></div>
    <h3>Welche Farbe willst du üben?</h3>
    <div class="seg onb-seg" data-k="col"><button data-v="w" aria-pressed="false">Weiß</button><button data-v="b" aria-pressed="false">Schwarz</button><button data-v="wb" aria-pressed="true">Beide</button></div>
    <h3>Dein Chess.com-Name <small>(optional)</small></h3>
    <input class="txt" id="onbUser" placeholder="z. B. Hikaru" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(CH.user||"")}">
    <div class="btnrow onb-act"><button class="btn grn" id="onbGo">Los geht's</button><button class="btn" id="onbSkip">Überspringen</button></div>
  </div>`;
  document.body.appendChild(ov);wireAccent(ov);
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
    toast(added.length?`${added.length} Eröffnungen in dein Repertoire gelegt – los geht's mit dem Tagestraining.`:"Alles eingerichtet!");
    showView("home");
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
    toast(`${neu.length} neue ${neu.length===1?"Partie":"Partien"} geladen${done?`, ${done} analysiert`:""}${added?` – ${added} ${added===1?"Fehler":"Fehler"} zum Üben unter Training`:""}.`);
    renderTabbar();if(curView==="learn")renderLearn();
  }catch(e){/* offline oder API-Fehler: still ignorieren */}
  syncing=false;
}


/* ---- Eröffnungskopf am Handy antippen: Beschreibung ein-/ausklappen ---- */
document.querySelector(".ph").addEventListener("click",e=>{e.currentTarget.classList.toggle("open")});

/* ================= Konten & Online-Partien (Firebase) ================= */
/* Öffentliche Web-Konfiguration des Firebase-Projekts (kein Geheimnis – Zugriff regeln die Firestore-Regeln) */
const FB_CONFIG={apiKey:"AIzaSyCMZYnRlqrBRpo7B_IisxsVI25WyPGsHx0",authDomain:"eroeffnungstrainer.firebaseapp.com",projectId:"eroeffnungstrainer",storageBucket:"eroeffnungstrainer.firebasestorage.app",messagingSenderId:"381956179164",appId:"1:381956179164:web:522a91bd64d8a9cfe7a019"};
const FB_VER="10.12.2";
const START_FEN=new Chess().fen();
const onlineReady=()=>!!(window.__MOCKNET||FB_CONFIG);
let NET=null,netLoading=null;
function netInit(){if(NET)return Promise.resolve(NET);if(!netLoading)netLoading=(window.__MOCKNET?Promise.resolve(mockNet()):fbNet()).then(n=>NET=n).catch(e=>{netLoading=null;throw e});return netLoading}
/* Live-Abfragen heilen sich selbst: Bricht die Verbindung ab (Funkloch, Standby, Netzwechsel), wird mit Pause neu abonniert,
   statt dass die Partie stillschweigend stehen bleibt. Nur „keine Berechtigung“ wird sofort gemeldet. */
const NETST={ok:true,at:0,fails:0};
function netState(ok){const was=NETST.ok;NETST.ok=ok;NETST.at=Date.now();if(ok)NETST.fails=0;else NETST.fails++;if(was!==ok){try{if(mode==="online")onlineStatus()}catch(e){}}}
function relisten(mk,cb){
  let un=null,dead=false,tries=0,tm=null;
  const go=()=>{if(dead)return;
    un=mk((v,m)=>{tries=0;if(!m||!m.cache)netState(true);cb(v,null,m||{})},e=>{try{if(un)un()}catch(_){}un=null;if(dead)return;
      if(e&&e.code==="permission-denied"){cb(null,e,{});return}
      netState(false);tm=setTimeout(go,Math.min(15000,700*Math.pow(2,tries++)))})};
  go();return()=>{dead=true;clearTimeout(tm);try{if(un)un()}catch(_){}};
}
async function fbNet(){
  const B=new URL(`lib/firebase/${FB_VER}/`,location.href).href;
  const [A,U,F]=await Promise.all([import(B+"firebase-app.js"),import(B+"firebase-auth.js"),import(B+"firebase-firestore.js")]);
  const app=A.initializeApp(FB_CONFIG),auth=U.getAuth(app);let db;try{db=F.initializeFirestore(app,{experimentalAutoDetectLongPolling:true})}catch(e){db=F.getFirestore(app)}const ref=p=>F.doc(db,p);
  const uo=u=>u?{uid:u.uid,email:u.email||""}:null;
  return {
    onAuth:cb=>U.onAuthStateChanged(auth,u=>cb(uo(u))),
    signUp:async(e,p)=>uo((await U.createUserWithEmailAndPassword(auth,e,p)).user),
    signIn:async(e,p)=>uo((await U.signInWithEmailAndPassword(auth,e,p)).user),
    signOut:()=>U.signOut(auth),
    resetPw:e=>U.sendPasswordResetEmail(auth,e),
    delUser:()=>auth.currentUser.delete(),
    get:async p=>{const s=await F.getDoc(ref(p));return s.exists()?s.data():null},
    set:(p,d,merge)=>F.setDoc(ref(p),d,merge?{merge:true}:{}),
    del:p=>F.deleteDoc(ref(p)),
    add:async(c,d)=>(await F.addDoc(F.collection(db,c),d)).id,
    watch:(p,cb,meta)=>relisten((ok,er)=>F.onSnapshot(ref(p),{includeMetadataChanges:!!meta},s=>ok(s.exists()?s.data():null,{cache:s.metadata.fromCache,pend:s.metadata.hasPendingWrites}),er),cb),
    getSrv:async p=>{const s=await F.getDocFromServer(ref(p));return s.exists()?s.data():null},
    srvTime:async uid=>{const r=ref("users/"+uid+"/private/clock");const t0=Date.now();await F.setDoc(r,{t:F.serverTimestamp()});const t1=Date.now();const s=await F.getDocFromServer(r);const v=s.exists()&&s.data().t;if(!v||!v.toMillis)return null;return {off:v.toMillis()-(t0+t1)/2,rtt:t1-t0}},
    list:async c=>(await F.getDocs(F.collection(db,c))).docs.map(x=>Object.assign({id:x.id},x.data())),
    query:async(c,f,op,v)=>(await F.getDocs(F.query(F.collection(db,c),F.where(f,op,v)))).docs.map(x=>Object.assign({id:x.id},x.data())),
    watchQ:(c,f,op,v,cb)=>relisten((ok,er)=>F.onSnapshot(F.query(F.collection(db,c),F.where(f,op,v)),q=>ok(q.docs.map(x=>Object.assign({id:x.id},x.data())),{cache:q.metadata.fromCache}),er),cb),
    tx:(p,fn)=>F.runTransaction(db,async t=>{const r=ref(p);const s=await t.get(r);const u=fn(s.exists()?s.data():null);if(!u)return false;t.set(r,u,{merge:true});return true})
  };
}
/* Test-Attrappe: gleiche Schnittstelle, Daten in localStorage, Live-Updates über BroadcastChannel */
function mockNet(){
  const K="mocknet-db",KU="mocknet-users",bc=window.BroadcastChannel?new BroadcastChannel("mocknet"):null;
  const rd=()=>{try{return JSON.parse(localStorage.getItem(K)||"{}")}catch(e){return {}}};
  const subs=new Set();const fire=()=>subs.forEach(f=>f());if(bc)bc.onmessage=()=>fire();
  const wr=D=>{localStorage.setItem(K,JSON.stringify(D));if(bc)bc.postMessage(1);setTimeout(fire,0)};
  const delay=v=>new Promise(r=>setTimeout(()=>r(v),window.__MOCKLAG||15));const cl=o=>o==null?null:JSON.parse(JSON.stringify(o));
  const realNow=()=>performance.timeOrigin+performance.now();/* „Serverzeit“: unabhängig von einer verstellten Geräteuhr */
  const merge=(a,b)=>{const o=Object.assign({},a);for(const k in b){const v=b[k];o[k]=(v&&typeof v==="object"&&!Array.isArray(v)&&o[k]&&typeof o[k]==="object"&&!Array.isArray(o[k]))?merge(o[k],v):v}return o};
  let user=null;try{user=JSON.parse(sessionStorage.getItem("mock-user")||"null")}catch(e){}const acbs=[];
  const setU=u=>{user=u;sessionStorage.setItem("mock-user",JSON.stringify(u));acbs.forEach(c=>c(u))};
  const users=()=>{try{return JSON.parse(localStorage.getItem(KU)||"{}")}catch(e){return {}}};const err=c=>{const e=new Error(c);e.code=c;return e};
  return {
    onAuth:cb=>{acbs.push(cb);setTimeout(()=>cb(user),5);return()=>{}},
    signUp:async(e,p)=>{await delay();const U=users();if(U[e])throw err("auth/email-already-in-use");if(!/@/.test(e))throw err("auth/invalid-email");if(p.length<6)throw err("auth/weak-password");const u={uid:"u"+Math.random().toString(36).slice(2,10),email:e};U[e]={pw:p,uid:u.uid};localStorage.setItem(KU,JSON.stringify(U));setU(u);return u},
    signIn:async(e,p)=>{await delay();const x=users()[e];if(!x||x.pw!==p)throw err("auth/invalid-credential");const u={uid:x.uid,email:e};setU(u);return u},
    signOut:async()=>setU(null),resetPw:async()=>{await delay()},
    delUser:async()=>{const U=users();for(const k in U)if(U[k].uid===user.uid)delete U[k];localStorage.setItem(KU,JSON.stringify(U));setU(null)},
    get:async p=>{await delay();const v=rd()[p];return v===undefined?null:cl(v)},
    set:async(p,d,m)=>{await delay();const D=rd();D[p]=m&&D[p]?merge(D[p],cl(d)):cl(d);wr(D)},
    del:async p=>{await delay();const D=rd();delete D[p];wr(D)},
    add:async(c,d)=>{await delay();const id=Math.random().toString(36).slice(2,12);const D=rd();D[c+"/"+id]=cl(d);wr(D);return id},
    watch:(p,cb)=>{let last;const f=()=>{if(window.__MOCKDEAF)return;const v=rd()[p];const s=JSON.stringify(v===undefined?null:v);if(s!==last){last=s;cb(v===undefined?null:cl(v),null,{})}};subs.add(f);setTimeout(f,5);return()=>subs.delete(f)},
    getSrv:async p=>{await delay();if(window.__MOCKOFF)throw err("unavailable");const v=rd()[p];return v===undefined?null:cl(v)},
    srvTime:async()=>{const t0=Date.now();await delay();const srv=realNow();const t1=Date.now();return {off:srv-(t0+t1)/2,rtt:t1-t0}},
    query:async(c,fld,op,v)=>{await delay();const D=rd();const out=[];for(const k in D){if(k.indexOf(c+"/")!==0||k.split("/").length!==2)continue;const x=D[k];if(op==="array-contains"?(x[fld]||[]).indexOf(v)>=0:x[fld]===v)out.push(Object.assign({id:k.slice(c.length+1)},cl(x)))}return out},
    list:async c=>{await delay();const D=rd();const out=[];for(const k in D){if(k.indexOf(c+"/")===0&&k.split("/").length===2)out.push(Object.assign({id:k.slice(c.length+1)},cl(D[k])))}return out},
    watchQ:(c,fld,op,v,cb)=>{let last;const f=()=>{const D=rd();const out=[];for(const k in D){if(k.indexOf(c+"/")!==0||k.split("/").length!==2)continue;const x=D[k];if(op==="array-contains"?(x[fld]||[]).indexOf(v)>=0:x[fld]===v)out.push(Object.assign({id:k.slice(c.length+1)},x))}const s=JSON.stringify(out);if(s!==last){last=s;cb(cl(out))}};subs.add(f);setTimeout(f,5);return()=>subs.delete(f)},
    tx:async(p,fn)=>{await delay();if(window.__MOCKOFF)throw err("unavailable");const D=rd();const u=fn(D[p]===undefined?null:cl(D[p]));if(!u)return false;D[p]=D[p]?merge(D[p],cl(u)):cl(u);wr(D);return true}
  };
}
function netErr(e){const c=String(e&&(e.code||e.message)||e);
  return {"auth/email-already-in-use":"Zu dieser E-Mail gibt es schon ein Konto. Melde dich an.","auth/invalid-email":"Die E-Mail-Adresse ist ungültig.","auth/weak-password":"Das Passwort braucht mindestens 6 Zeichen.",
    "auth/invalid-credential":"E-Mail oder Passwort stimmt nicht.","auth/wrong-password":"E-Mail oder Passwort stimmt nicht.","auth/user-not-found":"E-Mail oder Passwort stimmt nicht.","auth/invalid-login-credentials":"E-Mail oder Passwort stimmt nicht.",
    "auth/too-many-requests":"Zu viele Versuche – warte kurz und versuch es dann erneut.","auth/network-request-failed":"Keine Verbindung zum Server.","auth/requires-recent-login":"Melde dich zur Sicherheit neu an und versuch es dann noch einmal.",
    "permission-denied":"Keine Berechtigung (Firestore-Regeln prüfen).","unavailable":"Der Server ist gerade nicht erreichbar.","auth/operation-not-allowed":"Die Anmeldung mit E-Mail ist im Firebase-Projekt noch nicht eingeschaltet.",
    "auth/unauthorized-domain":"Diese Seite ist im Firebase-Projekt noch nicht als autorisierte Domain eingetragen.","auth/configuration-not-found":"Die Anmeldung ist im Firebase-Projekt noch nicht eingeschaltet (Authentication → E-Mail/Passwort).","auth/admin-restricted-operation":"Die Registrierung ist im Firebase-Projekt gesperrt.","not-found":"Die Firestore-Datenbank ist noch nicht angelegt.","failed-precondition":"Die Firestore-Datenbank ist noch nicht bereit.","auth/missing-password":"Bitte gib ein Passwort ein.","auth/invalid-api-key":"Die Firebase-Konfiguration ist ungültig."}[c]||("Fehler: "+c)}

/* ---- Zustand ---- */
const ON={tickN:0,user:null,profile:null,games:[],seen:{},badge:0,gid:null,g:null,color:"w",unsubG:null,unsubL:null,unsubP:null,pendingJoin:null,syncAt:0,syncT:null,authKnown:false,tab:"play",busy:false,tick:null,claimT:0,tc:store.get("et-ontc","10+0"),col:store.get("et-oncol","r"),theme:store.get("et-ontheme",null)};
if(ON.theme&&(typeof ON.theme!=="object"||typeof ON.theme.id!=="string"))ON.theme=null;
const myName=()=>ON.profile&&ON.profile.name||"Ich";
const oppUid=g=>(g.players||[]).find(u=>u!==ON.user.uid)||null;
const oppName=g=>{const o=oppUid(g);return o?(g.names&&g.names[o])||"Gegner":"(wartet)"};
const myColorIn=g=>g.white===ON.user.uid?"w":g.black===ON.user.uid?"b":null;
const tcTxt=tc=>tc?(tc.d?`${tc.d} ${tc.d===1?"Tag":"Tage"}/Zug`:`${tc.m}+${tc.i}`):"ohne Uhr";
/* ---- Serverzeit: Geräteuhren gehen oft Sekunden falsch. Alle Partiezeiten laufen deshalb über die Serverzeit. ---- */
const CLK={off:+store.get("et-clkoff",0)||0,at:0,rtt:0,busy:false};
function srvNow(){return Date.now()+CLK.off}
async function clockSync(force){
  if(!NET||!NET.srvTime||!ON.user||CLK.busy)return;if(!force&&CLK.at&&Date.now()-CLK.at<600000)return;CLK.busy=true;
  try{let best=null;for(let i=0;i<3;i++){const x=await NET.srvTime(ON.user.uid);if(x&&(!best||x.rtt<best.rtt))best=x;if(best&&best.rtt<150)break}
    if(best&&Math.abs(best.off)<7*DAY_MS){CLK.off=Math.round(best.off);CLK.rtt=best.rtt;CLK.at=Date.now();store.set("et-clkoff",CLK.off)}}catch(e){}finally{CLK.busy=false}
}
const resTxt=(g,me)=>{if(!g.result||g.result==="-")return g.reason||"abgebrochen";if(g.result==="1/2-1/2")return "Remis";const w=g.result==="1-0"?"w":"b";return me?(w===me?"Gewonnen":"Verloren"):(w==="w"?"Weiß gewinnt":"Schwarz gewinnt")};

/* ---- Anmeldung ---- */
async function onlineBoot(){
  if(!onlineReady()||ON.booted)return;ON.booted=true;
  let n;try{n=await netInit()}catch(e){ON.netErr=true;if(curView==="online")renderOnline();return}
  n.onAuth(async u=>{
    ON.authKnown=true;socialStop();tourStop();mmStop();FEED.items=null;if(ON.unsubL){ON.unsubL();ON.unsubL=null}if(ON.unsubP){ON.unsubP();ON.unsubP=null}
    ON.user=u;ON.profile=null;ON.games=[];
    if(u){
      ON.unsubP=n.watch("users/"+u.uid,p=>{ON.profile=p;if(p&&ON.user&&(!p.lastSeen||srvNow()-p.lastSeen>3600000)){p.lastSeen=srvNow();n.set("users/"+ON.user.uid,{lastSeen:p.lastSeen},true).catch(()=>{})}if(curView==="online")renderOnline();if(mode==="online")renderChrome()});
      ON.unsubL=n.watchQ("games","players","array-contains",u.uid,list=>{if(!list)return;gamesChanged(list)});
      cloudPull();socialStart();clockSync(true);
    }
    if(curView==="online")renderOnline();renderTabbar();
    if(u&&ON.pendingJoin){const id=ON.pendingJoin;ON.pendingJoin=null;openOnlineGame(id)}
  });
}
const NAME_RE=/^[A-Za-z0-9ÄÖÜäöüß_-]{3,20}$/;
async function claimName(name){
  const low=name.toLowerCase();
  const ok=await NET.tx("usernames/"+low,d=>d?null:{uid:ON.user.uid});
  if(!ok){const d=await NET.get("usernames/"+low);if(!d||d.uid!==ON.user.uid)throw new Error("name-taken")}
  await NET.set("users/"+ON.user.uid,{name,nameLower:low,created:Date.now(),friends:[],w:0,d:0,l:0},true);
}
async function doRegister(name,email,pw,msg){
  name=name.trim();email=email.trim();
  if(!NAME_RE.test(name)){msg("Der Benutzername braucht 3–20 Zeichen (Buchstaben, Ziffern, _ oder -).");return}
  try{if(await NET.get("usernames/"+name.toLowerCase())){msg("Dieser Benutzername ist schon vergeben.");return}}catch(e){/* vor der Anmeldung evtl. nicht lesbar */}
  try{await NET.signUp(email,pw)}catch(e){msg(netErr(e));return}
  try{await waitUser();await claimName(name);toast(`Willkommen, ${name}!`);cloudPush(true)}
  catch(e){msg(String(e.message)==="name-taken"?"Dieser Benutzername ist schon vergeben – wähle einen anderen.":netErr(e))}
}
function waitUser(){return new Promise(r=>{const t0=Date.now();const f=()=>{if(ON.user&&ON.user.uid)return r();if(Date.now()-t0>8000)return r();setTimeout(f,50)};f()})}
async function doLogin(email,pw,msg){try{await NET.signIn(email.trim(),pw)}catch(e){msg(netErr(e))}}
async function doReset(email,msg){if(!email.trim()){msg("Trag zuerst deine E-Mail-Adresse ein.");return}try{await NET.resetPw(email.trim());msg("Wir haben dir eine E-Mail zum Zurücksetzen geschickt.")}catch(e){msg(netErr(e))}}
async function doLogout(){await cloudPush(true);ON.synced=false;try{await NET.signOut()}catch(e){}toast("Abgemeldet")}
async function doDeleteAccount(msg){
  const u=ON.user;if(!u)return;const low=ON.profile&&ON.profile.nameLower;
  try{if(low)await NET.del("usernames/"+low);await NET.del("users/"+u.uid+"/private/progress");await NET.del("users/"+u.uid+"/private/clock").catch(()=>{});await NET.del("users/"+u.uid);await NET.delUser();try{localStorage.removeItem("et-cloud-uid")}catch(e){}ON.synced=false;toast("Dein Konto wurde gelöscht.")}catch(e){msg(netErr(e))}
}

/* ---- Fortschritt in der Cloud ---- */
function cloudDirty(){try{if(!ON.user||!NET||!ON.synced)return}catch(e){return}clearTimeout(ON.syncT);ON.syncT=setTimeout(()=>cloudPush(),5000)}
async function cloudPush(now){
  if(!ON.user||!NET||!ON.synced)return;clearTimeout(ON.syncT);
  try{await NET.set("users/"+ON.user.uid+"/private/progress",{savedAt,email:ON.user.email||"",data:JSON.stringify(exportData())});ON.syncAt=Date.now();publishStats();if(curView==="online"&&ON.tab==="account")renderOnline()}catch(e){if(now)toast("Cloud-Speicherung fehlgeschlagen: "+netErr(e))}
}
const hasLocalProgress=()=>Object.keys(S.prog).length>0||Object.keys(S.srs).length>0||PZ.n>0||S.custom.w.length+S.custom.b.length>0;
function cloudImport(r){const d=JSON.parse(r.data);importData(d);store.set("et-savedAt",r.savedAt||Date.now());store.set("et-cloud-uid",ON.user.uid);toast("Fortschritt aus deinem Konto geladen – die Seite lädt neu.");setTimeout(()=>location.reload(),900)}
async function cloudPull(){
  const uid=ON.user.uid;ON.synced=false;
  let r=null;try{r=await NET.get("users/"+uid+"/private/progress")}catch(e){return}
  if(!ON.user||ON.user.uid!==uid)return;
  const linked=store.get("et-cloud-uid","")===uid;
  if(r&&r.data){
    if(linked){if((r.savedAt||0)>savedAt+1000){cloudImport(r);return}}
    else if(!hasLocalProgress()){cloudImport(r);return}
    else{askCloudChoice(r);return}
  }
  store.set("et-cloud-uid",uid);ON.synced=true;await cloudPush();
}
/* Erstes Anmelden in einem Browser, der schon eigenen Fortschritt hat */
function askCloudChoice(r){
  const ov=document.createElement("div");ov.className="onb";const when=r.savedAt?new Date(r.savedAt).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"früher";
  ov.innerHTML=`<div class="onb-box" role="dialog" aria-modal="true" aria-label="Fortschritt wählen"><h2 style="font-size:20px">Welchen Fortschritt behalten?</h2><p class="hint">In deinem Konto ist schon ein Trainingsstand gespeichert (zuletzt ${esc(when)}). Auch dieser Browser hat eigenen Fortschritt.</p>
  <div class="btnrow onb-act" style="flex-direction:column;align-items:stretch"><button class="btn grn" data-c="cloud">Stand aus dem Konto laden</button><button class="btn" data-c="local">Diesen Browser behalten und ins Konto speichern</button></div></div>`;
  document.body.appendChild(ov);
  ov.querySelector('[data-c="cloud"]').onclick=()=>{ov.remove();cloudImport(r)};
  ov.querySelector('[data-c="local"]').onclick=async()=>{ov.remove();store.set("et-cloud-uid",ON.user.uid);ON.synced=true;await cloudPush(true);toast("Dieser Stand ist jetzt in deinem Konto gespeichert.")};
}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&ON.syncT)cloudPush();
  if(document.visibilityState==="hidden"){if(mode==="online")presence(true)}else onlineWake()});
window.addEventListener("online",()=>onlineWake());window.addEventListener("offline",()=>{netState(false);if(mode==="online"){ON.conn=false;onlineStatus()}});
/* Nach Standby, Netzwechsel oder Rückkehr in den Tab: Partie und Liste direkt vom Server holen */
function onlineWake(){try{if(!ON.user||!NET)return;clockSync();if(mode==="online"&&ON.gid){ON.seenAt=0;gamePoll(true)}
  if(NET.query&&Date.now()-(ON.listPollAt||0)>8000){ON.listPollAt=Date.now();NET.query("games","players","array-contains",ON.user.uid).then(l=>{if(l&&ON.user)gamesChanged(l)}).catch(()=>{})}}catch(e){}}

/* ---- Partienliste & Benachrichtigungen ---- */
function gamesChanged(list){
  const me=ON.user.uid;const prev=ON.seen;const next={};
  ON.chatN=ON.chatN||{};
  list.forEach(g=>{const key=g.status+"|"+(g.moves||[]).length+"|"+(g.drawOffer||"")+"|"+(g.rematch?g.rematch.id:"")+"|"+(g.takeback?g.takeback.n:"");next[g.id]=key;
    const cn=(g.chat||[]).length;if(ON.listInit&&ON.chatN[g.id]!=null&&cn>ON.chatN[g.id]){const m=g.chat[cn-1];if(m&&m.u!==me&&QUICK[m.k])toast(`${(g.names&&g.names[m.u])||"Gegner"}: ${QUICK[m.k]}`)}ON.chatN[g.id]=cn;
    if(ON.listInit&&prev[g.id]&&prev[g.id]!==key&&g.takeback&&g.takeback.by!==me&&g.status==="active")toast(`${oppName(g)} bittet um Zurücknahme des letzten Zugs`);
    if(prev[g.id]===key||!ON.listInit)return;
    const viewing=mode==="online"&&ON.gid===g.id&&curView==="train";
    if(g.status==="waiting"&&g.invite===me&&!prev[g.id]&&!viewing)toast(`${g.names&&g.names[g.creator]||"Jemand"} fordert dich heraus (${tcTxt(g.tc)})`);
    else if(g.status==="active"&&!viewing){const c=new Chess(g.fen||START_FEN);if(c.turn()===myColorIn(g)&&playedN(g))toast(`${oppName(g)} hat gezogen – du bist am Zug`);else if(prev[g.id]&&prev[g.id].indexOf("waiting")===0)toast(`${oppName(g)} ist der Partie beigetreten`)}
    else if(g.status==="over"&&prev[g.id]&&prev[g.id].indexOf("over")!==0&&!viewing)toast(`Partie gegen ${oppName(g)}: ${resTxt(g,myColorIn(g))}`);
    if(g.status==="over")countResult(g);
  });
  ON.seen=next;ON.listInit=true;ON.games=list.sort((a,b)=>(b.updated||0)-(a.updated||0));
  ON.badge=list.filter(g=>(g.status==="waiting"&&g.invite===me)||(g.status==="active"&&new Chess(g.fen||START_FEN).turn()===myColorIn(g))).length;
  renderTabbar();if(curView==="online")renderOnline();turnTitle();
}
function countResult(g){
  const ck="et-oncount-"+ON.user.uid;const done=store.get(ck,[]);if(done.indexOf(g.id)>=0||!g.result||g.result==="-"||!ON.profile)return;
  const me=myColorIn(g);if(!me)return;done.push(g.id);store.set(ck,done.slice(-300));
  const k=g.result==="1/2-1/2"?"d":(g.result==="1-0")===(me==="w")?"w":"l";
  const P=ON.profile;const upd={[k]:(P[k]||0)+1};
  const opp=oppUid(g);const my=(g.elo&&g.elo[ON.user.uid])||P.elo||1200;
  const finish=or=>{const n=(P.w||0)+(P.d||0)+(P.l||0);const K=n<20?40:24;const sc=k==="w"?1:k==="d"?.5:0;const E=1/(1+Math.pow(10,(or-my)/400));
    upd.elo=Math.round((P.elo||my)+K*(sc-E));upd.eloHist=(P.eloHist||[]).concat({t:srvNow(),r:upd.elo}).slice(-60);NET.set("users/"+ON.user.uid,upd,true).catch(()=>{})};
  if(g.elo&&opp&&g.elo[opp])finish(g.elo[opp]);else if(opp)NET.get("users/"+opp).then(p=>finish((p&&p.elo)||1200)).catch(()=>finish(1200));else NET.set("users/"+ON.user.uid,upd,true).catch(()=>{});
  st.online=(st.online||0)+1;saveStats();SOC.usersAt=0;
  gain("game",{id:"on-"+g.id,src:"online",res:k==="w"?"win":k==="d"?"draw":"loss",color:me,tc:g.tc,fam:famOfMoves(g.moves||[]),opp:oppName(g),n:(g.moves||[]).length,moves:g.moves||[],term:g.reason||""});
}

/* ---- Partien anlegen, beitreten, Revanche ---- */
function parseTc(s){if(s==="none")return null;if(/^d\d$/.test(s))return {m:0,i:0,d:+s.slice(1)};const m=String(s).match(/^(\d+)\+(\d+)$/);return m?{m:+m[1],i:+m[2]}:null}
/* Themenpartien: Die Theoriezüge stehen schon in moves, pre zählt sie. Uhr, Abbruch und Zurücknahme rechnen erst ab pre. */
const playedN=g=>Math.max(0,((g&&g.moves)||[]).length-((g&&g.pre)||0));
function themeStem(o){const L=o.lines.map(l=>l.m);let k=0;while(L.every(m=>m.length>k&&strip(m[k])===strip(L[0][k])))k++;return L[0].slice(0,k)}
function themeMoves(t){const o=t&&byId(t.id);if(!o||!o.lines||!o.lines.length)return null;const raw=t.li>=0&&o.lines[t.li]?o.lines[t.li].m:themeStem(o);
  const g=new Chess(),out=[];for(const m of raw){const mv=findMove(g,m);if(!mv)return null;out.push(g.move(mv.san).san)}return out.length?{moves:out,fen:g.fen(),o}:null}
function newGameDoc(tc,myCol,friend,theme){
  const me=ON.user.uid,now=srvNow();const col=myCol==="r"?(Math.random()<.5?"w":"b"):myCol;const other=col==="w"?"b":"w";
  const d={players:friend?[me,friend.uid]:[me],creator:me,invite:friend?friend.uid:null,white:null,black:null,names:{[me]:myName()},status:"waiting",tc:tc||null,moves:[],fen:START_FEN,
    times:tc&&!tc.d?{w:tc.m*60000,b:tc.m*60000}:null,lastAt:0,result:null,reason:"",drawOffer:null,rematch:null,created:now,updated:now};
  const TM=theme?themeMoves(theme):null;
  if(TM){d.moves=TM.moves;d.fen=TM.fen;d.pre=TM.moves.length;d.theme={id:TM.o.id,li:theme.li>=0?theme.li:-1,name:TM.o.name,line:theme.li>=0&&TM.o.lines[theme.li]?TM.o.lines[theme.li].n:""}}
  d[col==="w"?"white":"black"]=me;if(friend){d[other==="w"?"white":"black"]=friend.uid;d.names[friend.uid]=friend.name}
  return d;
}
/* Nach der Partie: Wer hat das Buch der Themen-Eröffnung zuerst verlassen? */
function themeBook(g){
  const o=g&&g.theme&&byId(g.theme.id);if(!o)return "";const ms=g.moves||[],pre=g.pre||0;if(ms.length<=pre)return "";
  const gg=new Chess();for(let i=0;i<pre;i++)gg.move(ms[i]);
  for(let k=pre;k<ms.length;k++){const bk=bookMovesIn(o,ms.slice(0,k));
    if(!bk.length)return k===pre?"":`Ihr seid bis zum Ende der Theorie im Buch geblieben (${Math.ceil((k-pre)/2)} ${Math.ceil((k-pre)/2)===1?"Zug":"Züge"}).`;
    if(bk.indexOf(strip(ms[k]))<0){const who=k%2===0?"w":"b",u=who==="w"?g.white:g.black,nm=(g.names&&g.names[u])||(who==="w"?"Weiß":"Schwarz");
      return `${nm} verließ das Buch zuerst: ${numSan(gg.fen(),ms[k])} statt ${bk.slice(0,2).map(b=>{const mv=findMove(new Chess(gg.fen()),b);return mv?numSan(gg.fen(),mv.san):b}).join(" oder ")}.`}
    gg.move(ms[k])}
  return "Alle gespielten Züge standen im Buch.";
}
async function createGame(friend){
  if(!ON.profile){toast("Lege zuerst deinen Benutzernamen fest.");return null}
  if(ON.profile.banned){toast("Dein Konto ist gesperrt.");return null}
  try{const id=await NET.add("games",newGameDoc(parseTc(ON.tc),ON.col,friend,ON.theme&&byId(ON.theme.id)?ON.theme:null));openOnlineGame(id);if(!friend)shareInvite(id);return id}catch(e){toast(netErr(e));return null}
}
function inviteLink(id){return location.origin+location.pathname+"#play="+id}
function shareInvite(id){const link=inviteLink(id);
  if(navigator.share){navigator.share({title:"Schach gegen mich",text:`${myName()} lädt dich zu einer Partie ein`,url:link}).catch(e=>{if(!e||e.name!=="AbortError")linkBox(link)})}
  else if(navigator.clipboard){navigator.clipboard.writeText(link).then(()=>toast("Einladungslink kopiert – schick ihn deinem Freund.")).catch(()=>linkBox(link))}else linkBox(link)}
async function joinGame(id,d){
  if(ON.profile&&ON.profile.banned){toast("Dein Konto ist gesperrt.");return false}
  const me=ON.user.uid,now=srvNow();
  let elo=null;try{const g0=d||await NET.get("games/"+id);if(g0&&g0.creator){const cr=await NET.get("users/"+g0.creator);elo={[g0.creator]:(cr&&cr.elo)||1200,[me]:(ON.profile&&ON.profile.elo)||1200}}}catch(e){}
  return NET.tx("games/"+id,x=>{if(!x||x.status!=="waiting")return null;const e=elo?{elo}:{};
    if(x.invite){if(x.invite!==me)return null;return Object.assign({status:"active",lastAt:now,updated:now,names:{[me]:myName()}},e)}
    if((x.players||[]).length!==1||x.players[0]===me)return null;
    const free=x.white?"black":"white";return Object.assign({players:[x.players[0],me],[free]:me,names:{[me]:myName()},status:"active",lastAt:now,updated:now},e)});
}
async function gameAct(fn){if(!ON.gid)return false;try{const ok=await withTimeout(NET.tx("games/"+ON.gid,fn),15000);if(!ok)toast("Das geht gerade nicht – die Partie hat sich geändert.");return ok}catch(e){toast(netErr(e));return false}}
const otherCol=c=>c==="w"?"b":"w";
const winRes=c=>c==="w"?"1-0":"0-1";
function onResign(){const c=ON.color;gameAct(d=>d&&d.status==="active"?{status:"over",result:winRes(otherCol(c)),reason:"Aufgabe",updated:srvNow(),drawOffer:null}:null)}
function onAbort(){gameAct(d=>d&&(d.status==="active"&&playedN(d)<2)?{status:"over",result:"-",reason:"Partie abgebrochen",updated:srvNow()}:d&&d.status==="waiting"?{status:"cancelled",updated:srvNow()}:null)}
function onOfferDraw(){const me=ON.user.uid;gameAct(d=>d&&d.status==="active"&&!d.drawOffer?{drawOffer:me,updated:srvNow()}:null).then(ok=>{if(ok)toast("Remis angeboten")})}
function onDrawAnswer(acc){const me=ON.user.uid;gameAct(d=>d&&d.status==="active"&&d.drawOffer&&d.drawOffer!==me?(acc?{status:"over",result:"1/2-1/2",reason:"Remis vereinbart",drawOffer:null,updated:srvNow()}:{drawOffer:null,updated:srvNow()}):null)}
async function onDecline(){const me=ON.user.uid;await gameAct(d=>d&&d.status==="waiting"&&d.invite===me?{status:"declined",updated:srvNow()}:null);leaveOnline()}
async function onRematch(){
  const g=ON.g;if(!g)return;const me=ON.user.uid;
  if(g.rematch&&g.rematch.by!==me){const id=g.rematch.id;const d=await NET.get("games/"+id).catch(()=>null);if(d&&d.status==="waiting"){await joinGame(id,d).catch(()=>{});}openOnlineGame(id);return}
  if(g.rematch&&g.rematch.by===me){openOnlineGame(g.rematch.id);return}
  const opp=oppUid(g);if(!opp)return;
  const d=newGameDoc(g.tc,otherCol(ON.color),{uid:opp,name:oppName(g)},g.theme&&byId(g.theme.id)?{id:g.theme.id,li:g.theme.li}:null);
  try{const id=await NET.add("games",d);const ok=await NET.tx("games/"+ON.gid,x=>x&&!x.rematch?{rematch:{by:me,id},updated:srvNow()}:null);
    /* Beide haben gleichzeitig Revanche gedrückt: eigene Partie verwerfen und die des Gegners annehmen */
    if(!ok){NET.set("games/"+id,{status:"cancelled",updated:srvNow()},true).catch(()=>{});const g2=await NET.getSrv("games/"+ON.gid).catch(()=>null);if(g2&&g2.rematch&&g2.rematch.by!==me){ON.g=g2;return onRematch()}toast("Revanche gerade nicht möglich.");return}
    openOnlineGame(id);toast("Revanche angeboten")}catch(e){toast(netErr(e))}
}
function leaveOnline(){presence(true);if(ON.unsubG){ON.unsubG();ON.unsubG=null}stopGameSync();ON.gid=null;ON.g=null;stopOnTick();turnTitle();showView("online:play")}

/* ---- Partie auf dem Brett ---- */
async function openOnlineGame(id){
  if(!onlineReady()){toast("Online-Partien sind noch nicht eingerichtet.");return}
  await netInit().catch(()=>{});
  if(!ON.user){ON.pendingJoin=id;showView("online:play");toast("Melde dich an, um der Partie beizutreten.");return}
  if(ON.unsubG){ON.unsubG();ON.unsubG=null}
  stopEngine();sess=null;game=null;drill=null;puz=null;flipped=false;
  ON.gid=id;ON.g=null;ON.joinTried=false;ON.recv=null;ON.conn=true;ON.lastSnap=0;clockSync();
  resetBoard();mode="online";op={id:"__online",g:"c",side:"w",name:"Online-Partie",eco:"Online",d:"",plan:[],lines:[]};
  showView("train");buildSquares();renderChrome();render();setStatus("view","Partie wird geladen …","");
  ON.unsubG=gameSub(id);startGameSync();
}
function gameSub(id){
  return NET.watch("games/"+id,(d,err,meta)=>{if(ON.gid!==id)return;
    if(meta){const c=!meta.cache;if(c!==ON.conn){ON.conn=c;onlineStatus()}}
    if(err){setStatus("bad","Keine Berechtigung","Diese Partie kannst du nicht öffnen.");return}
    if(!d){setStatus("bad","Partie nicht gefunden","Der Link ist ungültig oder die Partie wurde gelöscht.");return}
    ON.lastSnap=Date.now();const k=gameKey(d);if(ON.g&&k===ON.gKey&&!meta.pend){onlineChrome();return}
    const me=ON.user.uid;
    if(d.status==="waiting"&&!d.invite&&(d.players||[]).length===1&&d.players[0]!==me&&!ON.joinTried){ON.joinTried=true;joinGame(id,d).then(ok=>{if(!ok)toast("Beitreten nicht möglich.")}).catch(e=>toast(netErr(e)))}
    applyGame(d);
  },true);
}
/* Fingerabdruck einer Partie ohne die Anwesenheits-Felder: gleiche Daten ⇒ nichts neu zeichnen */
function gameKey(d){return JSON.stringify([d.status,(d.moves||[]).length,(d.moves||[]).slice(-1)[0]||"",d.result||"",d.drawOffer||"",d.takeback||"",d.rematch||"",(d.chat||[]).length,d.updated||0,d.white||"",d.black||"",d.times||""])}
/* Rückfall: In laufenden Partien wird regelmäßig direkt beim Server nachgefragt. Ist das Live-Abo hängen geblieben
   (Standby, Funkloch), holt das die Partie sofort auf den richtigen Stand und abonniert neu. */
function startGameSync(){stopGameSync();ON.syncIv=setInterval(()=>gamePoll(false),2500)}
function stopGameSync(){clearInterval(ON.syncIv);ON.syncIv=null}
async function gamePoll(force){
  const id=ON.gid,g=ON.g;if(!id||mode!=="online"||!NET||!NET.getSrv||ON.polling)return;
  if(!force){if(document.visibilityState!=="visible")return;if(g&&(g.status==="over"||g.status==="cancelled"||g.status==="declined"))return;
    const corr=g&&g.tc&&g.tc.d;const myTurn=g&&g.status==="active"&&!ON.spect&&new Chess(g.fen||START_FEN).turn()===ON.color&&hist.length===(g.moves||[]).length;
    const every=corr?60000:myTurn?12000:5000;if(Date.now()-(ON.polledAt||0)<every)return}
  ON.polling=true;ON.polledAt=Date.now();
  try{const d=await NET.getSrv("games/"+id);if(ON.gid!==id)return;ON.polling=false;netState(true);if(!ON.conn){ON.conn=true;onlineStatus()}
    if(!d||!ON.g)return;const cur=ON.g;const nm=(d.moves||[]).length,cm=(cur.moves||[]).length;
    const newer=nm>cm||(d.updated||0)>(cur.updated||0)||(d.status!==cur.status&&cur.status!=="over");
    if(newer&&gameKey(d)!==gameKey(cur)){ON.resyncs=(ON.resyncs||0)+1;applyGame(d);if(ON.unsubG){ON.unsubG();ON.unsubG=gameSub(id)}}
    presence(false);
  }catch(e){if(ON.gid===id){netState(false);if(ON.conn){ON.conn=false;onlineStatus()}}}finally{ON.polling=false}
}
/* Anwesenheit: Mitspieler melden alle 20 s „bin da“ in der Partie (nur Zeitstempel, keine weiteren Daten) */
function presence(away){
  const g=ON.g;if(!g||ON.spect||!ON.user||!ON.gid||g.status!=="active"||mode!=="online")return;const me=ON.user.uid;const now=srvNow();
  if(!away&&now-(ON.seenAt||0)<20000)return;ON.seenAt=away?0:now;
  NET.set("games/"+ON.gid,{seen:{[me]:away?now-120000:now}},true).catch(()=>{});
}
function oppAway(g){if(!g||ON.spect||g.status!=="active")return false;const o=oppUid(g);const t=o&&g.seen&&g.seen[o];if(!t)return false;return srvNow()-t>45000}
function applyGame(d,force){
  const prevStatus=ON.g&&ON.g.status;ON.g=d;ON.gKey=gameKey(d);if(mode!=="online")return;
  const col=myColorIn(d);const newCol=col||"w";if(newCol!==ON.color||!op||op.side!==newCol){ON.color=newCol;op.side=newCol;buildSquares()}
  ON.spect=!col;
  const ms=d.moves||[];const wasLive=live();
  /* Eigener Zug ist schon auf dem Brett, aber noch nicht beim Server: nicht zurückspringen */
  if(!force&&ON.busy&&ms.length===hist.length-1&&ms.every((m,i)=>m===hist[i])){renderChrome();onlineStatus();startOnTick();return}
  const same=!force&&ms.length>=hist.length&&hist.every((m,i)=>m===ms[i]);
  let last=null;
  const pre=d.pre||0;
  if(same){for(let i=hist.length;i<ms.length;i++){try{last=commit(ms[i],i<pre?"b":"g")}catch(e){force=true;break}}}
  if(!same||force){resetBoard();mode="online";for(let i=0;i<ms.length;i++){try{last=commit(ms[i],i<pre?"b":"g")}catch(e){break}}view=hist.length;shown=new Chess(fens[view]);render();last=null}
  else if(last){if(wasLive){view=hist.length;shown=new Chess(fens[view]);render(ms.length-hist.length===0?{fwd:last}:null);if(last.color!==ON.color)playSound(last)}else render()}
  if(d.status==="active"&&ms.length&&(!ON.recv||ON.recv.n!==ms.length)&&new Chess(d.fen||START_FEN).turn()===ON.color&&!ON.spect)ON.recv={n:ms.length,at:srvNow()};
  else render();
  if(d.status==="over"&&prevStatus&&prevStatus!=="over"){sfx(d.result&&d.result!=="-"&&d.result!=="1/2-1/2"&&(d.result==="1-0")===(ON.color==="w")?"done":"wrong")}
  if(d.status!=="active")ON.pre=null;
  renderChrome();onlineStatus();startOnTick();renderQChat();runPremove();turnTitle();presence(false);
}
function onCanMove(){const g=ON.g;return !!g&&g.status==="active"&&!ON.spect&&live()&&shown.turn()===ON.color&&!ON.busy&&hist.length===(g.moves||[]).length}
/* Wann begann mein Zug? Kam der gegnerische Zug verspätet an, zählt die Ankunft (höchstens 2 s Ausgleich) */
function turnStart(g,c){const n=(g.moves||[]).length;let s=g.lastAt||srvNow();if(c===ON.color&&!ON.spect&&ON.recv&&ON.recv.n===n)s=Math.max(s,Math.min(ON.recv.at,s+2000));return s}
const withTimeout=(p,ms)=>Promise.race([p,new Promise((_,rj)=>setTimeout(()=>{const e=new Error("timeout");e.code="timeout";rj(e)},ms))]);
function gameEndOf(c){if(c.in_checkmate())return {result:winRes(otherCol(c.turn())),reason:"Schachmatt"};if(c.in_stalemate())return {result:"1/2-1/2",reason:"Patt"};if(c.insufficient_material())return {result:"1/2-1/2",reason:"zu wenig Material"};if(c.in_threefold_repetition())return {result:"1/2-1/2",reason:"Stellungswiederholung"};if(c.in_draw())return {result:"1/2-1/2",reason:"50-Züge-Regel"};return null}
async function onlineMove(mv,animate){
  if(!onCanMove())return;
  const r=commit(mv,"g");view=hist.length;shown=new Chess(fens[view]);sel=null;render(animate?{fwd:r}:null);playSound(r);
  ON.busy=true;onlineStatus();const now=srvNow(),myC=ON.color,n=hist.length-1,gid=ON.gid,start0=ON.g?turnStart(ON.g,myC):now;
  let ok=false,failed=false;
  try{ok=await withTimeout(NET.tx("games/"+gid,d=>{
    if(!d||d.status!=="active"||(d.moves||[]).length!==n)return null;
    const c=new Chess();for(const m of d.moves)c.move(m);if(c.turn()!==myC)return null;
    const m=c.move(r.san);if(!m)return null;
    if(d.tc&&d.tc.d&&playedN(d)>=2&&now-(d.lastAt||now)>d.tc.d*DAY_MS)return {status:"over",result:winRes(otherCol(myC)),reason:"Zeit abgelaufen",updated:now};
    const upd={moves:d.moves.concat(m.san),fen:c.fen(),lastAt:now,updated:now,drawOffer:null,takeback:null};
    const st0=Math.max(d.lastAt||now,Math.min(start0,(d.lastAt||now)+2000));
    if(d.tc&&d.times&&playedN(d)>=2){const left=d.times[myC]-(now-st0);if(left<=0)return {status:"over",result:winRes(otherCol(myC)),reason:"Zeit abgelaufen",updated:now};upd.times={w:d.times.w,b:d.times.b};upd.times[myC]=left+d.tc.i*1000}
    if(d.tc&&!d.tc.d){const clk=(d.clk||[]).slice(0,d.moves.length);while(clk.length<d.moves.length)clk.push(null);clk.push(upd.times?Math.round(upd.times[myC]/100)*100:d.times?d.times[myC]:null);upd.clk=clk}
    const end=gameEndOf(c);if(end)Object.assign(upd,{status:"over",result:end.result,reason:end.reason});
    return upd}),15000)}catch(e){failed=true;toast(e&&e.code==="timeout"?"Der Zug kam nicht beim Server an – die Partie wird neu geladen.":netErr(e))}
  if(ON.gid!==gid){ON.busy=false;return}
  ON.busy=false;
  if(!ok){if(failed){try{const d=await NET.getSrv("games/"+gid);if(d&&ON.gid===gid){applyGame(d,true);return}}catch(e){ON.conn=false;netState(false)}}if(ON.g)applyGame(ON.g,true)}else{onlineStatus();/* Bestätigung vom Live-Abo bleibt aus? Dann selbst nachsehen */setTimeout(()=>{if(ON.gid===gid&&ON.g&&(ON.g.moves||[]).length<hist.length)gamePoll(true)},2500)}
}
/* Uhren */
function clockLeft(g,c){if(!g.tc||!g.times||g.tc.d)return null;let t=g.times[c];const running=g.status==="active"&&playedN(g)>=2&&new Chess(g.fen||START_FEN).turn()===c;if(running)t-=srvNow()-turnStart(g,c);return t}
const fmtClock=ms=>{if(ms==null)return "";ms=Math.max(0,ms);const s=ms/1000;if(s<20)return (Math.floor(s*10)/10).toFixed(1);const m=Math.floor(s/60),ss=Math.floor(s%60);return m+":"+String(ss).padStart(2,"0")};
function onlineClocks(){
  const g=ON.g;const yc=$("youClock"),oc=$("oppClock");if(!g){yc.textContent=oc.textContent="";return}
  const me=ON.color,op2=otherCol(me);const turn=new Chess(g.fen||START_FEN).turn();const act=g.status==="active";
  if(g.tc&&g.tc.d){const L=corrLeft(g);yc.textContent=act?(turn===me?(L==null?"Am Zug":fmtDays(L)):"Wartet"):g.status==="waiting"?"Wartet":"Ende";oc.textContent=act?(turn===op2?(L==null?"Am Zug":fmtDays(L)):"Wartet"):g.status==="waiting"?"–":"Ende";yc.classList.toggle("low",act&&turn===me&&L!=null&&L<6*3600000);oc.classList.remove("low")}
  else if(g.tc){const a=clockLeft(g,me),b=clockLeft(g,op2);yc.textContent=fmtClock(a);oc.textContent=fmtClock(b);yc.classList.toggle("low",a<20000);oc.classList.toggle("low",b<20000);
    if(act&&!ON.spect&&turn===me&&playedN(g)>=2&&S.set.lowTime!==false){const s=Math.ceil(a/1000);if(s<=10&&s>0&&s!==ON.lowS){ON.lowS=s;sfx("tick")}}}
  else{yc.textContent=act?(turn===me?"Am Zug":"Wartet"):g.status==="waiting"?"Wartet":"Ende";oc.textContent=act?(turn===op2?"Denkt …":"Wartet"):g.status==="waiting"?"–":"Ende"}
  yc.classList.toggle("on",act&&turn===me);oc.classList.toggle("on",act&&turn===op2);
}
function startOnTick(){stopOnTick();if(!ON.g||ON.g.status!=="active")return;if(!ON.g.tc){ON.tick=setInterval(()=>{if(mode!=="online"||!ON.g){stopOnTick();return}onlineAwayUi()},5000);return}ON.tick=setInterval(()=>{if(mode!=="online"||!ON.g){stopOnTick();return}onlineClocks();checkFlag();if(++ON.tickN%25===0)onlineAwayUi()},200)}
/* Wechselt der Gegner zwischen „verbunden“ und „weg“, Knöpfe und Hinweis anpassen */
function onlineAwayUi(){const a=oppAway(ON.g);if(a!==ON.awayShown){ON.awayShown=a;onlineChrome();onlineStatus()}}
function stopOnTick(){clearInterval(ON.tick);ON.tick=null}
function checkFlag(){
  const g=ON.g;if(!g||g.status!=="active"||!g.tc||playedN(g)<2||ON.spect)return;
  if(g.tc.d){const L=corrLeft(g);if(L==null||L>-2000||srvNow()-ON.claimT<10000)return;ON.claimT=srvNow();const now=srvNow();
    NET.tx("games/"+ON.gid,d=>{if(!d||d.status!=="active"||!d.tc||!d.tc.d)return null;if(now-(d.lastAt||now)<=d.tc.d*DAY_MS)return null;const t=new Chess(d.fen).turn();return {status:"over",result:winRes(otherCol(t)),reason:"Zeit abgelaufen",updated:now}}).catch(()=>{});return}const turn=new Chess(g.fen).turn();const left=clockLeft(g,turn);
  const grace=turn===ON.color?0:2000;if(left>-grace||srvNow()-ON.claimT<3000)return;ON.claimT=srvNow();const now=srvNow();
  NET.tx("games/"+ON.gid,d=>{if(!d||d.status!=="active"||!d.tc)return null;const t=new Chess(d.fen).turn();if(d.times[t]-(now-d.lastAt)>-grace)return null;return {status:"over",result:winRes(otherCol(t)),reason:"Zeit abgelaufen",updated:now}}).catch(()=>{});
}
/* Kopf, Spielerleisten, Knöpfe */
function onlineChrome(){
  const g=ON.g;const me=ON.color,oc=otherCol(me);
  $("eco").textContent=(g&&g.theme?"Themenpartie · "+g.theme.name:"Online-Partie")+(g?" · "+tcTxt(g.tc):"")+(SOC.viewers?` · 👁 ${SOC.viewers} ${SOC.viewers===1?"Zuschauer":"Zuschauer"}`:"");$("title").textContent=g?`${(g.names&&g.white&&g.names[g.white])||"Weiß"} – ${(g.names&&g.black&&g.names[g.black])||"Schwarz"}`:"Online-Partie";
  $("desc").textContent=g?(g.status==="over"?`${resTxt(g,ON.spect?null:me)} · ${g.reason||""}`:g.status==="waiting"?"Wartet auf den Gegner":"Läuft"):"";
  $("phIcon").innerHTML=NI.online;
  const av=$("oppAv");av.className="avatar you2";av.innerHTML=ICON.face;
  const nm=c=>{if(!g)return "";const u=c==="w"?g.white:g.black;return u?(g.names&&g.names[u])||"Spieler":"wartet …"};
  $("oppName").textContent=nm(oc)+(g&&!ON.spect&&g.status==="active"&&oppAway(g)?" · nicht verbunden":"");$("youName").textContent=ON.spect?nm(me):nm(me)+" (du)";$("oppTag").textContent=oc==="w"?"(Weiß)":"(Schwarz)";$("youTag").textContent=me==="w"?"(Weiß)":"(Schwarz)";
  const box=$("actsOn");box.hidden=false;let h="";const myU=ON.user&&ON.user.uid;
  if(!g){h=""}
  else if(ON.spect){h=`<button class="btn" data-on="leave">Zurück</button>`}
  else if(g.status==="waiting"){h=g.invite===myU?`<button class="btn grn" data-on="accept">Annehmen</button><button class="btn" data-on="decline">Ablehnen</button>`:`<button class="btn grn" data-on="share">${g.invite?"Wartet auf Zusage":"Link teilen"}</button><button class="btn" data-on="abort">Abbrechen</button>`}
  else if(g.status==="active"){const n=playedN(g);
    if(g.takeback&&g.takeback.by!==myU)h=`<button class="btn grn" data-on="tbyes">Zurücknahme annehmen</button><button class="btn" data-on="tbno">Ablehnen</button>`;
    else if(g.drawOffer&&g.drawOffer!==myU)h=`<button class="btn grn" data-on="drawyes">Remis annehmen</button><button class="btn" data-on="drawno">Ablehnen</button>`;
    else if(canClaim(g))h=`<button class="btn grn" data-on="claim">Sieg beanspruchen</button><button class="btn" data-on="claimdraw">Remis</button><button class="btn red" data-on="resign">Aufgeben</button>`;
    else h=`${n<2?`<button class="btn" data-on="abort">Abbrechen</button>`:`<button class="btn" data-on="draw" ${g.drawOffer?"disabled":""}>${g.drawOffer?"Remis angeboten":"Remis"}</button>`}${n?`<button class="btn" data-on="tb" ${canAskTakeback(g)?"":"disabled"}>${g.takeback&&g.takeback.by===myU?"Angefragt":"Zurück"}</button>`:""}<button class="btn red" data-on="resign">Aufgeben</button>`}
  else{const rm=g.rematch;h=`<button class="btn grn" data-on="analyze">Partie analysieren</button><button class="btn ${rm&&rm.by!==myU?"grn":""}" data-on="rematch">${rm?(rm.by===myU?"Revanche angeboten":"Revanche annehmen"):"Revanche"}</button>`;if(g.result==="-")h=`<button class="btn" data-on="leave">Zur Übersicht</button><button class="btn" data-on="rematch">Neue Partie</button>`}
  box.innerHTML=h;box.className=(h.match(/<button/g)||[]).length===3?"acts":"acts two";
  box.querySelectorAll("[data-on]").forEach(b=>b.onclick=()=>{const a=b.dataset.on;
    if(a==="resign"){if(!b.dataset.sure){b.dataset.sure="1";b.textContent="Wirklich aufgeben?";setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent="Aufgeben"}},3000);return}onResign()}
    else if(a==="abort")onAbort();else if(a==="draw")onOfferDraw();else if(a==="drawyes")onDrawAnswer(true);else if(a==="tb")onTakebackAsk();else if(a==="tbyes")onTakebackAnswer(true);else if(a==="tbno")onTakebackAnswer(false);else if(a==="drawno")onDrawAnswer(false);
    else if(a==="share")shareInvite(ON.gid);else if(a==="accept")joinGame(ON.gid).catch(e=>toast(netErr(e)));else if(a==="decline")onDecline();
    else if(a==="analyze")analyzeOnline();else if(a==="rematch")onRematch();else if(a==="leave")leaveOnline();else if(a==="claim")onClaim(false);else if(a==="claimdraw")onClaim(true)});
}
/* Gegner seit über einer Minute weg und am Zug: Sieg oder Remis beanspruchen (nicht im Fernschach) */
function canClaim(g){if(!g||ON.spect||g.status!=="active"||(g.tc&&g.tc.d)||playedN(g)<2)return false;const o=oppUid(g);const t=o&&g.seen&&g.seen[o];if(!t||srvNow()-t<60000)return false;return new Chess(g.fen||START_FEN).turn()!==ON.color}
function onClaim(draw){const me=ON.color,o=oppUid(ON.g);const now=srvNow();gameAct(d=>{if(!d||d.status!=="active"||!o)return null;const t=d.seen&&d.seen[o];if(!t||now-t<60000||new Chess(d.fen||START_FEN).turn()===me)return null;
  return draw?{status:"over",result:"1/2-1/2",reason:"Gegner hat die Partie verlassen",updated:now,drawOffer:null}:{status:"over",result:winRes(me),reason:"Gegner hat die Partie verlassen",updated:now,drawOffer:null}})}
/* Im Tab-Titel zeigen, wenn man am Zug ist – praktisch, wenn die Seite im Hintergrund liegt */
const BASE_TITLE=document.title;
function turnTitle(){const g=ON.g;let t=BASE_TITLE;if(mode==="online"&&g&&g.status==="active"&&!ON.spect&&new Chess(g.fen||START_FEN).turn()===ON.color)t="● Du bist am Zug – "+BASE_TITLE;else if(ON.badge)t="("+ON.badge+") "+BASE_TITLE;if(document.title!==t)document.title=t}
function onlineStatus(){
  const g=ON.g;if(!g||mode!=="online")return;const me=ON.color,myU=ON.user&&ON.user.uid;const opn=oppName(g);
  if(g.status!=="over"&&(!ON.conn||!navigator.onLine)){setStatus("bad","Verbindung unterbrochen","Die Partie verbindet sich automatisch neu. Züge gehen erst wieder, wenn die Verbindung steht.",true);return}
  if(!live()){setStatus("view",`Du siehst Zug ${Math.ceil(view/2)}`,"Blättere mit → zurück zur aktuellen Stellung.",true);return}
  if(g.status==="waiting"){if(g.invite===myU)setStatus("turn",`${g.names[g.creator]||"Jemand"} fordert dich heraus`,`Bedenkzeit ${tcTxt(g.tc)} · du spielst ${me==="w"?"Weiß":"Schwarz"}.`,true);else setStatus("view","Warte auf deinen Gegner",g.invite?`${opn} muss die Herausforderung noch annehmen.`:"Schick den Einladungslink an deinen Freund. Die Partie startet, sobald er beitritt.",true);return}
  if(g.status==="over"){const r=resTxt(g,ON.spect?null:me),tb=themeBook(g);setStatus(r==="Gewonnen"?"done":r==="Verloren"?"bad":"view",r==="Gewonnen"?"Du hast gewonnen!":r==="Verloren"?"Du hast verloren":r,`${g.reason||""}${g.result&&g.result!=="-"?" · "+g.result:""}. ${tb?tb+" ":""}${g.result!=="-"?"Mit »Partie analysieren« siehst du die Bewertung jedes Zugs.":""}`,true);return}
  if(ON.spect){setStatus("view","Du schaust zu",`${(g.moves||[]).length} Halbzüge gespielt.`,true);return}
  const turn=new Chess(g.fen).turn();
  if(g.drawOffer&&g.drawOffer!==myU){setStatus("turn",`${opn} bietet Remis an`,"Nimm an oder spiel einfach weiter.",true);return}
  if(ON.busy){setStatus("view","Zug wird gesendet …","",true);return}
  if(turn===me)setStatus("turn","Du bist am Zug",(playedN(g)===0&&g.theme?`Themenpartie ${g.theme.name}${g.theme.line?" · "+g.theme.line:""}: Die Theorie ist gespielt, ab hier zählt es. `:"")+(playedN(g)<2&&g.tc?"Die Uhr startet nach dem ersten Zug beider Seiten.":""),true);
  else if(canClaim(g))setStatus("view",`${opn} ist seit über einer Minute weg`,"Du kannst weiter warten oder den Sieg beanspruchen.",true);
  else if(oppAway(g))setStatus("view",`${opn} ist gerade nicht verbunden`,"Vielleicht nur ein Funkloch – die Partie läuft weiter.",true);
  else setStatus("view",`${opn} denkt …`,g.drawOffer===myU?"Du hast Remis angeboten.":"",true);
}
function analyzeOnline(){
  const g=ON.g;if(!g||!(g.moves||[]).length){toast("Es wurden noch keine Züge gespielt.");return}
  const me=ON.spect?"w":ON.color;const res=g.result==="1/2-1/2"||g.result==="-"?"draw":(g.result==="1-0")===(me==="w")?"win":"loss";
  const wn=g.names[g.white]||"Weiß",bn=g.names[g.black]||"Schwarz";
  reviewGame({id:"on-"+ON.gid,color:me,res,result:g.result||"",term:g.reason||"",fam:famOfMoves(g.moves),moves:g.moves.slice(),tc:"",url:"",opp:me==="w"?bn:wn,oppR:null,myR:null,date:g.created||srvNow(),name:me==="w"?wn:bn,acc:null,white:wn,black:bn,foreign:ON.spect});
}

/* Eröffnung für die Themenpartie: frei, nach den Stammzügen oder nach einer bestimmten Variante */
function themePicker(){
  const t=ON.theme&&byId(ON.theme.id)?ON.theme:null,o=t?byId(t.id):null;
  const pool=ALL.filter(x=>x.lines&&x.lines.length&&x.g!=="c"&&!/^__/.test(x.id)),rep=pool.filter(x=>S.rep.indexOf(x.id)>=0);
  const opt=x=>`<option value="${esc(x.id)}"${t&&t.id===x.id?" selected":""}>${esc(x.name)}</option>`;
  const grp=(lab,L)=>L.length?`<optgroup label="${lab}">${L.map(opt).join("")}</optgroup>`:"";
  let html=`<div class="fld">Eröffnung</div><select id="onTheme" class="txt onsel"><option value="">Freie Partie aus der Grundstellung</option>${grp("Dein Repertoire",rep)}${grp("Mit Weiß",pool.filter(x=>x.g==="w"))}${grp("Mit Schwarz",pool.filter(x=>x.g==="b"))}${grp("Gambits & Fallen",pool.filter(x=>x.g==="x"))}</select>`;
  if(o){const stem=themeStem(o),TM=themeMoves(t);
    html+=`<div class="fld" style="margin-top:10px">Start</div><select id="onThemeLi" class="txt onsel">${stem.length>=2?`<option value="-1"${t.li<0?" selected":""}>Nach den Stammzügen (${esc(fmtMoves(stem,0))})</option>`:""}${o.lines.map((l,i)=>`<option value="${i}"${t.li===i?" selected":""}>Nach „${esc(l.n)}“ (${Math.ceil(l.m.length/2)} Züge)</option>`).join("")}</select>
      <p class="hint ontheme-h">${TM?`Ihr startet nach ${esc(fmtMoves(TM.moves,0))}. `:""}Nach der Partie siehst du, wer das Buch zuerst verlassen hat.</p>`}
  return `<div style="margin:0 0 12px">${html}</div>`;
}
/* ---- Ansicht „Online“ ---- */
function renderOnline(){
  const v=$("v-online");if(!v)return;
  if(!onlineReady()){v.innerHTML=`${pageHead(`Online spielen`,`Konten und Partien gegen Freunde werden gerade eingerichtet. Sobald das Firebase-Projekt verbunden ist, kannst du dich hier anmelden.`,"online","online")}`;return}
  if(!ON.booted)onlineBoot();
  if(ON.netErr){v.innerHTML=`${pageHead(`Online spielen`,`Der Server ist gerade nicht erreichbar. Prüfe deine Internetverbindung.`,"online","online")}<button class="btn" id="onRetry" style="align-self:flex-start;padding:10px 16px">Erneut versuchen</button>`;$("onRetry").onclick=()=>{ON.netErr=false;ON.booted=false;renderOnline()};return}
  if(!ON.authKnown){v.innerHTML=`<div class="card">${SKEL}</div>`;return}
  if(!ON.user){renderAuth(v);return}
  if(!ON.profile){v.innerHTML=`<div class="card"><h3>Wähle deinen Benutzernamen</h3><p class="hint">So finden dich deine Freunde. Er lässt sich später nicht ändern.</p><input class="txt" id="onName" maxlength="20" placeholder="z. B. Springer_Max" autocapitalize="off"><div class="btnrow" style="margin-top:10px"><button class="btn grn" id="onNameGo">Speichern</button><button class="btn" id="onOut">Abmelden</button><span class="hint" id="onMsg"></span></div></div>`;
    $("onNameGo").onclick=async()=>{const n=$("onName").value.trim();if(!NAME_RE.test(n)){$("onMsg").textContent="3–20 Zeichen: Buchstaben, Ziffern, _ oder -.";return}try{await claimName(n)}catch(e){const m=$("onMsg"),t=String(e.message)==="name-taken"?"Schon vergeben.":netErr(e);if(m)m.textContent=t;else toast(t)}};$("onOut").onclick=doLogout;return}
  const P=ON.profile,me=ON.user.uid;const G=ON.games;
  const inv=G.filter(g=>g.status==="waiting"&&g.invite===me);const mine=G.filter(g=>g.status==="waiting"&&g.creator===me);
  const act=G.filter(g=>g.status==="active");const over=G.filter(g=>g.status==="over"&&g.result!=="-").slice(0,20);
  const row=(g,extra)=>{const c=myColorIn(g);const turn=g.status==="active"?new Chess(g.fen||START_FEN).turn():null;const mine2=turn&&turn===c;
    return `<div class="onrow"><button class="onopen" data-og="${esc(g.id)}"><span class="kchip ${c||"w"}"></span><span class="onn"><b>${esc(oppName(g))}</b><small>${g.theme?esc(g.theme.name)+" · ":""}${tcTxt(g.tc)} · ${g.status==="over"?esc(resTxt(g,c))+" · "+esc(g.reason||""):g.status==="active"?((g.moves||[]).length+" Halbzüge"):g.invite?"Herausforderung":"Einladungslink"} · ${fmtDate(g.updated||g.created)}</small></span>${mine2?'<span class="onturn">Am Zug</span>':""}</button>${extra||""}</div>`};
  const tcs=[["1+0","1 Min"],["3+2","3 | 2"],["5+0","5 Min"],["10+0","10 Min"],["15+10","15 | 10"],["30+0","30 Min"],["d1","1 Tag/Zug"],["d3","3 Tage/Zug"],["none","Ohne Uhr"]];
  const friends=(P.friends||[]);
  const OTH={leader:["Bestenliste","Alle Spieler im Vergleich."],friends:["Freunde","Anfragen, Online-Status und Herausforderungen."],live:["Live","Laufende Partien – tippe zum Zuschauen."],admin:["Admin","Übersicht über Konten und Partien."]}[ON.tab];
  v.innerHTML=`${OTH?pageHead(OTH[0],OTH[1],ON.tab==="admin"?"settings":ON.tab==="live"?"swords":"online",ON.tab==="admin"?"":ON.tab==="leader"?"league":"online"):`<div class="onhead"><span class="onav"${avSt(P.av)}>${avTxt(P.name,P.av)}</span><div><h2>${esc(P.name)}</h2><small>Wertung ${P.elo||1200} · ${P.w||0} Siege · ${P.d||0} Remis · ${P.l||0} Niederlagen</small></div></div>`}
  ${P.banned?`<div class="err">Dein Konto wurde gesperrt. Du kannst keine neuen Partien starten.</div>`:""}
  ${ON.tab==="play"?`
  ${inv.length?`<div class="card"><h3>Herausforderungen</h3>${inv.map(g=>row(g,`<span class="onbtns"><button class="btn grn" data-acc="${esc(g.id)}">Annehmen</button><button class="btn" data-dec="${esc(g.id)}">Ablehnen</button></span>`)).join("")}</div>`:""}
  <div class="card mmcard"><h3>Schnelle Partie</h3>${MM.on?`<div class="mm-on"><span class="mm-spin"></span><span><b>Suche Gegner …</b><small>${esc(tcTxt(parseTc(MM.tc)))} · <span id="mmTime">${Math.floor((Date.now()-MM.t0)/1000)} s</span> · etwa gleich stark</small></span><button class="btn" id="mmStop">Abbrechen</button></div>`:`<p class="hint" style="margin:0 0 10px">Ein zufälliger Gegner mit ähnlicher Wertung und derselben Bedenkzeit (${esc(tcTxt(parseTc(ON.tc)))}).</p><button class="btn grn wide" id="mmGo">Gegner suchen</button>`}</div>
  <div class="card"><h3>Partie gegen Freunde</h3>
    <div class="fld">Bedenkzeit</div><div class="filters" style="margin:6px 0 12px">${tcs.map(t=>`<button class="chip${ON.tc===t[0]?" on":""}" data-tc="${t[0]}">${t[1]}</button>`).join("")}</div>
    ${themePicker()}
    <div class="fld">Deine Farbe</div><div class="seg" style="margin:6px 0 14px">${[["w","Weiß"],["r","Zufall"],["b","Schwarz"]].map(c=>`<button data-col="${c[0]}" aria-pressed="${ON.col===c[0]}">${c[1]}</button>`).join("")}</div>
    <div class="btnrow"><button class="btn grn" id="onLink" style="padding:11px 16px">Einladungslink erstellen</button>${friends.length?`<select id="onFr" class="txt" style="width:auto;flex:1;min-width:120px">${friends.map(f=>`<option value="${esc(f.uid)}">${esc(f.name)}</option>`).join("")}</select><button class="btn" id="onChal" style="padding:11px 16px">Herausfordern</button>`:`<span class="hint">Füge unter Profil → Freunde Freunde hinzu, um sie direkt herauszufordern.</span>`}</div></div>
  ${act.length?`<div class="card"><h3>Laufende Partien</h3>${act.map(g=>row(g)).join("")}</div>`:""}
  ${mine.length?`<div class="card"><h3>Offene Einladungen</h3>${mine.map(g=>row(g,`<span class="onbtns"><button class="btn" data-shr="${esc(g.id)}">Teilen</button><button class="btn" data-can="${esc(g.id)}">Löschen</button></span>`)).join("")}</div>`:""}
  ${over.length?`<div class="card"><h3>Beendete Partien</h3>${over.map(g=>row(g)).join("")}</div>`:""}`:""}
  ${ON.tab==="account"?`<div class="card"><h3>Avatar</h3><p class="hint" style="margin:0 0 10px">So sehen dich andere Spieler in der Bestenliste und bei Partien.</p>${avPicker(P.av)}<div class="btnrow" style="margin-top:10px"><button class="btn" data-go="player:${esc(me)}">Mein Profil ansehen</button></div></div><div class="card"><h3>Konto</h3><p class="hint" style="margin:0 0 10px">Angemeldet als <b>${esc(ON.user.email)}</b>. Deine Nutzer-ID: <code class="uid">${esc(ON.user.uid)}</code> <button class="chip" id="onUid">Kopieren</button> Dein Trainingsfortschritt (Varianten, Wiederholungen, Taktik, Einstellungen) wird automatisch in deinem Konto gesichert und ist auf allen Geräten gleich.</p>
    <p class="hint" style="margin:0 0 12px">${ON.syncAt?"Zuletzt gesichert: "+new Date(ON.syncAt).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}):"Noch nicht gesichert."}</p>
    <div class="btnrow"><button class="btn" id="onSync">Jetzt sichern</button><button class="btn" id="onOut">Abmelden</button></div>
    <div class="setrow" style="margin-top:12px"><span><b>In der Bestenliste zeigen</b><small>Taktik-Wertung, gelernte Varianten und Serie erscheinen für andere Spieler. Deine Online-Bilanz ist immer sichtbar.</small></span><button class="switch" id="onLbShow" aria-pressed="${!S.set.lbHide}" aria-label="In der Bestenliste zeigen"></button></div></div>
    <div class="card"><h3>Konto löschen</h3><p class="hint" style="margin:0 0 10px">Löscht dein Profil, deinen Benutzernamen und den Cloud-Fortschritt. Dein Fortschritt in diesem Browser bleibt erhalten.</p><div class="btnrow"><button class="btn red" id="onDel">Konto löschen</button><span class="hint" id="onDelMsg"></span></div></div>`:""}`;
  v.querySelectorAll("[data-ot]").forEach(b=>b.onclick=()=>{ON.tab=b.dataset.ot;renderOnline()});
  v.querySelectorAll("[data-og]").forEach(b=>b.onclick=()=>openOnlineGame(b.dataset.og));
  if($("mmGo"))$("mmGo").onclick=()=>mmStart();if($("mmStop"))$("mmStop").onclick=()=>mmStop();
  if(ON.tab==="account")wireAvPicker(v);v.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showView(b.dataset.go));
  v.querySelectorAll("[data-tc]").forEach(b=>b.onclick=()=>{ON.tc=b.dataset.tc;store.set("et-ontc",ON.tc);renderOnline()});
  v.querySelectorAll("[data-col]").forEach(b=>b.onclick=()=>{ON.col=b.dataset.col;store.set("et-oncol",ON.col);renderOnline()});
  if($("onTheme"))$("onTheme").onchange=()=>{const id=$("onTheme").value;if(!id){ON.theme=null}else{const o=byId(id);ON.theme={id,li:themeStem(o).length>=2?-1:0};ON.col=o.side;store.set("et-oncol",ON.col)}store.set("et-ontheme",ON.theme);renderOnline()};
  if($("onThemeLi"))$("onThemeLi").onchange=()=>{if(ON.theme){ON.theme.li=+$("onThemeLi").value;store.set("et-ontheme",ON.theme);renderOnline()}};
  v.querySelectorAll("[data-acc]").forEach(b=>b.onclick=async()=>{const id=b.dataset.acc;try{await joinGame(id)}catch(e){toast(netErr(e))}openOnlineGame(id)});
  v.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const id=b.dataset.dec;NET.tx("games/"+id,d=>d&&d.status==="waiting"&&d.invite===me?{status:"declined",updated:Date.now()}:null).catch(e=>toast(netErr(e)))});
  v.querySelectorAll("[data-shr]").forEach(b=>b.onclick=()=>shareInvite(b.dataset.shr));
  v.querySelectorAll("[data-can]").forEach(b=>b.onclick=()=>{const id=b.dataset.can;NET.tx("games/"+id,d=>d&&d.status==="waiting"?{status:"cancelled",updated:Date.now()}:null).catch(e=>toast(netErr(e)))});
  const fr=id=>friends.find(f=>f.uid===id);
  if($("onLink"))$("onLink").onclick=()=>createGame(null);
  if($("onChal"))$("onChal").onclick=()=>{const f=fr($("onFr").value);if(f)createGame(f)};
  v.querySelectorAll("[data-chf]").forEach(b=>b.onclick=()=>{const f=fr(b.dataset.chf);if(f){ON.tab="play";createGame(f)}});
  v.querySelectorAll("[data-rmf]").forEach(b=>b.onclick=()=>{NET.set("users/"+me,{friends:friends.filter(f=>f.uid!==b.dataset.rmf)},true).catch(e=>toast(netErr(e)))});
  if($("frAdd"))$("frAdd").onclick=async()=>{const n=$("frName").value.trim();const msg=t=>{const m=$("frMsg");if(m)m.textContent=t;else if(t)toast(t)};if(!n)return;
    try{const u=await NET.get("usernames/"+n.toLowerCase());if(!u){msg(`„${n}“ gibt es nicht.`);return}if(u.uid===me){msg("Das bist du selbst.");return}if(friends.some(f=>f.uid===u.uid)){msg("Ist schon in deiner Liste.");return}
      const p=await NET.get("users/"+u.uid);await NET.set("users/"+me,{friends:friends.concat({uid:u.uid,name:(p&&p.name)||n})},true);toast(`${(p&&p.name)||n} hinzugefügt`)}catch(e){msg(netErr(e))}};
  if($("onOut"))$("onOut").onclick=doLogout;
  if($("onUid"))$("onUid").onclick=()=>{const t=ON.user.uid;if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast("Nutzer-ID kopiert")).catch(()=>linkBox(t));else linkBox(t)};
  if(ON.tab==="admin"&&isAdmin()){renderAdmin(v);return}
  if(ON.tab==="leader"){renderLeader(v);return}
  if(ON.tab==="friends"){renderFriends(v);return}
  if(ON.tab==="live"){renderLive(v);return}
  if($("onLbShow"))$("onLbShow").onclick=()=>{S.set.lbHide=!S.set.lbHide;save("set");$("onLbShow").setAttribute("aria-pressed",String(!S.set.lbHide));publishStats()};
  if($("onSync"))$("onSync").onclick=()=>cloudPush(true).then(()=>toast("Fortschritt gesichert"));
  if($("onDel"))$("onDel").onclick=()=>{const b=$("onDel");if(!b.dataset.sure){b.dataset.sure="1";b.textContent="Wirklich endgültig löschen?";return}doDeleteAccount(t=>{const m=$("onDelMsg");if(m)m.textContent=t;else toast(t)})};
}
function renderAuth(v){
  const reg=ON.authMode==="reg";
  v.innerHTML=`${pageHead(`${ON.tab==="play"||ON.tab==="live"?"Online spielen":"Anmelden"}`,`Spiel live gegen deine Freunde. Mit Konto ist dein Fortschritt auf allen Geräten gleich.`,"online","online")}
  <div class="card"><div class="seg" style="margin-bottom:14px"><button data-am="login" aria-pressed="${!reg}">Anmelden</button><button data-am="reg" aria-pressed="${reg}">Registrieren</button></div>
  <form id="authForm" class="authf">${reg?`<label class="fld">Benutzername<input id="auName" maxlength="20" autocomplete="username" autocapitalize="off" placeholder="So sehen dich andere" required></label>`:""}
  <label class="fld">E-Mail<input id="auMail" type="email" autocomplete="email" autocapitalize="off" required></label>
  <label class="fld">Passwort<input id="auPw" type="password" autocomplete="${reg?"new-password":"current-password"}" minlength="6" required></label>
  <div class="btnrow"><button class="btn grn" type="submit" style="padding:11px 18px">${reg?"Konto erstellen":"Anmelden"}</button>${reg?"":`<button class="btn" type="button" id="auReset">Passwort vergessen?</button>`}</div>
  <p class="hint" id="auMsg" style="margin:0"></p></form>
  <p class="hint" style="margin:12px 0 0">Gespeichert werden nur dein Benutzername, deine E-Mail-Adresse (für die Anmeldung), deine Partien und dein Trainingsfortschritt. Du kannst dein Konto jederzeit löschen. Mehr dazu in der <a href="#" data-go="legal">Datenschutzerklärung</a>.</p></div>`;
  v.querySelectorAll("[data-go]").forEach(a=>a.onclick=e=>{e.preventDefault();showView(a.dataset.go)});
  v.querySelectorAll("[data-am]").forEach(b=>b.onclick=()=>{ON.authMode=b.dataset.am;renderAuth(v)});
  const msg=t=>{const m=$("auMsg");if(m)m.textContent=t;else if(t)toast(t)};
  $("authForm").onsubmit=async e=>{e.preventDefault();const bt=e.target.querySelector("[type=submit]");bt.disabled=true;msg("");
    try{if(reg)await doRegister($("auName").value,$("auMail").value,$("auPw").value,msg);else await doLogin($("auMail").value,$("auPw").value,msg)}finally{if(bt.isConnected)bt.disabled=false}};
  if($("auReset"))$("auReset").onclick=()=>doReset($("auMail").value,msg);
}
/* Einladungslink, während die Seite schon offen ist */
window.addEventListener("hashchange",()=>{const m=location.hash.match(/^#play=([A-Za-z0-9_-]+)/);if(m){history.replaceState(null,"",location.pathname);openOnlineGame(m[1])}});

/* ================= Admin-Bereich ================= */
/* Nutzer-IDs mit Admin-Rechten (müssen auch in den Firestore-Regeln stehen) */
const ADMIN_UIDS=["iJ4m56bUDeW1mclGgpg6np59GVN2"];
function isAdmin(){if(!ON.user)return false;if(ADMIN_UIDS.indexOf(ON.user.uid)>=0)return true;try{return !!window.__MOCKNET&&sessionStorage.getItem("mock-admin")==="1"}catch(e){return false}}
const ADM={tab:"overview",users:null,games:null,names:null,priv:{},loading:false,err:"",q:"",sort:"new",gf:"all",sel:null,at:0};
const relTime=t=>{if(!t)return "nie";const d=srvNow()-t;if(d<60000)return "gerade eben";if(d<3600000)return "vor "+Math.round(d/60000)+" Min.";if(d<86400000)return "vor "+Math.round(d/3600000)+" Std.";const n=Math.round(d/86400000);return n===1?"gestern":"vor "+n+" Tagen"};
const fmtKB=n=>n>=1048576?(n/1048576).toFixed(1)+" MB":n>=1024?Math.round(n/1024)+" KB":n+" B";
function privSum(r){
  if(!r)return null;let d={};try{d=JSON.parse(r.data||"{}")}catch(e){}
  const prog=d.prog||{};let clean=0,seen=0;for(const o in prog)for(const i in prog[o]){if(prog[o][i]===2)clean++;else if(prog[o][i])seen++}
  const tac=d.tac||{},stats=d.stats||{},cu=d.custom||{};
  return {email:r.email||"",savedAt:r.savedAt||0,size:(r.data||"").length,clean,seen,rep:(d.rep||[]).length,tacR:tac.n?tac.r:null,tacN:tac.n||0,tacXp:tac.xp||0,streak:(d.streak&&d.streak.best)||0,days:Object.keys(stats.days||{}).length,reviews:stats.reviews||0,custom:(cu.w||[]).length+(cu.b||[]).length,trained:Object.values(stats.days||{}).reduce((a,b)=>a+(+b||0),0)};
}
async function adminLoad(){
  if(ADM.loading)return;ADM.loading=true;ADM.err="";renderAdminBox();
  try{
    const [users,games,names]=await Promise.all([NET.list("users"),NET.list("games"),NET.list("usernames")]);
    ADM.users=users;ADM.games=games;ADM.names=names;ADM.at=Date.now();
    const pr=await Promise.all(users.map(u=>NET.get("users/"+u.id+"/private/progress").catch(()=>null)));
    ADM.priv={};users.forEach((u,i)=>ADM.priv[u.id]=privSum(pr[i]));
  }catch(e){ADM.err=netErr(e)}
  ADM.loading=false;renderAdminBox();
}
function renderAdmin(v){v.insertAdjacentHTML("beforeend",'<div id="admBox" class="adm"></div>');if(!ADM.users&&!ADM.loading)adminLoad();else renderAdminBox()}
/* Kleine Balkendiagramme */
function barsHtml(rows,col){const max=Math.max(1,...rows.map(r=>r[1]));return `<div class="abars">${rows.map(r=>`<div class="abar"><span class="al">${esc(r[0])}</span><span class="at"><i style="width:${r[1]/max*100}%;background:${col||"var(--green)"}"></i></span><b>${r[1]}</b></div>`).join("")}</div>`}
function colsHtml(vals,labels,col){const max=Math.max(1,...vals);return `<div class="acols">${vals.map((x,i)=>`<div class="acol" title="${esc(labels[i])}: ${x}"><span><i style="height:${x/max*100}%;background:${col}"></i></span><small>${esc(labels[i])}</small></div>`).join("")}</div>`}
function perDay(times,days){const out=[],lab=[];const d0=startOfDay(Date.now());for(let i=days-1;i>=0;i--){const a=d0-i*DAY,b=a+DAY;out.push(times.filter(t=>t>=a&&t<b).length);const dt=new Date(a);lab.push(i===0?"heute":dt.getDate()+".")}return [out,lab]}
const tile=(n,l,sub,hot)=>`<div class="atile${hot?" hot":""}"><b>${n}</b><span>${l}</span>${sub?`<small>${sub}</small>`:""}</div>`;
function renderAdminBox(){
  const box=$("admBox");if(!box)return;
  const tabs=[["overview","Übersicht"],["users","Nutzer"],["games","Partien"],["clean","Aufräumen"]];
  let h=`<div class="admbar"><div class="filters">${tabs.map(t=>`<button class="chip${ADM.tab===t[0]?" on":""}" data-at="${t[0]}">${t[1]}</button>`).join("")}</div><span class="btnrow"><button class="btn" id="admBak" ${ADM.users?"":"disabled"} title="Alle Online-Daten als Datei">Sicherung</button><button class="btn" id="admPgn" ${ADM.games?"":"disabled"} title="Alle Online-Partien als PGN">PGN</button><button class="btn" id="admRe" ${ADM.loading?"disabled":""}>${ADM.loading?"Lädt …":"Aktualisieren"}</button></span></div>`;
  if(ADM.err)h+=`<div class="err">${esc(ADM.err)}${/Berechtigung/.test(ADM.err)?" – die Admin-Regeln sind in Firestore noch nicht veröffentlicht.":""}</div>`;
  if(!ADM.users){box.innerHTML=h+(ADM.loading?`<div class="card">${SKEL}</div>`:"");wireAdmin(box);return}
  const U=ADM.users,G=ADM.games,P=ADM.priv,now=Date.now(),wk=now-7*DAY;
  const nameOf=uid=>{const u=U.find(x=>x.id===uid);return u?u.name:"?"};
  const gamesOf=uid=>G.filter(g=>(g.players||[]).indexOf(uid)>=0);
  if(ADM.tab==="overview"){
    const over=G.filter(g=>g.status==="over"&&g.result&&g.result!=="-");const act=G.filter(g=>g.status==="active"),wait=G.filter(g=>g.status==="waiting");
    const moves=over.map(g=>(g.moves||[]).length);const avgM=moves.length?Math.round(moves.reduce((a,b)=>a+b,0)/moves.length/2):0;
    const res={"1-0":0,"0-1":0,"1/2-1/2":0};over.forEach(g=>{res[g.result]=(res[g.result]||0)+1});
    const why={};over.forEach(g=>{why[g.reason||"?"]=(why[g.reason||"?"]||0)+1});
    const tcs={};G.filter(g=>g.status!=="cancelled"&&g.status!=="declined").forEach(g=>{const t=tcTxt(g.tc);tcs[t]=(tcs[t]||0)+1});
    const [gd,gl]=perDay(G.map(g=>g.created||0),14);const [ud,ul]=perDay(U.map(u=>u.created||0),14);
    const pv=Object.values(P).filter(Boolean);const tacs=pv.filter(p=>p.tacR);const avgT=tacs.length?Math.round(tacs.reduce((a,p)=>a+p.tacR,0)/tacs.length):null;
    const top=U.map(u=>({n:u.name,g:(u.w||0)+(u.d||0)+(u.l||0),w:u.w||0})).sort((a,b)=>b.g-a.g).slice(0,5);
    h+=`<div class="card"><h3>Nutzer</h3><div class="atiles">${tile(U.length,"Registriert")}${tile(U.filter(u=>(u.created||0)>wk).length,"Neu (7 Tage)")}${tile(U.filter(u=>(u.lastSeen||0)>wk).length,"Aktiv (7 Tage)")}${tile(U.filter(u=>(u.lastSeen||0)>now-DAY).length,"Heute aktiv")}${tile(U.filter(u=>u.banned).length,"Gesperrt","",U.some(u=>u.banned))}</div>
      <div class="exh" style="margin-top:12px"><span>Registrierungen pro Tag</span></div>${colsHtml(ud,ul,"#8A63B8")}</div>
    <div class="card"><h3>Partien</h3><div class="atiles">${tile(G.length,"Gesamt")}${tile(act.length,"Laufend","",act.length>0)}${tile(wait.length,"Offene Einladungen")}${tile(over.length,"Beendet")}${tile(G.filter(g=>(g.created||0)>now-DAY).length,"Heute gestartet")}${tile(avgM,"Ø Züge pro Partie")}</div>
      <div class="exh" style="margin-top:12px"><span>Partien pro Tag</span></div>${colsHtml(gd,gl,"#81B64C")}
      <div class="agrid"><div><div class="exh"><span>Ergebnisse</span></div>${barsHtml([["Weiß gewinnt",res["1-0"]],["Schwarz gewinnt",res["0-1"]],["Remis",res["1/2-1/2"]]],"#5A7FB5")}</div>
      <div><div class="exh"><span>Wie sie endeten</span></div>${barsHtml(Object.entries(why).sort((a,b)=>b[1]-a[1]).slice(0,6),"#E58F2A")}</div>
      <div><div class="exh"><span>Beliebte Bedenkzeiten</span></div>${barsHtml(Object.entries(tcs).sort((a,b)=>b[1]-a[1]).slice(0,6),"#26C2A3")}</div>
      <div><div class="exh"><span>Meiste Partien</span></div>${barsHtml(top.map(t=>[t.n,t.g]),"#E9B949")}</div></div></div>
    <div class="card"><h3>Training (aus der Cloud)</h3><div class="atiles">${tile(pv.reduce((a,p)=>a+p.clean,0),"Varianten fehlerfrei")}${tile(pv.reduce((a,p)=>a+p.trained,0),"Varianten trainiert")}${tile(avgT==null?"–":avgT,"Ø Taktik-Wertung")}${tile(pv.reduce((a,p)=>a+p.tacN,0),"Taktikaufgaben")}${tile(Math.max(0,...pv.map(p=>p.streak)),"Längste Serie")}${tile(pv.reduce((a,p)=>a+p.reviews,0),"Game Reviews")}</div>
      <p class="hint" style="margin:10px 0 0">Gespeicherte Daten: ${fmtKB(pv.reduce((a,p)=>a+p.size,0))} Fortschritt · ${G.length+U.length*2+ADM.names.length} Dokumente. Kostenloses Firebase-Kontingent: 1 GB Speicher, 50.000 Lesezugriffe und 20.000 Schreibzugriffe pro Tag.</p>
      <p class="hint" style="margin:6px 0 0">Stand: ${new Date(ADM.at).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</p></div>`;
  }
  if(ADM.tab==="users"){
    const q=ADM.q.toLowerCase();
    let list=U.filter(u=>!q||(u.name||"").toLowerCase().indexOf(q)>=0||((P[u.id]&&P[u.id].email)||"").toLowerCase().indexOf(q)>=0);
    const ng=u=>gamesOf(u.id).length;
    list.sort({new:(a,b)=>(b.created||0)-(a.created||0),seen:(a,b)=>(b.lastSeen||0)-(a.lastSeen||0),games:(a,b)=>ng(b)-ng(a),name:(a,b)=>(a.name||"").localeCompare(b.name||"")}[ADM.sort]);
    h+=`<div class="card"><div class="btnrow"><input class="txt" id="admQ" placeholder="Name oder E-Mail suchen" value="${esc(ADM.q)}" style="flex:1;width:auto;min-width:150px"><select id="admSort" class="txt" style="width:auto">${[["new","Neueste"],["seen","Zuletzt aktiv"],["games","Meiste Partien"],["name","Name"]].map(s=>`<option value="${s[0]}" ${ADM.sort===s[0]?"selected":""}>${s[1]}</option>`).join("")}</select></div>
      <p class="hint" style="margin:8px 0 0">${list.length} von ${U.length} Nutzern</p></div>
    <div class="card aul">${list.map(u=>{const p=P[u.id];const n=ng(u);const open=ADM.sel===u.id;
      return `<div class="aurow${open?" open":""}"><button class="auhead" data-us="${esc(u.id)}"><span class="onav sm"${avSt(u.av)}>${avTxt(u.name,u.av)}</span><span class="onn"><b>${esc(u.name||"(ohne Namen)")}${u.banned?' <span class="abadge red">gesperrt</span>':""}${ADMIN_UIDS.indexOf(u.id)>=0?' <span class="abadge">Admin</span>':""}</b><small>${p&&p.email?esc(p.email)+" · ":""}seit ${u.created?fmtDate(u.created):"?"} · aktiv ${relTime(u.lastSeen)}</small></span><span class="aunum"><b>${n}</b><small>Partien</small></span></button>
      ${open?userDetail(u,p,gamesOf(u.id),nameOf):""}</div>`}).join("")||'<p class="hint" style="margin:0">Keine Nutzer gefunden.</p>'}</div>`;
  }
  if(ADM.tab==="games"){
    const F=[["all","Alle"],["active","Laufend"],["waiting","Offen"],["over","Beendet"],["gone","Abgebrochen"]];
    const fit=g=>ADM.gf==="all"||(ADM.gf==="gone"?(g.status==="cancelled"||g.status==="declined"||g.result==="-"):ADM.gf==="over"?(g.status==="over"&&g.result!=="-"):g.status===ADM.gf);
    const list=G.filter(fit).sort((a,b)=>(b.updated||0)-(a.updated||0)).slice(0,150);
    h+=`<div class="card"><div class="filters">${F.map(f=>`<button class="chip${ADM.gf===f[0]?" on":""}" data-gf2="${f[0]}">${f[1]} (${G.filter(g=>{const o=ADM.gf;ADM.gf=f[0];const r=fit(g);ADM.gf=o;return r}).length})</button>`).join("")}</div></div>
    <div class="card">${list.map(g=>gameRow(g,nameOf)).join("")||'<p class="hint" style="margin:0">Keine Partien.</p>'}</div>`;
  }
  if(ADM.tab==="clean"){
    const stale=G.filter(g=>g.status==="waiting"&&(g.created||0)<now-3*DAY);const gone=G.filter(g=>g.status==="cancelled"||g.status==="declined"||(g.status==="over"&&g.result==="-"));
    const orphan=ADM.names.filter(n=>!U.some(u=>u.id===n.uid));const stuck=G.filter(g=>g.status==="active"&&(g.updated||0)<now-14*DAY);
    const sec=(t,d,arr,act)=>`<div class="card"><h3>${t} <span class="abadge">${arr.length}</span></h3><p class="hint" style="margin:0 0 10px">${d}</p><button class="btn ${arr.length?"red":""}" data-clean="${act}" ${arr.length?"":"disabled"}>${arr.length?"Alle löschen":"Nichts zu tun"}</button></div>`;
    h+=sec("Alte Einladungen","Einladungen, die seit mehr als 3 Tagen niemand angenommen hat.",stale,"stale")+sec("Abgebrochene und abgelehnte Partien","Partien ohne Ergebnis, die nur noch Platz belegen.",gone,"gone")+sec("Hängende Partien","Laufende Partien ohne Zug seit 14 Tagen.",stuck,"stuck")+sec("Verwaiste Benutzernamen","Benutzernamen ohne zugehöriges Profil (z. B. nach abgebrochener Registrierung).",orphan,"orphan");
  }
  box.innerHTML=h;wireAdmin(box);
}
function gameRow(g,nameOf){
  const w=g.white?nameOf(g.white):"(offen)",b=g.black?nameOf(g.black):"(offen)";const n=(g.moves||[]).length;
  const st={waiting:"offen",active:"läuft",over:g.result==="-"?"abgebrochen":g.result,cancelled:"gelöscht",declined:"abgelehnt"}[g.status]||g.status;
  return `<div class="onrow"><button class="onopen" data-gv="${esc(g.id)}"><span class="abadge ${g.status==="active"?"grn":""}">${esc(st)}</span><span class="onn"><b>${esc(w)} – ${esc(b)}</b><small>${tcTxt(g.tc)} · ${Math.ceil(n/2)} Züge${g.reason?" · "+esc(g.reason):""} · ${fmtDate(g.created||0)} · ${relTime(g.updated)}</small></span></button>
    <span class="onbtns">${g.status==="active"?`<button class="btn" data-gend="${esc(g.id)}">Beenden</button>`:""}<button class="btn" data-gdel="${esc(g.id)}">Löschen</button></span></div>`;
}
function userDetail(u,p,games,nameOf){
  const fr=(u.friends||[]).map(f=>f.name).join(", ")||"keine";
  return `<div class="audet">
    <div class="akv"><span>Nutzer-ID</span><code class="uid">${esc(u.id)}</code><span>E-Mail</span><b>${esc(p&&p.email||"unbekannt")}</b><span>Registriert</span><b>${u.created?new Date(u.created).toLocaleString("de-DE"):"?"}</b><span>Zuletzt aktiv</span><b>${u.lastSeen?new Date(u.lastSeen).toLocaleString("de-DE"):"nie"}</b><span>Bilanz online</span><b>${u.w||0} S · ${u.d||0} R · ${u.l||0} N</b><span>Freunde</span><b>${esc(fr)}</b></div>
    ${p?`<div class="exh" style="margin-top:12px"><span>Training</span></div><div class="atiles sm">${tile(p.clean,"Varianten fehlerfrei")}${tile(p.trained,"Varianten trainiert")}${tile(p.rep,"Im Repertoire")}${tile(p.tacR==null?"–":p.tacR,"Taktik-Wertung",p.tacN+" Aufgaben")}${tile(p.streak,"Beste Serie")}${tile(p.days,"Trainingstage")}${tile(p.reviews,"Game Reviews")}${tile(p.custom,"Eigene Varianten")}</div><p class="hint" style="margin:6px 0 0">Cloud-Stand ${relTime(p.savedAt)} · ${fmtKB(p.size)}</p>`:`<p class="hint">Noch kein Trainingsstand in der Cloud.</p>`}
    <div class="exh" style="margin-top:12px"><span>Partien (${games.length})</span></div>${games.sort((a,b)=>(b.updated||0)-(a.updated||0)).slice(0,10).map(g=>gameRow(g,nameOf)).join("")||'<p class="hint" style="margin:0">Keine.</p>'}
    <div class="exh" style="margin-top:12px"><span>Aktionen</span></div>
    <div class="btnrow"><button class="btn ${u.banned?"grn":"red"}" data-ban="${esc(u.id)}">${u.banned?"Entsperren":"Sperren"}</button><input class="txt" id="admRen" placeholder="Neuer Name" maxlength="20" style="flex:1;width:auto;min-width:120px"><button class="btn" data-ren="${esc(u.id)}">Umbenennen</button></div>
    <div class="btnrow" style="margin-top:8px"><button class="btn red" data-udel="${esc(u.id)}">Profildaten löschen</button><span class="hint" id="admMsg"></span></div>
    <p class="hint" style="margin:8px 0 0">Das Anmeldekonto (E-Mail und Passwort) selbst löschst du in der Firebase-Konsole unter Authentication → Nutzer.</p></div>`;
}
function wireAdmin(box){
  const msg=t=>{const m=$("admMsg");if(m)m.textContent=t;else toast(t)};
  const act=async(fn,ok)=>{try{await fn();if(ok)toast(ok);await adminLoad()}catch(e){msg(netErr(e))}};
  const sure=(b,txt)=>{if(b.dataset.sure)return true;b.dataset.sure="1";b.textContent=txt;setTimeout(()=>{if(b.isConnected)delete b.dataset.sure},4000);return false};
  box.querySelectorAll("[data-at]").forEach(b=>b.onclick=()=>{ADM.tab=b.dataset.at;renderAdminBox()});
  const re=$("admRe");if(re)re.onclick=()=>adminLoad();
  const bk=$("admBak");if(bk)bk.onclick=()=>{adminBackup();toast("Sicherung heruntergeladen")};const pg=$("admPgn");if(pg)pg.onclick=adminPgn;
  const q=$("admQ");if(q)q.oninput=()=>{ADM.q=q.value;clearTimeout(ADM.qt);ADM.qt=setTimeout(()=>{renderAdminBox();const n=$("admQ");if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}},250)};
  const so=$("admSort");if(so)so.onchange=()=>{ADM.sort=so.value;renderAdminBox()};
  box.querySelectorAll("[data-us]").forEach(b=>b.onclick=()=>{ADM.sel=ADM.sel===b.dataset.us?null:b.dataset.us;renderAdminBox()});
  box.querySelectorAll("[data-gf2]").forEach(b=>b.onclick=()=>{ADM.gf=b.dataset.gf2;renderAdminBox()});
  box.querySelectorAll("[data-gv]").forEach(b=>b.onclick=()=>openOnlineGame(b.dataset.gv));
  box.querySelectorAll("[data-gend]").forEach(b=>b.onclick=()=>{if(!sure(b,"Wirklich?"))return;act(()=>NET.set("games/"+b.dataset.gend,{status:"over",result:"-",reason:"Vom Admin beendet",updated:Date.now()},true),"Partie beendet")});
  box.querySelectorAll("[data-gdel]").forEach(b=>b.onclick=()=>{if(!sure(b,"Wirklich löschen?"))return;act(()=>NET.del("games/"+b.dataset.gdel),"Partie gelöscht")});
  box.querySelectorAll("[data-ban]").forEach(b=>b.onclick=()=>{const u=ADM.users.find(x=>x.id===b.dataset.ban);if(!u)return;if(u.id===ON.user.uid){msg("Du kannst dich nicht selbst sperren.");return}act(()=>NET.set("users/"+u.id,{banned:!u.banned},true),u.banned?"Entsperrt":"Gesperrt")});
  box.querySelectorAll("[data-ren]").forEach(b=>b.onclick=()=>{const u=ADM.users.find(x=>x.id===b.dataset.ren);const n=($("admRen").value||"").trim();if(!u)return;if(!NAME_RE.test(n)){msg("3–20 Zeichen: Buchstaben, Ziffern, _ oder -.");return}
    act(async()=>{const low=n.toLowerCase();const ok=await NET.tx("usernames/"+low,d=>d?null:{uid:u.id});if(!ok)throw new Error("Dieser Name ist schon vergeben.");if(u.nameLower&&u.nameLower!==low)await NET.del("usernames/"+u.nameLower).catch(()=>{});await NET.set("users/"+u.id,{name:n,nameLower:low},true)},"Umbenannt in "+n)});
  box.querySelectorAll("[data-udel]").forEach(b=>b.onclick=()=>{const u=ADM.users.find(x=>x.id===b.dataset.udel);if(!u)return;if(u.id===ON.user.uid){msg("Dein eigenes Konto löschst du unter „Konto“.");return}if(!sure(b,"Wirklich alles löschen?"))return;
    act(async()=>{if(u.nameLower)await NET.del("usernames/"+u.nameLower).catch(()=>{});await NET.del("users/"+u.id+"/private/progress").catch(()=>{});await NET.del("users/"+u.id);ADM.sel=null},"Profildaten gelöscht")});
  box.querySelectorAll("[data-clean]").forEach(b=>b.onclick=()=>{if(!sure(b,"Wirklich alle löschen?"))return;const k=b.dataset.clean,now=Date.now(),G=ADM.games;
    const ids=k==="stale"?G.filter(g=>g.status==="waiting"&&(g.created||0)<now-3*DAY).map(g=>"games/"+g.id):k==="gone"?G.filter(g=>g.status==="cancelled"||g.status==="declined"||(g.status==="over"&&g.result==="-")).map(g=>"games/"+g.id):k==="stuck"?G.filter(g=>g.status==="active"&&(g.updated||0)<now-14*DAY).map(g=>"games/"+g.id):ADM.names.filter(n=>!ADM.users.some(u=>u.id===n.uid)).map(n=>"usernames/"+n.id);
    act(async()=>{for(const p of ids)await NET.del(p)},ids.length+" Einträge gelöscht")});
}

/* ================= Bestenliste, Freunde, Live-Partien & Zuschauen ================= */
const SOC={inc:[],out:[],subs:[],users:null,usersAt:0,lb:"elo",lbFriends:false,sel:null,live:[],liveSub:null,watchers:[],watchAt:0,viewers:0,vSub:null,vGid:null,watchingGid:null};
const ONLINE_MS=5*60000;
const isOnlineAt=t=>!!t&&srvNow()-t<ONLINE_MS;
function socialStop(){SOC.subs.forEach(f=>{try{f()}catch(e){}});SOC.subs=[];SOC.inc=[];SOC.out=[];SOC.users=null;if(SOC.liveSub){SOC.liveSub();SOC.liveSub=null}if(SOC.vSub){SOC.vSub();SOC.vSub=null;SOC.vGid=null}}
function socialStart(){
  socialStop();const me=ON.user&&ON.user.uid;if(!me||!NET)return;
  SOC.subs.push(NET.watchQ("friendreq","to","==",me,l=>{if(!l)return;const prev=SOC.inc.map(r=>r.id);SOC.inc=l.filter(r=>r.status==="pending");
    SOC.inc.forEach(r=>{if(prev.length&&prev.indexOf(r.id)<0)toast(`${r.fromName||"Jemand"} möchte mit dir befreundet sein`)});renderTabbar();if(curView==="online")renderOnline()}));
  SOC.subs.push(NET.watchQ("friendreq","from","==",me,l=>{if(!l)return;SOC.out=l;
    l.filter(r=>r.status==="accepted").forEach(async r=>{const fr=(ON.profile&&ON.profile.friends)||[];
      try{if(!fr.some(f=>f.uid===r.to))await NET.set("users/"+me,{friends:fr.concat({uid:r.to,name:r.toName||"Freund"})},true);await NET.del("friendreq/"+r.id);toast(`${r.toName||"Dein Freund"} hat deine Anfrage angenommen`)}catch(e){}});
    if(curView==="online"&&ON.tab==="friends")renderOnline()}));
  setTimeout(publishStats,1500);
}
/* Eigene Kennzahlen öffentlich für die Bestenliste (abschaltbar) */
function myPub(){let clean=0;for(const o in S.prog)for(const i in S.prog[o])if(S.prog[o][i]===2)clean++;
  return {tacR:PZ.n?PZ.r:null,tacN:PZ.n||0,clean,streak:Math.max(S.streak.best||0,(PZ.streak&&PZ.streak.best)||0),lv:levelOf(PZ.xp||0),hide:!!S.set.lbHide,gx:gxPub()}}
function publishStats(){
  if(!ON.user||!ON.profile||!NET)return;const p=myPub();if(JSON.stringify(p)===JSON.stringify(ON.profile.pub||{}))return;
  NET.set("users/"+ON.user.uid,{pub:p},true).catch(()=>{});
}
async function loadUsers(force){
  if(!force&&SOC.users&&Date.now()-SOC.usersAt<60000)return SOC.users;
  SOC.users=await NET.list("users");SOC.usersAt=Date.now();return SOC.users;
}
const medal=i=>i===0?"🥇":i===1?"🥈":i===2?"🥉":String(i+1);
const userGames=u=>(u.w||0)+(u.d||0)+(u.l||0);
const nP=n=>n+(n===1?" Partie":" Partien");
function liveGameOf(uid){return (SOC.live||[]).find(g=>(g.players||[]).indexOf(uid)>=0)}

/* ---- Bestenliste ---- */
function renderLeader(v){
  v.insertAdjacentHTML("beforeend",'<div id="socBox" class="adm"></div>');const box=$("socBox");
  if(!SOC.users){box.innerHTML=`<div class="card">${SKEL}</div>`;Promise.all([loadUsers(),loadLive()]).then(()=>{if(curView==="online"&&ON.tab==="leader")renderOnline()}).catch(e=>{box.innerHTML=`<div class="err">${esc(netErr(e))}</div>`});return}
  if(Date.now()-SOC.usersAt>15000&&!SOC.refreshing){SOC.refreshing=true;Promise.all([loadUsers(true),loadLive()]).then(()=>{SOC.refreshing=false;if(curView==="online"&&(ON.tab==="leader"||ON.tab==="friends"))renderOnline()}).catch(()=>{SOC.refreshing=false})}
  const me=ON.user.uid,friendIds=((ON.profile&&ON.profile.friends)||[]).map(f=>f.uid).concat(me);
  const M=[["elo","Wertung"],["wins","Siege"],["games","Partien"],["tac","Taktik"],["clean","Varianten"],["streak","Serie"]];
  const val={elo:u=>userGames(u)?(u.elo||1200):null,wins:u=>u.w||0,games:u=>userGames(u),tac:u=>u.pub&&u.pub.tacR,clean:u=>u.pub&&u.pub.clean||0,streak:u=>u.pub&&u.pub.streak||0}[SOC.lb];
  const sub={elo:u=>`${nP(userGames(u))} · ${u.w||0} S · ${u.d||0} R · ${u.l||0} N`,wins:u=>`${nP(userGames(u))} · Quote ${userGames(u)?Math.round((u.w||0)/userGames(u)*100):0} %`,games:u=>`${u.w||0} S · ${u.d||0} R · ${u.l||0} N`,tac:u=>`${u.pub&&u.pub.tacN||0} Aufgaben · Level ${u.pub&&u.pub.lv||1}`,clean:u=>"fehlerfrei gelernte Varianten",streak:u=>"Tage in Folge (Bestwert)"}[SOC.lb];
  let list=SOC.users.filter(u=>u.name&&!u.banned&&!(u.pub&&u.pub.hide&&u.id!==me)&&(!SOC.lbFriends||friendIds.indexOf(u.id)>=0));
  const ranked=list.filter(u=>val(u)!=null&&val(u)!==0||SOC.lb==="elo"&&userGames(u)).sort((a,b)=>(val(b)||0)-(val(a)||0));
  const rest=list.filter(u=>ranked.indexOf(u)<0).sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  const myRank=ranked.findIndex(u=>u.id===me);
  const row=(u,i)=>{const lg=liveGameOf(u.id);const open=SOC.sel===u.id;const isF=friendIds.indexOf(u.id)>=0&&u.id!==me;
    return `<div class="aurow${u.id===me?" mine":""}${open?" open":""}"><button class="auhead" data-lu="${esc(u.id)}"><span class="lrank">${i==null?"–":medal(i)}</span><span class="onav sm"${avSt(u.av)}>${avTxt(u.name,u.av)}${isOnlineAt(u.lastSeen)?'<i class="odot"></i>':""}</span><span class="onn"><b>${esc(u.name)}${u.id===me?" (du)":""}${lg?' <span class="abadge grn">spielt</span>':""}</b><small>${i==null?"noch keine Werte":esc(sub(u))}</small></span><span class="aunum"><b>${i==null?"–":(val(u)==null?"–":val(u))}</b><small>${M.find(m=>m[0]===SOC.lb)[1]}</small></span></button>
    ${open?`<div class="audet"><div class="atiles sm">${tileS(u.elo||1200,"Online-Wertung")}${tileS(userGames(u),"Partien",`${u.w||0} S · ${u.d||0} R · ${u.l||0} N`)}${tileS(u.pub&&u.pub.tacR||"–","Taktik-Wertung")}${tileS(u.pub&&u.pub.clean||0,"Varianten fehlerfrei")}${tileS(u.pub&&u.pub.streak||0,"Beste Serie")}${tileS(isOnlineAt(u.lastSeen)?"online":relTime(u.lastSeen),"Zuletzt aktiv")}</div>
      ${u.eloHist&&u.eloHist.length>1?`<div class="exh" style="margin-top:10px"><span>Wertungsverlauf</span></div>${sparkHtml(u.eloHist.map(h=>h.r))}`:""}
      ${`<div class="btnrow" style="margin-top:10px"><button class="btn" data-prof="${esc(u.id)}">Profil</button>`}${u.id!==me?`<div class="btnrow" style="margin-top:10px">${lg?`<button class="btn grn" data-watch="${esc(lg.id)}">Zuschauen</button>`:""}<button class="btn" data-chal="${esc(u.id)}">Herausfordern</button>${isF?"":`<button class="btn" data-freq="${esc(u.id)}">Als Freund hinzufügen</button>`}</div>`:""}</div>`:""}</div>`};
  box.innerHTML=`<div class="card"><div class="filters">${M.map(m=>`<button class="chip${SOC.lb===m[0]?" on":""}" data-lb="${m[0]}">${m[1]}</button>`).join("")}</div>
    <div class="btnrow" style="margin-top:10px;justify-content:space-between"><span class="seg"><button data-lf="0" aria-pressed="${!SOC.lbFriends}">Alle</button><button data-lf="1" aria-pressed="${SOC.lbFriends}">Freunde</button></span><button class="btn" id="lbRe" style="padding:8px 12px">Aktualisieren</button></div>
    <p class="hint" style="margin:8px 0 0">${myRank>=0?`Du bist auf Platz <b>${myRank+1}</b> von ${ranked.length}.`:"Spiel eine Online-Partie, um in die Wertung zu kommen."} Die Online-Wertung startet bei 1200 und ändert sich nach jeder Partie (Elo).</p></div>
    <div class="card aul">${ranked.map((u,i)=>row(u,i)).join("")}${rest.length?`<div class="exh" style="margin:12px 6px 4px"><span>Noch ohne Wertung</span></div>${rest.map(u=>row(u,null)).join("")}`:""}${!list.length?'<p class="hint" style="margin:6px">Noch keine Spieler.</p>':""}</div>`;
  wireSocial(box);
}
const tileS=(n,l,sub)=>`<div class="atile"><b>${esc(String(n))}</b><span>${esc(l)}</span>${sub?`<small>${esc(sub)}</small>`:""}</div>`;
function sparkHtml(arr){if(arr.length<2)return "";const mn=Math.min(...arr),mx=Math.max(...arr),r=Math.max(1,mx-mn);const pts=arr.map((x,i)=>`${(i/(arr.length-1)*100).toFixed(1)},${(36-(x-mn)/r*32-2).toFixed(1)}`).join(" ");
  return `<svg class="spark" viewBox="0 0 100 36" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="var(--green)" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><p class="hint" style="margin:2px 0 0">${mn} – ${mx}</p>`}

/* ---- Freunde mit Anfragen, Online-Status und Zuschauen ---- */
function renderFriends(v){
  v.insertAdjacentHTML("beforeend",'<div id="socBox" class="adm"></div>');const box=$("socBox");
  const P=ON.profile,fr=(P.friends||[]);
  if(!SOC.users){box.innerHTML=`<div class="card">${SKEL}</div>`;Promise.all([loadUsers(),loadLive()]).then(()=>{if(curView==="online"&&ON.tab==="friends")renderOnline()}).catch(e=>{box.innerHTML=`<div class="err">${esc(netErr(e))}</div>`});return}
  if(Date.now()-SOC.usersAt>15000&&!SOC.refreshing){SOC.refreshing=true;Promise.all([loadUsers(true),loadLive()]).then(()=>{SOC.refreshing=false;if(curView==="online"&&(ON.tab==="leader"||ON.tab==="friends"))renderOnline()}).catch(()=>{SOC.refreshing=false})}
  const U=id=>SOC.users.find(u=>u.id===id)||{};
  const pendOut=SOC.out.filter(r=>r.status==="pending");
  const sorted=fr.slice().sort((a,b)=>(isOnlineAt(U(b.uid).lastSeen)?1:0)-(isOnlineAt(U(a.uid).lastSeen)?1:0)||(a.name||"").localeCompare(b.name||""));
  box.innerHTML=`${SOC.inc.length?`<div class="card"><h3>Freundschaftsanfragen <span class="abadge red">${SOC.inc.length}</span></h3>${SOC.inc.map(r=>`<div class="onrow"><span class="onav sm">${esc((r.fromName||"?")[0].toUpperCase())}</span><span class="onn" style="padding:8px 4px"><b>${esc(r.fromName||"Unbekannt")}</b><small>${relTime(r.at)}</small></span><span class="onbtns"><button class="btn grn" data-racc="${esc(r.id)}">Annehmen</button><button class="btn" data-rdec="${esc(r.id)}">Ablehnen</button></span></div>`).join("")}</div>`:""}
  <div class="card"><h3>Freund hinzufügen</h3><div class="btnrow"><input class="txt" id="frName" placeholder="Benutzername" autocapitalize="off" style="flex:1;width:auto;min-width:140px"><button class="btn grn" id="frAdd" style="padding:10px 16px">Anfrage senden</button></div>
    <p class="hint" id="frMsg" style="margin:8px 0 0">Dein Benutzername: <b>${esc(P.name)}</b> – gib ihn deinen Freunden.</p>
    ${pendOut.length?`<p class="hint" style="margin:6px 0 0">Gesendet, wartet auf Antwort: ${pendOut.map(r=>`<b>${esc(r.toName||"?")}</b> <button class="chip" data-rcan="${esc(r.id)}">zurückziehen</button>`).join(" ")}</p>`:""}</div>
  <div class="card aul"><h3 style="margin:6px">Deine Freunde (${fr.length})</h3>${sorted.length?sorted.map(f=>{const u=U(f.uid);const on=isOnlineAt(u.lastSeen);const lg=liveGameOf(f.uid);
    return `<div class="onrow"><button class="onopen fr-open" data-prof="${esc(f.uid)}"><span class="onav sm"${avSt(u.av)}>${avTxt(u.name||f.name,u.av)}${on?'<i class="odot"></i>':""}</span><span class="onn"><b>${esc(u.name||f.name)}${lg?' <span class="abadge grn">spielt</span>':""}</b><small>${on?"online":"zuletzt "+relTime(u.lastSeen)} · Wertung ${u.elo||1200} · ${nP(userGames(u))}</small></span></button><span class="onbtns">${lg?`<button class="btn grn" data-watch="${esc(lg.id)}">Zuschauen</button>`:""}<button class="btn" data-chal="${esc(f.uid)}">Herausfordern</button><button class="btn" data-rmf2="${esc(f.uid)}" title="Entfernen">✕</button></span></div>`}).join(""):'<p class="hint" style="margin:6px">Noch keine Freunde. Schick jemandem eine Anfrage oder füge Spieler aus der Bestenliste hinzu.</p>'}</div>`;
  wireSocial(box);
}
async function sendFriendReq(uid,name,msg){
  const me=ON.user.uid;msg=msg||toast;const fr=(ON.profile.friends||[]);
  if(uid===me){msg("Das bist du selbst.");return}if(fr.some(f=>f.uid===uid)){msg("Ist schon dein Freund.");return}
  const back=SOC.inc.find(r=>r.from===uid);if(back){await acceptReq(back);return}
  try{await NET.set("friendreq/"+me+"_"+uid,{from:me,to:uid,fromName:myName(),toName:name,status:"pending",at:Date.now()});msg(`Anfrage an ${name} gesendet.`)}catch(e){msg(netErr(e))}
}
async function acceptReq(r){
  const me=ON.user.uid,fr=(ON.profile.friends||[]);
  try{if(!fr.some(f=>f.uid===r.from))await NET.set("users/"+me,{friends:fr.concat({uid:r.from,name:r.fromName||"Freund"})},true);await NET.set("friendreq/"+r.id,{status:"accepted"},true);toast(`${r.fromName||"Freund"} ist jetzt dein Freund`)}catch(e){toast(netErr(e))}
}

/* ---- Live-Partien ---- */
async function loadLive(){try{SOC.live=await NET.query("games","status","==","active");SOC.watchers=await NET.list("watch").catch(()=>[]);SOC.watchAt=Date.now()}catch(e){SOC.live=SOC.live||[]}return SOC.live}
const viewersOf=gid=>SOC.watchers.filter(w=>w.gid===gid&&Date.now()-(w.at||0)<60000).length;
function renderLive(v){
  v.insertAdjacentHTML("beforeend",'<div id="socBox" class="adm"></div>');const box=$("socBox");
  if(!SOC.liveSub){SOC.liveSub=NET.watchQ("games","status","==","active",l=>{if(!l)return;SOC.live=l;NET.list("watch").then(w=>{SOC.watchers=w}).catch(()=>{}).then(()=>{if(curView==="online"&&ON.tab==="live")renderOnline()})})}
  if(!SOC.users){loadUsers().then(()=>{if(curView==="online"&&ON.tab==="live")renderOnline()}).catch(()=>{})}
  const me=ON.user.uid,fids=((ON.profile&&ON.profile.friends)||[]).map(f=>f.uid);
  const elo=uid=>{const u=SOC.users&&SOC.users.find(x=>x.id===uid);return u?(u.elo||1200):""};
  const list=(SOC.live||[]).filter(g=>g.white&&g.black).sort((a,b)=>{const fa=(a.players||[]).some(p=>fids.indexOf(p)>=0||p===me)?1:0,fb=(b.players||[]).some(p=>fids.indexOf(p)>=0||p===me)?1:0;return fb-fa||viewersOf(b.id)-viewersOf(a.id)||(b.updated||0)-(a.updated||0)});
  box.innerHTML=`<div class="card"><h3>Live-Partien <span class="abadge grn">${list.length}</span></h3><p class="hint" style="margin:0">Laufende Partien aller Spieler. Antippen zum Zuschauen – Züge und Uhren laufen live mit. Partien deiner Freunde stehen oben.</p></div>
  <div class="card">${list.map(g=>{const w=g.names[g.white]||"Weiß",b=g.names[g.black]||"Schwarz";const n=(g.moves||[]).length;const vw=viewersOf(g.id);const mine=(g.players||[]).indexOf(me)>=0;const fr=(g.players||[]).some(p=>fids.indexOf(p)>=0);
    return `<div class="onrow"><button class="onopen" data-watch="${esc(g.id)}"><span class="lmini">${miniFen(g.fen)}</span><span class="onn"><b>${esc(w)} <small>${elo(g.white)}</small> – ${esc(b)} <small>${elo(g.black)}</small></b><small>${tcTxt(g.tc)} · Zug ${Math.floor(n/2)+1} · ${new Chess(g.fen||START_FEN).turn()==="w"?esc(w):esc(b)} am Zug${vw?` · 👁 ${vw}`:""}${mine?" · deine Partie":fr?" · Freund":""}</small></span></button></div>`}).join("")||'<p class="hint" style="margin:0">Gerade läuft keine Partie.</p>'}</div>`;
  wireSocial(box);
}
/* Winziges Brett für die Live-Liste */
function miniFen(fen){const rows=(fen||START_FEN).split(" ")[0].split("/");let h="";rows.forEach((r,y)=>{let x=0;for(const ch of r){if(/\d/.test(ch)){for(let k=0;k<+ch;k++){h+=`<i class="${(x+y)%2?"d":"l"}"></i>`;x++}}else{h+=`<i class="${(x+y)%2?"d":"l"} ${ch===ch.toUpperCase()?"w":"b"}"></i>`;x++}}});return h}

/* ---- Gemeinsame Knöpfe ---- */
function wireSocial(box){
  const me=ON.user.uid;
  box.querySelectorAll("[data-lb]").forEach(b=>b.onclick=()=>{SOC.lb=b.dataset.lb;renderOnline()});
  box.querySelectorAll("[data-lf]").forEach(b=>b.onclick=()=>{SOC.lbFriends=b.dataset.lf==="1";renderOnline()});
  box.querySelectorAll("[data-lu]").forEach(b=>b.onclick=()=>{SOC.sel=SOC.sel===b.dataset.lu?null:b.dataset.lu;renderOnline()});
  const re=$("lbRe");if(re)re.onclick=()=>{re.disabled=true;Promise.all([loadUsers(true),loadLive()]).then(()=>renderOnline()).catch(e=>toast(netErr(e)))};
  box.querySelectorAll("[data-prof]").forEach(b=>b.onclick=e=>{e.stopPropagation();showView("player:"+b.dataset.prof)});
  box.querySelectorAll("[data-watch]").forEach(b=>b.onclick=e=>{e.stopPropagation();openOnlineGame(b.dataset.watch)});
  box.querySelectorAll("[data-chal]").forEach(b=>b.onclick=()=>{const u=(SOC.users||[]).find(x=>x.id===b.dataset.chal);if(!u)return;ON.tab="play";createGame({uid:u.id,name:u.name})});
  box.querySelectorAll("[data-freq]").forEach(b=>b.onclick=()=>{const u=(SOC.users||[]).find(x=>x.id===b.dataset.freq);if(u)sendFriendReq(u.id,u.name)});
  box.querySelectorAll("[data-racc]").forEach(b=>b.onclick=()=>{const r=SOC.inc.find(x=>x.id===b.dataset.racc);if(r)acceptReq(r)});
  box.querySelectorAll("[data-rdec]").forEach(b=>b.onclick=()=>{NET.del("friendreq/"+b.dataset.rdec).catch(e=>toast(netErr(e)))});
  box.querySelectorAll("[data-rcan]").forEach(b=>b.onclick=()=>{NET.del("friendreq/"+b.dataset.rcan).then(()=>{SOC.out=SOC.out.filter(r=>r.id!==b.dataset.rcan);renderOnline()}).catch(e=>toast(netErr(e)))});
  box.querySelectorAll("[data-rmf2]").forEach(b=>b.onclick=()=>{if(!b.dataset.sure){b.dataset.sure="1";b.textContent="Entfernen?";return}const fr=(ON.profile.friends||[]).filter(f=>f.uid!==b.dataset.rmf2);NET.set("users/"+me,{friends:fr},true).catch(e=>toast(netErr(e)))});
  const add=$("frAdd");if(add)add.onclick=async()=>{const n=$("frName").value.trim();const msg=t=>{const m=$("frMsg");if(m)m.textContent=t;else toast(t)};if(!n)return;
    try{const u=await NET.get("usernames/"+n.toLowerCase());if(!u){msg(`„${n}“ gibt es nicht.`);return}const p=await NET.get("users/"+u.uid);await sendFriendReq(u.uid,(p&&p.name)||n,msg)}catch(e){msg(netErr(e))}};
}

/* ---- Zuschauen: Anwesenheit melden und Zuschauer zählen; „online“-Status aktuell halten ---- */
setInterval(()=>{try{
  if(!ON.user||!NET)return;const me=ON.user.uid;const now=srvNow();
  if(document.visibilityState==="visible"&&ON.profile&&(!ON.profile.lastSeen||now-ON.profile.lastSeen>110000)){ON.profile.lastSeen=now;NET.set("users/"+me,{lastSeen:now},true).catch(()=>{})}
  const watching=mode==="online"&&ON.gid&&ON.spect&&ON.g&&ON.g.status==="active"&&document.visibilityState==="visible"?ON.gid:null;
  if(SOC.watchingGid&&SOC.watchingGid!==watching){NET.del("watch/"+SOC.watchingGid+"_"+me).catch(()=>{});SOC.watchingGid=null}
  if(watching&&(SOC.watchingGid!==watching||now-(SOC.wAt||0)>25000)){SOC.watchingGid=watching;SOC.wAt=now;NET.set("watch/"+watching+"_"+me,{gid:watching,uid:me,name:myName(),at:now}).catch(()=>{})}
  const gid=mode==="online"&&ON.gid&&ON.g&&ON.g.status==="active"?ON.gid:null;
  if(SOC.vGid!==gid){if(SOC.vSub){SOC.vSub();SOC.vSub=null}SOC.vGid=gid;SOC.viewers=0;SOC.vList=[];if(gid)SOC.vSub=NET.watchQ("watch","gid","==",gid,l=>{if(l)SOC.vList=l})}
  if(gid){const n=(SOC.vList||[]).filter(w=>w.uid!==me&&now-(w.at||0)<60000).length;if(n!==SOC.viewers){SOC.viewers=n;if(mode==="online")onlineChrome()}}
}catch(e){}},2000);

/* ================= Marke, Startseite, Computer, Analyse, Rechtliches ================= */
const BRAND="Zugzwang";
/* Impressum: hier die eigenen Angaben eintragen */
const IMPRESSUM={name:"[Vorname Nachname]",street:"[Straße Hausnummer]",city:"[PLZ Ort]",country:"Deutschland",mail:"[E-Mail-Adresse]"};
const LOGO=(s,cls)=>`<svg class="lg${cls?" "+cls:""}" width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="15" style="fill:var(--acc)"/><g fill="#fff" opacity=".2"><rect x="12" y="26" width="12" height="12" rx="2.5"/><rect x="40" y="26" width="12" height="12" rx="2.5"/></g><path d="M16 18h32L16 46h32" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></svg>`;

/* ---- Akzentfarbe ---- */
const ACCENTS=[["violet","Lila","#8B6CF6"],["red","Rot","#E5484D"],["green","Grün","#81B64C","Chess.com"]];
function accentPicker(){return `<div class="accp" role="radiogroup" aria-label="Akzentfarbe">${ACCENTS.map(a=>`<button class="accb" data-accent="${a[0]}" role="radio" aria-checked="${S.set.accent===a[0]}" aria-pressed="${S.set.accent===a[0]}" style="--c:${a[2]}"><i></i><span>${a[1]}${a[3]?`<small>${a[3]}</small>`:""}</span></button>`).join("")}</div>`}
function wireAccent(root){root.querySelectorAll("[data-accent]").forEach(b=>b.onclick=()=>{S.set.accent=b.dataset.accent;save("set");applySettings();root.querySelectorAll("[data-accent]").forEach(x=>{x.setAttribute("aria-pressed",String(x===b));x.setAttribute("aria-checked",String(x===b))})})}

/* ---- Startseite ---- */
function renderHome(){
  ensureDaily();const v=$("v-home");if(!v)return;
  const dd=S.daily.done.length,dq=S.daily.queue.length,due=dueKeys().length,tz=pzToday();
  const hr=new Date().getHours();const greet=hr<5?"Gute Nacht":hr<11?"Guten Morgen":hr<18?"Hallo":"Guten Abend";
  const nm=ON.profile&&ON.profile.name;
  const lastOp=byId(store.get("et-last",null));const cl=lastOp&&lastOp.lines?lastOp.lines.filter((l,i)=>P(lastOp.id,i)===2).length:0;
  /* Online: wer wartet auf mich? */
  const me=ON.user&&ON.user.uid;const G=ON.games||[];
  const myTurn=me?G.filter(g=>{if(g.status!=="active")return false;const c=myColorIn(g);try{return c&&new Chess(g.fen||START_FEN).turn()===c}catch(e){return false}}):[];
  const inv=me?G.filter(g=>g.status==="waiting"&&g.invite===me):[];
  const alerts=inv.map(g=>`<button class="alert" data-og="${esc(g.id)}"><span class="al-ic">${NI.swords}</span><span><b>${esc(oppName(g))} fordert dich heraus</b><small>${tcTxt(g.tc)} · antippen zum Annehmen oder Ablehnen</small></span><span class="ci-go">›</span></button>`).concat(myTurn.map(g=>`<button class="alert" data-og="${esc(g.id)}"><span class="al-ic">${NI.swords}</span><span><b>Du bist am Zug gegen ${esc(oppName(g))}</b><small>${tcTxt(g.tc)} · ${(g.moves||[]).length} Halbzüge</small></span><span class="ci-go">›</span></button>`)).join("");
  const q=(done,t,d,act)=>`<button class="quest${done?" ok":""}" data-act="${act}"><span class="qk">${done?ICON.ok:""}</span><span><b>${t}</b><small>${d}</small></span></button>`;
  const quests=q(dd>=dq,"Tagestraining",dd>=dq?"Geschafft":`${dd} von ${dq} Varianten`,"daily")+q(tz.n>=PZ.goal,"Taktik-Ziel",`${Math.min(tz.n,PZ.goal)} von ${PZ.goal} Aufgaben`,"tactics")+q(due===0,"Wiederholungen",due?`${due} fällig`:"Alles wiederholt","review");
  const nq=(dd>=dq)+(tz.n>=PZ.goal)+(due===0);
  const quick=(act,ic,t,d)=>`<button class="qa" data-act="${act}"><span class="qa-ic">${NI[ic]}</span><b>${t}</b><small>${d}</small></button>`;
  const tile=(t,b,s)=>`<div class="kpi"><small>${t}</small><b>${b}</b>${s?`<span>${s}</span>`:""}</div>`;
  const hco=(()=>{const hc=COURSES.find(x=>x.id===st.crsLast);return hc?coIdOf(hc):"mila"})();
  const hsay=alerts?"Da wartet eine Partie auf dich – deine Gegner sind schon ungeduldig.":due?`${nV(due,"Wiederholung wartet","Wiederholungen warten")} auf dich – das sind nur ein paar Minuten.`:dd<dq?`Dein Tagestraining: noch ${nV(dq-dd,"Variante","Varianten")}. Los geht's!`:tz.n<PZ.goal?`Noch ${nV(PZ.goal-tz.n,"Taktikaufgabe","Taktikaufgaben")} bis zum Tagesziel.`:"Alles erledigt für heute – stark! Lust auf eine Partie?";
  v.innerHTML=`<section class="hhero co-${hco}"><div class="hhero-c"><small>${new Date().toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})}${streakNow()?` · ${streakNow()} ${streakNow()===1?"Tag":"Tage"} Serie`:""}</small><h2>${greet}${nm?", "+esc(nm):""}!</h2>
    <p class="hhero-say"><b>${esc(TRAINER[hco].nick)}:</b> ${esc(HOME_HI[hco]||"")} ${esc(hsay)}</p></div><span class="hhero-tr" aria-hidden="true">${coachSvg(hco,"happy","bust")}</span></section>
  ${alerts?`<div class="alerts">${alerts}</div>`:""}
  ${(()=>{const hc=COURSES.find(x=>x.id===st.crsLast);return hc?crsHomeTile(hc):""})()}
  ${lastOp&&lastOp.lines&&lastOp.lines.length?`<button class="cont" data-act="continue"><span class="cont-b" id="contBoard"></span><span class="cont-t"><small>Weitermachen</small><b>${esc(lastOp.name)}</b><span>${cl}/${lastOp.lines.length} Varianten fehlerfrei · Du spielst ${lastOp.side==="w"?"Weiß":"Schwarz"}</span><span class="prog"><i style="width:${cl/lastOp.lines.length*100}%"></i></span></span><span class="cont-go">▶</span></button>`:""}
  <section class="card today"><div class="today-h"><div><h3>Heute</h3><small>${nq} von 3 erledigt</small></div>${ringSvg(nq/3)}</div><div class="quests">${quests}</div>
    <button class="btn grn wide" data-act="daily">${dd>=dq?"Extra-Training starten":"Tagestraining fortsetzen"}</button></section>
  <div class="sec-h"><h3>Schnellstart</h3></div>
  <div class="qas">${quick("online:play","swords","Online spielen","Gegen Freunde")}${quick("bots","bot","Gegen Computer","9 Trainer als Gegner")}${quick("analyse","search","Partie analysieren","Game Review")}${quick("tactics","bolt","Taktik",`Wertung ${PZ.r}`)}</div>
  ${feedHtml()}
  <div class="sec-h"><h3>Dein Stand</h3><button class="linkb" data-act="profile:stats">Statistik ›</button></div>
  <div class="kpis">${tile("Serie",streakNow(),`Rekord ${S.streak.best||0}`)}${tile("Varianten",cleanCount(),`von ${totalLines()} fehlerfrei`)}${tile("Taktik",PZ.r,`${PZ.n} Aufgaben`)}${tile("Online",ON.profile?(ON.profile.elo||1200):"–",ON.profile?`${ON.profile.w||0} S · ${ON.profile.d||0} R · ${ON.profile.l||0} N`:"nicht angemeldet")}</div>
  <p class="foot-links"><button class="linkb" data-act="legal">Datenschutz</button> · <button class="linkb" data-act="legal:imp">Impressum</button></p>`;
  const cb=$("contBoard");if(cb&&lastOp){try{const g=new Chess();let last=null;lastOp.lines[0].m.slice(0,8).forEach(m=>{last=g.move(m,{sloppy:true})||last});cb.appendChild(staticBoard(g.fen(),lastOp.side,last))}catch(e){}}
  v.querySelectorAll("[data-og]").forEach(b=>b.onclick=()=>openOnlineGame(b.dataset.og));
  v.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{const a=b.dataset.act;
    if(a==="continue"){selectOpening(lastOp);return}
    if(a.indexOf("course:")===0){courseOpen=a.slice(7);showView("courses");return}
    if(a==="daily"||a==="review"){if(a==="review"&&!due){showView("learn");return}startSession(a);return}
    if(a==="legal:imp"){legalTab="imp";showView("legal");return}
    showView(a)});
}

/* ---- Gegen den Computer ---- */
const BOTS=[
  {co:"mila",lvl:1,elo:"ca. 600",sty:"bal",d:"Spielt freundlich und übersieht vieles – ideal zum Reinkommen."},
  {co:"bruno",lvl:3,elo:"ca. 800",sty:"def",d:"Baut solide auf und tauscht gern – macht aber noch Fehler."},
  {co:"linus",lvl:5,elo:"ca. 1100",sty:"bal",d:"Lauert auf lange Diagonalen und ungedeckte Figuren."},
  {co:"rika",lvl:7,elo:"ca. 1300",sty:"att",d:"Opfert gern und stellt Fallen – pass auf deinen König auf."},
  {co:"greta",lvl:9,elo:"ca. 1550",sty:"def",d:"Mauert sich ein und wartet geduldig auf deinen Fehler."},
  {co:"ilka",lvl:11,elo:"ca. 1800",sty:"att",d:"Sucht scharfe Stellungen – dann wird es heiß."},
  {co:"nova",lvl:14,elo:"ca. 2000",sty:"att",d:"Rechnet blitzschnell und findet fast jede Taktik."},
  {co:"konrad",lvl:17,elo:"ca. 2400",sty:"bal",d:"Spielt ruhig, planvoll und beinahe fehlerfrei."},
  {co:"rex",lvl:20,elo:"über 2800",sty:"att",d:"Volle Stärke, volle Angriffslust – der Endgegner."}
];
/* Sprüche der Trainer als Gegner: Begrüßung, eigener Schlag, Schach, verlorene Figur, Sieg, Niederlage */
const BOT_SAY={
  mila:{hi:"Viel Spaß! Ich erkläre dir hinterher gern alles.",cap:"Hoppla, die nehme ich mal.",chk:"Schach! Schau genau hin.",ouch:"Oh, gut gesehen!",win:"Gut gekämpft – nächstes Mal klappt es!",lose:"Super gespielt! Ich bin stolz auf dich.",on:"Schön gespielt! Jetzt spielen wir die Stellung zusammen weiter.",du:"Kapitel-Duell! Ich spiele fair – zeig mir, was du gelernt hast."},
  bruno:{hi:"Erst mal sauber aufbauen.",cap:"Das Material kommt auf meinen Stapel.",chk:"Schach. Statik prüfen!",ouch:"Autsch, da bröckelt meine Mauer.",win:"Fundament hält. Nächste Runde?",lose:"Saubere Arbeit – du hast mich abgerissen!",on:"Rohbau steht. Jetzt wird weitergebaut – zeig mir deinen Plan.",du:"Duell auf der Baustelle. Mal sehen, ob dein Fundament trägt."},
  greta:{hi:"Versuch doch, meine Festung zu knacken.",cap:"Wer angreift, verliert Truppen.",chk:"Ausfall! Schach.",ouch:"Ein Riss in der Mauer …",win:"Die Festung steht.",lose:"Respekt. Die Mauer ist gefallen.",on:"Die Eröffnung sitzt. Jetzt komm an meinen Mauern vorbei.",du:"Ein Duell vor meinen Mauern. Komm, wenn du dich traust."},
  konrad:{hi:"Leinen los – möge der bessere Plan gewinnen.",cap:"Eine Prise für die Bordkasse.",chk:"Schach – Sturmwarnung!",ouch:"Mann über Bord!",win:"Kurs gehalten. Gut gesegelt!",lose:"Hut ab, Kapitän – du hast mich ausmanövriert.",on:"Hafen verlassen – ab jetzt segeln wir ohne Karte.",du:"Duell auf hoher See – möge der bessere Navigator gewinnen."},
  linus:{hi:"Mein Läufer zielt schon.",cap:"Treffer!",chk:"Schach – direkt ins Schwarze.",ouch:"Hm, das ging daneben.",win:"Ins Schwarze getroffen.",lose:"Was für ein Schuss – du hast gewonnen!",on:"Die Figuren stehen. Jetzt zählt jeder Schuss.",du:"Duell am Schießstand. Ein Fehler, und ich treffe."},
  rex:{hi:"Volle Attacke, keine Gnade!",cap:"Weg damit!",chk:"SCHACH! Spürst du die Hitze?",ouch:"Pah, nur ein Kratzer.",win:"Das war ein Feuerwerk!",lose:"Unglaublich – du hast meinen Angriff gestoppt!",on:"Genug Theorie – jetzt brennt das Brett!",du:"DUELL! Wer zuerst blinzelt, verbrennt."},
  nova:{hi:"Systeme hochgefahren. Los geht's!",cap:"Ziel erfasst.",chk:"Schach – Warnstufe Rot!",ouch:"Treffer am Schutzschild …",win:"Mission erfüllt.",lose:"Wow – du hast mich aus der Umlaufbahn geschossen!",on:"Eröffnung abgeschlossen. Starte Mittelspiel-Simulation.",du:"Duell-Protokoll aktiviert. Viel Glück, Pilot."},
  ilka:{hi:"Mal sehen, wann es ausbricht.",cap:"Lava frisst alles.",chk:"Schach! Es brodelt.",ouch:"Uff, das hat gezischt.",win:"Ausbruch gelungen!",lose:"Messwerte eindeutig: du hast gewonnen!",on:"Die Stellung ist aufgeheizt. Mal sehen, wer zuerst ausbricht.",du:"Duell am Kraterrand. Wer die Hitze aushält, gewinnt."},
  rika:{hi:"Ahoi! Hoffentlich hast du was zum Plündern dabei.",cap:"Arrr, Beute!",chk:"Schach – entern!",ouch:"Verflixt, ein Leck im Rumpf!",win:"Die Beute gehört uns!",lose:"Arrr … du hast mein Schiff versenkt!",on:"Ahoi! Die Karte endet hier – ab jetzt wird geentert.",du:"Ein Duell um die Beute! Zieh dein Entermesser."}
};
const botNick=()=>op&&op.botCo&&TRAINER[op.botCo]?TRAINER[op.botCo].nick:"Stockfish";
let botMood="neutral",botQuip="";
const botSay=k=>{if(!(op&&op.botCo&&BOT_SAY[op.botCo]))return "";const t=BOT_SAY[op.botCo][k];vcSay(t,op.botCo);return `${botNick()}: „${t}“`};
const BOTCFG=Object.assign({lvl:4,col:"r",start:"std",oid:"",style:"bal"},store.get("et-bot",{}));
/* ---- Weiterspielen gegen einen Trainer: genau ab der Stellung am Ende der Variante ----
   Im Kurs spielt der Kurstrainer, sonst der Trainer, der zur eingestellten Stockfish-Stärke passt. Die Stärke bleibt deine Einstellung. */
const nearBot=lv=>BOTS.reduce((a,b)=>Math.abs(b.lvl-lv)<Math.abs(a.lvl-lv)?b:a);
function playOnCo(){const c=crsSess();return c?coIdOf(c):nearBot(S.set.sf).co}
function playOn(o){
  o=o||{};if(!op||op.endId||!op.lines)return;
  const src=op.playOn?op.playOn.src:op,co=COACHES[o.co]?o.co:playOnCo(),b=BOTS.find(x=>x.co===co)||BOTS[0],tn=TRAINER[co];
  cancelAuto();botMood="neutral";
  const duel=o.course&&o.ci!=null;
  op=Object.assign(Object.create(src),{bot:true,botCo:co,botStyle:b.sty,botName:tn.nick,playOn:{src,line:target,course:duel?o.course:null,ci:duel?o.ci:null,goal:o.goal||null}},
    duel?{d:`Duell gegen ${tn.full}: Ein Sieg bringt ein Siegel für dein Kapitel, ein Remis ein halbes.`}:o.goal?{d:`Planaufgabe gegen ${tn.full}: ${o.goal.t}. Höchstens ${o.goal.n} Züge.`}:{});
  startEngine();
}
/* Duell im Kurs: eine gelernte Variante des Kapitels, danach spielt der Kurstrainer */
function crsDuel(c,ci){
  const x=crsChapters(c)[ci];if(!x||!x.o)return;
  const ok=x.ix.filter(i=>P(x.id,i)===2),pool=ok.length?ok:x.ix.filter(i=>P(x.id,i)>=1);
  if(!pool.length){toast("Lerne erst eine Variante aus diesem Kapitel.");return}
  const i=pool[Math.floor(Math.random()*pool.length)];
  stopEngine();sess=null;game=null;drill=null;puz=null;flipped=false;forced=null;op=x.o;
  resetBoard();mode="train";target=i;
  for(const m of op.lines[i].m){const g=new Chess(fens[hist.length]);const mv=findMove(g,m);if(!mv)break;commit(mv,"b")}
  view=hist.length;shown=new Chess(fens[view]);
  showView("train");buildSquares();window.scrollTo(0,0);
  playOn({co:coIdOf(c),course:c.id,ci});
}
const duelOf=(c,ci)=>{const m=crsMeta(c);return m.pg&&typeof m.pg==="object"?m.pg[ci]||0:0};
function crsDuelResult(po,res){
  const c=COURSES.find(x=>x.id===po.course);if(!c||po.ci==null)return;const m=crsMeta(c);if(!m.pg||typeof m.pg!=="object"||Array.isArray(m.pg))m.pg={};
  const v=res==="win"?2:res==="draw"?1:0,old=m.pg[po.ci]||0,nick=TRAINER[coIdOf(c)].nick,ch=c.ch[po.ci]?c.ch[po.ci][1]:"";
  if(v>old){m.pg[po.ci]=v;saveStats();if(v===2)wlog("duel",`Duell gegen ${nick} gewonnen – Siegel für „${ch}“`);toast(v===2?`Siegel für „${ch}“: Duell gegen ${nick} gewonnen!`:`Halbes Siegel für „${ch}“: Remis gegen ${nick}.`)}
  if(v===2){const th=thOf(c);setTimeout(()=>{confetti([th.c1,th.c2,"#F6C453","#FFFFFF"]);sfx("badge")},350)}
}
function renderBots(){
  const v=$("v-bots");if(!v)return;const rep=S.rep.map(byId).filter(o=>o&&o.lines&&o.lines.length);const pool=rep.length?rep:ALL.filter(o=>o.g!=="c"&&o.lines.length);
  if(!pool.some(o=>o.id===BOTCFG.oid))BOTCFG.oid=pool[0]?pool[0].id:"";
  if(!BOTS.some(b=>b.lvl===BOTCFG.lvl))BOTCFG.lvl=BOTS.reduce((a,b)=>Math.abs(b.lvl-BOTCFG.lvl)<Math.abs(a.lvl-BOTCFG.lvl)?b:a).lvl;
  const sel=BOTS.find(b=>b.lvl===BOTCFG.lvl);
  v.innerHTML=pageHead("Gegen den Computer","Such dir einen Gegner aus – alle Trainer spielen mit, von gemütlich bis gnadenlos.","bot","bots")+
  `<div class="bots">${BOTS.map(b=>{const on=b===sel;return `<button class="botc co-${b.co}" data-lvl="${b.lvl}" aria-pressed="${on}"><span class="bot-art">${coachImg(b.co,on?"happy":"neutral")}</span><span class="bot-t"><b>${esc(TRAINER[b.co].nick)}</b><small>Stufe ${b.lvl} · ${b.elo}</small><em>${esc(b.d)}</em></span></button>`}).join("")}</div>
  <div class="card"><div class="setrow"><span><b>Deine Farbe</b></span><span class="seg">${[["w","Weiß"],["r","Zufall"],["b","Schwarz"]].map(c=>`<button data-bcol="${c[0]}" aria-pressed="${BOTCFG.col===c[0]}">${c[1]}</button>`).join("")}</span></div>
  <div class="setrow"><span><b>Spielstil</b><small>${esc((BOTSTYLES.find(x=>x[0]===BOTCFG.style)||BOTSTYLES[0])[2])}</small></span><span class="seg">${BOTSTYLES.map(c=>`<button data-bsty="${c[0]}" aria-pressed="${BOTCFG.style===c[0]}">${c[1]}</button>`).join("")}</span></div>
  <div class="setrow"><span><b>Start</b><small>${BOTCFG.start==="op"?"Die Hauptvariante wird zuerst gespielt, du hast die Farbe der Eröffnung.":"Normale Grundstellung."}</small></span><span class="seg">${[["std","Grundstellung"],["op","Eröffnung"]].map(c=>`<button data-bst="${c[0]}" aria-pressed="${BOTCFG.start===c[0]}">${c[1]}</button>`).join("")}</span></div>
  ${BOTCFG.start==="op"?`<div class="setrow"><span><b>Eröffnung</b><small>${rep.length?"Aus deinem Repertoire":"Markiere Eröffnungen mit einem Stern, um nur dein Repertoire zu sehen"}</small></span><select class="txt" id="botOp" style="width:auto;max-width:56%">${pool.map(o=>`<option value="${o.id}" ${o.id===BOTCFG.oid?"selected":""}>${esc(o.name)}</option>`).join("")}</select></div>`:""}
  <button class="big" id="botGo" style="margin:14px 0 0;width:100%">Partie starten</button></div>`;
  const sv=()=>store.set("et-bot",BOTCFG);
  v.querySelectorAll("[data-lvl]").forEach(b=>b.onclick=()=>{const bt=BOTS.find(x=>x.lvl===+b.dataset.lvl);if(!bt)return;BOTCFG.lvl=bt.lvl;BOTCFG.style=bt.sty;sv();renderBots()});
  v.querySelectorAll("[data-bcol]").forEach(b=>b.onclick=()=>{BOTCFG.col=b.dataset.bcol;sv();renderBots()});
  v.querySelectorAll("[data-bst]").forEach(b=>b.onclick=()=>{BOTCFG.start=b.dataset.bst;sv();renderBots()});
  v.querySelectorAll("[data-bsty]").forEach(b=>b.onclick=()=>{BOTCFG.style=b.dataset.bsty;sv();renderBots()});
  if($("botOp"))$("botOp").onchange=e=>{BOTCFG.oid=e.target.value;sv()};
  $("botGo").onclick=()=>startBot();
}
function startBot(){
  const b=BOTS.find(x=>x.lvl===BOTCFG.lvl)||BOTS[1];const tn=TRAINER[b.co];
  stopEngine();sess=null;game=null;drill=null;puz=null;flipped=false;forced=null;
  S.set.sf=b.lvl;save("set");
  const src=BOTCFG.start==="op"?byId(BOTCFG.oid):null;
  const side=src?src.side:BOTCFG.col==="r"?(Math.random()<.5?"w":"b"):BOTCFG.col;
  const sty=BOTSTYLES.find(x=>x[0]===BOTCFG.style)||BOTSTYLES[0];
  botMood="neutral";
  op={id:"__bot",bot:true,botCo:b.co,botStyle:sty[0],botName:tn.nick+(sty[0]!==b.sty?" ("+sty[1]+")":""),g:"c",side,name:src?src.name+" gegen "+tn.full:"Partie gegen "+tn.full,eco:"Computer",d:`${tn.full} · Stufe ${b.lvl} (${b.elo}). ${b.d}`,plan:[],lines:[]};
  resetBoard();mode="train";
  if(src&&src.lines[0]){for(const m of src.lines[0].m){const g=new Chess(fens[hist.length]);const mv=findMove(g,m);if(!mv)break;commit(mv,"b")}view=hist.length;shown=new Chess(fens[view])}
  showView("train");buildSquares();startEngine(!src);
}

/* ===== Gegner-Check: öffentliche Partien eines anderen Spielers gegen das eigene Repertoire legen ===== */
const SC={src:store.get("et-scsrc","chesscom"),user:"",busy:false,msg:"",err:"",res:null,recent:store.get("et-scout",[]).filter(r=>r&&r.user)};
const STD_FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
async function scoutLoad(src,user,status){
  const games=[];
  if(src==="lichess"){
    status("Lade Partien von Lichess …");
    const headers={Accept:"application/x-ndjson"};if(S.set.liToken)headers.Authorization="Bearer "+S.set.liToken;
    const r=await fetch(`https://lichess.org/api/games/user/${encodeURIComponent(user)}?max=300&moves=true`,{headers});
    if(r.status===404)throw new Error("notfound");if(r.status===429)throw new Error("ratelimit");if(!r.ok)throw new Error("http "+r.status);
    (await r.text()).split("\n").filter(Boolean).forEach(ln=>{try{const g=JSON.parse(ln);if(g.initialFen&&g.initialFen!==STD_FEN)return;const n=normLichess(g,user);if(n)games.push(n)}catch(_){}});
  }else{
    status("Lade die Monatsarchive von Chess.com …");
    const arch=await getJSON(`https://api.chess.com/pub/player/${encodeURIComponent(user.toLowerCase())}/games/archives`);
    const urls=(arch.archives||[]).slice(-12).reverse();
    for(let i=0;i<urls.length&&games.length<300;i++){status(`Lade Partien (Monat ${i+1} von ${urls.length}) …`);
      const d=await getJSON(urls[i]);
      for(const g of (d.games||[]).slice().reverse()){if(g.initial_setup&&g.initial_setup!==STD_FEN)continue;const n=normApiGame(g,user);if(n)games.push(n)}}
  }
  if(!games.length)throw new Error("empty");
  return games.slice(0,300);
}
/* Bäume der gegnerischen Züge, nach seiner Farbe getrennt; dann Wahrscheinlichkeit jeder eigenen Repertoire-Variante */
function scoutAnalyze(games,user){
  const tree={w:new Map(),b:new Map()};
  for(const g of games){const T=tree[g.color];let k="";
    for(const m of g.moves.slice(0,24).map(strip)){let nd=T.get(k);if(!nd){nd={n:0,nx:new Map()};T.set(k,nd)}nd.n++;nd.nx.set(m,(nd.nx.get(m)||0)+1);k=k?k+" "+m:m}}
  let rep=S.rep.map(byId).filter(o=>o&&o.lines&&o.lines.length&&o.g!=="c");const repSrc=rep.length?"rep":"prog";
  if(!rep.length)rep=Object.keys(S.prog||{}).map(byId).filter(o=>o&&o.lines&&o.lines.length&&o.g!=="c"&&Object.values(S.prog[o.id]||{}).some(v=>v>0));
  const top=(T,k,min)=>{const nd=T.get(k);if(!nd||nd.n<min)return null;return {n:nd.n,mv:[...nd.nx].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([m,c])=>({m,c,p:c/nd.n}))}};
  const out={user,n:games.length,nw:games.filter(g=>g.color==="w").length,nb:games.filter(g=>g.color==="b").length,repSrc,repN:rep.length,
    prof:{w:top(tree.w,"",3),b:["e4","d4","c4","Nf3"].map(f=>({f,t:top(tree.b,f,3)})).filter(x=>x.t)},paths:{w:[],b:[]},gaps:{w:[],b:[]}};
  for(const me of ["w","b"]){const col=me==="w"?"b":"w",T=tree[col],groups=new Map(),RP=new Set();
    rep.filter(o=>o.side===me).forEach(o=>o.lines.forEach((l,i)=>{
      const ms=l.m.map(strip);let k="";RP.add(k);ms.forEach(m=>{k=k?k+" "+m:m;RP.add(k)});
      let p=1,depth=0,dec=0,reach=0;k="";
      for(let j=0;j<ms.length;j++){const nd=T.get(k);if(!nd||nd.n<2)break;const c=nd.nx.get(ms[j])||0;
        if((j%2===0?"w":"b")===col){if(!c){p=0;break}p*=c/nd.n;dec++}else if(!c)break;
        depth=j+1;reach=c;k=k?k+" "+ms[j]:ms[j]}
      if(!p||!dec)return;
      const gk=o.id+"|"+ms.slice(0,depth).join(" ");let G=groups.get(gk);
      if(!G){G={o,seq:l.m.slice(0,depth),lines:[],p,depth,reach};groups.set(gk,G)}G.lines.push(i)}));
    /* Gruppen, deren Zugfolge in einer tieferen derselben Eröffnung steckt, gehen in dieser auf */
    const kept=[];[...groups.values()].sort((a,b)=>b.depth-a.depth).forEach(G=>{const sq=G.seq.map(strip).join(" ");
      const host=kept.find(K=>K.o===G.o&&Math.abs(K.p-G.p)<1e-9&&(K.seq.map(strip).join(" ")+" ").startsWith(sq+" "));
      if(host)host.lines.push(...G.lines);else kept.push(G)});
    out.paths[me]=kept.sort((a,b)=>b.p-a.p||b.depth-a.depth).slice(0,6);
    for(const [k,nd] of T){if(!RP.has(k))continue;const ply=k?k.split(" ").length:0;if((ply%2===0?"w":"b")!==col)continue;
      for(const [m,c] of nd.nx){if(c<2||c/nd.n<.15)continue;if(!RP.has(k?k+" "+m:m))out.gaps[me].push({pre:k?k.split(" "):[],m,c,n:nd.n})}}
    out.gaps[me].sort((a,b)=>b.c-a.c);out.gaps[me]=out.gaps[me].slice(0,4);
  }
  return out;
}
const scoutErr=(e,src)=>{const m=String(e&&e.message||e);const site=src==="lichess"?"Lichess":"Chess.com";
  return m==="notfound"?`Diesen Namen gibt es auf ${site} nicht.`:m==="empty"?`Keine öffentlichen Partien auf ${site} gefunden.`:m==="ratelimit"?`${site} meldet zu viele Anfragen – warte eine Minute.`:`${site} ist gerade nicht erreichbar. Prüfe die Internetverbindung.`};
async function scoutRun(src,user){
  user=String(user||"").trim();if(!user||SC.busy)return;
  SC.src=src;SC.user=user;SC.busy=true;SC.err="";SC.msg="Verbinde …";store.set("et-scsrc",src);renderScout();
  const status=t=>{SC.msg=t;const el=$("scMsg");if(el)el.textContent=t};
  try{const games=await scoutLoad(src,user,status);SC.res=Object.assign(scoutAnalyze(games,games[0].name||user),{src});
    SC.recent=[{src,user:SC.res.user}].concat(SC.recent.filter(r=>!(r.src===src&&r.user.toLowerCase()===user.toLowerCase()))).slice(0,6);store.set("et-scout",SC.recent)}
  catch(e){SC.err=scoutErr(e,src)}
  SC.busy=false;SC.msg="";renderScout();
}
function scoutHtml(R){
  const u=esc(R.user),pctBar=p=>`<span class="sc-bar"><i style="width:${Math.max(3,Math.round(p*100))}%"></i></span>`;
  const row=(lab,p,n)=>`<div class="sc-r"><b>${lab}</b>${pctBar(p)}<small>${pct(p)}${n!=null?` · ${n}`:""}</small></div>`;
  const ply=a=>a.length;const mvTxt=(pre,m)=>{const p=ply(pre);return (Math.floor(p/2)+1)+(p%2===0?".":"…")+de(m)};
  let h=`<div class="sec-h"><h3>${u}</h3><small>${R.n} Partien · ${R.nw} mit Weiß · ${R.nb} mit Schwarz</small></div><div class="grid2 sc-prof">`;
  h+=`<div class="card"><h3>Als Weiß eröffnet ${u} mit</h3>${R.prof.w?R.prof.w.mv.map(x=>row(esc(mvTxt([],x.m)),x.p,x.c)).join(""):`<p class="hint">Zu wenige Partien mit Weiß.</p>`}</div>`;
  h+=`<div class="card"><h3>Als Schwarz antwortet ${u}</h3>${R.prof.b.length?R.prof.b.slice(0,2).map(x=>`<p class="sc-on">Auf ${esc(mvTxt([],x.f))} <small>(${x.t.n} Partien)</small></p>`+x.t.mv.slice(0,3).map(y=>row(esc(mvTxt([x.f],y.m)),y.p,y.c)).join("")).join(""):`<p class="hint">Zu wenige Partien mit Schwarz.</p>`}</div></div>`;
  if(!R.repN)return h+`<div class="card"><p class="hint" style="margin:0">Markiere deine Eröffnungen mit einem Stern – dann zeigt der Gegner-Check, welche deiner Varianten ${u} wahrscheinlich aufs Brett bringt.</p></div>`;
  for(const me of ["w","b"]){const P=R.paths[me],G=R.gaps[me],keys=[...new Set([].concat(...P.map(x=>x.lines.slice(0,3).map(i=>lk(x.o.id,i)))))].slice(0,8);
    h+=`<div class="sec-h"><h3>Wenn du ${me==="w"?"Weiß":"Schwarz"} hast</h3><small>${P.length?`So trifft ${u} auf dein ${R.repSrc==="rep"?"Repertoire":"Training"}`:"Keine Überschneidung"}</small></div>`;
    if(P.length){h+=`<div class="card sc-paths">${P.map((x,i)=>`<div class="sc-path"><div class="sc-pt"><b>${esc(x.o.name)}</b><small>${esc(fmtMoves(x.seq))}</small><span class="sc-meta">${x.reach} ${x.reach===1?"Partie":"Partien"} von ${u} bis hier · ${nV(x.lines.length,"Variante","Varianten")} von dir</span></div><span class="sc-pp">${pct(x.p)}</span><button class="chip" data-scp="${me}|${i}">Üben</button></div>`).join("")}
        <button class="btn grn sc-all" data-scall="${me}" data-keys="${esc(keys.join(","))}">${keys.length>1?`Diese ${keys.length} Varianten üben`:"Diese Variante üben"}</button></div>`}
    else h+=`<div class="card"><p class="hint" style="margin:0">${u} hat in den geladenen Partien nichts gegen dein ${R.repSrc==="rep"?"Repertoire":"Training"} mit ${me==="w"?"Weiß":"Schwarz"} gespielt.</p></div>`;
    if(G.length)h+=`<div class="card sc-gaps"><h4>Hier fehlt dir eine Antwort</h4>${G.map((g,i)=>`<div class="sc-gap"><span>${g.pre.length?`Nach <b>${esc(fmtMoves(g.pre))}</b> spielt ${u}`:`${u} eröffnet oft mit`} <b>${esc(mvTxt(g.pre,g.m))}</b> <small>(${g.c} von ${g.n} Partien)</small></span><button class="chip" data-scgap="${me}|${i}">Analysieren</button></div>`).join("")}</div>`;
  }
  return h;
}
function renderScout(){
  const v=$("v-scout");if(!v)return;const R=SC.res;
  v.innerHTML=pageHead("Gegner-Check","Sieh, was ein Gegner gegen dein Repertoire spielt – und übe genau das.","search","scout")+
  `<div class="card sc-in"><div class="setrow"><span><b>Plattform</b><small>Es werden nur öffentliche Partien geladen – kein Konto nötig.</small></span><span class="seg">${[["chesscom","Chess.com"],["lichess","Lichess"]].map(([k,t])=>`<button data-scsrc="${k}" aria-pressed="${SC.src===k}">${t}</button>`).join("")}</span></div>
    <form id="scForm" class="sc-form" autocomplete="off"><input class="txt" id="scUser" placeholder="Benutzername des Gegners" autocapitalize="off" spellcheck="false" value="${esc(SC.user)}" aria-label="Benutzername des Gegners"><button class="btn grn" id="scGo"${SC.busy?" disabled":""}>${SC.busy?"Lädt …":"Prüfen"}</button></form>
    ${SC.recent.length?`<div class="chips sc-recent">${SC.recent.map(r=>`<button class="chip" data-scr="${esc(r.src)}|${esc(r.user)}">${esc(r.user)}<small>${r.src==="lichess"?"Lichess":"Chess.com"}</small></button>`).join("")}</div>`:""}
    <p class="hint${SC.err?" sc-err":""}" id="scMsg" role="status">${esc(SC.busy?SC.msg:SC.err)}</p></div>`+
  (R&&!SC.busy?scoutHtml(R):SC.busy?"":emptyState("search","Noch kein Gegner geprüft","Probier es mit dem Namen eines Freundes oder deines nächsten Turniergegners."));
  v.querySelectorAll("[data-scsrc]").forEach(b=>b.onclick=()=>{SC.src=b.dataset.scsrc;store.set("et-scsrc",SC.src);renderScout()});
  $("scForm").onsubmit=e=>{e.preventDefault();scoutRun(SC.src,$("scUser").value)};
  v.querySelectorAll("[data-scr]").forEach(b=>b.onclick=()=>{const [src,u]=b.dataset.scr.split("|");scoutRun(src,u)});
  if(!R)return;
  v.querySelectorAll("[data-scp]").forEach(b=>b.onclick=()=>{const [me,i]=b.dataset.scp.split("|");const x=R.paths[me][+i];if(!x)return;startSession("scout",x.lines.slice(0,8).map(j=>lk(x.o.id,j)),`Vorbereitung gegen ${R.user}`)});
  v.querySelectorAll("[data-scall]").forEach(b=>b.onclick=()=>{const ks=b.dataset.keys.split(",").filter(Boolean);if(ks.length)startSession("scout",ks,`Vorbereitung gegen ${R.user}`)});
  v.querySelectorAll("[data-scgap]").forEach(b=>b.onclick=()=>{const [me,i]=b.dataset.scgap.split("|");const g=R.gaps[me][+i];if(g){const mv=g.pre.concat(g.m);openAnaBoard(null,mv,mv.length)}});
}

/* ---- Analyse: Link/PGN, Analysebrett, Verlauf ---- */
function renderAnalyse(){
  const v=$("v-analyse");if(!v)return;
  const list=ANAH.slice(0,12);
  const row=g=>{const rv=REV[g.id];const acc=rv&&rv.acc?(g.foreign?`${rv.acc.w.toFixed(0)} | ${rv.acc.b.toFixed(0)}`:rv.acc[g.color].toFixed(1)+" %"):"";
    return `<button class="gi" data-ah="${esc(g.id)}"><span class="res ${g.foreign?"draw":g.res}">${g.foreign?"·":g.res==="win"?"S":g.res==="loss"?"N":"½"}</span><span style="min-width:0"><b>${esc(g.white||"Weiß")} – ${esc(g.black||"Schwarz")}</b><small>${esc(g.fam||"")}${g.result?" · "+esc(g.result):""}${g.date?" · "+fmtDate(g.date):""}</small></span><span class="acc">${acc}</span><span class="mini">${rv?"Öffnen":"Review"}</span></button>`};
  v.innerHTML=pageHead("Partie analysieren","Füg eine Partie ein, Stockfish bewertet jeden Zug.","search","ana")+anaInputHtml()+
  `<div class="card"><h3>Analysebrett</h3><p class="hint" style="margin:0 0 8px">Untersuche eine beliebige Stellung: Ziehe für beide Seiten, Stockfish zeigt die drei besten Fortsetzungen.</p>
    <input class="txt" id="abFen" placeholder="FEN einfügen (leer = Grundstellung)" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="btnrow" style="margin-top:8px"><button class="btn grn" id="abGo">Analysebrett öffnen</button><span class="hint" id="abMsg"></span></div></div>
  <div class="sec-h"><h3>Zuletzt analysiert</h3>${list.length?`<small>${list.length} Partien</small>`:""}</div>
  ${list.length?`<div class="glist">${list.map(row).join("")}</div>`:emptyState("search","Noch keine Analysen","Füge oben einen Link oder eine PGN ein – oder verknüpfe dein Konto, um alle Partien zu sehen.",`<button class="btn" data-go="chess">${siteName()} verknüpfen</button>`)}`;
  wireAnaInput();
  $("abGo").onclick=()=>{const f=$("abFen").value.trim();if(f){const ok=new Chess().validate_fen(f);if(!ok.valid){$("abMsg").textContent="Diese FEN ist ungültig.";return}}openAnaBoard(f||null,[])};
  v.querySelectorAll("[data-ah]").forEach(b=>b.onclick=()=>{const g=ANAH.find(x=>x.id===b.dataset.ah);if(g)reviewGame(g)});
  v.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showView(b.dataset.go));
}
function openAnaBoard(fen,moves,at){
  openGame({id:"__ana",free:true,title:"Analysebrett",players:"Weiß – Schwarz",moves:moves||[],fen:fen||null,startView:at||0,d:"Ziehe für beide Seiten. Stockfish zeigt die besten Fortsetzungen, der Balken die Bewertung."});
  freeStatus();
}
function freeMove(mv,animate){
  truncate(view);const r=commit(mv,"p");view=hist.length;game.n=hist.length;shown=new Chess(fens[view]);sel=null;
  render(animate?{fwd:r}:null);playSound(r);renderChrome();freeStatus();
}
function freeStatus(){
  if(!game||!game.free)return;const fen=fens[view];const g=new Chess(fen);
  if(g.in_checkmate()){setStatus("done","Schachmatt",`${g.turn()==="w"?"Schwarz":"Weiß"} gewinnt.`,true);return}
  if(g.game_over()){setStatus("view","Remis",g.in_stalemate()?"Patt.":"Keine Gewinnmöglichkeit mehr.",true);return}
  const t=view?`${Math.ceil(view/2)}${view%2?".":"..."} ${de(mvs[view-1].san)}`:"Analysebrett";const who=g.turn()==="w"?"Weiß":"Schwarz";
  setStatus("view",t,`${who} am Zug · Bewertung wird berechnet …`,true);
  evalFen(fen).then(cp=>{if(!game||!game.free||fens[view]!==fen)return;setStatus("view",t,`${who} am Zug · Bewertung ${fmtEv(cp)} (${Math.abs(cp)<30?"ausgeglichen":cp>0?"Weiß steht besser":"Schwarz steht besser"})`,true)}).catch(()=>{});
}

/* ---- Brett-Menü »⋯« ---- */
{
  const bm=$("bMenu"),mb=$("moreBtn");
  const sync=()=>{$("sndBtn").setAttribute("aria-pressed",String(!!S.set.sound));$("coordBtn").setAttribute("aria-pressed",String(!!S.set.coords));$("ideaBtn").setAttribute("aria-pressed",String(!!S.set.ideas));$("evalBtn").setAttribute("aria-pressed",String(!!S.set.evalbar));$("engArBtn").setAttribute("aria-pressed",String(S.set.engArrow!==false))};
  const close=()=>{bm.hidden=true;mb.setAttribute("aria-expanded","false")};
  mb.onclick=e=>{e.stopPropagation();if(!bm.hidden){close();return}sync();bm.hidden=false;mb.setAttribute("aria-expanded","true");
    const r=mb.getBoundingClientRect();const up=r.top>innerHeight-r.bottom;bm.style.right=Math.max(8,innerWidth-r.right)+"px";
    if(up){bm.style.top="auto";bm.style.bottom=(innerHeight-r.top+8)+"px";bm.style.maxHeight=(r.top-16)+"px"}else{bm.style.bottom="auto";bm.style.top=(r.bottom+8)+"px";bm.style.maxHeight=(innerHeight-r.bottom-16)+"px"}const f=bm.querySelector("button");if(f&&!matchMedia("(pointer:coarse)").matches)f.focus()};
  document.addEventListener("click",e=>{if(!bm.hidden&&!bm.contains(e.target))close()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!bm.hidden){close();mb.focus()}});
  bm.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(!b.hasAttribute("aria-pressed"))close();else setTimeout(sync,0)});
  $("sndBtn").onclick=()=>{S.set.sound=!S.set.sound;save("set")};
  $("coordBtn").onclick=()=>{S.set.coords=!S.set.coords;save("set");applySettings()};
  $("ideaBtn").onclick=()=>{S.set.ideas=!S.set.ideas;save("set");render()};
  $("engArBtn").onclick=()=>{S.set.engArrow=S.set.engArrow===false;save("set");render()};
  $("fenBtn").onclick=()=>{const f=shown.fen();if(navigator.clipboard)navigator.clipboard.writeText(f).then(()=>toast("FEN kopiert")).catch(()=>linkBox(f));else linkBox(f)};
  $("anaBtn").onclick=()=>{if(mode==="online"&&ON.g&&ON.g.status!=="over"&&!ON.spect){toast("Während einer laufenden Partie geht das nicht – fair bleiben!");return}const moves=hist.slice();const at=view;openAnaBoard(startFen,moves,at)};
  $("setBtn").onclick=()=>showView("profile:settings");
  $("blindMi").onclick=()=>$("blindBtn").click();
}

/* ---- Besucherseite beim allerersten Öffnen ---- */
function openLanding(){
  if(document.querySelector(".landing"))return;
  const el=document.createElement("div");el.className="landing";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","lnH");
  const f=(ic,t,d)=>`<div class="lf"><span class="lf-ic">${NI[ic]}</span><b>${t}</b><small>${d}</small></div>`;
  el.innerHTML=`<div class="land-in">
    <div class="land-top"><div class="land-brand">${LOGO(34)}<span>${BRAND}</span></div><div class="land-board">${thumbHtml("r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3","Bc4",false)}</div><h1 id="lnH">Lerne die Eröffnungen, die du wirklich spielst.</h1><p>Dazu Taktik, Partien gegen Freunde und Analyse mit Stockfish. Kostenlos, ohne Werbung, auch offline.</p></div>
    <div class="land-crew" aria-label="Neun Trainer begleiten dich">${Object.keys(COACHES).map((id,i)=>`<span class="lc co-${id}" style="--i:${i}" title="${esc(TRAINER[id].full)}">${coachImg(id,"happy")}</span>`).join("")}<small>Neun Trainer begleiten dich – von Mila bis Rex</small></div>
    <div class="land-act"><button class="big" id="lnGo">Loslegen</button><button class="btn" id="lnLogin">Ich habe schon ein Konto</button></div>
    <div class="lfs">${f("book","Eröffnungen",`${ALL.filter(o=>o.g!=="c").length} Eröffnungen mit Wiederholung nach Lernkurve`)}${f("bolt","Taktik","Echte Lichess-Rätsel mit Wertung und Levels")}${f("swords","Online","Gegen Freunde spielen, Bestenliste, Zuschauen")}${f("search","Analyse","Game Review mit Stockfish 17")}</div>
    <p class="land-legal"><button class="linkb" data-lg="priv">Datenschutz</button> · <button class="linkb" data-lg="imp">Impressum</button></p></div>`;
  document.body.appendChild(el);document.body.classList.add("noscroll");
  const close=()=>{el.classList.add("out");document.body.classList.remove("noscroll");setTimeout(()=>el.remove(),calmNow()?0:260)};
  $("lnGo").onclick=()=>{close();setTimeout(openOnboarding,calmNow()?0:200)};
  $("lnLogin").onclick=()=>{close();store.set("et-onb",1);ON.authMode="login";showView("online:account")};
  el.querySelectorAll("[data-lg]").forEach(b=>b.onclick=()=>{close();legalTab=b.dataset.lg;showView("legal")});
  setTimeout(()=>{const b=$("lnGo");if(b&&!matchMedia("(pointer:coarse)").matches)b.focus()},50);
}

/* ---- Datenschutz, Impressum, Lizenzen ---- */
let legalTab="priv";
function renderLegal(){
  const v=$("v-legal");if(!v)return;const I=IMPRESSUM;
  const H=(t)=>`<h3>${t}</h3>`;
  const priv=`<article class="legal">
  <p class="hint">Stand: Oktober 2026</p>
  ${H("1. Verantwortlicher")}<p>${esc(I.name)}, ${esc(I.street)}, ${esc(I.city)}, ${esc(I.country)}<br>E-Mail: ${esc(I.mail)}</p>
  ${H("2. Das Wichtigste in Kürze")}<ul><li>${BRAND} lässt sich ohne Konto nutzen. Dann bleibt dein Fortschritt ausschließlich in deinem Browser.</li><li>Es gibt keine Werbung, kein Tracking, keine Analyse- oder Marketing-Cookies und keine Weitergabe zu Werbezwecken.</li><li>Ein Konto brauchst du nur für Online-Partien, Bestenliste, Freunde und die Synchronisierung zwischen Geräten.</li><li>Stockfish rechnet direkt auf deinem Gerät, deine Partien werden dafür nicht hochgeladen.</li></ul>
  ${H("3. Hosting")}<p>Die App wird über GitHub Pages bereitgestellt (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). Beim Aufruf verarbeitet GitHub technisch notwendige Daten wie deine IP-Adresse, Datum und Uhrzeit sowie die angeforderte Datei, um die Seite auszuliefern und vor Angriffen zu schützen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer sicheren Bereitstellung). GitHub ist unter dem EU-US Data Privacy Framework zertifiziert. Details: <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">Datenschutzerklärung von GitHub</a>.</p>
  ${H("4. Speicherung auf deinem Gerät")}<p>Fortschritt, Wiederholungsplan, Statistik, Einstellungen, eigene Varianten und zwischengespeicherte Analysen werden im lokalen Speicher deines Browsers (localStorage) abgelegt. Damit die App offline funktioniert, speichert ein Service Worker die Programmdateien. Diese Speicherung ist für die von dir gewünschten Funktionen unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG) und wird nicht an uns übertragen, solange du kein Konto nutzt. Du kannst alles jederzeit löschen: in den Einstellungen unter „Fortschritt zurücksetzen“ oder über die Website-Daten deines Browsers.</p>
  ${H("5. Konto und Online-Funktionen")}<p>Für Konten nutzen wir Firebase Authentication und Cloud Firestore der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Gespeichert werden:</p><ul><li>E-Mail-Adresse und Passwort zur Anmeldung. Das Passwort wird von Firebase nur verschlüsselt (als Hash) gespeichert und ist für niemanden lesbar, auch nicht für uns.</li><li>dein Benutzername, Registrierungsdatum und der Zeitpunkt, wann du zuletzt online warst</li><li>deine Online-Partien (Züge, Restzeiten, Ergebnis, Bedenkzeit und während einer laufenden Partie ein Zeitstempel, ob du verbunden bist), Wertung und Bilanz</li><li>Freundesliste und Freundschaftsanfragen, Zuschauer bei laufenden Partien</li><li>eine Kopie deines Trainingsfortschritts, damit er auf allen Geräten gleich ist</li></ul>
  <p>Firebase verarbeitet bei der Anmeldung technisch bedingt auch deine IP-Adresse, um Missbrauch zu verhindern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der von dir gewünschten Funktionen). Google kann Daten auch in den USA verarbeiten und ist unter dem EU-US Data Privacy Framework zertifiziert; zusätzlich gelten die EU-Standardvertragsklauseln. Mehr dazu: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">Datenschutz bei Firebase</a>.</p>
  <p><b>Sichtbar für andere Spieler</b> sind dein Benutzername, deine Online-Wertung und -Bilanz, deine laufenden und beendeten Partien sowie, ob du gerade online bist. Taktik-Wertung, gelernte Varianten und Serie kannst du unter Profil → Konto für die Bestenliste ausblenden. Deine E-Mail-Adresse sehen andere Spieler nie.</p>
  <p><b>Moderation:</b> Um Missbrauch zu verhindern, kann der Betreiber im Admin-Bereich Benutzernamen, E-Mail-Adressen, Partien und Statistiken einsehen, Konten sperren und unangemessene Namen ändern.</p>
  <p><b>Löschung:</b> Unter Profil → Konto kannst du dein Konto jederzeit selbst löschen. Dabei werden Anmeldedaten (E-Mail und Passwort), Profil, Benutzername und der gespeicherte Fortschritt entfernt. Bereits gespielte Partien und Freundschaftsanfragen bleiben bei deinen Gegnern als Verlauf erhalten und zeigen deinen damaligen Benutzernamen. Auf Wunsch entfernen wir auch diese – schreib uns einfach.</p>
  ${H("6. Dienste, die nur auf deinen Wunsch aufgerufen werden")}<p>Folgende Dienste werden direkt aus deinem Browser angefragt, und zwar nur, wenn du die jeweilige Funktion benutzt. Dabei erhält der Anbieter deine IP-Adresse und die Anfrage (zum Beispiel einen Benutzernamen oder eine Stellung):</p><ul><li><b>Lichess</b> (lichess.org, Frankreich): Eröffnungsdatenbank, Meisterpartien, Taktik-Rätsel, Studien-Import und Partien per Link</li><li><b>Chess.com</b> (Chess.com, LLC, USA): Profil, Wertungen und Partien des Benutzernamens, den du eingibst, sowie das Tagesrätsel</li><li><b>GitHub</b> (GitHub, Inc., USA): nur wenn du die Synchronisierung über ein privates Gist mit deinem eigenen Token einrichtest</li></ul><p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p>
  ${H("7. Deine Rechte")}<p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Schreib dazu einfach an die oben genannte E-Mail-Adresse. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Behörde deines Bundeslandes.</p>
  ${H("8. Kinder")}<p>Für ein Konto solltest du mindestens 16 Jahre alt sein oder die Erlaubnis deiner Eltern haben. Ohne Konto kann jeder die App nutzen, dabei werden keine Daten an uns übertragen.</p>
  </article>`;
  const imp=`<article class="legal">
  ${H("Angaben gemäß § 5 DDG")}<p>${esc(I.name)}<br>${esc(I.street)}<br>${esc(I.city)}<br>${esc(I.country)}</p>
  ${H("Kontakt")}<p>E-Mail: ${esc(I.mail)}</p>
  ${H("Verantwortlich für den Inhalt")}<p>${esc(I.name)}, Anschrift wie oben</p>
  ${H("Haftung für Links")}<p>Die App verweist auf externe Seiten wie Lichess und Chess.com. Für deren Inhalte sind ausschließlich die jeweiligen Anbieter verantwortlich.</p>
  ${H("Hinweis")}<p>${BRAND} ist ein privates, nicht-kommerzielles Projekt und steht in keiner Verbindung zu Chess.com oder Lichess.</p></article>`;
  const lic=`<article class="legal">
  <p>${BRAND} verwendet folgende freie Software und Inhalte:</p><ul>
  <li><b>chess.js</b> von Jeff Hlywa – BSD-2-Clause</li>
  <li><b>Stockfish 17.1</b> (stockfish.js von Nathan Rugg) – GNU GPL v3, Quelltext und Lizenz unter <code>engine/</code></li>
  <li><b>jsPDF 4.2.1</b> (James Hall und Mitwirkende) – MIT-Lizenz, unter <code>lib/jspdf/</code>; wird nur für den Spickzettel geladen</li>
  <li><b>Firebase JS SDK</b> von Google – Apache License 2.0</li>
  <li>Schrift <b>Rubik</b> von Hubert und Fischer (The Rubik Project Authors) – SIL Open Font License 1.1, liegt unter <code>lib/fonts/</code></li>
  <li>Schriften der Kurswelten, alle unter <code>lib/fonts/</code> mit Lizenztext: <b>Caveat</b> (The Caveat Project Authors), <b>Bungee</b> (The Bungee Project Authors), <b>Cinzel</b> (The Cinzel Project Authors), <b>IM Fell English SC</b> (Igino Marini), <b>Uncial Antiqua</b> (Astigmatic), <b>Bangers</b> (The Bangers Project Authors), <b>Orbitron</b> (The Orbitron Project Authors), <b>Pirata One</b> (Rodrigo Fuenzalida, Nicolas Massi) – SIL Open Font License 1.1; <b>Special Elite</b> (Astigmatic) – Apache License 2.0</li>
  <li>Figuren „Klassisch“ von Colin M. L. Burnett – GPLv2+; „Staunty“ aus Lichess – CC BY-NC-SA 4.0</li>
  <li>Taktik-Rätsel und Eröffnungsstatistik: Lichess-Datenbank – CC0</li>
  <li>Eröffnungsnamen und Theoriebuch: <b>lichess-org/chess-openings</b> – CC0</li></ul></article>`;
  v.innerHTML=pageHead("Rechtliches","Datenschutz, Impressum und Lizenzen.","legal")+
  `<div class="seg" style="align-self:flex-start">${[["priv","Datenschutz"],["imp","Impressum"],["lic","Lizenzen"]].map(t=>`<button data-lt="${t[0]}" aria-pressed="${legalTab===t[0]}">${t[1]}</button>`).join("")}</div>
  <div class="card">${legalTab==="imp"?imp:legalTab==="lic"?lic:priv}</div>`;
  v.querySelectorAll("[data-lt]").forEach(b=>b.onclick=()=>{legalTab=b.dataset.lt;renderLegal()});
}

/* Sprungadressen wie #impressum oder #computer – auch wenn die Seite schon offen ist */
const HASHV={"#liga":"league","#start":"home","#analyse":"analyse","#chess":"chess","#quiz":"quiz","#statistik":"profile:stats","#profil":"profile:stats","#partien":"games","#lernen":"learn","#training":"learn","#eroeffnungen":"openings","#einstellungen":"profile:settings","#computer":"bots","#online":"online:play","#bestenliste":"online:leader","#datenschutz":"legal","#impressum":"legal"};
window.addEventListener("hashchange",()=>{const h=location.hash;if(!HASHV[h])return;if(h==="#impressum")legalTab="imp";else if(h==="#datenschutz")legalTab="priv";history.replaceState(null,"",location.pathname);showView(HASHV[h])});

/* ================= Phase 2: Kurse, Baum-Editor, Koordinaten, Meisterzug, Bot-Stile ================= */

/* ---- Kurse: Eröffnungen als Kapitel in sinnvoller Reihenfolge ---- */
/* Spielstile: Jeder Kurs gehört zu einem oder mehreren Stilen, die Kursseite filtert danach */
const STYLES={
  einstieg:{n:"Einstieg",d:"Die ersten Eröffnungen: einfache Pläne, schnelle Entwicklung und die wichtigsten Fallen."},
  angriff:{n:"Angriff",d:"Du willst den König jagen: offene Linien, Bauernstürme und lange Rochade."},
  solide:{n:"Solide",d:"Du willst sicher stehen: feste Bauernstruktur, wenig Risiko und ein gesundes Endspiel."},
  strategie:{n:"Strategie",d:"Du spielst gern mit Plan: Raumvorteil, langsamer Druck und die besseren Figuren."},
  dynamisch:{n:"Dynamisch",d:"Du magst Kampfstellungen: unausgeglichen, mit Gegenspiel und Gewinnchancen für beide Seiten."},
  gambit:{n:"Gambits",d:"Du opferst gern Material für Tempo und Initiative – besonders stark im Blitz und Schnellschach."},
  system:{n:"Wenig Theorie",d:"Du willst einen Aufbau, der gegen fast alles funktioniert, statt lange Varianten auswendig zu lernen."}
};
const COURSES=[
  {id:"w_start",t:"Erste Schritte mit Weiß",lvl:"Einsteiger",side:"w",st:["einstieg"],d:"Ein einfaches, aktives Repertoire mit 1.e4 und dem Londoner System – dazu die wichtigsten Fallen.",ch:[["italienisch","Italienisch – schnell entwickeln"],["fallen_w","Fallen, die jeder kennen muss"],["londoner","Londoner System – ein Aufbau gegen alles"]]},
  {id:"b_start",t:"Erste Schritte mit Schwarz",lvl:"Einsteiger",side:"b",st:["einstieg"],d:"Mit 1...e5 und Skandinavisch kommst du sicher aus der Eröffnung – und tappst in keine Falle.",ch:[["e5_schwarz","1...e5 gegen die Offenen Spiele"],["skandinavisch","Skandinavisch gegen 1.e4"],["fallen_b","Fallen für Schwarz"]]},
  {id:"w_system",t:"Weiß: Aufbausysteme mit wenig Theorie",lvl:"Einsteiger",side:"w",st:["system"],d:"Immer derselbe Aufbau, egal was Schwarz spielt: Londoner System, Jobava-London, Colle und Königsindischer Angriff.",ch:[["londoner","Londoner System – der Klassiker"],["jobava","Jobava-London – die angriffslustige Version"],["colle","Colle-System – mit dem Durchbruch e4"],["kia","Königsindischer Angriff – ein Aufbau mit 1.Sf3"]]},
  {id:"b_system",t:"Schwarz: sicher mit wenig Theorie",lvl:"Einsteiger",side:"b",st:["system","solide"],d:"Skandinavisch gegen 1.e4, Slawisch und Halbslawisch gegen 1.d4 und ein klarer Plan gegen das Londoner System – überschaubar und robust.",ch:[["skandinavisch","Skandinavisch gegen 1.e4"],["slawisch","Slawisch gegen das Damengambit"],["halbslawisch","Halbslawisch – der feste Aufbau"],["gegen_london_b","Gegen das Londoner System"]]},
  {id:"w_quiet_e4",t:"Weiß: 1.e4 ruhig und gesund",lvl:"Fortgeschritten",side:"w",st:["solide"],d:"1.e4 ohne Theorieschlacht: Italienisch mit c3 und d3, Alapin gegen Sizilianisch und klare Pläne gegen die übrigen Verteidigungen.",ch:[["italienisch","Italienisch – langsam aufbauen"],["alapin_w","Alapin gegen Sizilianisch"],["gegen_caro_w","Gegen Caro-Kann"],["gegen_franz_w","Gegen Französisch"],["gegen_skandi_w","Gegen Skandinavisch"]]},
  {id:"b_solid",t:"Schwarz: solide gegen alles",lvl:"Fortgeschritten",side:"b",st:["solide"],d:"Caro-Kann gegen 1.e4 und das abgelehnte Damengambit gegen 1.d4 – bewährt bis in die Weltspitze.",ch:[["carokann","Caro-Kann"],["dg_abgelehnt","Damengambit abgelehnt"],["nimzo","Nimzo-Indisch als Waffe"]]},
  {id:"b_classic",t:"Schwarz: klassisch gegen alles",lvl:"Fortgeschritten",side:"b",st:["strategie","solide"],d:"Mit 1...e5 und 1...d5 direkt ins Zentrum – dazu feste Antworten auf das Londoner System und 1.c4.",ch:[["e5_schwarz","1...e5 gegen 1.e4"],["dg_abgelehnt","Damengambit abgelehnt"],["gegen_london_b","Gegen das Londoner System"],["gegen_englisch_b","Gegen Englisch – umgekehrtes Sizilianisch"]]},
  {id:"w_d4",t:"Weiß mit 1.d4 – solide und strategisch",lvl:"Fortgeschritten",side:"w",st:["strategie"],d:"Damengambit und Katalanisch, dazu Pläne gegen Königsindisch und Holländisch.",ch:[["damengambit","Damengambit"],["katalanisch","Katalanisch"],["gegen_ki_w","Gegen Königsindisch"],["gegen_holl_w","Gegen Holländisch"]]},
  {id:"w_flank",t:"Weiß: Flankenspiel mit 1.Sf3 und 1.c4",lvl:"Fortgeschritten",side:"w",st:["strategie"],d:"Réti, Englisch und Katalanisch: Weiß greift das Zentrum vom Rand aus an – mit Fianchetto und langem Druck auf der Diagonale.",ch:[["reti","Réti-Eröffnung"],["englisch","Englisch"],["katalanisch","Katalanisch"],["kia","Königsindischer Angriff als Ausweichsystem"]]},
  {id:"w_e4",t:"Weiß mit 1.e4 – das komplette Repertoire",lvl:"Fortgeschritten",side:"w",st:["strategie","angriff"],d:"Antworten auf alle großen Verteidigungen: Sizilianisch, Französisch, Caro-Kann, Skandinavisch und 1...e5.",ch:[["spanisch","Spanisch gegen 1...e5"],["offen_siz_w","Offenes Sizilianisch"],["gegen_franz_w","Gegen Französisch"],["gegen_caro_w","Gegen Caro-Kann"],["gegen_skandi_w","Gegen Skandinavisch"]]},
  {id:"w_attack",t:"Weiß: Angriff mit 1.e4",lvl:"Fortgeschritten",side:"w",st:["angriff"],d:"Gegen jede Verteidigung ein Plan auf den König: Wiener Partie mit f4, Englischer Angriff gegen Sizilianisch, Dg4 gegen Französisch und der 150-Angriff gegen Pirc.",ch:[["wiener","Wiener Partie – f4 gegen 1...e5"],["offen_siz_w","Offenes Sizilianisch mit Englischem Angriff"],["gegen_franz_w","Gegen Französisch – Dg4 und lange Rochade"],["gegen_caro_w","Gegen Caro-Kann – Raum und h-Bauer"],["gegen_skandi_w","Gegen Skandinavisch – lange Rochade"],["gegen_pirc_w","Gegen Pirc – der 150-Angriff"]]},
  {id:"b_counter",t:"Schwarz: Konter statt Verteidigung",lvl:"Fortgeschritten",side:"b",st:["angriff","dynamisch"],d:"Schwarz will selbst die Initiative: Aljechin gegen 1.e4, Holländisch, Moderne Benoni und Grünfeld gegen 1.d4 stellen früh Fragen.",ch:[["aljechin","Aljechin-Verteidigung"],["hollaendisch","Holländisch"],["benoni","Moderne Benoni"],["gruenfeld","Grünfeld-Indisch"]]},
  {id:"b_hyper",t:"Schwarz: Fianchetto und Konter",lvl:"Fortgeschritten",side:"b",st:["dynamisch"],d:"Erst aufbauen, dann zurückschlagen: Pirc und Moderne gegen 1.e4, Königsindisch gegen 1.d4 – mit dem Läufer auf g7 als Waffe.",ch:[["pirc","Pirc-Verteidigung"],["modern","Moderne Verteidigung"],["koenigsindisch","Königsindisch"],["beschl_drachen","Beschleunigter Drachen – Fianchetto im Sizilianer"]]},
  {id:"b_sharp",t:"Schwarz: scharf und dynamisch",lvl:"Stark",side:"b",st:["dynamisch"],d:"Najdorf und Königsindisch – komplexe Stellungen mit Gewinnchancen.",ch:[["najdorf","Sizilianisch Najdorf"],["drachen","Sizilianisch Drachen"],["koenigsindisch","Königsindisch"],["gruenfeld","Grünfeld-Indisch"]]},
  {id:"b_sicilian",t:"Schwarz: Sizilianisch für Kämpfer",lvl:"Stark",side:"b",st:["dynamisch","angriff"],d:"Die großen Systeme gegen das Offene Sizilianisch – such dir eins aus oder lerne alle: Najdorf, Sweschnikow, Taimanow und Beschleunigter Drachen.",ch:[["najdorf","Najdorf"],["sweschnikow","Sweschnikow"],["taimanow","Taimanow"],["beschl_drachen","Beschleunigter Drachen – auch gegen Alapin und Rossolimo"]]},
  {id:"gambits",t:"Gambits und Überfälle",lvl:"Für Mutige",side:"wb",st:["gambit"],d:"Bauernopfer für schnellen Angriff – ideal für Blitz und Schnellschach.",ch:[["evans","Evans-Gambit"],["koenigsgambit","Königsgambit"],["friedliver","Fegatello (Fried Liver)"],["stafford","Stafford-Gambit"],["englund","Englund-Gambit"]]},
  {id:"w_gambit",t:"Weiß: Gambits gegen alles",lvl:"Für Mutige",side:"w",st:["gambit","angriff"],d:"Für jede schwarze Antwort ein Bauernopfer: Nordisches Gambit und Evans gegen 1...e5, Smith-Morra gegen Sizilianisch, Blackmar-Diemer gegen 1...d5.",ch:[["daenisch","Nordisches Gambit gegen 1...e5"],["evans","Evans-Gambit im Italiener"],["morra","Smith-Morra gegen Sizilianisch"],["blackmar","Blackmar-Diemer mit 1.d4 d5 2.e4"],["halloween","Halloween-Gambit – für die Überraschung"]]},
  {id:"b_gambit",t:"Schwarz: Gegengambits",lvl:"Für Mutige",side:"b",st:["gambit"],d:"Schwarz reißt die Initiative an sich: Lettisch, Traxler und Jänisch gegen 1.e4, Albin, Budapester und Wolga-Gambit gegen 1.d4.",ch:[["lettisch","Lettisches Gambit"],["traxler","Traxler-Gegenangriff"],["jaenisch","Jänisch-Gambit gegen Spanisch"],["albin","Albins Gegengambit"],["budapester","Budapester Gambit"],["benko","Wolga-Gambit"]]}
];
/* Kurse zeigen pro Kapitel die Varianten, die zur Stufe passen: Einsteiger nur die Kernvarianten, Fortgeschrittene ohne Raritäten.
   Sortiert nach Häufigkeit, damit man mit dem Wichtigsten anfängt. */
const COURSE_MIN={"Einsteiger":.04,"Fortgeschritten":.012};
function courseLines(c,id){
  const o=byId(id);if(!o)return [];const min=COURSE_MIN[c.lvl]||0;const pr=o.lines.map((l,i)=>lineProb(o,i));
  const all=o.lines.map((l,i)=>i).sort((a,b)=>(pr[b]==null?1:pr[b])-(pr[a]==null?1:pr[a])||a-b);
  const ix=all.filter(i=>!o.lines[i].tree||pr[i]==null||pr[i]>=min);
  /* jedes Kapitel hat mindestens drei Varianten, auch wenn der Baum sehr breit verzweigt */
  return ix.length>=3?ix:all.slice(0,Math.max(ix.length,Math.min(3,all.length)));
}
const courseKeys=c=>[].concat(...c.ch.map(([id])=>courseLines(c,id).map(i=>lk(id,i))));
const courseProg=c=>{const ks=courseKeys(c);return {n:ks.length,cl:ks.filter(k=>Pk(k)===2).length}};
let courseOpen=null;
/* Filter der Kursseite (nur für diesen Browser gemerkt) */
const crsF={st:"",side:"",co:""};try{Object.assign(crsF,JSON.parse(localStorage.getItem("et-crsf")||"{}"))}catch(e){}
const crsStyles=c=>c.st.map(k=>STYLES[k]?STYLES[k].n:k).join(" · ");

/* ---- Kursdesign, Ränge und Trainer (Figuren und Themen in coaches.js) ---- */
function hexMix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return "#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("").toUpperCase()}
(function(){const wf=id=>{const w=WFONT[id]||WFONT.mila;return `--wf:"${w.f}";--wfs:${w.s};--wls:${w.ls}`};
  const css=Object.keys(COURSE_THEME).map(id=>{const t=COURSE_THEME[id];return `.th-${id}{--c1:${t.c1};--c2:${t.c2};--pat:${crsPat(t.pat)};${wf(t.co)}}`}).join("\n")+"\n"+
  Object.keys(COACHES).map(id=>`.co-${id}{--k1:${COACHES[id].bg[0]};--k2:${COACHES[id].bg[1]};${wf(id)}}`).join("\n")+"\n"+
  (typeof SECT!=="undefined"?Object.keys(SECT).map(k=>`.sec-${k}{--c1:${SECT[k].c1};--c2:${SECT[k].c2};--pat:${crsPat(SECT[k].pat)}}`).join("\n"):"")+"\n"+
  /* Kursbretter: Feldfarben, Markierung des letzten Zugs (mit Gelb gemischt) und eine leise Struktur je Welt */
  (typeof WBOARD!=="undefined"?Object.keys(WBOARD).map(id=>{const [l,d,tx]=WBOARD[id],T=tx&&WBOARD_TX[tx];
    return `.cbrd #v-train.crs-on.th-${id}{--sq-l:${l};--sq-d:${d};--hl-l:${hexMix(l,"#F7E25E",.6)};--hl-d:${hexMix(d,"#E6CF3A",.55)}${T?`;--tx-l:${T[0]};--tx-d:${T[1]}`:""}}`}).join("\n"):"");
  const el=document.createElement("style");el.id="crs-themes";el.textContent=css;document.head.appendChild(el)})();
if(!st.crs||typeof st.crs!=="object"||Array.isArray(st.crs))st.crs={};
const thOf=c=>COURSE_THEME[c.id]||COURSE_THEME.w_start;
const coIdOf=c=>COACHES[thOf(c).co]?thOf(c).co:"mila";
const MEDAL=["","Bronze","Silber","Gold"];
const nV=(n,one,many)=>`${n} ${n===1?one:many}`;
const varV=n=>nV(n,"Variante","Varianten");
function crsChapters(c){
  const m=st.crs[c.id];
  return c.ch.map(([id,t],ci)=>{const o=byId(id);const ix=o?courseLines(c,id):[];const cl=ix.filter(i=>P(id,i)===2).length;
    return {id,t,ci,o,ix,cl,n:ix.length,done:ix.length>0&&cl===ix.length,med:m&&m.med&&m.med[ci]||0}});
}
function crsRank(c){
  const p=courseProg(c);const f=p.n?p.cl/p.n:0;let i=0;RANK_TH.forEach((t,j)=>{if(f>=t-1e-9)i=j});
  const th=thOf(c);const nx=i<5?RANK_TH[i+1]:null;const left=nx==null?0:Math.max(1,Math.ceil(nx*p.n-1e-9)-p.cl);
  const lo=RANK_TH[i],part=nx==null?1:Math.min(1,Math.max(0,(f-lo)/(nx-lo)));
  return {i,name:th.rk[i],next:nx==null?null:th.rk[i+1],left,f,part,p};
}
/* Stand, mit dem der Trainer Aufstiege und geschaffte Kapitel erkennt (wird mit dem Konto synchronisiert) */
function crsMeta(c){
  let m=st.crs[c.id];
  if(!m||typeof m!=="object"){m=st.crs[c.id]={r:crsRank(c).i,ch:[],med:{}};m.ch=crsChapters(c).filter(x=>x.done).map(x=>x.ci)}
  if(!Array.isArray(m.ch))m.ch=[];if(!m.med||typeof m.med!=="object")m.med={};if(typeof m.r!=="number")m.r=0;
  return m;
}
const crsDue=c=>courseKeys(c).filter(k=>isDue(k));
const crsWeak=c=>courseKeys(c).filter(k=>Pk(k)===1);
/* ===== Lernmethode: Lerneinheiten nach Erkenntnissen der Lernforschung =====
   Ablauf einer Einheit: Aufwärmen mit fälligen Wiederholungen (Testeffekt, Spacing) → wenige neue Varianten (Arbeitsgedächtnis),
   je nach Stufe vorgezeigt oder erst geraten (Expertise-Reversal, Pretesting), mit Denkfrage (Self-Explanation) →
   dazwischen ältere Varianten aus anderen Kapiteln (Interleaving) → die neuen noch einmal mit Abstand ohne Hilfe →
   was nicht sitzt, kommt bis zu zweimal wieder (Successive Relearning). Nach jeder Variante: Wie sicher warst du? (Metakognition) */
const LEARN_SCI=[
  {t:"Abrufen statt Anschauen",d:"Jede Variante spielst du aus dem Gedächtnis. Sich selbst zu prüfen festigt Wissen deutlich stärker, als es noch einmal anzusehen.",src:[["Roediger & Karpicke 2006","https://pubmed.ncbi.nlm.nih.gov/16507066/"]]},
  {t:"Verteilt statt am Stück",d:"Wiederholungen kommen in wachsenden Abständen – kurz bevor du sie vergessen würdest. Verteiltes Üben schlägt Pauken.",src:[["Cepeda u. a. 2006","https://pubmed.ncbi.nlm.nih.gov/16719566/"]]},
  {t:"Wiederholen, bis es sitzt",d:"Was nicht fehlerfrei klappt, kommt in derselben Einheit noch einmal und an späteren Tagen wieder. So wird aus Gelerntem dauerhaftes Wissen.",src:[["Rawson & Dunlosky 2022","https://journals.sagepub.com/doi/full/10.1177/09637214221100484"]]},
  {t:"Gemischt üben",d:"Wiederholungen und ältere Varianten aus anderen Kapiteln kommen gemischt. So lernst du, Stellungen auseinanderzuhalten – wie in einer echten Partie.",src:[["Rohrer & Taylor 2007","https://digitalcommons.usf.edu/psy_facpub/1767/"]]},
  {t:"Kleine Portionen",d:"Höchstens fünf neue Varianten pro Einheit, standardmäßig drei pro Tag. Das Arbeitsgedächtnis fasst nur etwa vier Einheiten gleichzeitig.",src:[["Cowan 2001","https://pubmed.ncbi.nlm.nih.gov/11515286/"]]},
  {t:"Vorzeigen oder erst raten",d:"Einsteiger lernen am besten an vorgezeigten Beispielen. Wer schon mehr weiß, profitiert davon, erst selbst zu raten und dann korrigiert zu werden – auch falsche Versuche helfen beim Merken.",src:[["Kalyuga u. a. 2003","https://ro.uow.edu.au/edupapers/136"],["Kornell, Hays & Bjork 2009","https://pubmed.ncbi.nlm.nih.gov/19586265/"]]},
  {t:"Sich selbst erklären",d:"Nach dem Vorzeigen stellt dir der Trainer eine Denkfrage zur Idee der Variante. Wer sich Züge selbst erklärt, versteht und behält sie besser.",src:[["Chi u. a. 1989","https://education.asu.edu/lcl/publications/chi-m-t-h-bassok-m-lewis-m-reimann-p-glaser-r-1989-self-explanations-how-students"]]},
  {t:"Ehrliche Selbsteinschätzung",d:"Nach jeder Variante sagst du, wie sicher du warst. Geratene Treffer kommen früher wieder, denn wer sich überschätzt, übt zu wenig.",src:[["Dunlosky & Rawson 2012","https://doi.org/10.1016/j.learninstruc.2011.08.003"]]},
  {t:"Pausen und Schlaf",d:"Ein festes Tagespensum statt Marathon: Im Schlaf festigt das Gehirn, was du geübt hast.",src:[["Diekelmann & Born 2010","https://www.nature.com/articles/nrn2762"]]}
];
const LEARN_SUM=["Dunlosky u. a. 2013","https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html"];
function sciHtml(){
  return `<details class="crs-sci"><summary><span class="crs-sci-ic">${crsIcon("cap",18)}</span><span><b>So lernst du hier</b><small>Neun Prinzipien aus der Lernforschung – mit Quellen</small></span></summary>
  <ol>${LEARN_SCI.map(x=>`<li><b>${esc(x.t)}</b><span>${esc(x.d)}</span><small>${x.src.map(s=>`<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join(" · ")}</small></li>`).join("")}</ol>
  <p class="crs-sci-sum">Abrufen und verteiltes Üben gehören laut der großen Übersichtsarbeit von <a href="${LEARN_SUM[1]}" target="_blank" rel="noopener">${esc(LEARN_SUM[0])}</a> zu den wirksamsten Lerntechniken überhaupt.</p></details>`;
}
const PHASE={
  warm:{t:"Aufwärmen",d:"Wir starten mit fälligen Wiederholungen – gemischt aus allen Kapiteln. Abrufen festigt stärker als nochmal Anschauen."},
  new:{t:"Neu",d:"",show:"Neue Variante: Erst zeige ich dir die Züge, dann spielst du sie selbst.",guess:"Neue Variante: Rate jeden Zug zuerst selbst. Liegst du daneben, zeige ich dir die Lösung – auch falsche Versuche helfen beim Merken."},
  mix:{t:"Gemischt",d:"Zwischendurch eine ältere Variante aus einem anderen Kapitel. Das Mischen trainiert, die richtige Variante zu erkennen."},
  retest:{t:"Mit Abstand",d:"Jetzt die neuen Varianten noch einmal – ohne Hilfe und mit etwas Abstand. Genau das macht sie haltbar."},
  relearn:{t:"Nachlernen",d:"Die saß noch nicht. Wir holen sie noch einmal, bis sie einmal fehlerfrei klappt."}
};
const PACES=[2,3,5];
const crsMethod=c=>{const m=crsMeta(c);return m.meth==="show"||m.meth==="guess"?m.meth:(c.lvl==="Stark"||c.lvl==="Für Mutige")?"guess":"show"};
const crsPace=c=>{const p=crsMeta(c).pace;return PACES.indexOf(p)>=0?p:3};
const crsNewToday=c=>{const m=crsMeta(c);return m.day===today()?(m.nw||0):0};
const isFresh=k=>!S.srs[k]&&Pk(k)<2;
/* Für Prüfungen zählen nur Varianten, die an einem früheren Tag geübt wurden – sonst misst die Prüfung nur das Kurzzeitgedächtnis */
const examKeys=x=>x.ix.filter(i=>P(x.id,i)===2).map(i=>lk(x.id,i)).filter(k=>S.srs[k]&&S.srs[k].last&&S.srs[k].last<startOfDay(Date.now()));
/* Eine Lerneinheit zusammenstellen */
function crsUnit(c,extra){
  const all=courseKeys(c);
  const due=shuffle(all.filter(k=>isDue(k))).slice(0,8);
  const left=extra?crsPace(c):Math.max(0,crsPace(c)-crsNewToday(c));
  const nw=all.filter(isFresh).slice(0,Math.min(left,5));
  const nwOps=new Set(nw.map(k=>pk(k)[0]));
  const mix=nw.length?shuffle(all.filter(k=>S.srs[k]&&!isDue(k)&&Pk(k)===2&&!nwOps.has(pk(k)[0]))).slice(0,Math.min(2,nw.length)):[];
  const q=[],roles=[];
  due.forEach(k=>{q.push(k);roles.push("warm")});
  nw.forEach((k,j)=>{q.push(k);roles.push("new");if(mix[j]){q.push(mix[j]);roles.push("mix")}});
  nw.forEach(k=>{q.push(k);roles.push("retest")});
  return {q,roles,due:due.length,nw:nw.length,mix:mix.length};
}
function crsStartUnit(c,extra){
  const u=crsUnit(c,extra);if(!u.q.length){toast("Für heute ist nichts mehr dran – morgen geht es weiter.");return}
  startSession("course",u.q,c.t,{course:c.id,plan:true,roles:u.roles,method:crsMethod(c),rq:{},unit:u});window.scrollTo(0,0);
}
/* Wann ist man mit allen Varianten durch, wenn man täglich übt? */
function crsFinishDate(c){
  const rest=courseKeys(c).filter(isFresh).length;if(!rest)return null;
  const pace=crsPace(c),todayLeft=Math.max(0,pace-crsNewToday(c));
  const days=rest<=todayLeft?0:Math.ceil((rest-todayLeft)/pace);
  return new Date(Date.now()+days*DAY).toLocaleDateString("de-DE",{weekday:"short",day:"numeric",month:"long"});
}
/* Behalten statt nur einmal gekonnt: Abstand der nächsten Wiederholung als Maß */
function crsRetention(c){let fest=0,lang=0;courseKeys(c).forEach(k=>{const s=S.srs[k];if(s&&Pk(k)===2){if(s.iv>=7)fest++;if(s.iv>=21)lang++}});return {fest,lang}}
/* Trainer sagt einen eigenen Text (Phasen, Denkfragen) */
function coachRaw(c,html,mood){if(!c)return;const el=$("trSay");el.hidden=false;el.innerHTML=`<b>${esc(COACHES[coIdOf(c)].n)}:</b> ${html}`;coachPaint(c,mood);crsLast="raw";vcSay(String(html).replace(/<span class="tr-acts">[\s\S]*$/,"").replace(/<[^>]+>/g," "),coIdOf(c))}
const EXPLAIN_Q=["Was ist die Idee hinter dieser Variante? Sag es dir in einem Satz.","Welcher Zug war hier der wichtigste – und warum?","Wohin wollen deine Figuren nach dieser Variante? Erklär es dir kurz selbst."];
function crsAskExplain(i){
  const c=crsSess();if(!c)return;const l=op.lines[i];const plan=(l&&l.p)||(op.plan&&op.plan.length?op.plan[i%op.plan.length]:"");
  coachRaw(c,`Denkfrage: ${esc(EXPLAIN_Q[i%EXPLAIN_Q.length])}<span class="tr-acts">${plan?`<button class="chip" data-trx="plan">Plan zeigen</button>`:""}<button class="chip on" data-trx="go">Jetzt selbst spielen</button></span>`,"neutral");
  const el=$("trSay");
  const go=el.querySelector('[data-trx="go"]');if(go)go.onclick=()=>startLearnTest(i);
  const pb=el.querySelector('[data-trx="plan"]');if(pb)pb.onclick=()=>{const sp=document.createElement("span");sp.className="tr-plan";sp.textContent=plan;pb.replaceWith(sp)};
}
/* Selbsteinschätzung nach einer fehlerfreien Variante: passt den Wiederholungsabstand an */
function crsRate(k,v){
  const s=S.srs[k];
  if(s&&v==="u"){s.iv=Math.max(1,Math.round(s.iv/2));s.due=startOfDay(Date.now())+s.iv*DAY}
  if(s&&v==="g"){s.iv=1;s.reps=Math.max(0,(s.reps||1)-1);s.ef=Math.max(1.3,(s.ef||2.5)-.15);s.due=startOfDay(Date.now())+DAY}
  save("srs");st.cal=st.cal&&typeof st.cal==="object"?st.cal:{s:0,u:0,g:0};st.cal[v]=(st.cal[v]||0)+1;saveStats();
}
function crsRateAsk(c,k){
  const el=$("trSay");if(!c||el.hidden)return;
  const box=document.createElement("span");box.className="tr-acts tr-rate";
  box.innerHTML=`<small>Wie sicher warst du?</small><button class="chip" data-rate="s">Sicher</button><button class="chip" data-rate="u">Unsicher</button><button class="chip" data-rate="g">Geraten</button>`;
  el.appendChild(box);
  box.querySelectorAll("[data-rate]").forEach(b=>b.onclick=()=>{const v=b.dataset.rate;crsRate(k,v);
    box.innerHTML=`<small>${v==="s"?"Gut – die Wiederholung bleibt wie geplant.":v==="u"?"Ehrlich ist gut: Die Variante kommt etwas früher wieder.":"Danke! Geratene Treffer kommen schon morgen wieder."}</small>`;
    cancelAuto();setTimeout(()=>{const nb=$("nextBtn");if(nb&&!nb.hidden&&done)nb.click()},900)});
}
const pickL=(a,i)=>Array.isArray(a)?a[i!=null?Math.min(i,a.length-1):Math.floor(Math.random()*a.length)]:a;
function coachLine(c,key,vars,idx){
  const co=COACHES[coIdOf(c)];const r=crsRank(c);const p=r.p;const th=thOf(c);
  const v=Object.assign({rank:r.name,next:r.next||r.name,left:r.left,leftV:varV(r.left),cl:p.cl,clV:varV(p.cl),open:p.n-p.cl,openV:varV(p.n-p.cl),stop:th.stop,
    progress:r.next?`Noch ${varV(r.left)} bis „${r.next}“.`:"Du hast den höchsten Rang."},vars||{});
  if(v.due!=null)v.dueV=varV(v.due);if(v.weak!=null)v.weakV=varV(v.weak);if(v.n!=null)v.nV=varV(v.n);
  const s=pickL(co.say[key],idx);return s?String(s).replace(/\{(\w+)\}/g,(m,k)=>v[k]!=null?v[k]:""):"";
}
/* Kommentar des Trainers zum Fortschritt auf der Kursseite */
function crsComment(c){
  const r=crsRank(c);const due=crsDue(c).length,weak=crsWeak(c).length;
  if(r.p.cl===0&&!weak)return {t:coachLine(c,"intro")+" "+coachLine(c,"p0"),mood:"happy"};
  if(due)return {t:coachLine(c,"due",{due}),mood:"neutral"};
  if(weak)return {t:coachLine(c,"weak",{weak}),mood:"worry"};
  if(r.f<1&&!crsUnit(c).q.length)return {t:coachLine(c,"rest"),mood:"joy"};
  const k=r.f>=1?"p5":r.f>=.75?"p4":r.f>=.5?"p3":r.f>=.25?"p2":"p1";
  return {t:coachLine(c,k),mood:r.f>=1?"joy":"happy"};
}
const crsTip=c=>{const t=COACHES[coIdOf(c)].say.tips||[];return t.length?t[Math.floor(Date.now()/DAY)%t.length]:""};
const sideTxt=c=>c.side==="w"?"Weiß":c.side==="b"?"Schwarz":"Weiß & Schwarz";

function renderCourses(){
  const v=$("v-courses");if(!v)return;
  if(courseOpen){const c=COURSES.find(x=>x.id===courseOpen);if(c){renderCourse(v,c);return}courseOpen=null}
  if(crsF.st&&!STYLES[crsF.st])crsF.st="";if(crsF.co&&!COACHES[crsF.co])crsF.co="";
  const SF=[["","Alle Stile"]].concat(Object.keys(STYLES).map(k=>[k,STYLES[k].n]));
  const CF=[["","Beide Farben"],["w","Weiß"],["b","Schwarz"]];
  const list=COURSES.filter(c=>(!crsF.st||c.st.indexOf(crsF.st)>=0)&&(!crsF.side||c.side.indexOf(crsF.side)>=0)&&(!crsF.co||coIdOf(c)===crsF.co));
  v.innerHTML=pageHead("Kurse","Such dir einen Kurs, der zu deinem Spielstil passt. Jeder Kurs hat seinen eigenen Trainer und eigene Ränge.","learn","crsmap")+
  crsLineup()+
  `<div class="crs-f"><div class="filters" role="group" aria-label="Spielstil">${SF.map(f=>`<button class="chip${crsF.st===f[0]?" on":""}" data-cst="${f[0]}" aria-pressed="${crsF.st===f[0]}">${f[1]}</button>`).join("")}</div>
  <div class="filters" role="group" aria-label="Farbe">${CF.map(f=>`<button class="chip${crsF.side===f[0]?" on":""}" data-csd="${f[0]}" aria-pressed="${crsF.side===f[0]}">${f[1]}</button>`).join("")}</div>
  ${crsF.st?`<p class="hint crs-sd"><b>${esc(STYLES[crsF.st].n)}:</b> ${esc(STYLES[crsF.st].d)}</p>`:""}</div>`+sciHtml()+
  (list.length?`<div class="crs">${list.map(c=>{const th=thOf(c),co=COACHES[coIdOf(c)],r=crsRank(c);
    return `<button class="crc th-${c.id} co-${coIdOf(c)}" data-crs="${c.id}">
      <span class="crc-band">${sceneImg(c.id)}<span class="crc-veil" aria-hidden="true"></span><span class="crc-id">${rkB(c,r.i,46,"on")}<span><b class="crc-w">${esc(worldOf(c).name)}</b><small>${esc(r.name)} · Rang ${r.i+1} von 6</small></span></span><span class="crc-tr" aria-hidden="true">${coachImg(coIdOf(c),r.f>=1?"joy":"happy")}</span></span>
      <span class="crc-body"><span class="crc-top"><span class="crc-tags"><span class="crc-tag">${esc(c.lvl)}</span>${c.st.map(k=>`<span class="crc-st">${esc(STYLES[k]?STYLES[k].n:k)}</span>`).join("")}</span><span class="crc-side">${sideTxt(c)}</span></span>
      <b>${esc(c.t)}</b><small>${esc(c.d)}</small><span class="crc-co">Trainer: <b>${esc(TRAINER[coIdOf(c)].full)}</b> · ${esc(co.r)}</span>
      <span class="crc-p"><span class="prog"><i style="width:${r.f*100}%"></i></span><small>${r.p.cl}/${r.p.n} Varianten · ${c.ch.length} Kapitel</small></span></span></button>`}).join("")}</div>`
   :`<p class="hint">Für diese Auswahl gibt es noch keinen Kurs. <button class="chip" data-creset>Alle Kurse zeigen</button></p>`);
  const save=()=>{try{localStorage.setItem("et-crsf",JSON.stringify(crsF))}catch(e){}renderCourses()};
  v.querySelectorAll("[data-cst]").forEach(b=>b.onclick=()=>{crsF.st=b.dataset.cst;save()});
  v.querySelectorAll("[data-csd]").forEach(b=>b.onclick=()=>{crsF.side=b.dataset.csd;save()});
  v.querySelectorAll("[data-cco]").forEach(b=>b.onclick=()=>{crsF.co=crsF.co===b.dataset.cco?"":b.dataset.cco;save()});
  const tl=v.querySelector(".trl"),ton=tl&&tl.querySelector(".trl-i.on");if(ton&&tl.scrollWidth>tl.clientWidth)tl.scrollLeft=Math.max(0,ton.offsetLeft-(tl.clientWidth-ton.clientWidth)/2);
  const rs=v.querySelector("[data-creset]");if(rs)rs.onclick=()=>{crsF.st="";crsF.side="";crsF.co="";save()};
  v.querySelectorAll("[data-crs]").forEach(b=>b.onclick=()=>{courseOpen=b.dataset.crs;renderCourses();window.scrollTo(0,0)});
}
function renderCourse(v,c){
  const th=thOf(c),coId=coIdOf(c),co=COACHES[coId];crsMeta(c);
  const r=crsRank(c),p=r.p,chs=crsChapters(c);const open=courseKeys(c).filter(k=>Pk(k)<2);const due=crsDue(c),weak=crsWeak(c);
  const med=chs.reduce((a,x)=>a+(x.med?1:0),0),chDone=chs.filter(x=>x.done).length;const cm=crsComment(c);
  const curCh=chs.findIndex(x=>!x.done);
  const u=crsUnit(c),fresh=courseKeys(c).filter(isFresh).length,pace=crsPace(c),meth=crsMethod(c),fin=crsFinishDate(c),ret=crsRetention(c),nToday=crsNewToday(c);
  const goLbl=p.cl||nToday?"Lerneinheit starten":"Erste Lerneinheit starten";
  const goSub=[u.due?nV(u.due,"Wiederholung","Wiederholungen"):"",u.nw?nV(u.nw,"neue Variante","neue Varianten"):"",u.nw?"Abstandstest":""].filter(Boolean).join(" · ");
  const task=(id,ic,t,s,cls)=>`<button class="crs-task${cls?" "+cls:""}" id="${id}"><span class="crs-task-ic">${ic}</span><span><b>${t}</b><small>${s}</small></span><span class="ci-go">›</span></button>`;
  if(st.crsLast!==c.id){st.crsLast=c.id;saveStats()}
  v.innerHTML=`<button class="back" data-cback>← Alle Kurse</button>
  <section class="crs-hero ${crsCls(c)}">
    <div class="crs-hero-top"><div class="crs-hero-scn" aria-hidden="true">${sceneSvg(c.id)}</div>
      <div class="crs-hero-c"><p class="crs-hero-w">${esc(worldOf(c).name)}</p><h1>${esc(c.t)}</h1><div class="crs-hero-tags"><span>${esc(c.lvl)}</span><span>${esc(crsStyles(c))}</span><span>${sideTxt(c)}</span></div><p>${esc(c.d)}</p></div></div>
    <div class="crs-hero-bar"><div class="crs-rank"><span class="crs-rank-b">${rkB(c,r.i,72,"on")}</span>
      <div class="crs-rank-t"><small>Dein Rang · ${r.i+1} von 6</small><b>${esc(r.name)}</b>${crsLadder(c,r,30)}
      <span class="crs-rank-p">${r.next?`<span class="prog"><i style="width:${r.part*100}%"></i></span><small>Noch ${varV(r.left)} bis „${esc(r.next)}“</small>`:`<small>Höchster Rang erreicht</small>`}</span></div></div>
    <div class="crs-stats"><span title="Mindestens einmal fehlerfrei gespielt"><b>${p.cl}/${p.n}</b>Gelernt</span><span title="Nach mindestens einer Woche Abstand noch gewusst"><b>${ret.fest}</b>Gefestigt</span><span title="Nach mindestens drei Wochen Abstand noch gewusst"><b>${ret.lang}</b>Langzeit</span><span><b>${chDone}/${chs.length}</b>Kapitel</span><span><b>${med}</b>${med===1?"Medaille":"Medaillen"}</span></div></div>
  </section>
  <section class="crs-coach co-${coId} th-${c.id}">
    <button class="crs-coach-art" data-trinfo aria-label="Steckbrief von ${esc(TRAINER[coId].full)} öffnen">${coachSvg(coId,cm.mood,"bust")}</button>
    <div class="crs-coach-b"><small class="crs-coach-k">Dein Trainer</small><div class="crs-coach-n"><b class="wf">${esc(TRAINER[coId].full)}</b><small>${esc(co.r)}</small></div><p class="crs-say">${esc(cm.t)}</p>${crsTip(c)?`<p class="crs-tip"><b>Tipp:</b> ${esc(crsTip(c))}</p>`:""}
      <button class="chip crs-coach-more" data-trinfo>${crsIcon("info",15)} Steckbrief</button></div>
  </section>
  <section class="crs-tasks th-${c.id}"><h3>Aufträge von ${esc(co.n)}</h3><div class="crs-task-grid">
    ${u.q.length?task("crsGo",crsIcon(th.ic,20),goLbl,goSub,"main"):fresh?task("crsRest",crsIcon("moon",20),"Für heute geschafft",`Dein Tagesplan ist erfüllt – morgen ${nV(pace,"neue Variante","neue Varianten")}.`,"main rest"):task("crsMix",crsIcon(th.ic,20),"Gemischt üben","Alles gelernt: acht Varianten aus allen Kapiteln durcheinander","main")}
    ${!u.q.length&&fresh?task("crsExtra",crsIcon("redo",20),"Freiwillig weiterlernen",`${nV(Math.min(pace,fresh),"weitere neue Variante","weitere neue Varianten")} – Pausen helfen aber mehr`):""}
    ${weak.length?task("crsWeak",crsIcon("target",20),"Schwächen ausbügeln",`${varV(weak.length)} mit Fehlern gespielt`):""}
    ${chs.some(x=>examKeys(x).length>=3)?task("crsExam",crsIcon("medal",20),"Kapitelprüfung","Fünf Varianten von früheren Tagen ohne Fehler – für eine Medaille"):""}
    ${chs.some(x=>x.cl>0)?task("crsDuel",crsIcon("swords",20),`Duell gegen ${esc(TRAINER[coId].nick)}`,`Eine gelernte Variante, dann spielt ${esc(TRAINER[coId].nick)} weiter – ein Sieg bringt ein Siegel (${chs.filter(x=>duelOf(c,x.ci)===2).length}/${chs.length})`):""}
    ${r.i>=5?task("crsCert",crsIcon("cap",20),"Deine Urkunde",`Kurs gemeistert – als „${esc(th.rk[5])}“`):""}
  </div></section>
  <section class="crs-plan th-${c.id}"><h3>Dein Lernplan</h3><div class="crs-plan-b">
    <div class="crs-plan-row"><span><b>Neue Varianten pro Tag</b><small>Kleine Portionen behält man besser</small></span><span class="seg">${PACES.map(n=>`<button data-pace="${n}" aria-pressed="${pace===n}">${n}</button>`).join("")}</span></div>
    <div class="crs-plan-row"><span><b>Neues lernen durch</b><small>${meth==="show"?"Erst vorgezeigt, dann selbst gespielt – ideal für Einsteiger":"Erst selbst raten, dann korrigiert – ideal, wenn du schon etwas weißt"}</small></span><span class="seg"><button data-meth="show" aria-pressed="${meth==="show"}">Vorzeigen</button><button data-meth="guess" aria-pressed="${meth==="guess"}">Erst raten</button></span></div>
    <p class="crs-plan-st"><span><b>${nToday}/${pace}</b> neu heute</span><span><b>${crsDue(c).length}</b> fällig</span><span>${fin?`Alles gelernt bis <b>${esc(fin)}</b> bei täglichem Üben`:"Alle Varianten gelernt – Wiederholen hält sie frisch"}</span></p>
  </div>${sciHtml()}</section>
  <section class="crs-map ${crsCls(c)}"><h3>Deine Route</h3>${crsAdv(c,chs,curCh)}</section>
  ${chs.map(x=>{const o=x.o;if(!o)return "";const more=o.lines.length-x.n;
    return `<details class="coll crs-chd th-${c.id}"${x.ci===(curCh<0?-1:curCh)?" open":""}><summary class="coll-h"><span class="coll-ic chn">${x.ci+1}</span><div><h3>${esc(x.t)}</h3><small>${esc(o.name)} · ${x.cl}/${x.n} gelernt${more>0?` · ${more} weitere im Eröffnungstraining`:""}</small></div></summary><div class="coll-items">${x.ix.map(i=>{const l=o.lines[i];const st2=P(x.id,i);const du=isDue(lk(x.id,i));const pr=lineProb(o,i);return `<button class="ci" data-cl="${x.id}#${i}"><span class="ci-ic ${st2===2?"okc":st2===1?"half":""}">${st2===2?ICON.ok.replace('viewBox','width="14" height="14" viewBox'):st2===1?"½":"○"}</span><span class="ci-t"><b>${esc(l.n)}</b><small>${esc(fmtMoves(l.m.slice(0,8)))}${pr!=null?` · ≈ ${fmtPct(pr)}`:""}</small></span>${du?'<span class="ci-m hot">fällig</span>':""}<span class="ci-go">›</span></button>`}).join("")}</div></details>`}).join("")}`;
  v.querySelector("[data-cback]").onclick=()=>{courseOpen=null;renderCourses()};
  crsAdvWatch();if($("crsCert"))$("crsCert").onclick=()=>crsCert(c);
  v.querySelectorAll("[data-trinfo]").forEach(b=>b.onclick=()=>crsTrainerCard(c,false));
  if(!st.metCo||typeof st.metCo!=="object")st.metCo={};
  if(!st.metCo[coId])setTimeout(()=>{if(courseOpen===c.id&&!st.metCo[coId]&&$("v-courses")&&!$("v-courses").hidden){st.metCo[coId]=1;saveStats();crsTrainerCard(c,true)}},380);
  const run=(ks,title,extra)=>{ks=[...new Set(ks)];if(!ks.length){toast("Dafür gibt es gerade keine Varianten.");return}startSession("course",ks,title,Object.assign({course:c.id},extra||{}));window.scrollTo(0,0)};
  if($("crsGo"))$("crsGo").onclick=()=>crsStartUnit(c);
  if($("crsExtra"))$("crsExtra").onclick=()=>crsStartUnit(c,true);
  if($("crsRest"))$("crsRest").onclick=()=>toast("Pause gehört zum Lernen. Morgen wartet die nächste Einheit.");
  if($("crsMix"))$("crsMix").onclick=()=>{const ks=shuffle(courseKeys(c)).slice(0,8);startSession("course",ks,c.t+" · Gemischt",{course:c.id,plan:true,roles:ks.map(()=>"mix"),method:meth,rq:{}});window.scrollTo(0,0)};
  if($("crsWeak"))$("crsWeak").onclick=()=>{const ks=weak.slice(0,8);startSession("course",ks,c.t+" · Schwächen",{course:c.id,plan:true,roles:ks.map(()=>"relearn"),method:meth,rq:{}});window.scrollTo(0,0)};
  v.querySelectorAll("[data-pace]").forEach(b=>b.onclick=()=>{crsMeta(c).pace=+b.dataset.pace;saveStats();renderCourse(v,c)});
  v.querySelectorAll("[data-meth]").forEach(b=>b.onclick=()=>{crsMeta(c).meth=b.dataset.meth;saveStats();renderCourse(v,c)});
  const exam=ci=>{const x=chs[ci];const ks=shuffle(examKeys(x)).slice(0,5);if(ks.length<3){toast("Für die Prüfung brauchst du drei Varianten, die du an früheren Tagen gelernt hast.");return}run(ks,`Prüfung: ${x.t}`,{exam:ci})};
  if($("crsExam"))$("crsExam").onclick=()=>{const best=chs.filter(x=>examKeys(x).length>=3).sort((a,b)=>(a.med-b.med)||(b.cl/b.n-a.cl/a.n))[0];if(best)exam(best.ci)};
  v.querySelectorAll("[data-exam]").forEach(b=>b.onclick=()=>exam(+b.dataset.exam));
  v.querySelectorAll("[data-duel]").forEach(b=>b.onclick=()=>crsDuel(c,+b.dataset.duel));
  if($("crsDuel"))$("crsDuel").onclick=()=>{const cand=chs.filter(x=>x.cl>0);const best=cand.filter(x=>x.ci===curCh&&duelOf(c,x.ci)<2)[0]||cand.sort((a,b)=>duelOf(c,a.ci)-duelOf(c,b.ci)||b.cl-a.cl)[0];if(best)crsDuel(c,best.ci)};
  v.querySelectorAll("[data-cl]").forEach(b=>b.onclick=()=>{const [id,i]=pk(b.dataset.cl);selectOpening(byId(id),i)});
}

/* ---- Der Kurstrainer während des Trainings ---- */
function crsSess(){return sess&&sess.course?COURSES.find(c=>c.id===sess.course)||null:null}
var crsLast="";
function coachPaint(c,mood){
  const co=$("coach"),f=$("face");const id=coIdOf(c);
  co.dataset.co=id;co.style.setProperty("--k1",COACHES[id].bg[0]);co.style.setProperty("--k2",COACHES[id].bg[1]);
  f.innerHTML=coachSvg(id,mood||"neutral");f.style.background="";
}
function coachSay(c,key,vars,mood,idx){
  if(!c)return;const t=coachLine(c,key,vars,idx);if(!t)return;crsLast=key;
  const el=$("trSay");el.hidden=false;el.innerHTML=`<b>${esc(COACHES[coIdOf(c)].n)}:</b> ${esc(t)}`;
  coachPaint(c,mood);const fs=$("face").querySelector("svg");if(fs)fs.classList.add("talk");vcSay(t,coIdOf(c));
}
/* Gesicht im Hinweisfeld außerhalb der Kurse: gegen den Computer der Gegner, sonst Mila als Lehrerin */
function facePaint(id,mood){const co=$("coach"),f=$("face");if(!COACHES[id])return;co.dataset.co=id;co.style.setProperty("--k1",COACHES[id].bg[0]);co.style.setProperty("--k2",COACHES[id].bg[1]);
  f.innerHTML=coachSvg(id,mood||"neutral");f.style.background="";const sv=f.querySelector("svg");if(sv&&!calmNow())sv.classList.add("talk")}
function coachClear(){const co=$("coach");if(co.dataset.co){delete co.dataset.co;co.style.removeProperty("--k1");co.style.removeProperty("--k2")}$("trSay").hidden=true;crsLast=""}
function crsOnItem(){
  const c=crsSess();if(!c||mode!=="train"||!op||target==null)return;const l=op.lines[target];
  if(sess.plan){const ro=sess.roles[sess.idx],prev=sess.idx>0?sess.roles[sess.idx-1]:null;const ph=PHASE[ro]||PHASE.warm;
    const pd=ro==="new"?ph[sess.method]||ph.show:ph.d;
    if(!sess.greeted){sess.greeted=true;const u=sess.unit||{};
      const plan=[u.due?nV(u.due,"Wiederholung","Wiederholungen"):"",u.nw?nV(u.nw,"neue Variante","neue Varianten"):"",u.nw?"zum Schluss ein Abstandstest":""].filter(Boolean).join(", ");
      coachRaw(c,`Heute: ${esc(plan)}. ${esc(pd)}`,"happy");return}
    if(ro!==prev){coachRaw(c,`<span class="tr-ph">${esc(ph.t)}</span> ${esc(pd)}`,"neutral");return}
    coachSay(c,"line",{line:l?l.n:""},"neutral");return}
  if(!sess.greeted){sess.greeted=true;coachSay(c,sess.exam!=null?"line":"start",{n:sess.queue.length,line:l?l.n:""},"happy");if(sess.exam!=null)$("trSay").innerHTML=`<b>${esc(COACHES[coIdOf(c)].n)}:</b> Prüfung! Spiel ${varV(sess.queue.length)} ohne Fehler und ohne Hilfe.`;return}
  coachSay(c,"line",{line:l?l.n:""},"neutral");
}
function crsOnMove(ok){
  const c=crsSess();if(!c)return;
  if(!ok){coachSay(c,"bad",{},"worry");return}
  if(crsLast==="raw")return;
  if(crsLast==="bad"||Math.random()<(learn?.15:.3))coachSay(c,"good",{},"happy");
}
function crsOnFinish(clean,learned,k){
  const c=crsSess();if(!c)return;
  if(learned){coachSay(c,"learned",{},"happy");return}
  const m=crsMeta(c),r=crsRank(c);const chs=crsChapters(c);const ci=chs.findIndex(x=>x.id===op.id);
  if(sess.plan&&sess.roles[sess.idx]==="new"){if(m.day!==today()){m.day=today();m.nw=0}m.nw=(m.nw||0)+1;saveStats()}
  const ask=()=>{if(sess&&sess.plan&&clean&&k)crsRateAsk(c,k)};
  if(r.i>m.r){m.r=r.i;if(r.i>=5&&!m.fin)m.fin=Date.now();saveStats();wlog("rank",`Neuer Rang „${r.name}“ ${inWorld(worldOf(c).name)}`);coachSay(c,"rank",{},"joy");ask();
    setTimeout(()=>{cancelAuto();crsCelebrate(c,r.i>=5?"done":"rank")},420);return}
  if(ci>=0&&chs[ci].done&&m.ch.indexOf(ci)<0){m.ch.push(ci);saveStats();coachSay(c,"chapter",{ch:chs[ci].t},"joy");ask();return}
  coachSay(c,clean?"clean":"dirty",{},clean?"joy":"worry");ask();
}
function crsOnEnd(c,s,ok,n){
  if(!c)return;
  if(s.exam!=null){const q=n?ok/n:0;const md=q>=1?3:q>=.8?2:q>=.6?1:0;const m=crsMeta(c);const old=m.med[s.exam]||0;
    if(md>old){m.med[s.exam]=md;saveStats()}
    coachSay(c,"exam",{medal:MEDAL[md]},md?"joy":"worry",md?0:1);if(md>old)toast(`Medaille: ${MEDAL[md]} für „${c.ch[s.exam][1]}“`);setTimeout(()=>crsReport(c,s,ok,n),700);return}
  coachSay(c,"end",{ok,n},ok===n?"joy":ok/n>=.6?"happy":"worry",ok===n?0:ok/n>=.6?1:2);
  setTimeout(()=>crsReport(c,s,ok,n),700);
}

/* ===== Kurswelten: Abenteuerkarte, Rangabzeichen, Feiern, Einheitsbericht und Urkunde (Grafiken in worlds.js) ===== */
const worldOf=c=>WORLD[c.id]||WORLD.w_start;
const COACH_FEM=new Set(["mila","greta","nova","ilka","rika"]);
const crsCls=c=>`th-${c.id} co-${coIdOf(c)}`;
const rkB=(c,i,s,state)=>rankBadge(thOf(c).ic,i,s,state);
/* Rangleiter aus sechs Abzeichen: erreichte farbig, kommende blass */
function crsLadder(c,r,s){
  return `<div class="crs-ladder" role="img" aria-label="Rang ${r.i+1} von 6: ${esc(r.name)}">${thOf(c).rk.map((n,j)=>`<span class="lad ${j<r.i?"on":j===r.i?"cur":"off"}" title="${esc(n)}">${rkB(c,j,s||30,j<=r.i?"on":"off")}</span>`).join("")}</div>`;
}
/* Abenteuerkarte: Start, Kapitel als Stationen auf einem gewundenen Weg, Ziel mit dem höchsten Rang. Der Trainer wartet an der aktuellen Station. */
function crsAdv(c,chs,curCh){
  const th=thOf(c),w=worldOf(c),coId=coIdOf(c),co=COACHES[coId],fin=curCh<0,deco=w.deco&&w.deco.length?w.deco:["star"];
  const started=chs.some(x=>x.cl>0);
  const ring=f=>`<svg class="adv-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" pathLength="100" stroke-dasharray="${(f*100).toFixed(1)} 100"/></svg>`;
  const av=m=>`<span class="adv-av" title="${esc(co.n)}">${coachSvg(coId,m)}</span>`;
  let h=`<div class="adv-row s0 start"><span class="adv-node">${crsIcon("flag",22)}</span><div class="adv-card"><small>Start</small><b class="wf">${esc(w.name)}</b><small>${started?"Hier hat deine Reise begonnen.":`${esc(co.n)} begleitet dich durch ${nV(chs.length,"Kapitel","Kapitel")}.`}</small></div></div>`;
  const nick=TRAINER[coId].nick;
  chs.forEach((x,j)=>{const f=x.n?x.cl/x.n:0,cur=x.ci===curCh,stt=x.done?"done":cur?"cur":x.cl?"run":"lock",ex=examKeys(x).length>=3,pg=duelOf(c,x.ci),du=x.cl>0;
    h+=`<div class="adv-row s${(j+1)%2} ${stt}"${cur?' aria-current="step"':""}>
      <span class="adv-node">${x.done?crsIcon(th.ic,24):`<b>${x.ci+1}</b>`}${!x.done&&x.cl?ring(f):""}${cur?av("happy"):""}</span>
      <div class="adv-card"><small>${esc(th.stop)} ${x.ci+1}${x.done?" · geschafft":cur?" · du bist hier":""}</small><b>${esc(x.t)}</b><small>${esc(x.o?x.o.name:x.id)} · ${x.cl}/${x.n} gelernt</small><span class="prog"><i style="width:${f*100}%"></i></span>${x.med||ex||du||pg?`<div class="crs-stn-a">${x.med?`<span class="medal m${x.med}" title="Medaille aus der Kapitelprüfung">${MEDAL[x.med]}</span>`:""}${pg?`<span class="seal s${pg}" title="${pg===2?`Duell gegen ${esc(nick)} gewonnen`:`Remis im Duell gegen ${esc(nick)}`}">${crsIcon("swords",13)}${pg===2?"Siegel":"Halbes Siegel"}</span>`:""}${ex?`<button class="chip" data-exam="${x.ci}">${x.med?"Prüfung wiederholen":"Kapitelprüfung"}</button>`:""}${du&&pg<2?`<button class="chip duel" data-duel="${x.ci}">${crsIcon("swords",14)}Duell gegen ${esc(nick)}</button>`:""}</div>`:""}</div>
      <span class="adv-deco" aria-hidden="true">${decoIcon(deco[j%deco.length],36)}</span></div>`});
  h+=`<div class="adv-row s${(chs.length+1)%2} goal${fin?" done":""}"><span class="adv-node">${rkB(c,5,72,fin?"on":"off")}${fin?av("joy"):""}</span><div class="adv-card"><small>Ziel</small><b class="wf">${esc(w.goal)}</b><small>${fin?`Geschafft – du bist „${esc(th.rk[5])}“!`:`Wer alle Kapitel meistert, wird „${esc(th.rk[5])}“.`}</small></div></div>`;
  return `<div class="adv" id="crsAdv"><svg class="adv-path" aria-hidden="true"></svg>${h}</div>`;
}
/* Den Weg zwischen den Stationen zeichnen – nach dem Layout gemessen, damit er bei jeder Breite passt */
let advRO=null;
function crsAdvDraw(){
  const root=$("crsAdv");if(!root)return;const svg=root.querySelector(".adv-path"),B=root.getBoundingClientRect();if(!svg||!B.width)return;
  const rows=[...root.querySelectorAll(".adv-row")];
  const P=rows.map(r=>{const b=r.querySelector(".adv-node").getBoundingClientRect();return [b.left-B.left+b.width/2,b.top-B.top+b.height/2]});
  let cut=rows.findIndex(r=>r.classList.contains("cur"));if(cut<0)cut=rows[rows.length-1].classList.contains("done")?rows.length-1:0;
  let walk="",rest="";const f=n=>n.toFixed(1);
  for(let i=0;i<P.length-1;i++){const [ax,ay]=P[i],[bx,by]=P[i+1],d=(by-ay)*.6;
    const seg=`M${f(ax)} ${f(ay)}C${f(ax)} ${f(ay+d)} ${f(bx)} ${f(by-d)} ${f(bx)} ${f(by)}`;if(i<cut)walk+=seg;else rest+=seg}
  svg.setAttribute("viewBox",`0 0 ${Math.round(B.width)} ${Math.round(B.height)}`);
  svg.innerHTML=`<path class="adv-bed" d="${walk+rest}"/>${rest?`<path class="adv-rest" d="${rest}"/>`:""}${walk?`<path class="adv-walk" d="${walk}"/>`:""}`;
}
function crsAdvWatch(){if(advRO){advRO.disconnect();advRO=null}if(!$("crsAdv"))return;crsAdvDraw();if(window.ResizeObserver){advRO=new ResizeObserver(()=>crsAdvDraw());advRO.observe($("crsAdv"))}}

/* Overlays nacheinander zeigen, damit sich Rangaufstieg, Bericht und Urkunde nicht überdecken */
let crsOv=null,crsOvBack=null;const crsOvQ=[];
function crsOverlay(build){
  if(crsOv){crsOvQ.push(build);return}
  const el=build();if(!el)return;if(!crsOvBack)crsOvBack=document.activeElement;crsOv=el;document.body.appendChild(el);document.body.classList.add("ov-open");
  el.addEventListener("keydown",e=>{e.stopPropagation();if(e.key==="Escape"){e.preventDefault();crsOvClose()}
    if(e.key==="Tab"){const fs=[...el.querySelectorAll("button,a[href]")].filter(b=>!b.disabled);if(!fs.length)return;const a=fs[0],z=fs[fs.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
  const f=el.querySelector("[data-focus]")||el.querySelector("button");if(f)setTimeout(()=>{try{f.focus({preventScroll:true})}catch(e){}},40);
}
function crsOvClose(){
  const el=crsOv;if(!el)return;crsOv=null;el.classList.add("out");
  setTimeout(()=>{el.remove();if(!crsOv){document.body.classList.remove("ov-open");const n=crsOvQ.shift();if(n)crsOverlay(n);
    else{const b=crsOvBack;crsOvBack=null;if(b&&b.isConnected&&b.focus)try{b.focus({preventScroll:true})}catch(e){}}}},calmNow()?0:220);
}
/* Feier beim Rangaufstieg und beim Abschluss des Kurses */
function crsCelebrate(c,kind){
  crsOverlay(()=>{
    const th=thOf(c),w=worldOf(c),coId=coIdOf(c),co=COACHES[coId],r=crsRank(c),fin=kind==="done";
    const el=document.createElement("div");el.className=`lvlup ${crsCls(c)}`;el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","lvlupT");
    el.innerHTML=`<div class="lvlup-bg" aria-hidden="true">${sceneSvg(c.id)}</div><div class="lvlup-in">
      <div class="lvlup-badge"><span class="lvlup-rays" aria-hidden="true"></span>${rkB(c,r.i,152,"on")}</div>
      <small class="lvlup-k">${fin?"Kurs gemeistert":`Neuer Rang · ${r.i+1} von 6`}</small>
      <h2 class="wf" id="lvlupT">${esc(r.name)}</h2>
      <p class="lvlup-s">${fin?`Alle ${varV(r.p.n)} aus „${esc(c.t)}“ gelernt.`:`${esc(w.name)}${r.next?` · als Nächstes: „${esc(r.next)}“`:""}`}</p>
      <div class="lvlup-co"><span class="lvlup-tr">${coachSvg(coId,"joy","bust")}</span><p><b>${esc(co.n)}</b>${esc(coachLine(c,fin?"p5":"rank"))}</p></div>
      <div class="lvlup-acts">${fin?`<button class="btn" data-lv="cert">Urkunde ansehen</button>`:""}<button class="btn lvlup-go" data-lv="ok" data-focus>Weiter</button></div></div>`;
    el.querySelector('[data-lv="ok"]').onclick=crsOvClose;
    const ce=el.querySelector('[data-lv="cert"]');if(ce)ce.onclick=()=>{crsOvClose();crsCert(c)};
    el.addEventListener("click",e=>{if(e.target===el)crsOvClose()});
    setTimeout(()=>{confetti([th.c1,th.c2,"#F6C453","#FFFFFF"]);sfx("badge")},260);
    return el});
}
/* Bericht nach einer Lerneinheit – mit dem Namen der Kurswelt (Kaperbericht, Messprotokoll …) */
const rptRing=f=>{const r=34,C=2*Math.PI*r;return `<svg class="rpt-ring" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="${r}" class="bg"/><circle cx="42" cy="42" r="${r}" class="fg" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-f)).toFixed(1)}" transform="rotate(-90 42 42)"/><text x="42" y="48" text-anchor="middle">${Math.round(f*100)}%</text></svg>`};
function crsReport(c,s,ok,n){
  if(!c||!n)return;
  crsOverlay(()=>{
    const w=worldOf(c),coId=coIdOf(c),co=COACHES[coId],r=crsRank(c),q=ok/n,exam=s.exam!=null;
    const md=exam?(q>=1?3:q>=.8?2:q>=.6?1:0):0;
    const head=exam?(md?`Medaille: ${MEDAL[md]}`:"Diesmal keine Medaille"):q>=1?"Makellos!":q>=.6?"Gut gemacht!":"Dranbleiben!";
    const ph=s.plan&&s.roles?["warm","new","mix","retest","relearn"].map(ro=>{const rs=s.res.filter(x=>s.roles[x.i]===ro);return rs.length?`<li><span>${esc(PHASE[ro].t)}</span><b>${rs.filter(x=>x.clean).length}/${rs.length}</b></li>`:""}).join(""):"";
    const line=exam?coachLine(c,"exam",{medal:MEDAL[md]},md?0:1):coachLine(c,"end",{ok,n},ok===n?0:q>=.6?1:2);
    const date=new Date().toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"});
    const el=document.createElement("div");el.className="rpt-bk";
    el.innerHTML=`<div class="rpt ${crsCls(c)}" role="dialog" aria-modal="true" aria-labelledby="rptT">
      <div class="rpt-h">${sceneSvg(c.id)}<span class="rpt-tr" aria-hidden="true">${coachSvg(coId,q>=1?"joy":q>=.6?"happy":"worry","bust")}</span><div class="rpt-ht"><small>${esc(w.log)} · ${esc(date)}</small><h2 class="wf" id="rptT">${esc(head)}</h2></div>${exam&&md?`<span class="rpt-md m${md}" aria-hidden="true">${crsIcon("medal",26)}</span>`:""}</div>
      <div class="rpt-b">
        <div class="rpt-top">${rptRing(q)}<div class="rpt-n"><b>${ok} von ${n}</b><span>${exam?"Prüfungsvarianten":"Varianten"} fehlerfrei</span>${ph?`<ul class="rpt-ph">${ph}</ul>`:""}</div></div>
        <div class="rpt-rank">${rkB(c,r.i,50,"on")}<div><small>Rang ${r.i+1} von 6</small><b class="wf">${esc(r.name)}</b><span class="prog"><i style="width:${(r.next?r.part:1)*100}%"></i></span><small>${r.next?`Noch ${varV(r.left)} bis „${esc(r.next)}“`:"Höchster Rang erreicht"}</small></div></div>
        <div class="rpt-co"><p><b>${esc(co.n)}</b>${esc(line)}</p></div>
        <div class="rpt-acts"><button class="btn" data-rp="x">Schließen</button><button class="btn grn" data-rp="go" data-focus>Zur Kursseite</button></div>
      </div></div>`;
    el.querySelector('[data-rp="x"]').onclick=crsOvClose;
    el.querySelector('[data-rp="go"]').onclick=()=>{crsOvClose();courseOpen=c.id;showView("courses")};
    el.addEventListener("click",e=>{if(e.target===el)crsOvClose()});
    return el});
}
/* Urkunde: auf der Seite als SVG, zum Speichern als PNG. Texte stehen als Liste, damit Bildschirm und Export dieselben Angaben nutzen. */
function crsCertData(c){
  const th=thOf(c),w=worldOf(c),wf=WFONT[th.co]||WFONT.mila,co=COACHES[coIdOf(c)],r=crsRank(c),chs=crsChapters(c),m=crsMeta(c);
  const med=chs.reduce((a,x)=>a+(x.med?1:0),0),gold=chs.filter(x=>x.med===3).length;
  const nm=(ON.profile&&ON.profile.name)||"",when=new Date(m.fin||Date.now());
  const date=when.toLocaleDateString("de-DE",{day:"numeric",month:"long",year:"numeric"});
  const ink="#2B2321",soft="#6B6152";
  const T=[
    {x:400,y:236,t:"Urkunde",f:wf.f,s:Math.round(56*wf.s),c:th.c1,ls:wf.ls==="0"?0:2},
    {x:400,y:266,t:"Diese Urkunde erhält",f:"Rubik",s:13,w:700,c:soft,ls:2,up:1},
    {x:400,y:312,t:nm||"ein echtes Schachtalent",f:"ZZ Caveat",s:nm?46:38,c:ink},
    {x:400,y:342,t:"für den erfolgreichen Abschluss des Kurses",f:"Rubik",s:15,w:500,c:soft},
    {x:400,y:372,t:`„${c.t}“`,f:"Rubik",s:c.t.length>40?17:20,w:750,c:ink},
    {x:400,y:404,t:`Rang: ${th.rk[5]}`,f:wf.f,s:Math.round(24*wf.s),c:th.c1,ls:wf.ls==="0"?0:1},
    {x:400,y:430,t:`${r.p.n} Varianten · ${chs.length} Kapitel · ${med} ${med===1?"Medaille":"Medaillen"}${gold?` (${gold} × Gold)`:""}`,f:"Rubik",s:13,w:600,c:soft},
    {x:150,y:468,t:date,f:"Rubik",s:16,w:650,c:ink},
    {x:150,y:496,t:"Datum",f:"Rubik",s:11,w:700,c:soft,ls:1.5,up:1},
    {x:650,y:466,t:co.n,f:"ZZ Caveat",s:32,c:ink},
    {x:650,y:496,t:COACH_FEM.has(coIdOf(c))?"Trainerin":"Trainer",f:"Rubik",s:11,w:700,c:soft,ls:1.5,up:1}
  ];
  return {th,w,T};
}
function crsCertSvg(c,exp){
  const {th,T}=crsCertData(c);
  const corner=(x,y,sx,sy)=>`<path d="M${x} ${y+sy*44}V${y}H${x+sx*44}" fill="none" stroke="${th.c1}" stroke-width="4" stroke-linecap="round"/><path d="M${x+sx*10} ${y+sy*10}l${sx*8} ${sy*-6} ${sx*8} ${sy*6} ${sx*-8} ${sy*6}z" fill="${th.c2}"/>`;
  const txt=exp?"":T.map(o=>`<text x="${o.x}" y="${o.y}" text-anchor="middle" font-family="${o.f}, Georgia, serif" font-size="${o.s}" ${o.w?`font-weight="${o.w}"`:""} fill="${o.c}"${o.ls?` letter-spacing="${o.ls}"`:""}>${esc(o.up?o.t.toUpperCase():o.t)}</text>`).join("");
  const badge=rankBadge(th.ic,5,84,"on").replace(/var\(--c1\)/g,th.c1).replace(/var\(--c2\)/g,th.c2).replace(/^<svg class="[^"]*"/,`<svg x="358" y="446"`);
  const scene=SCENES[c.id]?SCENES[c.id]():"";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" class="cert-svg" role="img" aria-label="Urkunde für den Kurs ${esc(c.t)}">
  <defs><style>${exp?exp:""}${SCN_CSS.replace(/(^|\})\./g,"$1.zc .")}</style><clipPath id="zzcClip"><circle cx="400" cy="112" r="70"/></clipPath><linearGradient id="zzcGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${th.c1}"/><stop offset="1" stop-color="${th.c2}"/></linearGradient></defs>
  <rect width="800" height="560" fill="#FBF6EA"/>
  <rect x="16" y="16" width="768" height="528" rx="12" fill="none" stroke="${th.c1}" stroke-width="2.5"/>
  <rect x="28" y="28" width="744" height="504" rx="6" fill="none" stroke="${th.c2}" stroke-width="1.2" stroke-dasharray="1 6" stroke-linecap="round"/>
  ${corner(40,40,1,1)}${corner(760,40,-1,1)}${corner(40,520,1,-1)}${corner(760,520,-1,-1)}
  <circle cx="400" cy="112" r="80" fill="none" stroke="${th.c1}" stroke-width="1.5" opacity=".35"/>
  <g clip-path="url(#zzcClip)"><rect x="330" y="42" width="140" height="140" fill="url(#zzcGrad)"/><svg x="253" y="42" width="224" height="140" viewBox="0 0 320 200" class="zc">${scene}</svg></g>
  <circle cx="400" cy="112" r="70" fill="none" stroke="#fff" stroke-width="4"/><circle cx="400" cy="112" r="73.5" fill="none" stroke="${th.c1}" stroke-width="2"/>
  <path d="M232 262h-64M568 262h64" stroke="${th.c2}" stroke-width="1.4" opacity=".75"/>
  <path d="M70 478H230M570 478H730" stroke="#B9AE9A" stroke-width="1.2"/>
  ${badge}${txt}</svg>`;
}
const crsFontUrl=f=>f==="Rubik"?"lib/fonts/rubik-latin-wght.woff2":"lib/fonts/"+(WFONT_FILE[f]||"caveat-bold")+".woff2";
async function crsCertPng(c){
  const {T}=crsCertData(c);const fams=[...new Set(T.map(o=>o.f).concat(["ZZ Caveat"]))];
  const b64=async u=>{const r=await fetch(u);const a=new Uint8Array(await r.arrayBuffer());let s="";for(let i=0;i<a.length;i+=0x8000)s+=String.fromCharCode.apply(null,a.subarray(i,i+0x8000));return btoa(s)};
  let ff="";try{ff=(await Promise.all(["ZZ Caveat","ZZ Fell"].map(async f=>`@font-face{font-family:'${f}';src:url(data:font/woff2;base64,${await b64(crsFontUrl(f))}) format('woff2')}`))).join("")}catch(e){}
  await Promise.all(fams.map(f=>document.fonts&&document.fonts.load(`40px "${f}"`).catch(()=>null)));
  const url=URL.createObjectURL(new Blob([crsCertSvg(c,ff||" ")],{type:"image/svg+xml"}));
  const img=new Image();await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});
  const K=2,cv=document.createElement("canvas");cv.width=800*K;cv.height=560*K;const x=cv.getContext("2d");
  await new Promise(r=>setTimeout(r,60));x.drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(url);
  x.scale(K,K);x.textAlign="center";x.textBaseline="alphabetic";
  T.forEach(o=>{x.font=`${o.w||400} ${o.s}px "${o.f}", Georgia, serif`;x.fillStyle=o.c;const t=o.up?o.t.toUpperCase():o.t;
    if(o.ls&&"letterSpacing" in x){x.letterSpacing=o.ls+"px";x.fillText(t,o.x+o.ls/2,o.y);x.letterSpacing="0px"}else x.fillText(t,o.x,o.y)});
  const blob=await new Promise(r=>cv.toBlob(r,"image/png"));if(!blob)throw new Error("png");
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`Urkunde-${c.id}.png`;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
}
function crsCert(c){
  crsOverlay(()=>{
    const el=document.createElement("div");el.className="rpt-bk";
    el.innerHTML=`<div class="cert-box ${crsCls(c)}" role="dialog" aria-modal="true" aria-label="Urkunde">${crsCertSvg(c)}
      <div class="rpt-acts"><button class="btn" data-ce="x">Schließen</button><button class="btn grn" data-ce="png" data-focus>Als Bild speichern</button></div></div>`;
    el.querySelector('[data-ce="x"]').onclick=crsOvClose;
    const sb=el.querySelector('[data-ce="png"]');
    sb.onclick=async()=>{sb.disabled=true;sb.textContent="Wird erstellt …";try{await crsCertPng(c);sb.textContent="Gespeichert"}catch(e){sb.textContent="Als Bild speichern";toast("Das Bild konnte nicht erstellt werden.")}sb.disabled=false};
    el.addEventListener("click",e=>{if(e.target===el)crsOvClose()});
    return el});
}
/* Grafiken in Listen als Bild statt als SVG-Baum: viel weniger DOM-Knoten, schnelleres Umschalten der Seiten.
   Große Ansichten (Kopfbereiche, Feiern) bleiben echtes SVG, damit sie sich bewegen können. */
const _svgUrls=new Map();
function svgUrl(key,build){let u=_svgUrls.get(key);if(!u){const src=build();try{u=URL.createObjectURL(new Blob([src],{type:"image/svg+xml"}))}catch(e){u="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(src)}_svgUrls.set(key,u)}return u}
const sceneUrl=id=>svgUrl("s:"+id,()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><style>${SCN_CSS}</style>${(SCENES[id]||SCENES.w_start)()}</svg>`);
const coachUrl=(id,mood)=>svgUrl("c:"+id+":"+mood,()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">${(TR_ART[id]||TR_ART.mila)(mood,true)}</svg>`);
const sceneImg=id=>`<img class="scn" src="${sceneUrl(id)}" alt="" decoding="async" draggable="false">`;
const coachImg=(id,mood)=>`<img class="tr" src="${coachUrl(id,mood)}" alt="" decoding="async" draggable="false">`;
/* In ruhigen Momenten vorbereiten, damit Kursliste und Gegnerwahl sofort stehen */
function warmArt(){
  const jobs=COURSES.map(c=>()=>sceneUrl(c.id)).concat(Object.keys(COACHES).flatMap(id=>["neutral","happy"].map(m=>()=>coachUrl(id,m))));
  const ric=window.requestIdleCallback||(f=>setTimeout(()=>f({timeRemaining:()=>10}),120));
  const step=d=>{while(jobs.length&&d.timeRemaining()>5){try{const im=new Image();im.src=jobs.shift()();if(im.decode)im.decode().catch(()=>{})}catch(e){}}if(jobs.length)ric(step)};
  ric(step);
}
/* Begrüßung auf der Startseite – im Ton des Trainers */
const HOME_HI={mila:"Schön, dass du da bist!",bruno:"Servus, auf geht's!",greta:"Willkommen in der Festung.",konrad:"Moin, Matrose!",linus:"Da bist du ja!",rex:"Bereit für Action?",nova:"Systeme online!",ilka:"Heute brodelt's!",rika:"Ahoi!"};
/* Trainer-Aufstellung über der Kursliste: antippen filtert die Kurse dieses Trainers */
function crsLineup(){
  const ids=Object.keys(COACHES);
  return `<section class="trl-w"><h3>Deine Trainer</h3><div class="trl" role="group" aria-label="Kurse nach Trainer filtern">${ids.map(id=>{const n=COURSES.filter(c=>coIdOf(c)===id).length,on=crsF.co===id;
    return `<button class="trl-i co-${id}${on?" on":""}" data-cco="${id}" aria-pressed="${on}" title="${esc(TRAINER[id].full)} – ${esc(COACHES[id].r)}"><span class="trl-art">${coachImg(id,on?"joy":"neutral")}</span><b>${esc(TRAINER[id].nick)}</b><small>${nV(n,"Kurs","Kurse")}</small></button>`}).join("")}</div></section>`;
}
/* Steckbrief: der Trainer stellt sich vor – mit Motto, Charakterwerten und Markenzeichen */
function crsTrainerCard(c,first){
  crsOverlay(()=>{
    const coId=coIdOf(c),co=COACHES[coId],tr=TRAINER[coId];
    const el=document.createElement("div");el.className=`lvlup trv ${crsCls(c)}`;el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","trvT");
    el.innerHTML=`<div class="lvlup-bg" aria-hidden="true">${sceneSvg(c.id)}</div><div class="trv-in">
      <div class="trv-art"><span class="trv-glow" aria-hidden="true"></span>${coachSvg(coId,"happy","bust")}</div>
      <div class="trv-b">
        <small class="lvlup-k">${first?"Darf ich vorstellen?":"Steckbrief"}</small>
        <h2 class="wf" id="trvT">${esc(tr.full)}</h2>
        <p class="trv-t">${esc(tr.title)} · ${esc(worldOf(c).name)}</p>
        <p class="trv-m">„${esc(tr.motto)}“</p>
        <div class="trv-stats">${tr.stats.map((x,i)=>`<div class="trv-s"><span>${esc(x[0])}</span><i style="--v:${x[1]/10};--d:${(.25+i*.12).toFixed(2)}s"><b></b></i><em>${x[1]}</em></div>`).join("")}</div>
        <dl class="trv-f">${tr.facts.map(f=>`<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join("")}${tr.buddy?`<div><dt>Begleiter</dt><dd>${esc(tr.buddy)}</dd></div>`:""}</dl>
        ${first?`<p class="trv-say">${esc(co.say.intro)}</p>`:""}
        <div class="lvlup-acts"><button class="btn lvlup-go" data-tv="ok" data-focus>${first?"Los geht's!":"Schließen"}</button></div>
      </div></div>`;
    el.querySelector('[data-tv="ok"]').onclick=crsOvClose;
    el.addEventListener("click",e=>{if(e.target===el)crsOvClose()});
    return el});
}
/* Kachel auf der Startseite: der zuletzt geöffnete Kurs */
function crsHomeTile(c){
  const w=worldOf(c),r=crsRank(c),u=crsUnit(c);
  const todo=u.q.length?"Heute: "+[u.due?nV(u.due,"Wiederholung","Wiederholungen"):"",u.nw?nV(u.nw,"neue Variante","neue Varianten"):""].filter(Boolean).join(" · "):r.f>=1?"Kurs gemeistert – wiederholen hält ihn frisch":"Für heute geschafft – morgen geht's weiter";
  return `<button class="hcrs ${crsCls(c)}" data-act="course:${c.id}">${sceneSvg(c.id)}<span class="hcrs-tr" aria-hidden="true">${coachSvg(coIdOf(c),"happy","bust")}</span><span class="hcrs-b"><small>Dein Kurs</small><b class="hcrs-w">${esc(w.name)}</b><span class="hcrs-t">${esc(c.t)}</span>
    <span class="hcrs-r">${rkB(c,r.i,34,"on")}<span><b>${esc(r.name)}</b><small>${r.p.cl}/${r.p.n} Varianten · Rang ${r.i+1} von 6</small></span></span>
    <span class="hcrs-go">${esc(todo)}<span aria-hidden="true">›</span></span></span></button>`;
}

/* ---- Repertoire-Baum: eigene Varianten ansehen, abzweigen, löschen ---- */
/* Deine Notizen: alle Merkzettel mit Stellung, Zugfolge und Sprung aufs Brett */
function renderMemos(){
  const v=$("v-memos");if(!v)return;
  const list=Object.entries(S.memo).map(([k,m])=>Object.assign({k},m)).sort((a,b)=>(b.d||0)-(a.d||0));
  v.innerHTML=`<button class="back" data-back>← Training</button>`+pageHead("Deine Notizen","Merkzettel zu Stellungen – sie tauchen im Training und in der Analyse wieder auf.","pin","memo")+
    (list.length?`<div class="memo-list">${list.map(m=>{const seq=m.h?m.h.split(" "):[];const o=m.o?byId(m.o):null;const trainable=o&&seq.length&&consistentIn(o,seq).length&&new Chess(m.f).turn()===o.side;
      return `<article class="card memo-card" data-k="${esc(m.k)}"><div class="memo-mb" data-bd></div><div class="memo-cc"><div class="memo-meta">${o?`<b>${esc(o.name)}</b>`:m.n?`<b>${esc(m.n)}</b>`:""}<small>${seq.length?esc(fmtMoves(seq,0)):"Ausgangsstellung"}</small></div>
        <p class="memo-t">${esc(m.t)}</p><small class="sub">${m.d?new Date(m.d).toLocaleDateString("de-DE",{day:"numeric",month:"long",year:"numeric"}):""}</small>
        <div class="btnrow">${trainable?`<button class="btn grn" data-mtr>Hier üben</button>`:""}<button class="btn" data-mana>Am Brett öffnen</button><button class="btn" data-med>Bearbeiten</button></div></div></article>`}).join("")}</div>`
    :emptyState("edit","Noch keine Notizen","Im Training oder auf dem Analysebrett: Menü ⋯ unter dem Brett → „Notiz zu dieser Stellung“. Die Notiz erscheint, sobald die Stellung wieder auftaucht."));
  wireBack(v);
  v.querySelectorAll(".memo-card").forEach(c=>{const m=S.memo[c.dataset.k];if(!m)return;const seq=m.h?m.h.split(" "):[];
    let last=null;if(seq.length){const g=new Chess();seq.forEach(x=>{const r=findMove(g,x);if(r)last=g.move(r.san)})}
    c.querySelector("[data-bd]").appendChild(staticBoard(m.f,m.s||"w",last));
    c.querySelector("[data-mana]").onclick=()=>{if(seq.length)openAnaBoard(null,seq,seq.length);else openAnaBoard(m.f,[],0)};
    c.querySelector("[data-med]").onclick=()=>memoEditStored(c.dataset.k);
    const tr=c.querySelector("[data-mtr]");if(tr)tr.onclick=()=>startPosition(byId(m.o),seq,{title:"Deine Notiz",sub:m.t})});
}
function memoEditStored(key){
  const m=S.memo[key];if(!m)return;
  const ov=document.createElement("div");ov.className="onb";
  ov.innerHTML=`<div class="onb-box memo-dlg" role="dialog" aria-modal="true" aria-label="Notiz bearbeiten"><h2>Notiz bearbeiten</h2><p class="hint">${m.h?esc(fmtMoves(m.h.split(" "),0)):"Ausgangsstellung"}</p>
    <label class="fld">Notiz<textarea id="memoTxt" maxlength="280" rows="3">${esc(m.t)}</textarea></label><small class="memo-cnt" id="memoCnt"></small>
    <div class="btnrow onb-act"><button class="btn red" data-del>Löschen</button><button class="btn" data-x>Abbrechen</button><button class="btn grn" data-ok>Speichern</button></div></div>`;
  document.body.appendChild(ov);const ta=ov.querySelector("#memoTxt"),cnt=ov.querySelector("#memoCnt");const upd=()=>{cnt.textContent=ta.value.length+" / 280"};upd();ta.oninput=upd;setTimeout(()=>ta.focus(),60);
  const close=()=>{ov.remove();document.removeEventListener("keydown",k_)};const k_=e=>{if(e.key==="Escape")close()};document.addEventListener("keydown",k_);
  ov.onclick=e=>{if(e.target===ov)close()};ov.querySelector("[data-x]").onclick=close;
  ov.querySelector("[data-ok]").onclick=()=>{const t=ta.value.trim().slice(0,280);if(t){m.t=t;m.d=Date.now()}else delete S.memo[key];save("memo");close();renderMemos();toast(t?"Notiz geändert":"Notiz gelöscht")};
  ov.querySelector("[data-del]").onclick=()=>{delete S.memo[key];save("memo");close();renderMemos();toast("Notiz gelöscht")};
}
function renderRepEdit(){
  const v=$("v-repedit");if(!v)return;const groups=ALL.filter(o=>o.g==="c");
  const tree=o=>{const root={k:{},end:[]};o.lines.forEach(l=>{let n=root;l.m.forEach(m=>{n=n.k[m]||(n.k[m]={k:{},end:[]})});n.end.push(l)});
    const walk=(n,path)=>{let html="";const keys=Object.keys(n.k);
      keys.forEach(m=>{let node=n.k[m];const seq=[m];let p=path.concat(m);
        while(Object.keys(node.k).length===1&&!node.end.length){const nm=Object.keys(node.k)[0];seq.push(nm);p=p.concat(nm);node=node.k[nm]}
        const label=fmtMoves(seq,p.length-seq.length);
        html+=`<li><div class="rt-row"><span class="rt-mv">${esc(label)}</span>${node.end.map(l=>`<span class="rt-end">${esc(l.n)}<button class="rt-del" data-del="${o.side}|${l.ci}" title="Variante löschen" aria-label="Variante ${esc(l.n)} löschen">✕</button></span>`).join("")}<button class="rt-add" data-br="${esc(o.id)}|${esc(p.join(" "))}" title="Hier abzweigen" aria-label="Hier eine neue Variante abzweigen">+</button></div>${Object.keys(node.k).length?`<ul>${walk(node,p)}</ul>`:""}</li>`});
      return html};
    return `<ul class="rtree">${walk(root,[])}</ul>`};
  v.innerHTML=`<button class="back" data-back>← Training</button>`+pageHead("Eigene Varianten","Dein Repertoire als Baum: Mit + zweigst du an jeder Stelle eine neue Variante ab, mit ✕ löschst du eine.","edit","open")+
  (groups.length?groups.map(o=>`<section class="card"><div class="rt-h"><div><h3 style="margin:0">${esc(o.grp)}</h3><small class="sub">${o.side==="w"?"Weiß":"Schwarz"} · ${o.lines.length} Varianten</small></div><span class="btnrow"><button class="btn" data-trn="${esc(o.id)}">Trainieren</button><button class="btn" data-br="${esc(o.id)}|">Neue Variante</button></span></div>${tree(o)}</section>`).join(""):emptyState("edit","Noch keine eigenen Varianten","Spiel eine Zugfolge im Editor ein oder importiere eine PGN-Datei.",`<span class="btnrow" style="justify-content:center"><button class="btn grn" id="reNew">Eigene Variante</button><button class="btn" id="reImp">Importieren</button></span>`));
  wireBack(v);
  if($("reNew"))$("reNew").onclick=()=>openEditor();if($("reImp"))$("reImp").onclick=()=>showView("import");
  v.querySelectorAll("[data-trn]").forEach(b=>b.onclick=()=>selectOpening(byId(b.dataset.trn)));
  v.querySelectorAll("[data-br]").forEach(b=>b.onclick=()=>{const [id,pre]=b.dataset.br.split("|");const o=byId(id);if(!o)return;openEditor({side:o.side,group:o.grp,pre:pre?pre.split(" "):[]})});
  v.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{if(!b.dataset.sure){b.dataset.sure="1";b.textContent="Löschen?";b.classList.add("sure");setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent="✕";b.classList.remove("sure")}},2500);return}
    const [side,ci]=b.dataset.del.split("|");S.custom[side].splice(+ci,1);save("custom");buildAll();renderList();toast("Variante gelöscht");renderRepEdit()});
}

/* ---- Koordinaten-Trainer ---- */
const CO=Object.assign({mode:"find",side:"w",best:{find:0,name:0}},store.get("et-coord",{}));fixT(CO,{mode:"find",side:"w",best:{find:0,name:0}});
let coRun=null,coTapFn=null;
function renderCoords(){
  const v=$("v-coords");if(!v)return;
  v.innerHTML=`<button class="back" data-back>← Training</button>`+pageHead("Koordinaten","Finde Felder blitzschnell – das hilft beim Lesen von Notation und beim Blind-Training.","target","coord")+
  `<div class="co-wrap"><div class="co-left"><div class="co-board" id="coBoard"></div><div class="co-big" id="coBig" hidden></div></div>
  <div class="card co-side"><div class="setrow"><span><b>Aufgabe</b></span><span class="seg">${[["find","Feld finden"],["name","Feld benennen"]].map(m=>`<button data-com="${m[0]}" aria-pressed="${CO.mode===m[0]}">${m[1]}</button>`).join("")}</span></div>
  <div class="setrow"><span><b>Brett von</b></span><span class="seg">${[["w","Weiß"],["b","Schwarz"]].map(m=>`<button data-cos="${m[0]}" aria-pressed="${CO.side===m[0]}">${m[1]}</button>`).join("")}</span></div>
  <div class="co-stat"><div><small>Zeit</small><b id="coTime">0:30</b></div><div><small>Punkte</small><b id="coPts">0</b></div><div><small>Rekord</small><b>${CO.best[CO.mode]}</b></div></div>
  <div class="co-opts" id="coOpts" hidden></div>
  <button class="big" id="coGo" style="margin:12px 0 0;width:100%">Start (30 Sekunden)</button></div></div>`;
  wireBack(v);
  const draw=hl=>{const el=$("coBoard");let h="";for(let y=0;y<8;y++)for(let x=0;x<8;x++){const f=CO.side==="b"?7-x:x,r=CO.side==="b"?y:7-y;const n="abcdefgh"[f]+(r+1);h+=`<button class="co-sq ${(x+y)%2?"d":"l"}${hl===n?" hl":""}" data-sq="${n}" aria-label="Feld"></button>`}el.innerHTML=h;el.querySelectorAll("[data-sq]").forEach(b=>b.onclick=()=>coTap(b.dataset.sq))};
  draw(null);
  v.querySelectorAll("[data-com]").forEach(b=>b.onclick=()=>{if(coRun)return;CO.mode=b.dataset.com;store.set("et-coord",CO);renderCoords()});
  v.querySelectorAll("[data-cos]").forEach(b=>b.onclick=()=>{if(coRun)return;CO.side=b.dataset.cos;store.set("et-coord",CO);renderCoords()});
  const rndSq=()=>"abcdefgh"[Math.random()*8|0]+(1+(Math.random()*8|0));
  const next=()=>{const r=coRun;let t;do{t=rndSq()}while(t===r.t);r.t=t;
    if(CO.mode==="find"){$("coBig").hidden=false;$("coBig").textContent=t;draw(null)}
    else{draw(t);const o=new Set([t]);while(o.size<4)o.add(rndSq());const arr=shuffle([...o]);$("coOpts").hidden=false;$("coOpts").innerHTML=arr.map(s=>`<button class="btn" data-coa="${s}">${s}</button>`).join("");$("coOpts").querySelectorAll("[data-coa]").forEach(b=>b.onclick=()=>coTap(b.dataset.coa))}};
  const end=()=>{const r=coRun;coRun=null;clearInterval(r.iv);gain("coord",{pts:r.pts});const best=r.pts>CO.best[CO.mode];if(best){CO.best[CO.mode]=r.pts;store.set("et-coord",CO)}
    $("coBig").hidden=false;$("coBig").textContent=r.pts+" ✓";$("coOpts").hidden=true;$("coGo").disabled=false;$("coGo").textContent="Nochmal";toast(best?`Neuer Rekord: ${r.pts} Felder!`:`${r.pts} Felder · Rekord ${CO.best[CO.mode]}`);if(best&&r.pts>=10)confetti();sfx(best?"badge":"done")};
  coTapFn=sq=>{const r=coRun;if(!r)return;const ok=sq===r.t;const el=$("coBoard").querySelector(`[data-sq="${CO.mode==="find"?sq:r.t}"]`);
    if(ok){r.pts++;$("coPts").textContent=r.pts;sfx("move")}else{r.miss++;sfx("wrong");if(CO.mode==="find"){const right=$("coBoard").querySelector(`[data-sq="${r.t}"]`);if(right){right.classList.add("hint");setTimeout(()=>right.classList.remove("hint"),400)}}}
    if(el){el.classList.add(ok?"ok":"no");setTimeout(()=>el.classList.remove("ok","no"),300)}next()};
  $("coGo").onclick=()=>{if(coRun)return;coRun={pts:0,miss:0,t:null,end:Date.now()+30000};$("coPts").textContent="0";$("coGo").disabled=true;$("coGo").textContent="Läuft …";next();
    coRun.iv=setInterval(()=>{const r=coRun;if(!r)return;if(curView!=="coords"){clearInterval(r.iv);coRun=null;return}const left=Math.max(0,r.end-Date.now());$("coTime").textContent="0:"+String(Math.ceil(left/1000)).padStart(2,"0");if(left<=0)end()},200)};
}
function coTap(sq){if(coTapFn)coTapFn(sq)}

/* ---- Finde den Meisterzug ---- */
let guess=null;
const GUESSB=store.get("et-guess",{});
function renderGuessPick(){
  const v=$("v-guess");if(!v)return;
  v.innerHTML=`<button class="back" data-back>← Training</button>`+pageHead("Finde den Meisterzug","Spiel eine berühmte Partie aus Sicht einer Seite nach und rate jeden Zug. Der Meisterzug bringt 5 Punkte, ein fast gleich guter Zug laut Stockfish 1–3 Punkte.","games","games")+
  `<div class="grid3">${GAMES.map(g=>{const pl=g.players.split(" – ");return `<div class="gcard"><h4>${esc(g.title)}</h4><div class="sub">${esc(g.players)} · ${esc(g.year)}</div><p>${esc(g.d)}</p><div class="btnrow">${["w","b"].map(s=>{const bs=GUESSB[g.id+s];return `<button class="btn${s==="w"?" grn":""}" data-gs="${g.id}|${s}">Als ${esc(pl[s==="w"?0:1]||(s==="w"?"Weiß":"Schwarz"))}${bs?` · ${bs} %`:""}</button>`}).join("")}</div></div>`}).join("")}</div>`;
  wireBack(v);
  v.querySelectorAll("[data-gs]").forEach(b=>b.onclick=()=>{const [id,s]=b.dataset.gs.split("|");startGuess(GAMES.find(g=>g.id===id),s)});
}
function startGuess(gm,side){
  if(!gm)return;stopEngine();sess=null;drill=null;puz=null;game=null;flipped=false;forced=null;
  const pl=gm.players.split(" – ");
  op={id:"__guess",guessName:pl[side==="w"?1:0]||"Gegner",g:"c",side,name:"Meisterzug: "+gm.title,eco:"Meisterzug raten",d:`${gm.players}, ${gm.year}. Du spielst ${side==="w"?"Weiß":"Schwarz"} (${pl[side==="w"?0:1]||""}).`,plan:[],lines:[]};
  resetBoard();mode="guess";guess={gm,moves:gm.moves.split(" "),side,pts:0,max:0,n:0,exact:0,last:""};
  showView("train");buildSquares();renderChrome();render();guessAdvance(true);
}
function guessAdvance(first){
  if(mode!=="guess"||!guess)return;const G=guess;let last=null;
  while(hist.length<G.moves.length&&new Chess(fens[hist.length]).turn()!==G.side){const g=new Chess(fens[hist.length]);const mv=findMove(g,G.moves[hist.length]);if(!mv){G.moves.length=hist.length;break}last=commit(mv,"g")}
  view=hist.length;shown=new Chess(fens[view]);badge=null;render(last&&!first?{fwd:last}:null);if(last&&!first)playSound(last);renderChrome();
  if(hist.length>=G.moves.length){guessEnd();return}
  setStatus("turn",`Zug ${Math.floor(hist.length/2)+1}: Was hat ${G.side==="w"?"Weiß":"Schwarz"} gespielt?`,`${G.last?G.last+" · ":""}${G.pts} von ${G.max} Punkten`);
}
async function guessMove(mv,animate){
  const G=guess;if(!G||busy)return;const k=hist.length;const g0=new Chess(fens[k]);const real=findMove(g0,G.moves[k]);if(!real){guessEnd();return}
  const exact=strip(mv.san)===strip(real.san);busy=true;sel=null;
  let pts=exact?5:0;
  if(!exact){const a=new Chess(fens[k]);a.move(mv.san);
    if(a.in_checkmate())pts=5;
    else{setStatus("view","Stockfish vergleicht …",`Dein Zug: ${de(mv.san)}`,true);
      try{const b2=new Chess(fens[k]);b2.move(real.san);const ea=await evalFen(a.fen()),eb=await evalFen(b2.fen());const sg=G.side==="w"?1:-1;const diff=(eb-ea)*sg;pts=diff<=25?3:diff<=70?1:0}catch(e){}}}
  if(mode!=="guess"||guess!==G){busy=false;return}
  G.pts+=pts;G.max+=5;G.n++;if(exact)G.exact++;
  const r=commit(real,"u");view=hist.length;shown=new Chess(fens[view]);badge={ply:view,sq:r.to,type:exact||pts>=3?"ok":"no"};render(animate?{fwd:r}:null);playSound(r);
  G.last=exact?`${de(real.san)} – genau der Meisterzug, +5`:`Gespielt wurde ${de(real.san)}. Dein Zug ${de(mv.san)}: ${pts?"+"+pts:"0 Punkte"}`;
  setStatus(exact?"good":pts?"view":"bad",exact?`${de(real.san)} – genau der Meisterzug!`:`Gespielt wurde ${de(real.san)}`,exact?"+5 Punkte":pts?`Dein Zug ${de(mv.san)} ist laut Stockfish fast so gut: +${pts}`:`Dein Zug ${de(mv.san)} war schwächer. ${explain(fens[k],real,k?mvs[k-1]:null).text}`,true);
  if(exact)sfx("done");else if(!pts)sfx("wrong");
  setTimeout(()=>{busy=false;if(mode==="guess"&&guess===G)guessAdvance()},exact?900:1900);
}
function guessEnd(){
  const G=guess;if(!G)return;done=true;const p=G.max?Math.round(G.pts/G.max*100):0;const key=G.gm.id+G.side;const best=p>(GUESSB[key]||0);if(best){GUESSB[key]=p;store.set("et-guess",GUESSB)}
  st.games[G.gm.id]=true;saveStats();gain("guess",{p});
  setStatus("done",`Partie zu Ende: ${G.pts} von ${G.max} Punkten (${p} %)`,`${G.exact} von ${G.n} Zügen genau wie der Meister.${best?" Neuer Rekord!":""}`,true);
  if(p>=70)confetti();sfx("done");render();renderChrome();
}

/* ---- Bot-Stile: aus den besten Stockfish-Linien einen passenden Zug wählen ---- */
const BOTSTYLES=[["bal","Ausgewogen","Spielt einfach gute Züge."],["att","Angreifer","Sucht Schachs, Schläge und Angriffe auf den König."],["def","Verteidiger","Spielt ruhig, tauscht gern und vermeidet Risiko."]];
function botPick(fen,r){
  const st0=op&&op.botStyle;if(!st0||st0==="bal"||!r.lines||r.lines.length<2)return r.best;
  const g=new Chess(fen);const turn=g.turn();const top=cpOf(r.lines[0].score,turn)*(turn==="w"?1:-1);
  const margin=40+(20-S.set.sf)*6;const ek=(()=>{const b=g.board();for(let y=0;y<8;y++)for(let x=0;x<8;x++){const p=b[y][x];if(p&&p.type==="k"&&p.color!==turn)return [x,y]}return [4,0]})();
  let best=r.best,bs=-1e9;
  r.lines.forEach(l=>{const u=l.pv&&l.pv[0];if(!u)return;const v=cpOf(l.score,turn)*(turn==="w"?1:-1);if(top-v>margin)return;
    const mv=g.moves({verbose:true}).find(m=>m.from+m.to+(m.promotion||"")===u||(m.from+m.to===u.slice(0,4)&&!u[4]));if(!mv)return;
    const t=new Chess(fen);t.move(mv.san);const fx=mv.to.charCodeAt(0)-97,fy=8-+mv.to[1];const dist=Math.max(Math.abs(fx-ek[0]),Math.abs(fy-ek[1]));
    const adv=turn==="w"?(+mv.to[1]-+mv.from[1]):(+mv.from[1]-+mv.to[1]);
    let sc=0;if(st0==="att"){sc+=(t.in_check()?3:0)+(mv.captured?2:0)+(adv>0?1:0)+(dist<=2?1.5:0)}else{sc+=(mv.captured&&mv.piece!=="p"?1.5:0)+(adv<=0?1:0)+(t.in_check()?-1:0)+(mv.flags.indexOf("k")>=0||mv.flags.indexOf("q")>=0?2:0)}
    sc+=-(top-v)/60;if(sc>bs){bs=sc;best=u}});
  return best;
}

/* ================= Phase 3: Avatare, Profile, Nachrichten, Zurücknahme, Vorzüge, Schnellsuche, Fernschach, Turniere, Neuigkeiten ================= */

/* ---- Avatare (nur feste Auswahl, damit fremde Daten nichts einschleusen können) ---- */
const AV_ICONS=["♞","♝","♜","♛","♚","♟","♘","♗","♖","♕","♔","♙"];
const AV_COLS=["#8B6CF6","#E5484D","#81B64C","#3E8ED0","#E6912C","#26A69A","#D6409F","#5C5A57"];
const avOk=av=>av&&AV_ICONS.indexOf(av.i)>=0&&AV_COLS.indexOf(av.c)>=0;
function avSt(av){return avOk(av)?` style="background:${av.c}"`:""}
function avTxt(name,av){return avOk(av)?av.i+"\uFE0E":esc(String(name||"?")[0].toUpperCase())}
function avPicker(cur){cur=avOk(cur)?cur:{i:"",c:""};
  return `<div class="avp"><div class="avp-row">${AV_ICONS.map(i=>`<button class="avb" data-avi="${i}" aria-pressed="${cur.i===i}">${i}\uFE0E</button>`).join("")}</div><div class="avp-row">${AV_COLS.map(c=>`<button class="avc" data-avc="${c}" aria-pressed="${cur.c===c}" style="--c:${c}" aria-label="Farbe"></button>`).join("")}</div></div>`}
function wireAvPicker(root){
  const cur=Object.assign({i:AV_ICONS[0],c:AV_COLS[0]},avOk(ON.profile&&ON.profile.av)?ON.profile.av:{});
  const save=()=>{NET.set("users/"+ON.user.uid,{av:{i:cur.i,c:cur.c}},true).then(()=>toast("Avatar gespeichert")).catch(e=>toast(netErr(e)))};
  root.querySelectorAll("[data-avi]").forEach(b=>b.onclick=()=>{cur.i=b.dataset.avi;save()});
  root.querySelectorAll("[data-avc]").forEach(b=>b.onclick=()=>{cur.c=b.dataset.avc;save()});
}

/* ---- Spielerprofil ---- */
let playerUid=null;
async function renderPlayer(){
  const v=$("v-player");if(!v)return;const uid=playerUid;
  if(!ON.user){v.innerHTML=emptyState("profile","Melde dich an","Spielerprofile siehst du mit einem Konto.",`<button class="btn grn" data-go="online:account">Anmelden</button>`);v.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showView(b.dataset.go));return}
  let u=(SOC.users||[]).find(x=>x.id===uid);
  if(!u){v.innerHTML=`<div class="card">${SKEL}</div>`;try{const d=await NET.get("users/"+uid);if(playerUid!==uid)return;if(!d){v.innerHTML=emptyState("profile","Spieler nicht gefunden","");return}u=Object.assign({id:uid},d)}catch(e){v.innerHTML=`<div class="err">${esc(netErr(e))}</div>`;return}}
  const me=ON.user.uid;const isMe=uid===me;const fr=((ON.profile&&ON.profile.friends)||[]).some(f=>f.uid===uid);
  const n=userGames(u);const lg=liveGameOf(uid);
  const mine=(ON.games||[]).filter(g=>(g.players||[]).indexOf(uid)>=0&&g.status==="over"&&g.result&&g.result!=="-");
  const h2h={w:0,d:0,l:0};mine.forEach(g=>{const c=myColorIn(g);if(g.result==="1/2-1/2")h2h.d++;else if((g.result==="1-0")===(c==="w"))h2h.w++;else h2h.l++});
  const pub=u.pub&&!u.pub.hide?u.pub:null;
  v.innerHTML=`<div class="pl-h"><span class="onav pl-av"${avSt(u.av)}>${avTxt(u.name,u.av)}${isOnlineAt(u.lastSeen)?'<i class="odot"></i>':""}</span><div><h2>${esc(u.name||"Spieler")}${isMe?" (du)":""}</h2><small>${isOnlineAt(u.lastSeen)?"online":"zuletzt "+relTime(u.lastSeen)}${u.created?" · dabei seit "+fmtDate(u.created):""}${lg?' · <span class="abadge grn">spielt gerade</span>':""}</small></div></div>
  <div class="kpis">${[["Wertung",n?(u.elo||1200):"–",n?nP(n):"noch keine Partie"],["Bilanz",`${u.w||0}/${u.d||0}/${u.l||0}`,"Siege/Remis/Niederlagen"],["Taktik",pub&&pub.tacR||"–",pub?`${pub.tacN||0} Aufgaben`:"verborgen"],["Varianten",pub?pub.clean||0:"–",pub?`Serie ${pub.streak||0}`:"verborgen"]].map(t=>`<div class="kpi"><small>${t[0]}</small><b>${esc(String(t[1]))}</b><span>${esc(t[2])}</span></div>`).join("")}</div>
  ${u.eloHist&&u.eloHist.length>1?`<div class="card"><h3>Wertungsverlauf</h3>${sparkHtml(u.eloHist.map(x=>x.r))}</div>`:""}
  ${!isMe&&mine.length?`<div class="card"><h3>Gegen dich</h3><p class="hint" style="margin:0 0 8px">${mine.length} ${mine.length===1?"Partie":"Partien"}: ${h2h.w} Siege, ${h2h.d} Remis, ${h2h.l} Niederlagen</p>${mine.slice(0,6).map(g=>`<div class="onrow"><button class="onopen" data-og="${esc(g.id)}"><span class="kchip ${myColorIn(g)||"w"}"></span><span class="onn"><b>${esc(resTxt(g,myColorIn(g)))}</b><small>${tcTxt(g.tc)} · ${esc(g.reason||"")} · ${fmtDate(g.updated||g.created)}</small></span></button></div>`).join("")}</div>`:""}
  ${isMe?`<div class="card"><h3>Dein Avatar</h3>${avPicker(u.av)}</div>`:`<div class="btnrow">${lg?`<button class="btn grn" data-watch="${esc(lg.id)}">Zuschauen</button>`:""}<button class="btn grn" data-chal="${esc(uid)}">Herausfordern</button>${fr?"":`<button class="btn" data-freq="${esc(uid)}">Als Freund hinzufügen</button>`}</div>`}`;
  v.querySelectorAll("[data-og]").forEach(b=>b.onclick=()=>openOnlineGame(b.dataset.og));
  v.querySelectorAll("[data-watch]").forEach(b=>b.onclick=()=>openOnlineGame(b.dataset.watch));
  const ch=v.querySelector("[data-chal]");if(ch)ch.onclick=()=>createGame({uid,name:u.name});
  const fq=v.querySelector("[data-freq]");if(fq)fq.onclick=()=>sendFriendReq(uid,u.name);
  if(isMe)wireAvPicker(v);
}

/* ---- Schnellnachrichten (nur vorgegebene Sätze – keine Moderation nötig) ---- */
const QUICK=["Viel Glück!","Viel Spaß!","Guter Zug!","Hoppla!","Danke für die Partie!","Gut gespielt!","Revanche?","Bin gleich zurück"];
let qLast=0,qOpen=false;
async function sendQuick(k){
  if(!ON.gid||ON.spect||srvNow()-qLast<2500)return;qLast=srvNow();const me=ON.user.uid;
  try{await NET.tx("games/"+ON.gid,d=>d?{chat:(d.chat||[]).concat({u:me,k,at:srvNow()}).slice(-20),updated:srvNow()}:null)}catch(e){toast(netErr(e))}
}
function renderQChat(){
  const el=$("qChat");if(!el)return;const g=ON.g;
  if(mode!=="online"||!g||g.status==="waiting"){el.hidden=true;return}el.hidden=false;
  const me=ON.user&&ON.user.uid;const msgs=(g.chat||[]).filter(m=>QUICK[m.k]).slice(-4);
  el.innerHTML=`<div class="qc-row"><div class="qc-log">${msgs.length?msgs.map(m=>`<span class="qc-m${m.u===me?" me":""}"><b>${esc(m.u===me?"Du":(g.names&&g.names[m.u])||"Gegner")}:</b> ${esc(QUICK[m.k])}</span>`).join(""):'<span class="qc-e">Noch keine Nachrichten</span>'}</div>${ON.spect?"":`<button class="chip qc-tg${qOpen?" on":""}" id="qcTg" aria-expanded="${qOpen}">Nachricht</button>`}</div>${ON.spect||!qOpen?"":`<div class="qc-btns">${QUICK.map((t,i)=>`<button class="chip" data-qk="${i}">${esc(t)}</button>`).join("")}</div>`}`;
  el.querySelectorAll("[data-qk]").forEach(b=>b.onclick=()=>{qOpen=false;sendQuick(+b.dataset.qk);renderQChat()});
  const tg=$("qcTg");if(tg)tg.onclick=()=>{qOpen=!qOpen;renderQChat()};
  const lg=el.querySelector(".qc-log");if(lg)lg.scrollLeft=lg.scrollWidth;
}

/* ---- Zug zurücknehmen (Gegner muss zustimmen) ---- */
function canAskTakeback(g){if(!g||g.status!=="active"||ON.spect)return false;const n=(g.moves||[]).length;if(!playedN(g)||g.takeback)return false;return (n%2===1?"w":"b")===ON.color}
function onTakebackAsk(){const me=ON.user.uid;gameAct(d=>d&&d.status==="active"&&!d.takeback&&playedN(d)?{takeback:{by:me,n:d.moves.length},updated:srvNow()}:null).then(ok=>{if(ok)toast("Zurücknahme angefragt")})}
function onTakebackAnswer(acc){const me=ON.user.uid;const now=srvNow();
  gameAct(d=>{if(!d||d.status!=="active"||!d.takeback||d.takeback.by===me)return null;if(!acc||(d.moves||[]).length!==d.takeback.n)return {takeback:null,updated:now};
    if(d.takeback.n-1<(d.pre||0))return {takeback:null,updated:now};const mv=d.moves.slice(0,d.takeback.n-1);const c=new Chess();mv.forEach(m=>c.move(m));return {moves:mv,fen:c.fen(),takeback:null,drawOffer:null,lastAt:now,updated:now}})}

/* ---- Vorzüge (Premoves): Zug vormerken, während der Gegner nachdenkt ---- */
function onCanPremove(){const g=ON.g;return S.set.premove!==false&&!!g&&g.status==="active"&&!ON.spect&&live()&&shown.turn()!==ON.color&&!!ON.color}
function premoveCands(from,to){const f=shown.fen().split(" ");f[1]=ON.color;f[3]="-";let c;try{c=new Chess(f.join(" "))}catch(e){return []}
  return c.moves({verbose:true}).filter(m=>m.from===from&&m.to===to)}
function setPremove(from,to){const c=premoveCands(from,to);if(!c.length)return false;ON.pre={from,to,promotion:c.some(m=>m.promotion)?"q":undefined};sel=null;render();toast("Vorzug gemerkt – tippe aufs Brett zum Löschen");return true}
function runPremove(){const p=ON.pre;if(!p||!onCanMove())return;ON.pre=null;const g=new Chess(fens[hist.length]);const mv=g.moves({verbose:true}).find(m=>m.from===p.from&&m.to===p.to&&(!m.promotion||m.promotion===(p.promotion||"q")));renderMarks();if(mv)setTimeout(()=>{if(onCanMove())onlineMove(mv,true)},60)}

/* ---- Fernschach: Tage pro Zug ---- */
const DAY_MS=86400000;
function corrLeft(g){if(!g||!g.tc||!g.tc.d||g.status!=="active"||playedN(g)<2)return null;return (g.lastAt||srvNow())+g.tc.d*DAY_MS-srvNow()}
const fmtDays=ms=>{if(ms==null)return "";ms=Math.max(0,ms);const h=Math.floor(ms/3600000);return h>=48?Math.floor(h/24)+" Tage":h>=1?h+" Std":Math.ceil(ms/60000)+" Min"};

/* ---- Schnellsuche: gleich starke Gegner mit derselben Bedenkzeit ---- */
const MM={on:false,t0:0,iv:null,unsub:null,tc:null,busy:false,beat:0};
async function mmStart(){
  if(!ON.profile){toast("Lege zuerst deinen Benutzernamen fest.");return}if(ON.profile.banned){toast("Dein Konto ist gesperrt.");return}
  if(MM.on)return;const me=ON.user.uid;MM.on=true;MM.t0=srvNow();MM.tc=ON.tc;MM.beat=0;
  try{await NET.set("queue/"+me,{uid:me,name:myName(),elo:ON.profile.elo||1200,tc:MM.tc,at:srvNow(),gid:null})}catch(e){MM.on=false;toast(netErr(e));return}
  MM.unsub=NET.watch("queue/"+me,d=>{if(MM.on&&d&&d.gid)mmMatched(d.gid,true)});
  MM.iv=setInterval(mmTick,2500);mmTick();if(curView==="online")renderOnline();
}
function mmStop(keepDoc){if(MM.iv)clearInterval(MM.iv);MM.iv=null;if(MM.unsub){MM.unsub();MM.unsub=null}const was=MM.on;MM.on=false;if(was&&!keepDoc&&ON.user)NET.del("queue/"+ON.user.uid).catch(()=>{});if(curView==="online")renderOnline()}
async function mmTick(){
  if(!MM.on||MM.busy||!ON.user)return;const me=ON.user.uid,now=srvNow();MM.busy=true;
  try{
    if(++MM.beat%4===0)await NET.set("queue/"+me,{at:now},true);
    if(curView==="online"){const t=$("mmTime");if(t)t.textContent=Math.floor((now-MM.t0)/1000)+" s"}
    const list=await NET.query("queue","tc","==",MM.tc);if(!MM.on)return;
    const my=ON.profile.elo||1200;
    const cand=list.filter(x=>x.uid&&x.uid!==me&&!x.gid&&now-(x.at||0)<20000&&x.uid>me).sort((a,b)=>Math.abs((a.elo||1200)-my)-Math.abs((b.elo||1200)-my)||(a.at||0)-(b.at||0));
    for(const x of cand){
      const d=newGameDoc(parseTc(MM.tc),"r",{uid:x.uid,name:x.name||"Gegner"});d.mm=true;d.elo={[me]:my,[x.uid]:x.elo||1200};
      const id=await NET.add("games",d);
      const ok=await NET.tx("queue/"+x.uid,q=>q&&!q.gid&&q.tc===MM.tc?{gid:id,by:me}:null).catch(()=>false);
      if(ok){mmMatched(id,false);return}
      NET.set("games/"+id,{status:"cancelled",updated:srvNow()},true).catch(()=>{});
    }
  }catch(e){}finally{MM.busy=false}
}
async function mmMatched(id,join){
  if(!MM.on)return;mmStop();toast("Gegner gefunden!");sfx("badge");
  if(join){try{await joinGame(id)}catch(e){}}
  openOnlineGame(id);
}

/* ---- Turniere unter Freunden (jeder gegen jeden) ---- */
const TOUR={list:[],sub:null,open:null,games:{}};
function tourWatch(){if(TOUR.sub||!ON.user||!NET)return;TOUR.sub=NET.watchQ("tournaments","players","array-contains",ON.user.uid,l=>{if(!l)return;TOUR.list=l.sort((a,b)=>(b.created||0)-(a.created||0));if(curView==="tours")renderTours()})}
function tourStop(){if(TOUR.sub){TOUR.sub();TOUR.sub=null}TOUR.list=[]}
function tourStand(t){const S0={};(t.players||[]).forEach(u=>S0[u]={u,p:0,n:0,w:0});
  (t.pairs||[]).forEach(p=>{const g=p.gid&&(TOUR.games[p.gid]||(ON.games||[]).find(x=>x.id===p.gid));if(!g||g.status!=="over"||!g.result||g.result==="-")return;
    const wU=g.white,bU=g.black;if(!S0[wU]||!S0[bU])return;S0[wU].n++;S0[bU].n++;if(g.result==="1-0"){S0[wU].p+=1;S0[wU].w++}else if(g.result==="0-1"){S0[bU].p+=1;S0[bU].w++}else{S0[wU].p+=.5;S0[bU].p+=.5}});
  return Object.values(S0).sort((a,b)=>b.p-a.p||b.w-a.w)}
function renderTours(){
  const v=$("v-tours");if(!v)return;
  if(!ON.user||!ON.profile){v.innerHTML=pageHead("Turniere","Jeder gegen jeden mit deinen Freunden.","swords","tour")+emptyState("online","Melde dich an","Turniere spielst du mit einem Konto und Freunden.",`<button class="btn grn" data-go="online:account">Anmelden</button>`);v.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showView(b.dataset.go));return}
  tourWatch();const me=ON.user.uid;
  if(TOUR.open){const t=TOUR.list.find(x=>x.id===TOUR.open);if(t){renderTour(v,t);return}TOUR.open=null}
  const fr=(ON.profile.friends||[]);
  v.innerHTML=pageHead("Turniere","Jeder gegen jeden mit deinen Freunden – die Partien spielt ihr, wann ihr wollt.","swords","tour")+
  `${TOUR.list.length?`<div class="glist">${TOUR.list.map(t=>{const st2=tourStand(t);const done=(t.pairs||[]).filter(p=>{const g=p.gid&&(TOUR.games[p.gid]||(ON.games||[]).find(x=>x.id===p.gid));return g&&g.status==="over"}).length;
    return `<button class="gi" data-tour="${esc(t.id)}"><span class="res ${done===(t.pairs||[]).length?"win":"draw"}">${(t.players||[]).length}</span><span style="min-width:0"><b>${esc(t.name||"Turnier")}</b><small>${tcTxt(t.tc)} · ${done}/${(t.pairs||[]).length} Partien · vorn: ${esc((t.names&&st2[0]&&t.names[st2[0].u])||"–")}</small></span><span class="acc"></span><span class="mini">Öffnen</span></button>`}).join("")}</div>`:emptyState("swords","Noch kein Turnier","Lade 2 bis 7 Freunde ein. Jeder spielt einmal gegen jeden.")}
  <div class="card"><h3>Neues Turnier</h3>${fr.length<2?`<p class="hint" style="margin:0">Du brauchst mindestens zwei Freunde. Füge sie unter Profil → Freunde hinzu.</p>`:`
    <label class="fld">Name<input class="txt" id="tuName" maxlength="40" placeholder="z. B. Herbstturnier"></label>
    <div class="fld" style="margin-top:10px">Bedenkzeit</div><div class="filters" style="margin:6px 0 10px">${[["5+0","5 Min"],["10+0","10 Min"],["15+10","15 | 10"],["d1","1 Tag/Zug"],["d3","3 Tage/Zug"]].map(t=>`<button class="chip${(TOUR.tc||"10+0")===t[0]?" on":""}" data-ttc="${t[0]}">${t[1]}</button>`).join("")}</div>
    <div class="fld">Teilnehmer</div><div class="tu-fr">${fr.map(f=>`<label class="tu-cb"><input type="checkbox" value="${esc(f.uid)}" data-tn="${esc(f.name)}"> ${esc(f.name)}</label>`).join("")}</div>
    <div class="btnrow" style="margin-top:12px"><button class="btn grn" id="tuGo">Turnier starten</button><span class="hint" id="tuMsg"></span></div>`}</div>`;
  v.querySelectorAll("[data-tour]").forEach(b=>b.onclick=()=>{TOUR.open=b.dataset.tour;renderTours();window.scrollTo(0,0)});
  v.querySelectorAll("[data-ttc]").forEach(b=>b.onclick=()=>{TOUR.tc=b.dataset.ttc;renderTours()});
  v.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showView(b.dataset.go));
  const go=$("tuGo");if(go)go.onclick=async()=>{const sel=[...v.querySelectorAll(".tu-cb input:checked")];const msg=t=>{const m=$("tuMsg");if(m)m.textContent=t};
    if(sel.length<2||sel.length>7){msg("Wähle 2 bis 7 Freunde.");return}
    const players=[me].concat(sel.map(x=>x.value));const names={[me]:myName()};sel.forEach(x=>names[x.value]=x.dataset.tn);
    const pairs=[];for(let i=0;i<players.length;i++)for(let j=i+1;j<players.length;j++)pairs.push({a:players[i],b:players[j],gid:null});
    go.disabled=true;try{const id=await NET.add("tournaments",{name:$("tuName").value.trim()||"Turnier",creator:me,players,names,tc:parseTc(TOUR.tc||"10+0"),pairs:shuffle(pairs),status:"running",created:Date.now(),updated:Date.now()});TOUR.open=id;toast("Turnier gestartet");tourWatch();setTimeout(renderTours,300)}catch(e){msg(netErr(e));go.disabled=false}};
}
function renderTour(v,t){
  const me=ON.user.uid;const nm=u=>(t.names&&t.names[u])||"Spieler";
  (t.pairs||[]).forEach(p=>{if(p.gid&&!TOUR.games[p.gid]&&!(ON.games||[]).some(x=>x.id===p.gid)){TOUR.games[p.gid]={status:"?"};NET.get("games/"+p.gid).then(g=>{if(g){TOUR.games[p.gid]=Object.assign({id:p.gid},g);if(curView==="tours")renderTours()}}).catch(()=>{})}});
  const gOf=p=>p.gid&&((ON.games||[]).find(x=>x.id===p.gid)||TOUR.games[p.gid]);
  const st2=tourStand(t);
  v.innerHTML=`<button class="back" data-tback>← Alle Turniere</button>`+pageHead(esc(t.name||"Turnier"),`${(t.players||[]).length} Spieler · ${tcTxt(t.tc)} · jeder gegen jeden`,"swords")+
  `<div class="card"><h3>Tabelle</h3><table class="tu-tab" style="min-width:0"><thead><tr><th>#</th><th>Spieler</th><th style="text-align:right">Partien</th><th style="text-align:right">Punkte</th></tr></thead><tbody>${st2.map((s,i)=>`<tr${s.u===me?' class="mine"':""}><td>${medal(i)}</td><td><b>${esc(nm(s.u))}</b>${s.u===me?" (du)":""}</td><td class="num">${s.n}</td><td class="num"><b>${String(s.p).replace(".",",")}</b></td></tr>`).join("")}</tbody></table></div>
  <div class="card"><h3>Paarungen</h3>${(t.pairs||[]).map((p,i)=>{const g=gOf(p);const mineP=p.a===me||p.b===me;const res=g&&g.status==="over"?(g.result==="-"?"abgebrochen":g.result==="1/2-1/2"?"½–½":g.result==="1-0"?`${esc(nm(g.white))} gewinnt`:`${esc(nm(g.black))} gewinnt`):g&&g.status==="active"?"läuft":g&&g.status==="waiting"?"wartet auf Zusage":"noch offen";
    return `<div class="onrow"><span class="onn" style="padding:8px 4px"><b>${esc(nm(p.a))} – ${esc(nm(p.b))}</b><small>${res}</small></span><span class="onbtns">${g&&g.id?`<button class="btn${mineP&&g.status!=="over"?" grn":""}" data-og="${esc(p.gid)}">${g.status==="over"?"Ansehen":mineP?"Spielen":"Zuschauen"}</button>`:mineP?`<button class="btn grn" data-tpl="${i}">Partie starten</button>`:""}</span></div>`}).join("")}</div>`;
  v.querySelector("[data-tback]").onclick=()=>{TOUR.open=null;renderTours()};
  v.querySelectorAll("[data-og]").forEach(b=>b.onclick=()=>openOnlineGame(b.dataset.og));
  v.querySelectorAll("[data-tpl]").forEach(b=>b.onclick=async()=>{const i=+b.dataset.tpl;const p=t.pairs[i];if(!p)return;const opp=p.a===me?p.b:p.a;b.disabled=true;
    try{const d=newGameDoc(t.tc,"r",{uid:opp,name:nm(opp)});d.tid=t.id;const id=await NET.add("games",d);
      const ok=await NET.tx("tournaments/"+t.id,x=>{if(!x)return null;const ps=(x.pairs||[]).map(q=>Object.assign({},q));const q=ps.find(q=>(q.a===p.a&&q.b===p.b));if(!q||q.gid)return null;q.gid=id;return {pairs:ps,updated:Date.now()}});
      if(!ok){NET.set("games/"+id,{status:"cancelled",updated:Date.now()},true).catch(()=>{});toast("Diese Partie wurde schon gestartet.");return}
      openOnlineGame(id)}catch(e){toast(netErr(e));b.disabled=false}});
}

/* ---- Neuigkeiten von Freunden (Startseite) ---- */
const FEED={items:null,at:0,loading:false};
async function loadFeed(){
  if(FEED.loading||!ON.user||!NET||!ON.profile)return;if(FEED.items&&Date.now()-FEED.at<120000)return;
  const fr=(ON.profile.friends||[]).slice(0,10);if(!fr.length){FEED.items=[];FEED.at=Date.now();return}
  FEED.loading=true;
  try{const all=[];const seen=new Set();
    for(const f of fr){const gs=await NET.query("games","players","array-contains",f.uid).catch(()=>[]);gs.forEach(g=>{if(seen.has(g.id))return;seen.add(g.id);if(g.status==="over"&&g.result&&g.result!=="-"&&Date.now()-(g.updated||0)<14*DAY_MS)all.push(g)})}
    FEED.items=all.sort((a,b)=>(b.updated||0)-(a.updated||0)).slice(0,8);FEED.at=Date.now();
  }finally{FEED.loading=false}
  if(curView==="home")renderHome();
}
function feedHtml(){
  if(!ON.user||!ON.profile||!(ON.profile.friends||[]).length)return "";
  if(!FEED.items){loadFeed();return `<div class="sec-h"><h3>Neues von Freunden</h3></div><div class="card">${SKEL}</div>`}
  if(!FEED.items.length)return "";
  const me=ON.user.uid;const nm=(g,u)=>(g.names&&g.names[u])||"Spieler";
  return `<div class="sec-h"><h3>Neues von Freunden</h3></div><div class="card feed">${FEED.items.map(g=>{const w=g.result==="1-0"?g.white:g.result==="0-1"?g.black:null;const l=w?(w===g.white?g.black:g.white):null;
    const txt=w?`<b>${esc(nm(g,w))}</b> hat gegen <b>${esc(nm(g,l))}</b> gewonnen`:`<b>${esc(nm(g,g.white))}</b> und <b>${esc(nm(g,g.black))}</b> spielten remis`;
    return `<button class="feed-i" data-og="${esc(g.id)}"><span class="feed-ic">${NI.swords}</span><span><span class="feed-t">${txt}${(g.players||[]).indexOf(me)>=0?" (du warst dabei)":""}</span><small>${esc(g.reason||"")} · ${tcTxt(g.tc)} · ${relTime(g.updated)}</small></span></button>`}).join("")}</div>`;
}

/* ================= Phase 4: Level, Tagesaufgaben, Ligen, Serienschutz, Abzeichen-Stufen, Statistik ================= */
const isoWeek=t=>{const d=new Date(t||Date.now());d.setHours(0,0,0,0);d.setDate(d.getDate()+3-((d.getDay()+6)%7));const w1=new Date(d.getFullYear(),0,4);const n=1+Math.round(((d-w1)/DAY-3+((w1.getDay()+6)%7))/7);return d.getFullYear()+"-W"+String(n).padStart(2,"0")};
const weekNo=id=>+String(id||"").split("-W")[1]||0;
const weekStart=t=>{const d=new Date(t||Date.now());d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getTime()};
const GX_DEF={xp:0,wk:{id:"",xp:0,s:0},lg:0,freeze:0,qd:{date:"",list:[],bonus:false},qdone:0,allDays:[],chestWk:"",hist:[],snap:{},repSeen:"",recapSeen:"",lgRes:null,pending:null};
const GX=Object.assign(JSON.parse(JSON.stringify(GX_DEF)),store.get("et-gx",{}));
fixT(GX,GX_DEF);fixT(GX.wk,{id:"",xp:0,s:0});fixT(GX.qd,{date:"",list:[],bonus:false});
GX.hist=GX.hist.filter(h=>h&&h.id);GX.qd.list=GX.qd.list.filter(q=>q&&q.id);GX.lg=Math.max(0,Math.min(5,GX.lg|0));GX.freeze=Math.max(0,Math.min(2,GX.freeze|0));
S.gx=GX;KEYS.push("gx");
fixT(st,{glog:[],rlog:[]});st.glog=st.glog.filter(g=>g&&g.t);st.rlog=st.rlog.filter(r=>Array.isArray(r));
const saveGX=()=>{store.set("et-gx",GX);savedAt=Date.now();store.set("et-savedAt",savedAt);try{cloudDirty()}catch(e){}};

/* ---- Level aus allen Aktivitäten ---- */
const gxLvXp=l=>Math.round(120*Math.pow(l-1,1.55));
const gxLevel=xp=>{let l=1;while(gxLvXp(l+1)<=xp)l++;return l};
const LEAGUES=[["Bronze","#B98457"],["Silber","#A9B2BC"],["Gold","#E3B341"],["Saphir","#4C86E0"],["Rubin","#D9475E"],["Diamant","#6FD3E3"]];
const SHIELD=(c,s)=>`<svg class="shield" width="${s||28}" height="${s||28}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" fill="${c}"/><path d="M12 6.5l1.5 3.1 3.4.5-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4-2.5-2.4 3.4-.5z" fill="rgba(255,255,255,.85)"/></svg>`;
let xpPopT=null;
function xpPop(n){
  if(calmNow())return;let el=$("xpPop");if(!el){el=document.createElement("div");el.id="xpPop";el.className="xppop";el.setAttribute("aria-hidden","true");document.body.appendChild(el)}
  const cur=+(el.dataset.n||0)+n;el.dataset.n=cur;el.textContent="+"+cur+" XP";el.classList.remove("out");el.classList.add("in");
  clearTimeout(xpPopT);xpPopT=setTimeout(()=>{el.classList.add("out");el.classList.remove("in");el.dataset.n=0},1400);
}
let pubT=null;
function schedulePub(){clearTimeout(pubT);pubT=setTimeout(()=>{try{publishStats()}catch(e){}},15000)}
function addXP(n){
  n=Math.round(n||0);if(n<=0)return;gxRoll();const lb=gxLevel(GX.xp);GX.xp+=n;GX.wk.xp+=n;saveGX();xpPop(n);
  const la=gxLevel(GX.xp);if(la>lb)setTimeout(()=>{celebrate("level",la,`Level ${la} erreicht`,"Alles, was du trainierst, zählt mit.");sfx("badge")},1300);
  schedulePub();
}

/* ---- Ereignisse aus allen Bereichen ---- */
function gain(kind,info){info=info||{};try{
  let xp=0;
  if(kind==="line"){xp=info.clean?(info.first?25:15):8;qBump("line",1);if(info.clean)qBump("lineClean",1);if(info.first)qBump("lineNew",1)}
  else if(kind==="tactic"){xp=info.ok?Math.max(6,Math.round((info.xp||10)*.8)):2;if(info.ok)qBump("tactic",1)}
  else if(kind==="game"){xp=info.src==="online"?25:18;if(info.res==="win")xp+=12;logGame(info);qBump("game",1);if(info.res==="win")qBump("win",1)}
  else if(kind==="review"){xp=15;qBump("review",1)}
  else if(kind==="coord"){xp=Math.round((info.pts||0)/2);qBump("coord",info.pts||0)}
  else if(kind==="quiz"){if(info.ok){xp=4;qBump("quiz",1)}}
  else if(kind==="guess"){xp=10+Math.round((info.p||0)/10);qBump("guess",1)}
  else if(kind==="puz"){xp=10;qBump("puz",1)}
  else if(kind==="plan"){xp=info.first?30:12}
  addXP(xp);checkBadges();
}catch(e){}}
function tcClass(tc,src){
  if(src==="bot"||src==="sf"||src==="end")return "Computer";
  if(!tc)return "Ohne Uhr";if(tc.d)return "Fernschach";const t=tc.m*60+40*tc.i;return t<180?"Bullet":t<600?"Blitz":"Schnell";
}
function logGame(i){
  st.glog.unshift({t:Date.now(),id:i.id||"",src:i.src||"bot",res:i.res||"loss",color:i.color||"w",tc:i.tcName||tcClass(i.tc,i.src),fam:i.fam||"",n:i.n||0,opp:i.opp||"",moves:(i.moves||[]).join(" ")});
  st.glog=st.glog.slice(0,300);saveStats();
}

/* ---- Tagesaufgaben ---- */
const QPOOL=[
  {id:"tac5",k:"tactic",g:5,t:"Löse 5 Taktikaufgaben",go:"tactics"},
  {id:"tac12",k:"tactic",g:12,t:"Löse 12 Taktikaufgaben",go:"tactics",hard:1},
  {id:"line3",k:"lineClean",g:3,t:"Spiele 3 Varianten fehlerfrei",go:"daily"},
  {id:"new2",k:"lineNew",g:2,t:"Lerne 2 neue Varianten",go:"new"},
  {id:"line6",k:"line",g:6,t:"Trainiere 6 Varianten",go:"daily",hard:1},
  {id:"game1",k:"game",g:1,t:"Spiel eine Partie",go:"bots"},
  {id:"win1",k:"win",g:1,t:"Gewinne eine Partie",go:"bots",hard:1},
  {id:"rev1",k:"review",g:1,t:"Analysiere eine Partie",go:"analyse"},
  {id:"coord20",k:"coord",g:20,t:"Finde 20 Felder im Koordinaten-Trainer",go:"coords"},
  {id:"quiz5",k:"quiz",g:5,t:"Beantworte 5 Quizfragen richtig",go:"quiz"},
  {id:"guess1",k:"guess",g:1,t:"Spiel eine Meisterpartie nach",go:"guess"},
  {id:"puz2",k:"puz",g:2,t:"Löse 2 Aufgaben aus deinen Fehlern",go:"mine",need:()=>S.puz.filter(p=>!p.solved||p.solved<2).length>=2}
];
const QXP=30,QBONUS=50;
function seedRnd(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return ()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return ((h>>>0)%100000)/100000}}
function ensureQuests(){
  if(GX.qd.date===today()&&GX.qd.list.length)return;
  const r=seedRnd(today()+"|zz");const pool=QPOOL.filter(q=>!q.need||q.need());const pick=[];const kinds=new Set();let hard=0;
  const order=pool.map(q=>[r(),q]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  for(const q of order){if(pick.length>=3)break;const grp=q.k.replace(/Clean|New/,"");if(kinds.has(grp))continue;if(q.hard&&hard)continue;pick.push(q);kinds.add(grp);if(q.hard)hard++}
  GX.qd={date:today(),list:pick.map(q=>({id:q.id,n:0,done:false})),bonus:false};saveGX();
}
const qDef=id=>QPOOL.find(q=>q.id===id);
function qBump(kind,n){
  ensureQuests();let changed=false;
  GX.qd.list.forEach(q=>{const d=qDef(q.id);if(!d||q.done||d.k!==kind)return;q.n=Math.min(d.g,q.n+n);changed=true;
    if(q.n>=d.g){q.done=true;GX.qdone++;setTimeout(()=>toast(`Tagesaufgabe erledigt: ${d.t} · +${QXP} XP`),500);addXP(QXP)}});
  if(changed){
    if(!GX.qd.bonus&&GX.qd.list.length&&GX.qd.list.every(q=>q.done)){GX.qd.bonus=true;addXP(QBONUS);GX.allDays.push(today());GX.allDays=GX.allDays.slice(-60);
      const w=isoWeek();const inWeek=GX.allDays.filter(d=>isoWeek(Date.parse(d)+12*3600000)===w).length;
      if(inWeek>=5&&GX.chestWk!==w&&GX.freeze<2){GX.chestWk=w;GX.freeze++;setTimeout(()=>celebrate("level",GX.freeze,"Wochenkiste: Serienschutz erhalten","An fünf Tagen alle Aufgaben erledigt."),1800)}
      else setTimeout(()=>celebrate("level",3,"Alle Tagesaufgaben erledigt",`+${QBONUS} XP Bonus`),1600)}
    saveGX();if(curView==="home")renderHome();
  }
}
function questsHtml(){
  ensureQuests();const L=GX.qd.list;const nd=L.filter(q=>q.done).length;
  return `<section class="card dq"><div class="today-h"><div><h3>Tagesaufgaben</h3><small>${nd} von ${L.length} · je ${QXP} XP, alle zusammen +${QBONUS} XP</small></div><span class="dq-xp">${GX.qd.bonus?"Erledigt":`${nd}/${L.length}`}</span></div>
  <div class="dql">${L.map(q=>{const d=qDef(q.id);if(!d)return "";return `<button class="dqi${q.done?" ok":""}" data-qgo="${d.go}"><span class="qk">${q.done?ICON.ok:""}</span><span class="dqt"><b>${esc(d.t)}</b><span class="pbar2"><i style="width:${q.n/d.g*100}%"></i></span></span><small>${q.n}/${d.g}</small></button>`}).join("")}</div></section>`;
}
function qGo(go){
  if(go==="daily"){startSession("daily");return}
  if(go==="new"){const k=newKeys(3);if(k.length)startSession("new",k,"Neue Varianten");else showView("openings");return}
  if(go==="mine"){startSession("mine");return}
  showView(go);
}

/* ---- Serienschutz ---- */
const dayDiff=(a,b)=>Math.round((Date.parse(b)-Date.parse(a))/DAY);
function applyFreeze(){
  const s=S.streak;if(!s.last||!s.n||s.last===today()||s.last===yesterday())return;
  const missed=dayDiff(s.last,today())-1;if(missed<1||missed>GX.freeze)return;
  GX.freeze-=missed;s.last=yesterday();save("streak");saveGX();
  setTimeout(()=>toast(`Serienschutz eingesetzt: Deine Serie von ${s.n} ${s.n===1?"Tag":"Tagen"} bleibt erhalten.`),1500);
}
function streakMilestone(){if(S.streak.n>0&&S.streak.n%7===0&&GX.freeze<2){GX.freeze++;saveGX();setTimeout(()=>toast(`${S.streak.n} Tage in Folge – du bekommst einen Serienschutz (${GX.freeze}/2).`),2600)}}

/* ---- Wochenwechsel und Ligen ---- */
function gxSnap(){return {clean:cleanCount(),tacR:PZ.r,tacN:PZ.n,elo:ON.profile&&ON.profile.elo||null,xp:GX.xp,t:Date.now()}}
function gxRoll(){
  const w=isoWeek();if(GX.wk.id===w)return;
  if(GX.wk.id){const old={id:GX.wk.id,xp:GX.wk.xp,lg:GX.lg,s:GX.wk.s||0};GX.hist.unshift(old);GX.hist=GX.hist.slice(0,26);
    const gap=old.s?Math.max(1,Math.round((weekStart()-old.s)/(7*DAY))):1;
    GX.pending={id:old.id,xp:old.xp,lg:old.lg,gap};GX.prevSnap=GX.snap&&GX.snap.id===old.id?GX.snap:null}
  GX.wk={id:w,xp:0,s:weekStart()};GX.snap=Object.assign({id:w},gxSnap());saveGX();
}
function peerWeek(u,id){const g=u.pub&&u.pub.gx;if(!g)return null;if(g.wk===id)return {xp:g.wxp||0,lg:g.lg|0};if(g.last&&g.last.id===id)return {xp:g.last.xp||0,lg:g.last.lg|0};return null}
async function gxSettle(){
  if(!GX.pending)return;const P=GX.pending;let rank=0,n=0,from=P.lg,to=P.lg,how="solo";
  try{
    if(ON.user&&NET&&ON.profile){const U=await Promise.race([loadUsers(true),new Promise((_,j)=>setTimeout(()=>j(new Error("t")),6000))]);
      const me=ON.user.uid;const list=U.filter(u=>u.id!==me&&!u.banned).map(u=>Object.assign({id:u.id},peerWeek(u,P.id)||{})).filter(x=>x.lg===P.lg&&x.xp!=null);
      list.push({id:me,xp:P.xp});list.sort((a,b)=>b.xp-a.xp);n=list.length;rank=list.findIndex(x=>x.id===me)+1;
      if(n>=4){how="liga";if(rank<=3&&P.xp>0)to=P.lg+1;else if(n>=7&&rank>n-3)to=P.lg-1}}
  }catch(e){}
  if(how==="solo"){if(P.xp>=350)to=P.lg+1;else if(P.xp<60&&P.lg>0)to=P.lg-1}
  if(P.gap>1&&to>=P.lg&&P.lg>0)to=P.lg-1;
  to=Math.max(0,Math.min(LEAGUES.length-1,to));GX.lg=to;GX.lgRes={id:P.id,from,to,rank,n,xp:P.xp,how};GX.pending=null;saveGX();schedulePub();
  if(to>from)setTimeout(()=>celebrate("level",to+1,`Aufstieg in die ${LEAGUES[to][0]}-Liga`,`KW ${weekNo(P.id)}: ${P.xp} XP${n>=4?` · Platz ${rank} von ${n}`:""}`),2000);
  else if(to<from)setTimeout(()=>toast(`Abstieg in die ${LEAGUES[to][0]}-Liga – diese Woche holst du dir den Platz zurück.`),2000);
}
function gxPub(){const h=GX.hist[0];return {lv:gxLevel(GX.xp),xp:GX.xp,wk:GX.wk.id,wxp:GX.wk.xp,lg:GX.lg,last:h?{id:h.id,xp:h.xp,lg:h.lg}:null}}

/* ---- Liga-Ansicht ---- */
let lgUsers=null,lgAt=0;
function renderLeague(){
  const v=$("v-league");if(!v)return;gxRoll();
  const L=LEAGUES[GX.lg],nx=LEAGUES[GX.lg+1];const lv=gxLevel(GX.xp),a=gxLvXp(lv),b=gxLvXp(lv+1);
  const left=Math.max(0,Math.ceil((weekStart()+7*DAY-Date.now())/DAY));
  const res=GX.lgRes;const online=!!(ON.user&&ON.profile);
  let table="";
  if(online){
    if(!lgUsers||Date.now()-lgAt>60000){table=`<div class="card">${SKEL}</div>`;loadUsers(true).then(u=>{lgUsers=u;lgAt=Date.now();if(curView==="league")renderLeague()}).catch(()=>{lgUsers=[];lgAt=Date.now();if(curView==="league")renderLeague()})}
    else{
      const me=ON.user.uid,w=GX.wk.id;
      const rows=lgUsers.filter(u=>u.id!==me&&!u.banned&&u.pub&&u.pub.gx&&u.pub.gx.wk===w&&(u.pub.gx.lg|0)===GX.lg).map(u=>({id:u.id,name:u.name,xp:u.pub.gx.wxp||0,lv:u.pub.gx.lv||1}));
      rows.push({id:me,name:(ON.profile.name||"Du")+" (du)",xp:GX.wk.xp,lv,me:true});rows.sort((x,y)=>y.xp-x.xp);const n=rows.length;
      table=`<div class="card"><div class="sec-h" style="margin-bottom:8px"><h3>${L[0]}-Liga · KW ${weekNo(w)}</h3><small>${n} ${n===1?"Spieler":"Spieler"}</small></div>
      ${n<4?`<p class="hint" style="margin:0 0 8px">Ab vier Spielern in deiner Liga zählt die Tabelle. Bis dahin gilt die Solo-Regel: ab 350 XP steigst du auf.</p>`:""}
      <div class="lgt">${rows.map((r,i)=>{const z=n>=4&&i<3&&GX.lg<LEAGUES.length-1?"up":n>=7&&i>=n-3&&GX.lg>0?"down":"";return `<div class="lgr ${z}${r.me?" me":""}"><span class="lrank">${i+1}</span><span class="onav sm">${esc((r.name||"?")[0].toUpperCase())}</span><span class="onn"><b>${esc(r.name||"Spieler")}</b><small>Level ${r.lv}</small></span><b class="lgxp">${r.xp} XP</b></div>`}).join("")}</div>
      ${n>=4?`<p class="hint" style="margin:8px 0 0"><span class="zone up"></span> Aufstiegszone · <span class="zone down"></span> Abstiegszone</p>`:""}</div>`;
    }
  }else table=`<div class="card"><h3>Gegen andere antreten</h3><p class="hint" style="margin:0 0 10px">Mit einem kostenlosen Konto spielst du in einer echten Liga mit anderen Spielern. Ohne Konto gilt die Solo-Regel: ab 350 XP pro Woche steigst du auf, unter 60 XP ab.</p><button class="btn grn" data-go="online:account">Konto erstellen oder anmelden</button></div>`;
  v.innerHTML=pageHead("Wochenliga","Sammle XP mit allem, was du trainierst. Jeden Montag wird abgerechnet.","bolt","league")+
  `<div class="lg-hero" style="--lgc:${L[1]}">${SHIELD(L[1],64)}<div><small>Deine Liga</small><h3>${L[0]}</h3><span>${GX.wk.xp} XP diese Woche · noch ${left} ${left===1?"Tag":"Tage"}</span>
    ${!online?`<span class="pbar2" style="margin-top:8px"><i style="width:${Math.min(100,GX.wk.xp/350*100)}%"></i></span><em class="lg-sub">${GX.wk.xp>=350?"Aufstieg sicher":`${350-GX.wk.xp} XP bis zum Aufstieg`}</em>`:""}</div></div>
  ${res?`<div class="card lgres"><b>${res.to>res.from?"Aufgestiegen":res.to<res.from?"Abgestiegen":"Klasse gehalten"}</b> <span class="hint">KW ${weekNo(res.id)}: ${res.xp} XP${res.n>=4?` · Platz ${res.rank} von ${res.n}`:""} · ${LEAGUES[res.from][0]} → ${LEAGUES[res.to][0]}</span></div>`:""}
  ${table}
  <div class="card"><h3>Level ${lv}</h3><span class="pbar2"><i style="width:${(GX.xp-a)/Math.max(1,b-a)*100}%"></i></span><p class="hint" style="margin:6px 0 0">${GX.xp-a} / ${b-a} XP bis Level ${lv+1} · insgesamt ${GX.xp} XP</p></div>
  <div class="card"><h3>So bekommst du XP</h3><div class="xpl">${[["Variante fehlerfrei","15–25"],["Taktikaufgabe gelöst","8–16"],["Partie gespielt (Sieg +12)","18–37"],["Partie analysiert","15"],["Tagesaufgabe","30"],["Alle drei Tagesaufgaben","+50"],["Koordinaten, Quiz, Meisterzug","je nach Ergebnis"]].map(r=>`<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join("")}</div></div>
  <div class="card"><h3>Ligen</h3><div class="lgs">${LEAGUES.map((l,i)=>`<div class="lgs-i${i===GX.lg?" on":""}">${SHIELD(l[1],30)}<small>${l[0]}</small></div>`).join("")}</div>
    ${GX.hist.length?`<div class="exh" style="margin-top:12px"><span>Letzte Wochen</span></div><div class="xpl">${GX.hist.slice(0,6).map(h=>`<div><span>KW ${weekNo(h.id)} · ${LEAGUES[h.lg|0][0]}</span><b>${h.xp} XP</b></div>`).join("")}</div>`:""}</div>
  <div class="card"><h3>Serienschutz</h3><p class="hint" style="margin:0">Du hast <b>${GX.freeze} von 2</b>. Verpasst du einen Tag Tagestraining, rettet ein Serienschutz automatisch deine Serie. Du bekommst einen für jede volle Woche Serie und für die Wochenkiste (an fünf Tagen alle Tagesaufgaben).</p></div>`;
  v.querySelectorAll("[data-go]").forEach(x=>x.onclick=()=>showView(x.dataset.go));
}

/* ---- Abzeichen in Stufen ---- */
const BFAM=[
  {id:"lines",t:"Varianten",d:"fehlerfrei gelernte Varianten",v:()=>cleanCount(),g:[1,25,100],ids:["first","c25","c100"]},
  {id:"streak",t:"Serie",d:"Tage Tagestraining in Folge",v:()=>S.streak.best||0,g:[3,7,30],ids:["s3","s7","s30"]},
  {id:"tac",t:"Taktik",d:"gelöste Taktikaufgaben",v:()=>PZ.ok,g:[25,250,1000],ids:["t1","t2","tac3"]},
  {id:"tacr",t:"Taktik-Wertung",d:"höchste Taktik-Wertung",v:()=>Math.max(PZ.r,...PZ.hist.map(h=>h[1])),g:[1500,1800,2100],ids:["t1500","t1800","t2100"]},
  {id:"games",t:"Partien",d:"gespielte Partien (Computer und online)",v:()=>Math.max(st.engine||0,st.glog.length),g:[5,25,100],ids:["sf","gm25","gm100"]},
  {id:"wins",t:"Siege",d:"gewonnene Partien",v:()=>st.glog.filter(g=>g.res==="win").length,g:[1,10,50],ids:["w1","w10","w50"]},
  {id:"rev",t:"Analysen",d:"Partien im Game Review",v:()=>st.reviews||0,g:[5,25,100],ids:["review","rv25","rv100"]},
  {id:"lvl",t:"Level",d:"erreichtes Level",v:()=>gxLevel(GX.xp),g:[5,15,30],ids:["lv5","lv15","lv30"]},
  {id:"quest",t:"Tagesaufgaben",d:"erledigte Tagesaufgaben",v:()=>GX.qdone,g:[10,50,200],ids:["q10","q50","q200"]},
  {id:"coord",t:"Koordinaten",d:"Rekord im Koordinaten-Trainer (30 s)",v:()=>Math.max(CO.best.find||0,CO.best.name||0),g:[15,25,35],ids:["co15","co25","co35"]},
  {id:"plan",t:"Planaufgaben",d:"geschaffte Planaufgaben",v:()=>Object.values(st.plans||{}).filter(r=>r&&r.ok).length,g:[1,10,30],ids:["pl1","pl10","pl30"]}
];
const TIERN=["Bronze","Silber","Gold"];
BFAM.forEach(f=>f.ids.forEach((id,i)=>{if(!BADGES.some(b=>b.id===id))BADGES.push({id,t:`${f.t} ${TIERN[i]}`,d:`${f.g[i]} ${f.d}`,ok:()=>f.v()>=f.g[i]})}));
const famIds=new Set([].concat(...BFAM.map(f=>f.ids)));
renderBadges=function(v){
  checkBadges();const got=id=>st.badges.indexOf(id)>=0;
  const fams=BFAM.map(f=>{let val=0;try{val=f.v()}catch(e){}const tier=f.g.filter(x=>val>=x).length;const nxt=f.g[tier];
    return `<div class="bfam"><div class="bfam-h"><b>${esc(f.t)}</b><small>${tier?TIERN[tier-1]:"noch keine Stufe"}</small></div>
    <div class="bmeds">${f.g.map((g,i)=>`<span class="bmed t${i+1}${val>=g?" got":""}" title="${TIERN[i]}: ${g} ${esc(f.d)}">${ICON.medal}<small>${g}</small></span>`).join("")}</div>
    ${nxt!=null?`<span class="pbar2"><i style="width:${Math.min(100,val/nxt*100)}%"></i></span><small class="bnext">${val} / ${nxt} ${esc(f.d)}</small>`:`<small class="bnext">Alle Stufen erreicht · ${val} ${esc(f.d)}</small>`}</div>`}).join("");
  const rest=BADGES.filter(b=>!famIds.has(b.id));
  v.innerHTML=`<div class="sec-h"><h3>Stufen</h3><small>Bronze, Silber und Gold</small></div><div class="bfams">${fams}</div>
  <div class="sec-h" style="margin-top:6px"><h3>Besondere Abzeichen</h3><small>${rest.filter(b=>got(b.id)).length} von ${rest.length}</small></div>
  <div class="badges">${rest.map(b=>`<div class="bdg${got(b.id)?" got":""}"><span class="md">${ICON.medal}</span><span><b>${esc(b.t)}</b><small>${esc(b.d)}</small></span></div>`).join("")}</div>`;
};

/* ================= Statistik-Dashboard ================= */
const STV=Object.assign({range:90,src:"all"},store.get("et-stv",{}));fixT(STV,{range:90,src:"all"});
const fmtD=t=>{const d=new Date(t);return d.getDate()+". "+MON[d.getMonth()]};
const pctS=x=>x==null||isNaN(x)?"–":Math.round(x*100)+" %";
/* gemeinsamer Tooltip für alle Diagramme */
function vizTip(root){
  let tip=$("vizTip");if(!tip){tip=document.createElement("div");tip.id="vizTip";tip.className="viztip";tip.hidden=true;document.body.appendChild(tip)}
  const show=(e,html)=>{tip.innerHTML=html;tip.hidden=false;const w=tip.offsetWidth,h=tip.offsetHeight;let x=e.clientX+14,y=e.clientY-h-10;if(x+w>innerWidth-8)x=e.clientX-w-14;if(y<8)y=e.clientY+16;tip.style.left=x+"px";tip.style.top=y+"px"};
  root.addEventListener("pointermove",e=>{const t=e.target.closest&&e.target.closest("[data-tip]");if(t&&root.contains(t))show(e,t.dataset.tip);else if(!e.target.closest(".rchart"))tip.hidden=true});
  root.addEventListener("pointerleave",()=>{tip.hidden=true});
  return show;
}
/* Wertungen: Taktik, Online, Chess.com/Lichess */
function ratingSeries(){
  const out=[];
  if(PZ.hist.length>1)out.push({k:"tac",name:"Taktik",pts:PZ.hist.map(h=>[h[0],h[1]])});
  const eh=ON.profile&&ON.profile.eloHist;if(eh&&eh.length>1)out.push({k:"on",name:"Online",pts:eh.map(h=>[h.t,h.r])});
  const by={};CH.games.forEach(g=>{if(g.myR&&g.date){(by[g.tc]=by[g.tc]||[]).push([g.date,g.myR])}});
  const best=Object.entries(by).sort((a,b)=>b[1].length-a[1].length)[0];
  if(best&&best[1].length>1){const nm={bullet:"Bullet",blitz:"Blitz",rapid:"Schnell",daily:"Täglich",classical:"Klassisch"}[best[0]]||best[0];out.push({k:"ch",name:`${siteName()} ${nm}`,pts:best[1].sort((a,b)=>a[0]-b[0])})}
  return out;
}
function ratingChartHtml(){
  const all=ratingSeries();const t1=Date.now(),t0=STV.range?t1-STV.range*DAY:Math.min(...all.map(s=>s.pts[0][0]),t1-7*DAY);
  const ser=all.map(s=>{const inR=s.pts.filter(p=>p[0]>=t0);const before=s.pts.filter(p=>p[0]<t0).pop();return Object.assign({},s,{pts:(before?[[t0,before[1]]]:[]).concat(inR)})}).filter(s=>s.pts.length>1);
  const seg=`<span class="seg sm">${[[30,"30 T"],[90,"90 T"],[365,"1 J"],[0,"Alle"]].map(r=>`<button data-rng="${r[0]}" aria-pressed="${STV.range===r[0]}">${r[1]}</button>`).join("")}</span>`;
  if(!ser.length)return `<div class="card"><div class="sec-h"><h3>Wertungen</h3>${seg}</div><p class="hint" style="margin:8px 0 0">Noch kein Verlauf in diesem Zeitraum. Löse Taktikaufgaben, spiel online oder verknüpfe ${siteName()}, dann erscheinen deine Wertungen hier.</p></div>`;
  const W=640,H=220,pl=44,pr=74,pt=12,pb=26;const ys=[].concat(...ser.map(s=>s.pts.map(p=>p[1])));let lo=Math.min(...ys),hi=Math.max(...ys);const pad=Math.max(20,(hi-lo)*.12);lo=Math.floor((lo-pad)/50)*50;hi=Math.ceil((hi+pad)/50)*50;
  const X=t=>pl+(t-t0)/Math.max(1,t1-t0)*(W-pl-pr),Y=r=>pt+(hi-r)/Math.max(1,hi-lo)*(H-pt-pb);
  const step=[50,100,200,250,500].find(s=>(hi-lo)/s<=5)||500;const ticks=[];for(let r=Math.ceil(lo/step)*step;r<=hi;r+=step)ticks.push(r);
  const xt=[0,1/3,2/3,1].map(f=>t0+(t1-t0)*f);
  const ends=ser.map(s=>({s,y:Y(s.pts[s.pts.length-1][1])})).sort((a,b)=>a.y-b.y);for(let i=1;i<ends.length;i++)if(ends[i].y-ends[i-1].y<16)ends[i].y=ends[i-1].y+16;
  const svg=`<svg class="rchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Wertungsverlauf">
    ${ticks.map(r=>`<line x1="${pl}" x2="${W-pr}" y1="${Y(r).toFixed(1)}" y2="${Y(r).toFixed(1)}" class="grid"/><text x="${pl-8}" y="${(Y(r)+4).toFixed(1)}" class="ax" text-anchor="end">${r}</text>`).join("")}
    ${xt.map((t,i)=>`<text x="${X(t).toFixed(1)}" y="${H-6}" class="ax" text-anchor="${i===0?"start":i===3?"end":"middle"}">${fmtD(t)}</text>`).join("")}
    ${ser.map(s=>`<path d="${s.pts.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ")}" class="ln s-${s.k}"/>`).join("")}
    ${ends.map(e=>{const p=e.s.pts[e.s.pts.length-1];return `<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="4" class="dt s-${e.s.k}"/><text x="${W-pr+8}" y="${(e.y+4).toFixed(1)}" class="endl">${p[1]}</text>`}).join("")}
    <line class="xh" x1="0" x2="0" y1="${pt}" y2="${H-pb}" visibility="hidden"/></svg>`;
  return `<div class="card"><div class="sec-h"><h3>Wertungen</h3>${seg}</div>
    <div class="lgd">${ser.map(s=>{const a=s.pts[0][1],b=s.pts[s.pts.length-1][1],d=b-a;return `<span><i class="sw s-${s.k}"></i>${esc(s.name)} <b>${b}</b> <em class="${d>0?"up":d<0?"dn":""}">${d>0?"+":""}${d}</em></span>`}).join("")}</div>
    <div class="rwrap" data-t0="${t0}" data-t1="${t1}" data-pl="${pl}" data-pr="${pr}" data-w="${W}">${svg}</div></div>`;
}
function wireRatingChart(root){
  const wrap=root.querySelector(".rwrap");if(!wrap)return;const svg=wrap.querySelector("svg");const xh=svg.querySelector(".xh");const ser=ratingSeries();
  const t0=+wrap.dataset.t0,t1=+wrap.dataset.t1,pl=+wrap.dataset.pl,pr=+wrap.dataset.pr,W=+wrap.dataset.w;const tip=$("vizTip");
  const move=e=>{const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*W;if(x<pl||x>W-pr){xh.setAttribute("visibility","hidden");if(tip)tip.hidden=true;return}
    const t=t0+(x-pl)/(W-pl-pr)*(t1-t0);xh.setAttribute("x1",x);xh.setAttribute("x2",x);xh.setAttribute("visibility","visible");
    const rows=ser.map(s=>{const p=s.pts.filter(q=>q[0]<=t).pop();return p?`<div><i class="sw s-${s.k}"></i>${esc(s.name)} <b>${p[1]}</b></div>`:""}).join("");
    const T=$("vizTip");if(!T)return;T.innerHTML=`<small>${fmtD(t)}</small>${rows||"<div>keine Werte</div>"}`;T.hidden=false;const w=T.offsetWidth;let xx=e.clientX+14;if(xx+w>innerWidth-8)xx=e.clientX-w-14;T.style.left=xx+"px";T.style.top=(e.clientY-T.offsetHeight-12)+"px"};
  svg.addEventListener("pointermove",move);svg.addEventListener("pointerdown",move);svg.addEventListener("pointerleave",()=>{xh.setAttribute("visibility","hidden");const T=$("vizTip");if(T)T.hidden=true});
}
/* Trainingskalender (26 Wochen) */
function heatHtml(){
  const weeks=innerWidth<480?15:innerWidth<760?20:26,start=weekStart()-(weeks-1)*7*DAY;const cells=[];let tot=0,act=0,run=0,best=0;
  for(let i=0;i<weeks*7;i++){const t=start+i*DAY;const d=dstr(new Date(t));const n=t>Date.now()?-1:(st.days[d]||0);cells.push([t,n]);if(n>0){tot+=n;act++;run++;best=Math.max(best,run)}else if(n===0)run=0}
  const nz=cells.map(c=>c[1]).filter(n=>n>0).sort((a,b)=>a-b);const q=f=>nz.length?nz[Math.min(nz.length-1,Math.floor(nz.length*f))]:1;const th=[q(.25),q(.5),q(.75)];
  const lvl=n=>n<=0?0:n<=th[0]?1:n<=th[1]?2:n<=th[2]?3:4;
  const WD=["Mo","Di","Mi","Do","Fr","Sa","So"];let months="";let lastM=-1;
  for(let w=0;w<weeks;w++){const m=new Date(start+w*7*DAY).getMonth();months+=`<span>${m!==lastM?MON[m]:""}</span>`;lastM=m}
  return `<div class="card"><div class="sec-h"><h3>Trainingskalender</h3><small>${act} aktive Tage · längste Folge ${best} · ${tot} Einheiten</small></div>
  <div class="heat-wrap"><div class="heat-m" style="grid-template-columns:repeat(${weeks},1fr)">${months}</div>
  <div class="heat-g"><div class="heat-d">${WD.map((d,i)=>`<span>${i%2===0?d:""}</span>`).join("")}</div>
  <div class="heat" style="grid-template-columns:repeat(${weeks},1fr)">${cells.map(([t,n],i)=>{const w=Math.floor(i/7),d=i%7;return `<i class="hl${lvl(n)}${n<0?" fut":""}" style="grid-column:${w+1};grid-row:${d+1}" ${n>=0?`data-tip="${WD[d]}, ${fmtD(t)}: <b>${n}</b> ${n===1?"Einheit":"Einheiten"}"`:""}></i>`}).join("")}</div></div>
  <div class="heat-l"><span>weniger</span>${[0,1,2,3,4].map(l=>`<i class="hl${l}"></i>`).join("")}<span>mehr</span></div></div>
  <p class="hint" style="margin:6px 0 0">Eine Einheit ist eine trainierte Variante oder eine Taktikaufgabe. Angezeigt: die letzten ${weeks} Wochen.</p></div>`;
}
/* Partien aller Quellen */
function allGames(){
  const out=[];const tcN={bullet:"Bullet",blitz:"Blitz",rapid:"Schnell",daily:"Fernschach",classical:"Schnell"};
  CH.games.forEach(g=>out.push({src:"ch",res:g.res,color:g.color,tc:tcN[g.tc]||g.tc||"–",fam:g.fam||"Unbekannt",term:g.term||"",t:g.date||0,id:g.id}));
  st.glog.forEach(g=>out.push({src:g.src==="online"?"on":"bot",res:g.res,color:g.color,tc:g.tc,fam:g.fam||"Ohne Eröffnung",term:g.term||"",t:g.t,id:g.id}));
  return out;
}
function wdlRow(label,a,extra){const n=a.length;const w=a.filter(g=>g.res==="win").length,d=a.filter(g=>g.res==="draw").length,l=n-w-d;const sc=n?(w+d/2)/n:0;
  return `<div class="wrow" data-tip="${esc(label)}: ${w} Siege · ${d} Remis · ${l} Niederlagen"><span class="wl">${extra||""}${esc(label)}<small>${n} ${n===1?"Partie":"Partien"}</small></span><span class="wdl"><i class="w" style="width:${n?w/n*100:0}%"></i><i class="d" style="width:${n?d/n*100:0}%"></i><i class="l" style="width:${n?l/n*100:0}%"></i></span><b class="${sc>=.55?"score-good":sc<.45?"score-bad":""}">${Math.round(sc*100)} %</b></div>`}
function winHtml(){
  const G0=allGames();const srcs=[["all","Alle"],["ch",siteName()],["on","Online"],["bot","Computer"]].filter(s=>s[0]==="all"||G0.some(g=>g.src===s[0]));
  if(!srcs.some(s=>s[0]===STV.src))STV.src="all";const G=G0.filter(g=>STV.src==="all"||g.src===STV.src);
  const seg=srcs.length>2?`<span class="seg sm">${srcs.map(s=>`<button data-src2="${s[0]}" aria-pressed="${STV.src===s[0]}">${esc(s[1])}</button>`).join("")}</span>`:"";
  if(!G.length)return `<div class="card"><div class="sec-h"><h3>Erfolgsquote</h3>${seg}</div><p class="hint" style="margin:8px 0 0">Noch keine Partien. Spiel gegen den Computer oder online, oder verknüpfe ${siteName()} unter Analyse.</p></div>`;
  const grp=(f)=>{const m={};G.forEach(g=>{const k=f(g);(m[k]=m[k]||[]).push(g)});return Object.entries(m).sort((a,b)=>b[1].length-a[1].length)};
  const fams=grp(g=>g.fam).slice(0,6);
  return `<div class="card"><div class="sec-h"><h3>Erfolgsquote</h3>${seg}</div>
  <div class="wtot">${wdlRow("Gesamt",G)}</div>
  <div class="wgrid"><div><div class="exh"><span>Nach Farbe</span></div>${wdlRow("Mit Weiß",G.filter(g=>g.color==="w"),'<span class="kchip w"></span>')}${wdlRow("Mit Schwarz",G.filter(g=>g.color==="b"),'<span class="kchip b"></span>')}</div>
  <div><div class="exh"><span>Nach Bedenkzeit</span></div>${grp(g=>g.tc).slice(0,5).map(([k,a])=>wdlRow(k,a)).join("")}</div></div>
  <div class="exh" style="margin-top:12px"><span>Nach Eröffnung</span></div>${fams.map(([k,a])=>wdlRow(k,a)).join("")}
  <p class="hint" style="margin:8px 0 0"><span class="lgsw w"></span> Sieg <span class="lgsw d"></span> Remis <span class="lgsw l"></span> Niederlage · Prozent = Punkte pro Partie</p></div>`;
}
/* Genauigkeit eigener Partien aus Game Reviews */
function myReviews(){
  const out=[];const seen=new Set();
  CH.games.forEach(g=>{const R=REV[g.id];if(R&&R.acc&&!seen.has(g.id)){seen.add(g.id);out.push({R,c:g.color})}});
  st.glog.forEach(g=>{const R=REV[g.id];if(g.id&&R&&R.acc&&!seen.has(g.id)){seen.add(g.id);out.push({R,c:g.color})}});
  return out;
}
/* Stärken & Schwächen */
function radarData(){
  const ax=[];
  let mv=0,er=0;Object.values(st.op).forEach(s=>{mv+=s.mv;er+=s.err});
  ax.push({k:"op",t:"Eröffnungen",v:mv+er>=10?Math.round(100*(.6*mv/(mv+er)+.4*Math.min(1,cleanCount()/40))):null,go:"daily",gt:"Tagestraining"});
  ax.push({k:"tac",t:"Taktik",v:PZ.n>=10?Math.max(0,Math.min(100,Math.round((PZ.r-500)/(2300-500)*100))):null,go:"tactics",gt:"Taktik"});
  const rv=myReviews();const pe=rv.map(x=>x.R.phase&&x.R.phase[x.c]&&x.R.phase[x.c].e).filter(v=>v!=null);const endDone=Object.keys(st.ends).length/Math.max(1,ENDGAMES.length);
  ax.push({k:"end",t:"Endspiel",v:pe.length?Math.round(.5*endDone*100+.5*pe.reduce((a,b)=>a+b,0)/pe.length):endDone>0?Math.round(endDone*100):null,go:"end",gt:"Endspiele"});
  const acc=rv.map(x=>x.R.acc[x.c]).filter(v=>v!=null);
  ax.push({k:"acc",t:"Genauigkeit",v:acc.length?Math.round(acc.reduce((a,b)=>a+b,0)/acc.length):null,go:"analyse",gt:"Partie analysieren"});
  const losses=allGames().filter(g=>g.res==="loss");const tl=losses.filter(g=>/Zeit/.test(g.term)).length;
  ax.push({k:"time",t:"Zeiteinteilung",v:losses.length>=5?Math.max(0,Math.round(100-tl/losses.length*200)):null,go:"blitz",gt:"Blitz-Drill"});
  let act=0;for(let i=0;i<30;i++){if(st.days[dstr(new Date(Date.now()-i*DAY))])act++}
  ax.push({k:"cons",t:"Konstanz",v:Math.min(100,Math.round(act/20*100)),go:"daily",gt:"Tagestraining"});
  return ax;
}
function radarHtml(){
  const ax=radarData();const known=ax.filter(a=>a.v!=null);const N=ax.length,cx=170,cy=132,R=84;
  const P=(i,v)=>{const a=-Math.PI/2+i*2*Math.PI/N;return [cx+Math.cos(a)*R*v/100,cy+Math.sin(a)*R*v/100]};
  const ring=f=>ax.map((_,i)=>P(i,f).map(x=>x.toFixed(1)).join(",")).join(" ");
  const poly=ax.map((a,i)=>P(i,a.v==null?0:a.v).map(x=>x.toFixed(1)).join(",")).join(" ");
  const lab=ax.map((a,i)=>{const [x,y]=P(i,122);const anc=Math.abs(x-cx)<10?"middle":x>cx?"start":"end";return `<text x="${x.toFixed(1)}" y="${(y+3).toFixed(1)}" text-anchor="${anc}" class="rlab">${esc(a.t)}</text><text x="${x.toFixed(1)}" y="${(y+17).toFixed(1)}" text-anchor="${anc}" class="rval">${a.v==null?"–":a.v}</text>`}).join("");
  const svg=`<svg class="radar" viewBox="0 0 340 270" role="img" aria-label="Stärken und Schwächen">${[25,50,75,100].map(f=>`<polygon points="${ring(f)}" class="rg"/>`).join("")}${ax.map((_,i)=>{const [x,y]=P(i,100);return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="rg"/>`}).join("")}
    <polygon points="${poly}" class="rp"/>${ax.map((a,i)=>{if(a.v==null)return "";const [x,y]=P(i,a.v);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" class="rd" data-tip="${esc(a.t)}: <b>${a.v}</b> / 100"/>`}).join("")}${lab}</svg>`;
  const s=known.slice().sort((a,b)=>b.v-a.v);const best=s[0],worst=s[s.length-1];
  return `<div class="card"><div class="sec-h"><h3>Stärken und Schwächen</h3><small>0–100 · aus deinem Training und deinen Partien</small></div>
  <div class="rwrap2">${svg}<div class="rside">${known.length>=2?`<div class="rbox up"><small>Deine Stärke</small><b>${esc(best.t)}</b><span>${best.v} von 100</span></div><div class="rbox dn"><small>Hier lohnt sich Training</small><b>${esc(worst.t)}</b><span>${worst.v} von 100</span><button class="btn grn" data-rgo="${worst.go}">${esc(worst.gt)}</button></div>`:`<p class="hint">Noch zu wenig Daten. Trainiere ein paar Varianten und Taktikaufgaben, spiel Partien und analysiere sie – dann füllt sich das Diagramm.</p>`}
  ${ax.some(a=>a.v==null)?`<p class="hint" style="margin:0">„–“ heißt: noch keine Daten. ${ax.filter(a=>a.v==null).map(a=>a.t).join(", ")}.</p>`:""}</div></div></div>`;
}
/* Fehlermuster mit passender Übung */
function patterns(){
  const out=[];
  const losses=allGames().filter(g=>g.res==="loss");const tl=losses.filter(g=>/Zeit/.test(g.term)).length;
  if(losses.length>=5&&tl/losses.length>=.25)out.push({ic:"bolt",t:`${pctS(tl/losses.length)} deiner Niederlagen auf Zeit`,d:"Du brauchst zu lange für Standardzüge. Der Blitz-Drill macht die Eröffnung schneller.",go:"blitz",gt:"Blitz-Drill"});
  const th=Object.entries(PZ.themes).filter(([k,t])=>t.n>=5&&TTH[k]).map(([k,t])=>({k,r:t.ok/t.n,n:t.n})).sort((a,b)=>a.r-b.r)[0];
  if(th&&th.r<.62)out.push({ic:"target",t:`${TTH[th.k][0]}: nur ${pctS(th.r)} gelöst`,d:`Von ${th.n} Aufgaben mit diesem Motiv hast du ${Math.round(th.r*th.n)} geschafft. Ein Themen-Pfad übt genau das.`,go:"theme:"+th.k,gt:"Pfad üben"});
  const rv=myReviews();if(rv.length>=2){const ph={o:[],m:[],e:[]};rv.forEach(x=>{const p=x.R.phase&&x.R.phase[x.c];if(p)["o","m","e"].forEach(k=>{if(p[k]!=null)ph[k].push(p[k])})});
    const av=Object.entries(ph).filter(([k,a])=>a.length).map(([k,a])=>({k,v:a.reduce((x,y)=>x+y,0)/a.length})).sort((a,b)=>a.v-b.v);
    if(av.length>=2&&av[0].v<av[av.length-1].v-5){const nm={o:"in der Eröffnung",m:"im Mittelspiel",e:"im Endspiel"}[av[0].k];out.push({ic:"search",t:`Am ungenauesten spielst du ${nm}`,d:`Ø ${Math.round(av[0].v)} % Genauigkeit gegenüber ${Math.round(av[av.length-1].v)} % in deiner besten Phase (aus ${rv.length} analysierten Partien).`,go:av[0].k==="e"?"end":av[0].k==="o"?"daily":"tactics",gt:av[0].k==="e"?"Endspiele":av[0].k==="o"?"Tagestraining":"Taktik"})}
    let bl=0,mi=0;rv.forEach(x=>x.R.cls.forEach((c,i)=>{if((i%2===0?"w":"b")!==x.c)return;if(c==="blun")bl++;else if(c==="mist")mi++}));
    if(bl/rv.length>=1.5)out.push({ic:"mistake",t:`Ø ${(bl/rv.length).toFixed(1)} Patzer pro Partie`,d:"Ein Blunder-Check vor jedem Zug hilft: Was greift sein letzter Zug an, was hängt bei mir? Taktik schärft den Blick.",go:"tactics",gt:"Taktik"})}
  const rows=ALL.filter(o=>st.op[o.id]&&st.op[o.id].mv+st.op[o.id].err>=10).map(o=>({o,a:st.op[o.id].mv/(st.op[o.id].mv+st.op[o.id].err)})).sort((a,b)=>a.a-b.a)[0];
  if(rows&&rows.a<.8)out.push({ic:"book",t:`${rows.o.name}: ${pctS(rows.a)} Trefferquote`,d:"In dieser Eröffnung liegst du am häufigsten daneben. Spiel die Varianten noch einmal mit Lernmodus.",go:"op:"+rows.o.id,gt:"Üben"});
  const hard=Object.values(st.hard).filter(H=>byId(H.id)).sort((a,b)=>b.n-a.n)[0];
  if(hard&&hard.n>=3)out.push({ic:"target",t:`${hard.n}× falsch in ${byId(hard.id).name}`,d:`Nach ${hard.pre.length?fmtMoves(hard.pre.slice(-4),hard.pre.length-Math.min(4,hard.pre.length)):"dem ersten Zug"} spielst du oft den falschen Zug.`,go:"hard:"+byId(hard.id).id+"|"+hard.pre.join(" "),gt:"Stellung üben"});
  const mine=S.puz.filter(p=>!p.solved||p.solved<2).length;
  if(mine>=3)out.push({ic:"mistake",t:`${mine} Fehler aus deinen Partien warten`,d:"Stellungen, in denen du in echten Partien falsch gespielt hast – jetzt mit Lösung.",go:"mine",gt:"Fehler üben"});
  return out.slice(0,4);
}
function patternsHtml(){
  const p=patterns();
  return `<div class="card"><div class="sec-h"><h3>Fehlermuster</h3><small>was dir am meisten Punkte kostet</small></div>
  ${p.length?`<div class="pats">${p.map((x,i)=>`<div class="pat"><span class="pat-ic">${NI[x.ic]||NI.target}</span><span><b>${esc(x.t)}</b><small>${esc(x.d)}</small></span><button class="btn" data-pat="${i}">${esc(x.gt)}</button></div>`).join("")}</div>`:`<p class="hint" style="margin:0">Noch keine auffälligen Muster. Je mehr du trainierst, spielst und analysierst, desto genauer wird diese Auswertung.</p>`}</div>`;
}
function patGo(go){
  if(go==="blitz"||go==="daily"||go==="mine"){startSession(go);return}
  if(go.indexOf("theme:")===0){const k=go.slice(6);const ti=TIERS.findIndex(T=>T.keys.indexOf(k)>=0);if(ti<0||tierUnlocked(ti))tacticSession("theme",k);else showView("tactics");return}
  if(go.indexOf("op:")===0){selectOpening(byId(go.slice(3)));return}
  if(go.indexOf("hard:")===0){const [id,pre]=go.slice(5).split("|");startPosition(byId(id),pre?pre.split(" "):[]);return}
  showView(go);
}
/* Lernkurve */
function curveHtml(){
  const B=[["≤ 1 Tag",0,1.5],["2–7 Tage",1.5,7.5],["8–30 Tage",7.5,30.5],["über 30 Tage",30.5,1e9]];
  const ret=B.map(([t,a,b])=>{const xs=st.rlog.filter(r=>r[1]>a&&r[1]<=b);return {t,n:xs.length,v:xs.length?xs.filter(r=>r[2]).length/xs.length:null}});
  let nw=0,le=0,ge=0,si=0;ALL.forEach(o=>o.lines.forEach((l,i)=>{const s=S.srs[lk(o.id,i)];if(!s)nw++;else if(s.iv<7)le++;else if(s.iv<21)ge++;else si++}));const tot=nw+le+ge+si||1;
  const d0=startOfDay(Date.now());const fc=Array(14).fill(0);Object.values(S.srs).forEach(s=>{if(!s||!s.due)return;const i=Math.max(0,Math.floor((s.due-d0)/DAY));if(i<14)fc[i]++});const mx=Math.max(1,...fc);
  const stat=[["Neu",nw,"st0"],["Lernend",le,"st1"],["Gefestigt",ge,"st2"],["Sicher",si,"st3"]];
  return `<div class="card"><div class="sec-h"><h3>Lernkurve</h3><small>wie gut die Varianten im Gedächtnis bleiben</small></div>
  <div class="wgrid"><div><div class="exh"><span>Noch gewusst nach …</span></div>
    ${ret.map(r=>`<div class="wrow"><span class="wl">${r.t}<small>${r.n} Wiederholungen</small></span><span class="rbar"><i style="width:${r.v==null?0:r.v*100}%"></i></span><b>${r.n>=3?pctS(r.v):"–"}</b></div>`).join("")}
    <p class="hint" style="margin:6px 0 0">${st.rlog.length<10?"Wird mit jeder Wiederholung genauer.":"Je länger die Pause, desto wichtiger die Wiederholung zum richtigen Zeitpunkt."}</p></div>
  <div><div class="exh"><span>Stand aller ${tot} Varianten</span></div><div class="stk">${stat.map(s=>s[1]?`<i class="${s[2]}" style="flex:${s[1]}" data-tip="${s[0]}: <b>${s[1]}</b>"></i>`:"").join("")}</div>
    <div class="stk-l">${stat.map(s=>`<span><i class="${s[2]}"></i>${s[0]} <b>${s[1]}</b></span>`).join("")}</div>
    <p class="hint" style="margin:6px 0 0">Lernend: Abstand unter 7 Tagen · Gefestigt: bis 3 Wochen · Sicher: 3 Wochen und mehr.</p></div></div>
  <div class="exh" style="margin-top:12px"><span>Wiederholungen der nächsten 14 Tage</span></div>
  ${fc.some(n=>n)?"":`<p class="hint" style="margin:0 0 6px">Noch keine Wiederholungen geplant – sie entstehen, sobald du Varianten trainierst.</p>`}<div class="fcast">${fc.map((n,i)=>`<span class="fc" data-tip="${i===0?"Heute":fmtD(d0+i*DAY)}: <b>${n}</b> fällig"><i style="height:${n?Math.max(6,n/mx*100):0}%"></i><small>${i===0?"heute":new Date(d0+i*DAY).getDate()}</small></span>`).join("")}</div></div>`;
}
/* Wochenbericht */
function weekReport(recent){
  gxRoll();const h=GX.hist[0];if(!h)return null;const ws=h.s||weekStart()-7*DAY,we=ws+7*DAY;if(recent&&ws!==weekStart()-7*DAY)return null;
  let units=0,days=0;for(let i=0;i<7;i++){const n=st.days[dstr(new Date(ws+i*DAY+12*3600000))]||0;units+=n;if(n)days++}
  let prevU=0;for(let i=0;i<7;i++)prevU+=st.days[dstr(new Date(ws-7*DAY+i*DAY+12*3600000))]||0;
  const tAt=t=>{const p=PZ.hist.filter(x=>x[0]<=t).pop();return p?p[1]:null};const ta=tAt(ws),tb=tAt(we);
  const gs=allGames().filter(g=>g.t>=ws&&g.t<we);const w=gs.filter(g=>g.res==="win").length;
  const ps=GX.prevSnap,cs=GX.snap;const newClean=ps&&cs&&ps.id===h.id?Math.max(0,cs.clean-ps.clean):null;
  const known=radarData().filter(a=>a.v!=null).sort((a,b)=>a.v-b.v)[0];
  return {id:h.id,xp:h.xp,lg:h.lg,units,prevU,days,tac:ta!=null&&tb!=null?tb-ta:null,tacNow:tb,games:gs.length,wins:w,newClean,tip:known};
}
function reportHtml(r,dismiss){
  if(!r)return "";const d=r.units-r.prevU;
  return `<section class="card wrep"><div class="sec-h"><h3>Wochenbericht · KW ${weekNo(r.id)}</h3>${dismiss?`<button class="linkb" data-repx>Ausblenden</button>`:""}</div>
  <div class="kpis">${[["Trainiert",r.units,`an ${r.days} von 7 Tagen`],["XP",r.xp,`${LEAGUES[r.lg|0][0]}-Liga`],["Taktik",r.tac==null?"–":(r.tac>0?"+":"")+r.tac,r.tacNow?`jetzt ${r.tacNow}`:"keine Aufgaben"],["Partien",r.games,r.games?`${r.wins} gewonnen`:"keine gespielt"]].map(k=>`<div class="kpi"><small>${k[0]}</small><b>${k[1]}</b><span>${k[2]}</span></div>`).join("")}</div>
  <p class="wrep-t">${r.prevU||r.units?`${d>0?`${d} Einheiten mehr als in der Vorwoche. `:d<0?`${-d} Einheiten weniger als in der Vorwoche. `:"Genauso viel wie in der Vorwoche. "}`:""}${r.newClean!=null&&r.newClean>0?`Du hast ${r.newClean} ${r.newClean===1?"Variante":"Varianten"} neu fehlerfrei gelernt. `:""}${r.days>=5?"Starke Woche – fast jeden Tag trainiert.":r.days>=3?"Gute Woche. Mit ein, zwei Tagen mehr wird die Wiederholung noch wirksamer.":"Diese Woche wenig trainiert. Schon zehn Minuten am Tag reichen, damit die Varianten sitzen."}
  ${r.tip?` Vorschlag für diese Woche: <b>${esc(r.tip.t)}</b> – dort hast du am meisten Luft nach oben.`:""}</p>
  <div class="btnrow wrep-a">${r.tip?`<button class="btn grn" data-rgo="${r.tip.go}">${esc(r.tip.gt)}</button>`:""}<button class="btn" data-recap>Rückblick als Bild</button></div></section>`;
}
/* ===== Wochenrückblick: die Vorwoche als Karte im Stil deines Trainers – zum Teilen als Bild ===== */
/* „in der Piratenbucht“, „im Vulkan“: Weltnamen mit Artikel in den Dativ setzen */
const inWorld=n=>{const m=String(n).match(/^(Der|Die|Das) (.*)$/);if(!m)return "in "+n;const rest=m[1]==="Die"?m[2].replace(/^([a-zäöüß]+e)\b/,"$1n"):m[2];return (m[1]==="Die"?"in der ":"im ")+rest};
function dqAdd(ok,er){if(!st.dq||typeof st.dq!=="object"||Array.isArray(st.dq))st.dq={};const d=today(),q=st.dq[d]||(st.dq[d]=[0,0]);q[0]+=ok;q[1]+=er;
  const ks=Object.keys(st.dq);if(ks.length>70)ks.sort().slice(0,ks.length-70).forEach(k=>delete st.dq[k])}
function wlog(k,x){if(!Array.isArray(st.wlog))st.wlog=[];st.wlog.push({t:Date.now(),k,x});if(st.wlog.length>40)st.wlog=st.wlog.slice(-40);saveStats()}
const RECAP_SAY={
  mila:["Was für eine Woche! So wächst dein Repertoire ganz von allein.","Schön dabeigeblieben – noch ein, zwei Tage mehr, und es sitzt richtig.","Kleine Pause? Kein Problem. Zehn Minuten am Tag reichen schon."],
  bruno:["Stein auf Stein – dieses Fundament hält.","Der Rohbau steht. Jetzt regelmäßig weitermauern.","Die Baustelle ruht. Morgen setzen wir den nächsten Stein."],
  greta:["Deine Verteidigung ist eine Festung geworden.","Die Mauern stehen – halte die Wache aufrecht.","Eine Festung ohne Wache fällt. Zeit für die nächste Runde."],
  konrad:["Volle Fahrt voraus – was für ein Kurs!","Guter Wind diese Woche. Halte den Kurs.","Flaute an Bord. Setz die Segel, Matrose!"],
  linus:["Jeder Pfeil ein Treffer – stark!","Gut gezielt. Mit mehr Übung triffst du immer.","Der Bogen ruht. Spann ihn wieder!"],
  rex:["Was für ein Feuer! Weiter so!","Die Glut glimmt – jetzt nachlegen!","Nur noch Funken? Zeit, das Feuer neu zu entfachen!"],
  nova:["Mission erfüllt: Rekordwoche!","Systeme stabil. Weiter auf Kurs.","Energie niedrig. Zeit zum Aufladen – starte die nächste Mission."],
  ilka:["Messwerte im roten Bereich – im besten Sinne!","Solide Werte. Die Temperatur steigt.","Der Vulkan schläft. Weck ihn mit ein paar Varianten."],
  rika:["Arrr, was für eine Beute diese Woche!","Gute Fahrt, Matrose – die Schatzkarte füllt sich.","Der Anker liegt zu lange. Lichte ihn!"]
};
function weekRecap(recent){
  const r=weekReport(recent);if(!r)return null;const h=GX.hist[0],ws=h.s||weekStart()-7*DAY,we=ws+7*DAY;
  let ok=0,er=0;for(let i=0;i<7;i++){const q=st.dq&&st.dq[dstr(new Date(ws+i*DAY+12*3600000))];if(q){ok+=q[0];er+=q[1]}}
  const c=st.crsLast?COURSES.find(x=>x.id===st.crsLast)||null:null,co=c?coIdOf(c):"mila";
  const ev=(Array.isArray(st.wlog)?st.wlog:[]).filter(e=>e&&e.t>=ws&&e.t<we),best=["rank","duel","plan","badge"].map(k=>ev.filter(e=>e.k===k).pop()).find(Boolean);
  const hi=best?best.x:r.newClean>0?`${nV(r.newClean,"Variante","Varianten")} neu fehlerfrei gelernt`:r.tac>0?`Taktik-Wertung um ${r.tac} Punkte gesteigert`:r.wins>0?`${nV(r.wins,"Partie","Partien")} gewonnen`:r.units?`${varV(r.units)} an ${nV(r.days,"Tag","Tagen")} geübt`:"Eine ruhige Woche";
  let goal="";if(c){const rk=crsRank(c);if(rk.next)goal=`Noch ${varV(rk.left)} bis „${rk.next}“ ${inWorld(worldOf(c).name)}.`}
  if(!goal){const d=dueKeys().length;goal=d?`${varV(d)} ${d===1?"ist":"sind"} fällig – zehn Minuten am Tag reichen.`:r.tip?`Schwerpunkt: ${r.tip.t}.`:"An fünf Tagen trainieren – dann sitzen die Varianten."}
  const d0=new Date(ws),d1=new Date(we-DAY),fm=(d,o)=>d.toLocaleDateString("de-DE",o);
  const range=d0.getMonth()===d1.getMonth()?`${d0.getDate()}.–${fm(d1,{day:"numeric",month:"long"})}`:`${fm(d0,{day:"numeric",month:"long"})} – ${fm(d1,{day:"numeric",month:"long"})}`;
  const lvl=r.days>=5?0:r.days>=3?1:2;
  return Object.assign({},r,{acc:ok+er?ok/(ok+er):null,co,cid:c?c.id:null,hi,goal,say:(RECAP_SAY[co]||RECAP_SAY.mila)[lvl],lvl,range,wk:weekNo(r.id)});
}
/* Die Karte: Formen, Szene und Trainer als SVG, die Schrift zeichnet das Canvas (wie bei der Urkunde) */
async function recapPng(R){
  const W=800,H=1000,K=2,co=R.co,bg=COACHES[co].bg,wf=(WFONT[co]||WFONT.mila),tx=COACHES[co].bg[0];
  const scene=R.cid&&SCENES[R.cid]?SCENES[R.cid]():SECT_SCN.league();
  const box=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${tx}" fill-opacity=".09"/>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <defs><style>${SCN_CSS}</style><linearGradient id="rcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="#F6F1E7"/><rect width="${W}" height="470" fill="url(#rcg)"/>
    <g opacity=".42"><svg x="250" y="30" width="550" height="344" viewBox="0 0 320 200" preserveAspectRatio="xMaxYMid meet">${scene}</svg></g>
    <path d="M60 300h372a22 22 0 0 1 22 22v62a22 22 0 0 1-22 22H128l-30 26 4-26H60a22 22 0 0 1-22-22v-62a22 22 0 0 1 22-22z" fill="#FFFFFF" fill-opacity=".94"/>
    <svg x="${W-312}" y="164" width="290" height="319" viewBox="0 0 200 220">${TR_ART[co](R.lvl===2?"happy":"joy",true)}</svg>
    <rect x="32" y="452" width="${W-64}" height="${H-484}" rx="30" fill="#FFFFFF"/>
    ${box(60,482,326,118)}${box(414,482,326,118)}${box(60,616,326,118)}${box(414,616,326,118)}
    <circle cx="80" cy="770" r="11" fill="${bg[1]}"/><circle cx="80" cy="882" r="11" fill="${bg[0]}"/>
  </svg>`;
  const fams=["Rubik",wf.f];await Promise.all(fams.map(f=>document.fonts&&document.fonts.load(`700 40px "${f}"`).catch(()=>null)));
  const url=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));
  const img=new Image();await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});
  const cv=document.createElement("canvas");cv.width=W*K;cv.height=H*K;const x=cv.getContext("2d");
  await new Promise(r=>setTimeout(r,40));x.drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(url);x.scale(K,K);
  const F=(w,z,f)=>`${w} ${z}px "${f||"Rubik"}", system-ui, sans-serif`;
  const put=(s,X,Y,font,col,al)=>{x.font=font;x.fillStyle=col;x.textAlign=al||"left";x.fillText(s,X,Y)};
  const wrap=(s,maxW,font,n)=>{x.font=font;const ws=String(s).split(" ");const L=[];let cur="";for(const w of ws){const t=cur?cur+" "+w:w;if(x.measureText(t).width>maxW&&cur){L.push(cur);cur=w}else cur=t}if(cur)L.push(cur);
    if(L.length>n){L.length=n;let l=L[n-1];while(l.length>1&&x.measureText(l+" …").width>maxW)l=l.slice(0,-1);L[n-1]=l.replace(/[\s,.;:–-]+$/,"")+" …"}return L};
  put("Wochenrückblick",60,92,F(700,26),"rgba(255,255,255,.82)");
  put(`KW ${R.wk}`,58,186,F(700,Math.round(88*Math.min(1.25,wf.s)),wf.f),"#FFFFFF");
  put(R.range,60,236,F(500,28),"rgba(255,255,255,.9)");
  put(`mit ${TRAINER[co].full}`,60,272,F(600,22),"rgba(255,255,255,.75)");
  wrap(`„${R.say}“`,368,F(600,22),3).forEach((l,i)=>put(l,64,336+i*29,F(600,22),"#2A2622"));
  const kp=[[String(R.units),"Varianten geübt"],[R.acc==null?"–":pct(R.acc),"Trefferquote"],[`${R.days}/7`,"Trainingstage"],[String(R.xp),"XP gesammelt"]];
  kp.forEach(([v,l],i)=>{const X=(i%2?414:60)+26,Y=(i<2?482:616);put(v,X,Y+66,F(800,52),tx);put(l,X,Y+100,F(600,21),"#6B6459")});
  put("Höhepunkt der Woche",104,778,F(800,22),tx);
  wrap(R.hi,620,F(600,27),2).forEach((l,i)=>put(l,104,816+i*34,F(600,27),"#2A2622"));
  put("Ziel für nächste Woche",104,890,F(800,22),tx);
  wrap(R.goal,620,F(500,24),2).forEach((l,i)=>put(l,104,926+i*30,F(500,24),"#2A2622"));
  put("Zugzwang · Eröffnungstrainer",W/2,H-10,F(600,17),"#A79F92","center");
  return await new Promise(r=>cv.toBlob(r,"image/png"));
}
async function recapShare(blob,R){
  const name=`Wochenrückblick-KW${R.wk}.png`;
  try{const file=new File([blob],name,{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:`Mein Wochenrückblick KW ${R.wk}`});return "shared"}}catch(e){if(e&&e.name==="AbortError")return "abort"}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);return "saved";
}
function recapShow(R){
  if(!R){toast("Für die letzte Woche gibt es noch keinen Rückblick.");return}
  crsOverlay(()=>{
    const el=document.createElement("div");el.className="rpt-bk rcp-bk";const co=R.co;
    el.innerHTML=`<div class="rcp co-${co}" role="dialog" aria-modal="true" aria-label="Wochenrückblick KW ${R.wk}">
      <div class="rcp-card"><div class="rcp-sk" aria-hidden="true"><span>${coachSvg(co,"joy")}</span><small>Dein Rückblick wird gezeichnet …</small></div></div>
      <p class="rcp-alt">KW ${R.wk}: ${varV(R.units)} geübt, ${R.acc==null?"":`Trefferquote ${pct(R.acc)}, `}${R.days} von 7 Tagen, ${R.xp} XP. Höhepunkt: ${esc(R.hi)}. Ziel: ${esc(R.goal)}</p>
      <div class="rpt-acts"><button class="btn" data-rc="x">Schließen</button><button class="btn grn" data-rc="share" data-focus disabled>${navigator.canShare?"Teilen":"Als Bild speichern"}</button></div></div>`;
    el.querySelector('[data-rc="x"]').onclick=crsOvClose;el.addEventListener("click",e=>{if(e.target===el)crsOvClose()});
    const sb=el.querySelector('[data-rc="share"]');let blob=null;
    recapPng(R).then(b=>{blob=b;if(!b||!el.isConnected)return;const u=URL.createObjectURL(b);const card=el.querySelector(".rcp-card");
      card.innerHTML=`<img class="rcp-img" src="${u}" alt="Wochenrückblick KW ${R.wk} mit ${esc(TRAINER[co].full)}">`;sb.disabled=false}).catch(()=>{const sk=el.querySelector(".rcp-sk small");if(sk)sk.textContent="Das Bild konnte nicht gezeichnet werden.";});
    sb.onclick=async()=>{if(!blob)return;sb.disabled=true;const r=await recapShare(blob,R);sb.disabled=false;if(r==="saved")toast("Bild gespeichert")};
    return el});
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-recap]");if(b){e.preventDefault();recapShow(weekRecap())}});
/* Das Dashboard */
renderStats=function(v){
  checkBadges();gxRoll();const tot=totalLines(),cl=cleanCount();const lv=gxLevel(GX.xp),a=gxLvXp(lv),b=gxLvXp(lv+1);
  let mv=0,er=0;Object.values(st.op).forEach(s=>{mv+=s.mv;er+=s.err});
  const rows=ALL.filter(o=>st.op[o.id]&&(st.op[o.id].att||st.op[o.id].err)).map(o=>{const s=st.op[o.id];return {o,s,acc:s.mv+s.err?s.mv/(s.mv+s.err):1,cl:o.lines.filter((l,i)=>P(o.id,i)===2).length}}).sort((x,y)=>x.acc-y.acc);
  const hard=Object.entries(st.hard).filter(([k,H])=>byId(H.id)).sort((x,y)=>y[1].n-x[1].n).slice(0,8);
  const G=allGames();const gw=G.filter(g=>g.res==="win").length;
  const k=(t,bv,s,cls)=>`<div class="kpi${cls?" "+cls:""}"><small>${t}</small><b>${bv}</b>${s?`<span>${s}</span>`:""}</div>`;
  v.innerHTML=`<div class="kpis k6">${k("Level",lv,`${GX.xp-a}/${b-a} XP · ${LEAGUES[GX.lg][0]}-Liga`)}${k("Serie",streakNow(),`Rekord ${S.streak.best||0} · Schutz ${GX.freeze}/2`)}${k("Varianten",cl,`von ${tot} fehlerfrei`)}${k("Trefferquote",mv+er?pctS(mv/(mv+er)):"–",mv+er?`${mv} richtig · ${er} falsch`:"noch keine Züge")}${k("Taktik",PZ.r,PZ.n?`${PZ.n} Aufgaben · ${pctS(PZ.ok/PZ.n)} gelöst`:"noch keine Aufgaben")}${k("Partien",G.length,G.length?`${gw} gewonnen · ${pctS(gw/G.length)}`:"noch keine")}</div>
  ${reportHtml(weekReport(),false)}
  ${ratingChartHtml()}
  ${heatHtml()}
  ${radarHtml()}
  ${strengthHtml()}
  ${winHtml()}
  ${patternsHtml()}
  ${curveHtml()}
  <div class="sec-h"><h3>Schwierigste Züge</h3><small>Wo du am häufigsten falsch ziehst</small></div>
  ${hard.length?`<div class="card cl">${hard.map(([key,H])=>{const o=byId(H.id);const bm=bookMovesIn(o,H.pre);return `<button class="ci" data-hard="${esc(key)}"><span class="kchip ${o.side}"></span><span class="ci-t"><b>${esc(o.name)}</b><small>${H.pre.length?esc(fmtMoves(H.pre.slice(-4),H.pre.length-Math.min(4,H.pre.length))):"Startstellung"} → richtig: ${esc(bm.map(de).join(" / ")||"–")}</small></span><span class="ci-n">${H.n}×</span></button>`}).join("")}</div>`:`<p class="hint">Noch keine Fehler gesammelt.</p>`}
  <div class="sec-h"><h3>Eröffnungen</h3><small>sortiert nach Trefferquote</small></div>
  ${rows.length?`<div class="card cl">${rows.map(r=>`<button class="ci" data-op="${r.o.id}"><span class="kchip ${r.o.side}"></span><span class="ci-t"><b>${esc(r.o.name)}</b><small>${r.cl}/${r.o.lines.length} fehlerfrei · ${r.s.att} Durchgänge</small></span><span class="ci-n ${r.acc<.7?"score-bad":r.acc>.9?"score-good":""}">${pctS(r.acc)}</span></button>`).join("")}</div>`:`<p class="hint">Noch nichts trainiert.</p>`}`;
  vizTip(v);wireRatingChart(v);
  v.querySelectorAll("[data-rng]").forEach(x=>x.onclick=()=>{STV.range=+x.dataset.rng;store.set("et-stv",STV);renderStats(v)});
  v.querySelectorAll("[data-src2]").forEach(x=>x.onclick=()=>{STV.src=x.dataset.src2;store.set("et-stv",STV);renderStats(v)});
  const pats=patterns();v.querySelectorAll("[data-pat]").forEach(x=>x.onclick=()=>patGo(pats[+x.dataset.pat].go));
  v.querySelectorAll("[data-rgo]").forEach(x=>x.onclick=()=>patGo(x.dataset.rgo));
  v.querySelectorAll("[data-op]").forEach(x=>x.onclick=()=>selectOpening(byId(x.dataset.op)));
  v.querySelectorAll("[data-hard]").forEach(x=>x.onclick=()=>{const H=st.hard[x.dataset.hard];if(H)startPosition(byId(H.id),H.pre)});
};

/* ---- Startseite ergänzen: Level-Leiste, Tagesaufgaben, Wochenbericht ---- */
const _renderHome=renderHome;
renderHome=function(){
  _renderHome();const v=$("v-home");if(!v)return;gxRoll();
  const lv=gxLevel(GX.xp),a=gxLvXp(lv),b=gxLvXp(lv+1);const L=LEAGUES[GX.lg];
  const bar=`<button class="lvbar" data-go2="league">${SHIELD(L[1],30)}<span class="lv-t"><b>Level ${lv}</b><small>${L[0]}-Liga · ${GX.wk.xp} XP diese Woche${GX.freeze?` · ${GX.freeze}× Serienschutz`:""}</small><span class="pbar2"><i style="width:${(GX.xp-a)/Math.max(1,b-a)*100}%"></i></span></span><span class="ci-go">›</span></button>`;
  const head=v.querySelector(".home-h");if(head)head.insertAdjacentHTML("afterend",bar);
  const today=v.querySelector(".today");if(today)today.insertAdjacentHTML("afterend",questsHtml());
  const r=GX.repSeen!==GX.wk.id?weekReport(true):null;if(r&&head){const lb=v.querySelector(".lvbar");(lb||head).insertAdjacentHTML("afterend",reportHtml(r,true))}
  v.querySelectorAll("[data-go2]").forEach(x=>x.onclick=()=>showView(x.dataset.go2));
  v.querySelectorAll("[data-qgo]").forEach(x=>x.onclick=()=>qGo(x.dataset.qgo));
  v.querySelectorAll("[data-rgo]").forEach(x=>x.onclick=()=>patGo(x.dataset.rgo));
  const rx=v.querySelector("[data-repx]");if(rx)rx.onclick=()=>{GX.repSeen=GX.wk.id;saveGX();renderHome()};
  if(r&&GX.recapSeen!==r.id&&(r.units||r.xp)){GX.recapSeen=r.id;saveGX();setTimeout(()=>{if(curView==="home"&&!crsOv&&!document.querySelector(".trv"))recapShow(weekRecap(true))},1100)}
};

/* ---- Eigene Partien als PGN, Admin-Sicherung ---- */
function pgnOf(g){const res=g.res==="draw"?"1/2-1/2":(g.res==="win")===(g.color==="w")?"1-0":"0-1";const me="Ich",op2=g.opp||(g.src==="online"?"Gegner":"Computer");const d=new Date(g.t);
  const mv=(g.moves||"").split(" ").filter(Boolean).map((m,i)=>(i%2===0?(i/2+1)+". ":"")+m).join(" ");
  return `[Event "Zugzwang ${g.src==="online"?"Online":"Computer"}"]\n[Site "${location.origin}"]\n[Date "${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}"]\n[White "${g.color==="w"?me:op2}"]\n[Black "${g.color==="w"?op2:me}"]\n[Result "${res}"]\n${g.fam?`[Opening "${g.fam.replace(/"/g,"'")}"]\n`:""}\n${mv} ${res}\n`}
function download(name,txt,type){const blob=new Blob([txt],{type:type||"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
const _renderSync=renderSync;
renderSync=function(v){
  _renderSync(v);const n=st.glog.filter(g=>g.moves).length;
  v.insertAdjacentHTML("beforeend",`<div class="card"><h3>Meine Partien als PGN</h3><p class="hint" style="margin:0 0 10px">${n} Partien gegen den Computer und online. PGN lässt sich in Chess.com, Lichess oder ChessBase öffnen.</p><button class="btn" id="pgnAll" ${n?"":"disabled"}>PGN herunterladen</button></div>`);
  const b=$("pgnAll");if(b)b.onclick=()=>download("zugzwang-partien-"+today()+".pgn",st.glog.filter(g=>g.moves).map(pgnOf).join("\n"),"application/x-chess-pgn");
};
function adminBackup(){
  if(typeof ADM==="undefined"||!ADM.users)return;const data={app:"zugzwang-admin",date:new Date().toISOString(),users:ADM.users,games:ADM.games,usernames:ADM.names};
  download("zugzwang-sicherung-"+today()+".json",JSON.stringify(data),"application/json");
}
function adminPgn(){
  if(typeof ADM==="undefined"||!ADM.games)return;const nm=uid=>{const u=ADM.users.find(x=>x.id===uid);return u?u.name:"?"};
  const txt=ADM.games.filter(g=>(g.moves||[]).length&&g.result&&g.result!=="-").map(g=>{const d=new Date(g.created||0);const mv=g.moves.map((m,i)=>(i%2===0?(i/2+1)+". ":"")+m).join(" ");
    return `[Event "Zugzwang Online"]\n[Date "${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}"]\n[White "${nm(g.white)}"]\n[Black "${nm(g.black)}"]\n[Result "${g.result}"]\n[TimeControl "${tcTxt(g.tc)}"]\n\n${mv} ${g.result}\n`}).join("\n");
  download("zugzwang-alle-partien-"+today()+".pgn",txt,"application/x-chess-pgn");
}

/* ---- Start: Wochenwechsel, Serienschutz, Ligen abrechnen ---- */
gxRoll();applyFreeze();ensureQuests();
setTimeout(()=>{gxSettle()},5000);

/* ================= Taktik-Verlauf ================= */
var tacTab="train";
const THV={res:"all",th:"",n:30};
/* Jede Aufgabe kompakt speichern: Stellung vor dem letzten Gegnerzug, dieser Zug und die Lösung – genug, um sie später nachzuspielen */
function tlogAdd(p,ok,o){try{
  const pre=p.pre||[];const c=new Chess(p.fen||undefined);for(let i=0;i<pre.length-1;i++){if(!c.move(pre[i]))return}
  PZ.log.push({id:String(p.id||""),t:Date.now(),ok:ok?1:0,pr:p.rating||null,r:o.rated?PZ.r:null,d:o.rated?o.d:0,x:o.x||0,ms:p._t0?Math.min(3600000,Date.now()-p._t0):null,k:o.k||"",th:(p.themes||[]).slice(0,6),f:c.fen(),lm:pre.length?pre[pre.length-1]:null,sol:(p.sol||[]).slice(),g:p.game||"",h:usedHelp?1:0,side:p.side||""});
  if(PZ.log.length>300)PZ.log.splice(0,PZ.log.length-300);
}catch(e){}}
function tlogPuzzle(e){return {id:e.id,fen:e.f,pre:e.lm?[e.lm]:[],sol:e.sol,rating:e.pr||1500,themes:e.th||[],game:e.g,side:e.side||(new Chess(e.f).turn()==="w"?"b":"w")}}
const TKIND={rated:"Wertung",theme:"Pfad",opening:"Eröffnung",fails:"Fehler",sprint:"Rush",sprint5:"Rush",survival:"Rush",hist:"Verlauf"};
const fmtDur=ms=>{if(ms==null)return "–";const s=Math.round(ms/1000);return s<60?s+" s":Math.floor(s/60)+":"+String(s%60).padStart(2,"0")+" min"};
/* Mini-Brett: Schachbrett per CSS, nur die Figuren als Elemente */
function thumbHtml(fen,lm,flip){
  let c;try{c=new Chess(fen)}catch(e){return ""}let from=null,to=null;if(lm){const m=c.move(lm);if(m){from=m.from;to=m.to}}
  const rows=c.fen().split(" ")[0].split("/");let h="";
  rows.forEach((r,ri)=>{let fi=0;for(const ch of r){if(/\d/.test(ch)){fi+=+ch;continue}const col=ch===ch.toUpperCase()?"w":"b";const x=flip?7-fi:fi,y=flip?7-ri:ri;h+=`<span class="pp ${col}${ch.toLowerCase()}" style="left:${x*12.5}%;top:${y*12.5}%"></span>`;fi++}});
  const hl=sq=>{if(!sq)return "";const fi=sq.charCodeAt(0)-97,ri=8-(+sq[1]);const x=flip?7-fi:fi,y=flip?7-ri:ri;return `<i style="left:${x*12.5}%;top:${y*12.5}%"></i>`};
  return `<span class="thumb" aria-hidden="true">${hl(from)}${hl(to)}${h}</span>`;
}
function tacTabsHtml(){return `<div class="seg tac-tabs" role="tablist"><button data-tt="train" aria-pressed="${tacTab!=="hist"}">Training</button><button data-tt="hist" aria-pressed="${tacTab==="hist"}">Verlauf${PZ.log.length?` · ${PZ.log.length}`:""}</button></div>`}
function wireTacTabs(v){v.querySelectorAll("[data-tt]").forEach(b=>b.onclick=()=>showView(b.dataset.tt==="hist"?"tactics:hist":"tactics"))}
function tlogRow(e,i){
  const flip=(e.side||(new Chess(e.f).turn()==="w"?"b":"w"))==="b";
  const ths=(e.th||[]).map(t=>TTH[t]&&TTH[t][0]).filter(Boolean).slice(0,2).join(" · ");
  const dl=e.r!=null?`<b class="${e.d>0?"up":e.d<0?"down":""}">${e.d>0?"+":""}${e.d}</b><small>${e.r}</small>`:`<b class="mut">–</b><small>ohne Wertung</small>`;
  return `<div class="thr${e.ok?" ok":" no"}"><button class="th-main" data-tre="${i}" aria-label="Aufgabe ${esc(String(e.pr||""))} nochmal spielen">${thumbHtml(e.f,e.lm,flip)}
    <span class="th-t"><span class="th-res"><i class="th-ic">${e.ok?"✓":"✕"}</i><b>${e.ok?"Gelöst":"Nicht gelöst"}</b>${e.h?'<em>mit Hinweis</em>':""}</span><small>Aufgabe ${e.pr||"–"}${ths?" · "+esc(ths):""}</small><small>${new Date(e.t).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})} · ${fmtDur(e.ms)}${e.k&&TKIND[e.k]?" · "+TKIND[e.k]:""}</small></span>
    <span class="th-d">${dl}</span></button>
    ${/^[A-Za-z0-9]{4,8}$/.test(e.id)?`<a class="th-li" href="https://lichess.org/training/${esc(e.id)}" target="_blank" rel="noopener" title="Auf Lichess ansehen" aria-label="Auf Lichess ansehen">↗</a>`:""}</div>`;
}
function dayLabel(t){const d=new Date(t);const k=d.toDateString();const n=new Date();if(k===n.toDateString())return "Heute";const y=new Date(n);y.setDate(n.getDate()-1);if(k===y.toDateString())return "Gestern";return d.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})}
function tlogChart(L){
  const days=[];const now=new Date();for(let i=13;i>=0;i--){const d=new Date(now);d.setDate(now.getDate()-i);days.push({k:d.toDateString(),l:d.getDate()+".",ok:0,no:0})}
  L.forEach(e=>{const x=days.find(d=>d.k===new Date(e.t).toDateString());if(x){if(e.ok)x.ok++;else x.no++}});
  const mx=Math.max(4,...days.map(d=>d.ok+d.no));if(!days.some(d=>d.ok+d.no))return "";
  return `<div class="card"><div class="sec-h" style="margin:0 0 8px"><h3>Letzte 14 Tage</h3><span class="lgd"><span><i class="sw" style="background:var(--green)"></i>gelöst</span><span><i class="sw" style="background:var(--red-soft)"></i>nicht gelöst</span></span></div>
  <div class="tbars">${days.map(d=>`<div class="tb-c" title="${d.l} ${d.ok} gelöst, ${d.no} nicht gelöst"><div class="tb-s">${d.no?`<i class="no" style="height:${d.no/mx*100}%"></i>`:""}${d.ok?`<i class="ok" style="height:${d.ok/mx*100}%"></i>`:""}</div><small>${d.l}</small></div>`).join("")}</div></div>`;
}
function renderTacHist(){
  const v=$("v-tactics");const all=PZ.log.slice().reverse();
  if(!all.length){v.innerHTML=tacTabsHtml()+pageHead("Taktik-Verlauf","Jede Aufgabe mit Ergebnis, Zeit und Wertung.","bolt","tac")+emptyState("bolt","Noch keine Aufgaben im Verlauf","Ab jetzt landet jede gelöste und jede verpatzte Aufgabe hier – zum Nachspielen und Lernen.",`<button class="btn grn" data-tac="rated">Erste Aufgabe lösen</button>`);wireTacTabs(v);v.querySelectorAll("[data-tac]").forEach(b=>b.onclick=()=>tacticSession(b.dataset.tac));return}
  const thList=[...new Set(all.flatMap(e=>e.th||[]))].filter(t=>TTH[t]).sort((a,b)=>TTH[a][0].localeCompare(TTH[b][0],"de"));
  if(THV.th&&thList.indexOf(THV.th)<0)THV.th="";
  const L=all.filter(e=>(THV.res==="all"||(THV.res==="ok"?e.ok:!e.ok))&&(!THV.th||(e.th||[]).indexOf(THV.th)>=0));
  const wk=all.filter(e=>Date.now()-e.t<7*DAY_MS);const okN=L.filter(e=>e.ok).length;const tms=L.filter(e=>e.ms!=null&&e.ok).map(e=>e.ms);
  const rated=wk.filter(e=>e.r!=null);const dW=rated.reduce((a,e)=>a+(e.d||0),0);
  const best=L.filter(e=>e.ok).sort((a,b)=>(b.pr||0)-(a.pr||0))[0];
  let h=tacTabsHtml()+pageHead("Taktik-Verlauf",`Deine letzten ${all.length} Aufgaben – tippe eine an, um sie nochmal zu spielen.`,"bolt","tac");
  h+=`<div class="kpis">${[["7 Tage",wk.length,`${wk.filter(e=>e.ok).length} gelöst`],["Trefferquote",L.length?pct(okN/L.length):"–",`${okN} von ${L.length}`],["Ø Lösungszeit",tms.length?fmtDur(tms.reduce((a,b)=>a+b,0)/tms.length):"–","bei gelösten"],["Wertung 7 Tage",rated.length?(dW>0?"+":"")+dW:"–",best?`schwerste gelöst: ${best.pr}`:`aktuell ${PZ.r}`]].map(t=>`<div class="kpi"><small>${t[0]}</small><b>${esc(String(t[1]))}</b><span>${esc(t[2])}</span></div>`).join("")}</div>`;
  h+=tlogChart(all);
  h+=`<div class="th-f"><div class="seg">${[["all","Alle"],["ok","Gelöst"],["no","Nicht gelöst"]].map(r=>`<button data-thr="${r[0]}" aria-pressed="${THV.res===r[0]}">${r[1]}</button>`).join("")}</div>
    ${thList.length?`<label class="th-sel"><span class="sr">Motiv</span><select id="thTh"><option value="">Alle Motive</option>${thList.map(t=>`<option value="${t}"${THV.th===t?" selected":""}>${esc(TTH[t][0])}</option>`).join("")}</select></label>`:""}
    ${L.filter(e=>!e.ok).length?`<button class="btn" id="thRetry">${L.filter(e=>!e.ok).length>1?`${Math.min(20,L.filter(e=>!e.ok).length)} falsche nochmal`:"Falsche nochmal"}</button>`:""}</div>`;
  if(!L.length)h+=emptyState("search","Nichts gefunden","Für diesen Filter gibt es keine Aufgaben.");
  else{let last="";h+=`<div class="thl">`;L.slice(0,THV.n).forEach(e=>{const dl=dayLabel(e.t);if(dl!==last){last=dl;const dd=L.filter(x=>dayLabel(x.t)===dl);h+=`<div class="th-day"><b>${esc(dl)}</b><small>${dd.length} ${dd.length===1?"Aufgabe":"Aufgaben"} · ${dd.filter(x=>x.ok).length} gelöst</small></div>`}h+=tlogRow(e,all.indexOf(e))});h+=`</div>`;
    if(L.length>THV.n)h+=`<button class="btn" id="thMore" style="align-self:center">Weitere ${Math.min(30,L.length-THV.n)} anzeigen</button>`}
  h+=`<p class="hint">Gespeichert werden die letzten 300 Aufgaben. Nachgespielte Aufgaben ändern deine Wertung nicht.</p>`;
  v.innerHTML=h;wireTacTabs(v);
  v.querySelectorAll("[data-thr]").forEach(b=>b.onclick=()=>{THV.res=b.dataset.thr;THV.n=30;renderTacHist()});
  const sel=$("thTh");if(sel)sel.onchange=()=>{THV.th=sel.value;THV.n=30;renderTacHist()};
  const mo=$("thMore");if(mo)mo.onclick=()=>{THV.n+=30;renderTacHist()};
  const rt=$("thRetry");if(rt)rt.onclick=()=>{const seen=new Set();const list=L.filter(e=>!e.ok&&!seen.has(e.id)&&seen.add(e.id)).slice(0,20).map(tlogPuzzle);tacticSession("hist",list)};
  v.querySelectorAll("[data-tre]").forEach(b=>b.onclick=()=>{const e=all[+b.dataset.tre];if(e)tacticSession("hist",[tlogPuzzle(e)])});
}
/* Taktik-Seite: Umschalter oben und die letzten Aufgaben als Vorschau */
const _renderTactics=renderTactics;
renderTactics=function(){
  if(tacTab==="hist"){renderTacHist();return}
  _renderTactics();const v=$("v-tactics");v.insertAdjacentHTML("afterbegin",tacTabsHtml());wireTacTabs(v);
  const rec=PZ.log.slice(-4).reverse();
  if(rec.length){const all=PZ.log.slice().reverse();const card=`<div class="card th-rec"><div class="sec-h" style="margin:0 0 6px"><h3>Zuletzt</h3><button class="linkb" data-tt2="1">Ganzer Verlauf →</button></div><div class="thl">${rec.map(e=>tlogRow(e,all.indexOf(e))).join("")}</div></div>`;
    const g=v.querySelector(".hubgrid");if(g)g.insertAdjacentHTML("afterend",card);
    v.querySelectorAll("[data-tt2]").forEach(b=>b.onclick=()=>showView("tactics:hist"));
    v.querySelectorAll(".th-rec [data-tre]").forEach(b=>b.onclick=()=>{const e=all[+b.dataset.tre];if(e)tacticSession("hist",[tlogPuzzle(e)])})}
};
HASHV["#taktik-verlauf"]="tactics:hist";

/* ================= Eröffnungslexikon: alle benannten Eröffnungen zum Ansehen und Trainieren ================= */
var opTab="mine";
const LEX={q:"",cat:"all",fam:null,n:80,ops:new Map()};
const LEX_CAT=[["all","Alle"],["A","A · Flanken"],["B","B · Halboffen"],["C","C · Offen"],["D","D · Geschlossen"],["E","E · Indisch"]];
function lexFamilies(){
  if(ECO.fams)return ECO.fams;const m=new Map();
  ECO.list.forEach(e=>{const k=e.en.split(":")[0].split(",")[0];let f=m.get(k);if(!f){f={k,id:slug(k),en:k,de:deName(k),items:[]};m.set(k,f)}f.items.push(e);e.f=f});
  m.forEach(f=>{f.items.sort((a,b)=>{const n=Math.min(a.m.length,b.m.length);for(let i=0;i<n;i++)if(a.m[i]!==b.m[i])return a.m[i]<b.m[i]?-1:1;return a.m.length-b.m.length});
    const exact=f.items.filter(e=>e.en===f.k);const root=(exact.length?exact:f.items).reduce((x,y)=>y.m.length<x.m.length?y:x);f.root=root;f.side=root.m.length%2===1?"w":"b";
    const ecos=f.items.map(e=>e.eco).sort();f.eco=ecos[0]===ecos[ecos.length-1]?ecos[0]:ecos[0]+"–"+ecos[ecos.length-1];f.cat=root.eco[0];
    /* Einrückung: wie viele Vorfahren (Präfixe) eine Variante in der Familie hat */
    const st=[];f.items.forEach(e=>{while(st.length&&!(e.m.length>st[st.length-1].m.length&&st[st.length-1].m.every((x,i)=>e.m[i]===x)))st.pop();e.dep=st.length;e.par=st.length?st[st.length-1]:null;e.kids=[];st.push(e)});
    /* Reihenfolge wie ein Baum: wichtige Äste (viele Untervarianten) zuerst */
    f.items.forEach(e=>{if(e.par)e.par.kids.push(e)});const cnt=e=>e.nd!=null?e.nd:(e.nd=e.kids.reduce((a,k)=>a+1+cnt(k),0));f.items.forEach(cnt);
    const out=[];const walk=e=>{out.push(e);e.kids.sort((a,b)=>b.nd-a.nd||a.m.length-b.m.length).forEach(walk)};f.items.filter(e=>!e.par).sort((a,b)=>b.nd-a.nd||a.m.length-b.m.length).forEach(walk);f.items=out});
  ECO.fams=[...m.values()].sort((a,b)=>b.items.length-a.items.length);return ECO.fams;
}
const lexFamOf=e=>{lexFamilies();return e.f};
function lexRest(e,f){const d=e.de,fd=f?f.de:"";let r=fd&&d.indexOf(fd+": ")===0?d.slice(fd.length+2):d===fd?"":d;
  /* gleicher Name wie der übergeordnete Eintrag: letzten Zug dazuschreiben */
  const lm=e.m.length?fmtMoves([e.m[e.m.length-1]],e.m.length-1):"";
  if(!r)return f&&e===f.root?"Grundstellung":"Hauptlinie mit "+lm;
  if(e.par&&e.par.de===e.de)return r+" mit "+lm;return r}
/* Trainings-Objekte im Format der Eröffnungen: ganze Familie (lx:…) oder einzelne Variante (lxe:…) */
function lexOp(id){
  if(!ECO.ready||!id)return null;if(LEX.ops.has(id))return LEX.ops.get(id);let o=null;
  let m=id.match(/^lx:([^:]+):([wb])$/);
  if(m){const f=lexFamilies().find(x=>x.id===m[1]);if(!f)return null;const seen=new Set(),L=[];
    f.items.forEach(e=>{const key=e.m.join(" ");if(seen.has(key))return;if(f.items.some(x=>x.m.length>e.m.length&&x.m.slice(0,e.m.length).join(" ")===key))return;seen.add(key);L.push({n:lexRest(e,f),m:e.m.slice(),p:"",notes:{},trap:false})});
    o={id,g:"lx",side:m[2],name:f.de,eco:f.eco,d:`${L.length} Varianten aus dem Eröffnungslexikon (Lichess-Datenbank). Gespielt wird bis zur benannten Stellung.`,plan:[],lines:L}}
  m=id.match(/^lxe:(\d+):([wb])$/);
  if(m){const e=ECO.list[+m[1]];if(!e)return null;const f=lexFamOf(e);
    o={id,g:"lx",side:m[2],name:e.de,eco:e.eco,d:`Aus dem Eröffnungslexikon: ${e.en}.`,plan:[],lines:[{n:e.de,m:e.m.slice(),p:"",notes:{},trap:false}]}}
  if(o)LEX.ops.set(id,o);return o;
}
function lexTrain(id,line){ecoLoad().then(()=>{const o=lexOp(id);if(o)selectOpening(o,line==null?null:line)}).catch(()=>toast("Das Lexikon konnte nicht geladen werden."))}
function opTabsHtml(){return `<div class="seg op-tabs" role="tablist"><button data-ot2="mine" aria-pressed="${opTab!=="lex"}">Kurse · ${ALL.length}</button><button data-ot2="lex" aria-pressed="${opTab==="lex"}">Lexikon · ${ECO.ready?ECO.list.length.toLocaleString("de-DE"):"3.865"}</button></div>`}
function wireOpTabs(v){v.querySelectorAll("[data-ot2]").forEach(b=>b.onclick=()=>showView(b.dataset.ot2==="lex"?"openings:lex":"openings:mine"))}
const lexNorm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’']/g,"");
function lexRow(e,f,showFam){
  const side=f?f.side:(e.m.length%2===1?"w":"b");const done=P("lxe:"+e.i+":"+side,0)===2||P("lxe:"+e.i+":"+(side==="w"?"b":"w"),0)===2;
  const name=showFam?e.de:lexRest(e,f);
  return `<div class="lxr" style="--d:${showFam?0:Math.min(6,e.dep||0)}"><button class="lx-t" data-lxv="${e.i}" title="Im Analysebrett ansehen"><b>${esc(name)}${done?' <span class="lx-ok" title="schon fehlerfrei trainiert">✓</span>':""}${!showFam&&e.nd?` <span class="lx-n">${e.nd}</span>`:""}</b><small><span class="eco">${esc(e.eco)}</span> ${esc(fmtMoves(e.m))}</small></button>
    <span class="lx-b"><button class="btn lx-view" data-lxv="${e.i}" tabindex="-1" aria-hidden="true">Ansehen</button><button class="btn grn" data-lxt="${e.i}" data-side="${side}">Üben</button></span></div>`;
}
function renderLex(){
  const v=$("v-openings");
  if(!ECO.ready){v.innerHTML=opTabsHtml()+pageHead("Eröffnungslexikon","Alle benannten Eröffnungen und Varianten.","book","lex")+`<div class="card">${SKEL}</div>`;wireOpTabs(v);
    ecoLoad().then(()=>{if(curView==="openings"&&opTab==="lex")renderLex()}).catch(()=>{if(curView==="openings")v.querySelector(".card").innerHTML='<p class="err">Das Lexikon konnte nicht geladen werden. Prüfe die Internetverbindung.</p>'});return}
  const fams=lexFamilies();let h=opTabsHtml();
  if(LEX.fam){const f=fams.find(x=>x.id===LEX.fam);if(f){renderLexFam(v,f);return}LEX.fam=null}
  h+=pageHead("Eröffnungslexikon",`${ECO.list.length.toLocaleString("de-DE")} benannte Eröffnungen und Varianten in ${fams.length} Familien – ansehen, im Analysebrett untersuchen oder direkt trainieren.`,"book","lex");
  h+=`<input class="txt" id="lxSearch" type="search" placeholder="Name, ECO-Code oder Züge, z. B. Najdorf, B90 oder 1.e4 c5" value="${esc(LEX.q)}" aria-label="Lexikon durchsuchen" autocomplete="off">`;
  const q=LEX.q.trim();
  if(q){const mq=parseMoveQuery(q);let res;
    if(/^[A-Ea-e]\d{2}$/.test(q))res=ECO.list.filter(e=>e.eco===q.toUpperCase());
    else if(mq&&mq.moves.length&&!mq.bad)res=ECO.list.filter(e=>e.m.length>=mq.moves.length&&mq.moves.every((x,i)=>e.m[i]===x));
    else{const t=lexNorm(q).split(/\s+/).filter(Boolean);res=ECO.list.filter(e=>{const hay=lexNorm(e.de+" "+e.en+" "+e.eco);return t.every(w=>hay.indexOf(w)>=0)})}
    res=res.slice().sort((a,b)=>a.m.length-b.m.length);
    h+=`<p class="hint">${res.length?`${res.length} ${res.length===1?"Treffer":"Treffer"}`:"Nichts gefunden."}</p><div class="lxl">${res.slice(0,LEX.n).map(e=>lexRow(e,lexFamOf(e),true)).join("")}</div>${res.length>LEX.n?`<button class="btn" id="lxMore" style="align-self:center">Weitere anzeigen</button>`:""}`;
  }else{
    h+=`<div class="filters">${LEX_CAT.map(c=>`<button class="chip${LEX.cat===c[0]?" on":""}" data-lxc="${c[0]}">${c[1]}</button>`).join("")}</div>`;
    const list=fams.filter(f=>LEX.cat==="all"||f.cat===LEX.cat);
    h+=`<div class="lxg">${list.map(f=>{const side=f.side;const lo=lexOp("lx:"+f.id+":"+side);const cl=lo?lo.lines.filter((l,i)=>P(lo.id,i)===2).length:0;
      return `<button class="lxc" data-lxf="${f.id}"><span class="kchip ${side}"></span><span class="lxc-t"><b>${esc(f.de)}</b><small>${esc(f.eco)} · ${f.items.length} ${f.items.length===1?"Variante":"Varianten"}${cl?` · ${cl} gelernt`:""}</small><small class="mv">${esc(fmtMoves(f.root.m))}</small></span></button>`}).join("")}</div>`;
  }
  h+=`<p class="hint">Quelle: Lichess-Eröffnungsdatenbank (CC0). Die deutschen Namen sind übersetzt, die englischen Originalnamen stehen in der Variantenansicht.</p>`;
  v.innerHTML=h;wireOpTabs(v);wireLex(v);
  const si=$("lxSearch");si.oninput=()=>{LEX.q=si.value;LEX.n=80;clearTimeout(LEX.t);LEX.t=setTimeout(()=>{renderLex();const x=$("lxSearch");if(x){x.focus();x.setSelectionRange(x.value.length,x.value.length)}},250)};
  v.querySelectorAll("[data-lxc]").forEach(b=>b.onclick=()=>{LEX.cat=b.dataset.lxc;renderLex()});
  v.querySelectorAll("[data-lxf]").forEach(b=>b.onclick=()=>{LEX.fam=b.dataset.lxf;LEX.n=80;renderLex();window.scrollTo(0,0)});
  const mo=$("lxMore");if(mo)mo.onclick=()=>{LEX.n+=80;renderLex()};
}
function renderLexFam(v,f){
  const other=f.side==="w"?"b":"w";const lo=lexOp("lx:"+f.id+":"+f.side);const cl=lo.lines.filter((l,i)=>P(lo.id,i)===2).length;
  let h=opTabsHtml()+`<button class="back" data-lxback>← Alle Familien</button>`+pageHead(esc(f.de),`${esc(f.eco)} · ${f.items.length} benannte Varianten · ${lo.lines.length} Endstellungen zum Trainieren${f.de!==f.en?` · englisch: ${esc(f.en)}`:""}`,"book");
  h+=`<div class="card lx-act"><div><b>Alle Varianten üben</b><small>Der Trainer wählt Varianten nach deiner Lernkurve aus. ${cl?`${cl} von ${lo.lines.length} schon fehlerfrei.`:""}</small></div><div class="btnrow"><button class="btn grn" data-lxall="${f.side}">Als ${f.side==="w"?"Weiß":"Schwarz"} üben</button><button class="btn" data-lxall="${other}">Als ${other==="w"?"Weiß":"Schwarz"}</button><button class="btn" data-lxv="${f.root.i}">Ansehen</button></div></div>`;
  h+=`<div class="lxl">${f.items.slice(0,LEX.n).map(e=>lexRow(e,f,false)).join("")}</div>${f.items.length>LEX.n?`<button class="btn" id="lxMore" style="align-self:center">Weitere ${Math.min(80,f.items.length-LEX.n)} anzeigen</button>`:""}`;
  v.innerHTML=h;wireOpTabs(v);wireLex(v);
  v.querySelector("[data-lxback]").onclick=()=>{LEX.fam=null;renderLex()};
  v.querySelectorAll("[data-lxall]").forEach(b=>b.onclick=()=>lexTrain("lx:"+f.id+":"+b.dataset.lxall));
  const mo=$("lxMore");if(mo)mo.onclick=()=>{LEX.n+=80;renderLex()};
}
function wireLex(v){
  v.querySelectorAll("[data-lxv]").forEach(b=>b.onclick=()=>{const e=ECO.list[+b.dataset.lxv];if(e)openAnaBoard(null,e.m.slice(),e.m.length)});
  v.querySelectorAll("[data-lxt]").forEach(b=>b.onclick=()=>lexTrain("lxe:"+b.dataset.lxt+":"+b.dataset.side,0));
}
const _renderOpenings=renderOpenings;
renderOpenings=function(){if(opTab==="lex"){renderLex();return}_renderOpenings();const v=$("v-openings");v.insertAdjacentHTML("afterbegin",opTabsHtml());wireOpTabs(v)};
HASHV["#lexikon"]="openings:lex";

/* ================= Startseite: zwei Spalten am Computer, Kopf mit Serie und Level ================= */
const _renderHome2=renderHome;
renderHome=function(){
  _renderHome2();const v=$("v-home");if(!v)return;
  /* Kopf: statt Logo kleine Plaketten für Serie und Liga */
  const lv=gxLevel(GX.xp),L=LEAGUES[GX.lg],sn=streakNow();
  const logo=v.querySelector(".home-logo");
  if(logo)logo.outerHTML=`<span class="home-chips"><button class="hchip fire${sn?"":" off"}" data-hc="profile:stats" title="Tage in Folge trainiert"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 3.2-.6 5-2 6.6C8.6 10.2 7 12 7 14.6A5 5 0 0 0 12 20a5 5 0 0 0 5-5.2c0-2.3-1.3-3.6-2.3-4.7.1 1.4-.4 2.6-1.4 3.1.3-3.4-.8-7.3-1.3-11.2z"/></svg><b>${sn}</b></button><button class="hchip" data-hc="league" title="${L[0]}-Liga, Level ${lv}">${SHIELD(L[1],20)}<b>${lv}</b></button></span>`;
  const sm=v.querySelector(".home-h small");if(sm)sm.textContent=new Date().toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"});
  const lb=v.querySelector(".lvbar");if(lb)lb.remove();
  /* Weitermachen: größeres Brett, klarer Knopf */
  const go=v.querySelector(".cont-go");if(go)go.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
  /* Spalten */
  const main=document.createElement("div");main.className="home-main";const side=document.createElement("aside");side.className="home-side";
  const grid=document.createElement("div");grid.className="home-grid";grid.appendChild(main);grid.appendChild(side);
  const kids=[...v.children].filter(x=>!x.classList.contains("home-h")&&!x.classList.contains("foot-links"));
  let toSide=false;kids.forEach(x=>{if(x.classList.contains("sec-h")&&/Schnellstart/.test(x.textContent))toSide=true;(toSide?side:main).appendChild(x)});
  const head=v.querySelector(".home-h");if(head)head.after(grid);else v.prepend(grid);
  v.querySelectorAll("[data-hc]").forEach(b=>b.onclick=()=>showView(b.dataset.hc));
};

/* ================= Planaufgaben: nach der Theorie ein Ziel gegen den Trainer (plans.js) ================= */
const PT=typeof PLAN_TASKS!=="undefined"?PLAN_TASKS:[];
const ptKey=T=>T.o+"|"+T.l;
const ptFor=(oid,ln)=>PT.find(T=>T.o===oid&&T.l===ln)||null;
const ptOk=T=>{const r=st.plans&&st.plans[ptKey(T)];return !!(r&&r.ok)};
/* Ziel prüfen: g = Stellung nach dem eigenen Zug, H = eigene Züge seit Aufgabenbeginn (chess.js-Objekte) */
function ptCond(c,g,H,me){
  if(!c)return false;
  if(c.all)return c.all.every(x=>ptCond(x,g,H,me));
  if(c.any)return c.any.some(x=>ptCond(x,g,H,me));
  if(c.on){const L=Array.isArray(c.on)?c.on:[c.on];return L.some(x=>{const p=g.get(x.slice(1));return !!p&&p.color===me&&p.type===x[0].toLowerCase()})}
  if(c.push)return H.some(m=>m.piece==="p"&&m.to===c.push);
  if(c.capt)return H.some(m=>!!m.captured&&m.to===c.capt);
  if(c.castle)return H.some(m=>m.flags.indexOf(c.castle)>=0);
  return false;
}
/* Für die Anzeige: Teilziele mit Haken */
function ptParts(c){if(c.all)return c.all.map(x=>({c:x,t:ptLabel(x)}));return [{c,t:ptLabel(c)}]}
function ptLabel(c){
  const P={N:"Springer",B:"Läufer",R:"Turm",Q:"Dame",K:"König",P:"Bauer"};
  if(c.any)return c.any.map(ptLabel).join(" oder ");
  if(c.all)return c.all.map(ptLabel).join(" und ");
  if(c.on){const L=Array.isArray(c.on)?c.on:[c.on];return P[L[0][0]]+" nach "+L.map(x=>x.slice(1)).join(" oder ")}
  if(c.push)return "Bauer nach "+c.push;if(c.capt)return "Schlagen auf "+c.capt;if(c.castle)return c.castle==="k"?"kurze Rochade":"lange Rochade";return ""}
let ptLock=0;
function ptStart(T){
  const o=byId(T.o),li=o?o.lines.findIndex(l=>l.n===T.l):-1;if(li<0){toast("Diese Aufgabe gibt es nicht mehr.");return}
  stopEngine();sess=null;game=null;drill=null;puz=null;flipped=false;forced=null;op=o;
  resetBoard();mode="train";target=li;
  for(const m of op.lines[li].m){const g=new Chess(fens[hist.length]);const mv=findMove(g,m);if(!mv)break;commit(mv,"b")}
  view=hist.length;shown=new Chess(fens[view]);
  showView("train");buildSquares();window.scrollTo(0,0);
  playOn({goal:T});
}
function ptStatus(G,H){
  const parts=ptParts(G.c),g=new Chess(fens[hist.length]),me=op.side;
  const tick=parts.length>1?" · "+parts.map(p=>(ptCond(p.c,g,H,me)?"✓ ":"○ ")+p.t).join(" · "):"";
  return `Zug ${Math.min(H.length+1,G.n)} von ${G.n}${tick}`;
}
/* Erreicht zählt, wenn die Stellung höchstens einen Bauern schlechter ist als zu Beginn und nicht schlechter als −1
   (bei Gambits, die schon schlechter beginnen, höchstens −2,5) */
function ptThr(){const e0=op&&op.playOn&&op.playOn.e0;return Math.max(-250,Math.min(-100,(e0==null?0:e0)-100))}
/* Nach jedem eigenen Zug: erreicht, verfehlt oder weiter? true = Partie ist hier zu Ende */
function ptAfterMove(){
  const G=op&&op.playOn&&op.playOn.goal;if(!G)return false;
  const me=op.side,H=mvs.slice(sfStart).filter(m=>m.color===me),g=new Chess(fens[hist.length]);
  if(ptCond(G.c,g,H,me)){
    busy=true;const tok=++ptLock,n=H.length,thr=ptThr();setStatus("sf","Ziel erreicht?","Stockfish prüft, ob die Stellung hält …");
    whyEval(g.fen()).then(e=>{if(tok!==ptLock||mode!=="engine")return;busy=false;const cp=e.cp*(me==="w"?1:-1);
      if(cp>=thr)ptFinish(G,true,n,cp);else ptFinish(G,false,n,cp,`Ziel erreicht, aber die Stellung kippt (Stockfish ${fmtEv(e.cp)}). Versuch es mit weniger Risiko.`)})
      .catch(()=>{if(tok!==ptLock)return;busy=false;ptFinish(G,true,n,null)});
    return true;
  }
  if(H.length>=G.n){ptFinish(G,false,H.length,null,`Nach ${G.n} Zügen ist das Ziel noch nicht erreicht. ${G.d}`);return true}
  return false;
}
function ptFinish(G,ok,n,cp,why,mate){
  const k=ptKey(G);st.plans=st.plans&&typeof st.plans==="object"?st.plans:{};const r=st.plans[k]||(st.plans[k]={ok:false,best:null,tries:0});
  r.tries=(r.tries||0)+1;r.d=Date.now();const first=ok&&!r.ok;if(ok){r.ok=true;r.best=r.best?Math.min(r.best,n):n}saveStats();
  endEngine(ok?"win":"loss","Planaufgabe");
  if(op.botCo){botMood=ok?"worry":"joy";renderChrome()}
  if(ok){if(first)wlog("plan",`Planaufgabe geschafft: ${G.t}`);gain("plan",{first});if(first)confetti();sfx("done")}checkBadges();
  setStatus(ok?"done":"bad",ok?(mate?`Schachmatt in ${n} ${n===1?"Zug":"Zügen"}!`:`Ziel erreicht in ${n} ${n===1?"Zug":"Zügen"}!`):"Ziel verfehlt",ok&&mate?"Matt ist mehr als jeder Plan – die Aufgabe zählt als geschafft.":ok?`${G.t} – genau das ist der Plan dieser Eröffnung.${cp!=null?` Stockfish: ${fmtEv(cp*(op.side==="w"?1:-1))}.`:""}${r.best&&r.best<n?` Deine Bestmarke: ${r.best} Züge.`:""}`:why||"");
  {const cc=crsSess();vcSay(ok?`Ziel erreicht! ${G.t}.`:"Ziel verfehlt. Versuch es noch einmal.",op.botCo||(cc?coIdOf(cc):"mila"))}
}
/* Karte nach einer gelösten Variante: Es gibt eine Planaufgabe für genau diese Stellung */
function planPaint(){
  const el=$("planBox");if(!el)return;
  const T=mode==="train"&&done&&!learn&&!drill&&!sess&&!sfEnd&&op&&!op.playOn&&target!==null&&op.lines&&op.lines[target]?ptFor(op.id,op.lines[target].n):null;
  if(!T){if(!el.hidden){el.hidden=true;el.innerHTML="";el.dataset.k=""}return}
  const k=ptKey(T)+"|"+ptOk(T);if(el.dataset.k===k&&!el.hidden)return;el.dataset.k=k;
  el.innerHTML=`<span class="plan-ic">${NI.target}</span><div class="plan-c"><b>Nach der Theorie: ${esc(T.t)}</b><small>${esc(T.d)}</small></div><button class="btn grn" type="button" data-pt>${ptOk(T)?"Nochmal":"Spielen"}</button>`;
  el.querySelector("[data-pt]").onclick=()=>ptStart(T);el.hidden=false;
}
/* Seite „Planaufgaben“ */
let ptFilter=store.get("et-ptf","rep");
function renderPlans(){
  const v=$("v-plans");if(!v)return;
  const L=PT.filter(T=>{const o=byId(T.o);return o&&o.lines.some(l=>l.n===T.l)});
  const inRep=T=>S.rep.indexOf(T.o)>=0,grp=T=>{const o=byId(T.o);return o.g==="x"?"x":o.side};
  if(ptFilter==="rep"&&!L.some(inRep))ptFilter="all";
  const shown2=L.filter(T=>ptFilter==="all"?true:ptFilter==="rep"?inRep(T):grp(T)===ptFilter);
  const okN=L.filter(ptOk).length;
  v.innerHTML=`<button class="back" data-back>← Training</button>`+pageHead("Planaufgaben",`Die Theorie ist gespielt – jetzt zählt der Plan. ${okN} von ${L.length} Zielen erreicht.`,"target","plan")+
    `<div class="filters pt-f">${[["rep","Dein Repertoire"],["all","Alle"],["w","Mit Weiß"],["b","Mit Schwarz"],["x","Gambits & Fallen"]].map(([k,t])=>`<button class="chip${ptFilter===k?" on":""}" data-ptf="${k}">${t}</button>`).join("")}</div>
    <div class="pt-list">${shown2.map(T=>{const o=byId(T.o),r=st.plans&&st.plans[ptKey(T)];return `<article class="card pt-card${ptOk(T)?" ok":""}" data-k="${esc(ptKey(T))}"><div class="pt-bd" data-bd></div><div class="pt-cc">
      <div class="pt-meta"><b>${esc(o.name)}</b><small>${esc(T.l)} · ${o.side==="w"?"Weiß":"Schwarz"}</small></div>
      <h3 class="pt-t">${esc(T.t)}</h3><p class="pt-d">${esc(T.d)}</p>
      <div class="pt-foot"><span class="pt-st">${r&&r.ok?`<span class="seal s2" aria-hidden="true"></span> Geschafft in ${r.best} ${r.best===1?"Zug":"Zügen"}`:`Höchstens ${T.n} Züge${r&&r.tries?` · ${r.tries} ${r.tries===1?"Versuch":"Versuche"}`:""}`}</span><button class="btn ${ptOk(T)?"":"grn"}" data-go>${ptOk(T)?"Nochmal":"Spielen"}</button></div></div></article>`}).join("")||emptyState("bolt","Keine Aufgaben in dieser Auswahl","Wähle oben eine andere Gruppe.")}</div>`;
  wireBack(v);
  v.querySelectorAll("[data-ptf]").forEach(b=>b.onclick=()=>{ptFilter=b.dataset.ptf;store.set("et-ptf",ptFilter);renderPlans()});
  v.querySelectorAll(".pt-card").forEach(c=>{const T=L.find(x=>ptKey(x)===c.dataset.k);if(!T)return;const o=byId(T.o),l=o.lines.find(x=>x.n===T.l);
    const g=new Chess();let last=null;for(const m of l.m){const mv=findMove(g,m);if(!mv)break;last=g.move(mv.san)}
    c.querySelector("[data-bd]").appendChild(staticBoard(g.fen(),o.side,last));c.querySelector("[data-go]").onclick=()=>ptStart(T)});
}

/* ================= Stimme: Trainer sprechen, Züge ansagen, Züge per Sprache =================
   Sprachausgabe mit den Stimmen des Geräts (Web Speech API). Jeder Trainer hat eine eigene Stimmlage;
   wenn das Gerät mehrere deutsche Stimmen hat, bekommen Trainerinnen eine weibliche und Trainer eine männliche. */
const VC={km:new Set(),ok:typeof window!=="undefined"&&"speechSynthesis" in window&&typeof SpeechSynthesisUtterance!=="undefined",rec:window.SpeechRecognition||window.webkitSpeechRecognition||null,kind:null,unlocked:false};
const VOICE_PROF={mila:{g:"f",p:1.12,r:1.02},bruno:{g:"m",p:.84,r:.95},greta:{g:"f",p:1.0,r:.95},konrad:{g:"m",p:.74,r:.9},linus:{g:"m",p:1.02,r:1.06},rex:{g:"m",p:.7,r:1.12},nova:{g:"f",p:1.26,r:1.12},ilka:{g:"f",p:.95,r:.98},rika:{g:"f",p:1.14,r:1.1}};
const VC_F=/anna|petra|helena|katja|hedda|marlene|vicki|female|weiblich|sandy|shelley|flo\b|grandma|amala|seraphina|louisa|tanja|elke|gisela|klarissa|maja|ingrid|katharina|leonie|amala/i,
  VC_M=/markus|yannick|martin|stefan|conrad|hans\b|male|männlich|reed|rocko|eddy|grandpa|ralf|bernd|christoph|killian|kasper|florian|jonas|klaus|lukas|georg|bjarne|viktor/i;
function vcVoice(co){
  if(!VC.ok)return null;const L=speechSynthesis.getVoices().filter(v=>/^de([-_]|$)/i.test(v.lang));if(!L.length)return null;
  const want=(VOICE_PROF[co]||VOICE_PROF.mila).g==="f"?VC_F:VC_M;
  return L.find(v=>want.test(v.name)&&v.localService)||L.find(v=>want.test(v.name))||L.find(v=>v.default)||L[0];
}
if(VC.ok){try{speechSynthesis.getVoices();speechSynthesis.addEventListener&&speechSynthesis.addEventListener("voiceschanged",()=>{})}catch(e){}}
const SP_P={K:"König",D:"Dame",T:"Turm",L:"Läufer",S:"Springer"};
/* Schachnotation aussprechbar machen: „4…Sf6“ → „Springer f6“, „axb5“ → „a schlägt b5“, „0-0“ → „kurze Rochade“ */
function spoken(t){
  return String(t).replace(/<[^>]+>/g," ")
    .replace(/\b(0-0-0|O-O-O)([+#]?)/g,(m,c,x)=>"lange Rochade"+(x==="#"?" matt":x?" Schach":""))
    .replace(/\b(0-0|O-O)([+#]?)/g,(m,c,x)=>"kurze Rochade"+(x==="#"?" matt":x?" Schach":""))
    .replace(/\b\d+\s?(\.{3}|…|\.)\s?(?=[KDTLSa-h]|lange|kurze)/g,"")
    .replace(/\b([KDTLS])?([a-h])?([1-8])?(x)?([a-h][1-8])(=([DTLS]))?([+#])?(?![a-zäöü])/g,(m,p,f,r,x,to,_,pr,ch)=>[p?SP_P[p]:"",f||"",r||"",x?"schlägt":"",to,pr?"wird "+SP_P[pr]:"",ch==="#"?"matt":ch?"Schach":""].filter(Boolean).join(" "))
    .replace(/([+−-])(\d+)\.(\d)\b/g,(m,s,a,b)=>(s==="+"?"plus ":"minus ")+a+","+b)
    .replace(/\s+/g," ").trim();
}
/* Eigene Warteschlange: Zugansagen gehen nie verloren, ein neuer Trainersatz ersetzt den alten */
VC.q=[];VC.cur=null;VC.wd=null;
function vcPump(){
  if(VC.cur||!VC.q.length)return;const it=VC.q.shift();const P=VOICE_PROF[it.co]||VOICE_PROF.mila;
  const u=new SpeechSynthesisUtterance(it.t);u.lang="de-DE";u.pitch=P.p;u.rate=P.r;const v=vcVoice(it.co);if(v)u.voice=v;
  const done=()=>{if(VC.cur!==it)return;clearTimeout(VC.wd);VC.cur=null;setTimeout(vcPump,40)};u.onend=done;u.onerror=done;
  VC.cur=it;if(it.kms)it.kms.forEach(k=>VC.km.add(k));VC.wd=setTimeout(done,1500+it.t.length*110);try{speechSynthesis.speak(u)}catch(e){done()}
}
/* kind: "move" (Zugansage, stellt sich an), "km" (Schlüsselzug, ersetzt nur wartende Schlüsselzüge), "line" (Trainersatz, ersetzt den laufenden) */
function vcSpeak(text,co,kind,force,kms){
  if(!VC.ok||!text||(!force&&(kind==="move"?!S.set.voiceMv:!S.set.voice)))return;
  const t=spoken(text);if(!t)return;const it={t,co:co||"mila",kind,kms};
  if(kind==="km")VC.q=VC.q.filter(x=>x.kind!=="km");
  else if(kind==="line"){VC.q=VC.q.filter(x=>x.kind==="move");if(VC.cur&&VC.cur.kind==="line"){VC.q.push(it);const c=VC.cur;try{speechSynthesis.cancel()}catch(e){}setTimeout(()=>{if(VC.cur===c){clearTimeout(VC.wd);VC.cur=null;vcPump()}},120);return}}
  VC.q.push(it);vcPump();
}
function vcStop(){VC.q=[];if(VC.cur){VC.cur=null;clearTimeout(VC.wd);try{speechSynthesis.cancel()}catch(e){}}}
const vcSay=(t,co,force)=>vcSpeak(t,co||"mila","line",force);
function vcMove(r){if(!r||!r.san)return;const c=crsSess&&mode==="train"?crsSess():null;vcSpeak(de(r.san),c?coIdOf(c):mode==="engine"&&op&&op.botCo&&r.color!==op.side?op.botCo:"mila","move")}
/* iOS gibt die Sprachausgabe erst nach einer Berührung frei */
document.addEventListener("pointerdown",()=>{if(VC.unlocked||!VC.ok||!(S.set.voice||S.set.voiceMv))return;VC.unlocked=true;try{const u=new SpeechSynthesisUtterance(" ");u.volume=0;speechSynthesis.speak(u)}catch(e){}},{capture:true});
/* Spracheingabe: „Springer f3“, „e4“, „e schlägt d5“, „kurze Rochade“, „Bauer e8 wird Dame“, „g1 f3“ */
const SP_NUM={eins:1,ein:1,eine:1,zwei:2,zwo:2,drei:3,vier:4,"fünf":5,fuenf:5,sechs:6,sieben:7,acht:8};
const SP_FILE={a:"a",ah:"a",anton:"a",b:"b",be:"b",beh:"b",berta:"b",c:"c",ce:"c",zeh:"c","cäsar":"c",caesar:"c",d:"d",de:"d",deh:"d",dora:"d",e:"e",eh:"e",emil:"e",f:"f",ef:"f",eff:"f",friedrich:"f",g:"g",ge:"g",geh:"g",gustav:"g",h:"h",ha:"h",heinrich:"h"};
const SP_PC=[[/\b(springer|pferd|pferdchen|ross|rössel|roessel|knight)\b/,"n"],[/\b(läufer|laeufer|leufer|bishop)\b/,"b"],[/\b(turm|rook)\b/,"r"],[/\b(dame|königin|koenigin|queen)\b/,"q"],[/\b(könig|koenig|king)\b/,"k"],[/\b(bauer|bauern|pawn)\b/,"p"]];
function parseSpoken(raw,g){
  let t=" "+String(raw).toLowerCase().replace(/ß/g,"ss")+" ";const legal=g.moves({verbose:true});
  const cs=/lange rochade|rochade lang|gro(ss|ß)e rochade|0-0-0|o-o-o/.test(t)?"q":/kurze rochade|rochade kurz|kleine rochade|0-0|o-o/.test(t)?"k":/rochade|rochiere/.test(t)?"?":null;
  if(cs){const c=legal.filter(m=>cs==="?"?/[kq]/.test(m.flags):m.flags.indexOf(cs)>=0);return c.length===1?{mv:c[0]}:c.length?{err:"Welche Rochade? Sag „kurze“ oder „lange Rochade“."}:{err:"Eine Rochade geht hier nicht."}}
  t=t.replace(/[.,!?;:„“"'()\-–]/g," ");
  let promo=null;t=t.replace(/\b(umwandlung|umwandeln|wird|zur|zu|in|gleich)\s+(eine?n?\s+)?(dame|turm|läufer|laeufer|springer)\b/,(m,a,b,p)=>{promo={dame:"q",turm:"r",läufer:"b",laeufer:"b",springer:"n"}[p];return " "});
  let piece=null;for(const [re,p] of SP_PC){if(re.test(t)){piece=p;t=t.replace(re," ");break}}
  const cap=/\b(schlägt|schlaegt|nimmt|schlagen|mal|x)\b/.test(t);t=t.replace(/\b(schlägt|schlaegt|nimmt|schlagen|mal|x|von|nach|auf|zieht|ziehe|zug|spiele|spielt|bitte|und|der|die|das)\b/g," ");
  t=t.replace(/\b(eins|ein|eine|zwei|zwo|drei|vier|fünf|fuenf|sechs|sieben|acht)\b/g,w=>" "+SP_NUM[w]+" ").replace(/\s+/g," ");
  const sq=[];t=t.replace(/(^|\s)(a|ah|anton|b|be|beh|berta|c|ce|zeh|cäsar|caesar|d|de|deh|dora|e|eh|emil|f|ef|eff|friedrich|g|ge|geh|gustav|h|ha|heinrich)\s?([1-8])(?=\s|$)/g,(m,s0,f,r)=>{sq.push(SP_FILE[f]+r);return " "});
  const rest=t.trim().split(/\s+/).filter(Boolean);const dfile=rest.map(w=>SP_FILE[w]).find(Boolean)||null,drank=rest.find(w=>/^[1-8]$/.test(w))||null;
  if(!sq.length)return {err:null};
  let c=sq.length>=2?legal.filter(m=>m.from===sq[0]&&m.to===sq[1]):legal.filter(m=>m.to===sq[sq.length-1]);
  if(piece){const pc=c.filter(m=>m.piece===piece);if(!pc.length&&!promo&&/[qrbn]/.test(piece)&&c.some(m=>m.promotion)){promo=piece;c=c.filter(m=>m.promotion)}else c=pc}
  else if(sq.length<2&&c.some(m=>m.piece==="p")&&!dfile)c=c.filter(m=>m.piece==="p")||c;
  if(dfile)c=c.filter(m=>m.from[0]===dfile);if(drank)c=c.filter(m=>m.from[1]===drank);
  if(cap&&c.some(m=>m.captured))c=c.filter(m=>m.captured);
  if(c.some(m=>m.promotion))c=c.filter(m=>m.promotion===(promo||"q"));
  if(c.length===1)return {mv:c[0]};
  if(c.length>1)return {err:`Mehrdeutig: ${[...new Set(c.map(m=>de(m.san)))].join(" oder ")}. Sag z. B. „${SP_P[de(c[0].san)[0]]||"Bauer"} ${c[0].from[0]} ${c[0].to}“.`};
  return {err:`„${raw}“ ist hier kein legaler Zug.`};
}
const VR={on:false,r:null,fails:0};
function vrUi(){const b=$("micBtn");if(!b)return;const show=!!(VC.rec&&S.set.voiceIn);b.hidden=!show;b.classList.toggle("on",VR.on);b.setAttribute("aria-pressed",String(VR.on));b.title=VR.on?"Spracheingabe aus":"Zug sprechen"}
function vrStop(){VR.on=false;if(VR.r){try{VR.r.abort()}catch(e){}VR.r=null}vrUi()}
function vrStart(){
  if(!VC.rec||VR.r)return;const R=new VC.rec();R.lang="de-DE";R.interimResults=false;R.maxAlternatives=5;R.continuous=false;
  R.onresult=e=>{const alts=[...e.results[e.results.length-1]].map(a=>a.transcript);vrHandle(alts)};
  R.onerror=e=>{const er=e&&e.error;if(er==="not-allowed"||er==="service-not-allowed"||er==="audio-capture"){vrStop();toast(er==="audio-capture"?"Kein Mikrofon gefunden.":"Kein Zugriff aufs Mikrofon – erlaube es in den Einstellungen des Browsers.")}else if(er==="network"){vrStop();toast("Die Spracherkennung braucht gerade Internet.")}else if(er!=="no-speech"&&er!=="aborted"&&++VR.fails>3){vrStop();toast("Die Spracherkennung macht Pause – tippe aufs Mikrofon, um es neu zu versuchen.")}};
  R.onend=()=>{VR.r=null;if(VR.on&&curView==="train")setTimeout(()=>{if(VR.on&&!VR.r)vrStart()},300);else if(curView!=="train")vrStop();vrUi()};
  VR.r=R;try{R.start()}catch(e){VR.r=null;vrStop()}vrUi();
}
function vrHandle(alts){
  if(!shown)return;let first=null;
  for(const a of alts){const r=parseSpoken(a,new Chess(shown.fen()));if(r.mv){VR.fails=0;toast(`„${a.trim()}“ → ${de(r.mv.san)}`);if(!tryMove(r.mv.from,r.mv.to,true,r.mv.promotion))toast("Gerade kannst du nicht ziehen.");return}if(!first&&r.err)first=r.err}
  if(first)toast(first);
}
function vrToggle(){if(!VC.rec)return;if(VR.on){vrStop();return}VR.on=true;VR.fails=0;vrStart();toast("Sprich deinen Zug, z. B. „Springer f3“ oder „kurze Rochade“.")}

/* ================= Spickzettel als PDF =================
   Pro Eröffnung: Kopfband, bis zu drei Schlüsselstellungen als Diagramm mit Erklärung, der Zugbaum,
   Ideen und Pläne, Fallen und deine Notizen. jsPDF und die Schrift werden erst beim Erstellen geladen. */
let jsPdfP=null,pcImgs=null;
function loadJsPdf(){
  if(window.jspdf&&window.jspdf.jsPDF)return Promise.resolve(window.jspdf);
  if(!jsPdfP)jsPdfP=new Promise((res,rej)=>{const sc=document.createElement("script");sc.src="lib/jspdf/jspdf.umd.min.js";sc.async=true;
    sc.onload=()=>window.jspdf&&window.jspdf.jsPDF?res(window.jspdf):rej(new Error("jspdf"));sc.onerror=()=>{jsPdfP=null;sc.remove();rej(new Error("jspdf"))};document.head.appendChild(sc)});
  return jsPdfP;
}
async function fontB64(url){const r=await fetch(url);if(!r.ok)throw new Error("font");const b=new Uint8Array(await r.arrayBuffer());let s="";for(let i=0;i<b.length;i+=0x8000)s+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));return btoa(s)}
/* Figurenbilder aus pieces.css (klassischer Satz, auch wenn in der App Staunty eingestellt ist) */
async function pieceImgs(){
  if(pcImgs)return pcImgs;const host=document.createElement("div");host.style.cssText="position:absolute;left:-9999px;top:0;width:10px;height:10px";document.documentElement.appendChild(host);
  const urls={};for(const c of "wb")for(const t of "pnbrqk"){const d=document.createElement("div");d.className="pc "+c+t;host.appendChild(d);const m=getComputedStyle(d).backgroundImage.match(/url\(["']?(.*?)["']?\)$/);if(m)urls[c+t]=m[1]}
  host.remove();const imgs={};
  await Promise.all(Object.entries(urls).map(([k,u])=>new Promise(res=>{const im=new Image();im.onload=()=>{imgs[k]=im;res()};im.onerror=()=>res();im.src=u})));
  return pcImgs=imgs;
}
function diagramPng(fen,or,last,px,imgs){
  const cv=document.createElement("canvas");cv.width=cv.height=px;const x=cv.getContext("2d"),q=px/8,b=new Chess(fen).board();
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const f=or==="b"?7-c:c,rk=or==="b"?r:7-r,n="abcdefgh"[f]+(rk+1);
    x.fillStyle=(f+rk)%2?"#F1EADB":"#B9A486";x.fillRect(c*q,r*q,q,q);
    if(last&&(last.from===n||last.to===n)){x.fillStyle="rgba(247,200,40,.42)";x.fillRect(c*q,r*q,q,q)}
    const p=b[7-rk][f];if(p&&imgs[p.color+p.type])x.drawImage(imgs[p.color+p.type],c*q,r*q,q,q)}
  x.font=`700 ${Math.round(q*.2)}px Rubik, sans-serif`;x.textBaseline="alphabetic";
  for(let i=0;i<8;i++){
    {const f=or==="b"?7-i:i,rk=or==="b"?7:0;x.fillStyle=(f+rk)%2?"#7E6A4E":"#F6F0E4";x.textAlign="right";x.fillText("abcdefgh"[f],i*q+q*.94,px-q*.07)}
    {const f=or==="b"?7:0,rk=or==="b"?i:7-i;x.fillStyle=(f+rk)%2?"#7E6A4E":"#F6F0E4";x.textAlign="left";x.fillText(String(rk+1),q*.06,i*q+q*.24)}}
  x.strokeStyle="#6E5C43";x.lineWidth=Math.max(2,px*.006);x.strokeRect(x.lineWidth/2,x.lineWidth/2,px-x.lineWidth,px-x.lineWidth);
  return cv.toDataURL("image/png");
}
function kmInit(){if(!KMAP){KMAP=new Map();if(typeof KEYMOVES!=="undefined")for(const [q,t] of KEYMOVES)KMAP.set(q.split(" ").map(strip).join(" "),t)}return KMAP}
/* Zugbaum als Zeilen: einfache Ketten werden zusammengefasst, Abzweigungen eingerückt */
function cheatTree(o){
  const root={k:new Map(),end:[]};
  o.lines.forEach(l=>{let n=root;l.m.forEach(m=>{if(!n.k.has(m))n.k.set(m,{k:new Map(),end:[]});n=n.k.get(m)});n.end.push(l.n)});
  const rows=[];
  const walk=(n,path,d)=>{for(const [m,ch] of n.k){let node=ch;const seq=[m];let p=path.concat(m);
    while(node.k.size===1&&!node.end.length){const [nm,nx]=[...node.k][0];seq.push(nm);p=p.concat(nm);node=nx}
    rows.push({d,txt:fmtMoves(seq,p.length-seq.length),names:node.end.slice()});walk(node,p,node.k.size>1||n.k.size>1?d+1:d)}};
  walk(root,[],0);return rows;
}
function cheatKeys(o){
  const K=kmInit(),out=[],seen=new Set();
  o.lines.forEach(l=>{for(let n=1;n<=l.m.length;n++){const key=l.m.slice(0,n).map(strip).join(" ");if(seen.has(key))continue;const t=K.get(key);if(t){seen.add(key);out.push({seq:l.m.slice(0,n),t})}}});
  if(!out.length)o.lines.slice(0,3).forEach(l=>out.push({seq:l.m.slice(),t:l.n+(l.p?": "+l.p:""),line:true}));
  return out.slice(0,3);
}
function cheatMemos(o){const L=o.lines.map(l=>l.m.map(strip));
  return Object.values(S.memo).filter(m=>{if(m.o===o.id)return true;if(!m.h)return false;const h=m.h.split(" ").map(strip);return L.some(l=>l.length>=h.length&&h.every((x,i)=>l[i]===x))}).sort((a,b)=>(a.h||"").split(" ").length-(b.h||"").split(" ").length)}
const CHEAT_COL={w:[106,72,238],b:[22,129,104],x:[212,60,56],c:[143,95,53]};
async function cheatPdf(ids,prog){
  const [{jsPDF},reg,bold,imgs]=await Promise.all([loadJsPdf(),fontB64("lib/fonts/rubik-regular.ttf"),fontB64("lib/fonts/rubik-bold.ttf"),pieceImgs()]);
  const doc=new jsPDF({unit:"mm",format:"a4",compress:true});
  doc.addFileToVFS("Rubik-Regular.ttf",reg);doc.addFont("Rubik-Regular.ttf","Rubik","normal");doc.addFileToVFS("Rubik-Bold.ttf",bold);doc.addFont("Rubik-Bold.ttf","Rubik","bold");
  const W=210,H=297,M=14,CW=W-2*M,BOT=H-16,ink=[42,38,34],soft=[110,102,92],lh=pt=>pt*.3528*1.38;
  let y=M,first=true,cur=null;const toc=[];
  const font=(st,pt,col)=>{doc.setFont("Rubik",st);doc.setFontSize(pt);doc.setTextColor(...(col||ink))};
  const page=()=>{doc.addPage();y=M;if(cur){font("bold",8.5,cur.col);doc.text(cur.o.name+" (Fortsetzung)",M,y+3);y+=8}};
  const need=h=>{if(y+h>BOT)page()};
  const para=(txt,x,w,st,pt,col,gap)=>{font(st,pt,col);const ls=doc.splitTextToSize(String(txt),w);ls.forEach(l=>{need(lh(pt));doc.text(l,x,y+lh(pt)*.78);y+=lh(pt)});y+=gap||0};
  const head=(t,col)=>{need(12);y+=2;font("bold",10.5,col);doc.text(t,M,y+4);doc.setDrawColor(...col);doc.setLineWidth(.35);doc.line(M,y+6,M+CW,y+6);y+=9};
  for(let k=0;k<ids.length;k++){
    const o=byId(ids[k]);if(!o||!o.lines||!o.lines.length)continue;if(prog)prog(k+1,ids.length,o.name);await new Promise(r=>setTimeout(r,0));
    if(first)first=false;else{doc.addPage();y=M}
    const col=CHEAT_COL[o.g]||CHEAT_COL[o.side]||CHEAT_COL.w;cur=null;toc.push({o,page:doc.getNumberOfPages()});
    /* Kopfband */
    doc.setFillColor(...col);doc.roundedRect(M,y,CW,17,3,3,"F");
    font("bold",15,[255,255,255]);doc.text(o.name,M+5,y+8.2,{maxWidth:CW-60});
    font("normal",8.5,[255,255,255]);doc.text(`${o.side==="w"?"Du spielst Weiß":"Du spielst Schwarz"} · ${o.lines.length} ${o.lines.length===1?"Variante":"Varianten"}`,M+5,y+13.6);
    if(o.eco){font("bold",9,[255,255,255]);doc.text(String(o.eco),M+CW-5,y+8.2,{align:"right"})}
    y+=21;cur={o,col};
    if(o.d)para(o.d,M,CW,"normal",9,soft,2);
    /* Schlüsselstellungen */
    const keys=cheatKeys(o);
    if(keys.length){head(keys[0].line?"Endstellungen":"Schlüsselstellungen",col);
      const dw=55,gap=(CW-3*dw)/2;need(dw+24);const top=y;let maxY=top+dw;
      keys.forEach((K,i)=>{const g=new Chess();let last=null;for(const m of K.seq){const mv=findMove(g,m);if(!mv)break;last=g.move(mv.san)}
        const x0=M+i*(dw+gap);doc.addImage(diagramPng(g.fen(),o.side,last,440,imgs),"PNG",x0,top,dw,dw);
        let yy=top+dw+4;const mvTxt=last?numSan(fens0(K.seq),last.san):"";
        font("bold",8.5,col);if(mvTxt){doc.text(mvTxt,x0,yy);yy+=lh(8.5)}
        font("normal",7.6,ink);doc.splitTextToSize(K.t,dw).slice(0,8).forEach(l=>{doc.text(l,x0,yy);yy+=lh(7.6)});maxY=Math.max(maxY,yy)});
      y=maxY+3}
    /* Zugbaum */
    head("Zugbaum",col);
    cheatTree(o).forEach(r=>{const ind=Math.min(r.d,7)*4.2,w=CW-ind,L=lh(8.6);
      font("normal",8.6,ink);const ls=doc.splitTextToSize(r.txt,w);need(L*ls.length);
      if(r.d>0){doc.setDrawColor(...col);doc.setLineWidth(.3);doc.line(M+ind-2.6,y+.8,M+ind-2.6,y+L*ls.length-.4)}
      ls.forEach(l=>{font("normal",8.6,ink);doc.text(l,M+ind,y+L*.78);y+=L});
      if(r.names.length){font("normal",8.6,ink);const lastW=doc.getTextWidth(ls[ls.length-1]);const nm=r.names.join(" · ");font("bold",7.6,col);
        if(lastW+3+doc.getTextWidth(nm)<=w)doc.text(nm,M+ind+lastW+2.4,y-L+L*.78);
        else doc.splitTextToSize(nm,w-3).forEach(t=>{need(lh(7.6));font("bold",7.6,col);doc.text(t,M+ind+3,y+lh(7.6)*.78);y+=lh(7.6)})}});
    y+=1;
    /* Ideen und Pläne */
    const plans=[];(o.plan||[]).forEach(t=>{if(t)plans.push({t})});
    const seenP=new Set();o.lines.forEach(l=>{if(l.p&&!seenP.has(l.p)){seenP.add(l.p);plans.push({n:l.n,t:l.p})}});
    if(plans.length){head("Ideen und Pläne",col);
      plans.slice(0,10).forEach(P=>{need(lh(8.5)*2);font("bold",8.5,col);doc.text("•",M+1,y+lh(8.5)*.78);
        if(P.n){font("bold",8.5,ink);const lab=P.n+": ";doc.text(lab,M+4.5,y+lh(8.5)*.78);const tw=doc.getTextWidth(lab);font("normal",8.5,ink);const ls=doc.splitTextToSize(P.t,CW-4.5-tw);doc.text(ls[0],M+4.5+tw,y+lh(8.5)*.78);y+=lh(8.5);if(ls.length>1)para(ls.slice(1).join(" "),M+4.5,CW-4.5,"normal",8.5,ink)}
        else para(P.t,M+4.5,CW-4.5,"normal",8.5,ink);y+=.8});
      if(plans.length>10)para(`und ${plans.length-10} weitere Pläne in der App`,M+4.5,CW-4.5,"normal",7.6,soft)}
    /* Fallen und Hinweise aus den Varianten */
    const tips=[];o.lines.forEach(l=>{const nt=l.notes||{};Object.keys(nt).sort((a,b)=>a-b).forEach(pl=>{const g=new Chess();for(let i=0;i<+pl;i++){const mv=findMove(g,l.m[i]);if(!mv)return;g.move(mv.san)}if(l.m[+pl])tips.push({n:l.n,mv:numSan(g.fen(),l.m[+pl]),t:nt[pl]})})});
    if(tips.length){head(o.g==="x"?"Fallen und Hinweise":"Hinweise",col);tips.slice(0,8).forEach(T=>{need(lh(8.5)*2);font("bold",8.5,ink);const lab=`${T.mv} (${T.n}): `;doc.text(lab,M,y+lh(8.5)*.78);const tw=doc.getTextWidth(lab);font("normal",8.5,ink);const ls=doc.splitTextToSize(T.t,CW-tw);doc.text(ls[0],M+tw,y+lh(8.5)*.78);y+=lh(8.5);if(ls.length>1)para(ls.slice(1).join(" "),M,CW,"normal",8.5,ink);y+=.8})}
    /* Deine Notizen */
    const ms=cheatMemos(o);
    if(ms.length){head("Deine Notizen",[196,140,20]);ms.slice(0,10).forEach(m=>{const seq=m.h?m.h.split(" "):[];const lab=seq.length?`Nach ${fmtMoves(seq,0)}: `:"";need(lh(8.5)*2);
      doc.setFillColor(255,244,196);const ls=doc.splitTextToSize(lab+m.t,CW-6);const hh=ls.length*lh(8.5)+3;need(hh);doc.roundedRect(M,y,CW,hh,1.5,1.5,"F");
      let yy=y+1.6;ls.forEach((l,i)=>{font(i===0&&lab?"normal":"normal",8.5,ink);doc.text(l,M+3,yy+lh(8.5)*.78);yy+=lh(8.5)});y+=hh+1.5})}
  }
  /* Deckblatt mit Inhalt (kommt zum Schluss und wird nach vorn geschoben) */
  doc.addPage();cur=null;y=M;
  doc.setFillColor(106,72,238);doc.roundedRect(M,y,CW,46,4,4,"F");doc.setFillColor(176,107,255);doc.roundedRect(M+CW-62,y,62,46,4,4,"F");doc.setFillColor(106,72,238);doc.rect(M+CW-62,y,20,46,"F");
  font("bold",24,[255,255,255]);doc.text("Mein Spickzettel",M+8,y+18);
  font("normal",11,[255,255,255]);doc.text(`${toc.length} ${toc.length===1?"Eröffnung":"Eröffnungen"} · Zugzwang Eröffnungstrainer`,M+8,y+27);
  font("normal",9,[255,255,255]);doc.text("Erstellt am "+new Date().toLocaleDateString("de-DE",{day:"numeric",month:"long",year:"numeric"}),M+8,y+35);
  try{const tw=await svgPngData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="200" height="220">${TR_ART.mila("happy",true)}</svg>`,400,440);doc.addImage(tw,"PNG",M+CW-46,y+2,40,44)}catch(e){}
  y+=56;
  const grp=[["w","Mit Weiß"],["b","Mit Schwarz"],["x","Gambits & Fallen"],["c","Eigene Varianten"]];
  font("bold",13,ink);doc.text("Inhalt",M,y);y+=7;
  grp.forEach(([g,t])=>{const L=toc.filter(e=>(e.o.g==="x"?"x":e.o.g==="c"?"c":e.o.side)===g);if(!L.length)return;
    need(12);font("bold",9,CHEAT_COL[g]);doc.text(t.toUpperCase(),M,y+3);y+=7;
    L.forEach(e=>{need(6);font("normal",10.5,ink);doc.text(e.o.name,M+2,y+3);const pg=String(e.page+1);font("bold",10.5,ink);doc.text(pg,M+CW,y+3,{align:"right"});
      const x1=M+4+doc.getTextWidth(e.o.name),x2=M+CW-doc.getTextWidth(pg)-2;font("normal",10.5,[190,182,170]);let dots="";while(doc.getTextWidth(dots+" .")<x2-x1-2)dots+=" .";doc.text(dots,x1,y+3);y+=6.4});y+=3});
  y+=4;head("So liest du den Spickzettel",[106,72,238]);
  ["Schlüsselstellungen zeigen die Stellung nach einem wichtigen Zug, darunter steht, warum er gespielt wird.","Im Zugbaum steht jede Abzweigung eingerückt unter dem Zug, nach dem sie abzweigt. Der farbige Name am Zeilenende ist der Name der Variante.","Die Diagramme zeigen das Brett aus deiner Sicht. Der zuletzt gespielte Zug ist gelb markiert.","Deine Notizen aus der App stehen auf gelbem Grund bei der passenden Eröffnung."].forEach(t=>{font("bold",9,[106,72,238]);doc.text("•",M+1,y+lh(9)*.78);para(t,M+4.5,CW-4.5,"normal",9,ink,.6)});
  doc.movePage(doc.getNumberOfPages(),1);
  const n=doc.getNumberOfPages();
  for(let i=1;i<=n;i++){doc.setPage(i);font("normal",7.5,soft);doc.text("Zugzwang · Spickzettel",M,H-8);doc.text(`Seite ${i} von ${n}`,W-M,H-8,{align:"right"});doc.setDrawColor(225,219,208);doc.setLineWidth(.2);doc.line(M,H-11,W-M,H-11)}
  return {blob:doc.output("blob"),pages:n,count:toc.length};
}
function fens0(seq){const g=new Chess();for(let i=0;i<seq.length-1;i++){const mv=findMove(g,seq[i]);if(!mv)break;g.move(mv.san)}return g.fen()}
async function svgPngData(svg,w,h){
  const url=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));const img=new Image();await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});
  const cv=document.createElement("canvas");cv.width=w;cv.height=h;cv.getContext("2d").drawImage(img,0,0,w,h);URL.revokeObjectURL(url);return cv.toDataURL("image/png");
}
async function fileShare(blob,name,type,title){
  try{const file=new File([blob],name,{type});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title});return "shared"}}catch(e){if(e&&e.name==="AbortError")return "abort"}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);return "saved";
}
function cheatDialog(){
  const pool=ALL.filter(o=>o.lines&&o.lines.length&&!/^__/.test(o.id));
  const practiced=pool.filter(o=>S.prog[o.id]&&Object.keys(S.prog[o.id]).length).map(o=>o.id);
  let sel=new Set(S.rep.filter(id=>byId(id)).length?S.rep.filter(id=>byId(id)):practiced);
  const groups=[["w","Mit Weiß"],["b","Mit Schwarz"],["x","Gambits & Fallen"],["c","Eigene Varianten"]];
  const gOf=o=>o.g==="x"?"x":o.g==="c"?"c":o.side;
  const ov=document.createElement("div");ov.className="onb";
  ov.innerHTML=`<div class="onb-box cheat-dlg" role="dialog" aria-modal="true" aria-label="Spickzettel als PDF"><div class="cheat-hd"><span class="cheat-ic">${NI.print}</span><div><h2>Spickzettel als PDF</h2><p class="hint">Pro Eröffnung: Schlüsselstellungen mit Erklärung, Zugbaum, Pläne, Fallen und deine Notizen.</p></div></div>
    <div class="chips cheat-q">${S.rep.filter(id=>byId(id)).length?`<button class="chip" data-q="rep">Mein Repertoire (${S.rep.filter(id=>byId(id)).length})</button>`:""}${practiced.length?`<button class="chip" data-q="prac">Geübte (${practiced.length})</button>`:""}<button class="chip" data-q="w">Alle mit Weiß</button><button class="chip" data-q="b">Alle mit Schwarz</button><button class="chip" data-q="none">Keine</button></div>
    <div class="cheat-list">${groups.map(([g,t])=>{const L=pool.filter(o=>gOf(o)===g);return L.length?`<div class="cheat-g"><b>${t}</b>${L.map(o=>`<label class="cheat-it"><input type="checkbox" value="${esc(o.id)}"><span>${esc(o.name)}</span><small>${o.lines.length}</small></label>`).join("")}</div>`:""}).join("")}</div>
    <p class="cheat-sum" id="cheatSum"></p>
    <div class="btnrow onb-act"><button class="btn" data-x>Abbrechen</button><button class="btn grn" data-go>PDF erstellen</button></div></div>`;
  document.body.appendChild(ov);
  const boxes=[...ov.querySelectorAll(".cheat-it input")];
  const sync=()=>{boxes.forEach(b=>b.checked=sel.has(b.value));const n=sel.size,pg=1+[...sel].reduce((a,id)=>{const o=byId(id);return a+(o&&o.lines.length>12?2:1)},0);ov.querySelector("#cheatSum").textContent=n?`${n} ${n===1?"Eröffnung":"Eröffnungen"} · etwa ${pg} Seiten`:"Wähle mindestens eine Eröffnung.";ov.querySelector("[data-go]").disabled=!n};
  boxes.forEach(b=>b.onchange=()=>{if(b.checked)sel.add(b.value);else sel.delete(b.value);sync()});
  ov.querySelectorAll("[data-q]").forEach(c=>c.onclick=()=>{const q=c.dataset.q;
    sel=new Set(q==="rep"?S.rep.filter(id=>byId(id)):q==="prac"?practiced:q==="none"?[]:pool.filter(o=>o.g!=="c"&&o.g!=="x"&&o.side===q).map(o=>o.id));sync()});
  sync();
  const close=()=>{ov.remove();document.removeEventListener("keydown",k_)};const k_=e=>{if(e.key==="Escape"&&!busyPdf)close()};document.addEventListener("keydown",k_);
  let busyPdf=false;ov.onclick=e=>{if(e.target===ov&&!busyPdf)close()};ov.querySelector("[data-x]").onclick=()=>{if(!busyPdf)close()};
  ov.querySelector("[data-go]").onclick=async()=>{
    if(busyPdf||!sel.size)return;busyPdf=true;const go=ov.querySelector("[data-go]");go.disabled=true;
    const order=pool.filter(o=>sel.has(o.id)).sort((a,b)=>"wbxc".indexOf(gOf(a))-"wbxc".indexOf(gOf(b))).map(o=>o.id);
    const sum=ov.querySelector("#cheatSum");
    try{const R=await cheatPdf(order,(i,n,name)=>{go.textContent=`Erstelle PDF … ${i}/${n}`;sum.textContent=name});
      busyPdf=false;const name=`Zugzwang-Spickzettel-${new Date().toISOString().slice(0,10)}.pdf`;
      sum.textContent=`Fertig: ${R.pages} Seiten mit ${R.count} ${R.count===1?"Eröffnung":"Eröffnungen"}.`;
      const act=ov.querySelector(".onb-act"),canSh=!!(navigator.canShare&&navigator.canShare({files:[new File([R.blob],name,{type:"application/pdf"})]}));act.innerHTML=`<button class="btn" data-x>Schließen</button><button class="btn${canSh?"":" grn"}" data-save>Speichern</button>${canSh?'<button class="btn grn" data-share>Teilen</button>':""}`;
      act.querySelector("[data-x]").onclick=close;
      act.querySelector("[data-save]").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(R.blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)};
      const sh=act.querySelector("[data-share]");if(sh)sh.onclick=()=>fileShare(R.blob,name,"application/pdf","Mein Eröffnungs-Spickzettel");
      window.__lastPdf=R;
    }catch(e){busyPdf=false;go.disabled=false;go.textContent="PDF erstellen";sum.textContent="Das PDF konnte nicht erstellt werden"+(navigator.onLine===false?" – beim ersten Mal braucht die App dafür Internet.":".")}
  };
}

/* ================= Neue Version: Hinweis statt veralteter App ================= */
/* Bleibt die App tagelang offen (z. B. auf dem Handy), läuft sonst alter Code – und zwei Spieler hätten unterschiedliche Versionen. */
(function(){
  if(!("serviceWorker" in navigator)||location.protocol!=="https:")return;
  let had=!!navigator.serviceWorker.controller,shown=false;
  navigator.serviceWorker.getRegistration().then(reg=>{if(!reg)return;const up=()=>reg.update().catch(()=>{});document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")up()});setInterval(up,30*60000)}).catch(()=>{});
  navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!had){had=true;return}if(!shown){shown=true;updBanner()}});
})();
function updBanner(){
  const busyGame=()=>mode==="online"&&ON.g&&ON.g.status==="active"&&!ON.spect;
  if(busyGame()){setTimeout(updBanner,15000);return}
  if(document.getElementById("updBar"))return;const el=document.createElement("div");el.id="updBar";el.className="updbar";el.setAttribute("role","status");
  el.innerHTML=`<span>Neue Version von ${BRAND} verfügbar</span><button class="btn grn" id="updGo">Neu laden</button><button class="btn" id="updNo" aria-label="Später" title="Später">✕</button>`;
  document.body.appendChild(el);$("updGo").onclick=()=>{cloudPush(true).catch(()=>{}).then(()=>location.reload())};$("updNo").onclick=()=>el.remove();
}

/* ================= Start ================= */
applySettings();$("micBtn").onclick=vrToggle;vrUi();
st.badges=BADGES.filter(b=>{try{return b.ok()}catch(e){return false}}).map(b=>b.id);saveStats();
const last=store.get("et-last",null);
try{
  op=byId(last)||ALL[0];
  if(!checkShareHash()){
    if(location.hash==="#impressum")legalTab="imp";
    const hv=HASHV[location.hash];
    const pm=location.hash.match(/^#play=([A-Za-z0-9_-]+)/);
    if(pm){selectOpening(op);history.replaceState(null,"",location.pathname);openOnlineGame(pm[1])}
    else if(location.hash==="#taeglich")startSession("daily");
    else{selectOpening(op);showView(hv||"home")}
  }
}catch(err){window.__showErr(String(err&&err.stack||err))}
renderTabbar();
{const sp=$("splash");if(sp){setTimeout(()=>{sp.classList.add("out");setTimeout(()=>sp.remove(),400)},300)}}
setTimeout(warmArt,2500);
const firstRun=!store.get("et-onb",0)&&!last&&!Object.keys(S.prog).length;
if(firstRun&&!location.hash)setTimeout(openLanding,300);else if(firstRun)setTimeout(openOnboarding,350);else store.set("et-onb",1);
setTimeout(()=>autoSync(false),2500);
if(onlineReady())setTimeout(onlineBoot,600);
window.__ET={updBanner,ptStart,PT,ptCond,byId,findMove,cheatPdf,pieceImgs,parseSpoken,get tp(){return tp},tryMove:(a,b,an,p)=>tryMove(a,b,an!==false,p),CLK,hist:()=>hist.slice(),srvNow,PZ,GX,st,gain,isoWeek,gxSettle,gxRoll,tacticSession,renderStats:()=>showView("profile:stats"),ON,MM,mmStart,mmStop,sendQuick,TOUR,FEED,openLanding,openAnaBoard,startBot,goSection,sectionOf,legal:t=>{legalTab=t},openOnlineGame,createGame,joinGame,onlineBoot,autoSync,confetti,celebrate,openOnboarding,takeBack,applySettings,render:()=>render(),setTab:t=>setTab(t),select:(id,l)=>selectOpening(ALL.find(o=>o.id===id),l),hint:()=>$("hintBtn").click(),expected:()=>expected(),fen:()=>shown.fen(),orient:()=>orient(),mode:()=>mode,S,CH,analyze,normPgnGame,normLichess,normApiGame,pgnMoves,pgnLines,explain,matchGame,ALL:()=>ALL,startSession,openGame,openEditor,startEngine,showView,parseMoveQuery,dueKeys,reviewGame,startPuzzle,startEndgame,game:()=>game};
})();
