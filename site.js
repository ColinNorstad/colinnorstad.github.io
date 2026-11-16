// Shared behaviour: mobile nav, scroll reveal, life-page filter.
document.documentElement.classList.add('js');

(function () {
  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Scroll reveal (content is visible by default if IntersectionObserver is missing)
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Life page filter
  var buttons = document.querySelectorAll('.filter-btn');
  if (buttons.length) {
    var items = document.querySelectorAll('.life-item');
    var years = document.querySelectorAll('.life-year');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.cat;
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        items.forEach(function (it) { it.hidden = !(cat === 'all' || it.dataset.cat === cat); });
        years.forEach(function (y) {
          var any = false, n = y.nextElementSibling;
          while (n && !n.classList.contains('life-year')) { if (n.classList.contains('life-item') && !n.hidden) any = true; n = n.nextElementSibling; }
          y.hidden = !any;
        });
      });
    });
  }
})();

// Email fallback: many computers have no default mail app, so a mailto: link does nothing.
// Keep the link (it opens a mail app when there is one), and also copy the address and show it.
(function () {
  var timer;
  function toast(addr, copied) {
    var t = document.getElementById('mail-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'mail-toast'; t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = '';
    var msg = document.createElement('span');
    msg.textContent = (copied ? 'Address copied: ' : 'Email: ') + addr;
    var gm = document.createElement('a');
    gm.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(addr);
    gm.target = '_blank'; gm.rel = 'noopener'; gm.textContent = 'Open in Gmail';
    t.appendChild(msg); t.appendChild(gm);
    t.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { t.classList.remove('show'); }, 9000);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a) return;
    var addr = a.getAttribute('href').replace(/^mailto:/i, '').split('?')[0];
    var done = function (ok) { toast(addr, ok); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    } catch (err) { done(false); }
  });
})();
