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

  /* ── Mobile review stepper ──
     On desktop the reviews strip is a continuous CSS marquee. On phones that
     reads poorly, so here we switch it into a one-at-a-time slideshow: each real
     review springs into place (see .reviews-marquee--steps in the CSS) and the
     next takes over five seconds later. We only engage this on small screens and
     never when the visitor prefers reduced motion. */
  (function () {
    var marquee = document.querySelector('.reviews-marquee');
    var track   = marquee && marquee.querySelector('.reviews-track');
    if (!marquee || !track) return;

    // The marquee duplicates its cards (the copies carry aria-hidden) so the
    // desktop loop is seamless; the stepper only cycles the genuine reviews.
    var cards = Array.prototype.slice.call(
      track.querySelectorAll('.review-card:not([aria-hidden="true"])')
    );
    if (cards.length < 2) return;

    var small   = window.matchMedia('(max-width: 720px)');
    var reduce  = window.matchMedia('(prefers-reduced-motion: reduce)');

    var DWELL = 4000; // ms each review rests on screen
    var SLIDE = 600;  // ms slide duration — MUST match the CSS transition below

    // idx runs 0..cards.length. The last slot (cards.length) is a clone of the
    // first review appended after the genuine cards: we always step FORWARD onto
    // it, then — once that slide finishes — snap silently back to the real first
    // card. That gives an endless one-directional glide with no backward "rewind"
    // sweep through every card (the old 5→0 jump was the glitchy rapid motion).
    var idx      = 0;
    var timer    = null;
    var sliding  = false;
    var dotsWrap = null;
    var clone    = null;

    // Exact rendered width of one slide. In stepper mode every genuine card is a
    // full-width slot, so any card's box width is the per-step pixel offset. We
    // measure the real card (not marquee.clientWidth) so container padding or the
    // mask never desyncs the step from the card.
    function stepWidth() { return cards[0].getBoundingClientRect().width; }

    // Move the track. `animate` true → let the CSS transition glide it; false →
    // jump with no transition (used for the seamless wrap and on resize).
    function setX(px, animate) {
      if (!animate) {
        track.style.transition = 'none';
        track.style.transform = 'translate3d(' + px + 'px,0,0)';
        void track.offsetWidth; // force reflow so the jump applies before we…
        track.style.transition = ''; // …restore the CSS transition for next time
      } else {
        track.style.transition = '';
        track.style.transform = 'translate3d(' + px + 'px,0,0)';
      }
    }

    function ensureClone() {
      if (clone) return;
      clone = cards[0].cloneNode(true);
      clone.classList.add('review-card--clone');
      clone.setAttribute('aria-hidden', 'true'); // visual only — not announced
      track.appendChild(clone);
    }

    function paintDots() {
      var active = idx % cards.length; // clone slot maps back to the first dot
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
      // Insert AFTER the marquee (as a sibling, not a child) so the active
      // dot's scale transform isn't clipped by .reviews-marquee's overflow:hidden.
      marquee.insertAdjacentElement('afterend', dotsWrap);
    }

    // A direct jump to a real card (dot taps). Always lands on a genuine slot,
    // so no wrap handling needed.
    function goTo(i) {
      if (!marquee.classList.contains('reviews-marquee--steps')) return;
      idx = ((i % cards.length) + cards.length) % cards.length;
      setX(-idx * stepWidth(), true);
      paintDots();
    }

    function advance() {
      if (sliding || !marquee.classList.contains('reviews-marquee--steps')) return;
      sliding = true;
      idx += 1;
      setX(-idx * stepWidth(), true); // glide forward (onto the clone at the end)
      paintDots();
      window.setTimeout(function () {
        // Landed on the trailing clone (a copy of card 0)? Snap back to the real
        // first card with no transition — invisible because they're identical.
        if (idx === cards.length) { idx = 0; setX(0, false); }
        sliding = false;
      }, SLIDE);
    }

    function restart() { stop(); timer = window.setInterval(advance, DWELL); }
    function stop()    { if (timer) { clearInterval(timer); timer = null; } }

    function enable() {
      if (marquee.classList.contains('reviews-marquee--steps')) return;
      ensureClone();
      if (!dotsWrap) buildDots();
      marquee.classList.add('reviews-marquee--steps');
      if (dotsWrap) dotsWrap.style.display = 'flex';
      idx = 0;
      sliding = false;
      setX(0, false);
      paintDots();
      restart();
    }
    function disable() {
      if (!marquee.classList.contains('reviews-marquee--steps')) return;
      stop();
      sliding = false;
      marquee.classList.remove('reviews-marquee--steps');
      if (dotsWrap) dotsWrap.style.display = '';
      cards.forEach(function (c) { c.classList.remove('is-active'); });
      // Hand transform control back to the desktop marquee animation.
      track.style.transition = '';
      track.style.transform = '';
    }
    function sync() {
      if (small.matches && !reduce.matches) enable();
      else disable();
    }

    sync();
    // matchMedia change events keep the mode correct across resizes / rotation.
    if (small.addEventListener)  { small.addEventListener('change', sync); }
    else if (small.addListener)  { small.addListener(sync); }
    if (reduce.addEventListener) { reduce.addEventListener('change', sync); }
    else if (reduce.addListener) { reduce.addListener(sync); }

    // Don't advance in a backgrounded tab; resume when the stepper is active.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (marquee.classList.contains('reviews-marquee--steps')) restart();
    });

    // The step offset is in pixels, so a rotation / width change moves the
    // target. Re-snap the track to the current card without animating so it
    // doesn't drift sideways on resize.
    var resizeRAF = null;
    window.addEventListener('resize', function () {
      if (!marquee.classList.contains('reviews-marquee--steps')) return;
      if (resizeRAF) cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(function () {
        setX(-(idx % cards.length) * stepWidth(), false);
      });
    });
  })();

})();
