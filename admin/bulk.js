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
    "Cantidad mínima", "Disponible", "Destacado", "Descripción / contenido", "Foto (nombre del archivo)", "Código PosGold"];

  function headerField(h) {
    const s = strip(h);
    if (!s) return null;
    if (s.includes("posgold")) return "posgold";          // antes que «codigo» (que es la referencia)
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
      // Todas las columnas empiezan vacías: si tu Excel no trae alguna (oferta, mínimo, etc.), simplemente no se toca.
      const raw = { name: "", brand: "", category: "", ref: "", price: "", offer: "", min: "", avail: "", featured: "", note: "", photo: "", posgold: "" };
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
      // código de PosGold
      const pgc = String(raw.posgold == null ? "" : raw.posgold).trim();
      if (isDash(raw.posgold)) p.posgold_code = ""; else if (pgc) p.posgold_code = pgc; else if (!r.match) p.posgold_code = "";
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
      const data = await fetchAllProducts("id,name,brand,category,ref,mayor,offer,min_qty,avail,featured,note,posgold_code");
      const aoa = [HEADERS].concat(data.map(p => [
        p.name, p.brand || "", CAT_LABEL[p.category] || p.category || "", p.ref || "", p.mayor, p.offer == null ? "" : p.offer,
        p.min_qty, p.avail ? "Sí" : "No", p.featured ? "Sí" : "No", p.note || "", "", p.posgold_code || "",
      ]));
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      ws["!cols"] = [44, 30, 14, 16, 14, 16, 14, 12, 12, 60, 26, 18].map(w => ({ wch: w }));
      const wb = XLSX.utils.book_new();
      for (let rr = 1; rr < aoa.length; rr++) for (const cc of [3, 11]) {            // referencia y código PosGold como texto (conserva ceros)
        const cell = ws[XLSX.utils.encode_cell({ r: rr, c: cc })];
        if (cell && cell.v !== "") { cell.t = "s"; cell.v = String(cell.v); cell.z = "@"; }
      }
      XLSX.utils.book_append_sheet(wb, ws, "Productos");
      XLSX.writeFile(wb, "catalogo_actual_mayoristas.xlsx");
    } catch (e) {
      alert("No se pudo exportar: " + (e.message || e));
    }
    ui.exportBtn.disabled = false; ui.exportBtn.textContent = old;
  });

  /* ------------------------- plantilla vacía (incluida aquí, no depende de otro archivo) ------------------------- */
  const TEMPLATE_B64 = "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";
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
