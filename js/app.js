/* =====================================================================
   Dhabalogy QR menu — application logic
   Welcome → Menu (search, categories, feature) → Dish sheet → Selection
   Routing is hash-based so the phone's back button closes sheets.
   ===================================================================== */
(function () {
  "use strict";

  const DATA = window.DHABALOGY_MENU;
  const STORAGE_KEY = "dhabalogy.selection.v1";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "").replace(/\s+/g, " ").trim();
  const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const priceText = (d) => (typeof d.price === "number" ? rupee(d.price) : d.priceLabel || "Ask server");

  /* ---------------- Model ---------------- */
  const sections = [];
  const dishes = new Map();

  function addSection(src, kind) {
    const sec = { id: src.id, kind, name: src.name, short: src.short || src.name, subtitle: src.subtitle || "", note: src.note || "", groups: [], count: 0 };
    const groups = src.groups || [{ name: "", items: src.items || [] }];
    groups.forEach((g) => {
      const grp = { name: g.name || "", items: [] };
      (g.items || []).forEach((it) => {
        let id = it.id || sec.id + "-" + slug(it.name);
        let n = 2;
        while (dishes.has(id)) id = (it.id || sec.id + "-" + slug(it.name)) + "-" + n++;
        const d = Object.assign({}, it, { id, section: sec, group: grp });
        dishes.set(id, d);
        grp.items.push(d);
        sec.count++;
      });
      sec.groups.push(grp);
    });
    sections.push(sec);
  }
  (DATA.seasonal || []).filter((s) => s.visible).forEach((s) => addSection(s, "seasonal"));
  (DATA.categories || []).forEach((s) => addSection(s, "regular"));

  /* ---------------- Selection state (persisted) ---------------- */
  let selection = loadSelection();

  function loadSelection() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      const out = {};
      Object.entries(parsed.items || {}).forEach(([id, q]) => {
        if (dishes.has(id) && Number(q) > 0) out[id] = Math.min(99, Math.floor(Number(q)));
      });
      return out;
    } catch (e) {
      return {};
    }
  }
  function saveSelection() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: selection, updatedAt: Date.now() })); } catch (e) { /* storage unavailable: selection lives in memory */ }
  }
  function qtyOf(id) { return selection[id] || 0; }
  function setQty(id, qty) {
    qty = Math.max(0, Math.min(99, Math.floor(qty)));
    if (qty === 0) delete selection[id]; else selection[id] = qty;
    saveSelection();
    refreshDishControls(id);
    refreshSelectionBar();
    if (openSheet === "selection") renderSelectionSheet();
    if (openSheet === "dish" && currentDishId === id) renderDishFoot(id);
  }
  function totals() {
    let count = 0, sum = 0, mrp = false;
    Object.entries(selection).forEach(([id, q]) => {
      const d = dishes.get(id);
      count += q;
      if (typeof d.price === "number") sum += d.price * q; else mrp = true;
    });
    return { count, sum, mrp };
  }

  /* ---------------- Elements ---------------- */
  const app = $("#app");
  const screenWelcome = $("#screen-welcome");
  const screenMenu = $("#screen-menu");
  const topbar = $(".topbar");
  const chips = $("#chips");
  const content = $("#menu-content");
  const results = $("#search-results");
  const searchInput = $("#search");
  const searchClear = $("#search-clear");
  const fab = $("#fab-categories");
  const selbar = $("#selbar");
  const backdrop = $("#backdrop");
  const sheets = { dish: $("#sheet-dish"), selection: $("#sheet-selection"), categories: $("#sheet-categories") };
  const toastEl = $("#toast");

  $("#welcome-address").textContent = (DATA.restaurant && DATA.restaurant.address) || "";

  /* ---------------- Rendering: menu ---------------- */
  function controlHTML(d) {
    const q = qtyOf(d.id);
    return `<div class="ctl" data-id="${esc(d.id)}">
      <button class="add" type="button" aria-label="Add ${esc(d.name)} to selection"${q ? " hidden" : ""}>Add</button>
      <div class="stepper" role="group" aria-label="Quantity of ${esc(d.name)}"${q ? "" : " hidden"}>
        <button type="button" class="dec" aria-label="Decrease quantity of ${esc(d.name)}"><svg class="icon"><use href="#i-minus"/></svg></button>
        <span class="qty" aria-live="polite">${q}</span>
        <button type="button" class="inc" aria-label="Increase quantity of ${esc(d.name)}"><svg class="icon"><use href="#i-plus"/></svg></button>
      </div>
    </div>`;
  }
  function noteLine(d) {
    const bits = [];
    if (d.sub) bits.push(d.sub);
    if (d.note) bits.push(d.note);
    if (d.choices) bits.push(d.choices.replace(/, /g, " / ").replace(/ or /g, " / "));
    return bits.join(" · ");
  }
  function dishRowHTML(d) {
    const q = qtyOf(d.id);
    const tag = d.tag ? `<span class="tag">${esc(d.tag)}</span>` : "";
    const note = noteLine(d);
    const priceCls = typeof d.price === "number" ? "" : " is-mrp";
    if (d.image) {
      return `<article class="dish dish--featured${q ? " is-selected" : ""}" data-dish="${esc(d.id)}">
        <button class="dish-main dish-main--img" type="button" aria-label="${esc(d.name)}, ${esc(priceText(d))}. View details">
          <img class="dish-img" src="${esc(d.image)}" alt="" loading="lazy" decoding="async" width="800" height="500">
        </button>
        <div class="dish-row">
          <button class="dish-main" type="button" aria-label="${esc(d.name)}, ${esc(priceText(d))}. View details">
            <div class="dish-text">
              <h3 class="dish-name">${esc(d.name)}${tag}</h3>
              ${note ? `<p class="dish-note">${esc(note)}</p>` : ""}
              <p class="dish-price${priceCls}">${esc(priceText(d))}</p>
            </div>
          </button>
          ${controlHTML(d)}
        </div>
      </article>`;
    }
    return `<article class="dish${q ? " is-selected" : ""}" data-dish="${esc(d.id)}">
      <button class="dish-main" type="button" aria-label="${esc(d.name)}, ${esc(priceText(d))}. View details">
        <div class="dish-text">
          <h3 class="dish-name">${esc(d.name)}${tag}</h3>
          ${note ? `<p class="dish-note">${esc(note)}</p>` : ""}
          <p class="dish-price${priceCls}">${esc(priceText(d))}</p>
        </div>
      </button>
      ${controlHTML(d)}
    </article>`;
  }
  function sectionHTML(sec) {
    const seasonal = sec.kind === "seasonal";
    const head = seasonal
      ? `<header class="sec-head">
           <div><span class="sec-tag">Seasonal</span><h2 class="display sec-title">${esc(sec.name)}</h2>${sec.subtitle ? `<p class="sec-sub">${esc(sec.subtitle)}</p>` : ""}</div>
           <svg class="lotus" aria-hidden="true"><use href="#i-lotus"/></svg>
         </header>`
      : `<header class="sec-head"><h2 class="display sec-title">${esc(sec.name)}</h2>${sec.subtitle ? `<p class="sec-sub">${esc(sec.subtitle)}</p>` : ""}</header>`;
    const note = sec.note ? `<p class="sec-note">${esc(sec.note)}</p>` : "";
    const body = sec.groups.map((g) => `${g.name ? `<h3 class="grp-title">${esc(g.name)}</h3>` : ""}${g.items.map(dishRowHTML).join("")}`).join("");
    return `<section class="sec sec--${sec.kind}" id="sec-${esc(sec.id)}" aria-labelledby="sec-title-${esc(sec.id)}">${head.replace('class="display sec-title"', `class="display sec-title" id="sec-title-${esc(sec.id)}"`)}${note}${body}</section>`;
  }
  function featureHTML() {
    const f = DATA.featureBanner;
    if (!f) return "";
    const sec = sections.find((s) => s.id === f.sectionId);
    if (!sec) return "";
    return `<button class="feature" type="button" data-feature="${esc(f.sectionId)}" data-dish="${esc(f.dishId || "")}" aria-label="${esc(f.eyebrow)}: ${esc(f.title)}. ${esc(f.link)}">
      <span class="feature-text">
        <span class="feature-eyebrow">${esc(f.eyebrow)}</span>
        <span class="display feature-title">${esc(f.title)}</span>
        <span class="feature-cap">${esc(f.caption)}</span>
        <span class="feature-link">${esc(f.link)} <svg class="icon"><use href="#i-arrow"/></svg></span>
      </span>
      <img class="feature-img" src="${esc(f.image)}" alt="" width="640" height="640" decoding="async">
    </button>`;
  }
  function renderMenu() {
    let chipHTML = "";
    let lastKind = null;
    sections.forEach((s) => {
      if (lastKind && lastKind !== s.kind) chipHTML += `<span class="chip-gap" aria-hidden="true"></span>`;
      lastKind = s.kind;
      chipHTML += `<button class="chip${s.kind === "seasonal" ? " chip--seasonal" : ""}" type="button" data-target="${esc(s.id)}" aria-pressed="false">${s.kind === "seasonal" ? '<svg class="lotus" aria-hidden="true"><use href="#i-lotus"/></svg>' : ""}${esc(s.short)}</button>`;
    });
    chips.innerHTML = chipHTML;
    content.innerHTML = featureHTML() + sections.map(sectionHTML).join("");
    setActiveChip(sections[0] && sections[0].id);
  }

  /* ---------------- Rendering: controls / bar ---------------- */
  function refreshDishControls(id) {
    const q = qtyOf(id);
    $$(`.ctl[data-id="${CSS.escape(id)}"]`).forEach((ctl) => {
      $(".add", ctl).hidden = q > 0;
      $(".stepper", ctl).hidden = q === 0;
      $(".qty", ctl).textContent = q;
    });
    $$(`.dish[data-dish="${CSS.escape(id)}"]`).forEach((row) => row.classList.toggle("is-selected", q > 0));
  }
  function refreshSelectionBar() {
    const t = totals();
    app.classList.toggle("has-selection", t.count > 0);
    selbar.hidden = t.count === 0;
    $("#selbar-count").textContent = `${t.count} ${t.count === 1 ? "dish" : "dishes"} selected`;
    $("#selbar-total").textContent = t.mrp ? `${rupee(t.sum)} + items at MRP` : rupee(t.sum);
  }

  /* ---------------- Search ---------------- */
  function runSearch() {
    const q = norm(searchInput.value);
    searchClear.hidden = !q;
    if (!q) {
      app.classList.remove("is-searching");
      results.hidden = true;
      results.innerHTML = "";
      return;
    }
    app.classList.add("is-searching");
    results.hidden = false;
    const matches = [];
    sections.forEach((sec) => sec.groups.forEach((g) => g.items.forEach((d) => {
      const hay = norm(d.name + " " + (d.sub || "") + " " + (d.choices || ""));
      if (hay.includes(q)) matches.push(d);
    })));
    if (!matches.length) {
      results.innerHTML = `<div class="empty">
        <svg class="lotus" aria-hidden="true"><use href="#i-lotus"/></svg>
        <h3 class="display">Kuch nahi mila</h3>
        <p>No dishes match “${esc(searchInput.value.trim())}”. Try a shorter word, like paneer, chai or paratha.</p>
        <button class="btn btn-primary" type="button" id="search-reset">Clear search</button>
      </div>`;
      return;
    }
    let html = `<p class="results-head">${matches.length} ${matches.length === 1 ? "dish" : "dishes"} for “${esc(searchInput.value.trim())}”</p>`;
    let lastSec = null;
    matches.forEach((d) => {
      if (d.section !== lastSec) {
        lastSec = d.section;
        html += `<h2 class="results-cat">${esc(d.section.name)}${d.section.kind === "seasonal" ? " · Seasonal" : ""}</h2>`;
      }
      html += dishRowHTML(d);
    });
    results.innerHTML = html;
  }
  function clearSearch(focus) {
    searchInput.value = "";
    runSearch();
    if (focus) searchInput.focus();
  }

  /* ---------------- Category navigation / scroll spy ---------------- */
  function stickyOffset() { return topbar.offsetHeight + chips.offsetHeight; }
  let chipLockUntil = 0;
  function setActiveChip(id) {
    $$(".chip", chips).forEach((c) => {
      const on = c.dataset.target === id;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) {
        const left = c.offsetLeft - (chips.clientWidth - c.offsetWidth) / 2;
        chips.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  }
  function scrollToSection(id) {
    const el = document.getElementById("sec-" + id);
    if (!el) return;
    chipLockUntil = Date.now() + 800;
    setActiveChip(id);
    const top = el.getBoundingClientRect().top + window.scrollY - stickyOffset() + 1;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
  }
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (screenMenu.hidden || app.classList.contains("is-searching") || Date.now() < chipLockUntil) return;
      const y = stickyOffset() + 12;
      let current = sections[0] && sections[0].id;
      for (const s of sections) {
        const el = document.getElementById("sec-" + s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= y) current = s.id; else break;
      }
      const active = $(".chip.is-active", chips);
      if (!active || active.dataset.target !== current) setActiveChip(current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- Sheets ---------------- */
  let openSheet = null;
  let currentDishId = null;
  let afterClose = null;

  function showSheet(name) {
    Object.entries(sheets).forEach(([k, el]) => {
      const on = k === name;
      el.classList.toggle("is-open", on);
      el.setAttribute("aria-hidden", on ? "false" : "true");
    });
    backdrop.classList.toggle("is-open", !!name);
    document.documentElement.classList.toggle("sheet-open", !!name);
    fab.style.visibility = name ? "hidden" : "";
    selbar.style.visibility = name ? "hidden" : "";
    openSheet = name;
    if (name) {
      toastEl.classList.remove("is-visible");
      const sheet = sheets[name];
      sheet.scrollTop = 0;
      $(".sheet-body", sheet).scrollTop = 0;
      setTimeout(() => sheet.focus({ preventScroll: true }), 50);
    }
  }
  function openRoute(hash) {
    history.pushState({ app: true }, "", hash);
    route();
  }
  function closeSheet(cb) {
    if (!openSheet) { if (cb) cb(); return; }
    afterClose = cb || null;
    if (history.state && history.state.app) history.back();
    else { history.replaceState(null, "", "#menu"); route(); }
  }

  /* Dish sheet */
  function renderDishSheet(id) {
    const d = dishes.get(id);
    if (!d) return;
    currentDishId = id;
    const body = $("#dish-body");
    const hero = d.image
      ? `<div class="dish-hero"><img src="${esc(d.image)}" alt="${esc(d.name)}" width="800" height="500" decoding="async"></div>`
      : `<div class="dish-hero"><div class="dish-ph" aria-hidden="true"><div class="dish-ph-arch"><svg class="lotus"><use href="#i-lotus"/></svg></div></div><span class="dish-ph-label" aria-hidden="true">${esc(d.section.short)}</span></div>`;
    let blocks = "";
    if (d.includes && d.includes.length) {
      blocks += `<div class="dish-block"><h3>What’s included</h3><ul class="includes">${d.includes.map((x, i) => `<li><span class="num">${i + 1}</span><span>${esc(x)}</span></li>`).join("")}</ul></div>`;
    }
    if (d.choices) {
      blocks += `<div class="dish-block"><h3>Choose one</h3><p>${esc(d.choices)}</p><p class="hint">Tell your server your choice.</p></div>`;
    }
    if (d.note) {
      blocks += `<div class="dish-block"><h3>Serving</h3><p>${esc(d.note.charAt(0).toUpperCase() + d.note.slice(1))}</p></div>`;
    }
    if (d.section.note) {
      blocks += `<div class="dish-block"><p class="hint">${esc(d.section.note)}</p></div>`;
    }
    const catLabel = d.section.name + (d.group.name ? " · " + d.group.name : "") + (d.tag ? " · " + d.tag : "");
    body.innerHTML = `${hero}
      <div class="dish-info">
        <p class="dish-cat">${esc(catLabel)}</p>
        <h2 id="dish-title">${esc(d.name)}</h2>
        ${d.sub ? `<p class="dish-sub">${esc(d.sub)}</p>` : ""}
        <p class="dish-price${typeof d.price === "number" ? "" : " is-mrp"}">${esc(priceText(d))}</p>
        ${blocks}
      </div>`;
    sheetQty = Math.max(1, qtyOf(id));
    renderDishFoot(id);
  }
  let sheetQty = 1;
  function renderDishFoot(id) {
    const d = dishes.get(id);
    const inSel = qtyOf(id) > 0;
    const lineTotal = typeof d.price === "number" ? rupee(d.price * sheetQty) : d.priceLabel || "";
    $("#dish-foot").innerHTML = `
      <div class="stepper" role="group" aria-label="Quantity">
        <button type="button" class="sheet-dec" aria-label="Decrease quantity"><svg class="icon"><use href="#i-minus"/></svg></button>
        <span class="qty" aria-live="polite">${sheetQty}</span>
        <button type="button" class="sheet-inc" aria-label="Increase quantity"><svg class="icon"><use href="#i-plus"/></svg></button>
      </div>
      <button class="btn btn-primary" type="button" id="dish-add">${inSel ? "Update Selection" : "Add to Selection"}${lineTotal ? ` · ${esc(lineTotal)}` : ""}</button>`;
  }

  /* Selection sheet */
  function renderSelectionSheet() {
    const body = $("#selection-body");
    const foot = $("#selection-foot");
    const ids = Object.keys(selection);
    if (!ids.length) {
      body.innerHTML = `<div class="empty">
        <svg class="lotus" aria-hidden="true"><use href="#i-lotus"/></svg>
        <h3 class="display">Abhi kuch nahi chuna</h3>
        <p>Your selection is empty. Add the dishes you’d like, then show this list to your server.</p>
        <button class="btn btn-primary" type="button" data-close>Browse the menu</button>
      </div>`;
      foot.innerHTML = "";
      return;
    }
    const t = totals();
    body.innerHTML = ids.map((id) => {
      const d = dishes.get(id);
      const q = selection[id];
      const line = typeof d.price === "number" ? rupee(d.price * q) : "MRP";
      return `<div class="sel-row" data-dish="${esc(id)}">
        <div class="sel-text">
          <p class="sel-name">${esc(d.name)}</p>
          <p class="sel-unit">${esc(priceText(d))} each${d.sub ? " · " + esc(d.sub) : ""}</p>
        </div>
        ${controlHTML(d)}
        <span class="sel-line">${esc(line)}</span>
      </div>`;
    }).join("") + `
      <div class="sel-summary">
        <div class="sel-subtotal"><span>Subtotal · ${t.count} ${t.count === 1 ? "dish" : "dishes"}</span><span>${rupee(t.sum)}</span></div>
        ${t.mrp ? `<p class="sel-mrp">Mineral water is charged at MRP and is not included in the subtotal.</p>` : ""}
      </div>
      <p class="sel-note"><svg class="lotus" aria-hidden="true"><use href="#i-lotus"/></svg><span>Show your selection to your server to order.</span></p>
      <div class="sel-clear" id="sel-clear"><button class="btn btn-danger-ghost" type="button" id="clear-ask"><svg class="icon"><use href="#i-trash"/></svg> Clear selection</button></div>`;
    foot.innerHTML = `<button class="btn btn-primary" type="button" data-close style="flex:1"><svg class="icon"><use href="#i-back"/></svg> Back to menu</button>`;
  }

  /* Categories sheet */
  function renderCategoriesSheet() {
    const active = ($(".chip.is-active", chips) || {}).dataset?.target;
    const group = (kind, title) => {
      const list = sections.filter((s) => s.kind === kind);
      if (!list.length) return "";
      return `<div class="cat-group"><h3>${title}</h3>${list.map((s) => `<button class="cat-btn${s.id === active ? " is-active" : ""}" type="button" data-cat="${esc(s.id)}"><span>${esc(s.name)}</span><span class="count">${s.count}</span></button>`).join("")}</div>`;
    };
    $("#categories-body").innerHTML = group("seasonal", "Seasonal specials") + group("regular", "Menu");
  }

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 1700);
  }

  /* ---------------- Routing ---------------- */
  function showScreen(name) {
    const toMenu = name === "menu";
    if (screenMenu.hidden !== !toMenu) {
      screenWelcome.hidden = toMenu;
      screenMenu.hidden = !toMenu;
      fab.hidden = !toMenu;
      window.scrollTo(0, 0);
      if (toMenu) setActiveChip(sections[0] && sections[0].id);
    }
  }
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [kind, id] = h.split("/");
    if (!kind) { showSheet(null); showScreen("welcome"); return; }
    showScreen("menu");
    if (kind === "dish" && dishes.has(id)) { renderDishSheet(id); showSheet("dish"); }
    else if (kind === "selection") { renderSelectionSheet(); showSheet("selection"); }
    else if (kind === "categories") { renderCategoriesSheet(); showSheet("categories"); }
    else {
      showSheet(null);
      if (kind !== "menu") history.replaceState(null, "", "#menu");
      if (afterClose) { const cb = afterClose; afterClose = null; cb(); }
    }
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("popstate", route);

  /* ---------------- Events ---------------- */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const inCtl = t.closest(".ctl");
    if (inCtl) {
      const id = inCtl.dataset.id;
      if (t.closest(".add")) { setQty(id, 1); toast(`Added · ${dishes.get(id).name}`); }
      else if (t.closest(".inc")) setQty(id, qtyOf(id) + 1);
      else if (t.closest(".dec")) setQty(id, qtyOf(id) - 1);
      return;
    }
    const main = t.closest(".dish-main");
    if (main) { openRoute("#dish/" + main.closest(".dish").dataset.dish); return; }

    const chip = t.closest(".chip");
    if (chip) { scrollToSection(chip.dataset.target); return; }

    const feature = t.closest(".feature");
    if (feature) { scrollToSection(feature.dataset.feature); return; }

    if (t.closest("#search-jump")) { clearSearch(false); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); searchInput.focus(); return; }
    if (t.closest("#search-clear") || t.closest("#search-reset")) { clearSearch(true); return; }

    if (t.closest("#fab-categories")) { openRoute("#categories"); return; }
    if (t.closest("#selbar-view")) { openRoute("#selection"); return; }

    if (t.closest("[data-close]") || t === backdrop) { closeSheet(); return; }

    const cat = t.closest(".cat-btn");
    if (cat) { const id = cat.dataset.cat; closeSheet(() => scrollToSection(id)); return; }

    if (t.closest(".sheet-inc")) { sheetQty = Math.min(99, sheetQty + 1); renderDishFoot(currentDishId); return; }
    if (t.closest(".sheet-dec")) { sheetQty = Math.max(1, sheetQty - 1); renderDishFoot(currentDishId); return; }
    if (t.closest("#dish-add")) {
      const id = currentDishId, d = dishes.get(id);
      const wasIn = qtyOf(id) > 0;
      setQty(id, sheetQty);
      closeSheet(() => toast(`${wasIn ? "Updated" : "Added"} · ${d.name}`));
      return;
    }

    if (t.closest("#clear-ask")) {
      $("#sel-clear").innerHTML = `<span class="sel-confirm">Clear everything? <button class="btn btn-danger-ghost" type="button" id="clear-yes">Yes, clear</button><button class="btn btn-ghost" type="button" id="clear-no">Keep</button></span>`;
      return;
    }
    if (t.closest("#clear-yes")) { Object.keys(selection).forEach((id) => { delete selection[id]; refreshDishControls(id); }); saveSelection(); refreshSelectionBar(); renderSelectionSheet(); return; }
    if (t.closest("#clear-no")) { renderSelectionSheet(); return; }
  });

  /* Keep the page from scrolling behind an open sheet without breaking sticky headers */
  const block = (e) => { if (openSheet) e.preventDefault(); };
  backdrop.addEventListener("wheel", block, { passive: false });
  backdrop.addEventListener("touchmove", block, { passive: false });

  searchInput.addEventListener("input", runSearch);
  searchInput.addEventListener("keydown", (e) => { if (e.key === "Escape") clearSearch(false); if (e.key === "Enter") searchInput.blur(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && openSheet) closeSheet(); });

  /* ---------------- Boot ---------------- */
  renderMenu();
  refreshSelectionBar();
  route();
})();
