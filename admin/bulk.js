/* =====================================================================
   Carga masiva de productos — Mayoristas de Perfumes Venezuela
   Lee un Excel (.xlsx), valida cada fila, empareja las fotos por nombre,
   las comprime y crea / actualiza los productos.
   ===================================================================== */
(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  if (!$("tabBulk")) return;

  /* ------------------------- utilidades ------------------------- */
  const strip = s => String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const key = s => strip(s).replace(/ /g, "");                 // para comparar nombres / refs / archivos
  const escH = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const chunk = (arr, n) => { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; };
  async function pool(items, n, worker) {
    let i = 0;
    async function run() { while (i < items.length) { const idx = i++; await worker(items[idx], idx); } }
    await Promise.all(Array.from({ length: Math.min(n, items.length) }, run));
  }

  const DEFAULT_BRAND = "Mayoristas de Perfumes Venezuela";
  const CAT_FEM = "Perfumes Femeninos", CAT_MAS = "Perfumes Masculinos", CAT_UNI = "Unisex", CAT_BOX = "Cajas / Combos";
  const CAT_ALIASES = {
    "dama": CAT_FEM, "damas": CAT_FEM, "femenino": CAT_FEM, "femeninos": CAT_FEM, "perfumes femeninos": CAT_FEM, "perfumes dama": CAT_FEM, "mujer": CAT_FEM,
    "caballero": CAT_MAS, "caballeros": CAT_MAS, "masculino": CAT_MAS, "masculinos": CAT_MAS, "perfumes masculinos": CAT_MAS, "perfumes caballero": CAT_MAS, "hombre": CAT_MAS,
    "unisex": CAT_UNI,
    "caja": CAT_BOX, "cajas": CAT_BOX, "combo": CAT_BOX, "combos": CAT_BOX, "cajas combos": CAT_BOX, "cajas y combos": CAT_BOX,
  };
  const CAT_LABEL = { [CAT_FEM]: "Dama", [CAT_MAS]: "Caballero", [CAT_UNI]: "Unisex", [CAT_BOX]: "Cajas" };

  const HEADERS = ["Nombre *", "Marca", "Categoría *", "Referencia", "Precio (US$) *", "Precio oferta (US$)",
    "Cantidad mínima", "Disponible", "Destacado", "Descripción / contenido", "Foto (nombre del archivo)"];

  function headerField(h) {
    const s = strip(h);
    if (!s) return null;
    if (s.includes("oferta")) return "offer";
    if (s.includes("precio") || s === "price") return "price";
    if (s.startsWith("nombre") || s === "producto" || s === "name") return "name";
    if (s.startsWith("marca")) return "brand";
    if (s.startsWith("categoria")) return "category";
    if (s.startsWith("referencia") || s === "ref" || s === "sku" || s.startsWith("codigo")) return "ref";
    if (s.includes("minim") || s === "min") return "min";
    if (s.startsWith("disponible")) return "avail";
    if (s.startsWith("destacado")) return "featured";
    if (s.startsWith("descripcion") || s.startsWith("contenido") || s.startsWith("detalle") || s.startsWith("nota")) return "note";
    if (s.startsWith("foto") || s.startsWith("imagen")) return "photo";
    return null;
  }

  function parseNum(v) {
    if (typeof v === "number") return isFinite(v) ? v : NaN;
    let s = String(v == null ? "" : v).trim().replace(/[$\s]/g, "").replace(/us$|usd$/i, "");
    if (!s) return NaN;
    if (s.includes(",") && s.includes(".")) {
      s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
    } else if (s.includes(",")) s = s.replace(",", ".");
    const n = Number(s);
    return isFinite(n) ? n : NaN;
  }
  function parseBool(v) {                                      // true / false / null (vacío) / "?" (no entendido)
    const s = strip(v);
    if (!s) return null;
    if (["si", "s", "yes", "y", "true", "1", "x", "verdadero"].includes(s)) return true;
    if (["no", "n", "false", "0", "falso"].includes(s)) return false;
    return "?";
  }
  const isDash = v => String(v == null ? "" : v).trim() === "-";

  /* ------------------------- estado ------------------------- */
  let existing = [];            // productos que ya están en la tienda
  let rows = [];                // filas analizadas del Excel
  let photos = [];              // archivos de fotos elegidos
  let importing = false;

  const ui = {
    file: $("bulkFile"), photos: $("bulkPhotos"), summary: $("bulkSummary"), wrap: $("bulkPreviewWrap"),
    body: $("bulkPreviewBody"), btn: $("bulkImportBtn"), progress: $("bulkProgress"), status: $("bulkStatus"),
    result: $("bulkResult"), exportBtn: $("bulkExportBtn"), photoInfo: $("bulkPhotoInfo"),
  };

  async function fetchAllProducts(columns) {
    const all = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabaseClient.from("products").select(columns).order("id").range(from, from + 999);
      if (error) throw error;
      all.push(...data);
      if (data.length < 1000) break;
    }
    return all;
  }

  /* ------------------------- leer el Excel ------------------------- */
  function readSheet(buf) {
    const wb = XLSX.read(buf, { type: "array" });
    const sheetName = wb.SheetNames.find(n => strip(n) === "productos") || wb.SheetNames.find(n => strip(n) !== "instrucciones" && strip(n) !== "ejemplo") || wb.SheetNames[0];
    const aoa = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: "", raw: true });
    let hIdx = aoa.findIndex(r => r.filter(c => headerField(c)).length >= 2);
    if (hIdx < 0) throw new Error("No encontré la fila de títulos (Nombre, Categoría, Precio…). Usa la plantilla.");
    const map = {};
    aoa[hIdx].forEach((h, c) => { const f = headerField(h); if (f && map[f] === undefined) map[f] = c; });
    for (const need of ["name", "category", "price"]) {
      if (map[need] === undefined) throw new Error("Falta la columna «" + { name: "Nombre", category: "Categoría", price: "Precio" }[need] + "». Usa la plantilla.");
    }
    const out = [];
    aoa.slice(hIdx + 1).forEach((r, i) => {
      const cell = f => (map[f] === undefined ? "" : r[map[f]]);
      const raw = {};
      Object.keys(map).forEach(f => { raw[f] = cell(f); });
      if (!Object.values(raw).some(v => String(v).trim() !== "")) return;   // fila vacía
      out.push({ rowNum: hIdx + 2 + i, raw });
    });
    return { rows: out, sheetName };
  }

  /* ------------------------- analizar / validar ------------------------- */
  function normalizeCategory(v) {
    const s = strip(v);
    if (!s) return "";
    if (CAT_ALIASES[s]) return CAT_ALIASES[s];
    const known = existing.map(p => p.category).find(c => strip(c) === s);
    return known || null;                                    // null = no reconocida
  }

  function analyze(parsed) {
    const byRef = new Map(), byName = new Map();
    const refCount = new Map();
    existing.forEach(p => { const k = key(p.ref); if (k) refCount.set(k, (refCount.get(k) || 0) + 1); });
    existing.forEach(p => {
      const k = key(p.ref); if (k && refCount.get(k) === 1) byRef.set(k, p);
      const n = key(p.name); if (n && !byName.has(n)) byName.set(n, p);
    });

    const seen = new Map();
    rows = parsed.map(({ rowNum, raw }) => {
      const r = { rowNum, raw, errors: [], warnings: [], action: "new", match: null, payload: {}, photoCell: "" };
      const name = String(raw.name || "").trim();
      const ref = String(raw.ref || "").trim();
      const refK = key(ref), nameK = key(name);

      // ¿existe ya?
      if (refK && byRef.has(refK)) r.match = byRef.get(refK);
      else if (nameK && byName.has(nameK)) r.match = byName.get(nameK);
      r.action = r.match ? "update" : "new";

      // duplicado dentro del mismo archivo
      const dupKey = refK ? "r:" + refK : (nameK ? "n:" + nameK : "");
      if (dupKey) {
        if (seen.has(dupKey)) r.errors.push("Repetido: es igual a la fila " + seen.get(dupKey));
        else seen.set(dupKey, rowNum);
      }

      const p = r.payload;
      // nombre
      if (!name) { if (!r.match) r.errors.push("Falta el nombre"); } else p.name = name;
      // marca
      const brand = String(raw.brand || "").trim();
      if (isDash(raw.brand)) p.brand = DEFAULT_BRAND; else if (brand) p.brand = brand; else if (!r.match) p.brand = DEFAULT_BRAND;
      // categoría
      const catRaw = String(raw.category || "").trim();
      if (!catRaw) { if (!r.match) r.errors.push("Falta la categoría"); }
      else {
        const cat = normalizeCategory(catRaw);
        if (cat === null) r.errors.push("Categoría «" + catRaw + "» no reconocida (usa Dama, Caballero, Unisex o Cajas)");
        else p.category = cat;
      }
      // referencia
      if (isDash(raw.ref)) p.ref = ""; else if (ref) p.ref = ref; else if (!r.match) p.ref = "";
      // precio
      if (String(raw.price).trim() === "") { if (!r.match) r.errors.push("Falta el precio"); }
      else {
        const price = parseNum(raw.price);
        if (isNaN(price) || price < 0) r.errors.push("Precio «" + raw.price + "» no es un número válido");
        else p.mayor = Math.round(price * 100) / 100;
      }
      // oferta
      if (isDash(raw.offer)) p.offer = null;
      else if (String(raw.offer).trim() !== "") {
        const off = parseNum(raw.offer);
        if (isNaN(off) || off < 0) r.errors.push("Precio de oferta «" + raw.offer + "» no es un número válido");
        else p.offer = Math.round(off * 100) / 100;
      } else if (!r.match) p.offer = null;
      // cantidad mínima
      if (String(raw.min).trim() !== "") {
        const m = parseNum(raw.min);
        if (isNaN(m) || m < 1 || Math.floor(m) !== m) r.errors.push("Cantidad mínima «" + raw.min + "» debe ser un entero de 1 o más");
        else p.min_qty = m;
      } else if (!r.match) p.min_qty = (p.category === CAT_BOX) ? 1 : 12;
      // disponible / destacado
      for (const [f, col, def] of [["avail", "avail", true], ["featured", "featured", false]]) {
        const b = parseBool(raw[f]);
        if (b === "?") r.errors.push("«" + raw[f] + "» no se entiende en " + (f === "avail" ? "Disponible" : "Destacado") + " (usa Sí o No)");
        else if (b !== null) p[col] = b;
        else if (!r.match) p[col] = def;
      }
      // descripción
      if (isDash(raw.note)) p.note = ""; else if (String(raw.note).trim() !== "") p.note = String(raw.note).replace(/\r\n/g, "\n").trim(); else if (!r.match) p.note = "";
      r.photoCell = String(raw.photo || "").trim();
      return r;
    });
    matchPhotos();
  }

  /* ------------------------- fotos ------------------------- */
  function stripExt(n) { return String(n).replace(/\.[a-z0-9]{2,5}$/i, ""); }
  function matchPhotos() {
    const byKey = new Map();
    photos.forEach(f => { const k = key(stripExt(f.name)); if (k && !byKey.has(k)) byKey.set(k, f); });
    const used = new Set();
    rows.forEach(r => {
      r.photoFile = null; r.photoMissing = "";
      if (r.errors.length) return;
      const cands = [r.photoCell && key(stripExt(r.photoCell)), key(r.raw.ref), key(r.raw.name)].filter(Boolean);
      for (const c of cands) { if (byKey.has(c)) { r.photoFile = byKey.get(c); used.add(r.photoFile); break; } }
      if (!r.photoFile && r.photoCell && photos.length) r.photoMissing = r.photoCell;
    });
    const unmatched = photos.filter(f => !used.has(f));
    if (ui.photoInfo) {
      ui.photoInfo.innerHTML = photos.length
        ? `<strong>${photos.length}</strong> foto(s) elegida(s) · <strong>${used.size}</strong> emparejada(s)` +
          (unmatched.length ? ` · <span class="bulk-warn">${unmatched.length} sin producto: ${escH(unmatched.slice(0, 6).map(f => f.name).join(", "))}${unmatched.length > 6 ? "…" : ""}</span>` : "")
        : "Aún no has elegido fotos.";
    }
  }

  async function compressImage(file, maxSide = 1000, quality = 0.82) {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);      // PNG con fondo transparente -> blanco
    ctx.drawImage(bmp, 0, 0, w, h);
    if (bmp.close) bmp.close();
    let blob = await new Promise(res => canvas.toBlob(res, "image/webp", quality));
    if (!blob || blob.type !== "image/webp") blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", quality));
    if (scale === 1 && file.size <= blob.size && /^image\/(jpeg|webp)$/.test(file.type)) return file;   // ya era liviana
    return blob;
  }

  async function uploadPhoto(file) {
    const blob = await compressImage(file);
    const ext = blob.type === "image/webp" ? "webp" : (blob.type === "image/png" ? "png" : "jpg");
    const path = `product-${Date.now()}-${Math.floor(Math.random() * 1e6)}.${ext}`;
    const { error } = await supabaseClient.storage.from("product-images").upload(path, blob, { upsert: false, contentType: blob.type, cacheControl: "31536000" });
    if (error) throw error;
    return supabaseClient.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }

  /* ------------------------- vista previa ------------------------- */
  const fmt = n => (n == null || n === "" ? "—" : "$" + Number(n).toFixed(2));
  function render() {
    const okRows = rows.filter(r => !r.errors.length);
    const nNew = okRows.filter(r => r.action === "new").length;
    const nUpd = okRows.filter(r => r.action === "update").length;
    const nErr = rows.length - okRows.length;
    ui.summary.innerHTML = rows.length
      ? `<span class="bulk-chip ok">${nNew} nuevo(s)</span><span class="bulk-chip upd">${nUpd} a actualizar</span><span class="bulk-chip ${nErr ? "err" : "none"}">${nErr} con error</span>`
      : "";
    ui.wrap.hidden = !rows.length;
    ui.body.innerHTML = rows.map(r => {
      const p = r.payload, cls = r.errors.length ? "bulk-row-err" : (r.action === "update" ? "bulk-row-upd" : "");
      const action = r.errors.length ? "Error" : (r.action === "update" ? "Actualiza" : "Nuevo");
      let photo = "—";
      if (r.photoFile) photo = "✓ " + escH(r.photoFile.name);
      else if (r.photoMissing) photo = `<span class="bulk-warn">falta archivo: ${escH(r.photoMissing)}</span>`;
      else if (r.match && r.match.image) photo = "se mantiene";
      const state = r.errors.length ? `<span class="bulk-err-text">${escH(r.errors.join(" · "))}</span>` : "OK";
      return `<tr class="${cls}"><td>${r.rowNum}</td><td>${action}</td><td>${escH(p.name || (r.match && r.match.name) || r.raw.name || "")}</td>
        <td>${escH(CAT_LABEL[p.category] || p.category || (r.match && CAT_LABEL[r.match.category]) || "")}</td>
        <td>${p.mayor != null ? fmt(p.mayor) : "—"}</td><td>${p.min_qty != null ? p.min_qty : "—"}</td><td>${photo}</td><td>${state}</td></tr>`;
    }).join("");
    ui.btn.disabled = importing || !okRows.length;
    ui.btn.textContent = okRows.length ? `Importar ${okRows.length} producto(s)` : "Importar";
    ui.result.innerHTML = "";
  }

  /* ------------------------- eventos de archivos ------------------------- */
  ui.file.addEventListener("change", async () => {
    const f = ui.file.files[0];
    ui.result.innerHTML = ""; rows = [];
    if (!f) { render(); return; }
    if (!window.XLSX) { ui.summary.innerHTML = `<span class="bulk-err-text">No se pudo cargar el lector de Excel (revisa tu conexión y recarga la página).</span>`; return; }
    try {
      ui.status.textContent = "Leyendo el archivo…";
      existing = await fetchAllProducts("id,name,ref,category,image");
      const parsed = readSheet(await f.arrayBuffer());
      analyze(parsed.rows);
      ui.status.textContent = "";
      render();
      if (!rows.length) ui.summary.innerHTML = `<span class="bulk-err-text">No encontré productos en el archivo (la hoja «${escH(parsed.sheetName)}» está vacía). Llena la plantilla y vuelve a subirla.</span>`;
    } catch (e) {
      ui.status.textContent = "";
      ui.wrap.hidden = true; ui.btn.disabled = true;
      ui.summary.innerHTML = `<span class="bulk-err-text">${escH(e.message || e)}</span>`;
    }
  });
  ui.photos.addEventListener("change", () => {
    photos = Array.from(ui.photos.files || []).filter(f => /^image\//.test(f.type) || /\.(jpe?g|png|webp)$/i.test(f.name));
    matchPhotos();
    if (rows.length) render();
  });

  /* ------------------------- importar ------------------------- */
  function setProgress(done, total, text) {
    ui.progress.hidden = false; ui.progress.max = total; ui.progress.value = done; ui.status.textContent = text;
  }
  ui.btn.addEventListener("click", async () => {
    const todo = rows.filter(r => !r.errors.length);
    if (!todo.length || importing) return;
    const nNew = todo.filter(r => r.action === "new").length, nUpd = todo.length - nNew;
    if (!window.confirm(`Se van a crear ${nNew} producto(s) y actualizar ${nUpd}.\n\n¿Continuar?`)) return;
    importing = true; ui.btn.disabled = true; ui.file.disabled = true; ui.photos.disabled = true;
    const problems = [];
    let photosOk = 0, created = 0, updated = 0;

    const withPhoto = todo.filter(r => r.photoFile);
    const total = withPhoto.length + todo.length;
    let done = 0;
    try {
      // 1) fotos
      await pool(withPhoto, 3, async r => {
        try { r.payload.image = await uploadPhoto(r.photoFile); photosOk++; }
        catch (e) { problems.push(`Fila ${r.rowNum}: no se pudo subir la foto «${r.photoFile.name}» (${e.message || e}). El producto se guardó sin cambiar su foto.`); }
        setProgress(++done, total, `Subiendo fotos… ${photosOk}/${withPhoto.length}`);
      });

      // 2) productos nuevos (en lotes de 50)
      const news = todo.filter(r => r.action === "new");
      news.forEach(r => { if (r.payload.image == null) r.payload.image = ""; });   // mismas columnas en todos los lotes
      for (const group of chunk(news, 50)) {
        const payloads = group.map(r => r.payload);
        const { error } = await supabaseClient.from("products").insert(payloads);
        if (!error) { created += group.length; done += group.length; }
        else {
          for (const r of group) {                            // aislar la fila que falla
            const { error: e1 } = await supabaseClient.from("products").insert(r.payload);
            if (e1) problems.push(`Fila ${r.rowNum} («${r.payload.name}»): ${e1.message}`); else created++;
            done++;
          }
        }
        setProgress(done, total, `Creando productos… ${created}/${news.length}`);
      }

      // 3) actualizaciones
      const upds = todo.filter(r => r.action === "update");
      let uDone = 0;
      await pool(upds, 5, async r => {
        const payload = Object.assign({}, r.payload, { updated_at: new Date().toISOString() });
        const { error } = await supabaseClient.from("products").update(payload).eq("id", r.match.id);
        if (error) problems.push(`Fila ${r.rowNum} («${r.payload.name || r.match.name}»): ${error.message}`); else updated++;
        done++; uDone++;
        setProgress(done, total, `Actualizando productos… ${uDone}/${upds.length}`);
      });
    } catch (e) {
      problems.push("Error inesperado: " + (e.message || e));
    }

    importing = false; ui.file.disabled = false; ui.photos.disabled = false;
    ui.progress.hidden = true; ui.status.textContent = "";
    const failed = problems.length;
    ui.result.innerHTML =
      `<div class="bulk-done ${failed ? "warn" : "ok"}"><strong>${failed ? "Importación terminada con avisos" : "¡Importación terminada!"}</strong><br>` +
      `✓ ${created} creado(s) · ✓ ${updated} actualizado(s) · ✓ ${photosOk} foto(s) subida(s)` +
      (rows.length - todo.length ? ` · ${rows.length - todo.length} fila(s) con error no se importaron` : "") +
      (failed ? `<ul>${problems.map(p => `<li>${escH(p)}</li>`).join("")}</ul>` : "") + `</div>`;
    window.dispatchEvent(new CustomEvent("products-imported"));
    // dejar listo para otra carga
    rows = []; photos = []; ui.file.value = ""; ui.photos.value = ""; ui.wrap.hidden = true; ui.summary.innerHTML = ""; ui.btn.textContent = "Importar"; ui.btn.disabled = true;
    if (ui.photoInfo) ui.photoInfo.textContent = "Aún no has elegido fotos.";
  });

  /* ------------------------- exportar el catálogo actual ------------------------- */
  ui.exportBtn.addEventListener("click", async () => {
    if (!window.XLSX) { alert("No se pudo cargar el lector de Excel. Recarga la página."); return; }
    ui.exportBtn.disabled = true; const old = ui.exportBtn.textContent; ui.exportBtn.textContent = "Preparando…";
    try {
      const data = await fetchAllProducts("id,name,brand,category,ref,mayor,offer,min_qty,avail,featured,note");
      const aoa = [HEADERS].concat(data.map(p => [
        p.name, p.brand || "", CAT_LABEL[p.category] || p.category || "", p.ref || "", p.mayor, p.offer == null ? "" : p.offer,
        p.min_qty, p.avail ? "Sí" : "No", p.featured ? "Sí" : "No", p.note || "", "",
      ]));
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      ws["!cols"] = [44, 30, 14, 16, 14, 16, 14, 12, 12, 60, 26].map(w => ({ wch: w }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Productos");
      XLSX.writeFile(wb, "catalogo_actual_mayoristas.xlsx");
    } catch (e) {
      alert("No se pudo exportar: " + (e.message || e));
    }
    ui.exportBtn.disabled = false; ui.exportBtn.textContent = old;
  });

  /* ------------------------- plantilla vacía (incluida aquí, no depende de otro archivo) ------------------------- */
  const TEMPLATE_B64 = "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f3v98PL6Fw77ik/41dMvxO/uH/74j2qLX13/4om/5hP//c23Nw83dy9vf+nsf8Fn/83Dzcvb+2d/8o+//W///RfP/Ws+94fj758eweP1T1/mF77IX/IX+er67vH2m+tvnr3+6VW4u339S0/lr/irfH379s393e3vXt38wrF/bY69eRrEl9ff3P/CobKHvny4ffPy9umx9/aru2cvnr28v3u8ubv9xa/2N/zVfn3/+PSzcffTN+E3N6+ePX1TfX/7r/d/8Kq+ePp2//g9Xz9+a9f3X3u+/9rv/pV1+S74qcR/LL8+Fv1U1r8r/+7E7eOJ2/HE7XjiY1FzJ+4fT9yPJ+7HEx+Lujvx+HjicTzxOJ74WDTciefHE8/jiefxxMei6U4cH08cxxPH8cTHonAnXh9PvI4nXscTH4uWO/H+eOJ9PPE+nvhYtN2Jy9Xl31FXx1N/SL907nPSh0RnT/+GLOezl/PZj0kfEp39MmLlvGLlPGPnpGKHrFyWrJynrJy37JxU7JqVy5yV856V86Cdk4qdtHLZtHIetXJetXNSsbtWLsNWzstWztN2Tip23Mpl3cp53sp5385JxS5cuUxcOW9cOY/cOanYmSuXnSvnoSvnpTsnFbt19bJ19bx19bx156Rqt65etq6et66et+6cVO3W1fQfbPBfbPCfbPDfbHbr6mXr6nnr6nnrzknVbl29bF09b109b905qdqtq5etq+etq+etOydVu3X1snX1vHX1vHXnpGq3rl62rp63rp637pxU7dbVy9bV89bV89adk6rdunrZunreunreunNStVvXLlvXzlvXzlt3Tmp269pl69p569p5685JzW5du2xdO29dO2/dOan536Cm36HCb1Hh96jwm1S7de2yde28de28deekZreuXbaunbeunbfunNTs1rXL1rXz1rXz1p2Tmt26dtm6dt66dt66c1KzW9cuW9fOW9fOW3dOanbr2mXr2nnr2nnrzknNbl2/bF0/b10/b905qdut65et6+et6+etOyd1u3X9snX9vHX9vHXnpG63rl+2rp+3rp+37pzU/Z/IpT+Sgz+Tgz+Ugz+Vs1vXL1vXz1vXz1t3Tup26/pl6/p56/p5685J3W5dv2xdP29dP2/dOanbreuXrevnrevnrTsndbt1/bJ1/bx1/bx156Rut25ctm6ct26ct+6cNOzWjcvWjfPWjfPWnZOG3bpx2bpx3rpx3rpz0rBbNy5bN85bN85bd04aduvGZevGeevGeevOScP/FUT6Owj4Swj4Wwj4awi7deOydeO8deO8deekYbduXLZunLdunLfunDTs1o3L1o3z1o3z1p2Tht26cdm6cd66cd66c9KwWzcvWzfPWzfPW3dOmnbr5mXr5nnr5nnrzknTbt28bN08b908b905adqtm5etm+etm+etOydNu3XzsnXzvHXzvHXnpGm3bl62bp63bp637pw0/d+5pr90hb91hb92hb93tVs3L1s3z1s3z1t3Tpp26+Zl6+Z56+Z5685J027dvGzdPG/dPG/dOWnarYvL1sV56+K8deeksFsXl62L89bFeevOSWG3Li5bF+eti/PWnZPCbl1cti7OWxfnrTsnhd26uGxdnLcuzlt3Tgq7dXHZujhvXZy37pwUduvisnVx3ro4b905KfxFJukqk/PWxXnrzklhty4uWxfnrYvz1p2Twm5dXLYuzlsX5607J4XdunXZunXeunXeunPSslu3Llu3zlu3zlt3Tlp269Zl69Z569Z5685Jy27dumzdOm/dOm/dOWnZrVuXrVvnrVvnrTsnLbt167J167x167x156Rlt25dtm6dt26dt+6ctOzWrcvWrfPWrfPWnZOW3bqVLquD6+rgwjq4ss5u3bps3Tpv3Tpv3Tlp2a3bl63b563b5607J227dfuydfu8dfu8deekbbduX7Zun7dun7funLTt1u3L1u3z1u3z1p2Ttt26fdm6fd66fd66c9K2W7cvW7fPW7fPW3dO2nbr9mXr9nnr9nnrzknbbt2+bN0+b90+b905adut25et2+et2+etOydtfxlxuo4YLiSGK4nhUuJPuJY4X0xMVxPT5cR0PbG/oPgqXVF8BZcUX8E1xeemnxs+hHRZ8RVcV3wFFxafm35u+BDStcVXcHHxFVxdfG76ueFDSBcYX8EVxldwifG56eeGDyFdZXwFlxlfwXXG56afGz6EdKnxFVxrfAUXG5+bfm74ENL1xlfnQfy5/fJDOE/izw0fQrro+AquOr6Cy47PTT83fAjpyuMruPT4Cq49Pjf93OghZGpB1oKwBWmLT+EW2VsQuCBxQeTCr2NGF6QuiF2Qu/gEeJHlBdELsheELz5BX2R+Qf6CAAYJjE8gGNlgEMIghUEM4xMcRoYY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lWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWBpuatTEtWpoGVaWBloKl5K9OSlWlgZRpYGWhq3sq0ZGUaWJkGVgaamrcyLVmZBlamgZWB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gpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srMZGUmWJkJVgaaprcyM1mZCVZmgpWBpumtzExWZoKVmWBloGl6KzOTlZlgZSZYGWia3srM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mQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBloWt7KrGRlFliZBVYGmpa3MitZmQVWZoGVgablrcxKVmaBlVlgZaBpeSuzkpVZYGUWWBlo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";
  const tplLink = document.querySelector("#tabBulk .bulk-link");
  if (tplLink) tplLink.addEventListener("click", e => {
    e.preventDefault();
    const bytes = Uint8Array.from(atob(TEMPLATE_B64), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "plantilla_carga_productos.xlsx";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  matchPhotos();
})();
