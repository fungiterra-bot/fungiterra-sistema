// Fungiterra — service worker de la raíz (Cotizador y Repositorio) (app instalable + avisos push).
// v1 (2026-10-07). No guarda datos en caché: los paneles siempre se cargan
// frescos de internet; si no hay conexión muestra un aviso simple.
const VERSION_SW = 'ft-sw-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<body style="font-family:sans-serif;text-align:center;padding:60px 20px;color:#2b2b28">' +
    '<div style="font-size:40px">📶</div><h2>Sin conexión</h2><p>Revisa tu internet y vuelve a abrir la app.</p></body>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { titulo: 'Fungiterra', cuerpo: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Fungiterra', {
    body: d.cuerpo || '',
    icon: 'Panel/app/icono-192.png',
    badge: 'Panel/app/insignia-96.png',
    tag: d.tag || undefined,
    data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil((async () => {
    const destino = new URL(url, self.location.href);
    const abiertas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of abiertas) {
      const u = new URL(c.url);
      if (u.pathname === destino.pathname && 'focus' in c) {
        try { c.postMessage({ tipo: 'ft-aviso' }); } catch (err) {}
        return c.focus();
      }
    }
    return self.clients.openWindow(destino.href);
  })());
});
