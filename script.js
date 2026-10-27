(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Estado global
     --------------------------------------------------------------- */
  let PRODUCTS = [];        // lo que se VE en el catálogo
  let ALL_PRODUCTS = [];    // todos los productos (incluye agotados)
  let siteSettings = null;
  let currentModalProduct = null;
  let modalQtyValue = 1;
  let modalMinQty = 1;
  const WHOLESALE_MIN_TOTAL = 12; // mínimo total de unidades (puede ser surtido, mezclando perfumes)

  const state = {
    query: "",
    category: "Todas",
    brand: "",
    sort: "relevance",
  };

  function isEffectivelyAvailable(p) {
    if (!p.avail) return false;
    if (p.stock !== null && p.stock !== undefined && p.stock !== "" && Number(p.stock) <= 0) return false;
    return true;
  }

  function normalize(str) {
    return (str || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function money(n) {
    return "$" + Number(n || 0).toFixed(2);
  }

  /* ---------------------------------------------------------------
     Elementos del DOM
     --------------------------------------------------------------- */
  const el = {
    searchInput: document.getElementById("searchInput"),
    searchClear: document.getElementById("searchClear"),
    cartBtn: document.getElementById("cartBtn"),
    cartBadge: document.getElementById("cartBadge"),

    marqueeTrack: document.getElementById("marqueeTrack"),

    bannerCarousel: document.getElementById("bannerCarousel"),
    bannerTrack: document.getElementById("bannerTrack"),
    bannerPrev: document.getElementById("bannerPrev"),
    bannerNext: document.getElementById("bannerNext"),
    bannerDots: document.getElementById("bannerDots"),

    eyebrowText: document.getElementById("eyebrowText") || document.createElement("p"),
    heroTitle: document.getElementById("heroTitle") || document.createElement("h1"),
    heroSubtitle: document.getElementById("heroSubtitle") || document.createElement("p"),

    featuredSection: document.getElementById("featuredSection"),
    featuredScroll: document.getElementById("featuredScroll"),

    categoryChips: document.getElementById("categoryChips"),
    brandSelect: document.getElementById("brandSelect"),
    sortSelect: document.getElementById("sortSelect"),
    resultsCount: document.getElementById("resultsCount"),
    productGrid: document.getElementById("productGrid"),
    emptyState: document.getElementById("emptyState"),

    modalOverlay: document.getElementById("modalOverlay"),
    modalClose: document.getElementById("modalClose"),
    modalImage: document.getElementById("modalImage"),
    modalStamp: document.getElementById("modalStamp"),
    modalBrand: document.getElementById("modalBrand"),
    modalName: document.getElementById("modalName"),
    modalRef: document.getElementById("modalRef"),
    modalPrice: document.getElementById("modalPrice"),
    modalPriceOld: document.getElementById("modalPriceOld"),
    modalQty: document.getElementById("modalQty"),
    modalMinQtyNote: document.getElementById("modalMinQtyNote"),
    modalDescription: document.getElementById("modalDescription"),
    modalDescriptionText: document.getElementById("modalDescriptionText"),
    modalQtyMinus: document.getElementById("modalQtyMinus"),
    modalQtyPlus: document.getElementById("modalQtyPlus"),
    modalAddCart: document.getElementById("modalAddCart"),

    cartOverlay: document.getElementById("cartOverlay"),
    cartClose: document.getElementById("cartClose"),
    cartItems: document.getElementById("cartItems"),
    cartEmpty: document.getElementById("cartEmpty"),
    cartMinProgress: document.getElementById("cartMinProgress"),
    cartFooter: document.getElementById("cartFooter"),
    cartTotal: document.getElementById("cartTotal"),
    checkoutBtn: document.getElementById("checkoutBtn"),

    checkoutOverlay: document.getElementById("checkoutOverlay"),
    checkoutClose: document.getElementById("checkoutClose"),
    advisorStep: document.getElementById("advisorStep"),
    advisorPillWrap: document.getElementById("advisorPillWrap"),
    custCedulaNum: document.getElementById("custCedulaNum"),
    clientCedulaNum: document.getElementById("clientCedulaNum"),
    clientBtn: document.getElementById("clientBtn"),
    clientOverlay: document.getElementById("clientOverlay"),
    clientClose: document.getElementById("clientClose"),
    clientForm: document.getElementById("clientForm"),
    clientPhone: document.getElementById("clientPhone"),
    clientSubmit: document.getElementById("clientSubmit"),
    clientMsg: document.getElementById("clientMsg"),
    clientResults: document.getElementById("clientResults"),
    advisorConfirm: document.getElementById("advisorConfirm"),
    advisorConfirmName: document.getElementById("advisorConfirmName"),
    advisorConfirmYes: document.getElementById("advisorConfirmYes"),
    advisorConfirmOther: document.getElementById("advisorConfirmOther"),
    advisorAsk: document.getElementById("advisorAsk"),
    veOverlay: document.getElementById("veOverlay"),
    veAccept: document.getElementById("veAccept"),
    custHideName: document.getElementById("custHideName"),
    advisorYesBtn: document.getElementById("advisorYesBtn"),
    advisorNoBtn: document.getElementById("advisorNoBtn"),
    advisorList: document.getElementById("advisorList"),
    advisorChosenTag: document.getElementById("advisorChosenTag"),
    checkoutForm: document.getElementById("checkoutForm"),
    custName: document.getElementById("custName"),
    custPhone: document.getElementById("custPhone"),
    custCity: document.getElementById("custCity"),
    custEmail: document.getElementById("custEmail"),
    custPayment: document.getElementById("custPayment"),
    paymentDetailsBox: document.getElementById("paymentDetailsBox"),
    payRefWrap: document.getElementById("payRefWrap"),
    payProofWrap: document.getElementById("payProofWrap"),
    custPayProof: document.getElementById("custPayProof"),
    custPayRef: document.getElementById("custPayRef"),
    payLaterNote: document.getElementById("payLaterNote"),
    payLaterOverlay: document.getElementById("payLaterOverlay"),
    payLaterNow: document.getElementById("payLaterNow"),
    payLaterOk: document.getElementById("payLaterOk"),
    custDelivery: document.getElementById("custDelivery"),
    addressField: document.getElementById("addressField"),
    custAddress: document.getElementById("custAddress"),
    submitOrderBtn: document.getElementById("submitOrderBtn"),
    checkoutError: document.getElementById("checkoutError"),
    checkoutSuccess: document.getElementById("checkoutSuccess"),
    successLead: document.getElementById("successLead"),
    trustPay: document.getElementById("trustPay"),
    trustMin: document.getElementById("trustMin"),
    trustChat: document.getElementById("trustChat"),
    trustChatChip: document.getElementById("trustChatChip"),
    successHours: document.getElementById("successHours"),
    successSchedule: document.getElementById("successSchedule"),
    closeSuccessBtn: document.getElementById("closeSuccessBtn"),
  };

  /* ---------------------------------------------------------------
     Carrito (localStorage)
     --------------------------------------------------------------- */
  const CART_KEY = "mpv_cart_v1";

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function cartKey(id) { return String(id); }
  function parseCartKey(key) { return { id: key }; }

  function addToCart(id, qty) {
    const cart = loadCart();
    const key = cartKey(id);
    cart[key] = (cart[key] || 0) + qty;
    saveCart(cart);
    updateCartBadge();
  }

  function setCartQty(id, qty) {
    const cart = loadCart();
    const key = cartKey(id);
    if (qty <= 0) delete cart[key];
    else cart[key] = qty;
    saveCart(cart);
    updateCartBadge();
    renderCartPanel();
  }

  function updateCartBadge() {
    const cart = loadCart();
    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    el.cartBadge.hidden = count === 0;
    el.cartBadge.textContent = count;
  }

  function cartTotal() {
    const cart = loadCart();
    return Object.entries(cart).reduce((sum, [key, qty]) => {
      const { id } = parseCartKey(key);
      const p = PRODUCTS.find(pp => String(pp.id) === String(id));
      if (!p) return sum;
      const price = p.offer || p.mayor || 0;
      return sum + qty * price;
    }, 0);
  }

  function pooledQty() {
    const cart = loadCart();
    return Object.entries(cart).reduce((sum, [key, qty]) => {
      const { id } = parseCartKey(key);
      const p = PRODUCTS.find(pp => String(pp.id) === String(id));
      if (!p) return sum;
      const counts = (p.min_qty || 12) > 1; // las cajas (min_qty=1) no cuentan para el mínimo
      return counts ? sum + qty : sum;
    }, 0);
  }

  /* ¿El pedido ya cumple el mínimo? Perfumes sueltos: 12 en total (de cualquier referencia). Las cajas van por unidad, sin mínimo.
     Solo cuando se cumple se puede continuar y se muestran los datos de pago. */
  function minimoFaltante() {
    const pooled = pooledQty();
    return pooled > 0 && pooled < WHOLESALE_MIN_TOTAL ? WHOLESALE_MIN_TOTAL - pooled : 0;
  }
  function cumpleMinimo() { return Object.keys(loadCart()).length > 0 && minimoFaltante() === 0; }

  function renderCartPanel() {
    const cart = loadCart();
    const entries = Object.entries(cart);
    if (!entries.length) {
      el.cartItems.innerHTML = "";
      el.cartEmpty.hidden = false;
      el.cartFooter.hidden = true;
      el.cartMinProgress.hidden = true;
      return;
    }
    el.cartEmpty.hidden = true;
    el.cartFooter.hidden = false;

    el.cartItems.innerHTML = entries.map(([key, qty]) => {
      const { id } = parseCartKey(key);
      const p = PRODUCTS.find(pp => String(pp.id) === String(id));
      if (!p) return "";
      const price = p.offer || p.mayor || 0;
      return `
        <div class="cart-line">
          <img src="${p.image || ''}" alt="${p.name}">
          <div style="flex:1">
            <p class="cart-line-name">${p.name}</p>
            <p class="cart-line-price">${money(price)} × ${qty}</p>
          </div>
          <div class="qty-stepper">
            <button type="button" data-cart-minus="${id}">−</button>
            <span>${qty}</span>
            <button type="button" data-cart-plus="${id}">+</button>
          </div>
        </div>
      `;
    }).join("");

    // Regla: las CAJAS se venden por unidad (sin mínimo). El mínimo de 12 aplica solo a los
    // perfumes sueltos: si hay al menos uno, deben sumar 12 (de cualquier referencia).
    const pooled = pooledQty();
    el.cartMinProgress.hidden = false;
    if (pooled === 0) {
      el.cartMinProgress.className = "cart-min-progress ok";
      el.cartMinProgress.textContent = "✓ Las cajas se venden por unidad: no hay mínimo";
    } else if (pooled >= WHOLESALE_MIN_TOTAL) {
      el.cartMinProgress.className = "cart-min-progress ok";
      el.cartMinProgress.textContent = `✓ Mínimo completo (${pooled} perfumes)`;
    } else {
      el.cartMinProgress.className = "cart-min-progress";
      el.cartMinProgress.textContent = `Llevas ${pooled} de ${WHOLESALE_MIN_TOTAL} perfumes mínimos — agrega ${WHOLESALE_MIN_TOTAL - pooled} más (puedes combinar perfumes distintos; las cajas no cuentan). Los datos de pago se muestran cuando completes el mínimo.`;
    }

    el.cartTotal.textContent = money(cartTotal());
    const faltan = minimoFaltante();                                   // sin el mínimo no se puede continuar ni se ven los datos de pago
    el.checkoutBtn.disabled = faltan > 0;
    el.checkoutBtn.textContent = faltan > 0 ? `Agrega ${faltan} ${faltan === 1 ? "perfume más" : "perfumes más"} para continuar` : "Continuar pedido";
  }

  el.cartItems.addEventListener("click", e => {
    const minusId = e.target.closest("[data-cart-minus]")?.dataset.cartMinus;
    const plusId = e.target.closest("[data-cart-plus]")?.dataset.cartPlus;
    const cart = loadCart();
    if (minusId) setCartQty(minusId, (cart[cartKey(minusId)] || 0) - 1);
    if (plusId) setCartQty(plusId, (cart[cartKey(plusId)] || 0) + 1);
  });

  function openCart() {
    renderCartPanel();
    el.cartOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    el.cartOverlay.hidden = true;
    document.body.style.overflow = "";
  }
  el.cartBtn.addEventListener("click", openCart);
  el.cartClose.addEventListener("click", closeCart);
  el.cartOverlay.addEventListener("click", e => { if (e.target === el.cartOverlay) closeCart(); });

  /* ---------------------------------------------------------------
     Favoritos (localStorage)
     --------------------------------------------------------------- */
  const FAV_KEY = "mpv_favorites_v1";
  function loadFavorites() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; }
  }
  function isFavorite(id) { return loadFavorites().includes(String(id)); }
  function toggleFavorite(id) {
    let favs = loadFavorites();
    const key = String(id);
    if (favs.includes(key)) favs = favs.filter(f => f !== key);
    else favs.push(key);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {}
    return favs.includes(key);
  }

  /* ---------------------------------------------------------------
     Modo de precio (Detal / Mayor)
     --------------------------------------------------------------- */
  // (Ya no hay alternar Detal/Mayor — este negocio maneja un solo precio)

  /* ---------------------------------------------------------------
     Marquee de marcas
     --------------------------------------------------------------- */
  /* Categorías: orden fijo y nombres cortos (Dama · Caballero · Unisex · Cajas) */
  const CAT_ORDER = ["Perfumes Femeninos", "Perfumes Masculinos", "Unisex", "Cajas / Combos"];
  const CAT_LABEL = { "Perfumes Femeninos": "Dama", "Perfumes Masculinos": "Caballero", "Unisex": "Unisex", "Cajas / Combos": "Cajas" };
  const CAT_SUB = { "Perfumes Femeninos": "Perfumes femeninos", "Perfumes Masculinos": "Perfumes masculinos", "Unisex": "Para todos", "Cajas / Combos": "Combos y cajas" };
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function catLabel(c) { return CAT_LABEL[c] || c; }
  function orderedCategories() {
    const present = new Set(PRODUCTS.map(p => p.category).filter(Boolean));
    const known = CAT_ORDER.filter(c => present.has(c));
    const extra = Array.from(present).filter(c => !CAT_ORDER.includes(c)).sort((a, b) => a.localeCompare(b, "es"));
    return [...known, ...extra];
  }

  // Un solo lugar para "ir a una categoría": lo usan la barra, la cinta, las
  // casillas del espacio de banner y los banners con clic.
  function goCategory(cat) {
    state.category = cat || "Todas";
    state.brand = "";
    el.brandSelect.value = "";
    renderCategoryChips();
    render();
    el.productGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function goHome() {
    state.query = "";
    el.searchInput.value = "";
    el.searchClear.hidden = true;
    state.category = "Todas";
    state.brand = "";
    el.brandSelect.value = "";
    renderCategoryChips();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* Cinta superior en movimiento */
  function renderMarquee() {
    const cats = orderedCategories();
    if (!cats.length) { el.marqueeTrack.innerHTML = ""; return; }
    const half = Array.from({ length: 6 }, () => cats).flat();   // 6 vueltas por mitad: nunca quedan huecos
    el.marqueeTrack.innerHTML = [...half, ...half]
      .map(c => `<button type="button" data-marquee-category="${esc(c)}">${esc(catLabel(c))}</button>`).join("");
  }
  el.marqueeTrack.addEventListener("click", e => {
    const btn = e.target.closest("[data-marquee-category]");
    if (btn) goCategory(btn.dataset.marqueeCategory);
  });

  /* Barra de categorías (bajo el encabezado) */
  function renderCategoryNav() {
    const nav = document.getElementById("categoryNav");
    if (!nav) return;
    nav.innerHTML = `<button type="button" data-nav-cat="__home">Inicio</button>` +
      orderedCategories().map(c => `<button type="button" data-nav-cat="${esc(c)}">${esc(catLabel(c))}</button>`).join("");
    syncCategoryNav();
  }
  function syncCategoryNav() {
    const nav = document.getElementById("categoryNav");
    if (!nav) return;
    nav.querySelectorAll("[data-nav-cat]").forEach(b => {
      const c = b.dataset.navCat;
      b.classList.toggle("active", c === "__home" ? state.category === "Todas" && !state.brand && !state.query : c === state.category);
    });
  }
  document.getElementById("categoryNav")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-nav-cat]");
    if (!btn) return;
    if (btn.dataset.navCat === "__home") goHome();
    else goCategory(btn.dataset.navCat);
  });

  /* Espacio de banner por defecto: casillas grandes con clic a cada categoría
     (se oculta solo cuando cargas banners propios en el admin) */
  function renderCategoryTiles() {
    const box = document.getElementById("categoryTiles");
    if (!box) return;
    const counts = {};
    PRODUCTS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    box.innerHTML = orderedCategories().map(c =>
      `<button type="button" class="cat-tile" data-tile-cat="${esc(c)}"><span class="t-name">${esc(catLabel(c))}</span><span class="t-sub">${esc(CAT_SUB[c] || "Ver productos")} · ${counts[c]}</span></button>`
    ).join("");
    syncBannerArea();
  }
  function syncBannerArea() {
    const box = document.getElementById("categoryTiles");
    if (box) box.hidden = banners.length > 0 || !box.children.length;
  }
  document.getElementById("categoryTiles")?.addEventListener("click", e => {
    const t = e.target.closest("[data-tile-cat]");
    if (t) goCategory(t.dataset.tileCat);
  });

  // Si el link trae ?categoria=Perfumes%20Femeninos, abre directo en esa categoría
  function applyCategoryFromURL() {
    const wanted = (new URLSearchParams(window.location.search).get("categoria") || "").trim().toLowerCase();
    if (!wanted) return;
    const match = orderedCategories().find(c => c.toLowerCase() === wanted || catLabel(c).toLowerCase() === wanted);
    if (match) state.category = match;
  }

  // Flechas de "ver anteriores/siguientes" en carruseles horizontales
  document.addEventListener("click", e => {
    const btn = e.target.closest(".scroll-arrow");
    if (!btn) return;
    const wrap = btn.closest(".featured-scroll-wrap");
    const scrollEl = wrap && wrap.querySelector(".featured-scroll");
    if (!scrollEl) return;
    const amount = scrollEl.clientWidth * 0.85;
    scrollEl.scrollBy({ left: btn.classList.contains("next") ? amount : -amount, behavior: "smooth" });
  });

  /* ---------------------------------------------------------------
     Banners
     --------------------------------------------------------------- */
  let bannerIndex = 0;
  let banners = [];
  function renderBanners(data) {
    banners = data || [];
    if (!banners.length) { el.bannerCarousel.hidden = true; syncBannerArea(); return; }
    el.bannerCarousel.hidden = false;
    el.bannerTrack.innerHTML = banners.map((b, i) => {
      const hasText = !!((b.title || "").trim() || (b.subtitle || "").trim());
      const link = (b.link_url || "").trim();
      const linkAttrs = link ? ` data-link="${esc(link)}" role="link" tabindex="0"` : "";
      const label = esc((b.title || "").trim() || "Banner");
      const desktop = b.image || "", mobile = (b.image_mobile || "").trim();
      const hasMobile = !!mobile;

      // Banner con texto propio: foto de fondo + velo suave + título/botón
      if (hasText) {
        const showBtn = !!link;
        return `
        <div class="banner-slide has-text${link ? " is-link" : ""}${hasMobile ? " has-mobile" : ""}" style="--bg:url('${esc(desktop)}');${hasMobile ? `--bg-m:url('${esc(mobile)}');` : ""}"${linkAttrs}>
          <div class="banner-slide-content">
            ${b.title ? `<h3>${esc(b.title)}</h3>` : ""}
            ${b.subtitle ? `<p>${esc(b.subtitle)}</p>` : ""}
            ${showBtn ? `<span class="banner-btn">${esc(b.button_text || "Ver más")}</span>` : ""}
          </div>
        </div>`;
      }

      // Banner solo imagen (la imagen ya trae su texto): se ve completo, sin velo ni recortes.
      // Si subiste una imagen especial para celular, el celular usa esa.
      const load = i === 0 ? 'fetchpriority="high"' : 'loading="lazy"';
      const pic = (cls, alt, extra) => `<picture class="banner-pic ${cls}">${hasMobile ? `<source media="(max-width:640px)" srcset="${esc(mobile)}">` : ""}<img class="${cls === "bg" ? "banner-bg" : "banner-img"}" src="${esc(desktop)}" alt="${alt}" ${extra} ${load}></picture>`;
      return `
      <div class="banner-slide image-only${hasMobile ? " has-mobile" : ""}${link ? " is-link" : ""}"${linkAttrs} aria-label="${label}">
        ${pic("bg", "", 'aria-hidden="true"')}
        ${pic("fg", label, "")}
      </div>`;
    }).join("");
    el.bannerDots.innerHTML = banners.map((_, i) => `<button data-dot="${i}" class="${i === 0 ? 'active' : ''}"></button>`).join("");
    updateBannerPosition();
    syncBannerArea();
    startBannerAuto();
  }
  function openBannerLink(link) {
    if (link.startsWith("categoria:")) { goCategory(link.slice(10).trim()); return; }
    if (/^https?:\/\//i.test(link) && !link.startsWith(window.location.origin)) window.open(link, "_blank", "noopener");
    else window.location.href = link;
  }
  el.bannerTrack.addEventListener("click", e => {
    const s = e.target.closest("[data-link]");
    if (s) openBannerLink(s.dataset.link);
  });
  el.bannerTrack.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const s = e.target.closest("[data-link]");
    if (s) openBannerLink(s.dataset.link);
  });
  function updateBannerPosition() {
    el.bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;
    el.bannerDots.querySelectorAll("button").forEach((d, i) => d.classList.toggle("active", i === bannerIndex));
  }
  // Avance automático cada 6 s (se pausa al pasar el mouse o tocar) + deslizar con el dedo
  let bannerTimer = null;
  function stopBannerAuto() { if (bannerTimer) { clearInterval(bannerTimer); bannerTimer = null; } }
  function startBannerAuto() {
    stopBannerAuto();
    if (banners.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    bannerTimer = setInterval(() => {
      bannerIndex = (bannerIndex + 1) % banners.length;
      updateBannerPosition();
    }, 6000);
  }
  el.bannerCarousel.addEventListener("mouseenter", stopBannerAuto);
  el.bannerCarousel.addEventListener("mouseleave", startBannerAuto);
  document.addEventListener("visibilitychange", () => (document.hidden ? stopBannerAuto() : startBannerAuto()));
  let bannerTouchX = null;
  el.bannerCarousel.addEventListener("touchstart", e => { bannerTouchX = e.touches[0].clientX; stopBannerAuto(); }, { passive: true });
  el.bannerCarousel.addEventListener("touchend", e => {
    if (bannerTouchX !== null) {
      const dx = e.changedTouches[0].clientX - bannerTouchX;
      if (Math.abs(dx) > 40 && banners.length > 1) {
        bannerIndex = (bannerIndex + (dx < 0 ? 1 : -1) + banners.length) % banners.length;
        updateBannerPosition();
      }
      bannerTouchX = null;
    }
    startBannerAuto();
  }, { passive: true });

  el.bannerPrev.addEventListener("click", () => {
    bannerIndex = (bannerIndex - 1 + banners.length) % banners.length;
    updateBannerPosition();
  });
  el.bannerNext.addEventListener("click", () => {
    bannerIndex = (bannerIndex + 1) % banners.length;
    updateBannerPosition();
  });
  el.bannerDots.addEventListener("click", e => {
    const btn = e.target.closest("[data-dot]");
    if (!btn) return;
    bannerIndex = Number(btn.dataset.dot);
    updateBannerPosition();
  });

  /* ---------------------------------------------------------------
     Tarjeta de producto (reutilizable)
     --------------------------------------------------------------- */
  function cardTemplate(p) {
    const avail = isEffectivelyAvailable(p);
    const price = p.offer || p.mayor || 0;
    const showOld = p.offer && p.offer < p.mayor;
    const minQty = p.min_qty || 12;
    const stamp = !avail ? `<span class="stamp-agotado">Agotado</span>` : "";
    const badge = p.featured ? `<span class="card-badge">Destacado</span>` : "";
    const minQtyNote = minQty > 1 ? `<p class="card-min-qty">Cuenta para tu surtido mínimo</p>` : "";
    const quickAdd = avail
      ? `<button class="card-quickadd" data-quickadd="${p.id}" data-quickadd-qty="1" aria-label="Agregar al carrito">+</button>`
      : "";
    return `
      <article class="card" data-id="${p.id}">
        <div class="card-media">
          <img src="${p.image || ''}" alt="${p.name}" loading="lazy">
          <button class="card-fav ${isFavorite(p.id) ? 'active' : ''}" data-fav-id="${p.id}" aria-label="Favorito">♥</button>
          ${badge}
          ${stamp}
          ${quickAdd}
        </div>
        <div class="card-body">
          <p class="card-brand">${p.brand || ""}</p>
          <p class="card-name">${p.name}</p>
          <p class="card-ref">${p.ref ? "Ref: " + p.ref : ""}</p>
          ${minQtyNote}
          <div class="card-price-row">
            <span class="card-price">${money(price)}</span>
            ${showOld ? `<span class="card-price-old">${money(p.mayor)}</span>` : ""}
          </div>
        </div>
      </article>
    `;
  }

  function attachCardListeners(container) {
    container.querySelectorAll("[data-id]").forEach(card => {
      card.addEventListener("click", e => {
        if (e.target.closest("[data-fav-id]") || e.target.closest("[data-quickadd]")) return;
        const p = PRODUCTS.find(pp => String(pp.id) === card.dataset.id);
        if (p) openModal(p);
      });
    });
    container.querySelectorAll("[data-fav-id]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const nowFav = toggleFavorite(btn.dataset.favId);
        btn.classList.toggle("active", nowFav);
      });
    });
    container.querySelectorAll("[data-quickadd]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const qty = parseInt(btn.dataset.quickaddQty, 10) || 1;
        addToCart(btn.dataset.quickadd, qty);
        btn.textContent = "✓";
        setTimeout(() => { btn.textContent = "+"; }, 900);
      });
    });
  }

  /* ---------------------------------------------------------------
     Destacados
     --------------------------------------------------------------- */
  function renderFeatured() {
    const featured = PRODUCTS.filter(p => isEffectivelyAvailable(p) && p.featured);
    if (!featured.length) { el.featuredSection.hidden = true; return; }
    el.featuredSection.hidden = false;
    el.featuredScroll.innerHTML = featured.map(p => cardTemplate(p)).join("");
    attachCardListeners(el.featuredScroll);
  }

  /* ---------------------------------------------------------------
     Filtros (categorías, marcas, orden)
     --------------------------------------------------------------- */
  function renderCategoryChips() {
    const all = ["Todas", ...orderedCategories()];
    el.categoryChips.innerHTML = all.map(c => `<button data-cat="${esc(c)}" class="${c === state.category ? 'active' : ''}">${c === 'Todas' ? 'Ver Todos' : esc(catLabel(c))}</button>`).join("");
  }
  el.categoryChips.addEventListener("click", e => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    renderCategoryChips();
    render();
  });

  function renderBrandOptions() {
    const brands = Array.from(new Set(PRODUCTS.map(p => p.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b, "es"));
    el.brandSelect.innerHTML = `<option value="">Todas las marcas</option>` + brands.map(b => `<option value="${b}">${b}</option>`).join("");
  }
  el.brandSelect.addEventListener("change", () => { state.brand = el.brandSelect.value; render(); });
  el.sortSelect.addEventListener("change", () => { state.sort = el.sortSelect.value; render(); });

  el.searchInput.addEventListener("input", () => {
    state.query = el.searchInput.value;
    el.searchClear.hidden = !state.query;
    render();
  });
  el.searchClear.addEventListener("click", () => {
    el.searchInput.value = "";
    state.query = "";
    el.searchClear.hidden = true;
    render();
  });

  /* ---------------------------------------------------------------
     Filtrado + orden + render principal
     --------------------------------------------------------------- */
  function getFilteredProducts() {
    const q = normalize(state.query);
    let list = PRODUCTS.filter(p => {
      if (state.category !== "Todas" && p.category !== state.category) return false;
      if (state.brand && p.brand !== state.brand) return false;
      if (q) {
        const haystack = normalize(`${p.name} ${p.brand} ${p.category} ${p.ref}`);
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    switch (state.sort) {
      case "price-asc": list = list.slice().sort((a, b) => (a.mayor || 0) - (b.mayor || 0)); break;
      case "price-desc": list = list.slice().sort((a, b) => (b.mayor || 0) - (a.mayor || 0)); break;
      case "name-asc": list = list.slice().sort((a, b) => a.name.localeCompare(b.name, "es")); break;
    }

    list = list.map((p, i) => ({ p, i })).sort((a, b) => {
      const diff = (isEffectivelyAvailable(b.p) ? 1 : 0) - (isEffectivelyAvailable(a.p) ? 1 : 0);
      return diff !== 0 ? diff : a.i - b.i;
    }).map(x => x.p);

    return list;
  }

  function render() {
    syncCategoryNav();
    const list = getFilteredProducts();
    el.resultsCount.textContent = `Mostrando ${list.length} de ${PRODUCTS.length} productos`;
    if (!list.length) {
      el.productGrid.innerHTML = "";
      el.emptyState.hidden = false;
      return;
    }
    el.emptyState.hidden = true;
    el.productGrid.innerHTML = list.map(p => cardTemplate(p)).join("");
    attachCardListeners(el.productGrid);
  }

  /* ---------------------------------------------------------------
     Modal de vista rápida
     --------------------------------------------------------------- */
  function openModal(p) {
    currentModalProduct = p;
    modalMinQty = p.min_qty || 12;
    modalQtyValue = 1;
    const avail = isEffectivelyAvailable(p);
    const price = p.offer || p.mayor || 0;
    const showOld = p.offer && p.offer < p.mayor;

    el.modalImage.src = p.image || "";
    el.modalImage.alt = p.name;
    el.modalStamp.hidden = avail;
    el.modalBrand.textContent = p.brand || "";
    el.modalName.textContent = p.name;
    el.modalRef.textContent = p.ref ? "Ref: " + p.ref : "";
    el.modalPrice.textContent = money(price);
    el.modalPriceOld.hidden = !showOld;
    el.modalPriceOld.textContent = showOld ? money(p.mayor) : "";
    el.modalQty.textContent = modalQtyValue;
    el.modalMinQtyNote.hidden = modalMinQty <= 1;
    el.modalMinQtyNote.textContent = modalMinQty > 1 ? "Perfumes sueltos: mínimo 12 en total — puedes combinar cualquier referencia" : "";
    const detail = (p.note || "").trim();
    el.modalDescription.hidden = !detail;
    el.modalDescriptionText.textContent = detail;
    const modalBodyEl = el.modalDescription.closest(".modal-body");
    if (modalBodyEl) modalBodyEl.scrollTop = 0;
    el.modalAddCart.disabled = !avail;
    el.modalAddCart.textContent = avail ? "Agregar al carrito" : "Agotado";

    el.modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    el.modalOverlay.hidden = true;
    document.body.style.overflow = "";
  }
  el.modalClose.addEventListener("click", closeModal);
  el.modalOverlay.addEventListener("click", e => { if (e.target === el.modalOverlay) closeModal(); });
  el.modalQtyMinus.addEventListener("click", () => { if (modalQtyValue > 1) { modalQtyValue--; el.modalQty.textContent = modalQtyValue; } });
  el.modalQtyPlus.addEventListener("click", () => { modalQtyValue++; el.modalQty.textContent = modalQtyValue; });
  el.modalAddCart.addEventListener("click", () => {
    if (!currentModalProduct) return;
    addToCart(currentModalProduct.id, modalQtyValue);
    closeModal();
    openCart();
  });

  /* ---------------------------------------------------------------
     Checkout
     --------------------------------------------------------------- */
  const ONLINE_PAYMENTS = ["Pago móvil", "Binance", "Zelle"];

  /* Comprobante de pago (foto opcional): se reduce y se sube a una carpeta PRIVADA; solo la asesora del pedido la ve */
  async function compressProof(file) {
    const bmp = await createImageBitmap(file);                 // si el formato no es compatible (ej. HEIC), falla aquí
    const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * s)), h = Math.max(1, Math.round(bmp.height * s));
    const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); ctx.drawImage(bmp, 0, 0, w, h);
    if (bmp.close) bmp.close();
    let blob = await new Promise(res => canvas.toBlob(res, "image/webp", 0.8));
    if (!blob || blob.type !== "image/webp") blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", 0.82));
    return blob;
  }
  async function uploadPaymentProof(file) {
    const blob = await compressProof(file);
    if (!blob || blob.size > 5 * 1024 * 1024) throw new Error("foto muy pesada");
    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    const rnd = () => Math.floor(Math.random() * 1e9).toString(36);
    const path = `proofs/${Date.now()}-${rnd()}-${rnd()}.${ext}`;
    const { error } = await supabaseClient.storage.from("payment-proofs").upload(path, blob, { upsert: false, contentType: blob.type, cacheControl: "3600" });
    if (error) throw error;
    return path;
  }

  /* Conversión a bolívares: total en $ × la tasa que se guarda en Ajustes (misma lógica que Shopicol) */
  function exchangeRate() { return Number(siteSettings && siteSettings.exchange_rate) || 0; }
  function formatBs(amountUsd) {
    const rate = exchangeRate();
    if (!rate || !amountUsd) return null;
    return "Bs " + (amountUsd * rate).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function updatePaymentDetailsBox() {
    const val = el.custPayment.value;
    const s = siteSettings || {};
    if (!cumpleMinimo()) {                                          // red de seguridad: nunca mostrar datos de pago con un pedido incompleto
      const faltan = minimoFaltante();
      el.paymentDetailsBox.innerHTML = `<span class="pay-locked">🔒 Los datos de pago se muestran cuando tu pedido cumple el mínimo${faltan ? `: te faltan ${faltan} ${faltan === 1 ? "perfume" : "perfumes"} (mínimo ${WHOLESALE_MIN_TOTAL})` : ""}. Vuelve al carrito para completarlo.</span>`;
      el.paymentDetailsBox.hidden = !ONLINE_PAYMENTS.includes(val);
      el.payRefWrap.hidden = true; el.custPayRef.required = false; el.payProofWrap.hidden = true;
      el.payLaterNote.hidden = !(val === "Pagar después" || val === "Efectivo");
      return;
    }
    const totalUsd = cartTotal();
    let html = "";
    if (val === "Pago móvil") {
      const bs = formatBs(totalUsd);
      html = `<strong>Datos para Pago Móvil</strong>
        <span>Teléfono: <b>${s.pago_movil_phone || "—"}</b></span>
        <span>Cédula/RIF: <b>${s.pago_movil_cedula || "—"}</b></span>
        <span>Banco: <b>${s.pago_movil_bank || "—"}</b></span>
        <span class="payment-amount-due">A pagar: <b>${bs || "(te confirmamos el monto por WhatsApp)"}</b></span>
        ${bs ? `<span class="payment-amount-hint">${money(totalUsd)} × tasa ${exchangeRate().toLocaleString("es-VE")}</span>` : ""}`;
    } else if (val === "Binance") {
      html = `<strong>Datos para Binance</strong>
        <span>ID de Binance: <b>${s.binance_id || "—"}</b></span>
        <span class="payment-amount-due">A pagar: <b>${money(totalUsd)}</b></span>`;
    } else if (val === "Zelle") {
      html = `<strong>Datos para Zelle</strong>
        <span>Correo: <b>${s.zelle_email || "—"}</b></span>
        ${s.zelle_holder_name ? `<span>Titular: <b>${s.zelle_holder_name}</b></span>` : ""}
        <span class="payment-amount-due">A pagar: <b>${money(totalUsd)}</b></span>`;
    }
    if (html && ["Pago móvil", "Binance", "Zelle"].includes(val)) html += PAGO_PROTEGIDO_HTML;
    if (html) { el.paymentDetailsBox.innerHTML = html; el.paymentDetailsBox.hidden = false; }
    else el.paymentDetailsBox.hidden = true;

    // Pago por Pago móvil / Binance / Zelle: pide la referencia. Efectivo o "Pagar después": avisa que pagar antes agiliza el pedido.
    const online = ONLINE_PAYMENTS.includes(val);
    el.payRefWrap.hidden = !online;
    el.custPayRef.required = online;
    if (!online) el.custPayRef.value = "";
    el.payProofWrap.hidden = !online;                 // foto del comprobante: opcional, solo con pagos en línea
    if (!online) el.custPayProof.value = "";
    el.payLaterNote.hidden = !(val === "Pagar después" || val === "Efectivo");
  }
  el.custPayment.addEventListener("change", () => {
    updatePaymentDetailsBox();
    if (el.custPayment.value === "Pagar después") el.payLaterOverlay.hidden = false;
  });
  el.payLaterOk.addEventListener("click", () => { el.payLaterOverlay.hidden = true; });
  el.payLaterNow.addEventListener("click", () => {
    el.payLaterOverlay.hidden = true;
    el.custPayment.value = "";                       // vuelve a elegir un método de pago
    updatePaymentDetailsBox();
    el.custPayment.focus();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !el.payLaterOverlay.hidden) el.payLaterOverlay.hidden = true; });

  el.custDelivery.addEventListener("change", () => {
    const val = el.custDelivery.value;
    el.addressField.hidden = val !== "Delivery";
    el.custAddress.required = val === "Delivery";
  });

  /* ---------------------------------------------------------------
     Asesora preferida: llega por el link personal (?asesora=dary) o es la última
     que el cliente eligió. Así el pedido le llega a ella sin que el cliente tenga que acordarse.
     --------------------------------------------------------------- */
  const ADVISOR_PREF_KEY = "mpv_advisor_pref";
  const slugify = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const readAdvisorPref = () => { try { return localStorage.getItem(ADVISOR_PREF_KEY) || ""; } catch (e) { return ""; } };
  const saveAdvisorPref = slug => { try { if (slug) localStorage.setItem(ADVISOR_PREF_KEY, slug); } catch (e) {} };
  const clearAdvisorPref = () => { try { localStorage.removeItem(ADVISOR_PREF_KEY); } catch (e) {} };
  /* Link VIP de Gerencia (…/?vip=CÓDIGO): lleva a una asesora OCULTA que no sale en ninguna lista. El código se guarda aparte. */
  const VIP_TOKEN_KEY = "mpv_vip_token";
  const readVipToken = () => { try { return localStorage.getItem(VIP_TOKEN_KEY) || ""; } catch (e) { return ""; } };
  const saveVipToken = t => { try { if (t) localStorage.setItem(VIP_TOKEN_KEY, t); } catch (e) {} };
  const clearVipToken = () => { try { localStorage.removeItem(VIP_TOKEN_KEY); } catch (e) {} };
  let preferredAdvisor = null;
  let prefFromLink = false;       // true solo si el cliente entró AHORA por un link personal
  let advisorHow = "";            // cómo quedó asignada: link · recordada · elegida · turno

  function captureAdvisorFromURL() {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = (params.get("vip") || "").trim();
      if (/^[A-Za-z0-9]{20,64}$/.test(token)) {                 // link VIP: manda sobre lo recordado
        saveVipToken(token); clearAdvisorPref(); prefFromLink = true;
        params.delete("vip"); const q = params.toString();      // el código no queda a la vista en la barra de direcciones
        history.replaceState(null, "", window.location.pathname + (q ? "?" + q : "") + window.location.hash);
        return;
      }
      const v = slugify(params.get("asesora"));
      if (v) { saveAdvisorPref(v); clearVipToken(); prefFromLink = true; }     // el link manda sobre lo recordado
    } catch (e) {}
  }
  function showAdvisorPill(a) {
    if (!a) { el.advisorPillWrap.hidden = true; el.advisorPillWrap.innerHTML = ""; return; }
    const photo = a.image ? `<img src="${a.image}" alt="" class="advisor-pill-photo">` : `<span class="advisor-pill-photo advisor-pill-ph">${(a.name || "?").charAt(0)}</span>`;
    el.advisorPillWrap.innerHTML = `<div class="advisor-pill">${photo}<span>Te atiende: <b>${a.name}</b></span><button type="button" class="advisor-pill-x" data-forget-advisor aria-label="Quitar asesora" title="Quitar">×</button></div>`;
    el.advisorPillWrap.hidden = false;
  }
  el.advisorPillWrap.addEventListener("click", e => {
    if (!e.target.closest("[data-forget-advisor]")) return;
    clearAdvisorPref(); clearVipToken(); preferredAdvisor = null; showAdvisorPill(null);
  });
  async function loadAdvisorPreference() {
    const vip = readVipToken();
    if (vip) {                                          // la asesora oculta solo se resuelve con su código exacto
      try {
        const { data, error } = await supabaseClient.rpc("vip_advisor", { p_token: vip });
        const a = !error && Array.isArray(data) ? data[0] : null;
        if (a) { preferredAdvisor = a; showAdvisorPill(a); return; }
        if (!error) { clearVipToken(); prefFromLink = false; }   // link renovado o asesora desactivada: se olvida
      } catch (e) { /* sin el SQL o sin red: la tienda sigue normal */ }
    }
    const slug = readAdvisorPref();
    if (!slug) return;
    const advisors = await fetchAdvisors();
    const a = advisors.find(x => slugify(x.name) === slug || String(x.id) === slug);
    if (!a) return;                                     // asesora inactiva o link viejo: se ignora
    preferredAdvisor = a;
    showAdvisorPill(a);
  }

  let chosenAdvisor = null; // { id, name, phone }

  function openCheckout() {
    if (!cumpleMinimo()) { renderCartPanel(); return; }          // sin el mínimo no se abre el pedido (ni se ven los datos de pago)
    closeCart();
    chosenAdvisor = null;
    el.advisorStep.hidden = false;
    el.advisorList.hidden = true;
    el.advisorList.innerHTML = "";
    el.advisorChosenTag.hidden = true;
    el.checkoutForm.hidden = true;
    el.checkoutSuccess.hidden = true;
    el.checkoutError.hidden = true;
    el.checkoutOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    el.advisorConfirm.hidden = true; el.advisorAsk.hidden = false; setSubmitLabel();
    if (preferredAdvisor) {
      if (prefFromLink) selectAdvisor(preferredAdvisor, "link");      // entró por el link de ella: se respeta, sin preguntar
      else {                                                           // la tienda solo la RECUERDA: se pide confirmar
        el.advisorConfirmName.textContent = preferredAdvisor.name;
        el.advisorConfirmYes.textContent = `Sí, con ${preferredAdvisor.name}`;
        el.advisorConfirm.hidden = false; el.advisorAsk.hidden = true;
      }
    }
  }
  el.advisorConfirmYes.addEventListener("click", () => { if (preferredAdvisor) selectAdvisor(preferredAdvisor, "recordada"); });
  el.advisorConfirmOther.addEventListener("click", () => { el.advisorConfirm.hidden = true; el.advisorAsk.hidden = false; });
  function closeCheckout() {
    el.checkoutOverlay.hidden = true;
    document.body.style.overflow = "";
  }
  el.checkoutBtn.addEventListener("click", openCheckout);

  function setSubmitLabel() {          // el botón dice a QUIÉN va el pedido
    el.submitOrderBtn.textContent = chosenAdvisor ? `Enviar pedido a ${chosenAdvisor.name} por WhatsApp` : "Enviar pedido por WhatsApp";
  }
  function selectAdvisor(advisor, how) {
    chosenAdvisor = advisor; advisorHow = how || "elegida"; setSubmitLabel();
    saveAdvisorPref(slugify(advisor.name)); preferredAdvisor = advisor; showAdvisorPill(advisor);
    el.advisorStep.hidden = true;
    el.checkoutForm.hidden = false;
    el.advisorChosenTag.hidden = false;
    const photo = advisor.image
      ? `<img src="${advisor.image}" alt="" class="advisor-tag-photo">`
      : `<span class="advisor-tag-photo advisor-tag-photo-placeholder">${(advisor.name || "?").charAt(0)}</span>`;
    el.advisorChosenTag.innerHTML = `${photo}<span>Te atiende: ${advisor.name}</span><button type="button" class="advisor-change" data-change-advisor>Cambiar</button>`;
  }
  el.advisorChosenTag.addEventListener("click", e => {
    if (!e.target.closest("[data-change-advisor]")) return;
    chosenAdvisor = null; advisorHow = ""; setSubmitLabel();
    el.advisorChosenTag.hidden = true; el.checkoutForm.hidden = true;
    el.advisorStep.hidden = false; el.advisorList.hidden = true;
    el.advisorConfirm.hidden = true; el.advisorAsk.hidden = false;
  });

  el.advisorYesBtn.addEventListener("click", async () => {
    el.advisorYesBtn.disabled = true;
    el.advisorYesBtn.textContent = "Cargando…";
    const advisors = await fetchAdvisors();
    el.advisorYesBtn.disabled = false;
    el.advisorYesBtn.textContent = "Sí, ya tengo una";
    if (!advisors.length) return;
    el.advisorList.innerHTML = advisors.map(a => `
      <button type="button" data-advisor-id="${a.id}">
        ${a.image ? `<img src="${a.image}" alt="" class="advisor-btn-photo">` : `<span class="advisor-btn-photo advisor-btn-photo-placeholder">${(a.name || "?").charAt(0)}</span>`}
        <span>${a.name}</span>
      </button>
    `).join("");
    el.advisorList.hidden = false;
    el.advisorList.dataset.advisors = JSON.stringify(advisors);
  });

  el.advisorList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-advisor-id]");
    if (!btn) return;
    const advisors = JSON.parse(el.advisorList.dataset.advisors || "[]");
    const advisor = advisors.find(a => String(a.id) === btn.dataset.advisorId);
    if (advisor) selectAdvisor(advisor, "elegida");
  });

  el.advisorNoBtn.addEventListener("click", async () => {
    el.advisorNoBtn.disabled = true;
    el.advisorNoBtn.textContent = "Asignando…";
    const advisor = await getNextAdvisor();
    el.advisorNoBtn.disabled = false;
    el.advisorNoBtn.textContent = "No, asígname una";
    if (advisor) selectAdvisor(advisor, "turno");
    else el.checkoutError.textContent = "No se pudo asignar una asesora. Intenta de nuevo.", (el.checkoutError.hidden = false);
  });

  el.checkoutClose.addEventListener("click", closeCheckout);
  el.closeSuccessBtn.addEventListener("click", closeCheckout);

  el.checkoutForm.addEventListener("submit", async e => {
    e.preventDefault();
    el.checkoutError.hidden = true;
    await settingsReady;                              // la tasa del dólar siempre fresca antes de calcular el pedido
    {
      const v = validarCedula(el.custCedulaNum.value);
      if (!v.ok) { el.checkoutError.textContent = v.msg; el.checkoutError.hidden = false; el.custCedulaNum.focus(); return; }
    }

    if (!chosenAdvisor) {
      el.checkoutError.textContent = "Por favor selecciona o pide que te asignen una asesora primero.";
      el.checkoutError.hidden = false;
      return;
    }

    if (el.custDelivery.value === "Delivery" && !el.custAddress.value.trim()) {
      el.checkoutError.textContent = "Por favor escribe tu dirección de entrega.";
      el.checkoutError.hidden = false;
      return;
    }

    const cart = loadCart();
    const entries = Object.entries(cart);
    if (!entries.length) {
      el.checkoutError.textContent = "Tu carrito está vacío.";
      el.checkoutError.hidden = false;
      return;
    }

    if (ONLINE_PAYMENTS.includes(el.custPayment.value) && !el.custPayRef.value.trim()) {
      el.checkoutError.textContent = "Escribe el número de referencia de tu pago (o elige «Pagar después»).";
      el.checkoutError.hidden = false;
      return;
    }

    const pooled = pooledQty();
    if (pooled > 0 && pooled < WHOLESALE_MIN_TOTAL) {      // solo aplica si hay perfumes sueltos; las cajas van por unidad
      el.checkoutError.textContent = `Te faltan ${WHOLESALE_MIN_TOTAL - pooled} perfumes para completar el mínimo de ${WHOLESALE_MIN_TOTAL} (puedes combinar varios perfumes distintos; las cajas no cuentan para el mínimo).`;
      el.checkoutError.hidden = false;
      return;
    }

    el.submitOrderBtn.disabled = true;
    el.submitOrderBtn.textContent = "Enviando…";

    const items = entries.map(([key, qty]) => {
      const { id } = parseCartKey(key);
      const p = PRODUCTS.find(pp => String(pp.id) === String(id));
      if (!p) return null;
      const price = p.offer || p.mayor || 0;
      return { id: p.id, name: p.name, qty, price };
    }).filter(Boolean);

    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const total = subtotal;

    // Comprobante (opcional): si no se puede subir, el pedido sigue y el cliente lo manda por WhatsApp
    let proofPath = "", proofFailed = false;
    const proofFile = el.custPayProof.files && el.custPayProof.files[0];
    if (proofFile && ONLINE_PAYMENTS.includes(el.custPayment.value)) {
      el.submitOrderBtn.textContent = "Subiendo comprobante…";
      try { proofPath = await uploadPaymentProof(proofFile); }
      catch (e) { proofFailed = true; }
      el.submitOrderBtn.textContent = "Enviando…";
    }

    const order = {
      customer_name: el.custName.value.trim(),
      customer_cedula: soloNumeros(el.custCedulaNum.value),
      phone: el.custPhone.value.trim(),
      city: el.custCity.value.trim(),
      email: el.custEmail.value.trim(),
      delivery_method: el.custDelivery.value,
      address: el.custAddress.value.trim(),
      payment_method: el.custPayment.value,
      payment_reference: ONLINE_PAYMENTS.includes(el.custPayment.value) ? el.custPayRef.value.trim() : "",
      payment_status: ONLINE_PAYMENTS.includes(el.custPayment.value) ? "por_verificar" : "pendiente",
      payment_proof_path: proofPath,
      hide_from_feed: !!el.custHideName.checked,
      exchange_rate: exchangeRate(),
      total_bs: el.custPayment.value === "Pago móvil" ? Math.round(total * exchangeRate() * 100) / 100 : 0,
      items,
      subtotal,
      discount: 0,
      total,
      status: "nuevo",
      advisor_name: chosenAdvisor ? chosenAdvisor.name : "",
      assigned_by: advisorHow,
      advisor_phone: chosenAdvisor ? chosenAdvisor.phone : "",
    };

    try {
      await createOrder(order);

      const lines = [];
      lines.push(`🧾 *COMANDA — Mayoristas de Perfumes Venezuela*`);
      if (chosenAdvisor) lines.push(`Asesora: *${chosenAdvisor.name}*`);
      lines.push("");
      items.forEach(i => lines.push(`• ${i.qty}x ${i.name} — ${money(i.price)} c/u`));
      lines.push("");
      lines.push(`Total: ${money(total)}`);
      if (order.payment_method === "Pago móvil") { const bsLine = formatBs(total); if (bsLine) lines.push(`Monto a pagar: ${bsLine} (tasa ${exchangeRate().toLocaleString("es-VE")})`); }
      lines.push("");
      lines.push(`Nombre: ${order.customer_name}`);
      if (order.customer_cedula) lines.push(`Cédula: ${order.customer_cedula}`);
      lines.push(`Teléfono: ${order.phone}`);
      lines.push(`Ciudad: ${order.city}`);
      lines.push(`Método de pago: ${order.payment_method}`);
      if (order.payment_status === "por_verificar") lines.push(`💳 PAGO REPORTADO — Referencia: ${order.payment_reference}`);
      else lines.push(`⏳ PAGO PENDIENTE (pagará después)`);
      if (proofPath) lines.push(`📎 Comprobante: subido en la web (míralo en tu admin)`);
      else if (proofFailed) lines.push(`📎 Comprobante: no se pudo subir; lo enviaré por este chat`);
      lines.push(`Entrega: ${order.delivery_method}`);
      if (order.address) lines.push(`Dirección: ${order.address}`);

      const fallbackNumber = typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "";
      const rawNumber = (chosenAdvisor && chosenAdvisor.phone) || fallbackNumber;
      if (rawNumber && !rawNumber.includes("PEGA_AQUI")) {
        const waDigits = rawNumber.replace(/\D/g, "");
        const message = encodeURIComponent(lines.join("\n"));
        window.open(`https://wa.me/${waDigits}?text=${message}`, "_blank");
      }

      saveCart({});
      updateCartBadge();
      el.checkoutForm.hidden = true;
      pintarHorarioExito(order);
      el.checkoutSuccess.hidden = false;
    } catch (err) {
      // La base de datos valida cada pedido; si lo rechaza por ser inválido, se le explica al cliente con claridad (código PM001).
      let msg = "No se pudo enviar tu pedido. Intenta de nuevo.";
      if (err && err.code === "PM001") {
        const codigo = err.message, detalle = err.details, siPago = " Si ya hiciste el pago, escríbele a tu asesora por WhatsApp con tu comprobante.";
        if (codigo === "pedido_minimo") msg = `Tu pedido no llega al mínimo de ${WHOLESALE_MIN_TOTAL} perfumes${detalle ? ` (te faltan ${detalle})` : ""}. Cierra esta ventana, agrega los que faltan en el carrito y vuelve a intentarlo.`;
        else if (codigo === "producto_no_disponible") { msg = `Uno de los productos${detalle ? ` («${detalle}»)` : ""} se agotó mientras hacías tu pedido. Cierra esta ventana, revisa tu carrito y vuelve a intentarlo.` + siPago; refrescarCatalogo(); }
        else { msg = "Hay un problema con los productos de tu pedido. Cierra esta ventana, revisa tu carrito y vuelve a intentarlo." + siPago; refrescarCatalogo(); }
      }
      el.checkoutError.textContent = msg;
      el.checkoutError.hidden = false;
    } finally {
      el.submitOrderBtn.disabled = false;
      setSubmitLabel();
    }
  });

  /* ---------------------------------------------------------------
     Ajustes del sitio (hero, textos)
     --------------------------------------------------------------- */
  // Solo se ofrecen los métodos de pago que tienen datos cargados en Ajustes
  // (si no hay correo de Zelle, la opción Zelle no aparece). "Efectivo" y "Pagar después"
  // no necesitan datos. Si no hay NINGÚN método configurado, se dejan todos.
  function syncPaymentOptions() {
    const st = siteSettings || {};
    const has = v => !!String(v == null ? "" : v).trim();
    const configured = { "Pago móvil": has(st.pago_movil_phone), "Binance": has(st.binance_id), "Zelle": has(st.zelle_email) };
    if (!Object.values(configured).some(Boolean)) return;
    Array.from(el.custPayment.options).forEach(opt => {
      if (opt.value in configured && !configured[opt.value]) opt.remove();
    });
  }

  function applySettings(settings) {
    if (settings.eyebrow_text) el.eyebrowText.textContent = settings.eyebrow_text;
    if (settings.hero_title) el.heroTitle.innerHTML = settings.hero_title;
    if (settings.hero_subtitle) el.heroSubtitle.textContent = settings.hero_subtitle;
  }

  /* ---------------------------------------------------------------
     WhatsApp del footer — reparte por turnos entre las asesoras
     --------------------------------------------------------------- */
  const footerWhatsappBtn = document.getElementById("footerWhatsappBtn");
  if (footerWhatsappBtn) {
    footerWhatsappBtn.addEventListener("click", async () => {
      footerWhatsappBtn.disabled = true;
      const advisor = preferredAdvisor || await getNextAdvisor();      // si ya tiene asesora, va con ella; si no, por turnos
      footerWhatsappBtn.disabled = false;
      const rawNumber = (advisor && advisor.phone) || (typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "");
      if (!rawNumber || rawNumber.includes("PEGA_AQUI")) return;
      const waDigits = rawNumber.replace(/\D/g, "");
      const message = encodeURIComponent("Hola, quiero más información sobre sus perfumes 😊");
      window.open(`https://wa.me/${waDigits}?text=${message}`, "_blank");
    });
  }

  /* ---------------------------------------------------------------
     Arranque
     --------------------------------------------------------------- */
  /* ---------------------------------------------------------------
     Catálogo guardado en el navegador: quien vuelve ve la tienda al instante con su copia,
     y por detrás se revisa si algo cambió. Precios, disponibilidad y la tasa del dólar
     SIEMPRE se vuelven a pedir frescos; si la red falla, se sigue mostrando la última copia buena.
     --------------------------------------------------------------- */
  const CATALOG_CACHE_KEY = "mpv_catalog_v2";
  function readCatalogCache() {
    try { const c = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY) || "null"); return c && Array.isArray(c.products) && c.products.length ? c : null; }
    catch (e) { return null; }
  }
  function saveCatalogCache(products, banners, hide) {
    try { localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({ t: Date.now(), products, banners, hide })); } catch (e) {}
  }
  // ¿Se ocultan los agotados? (interruptor de Ajustes en el admin; por defecto, sí)
  const visibleCatalog = (all, hide) => (hide ? all.filter(isEffectivelyAvailable) : all);
  const hideSoldOutNow = () => !(siteSettings && siteSettings.hide_soldout === false);
  // Si un producto del carrito ya no se ve (agotado o borrado), se quita para que el contador y el total cuadren
  function pruneCart() {
    if (!PRODUCTS.length) return;
    const cart = loadCart(); let changed = false;
    Object.keys(cart).forEach(k => { if (!PRODUCTS.some(p => String(p.id) === String(parseCartKey(k).id))) { delete cart[k]; changed = true; } });
    if (changed) saveCart(cart);
  }
  let settingsReady = Promise.resolve(null);

  // Si la base rechazó un producto (se agotó, cambió), se pide el catálogo fresco para que el carrito y la tienda se pongan al día.
  async function refrescarCatalogo() {
    try {
      const fresh = await fetchCatalog();
      if (!fresh.length) return;
      ALL_PRODUCTS = fresh; PRODUCTS = visibleCatalog(ALL_PRODUCTS, hideSoldOutNow());
      pruneCart(); render(); updateCartBadge(); renderCartPanel();
    } catch (e) { /* si no hay red, queda como estaba */ }
  }

  function paintStore(bannerData) {
    pruneCart();
    paintTrustStrip();
    renderMarquee();
    renderCategoryNav();
    renderCategoryTiles();
    renderBanners(bannerData);
    renderCategoryChips();
    renderBrandOptions();
    el.brandSelect.value = state.brand || "";         // al repintar no se pierde la marca elegida
    renderFeatured();
    render();
    updateCartBadge();
  }

  /* ---------------------------------------------------------------
     Aviso "SOLO VENDEMOS EN VENEZUELA": se muestra una vez por visita, antes de usar la tienda.
     --------------------------------------------------------------- */
  function veAlreadyAccepted() { try { return sessionStorage.getItem("mpv_ve_ok") === "1"; } catch (e) { return false; } }
  function initVenezuelaNotice() {
    if (veAlreadyAccepted()) { startSocialProof(); return; }
    document.body.style.overflow = "hidden";
    el.veAccept.focus();
    el.veAccept.addEventListener("click", () => {
      try { sessionStorage.setItem("mpv_ve_ok", "1"); } catch (e) {}
      document.documentElement.classList.add("ve-ok");
      document.body.style.overflow = "";
      startSocialProof();
    });
  }

  /* ---------------------------------------------------------------
     Avisos de "compras recientes": SOLO pedidos reales (nombre + inicial del apellido).
     Nunca se inventan ventas. Si no hay pedidos reales recientes, no se muestra nada.
     --------------------------------------------------------------- */
  const SP_FIRST_DELAY = 7000, SP_SHOW_MS = 7000, SP_GAP_MS = 14000;
  let spQueue = [], spIdx = 0, spEl = null, spStarted = false, spHideT = null, spNextT = null;

  function timeAgoEs(dateStr) {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 1) return "justo ahora";
    if (mins < 60) return `hace ${mins} min`;
    const h = Math.floor(mins / 60);
    if (h < 24) return `hace ${h} ${h === 1 ? "hora" : "horas"}`;
    const d = Math.floor(h / 24);
    return `hace ${d} ${d === 1 ? "día" : "días"}`;
  }
  function describeOrder(r) {
    const boxes = Array.isArray(r.boxes) ? r.boxes.map(b => `${b.qty} ${b.name}`) : [];
    const perf = r.perfumes > 0 ? [`${r.perfumes} ${r.perfumes === 1 ? "perfume" : "perfumes"}`] : [];
    const parts = [...boxes, ...perf];
    const what = parts.length > 1 ? parts.slice(0, -1).join(", ") + " y " + parts[parts.length - 1] : parts[0] || "";
    return { who: r.display_name, verb: r.paid ? "compró" : "hizo un pedido de", what, when: timeAgoEs(r.created_at) };
  }
  function buildSocialProofDOM() {
    if (spEl) return spEl;
    spEl = document.createElement("div");
    spEl.className = "sp-toast";
    spEl.setAttribute("role", "status");
    spEl.innerHTML = `<button type="button" class="sp-close" aria-label="Cerrar">×</button><div class="sp-icon" aria-hidden="true">🛍️</div><div class="sp-body"><p class="sp-l1"></p><p class="sp-l2"></p><p class="sp-l3"></p></div>`;
    document.body.appendChild(spEl);
    spEl.querySelector(".sp-close").addEventListener("click", () => {
      spEl.classList.remove("visible"); clearTimeout(spNextT); clearTimeout(spHideT);
      try { sessionStorage.setItem("mpv_hide_feed", "1"); } catch (e) {}
    });
    return spEl;
  }
  const anyModalOpen = () => !!document.querySelector(".modal-overlay:not([hidden]), .cart-overlay:not([hidden])");
  /* Pedidos de EJEMPLO: siempre rotulados como ejemplo, sin nombre y sin decir que alguien "compró".
     Muestran cómo arman sus pedidos los clientes (perfumes en lotes de 12 y cajas del catálogo). */
  function exampleOrders() {
    const mk = (perfumes, boxIdx = null, boxQty = 1) => ({ kind: "example", perfumes, boxIdx, boxQty });
    return [mk(36), mk(48, 0), mk(24), mk(60, 1), mk(72), mk(0, 2, 2), mk(36, 3), mk(24, 4)];
  }
  function exampleBoxes(r) {                         // las cajas se toman del catálogo EN EL MOMENTO de mostrar el ejemplo
    const names = PRODUCTS.filter(p => p.category === "Cajas / Combos" && p.avail !== false).map(p => p.name);
    return r.boxIdx != null && names.length ? [{ name: names[r.boxIdx % names.length], qty: r.boxQty }] : null;
  }
  function mixQueue(real) {                         // 2 pedidos reales, 1 de ejemplo (si hay pocos reales, se alternan)
    const ex = exampleOrders(), out = [];
    let ei = 0;
    const every = real.length >= 4 ? 2 : 1;
    real.forEach((r, i) => { out.push(r); if ((i + 1) % every === 0) out.push(ex[ei++ % ex.length]); });
    if (!real.length) return ex;
    return out;
  }
  function showSocialProof() {
    const r = spQueue[spIdx % spQueue.length]; spIdx++;
    if (!anyModalOpen()) {
      const box = buildSocialProofDOM();
      const isEx = r.kind === "example";
      const bx = isEx ? exampleBoxes(r) : r.boxes;
      const parts = [...(Array.isArray(bx) ? bx.map(b => `${b.qty} ${b.name}`) : []), ...(r.perfumes > 0 ? [`${r.perfumes} ${r.perfumes === 1 ? "perfume" : "perfumes"}`] : [])];
      if (!parts.length) { spNextT = setTimeout(showSocialProof, 300); return; }      // ejemplo sin contenido (aún no hay cajas): se salta
      const what = parts.length > 1 ? parts.slice(0, -1).join(", ") + " y " + parts[parts.length - 1] : parts[0] || "";
      box.classList.toggle("sp-example", isEx);
      box.querySelector(".sp-icon").textContent = isEx ? "📦" : "🛍️";
      if (isEx) {
        box.querySelector(".sp-l1").innerHTML = `<span class="sp-tag">EJEMPLO</span> de pedido`;
        box.querySelector(".sp-l3").textContent = "Así arman su pedido nuestros clientes";
      } else {
        const d = describeOrder(r);
        box.querySelector(".sp-l1").innerHTML = `<b></b> ${d.verb}`;
        box.querySelector(".sp-l1 b").textContent = d.who;
        box.querySelector(".sp-l3").textContent = d.when;
      }
      box.querySelector(".sp-l2").textContent = what;
      box.classList.add("visible");
      clearTimeout(spHideT); spHideT = setTimeout(() => box.classList.remove("visible"), SP_SHOW_MS);
    }
    spNextT = setTimeout(showSocialProof, SP_SHOW_MS + SP_GAP_MS);
  }
  async function startSocialProof() {
    if (spStarted) return; spStarted = true;
    try { if (sessionStorage.getItem("mpv_hide_feed") === "1") return; } catch (e) {}
    let rows = [];
    if (SUPABASE_READY) {
      try { const { data } = await supabaseClient.rpc("public_recent_orders", { p_days: 90, p_limit: 15 }); rows = Array.isArray(data) ? data : []; } catch (e) {}
    }
    const real = rows.filter(r => r && r.display_name && (r.perfumes > 0 || (r.boxes && r.boxes.length))).map(r => Object.assign({ kind: "real" }, r));
    spQueue = mixQueue(real);
    if (!spQueue.length) return;
    spNextT = setTimeout(showSocialProof, SP_FIRST_DELAY);
  }

  /* ---------------------------------------------------------------
     CÉDULA y "SOY CLIENTE": el cliente ve SUS pedidos con cédula + teléfono.
     La consulta la hace la base de datos (my_orders): devuelve solo productos, totales y estado.
     --------------------------------------------------------------- */
  /* La cédula o el RIF se escriben SOLO con números (sin letras, puntos ni guiones).
     Cédula: de 6 a 8 números. RIF: 9 números (8 más el dígito verificador del final). */
  const soloNumeros = v => String(v || "").replace(/\D/g, "");
  function validarCedula(valor) {
    const dig = soloNumeros(valor);
    if (!dig) return { ok: false, msg: "Escribe tu cédula o RIF (solo números)." };
    if (dig.length < 6) return { ok: false, msg: "Tu cédula o RIF debe tener al menos 6 números. Escríbelo completo, solo números." };
    if (dig.length > 9) return { ok: false, msg: "Tienes demasiados números: la cédula tiene de 6 a 8 y el RIF 9. Revísalo." };
    return { ok: true, dig };
  }
  function cedulaInput(numEl) {                       // si pegan "V-12.345.678", se quitan la letra, los puntos y los guiones
    numEl.addEventListener("input", () => { numEl.value = soloNumeros(numEl.value).slice(0, 15); });
  }
  cedulaInput(el.custCedulaNum);
  cedulaInput(el.clientCedulaNum);
  const ESTADO_PEDIDO = { nuevo: "Nuevo", tomado: "Tomado", entregado: "Entregado", cancelado: "Cancelado" };
  const ESTADO_PAGO = { pendiente: "Pago pendiente", por_verificar: "Pago por verificar", pagado: "Pagado" };
  let clientOrders = [];

  function openClient() {
    el.clientMsg.hidden = true; el.clientResults.hidden = true; el.clientResults.innerHTML = ""; el.clientForm.hidden = false;
    el.clientOverlay.hidden = false; document.body.style.overflow = "hidden"; el.clientCedulaNum.focus();
  }
  function closeClient() { el.clientOverlay.hidden = true; if (el.checkoutOverlay.hidden) document.body.style.overflow = ""; }
  el.clientBtn.addEventListener("click", openClient);
  el.clientClose.addEventListener("click", closeClient);
  el.clientOverlay.addEventListener("click", e => { if (e.target === el.clientOverlay) closeClient(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !el.clientOverlay.hidden) closeClient(); });

  function renderClientOrders(rows, aviso) {
    const nombre = String((rows[0] && rows[0].customer_name) || "").trim().split(/\s+/)[0] || "";
    const vigentes = rows.filter(r => r.status !== "cancelado");
    const total = vigentes.reduce((s, r) => s + (Number(r.total) || 0), 0);
    const fecha = d => new Date(d).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Caracas" });
    el.clientResults.innerHTML = `
      <div class="client-head"><strong>Hola${nombre ? ", " + esc(nombre) : ""} 👋</strong><span>${vigentes.length} ${vigentes.length === 1 ? "pedido" : "pedidos"} · ${money(total)} en total</span></div>
      ${aviso ? `<div class="client-aviso">${aviso}</div>` : ""}
      ${rows.map((r, i) => `
        <div class="client-order">
          <div class="client-order-top"><b>Pedido #${esc(r.order_id)}</b><span>${fecha(r.created_at)}</span></div>
          <div class="client-chips"><span class="chip st-${esc(r.status)}">${esc(ESTADO_PEDIDO[r.status] || r.status)}</span><span class="chip pay-${esc(r.payment_status)}">${esc(ESTADO_PAGO[r.payment_status] || r.payment_status)}</span></div>
          <ul class="client-items">${(Array.isArray(r.items) ? r.items : []).map(it => `<li>${esc(it.qty)} × ${esc(it.name)}</li>`).join("")}</ul>
          <div class="client-order-bottom"><b>${money(r.total)}</b>${r.advisor_name ? `<span>Asesora: ${esc(r.advisor_name)}</span>` : ""}<button type="button" class="client-reorder" data-reorder="${i}">Volver a pedir</button></div>
        </div>`).join("")}`;
    el.clientResults.hidden = false;
  }
  el.clientForm.addEventListener("submit", async e => {
    e.preventDefault();
    el.clientMsg.hidden = true;
    {
      const v = validarCedula(el.clientCedulaNum.value);
      if (!v.ok) { el.clientMsg.textContent = v.msg; el.clientMsg.hidden = false; return; }
    }
    el.clientSubmit.disabled = true; el.clientSubmit.textContent = "Buscando…";
    try {
      const { data, error } = await supabaseClient.rpc("my_orders", { p_cedula: soloNumeros(el.clientCedulaNum.value), p_phone: el.clientPhone.value.trim() });
      if (error) throw error;
      if (!Array.isArray(data) || !data.length) {
        el.clientMsg.textContent = "No encontramos pedidos con esos datos. Revisa que la cédula y el teléfono sean los mismos que usaste al hacer tu pedido.";
        el.clientMsg.hidden = false; return;
      }
      clientOrders = data; el.clientForm.hidden = true; renderClientOrders(data);
    } catch (err) {
      el.clientMsg.textContent = "No pudimos consultar en este momento. Intenta de nuevo en un rato.";
      el.clientMsg.hidden = false;
    } finally { el.clientSubmit.disabled = false; el.clientSubmit.textContent = "Ver mis pedidos"; }
  });
  el.clientResults.addEventListener("click", e => {
    if (e.target.closest("[data-gocart]")) { closeClient(); openCart(); return; }
    const btn = e.target.closest("[data-reorder]");
    if (!btn) return;
    const order = clientOrders[Number(btn.dataset.reorder)]; if (!order) return;
    let ok = 0, falta = 0;
    (Array.isArray(order.items) ? order.items : []).forEach(it => {
      const p = PRODUCTS.find(x => String(x.id) === String(it.id));
      if (p && isEffectivelyAvailable(p)) { addToCart(p.id, Number(it.qty) || 1); ok++; } else falta++;
    });
    const aviso = ok
      ? `Agregamos <b>${ok}</b> ${ok === 1 ? "producto" : "productos"} a tu carrito.${falta ? ` ${falta} ya no ${falta === 1 ? "está disponible" : "están disponibles"}.` : ""} <button type="button" class="client-gocart" data-gocart>Ver carrito</button>`
      : "Esos productos ya no están disponibles en el catálogo.";
    renderClientOrders(clientOrders, aviso);
    el.clientResults.scrollIntoView({ block: "start" });
  });

  /* ---------------------------------------------------------------
     PAGO PROTEGIDO y HORARIO DE ATENCIÓN
     El horario se edita en Admin → Ajustes. Todo se calcula con la hora de Venezuela (UTC-4).
     --------------------------------------------------------------- */
  const PAGO_PROTEGIDO_HTML = `<span class="pay-safe">🔒 <b>Tu pago está protegido.</b> Transfiere solo a los datos que ves en esta página. Tu pago queda registrado con tu pedido y lo verifica tu asesora. <b>Nunca te pediremos claves, PIN ni códigos.</b></span>`;
  const DIAS_SEMANA = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const DIA_LARGO = { mon: "lunes", tue: "martes", wed: "miércoles", thu: "jueves", fri: "viernes", sat: "sábado", sun: "domingo" };
  const DIA_CORTO = { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom" };
  const HORARIO_POR_DEFECTO = { mon: { mode: "hours", open: "08:00", close: "17:50" }, tue: { mode: "hours", open: "08:00", close: "17:50" }, wed: { mode: "hours", open: "08:00", close: "17:50" }, thu: { mode: "hours", open: "08:00", close: "17:50" }, fri: { mode: "hours", open: "08:00", close: "17:50" }, sat: { mode: "hours", open: "08:00", close: "14:00" }, sun: { mode: "virtual" } };
  const aMinutos = hhmm => { const [h, m] = String(hhmm || "0:0").split(":").map(Number); return h * 60 + (m || 0); };
  function hora12(hhmm) {
    const [h, m] = String(hhmm).split(":").map(Number);
    return `${h % 12 === 0 ? 12 : h % 12}:${String(m || 0).padStart(2, "0")} ${h >= 12 ? "p. m." : "a. m."}`;
  }
  function ahoraVenezuela(fecha = new Date()) {
    const partes = new Intl.DateTimeFormat("en-US", { timeZone: "America/Caracas", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(fecha);
    const v = t => partes.find(p => p.type === t).value;
    return { dia: { Sun: "sun", Mon: "mon", Tue: "tue", Wed: "wed", Thu: "thu", Fri: "fri", Sat: "sat" }[v("weekday")], min: (Number(v("hour")) % 24) * 60 + Number(v("minute")) };
  }
  function horarioConfigurado() {
    const H = siteSettings && siteSettings.business_hours;
    return H && typeof H === "object" ? H : HORARIO_POR_DEFECTO;
  }
  // Devuelve { estado: "abierto" | "cerrado" | "virtual", proxima: "mañana a las 8:00 a. m." }
  function estadoHorario(fecha = new Date()) {
    const H = horarioConfigurado(), { dia, min } = ahoraVenezuela(fecha), idx = DIAS_SEMANA.indexOf(dia), hoy = H[dia] || { mode: "closed" };
    const proxima = () => {
      if (hoy.mode === "hours" && min < aMinutos(hoy.open)) return `hoy a las ${hora12(hoy.open)}`;
      for (let i = 1; i <= 7; i++) {
        const k = DIAS_SEMANA[(idx + i) % 7], c = H[k];
        if (c && c.mode === "hours") return `${i === 1 ? "mañana" : "el " + DIA_LARGO[k]} a las ${hora12(c.open)}`;
      }
      return "";
    };
    if (hoy.mode === "virtual") return { estado: "virtual", proxima: proxima() };
    if (hoy.mode === "hours" && min >= aMinutos(hoy.open) && min < aMinutos(hoy.close)) return { estado: "abierto" };
    return { estado: "cerrado", proxima: proxima() };
  }
  function resumenHorario() {   // "Lun a Vie 8:00 a. m. – 5:50 p. m. · Sáb 8:00 a. m. – 2:00 p. m. · Dom atención virtual"
    const H = horarioConfigurado(), orden = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const txt = k => { const c = H[k] || { mode: "closed" }; return c.mode === "hours" ? `${hora12(c.open)} – ${hora12(c.close)}` : c.mode === "virtual" ? "atención virtual en horarios limitados" : "cerrado"; };
    const grupos = [];
    orden.forEach(k => { const t = txt(k), u = grupos[grupos.length - 1]; if (u && u.t === t) u.fin = k; else grupos.push({ ini: k, fin: k, t }); });
    return grupos.map(g => `${g.ini === g.fin ? DIA_CORTO[g.ini] : DIA_CORTO[g.ini] + " a " + DIA_CORTO[g.fin]}: ${g.t}`).join(" · ");
  }
  function pintarHorarioExito(pedido) {
    el.successHours.hidden = true; el.successSchedule.hidden = true;
    el.successLead.textContent = "Te vamos a escribir por WhatsApp para confirmar tu pedido.";
    if (siteSettings && siteSettings.hours_enabled === false) return;
    const e = estadoHorario(), pago = pedido && pedido.payment_status === "por_verificar";
    if (e.estado !== "abierto") el.successLead.textContent = "Tu pedido ya quedó registrado.";      // fuera de horario no se promete que escriban "en breve"
    const cuando = e.proxima ? e.proxima.replace(/\.$/, "") : "";          // "8:00 a. m." ya termina en punto: no se duplica
    let msg;
    if (e.estado === "abierto") msg = `✅ Estamos en horario de atención: tu asesora te escribe por WhatsApp en breve.${pago ? " Tu pago pasa a verificación." : ""}`;
    else if (e.estado === "virtual") msg = `🕗 Hoy atendemos de forma virtual en horarios limitados. Tu pedido${pago ? " y tu pago quedaron registrados" : " quedó registrado"} y te respondemos en cuanto haya una asesora disponible${cuando ? `; si no, te atendemos ${cuando}` : ""}${cuando.endsWith("m") ? ". " : "."}`.trim();
    else msg = `🕗 Ahora estamos fuera de horario. Tu pedido${pago ? " y tu pago quedaron registrados" : " quedó registrado"} y te atendemos ${cuando}${cuando.endsWith("m") ? ". " : ". "}${pago ? "Los pedidos pagados salen primero." : "Recuerda que los pedidos que van pagos salen primero."}`;
    el.successHours.textContent = msg; el.successHours.hidden = false;
    el.successSchedule.textContent = "Horario de atención (hora de Venezuela): " + resumenHorario(); el.successSchedule.hidden = false;
  }

  /* FRANJA DE CONFIANZA (debajo del banner). Nada está escrito a mano: sale de los Ajustes y del catálogo reales. */
  function paintTrustChat() {
    if (!el.trustChat) return;
    if (siteSettings && siteSettings.hours_enabled === false) { el.trustChatChip.hidden = true; el.trustChat.textContent = "Asesoras que te acompañan en tu pedido"; return; }
    const e = estadoHorario(), cfg = horarioConfigurado()[ahoraVenezuela().dia] || {};
    let chip, cls, txt;
    if (e.estado === "abierto") { chip = "Abierto ahora"; cls = "on"; txt = `Hoy hasta las ${hora12(cfg.close)}`; }
    else if (e.estado === "virtual") { chip = "Atención virtual"; cls = "virtual"; txt = "Hoy en horarios limitados"; }
    else { chip = "Fuera de horario"; cls = "off"; txt = e.proxima ? `Te atendemos ${e.proxima}` : "Escríbenos y te respondemos"; }
    el.trustChat.textContent = txt; el.trustChatChip.textContent = chip; el.trustChatChip.className = "trust-chip " + cls; el.trustChatChip.hidden = false;
  }
  function paintTrustStrip() {
    if (!el.trustPay) return;
    const s = siteSettings || {}, pagos = [];
    if (String(s.pago_movil_phone || "").trim()) pagos.push("Pago Móvil");
    if (String(s.binance_id || "").trim()) pagos.push("Binance");
    if (String(s.zelle_email || "").trim()) pagos.push("Zelle");
    pagos.push("efectivo");
    el.trustPay.textContent = pagos.length > 1 ? pagos.slice(0, -1).join(", ") + " o " + pagos[pagos.length - 1] : pagos[0];
    const cajas = PRODUCTS.filter(p => (p.min_qty || WHOLESALE_MIN_TOTAL) <= 1 && isEffectivelyAvailable(p)).map(p => Number(p.offer) > 0 ? Number(p.offer) : Number(p.mayor)).filter(x => x > 0);
    const desde = cajas.length ? Math.min(...cajas) : 0;
    el.trustMin.textContent = desde ? `Surtido a tu gusto · cajas desde $${Number.isInteger(desde) ? desde : desde.toFixed(2)}` : "Surtido a tu gusto, de cualquier referencia";
    paintTrustChat();
  }

  async function init() {
    captureAdvisorFromURL();
    initVenezuelaNotice();
    const cached = readCatalogCache();
    settingsReady = fetchSettings().then(s => { siteSettings = s; applySettings(s); syncPaymentOptions(); paintTrustStrip(); return s; });
    setInterval(paintTrustChat, 60000);            // «Abierto ahora / Fuera de horario» se actualiza solo

    let paintedSig = null;
    if (cached) {                                       // 1) al instante, con la copia guardada
      ALL_PRODUCTS = cached.products;
      PRODUCTS = visibleCatalog(ALL_PRODUCTS, cached.hide !== false);
      applyCategoryFromURL();
      paintStore(cached.banners || []);
      paintedSig = JSON.stringify([PRODUCTS, cached.banners || []]);
    }
    const [products, bannerData] = await Promise.all([fetchCatalog(), fetchBanners()]);   // 2) lo fresco
    await settingsReady;
    const hide = hideSoldOutNow();
    if (products.length) {
      ALL_PRODUCTS = products;
      PRODUCTS = visibleCatalog(ALL_PRODUCTS, hide);
      saveCatalogCache(ALL_PRODUCTS, bannerData, hide);
      const sig = JSON.stringify([PRODUCTS, bannerData]);
      if (paintedSig === null) { applyCategoryFromURL(); paintStore(bannerData); }
      else if (sig !== paintedSig) paintStore(bannerData);
    } else if (paintedSig === null) {                   // sin red y sin copia: como antes
      PRODUCTS = [];
      applyCategoryFromURL();
      paintStore(bannerData);
    }                                                    // con copia y sin red: se queda lo que ya se ve
    loadAdvisorPreference();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
