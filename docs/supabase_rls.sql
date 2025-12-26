-- 目的：
-- 1) 业务表按用户隔离：新增 user_id 字段
-- 2) 开启 RLS：确保每个用户只能读写自己的数据
-- 3) 兼容现有代码：services/supabaseService.ts 会写入/过滤 user_id
--
-- 在 Supabase 控制台执行：SQL Editor -> New query -> 粘贴运行

-- 1) meals
alter table public.meals add column if not exists user_id uuid not null default auth.uid();
create index if not exists meals_user_id_idx on public.meals(user_id);

alter table public.meals enable row level security;

drop policy if exists "meals_select_own" on public.meals;
create policy "meals_select_own"
on public.meals for select
using (user_id = auth.uid());

drop policy if exists "meals_insert_own" on public.meals;
create policy "meals_insert_own"
on public.meals for insert
with check (user_id = auth.uid());

drop policy if exists "meals_update_own" on public.meals;
create policy "meals_update_own"
on public.meals for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "meals_delete_own" on public.meals;
create policy "meals_delete_own"
on public.meals for delete
using (user_id = auth.uid());

-- 2) meal_items
alter table public.meal_items add column if not exists user_id uuid not null default auth.uid();
create index if not exists meal_items_user_id_idx on public.meal_items(user_id);

alter table public.meal_items enable row level security;

drop policy if exists "meal_items_select_own" on public.meal_items;
create policy "meal_items_select_own"
on public.meal_items for select
using (user_id = auth.uid());

drop policy if exists "meal_items_insert_own" on public.meal_items;
create policy "meal_items_insert_own"
on public.meal_items for insert
with check (user_id = auth.uid());

drop policy if exists "meal_items_update_own" on public.meal_items;
create policy "meal_items_update_own"
on public.meal_items for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "meal_items_delete_own" on public.meal_items;
create policy "meal_items_delete_own"
on public.meal_items for delete
using (user_id = auth.uid());

-- 3) staple_meals
alter table public.staple_meals add column if not exists user_id uuid not null default auth.uid();
create index if not exists staple_meals_user_id_idx on public.staple_meals(user_id);

alter table public.staple_meals enable row level security;

drop policy if exists "staple_meals_select_own" on public.staple_meals;
create policy "staple_meals_select_own"
on public.staple_meals for select
using (user_id = auth.uid());

drop policy if exists "staple_meals_insert_own" on public.staple_meals;
create policy "staple_meals_insert_own"
on public.staple_meals for insert
with check (user_id = auth.uid());

drop policy if exists "staple_meals_update_own" on public.staple_meals;
create policy "staple_meals_update_own"
on public.staple_meals for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "staple_meals_delete_own" on public.staple_meals;
create policy "staple_meals_delete_own"
on public.staple_meals for delete
using (user_id = auth.uid());

-- 4) critical_samples
alter table public.critical_samples add column if not exists user_id uuid not null default auth.uid();
create index if not exists critical_samples_user_id_idx on public.critical_samples(user_id);

alter table public.critical_samples enable row level security;

drop policy if exists "critical_samples_select_own" on public.critical_samples;
create policy "critical_samples_select_own"
on public.critical_samples for select
using (user_id = auth.uid());

drop policy if exists "critical_samples_insert_own" on public.critical_samples;
create policy "critical_samples_insert_own"
on public.critical_samples for insert
with check (user_id = auth.uid());

drop policy if exists "critical_samples_update_own" on public.critical_samples;
create policy "critical_samples_update_own"
on public.critical_samples for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "critical_samples_delete_own" on public.critical_samples;
create policy "critical_samples_delete_own"
on public.critical_samples for delete
using (user_id = auth.uid());


