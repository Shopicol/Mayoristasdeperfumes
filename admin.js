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
    tabBulk: document.getElementById("tabBulk"),
    tabAdvisors: document.getElementById("tabAdvisors"),
    advisorsTableBody: document.getElementById("advisorsTableBody"),
    newAdvisorBtn: document.getElementById("newAdvisorBtn"),
    advisorModalOverlay: document.getElementById("advisorModalOverlay"),
    advisorModalClose: document.getElementById("advisorModalClose"),
    advisorModalTitle: document.getElementById("advisorModalTitle"),
    advisorForm: document.getElementById("advisorForm"),
    advisorFieldHidden: document.getElementById("advisorFieldHidden"),
    advisorVipBox: document.getElementById("advisorVipBox"),
    advisorVipLink: document.getElementById("advisorVipLink"),
    advisorVipCopy: document.getElementById("advisorVipCopy"),
    advisorVipRenew: document.getElementById("advisorVipRenew"),
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
    fieldPosgold: document.getElementById("fieldPosgold"),
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
    ordersMonth: document.getElementById("ordersMonth"),
    ordersMonthInfo: document.getElementById("ordersMonthInfo"),
    ordersExportMonthBtn: document.getElementById("ordersExportMonthBtn"),
    ordersExportAllBtn: document.getElementById("ordersExportAllBtn"),
    monthsCard: document.getElementById("monthsCard"),
    monthsBody: document.getElementById("monthsBody"),
    tabClients: document.getElementById("tabClients"),
    clientsSearch: document.getElementById("clientsSearch"),
    clientsExportBtn: document.getElementById("clientsExportBtn"),
    clientsSummary: document.getElementById("clientsSummary"),
    clientsBody: document.getElementById("clientsBody"),
    clientsEmpty: document.getElementById("clientsEmpty"),
    myLinkBox: document.getElementById("myLinkBox"),
    myLinkUrl: document.getElementById("myLinkUrl"),
    copyMyLinkBtn: document.getElementById("copyMyLinkBtn"),
    advisorLinks: document.getElementById("advisorLinks"),
    bannerFieldMobileFile: document.getElementById("bannerFieldMobileFile"),
    bannerFieldMobilePreview: document.getElementById("bannerFieldMobilePreview"),
    bannerRemoveMobileBtn: document.getElementById("bannerRemoveMobileBtn"),
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
    settingsPosgoldBodega: document.getElementById("settingsPosgoldBodega"),
    settingsPagoMovilPhone: document.getElementById("settingsPagoMovilPhone"),
    settingsPagoMovilCedula: document.getElementById("settingsPagoMovilCedula"),
    settingsPagoMovilBank: document.getElementById("settingsPagoMovilBank"),
    settingsBinanceId: document.getElementById("settingsBinanceId"),
    settingsHideSoldout: document.getElementById("settingsHideSoldout"),
    settingsHoursEnabled: document.getElementById("settingsHoursEnabled"),
    hoursRows: document.getElementById("hoursRows"),
    salesTodayCard: document.getElementById("salesTodayCard"),
    statSalesToday: document.getElementById("statSalesToday"),
    statSalesTodayDetail: document.getElementById("statSalesTodayDetail"),
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

  // Rol de quien entró: "admin" (todo) o "advisor" (asesora: solo sus pedidos y los productos)
  let currentRole = "admin";
  async function loadStaffRole(user) {
    const { data, error } = await supabaseClient.from("staff").select("email,role,advisor_id");
    if (error) {
      // Si la tabla "staff" aún no existe (todavía no se corrió la migración), se funciona como antes.
      if (/staff/i.test(error.message || "") || error.code === "42P01" || error.code === "PGRST205") return { role: "admin", legacy: true };
      throw error;
    }
    const mine = (data || []).find(r => String(r.email).toLowerCase() === String(user.email).toLowerCase());
    return mine || null;
  }

  /* Link personal de cada asesora: al abrirlo, la tienda deja elegida a esa asesora */
  const SITE_URL = "https://www.mayoristasdeperfumesven.com/";
  const slugOf = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const advisorLink = name => `${SITE_URL}?asesora=${slugOf(name)}`;
  const vipLink = token => `${SITE_URL}?vip=${token}`;
  const newVipToken = () => Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, "0")).join("");   // 32 caracteres al azar
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const t = document.createElement("textarea"); t.value = text; t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (e2) {} t.remove(); return ok;
    }
  }
  el.copyMyLinkBtn.addEventListener("click", async () => {
    const ok = await copyText(el.myLinkUrl.value);
    showToast(ok ? "Link copiado ✓" : "No se pudo copiar: selecciónalo y cópialo a mano", !ok);
  });
  el.advisorLinks.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy-link]");
    if (!btn) return;
    const ok = await copyText(btn.dataset.copyLink);
    showToast(ok ? "Link copiado ✓" : "No se pudo copiar", !ok);
  });

  async function enterAdmin(user) {
    let staff = null;
    try { staff = await loadStaffRole(user); }
    catch (err) { el.loginError.textContent = "No se pudo comprobar tu acceso: " + err.message; el.loginError.hidden = false; el.loginScreen.hidden = false; el.adminApp.hidden = true; return; }
    if (!staff) {
      await supabaseClient.auth.signOut();
      el.loginScreen.hidden = false; el.adminApp.hidden = true;
      el.loginError.textContent = "Tu usuario no tiene permisos. Pídele acceso a la administradora.";
      el.loginError.hidden = false;
      return;
    }
    currentRole = staff.role === "advisor" ? "advisor" : "admin";
    el.loginScreen.hidden = true;
    el.adminApp.hidden = false;
    el.adminUserEmail.textContent = user.email;

    if (currentRole === "advisor") {
      // Asesora: solo Productos, Carga masiva y SUS pedidos (la base de datos además lo impone).
      const allowed = ["products", "bulk", "orders", "clients"];
      document.querySelectorAll(".admin-tab").forEach(b => { b.hidden = !allowed.includes(b.dataset.tab); });
      let name = "", vipUrl = "";
      if (staff.advisor_id) {
        const { data } = await supabaseClient.from("advisors").select("*").eq("id", staff.advisor_id).maybeSingle();
        name = data ? data.name : "";
        if (data && data.is_hidden && data.vip_token) vipUrl = vipLink(data.vip_token);
      }
      el.adminUserEmail.textContent = name ? `Asesora ${name}` : user.email;
      if (name) { el.myLinkUrl.value = vipUrl || advisorLink(name); el.myLinkBox.hidden = false; }
      loadProducts();
      loadOrders();
      document.querySelector('.admin-tab[data-tab="orders"]').click();
      return;
    }
    loadProducts();
    loadOrders();
    loadBanners();
    loadAdvisors();
    loadSettings();
  }

  /* ---------------------------------------------------------------
     Tabs
     --------------------------------------------------------------- */
  const tabPanels = { summary: el.tabSummary, products: el.tabProducts, bulk: el.tabBulk, orders: el.tabOrders, clients: el.tabClients, banners: el.tabBanners, advisors: el.tabAdvisors, settings: el.tabSettings };
  document.querySelectorAll(".admin-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      Object.values(tabPanels).forEach(p => p.hidden = true);
      tabPanels[btn.dataset.tab].hidden = false;
    });
  });

  // La carga masiva (bulk.js) avisa cuando termina, para refrescar la lista de productos
  window.addEventListener("products-imported", () => loadProducts());

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
    if (typeof renderOrders === "function" && Array.isArray(allOrders) && allOrders.length) renderOrders();
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
      el.fieldPosgold.value = product.posgold_code || "";
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
        posgold_code: el.fieldPosgold.value.trim(),
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
  let allOrders = [];              // los pedidos del MES elegido (lo que se ve en la pestaña Pedidos)
  let selectedMonth = "";          // "2026-10"
  let todayOrders = [];            // pedidos de hoy Tomado/Entregado (para «Ventas de hoy»)
  let summaryByMonth = null;       // resumen por mes (lo calcula la base de datos)
  let clientsOrders = [], clientsLoaded = false, clientsLoading = false;
  const STATUS_LABELS = { nuevo: "🆕 Nuevo", tomado: "📦 Tomado", entregado: "✅ Entregado", cancelado: "❌ Cancelado" };
  const PAY_LABELS = { pendiente: "⏳ Pago pendiente", por_verificar: "🔎 Pago por verificar", pagado: "✅ Pagado" };

  /* ---------------------------------------------------------------
     CLIENTES: se arman agrupando los pedidos (por cédula; si no hay, por teléfono).
     La administradora ve todos; cada asesora ve solo los de sus pedidos (la base de datos lo impone).
     --------------------------------------------------------------- */
  const digitsOnly = s => String(s || "").replace(/\D/g, "");
  const dayFmtVE = d => new Date(d).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Caracas" });
  const ESTADOS = { nuevo: "Nuevo", tomado: "Tomado", entregado: "Entregado", cancelado: "Cancelado" };
  let clientsList = [], openClientKey = null;

  function buildClients() {
    const sorted = [...clientsOrders].sort((x, y) => new Date(y.created_at) - new Date(x.created_at));   // más reciente primero
    const phoneKey = o => digitsOnly(o.phone).slice(-10);
    const phoneToCed = {};
    sorted.forEach(o => { const c = digitsOnly(o.customer_cedula); if (c.length >= 6 && phoneKey(o) && !phoneToCed[phoneKey(o)]) phoneToCed[phoneKey(o)] = c; });
    const map = new Map();
    sorted.forEach(o => {
      const c = digitsOnly(o.customer_cedula);
      const key = c.length >= 6 ? "ced:" + c : (phoneToCed[phoneKey(o)] ? "ced:" + phoneToCed[phoneKey(o)] : "tel:" + (phoneKey(o) || "sin-dato-" + o.id));
      if (!map.has(key)) map.set(key, { key, name: o.customer_name || "—", cedula: o.customer_cedula || "", phone: o.phone || "", orders: [] });
      const cl = map.get(key); cl.orders.push(o);
      if (!cl.cedula && o.customer_cedula) cl.cedula = o.customer_cedula;
    });
    clientsList = [...map.values()].map(cl => {
      const vig = cl.orders.filter(o => o.status !== "cancelado");
      cl.count = vig.length; cl.total = vig.reduce((s, o) => s + (Number(o.total) || 0), 0);
      cl.last = cl.orders[0].created_at; cl.first = cl.orders[cl.orders.length - 1].created_at;
      cl.advisors = [...new Set(cl.orders.map(o => o.advisor_name).filter(Boolean))];
      return cl;
    });
  }
  function renderClients() {
    buildClients();
    const q = el.clientsSearch.value.trim().toLowerCase(), qd = digitsOnly(q);
    const rows = clientsList.filter(c => !q || c.name.toLowerCase().includes(q) || (qd.length >= 3 && (digitsOnly(c.cedula).includes(qd) || digitsOnly(c.phone).includes(qd))) || c.cedula.toLowerCase().includes(q));
    el.clientsEmpty.hidden = clientsList.length > 0;
    el.clientsSummary.textContent = clientsList.length ? `${rows.length} de ${clientsList.length} clientes${currentRole === "advisor" ? " (los de tus pedidos)" : ""}. Toca un cliente para ver su historial. Los totales no cuentan los pedidos cancelados.` : "";
    const esc2 = s => String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
    el.clientsBody.innerHTML = rows.map(c => `
      <tr class="client-row" data-client="${esc2(c.key)}">
        <td><b>${esc2(c.name)}</b></td><td>${esc2(c.cedula) || "—"}</td><td>${esc2(c.phone)}</td>
        <td>${c.count}</td><td>${money(c.total)}</td><td>${dayFmtVE(c.last)}</td><td>${esc2(c.advisors.join(", ")) || "—"}</td>
      </tr>
      ${openClientKey === c.key ? `<tr class="client-detail"><td colspan="7">${c.orders.map(o => `
        <div class="client-detail-line"><b>#${o.id}</b> · ${dayFmtVE(o.created_at)} · ${esc2(ESTADOS[o.status] || o.status)} · ${money(o.total)}${o.advisor_name ? " · " + esc2(o.advisor_name) : ""}
          <span>${(Array.isArray(o.items) ? o.items : []).map(it => esc2(it.qty + " × " + it.name)).join(", ")}</span></div>`).join("")}</td></tr>` : ""}`).join("");
  }
  el.clientsSearch.addEventListener("input", renderClients);
  el.clientsBody.addEventListener("click", e => {
    const row = e.target.closest("[data-client]"); if (!row) return;
    openClientKey = openClientKey === row.dataset.client ? null : row.dataset.client; renderClients();
  });
  el.clientsExportBtn.addEventListener("click", async () => {
    if (!window.XLSX) { showToast("No se pudo cargar el lector de Excel. Recarga la página.", true); return; }
    await ensureClientsLoaded();
    buildClients();
    const aoa = [["Cliente", "Cédula", "Teléfono", "Pedidos (sin cancelados)", "Total US$ (sin cancelados)", "Primer pedido", "Último pedido", "Asesora(s)"],
      ...clientsList.map(c => [c.name, c.cedula, c.phone, c.count, Math.round(c.total * 100) / 100, dayFmtVE(c.first), dayFmtVE(c.last), c.advisors.join(", ")])];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    for (let r = 1; r < aoa.length; r++) for (const c of [1, 2]) { const cell = ws[XLSX.utils.encode_cell({ r, c })]; if (cell && cell.v !== "") { cell.t = "s"; cell.v = String(cell.v); cell.z = "@"; } }
    ws["!cols"] = [34, 16, 16, 12, 14, 14, 14, 24].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "clientes_mayoristas.xlsx"); showToast("Excel de clientes descargado ✓");
  });

  /* ---------- Descargar pedidos en Excel (un mes, o todo el historial) ---------- */
  const ESTADO_TXT = { nuevo: "Nuevo", tomado: "Tomado", entregado: "Entregado", cancelado: "Cancelado" };
  const PAGO_TXT = { pendiente: "Pago pendiente", por_verificar: "Pago por verificar", pagado: "Pagado" };
  const ASIGNA_TXT = { link: "Link personal", recordada: "Recordada y confirmada", elegida: "Elegida por el cliente", turno: "Por turno" };
  function resumenDe(pedidos) {
    const vigentes = pedidos.filter(o => o.status !== "cancelado");
    return { pedidos: vigentes.length, total: vigentes.reduce((s, o) => s + (Number(o.total) || 0), 0), vendido: pedidos.filter(o => o.status === "tomado" || o.status === "entregado").reduce((s, o) => s + (Number(o.total) || 0), 0), cancelados: pedidos.length - vigentes.length };
  }
  function exportarPedidosExcel(pedidos, archivo, titulo, porMes) {
    if (!window.XLSX) { showToast("No se pudo cargar el lector de Excel. Recarga la página.", true); return; }
    const fecha = d => new Date(d).toLocaleDateString("es-VE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Caracas" });
    const hora = d => new Date(d).toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", timeZone: "America/Caracas" });
    const orden = [...pedidos].sort((x, y) => new Date(x.created_at) - new Date(y.created_at));
    const aoa = [["Pedido #", "Fecha", "Hora", "Cliente", "Cédula", "Teléfono", "Ciudad", "Entrega", "Dirección", "Asesora", "Cómo se asignó", "Productos", "Total US$", "Total Bs", "Tasa", "Forma de pago", "Estado del pago", "Referencia", "Estado del pedido", "Nota"],
      ...orden.map(o => [o.id, fecha(o.created_at), hora(o.created_at), o.customer_name || "", o.customer_cedula || "", o.phone || "", o.city || "", o.delivery_method || "", o.address || "", o.advisor_name || "", ASIGNA_TXT[o.assigned_by] || "",
        (Array.isArray(o.items) ? o.items : []).map(i => `${i.qty} × ${i.name}`).join("; "), Math.round((Number(o.total) || 0) * 100) / 100, o.total_bs ? Math.round(Number(o.total_bs) * 100) / 100 : "", o.exchange_rate || "", o.payment_method || "", PAGO_TXT[o.payment_status] || o.payment_status || "", o.payment_reference || "", ESTADO_TXT[o.status] || o.status, o.note || ""])];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    for (let r = 1; r < aoa.length; r++) for (const c of [4, 5, 17]) { const cell = ws[XLSX.utils.encode_cell({ r, c })]; if (cell && cell.v !== "") { cell.t = "s"; cell.v = String(cell.v); cell.z = "@"; } }
    ws["!cols"] = [8, 11, 8, 30, 14, 15, 14, 12, 28, 12, 22, 60, 11, 13, 8, 14, 18, 14, 14, 28].map(w => ({ wch: w })); ws["!freeze"] = { xSplit: 0, ySplit: 1 };
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
    // hoja de resumen
    const r0 = resumenDe(pedidos), res = [[titulo], [], ["Pedidos (sin cancelados)", r0.pedidos], ["Total de los pedidos US$ (sin cancelados)", Math.round(r0.total * 100) / 100], ["Vendido US$ (Tomado + Entregado)", Math.round(r0.vendido * 100) / 100], ["Cancelados", r0.cancelados], []];
    if (porMes) {
      res.push(["Mes", "Pedidos", "Total US$", "Vendido US$"]);
      const meses = {}; pedidos.forEach(o => { const k = mesVE(new Date(o.created_at)); (meses[k] = meses[k] || []).push(o); });
      Object.keys(meses).sort().reverse().forEach(k => { const x = resumenDe(meses[k]); res.push([nombreMes(k), x.pedidos, Math.round(x.total * 100) / 100, Math.round(x.vendido * 100) / 100]); });
    } else {
      res.push(["Asesora", "Pedidos", "Total US$", "Vendido US$"]);
      const por = {}; pedidos.forEach(o => { const k = o.advisor_name || "Sin asesora"; (por[k] = por[k] || []).push(o); });
      Object.keys(por).sort().forEach(k => { const x = resumenDe(por[k]); res.push([k, x.pedidos, Math.round(x.total * 100) / 100, Math.round(x.vendido * 100) / 100]); });
    }
    const w2 = XLSX.utils.aoa_to_sheet(res); w2["!cols"] = [42, 12, 14, 14].map(w => ({ wch: w })); XLSX.utils.book_append_sheet(wb, w2, "Resumen");
    XLSX.writeFile(wb, archivo);
  }
  el.ordersExportMonthBtn.addEventListener("click", () => {
    if (!allOrders.length) { showToast(`No hay pedidos en ${nombreMes(selectedMonth)} para descargar.`, true); return; }
    exportarPedidosExcel(allOrders, `pedidos_${selectedMonth}.xlsx`, `Pedidos de ${nombreMes(selectedMonth)}`, false);
    showToast(`Excel de ${nombreMes(selectedMonth)} descargado ✓`);
  });
  el.ordersExportAllBtn.addEventListener("click", async () => {
    el.ordersExportAllBtn.disabled = true; const t = el.ordersExportAllBtn.textContent; el.ordersExportAllBtn.textContent = "Preparando…";
    try {
      const todos = await pedidosPaginado(null);
      if (!todos.length) { showToast("Todavía no hay pedidos para descargar.", true); return; }
      exportarPedidosExcel(todos, `pedidos_historial_${mesVE()}.xlsx`, "Todo el historial de pedidos", true);
      showToast(`Historial descargado: ${todos.length} pedidos ✓`);
    } catch (err) { showToast("No se pudo preparar el historial: " + err.message, true); }
    finally { el.ordersExportAllBtn.disabled = false; el.ordersExportAllBtn.textContent = t; }
  });

  /* Ventas de hoy: suma de los pedidos TOMADO y ENTREGADO creados hoy (hora de Venezuela). Solo la administradora la ve. */
  function paintSales() {
    if (currentRole !== "admin") { el.salesTodayCard.hidden = true; return; }
    const counted = todayOrders.filter(o => o.status === "tomado" || o.status === "entregado");
    const total = counted.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const byAdvisor = {};
    counted.forEach(o => { const n = o.advisor_name || "Sin asesora"; byAdvisor[n] = (byAdvisor[n] || 0) + (Number(o.total) || 0); });
    el.statSalesToday.textContent = money(total);
    el.statSalesTodayDetail.textContent = counted.length
      ? `${counted.length} ${counted.length === 1 ? "pedido" : "pedidos"} · ` + Object.entries(byAdvisor).sort((x, y) => y[1] - x[1]).map(([n, v]) => `${n} ${money(v)}`).join(" · ")
      : "Todavía no hay pedidos tomados o entregados hoy";
    el.salesTodayCard.hidden = false;
  }

  /* ---------------------------------------------------------------
     PEDIDOS POR MES
     La pestaña Pedidos muestra UN mes a la vez (por defecto, el actual). Nada se borra nunca.
     Los pedidos se traen por partes de 1.000, así que nunca se pierde ninguno aunque haya miles.
     El mes se cuenta en hora de Venezuela (UTC-4).
     --------------------------------------------------------------- */
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const nombreMes = ym => { const [y, m] = ym.split("-"); const n = MESES[Number(m) - 1]; return `${n[0].toUpperCase()}${n.slice(1)} ${y}`; };
  function partesVE(d = new Date()) {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Caracas", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d).map(x => [x.type, x.value]));
    return { y: Number(p.year), m: Number(p.month), d: Number(p.day) };
  }
  const mesVE = (d = new Date()) => { const { y, m } = partesVE(d); return `${y}-${String(m).padStart(2, "0")}`; };
  function rangoMes(ym) {                         // medianoche de Venezuela = 04:00 UTC
    const [y, m] = ym.split("-").map(Number);
    return { start: new Date(Date.UTC(y, m - 1, 1, 4)).toISOString(), end: new Date(Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1, 4)).toISOString() };
  }
  async function pedidosPaginado(aplicar, columnas = "*") {
    const todos = [], TAM = 1000;
    for (let desde = 0; ; desde += TAM) {
      let q = supabaseClient.from("orders").select(columnas).order("created_at", { ascending: false }).order("id", { ascending: false }).range(desde, desde + TAM - 1);
      if (aplicar) q = aplicar(q);
      const { data, error } = await q;
      if (error) throw error;
      todos.push(...(data || []));
      if (!data || data.length < TAM) break;
    }
    return todos;
  }
  async function refreshPending() {              // pedidos nuevos de TODOS los meses (para el globito y el resumen)
    const { count, error } = await supabaseClient.from("orders").select("id", { count: "exact", head: true }).eq("status", "nuevo");
    if (error) return;
    const pending = count || 0;
    el.statNewOrders.textContent = pending; el.ordersBadge.textContent = pending; el.ordersBadge.hidden = pending === 0;
  }
  async function loadTodaySales() {
    if (currentRole !== "admin") { el.salesTodayCard.hidden = true; return; }
    const { y, m, d } = partesVE(), inicio = new Date(Date.UTC(y, m - 1, d, 4)).toISOString(), fin = new Date(Date.UTC(y, m - 1, d + 1, 4)).toISOString();   // hoy: de medianoche a medianoche (Venezuela)
    const { data, error } = await supabaseClient.from("orders").select("id,total,status,advisor_name,created_at").gte("created_at", inicio).lt("created_at", fin).in("status", ["tomado", "entregado"]);
    if (error) return;
    todayOrders = data || []; paintSales();
  }
  async function loadMonthSummary() {
    const { data, error } = await supabaseClient.rpc("orders_by_month", { p_months: 24 });
    summaryByMonth = !error && Array.isArray(data) ? data : null;       // si falta el SQL, queda sin tabla pero todo lo demás funciona
    const meses = new Map((summaryByMonth || []).map(f => [f.month, f]));
    const hoy = mesVE();
    const sinDato = summaryByMonth ? 0 : null;                            // sin la función de resumen no se muestra un conteo que sería falso
    if (!meses.has(hoy)) meses.set(hoy, { month: hoy, pedidos: sinDato });
    if (selectedMonth && !meses.has(selectedMonth)) meses.set(selectedMonth, { month: selectedMonth, pedidos: sinDato });
    if (!summaryByMonth) { let [y, m] = hoy.split("-").map(Number); for (let i = 0; i < 5; i++) { m--; if (m === 0) { m = 12; y--; } const k = `${y}-${String(m).padStart(2, "0")}`; if (!meses.has(k)) meses.set(k, { month: k }); } }
    el.ordersMonth.innerHTML = [...meses.keys()].sort().reverse().map(ym => { const f = meses.get(ym); return `<option value="${ym}">${nombreMes(ym)}</option>`; }).join("");
    el.ordersMonth.value = selectedMonth;
    paintMonthTable();
  }
  function paintMonthTable() {
    if (currentRole !== "admin" || !summaryByMonth || !summaryByMonth.length) { el.monthsCard.hidden = true; return; }
    el.monthsBody.innerHTML = summaryByMonth.slice(0, 12).map(f => `<tr><td><b>${nombreMes(f.month)}</b></td><td>${f.pedidos}</td><td>${money(f.total)}</td><td>${money(f.vendido)}</td></tr>`).join("");
    el.monthsCard.hidden = false;
  }
  function invalidateClients() { clientsLoaded = false; if (!el.tabClients.hidden) ensureClientsLoaded(); }
  async function ensureClientsLoaded() {
    if (clientsLoaded || clientsLoading) return;
    clientsLoading = true; el.clientsSummary.textContent = "Cargando clientes…";
    try { clientsOrders = await pedidosPaginado(null, "id,created_at,customer_name,customer_cedula,phone,items,total,status,advisor_name"); clientsLoaded = true; renderClients(); }
    catch (err) { el.clientsSummary.textContent = "No se pudieron cargar los clientes: " + err.message; }
    finally { clientsLoading = false; }
  }
  document.querySelector('.admin-tab[data-tab="clients"]').addEventListener("click", ensureClientsLoaded);

  async function loadOrders() {
    if (!selectedMonth) selectedMonth = mesVE();
    const { start, end } = rangoMes(selectedMonth);
    try { allOrders = await pedidosPaginado(q => q.gte("created_at", start).lt("created_at", end)); }
    catch (err) { showToast("No se pudieron cargar los pedidos: " + err.message, true); return; }
    const cancelados = allOrders.filter(o => o.status === "cancelado").length;
    el.ordersMonthInfo.textContent = `${allOrders.length} ${allOrders.length === 1 ? "pedido" : "pedidos"} en ${nombreMes(selectedMonth)}${cancelados ? ` (${cancelados} ${cancelados === 1 ? "cancelado" : "cancelados"})` : ""}`;
    renderOrders();
    refreshPending(); loadTodaySales(); loadMonthSummary(); invalidateClients();
  }
  el.ordersMonth.addEventListener("change", () => { selectedMonth = el.ordersMonth.value; loadOrders(); });

  function renderOrders() {
    if (!allOrders.length) { el.ordersList.innerHTML = ""; el.ordersEmpty.textContent = `No hay pedidos en ${nombreMes(selectedMonth || mesVE())}.`; el.ordersEmpty.hidden = false; return; }
    el.ordersEmpty.hidden = true;
    el.ordersList.innerHTML = allOrders.map(o => {
      const items = Array.isArray(o.items) ? o.items : [];
      const itemsText = items.map(i => `${i.qty}x ${i.name}`).join(", ");
      const date = new Date(o.created_at).toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" });
      return `
        <div class="order-card">
          <div class="order-top">
            <span class="order-name">${o.customer_name || "—"} — ${o.phone || ""}${o.customer_cedula ? ` · Cédula ${o.customer_cedula}` : ""}</span>
            <select class="order-status-select" data-order-status="${o.id}">
              ${Object.entries(STATUS_LABELS).map(([val, label]) => `<option value="${val}" ${o.status === val ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </div>
          <p class="order-date">${date}</p>
          <p class="order-items">${itemsText}</p>
          <p class="order-total">${money(o.total)}${Number(o.total_bs) > 0 ? ` <span class="order-bs">· Bs ${Number(o.total_bs).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (tasa ${Number(o.exchange_rate).toLocaleString("es-VE")})</span>` : ""}</p>
          <div class="order-pay-row">
            <span class="pay-badge ${o.payment_status || "pendiente"}">${PAY_LABELS[o.payment_status] || PAY_LABELS.pendiente}${o.payment_reference ? " · Ref " + o.payment_reference : ""}</span>
            <select class="order-pay-select" data-order-pay="${o.id}" title="Estado del pago">
              ${Object.entries(PAY_LABELS).map(([val, label]) => `<option value="${val}" ${(o.payment_status || "pendiente") === val ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </div>
          ${o.advisor_name ? `<p class="order-advisor">Asesora: ${o.advisor_name}${({ link: " · por su link personal", recordada: " · la recordó la tienda y el cliente la confirmó", elegida: " · la eligió el cliente", turno: " · asignada por turno" })[o.assigned_by] || ""}</p>` : ""}
          <p class="order-meta">${o.payment_method || ""} · ${o.delivery_method || ""} · ${o.city || ""}${o.address ? " — " + o.address : ""}</p>
          ${(() => { const bx = (Array.isArray(o.items) ? o.items : []).filter(isBoxItem); return bx.length ? `<p class="order-boxes">📦 <strong>Cajas para agregar a mano en PosGold:</strong> ${bx.map(it => `${it.name} × ${Number(it.qty) || 0}`).join(" · ")}</p>` : ""; })()}
          <div class="order-actions">
            <button type="button" class="posgold-btn" data-posgold="${o.id}">⬇ Excel para PosGold</button>
            ${o.payment_proof_path ? `<button type="button" class="posgold-btn proof-btn" data-proof="${o.payment_proof_path}">📎 Ver comprobante</button>` : ""}
          </div>
        </div>
      `;
    }).join("");
  }
  /* ---------------------------------------------------------------
     EXCEL PARA POSGOLD — mismo formato que la plantilla «PedidoExcel»:
     una hoja llamada PedidoExcel con las columnas
     codigo · cod_bodega · cantidad · precio · porc_descuento · descuento
     --------------------------------------------------------------- */
  const POSGOLD_COLS = ["codigo", "cod_bodega", "cantidad", "precio", "porc_descuento", "descuento"];
  // Las cajas NO van en el Excel de PosGold (se agregan a mano). Se reconocen por la categoría del producto
  // o, si el producto ya no existe, porque su nombre dice "caja".
  function isBoxItem(it) {
    const p = allProducts.find(pp => String(pp.id) === String(it.id)) || allProducts.find(pp => pp.name === it.name);
    return p ? p.category === "Cajas / Combos" : /\bcaja\b/i.test(String(it.name || ""));
  }
  function boxesText(boxes) { return boxes.map(it => `• ${it.name} × ${Number(it.qty) || 0}`).join("\n"); }
  async function downloadPosgoldExcel(orderId) {
    if (!window.XLSX) { showToast("No se pudo cargar el lector de Excel. Recarga la página.", true); return; }
    const o = allOrders.find(x => String(x.id) === String(orderId));
    if (!o) return;
    const allItems = Array.isArray(o.items) ? o.items : [];
    if (!allItems.length) { showToast("Este pedido no tiene productos.", true); return; }
    const boxes = allItems.filter(isBoxItem);
    const items = allItems.filter(it => !isBoxItem(it));
    if (!items.length) {
      window.alert("📦 Este pedido solo trae cajas, y las cajas NO van en el Excel de PosGold.\n\nAgrégalas manualmente en PosGold:\n\n" + boxesText(boxes));
      return;
    }

    // El código de PosGold sale del producto; si no tiene, se usa su referencia
    let bodega = "01";
    try { const s = await fetchSettings(); bodega = String(s.posgold_bodega || "01").trim() || "01"; } catch (e) {}
    const missing = [], fallback = [];
    const rows = items.map(it => {
      const p = allProducts.find(pp => String(pp.id) === String(it.id)) || allProducts.find(pp => pp.name === it.name);
      let code = p && p.posgold_code ? String(p.posgold_code).trim() : "";
      if (!code && p && p.ref) { code = String(p.ref).trim(); fallback.push(it.name); }
      if (!code) missing.push(it.name);
      return [code, bodega, Number(it.qty) || 0, Number(it.price) || 0, 0, 0];
    });
    if (missing.length) {
      if (!window.confirm("Estos productos NO tienen código de PosGold ni referencia, así que saldrán con el código vacío y PosGold los rechazará:\n\n• " + missing.join("\n• ") + "\n\nAgrégales el código en la pestaña Productos (campo «Código en PosGold») o en Carga masiva.\n\n¿Descargar de todos modos?")) return;
    } else if (fallback.length) {
      showToast(`${fallback.length} producto(s) sin código de PosGold: se usó su referencia.`);
    }

    const ws = XLSX.utils.aoa_to_sheet([POSGOLD_COLS, ...rows]);
    for (let r = 1; r <= rows.length; r++) for (const c of [0, 1]) {            // codigo y cod_bodega van como TEXTO (conserva ceros: 002, 01)
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (cell) { cell.t = "s"; cell.v = String(cell.v); cell.z = "@"; }
    }
    ws["!cols"] = [10.2, 15, 11.9, 9.9, 18.3, 13.5].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PedidoExcel");
    const who = String(o.customer_name || "cliente").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").slice(0, 24);
    XLSX.writeFile(wb, `PedidoExcel_${o.id}_${who}.xlsx`);
    showToast("Excel para PosGold descargado ✓");
    if (boxes.length) {
      window.alert("📦 ¡NO OLVIDES LAS CAJAS!\n\nEste pedido trae cajas que NO están en el Excel. Agrégalas manualmente en PosGold:\n\n" + boxesText(boxes));
    }
  }
  el.ordersList.addEventListener("click", (e) => {
    const id = e.target.closest("[data-posgold]")?.dataset.posgold;
    if (id) downloadPosgoldExcel(id);
  });
  // Comprobante de pago: está en una carpeta privada, así que se abre con un enlace temporal (10 min)
  el.ordersList.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-proof]");
    if (!btn) return;
    const tab = window.open("about:blank", "_blank");          // se abre ya, para que el navegador no lo bloquee
    const { data, error } = await supabaseClient.storage.from("payment-proofs").createSignedUrl(btn.dataset.proof, 600);
    if (error || !data) { if (tab) tab.close(); showToast("No se pudo abrir el comprobante: " + ((error && error.message) || "sin permiso"), true); return; }
    if (tab) tab.location.href = data.signedUrl; else window.location.href = data.signedUrl;
  });

  el.ordersList.addEventListener("change", async (e) => {
    const payId = e.target.closest("[data-order-pay]")?.dataset.orderPay;
    if (payId) {
      const { error } = await supabaseClient.from("orders").update({ payment_status: e.target.value }).eq("id", payId);
      if (error) { showToast("No se pudo actualizar el pago: " + error.message, true); return; }
      const o = allOrders.find(x => String(x.id) === payId);
      if (o) o.payment_status = e.target.value;
      renderOrders();
      showToast("Pago actualizado");
      return;
    }
    const id = e.target.closest("[data-order-status]")?.dataset.orderStatus;
    if (!id) return;
    const { error } = await supabaseClient.from("orders").update({ status: e.target.value }).eq("id", id);
    if (error) { showToast("No se pudo actualizar: " + error.message, true); return; }
    const o = allOrders.find(x => String(x.id) === id);
    if (o) o.status = e.target.value;
    refreshPending(); loadTodaySales(); loadMonthSummary(); invalidateClients();
    showToast("Estado actualizado");
  });

  /* ---------------------------------------------------------------
     BANNERS
     --------------------------------------------------------------- */
  let allBanners = [];
  let pendingBannerImageFile = null;
  let pendingBannerMobileFile = null;
  let removeBannerMobile = false;

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
    pendingBannerMobileFile = null;
    removeBannerMobile = false;
    el.bannerFieldMobileFile.value = "";
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
      if (banner.image_mobile) { el.bannerFieldMobilePreview.src = banner.image_mobile; el.bannerFieldMobilePreview.hidden = false; el.bannerRemoveMobileBtn.hidden = false; }
      else { el.bannerFieldMobilePreview.hidden = true; el.bannerRemoveMobileBtn.hidden = true; }
      el.deleteBannerBtn.hidden = false;
    } else {
      el.bannerModalTitle.textContent = "Nuevo banner";
      el.bannerFieldMobilePreview.hidden = true; el.bannerRemoveMobileBtn.hidden = true;
      el.bannerForm.reset();
      el.bannerFieldId.value = "";
      el.bannerFieldActive.checked = true;
      el.bannerFieldImagePreview.hidden = true;
      el.deleteBannerBtn.hidden = true;
    }
    el.bannerCustomLinkWrap.hidden = el.bannerFieldDest.value !== "custom";
    el.bannerModalOverlay.hidden = false;
  }
  el.bannerFieldMobileFile.addEventListener("change", () => {
    const f = el.bannerFieldMobileFile.files[0];
    if (!f) return;
    pendingBannerMobileFile = f; removeBannerMobile = false;
    el.bannerFieldMobilePreview.src = URL.createObjectURL(f);
    el.bannerFieldMobilePreview.hidden = false; el.bannerRemoveMobileBtn.hidden = false;
  });
  el.bannerRemoveMobileBtn.addEventListener("click", () => {
    removeBannerMobile = true; pendingBannerMobileFile = null; el.bannerFieldMobileFile.value = "";
    el.bannerFieldMobilePreview.hidden = true; el.bannerRemoveMobileBtn.hidden = true;
  });
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

  // Reduce la imagen antes de subirla (los banners originales pesan ~2,5 MB; así quedan en ~150 KB)
  async function compressForUpload(file, maxSide) {
    try {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
      const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
      const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(bmp, 0, 0, w, h);
      if (bmp.close) bmp.close();
      let blob = await new Promise(res => canvas.toBlob(res, "image/webp", 0.82));
      if (!blob || blob.type !== "image/webp") blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", 0.82));
      if (!blob || (scale === 1 && file.size <= blob.size && /^image\/(jpeg|webp)$/.test(file.type))) return file;
      return blob;
    } catch (e) { return file; }   // si el navegador no puede, se sube tal cual
  }
  async function uploadBannerFile(file, existingUrl, maxSide) {
    if (!file) return existingUrl || "";
    const blob = await compressForUpload(file, maxSide);
    const ext = blob.type === "image/webp" ? "webp" : (blob.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() || "jpg"));
    const path = `banner-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    const { error } = await supabaseClient.storage.from("product-images").upload(path, blob, { upsert: false, contentType: blob.type || file.type, cacheControl: "31536000" });
    if (error) throw error;
    return supabaseClient.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }
  const uploadBannerImageIfNeeded = existingUrl => uploadBannerFile(pendingBannerImageFile, existingUrl, 2400);

  el.bannerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.bannerFormMessage.hidden = true;
    el.saveBannerBtn.disabled = true;
    el.saveBannerBtn.textContent = "Guardando…";
    try {
      const id = el.bannerFieldId.value;
      const existing = id ? allBanners.find(b => String(b.id) === id) : null;
      const imageUrl = await uploadBannerImageIfNeeded(existing?.image);
      let mobileUrl = existing?.image_mobile || "";
      if (removeBannerMobile) mobileUrl = "";
      if (pendingBannerMobileFile) mobileUrl = await uploadBannerFile(pendingBannerMobileFile, mobileUrl, 1600);

      const payload = {
        title: el.bannerFieldTitle.value.trim(),
        subtitle: el.bannerFieldSubtitle.value.trim(),
        link_url: el.bannerFieldDest.value === "custom" ? el.bannerFieldLink.value.trim() : el.bannerFieldDest.value,
        button_text: el.bannerFieldButtonText.value.trim(),
        sort_order: parseInt(el.bannerFieldSort.value, 10) || 0,
        active: el.bannerFieldActive.checked,
        image: imageUrl,
      };
      if (mobileUrl || existing?.image_mobile) payload.image_mobile = mobileUrl;

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

  function renderAdvisorLinks() {
    const activas = allAdvisors.filter(a => a.active && (!a.is_hidden || a.vip_token));
    el.advisorLinks.innerHTML = activas.length ? `<h3>Links personales</h3><p class="banners-hint">Cada asesora manda el suyo: al abrirlo, el pedido le llega a ella.</p>` + activas.map(a => { const url = a.is_hidden ? vipLink(a.vip_token) : advisorLink(a.name); return `
      <div class="advisor-link-row"><b>${a.is_hidden ? "🔒 " : ""}${a.name}</b>${a.is_hidden ? `<small class="vip-tag">link VIP (secreto)</small>` : ""}<input type="text" readonly value="${url}"><button type="button" class="posgold-btn" data-copy-link="${url}">Copiar</button></div>`; }).join("") : "";
  }

  function renderAdvisorsTable() {
    renderAdvisorLinks();
    el.advisorsTableBody.innerHTML = allAdvisors.map(a => `
      <tr>
        <td><img class="row-thumb" src="${a.image || ''}" alt=""></td>
        <td>${a.is_hidden ? "🔒 " : ""}${a.name}${a.is_hidden ? ` <span class="vip-badge">VIP · oculta</span>` : ""}</td>
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

  // La caja del link VIP solo aparece cuando la asesora YA está guardada como oculta (así el código ya existe).
  function showVipBox(advisor) {
    const tiene = advisor && advisor.is_hidden && advisor.vip_token;
    el.advisorVipBox.hidden = !tiene;
    el.advisorVipLink.value = tiene ? vipLink(advisor.vip_token) : "";
  }
  el.advisorVipCopy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(el.advisorVipLink.value); showToast("Link VIP copiado ✓"); }
    catch (e) { el.advisorVipLink.select(); document.execCommand("copy"); showToast("Link VIP copiado ✓"); }
  });
  el.advisorVipRenew.addEventListener("click", async () => {
    const id = el.advisorFieldId.value; if (!id) return;
    if (!confirm("¿Renovar el link VIP? El link anterior dejará de funcionar y tendrás que enviar el nuevo.")) return;
    const token = newVipToken();
    const { error } = await supabaseClient.from("advisors").update({ vip_token: token }).eq("id", id);
    if (error) { showToast("No se pudo renovar: " + error.message, true); return; }
    await loadAdvisors(); showVipBox(allAdvisors.find(a => String(a.id) === id)); showToast("Link VIP renovado ✓ (el anterior ya no funciona)");
  });
  el.advisorFieldHidden.addEventListener("change", () => {
    if (!el.advisorFieldHidden.checked) el.advisorVipBox.hidden = true;
    else { const ex = allAdvisors.find(a => String(a.id) === el.advisorFieldId.value); showVipBox(ex || null); }
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
      el.advisorFieldHidden.checked = Boolean(advisor.is_hidden);
      showVipBox(advisor);
      if (advisor.image) { el.advisorFieldImagePreview.src = advisor.image; el.advisorFieldImagePreview.hidden = false; }
      else el.advisorFieldImagePreview.hidden = true;
      el.deleteAdvisorBtn.hidden = false;
    } else {
      el.advisorModalTitle.textContent = "Nueva asesora";
      el.advisorForm.reset();
      el.advisorFieldId.value = "";
      el.advisorFieldActive.checked = true;
      el.advisorFieldHidden.checked = false;
      showVipBox(null);
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
      // Los campos de «oculta» solo se mandan si la base ya los tiene (o si se está pidiendo ocultar): así editar asesoras normales nunca se rompe.
      const tieneVip = allAdvisors.some(a => "is_hidden" in a);
      if (tieneVip || el.advisorFieldHidden.checked) {
        payload.is_hidden = el.advisorFieldHidden.checked;
        payload.vip_token = payload.is_hidden ? ((existing && existing.vip_token) || newVipToken()) : null;
      }
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
    el.settingsPosgoldBodega.value = settings.posgold_bodega || "01";
    el.settingsPagoMovilPhone.value = settings.pago_movil_phone || "";
    el.settingsPagoMovilCedula.value = settings.pago_movil_cedula || "";
    el.settingsPagoMovilBank.value = settings.pago_movil_bank || "";
    el.settingsBinanceId.value = settings.binance_id || "";
    el.settingsHideSoldout.value = settings.hide_soldout === false ? "false" : "true";
    el.settingsHoursEnabled.checked = settings.hours_enabled !== false;
    renderHoursRows(settings.business_hours && typeof settings.business_hours === "object" ? settings.business_hours : HORARIO_INICIAL);
    el.settingsZelleEmail.value = settings.zelle_email || "";
    el.settingsZelleHolder.value = settings.zelle_holder_name || "";
  }

  /* ---------- Horario de atención ---------- */
  const HORARIO_DIAS = [["mon", "Lunes"], ["tue", "Martes"], ["wed", "Miércoles"], ["thu", "Jueves"], ["fri", "Viernes"], ["sat", "Sábado"], ["sun", "Domingo"]];
  const HORARIO_INICIAL = { mon: { mode: "hours", open: "08:00", close: "17:50" }, tue: { mode: "hours", open: "08:00", close: "17:50" }, wed: { mode: "hours", open: "08:00", close: "17:50" }, thu: { mode: "hours", open: "08:00", close: "17:50" }, fri: { mode: "hours", open: "08:00", close: "17:50" }, sat: { mode: "hours", open: "08:00", close: "14:00" }, sun: { mode: "virtual" } };
  function renderHoursRows(H) {
    el.hoursRows.innerHTML = HORARIO_DIAS.map(([k, nombre]) => {
      const c = H[k] || { mode: "closed" };
      return `<tr data-day="${k}">
        <td class="hours-day">${nombre}</td>
        <td><select class="hours-mode" aria-label="Tipo de atención del ${nombre}">
          <option value="hours"${c.mode === "hours" ? " selected" : ""}>Con horario</option>
          <option value="virtual"${c.mode === "virtual" ? " selected" : ""}>Virtual limitado</option>
          <option value="closed"${c.mode === "closed" ? " selected" : ""}>Cerrado</option></select></td>
        <td class="hours-times"><input type="time" class="hours-open" value="${c.open || "08:00"}"> <span>a</span> <input type="time" class="hours-close" value="${c.close || "17:00"}"></td>
      </tr>`;
    }).join("");
    syncHoursInputs();
  }
  function syncHoursInputs() {
    el.hoursRows.querySelectorAll("tr").forEach(tr => {
      const on = tr.querySelector(".hours-mode").value === "hours";
      tr.querySelectorAll("input[type=time]").forEach(i => { i.disabled = !on; });
      tr.querySelector(".hours-times").style.opacity = on ? "1" : ".35";
    });
  }
  el.hoursRows.addEventListener("change", e => { if (e.target.classList.contains("hours-mode")) syncHoursInputs(); });
  function leerHorario() {                       // devuelve el horario, o null si hay un error (y lo avisa)
    const H = {};
    for (const tr of el.hoursRows.querySelectorAll("tr")) {
      const mode = tr.querySelector(".hours-mode").value, open = tr.querySelector(".hours-open").value, close = tr.querySelector(".hours-close").value;
      if (mode === "hours") {
        if (!open || !close || open >= close) { showToast(`El horario del ${tr.querySelector(".hours-day").textContent.toLowerCase()} no es válido: la hora de cierre debe ser después de la de apertura.`, true); return null; }
        H[tr.dataset.day] = { mode, open, close };
      } else H[tr.dataset.day] = { mode };
    }
    return H;
  }

  el.settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.settingsMessage.hidden = true;
    const horario = leerHorario(); if (!horario) return;
    el.saveSettingsBtn.disabled = true;
    el.saveSettingsBtn.textContent = "Guardando…";
    const payload = {
      id: 1,
      eyebrow_text: el.settingsEyebrow.value.trim(),
      hero_title: el.settingsHeroTitle.value.trim(),
      hero_subtitle: el.settingsHeroSubtitle.value.trim(),
      exchange_rate: parseFloat(el.settingsExchangeRate.value) || 0,
      posgold_bodega: el.settingsPosgoldBodega.value.trim() || "01",
      pago_movil_phone: el.settingsPagoMovilPhone.value.trim(),
      pago_movil_cedula: el.settingsPagoMovilCedula.value.trim(),
      pago_movil_bank: el.settingsPagoMovilBank.value.trim(),
      binance_id: el.settingsBinanceId.value.trim(),
      binance_email: "",            // por seguridad se borran el correo y el nombre que hubiera (los Ajustes son públicos)
      binance_holder_name: "",
      hide_soldout: el.settingsHideSoldout.value === "true",
      hours_enabled: el.settingsHoursEnabled.checked,
      business_hours: horario,
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
