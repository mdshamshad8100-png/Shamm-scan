// Network-first cache so the app keeps working offline after the first visit.
const C='shamm-v4',F=['./','index.html','manifest.json','icon-192.png','icon-512.png','logo.png'];
self.oninstall=e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()));
self.onactivate=e=>e.waitUntil(clients.claim());
self.onfetch=e=>{if(e.request.method!=='GET')return;
e.respondWith(fetch(e.request).then(r=>{if(new URL(e.request.url).origin===location.origin){const k=r.clone();caches.open(C).then(c=>c.put(e.request,k))}return r}).catch(()=>caches.match(e.request)))};
