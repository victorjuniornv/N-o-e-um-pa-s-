create table if not exists public.houses (city text not null,state text not null,house_name text not null default 'Minha casa',owner_name text not null default 'Jogador',color text,roof text,created_at timestamptz not null default now(),constraint houses_city_state_unique unique(city,state));
alter table public.houses enable row level security;
create policy "Anyone can read houses" on public.houses for select to anon,authenticated using(true);
create policy "Visitors can add houses" on public.houses for insert to anon,authenticated with check(length(city) between 2 and 60 and length(state)=2 and length(house_name) between 1 and 45 and length(owner_name) between 1 and 24);
create policy "Visitors can update houses" on public.houses for update to anon,authenticated using(true) with check(length(city) between 2 and 60 and length(state)=2 and length(house_name) between 1 and 45 and length(owner_name) between 1 and 24);
-- No painel Supabase, habilite Realtime para public.houses.
-- Protótipo: qualquer visitante pode atualizar casas. Antes de abrir ao público, adicione login e regras de propriedade.
