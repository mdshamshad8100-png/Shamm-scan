// Bump VERSION whenever you upload a new index.html
const VERSION='shamm-v4',CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'],
 PDFLIB='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(async c=>{await c.addAll(CORE);try{await c.add(PDFLIB);}catch(_){}}).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const same=new URL(e.request.url).origin===location.origin;
 e.respondWith((async()=>{
  const c=await caches.open(VERSION);
  if(same){ // app files: network first so updates arrive, cache when offline
   try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r;}
   catch(_){return (await c.match(e.request))||(await c.match('index.html'));}
  }
  const hit=await c.match(e.request);if(hit)return hit; // PDF library: cache first
  const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r;
 })());});
