// =====================================================================
// SUPABASE CLIENT — conexión y funciones de carga de datos
// =====================================================================
const SUPABASE_READY = typeof SUPABASE_URL !== "undefined" && SUPABASE_URL && !SUPABASE_URL.includes("PEGA_AQUI");

const supabaseClient = SUPABASE_READY
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const DEFAULT_SETTINGS = {
  id: 1,
  whatsapp_number: typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "",
  eyebrow_text: "Venta al mayor — mínimo 12 unidades por pedido (puedes combinar fragancias)",
  hero_title: "",
  hero_subtitle: "",
  exchange_rate: 0,
  pago_movil_phone: "",
  pago_movil_cedula: "",
  pago_movil_bank: "",
  binance_email: "",
  binance_holder_name: "",
  zelle_email: "",
  zelle_holder_name: "",
};

async function fetchCatalog() {
  if (SUPABASE_READY) {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("id", { ascending: true });
    if (!error && data) return data;
    console.warn("No se pudo leer el catálogo de Supabase.", error);
  }
  return [];
}

async function fetchSettings() {
  if (SUPABASE_READY) {
    const { data, error } = await supabaseClient
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!error && data) return { ...DEFAULT_SETTINGS, ...data };
    console.warn("No se pudieron leer los ajustes del sitio.", error);
  }
  return { ...DEFAULT_SETTINGS };
}

async function fetchBanners() {
  if (SUPABASE_READY) {
    const { data, error } = await supabaseClient
      .from("banners")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (!error && data) return data;
    console.warn("No se pudieron leer los banners.", error);
  }
  return [];
}

async function fetchProductById(id) {
  if (SUPABASE_READY) {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error) return data;
  }
  return null;
}

async function fetchProductsByCategory(category, excludeId, limit = 6) {
  if (SUPABASE_READY) {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", excludeId)
      .limit(limit);
    if (!error && data) return data;
  }
  return [];
}

async function fetchProductsByIds(ids) {
  if (SUPABASE_READY && ids.length) {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .in("id", ids);
    if (!error && data) return data;
  }
  return [];
}

async function fetchAdvisors() {
  if (SUPABASE_READY) {
    const { data, error } = await supabaseClient.from("advisors").select("*").eq("active", true).order("sort_order", { ascending: true });
    if (!error && data) return data;
    console.warn("No se pudieron leer las asesoras.", error);
  }
  return [];
}

async function getNextAdvisor() {
  if (SUPABASE_READY) {
    const { data, error } = await supabaseClient.rpc("get_next_advisor");
    if (!error && data && data.length) return data[0];
    console.warn("No se pudo asignar asesora por turno.", error);
  }
  return null;
}

async function createOrder(order) {
  if (!SUPABASE_READY) throw new Error("Supabase no está configurado.");
  // OJO: no se pide el pedido de vuelta (.select()), porque un cliente sin sesión
  // no tiene permiso de LEER pedidos y la base lo rechazaba aunque sí podía crearlo.
  let { error } = await supabaseClient.from("orders").insert(order);
  if (error && /payment_(reference|status)/.test(error.message || "")) {
    // Si todavía no se corrió la migración de pagos, se guarda igual y el pago va dentro de la nota.
    const { payment_reference, payment_status, ...rest } = order;
    rest.note = `Pago: ${order.payment_method || ""}${payment_reference ? " · Ref " + payment_reference : ""} · ${payment_status || ""}`;
    ({ error } = await supabaseClient.from("orders").insert(rest));
  }
  if (error) throw error;
  return null;
}
