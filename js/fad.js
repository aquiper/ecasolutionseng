(function () {
  "use strict";

  var CAD = "#1B54C8";
  var OXIDE = "#A83A1E";
  var INK = "#10161B";
  var MUTED = "#4A545C";
  var LR_MAX = 1.25;
  var KR_TOP = 1.05;

  /**
   * API 579-1 / ASME FFS-1 Level 2 Option 1 failure assessment curve:
   *   Kr = (1 - 0.14*Lr^2) * (0.30 + 0.70 * exp(-0.65 * Lr^6))
   */
  function krEnvelope(Lr) {
    var Lr2 = Lr * Lr;
    return (1 - 0.14 * Lr2) * (0.3 + 0.7 * Math.exp(-0.65 * Math.pow(Lr, 6)));
  }

  function insideEnvelope(Lr, Kr) {
    if (!(Lr >= 0) || !(Kr >= 0)) return false;
    if (Lr > LR_MAX) return false;
    return Kr <= krEnvelope(Lr) + 1e-9;
  }

  function svgEl(name, attrs) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", name);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        el.setAttribute(k, attrs[k]);
      });
    }
    return el;
  }

  function render(host) {
    var Lr = parseFloat(host.getAttribute("data-lr"));
    var Kr = parseFloat(host.getAttribute("data-kr"));
    if (!isFinite(Lr) || !isFinite(Kr)) {
      Lr = 0.55;
      Kr = 0.42;
    }

    var ok = insideEnvelope(Lr, Kr);
    var pointColor = ok ? CAD : OXIDE;
    var status = ok ? "Inside envelope" : "Outside envelope";
    var statusDetail = ok ? "Acceptable" : "Outside envelope";

    var W = 640;
    var H = 460;
    var m = { l: 58, r: 28, t: 28, b: 52 };
    var pw = W - m.l - m.r;
    var ph = H - m.t - m.b;

    function xOf(lr) { return m.l + (lr / LR_MAX) * pw; }
    function yOf(kr) { return m.t + (1 - kr / KR_TOP) * ph; }

    var svg = svgEl("svg", {
      viewBox: "0 0 " + W + " " + H,
      role: "img",
      "aria-labelledby": "fad-title fad-desc"
    });

    var title = svgEl("title", { id: "fad-title" });
    title.textContent = "Failure assessment diagram, API 579-1 Level 2 Option 1";
    svg.appendChild(title);

    var desc = svgEl("desc", { id: "fad-desc" });
    desc.textContent =
      "Envelope plotted from Kr equals (1 minus 0.14 Lr squared) times (0.30 plus 0.70 exp of minus 0.65 Lr to the sixth), Lr from 0 to 1.25. " +
      "Assessment point Lr " + Lr.toFixed(2) + ", Kr " + Kr.toFixed(2) + ". " +
      status + ". " + statusDetail + ".";
    svg.appendChild(desc);

    var plot = svgEl("rect", {
      x: String(m.l),
      y: String(m.t),
      width: String(pw),
      height: String(ph),
      fill: "#F3F5F4",
      stroke: "none"
    });
    svg.appendChild(plot);

    var lrTicks = [0, 0.25, 0.5, 0.75, 1, 1.25];
    var krTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
    var gGrid = svgEl("g", { "aria-hidden": "true" });
    lrTicks.forEach(function (t) {
      var x = xOf(t);
      gGrid.appendChild(svgEl("line", {
        x1: String(x), y1: String(m.t), x2: String(x), y2: String(m.t + ph),
        stroke: "#C5CBC9", "stroke-width": "1"
      }));
    });
    krTicks.forEach(function (t) {
      var y = yOf(t);
      gGrid.appendChild(svgEl("line", {
        x1: String(m.l), y1: String(y), x2: String(m.l + pw), y2: String(y),
        stroke: "#C5CBC9", "stroke-width": "1"
      }));
    });
    svg.appendChild(gGrid);

    var pts = [];
    var n = 160;
    for (var i = 0; i <= n; i++) {
      var lr = (LR_MAX * i) / n;
      pts.push([lr, Math.max(0, krEnvelope(lr))]);
    }

    var fillD = "M " + xOf(0) + " " + yOf(0);
    pts.forEach(function (p) {
      fillD += " L " + xOf(p[0]) + " " + yOf(p[1]);
    });
    fillD += " L " + xOf(LR_MAX) + " " + yOf(0) + " Z";
    svg.appendChild(svgEl("path", {
      d: fillD,
      fill: CAD,
      "fill-opacity": "0.08",
      stroke: "none",
      "aria-hidden": "true"
    }));

    var lineD = pts.map(function (p, idx) {
      return (idx === 0 ? "M " : "L ") + xOf(p[0]) + " " + yOf(p[1]);
    }).join(" ");
    svg.appendChild(svgEl("path", {
      d: lineD,
      fill: "none",
      stroke: CAD,
      "stroke-width": "2.25",
      "stroke-linejoin": "round",
      "stroke-linecap": "round"
    }));

    var axes = svgEl("g", { "aria-hidden": "true" });
    axes.appendChild(svgEl("line", {
      x1: String(m.l), y1: String(m.t + ph), x2: String(m.l + pw), y2: String(m.t + ph),
      stroke: INK, "stroke-width": "1.25"
    }));
    axes.appendChild(svgEl("line", {
      x1: String(m.l), y1: String(m.t), x2: String(m.l), y2: String(m.t + ph),
      stroke: INK, "stroke-width": "1.25"
    }));
    svg.appendChild(axes);

    function tickLabel(x, y, text, anchor) {
      var t = svgEl("text", {
        x: String(x),
        y: String(y),
        fill: INK,
        "font-size": "11",
        "font-family": "IBM Plex Mono, ui-monospace, monospace",
        "text-anchor": anchor || "middle"
      });
      t.textContent = text;
      svg.appendChild(t);
    }

    lrTicks.forEach(function (t) {
      var x = xOf(t);
      svg.appendChild(svgEl("line", {
        x1: String(x), y1: String(m.t + ph), x2: String(x), y2: String(m.t + ph + 5),
        stroke: INK, "stroke-width": "1"
      }));
      tickLabel(x, m.t + ph + 18, t === 0 ? "0" : String(t));
    });
    krTicks.forEach(function (t) {
      var y = yOf(t);
      svg.appendChild(svgEl("line", {
        x1: String(m.l - 5), y1: String(y), x2: String(m.l), y2: String(y),
        stroke: INK, "stroke-width": "1"
      }));
      tickLabel(m.l - 8, y + 4, t === 0 ? "0" : String(t), "end");
    });

    var xLab = svgEl("text", {
      x: String(m.l + pw / 2),
      y: String(H - 8),
      fill: INK,
      "font-size": "13",
      "font-family": "IBM Plex Mono, ui-monospace, monospace",
      "text-anchor": "middle",
      "font-weight": "500"
    });
    xLab.textContent = "Lr";
    svg.appendChild(xLab);

    var yLab = svgEl("text", {
      x: String(16),
      y: String(m.t + ph / 2),
      fill: INK,
      "font-size": "13",
      "font-family": "IBM Plex Mono, ui-monospace, monospace",
      "text-anchor": "middle",
      "font-weight": "500",
      transform: "rotate(-90 16 " + (m.t + ph / 2) + ")"
    });
    yLab.textContent = "Kr";
    svg.appendChild(yLab);

    var px = xOf(Math.min(Math.max(Lr, 0), LR_MAX * 1.02));
    var py = yOf(Math.min(Math.max(Kr, 0), KR_TOP));

    svg.appendChild(svgEl("circle", {
      cx: String(px),
      cy: String(py),
      r: "6.5",
      fill: pointColor,
      stroke: INK,
      "stroke-width": "1"
    }));
    svg.appendChild(svgEl("circle", {
      cx: String(px),
      cy: String(py),
      r: "2.2",
      fill: "#F3F5F4"
    }));

    var labelX = px + 12;
    var labelY = py - 16;
    if (labelX > m.l + pw - 150) labelX = px - 12;
    var anchor = labelX < px ? "end" : "start";

    var pLab = svgEl("text", {
      x: String(labelX),
      y: String(labelY),
      fill: pointColor,
      "font-size": "12",
      "font-family": "IBM Plex Mono, ui-monospace, monospace",
      "text-anchor": anchor,
      "font-weight": "500"
    });
    pLab.textContent = status;
    svg.appendChild(pLab);

    var pLab2 = svgEl("text", {
      x: String(labelX),
      y: String(labelY + 15),
      fill: MUTED,
      "font-size": "11",
      "font-family": "IBM Plex Mono, ui-monospace, monospace",
      "text-anchor": anchor
    });
    pLab2.textContent = "Lr = " + Lr.toFixed(2) + ",  Kr = " + Kr.toFixed(2);
    svg.appendChild(pLab2);

    if (ok) {
      var acc = svgEl("text", {
        x: String(labelX),
        y: String(labelY + 30),
        fill: CAD,
        "font-size": "11",
        "font-family": "IBM Plex Mono, ui-monospace, monospace",
        "text-anchor": anchor
      });
      acc.textContent = "Acceptable";
      svg.appendChild(acc);
    }

    var legend = svgEl("g", { "aria-hidden": "true" });
    legend.appendChild(svgEl("line", {
      x1: String(m.l + 12), y1: String(m.t + 16),
      x2: String(m.l + 36), y2: String(m.t + 16),
      stroke: CAD, "stroke-width": "2.25"
    }));
    var leg1 = svgEl("text", {
      x: String(m.l + 42),
      y: String(m.t + 20),
      fill: INK,
      "font-size": "11",
      "font-family": "IBM Plex Mono, ui-monospace, monospace"
    });
    leg1.textContent = "Option 1 envelope";
    legend.appendChild(leg1);
    svg.appendChild(legend);

    host.replaceChildren(svg);
  }

  function init() {
    var nodes = document.querySelectorAll(".fad[data-lr][data-kr]");
    for (var i = 0; i < nodes.length; i++) render(nodes[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
