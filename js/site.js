/* Navigation, scroll reveals, and the contact form.
   Form posts to FormSubmit at aquiles.perez@ecasolutionseng.com.
   FormSubmit requires one manual activation: submit the form once from the
   live domain and click the confirmation link emailed to that address.
   The mailto fallback below runs if the POST fails for any reason.          */
const FORM_ACTION = "https://formsubmit.co/aquiles.perez@ecasolutionseng.com";
const FALLBACK_MAILTO = "aquiles.perez@ecasolutionseng.com";

(function nav() {
  const btn = document.querySelector(".navtoggle");
  const list = document.getElementById("primary-nav");
  if (!btn || !list) return;
  const mq = window.matchMedia("(max-width: 860px)");
  const sync = () => { btn.setAttribute("aria-expanded", "false"); list.hidden = mq.matches; };
  sync(); mq.addEventListener("change", sync);
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    list.hidden = open;
    if (!open) list.querySelector("a")?.focus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      btn.setAttribute("aria-expanded", "false"); list.hidden = true; btn.focus();
    }
  });
})();

(function reveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) { items.forEach(n => n.classList.add("is-in")); return; }
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  items.forEach(n => io.observe(n));
})();

(function contact() {
  const form = document.getElementById("enquiry");
  if (!form) return;
  const status = document.getElementById("formstatus");
  const submit = form.querySelector("[type=submit]");
  const say = (m, s) => { status.textContent = m; status.dataset.state = s; status.hidden = false; };

  form.setAttribute("action", FORM_ACTION);
  form.setAttribute("method", "POST");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.querySelector("input[name=_honey]").value) return;
    if (!form.reportValidity()) return;

    submit.disabled = true;
    const original = submit.textContent;
    submit.textContent = "Sending…";
    try {
      const res = await fetch(FORM_ACTION, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      say("Received. You will get a reply within one business day.", "ok");
      submit.textContent = "Sent";
    } catch (err) {
      const fd = new FormData(form);
      const body = encodeURIComponent(
        `Name: ${fd.get("name") || ""}\nCompany: ${fd.get("company") || ""}\nEmail: ${fd.get("email") || ""}\nTopic: ${fd.get("_subject") || ""}\n\n${fd.get("message") || ""}`
      );
      say("The form did not send. Opening your mail client instead — if nothing happens, write to " + FALLBACK_MAILTO + " directly.", "err");
      window.location.href = `mailto:${FALLBACK_MAILTO}?subject=${encodeURIComponent("Website enquiry")}&body=${body}`;
      submit.disabled = false; submit.textContent = original;
    }
  });
})();
