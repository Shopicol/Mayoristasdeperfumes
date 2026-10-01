-- =====================================================================
-- MAYORISTAS DE PERFUMES VENEZUELA — cantidad mínima de compra
-- =====================================================================
-- CÓMO USARLO:
-- 1. Entra a tu proyecto en supabase.com → "SQL Editor" → "New query"
-- 2. Pega TODO este archivo y dale "Run"
-- =====================================================================
-- Por defecto, 12 unidades (como ya manejas tú) — las cajas/combos
-- quedan en 1, porque esas sí se venden por unidad.
-- =====================================================================

alter table products add column if not exists min_qty integer not null default 12;

update products set min_qty = 1 where category = 'Cajas / Combos';

-- Después de correr esto: los perfumes individuales quedan en mínimo
-- 12, y las cajas/combos en mínimo 1.
