(function () {
  "use strict";

  const el = {
    loginScreen: document.getElementById("loginScreen"),
    loginForm: document.getElementById("loginForm"),
    loginEmail: document.getElementById("loginEmail"),
    loginPassword: document.getElementById("loginPassword"),
    loginBtn: document.getElementById("loginBtn"),
    loginError: document.getElementById("loginError"),

    adminApp: document.getElementById("adminApp"),
    adminUserEmail: document.getElementById("adminUserEmail"),
    logoutBtn: document.getElementById("logoutBtn"),

    tabSummary: document.getElementById("tabSummary"),
    tabProducts: document.getElementById("tabProducts"),
    tabOrders: document.getElementById("tabOrders"),
    tabBanners: document.getElementById("tabBanners"),
    tabAdvisors: document.getElementById("tabAdvisors"),
    advisorsTableBody: document.getElementById("advisorsTableBody"),
    newAdvisorBtn: document.getElementById("newAdvisorBtn"),
    advisorModalOverlay: document.getElementById("advisorModalOverlay"),
    advisorModalClose: document.getElementById("advisorModalClose"),
    advisorModalTitle: document.getElementById("advisorModalTitle"),
    advisorForm: document.getElementById("advisorForm"),
    advisorFieldId: document.getElementById("advisorFieldId"),
    advisorFieldName: document.getElementById("advisorFieldName"),
    advisorFieldPhone: document.getElementById("advisorFieldPhone"),
    advisorFieldImageFile: document.getElementById("advisorFieldImageFile"),
    advisorFieldImagePreview: document.getElementById("advisorFieldImagePreview"),
    advisorFieldSort: document.getElementById("advisorFieldSort"),
    advisorFieldActive: document.getElementById("advisorFieldActive"),
    deleteAdvisorBtn: document.getElementById("deleteAdvisorBtn"),
    cancelAdvisorBtn: document.getElementById("cancelAdvisorBtn"),
    saveAdvisorBtn: document.getElementById("saveAdvisorBtn"),
    advisorFormMessage: document.getElementById("advisorFormMessage"),
    tabSettings: document.getElementById("tabSettings"),

    statTotalProducts: document.getElementById("statTotalProducts"),
    statAvailProducts: document.getElementById("statAvailProducts"),
    statOutProducts: document.getElementById("statOutProducts"),
    statNewOrders: document.getElementById("statNewOrders"),
    ordersBadge: document.getElementById("ordersBadge"),

    adminSearch: document.getElementById("adminSearch"),
    filterNoPhoto: document.getElementById("filterNoPhoto"),
    noPhotoCount: document.getElementById("noPhotoCount"),
    newProductBtn: document.getElementById("newProductBtn"),
    adminTableBody: document.getElementById("adminTableBody"),

    ordersList: document.getElementById("ordersList"),
    ordersEmpty: document.getElementById("ordersEmpty"),

    newBannerBtn: document.getElementById("newBannerBtn"),
    bannersList: document.getElementById("bannersList"),

    productModalOverlay: document.getElementById("productModalOverlay"),
    productModalClose: document.getElementById("productModalClose"),
    productModalTitle: document.getElementById("productModalTitle"),
    productForm: document.getElementById("productForm"),
    fieldId: document.getElementById("fieldId"),
    fieldName: document.getElementById("fieldName"),
    fieldBrand: document.getElementById("fieldBrand"),
    fieldCategory: document.getElementById("fieldCategory"),
    categoryOptions: document.getElementById("categoryOptions"),
    fieldRef: document.getElementById("fieldRef"),
    fieldAvail: document.getElementById("fieldAvail"),
    fieldMinQty: document.getElementById("fieldMinQty"),
    fieldMayor: document.getElementById("fieldMayor"),
    fieldOffer: document.getElementById("fieldOffer"),
    fieldStock: document.getElementById("fieldStock"),
    fieldNote: document.getElementById("fieldNote"),
    fieldFeatured: document.getElementById("fieldFeatured"),
    fieldImageFile: document.getElementById("fieldImageFile"),
    fieldImagePreview: document.getElementById("fieldImagePreview"),
    deleteProductBtn: document.getElementById("deleteProductBtn"),
    cancelProductBtn: document.getElementById("cancelProductBtn"),
    saveProductBtn: document.getElementById("saveProductBtn"),
    productFormMessage: document.getElementById("productFormMessage"),

    bannerModalOverlay: document.getElementById("bannerModalOverlay"),
    bannerModalClose: document.getElementById("bannerModalClose"),
    bannerModalTitle: document.getElementById("bannerModalTitle"),
    bannerForm: document.getElementById("bannerForm"),
    bannerFieldId: document.getElementById("bannerFieldId"),
    bannerFieldTitle: document.getElementById("bannerFieldTitle"),
    bannerFieldSubtitle: document.getElementById("bannerFieldSubtitle"),
    bannerFieldImageFile: document.getElementById("bannerFieldImageFile"),
    bannerFieldImagePreview: document.getElementById("bannerFieldImagePreview"),
    bannerFieldDest: document.getElementById("bannerFieldDest"),
    bannerCustomLinkWrap: document.getElementById("bannerCustomLinkWrap"),
    bannerFieldLink: document.getElementById("bannerFieldLink"),
    bannerFieldButtonText: document.getElementById("bannerFieldButtonText"),
    bannerFieldSort: document.getElementById("bannerFieldSort"),
    bannerFieldActive: document.getElementById("bannerFieldActive"),
    deleteBannerBtn: document.getElementById("deleteBannerBtn"),
    cancelBannerBtn: document.getElementById("cancelBannerBtn"),
    saveBannerBtn: document.getElementById("saveBannerBtn"),
    bannerFormMessage: document.getElementById("bannerFormMessage"),

    settingsForm: document.getElementById("settingsForm"),
    settingsEyebrow: document.getElementById("settingsEyebrow"),
    settingsHeroTitle: document.getElementById("settingsHeroTitle"),
    settingsHeroSubtitle: document.getElementById("settingsHeroSubtitle"),
    settingsExchangeRate: document.getElementById("settingsExchangeRate"),
    settingsPagoMovilPhone: document.getElementById("settingsPagoMovilPhone"),
    settingsPagoMovilCedula: document.getElementById("settingsPagoMovilCedula"),
    settingsPagoMovilBank: document.getElementById("settingsPagoMovilBank"),
    settingsBinanceEmail: document.getElementById("settingsBinanceEmail"),
    settingsBinanceHolder: document.getElementById("settingsBinanceHolder"),
    settingsZelleEmail: document.getElementById("settingsZelleEmail"),
    settingsZelleHolder: document.getElementById("settingsZelleHolder"),
    saveSettingsBtn: document.getElementById("saveSettingsBtn"),
    settingsMessage: document.getElementById("settingsMessage"),
  };

  function money(n) { return "$" + Number(n || 0).toFixed(2); }
  function showMessage(node, text, ok) {
    node.textContent = text;
    node.hidden = false;
    node.className = "form-message " + (ok ? "ok" : "error");
  }
  function showToast(text, isError) {
    console.log((isError ? "ERROR: " : "") + text);
    let toast = document.getElementById("adminToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "adminToast";
      toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1B1220;color:#E8C468;padding:12px 22px;border-radius:999px;font-size:13.5px;z-index:999;box-shadow:0 10px 30px rgba(0,0,0,.3);";
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.background = isError ? "#a3294f" : "#1B1220";
    toast.style.color = isError ? "#fff" : "#E8C468";
    toast.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.hidden = true; }, 3000);
  }

  /* ---------------------------------------------------------------
     Autenticación
     --------------------------------------------------------------- */
  el.loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.loginError.hidden = true;
    el.loginBtn.disabled = true;
    el.loginBtn.textContent = "Entrando…";
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: el.loginEmail.value.trim(),
      password: el.loginPassword.value,
    });
    el.loginBtn.disabled = false;
    el.loginBtn.textContent = "Entrar";
    if (error) {
      el.loginError.textContent = "Correo o contraseña incorrectos.";
      el.loginError.hidden = false;
      return;
    }
    await enterAdmin(data.user);
  });

  el.logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    location.reload();
  });

  async function checkSession() {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) await enterAdmin(data.session.user);
  }

  async function enterAdmin(user) {
    el.loginScreen.hidden = true;
    el.adminApp.hidden = false;
    el.adminUserEmail.textContent = user.email;
    loadProducts();
    loadOrders();
    loadBanners();
    loadAdvisors();
    loadSettings();
  }

  /* ---------------------------------------------------------------
     Tabs
     --------------------------------------------------------------- */
  const tabPanels = { summary: el.tabSummary, products: el.tabProducts, orders: el.tabOrders, banners: el.tabBanners, advisors: el.tabAdvisors, settings: el.tabSettings };
  document.querySelectorAll(".admin-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      Object.values(tabPanels).forEach(p => p.hidden = true);
      tabPanels[btn.dataset.tab].hidden = false;
    });
  });

  /* ---------------------------------------------------------------
     PRODUCTOS
     --------------------------------------------------------------- */
  let allProducts = [];
  let pendingImageFile = null;

  async function loadProducts() {
    const { data, error } = await supabaseClient.from("products").select("*").order("id", { ascending: true });
    if (error) { showToast("No se pudo cargar el catálogo: " + error.message, true); return; }
    allProducts = data || [];
    paintStats();
    buildCategoryDatalist();
    renderTable();
  }

  function paintStats() {
    el.statTotalProducts.textContent = allProducts.length;
    el.statAvailProducts.textContent = allProducts.filter(p => p.avail).length;
    el.statOutProducts.textContent = allProducts.filter(p => !p.avail).length;
    el.noPhotoCount.textContent = allProducts.filter(p => !p.image).length;
  }

  function buildCategoryDatalist() {
    const cats = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, "es"));
    el.categoryOptions.innerHTML = cats.map(c => `<option value="${c}">`).join("");
  }

  function getFilteredProducts() {
    const q = (el.adminSearch.value || "").toLowerCase().trim();
    let list = allProducts;
    if (q) list = list.filter(p => `${p.name} ${p.brand} ${p.category} ${p.ref}`.toLowerCase().includes(q));
    if (el.filterNoPhoto.checked) list = list.filter(p => !p.image);
    return list;
  }
  el.filterNoPhoto.addEventListener("change", renderTable);

  function renderTable() {
    const list = getFilteredProducts();
    el.adminTableBody.innerHTML = list.map(p => `
      <tr>
        <td>
          <label class="row-thumb-upload" title="Clic para subir/cambiar foto">
            <img class="row-thumb" src="${p.image || ''}" alt="">
            <span class="row-thumb-cam">📷</span>
            <input type="file" accept="image/*" data-quick-image="${p.id}" hidden>
          </label>
        </td>
        <td>${p.name}</td>
        <td>${p.category || "—"}</td>
        <td>${money(p.mayor)}</td>
        <td>${p.min_qty || 12}</td>
        <td><span class="badge-avail ${p.avail ? 'yes' : 'no'}">${p.avail ? "Sí" : "No"}</span></td>
        <td><button class="row-edit-btn" data-edit="${p.id}">Editar</button></td>
      </tr>
    `).join("");
  }
  el.adminSearch.addEventListener("input", renderTable);

  // Subida rápida de foto directo desde la tabla, sin abrir el formulario
  el.adminTableBody.addEventListener("change", async (e) => {
    const input = e.target.closest("[data-quick-image]");
    if (!input || !input.files[0]) return;
    const id = input.dataset.quickImage;
    const row = input.closest("tr");
    const thumb = row.querySelector(".row-thumb");
    const file = input.files[0];

    row.style.opacity = "0.5";
    try {
      const ext = file.name.split(".").pop();
      const path = `product-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
      const { error: uploadError } = await supabaseClient.storage.from("product-images").upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);

      const { error } = await supabaseClient.from("products").update({ image: data.publicUrl, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;

      thumb.src = data.publicUrl;
      const p = allProducts.find(pp => String(pp.id) === id);
      if (p) p.image = data.publicUrl;
      paintStats();
      if (el.filterNoPhoto.checked) row.remove();
      showToast("Foto guardada ✓");
    } catch (err) {
      showToast("No se pudo subir: " + err.message, true);
    } finally {
      row.style.opacity = "1";
    }
  });

  el.adminTableBody.addEventListener("click", (e) => {
    const editId = e.target.closest("[data-edit]")?.dataset.edit;
    if (editId) openProductModal(allProducts.find(p => String(p.id) === editId));
  });

  function openProductModal(product) {
    pendingImageFile = null;
    el.productFormMessage.hidden = true;
    if (product) {
      el.productModalTitle.textContent = "Editar producto";
      el.fieldId.value = product.id;
      el.fieldName.value = product.name || "";
      el.fieldBrand.value = product.brand || "";
      el.fieldCategory.value = product.category || "";
      el.fieldRef.value = product.ref || "";
      el.fieldAvail.value = String(Boolean(product.avail));
      el.fieldMinQty.value = product.min_qty ?? 12;
      el.fieldMayor.value = product.mayor ?? "";
      el.fieldOffer.value = product.offer ?? "";
      el.fieldStock.value = product.stock ?? "";
      el.fieldNote.value = product.note || "";
      el.fieldFeatured.checked = Boolean(product.featured);
      if (product.image) { el.fieldImagePreview.src = product.image; el.fieldImagePreview.hidden = false; }
      else { el.fieldImagePreview.hidden = true; }
      el.deleteProductBtn.hidden = false;
    } else {
      el.productModalTitle.textContent = "Nuevo producto";
      el.productForm.reset();
      el.fieldId.value = "";
      el.fieldAvail.value = "true";
      el.fieldImagePreview.hidden = true;
      el.deleteProductBtn.hidden = true;
    }
    el.productModalOverlay.hidden = false;
  }
  function closeProductModal() { el.productModalOverlay.hidden = true; }
  el.newProductBtn.addEventListener("click", () => openProductModal(null));
  el.productModalClose.addEventListener("click", closeProductModal);
  el.cancelProductBtn.addEventListener("click", closeProductModal);
  el.productModalOverlay.addEventListener("click", (e) => { if (e.target === el.productModalOverlay) closeProductModal(); });

  el.fieldImageFile.addEventListener("change", () => {
    const file = el.fieldImageFile.files[0];
    if (!file) return;
    pendingImageFile = file;
    el.fieldImagePreview.src = URL.createObjectURL(file);
    el.fieldImagePreview.hidden = false;
  });

  async function uploadImageIfNeeded(existingUrl) {
    if (!pendingImageFile) return existingUrl || "";
    const ext = pendingImageFile.name.split(".").pop();
    const path = `product-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    const { error } = await supabaseClient.storage.from("product-images").upload(path, pendingImageFile, { upsert: false });
    if (error) throw error;
    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  el.productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.productFormMessage.hidden = true;
    el.saveProductBtn.disabled = true;
    el.saveProductBtn.textContent = "Guardando…";
    try {
      const id = el.fieldId.value;
      const existing = id ? allProducts.find(p => String(p.id) === id) : null;
      const imageUrl = await uploadImageIfNeeded(existing?.image);

      const payload = {
        name: el.fieldName.value.trim(),
        brand: el.fieldBrand.value.trim(),
        category: el.fieldCategory.value.trim(),
        ref: el.fieldRef.value.trim(),
        avail: el.fieldAvail.value === "true",
        min_qty: parseInt(el.fieldMinQty.value, 10) || 12,
        mayor: parseFloat(el.fieldMayor.value) || 0,
        offer: el.fieldOffer.value ? parseFloat(el.fieldOffer.value) : null,
        stock: el.fieldStock.value ? parseInt(el.fieldStock.value, 10) : null,
        note: el.fieldNote.value.trim(),
        featured: el.fieldFeatured.checked,
        image: imageUrl,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (id) ({ error } = await supabaseClient.from("products").update(payload).eq("id", id));
      else ({ error } = await supabaseClient.from("products").insert(payload));
      if (error) throw error;

      closeProductModal();
      await loadProducts();
      showToast("Producto guardado ✓");
    } catch (err) {
      showMessage(el.productFormMessage, "No se pudo guardar: " + err.message, false);
    } finally {
      el.saveProductBtn.disabled = false;
      el.saveProductBtn.textContent = "Guardar";
    }
  });

  el.deleteProductBtn.addEventListener("click", async () => {
    const id = el.fieldId.value;
    if (!id || !window.confirm("¿Eliminar este producto?")) return;
    const { error } = await supabaseClient.from("products").delete().eq("id", id);
    if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
    closeProductModal();
    await loadProducts();
    showToast("Producto eliminado");
  });

  /* ---------------------------------------------------------------
     PEDIDOS
     --------------------------------------------------------------- */
  let allOrders = [];
  const STATUS_LABELS = { nuevo: "🆕 Nuevo", tomado: "📦 Tomado", entregado: "✅ Entregado", cancelado: "❌ Cancelado" };

  async function loadOrders() {
    const { data, error } = await supabaseClient.from("orders").select("*").order("created_at", { ascending: false });
    if (error) { showToast("No se pudieron cargar los pedidos: " + error.message, true); return; }
    allOrders = data || [];
    const pending = allOrders.filter(o => o.status === "nuevo").length;
    el.statNewOrders.textContent = pending;
    el.ordersBadge.textContent = pending;
    el.ordersBadge.hidden = pending === 0;
    renderOrders();
  }

  function renderOrders() {
    if (!allOrders.length) { el.ordersList.innerHTML = ""; el.ordersEmpty.hidden = false; return; }
    el.ordersEmpty.hidden = true;
    el.ordersList.innerHTML = allOrders.map(o => {
      const items = Array.isArray(o.items) ? o.items : [];
      const itemsText = items.map(i => `${i.qty}x ${i.name}`).join(", ");
      const date = new Date(o.created_at).toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" });
      return `
        <div class="order-card">
          <div class="order-top">
            <span class="order-name">${o.customer_name || "—"} — ${o.phone || ""}</span>
            <select class="order-status-select" data-order-status="${o.id}">
              ${Object.entries(STATUS_LABELS).map(([val, label]) => `<option value="${val}" ${o.status === val ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </div>
          <p class="order-date">${date}</p>
          <p class="order-items">${itemsText}</p>
          <p class="order-total">${money(o.total)}</p>
          <p class="order-meta">${o.payment_method || ""} · ${o.delivery_method || ""} · ${o.city || ""}${o.address ? " — " + o.address : ""}</p>
        </div>
      `;
    }).join("");
  }
  el.ordersList.addEventListener("change", async (e) => {
    const id = e.target.closest("[data-order-status]")?.dataset.orderStatus;
    if (!id) return;
    const { error } = await supabaseClient.from("orders").update({ status: e.target.value }).eq("id", id);
    if (error) { showToast("No se pudo actualizar: " + error.message, true); return; }
    const o = allOrders.find(x => String(x.id) === id);
    if (o) o.status = e.target.value;
    const pending = allOrders.filter(x => x.status === "nuevo").length;
    el.statNewOrders.textContent = pending;
    el.ordersBadge.textContent = pending;
    el.ordersBadge.hidden = pending === 0;
    showToast("Estado actualizado");
  });

  /* ---------------------------------------------------------------
     BANNERS
     --------------------------------------------------------------- */
  let allBanners = [];
  let pendingBannerImageFile = null;

  async function loadBanners() {
    const { data, error } = await supabaseClient.from("banners").select("*").order("sort_order", { ascending: true });
    if (error) { showToast("No se pudieron cargar los banners: " + error.message, true); return; }
    allBanners = data || [];
    renderBanners();
  }

  function renderBanners() {
    if (!allBanners.length) { el.bannersList.innerHTML = `<p class="admin-empty">Todavía no hay banners.</p>`; return; }
    el.bannersList.innerHTML = allBanners.map(b => `
      <div class="banner-row">
        <img src="${b.image || ''}" alt="">
        <div class="banner-row-info">
          <strong>${b.title || "(sin título)"}</strong>
          <span>${b.active ? "Activo" : "Inactivo"} · Orden ${b.sort_order}</span>
        </div>
        <button class="row-edit-btn" data-edit-banner="${b.id}">Editar</button>
      </div>
    `).join("");
  }
  el.bannersList.addEventListener("click", (e) => {
    const id = e.target.closest("[data-edit-banner]")?.dataset.editBanner;
    if (id) openBannerModal(allBanners.find(b => String(b.id) === id));
  });

  function openBannerModal(banner) {
    pendingBannerImageFile = null;
    el.bannerFormMessage.hidden = true;
    if (banner) {
      el.bannerModalTitle.textContent = "Editar banner";
      el.bannerFieldId.value = banner.id;
      el.bannerFieldTitle.value = banner.title || "";
      el.bannerFieldSubtitle.value = banner.subtitle || "";
      const savedLink = banner.link_url || "";
      const destOption = Array.from(el.bannerFieldDest.options).find(o => o.value === savedLink && o.value !== "custom");
      el.bannerFieldDest.value = !savedLink ? "" : (destOption ? savedLink : "custom");
      el.bannerFieldLink.value = el.bannerFieldDest.value === "custom" ? savedLink : "";
      el.bannerFieldButtonText.value = banner.button_text || "";
      el.bannerFieldSort.value = banner.sort_order || 0;
      el.bannerFieldActive.checked = Boolean(banner.active);
      if (banner.image) { el.bannerFieldImagePreview.src = banner.image; el.bannerFieldImagePreview.hidden = false; }
      else el.bannerFieldImagePreview.hidden = true;
      el.deleteBannerBtn.hidden = false;
    } else {
      el.bannerModalTitle.textContent = "Nuevo banner";
      el.bannerForm.reset();
      el.bannerFieldId.value = "";
      el.bannerFieldActive.checked = true;
      el.bannerFieldImagePreview.hidden = true;
      el.deleteBannerBtn.hidden = true;
    }
    el.bannerCustomLinkWrap.hidden = el.bannerFieldDest.value !== "custom";
    el.bannerModalOverlay.hidden = false;
  }
  el.bannerFieldDest.addEventListener("change", () => {
    el.bannerCustomLinkWrap.hidden = el.bannerFieldDest.value !== "custom";
  });
  function closeBannerModal() { el.bannerModalOverlay.hidden = true; }
  el.newBannerBtn.addEventListener("click", () => openBannerModal(null));
  el.bannerModalClose.addEventListener("click", closeBannerModal);
  el.cancelBannerBtn.addEventListener("click", closeBannerModal);
  el.bannerModalOverlay.addEventListener("click", (e) => { if (e.target === el.bannerModalOverlay) closeBannerModal(); });

  el.bannerFieldImageFile.addEventListener("change", () => {
    const file = el.bannerFieldImageFile.files[0];
    if (!file) return;
    pendingBannerImageFile = file;
    el.bannerFieldImagePreview.src = URL.createObjectURL(file);
    el.bannerFieldImagePreview.hidden = false;
  });

  async function uploadBannerImageIfNeeded(existingUrl) {
    if (!pendingBannerImageFile) return existingUrl || "";
    const ext = pendingBannerImageFile.name.split(".").pop();
    const path = `banner-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    const { error } = await supabaseClient.storage.from("product-images").upload(path, pendingBannerImageFile, { upsert: false });
    if (error) throw error;
    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  el.bannerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.bannerFormMessage.hidden = true;
    el.saveBannerBtn.disabled = true;
    el.saveBannerBtn.textContent = "Guardando…";
    try {
      const id = el.bannerFieldId.value;
      const existing = id ? allBanners.find(b => String(b.id) === id) : null;
      const imageUrl = await uploadBannerImageIfNeeded(existing?.image);

      const payload = {
        title: el.bannerFieldTitle.value.trim(),
        subtitle: el.bannerFieldSubtitle.value.trim(),
        link_url: el.bannerFieldDest.value === "custom" ? el.bannerFieldLink.value.trim() : el.bannerFieldDest.value,
        button_text: el.bannerFieldButtonText.value.trim(),
        sort_order: parseInt(el.bannerFieldSort.value, 10) || 0,
        active: el.bannerFieldActive.checked,
        image: imageUrl,
      };

      let error;
      if (id) ({ error } = await supabaseClient.from("banners").update(payload).eq("id", id));
      else ({ error } = await supabaseClient.from("banners").insert(payload));
      if (error) throw error;

      closeBannerModal();
      await loadBanners();
      showToast("Banner guardado ✓");
    } catch (err) {
      showMessage(el.bannerFormMessage, "No se pudo guardar: " + err.message, false);
    } finally {
      el.saveBannerBtn.disabled = false;
      el.saveBannerBtn.textContent = "Guardar";
    }
  });

  el.deleteBannerBtn.addEventListener("click", async () => {
    const id = el.bannerFieldId.value;
    if (!id || !window.confirm("¿Eliminar este banner?")) return;
    const { error } = await supabaseClient.from("banners").delete().eq("id", id);
    if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
    closeBannerModal();
    await loadBanners();
    showToast("Banner eliminado");
  });

  /* ---------------------------------------------------------------
     ASESORAS
     --------------------------------------------------------------- */
  let allAdvisors = [];
  let pendingAdvisorImageFile = null;

  async function loadAdvisors() {
    const { data, error } = await supabaseClient.from("advisors").select("*").order("sort_order", { ascending: true });
    if (error) { showToast("No se pudieron cargar las asesoras: " + error.message, true); return; }
    allAdvisors = data || [];
    renderAdvisorsTable();
  }

  function renderAdvisorsTable() {
    el.advisorsTableBody.innerHTML = allAdvisors.map(a => `
      <tr>
        <td><img class="row-thumb" src="${a.image || ''}" alt=""></td>
        <td>${a.name}</td>
        <td>${a.phone}</td>
        <td>${a.sort_order}</td>
        <td><span class="badge-avail ${a.active ? 'yes' : 'no'}">${a.active ? "Sí" : "No"}</span></td>
        <td><button class="row-edit-btn" data-edit-advisor="${a.id}">Editar</button></td>
      </tr>
    `).join("");
  }
  el.advisorsTableBody.addEventListener("click", (e) => {
    const id = e.target.closest("[data-edit-advisor]")?.dataset.editAdvisor;
    if (id) openAdvisorModal(allAdvisors.find(a => String(a.id) === id));
  });

  function openAdvisorModal(advisor) {
    pendingAdvisorImageFile = null;
    el.advisorFormMessage.hidden = true;
    if (advisor) {
      el.advisorModalTitle.textContent = "Editar asesora";
      el.advisorFieldId.value = advisor.id;
      el.advisorFieldName.value = advisor.name || "";
      el.advisorFieldPhone.value = advisor.phone || "";
      el.advisorFieldSort.value = advisor.sort_order || 0;
      el.advisorFieldActive.checked = Boolean(advisor.active);
      if (advisor.image) { el.advisorFieldImagePreview.src = advisor.image; el.advisorFieldImagePreview.hidden = false; }
      else el.advisorFieldImagePreview.hidden = true;
      el.deleteAdvisorBtn.hidden = false;
    } else {
      el.advisorModalTitle.textContent = "Nueva asesora";
      el.advisorForm.reset();
      el.advisorFieldId.value = "";
      el.advisorFieldActive.checked = true;
      el.advisorFieldImagePreview.hidden = true;
      el.deleteAdvisorBtn.hidden = true;
    }
    el.advisorModalOverlay.hidden = false;
  }
  function closeAdvisorModal() { el.advisorModalOverlay.hidden = true; }
  el.newAdvisorBtn.addEventListener("click", () => openAdvisorModal(null));
  el.advisorModalClose.addEventListener("click", closeAdvisorModal);
  el.cancelAdvisorBtn.addEventListener("click", closeAdvisorModal);
  el.advisorModalOverlay.addEventListener("click", (e) => { if (e.target === el.advisorModalOverlay) closeAdvisorModal(); });

  el.advisorFieldImageFile.addEventListener("change", () => {
    const file = el.advisorFieldImageFile.files[0];
    if (!file) return;
    pendingAdvisorImageFile = file;
    el.advisorFieldImagePreview.src = URL.createObjectURL(file);
    el.advisorFieldImagePreview.hidden = false;
  });

  async function uploadAdvisorImageIfNeeded(existingUrl) {
    if (!pendingAdvisorImageFile) return existingUrl || "";
    const ext = pendingAdvisorImageFile.name.split(".").pop();
    const path = `advisor-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    const { error } = await supabaseClient.storage.from("product-images").upload(path, pendingAdvisorImageFile, { upsert: false });
    if (error) throw error;
    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  el.advisorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.advisorFormMessage.hidden = true;
    el.saveAdvisorBtn.disabled = true;
    el.saveAdvisorBtn.textContent = "Guardando…";
    try {
      const id = el.advisorFieldId.value;
      const existing = id ? allAdvisors.find(a => String(a.id) === id) : null;
      const imageUrl = await uploadAdvisorImageIfNeeded(existing?.image);
      const payload = {
        name: el.advisorFieldName.value.trim(),
        phone: el.advisorFieldPhone.value.trim().replace(/\D/g, ""),
        sort_order: parseInt(el.advisorFieldSort.value, 10) || 0,
        active: el.advisorFieldActive.checked,
        image: imageUrl,
      };
      let error;
      if (id) ({ error } = await supabaseClient.from("advisors").update(payload).eq("id", id));
      else ({ error } = await supabaseClient.from("advisors").insert(payload));
      if (error) throw error;

      closeAdvisorModal();
      await loadAdvisors();
      showToast("Asesora guardada ✓");
    } catch (err) {
      showMessage(el.advisorFormMessage, "No se pudo guardar: " + err.message, false);
    } finally {
      el.saveAdvisorBtn.disabled = false;
      el.saveAdvisorBtn.textContent = "Guardar";
    }
  });

  el.deleteAdvisorBtn.addEventListener("click", async () => {
    const id = el.advisorFieldId.value;
    if (!id || !window.confirm("¿Eliminar esta asesora?")) return;
    const { error } = await supabaseClient.from("advisors").delete().eq("id", id);
    if (error) { showToast("No se pudo eliminar: " + error.message, true); return; }
    closeAdvisorModal();
    await loadAdvisors();
    showToast("Asesora eliminada");
  });

  /* ---------------------------------------------------------------
     AJUSTES
     --------------------------------------------------------------- */
  async function loadSettings() {
    const settings = await fetchSettings();
    el.settingsEyebrow.value = settings.eyebrow_text || "";
    el.settingsHeroTitle.value = settings.hero_title || "";
    el.settingsHeroSubtitle.value = settings.hero_subtitle || "";
    el.settingsExchangeRate.value = settings.exchange_rate || "";
    el.settingsPagoMovilPhone.value = settings.pago_movil_phone || "";
    el.settingsPagoMovilCedula.value = settings.pago_movil_cedula || "";
    el.settingsPagoMovilBank.value = settings.pago_movil_bank || "";
    el.settingsBinanceEmail.value = settings.binance_email || "";
    el.settingsBinanceHolder.value = settings.binance_holder_name || "";
    el.settingsZelleEmail.value = settings.zelle_email || "";
    el.settingsZelleHolder.value = settings.zelle_holder_name || "";
  }

  el.settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.settingsMessage.hidden = true;
    el.saveSettingsBtn.disabled = true;
    el.saveSettingsBtn.textContent = "Guardando…";
    const payload = {
      id: 1,
      eyebrow_text: el.settingsEyebrow.value.trim(),
      hero_title: el.settingsHeroTitle.value.trim(),
      hero_subtitle: el.settingsHeroSubtitle.value.trim(),
      exchange_rate: parseFloat(el.settingsExchangeRate.value) || 0,
      pago_movil_phone: el.settingsPagoMovilPhone.value.trim(),
      pago_movil_cedula: el.settingsPagoMovilCedula.value.trim(),
      pago_movil_bank: el.settingsPagoMovilBank.value.trim(),
      binance_email: el.settingsBinanceEmail.value.trim(),
      binance_holder_name: el.settingsBinanceHolder.value.trim(),
      zelle_email: el.settingsZelleEmail.value.trim(),
      zelle_holder_name: el.settingsZelleHolder.value.trim(),
    };
    const { error } = await supabaseClient.from("site_settings").upsert(payload);
    el.saveSettingsBtn.disabled = false;
    el.saveSettingsBtn.textContent = "Guardar ajustes";
    if (error) { showMessage(el.settingsMessage, "No se pudo guardar: " + error.message, false); return; }
    showMessage(el.settingsMessage, "✅ Ajustes guardados.", true);
  });

  checkSession();
})();
