/* 오독오독 매체 치유 — 오프라인에서도 화면이 뜨도록 하는 간단한 서비스 워커
   항상 인터넷에서 최신 화면을 먼저 받아요 (브라우저 캐시도 건너뜀). 인터넷이 끊겼을 때만 저장해 둔 화면을 보여 줘요. */
const CACHE='odokodok-rx-v3';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(u.href,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')).then(r=>r||caches.match('./'))));
});
