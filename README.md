# Meu Brasil — Cidadezinha Online

Projeto web feito para abrir no celular e publicar no Vercel.

## Publicar no Vercel
1. Envie todos estes arquivos para a raiz do repositório GitHub (não precisa criar pasta `src`).
2. No Vercel, importe o repositório.
3. Framework: Vite; Build Command: `npm run build`; Output Directory: `dist`.
4. Faça Deploy.

## Como funciona agora
- O mapa é uma ilustração 2D estilo cartoon em canvas.
- Dá para selecionar cidades e criar uma casa localmente.
- Para casas realmente compartilhadas entre aparelhos, configure o Supabase.

## Ativar o modo online
1. Crie um projeto no Supabase.
2. No SQL Editor, execute o conteúdo de `supabase.sql`.
3. Em Project Settings → API, copie Project URL e anon/public key.
4. Coloque os dois valores em `supabase-config.js`.
5. Faça commit dos arquivos e aguarde o Vercel publicar de novo.

**Aviso:** esta é uma base inicial. O nome do jogador não é autenticação; antes de publicar para muita gente, implemente login, limites e moderação.
