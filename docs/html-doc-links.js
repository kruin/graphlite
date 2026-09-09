(() => {
  'use strict';

  const scriptUrl = new URL(document.currentScript?.src || 'html-doc-links.js', location.href);
  const viewerUrl = new URL('view.html', scriptUrl);
  const siteRoot = new URL('../', scriptUrl);

  function routeMarkdownLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute('href') || '';
      if (!raw || link.hasAttribute('download') || /^\s*(?:mailto:|tel:|javascript:)/i.test(raw)) return;
      let target;
      try { target = new URL(raw, location.href); } catch (_error) { return; }
      if (target.origin !== location.origin || !/\.md$/i.test(target.pathname)) return;
      if (!target.pathname.startsWith(siteRoot.pathname)) return;
      const relativeToRoot = decodeURIComponent(target.pathname.slice(siteRoot.pathname.length));
      const routed = new URL(viewerUrl.href);
      routed.searchParams.set('doc', `../${relativeToRoot}`);
      routed.hash = target.hash;
      link.setAttribute('href', `${routed.pathname}${routed.search}${routed.hash}`);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', routeMarkdownLinks, { once: true });
  else routeMarkdownLinks();
})();
