(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var header = document.querySelector(".site-header");

  function setOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (header && !header.contains(e.target)) setOpen(false);
    });

    if (typeof window.matchMedia === "function") {
      var mq = window.matchMedia("(min-width: 800px)");
      var onChange = function () {
        if (mq.matches) setOpen(false);
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  var fallback = document.getElementById("mailto-fallback");
  var form = document.getElementById("consult-form");
  if (fallback && form) {
    fallback.addEventListener("click", function (e) {
      e.preventDefault();
      var name = (form.elements.name && form.elements.name.value.trim()) || "";
      var email = (form.elements.email && form.elements.email.value.trim()) || "";
      var subject = (form.elements.subject && form.elements.subject.value.trim()) || "Consult request";
      var message = (form.elements.message && form.elements.message.value.trim()) || "";
      var body = [];
      body.push("Name: " + name);
      body.push("Email: " + email);
      body.push("");
      body.push(message);
      window.location.href =
        "mailto:aquiles.perez@ecasolutionseng.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body.join("\n"));
    });
  }
})();
