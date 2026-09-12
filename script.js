(function () {
  'use strict';

  var SECTIONS = ['home', 'about', 'services', 'faq', 'testimonials', 'why-us', 'contact'];
  var NAV_OFFSET = 80;

  var navbar = document.getElementById('navbar');
  var menuToggle = document.getElementById('menuToggle');
  var menuClose = document.getElementById('menuClose');
  var mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  var mobileMenu = document.getElementById('mobileMenu');
  var floatingButtons = document.getElementById('floatingButtons');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 300) {
      floatingButtons.classList.add('visible');
    } else {
      floatingButtons.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu() {
    mobileMenuOverlay.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenuOverlay.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  mobileMenuOverlay.addEventListener('click', function (e) {
    if (e.target === mobileMenuOverlay) closeMenu();
  });

  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  var scrollLinks = document.querySelectorAll('[data-scroll]');
  scrollLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        scrollToSection(href.slice(1));
        closeMenu();
      }
    });
  });

  var navLinks = document.querySelectorAll('.nav-link');
  var mobileLinks = document.querySelectorAll('.mobile-link');

  var spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
          mobileLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  SECTIONS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spyObserver.observe(el);
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 2000;
        var startTime = performance.now();

        function animate(now) {
          var progress = Math.min((now - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(eased * target);
          el.textContent = current.toLocaleString('en-US') + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  var faqQuestions = document.querySelectorAll('.faq-question');
  var faqAnswers = document.querySelectorAll('.faq-answer');
  var faqIcons = document.querySelectorAll('.faq-question-icon');
  var faqChevrons = document.querySelectorAll('.faq-chevron');

  faqQuestions.forEach(function (q, i) {
    q.addEventListener('click', function () {
      var isActive = q.classList.contains('faq-active');
      faqQuestions.forEach(function (qq) { qq.classList.remove('faq-active'); });
      faqAnswers.forEach(function (a) { a.classList.remove('faq-answer-open'); });
      faqIcons.forEach(function (ic) { ic.classList.remove('faq-icon-active'); });
      faqChevrons.forEach(function (ch) { ch.classList.remove('faq-chevron-active'); });
      if (!isActive) {
        q.classList.add('faq-active');
        faqAnswers[i].classList.add('faq-answer-open');
        faqIcons[i].classList.add('faq-icon-active');
        faqChevrons[i].classList.add('faq-chevron-active');
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();
