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

  /* ── Mobile infinite carousel ──
     On desktop the reviews strip is a continuous CSS marquee. On phones that
     reads poorly, so we switch it into a native scroll-snap carousel: one card
     snaps into the centre, the user swipes with full momentum physics, and an
     auto-advance timer glides to the next card when the carousel has been idle
     for DWELL ms.

     To make the loop seamless in BOTH directions we lay the track out as three
     identical blocks of the N reviews — [clones | originals | clones] — and keep
     the live scroll position parked in the middle block. Whenever the user (or
     the auto-advance) drifts into a clone block, the JS silently jumps back by
     one block once scrolling settles. Because every block is pixel-identical the
     jump is invisible, so there are always real cards to the left of the
     leftmost and to the right of the rightmost card, and wrapping from the last
     card back to the first never flashes an empty edge. */
  (function () {
    var marquee = document.querySelector('.reviews-marquee');
    var track   = marquee && marquee.querySelector('.reviews-track');
    if (!marquee || !track) return;

    // Originals = the unique, non-duplicate review cards rendered by Astro.
    var origCards = Array.prototype.slice.call(track.querySelectorAll('.review-card'))
      .filter(function (c) { return c.getAttribute('aria-hidden') !== 'true'; });
    var N = origCards.length;
    if (N < 2) return;

    var small  = window.matchMedia('(max-width: 720px)');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    var DWELL = 3000; // ms of inactivity before auto-advance fires
    var ANIM  = 620;  // ms of the auto-advance momentum glide

    var idx           = 0;         // global card index within the 3N track (clones included)
    var timer         = null;
    var dotsWrap      = null;
    var lastTouchTime = -Infinity; // timestamp of most recent interaction
    var programmatic  = false;     // true while the JS is animating the scroll
    var animRAF       = null;      // rAF id of the active glide
    var leftClones    = [];        // clone nodes inserted before the originals
    var rightClones   = [];        // clone nodes inserted after the originals
    var built         = false;

    function stepWidth() {
      var gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
      return (origCards[0] ? origCards[0].offsetWidth : 0) + gap;
    }
    function realIndex() { return ((idx % N) + N) % N; } // 0..N-1 regardless of block

    /* Build the [clones | originals | clones] layout. The middle block is the
       original DOM nodes; we clone the full set onto each side. The server-
       rendered duplicate cards are hidden in stepper mode (CSS) so they don't
       add stray cards. */
    function build() {
      if (built) return;
      var fragL = document.createDocumentFragment();
      var fragR = document.createDocumentFragment();
      origCards.forEach(function (c) {
        var cl = c.cloneNode(true);
        cl.setAttribute('aria-hidden', 'true');
        cl.classList.add('is-clone');
        leftClones.push(cl);
        fragL.appendChild(cl);
        var cr = c.cloneNode(true);
        cr.setAttribute('aria-hidden', 'true');
        cr.classList.add('is-clone');
        rightClones.push(cr);
        fragR.appendChild(cr);
      });
      track.insertBefore(fragL, origCards[0]);
      track.insertBefore(fragR, origCards[N - 1].nextSibling);
      built = true;
    }
    function teardown() {
      leftClones.concat(rightClones).forEach(function (c) {
        if (c.parentNode) c.parentNode.removeChild(c);
      });
      leftClones = [];
      rightClones = [];
      built = false;
    }

    function paintDots() {
      var active = realIndex();
      origCards.forEach(function (c, i) { c.classList.toggle('is-active', i === active); });
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.reviews-dot').forEach(function (d, i) {
          d.classList.toggle('is-active', i === active);
        });
      }
    }

    function buildDots() {
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'reviews-dots';
      origCards.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'reviews-dot';
        dot.setAttribute('aria-label', 'Show review ' + (i + 1));
        dot.addEventListener('click', function () {
          lastTouchTime = Date.now();
          goTo(i);
          scheduleNext();
        });
        dotsWrap.appendChild(dot);
      });
      // Sibling of the marquee so overflow on the marquee can't clip the active dot.
      marquee.insertAdjacentElement('afterend', dotsWrap);
    }

    // Instantly park the scroll at card position `pos` with no animation or snap fight.
    function jumpTo(pos) {
      var prevBehavior = track.style.scrollBehavior;
      var prevSnap     = track.style.scrollSnapType;
      track.style.scrollBehavior = 'auto';
      track.style.scrollSnapType = 'none';
      track.scrollLeft = pos * stepWidth();
      track.getBoundingClientRect(); // force a style flush
      track.style.scrollSnapType = prevSnap;
      track.style.scrollBehavior = prevBehavior;
      idx = pos;
    }

    // Stop any in-flight glide and settle idx onto the nearest card.
    function stopAnim() {
      if (animRAF) { cancelAnimationFrame(animRAF); animRAF = null; }
      if (programmatic) {
        track.style.scrollSnapType = '';
        programmatic = false;
        var sw = stepWidth();
        if (sw) idx = Math.round(track.scrollLeft / sw);
      }
    }

    /* Momentum-style glide to card position `pos`. Snap is suspended during the
       animation (so it can't yank the easing) and restored at the end, where we
       always land exactly on a snap point. easeOutCubic gives the decelerating,
       "thrown" feel of a native flick. */
    function animateTo(pos, done) {
      stopAnim();
      var sw     = stepWidth();
      var start  = track.scrollLeft;
      var target = pos * sw;
      var dist   = target - start;
      if (Math.abs(dist) < 1) { idx = pos; if (done) done(); return; }
      programmatic = true;
      track.style.scrollSnapType = 'none';
      var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
      function frame(now) {
        var t = Math.min(1, (now - t0) / ANIM);
        var e = 1 - Math.pow(1 - t, 3); // easeOutCubic
        track.scrollLeft = start + dist * e;
        if (t < 1) {
          animRAF = requestAnimationFrame(frame);
        } else {
          animRAF = null;
          track.scrollLeft = target;
          track.style.scrollSnapType = '';
          programmatic = false;
          idx = pos;
          paintDots();
          if (done) done();
        }
      }
      animRAF = requestAnimationFrame(frame);
    }

    // Re-park into the middle block if we've settled in a clone block. Invisible
    // because every block is identical.
    function recenter() {
      var mid = N + realIndex(); // middle block occupies positions N..2N-1
      if (mid !== idx) jumpTo(mid);
      paintDots();
    }

    // Jump straight to a given original review (dot click).
    function goTo(real) {
      var r = ((real % N) + N) % N;
      animateTo(N + r);
    }

    function advance() {
      animateTo(idx + 1, function () {
        recenter();
        scheduleNext();
      });
    }

    /* Auto-advance once the carousel has been untouched for DWELL ms. Re-check on
       every tick (rather than committing to an advance) so a swipe or tap during
       the wait always restarts the full idle window — the strip only moves on its
       own after a genuine DWELL-long pause in interaction. */
    function scheduleNext() {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(function tick() {
        var idle = Date.now() - lastTouchTime;
        if (idle >= DWELL) {
          advance();
        } else {
          timer = window.setTimeout(tick, Math.max(DWELL - idle, 200));
        }
      }, DWELL);
    }

    function stop() { if (timer) { clearTimeout(timer); timer = null; } }

    // Track manual swipes: update the dots live, and recentre once scrolling stops.
    var scrollRAF = null, scrollStopTimer = null;
    function onScroll() {
      if (programmatic) return;
      if (!scrollRAF) {
        scrollRAF = requestAnimationFrame(function () {
          scrollRAF = null;
          var sw = stepWidth();
          if (!sw) return;
          idx = Math.round(track.scrollLeft / sw);
          paintDots();
        });
      }
      if (scrollStopTimer) clearTimeout(scrollStopTimer);
      scrollStopTimer = window.setTimeout(function () {
        if (programmatic) return;
        var sw = stepWidth();
        if (!sw) return;
        idx = Math.round(track.scrollLeft / sw);
        recenter();
      }, 140);
    }

    function onTouchStart() {
      stopAnim();
      lastTouchTime = Date.now();
    }
    function onTouchEnd() {
      lastTouchTime = Date.now();
    }

    function enable() {
      if (marquee.classList.contains('reviews-marquee--steps')) return;
      if (!dotsWrap) buildDots();
      build();
      marquee.classList.add('reviews-marquee--steps');
      if (dotsWrap) dotsWrap.style.display = 'flex';
      jumpTo(N); // park on the first original in the middle block
      paintDots();
      track.addEventListener('scroll',     onScroll,     { passive: true });
      track.addEventListener('touchstart', onTouchStart, { passive: true });
      track.addEventListener('touchend',   onTouchEnd,   { passive: true });
      scheduleNext();
    }

    function disable() {
      if (!marquee.classList.contains('reviews-marquee--steps')) return;
      stop();
      stopAnim();
      track.removeEventListener('scroll',     onScroll);
      track.removeEventListener('touchstart', onTouchStart);
      track.removeEventListener('touchend',   onTouchEnd);
      marquee.classList.remove('reviews-marquee--steps');
      if (dotsWrap) dotsWrap.style.display = '';
      origCards.forEach(function (c) { c.classList.remove('is-active'); });
      teardown();
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
      else if (marquee.classList.contains('reviews-marquee--steps')) scheduleNext();
    });

    // On rotation/resize the step size in px changes, so re-park on the current
    // card without animation.
    var resizeRAF = null;
    window.addEventListener('resize', function () {
      if (!marquee.classList.contains('reviews-marquee--steps')) return;
      if (resizeRAF) cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(function () {
        jumpTo(N + realIndex());
      });
    });
  })();

})();
