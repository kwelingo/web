/* Kwelingo PWA service worker — app shell cache + offline fallback */
const CACHE = 'kwelingo-v1';
const SHELL = [
  'portal.html','index.html','student.html','teacher.html','parent.html',
  'admin.html','master-admin.html','registration.html',
  'assets/style.css','assets/app.js','assets/logo.png','assets/logo-full.png',
  'assets/icon-192.png','assets/icon-512.png','manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  // Biarkan request ke Supabase / API lain lewat jaringan langsung (jangan di-cache)
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate' || req.destination === 'document') {
    // Halaman: network-first (selalu versi terbaru), fallback cache saat offline
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then(m => m || caches.match('portal.html')))
    );
  } else {
    // Aset (css/js/img): cache-first
    e.respondWith(
      caches.match(req).then(m => m || fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; }))
    );
  }
});
