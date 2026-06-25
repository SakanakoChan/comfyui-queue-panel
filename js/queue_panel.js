import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

const STYLE_ID = "comfy-queue-panel-style";
const VIEW_KEY = "cqp.view";
const STARTTIMES_KEY = "cqp.startTimes";
const MAXITEMS_KEY = "cqp.maxItems";
const FEEDMAX_KEY = "cqp.feedMax";
const LBSIZE_KEY = "cqp.lbSize";
const UISCALE_KEY = "cqp.uiScale";
const LIVEFEED_KEY = "cqp.liveFeed";
const THUMBSIZE_KEY = "cqp.thumbSize";
const DEFAULT_MAXITEMS = 64;
const DEFAULT_FEEDMAX = 300;
const DEFAULT_LBSIZE = 90;
const DEFAULT_UISCALE = 12;
const DEFAULT_THUMBSIZE = 96;
const IMG_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".svg", ".avif"];

const CSS = `
.cqp-root{display:flex;flex-direction:column;height:100%;width:100%;overflow:hidden;font-size:var(--cqp-fs,12px);color:var(--input-text,#ddd);}
.cqp-toolbar{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--border-color,#333);flex:0 0 auto;}
.cqp-toolbar .cqp-title{font-weight:600;font-size:1.08em;margin-right:auto;}
.cqp-seg{display:flex;border:1px solid var(--border-color,#444);border-radius:4px;overflow:hidden;}
.cqp-seg button{cursor:pointer;border:0;background:var(--comfy-input-bg,#2a2a2a);color:inherit;padding:0.25em 0.6em;font-size:0.92em;}
.cqp-seg button.active{background:var(--p-primary-color,#4a90d9);color:#fff;}
.cqp-settings{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:6px 8px;border-bottom:1px solid var(--border-color,#333);flex:0 0 auto;font-size:0.92em;}
.cqp-setlbl{display:flex;align-items:center;gap:4px;color:var(--descrip-text,#9aa);position:relative;cursor:help;}
.cqp-setlbl[data-tip]:hover::after{content:attr(data-tip);position:absolute;top:calc(100% + 5px);left:0;z-index:60;width:max-content;max-width:220px;white-space:normal;background:var(--comfy-menu-bg,#222);color:var(--input-text,#ddd);border:1px solid var(--border-color,#444);border-radius:4px;padding:5px 7px;font-size:0.85em;line-height:1.35;box-shadow:0 2px 10px rgba(0,0,0,.5);pointer-events:none;}
.cqp-gear{font-size:3em;line-height:1;}
.cqp-setlbl input[type=number]{width:56px;background:var(--comfy-input-bg,#2a2a2a);color:var(--input-text,#ddd);border:1px solid var(--border-color,#444);border-radius:4px;padding:2px 4px;}
.cqp-btn{cursor:pointer;border:1px solid var(--border-color,#444);background:var(--comfy-input-bg,#2a2a2a);color:inherit;border-radius:4px;padding:0.25em 0.55em;font-size:0.92em;line-height:1.4;text-decoration:none;display:inline-block;}
.cqp-btn:hover{background:var(--p-surface-700,#3a3a3a);}
.cqp-btn.cqp-danger:hover{background:#7a2222;}
.cqp-scroll{flex:1 1 auto;overflow-y:auto;overflow-x:hidden;padding:4px 8px 16px;}
.cqp-section-head{display:flex;align-items:center;gap:6px;margin:10px 0 4px;font-weight:600;text-transform:uppercase;font-size:0.85em;letter-spacing:.04em;color:var(--descrip-text,#9aa);}
.cqp-section-head .cqp-count{background:var(--comfy-input-bg,#2a2a2a);border-radius:8px;padding:0 6px;font-weight:600;}
.cqp-section-head .cqp-spacer,.cqp-spacer{margin-left:auto;}
.cqp-item{display:flex;align-items:center;gap:8px;padding:6px;border:1px solid var(--border-color,#333);border-radius:6px;margin-bottom:6px;background:var(--comfy-menu-bg,#1e1e1e);}
.cqp-card{display:flex;flex-direction:column;gap:6px;padding:6px;border:1px solid var(--border-color,#333);border-radius:6px;margin-bottom:6px;background:var(--comfy-menu-bg,#1e1e1e);}
.cqp-card-head{display:flex;align-items:center;gap:8px;}
.cqp-thumb-ph{width:48px;height:48px;flex:0 0 auto;border-radius:4px;background:#111;display:flex;align-items:center;justify-content:center;color:#555;font-size:16px;}
.cqp-meta{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px;}
.cqp-pid{font-family:monospace;font-size:0.85em;color:var(--descrip-text,#888);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cqp-timer{color:var(--descrip-text,#9aa);font-variant-numeric:tabular-nums;}
.cqp-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cqp-actions{display:flex;gap:4px;flex:0 0 auto;}
.cqp-progress{height:4px;border-radius:2px;background:#333;overflow:hidden;margin-top:2px;}
.cqp-progress>div{height:100%;background:var(--p-primary-color,#4a90d9);width:0%;transition:width .1s linear;}
.cqp-empty{color:var(--descrip-text,#777);padding:6px 2px;font-style:italic;}
.cqp-fail{color:#e06666;}
.cqp-done{color:#7cc47c;}
.cqp-strip{display:flex;flex-wrap:wrap;gap:4px;}
.cqp-tn{width:calc(var(--cqp-th,96px)*0.58);height:calc(var(--cqp-th,96px)*0.58);border-radius:4px;object-fit:cover;background:#111;cursor:pointer;border:1px solid var(--border-color,#2a2a2a);}
.cqp-tn:hover{outline:2px solid var(--p-primary-color,#4a90d9);}
.cqp-feed{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--cqp-th,96px),1fr));gap:6px;}
.cqp-feed img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:4px;background:#111;cursor:pointer;border:1px solid var(--border-color,#2a2a2a);}
.cqp-feed img:hover{outline:2px solid var(--p-primary-color,#4a90d9);}
.cqp-lb{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.88);display:none;align-items:center;justify-content:center;}
.cqp-lb.open{display:flex;}
.cqp-lb-stage{width:calc(var(--cqp-lb,90)*1vw);height:calc(var(--cqp-lb,90)*1vh);display:flex;align-items:center;justify-content:center;}
.cqp-lb-img{width:100%;height:100%;object-fit:contain;}
.cqp-lb-nav{position:absolute;top:50%;transform:translateY(-50%);font-size:40px;line-height:1;color:#fff;background:rgba(0,0,0,.3);border:0;cursor:pointer;padding:8px 14px;border-radius:8px;}
.cqp-lb-nav:hover{background:rgba(0,0,0,.6);}
.cqp-lb-prev{left:16px;}
.cqp-lb-next{right:16px;}
.cqp-lb-bar{position:absolute;bottom:0;left:0;right:0;display:flex;align-items:center;gap:8px;padding:10px 14px;}
.cqp-lb-counter{color:#ddd;font-family:monospace;}
`;

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

function h(tag, props, children) {
  const el = document.createElement(tag);
  if (props) {
    for (const k in props) {
      const v = props[k];
      if (v == null) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k === "style") el.style.cssText = v;
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(k, v);
    }
  }
  if (children) for (const c of [].concat(children)) if (c != null) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  return el;
}

function viewUrl(img) {
  const p = `/view?filename=${encodeURIComponent(img.filename)}&type=${encodeURIComponent(img.type || "output")}&subfolder=${encodeURIComponent(img.subfolder || "")}`;
  return typeof api.apiURL === "function" ? api.apiURL(p) : p;
}

function collectImages(outputs) {
  const out = [];
  if (!outputs) return out;
  for (const nid in outputs) {
    const o = outputs[nid];
    for (const key of ["images", "gifs"]) {
      const arr = o && o[key];
      if (Array.isArray(arr)) {
        for (const im of arr) {
          const name = (im.filename || "").toLowerCase();
          if (IMG_EXT.some((e) => name.endsWith(e))) out.push(im);
        }
      }
    }
  }
  return out;
}

function extraOf(promptTuple) {
  return promptTuple && promptTuple[3] ? promptTuple[3] : null;
}
function workflowOf(extra) {
  return extra && extra.extra_pnginfo && extra.extra_pnginfo.workflow ? extra.extra_pnginfo.workflow : null;
}

async function jsonOf(path) {
  const res = await api.fetchApi(path);
  return await res.json();
}
function post(path, body) {
  return api.fetchApi(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
}

async function loadWorkflow(wf) {
  if (!wf) {
    app.extensionManager?.toast?.add?.({ severity: "warn", summary: "Queue", detail: "No workflow stored for this task", life: 3000 });
    return;
  }
  try {
    await app.loadGraphData(typeof wf === "string" ? JSON.parse(wf) : wf);
  } catch (e) {
    console.error("[QueuePanel] loadGraphData failed", e);
  }
}

const state = { progress: { value: 0, max: 0 }, runningNode: null };
let activeScroll = null;
const startTimes = (() => { try { return JSON.parse(localStorage.getItem(STARTTIMES_KEY)) || {}; } catch (e) { return {}; } })();
function persistStartTimes() { try { localStorage.setItem(STARTTIMES_KEY, JSON.stringify(startTimes)); } catch (e) {} }
function pruneStartTimes(queue) {
  const live = new Set();
  for (const arr of [queue.queue_running || [], queue.queue_pending || []]) for (const it of arr) live.add(it[1]);
  let changed = false;
  for (const pid of Object.keys(startTimes)) if (!live.has(pid)) { delete startTimes[pid]; changed = true; }
  if (changed) persistStartTimes();
}
let cacheQueue = null;
let cacheHistory = null;

const lb = { overlay: null, img: null, counter: null, dl: null, items: [], index: 0, keyHandler: null };

function lbRender() {
  const it = lb.items[lb.index];
  if (!it) return;
  lb.counter.textContent = `${lb.index + 1} / ${lb.items.length}`;
  lb.dl.href = it.url;
  lb.dl.download = it.filename || "image";
  lb.wf = it.wf;
  lb.img.src = it.url;
  lbPreload(1);
  lbPreload(-1);
}
function lbPreload(d) {
  const n = lb.items.length;
  if (!n) return;
  const it = lb.items[(lb.index + d + n) % n];
  if (!it) return;
  const im = new Image();
  im.src = it.url;
}
function lbStep(d) {
  const n = lb.items.length;
  if (!n) return;
  lb.index = (lb.index + d + n) % n;
  lbRender();
}
function lbClose() {
  if (!lb.overlay) return;
  lb.overlay.classList.remove("open");
  if (lb.keyHandler) {
    window.removeEventListener("keydown", lb.keyHandler);
    lb.keyHandler = null;
  }
  lb.img.src = "";
}
function ensureLightbox() {
  if (lb.overlay) return;
  injectStyle();
  const img = h("img", { class: "cqp-lb-img" });
  const stage = h("div", { class: "cqp-lb-stage" }, [img]);
  const counter = h("div", { class: "cqp-lb-counter" });
  const dl = h("a", { class: "cqp-btn", text: "Download", href: "#", target: "_blank", onClick: (e) => e.stopPropagation() });
  const bar = h("div", { class: "cqp-lb-bar" }, [
    counter,
    h("span", { class: "cqp-spacer" }),
    h("button", { class: "cqp-btn", text: "Load workflow", onClick: (e) => { e.stopPropagation(); loadWorkflow(lb.wf); } }),
    h("button", { class: "cqp-btn", text: "Open", onClick: (e) => { e.stopPropagation(); const it = lb.items[lb.index]; if (it) window.open(it.url, "_blank"); } }),
    dl,
    h("button", { class: "cqp-btn cqp-danger", text: "Close", onClick: (e) => { e.stopPropagation(); lbClose(); } }),
  ]);
  const prev = h("button", { class: "cqp-lb-nav cqp-lb-prev", text: "\u2039", onClick: (e) => { e.stopPropagation(); lbStep(-1); } });
  const next = h("button", { class: "cqp-lb-nav cqp-lb-next", text: "\u203A", onClick: (e) => { e.stopPropagation(); lbStep(1); } });
  const overlay = h("div", { class: "cqp-lb" }, [prev, stage, next, bar]);
  overlay.addEventListener("click", (e) => { if (e.target === overlay || e.target === stage) lbClose(); });
  document.body.appendChild(overlay);
  lb.overlay = overlay; lb.img = img; lb.counter = counter; lb.dl = dl;
}
function openLightbox(items, index) {
  if (!items || !items.length) return;
  ensureLightbox();
  lb.overlay.style.setProperty("--cqp-lb", String(getLbSize()));
  lb.items = items;
  lb.index = Math.max(0, Math.min(index || 0, items.length - 1));
  lbRender();
  lb.overlay.classList.add("open");
  lb.keyHandler = (e) => {
    if (e.key === "Escape") lbClose();
    else if (e.key === "ArrowLeft") lbStep(-1);
    else if (e.key === "ArrowRight") lbStep(1);
  };
  window.addEventListener("keydown", lb.keyHandler);
}

function itemsFromImages(imgs, pid, wf) {
  return imgs.map((im) => ({ url: viewUrl(im), filename: im.filename, pid, wf }));
}

function updateProgressUI() {
  if (!activeScroll || !document.contains(activeScroll)) return;
  const bar = activeScroll.querySelector(".cqp-progress-bar");
  if (bar && state.progress.max > 0) {
    bar.style.width = Math.min(100, Math.round((state.progress.value / state.progress.max) * 100)) + "%";
  }
  const nodeEl = activeScroll.querySelector(".cqp-run-node");
  if (nodeEl && state.runningNode != null) nodeEl.textContent = "Executing node " + state.runningNode;
}

function fmtDur(sec) {
  return Math.max(0, Math.floor(sec)) + "s";
}
function runningElapsed(pid) {
  if (!startTimes[pid]) startTimes[pid] = Date.now();
  return Math.floor((Date.now() - startTimes[pid]) / 1000);
}
function historyDuration(entry) {
  const msgs = entry && entry.status && entry.status.messages;
  if (!Array.isArray(msgs)) return null;
  let start = null, end = null;
  for (const m of msgs) {
    if (!Array.isArray(m) || m.length < 2) continue;
    const ev = m[0];
    const ts = m[1] && m[1].timestamp;
    if (typeof ts !== "number") continue;
    if (ev === "execution_start") start = ts;
    else if (ev === "execution_success" || ev === "execution_error" || ev === "execution_interrupted") end = ts;
  }
  if (start == null || end == null || end < start) return null;
  return Math.round((end - start) / 1000);
}
function updateTimers() {
  if (!activeScroll || !document.contains(activeScroll)) return;
  activeScroll.querySelectorAll(".cqp-timer.cqp-running").forEach((el) => {
    const pid = el.getAttribute("data-pid");
    if (pid) el.textContent = fmtDur(runningElapsed(pid));
  });
}

const LIVE_MAX = 300;
const liveImages = [];
const liveSeen = new Set();
function imgKey(im) {
  return (im.type || "output") + "|" + (im.subfolder || "") + "|" + (im.filename || "");
}
function captureLive(e) {
  if (!getLiveFeed()) return;
  const d = e && e.detail;
  const imgs = d && d.output && d.output.images;
  if (!Array.isArray(imgs)) return;
  for (const im of imgs) {
    const name = (im.filename || "").toLowerCase();
    if (!IMG_EXT.some((x) => name.endsWith(x))) continue;
    const key = imgKey(im);
    if (liveSeen.has(key)) continue;
    liveSeen.add(key);
    liveImages.push({ url: viewUrl(im), filename: im.filename, pid: d.prompt_id, key });
    while (liveImages.length > LIVE_MAX) {
      const old = liveImages.shift();
      if (old) liveSeen.delete(old.key);
    }
  }
}
function liveWf(pid) {
  if (!cacheQueue || !pid) return null;
  for (const arr of [cacheQueue.queue_running || [], cacheQueue.queue_pending || []]) {
    for (const item of arr) {
      if (item[1] === pid) return workflowOf(extraOf(item));
    }
  }
  return null;
}

let badgeCount = 0;
const BADGE_CLASS = "cqp-tab-badge sidebar-icon-badge absolute min-w-[16px] px-1 rounded-full bg-primary-background py-0.25 text-2xs leading-[14px] font-medium text-base-foreground";
function updateQueueBadge() {
  const btn = document.querySelector(".queue-tab-button");
  if (!btn) return;
  const container = btn.querySelector(".side-bar-button-icon-container") || btn;
  if (container === btn) btn.style.position = "relative";
  let badge = container.querySelector(".cqp-tab-badge");
  const active = btn.classList.contains("side-bar-button-selected");
  if (badgeCount > 0 && !active) {
    if (!badge) {
      badge = document.createElement("span");
      badge.className = BADGE_CLASS;
      badge.style.top = "2px";
      badge.style.right = "2px";
      badge.style.textAlign = "center";
      container.appendChild(badge);
    }
    badge.textContent = String(badgeCount);
  } else if (badge) {
    badge.remove();
  }
}

let badgeObserver = null;
let observedTabButton = null;
function ensureBadgeObserver() {
  const btn = document.querySelector(".queue-tab-button");
  if (btn && btn !== observedTabButton) {
    if (badgeObserver) badgeObserver.disconnect();
    observedTabButton = btn;
    badgeObserver = new MutationObserver(updateQueueBadge);
    badgeObserver.observe(btn, { attributes: true, attributeFilter: ["class"] });
  }
  updateQueueBadge();
}

async function refreshBadgeCount() {
  try {
    const res = await api.fetchApi("/prompt");
    const data = await res.json();
    badgeCount = data?.exec_info?.queue_remaining || 0;
    ensureBadgeObserver();
  } catch (e) {}
}

function clearPending() {
  post("/queue", { clear: true });
}
function ensureClearPendingButton() {
  const xIcon = document.querySelector('.actionbar-container i[class~="icon-[lucide--x]"]') || document.querySelector('i[class~="icon-[lucide--x]"]');
  const interruptBtn = xIcon ? xIcon.closest("button") : null;
  if (!interruptBtn || !interruptBtn.parentElement) return;
  if (interruptBtn.parentElement.querySelector(".cqp-clear-pending")) return;
  const ours = interruptBtn.cloneNode(true);
  ours.classList.add("cqp-clear-pending");
  ours.removeAttribute("disabled");
  ours.disabled = false;
  ours.setAttribute("aria-label", "Clear pending");
  ours.setAttribute("title", "Clear pending (cancel all queued)");
  const i = ours.querySelector("i");
  if (i) i.className = i.className.replace("icon-[lucide--x]", "icon-[lucide--square]");
  ours.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); clearPending(); });
  interruptBtn.after(ours);
}

function setupGlobalListeners(onData) {
  api.addEventListener("status", (e) => {
    badgeCount = e?.detail?.exec_info?.queue_remaining || 0;
    updateQueueBadge();
    onData();
  });
  api.addEventListener("execution_start", (e) => {
    state.progress = { value: 0, max: 0 };
    const pid = e?.detail?.prompt_id;
    if (pid) { startTimes[pid] = Date.now(); persistStartTimes(); }
    onData();
  });
  api.addEventListener("execution_success", onData);
  api.addEventListener("execution_error", onData);
  api.addEventListener("execution_interrupted", onData);
  api.addEventListener("executed", (e) => { captureLive(e); onData(); });
  api.addEventListener("executing", (e) => {
    const d = e?.detail;
    state.runningNode = d && typeof d === "object" ? (d.node ?? d.display_node ?? null) : (d ?? null);
    updateProgressUI();
  });
  api.addEventListener("progress", (e) => {
    const d = e?.detail;
    if (d && typeof d.value === "number") state.progress = { value: d.value, max: d.max || 0 };
    updateProgressUI();
  });
}

function renderRunning(scroll, running) {
  scroll.appendChild(h("div", { class: "cqp-section-head" }, [
    h("span", { text: "Running" }),
    h("span", { class: "cqp-count", text: String(running.length) }),
  ]));
  if (!running.length) {
    scroll.appendChild(h("div", { class: "cqp-empty", text: "Nothing running" }));
    return;
  }
  running.forEach((item, idx) => {
    const pid = item[1];
    if (!startTimes[pid]) {
      const ct = extraOf(item) && extraOf(item).create_time;
      startTimes[pid] = typeof ct === "number" ? ct : Date.now();
      persistStartTimes();
    }
    const meta = h("div", { class: "cqp-meta" }, [
      h("div", { class: "cqp-line cqp-run-node", text: idx === 0 && state.runningNode != null ? "Executing node " + state.runningNode : "Executing\u2026" }),
      h("div", { class: "cqp-pid", text: pid }),
      h("div", { class: "cqp-line cqp-timer cqp-running", "data-pid": pid, text: fmtDur(runningElapsed(pid)) }),
    ]);
    if (idx === 0) {
      const pct = state.progress.max > 0 ? Math.min(100, Math.round((state.progress.value / state.progress.max) * 100)) : 0;
      meta.appendChild(h("div", { class: "cqp-progress" }, [h("div", { class: "cqp-progress-bar", style: `width:${pct}%` })]));
    }
    scroll.appendChild(h("div", { class: "cqp-item" }, [
      h("div", { class: "cqp-thumb-ph", text: "\u25B6" }),
      meta,
      h("div", { class: "cqp-actions" }, [
        h("button", { class: "cqp-btn cqp-danger", text: "Cancel", onClick: () => post("/interrupt", { prompt_id: pid }) }),
      ]),
    ]));
  });
}

function renderPending(scroll, pending, refresh) {
  scroll.appendChild(h("div", { class: "cqp-section-head" }, [
    h("span", { text: "Pending" }),
    h("span", { class: "cqp-count", text: String(pending.length) }),
    h("span", { class: "cqp-spacer" }),
    pending.length ? h("button", { class: "cqp-btn cqp-danger", text: "Clear", onClick: async () => { await post("/queue", { clear: true }); refresh(); } }) : null,
  ]));
  if (!pending.length) {
    scroll.appendChild(h("div", { class: "cqp-empty", text: "Queue is empty" }));
    return;
  }
  [...pending].sort((a, b) => a[0] - b[0]).forEach((item) => {
    const pid = item[1];
    const wf = workflowOf(extraOf(item));
    scroll.appendChild(h("div", { class: "cqp-item" }, [
      h("div", { class: "cqp-thumb-ph", text: "#" + item[0] }),
      h("div", { class: "cqp-meta" }, [
        h("div", { class: "cqp-line", text: "Queued" }),
        h("div", { class: "cqp-pid", text: pid }),
      ]),
      h("div", { class: "cqp-actions" }, [
        h("button", { class: "cqp-btn", text: "Load", onClick: () => loadWorkflow(wf) }),
        h("button", { class: "cqp-btn cqp-danger", text: "Delete", onClick: async () => { await post("/queue", { delete: [pid] }); refresh(); } }),
      ]),
    ]));
  });
}

function renderHistoryList(scroll, history, refresh) {
  const entries = Object.entries(history).reverse();
  scroll.appendChild(h("div", { class: "cqp-section-head" }, [
    h("span", { text: "History" }),
    h("span", { class: "cqp-count", text: String(entries.length) }),
    h("span", { class: "cqp-spacer" }),
    entries.length ? h("button", { class: "cqp-btn cqp-danger", text: "Clear", onClick: async () => { await post("/history", { clear: true }); refresh(); } }) : null,
  ]));
  if (!entries.length) {
    scroll.appendChild(h("div", { class: "cqp-empty", text: "No history" }));
    return;
  }
  entries.forEach(([pid, entry]) => {
    const wf = workflowOf(extraOf(entry.prompt));
    const imgs = collectImages(entry.outputs);
    const items = itemsFromImages(imgs, pid, wf);
    const statusStr = entry.status && entry.status.status_str;
    const ok = statusStr ? statusStr === "success" : true;
    const dur = historyDuration(entry);

    const head = h("div", { class: "cqp-card-head" }, [
      h("div", { class: "cqp-meta" }, [
        h("div", { class: "cqp-line " + (ok ? "cqp-done" : "cqp-fail"), text: (statusStr || (ok ? "completed" : "unknown")) + (imgs.length ? "  \u00B7 " + imgs.length + " img" : "") + (dur != null ? "  \u00B7 " + fmtDur(dur) : "") }),
        h("div", { class: "cqp-pid", text: pid }),
      ]),
      h("div", { class: "cqp-actions" }, [
        h("button", { class: "cqp-btn", text: "Load", onClick: () => loadWorkflow(wf) }),
        h("button", { class: "cqp-btn cqp-danger", text: "Delete", onClick: async () => { await post("/history", { delete: [pid] }); refresh(); } }),
      ]),
    ]);
    const card = h("div", { class: "cqp-card" }, [head]);
    if (items.length) {
      const strip = h("div", { class: "cqp-strip" });
      items.forEach((it, i) => {
        strip.appendChild(h("img", { class: "cqp-tn", src: it.url, loading: "lazy", decoding: "async", title: it.filename, onClick: () => openLightbox(items, i) }));
      });
      card.appendChild(strip);
    } else if (!ok) {
      card.appendChild(h("div", { class: "cqp-empty", text: "Failed \u2013 no images" }));
    }
    scroll.appendChild(card);
  });
}

function renderFeed(scroll, history) {
  const cap = getFeedMax();
  const live = getLiveFeed();
  const all = [];
  const seen = new Set();
  let full = false;
  const pushImg = (it) => {
    if (full || seen.has(it.key)) return;
    seen.add(it.key);
    all.push(it);
    if (cap > 0 && all.length >= cap) full = true;
  };
  if (live) {
    for (let i = liveImages.length - 1; i >= 0 && !full; i--) {
      const im = liveImages[i];
      pushImg({ url: im.url, filename: im.filename, pid: im.pid, wf: liveWf(im.pid), key: im.key });
    }
  }
  for (const [pid, entry] of Object.entries(history).reverse()) {
    if (full) break;
    const wf = workflowOf(extraOf(entry.prompt));
    for (const im of collectImages(entry.outputs)) {
      if (full) break;
      pushImg({ url: viewUrl(im), filename: im.filename, pid, wf, key: imgKey(im) });
    }
  }
  scroll.appendChild(h("div", { class: "cqp-section-head" }, [
    h("span", { text: "Image Feed" }),
    h("span", { class: "cqp-count", text: String(all.length) + (full ? "+" : "") }),
  ]));
  if (!all.length) {
    scroll.appendChild(h("div", { class: "cqp-empty", text: "No images yet" }));
    return;
  }
  const grid = h("div", { class: "cqp-feed" });
  all.forEach((it, i) => {
    grid.appendChild(h("img", { src: it.url, loading: "lazy", decoding: "async", title: it.filename, onClick: () => openLightbox(all, i) }));
  });
  scroll.appendChild(grid);
}

function getView() {
  return localStorage.getItem(VIEW_KEY) === "feed" ? "feed" : "list";
}
function getMaxItems() {
  const n = parseInt(localStorage.getItem(MAXITEMS_KEY), 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_MAXITEMS;
}
function getFeedMax() {
  const n = parseInt(localStorage.getItem(FEEDMAX_KEY), 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_FEEDMAX;
}
function getLbSize() {
  const n = parseInt(localStorage.getItem(LBSIZE_KEY), 10);
  return Number.isFinite(n) && n >= 20 && n <= 100 ? n : DEFAULT_LBSIZE;
}
function getUiScale() {
  const n = parseInt(localStorage.getItem(UISCALE_KEY), 10);
  return Number.isFinite(n) && n >= 8 && n <= 28 ? n : DEFAULT_UISCALE;
}
function getThumbSize() {
  const n = parseInt(localStorage.getItem(THUMBSIZE_KEY), 10);
  return Number.isFinite(n) && n >= 40 && n <= 320 ? n : DEFAULT_THUMBSIZE;
}
function getLiveFeed() {
  return localStorage.getItem(LIVEFEED_KEY) === "1";
}

function signature(queue, history, view) {
  const run = (queue.queue_running || []).map((i) => i[1]).join(",");
  const pend = (queue.queue_pending || []).map((i) => i[1]).join(",");
  const hist = Object.keys(history).map((pid) => {
    const e = history[pid];
    const st = (e.status && e.status.status_str) || "";
    return pid + ":" + st + ":" + collectImages(e.outputs).length;
  }).join(",");
  return view + "|" + run + "|" + pend + "|" + hist + "|" + (getLiveFeed() ? "L" + liveImages.length : "");
}

function paint(scroll, queue, history, refreshFn) {
  const view = getView();
  const top = scroll.scrollTop;
  scroll.innerHTML = "";
  if (view === "feed") {
    renderFeed(scroll, history);
  } else {
    renderRunning(scroll, queue.queue_running || []);
    renderPending(scroll, queue.queue_pending || [], refreshFn);
    renderHistoryList(scroll, history, refreshFn);
  }
  scroll.scrollTop = top;
}

function renderSkeleton(scroll) {
  scroll.innerHTML = "";
  scroll.appendChild(h("div", { class: "cqp-empty", text: "Loading\u2026" }));
}

function mountPanel(el) {
  injectStyle();
  el.innerHTML = "";
  const scroll = h("div", { class: "cqp-scroll" });
  activeScroll = scroll;
  let busy = false;
  let lastSig = null;

  const refresh = async (opts = {}) => {
    if (busy) return;
    if (!opts.force && !document.contains(el)) return;
    busy = true;
    try {
      const mi = getMaxItems();
      const histPath = mi > 0 ? "/history?max_items=" + mi : "/history";
      const [queue, history] = await Promise.all([
        jsonOf("/queue").catch(() => ({ queue_running: [], queue_pending: [] })),
        jsonOf(histPath).catch(() => ({})),
      ]);
      cacheQueue = queue;
      cacheHistory = history;
      pruneStartTimes(queue);
      const sig = signature(queue, history, getView());
      if (sig === lastSig) return;
      lastSig = sig;
      paint(scroll, queue, history, refresh);
    } catch (e) {
      console.error("[QueuePanel] refresh failed", e);
    } finally {
      busy = false;
    }
  };

  const btnList = h("button", { text: "List", class: getView() === "list" ? "active" : "", onClick: () => setView("list") });
  const btnFeed = h("button", { text: "Feed", class: getView() === "feed" ? "active" : "", onClick: () => setView("feed") });
  function setView(v) {
    localStorage.setItem(VIEW_KEY, v);
    btnList.className = v === "list" ? "active" : "";
    btnFeed.className = v === "feed" ? "active" : "";
    lastSig = null;
    refresh({ force: true });
  }

  const inMax = h("input", { type: "number", min: "0", value: String(getMaxItems()) });
  const inFeed = h("input", { type: "number", min: "0", value: String(getFeedMax()) });
  const inLb = h("input", { type: "number", min: "20", max: "100", value: String(getLbSize()) });
  const inUi = h("input", { type: "number", min: "8", max: "28", value: String(getUiScale()) });
  const inThumb = h("input", { type: "number", min: "40", max: "320", step: "8", value: String(getThumbSize()) });
  const inLive = h("input", { type: "checkbox" });
  inLive.checked = getLiveFeed();
  inMax.addEventListener("change", () => {
    localStorage.setItem(MAXITEMS_KEY, String(Math.max(0, parseInt(inMax.value, 10) || 0)));
    lastSig = null;
    refresh({ force: true });
  });
  inFeed.addEventListener("change", () => {
    localStorage.setItem(FEEDMAX_KEY, String(Math.max(0, parseInt(inFeed.value, 10) || 0)));
    lastSig = null;
    refresh({ force: true });
  });
  inLb.addEventListener("change", () => {
    const v = Math.max(20, Math.min(100, parseInt(inLb.value, 10) || DEFAULT_LBSIZE));
    localStorage.setItem(LBSIZE_KEY, String(v));
    inLb.value = String(v);
    if (lb.overlay) lb.overlay.style.setProperty("--cqp-lb", String(v));
  });
  inUi.addEventListener("change", () => {
    const v = Math.max(8, Math.min(28, parseInt(inUi.value, 10) || DEFAULT_UISCALE));
    localStorage.setItem(UISCALE_KEY, String(v));
    inUi.value = String(v);
    const r = inUi.closest(".cqp-root");
    if (r) r.style.setProperty("--cqp-fs", v + "px");
  });
  inThumb.addEventListener("change", () => {
    const v = Math.max(40, Math.min(320, parseInt(inThumb.value, 10) || DEFAULT_THUMBSIZE));
    localStorage.setItem(THUMBSIZE_KEY, String(v));
    inThumb.value = String(v);
    const r = inThumb.closest(".cqp-root");
    if (r) r.style.setProperty("--cqp-th", v + "px");
  });
  inLive.addEventListener("change", () => {
    localStorage.setItem(LIVEFEED_KEY, inLive.checked ? "1" : "0");
    lastSig = null;
    refresh({ force: true });
  });
  const settingsRow = h("div", { class: "cqp-settings", style: "display:none;" }, [
    h("label", { class: "cqp-setlbl", "data-tip": "History tasks to load (0 = all). Higher = slower fetch." }, ["Tasks", inMax]),
    h("label", { class: "cqp-setlbl", "data-tip": "Max images shown in Feed (0 = unlimited). Higher = more memory." }, ["Feed max", inFeed]),
    h("label", { class: "cqp-setlbl", "data-tip": "Lightbox image size as % of screen." }, ["Big image %", inLb]),
    h("label", { class: "cqp-setlbl", "data-tip": "Base font size for panel text & buttons (px)." }, ["UI scale", inUi]),
    h("label", { class: "cqp-setlbl", "data-tip": "Thumbnail size (px). Affects Feed grid and list strips." }, ["Thumb size", inThumb]),
    h("label", { class: "cqp-setlbl", "data-tip": "Show preview images in Feed during the run, without waiting for the task to finish." }, ["Live feed", inLive]),
  ]);
  const gear = h("button", {
    class: "cqp-btn cqp-gear", text: "\u2699", title: "Settings",
    onClick: () => { settingsRow.style.display = settingsRow.style.display === "none" ? "flex" : "none"; },
  });

  const toolbar = h("div", { class: "cqp-toolbar" }, [
    h("span", { class: "cqp-title", text: "Queue" }),
    h("div", { class: "cqp-seg" }, [btnList, btnFeed]),
    gear,
  ]);

  const root = h("div", { class: "cqp-root" }, [toolbar, settingsRow, scroll]);
  root.style.setProperty("--cqp-fs", getUiScale() + "px");
  root.style.setProperty("--cqp-th", getThumbSize() + "px");
  el.appendChild(root);

  if (cacheQueue && cacheHistory) {
    paint(scroll, cacheQueue, cacheHistory, refresh);
    lastSig = signature(cacheQueue, cacheHistory, getView());
  } else {
    renderSkeleton(scroll);
  }

  if (!el.__cqpInterval) {
    el.__cqpInterval = setInterval(() => {
      if (!document.contains(el)) {
        clearInterval(el.__cqpInterval);
        el.__cqpInterval = null;
        return;
      }
      refresh();
    }, 1500);
  }

  refresh({ force: true });
  return refresh;
}

app.registerExtension({
  name: "Comfy.QueuePanel.Restored",
  async setup() {
    if (!app.extensionManager || typeof app.extensionManager.registerSidebarTab !== "function") {
      console.warn("[QueuePanel] registerSidebarTab API not available");
      return;
    }
    let sharedRefresh = null;
    app.extensionManager.registerSidebarTab({
      id: "queue",
      title: "Queue",
      tooltip: "Queue",
      icon: "pi pi-history",
      type: "custom",
      render: (el) => {
        sharedRefresh = mountPanel(el);
      },
    });
    setupGlobalListeners(() => sharedRefresh && sharedRefresh());
    ensureBadgeObserver();
    refreshBadgeCount();
    ensureClearPendingButton();
    setInterval(ensureBadgeObserver, 1500);
    setInterval(updateTimers, 1000);
    setInterval(ensureClearPendingButton, 1500);
  },
});
