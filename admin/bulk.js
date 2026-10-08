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

  matchPhotos();
})();
