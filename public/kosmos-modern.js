(function () {
  'use strict';

  /* ── Navbar scroll behaviour ──
     Smoothly fade the navbar from transparent (over the hero) to frosted glass
     by mapping scroll position to a 0→1 progress variable the CSS interpolates. */
  var navbar = document.getElementById('main-navbar');
  if (navbar && !navbar.classList.contains('solid')) {
    var fadeDistance = Math.min(window.innerHeight * 0.6, 480);
    function onScroll() {
      var p = Math.min(Math.max(window.scrollY / fadeDistance, 0), 1);
      navbar.style.setProperty('--nav-progress', p.toFixed(3));
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      fadeDistance = Math.min(window.innerHeight * 0.6, 480);
      onScroll();
    }, { passive: true });
  }

  /* ── Mobile menu ── */
  var toggle = document.getElementById('nav-toggle');
  var menu   = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('active');
        menu.classList.remove('open');
      });
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('open');
      }
    });
  }

  /* ── Accordion ── */
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var body   = trigger.nextElementSibling;
      var isOpen = body.classList.contains('open');
      // Close all
      document.querySelectorAll('.accordion-body').forEach(function (b) { b.classList.remove('open'); });
      document.querySelectorAll('.accordion-trigger').forEach(function (t) { t.classList.remove('open'); });
      if (!isOpen) {
        body.classList.add('open');
        trigger.classList.add('open');
      }
    });
  });

  /* ── Scroll reveal ── */
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px 20px 0px' });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    // Fallback
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Photo Lightbox ── */
  var lightbox     = document.getElementById('lightbox');
  var lightboxImg  = document.getElementById('lightbox-img');
  var closeBtn     = document.getElementById('lightbox-close');
  var prevBtn      = document.getElementById('lightbox-prev');
  var nextBtn      = document.getElementById('lightbox-next');
  var galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  var currentIdx   = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    lightboxImg.src = galleryItems[idx].querySelector('img').src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navigateLightbox(dir) {
    currentIdx = (currentIdx + dir + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIdx].querySelector('img').src;
  }

  if (lightbox && galleryItems.length) {
    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () { openLightbox(i); });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn)  prevBtn.addEventListener('click', function () { navigateLightbox(-1); });
    if (nextBtn)  nextBtn.addEventListener('click', function () { navigateLightbox(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   navigateLightbox(-1);
      if (e.key === 'ArrowRight')  navigateLightbox(1);
    });
  }

  /* ── Rooms filter (rooms.html) ── */
  var filterBtns  = document.querySelectorAll('.filter-btn');
  var filterCards = document.querySelectorAll('.room-filter-card');
  var roomPages   = { '1': 'room1.html', '2': 'room2.html', '3': 'room3 (1).html', '4': 'room4.html', '5': 'room5.html', '6': 'room6.html' };
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;
        if (filter !== 'all' && roomPages[filter]) {
          window.location.href = roomPages[filter];
          return;
        }
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterCards.forEach(function (card) { card.classList.remove('hidden'); });
      });
    });
  }

  /* ── Clickable cards ── */
  document.querySelectorAll('.room-card, .explore-full-card, .special-card, .explore-card, .award-item').forEach(function (card) {
    var link = card.querySelector('a[href]');
    if (!link) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', function (e) {
      if (e.target.closest('a') || e.target.closest('button')) return;
      window.location.href = link.href;
    });
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Mobile scroll-snap carousel ──
     On desktop the reviews strip is a continuous CSS marquee. On phones that
     reads poorly, so we switch it into a native scroll-snap carousel: one card
     snaps into the centre, the user can swipe with full momentum physics, and
     an auto-advance timer scrolls to the next card every few seconds. */
  (function () {
    var marquee = document.querySelector('.reviews-marquee');
    var track   = marquee && marquee.querySelector('.reviews-track');
    if (!marquee || !track) return;

    var cards = Array.prototype.slice.call(
      track.querySelectorAll('.review-card:not([aria-hidden="true"])')
    );
    if (cards.length < 2) return;

    var small  = window.matchMedia('(max-width: 720px)');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    var DWELL = 4000; // ms each card rests before auto-advancing

    var idx      = 0;
    var timer    = null;
    var dotsWrap = null;

    // Per-step scroll distance = card width + gap. Use offsetWidth + columnGap
    // so the measurement doesn't depend on scroll position.
    function stepWidth() {
      var gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
      return cards[0].offsetWidth + gap;
    }

    function paintDots() {
      var active = ((idx % cards.length) + cards.length) % cards.length;
      cards.forEach(function (c, i) { c.classList.toggle('is-active', i === active); });
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.reviews-dot').forEach(function (d, i) {
          d.classList.toggle('is-active', i === active);
        });
      }
    }

    function buildDots() {
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'reviews-dots';
      cards.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'reviews-dot';
        dot.setAttribute('aria-label', 'Show review ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); restart(); });
        dotsWrap.appendChild(dot);
      });
      // Sibling of the marquee so overflow:hidden can't clip the active dot.
      marquee.insertAdjacentElement('afterend', dotsWrap);
    }

    function goTo(i) {
      idx = ((i % cards.length) + cards.length) % cards.length;
      track.scrollTo({ left: idx * stepWidth(), behavior: 'smooth' });
      paintDots();
    }

    function advance() {
      var next = (idx + 1) % cards.length;
      if (next === 0) {
        // Wrap: jump instantly to the start (user isn't touching during auto-advance).
        track.scrollLeft = 0;
        idx = 0;
      } else {
        idx = next;
        track.scrollTo({ left: idx * stepWidth(), behavior: 'smooth' });
      }
      paintDots();
    }

    function restart() { stop(); timer = window.setInterval(advance, DWELL); }
    function stop()    { if (timer) { clearInterval(timer); timer = null; } }

    // Keep dots in sync when the user swipes manually.
    var scrollRAF = null;
    function onScroll() {
      if (scrollRAF) return;
      scrollRAF = requestAnimationFrame(function () {
        scrollRAF = null;
        var sw = stepWidth();
        if (!sw) return;
        var newIdx = Math.round(track.scrollLeft / sw);
        newIdx = Math.max(0, Math.min(newIdx, cards.length - 1));
        if (newIdx !== idx) { idx = newIdx; paintDots(); }
      });
    }

    function onTouchEnd() {
      // Brief pause so the snap settles, then resume auto-advance.
      window.setTimeout(restart, 1500);
    }

    function enable() {
      if (marquee.classList.contains('reviews-marquee--steps')) return;
      if (!dotsWrap) buildDots();
      marquee.classList.add('reviews-marquee--steps');
      if (dotsWrap) dotsWrap.style.display = 'flex';
      idx = 0;
      track.scrollLeft = 0;
      paintDots();
      track.addEventListener('scroll',     onScroll,    { passive: true });
      track.addEventListener('touchstart', stop,         { passive: true });
      track.addEventListener('touchend',   onTouchEnd,  { passive: true });
      restart();
    }

    function disable() {
      if (!marquee.classList.contains('reviews-marquee--steps')) return;
      stop();
      track.removeEventListener('scroll',     onScroll);
      track.removeEventListener('touchstart', stop);
      track.removeEventListener('touchend',   onTouchEnd);
      marquee.classList.remove('reviews-marquee--steps');
      if (dotsWrap) dotsWrap.style.display = '';
      cards.forEach(function (c) { c.classList.remove('is-active'); });
      track.scrollLeft = 0;
    }

    function sync() {
      if (small.matches && !reduce.matches) enable();
      else disable();
    }

    sync();
    if (small.addEventListener)  { small.addEventListener('change', sync); }
    else if (small.addListener)  { small.addListener(sync); }
    if (reduce.addEventListener) { reduce.addEventListener('change', sync); }
    else if (reduce.addListener) { reduce.addListener(sync); }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (marquee.classList.contains('reviews-marquee--steps')) restart();
    });

    // On rotation/resize: re-snap to current card without animation since
    // the step size in pixels changes with the viewport width.
    var resizeRAF = null;
    window.addEventListener('resize', function () {
      if (!marquee.classList.contains('reviews-marquee--steps')) return;
      if (resizeRAF) cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(function () {
        track.scrollLeft = idx * stepWidth();
      });
    });
  })();

})();
