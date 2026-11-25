/* Service Worker: Seite offline verfügbar machen. Eigene Dateien: erst Netz, dann Cache. Stockfish: erst Cache. */
const CACHE="et-v41";
const CORE=["./","index.html","eco.js","style.css","pieces.css","app.js","data.js","trees.js","coaches.js","trainers.js","worlds.js","sections.js","keymoves.js","plans.js","lib/chess.js","manifest.webmanifest","icons/icon-192.png","icons/apple-touch-icon.png","lib/fonts/rubik-latin-wght.woff2",
  "lib/fonts/caveat-bold.woff2","lib/fonts/bungee.woff2","lib/fonts/cinzel-bold.woff2","lib/fonts/im-fell-english-sc.woff2","lib/fonts/uncial-antiqua.woff2","lib/fonts/bangers.woff2","lib/fonts/orbitron-bold.woff2","lib/fonts/special-elite.woff2","lib/fonts/pirata-one.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;const url=new URL(req.url);
  if(url.origin===location.origin&&/\/lib\/firebase\//.test(url.pathname)){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r})));
  }else if(url.origin===location.origin){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r}).catch(()=>caches.match(req).then(r=>r||caches.match("index.html"))));
  }else if(/stockfish/.test(url.pathname)){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r})));
  }
});
/* Erinnerungen (Firebase Cloud Messaging, nur Daten): t = Titel, b = Text, u = Ziel, n = fällige Varianten fürs App-Symbol */
self.addEventListener("push",e=>{let d={};try{const j=e.data?e.data.json():{};d=j&&j.data?j.data:j||{}}catch(_){try{d={b:e.data.text()}}catch(__){}}
  const n=+d.n||0,o={body:d.b||"Zeit für dein Training!",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:d.tag||"zz-remind",data:{u:d.u||"./#taeglich"}};
  e.waitUntil(Promise.all([self.registration.showNotification(d.t||"Zugzwang",o),n&&self.navigator&&self.navigator.setAppBadge?self.navigator.setAppBadge(n).catch(()=>{}):null]))});
self.addEventListener("notificationclick",e=>{e.notification.close();const u=new URL((e.notification.data&&e.notification.data.u)||"./",self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(L=>{const c=L.find(x=>x.url.indexOf(self.registration.scope)===0);
    if(c){c.postMessage({type:"go",hash:new URL(u).hash});return c.focus()}return self.clients.openWindow(u)}))});
