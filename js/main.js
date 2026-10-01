(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var header = document.querySelector(".site-header");

  function setOpen(open, returnFocus) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    if (returnFocus) toggle.focus();
  }

  function isOpen() {
    return toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = !isOpen();
      setOpen(open);
      if (open) {
        var firstLink = nav.querySelector("a[href]");
        if (firstLink) firstLink.focus();
      }
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    nav.addEventListener("keydown", function (e) {
      if (!isOpen() || e.key !== "Tab") return;
      var links = nav.querySelectorAll("a[href]");
      if (e.shiftKey && e.target === links[0]) {
        e.preventDefault();
        setOpen(false, true);
      } else if (!e.shiftKey && e.target === links[links.length - 1]) {
        // The menu sits before its toggle in the desktop markup. Continue
        // beyond the header when tabbing out of its last mobile link.
        var next = Array.prototype.find.call(
          document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]"),
          function (element) {
            return !header.contains(element) &&
              (toggle.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING) &&
              !element.disabled && element.tabIndex >= 0 && element.getClientRects().length;
          }
        );
        if (next) {
          e.preventDefault();
          setOpen(false);
          next.focus();
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        e.preventDefault();
        setOpen(false, true);
      }
    });

    document.addEventListener("focusin", function (e) {
      if (isOpen() && e.target !== toggle && !nav.contains(e.target)) setOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (header && !header.contains(e.target)) setOpen(false);
    });

    if (typeof window.matchMedia === "function") {
      var mq = window.matchMedia("(min-width: 1000px)");
      var onChange = function () {
        setOpen(false, !mq.matches && nav.contains(document.activeElement));
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  var form = document.getElementById("consult-form");
  var topic = document.getElementById("inquiry-topic");
  if (form && topic) {
    var toolNames = {
      mic: "MIC Risk Evaluator",
      hic: "HIC FFS Tool",
      haz: "Steel Chemistry / HAZ Toughness Predictor",
      eca: "ECA / FAD Tool",
      co2: "Dense-Phase CO2 Pipeline Tool"
    };
    var selectedTool = new URLSearchParams(window.location.search).get("tool");
    if (Object.prototype.hasOwnProperty.call(toolNames, selectedTool)) {
      topic.value = toolNames[selectedTool];
    }

    var subject = form.querySelector('input[name="_subject"]');
    function updateSubject() {
      if (!subject) return;
      var detail = topic.value.replace(/[\r\n]+/g, " ").trim().slice(0, 120);
      subject.value = "Consult request — EC&A website" + (detail ? " — " + detail : "");
    }
    updateSubject();
    topic.addEventListener("input", updateSubject);
    form.addEventListener("submit", updateSubject);
  }

  // Fade hero copy and section blocks once as they enter. No stagger.
  // translate is separate from the transform used by card hover.
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var itemSelector = ".card, .case-card, .note-card, .tool-panel, .tool-card, .cred, .background-block";
    var targets = [];

    function push(el) {
      if (el && targets.indexOf(el) === -1) targets.push(el);
    }

    Array.prototype.forEach.call(
      document.querySelectorAll(".hero-content, .page-hero .wrap, .sector-strip"),
      push
    );

    Array.prototype.forEach.call(
      document.querySelectorAll("main .section, main .cta-band, main .client-strip"),
      function (block) {
        var items = block.querySelectorAll(itemSelector);
        var wrap = block.querySelector(":scope > .wrap");
        if (!items.length) {
          push(wrap || block);
          return;
        }
        Array.prototype.forEach.call((wrap || block).children, function (child) {
          if (child.matches(itemSelector) || child.querySelector(itemSelector)) return;
          push(child);
        });
        Array.prototype.forEach.call(items, push);
      }
    );

    Array.prototype.forEach.call(document.querySelectorAll("main .offer"), push);
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { root: null, rootMargin: "0px 0px 12% 0px", threshold: 0 });

    targets.forEach(function (el) { el.classList.add("reveal"); });

    document.addEventListener("focusin", function (e) {
      var block = e.target.closest && e.target.closest(".reveal");
      if (!block || block.classList.contains("is-in")) return;
      block.classList.add("is-in");
      observer.unobserve(block);
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        targets.forEach(function (el) {
          if (!el.classList.contains("is-in")) observer.observe(el);
        });
      });
    });
  }

  initReveal();

})();
