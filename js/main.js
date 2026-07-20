/**
 * Dinç Legal — Main JS
 * Minimal: mobile menu, header scroll effect, deferred hero video
 */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Deferred hero video: loads only after full page load so it never
  // blocks first paint. Poster image is visible until the clip is ready.
  function initHeroVideo() {
    var video = document.querySelector('.hero-video');
    if (!video) return;

    var src = video.getAttribute('data-src');
    if (!src) return;

    // Respect reduced-motion and save-data preferences: keep the poster only.
    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData) return;

    var source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();

    var reveal = function () {
      video.classList.add('is-playing');
    };
    if (video.readyState >= 3) {
      reveal();
    } else {
      video.addEventListener('canplay', reveal, { once: true });
    }

    var playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(function () { /* autoplay blocked: poster stays */ });
    }
  }

  if (document.readyState === 'complete') {
    initHeroVideo();
  } else {
    window.addEventListener('load', initHeroVideo);
  }

  function scrollToHash(instant) {
    if (!window.location.hash) return;

    var target = document.querySelector(window.location.hash);
    if (!target) return;

    var headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      10
    ) || 80;
    var offset = headerHeight + 20;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: top,
      behavior: instant ? 'auto' : 'smooth'
    });
  }

  window.addEventListener('load', function () {
    scrollToHash(true);
  });

  window.addEventListener('hashchange', function () {
    scrollToHash(false);
  });
})();
