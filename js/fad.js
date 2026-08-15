/* Failure assessment diagram — API 579-1/ASME FFS-1 Level 2, Option 1
   Kr = (1 - 0.14 Lr^2)(0.30 + 0.70 exp(-0.65 Lr^6)),  Lr 0 .. 1.25
   Point set by data-lr / data-kr on the <svg>. Inside envelope = CAD blue.
   Oxide is used only when the point falls outside.                        */
(function () {
  const svg = document.querySelector("[data-fad]");
  if (!svg) return;

  const W = 340, H = 260, M = { t: 16, r: 18, b: 40, l: 46 };
  const LR_MAX = 1.25, X_MAX = 1.45, Y_MAX = 1.2;
  const px = (lr) => M.l + (lr / X_MAX) * (W - M.l - M.r);
  const py = (kr) => H - M.b - (kr / Y_MAX) * (H - M.t - M.b);
  const NS = "http://www.w3.org/2000/svg";
  const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const krOf = (lr) => (1 - 0.14 * lr * lr) * (0.3 + 0.7 * Math.exp(-0.65 * Math.pow(lr, 6)));

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  for (let v = 0.25; v <= 1.25; v += 0.25) {
    svg.appendChild(el("line", { class: "grid", x1: px(v), y1: M.t, x2: px(v), y2: H - M.b }));
    if (v <= 1.0) svg.appendChild(el("line", { class: "grid", x1: M.l, y1: py(v), x2: W - M.r, y2: py(v) }));
  }

  let d = `M ${px(0)} ${py(krOf(0))}`;
  for (let lr = 0.02; lr <= LR_MAX + 1e-9; lr += 0.02) d += ` L ${px(lr)} ${py(krOf(lr))}`;
  d += ` L ${px(LR_MAX)} ${py(0)} L ${px(0)} ${py(0)} Z`;
  const env = el("path", { class: "env", d });
  svg.appendChild(env);

  svg.appendChild(el("line", { class: "axis", x1: M.l, y1: H - M.b, x2: W - M.r, y2: H - M.b }));
  svg.appendChild(el("line", { class: "axis", x1: M.l, y1: M.t, x2: M.l, y2: H - M.b }));

  const text = (x, y, s, cls, anchor) => {
    const t = el("text", { x, y, class: cls || "lbl" });
    if (anchor) t.setAttribute("text-anchor", anchor);
    t.textContent = s; return t;
  };
  [0, 0.5, 1.0].forEach((v) => svg.appendChild(text(px(v), H - M.b + 14, v.toFixed(1), "lbl", "middle")));
  [0, 0.5, 1.0].forEach((v) => svg.appendChild(text(M.l - 8, py(v) + 3, v.toFixed(1), "lbl", "end")));
  svg.appendChild(text(px(0.72), H - 8, "Lr  —  load ratio", "lbl", "middle"));
  const yl = text(0, 0, "Kr  —  fracture ratio", "lbl", "middle");
  yl.setAttribute("transform", `translate(13, ${py(0.5)}) rotate(-90)`);
  svg.appendChild(yl);
  svg.appendChild(text(px(LR_MAX), M.t + 10, "Lr(max)", "lbl", "middle"));

  const lr = parseFloat(svg.dataset.lr || "0.55");
  const kr = parseFloat(svg.dataset.kr || "0.42");
  const outside = kr > krOf(lr) || lr > LR_MAX;

  const g = el("g", { opacity: "0" });
  g.appendChild(el("line", { class: "ptline", x1: M.l, y1: py(kr), x2: px(lr), y2: py(kr) }));
  g.appendChild(el("line", { class: "ptline", x1: px(lr), y1: H - M.b, x2: px(lr), y2: py(kr) }));
  g.appendChild(el("circle", { class: outside ? "pt pt--out" : "pt", cx: px(lr), cy: py(kr), r: 4.5 }));
  g.appendChild(text(px(lr) + 9, py(kr) - 6, outside ? "outside" : "acceptable", "ptlbl"));
  svg.appendChild(g);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { g.setAttribute("opacity", "1"); return; }
  const len = env.getTotalLength();
  env.style.strokeDasharray = len; env.style.strokeDashoffset = len; env.style.fillOpacity = 0;
  requestAnimationFrame(() => {
    env.style.transition = "stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1), fill-opacity .7s ease .9s";
    env.style.strokeDashoffset = 0; env.style.fillOpacity = 1;
    setTimeout(() => { g.style.transition = "opacity .55s ease"; g.setAttribute("opacity", "1"); }, 1250);
  });
})();
