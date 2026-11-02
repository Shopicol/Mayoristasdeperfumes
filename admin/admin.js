/* =====================================================================
   SHOPICOL BACANO — admin.js
   Lógica del panel: login/logout, listar/filtrar productos, crear,
   editar, eliminar, subir imágenes, e importar el catálogo semilla.
   Requiere que config.js tenga las claves reales de Supabase — sin
   ellas, este panel no puede iniciar sesión (solo el sitio público
   puede funcionar sin Supabase, mostrando el catálogo local).
   ===================================================================== */

(function () {
  "use strict";

  const el = {
    loginScreen: document.getElementById("loginScreen"),
    loginForm: document.getElementById("loginForm"),
    loginEmail: document.getElementById("loginEmail"),
    loginPassword: document.getElementById("loginPassword"),
    loginBtn: document.getElementById("loginBtn"),
    loginError: document.getElementById("loginError"),
    configWarning: document.getElementById("configWarning"),

    adminApp: document.getElementById("adminApp"),
    adminUserEmail: document.getElementById("adminUserEmail"),
    logoutBtn: document.getElementById("logoutBtn"),
    backupBtn: document.getElementById("backupBtn"),

    statTotal: document.getElementById("statTotal"),
    statAvail: document.getElementById("statAvail"),
    statBrands: document.getElementById("statBrands"),

    importBtn: document.getElementById("importBtn"),
    importHint: document.getElementById("importHint"),
    confirmImportBtn: document.getElementById("confirmImportBtn"),
    cancelImportBtn: document.getElementById("cancelImportBtn"),
    newProductBtn: document.getElementById("newProductBtn"),

    bulkUploadBtn: document.getElementById("bulkUploadBtn"),
    bulkUploadFile: document.getElementById("bulkUploadFile"),
    bulkModalOverlay: document.getElementById("bulkModalOverlay"),
    bulkModalClose: document.getElementById("bulkModalClose"),
    bulkSummary: document.getElementById("bulkSummary"),
    bulkErrorsList: document.getElementById("bulkErrorsList"),
    cancelBulkBtn: document.getElementById("cancelBulkBtn"),
    confirmBulkBtn: document.getElementById("confirmBulkBtn"),
    bulkFormError: document.getElementById("bulkFormError"),

    adminSearch: document.getElementById("adminSearch"),
    adminCategoryFilter: document.getElementById("adminCategoryFilter"),
    adminBrandFilter: document.getElementById("adminBrandFilter"),
    adminAvailFilter: document.getElementById("adminAvailFilter"),
    adminResultsCount: document.getElementById("adminResultsCount"),

    adminTableBody: document.getElementById("adminTableBody"),
    adminEmpty: document.getElementById("adminEmpty"),

    // modal producto
    productModalOverlay: document.getElementById("productModalOverlay"),
    productModalClose: document.getElementById("productModalClose"),
    productModalTitle: document.getElementById("productModalTitle"),
    productForm: document.getElementById("productForm"),
    fieldId: document.getElementById("fieldId"),
    fieldName: document.getElementById("fieldName"),
    fieldBrand: document.getElementById("fieldBrand"),
    fieldCategory: document.getElementById("fieldCategory"),
    fieldRef: document.getElementById("fieldRef"),
    fieldAvail: document.getElementById("fieldAvail"),
    fieldDetal: document.getElementById("fieldDetal"),
    fieldMayor: document.getElementById("fieldMayor"),
    fieldOffer: document.getElementById("fieldOffer"),
    fieldStock: document.getElementById("fieldStock"),
    fieldImageFile: document.getElementById("fieldImageFile"),
    fieldImageUrl: document.getElementById("fieldImageUrl"),
    imagePreview: document.getElementById("imagePreview"),
    imageUploadStatus: document.getElementById("imageUploadStatus"),
    fieldNote: document.getElementById("fieldNote"),
    deleteProductBtn: document.getElementById("deleteProductBtn"),
    cancelProductBtn: document.getElementById("cancelProductBtn"),
    saveProductBtn: document.getElementById("saveProductBtn"),
    productFormError: document.getElementById("productFormError"),
    brandOptions: document.getElementById("brandOptions"),
    categoryOptions: document.getElementById("categoryOptions"),
    fieldFeatured: document.getElementById("fieldFeatured"),
    fieldShowWhenOut: document.getElementById("fieldShowWhenOut"),
    adminFeaturedFilter: document.getElementById("adminFeaturedFilter"),
    galleryList: document.getElementById("galleryList"),
    addGalleryPhotoBtn: document.getElementById("addGalleryPhotoBtn"),
    fieldTones: document.getElementById("fieldTones"),

    toast: document.getElementById("toast"),

    // tabs
    tabButtons: document.querySelectorAll(".admin-tab"),
    tabSummary: document.getElementById("tabSummary"),
    tabProducts: document.getElementById("tabProducts"),
    tabOrders: document.getElementById("tabOrders"),
    tabBanners: document.getElementById("tabBanners"),
    tabCoupons: document.getElementById("tabCoupons"),
    tabReviews: document.getElementById("tabReviews"),
    tabRestock: document.getElementById("tabRestock"),
    tabBrandLogos: document.getElementById("tabBrandLogos"),
    brandLogosList: document.getElementById("brandLogosList"),
    restockAdminList: document.getElementById("restockAdminList"),
    restockAdminEmpty: document.getElementById("restockAdminEmpty"),
    statRestockPending: document.getElementById("statRestockPending"),
    restockBadge: document.getElementById("restockBadge"),
    tabCollections: document.getElementById("tabCollections"),
    collectionsAdminList: document.getElementById("collectionsAdminList"),
    collectionsAdminEmpty: document.getElementById("collectionsAdminEmpty"),
    newCollectionBtn: document.getElementById("newCollectionBtn"),
    collectionModalOverlay: document.getElementById("collectionModalOverlay"),
    collectionModalTitle: document.getElementById("collectionModalTitle"),
    collectionModalClose: document.getElementById("collectionModalClose"),
    cancelCollectionBtn: document.getElementById("cancelCollectionBtn"),
    collectionForm: document.getElementById("collectionForm"),
    collectionFieldId: document.getElementById("collectionFieldId"),
    collectionFieldTitle: document.getElementById("collectionFieldTitle"),
    collectionFieldOrder: document.getElementById("collectionFieldOrder"),
    collectionFieldActive: document.getElementById("collectionFieldActive"),
    collectionProductSearch: document.getElementById("collectionProductSearch"),
    collectionSearchResults: document.getElementById("collectionSearchResults"),
    collectionPickedList: document.getElementById("collectionPickedList"),
    collectionPickedCount: document.getElementById("collectionPickedCount"),
    saveCollectionBtn: document.getElementById("saveCollectionBtn"),
    deleteCollectionBtn: document.getElementById("deleteCollectionBtn"),
    collectionFormError: document.getElementById("collectionFormError"),
    reviewsAdminList: document.getElementById("reviewsAdminList"),
    reviewsAdminEmpty: document.getElementById("reviewsAdminEmpty"),
    statReviewsPending: document.getElementById("statReviewsPending"),
    statReviewsApproved: document.getElementById("statReviewsApproved"),
    reviewsBadge: document.getElementById("reviewsBadge"),
    couponsTableBody: document.getElementById("couponsTableBody"),
    couponsEmpty: document.getElementById("couponsEmpty"),
    newCouponBtn: document.getElementById("newCouponBtn"),
    couponModalOverlay: document.getElementById("couponModalOverlay"),
    couponModalTitle: document.getElementById("couponModalTitle"),
    couponModalClose: document.getElementById("couponModalClose"),
    cancelCouponBtn: document.getElementById("cancelCouponBtn"),
    couponForm: document.getElementById("couponForm"),
    couponFieldId: document.getElementById("couponFieldId"),
    couponFieldCode: document.getElementById("couponFieldCode"),
    couponFieldType: document.getElementById("couponFieldType"),
    couponFieldValue: document.getElementById("couponFieldValue"),
    couponFieldExpires: document.getElementById("couponFieldExpires"),
    couponFieldActive: document.getElementById("couponFieldActive"),
    saveCouponBtn: document.getElementById("saveCouponBtn"),
    deleteCouponBtn: document.getElementById("deleteCouponBtn"),
    couponFormError: document.getElementById("couponFormError"),

    // pedidos
    ordersBadge: document.getElementById("ordersBadge"),
    statOrdersTotal: document.getElementById("statOrdersTotal"),
    statOrdersNew: document.getElementById("statOrdersNew"),
    statOrdersTotalSum: document.getElementById("statOrdersTotalSum"),
    refreshOrdersBtn: document.getElementById("refreshOrdersBtn"),
    orderStatusFilter: document.getElementById("orderStatusFilter"),
    ordersTableBody: document.getElementById("ordersTableBody"),
    ordersEmpty: document.getElementById("ordersEmpty"),
    orderModalOverlay: document.getElementById("orderModalOverlay"),
    orderModalClose: document.getElementById("orderModalClose"),
    orderModalBody: document.getElementById("orderModalBody"),
    downloadReceiptBtn: document.getElementById("downloadReceiptBtn"),

    // banners
    newBannerBtn: document.getElementById("newBannerBtn"),
    bannersGrid: document.getElementById("bannersGrid"),
    bannersEmpty: document.getElementById("bannersEmpty"),
    bannerModalOverlay: document.getElementById("bannerModalOverlay"),
    bannerModalClose: document.getElementById("bannerModalClose"),
    bannerModalTitle: document.getElementById("bannerModalTitle"),
    bannerForm: document.getElementById("bannerForm"),
    bannerFieldId: document.getElementById("bannerFieldId"),
    bannerFieldTitle: document.getElementById("bannerFieldTitle"),
    bannerFieldSubtitle: document.getElementById("bannerFieldSubtitle"),
    bannerFieldImageFile: document.getElementById("bannerFieldImageFile"),
    bannerFieldImageUrl: document.getElementById("bannerFieldImageUrl"),
    bannerImagePreview: document.getElementById("bannerImagePreview"),
    bannerImageUploadStatus: document.getElementById("bannerImageUploadStatus"),
    bannerFieldButtonText: document.getElementById("bannerFieldButtonText"),
    bannerFieldButtonLink: document.getElementById("bannerFieldButtonLink"),
    bannerFieldDest: document.getElementById("bannerFieldDest"),
    bannerCustomLinkWrap: document.getElementById("bannerCustomLinkWrap"),
    bannerFieldOrder: document.getElementById("bannerFieldOrder"),
    bannerFieldActive: document.getElementById("bannerFieldActive"),
    deleteBannerBtn: document.getElementById("deleteBannerBtn"),
    cancelBannerBtn: document.getElementById("cancelBannerBtn"),
    saveBannerBtn: document.getElementById("saveBannerBtn"),
    bannerFormError: document.getElementById("bannerFormError"),

    // ajustes
    tabSettings: document.getElementById("tabSettings"),
    tabCustomers: document.getElementById("tabCustomers"),
    statCustomersTotal: document.getElementById("statCustomersTotal"),
    statCustomersOrders: document.getElementById("statCustomersOrders"),
    statCustomersSpent: document.getElementById("statCustomersSpent"),
    exportCustomersBtn: document.getElementById("exportCustomersBtn"),
    customersTableBody: document.getElementById("customersTableBody"),
    customersEmpty: document.getElementById("customersEmpty"),
    settingsLogoPreview: document.getElementById("settingsLogoPreview"),
    settingsLogoFile: document.getElementById("settingsLogoFile"),
    settingsLogoUrl: document.getElementById("settingsLogoUrl"),
    settingsLogoStatus: document.getElementById("settingsLogoStatus"),
    settingsStoreName: document.getElementById("settingsStoreName"),
    settingsTagline: document.getElementById("settingsTagline"),
    settingsPrimaryColor: document.getElementById("settingsPrimaryColor"),
    settingsPrimaryColorHex: document.getElementById("settingsPrimaryColorHex"),
    settingsAccentColor: document.getElementById("settingsAccentColor"),
    settingsAccentColorHex: document.getElementById("settingsAccentColorHex"),
    settingsBgColor: document.getElementById("settingsBgColor"),
    settingsBgColorHex: document.getElementById("settingsBgColorHex"),
    settingsTextColor: document.getElementById("settingsTextColor"),
    settingsTextColorHex: document.getElementById("settingsTextColorHex"),
    settingsFontPair: document.getElementById("settingsFontPair"),
    settingsCardRadius: document.getElementById("settingsCardRadius"),
    settingsHeroTitle: document.getElementById("settingsHeroTitle"),
    settingsHeroAccent: document.getElementById("settingsHeroAccent"),
    settingsHeroSubtitle: document.getElementById("settingsHeroSubtitle"),
    settingsEyebrow: document.getElementById("settingsEyebrow"),
    settingsHeroNote: document.getElementById("settingsHeroNote"),
    settingsFooterDescription: document.getElementById("settingsFooterDescription"),
    settingsFooterBottom: document.getElementById("settingsFooterBottom"),
    settingsMetaDescription: document.getElementById("settingsMetaDescription"),
    settingsContactTitle: document.getElementById("settingsContactTitle"),
    settingsContactSubtitle: document.getElementById("settingsContactSubtitle"),
    settingsEmail: document.getElementById("settingsEmail"),
    settingsInstagram: document.getElementById("settingsInstagram"),
    settingsTiktok: document.getElementById("settingsTiktok"),
    settingsFacebook: document.getElementById("settingsFacebook"),
    settingsUpsellEnabled: document.getElementById("settingsUpsellEnabled"),
    settingsUpsellTitle: document.getElementById("settingsUpsellTitle"),
    settingsUpsellDescription: document.getElementById("settingsUpsellDescription"),
    settingsUpsellProductName: document.getElementById("settingsUpsellProductName"),
    settingsUpsellPrice: document.getElementById("settingsUpsellPrice"),
    settingsUpsellButtonText: document.getElementById("settingsUpsellButtonText"),
    settingsExchangeRate: document.getElementById("settingsExchangeRate"),
    settingsExchangeRateUpdated: document.getElementById("settingsExchangeRateUpdated"),
    settingsPagoMovilPhone: document.getElementById("settingsPagoMovilPhone"),
    settingsPagoMovilCedula: document.getElementById("settingsPagoMovilCedula"),
    settingsPagoMovilBank: document.getElementById("settingsPagoMovilBank"),
    settingsBinanceEmail: document.getElementById("settingsBinanceEmail"),
    settingsBinanceHolder: document.getElementById("settingsBinanceHolder"),
    settingsZelleEmail: document.getElementById("settingsZelleEmail"),
    settingsZelleHolder: document.getElementById("settingsZelleHolder"),
    saveSettingsBtn: document.getElementById("saveSettingsBtn"),
    settingsFormError: document.getElementById("settingsFormError"),
  };

  let allProducts = [];
  let pendingImageFile = null;
  let galleryRows = [];
  let galleryRowSeq = 0;

  /* ---------------------------------------------------------------
     Galería de fotos adicionales por producto
     --------------------------------------------------------------- */
  function renderGalleryList() {
    el.galleryList.innerHTML = galleryRows.map(row => {
      const previewSrc = row.file ? URL.createObjectURL(row.file) : (row.url ? resolveImagePath(row.url) : "");
      return `
        <div class="gallery-row-empty" data-gallery-row="${row.id}">
          <button type="button" class="gallery-remove" data-gallery-remove="${row.id}" title="Quitar">✕</button>
          ${previewSrc ? `<img src="${previewSrc}" alt="" style="width:100%;height:34px;object-fit:cover;border-radius:6px;">` : ""}
          <input type="file" accept="image/*" data-gallery-file="${row.id}">
          <input type="text" placeholder="o URL" value="${row.file ? "" : (row.url || "")}" data-gallery-url="${row.id}">
        </div>
      `;
    }).join("");
  }

  function addGalleryRow(url = "") {
    galleryRows.push({ id: galleryRowSeq++, url, file: null });
    renderGalleryList();
  }
  function removeGalleryRow(id) {
    galleryRows = galleryRows.filter(r => r.id !== id);
    renderGalleryList();
  }

  el.addGalleryPhotoBtn.addEventListener("click", () => addGalleryRow());

  el.galleryList.addEventListener("click", (e) => {
    const removeId = e.target.closest("[data-gallery-remove]")?.dataset.galleryRemove;
    if (removeId) removeGalleryRow(Number(removeId));
  });

  el.galleryList.addEventListener("change", (e) => {
    const fileId = e.target.closest("[data-gallery-file]")?.dataset.galleryFile;
    const urlId = e.target.closest("[data-gallery-url]")?.dataset.galleryUrl;
    if (fileId != null) {
      const row = galleryRows.find(r => r.id === Number(fileId));
      if (row && e.target.files[0]) {
        row.file = e.target.files[0];
        row.url = "";
        renderGalleryList();
      }
    }
    if (urlId != null) {
      const row = galleryRows.find(r => r.id === Number(urlId));
      if (row) {
        row.url = e.target.value.trim();
        row.file = null;
        renderGalleryList();
      }
    }
  });

  /* Reduce las fotos antes de subirlas (una foto de celular de 2-4 MB queda en ~100 KB sin que se note).
     Conserva la transparencia. Si el navegador no puede, o el archivo ya es liviano, se sube tal cual. */
  async function compressForUpload(file, maxSide) {
    try {
      if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
      const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
      const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(bmp, 0, 0, w, h);
      if (bmp.close) bmp.close();
      const blob = await new Promise(res => canvas.toBlob(res, "image/webp", 0.85));
      if (!blob || blob.type !== "image/webp") return file;
      if (scale === 1 && blob.size >= file.size * 0.95) return file;
      return blob;
    } catch (e) { return file; }
  }
  const uploadExt = (up, orig) => (up.type === "image/webp" ? "webp" : (orig.name.split(".").pop() || "jpg"));
  const uploadOpts = up => ({ upsert: false, contentType: up.type || undefined, cacheControl: "31536000" });

  async function buildGalleryImagesArray() {
    const urls = [];
    for (const row of galleryRows) {
      if (row.file) {
        const up = await compressForUpload(row.file, 1200);
        const ext = uploadExt(up, row.file);
        const path = `producto-galeria-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
        const { error } = await supabaseClient.storage.from("product-images").upload(path, up, uploadOpts(up));
        if (error) throw new Error("No se pudo subir una foto de la galería: " + error.message);
        const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      } else if (row.url) {
        urls.push(row.url);
      }
    }
    return urls;
  }

  /* ---------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------- */
  function money(n) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    return "$" + Number(n).toFixed(2).replace(/\.00$/, "");
  }

  // Las rutas de imagen del catálogo semilla son relativas a la RAÍZ del
  // sitio (ej. "images/p3_tl.jpg"). Siempre devolvemos una ruta absoluta
  // (empezando con "/") para que funcione sin importar cómo esté escrita
  // la URL del panel (con o sin barra final).
  function resolveImagePath(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path) || path.startsWith("/")) return path;
    return "/" + path;
  }

  function showToast(msg, isError) {
    el.toast.textContent = msg;
    el.toast.classList.toggle("error", Boolean(isError));
    el.toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { el.toast.hidden = true; }, 3200);
  }

  function normalize(str) {
    return (str || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /* ---------------------------------------------------------------
     Arranque: si Supabase no está listo, avisar y detener aquí
     --------------------------------------------------------------- */
  if (!SUPABASE_READY) {
    el.configWarning.hidden = false;
    el.loginBtn.disabled = true;
    el.loginBtn.textContent = "Configura Supabase primero";
  }

  /* ---------------------------------------------------------------
     Autenticación
     --------------------------------------------------------------- */
  async function checkSession() {
    if (!SUPABASE_READY) return;
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      enterAdmin(data.session.user);
    }
  }

  el.loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!SUPABASE_READY) return;

    el.loginError.hidden = true;
    el.loginBtn.disabled = true;
    el.loginBtn.textContent = "Entrando…";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: el.loginEmail.value.trim(),
      password: el.loginPassword.value,
    });

    el.loginBtn.disabled = false;
    el.loginBtn.textContent = "Entrar al panel";

    if (error) {
      el.loginError.textContent = "Correo o contraseña incorrectos. Verifica con quien administra el equipo.";
      el.loginError.hidden = false;
      return;
    }
    enterAdmin(data.user);
  });

  el.logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.reload();
  });

  function enterAdmin(user) {
    el.loginScreen.hidden = true;
    el.adminApp.hidden = false;
    el.adminUserEmail.textContent = user.email;
    loadProducts();
    loadOrders();
    loadBanners();
    loadCoupons();
    loadReviewsAdmin();
    loadRestockAdmin();
    loadBrandLogosAdmin();
    loadCollectionsAdmin();
    loadSettings();
  }

  /* ---------------------------------------------------------------
     Pestañas (Productos / Pedidos / Banners)
     --------------------------------------------------------------- */
  const tabPanels = { summary: el.tabSummary, products: el.tabProducts, orders: el.tabOrders, banners: el.tabBanners, coupons: el.tabCoupons, reviews: el.tabReviews, restock: el.tabRestock, brandlogos: el.tabBrandLogos, collections: el.tabCollections, settings: el.tabSettings, customers: el.tabCustomers };
  el.tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      el.tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      Object.entries(tabPanels).forEach(([key, panel]) => {
        panel.hidden = key !== btn.dataset.tab;
      });
    });
  });

  /* ---------------------------------------------------------------
     Cargar / listar productos
     --------------------------------------------------------------- */
  async function loadProducts() {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      showToast("No se pudo cargar el catálogo: " + error.message, true);
      return;
    }
    allProducts = data || [];
    paintStats();
    buildFilterOptions();
    buildFormDatalists();
    renderTable();
    renderBrandLogosAdmin();
  }

  function paintStats() {
    el.statTotal.textContent = allProducts.length;
    el.statAvail.textContent = allProducts.filter(p => p.avail).length;
    el.statBrands.textContent = new Set(allProducts.map(p => p.brand)).size;
  }

  function buildFilterOptions() {
    const cats = Array.from(new Set(allProducts.map(p => p.category))).sort((a, b) => a.localeCompare(b, "es"));
    const brands = Array.from(new Set(allProducts.map(p => p.brand))).sort((a, b) => a.localeCompare(b, "es"));

    el.adminCategoryFilter.innerHTML = '<option value="">Todas las categorías</option>' +
      cats.map(c => `<option value="${c}">${c}</option>`).join("");
    el.adminBrandFilter.innerHTML = '<option value="">Todas las marcas</option>' +
      brands.map(b => `<option value="${b}">${b}</option>`).join("");
    syncBannerDestCategories();
  }

  // La lista «Al hacer clic en el banner, ir a» trae las categorías de siempre; aquí se agregan las NUEVAS que existan en los productos (ej. «Kits»).
  function syncBannerDestCategories() {
    const group = el.bannerFieldDest && el.bannerFieldDest.querySelector('optgroup[label="Categorías"]');
    if (!group) return;
    const ya = new Set(Array.from(group.querySelectorAll("option")).map(o => o.value));
    const otros = group.querySelector('option[value="categoria:Otros"]');
    Array.from(new Set(allProducts.map(p => p.category).filter(Boolean))).sort((x, y) => x.localeCompare(y, "es")).forEach(c => {
      if (ya.has("categoria:" + c)) return;
      const opt = document.createElement("option"); opt.value = "categoria:" + c; opt.textContent = c;
      if (otros) group.insertBefore(opt, otros); else group.appendChild(opt);
    });
  }

  // Si ya existe una marca escrita distinto solo en mayúsculas/minúsculas
  // (ej. "purpure" vs "Purpure"), usa la que ya está guardada — así nunca
  // se crean marcas "duplicadas" por un error de tipeo.
  function resolveBrandCasing(inputBrand) {
    const trimmed = (inputBrand || "").trim();
    if (!trimmed) return trimmed;
    const existing = allProducts.find(
      p => p.brand && p.brand.toLowerCase() === trimmed.toLowerCase()
    );
    return existing ? existing.brand : trimmed;
  }

  function buildFormDatalists() {
    const cats = Array.from(new Set(allProducts.map(p => p.category))).sort((a, b) => a.localeCompare(b, "es"));
    const brands = Array.from(new Set(allProducts.map(p => p.brand))).sort((a, b) => a.localeCompare(b, "es"));
    el.categoryOptions.innerHTML = cats.map(c => `<option value="${c}">`).join("");
    el.brandOptions.innerHTML = brands.map(b => `<option value="${b}">`).join("");
  }

  function getFiltered() {
    const q = normalize(el.adminSearch.value.trim());
    const cat = el.adminCategoryFilter.value;
    const brand = el.adminBrandFilter.value;
    const availFilter = el.adminAvailFilter.value; // "", "true", "false"
    const onlyFeatured = el.adminFeaturedFilter.checked;

    return allProducts.filter(p => {
      if (cat && p.category !== cat) return false;
      if (brand && p.brand !== brand) return false;
      if (availFilter && String(p.avail) !== availFilter) return false;
      if (onlyFeatured && !p.featured) return false;
      if (q) {
        const haystack = normalize(`${p.name} ${p.brand} ${p.category} ${p.ref}`);
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  function renderTable() {
    const list = getFiltered();
    el.adminResultsCount.textContent = `Mostrando ${list.length} de ${allProducts.length} productos`;

    if (!list.length) {
      el.adminTableBody.innerHTML = "";
      el.adminEmpty.hidden = false;
      return;
    }
    el.adminEmpty.hidden = true;

    el.adminTableBody.innerHTML = list.map(p => `
      <tr data-id="${p.id}">
        <td class="col-img"><img class="row-thumb" src="${resolveImagePath(p.image)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'"></td>
        <td>
          <div class="row-name">${p.featured ? "⭐ " : ""}${p.name}</div>
          <div class="row-ref">${p.ref ? "Ref: " + p.ref : "Sin referencia"}</div>
        </td>
        <td>${p.brand}</td>
        <td>${p.category}</td>
        <td>${money(p.detal)}</td>
        <td>${money(p.mayor)}</td>
        <td class="stock-cell">${p.stock === null || p.stock === undefined ? "<span class=\"stock-unlimited\">—</span>" : (Number(p.stock) <= 5 ? `<span class="stock-low">${p.stock}</span>` : p.stock)}</td>
        <td>
          <button class="status-chip ${p.avail ? "avail" : "unavail"}" data-toggle-avail="${p.id}">
            ${p.avail ? "Disponible" : "Agotado"}
          </button>
        </td>
        <td class="col-actions">
          <div class="row-actions">
            <button data-edit="${p.id}" title="Editar">✎</button>
            <button data-delete="${p.id}" title="Eliminar">🗑</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  [el.adminSearch, el.adminCategoryFilter, el.adminBrandFilter, el.adminAvailFilter, el.adminFeaturedFilter].forEach(node => {
    node.addEventListener("input", renderTable);
    node.addEventListener("change", renderTable);
  });

  // Delegación de eventos sobre la tabla (editar, borrar, toggle disponible)
  el.adminTableBody.addEventListener("click", async (e) => {
    const editId = e.target.closest("[data-edit]")?.dataset.edit;
    const delId = e.target.closest("[data-delete]")?.dataset.delete;
    const toggleId = e.target.closest("[data-toggle-avail]")?.dataset.toggleAvail;

    if (editId) openProductModal(allProducts.find(p => String(p.id) === editId));
    if (delId) confirmDeleteProduct(delId);
    if (toggleId) await toggleAvailability(toggleId);
  });

  async function toggleAvailability(id) {
    const product = allProducts.find(p => String(p.id) === String(id));
    if (!product) return;
    const { error } = await supabaseClient
      .from("products")
      .update({ avail: !product.avail })
      .eq("id", id);

    if (error) {
      showToast("No se pudo actualizar: " + error.message, true);
      return;
    }
    product.avail = !product.avail;
    paintStats();
    renderTable();
    showToast(product.avail ? "Marcado como disponible" : "Marcado como agotado");
  }

  async function confirmDeleteProduct(id) {
    const product = allProducts.find(p => String(p.id) === String(id));
    if (!product) return;
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;

    const { error } = await supabaseClient.from("products").delete().eq("id", id);
    if (error) {
      showToast("No se pudo eliminar: " + error.message, true);
      return;
    }
    allProducts = allProducts.filter(p => String(p.id) !== String(id));
    paintStats();
    renderTable();
    showToast("Producto eliminado");
  }

  /* ---------------------------------------------------------------
     PEDIDOS: cargar, listar, cambiar estado, ver detalle
     --------------------------------------------------------------- */
  let allOrders = [];
  let currentViewedOrder = null;

  async function loadOrders() {
    const { data, error } = await supabaseClient
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("No se pudieron cargar los pedidos:", error.message);
      return;
    }
    allOrders = data || [];
    paintOrderStats();
    renderOrders();
    renderCustomers();
  }

  function paintOrderStats() {
    el.statOrdersTotal.textContent = allOrders.length;
    const newCount = allOrders.filter(o => o.status === "nuevo").length;
    el.statOrdersNew.textContent = newCount;
    el.statOrdersTotalSum.textContent = money(allOrders.reduce((s, o) => s + (Number(o.total) || 0), 0));
    el.ordersBadge.textContent = newCount;
    el.ordersBadge.hidden = newCount === 0;
    renderSummary();
  }

  /* ---------------------------------------------------------------
     Resumen de ventas (tab nueva)
     --------------------------------------------------------------- */
  function isSameDay(a, b) { return a.toDateString() === b.toDateString(); }

  function startOfWeek(d) {
    const date = new Date(d);
    const day = date.getDay(); // 0=domingo
    const diff = day === 0 ? 6 : day - 1; // semana empieza lunes
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function renderSummary() {
    const sumTodayEl = document.getElementById("sumToday");
    if (!sumTodayEl) return;
    const validOrders = allOrders.filter(o => o.status !== "cancelado");
    const now = new Date();
    const weekStart = startOfWeek(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let today = 0, week = 0, month = 0, total = 0;
    validOrders.forEach(o => {
      const t = Number(o.total) || 0;
      const created = new Date(o.created_at);
      total += t;
      if (created >= monthStart) month += t;
      if (created >= weekStart) week += t;
      if (isSameDay(created, now)) today += t;
    });

    document.getElementById("sumToday").textContent = money(today);
    document.getElementById("sumWeek").textContent = money(week);
    document.getElementById("sumMonth").textContent = money(month);
    document.getElementById("sumTotal").textContent = money(total);

    // Pedidos por estado
    const STATUS_META = {
      nuevo: { label: "Nuevo", color: "#D6336C" },
      tomado: { label: "Pedido Tomado", color: "#E8A33D" },
      entregado: { label: "Entregado", color: "#3f9d5f" },
      cancelado: { label: "Cancelado", color: "#a3968d" },
    };
    const statusCounts = { nuevo: 0, tomado: 0, entregado: 0, cancelado: 0 };
    allOrders.forEach(o => { if (statusCounts[o.status] !== undefined) statusCounts[o.status]++; });
    const maxCount = Math.max(1, ...Object.values(statusCounts));
    const statusBarsEl = document.getElementById("summaryStatusBars");
    if (statusBarsEl) {
      statusBarsEl.innerHTML = Object.entries(statusCounts).map(([key, count]) => `
        <div class="status-bar-row">
          <span class="status-bar-label">${STATUS_META[key].label}</span>
          <div class="status-bar-track"><div class="status-bar-fill" style="width:${(count / maxCount) * 100}%; background:${STATUS_META[key].color}"></div></div>
          <span class="status-bar-count">${count}</span>
        </div>
      `).join("");
    }

    // Productos más vendidos (por cantidad, sumando todos los pedidos no cancelados)
    const qtyByProduct = {};
    validOrders.forEach(o => {
      (Array.isArray(o.items) ? o.items : []).forEach(item => {
        const key = item.name || "Producto";
        qtyByProduct[key] = (qtyByProduct[key] || 0) + (Number(item.qty) || 1);
      });
    });
    const topProducts = Object.entries(qtyByProduct).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topListEl = document.getElementById("summaryTopProducts");
    if (topListEl) {
      topListEl.innerHTML = topProducts.length
        ? topProducts.map(([name, qty]) => `<li><span>${name}</span><strong>${qty} vendidos</strong></li>`).join("")
        : `<li class="summary-empty">Todavía no hay ventas registradas</li>`;
    }

    // Últimos 5 pedidos
    const recentEl = document.getElementById("summaryRecentOrders");
    if (recentEl) {
      const recent = allOrders.slice(0, 5);
      recentEl.innerHTML = recent.length
        ? recent.map(o => `
            <div class="summary-recent-row">
              <div>
                <strong>${o.customer_name || "Cliente"}</strong>
                <span class="summary-recent-date">${new Date(o.created_at).toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" })}</span>
              </div>
              <span class="order-status-select ${o.status}" style="pointer-events:none;">${STATUS_META[o.status]?.label || o.status}</span>
              <strong>${money(o.total)}</strong>
            </div>
          `).join("")
        : `<p class="summary-empty">Todavía no hay pedidos</p>`;
    }
  }

  function renderOrders() {
    const statusFilter = el.orderStatusFilter.value;
    const list = statusFilter ? allOrders.filter(o => o.status === statusFilter) : allOrders;

    if (!list.length) {
      el.ordersTableBody.innerHTML = "";
      el.ordersEmpty.hidden = false;
      return;
    }
    el.ordersEmpty.hidden = true;

    el.ordersTableBody.innerHTML = list.map(o => {
      const date = o.created_at ? new Date(o.created_at).toLocaleString("es-VE", { dateStyle: "short", timeStyle: "short" }) : "—";
      return `
        <tr data-order-id="${o.id}">
          <td>${date}</td>
          <td>
            <div class="row-name">${o.customer_name}</div>
            <div class="row-ref">${o.city}${o.customer_cedula ? ` · Cédula ${o.customer_cedula}` : ""}</div>
          </td>
          <td>${o.phone}</td>
          <td>${o.delivery_method}</td>
          <td>${o.payment_method}${o.cash_photo_url ? ` <span class="order-proof-badge" title="Tiene comprobante de pago adjunto">📎</span>` : ""}</td>
          <td>${money(o.total)}</td>
          <td>
            <select class="order-status-select ${o.status}" data-order-status="${o.id}">
              <option value="nuevo" ${o.status === "nuevo" ? "selected" : ""}>Nuevo</option>
              <option value="tomado" ${o.status === "tomado" ? "selected" : ""}>Pedido Tomado</option>
              <option value="entregado" ${o.status === "entregado" ? "selected" : ""}>Entregado</option>
              <option value="cancelado" ${o.status === "cancelado" ? "selected" : ""}>Cancelado</option>
            </select>
          </td>
          <td class="col-actions">
            <div class="row-actions">
              <button data-view-order="${o.id}" title="Ver detalle">👁</button>
              <button data-delete-order="${o.id}" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  el.orderStatusFilter.addEventListener("change", renderOrders);
  el.refreshOrdersBtn.addEventListener("click", () => { loadOrders(); showToast("Pedidos actualizados"); });

  el.ordersTableBody.addEventListener("change", async (e) => {
    const id = e.target.closest("[data-order-status]")?.dataset.orderStatus;
    if (!id) return;
    const newStatus = e.target.value;
    const { error } = await supabaseClient.from("orders").update({ status: newStatus }).eq("id", id);
    if (error) { showToast("No se pudo actualizar el estado: " + error.message, true); return; }
    const order = allOrders.find(o => String(o.id) === String(id));
    if (order) order.status = newStatus;
    e.target.className = "order-status-select " + newStatus;
    paintOrderStats();
  });

  el.ordersTableBody.addEventListener("click", async (e) => {
    const viewId = e.target.closest("[data-view-order]")?.dataset.viewOrder;
    const delId = e.target.closest("[data-delete-order]")?.dataset.deleteOrder;
    if (viewId) openOrderModal(allOrders.find(o => String(o.id) === String(viewId)));
    if (delId) {
      if (!window.confirm("¿Eliminar este pedido? Esta acción no se puede deshacer.")) return;
      const { error } = await supabaseClient.from("orders").delete().eq("id", delId);
      if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
      allOrders = allOrders.filter(o => String(o.id) !== String(delId));
      paintOrderStats();
      renderOrders();
      showToast("Pedido eliminado");
    }
  });

  function openOrderModal(order) {
    if (!order) return;
    currentViewedOrder = order;
    const date = order.created_at ? new Date(order.created_at).toLocaleString("es-VE", { dateStyle: "long", timeStyle: "short" }) : "—";
    const items = Array.isArray(order.items) ? order.items : [];
    el.orderModalBody.innerHTML = `
      <div class="order-detail-row"><span>Fecha</span><strong>${date}</strong></div>
      <div class="order-detail-row"><span>Cliente</span><strong>${order.customer_name}</strong></div>
       ${order.customer_cedula ? `<div class="order-detail-row"><span>Cédula / RIF</span><strong>${order.customer_cedula}</strong></div>` : ""}
      <div class="order-detail-row"><span>Teléfono</span><strong>${order.phone}</strong></div>
      <div class="order-detail-row"><span>Ciudad</span><strong>${order.city}</strong></div>
      <div class="order-detail-row"><span>Método de pago</span><strong>${order.payment_method}</strong></div>
      <div class="order-detail-row"><span>Entrega</span><strong>${order.delivery_method}</strong></div>
      ${order.address ? `<div class="order-detail-row"><span>Dirección</span><strong>${order.address}</strong></div>` : ""}
      ${order.note ? `<div class="order-detail-row"><span>Nota</span><strong>${order.note}</strong></div>` : ""}
      ${order.cash_photo_url ? `
        <div class="order-payment-proof">
          <span>Comprobante de pago</span>
          <a href="${order.cash_photo_url}" target="_blank" rel="noopener">
            <img src="${order.cash_photo_url}" alt="Comprobante de pago" loading="lazy">
            <span class="order-payment-proof-link">Ver en tamaño completo ↗</span>
          </a>
        </div>
      ` : ""}
      <div class="order-items-list">
        ${items.map(it => `<div class="order-item-line"><span>${it.qty}x ${it.name}</span><span>${money(it.price * it.qty)}</span></div>`).join("")}
      </div>
      <div class="order-total-line"><span>Total (${order.price_mode === "mayor" ? "Mayor" : "Detal"})</span><span>${money(order.total)}</span></div>
    `;
    el.orderModalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  el.orderModalClose.addEventListener("click", () => {
    el.orderModalOverlay.hidden = true;
    document.body.style.overflow = "";
  });
  el.orderModalOverlay.addEventListener("click", e => {
    if (e.target === el.orderModalOverlay) { el.orderModalOverlay.hidden = true; document.body.style.overflow = ""; }
  });

  /* ---------------------------------------------------------------
     Descargar recibo del pedido (imprimir → guardar como PDF)
     --------------------------------------------------------------- */
  const STATUS_LABELS = { nuevo: "Nuevo", tomado: "Pedido Tomado", entregado: "Entregado", cancelado: "Cancelado" };

  function buildReceipt(order) {
    const date = order.created_at
      ? new Date(order.created_at).toLocaleString("es-VE", { dateStyle: "long", timeStyle: "short" })
      : "—";
    const items = Array.isArray(order.items) ? order.items : [];

    document.getElementById("receiptOrderId").textContent = "#" + String(order.id).padStart(5, "0");
    document.getElementById("receiptDate").textContent = date;
    document.getElementById("receiptStatus").textContent = STATUS_LABELS[order.status] || order.status;
    document.getElementById("receiptName").textContent = order.customer_name || "—";
    document.getElementById("receiptPhone").textContent = order.phone || "—";
    document.getElementById("receiptCity").textContent = order.city || "—";
    document.getElementById("receiptPayment").textContent = order.payment_method || "—";
    document.getElementById("receiptDelivery").textContent = order.delivery_method || "—";
    document.getElementById("receiptAddress").textContent = order.address || "—";

    const noteRow = document.getElementById("receiptNoteRow");
    if (order.note) {
      noteRow.hidden = false;
      document.getElementById("receiptNote").textContent = order.note;
    } else {
      noteRow.hidden = true;
    }

    // Busca la miniatura de cada producto en el catálogo cargado
    const rows = items.map(it => {
      const product = allProducts.find(p => String(p.id) === String(it.id));
      const img = product ? resolveImagePath(product.image) : "";
      return `
        <tr>
          <td class="receipt-thumb-cell">${img ? `<img src="${img}" alt="">` : ""}</td>
          <td>${it.name}</td>
          <td>${it.qty}</td>
          <td>${money(it.price)}</td>
          <td>${money(it.price * it.qty)}</td>
        </tr>
      `;
    }).join("");
    document.getElementById("receiptItemsBody").innerHTML = rows;

    document.getElementById("receiptPriceMode").textContent = order.price_mode === "mayor" ? "Mayor" : "Detal";
    document.getElementById("receiptTotal").textContent = money(order.total);
  }

  el.downloadReceiptBtn.addEventListener("click", () => {
    if (!currentViewedOrder) return;
    buildReceipt(currentViewedOrder);
    document.body.classList.add("printing-receipt");
    window.print();
  });

  window.addEventListener("afterprint", () => {
    document.body.classList.remove("printing-receipt");
  });

  /* ---------------------------------------------------------------
     CLIENTES: agrupa los pedidos por teléfono (cada cliente una sola
     vez, con su historial acumulado) — útil para armar audiencias de
     anuncios (Meta/Facebook Ads, Google Ads) con el botón de exportar.
     --------------------------------------------------------------- */
  function buildCustomersList() {
    const map = new Map(); // clave: teléfono normalizado
    allOrders.forEach(o => {
      const key = (o.phone || "").replace(/\D/g, "") || o.customer_name;
      if (!map.has(key)) {
        map.set(key, {
          name: o.customer_name, phone: o.phone, email: o.email || "",
          city: o.city, orderCount: 0, totalSpent: 0, lastOrderDate: o.created_at,
        });
      }
      const c = map.get(key);
      c.orderCount += 1;
      c.totalSpent += Number(o.total) || 0;
      if (!c.email && o.email) c.email = o.email;
      if (new Date(o.created_at) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = o.created_at;
        c.name = o.customer_name; // se queda con el nombre/ciudad más reciente
        c.city = o.city;
      }
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate));
  }

  function renderCustomers() {
    const customers = buildCustomersList();

    el.statCustomersTotal.textContent = customers.length;
    el.statCustomersOrders.textContent = allOrders.length;
    el.statCustomersSpent.textContent = money(customers.reduce((s, c) => s + c.totalSpent, 0));

    if (!customers.length) {
      el.customersTableBody.innerHTML = "";
      el.customersEmpty.hidden = false;
      return;
    }
    el.customersEmpty.hidden = true;

    el.customersTableBody.innerHTML = customers.map(c => {
      const lastDate = c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString("es-VE", { dateStyle: "medium" }) : "—";
      return `
        <tr>
          <td>${c.name}</td>
          <td>${c.phone}</td>
          <td>${c.email || "—"}</td>
          <td>${c.city}</td>
          <td>${c.orderCount}</td>
          <td>${money(c.totalSpent)}</td>
          <td>${lastDate}</td>
        </tr>
      `;
    }).join("");
  }

  el.exportCustomersBtn.addEventListener("click", () => {
    const customers = buildCustomersList();
    if (!customers.length) { showToast("No hay clientes para exportar todavía", true); return; }

    const headers = ["Nombre", "Telefono", "Correo", "Ciudad", "Pedidos", "Total_Comprado", "Ultimo_Pedido"];
    const csvRows = [headers.join(",")];
    customers.forEach(c => {
      const row = [
        `"${(c.name || "").replace(/"/g, '""')}"`,
        `"${c.phone || ""}"`,
        `"${c.email || ""}"`,
        `"${(c.city || "").replace(/"/g, '""')}"`,
        c.orderCount,
        c.totalSpent.toFixed(2),
        c.lastOrderDate ? new Date(c.lastOrderDate).toISOString().slice(0, 10) : "",
      ];
      csvRows.push(row.join(","));
    });
    const csvContent = "\uFEFF" + csvRows.join("\r\n"); // BOM para que Excel abra bien los acentos

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes-shopicol-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exportados ${customers.length} clientes`);
  });

  /* ---------------------------------------------------------------
     BANNERS: cargar, listar, crear, editar, eliminar
     --------------------------------------------------------------- */
  let allBanners = [];
  let allCoupons = [];
  let pendingBannerImageFile = null;

  async function loadBanners() {
    const { data, error } = await supabaseClient
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn("No se pudieron cargar los banners:", error.message);
      return;
    }
    allBanners = data || [];
    renderBannersAdmin();
  }

  function renderBannersAdmin() {
    if (!allBanners.length) {
      el.bannersGrid.innerHTML = "";
      el.bannersEmpty.hidden = false;
      return;
    }
    el.bannersEmpty.hidden = true;
    el.bannersGrid.innerHTML = allBanners.map(b => `
      <div class="banner-card" data-banner-id="${b.id}">
        <div class="banner-card-img" style="background-image:url('${(b.image || "").replace(/'/g, "\\'")}')">
          ${!b.active ? '<span class="inactive-tag">Inactivo</span>' : ""}
        </div>
        <div class="banner-card-body">
          <h4>${b.title}</h4>
          <p>${b.subtitle || "Sin subtítulo"}</p>
          <div class="banner-card-actions">
            <button data-edit-banner="${b.id}">Editar</button>
            <button data-delete-banner="${b.id}">Eliminar</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  el.bannersGrid.addEventListener("click", async (e) => {
    const editId = e.target.closest("[data-edit-banner]")?.dataset.editBanner;
    const delId = e.target.closest("[data-delete-banner]")?.dataset.deleteBanner;
    if (editId) openBannerModal(allBanners.find(b => String(b.id) === String(editId)));
    if (delId) {
      if (!window.confirm("¿Eliminar este banner?")) return;
      const { error } = await supabaseClient.from("banners").delete().eq("id", delId);
      if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
      allBanners = allBanners.filter(b => String(b.id) !== String(delId));
      renderBannersAdmin();
      showToast("Banner eliminado");
    }
  });

  function openBannerModal(banner) {
    el.bannerFormError.hidden = true;
    pendingBannerImageFile = null;
    el.bannerFieldImageFile.value = "";
    el.bannerImageUploadStatus.textContent = "";

    if (banner) {
      el.bannerModalTitle.textContent = "Editar banner";
      el.bannerFieldId.value = banner.id;
      el.bannerFieldTitle.value = banner.title || "";
      el.bannerFieldSubtitle.value = banner.subtitle || "";
      el.bannerFieldImageUrl.value = banner.image || "";
      el.bannerFieldButtonText.value = banner.button_text || "";
      const savedLink = banner.button_link || "";
      const destOpt = Array.from(el.bannerFieldDest.options).find(o => o.value === savedLink && o.value !== "custom");
      el.bannerFieldDest.value = !savedLink ? "" : (destOpt ? savedLink : "custom");
      el.bannerFieldButtonLink.value = el.bannerFieldDest.value === "custom" ? savedLink : "";
      el.bannerFieldOrder.value = banner.sort_order || 0;
      el.bannerFieldActive.checked = Boolean(banner.active);
      if (banner.image) {
        el.bannerImagePreview.src = banner.image;
        el.bannerImagePreview.hidden = false;
      } else {
        el.bannerImagePreview.hidden = true;
      }
      el.deleteBannerBtn.hidden = false;
      el.deleteBannerBtn.onclick = async () => {
        if (!window.confirm("¿Eliminar este banner?")) return;
        const { error } = await supabaseClient.from("banners").delete().eq("id", banner.id);
        if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
        allBanners = allBanners.filter(b => String(b.id) !== String(banner.id));
        renderBannersAdmin();
        closeBannerModal();
        showToast("Banner eliminado");
      };
    } else {
      el.bannerModalTitle.textContent = "Nuevo banner";
      el.bannerForm.reset();
      el.bannerFieldId.value = "";
      el.bannerFieldActive.checked = true;
      el.bannerImagePreview.hidden = true;
      el.deleteBannerBtn.hidden = true;
    }
    el.bannerCustomLinkWrap.hidden = el.bannerFieldDest.value !== "custom";
    el.bannerModalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  el.bannerFieldDest.addEventListener("change", () => {
    el.bannerCustomLinkWrap.hidden = el.bannerFieldDest.value !== "custom";
  });

  function closeBannerModal() {
    el.bannerModalOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  el.newBannerBtn.addEventListener("click", () => openBannerModal(null));
  el.bannerModalClose.addEventListener("click", closeBannerModal);
  el.cancelBannerBtn.addEventListener("click", closeBannerModal);
  el.bannerModalOverlay.addEventListener("click", e => { if (e.target === el.bannerModalOverlay) closeBannerModal(); });

  el.bannerFieldImageFile.addEventListener("change", () => {
    const file = el.bannerFieldImageFile.files[0];
    if (!file) return;
    pendingBannerImageFile = file;
    el.bannerImagePreview.src = URL.createObjectURL(file);
    el.bannerImagePreview.hidden = false;
    el.bannerImageUploadStatus.textContent = "Se subirá al guardar: " + file.name;
  });
  el.bannerFieldImageUrl.addEventListener("input", () => {
    if (el.bannerFieldImageUrl.value.trim()) {
      pendingBannerImageFile = null;
      el.bannerFieldImageFile.value = "";
      el.bannerImagePreview.src = el.bannerFieldImageUrl.value.trim();
      el.bannerImagePreview.hidden = false;
    }
  });

  async function uploadBannerImageIfNeeded() {
    if (!pendingBannerImageFile) return el.bannerFieldImageUrl.value.trim();
    el.bannerImageUploadStatus.textContent = "Subiendo imagen…";
    const up = await compressForUpload(pendingBannerImageFile, 2400);
    const ext = uploadExt(up, pendingBannerImageFile);
    const path = `banner-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    const { error: uploadError } = await supabaseClient.storage.from("product-images").upload(path, up, uploadOpts(up));
    if (uploadError) throw new Error("No se pudo subir la imagen: " + uploadError.message);
    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
    el.bannerImageUploadStatus.textContent = "Imagen subida ✓";
    return data.publicUrl;
  }

  el.bannerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.bannerFormError.hidden = true;
    el.saveBannerBtn.disabled = true;
    el.saveBannerBtn.textContent = "Guardando…";

    try {
      const imageUrl = await uploadBannerImageIfNeeded();
      const payload = {
        title: el.bannerFieldTitle.value.trim(),
        subtitle: el.bannerFieldSubtitle.value.trim(),
        image: imageUrl || "",
        button_text: el.bannerFieldButtonText.value.trim(),
        button_link: el.bannerFieldDest.value === "custom" ? el.bannerFieldButtonLink.value.trim() : el.bannerFieldDest.value,
        sort_order: parseInt(el.bannerFieldOrder.value, 10) || 0,
        active: el.bannerFieldActive.checked,
      };
      const id = el.bannerFieldId.value;
      let error;
      if (id) {
        ({ error } = await supabaseClient.from("banners").update(payload).eq("id", id));
      } else {
        ({ error } = await supabaseClient.from("banners").insert(payload));
      }
      if (error) throw new Error(error.message);

      showToast(id ? "Banner actualizado" : "Banner creado");
      closeBannerModal();
      await loadBanners();
    } catch (err) {
      el.bannerFormError.textContent = err.message;
      el.bannerFormError.hidden = false;
    } finally {
      el.saveBannerBtn.disabled = false;
      el.saveBannerBtn.textContent = "Guardar banner";
    }
  });

  /* ---------------------------------------------------------------
     Cupones de descuento
     --------------------------------------------------------------- */
  async function loadCoupons() {
    const { data, error } = await supabaseClient
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("No se pudieron cargar los cupones:", error.message);
      return;
    }
    allCoupons = data || [];
    renderCouponsAdmin();
  }

  function renderCouponsAdmin() {
    if (!allCoupons.length) {
      el.couponsTableBody.innerHTML = "";
      el.couponsEmpty.hidden = false;
      return;
    }
    el.couponsEmpty.hidden = true;
    const now = new Date();
    el.couponsTableBody.innerHTML = allCoupons.map(c => {
      const expired = c.expires_at && new Date(c.expires_at) < now;
      const discountLabel = c.discount_type === "percent" ? `${c.discount_value}%` : money(c.discount_value);
      const statusLabel = expired ? "Vencido" : (c.active ? "Activo" : "Inactivo");
      const statusClass = expired ? "inactive" : (c.active ? "active" : "inactive");
      return `
        <tr data-coupon-id="${c.id}">
          <td><strong>${c.code}</strong></td>
          <td>${discountLabel}</td>
          <td>${c.expires_at ? new Date(c.expires_at).toLocaleDateString("es-VE") : "—"}</td>
          <td><span class="coupon-status ${statusClass}">${statusLabel}</span></td>
          <td>
            <button data-edit-coupon="${c.id}">Editar</button>
            <button data-delete-coupon="${c.id}">Eliminar</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  el.couponsTableBody.addEventListener("click", async (e) => {
    const editId = e.target.closest("[data-edit-coupon]")?.dataset.editCoupon;
    const delId = e.target.closest("[data-delete-coupon]")?.dataset.deleteCoupon;
    if (editId) openCouponModal(allCoupons.find(c => String(c.id) === String(editId)));
    if (delId) {
      if (!window.confirm("¿Eliminar este cupón?")) return;
      const { error } = await supabaseClient.from("coupons").delete().eq("id", delId);
      if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
      allCoupons = allCoupons.filter(c => String(c.id) !== String(delId));
      renderCouponsAdmin();
      showToast("Cupón eliminado");
    }
  });

  function openCouponModal(coupon) {
    el.couponFormError.hidden = true;
    if (coupon) {
      el.couponModalTitle.textContent = "Editar cupón";
      el.couponFieldId.value = coupon.id;
      el.couponFieldCode.value = coupon.code || "";
      el.couponFieldType.value = coupon.discount_type || "percent";
      el.couponFieldValue.value = coupon.discount_value ?? "";
      el.couponFieldExpires.value = coupon.expires_at ? coupon.expires_at.slice(0, 10) : "";
      el.couponFieldActive.checked = Boolean(coupon.active);
      el.deleteCouponBtn.hidden = false;
      el.deleteCouponBtn.onclick = async () => {
        if (!window.confirm("¿Eliminar este cupón?")) return;
        const { error } = await supabaseClient.from("coupons").delete().eq("id", coupon.id);
        if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
        allCoupons = allCoupons.filter(c => String(c.id) !== String(coupon.id));
        renderCouponsAdmin();
        closeCouponModal();
        showToast("Cupón eliminado");
      };
    } else {
      el.couponModalTitle.textContent = "Nuevo cupón";
      el.couponForm.reset();
      el.couponFieldId.value = "";
      el.couponFieldType.value = "percent";
      el.couponFieldActive.checked = true;
      el.deleteCouponBtn.hidden = true;
    }
    el.couponModalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeCouponModal() {
    el.couponModalOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  el.newCouponBtn.addEventListener("click", () => openCouponModal(null));
  el.couponModalClose.addEventListener("click", closeCouponModal);
  el.cancelCouponBtn.addEventListener("click", closeCouponModal);
  el.couponModalOverlay.addEventListener("click", e => { if (e.target === el.couponModalOverlay) closeCouponModal(); });

  el.couponForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.couponFormError.hidden = true;
    el.saveCouponBtn.disabled = true;
    el.saveCouponBtn.textContent = "Guardando…";

    try {
      const value = parseFloat(el.couponFieldValue.value);
      if (!value || value <= 0) throw new Error("El valor del descuento debe ser mayor a 0.");
      const type = el.couponFieldType.value;
      if (type === "percent" && value > 100) throw new Error("Un descuento en porcentaje no puede ser mayor a 100%.");

      const payload = {
        code: el.couponFieldCode.value.trim().toUpperCase(),
        discount_type: type,
        discount_value: value,
        expires_at: el.couponFieldExpires.value ? new Date(el.couponFieldExpires.value + "T23:59:59").toISOString() : null,
        active: el.couponFieldActive.checked,
      };
      const id = el.couponFieldId.value;
      let error;
      if (id) {
        ({ error } = await supabaseClient.from("coupons").update(payload).eq("id", id));
      } else {
        ({ error } = await supabaseClient.from("coupons").insert(payload));
      }
      if (error) {
        if (error.message.includes("duplicate") || error.message.includes("unique")) {
          throw new Error("Ya existe un cupón con ese código.");
        }
        throw new Error(error.message);
      }

      showToast(id ? "Cupón actualizado" : "Cupón creado");
      closeCouponModal();
      await loadCoupons();
    } catch (err) {
      el.couponFormError.textContent = err.message;
      el.couponFormError.hidden = false;
    } finally {
      el.saveCouponBtn.disabled = false;
      el.saveCouponBtn.textContent = "Guardar cupón";
    }
  });

  /* ---------------------------------------------------------------
     Reseñas de clientas (moderación)
     --------------------------------------------------------------- */
  let allReviews = [];

  async function loadReviewsAdmin() {
    const { data, error } = await supabaseClient
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("No se pudieron cargar las reseñas:", error.message);
      return;
    }
    allReviews = data || [];
    renderReviewsAdmin();
  }

  function productNameById(id) {
    const p = allProducts.find(pp => String(pp.id) === String(id));
    return p ? p.name : `Producto #${id}`;
  }

  function renderReviewsAdmin() {
    const pending = allReviews.filter(r => !r.approved).length;
    const approved = allReviews.filter(r => r.approved).length;
    el.statReviewsPending.textContent = pending;
    el.statReviewsApproved.textContent = approved;
    el.reviewsBadge.textContent = pending;
    el.reviewsBadge.hidden = pending === 0;

    if (!allReviews.length) {
      el.reviewsAdminList.innerHTML = "";
      el.reviewsAdminEmpty.hidden = false;
      return;
    }
    el.reviewsAdminEmpty.hidden = true;
    el.reviewsAdminList.innerHTML = allReviews.map(r => `
      <div class="review-admin-card ${r.approved ? "" : "pending"}" data-review-id="${r.id}">
        <div class="review-admin-head">
          <div>
            <strong>${r.customer_name}</strong>
            <span class="review-admin-product"> — ${productNameById(r.product_id)}</span>
          </div>
          <span class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
        </div>
        ${r.comment ? `<p class="review-admin-comment">${r.comment}</p>` : ""}
        <div class="review-admin-footer">
          <span class="review-date">${new Date(r.created_at).toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" })}</span>
          <div class="review-admin-actions">
            ${r.approved
              ? `<button data-unapprove-review="${r.id}">Ocultar</button>`
              : `<button class="btn-primary-sm" data-approve-review="${r.id}">Aprobar</button>`}
            <button data-delete-review="${r.id}">Eliminar</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  el.reviewsAdminList.addEventListener("click", async (e) => {
    const approveId = e.target.closest("[data-approve-review]")?.dataset.approveReview;
    const unapproveId = e.target.closest("[data-unapprove-review]")?.dataset.unapproveReview;
    const delId = e.target.closest("[data-delete-review]")?.dataset.deleteReview;

    if (approveId) {
      const { error } = await supabaseClient.from("reviews").update({ approved: true }).eq("id", approveId);
      if (error) { showToast("No se pudo aprobar: " + error.message, true); return; }
      const r = allReviews.find(x => String(x.id) === String(approveId));
      if (r) r.approved = true;
      renderReviewsAdmin();
      showToast("Reseña aprobada, ya se ve en el sitio");
    }
    if (unapproveId) {
      const { error } = await supabaseClient.from("reviews").update({ approved: false }).eq("id", unapproveId);
      if (error) { showToast("No se pudo ocultar: " + error.message, true); return; }
      const r = allReviews.find(x => String(x.id) === String(unapproveId));
      if (r) r.approved = false;
      renderReviewsAdmin();
      showToast("Reseña oculta del sitio");
    }
    if (delId) {
      if (!window.confirm("¿Eliminar esta reseña? No se puede deshacer.")) return;
      const { error } = await supabaseClient.from("reviews").delete().eq("id", delId);
      if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
      allReviews = allReviews.filter(r => String(r.id) !== String(delId));
      renderReviewsAdmin();
      showToast("Reseña eliminada");
    }
  });

  /* ---------------------------------------------------------------
     "Avísame cuando vuelva" — solicitudes de restock
     --------------------------------------------------------------- */
  let allRestockRequests = [];

  // Convierte un número local (ej. "0412-1234567", como la gente suele
  // escribirlo) al formato internacional que necesita un link wa.me.
  function formatWhatsAppNumber(phone) {
    let digits = (phone || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("0")) {
      digits = "58" + digits.slice(1); // Venezuela
    }
    return digits;
  }

  async function loadRestockAdmin() {
    const { data, error } = await supabaseClient
      .from("stock_notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("No se pudieron cargar las solicitudes de restock:", error.message);
      return;
    }
    allRestockRequests = data || [];
    renderRestockAdmin();
  }

  function renderRestockAdmin() {
    const pending = allRestockRequests.filter(r => !r.notified).length;
    el.statRestockPending.textContent = pending;
    el.restockBadge.textContent = pending;
    el.restockBadge.hidden = pending === 0;

    if (!allRestockRequests.length) {
      el.restockAdminList.innerHTML = "";
      el.restockAdminEmpty.hidden = false;
      return;
    }
    el.restockAdminEmpty.hidden = true;

    // Agrupa por producto, para que el equipo vea de un vistazo cuántas
    // personas esperan cada producto
    const byProduct = {};
    allRestockRequests.forEach(r => {
      const key = String(r.product_id);
      if (!byProduct[key]) byProduct[key] = { name: r.product_name, requests: [] };
      byProduct[key].requests.push(r);
    });

    el.restockAdminList.innerHTML = Object.entries(byProduct).map(([productId, group]) => {
      const rowsHtml = group.requests.map(r => {
        const waNumber = formatWhatsAppNumber(r.phone);
        const waMessage = encodeURIComponent(`¡Hola! Te escribo porque pediste que te avisara cuando "${group.name}" volviera a estar disponible 🩷 ¡Ya llegó! ¿Aún te interesa?`);
        return `
          <div class="restock-request-row ${r.notified ? "notified" : ""}">
            <span class="restock-phone">${r.phone}</span>
            <span class="restock-date">${new Date(r.created_at).toLocaleDateString("es-VE", { dateStyle: "medium" })}</span>
            <a href="https://wa.me/${waNumber}?text=${waMessage}" target="_blank" rel="noopener" class="restock-wa-link">💬 WhatsApp</a>
            ${r.notified
              ? `<span class="restock-notified-tag">✓ Avisado</span>`
              : `<button data-mark-notified="${r.id}">Marcar avisado</button>`}
            <button data-delete-restock="${r.id}" class="restock-delete-btn">✕</button>
          </div>
        `;
      }).join("");
      return `
        <div class="restock-product-group">
          <h3>${group.name} <span class="restock-count">(${group.requests.length})</span></h3>
          ${rowsHtml}
        </div>
      `;
    }).join("");
  }

  el.restockAdminList.addEventListener("click", async (e) => {
    const markId = e.target.closest("[data-mark-notified]")?.dataset.markNotified;
    const delId = e.target.closest("[data-delete-restock]")?.dataset.deleteRestock;

    if (markId) {
      const { error } = await supabaseClient.from("stock_notifications").update({ notified: true }).eq("id", markId);
      if (error) { showToast("No se pudo actualizar: " + error.message, true); return; }
      const r = allRestockRequests.find(x => String(x.id) === String(markId));
      if (r) r.notified = true;
      renderRestockAdmin();
      showToast("Marcado como avisado");
    }
    if (delId) {
      if (!window.confirm("¿Eliminar esta solicitud?")) return;
      const { error } = await supabaseClient.from("stock_notifications").delete().eq("id", delId);
      if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
      allRestockRequests = allRestockRequests.filter(r => String(r.id) !== String(delId));
      renderRestockAdmin();
      showToast("Solicitud eliminada");
    }
  });

  /* ---------------------------------------------------------------
     Logos de marca — para el marquee de la portada
     --------------------------------------------------------------- */
  let allBrandLogos = {}; // brand -> logo_url
  const pendingBrandLogoFiles = {}; // brand -> File

  async function loadBrandLogosAdmin() {
    const { data, error } = await supabaseClient.from("brand_logos").select("*");
    if (error) {
      console.warn("No se pudieron cargar los logos de marca:", error.message);
      return;
    }
    allBrandLogos = {};
    (data || []).forEach(row => (allBrandLogos[row.brand] = row.logo_url));
    renderBrandLogosAdmin();
  }

  function renderBrandLogosAdmin() {
    const brands = Array.from(new Set(allProducts.map(p => p.brand))).sort((a, b) => a.localeCompare(b, "es"));
    if (!brands.length) {
      el.brandLogosList.innerHTML = `<p class="admin-empty">Todavía no hay productos con marca cargados.</p>`;
      return;
    }
    el.brandLogosList.innerHTML = brands.map(brand => {
      const currentUrl = allBrandLogos[brand] || "";
      const safeBrand = brand.replace(/"/g, "&quot;");
      return `
        <div class="brand-logo-row" data-brand-row="${safeBrand}">
          <div class="brand-logo-preview">
            ${currentUrl ? `<img src="${currentUrl}" alt="${safeBrand}">` : `<span class="brand-logo-placeholder">${brand}</span>`}
          </div>
          <strong class="brand-logo-name">${brand}</strong>
          <input type="file" accept="image/*" data-brand-file="${safeBrand}" class="brand-logo-file-input">
          <button type="button" data-brand-save="${safeBrand}" class="brand-logo-save-btn">${currentUrl ? "Cambiar" : "Subir logo"}</button>
          ${currentUrl ? `<button type="button" data-brand-remove="${safeBrand}" class="brand-logo-remove-btn">Quitar</button>` : ""}
        </div>
      `;
    }).join("");
  }

  el.brandLogosList.addEventListener("change", (e) => {
    const brand = e.target.closest("[data-brand-file]")?.dataset.brandFile;
    if (brand && e.target.files[0]) {
      pendingBrandLogoFiles[brand] = e.target.files[0];
    }
  });

  el.brandLogosList.addEventListener("click", async (e) => {
    const saveBrand = e.target.closest("[data-brand-save]")?.dataset.brandSave;
    const removeBrand = e.target.closest("[data-brand-remove]")?.dataset.brandRemove;

    if (saveBrand) {
      const file = pendingBrandLogoFiles[saveBrand];
      if (!file) {
        showToast("Primero elige un archivo de imagen.", true);
        return;
      }
      const btn = e.target.closest("[data-brand-save]");
      btn.disabled = true;
      btn.textContent = "Subiendo…";
      try {
        const ext = file.name.split(".").pop();
        const path = `brand-logo-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
        const { error: uploadError } = await supabaseClient.storage.from("product-images").upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);

        const { error: saveError } = await supabaseClient
          .from("brand_logos")
          .upsert({ brand: saveBrand, logo_url: data.publicUrl, updated_at: new Date().toISOString() });
        if (saveError) throw saveError;

        allBrandLogos[saveBrand] = data.publicUrl;
        delete pendingBrandLogoFiles[saveBrand];
        renderBrandLogosAdmin();
        showToast(`Logo de ${saveBrand} guardado ✓`);
      } catch (err) {
        showToast("No se pudo subir el logo: " + err.message, true);
        btn.disabled = false;
        btn.textContent = "Subir logo";
      }
      return;
    }

    if (removeBrand) {
      if (!window.confirm(`¿Quitar el logo de "${removeBrand}"? Volverá a mostrarse solo el nombre en texto.`)) return;
      const { error } = await supabaseClient.from("brand_logos").delete().eq("brand", removeBrand);
      if (error) { showToast("No se pudo quitar: " + error.message, true); return; }
      delete allBrandLogos[removeBrand];
      renderBrandLogosAdmin();
      showToast("Logo quitado");
    }
  });

  /* ---------------------------------------------------------------
     Colecciones curadas (portada)
     --------------------------------------------------------------- */
  let allCollections = [];
  let pickedProductIds = [];

  async function loadCollectionsAdmin() {
    const { data, error } = await supabaseClient
      .from("collections")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn("No se pudieron cargar las colecciones:", error.message);
      return;
    }
    allCollections = data || [];
    renderCollectionsAdmin();
  }

  function renderCollectionsAdmin() {
    if (!allCollections.length) {
      el.collectionsAdminList.innerHTML = "";
      el.collectionsAdminEmpty.hidden = false;
      return;
    }
    el.collectionsAdminEmpty.hidden = true;
    el.collectionsAdminList.innerHTML = allCollections.map(c => {
      const ids = Array.isArray(c.product_ids) ? c.product_ids : [];
      return `
        <div class="collection-admin-card" data-collection-id="${c.id}">
          <div>
            <strong>${c.title}</strong>
            <span class="collection-admin-meta">${ids.length} producto${ids.length === 1 ? "" : "s"} · orden ${c.sort_order ?? 0}</span>
          </div>
          <div class="collection-admin-actions">
            <span class="coupon-status ${c.active ? "active" : "inactive"}">${c.active ? "Activa" : "Inactiva"}</span>
            <button data-edit-collection="${c.id}">Editar</button>
            <button data-delete-collection="${c.id}">Eliminar</button>
          </div>
        </div>
      `;
    }).join("");
  }

  el.collectionsAdminList.addEventListener("click", async (e) => {
    const editId = e.target.closest("[data-edit-collection]")?.dataset.editCollection;
    const delId = e.target.closest("[data-delete-collection]")?.dataset.deleteCollection;
    if (editId) openCollectionModal(allCollections.find(c => String(c.id) === String(editId)));
    if (delId) {
      if (!window.confirm("¿Eliminar esta colección? El sitio dejará de mostrarla.")) return;
      const { error } = await supabaseClient.from("collections").delete().eq("id", delId);
      if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
      allCollections = allCollections.filter(c => String(c.id) !== String(delId));
      renderCollectionsAdmin();
      showToast("Colección eliminada");
    }
  });

  function renderPickedList() {
    el.collectionPickedCount.textContent = pickedProductIds.length;
    if (!pickedProductIds.length) {
      el.collectionPickedList.innerHTML = `<p class="collection-empty-hint">Todavía no has agregado productos.</p>`;
      return;
    }
    el.collectionPickedList.innerHTML = pickedProductIds.map((id, idx) => {
      const p = allProducts.find(pp => String(pp.id) === String(id));
      const name = p ? p.name : `Producto #${id}`;
      return `
        <div class="collection-picked-item">
          <span>${idx + 1}. ${name}</span>
          <div class="collection-picked-item-actions">
            <button type="button" data-move-up="${id}" ${idx === 0 ? "disabled" : ""} aria-label="Subir">↑</button>
            <button type="button" data-move-down="${id}" ${idx === pickedProductIds.length - 1 ? "disabled" : ""} aria-label="Bajar">↓</button>
            <button type="button" data-remove-picked="${id}" aria-label="Quitar">✕</button>
          </div>
        </div>
      `;
    }).join("");
  }

  el.collectionPickedList.addEventListener("click", (e) => {
    const removeId = e.target.closest("[data-remove-picked]")?.dataset.removePicked;
    const upId = e.target.closest("[data-move-up]")?.dataset.moveUp;
    const downId = e.target.closest("[data-move-down]")?.dataset.moveDown;
    if (removeId) {
      pickedProductIds = pickedProductIds.filter(id => String(id) !== String(removeId));
    } else if (upId) {
      const idx = pickedProductIds.findIndex(id => String(id) === String(upId));
      if (idx > 0) [pickedProductIds[idx - 1], pickedProductIds[idx]] = [pickedProductIds[idx], pickedProductIds[idx - 1]];
    } else if (downId) {
      const idx = pickedProductIds.findIndex(id => String(id) === String(downId));
      if (idx < pickedProductIds.length - 1) [pickedProductIds[idx + 1], pickedProductIds[idx]] = [pickedProductIds[idx], pickedProductIds[idx + 1]];
    }
    renderPickedList();
  });

  el.collectionProductSearch.addEventListener("input", () => {
    const q = el.collectionProductSearch.value.trim().toLowerCase();
    if (!q) { el.collectionSearchResults.innerHTML = ""; el.collectionSearchResults.hidden = true; return; }
    const matches = allProducts
      .filter(p => !pickedProductIds.includes(String(p.id)) && p.name.toLowerCase().includes(q))
      .slice(0, 8);
    el.collectionSearchResults.hidden = matches.length === 0;
    el.collectionSearchResults.innerHTML = matches.map(p => `
      <button type="button" class="collection-search-result" data-add-product="${p.id}">
        + ${p.name} <span class="collection-search-result-brand">${p.brand || ""}</span>
      </button>
    `).join("");
  });

  el.collectionSearchResults.addEventListener("click", (e) => {
    const addId = e.target.closest("[data-add-product]")?.dataset.addProduct;
    if (!addId) return;
    if (!pickedProductIds.includes(String(addId))) pickedProductIds.push(String(addId));
    renderPickedList();
    el.collectionProductSearch.value = "";
    el.collectionSearchResults.innerHTML = "";
    el.collectionSearchResults.hidden = true;
    el.collectionProductSearch.focus();
  });

  function openCollectionModal(collection) {
    el.collectionFormError.hidden = true;
    el.collectionProductSearch.value = "";
    el.collectionSearchResults.innerHTML = "";
    el.collectionSearchResults.hidden = true;

    if (collection) {
      el.collectionModalTitle.textContent = "Editar colección";
      el.collectionFieldId.value = collection.id;
      el.collectionFieldTitle.value = collection.title || "";
      el.collectionFieldOrder.value = collection.sort_order ?? 0;
      el.collectionFieldActive.checked = Boolean(collection.active);
      pickedProductIds = Array.isArray(collection.product_ids) ? collection.product_ids.map(String) : [];
      el.deleteCollectionBtn.hidden = false;
      el.deleteCollectionBtn.onclick = async () => {
        if (!window.confirm("¿Eliminar esta colección?")) return;
        const { error } = await supabaseClient.from("collections").delete().eq("id", collection.id);
        if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
        allCollections = allCollections.filter(c => String(c.id) !== String(collection.id));
        renderCollectionsAdmin();
        closeCollectionModal();
        showToast("Colección eliminada");
      };
    } else {
      el.collectionModalTitle.textContent = "Nueva colección";
      el.collectionForm.reset();
      el.collectionFieldId.value = "";
      el.collectionFieldOrder.value = 0;
      el.collectionFieldActive.checked = true;
      pickedProductIds = [];
      el.deleteCollectionBtn.hidden = true;
    }
    renderPickedList();
    el.collectionModalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeCollectionModal() {
    el.collectionModalOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  el.newCollectionBtn.addEventListener("click", () => openCollectionModal(null));
  el.collectionModalClose.addEventListener("click", closeCollectionModal);
  el.cancelCollectionBtn.addEventListener("click", closeCollectionModal);
  el.collectionModalOverlay.addEventListener("click", e => { if (e.target === el.collectionModalOverlay) closeCollectionModal(); });

  el.collectionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.collectionFormError.hidden = true;

    if (!pickedProductIds.length) {
      el.collectionFormError.textContent = "Agrega al menos un producto a la colección.";
      el.collectionFormError.hidden = false;
      return;
    }

    el.saveCollectionBtn.disabled = true;
    el.saveCollectionBtn.textContent = "Guardando…";
    try {
      const payload = {
        title: el.collectionFieldTitle.value.trim(),
        product_ids: pickedProductIds,
        sort_order: parseInt(el.collectionFieldOrder.value, 10) || 0,
        active: el.collectionFieldActive.checked,
      };
      const id = el.collectionFieldId.value;
      let error;
      if (id) {
        ({ error } = await supabaseClient.from("collections").update(payload).eq("id", id));
      } else {
        ({ error } = await supabaseClient.from("collections").insert(payload));
      }
      if (error) throw new Error(error.message);

      showToast(id ? "Colección actualizada" : "Colección creada");
      closeCollectionModal();
      await loadCollectionsAdmin();
    } catch (err) {
      el.collectionFormError.textContent = err.message;
      el.collectionFormError.hidden = false;
    } finally {
      el.saveCollectionBtn.disabled = false;
      el.saveCollectionBtn.textContent = "Guardar colección";
    }
  });

  /* ---------------------------------------------------------------
     Modal crear / editar producto
     --------------------------------------------------------------- */
  function openProductModal(product) {
    el.productFormError.hidden = true;
    pendingImageFile = null;
    el.fieldImageFile.value = "";
    el.imageUploadStatus.textContent = "";

    if (product) {
      el.productModalTitle.textContent = "Editar producto";
      el.fieldId.value = product.id;
      el.fieldName.value = product.name || "";
      el.fieldBrand.value = product.brand || "";
      el.fieldCategory.value = product.category || "";
      el.fieldRef.value = product.ref || "";
      el.fieldAvail.value = String(Boolean(product.avail));
      el.fieldDetal.value = product.detal ?? "";
      el.fieldMayor.value = product.mayor ?? "";
      el.fieldOffer.value = product.offer ?? "";
      el.fieldStock.value = product.stock ?? "";
      el.fieldNote.value = product.note || "";
      el.fieldFeatured.checked = Boolean(product.featured);
      el.fieldShowWhenOut.checked = product.show_when_out_of_stock !== false;
      el.fieldTones.value = product.tones || "";
      galleryRows = [];
      galleryRowSeq = 0;
      (Array.isArray(product.gallery_images) ? product.gallery_images : []).forEach(url => {
        galleryRows.push({ id: galleryRowSeq++, url, file: null });
      });
      renderGalleryList();
      el.fieldImageUrl.value = product.image || "";
      if (product.image) {
        el.imagePreview.src = resolveImagePath(product.image);
        el.imagePreview.hidden = false;
      } else {
        el.imagePreview.hidden = true;
      }
      el.deleteProductBtn.hidden = false;
      el.deleteProductBtn.onclick = () => {
        closeProductModal();
        confirmDeleteProduct(product.id);
      };
    } else {
      el.productModalTitle.textContent = "Nuevo producto";
      el.productForm.reset();
      el.fieldId.value = "";
      el.fieldAvail.value = "true";
      el.fieldStock.value = "";
      el.imagePreview.hidden = true;
      el.deleteProductBtn.hidden = true;
      galleryRows = [];
      galleryRowSeq = 0;
      renderGalleryList();
      el.fieldTones.value = "";
    }

    el.productModalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeProductModal() {
    el.productModalOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  el.newProductBtn.addEventListener("click", () => openProductModal(null));
  el.productModalClose.addEventListener("click", closeProductModal);
  el.cancelProductBtn.addEventListener("click", closeProductModal);
  el.productModalOverlay.addEventListener("click", (e) => {
    if (e.target === el.productModalOverlay) closeProductModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !el.productModalOverlay.hidden) closeProductModal();
  });

  // Previsualización de imagen elegida desde el computador
  el.fieldImageFile.addEventListener("change", () => {
    const file = el.fieldImageFile.files[0];
    if (!file) return;
    pendingImageFile = file;
    el.imagePreview.src = URL.createObjectURL(file);
    el.imagePreview.hidden = false;
    el.imageUploadStatus.textContent = "Se subirá al guardar: " + file.name;
  });

  el.fieldImageUrl.addEventListener("input", () => {
    if (el.fieldImageUrl.value.trim()) {
      pendingImageFile = null;
      el.fieldImageFile.value = "";
      el.imagePreview.src = el.fieldImageUrl.value.trim();
      el.imagePreview.hidden = false;
    }
  });

  async function uploadImageIfNeeded() {
    if (!pendingImageFile) return el.fieldImageUrl.value.trim();

    el.imageUploadStatus.textContent = "Subiendo imagen…";
    const up = await compressForUpload(pendingImageFile, 1200);
    const ext = uploadExt(up, pendingImageFile);
    const path = `producto-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    const { error: uploadError } = await supabaseClient
      .storage
      .from("product-images")
      .upload(path, up, uploadOpts(up));

    if (uploadError) {
      throw new Error("No se pudo subir la imagen: " + uploadError.message);
    }

    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
    el.imageUploadStatus.textContent = "Imagen subida ✓";
    return data.publicUrl;
  }

  el.productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.productFormError.hidden = true;
    el.saveProductBtn.disabled = true;
    el.saveProductBtn.textContent = "Guardando…";

    try {
      const imageUrl = await uploadImageIfNeeded();
      const galleryImages = await buildGalleryImagesArray();

      const stockValue = el.fieldStock.value.trim() === "" ? null : parseInt(el.fieldStock.value, 10);
      let effectiveAvail = el.fieldAvail.value === "true";
      if (stockValue !== null && stockValue <= 0) {
        effectiveAvail = false; // stock en 0 (o menos) => se marca Agotado automáticamente
      }

      const payload = {
        name: el.fieldName.value.trim(),
        brand: resolveBrandCasing(el.fieldBrand.value),
        category: el.fieldCategory.value.trim(),
        ref: el.fieldRef.value.trim(),
        avail: effectiveAvail,
        detal: parseFloat(el.fieldDetal.value) || 0,
        mayor: parseFloat(el.fieldMayor.value) || 0,
        offer: el.fieldOffer.value ? parseFloat(el.fieldOffer.value) : null,
        stock: stockValue,
        image: imageUrl || "",
        gallery_images: galleryImages,
        tones: el.fieldTones.value.trim(),
        note: el.fieldNote.value.trim(),
        featured: el.fieldFeatured.checked,
        show_when_out_of_stock: el.fieldShowWhenOut.checked,
      };

      const id = el.fieldId.value;
      let error;
      if (id) {
        ({ error } = await supabaseClient.from("products").update(payload).eq("id", id));
      } else {
        ({ error } = await supabaseClient.from("products").insert(payload));
      }

      if (error) throw new Error(error.message);

      showToast(id ? "Producto actualizado" : "Producto creado");
      closeProductModal();
      await loadProducts();
    } catch (err) {
      el.productFormError.textContent = err.message;
      el.productFormError.hidden = false;
    } finally {
      el.saveProductBtn.disabled = false;
      el.saveProductBtn.textContent = "Guardar producto";
    }
  });

  /* ---------------------------------------------------------------
     AJUSTES: logo, colores, textos, contacto
     --------------------------------------------------------------- */
  const DEFAULT_SETTINGS_ADMIN = {
    store_name: "Shopicol", store_tagline: "Bacano",
    meta_description: "Catálogo Shopicol Bacano: maquillaje, capilares y cuidado personal colombiano al por mayor y detal.",
    eyebrow_text: "✦ Catálogo completo · edición web ✦",
    hero_title: "Lo más bacano para ti.", hero_accent_word: "bacano",
    hero_subtitle: "Maquillaje, capilares y cuidado personal colombiano, directo del catálogo Shopicol. Compra al detal sin mínimo, o accede a precio mayorista desde $50 en tu compra.",
    hero_note_text: "¿Cómo comprar? El precio Detal es por unidad, sin monto mínimo. El precio Mayor se activa al acumular $50 o más en tu pedido — no es por cantidad de piezas, sino por el monto total. ¡Gracias por preferirnos! 💗",
    footer_description: "Productos colombianos de buena calidad, a un buen precio. ¡Llegaste al lugar indicado!",
    footer_bottom_text: "Catálogo generado a partir del PDF original de Shopicol Bacano · Gracias por preferirnos ✦",
    contact_title: "✦ Contáctanos ✦",
    contact_subtitle: "¿Tienes dudas sobre un producto o tu pedido? Escríbenos por cualquiera de estos medios.",
    logo_url: "", primary_color: "#D6336C", accent_color: "#E8A33D",
    bg_color: "#FBF6EC", text_color: "#2B1B17", font_pair: "clasica", card_radius: 18,
    contact_email: "", instagram_url: "", tiktok_url: "", facebook_url: "",
    upsell_enabled: false, upsell_price: 0.5,
    upsell_title: "¡Bedazzled tu compra! ✨",
    upsell_description: "Por $0.50 más, agrega una lámina de glitter (piedritas preseleccionadas) a tu pedido.",
    upsell_product_name: "Lámina de glitter (preseleccionada)",
    upsell_button_text: "Sí, quiero agregarlo",
    exchange_rate: 0, exchange_rate_updated_at: null,
    pago_movil_phone: "", pago_movil_cedula: "", pago_movil_bank: "",
    binance_email: "", binance_holder_name: "",
    zelle_email: "", zelle_holder_name: "",
  };
  let pendingLogoFile = null;
  let loadedExchangeRate = 0;
  let loadedExchangeRateUpdatedAt = null;

  async function loadSettings() {
    const { data, error } = await supabaseClient
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    const settings = (!error && data) ? { ...DEFAULT_SETTINGS_ADMIN, ...data } : DEFAULT_SETTINGS_ADMIN;

    el.settingsStoreName.value = settings.store_name || "";
    el.settingsTagline.value = settings.store_tagline || "";
    el.settingsPrimaryColor.value = settings.primary_color || "#D6336C";
    el.settingsPrimaryColorHex.value = settings.primary_color || "#D6336C";
    el.settingsAccentColor.value = settings.accent_color || "#E8A33D";
    el.settingsAccentColorHex.value = settings.accent_color || "#E8A33D";
    el.settingsBgColor.value = settings.bg_color || "#FBF6EC";
    el.settingsBgColorHex.value = settings.bg_color || "#FBF6EC";
    el.settingsTextColor.value = settings.text_color || "#2B1B17";
    el.settingsTextColorHex.value = settings.text_color || "#2B1B17";
    el.settingsFontPair.value = settings.font_pair || "clasica";
    el.settingsCardRadius.value = String(settings.card_radius ?? 18);
    el.settingsHeroTitle.value = settings.hero_title || "";
    el.settingsHeroAccent.value = settings.hero_accent_word || "";
    el.settingsHeroSubtitle.value = settings.hero_subtitle || "";
    el.settingsEyebrow.value = settings.eyebrow_text || "";
    el.settingsHeroNote.value = settings.hero_note_text || "";
    el.settingsFooterDescription.value = settings.footer_description || "";
    el.settingsFooterBottom.value = settings.footer_bottom_text || "";
    el.settingsMetaDescription.value = settings.meta_description || "";
    el.settingsContactTitle.value = settings.contact_title || "";
    el.settingsContactSubtitle.value = settings.contact_subtitle || "";
    el.settingsEmail.value = settings.contact_email || "";
    el.settingsInstagram.value = settings.instagram_url || "";
    el.settingsTiktok.value = settings.tiktok_url || "";
    el.settingsFacebook.value = settings.facebook_url || "";
    el.settingsUpsellEnabled.checked = Boolean(settings.upsell_enabled);
    el.settingsUpsellTitle.value = settings.upsell_title || "";
    el.settingsUpsellDescription.value = settings.upsell_description || "";
    el.settingsUpsellProductName.value = settings.upsell_product_name || "";
    el.settingsUpsellPrice.value = settings.upsell_price ?? 0.5;
    el.settingsUpsellButtonText.value = settings.upsell_button_text || "";
    el.settingsExchangeRate.value = settings.exchange_rate || "";
    loadedExchangeRate = settings.exchange_rate || 0;
    loadedExchangeRateUpdatedAt = settings.exchange_rate_updated_at || null;
    el.settingsExchangeRateUpdated.value = settings.exchange_rate_updated_at
      ? new Date(settings.exchange_rate_updated_at).toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" })
      : "Todavía no se ha puesto una tasa";
    el.settingsPagoMovilPhone.value = settings.pago_movil_phone || "";
    el.settingsPagoMovilCedula.value = settings.pago_movil_cedula || "";
    el.settingsPagoMovilBank.value = settings.pago_movil_bank || "";
    el.settingsBinanceEmail.value = settings.binance_email || "";
    el.settingsBinanceHolder.value = settings.binance_holder_name || "";
    el.settingsZelleEmail.value = settings.zelle_email || "";
    el.settingsZelleHolder.value = settings.zelle_holder_name || "";
    el.settingsLogoUrl.value = settings.logo_url || "";
    if (settings.logo_url) {
      el.settingsLogoPreview.src = settings.logo_url;
      el.settingsLogoPreview.hidden = false;
    } else {
      el.settingsLogoPreview.src = "/logo.png";
      el.settingsLogoPreview.hidden = false;
    }
  }

  // Sincroniza el input de color (picker) con su versión de texto y viceversa
  function linkColorInputs(colorEl, hexEl) {
    colorEl.addEventListener("input", () => { hexEl.value = colorEl.value; });
    hexEl.addEventListener("input", () => {
      if (/^#[0-9a-fA-F]{6}$/.test(hexEl.value)) colorEl.value = hexEl.value;
    });
  }
  linkColorInputs(el.settingsPrimaryColor, el.settingsPrimaryColorHex);
  linkColorInputs(el.settingsAccentColor, el.settingsAccentColorHex);
  linkColorInputs(el.settingsBgColor, el.settingsBgColorHex);
  linkColorInputs(el.settingsTextColor, el.settingsTextColorHex);

  el.settingsLogoFile.addEventListener("change", () => {
    const file = el.settingsLogoFile.files[0];
    if (!file) return;
    pendingLogoFile = file;
    el.settingsLogoPreview.src = URL.createObjectURL(file);
    el.settingsLogoPreview.hidden = false;
    el.settingsLogoStatus.textContent = "Se subirá al guardar: " + file.name;
  });
  el.settingsLogoUrl.addEventListener("input", () => {
    if (el.settingsLogoUrl.value.trim()) {
      pendingLogoFile = null;
      el.settingsLogoFile.value = "";
      el.settingsLogoPreview.src = el.settingsLogoUrl.value.trim();
      el.settingsLogoPreview.hidden = false;
    }
  });

  async function uploadLogoIfNeeded() {
    if (!pendingLogoFile) return el.settingsLogoUrl.value.trim();
    const ext = pendingLogoFile.name.split(".").pop();
    const path = `logo-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    el.settingsLogoStatus.textContent = "Subiendo logo…";
    const { error } = await supabaseClient.storage.from("product-images").upload(path, pendingLogoFile, { upsert: false });
    if (error) throw new Error("No se pudo subir el logo: " + error.message);
    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
    el.settingsLogoStatus.textContent = "Logo subido ✓";
    return data.publicUrl;
  }

  el.saveSettingsBtn.addEventListener("click", async () => {
    el.settingsFormError.hidden = true;
    el.saveSettingsBtn.disabled = true;
    el.saveSettingsBtn.textContent = "Guardando…";

    try {
      const logoUrl = await uploadLogoIfNeeded();
      const payload = {
        id: 1,
        store_name: el.settingsStoreName.value.trim() || "Shopicol",
        store_tagline: el.settingsTagline.value.trim() || "Bacano",
        meta_description: el.settingsMetaDescription.value.trim(),
        eyebrow_text: el.settingsEyebrow.value.trim(),
        hero_title: el.settingsHeroTitle.value.trim(),
        hero_accent_word: el.settingsHeroAccent.value.trim(),
        hero_subtitle: el.settingsHeroSubtitle.value.trim(),
        hero_note_text: el.settingsHeroNote.value.trim(),
        footer_description: el.settingsFooterDescription.value.trim(),
        footer_bottom_text: el.settingsFooterBottom.value.trim(),
        contact_title: el.settingsContactTitle.value.trim(),
        contact_subtitle: el.settingsContactSubtitle.value.trim(),
        logo_url: logoUrl || "",
        primary_color: el.settingsPrimaryColorHex.value.trim() || "#D6336C",
        accent_color: el.settingsAccentColorHex.value.trim() || "#E8A33D",
        bg_color: el.settingsBgColorHex.value.trim() || "#FBF6EC",
        text_color: el.settingsTextColorHex.value.trim() || "#2B1B17",
        font_pair: el.settingsFontPair.value,
        card_radius: parseInt(el.settingsCardRadius.value, 10) || 18,
        contact_email: el.settingsEmail.value.trim(),
        instagram_url: el.settingsInstagram.value.trim(),
        tiktok_url: el.settingsTiktok.value.trim(),
        facebook_url: el.settingsFacebook.value.trim(),
        upsell_enabled: el.settingsUpsellEnabled.checked,
        upsell_title: el.settingsUpsellTitle.value.trim(),
        upsell_description: el.settingsUpsellDescription.value.trim(),
        upsell_product_name: el.settingsUpsellProductName.value.trim(),
        upsell_price: parseFloat(el.settingsUpsellPrice.value) || 0.5,
        upsell_button_text: el.settingsUpsellButtonText.value.trim(),
        exchange_rate: parseFloat(el.settingsExchangeRate.value) || 0,
        exchange_rate_updated_at: (parseFloat(el.settingsExchangeRate.value) || 0) !== Number(loadedExchangeRate)
          ? new Date().toISOString()
          : loadedExchangeRateUpdatedAt,
        pago_movil_phone: el.settingsPagoMovilPhone.value.trim(),
        pago_movil_cedula: el.settingsPagoMovilCedula.value.trim(),
        pago_movil_bank: el.settingsPagoMovilBank.value.trim(),
        binance_email: el.settingsBinanceEmail.value.trim(),
        binance_holder_name: el.settingsBinanceHolder.value.trim(),
        zelle_email: el.settingsZelleEmail.value.trim(),
        zelle_holder_name: el.settingsZelleHolder.value.trim(),
      };

      const { error } = await supabaseClient.from("site_settings").upsert(payload);
      if (error) throw new Error(error.message);

      showToast("Ajustes guardados. Recarga tu sitio público para verlos aplicados.");
      loadedExchangeRate = payload.exchange_rate;
      loadedExchangeRateUpdatedAt = payload.exchange_rate_updated_at;
      el.settingsExchangeRateUpdated.value = payload.exchange_rate_updated_at
        ? new Date(payload.exchange_rate_updated_at).toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" })
        : "Todavía no se ha puesto una tasa";
      pendingLogoFile = null;
    } catch (err) {
      el.settingsFormError.textContent = err.message;
      el.settingsFormError.hidden = false;
    } finally {
      el.saveSettingsBtn.disabled = false;
      el.saveSettingsBtn.textContent = "Guardar ajustes";
    }
  });

  /* ---------------------------------------------------------------
     Importar catálogo semilla (una sola vez)
     --------------------------------------------------------------- */
  el.importBtn.addEventListener("click", () => {
    el.importHint.hidden = false;
  });
  el.cancelImportBtn.addEventListener("click", () => {
    el.importHint.hidden = true;
  });
  el.confirmImportBtn.addEventListener("click", async () => {
    el.importHint.hidden = true;
    if (typeof SEED_PRODUCTS === "undefined" || !SEED_PRODUCTS.length) {
      showToast("No se encontró el catálogo semilla (products.js)", true);
      return;
    }

    showToast(`Importando ${SEED_PRODUCTS.length} productos… esto puede tardar un momento`);

    // Prepara las filas quitando campos que no existen en la tabla
    const rows = SEED_PRODUCTS.map(p => ({
      name: p.name,
      brand: p.brand,
      category: p.category,
      ref: p.ref || "",
      mayor: p.mayor || 0,
      detal: p.detal || 0,
      avail: Boolean(p.avail),
      offer: p.offer ?? null,
      image: p.image || "",
      note: p.note || "",
      featured: Boolean(p.featured),
    }));

    // Inserta en lotes de 100 para evitar límites de tamaño de payload
    const chunkSize = 100;
    let inserted = 0;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await supabaseClient.from("products").insert(chunk);
      if (error) {
        showToast(`Error al importar (fila ~${i}): ${error.message}`, true);
        break;
      }
      inserted += chunk.length;
    }

    showToast(`Importación completa: ${inserted} productos agregados`);
    await loadProducts();
  });

  /* ---------------------------------------------------------------
     Carga masiva de productos desde un archivo Excel (.xlsx)
     --------------------------------------------------------------- */
  const VALID_CATEGORIES_HINT = ["Rostro", "Ojos", "Labios", "Cejas", "Brochas y Pinceles", "Capilar", "Cuidado Corporal", "Cuidado Facial", "Accesorios", "Otros"];
  let pendingBulkRows = [];

  function parseBoolField(value) {
    const v = String(value ?? "").trim().toLowerCase();
    return v === "si" || v === "sí" || v === "true" || v === "1" || v === "yes";
  }

  function parseBulkExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: "array" });
          const sheetName = workbook.SheetNames.find(n => n.toLowerCase().includes("producto")) || workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          resolve(json);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
      reader.readAsArrayBuffer(file);
    });
  }

  // Normaliza las claves del objeto de una fila del Excel: quita asteriscos
  // de "obligatorio" (ej. "Nombre *" → "Nombre") y espacios extra, para que
  // no importe si el encabezado trae el asterisco o no.
  function normalizeRowKeys(row) {
    const normalized = {};
    Object.keys(row).forEach(key => {
      const cleanKey = key.replace(/\*/g, "").trim();
      normalized[cleanKey] = row[key];
    });
    return normalized;
  }

  function validateBulkRows(rawRows) {
    const valid = [];
    const errors = [];

    rawRows.forEach((rawRow, idx) => {
      const row = normalizeRowKeys(rawRow);
      const lineNum = idx + 2; // +2 porque la fila 1 es el encabezado
      const name = String(row["Nombre"] || "").trim();
      const brand = String(row["Marca"] || "").trim();
      const category = String(row["Categoria"] || row["Categoría"] || "").trim();
      const detal = parseFloat(row["Precio_Detal"]);
      const mayor = parseFloat(row["Precio_Mayor"]);

      const rowErrors = [];
      if (!name) rowErrors.push("falta Nombre");
      if (!brand) rowErrors.push("falta Marca");
      if (!category) rowErrors.push("falta Categoria");
      if (isNaN(detal)) rowErrors.push("Precio_Detal inválido");
      if (isNaN(mayor)) rowErrors.push("Precio_Mayor inválido");

      if (rowErrors.length) {
        errors.push(`Fila ${lineNum}: ${rowErrors.join(", ")}`);
        return;
      }

      const offerRaw = row["Precio_Oferta"];
      const stockRaw = row["Stock"];
      const tonesRaw = String(row["Tonos"] || "").trim();

      // Si Imagen_URL trae varias fotos separadas por coma, la primera es
      // la foto principal y el resto se guardan como galería adicional.
      const imageUrls = String(row["Imagen_URL"] || "").split(",").map(s => s.trim()).filter(Boolean);
      const mainImage = imageUrls[0] || "";
      const extraImages = imageUrls.slice(1);

      valid.push({
        name, brand: resolveBrandCasing(brand), category,
        ref: String(row["Referencia"] || "").trim(),
        detal, mayor,
        offer: (offerRaw !== "" && offerRaw !== undefined && !isNaN(parseFloat(offerRaw))) ? parseFloat(offerRaw) : null,
        stock: (stockRaw !== "" && stockRaw !== undefined && !isNaN(parseInt(stockRaw, 10))) ? parseInt(stockRaw, 10) : null,
        avail: row["Disponible"] === "" ? true : parseBoolField(row["Disponible"]),
        featured: parseBoolField(row["Destacado"]),
        tones: tonesRaw,
        image: mainImage,
        note: String(row["Notas"] || "").trim(),
        gallery_images: extraImages,
      });
    });

    return { valid, errors };
  }

  el.bulkUploadBtn.addEventListener("click", () => el.bulkUploadFile.click());

  el.bulkUploadFile.addEventListener("change", async () => {
    const file = el.bulkUploadFile.files[0];
    el.bulkUploadFile.value = "";
    if (!file) return;

    if (typeof XLSX === "undefined") {
      showToast("No se pudo cargar el lector de Excel. Revisa tu conexión a internet.", true);
      return;
    }

    try {
      const rawRows = await parseBulkExcel(file);
      const { valid, errors } = validateBulkRows(rawRows);
      pendingBulkRows = valid;

      el.bulkSummary.innerHTML = `
        <div class="bulk-stat ok"><strong>${valid.length}</strong><span>listos para cargar</span></div>
        <div class="bulk-stat bad"><strong>${errors.length}</strong><span>con errores (se omiten)</span></div>
        <div class="bulk-stat"><strong>${rawRows.length}</strong><span>filas totales</span></div>
      `;
      if (errors.length) {
        el.bulkErrorsList.hidden = false;
        el.bulkErrorsList.innerHTML = errors.slice(0, 30).map(e => `<p>${e}</p>`).join("") +
          (errors.length > 30 ? `<p>…y ${errors.length - 30} más.</p>` : "");
      } else {
        el.bulkErrorsList.hidden = true;
        el.bulkErrorsList.innerHTML = "";
      }
      el.confirmBulkBtn.disabled = valid.length === 0;
      el.bulkFormError.hidden = true;
      el.bulkModalOverlay.hidden = false;
      document.body.style.overflow = "hidden";
    } catch (err) {
      showToast("No se pudo leer el archivo Excel: " + err.message, true);
    }
  });

  function closeBulkModal() {
    el.bulkModalOverlay.hidden = true;
    document.body.style.overflow = "";
    pendingBulkRows = [];
  }
  el.bulkModalClose.addEventListener("click", closeBulkModal);
  el.cancelBulkBtn.addEventListener("click", closeBulkModal);
  el.bulkModalOverlay.addEventListener("click", (e) => { if (e.target === el.bulkModalOverlay) closeBulkModal(); });

  el.confirmBulkBtn.addEventListener("click", async () => {
    if (!pendingBulkRows.length) return;
    el.confirmBulkBtn.disabled = true;
    el.confirmBulkBtn.textContent = "Cargando…";

    const chunkSize = 100;
    let inserted = 0;
    let lastError = null;
    for (let i = 0; i < pendingBulkRows.length; i += chunkSize) {
      const chunk = pendingBulkRows.slice(i, i + chunkSize);
      const { error } = await supabaseClient.from("products").insert(chunk);
      if (error) { lastError = error; break; }
      inserted += chunk.length;
    }

    el.confirmBulkBtn.disabled = false;
    el.confirmBulkBtn.textContent = "Cargar productos válidos";

    if (lastError) {
      el.bulkFormError.textContent = "Error al cargar: " + lastError.message;
      el.bulkFormError.hidden = false;
      return;
    }

    closeBulkModal();
    showToast(`${inserted} productos cargados correctamente`);
    await loadProducts();
  });

  /* ---------------------------------------------------------------
     Respaldo: descarga un Excel con TODAS las tablas del negocio.
     Cada tabla va en su propia hoja, con todas sus columnas. Si una
     tabla falla, las demás se respaldan igual y se avisa cuál falló.
     --------------------------------------------------------------- */
  const BACKUP_TABLES = [
    { table: "products", sheet: "Productos" },
    { table: "orders", sheet: "Pedidos" },
    { table: "banners", sheet: "Banners" },
    { table: "coupons", sheet: "Cupones" },
    { table: "reviews", sheet: "Resenas" },
    { table: "stock_notifications", sheet: "Avisame" },
    { table: "brand_logos", sheet: "Logos" },
    { table: "collections", sheet: "Colecciones" },
    { table: "site_settings", sheet: "Ajustes" },
  ];

  // Supabase entrega máximo 1000 filas por consulta: se pide por páginas
  // hasta traer todo, para que el respaldo nunca quede incompleto.
  async function fetchAllRows(table) {
    const pageSize = 1000;
    const all = [];
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabaseClient
        .from(table).select("*").order("id", { ascending: true }).range(from, from + pageSize - 1);
      if (error) throw new Error(error.message);
      all.push(...(data || []));
      if (!data || data.length < pageSize) break;
    }
    return all;
  }

  // Convierte listas y objetos (galerías, productos de un pedido) en texto
  // legible, y recorta lo que exceda el límite de una celda de Excel.
  function flattenForExcel(rows) {
    return rows.map(row => {
      const flat = {};
      Object.keys(row).forEach(key => {
        let v = row[key];
        if (Array.isArray(v) && v.every(x => x === null || typeof x !== "object")) v = v.join(", ");
        else if (v !== null && typeof v === "object") v = JSON.stringify(v);
        if (typeof v === "string" && v.length > 32000) v = v.slice(0, 32000);
        flat[key] = v;
      });
      return flat;
    });
  }

  async function downloadBackup() {
    if (typeof XLSX === "undefined") {
      showToast("No se pudo cargar el lector de Excel. Revisa tu conexión a internet.", true);
      return;
    }
    el.backupBtn.disabled = true;
    const originalLabel = el.backupBtn.textContent;
    el.backupBtn.textContent = "Preparando respaldo…";

    try {
      const workbook = XLSX.utils.book_new();
      const summary = [];
      let failed = 0;

      for (const { table, sheet } of BACKUP_TABLES) {
        try {
          const rows = await fetchAllRows(table);
          const flat = flattenForExcel(rows);
          const ws = flat.length ? XLSX.utils.json_to_sheet(flat) : XLSX.utils.aoa_to_sheet([["(sin datos)"]]);
          XLSX.utils.book_append_sheet(workbook, ws, sheet);
          summary.push({ Tabla: table, Hoja: sheet, Filas: rows.length, Estado: "OK" });
        } catch (err) {
          failed++;
          summary.push({ Tabla: table, Hoja: sheet, Filas: 0, Estado: "ERROR: " + err.message });
        }
      }

      const now = new Date();
      const stamp = now.toISOString().slice(0, 10);
      const summaryRows = [
        ["Respaldo generado", now.toLocaleString("es-VE")],
        ["Sitio", window.location.origin],
        ["Aviso", "Contiene datos de clientes (nombres, teléfonos, direcciones). Guárdalo en un lugar seguro y no lo compartas."],
        [],
        ["Tabla", "Hoja", "Filas", "Estado"],
        ...summary.map(r => [r.Tabla, r.Hoja, r.Filas, r.Estado]),
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
      summarySheet["!cols"] = [{ wch: 22 }, { wch: 28 }, { wch: 8 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");
      // la hoja Resumen va primero
      workbook.SheetNames = ["Resumen", ...workbook.SheetNames.filter(n => n !== "Resumen")];

      XLSX.writeFile(workbook, `respaldo-shopicol-${stamp}.xlsx`);

      if (failed) showToast(`Respaldo descargado, pero ${failed} tabla(s) no se pudieron leer. Revisa la hoja "Resumen".`, true);
      else showToast("Respaldo descargado. Contiene datos de clientes: guárdalo en un lugar seguro.");
    } catch (err) {
      showToast("No se pudo generar el respaldo: " + err.message, true);
    } finally {
      el.backupBtn.disabled = false;
      el.backupBtn.textContent = originalLabel;
    }
  }

  el.backupBtn.addEventListener("click", downloadBackup);

  /* ---------------------------------------------------------------
     Init
     --------------------------------------------------------------- */
  checkSession();
})();
