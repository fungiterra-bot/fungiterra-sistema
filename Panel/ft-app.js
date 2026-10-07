/* Fungiterra — app instalable, avisos push y conteo de uso (v1, 2026-10-07).
   Se carga al final de cada panel:
     <script src="ft-app.js" data-panel="admin" defer></script>
   - Registra el service worker (sw.js) para que el panel se pueda instalar.
   - Botón 🔔 (abajo a la derecha) para activar / probar / quitar los avisos.
     Los avisos llegan al mismo grupo que hoy recibe el correo del panel.
   - Cuenta los clics en pestañas y botones (sin datos de clientes) y los manda
     cada minuto a /api/uso, para decidir qué se queda y qué se quita.
   Las llamadas al API usan window.fetch, así que llevan la sesión del panel. */
(function () {
  var script = document.currentScript;
  var API = 'https://fungiterra-api-production.up.railway.app';
  var PANEL = (script && script.getAttribute('data-panel')) || 'desconocido';
  if (PANEL === 'insumos' && window.FT_AREA_ACTIVA) PANEL = window.FT_AREA_ACTIVA;
  var COLOR = (script && script.getAttribute('data-color')) || '#0177bf';

  var esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var instalada = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  var soportaPush = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  var registro = null;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: './' })
      .then(function (r) { registro = r; pintarBoton(); })
      .catch(function (e) { console.warn('sw', e); });
  }

  // ── Botón y menú de avisos ──────────────────────────────────────
  var css = document.createElement('style');
  css.textContent =
    '#ft-av-btn{position:fixed;right:16px;bottom:16px;z-index:1000000;width:46px;height:46px;border-radius:50%;border:none;' +
    'background:' + COLOR + ';color:#fff;font-size:20px;box-shadow:0 4px 14px rgba(0,0,0,.22);cursor:pointer;display:none}' +
    '#ft-av-btn.off{background:#fff;color:' + COLOR + ';border:2px solid ' + COLOR + '}' +
    '#ft-av-btn .pt{position:absolute;top:6px;right:7px;width:9px;height:9px;border-radius:50%;background:#e74c3c;border:2px solid #fff}' +
    '#ft-av-menu{position:fixed;right:16px;bottom:72px;z-index:1000001;background:#fff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.2);' +
    'width:270px;max-width:calc(100vw - 32px);padding:14px;font:13px/1.45 system-ui,sans-serif;color:#2b2b28;display:none}' +
    '#ft-av-menu b{display:block;font-size:14px;margin-bottom:6px}' +
    '#ft-av-menu p{margin:0 0 10px;color:#5b6470}' +
    '#ft-av-menu button{display:block;width:100%;margin-top:6px;padding:9px;border-radius:8px;border:1px solid #d9dee5;background:#f6f8fa;' +
    'font:600 13px system-ui,sans-serif;cursor:pointer;color:#2b2b28}' +
    '#ft-av-menu button.pri{background:' + COLOR + ';border-color:' + COLOR + ';color:#fff}' +
    '#ft-av-menu a.pie{display:block;margin-top:12px;padding-top:10px;border-top:1px solid #e2e6e3;text-align:center;font-weight:600;font-size:12.5px;color:#5b6470;text-decoration:none}' +
    '#ft-av-menu .msg{margin-top:8px;font-size:12px;color:#5b6470;min-height:16px}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.id = 'ft-av-btn'; btn.type = 'button'; btn.title = 'Avisos de la app';
  btn.setAttribute('data-uso', 'Botón avisos 🔔');
  var menu = document.createElement('div');
  menu.id = 'ft-av-menu';
  // El contenido cambia según el estado de los avisos; el pie "Cambiar de panel" es fijo.
  var cont = document.createElement('div');
  var pie = document.createElement('a');
  pie.href = 'inicio.html?elegir=1'; pie.className = 'pie'; pie.textContent = 'Cambiar de panel';
  pie.setAttribute('data-uso', 'Cambiar de panel');
  menu.appendChild(cont); menu.appendChild(pie);
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(btn); document.body.appendChild(menu); pintarBoton(); });
  if (document.body) { document.body.appendChild(btn); document.body.appendChild(menu); }

  btn.addEventListener('click', function () {
    if (menu.style.display === 'block') { menu.style.display = 'none'; return; }
    pintarMenu(); menu.style.display = 'block';
  });
  document.addEventListener('click', function (e) {
    if (menu.style.display === 'block' && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) menu.style.display = 'none';
  });

  function suscripcionActual() {
    if (!registro || !soportaPush) return Promise.resolve(null);
    return registro.pushManager.getSubscription();
  }

  function pintarBoton() {
    if (!btn) return;
    var mostrar = soportaPush || (esIOS && !instalada);
    btn.style.display = mostrar ? 'block' : 'none';
    if (!mostrar) return;
    suscripcionActual().then(function (s) {
      var activo = !!s && Notification.permission === 'granted';
      btn.className = activo ? '' : 'off';
      btn.innerHTML = '🔔' + (activo ? '' : '<span class="pt"></span>');
    }).catch(function () {});
  }

  function msg(t) { var m = document.getElementById('ft-av-msg'); if (m) m.textContent = t; }

  function pintarMenu() {
    if (!soportaPush && esIOS && !instalada) {
      cont.innerHTML = '<b>🔔 Avisos en iPhone</b><p>Primero instala la app: toca <b style="display:inline">Compartir</b> (el cuadro con flecha) → ' +
        '<b style="display:inline">Agregar a pantalla de inicio</b>. Ábrela desde ese ícono y vuelve a tocar 🔔.</p>';
      return;
    }
    if (!soportaPush) { cont.innerHTML = '<b>🔔 Avisos</b><p>Este navegador no permite avisos. Usa Chrome en Android o computadora.</p>'; return; }
    suscripcionActual().then(function (s) {
      var activo = !!s && Notification.permission === 'granted';
      if (Notification.permission === 'denied') {
        cont.innerHTML = '<b>🔔 Avisos bloqueados</b><p>Los bloqueaste en este dispositivo. Actívalos en los ajustes del navegador (permisos del sitio → Notificaciones) y vuelve a intentar.</p>';
        return;
      }
      cont.innerHTML = activo
        ? '<b>🔔 Avisos activados</b><p>Te llegan los mismos avisos que hoy recibes por correo de este panel.</p>' +
          '<button class="pri" id="ft-av-probar">Mandar aviso de prueba</button><button id="ft-av-quitar">Quitar avisos en este dispositivo</button><div class="msg" id="ft-av-msg"></div>'
        : '<b>🔔 Activar avisos</b><p>Recibe en este dispositivo los avisos de este panel (pedidos nuevos, alertas), aunque la app esté cerrada.</p>' +
          (!instalada ? '<p style="font-size:12px">Tip: instálala como app desde el menú del navegador (⋮ → Instalar app / Agregar a pantalla de inicio).</p>' : '') +
          '<button class="pri" id="ft-av-activar">Activar avisos</button><div class="msg" id="ft-av-msg"></div>';
      var a = document.getElementById('ft-av-activar'); if (a) a.onclick = activar;
      var p = document.getElementById('ft-av-probar'); if (p) p.onclick = probar;
      var q = document.getElementById('ft-av-quitar'); if (q) q.onclick = quitar;
    });
  }

  function claveABytes(b64) {
    var pad = '='.repeat((4 - b64.length % 4) % 4);
    var raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  function activar() {
    msg('Activando…');
    Notification.requestPermission().then(function (perm) {
      if (perm !== 'granted') { msg('No diste permiso para avisos.'); return; }
      return window.fetch(API + '/push/clave-publica').then(function (r) { return r.json(); }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'Avisos no disponibles');
        return Promise.resolve(registro || navigator.serviceWorker.ready).then(function (reg) {
          registro = reg;
          return registro.pushManager.getSubscription().then(function (s) {
            return s || registro.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: claveABytes(d.clave) });
          });
        });
      }).then(function (sub) {
        return window.fetch(API + '/push/suscribir', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ suscripcion: sub.toJSON() }) }).then(function (r) { return r.json(); });
      }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'No se pudo guardar');
        pintarBoton(); pintarMenu();
        setTimeout(function () { msg('✅ Listo. Prueba con el botón de arriba.'); }, 50);
      });
    }).catch(function (e) { msg('⚠️ ' + (e.message || 'Error al activar')); });
  }

  function probar() {
    msg('Enviando…');
    suscripcionActual().then(function (s) {
      if (!s) throw new Error('No hay suscripción');
      return window.fetch(API + '/push/prueba', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: s.endpoint }) }).then(function (r) { return r.json(); });
    }).then(function (d) { msg(d.ok ? '✅ Enviado. Debe llegar en unos segundos.' : '⚠️ ' + (d.error || 'No se pudo')); })
      .catch(function (e) { msg('⚠️ ' + e.message); });
  }

  function quitar() {
    suscripcionActual().then(function (s) {
      if (!s) return;
      return window.fetch(API + '/push/desuscribir', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: s.endpoint }) }).catch(function () {}).then(function () {
        // Solo se desuscribe del navegador si no hay otros paneles usando la misma suscripción;
        // como no lo sabemos desde aquí, la dejamos y solo se borra este grupo en el servidor.
      });
    }).then(function () { pintarBoton(); cont.innerHTML = '<b>🔕 Avisos quitados</b><p>Ya no te llegarán avisos de este panel en este dispositivo.</p>'; });
  }

  // ── Conteo de uso ───────────────────────────────────────────────
  // Solo cuenta controles (pestañas, botones, menús). Las filas de pedidos y
  // tarjetas se registran por el nombre de su función, nunca por su texto,
  // para no guardar nombres de clientes.
  var cola = {}, hayCola = false;
  var SEL = 'button,a,select,[onclick],[role="tab"],.nav-item,[class*="tab"]';
  function etiqueta(el) {
    var fijo = el.getAttribute('data-uso'); if (fijo) return fijo;
    var on = el.getAttribute('onclick') || '';
    var fn = (on.match(/^\s*([A-Za-z_$][\w$]*)\s*\(/) || [])[1] || '';
    var dentroDeDatos = el.closest('tbody,tr,.pedido-card,.pedido-header,.prod-row,.cli-row,.ft-card');
    var esControl = el.matches('button,a,select,[role="tab"],.nav-item,[class*="tab"]');
    if (dentroDeDatos && !esControl) return fn ? '[' + fn + ']' : '';
    var txt = (el.getAttribute('aria-label') || el.title || el.textContent || '').replace(/\s+/g, ' ').trim()
      .replace(/\d+([.,]\d+)?/g, '#').replace(/(#\s*)+$/, '').trim();
    if (dentroDeDatos) txt = txt.length > 25 ? '' : txt; // botones dentro de una fila: solo textos cortos tipo "Ver", "Editar"
    if (el.tagName === 'SELECT') txt = 'Lista ' + (el.id || el.name || fn || '');
    var t = (txt || (fn ? '[' + fn + ']' : '')).slice(0, 60);
    return t;
  }
  document.addEventListener('click', function (e) {
    try {
      var el = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (!el || el.closest('#ft-av-menu')) return;
      var t = etiqueta(el);
      if (!t) return;
      cola[t] = (cola[t] || 0) + 1; hayCola = true;
    } catch (err) {}
  }, true);
  function enviarUso(salida) {
    if (!hayCola) return;
    var eventos = cola; cola = {}; hayCola = false;
    try {
      window.fetch(API + '/api/uso', { method: 'POST', keepalive: !!salida, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panel: PANEL, eventos: eventos }) }).catch(function () {});
    } catch (err) {}
  }
  setInterval(enviarUso, 60000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') enviarUso(true); });
  window.addEventListener('pagehide', function () { enviarUso(true); });
})();
