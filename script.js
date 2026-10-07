(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Estado global
     --------------------------------------------------------------- */
  let PRODUCTS = [];
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
    custDelivery: document.getElementById("custDelivery"),
    addressField: document.getElementById("addressField"),
    custAddress: document.getElementById("custAddress"),
    submitOrderBtn: document.getElementById("submitOrderBtn"),
    checkoutError: document.getElementById("checkoutError"),
    checkoutSuccess: document.getElementById("checkoutSuccess"),
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

    const pooled = pooledQty();
    el.cartMinProgress.hidden = false;
    if (pooled >= WHOLESALE_MIN_TOTAL) {
      el.cartMinProgress.className = "cart-min-progress ok";
      el.cartMinProgress.textContent = `✓ Mínimo completo (${pooled} unidades)`;
    } else {
      el.cartMinProgress.className = "cart-min-progress";
      el.cartMinProgress.textContent = `Llevas ${pooled} de ${WHOLESALE_MIN_TOTAL} unidades mínimas — agrega ${WHOLESALE_MIN_TOTAL - pooled} más (puedes combinar perfumes distintos)`;
    }

    el.cartTotal.textContent = money(cartTotal());
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
    el.bannerTrack.innerHTML = banners.map(b => {
      const hasText = !!((b.title || "").trim() || (b.subtitle || "").trim());
      const link = (b.link_url || "").trim();
      const showBtn = !!link && (hasText || !!(b.button_text || "").trim());
      return `
      <div class="banner-slide${hasText ? " has-text" : ""}${link ? " is-link" : ""}" style="background-image:url('${esc(b.image || "")}')"${link ? ` data-link="${esc(link)}" role="link" tabindex="0"` : ""}>
        ${hasText || showBtn ? `<div class="banner-slide-content">
          ${b.title ? `<h3>${esc(b.title)}</h3>` : ""}
          ${b.subtitle ? `<p>${esc(b.subtitle)}</p>` : ""}
          ${showBtn ? `<span class="banner-btn">${esc(b.button_text || "Ver más")}</span>` : ""}
        </div>` : ""}
      </div>`;
    }).join("");
    el.bannerDots.innerHTML = banners.map((_, i) => `<button data-dot="${i}" class="${i === 0 ? 'active' : ''}"></button>`).join("");
    updateBannerPosition();
    syncBannerArea();
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
    el.modalMinQtyNote.textContent = modalMinQty > 1 ? "Cuenta para tu surtido mínimo de 12 unidades — puedes combinarlo con otros perfumes" : "";
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
  function updatePaymentDetailsBox() {
    const val = el.custPayment.value;
    const s = siteSettings || {};
    let html = "";
    if (val === "Pago móvil") {
      html = `<strong>Datos para Pago Móvil</strong>
        <span>Teléfono: <b>${s.pago_movil_phone || "—"}</b></span>
        <span>Cédula/RIF: <b>${s.pago_movil_cedula || "—"}</b></span>
        <span>Banco: <b>${s.pago_movil_bank || "—"}</b></span>`;
    } else if (val === "Binance") {
      html = `<strong>Datos para Binance</strong>
        <span>Correo/ID: <b>${s.binance_email || "—"}</b></span>
        ${s.binance_holder_name ? `<span>Titular: <b>${s.binance_holder_name}</b></span>` : ""}`;
    } else if (val === "Zelle") {
      html = `<strong>Datos para Zelle</strong>
        <span>Correo: <b>${s.zelle_email || "—"}</b></span>
        ${s.zelle_holder_name ? `<span>Titular: <b>${s.zelle_holder_name}</b></span>` : ""}`;
    }
    if (html) { el.paymentDetailsBox.innerHTML = html; el.paymentDetailsBox.hidden = false; }
    else el.paymentDetailsBox.hidden = true;
  }
  el.custPayment.addEventListener("change", updatePaymentDetailsBox);

  el.custDelivery.addEventListener("change", () => {
    const val = el.custDelivery.value;
    el.addressField.hidden = val !== "Delivery";
    el.custAddress.required = val === "Delivery";
  });

  let chosenAdvisor = null; // { id, name, phone }

  function openCheckout() {
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
  }
  function closeCheckout() {
    el.checkoutOverlay.hidden = true;
    document.body.style.overflow = "";
  }
  el.checkoutBtn.addEventListener("click", openCheckout);

  function selectAdvisor(advisor) {
    chosenAdvisor = advisor;
    el.advisorStep.hidden = true;
    el.checkoutForm.hidden = false;
    el.advisorChosenTag.hidden = false;
    const photo = advisor.image
      ? `<img src="${advisor.image}" alt="" class="advisor-tag-photo">`
      : `<span class="advisor-tag-photo advisor-tag-photo-placeholder">${(advisor.name || "?").charAt(0)}</span>`;
    el.advisorChosenTag.innerHTML = `${photo}<span>Te atiende: ${advisor.name}</span>`;
  }

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
    if (advisor) selectAdvisor(advisor);
  });

  el.advisorNoBtn.addEventListener("click", async () => {
    el.advisorNoBtn.disabled = true;
    el.advisorNoBtn.textContent = "Asignando…";
    const advisor = await getNextAdvisor();
    el.advisorNoBtn.disabled = false;
    el.advisorNoBtn.textContent = "No, asígname una";
    if (advisor) selectAdvisor(advisor);
    else el.checkoutError.textContent = "No se pudo asignar una asesora. Intenta de nuevo.", (el.checkoutError.hidden = false);
  });

  el.checkoutClose.addEventListener("click", closeCheckout);
  el.closeSuccessBtn.addEventListener("click", closeCheckout);

  el.checkoutForm.addEventListener("submit", async e => {
    e.preventDefault();
    el.checkoutError.hidden = true;

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

    const pooled = pooledQty();
    if (pooled < WHOLESALE_MIN_TOTAL) {
      el.checkoutError.textContent = `Te faltan ${WHOLESALE_MIN_TOTAL - pooled} unidades para completar el mínimo de ${WHOLESALE_MIN_TOTAL} (puedes combinar varios perfumes distintos).`;
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

    const order = {
      customer_name: el.custName.value.trim(),
      phone: el.custPhone.value.trim(),
      city: el.custCity.value.trim(),
      email: el.custEmail.value.trim(),
      delivery_method: el.custDelivery.value,
      address: el.custAddress.value.trim(),
      payment_method: el.custPayment.value,
      items,
      subtotal,
      discount: 0,
      total,
      status: "nuevo",
      advisor_name: chosenAdvisor ? chosenAdvisor.name : "",
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
      lines.push("");
      lines.push(`Nombre: ${order.customer_name}`);
      lines.push(`Teléfono: ${order.phone}`);
      lines.push(`Ciudad: ${order.city}`);
      lines.push(`Método de pago: ${order.payment_method}`);
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
      el.checkoutSuccess.hidden = false;
    } catch (err) {
      el.checkoutError.textContent = "No se pudo enviar tu pedido. Intenta de nuevo.";
      el.checkoutError.hidden = false;
    } finally {
      el.submitOrderBtn.disabled = false;
      el.submitOrderBtn.textContent = "Enviar pedido por WhatsApp";
    }
  });

  /* ---------------------------------------------------------------
     Ajustes del sitio (hero, textos)
     --------------------------------------------------------------- */
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
      const advisor = await getNextAdvisor();
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
  async function init() {
    const [products, settings, bannerData] = await Promise.all([fetchCatalog(), fetchSettings(), fetchBanners()]);
    PRODUCTS = products;
    siteSettings = settings;
    applySettings(settings);

    applyCategoryFromURL();
    renderMarquee();
    renderCategoryNav();
    renderCategoryTiles();
    renderBanners(bannerData);
    renderCategoryChips();
    renderBrandOptions();
    renderFeatured();
    render();
    updateCartBadge();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
