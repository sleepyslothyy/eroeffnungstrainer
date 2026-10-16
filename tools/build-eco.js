// Baut eco.js aus der Lichess-Eröffnungsdatenbank (https://github.com/lichess-org/chess-openings, CC0).
// Aufruf: node tools/build-eco.js <ordner mit a.tsv … e.tsv>
// Ergebnis: eco.js mit allen benannten Eröffnungen (ECO, Name, Züge, Stellungs-Hash) und der Menge aller Theorie-Stellungen.
const fs=require("fs"),path=require("path");const {Chess}=require("../lib/chess.js");
const dir=process.argv[2];const rows=[];
for(const f of "abcde"){fs.readFileSync(path.join(dir,f+".tsv"),"utf8").split("\n").slice(1).forEach(l=>{if(!l.trim())return;const [eco,name,pgn]=l.split("\t");rows.push({eco,name,pgn})})}
const h32=s=>{let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)}return h>>>0};
const epd=fen=>fen.split(" ").slice(0,4).join(" ");
const all=new Set();const out=[];let bad=0;
rows.forEach(r=>{const g=new Chess();const sans=[];for(const t of r.pgn.split(/\s+/)){if(!t||/^\d+\.+$/.test(t))continue;const m=g.move(t);if(!m){bad++;return}sans.push(m.san);all.add(h32(epd(g.fen())))}
  out.push([r.eco,r.name,sans.join(" "),h32(epd(g.fen())).toString(36)])});
out.sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:a[2].length-b[2].length);
const arr=new Uint32Array([...all].sort((a,b)=>a-b));const p=Buffer.from(arr.buffer).toString("base64");
const txt=out.map(e=>e.join("\t")).join("\n");
fs.writeFileSync(path.join(__dirname,"..","eco.js"),`/* Eröffnungsnamen und Theorie: Lichess chess-openings (CC0, https://github.com/lichess-org/chess-openings). Erzeugt mit tools/build-eco.js */\nwindow.ECO_DB={n:${out.length},e:${JSON.stringify(txt)},p:"${p}"};\n`);
console.log("Einträge",out.length,"Stellungen",all.size,"fehlerhaft",bad);
