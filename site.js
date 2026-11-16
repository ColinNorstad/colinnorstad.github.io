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
