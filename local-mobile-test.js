/* local-mobile-test.js
   Overdraagbare lokale desktop/mobile-testknop. De file staat in de
   repository, maar activeert zichzelf uitsluitend op file:, localhost of
   127.0.0.1. De gepubliceerde viewer laadt hem daardoor niet. */
(function () {
  'use strict';
  var host = (window.location.hostname || '').toLowerCase();
  var isLocal = window.location.protocol === 'file:' || !host || host === 'localhost' || host === '127.0.0.1';
  if (!isLocal || document.getElementById('localMobileTestPanel')) return;

  function currentMode() {
    try {
      return new URLSearchParams(window.location.search || '').get('viewport') || 'auto';
    } catch (_err) {
      return 'auto';
    }
  }

  function setMode(mode) {
    var url = new URL(window.location.href);
    if (!mode || mode === 'auto') {
      url.searchParams.delete('viewport');
      url.searchParams.delete('device');
    } else {
      url.searchParams.set('viewport', mode);
      url.searchParams.delete('device');
    }
    var version = window.__OPENGRAPH_EXPECTED_VERSION__
      || document.documentElement.dataset.version
      || '';
    if (version) url.searchParams.set('ogv', version);
    else url.searchParams.delete('ogv');
    url.searchParams.set('nocache', String(Date.now()));
    window.location.href = url.toString();
  }

  var style = document.createElement('style');
  style.textContent = [
    '#localMobileTestPanel{position:fixed;right:.65rem;bottom:.65rem;z-index:99999;display:flex;gap:.35rem;align-items:center;padding:.42rem .48rem;border:1px solid #cbd5e1;border-radius:.75rem;background:rgba(248,250,252,.96);box-shadow:0 12px 30px rgba(15,23,42,.20);font:12px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;color:#0f172a}',
    '#localMobileTestPanel strong{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#475569}',
    '#localMobileTestPanel select,#localMobileTestPanel button{font:inherit;border:1px solid #94a3b8;border-radius:.55rem;background:white;color:#0f172a;padding:.32rem .42rem}',
    '#localMobileTestPanel button{font-weight:800;cursor:pointer}',
    'body.config-screen-active #localMobileTestPanel,body.help-screen-active #localMobileTestPanel{display:none!important}',
    '@media(max-width:760px){#localMobileTestPanel{display:none}}'
  ].join('\n');
  document.head.appendChild(style);

  var panel = document.createElement('div');
  panel.id = 'localMobileTestPanel';
  panel.title = 'Lokale testknop. Wordt niet op GitHub Pages geladen.';

  var label = document.createElement('strong');
  label.textContent = 'lokaal';
  panel.appendChild(label);

  var select = document.createElement('select');
  select.setAttribute('aria-label', 'Lokale mobile-test kiezen');
  [
    ['auto', 'auto'],
    ['desktop', 'desktop'],
    ['mobile-portrait', 'mobile staand'],
    ['mobile-landscape', 'mobile liggend']
  ].forEach(function (row) {
    var opt = document.createElement('option');
    opt.value = row[0];
    opt.textContent = row[1];
    select.appendChild(opt);
  });
  select.value = currentMode();
  select.addEventListener('change', function () { setMode(select.value); });
  panel.appendChild(select);

  var reset = document.createElement('button');
  reset.type = 'button';
  reset.textContent = 'reset';
  reset.title = 'Terug naar automatische viewport';
  reset.addEventListener('click', function () { setMode('auto'); });
  panel.appendChild(reset);

  function mountPanel() {
    if (document.body && !document.getElementById('localMobileTestPanel')) document.body.appendChild(panel);
  }
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', mountPanel, { once: true });
  } else {
    mountPanel();
  }
}());
