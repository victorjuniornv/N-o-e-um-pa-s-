# Meu Brasil 3D

Protótipo mobile-first em Three.js com cenário 3D, câmera por toque, casas por cidade/estado e integração opcional com Supabase Realtime.

## Configuração online
1. Crie um projeto em https://supabase.com.
2. Abra SQL Editor e execute `supabase.sql`.
3. Em Project Settings > API, copie Project URL e anon/public key.
4. Cole os valores em `src/supabase-config.js`. Não use a chave `service_role`.
5. Ative Realtime para a tabela `public.houses` no painel do Supabase.
6. Publique este projeto conectando um repositório GitHub à Vercel. Framework Vite; build command `npm run build`; output directory `dist`.

## Rodar
`npm install` e `npm run dev`.

Sem configuração Supabase, o jogo funciona apenas como demonstração local. O mapa/cidades é uma cena ilustrativa, não um mapa geográfico fiel do Brasil. A política SQL é apenas para protótipo e permite que visitantes atualizem casas; para lançamento público, implemente autenticação, validação e limites contra abuso.
