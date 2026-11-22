/* ==========================================================================
   COLMOR CONSTRUCTION — interactions
   Vanilla JS only. Progressive enhancement: the page is fully readable
   without JavaScript, these scripts add navigation, accordion and motion.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Current year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) { year.textContent = new Date().getFullYear(); }

  /* ---------- Sticky header + floating call state ---------- */
  var header = document.querySelector("[data-header]");
  var hero = document.querySelector(".hero");
  var callFloat = document.querySelector("[data-call-float]");
  var lastScroll = -1;
  var ticking = false;

  var contact = document.getElementById("contact");
  var contactInView = false;

  function updateScrollState() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header && y !== lastScroll) {
      header.classList.toggle("is-stuck", y > 24);
    }
    if (callFloat) {
      var trigger = (hero ? hero.offsetHeight : 640) - 80;
      callFloat.classList.toggle("is-visible", y > trigger && !contactInView);
    }
    lastScroll = y;
    ticking = false;
  }

  if (contact && callFloat && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      contactInView = entries[0].isIntersecting;
      updateScrollState();
    }, { threshold: 0.1 }).observe(contact);
  }
  updateScrollState();
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateScrollState, { passive: true });

  /* ---------- Mobile menu ---------- */
  var menu = document.getElementById("mobile-menu");
  var overlay = document.querySelector("[data-menu-overlay]");
  var openBtn = document.querySelector("[data-menu-btn]");
  var closeBtn = document.querySelector("[data-menu-close]");
  var isMenuOpen = false;

  function focusables() {
    if (!menu) { return []; }
    return Array.prototype.slice.call(
      menu.querySelectorAll('a[href], button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }

  function openMenu() {
    if (!menu || !overlay || !openBtn) { return; }
    isMenuOpen = true;
    menu.hidden = false;
    overlay.hidden = false;
    document.body.classList.add("menu-open");
    openBtn.setAttribute("aria-expanded", "true");
    openBtn.setAttribute("aria-label", "Close menu");
    window.requestAnimationFrame(function () {
      menu.classList.add("is-open");
      overlay.classList.add("is-open");
    });
    window.setTimeout(function () {
      var items = focusables();
      if (items.length) { items[0].focus({ preventScroll: true }); }
    }, 260);
  }

  function closeMenu(restoreFocus) {
    if (!menu || !overlay || !openBtn) { return; }
    isMenuOpen = false;
    menu.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.setAttribute("aria-label", "Open menu");
    window.setTimeout(function () {
      if (!isMenuOpen) {
        menu.hidden = true;
        overlay.hidden = true;
      }
    }, 460);
    if (restoreFocus !== false) { openBtn.focus({ preventScroll: true }); }
  }

  if (openBtn) {
    openBtn.addEventListener("click", function () {
      if (isMenuOpen) { closeMenu(); } else { openMenu(); }
    });
  }
  if (closeBtn) { closeBtn.addEventListener("click", function () { closeMenu(); }); }
  if (overlay) { overlay.addEventListener("click", function () { closeMenu(); }); }

  if (menu) {
    menu.addEventListener("click", function (e) {
      var link = e.target.closest("a[href]");
      if (link) { closeMenu(false); }
    });

    document.addEventListener("keydown", function (e) {
      if (!isMenuOpen) { return; }
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key === "Tab") {
        var items = focusables();
        if (!items.length) { return; }
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 900 && isMenuOpen) { closeMenu(false); }
  });

  /* ---------- Accordion (FAQ) ---------- */
  var accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    var triggers = Array.prototype.slice.call(
      accordion.querySelectorAll(".accordion__trigger")
    );

    function panelOf(trigger) {
      return document.getElementById(trigger.getAttribute("aria-controls"));
    }

    function setOpen(trigger, open) {
      var panel = panelOf(trigger);
      if (!panel) { return; }
      trigger.setAttribute("aria-expanded", open ? "true" : "false");

      if (open) {
        panel.hidden = false;
        /* force reflow so the grid-rows transition runs */
        void panel.offsetHeight;
        panel.classList.add("is-open");
      } else {
        panel.classList.remove("is-open");
        var delay = reduceMotion ? 0 : 420;
        window.setTimeout(function () {
          if (trigger.getAttribute("aria-expanded") === "false") {
            panel.hidden = true;
          }
        }, delay);
      }
    }

    triggers.forEach(function (trigger) {
      var panel = panelOf(trigger);
      if (!panel) { return; }
      if (trigger.getAttribute("aria-expanded") === "true") {
        panel.hidden = false;
        panel.classList.add("is-open");
      }

      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";
        /* single-open accordion */
        triggers.forEach(function (other) {
          if (other !== trigger && other.getAttribute("aria-expanded") === "true") {
            setOpen(other, false);
          }
        });
        setOpen(trigger, !isOpen);
      });
    });

    /* Allow keyboard arrow navigation between FAQ headings */
    triggers.forEach(function (trigger, i) {
      trigger.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowDown") { next = triggers[(i + 1) % triggers.length]; }
        if (e.key === "ArrowUp") { next = triggers[(i - 1 + triggers.length) % triggers.length]; }
        if (next) {
          e.preventDefault();
          next.focus();
        }
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    /* small stagger for grouped items */
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      if (!parent) { return; }
      var siblings = Array.prototype.filter.call(parent.children, function (child) {
        return child.classList && child.classList.contains("reveal");
      });
      var index = siblings.indexOf(el);
      if (index > 0) {
        el.style.transitionDelay = Math.min(index * 70, 280) + "ms";
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Active section in desktop nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__list a[href^='#']"));
  var sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var inView = {};

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        inView[entry.target.id] = entry.isIntersecting;
      });
      var current = null;
      sections.forEach(function (section) {
        if (inView[section.id]) { current = section.id; }
      });
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", current !== null && link.getAttribute("href") === "#" + current);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- Smooth anchor offset for older browsers ---------- */
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) { return; }
    var id = link.getAttribute("href");
    if (!id || id === "#") { return; }
    var target = document.querySelector(id);
    if (!target) { return; }
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY -
      (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 66) - 12;
    window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    if (history.replaceState) { history.replaceState(null, "", id); }
    /* keep keyboard focus meaningful */
    target.setAttribute("tabindex", "-1");
    window.setTimeout(function () { target.focus({ preventScroll: true }); }, reduceMotion ? 0 : 420);
  });
})();
