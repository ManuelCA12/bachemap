const C='bachemap-v5',A=['./','index.html','style.css','app.js','icon.svg','icon-192.png','icon-512.png','manifest.json','https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A).catch(()=>{})).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=e.request.url;
if(u.includes('open-meteo.com')||u.includes('nominatim.openstreetmap.org'))return; // la app maneja su propio caché (localStorage)
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('index.html')));return}
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok&&(u.includes('tile.openstreetmap')||u.includes('unpkg')))caches.open(C).then(c=>c.put(e.request,n.clone()));return n}).catch(()=>new Response('',{status:504,statusText:'Offline'}))))});


