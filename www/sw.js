const V='ih-v1';
const CORE=["404.html","about.html","assets/css/style.css","assets/icons/icon-192.png","assets/icons/icon-512.png","assets/icons/maskable-192.png","assets/icons/maskable-512.png","assets/img/abaya-1-a.webp","assets/img/abaya-1-b.webp","assets/img/abaya-2-a.webp","assets/img/abaya-2-b.webp","assets/img/abaya-3-a.webp","assets/img/abaya-3-b.webp","assets/img/abaya-4-a.webp","assets/img/abaya-4-b.webp","assets/img/abaya-5-a.webp","assets/img/abaya-5-b.webp","assets/img/abaya-6-a.webp","assets/img/abaya-6-b.webp","assets/img/bag-1-a.webp","assets/img/bag-1-b.webp","assets/img/bag-2-a.webp","assets/img/bag-2-b.webp","assets/img/bikini-bottom-a.webp","assets/img/bikini-bottom-b.webp","assets/img/bikini-top-a.webp","assets/img/bikini-top-b.webp","assets/img/dress-front-a.webp","assets/img/dress-front-b.webp","assets/img/ghost-02-a.webp","assets/img/ghost-02-b.webp","assets/img/ghost-06-a.webp","assets/img/ghost-06-b.webp","assets/img/ghost-07-a.webp","assets/img/ghost-07-b.webp","assets/img/hoodie-a.webp","assets/img/hoodie-b.webp","assets/img/jacket-back-a.webp","assets/img/jacket-back-b.webp","assets/img/jacket-front-a.webp","assets/img/jacket-front-b.webp","assets/img/masking-blonde-a.webp","assets/img/masking-blonde-b.webp","assets/img/masking-curly-a.webp","assets/img/masking-curly-b.webp","assets/img/newborn-a.webp","assets/img/newborn-b.webp","assets/img/panel-a.webp","assets/img/panel-b.webp","assets/img/portrait-a.webp","assets/img/portrait-b.webp","assets/img/ring-a.webp","assets/img/ring-b.webp","assets/img/shoe-a.webp","assets/img/shoe-b.webp","assets/img/skirt-a.webp","assets/img/skirt-b.webp","assets/img/swim-back-a.webp","assets/img/swim-back-b.webp","assets/img/swim-front-a.webp","assets/img/swim-front-b.webp","assets/img/watch-a.webp","assets/img/watch-b.webp","assets/js/main.js","clipping-path.html","contact.html","ecommerce-image-editing.html","index.html","manipulation.html","photo-retouching.html","portfolio.html","pricing.html","raster-to-vector.html","services.html","shadow.html","manifest.webmanifest","./"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(!/^https?:$/.test(u.protocol))return;
  const same=u.origin===location.origin;
  if(same&&(r.mode==='navigate'||/\.(html|css|js)$/.test(u.pathname))){
    // network first so edits show up, cache as fallback
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('404.html'))));
    return;
  }
  // images, fonts, CDN scripts: cache first, then network
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>m)));
});
