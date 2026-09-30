-- =====================================================================
-- MAYORISTAS DE PERFUMES VENEZUELA — esquema inicial (núcleo esencial)
-- =====================================================================
-- CÓMO USARLO:
-- 1. Entra a tu proyecto en supabase.com → "SQL Editor" → "New query"
-- 2. Pega TODO este archivo y dale "Run"
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PRODUCTOS
-- ---------------------------------------------------------------------
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  brand text not null default '',
  category text not null default '',
  ref text default '',
  detal numeric not null default 0,
  mayor numeric not null default 0,
  offer numeric,
  stock numeric,
  avail boolean not null default true,
  featured boolean not null default false,
  image text default '',
  gallery_images jsonb default '[]',
  tones text default '',
  note text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products enable row level security;

drop policy if exists "Cualquiera puede ver los productos" on products;
create policy "Cualquiera puede ver los productos"
  on products for select
  to anon, authenticated
  using (true);

drop policy if exists "Solo el equipo administra productos (insert)" on products;
create policy "Solo el equipo administra productos (insert)"
  on products for insert to authenticated with check (true);
drop policy if exists "Solo el equipo administra productos (update)" on products;
create policy "Solo el equipo administra productos (update)"
  on products for update to authenticated using (true);
drop policy if exists "Solo el equipo administra productos (delete)" on products;
create policy "Solo el equipo administra productos (delete)"
  on products for delete to authenticated using (true);

create index if not exists idx_products_category on products (category);
create index if not exists idx_products_brand on products (brand);

-- ---------------------------------------------------------------------
-- 2. PEDIDOS
-- ---------------------------------------------------------------------
create table if not exists orders (
  id bigint generated always as identity primary key,
  customer_name text not null default '',
  phone text not null default '',
  email text default '',
  city text default '',
  address text default '',
  delivery_method text default '',
  payment_method text default '',
  items jsonb not null default '[]',
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'nuevo',
  note text default '',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

drop policy if exists "Cualquiera puede crear un pedido" on orders;
create policy "Cualquiera puede crear un pedido"
  on orders for insert to anon, authenticated with check (true);

drop policy if exists "Solo el equipo puede ver los pedidos" on orders;
create policy "Solo el equipo puede ver los pedidos"
  on orders for select to authenticated using (true);

drop policy if exists "Solo el equipo puede actualizar pedidos" on orders;
create policy "Solo el equipo puede actualizar pedidos"
  on orders for update to authenticated using (true);

drop policy if exists "Solo el equipo puede borrar pedidos" on orders;
create policy "Solo el equipo puede borrar pedidos"
  on orders for delete to authenticated using (true);

create index if not exists idx_orders_status on orders (status);
create index if not exists idx_orders_created on orders (created_at desc);

-- ---------------------------------------------------------------------
-- 3. AJUSTES DEL SITIO (fila única, id=1)
-- ---------------------------------------------------------------------
create table if not exists site_settings (
  id int primary key default 1,
  whatsapp_number text default '',
  eyebrow_text text default '',
  hero_title text default '',
  hero_subtitle text default '',
  exchange_rate numeric default 0,
  pago_movil_phone text default '',
  pago_movil_cedula text default '',
  pago_movil_bank text default '',
  binance_email text default '',
  binance_holder_name text default '',
  zelle_email text default '',
  zelle_holder_name text default ''
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

alter table site_settings enable row level security;

drop policy if exists "Cualquiera puede ver los ajustes" on site_settings;
create policy "Cualquiera puede ver los ajustes"
  on site_settings for select to anon, authenticated using (true);

drop policy if exists "Solo el equipo edita los ajustes" on site_settings;
create policy "Solo el equipo edita los ajustes"
  on site_settings for update to authenticated using (true);

-- ---------------------------------------------------------------------
-- 4. BANNERS (carrusel de la portada)
-- ---------------------------------------------------------------------
create table if not exists banners (
  id bigint generated always as identity primary key,
  title text default '',
  subtitle text default '',
  image text default '',
  link_url text default '',
  button_text text default '',
  sort_order int default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table banners enable row level security;

drop policy if exists "Cualquiera puede ver los banners" on banners;
create policy "Cualquiera puede ver los banners"
  on banners for select to anon, authenticated using (true);

drop policy if exists "Solo el equipo administra banners (insert)" on banners;
create policy "Solo el equipo administra banners (insert)"
  on banners for insert to authenticated with check (true);
drop policy if exists "Solo el equipo administra banners (update)" on banners;
create policy "Solo el equipo administra banners (update)"
  on banners for update to authenticated using (true);
drop policy if exists "Solo el equipo administra banners (delete)" on banners;
create policy "Solo el equipo administra banners (delete)"
  on banners for delete to authenticated using (true);

-- ---------------------------------------------------------------------
-- 5. STORAGE — bucket para imágenes de productos/banners
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Lectura pública de imágenes" on storage.objects;
create policy "Lectura pública de imágenes"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "El equipo puede subir imágenes" on storage.objects;
create policy "El equipo puede subir imágenes"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "El equipo puede borrar imágenes" on storage.objects;
create policy "El equipo puede borrar imágenes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
