# Guia: Google, domínio próprio e métricas

Passos feitos fora do código, nos painéis do Google, do Cloudflare e do Registro.br. Se for comprar um domínio próprio, vale fazer a etapa 3 primeiro e já usar o domínio novo nas etapas 1 e 2.

---

## 1. Perfil do hotel no Google (Google Maps)

É de onde vem a maior parte das buscas por "hotel em Janaúba".

1. Acesse [business.google.com](https://business.google.com) com a conta Google do hotel.
2. Procure **Hotel Premier Janauba**.
   - Se o perfil já estiver na sua conta, abra-o.
   - Se não estiver, clique em **Reivindicar esta empresa** e siga a verificação (código por telefone, SMS, e-mail ou vídeo).
3. Clique em **Editar perfil → Contato → Site** e informe o endereço do site (ex.: `https://<projeto>.pages.dev` ou o domínio próprio).
4. Confira se nome, endereço e telefone estão **iguais** aos do site: `Rua Inhumas, 175 – Centro, Janaúba – MG, 39442-030` e `(38) 99876-0055`. Dados idênticos em todos os lugares ajudam no ranking local.
5. Aproveite para revisar os horários (check-in 14h, recepção 24h), as comodidades e as fotos do perfil, e para responder às avaliações.

---

## 2. Google Search Console

Faz o Google encontrar e indexar todas as páginas do site mais rápido, e mostra por quais buscas as pessoas chegam até ele.

### Com domínio próprio no Cloudflare (mais simples)
1. Acesse [search.google.com/search-console](https://search.google.com/search-console) → **Adicionar propriedade** → **Domínio** e informe o domínio (ex.: `hotelpremierjanauba.com.br`).
2. O Google oferece a verificação automática pelo Cloudflare (ou mostra um registro TXT para adicionar em **Cloudflare → domínio → DNS → Records**). Conclua e clique em **Verificar**.

### Com o endereço `.pages.dev`
1. No Search Console, escolha **Prefixo do URL** e informe o endereço do site, com `https://`.
2. Em métodos de verificação, escolha **Tag HTML**. O Google mostra algo como
   `<meta name="google-site-verification" content="AbC123..." />`.
   Copie **só o valor** de `content`.
3. No Cloudflare, abra o projeto → **Settings → Variables and Secrets** (Production) e crie a variável `VITE_GOOGLE_SITE_VERIFICATION`, tipo **Text**, com o código copiado.
4. Em **Deployments**, abra o menu (⋯) do deploy mais recente e clique em **Retry deployment**.
5. Volte ao Search Console e clique em **Verificar**.

### Depois de verificar (nos dois casos)
- No menu **Sitemaps**, digite `sitemap.xml` e clique em **Enviar**.
- Em **Inspeção de URL**, cole o endereço da página inicial e clique em **Solicitar indexação**.

---

## 3. Domínio próprio

Um endereço como `hotelpremierjanauba.com.br` passa mais credibilidade do que `.pages.dev`.

### Comprar o domínio
1. Acesse [registro.br](https://registro.br), pesquise o nome desejado e conclua a compra. O `.com.br` custa cerca de R$ 40 por ano e exige CNPJ ou CPF.

### Passar o DNS para o Cloudflare (grátis)
2. Em [dash.cloudflare.com](https://dash.cloudflare.com), clique em **Add a domain**, informe o domínio e escolha o plano **Free**.
3. O Cloudflare mostra dois **nameservers** (ex.: `ana.ns.cloudflare.com` e `bob.ns.cloudflare.com`).
4. No Registro.br, abra o domínio → **DNS** → **Alterar servidores DNS** e troque pelos dois nameservers do Cloudflare.
5. Aguarde a ativação (de alguns minutos a algumas horas). O Cloudflare avisa por e-mail quando o domínio estiver ativo.

### Ligar o domínio ao site
6. No projeto do Pages, abra **Custom domains → Set up a custom domain** e adicione o domínio (ex.: `hotelpremierjanauba.com.br`). Repita para `www.hotelpremierjanauba.com.br`. O Cloudflare cria os registros DNS e o certificado HTTPS sozinho.
7. Para ter um endereço único, crie um redirecionamento de `www` para o domínio sem `www` em **domínio → Rules → Redirect Rules** (há um modelo pronto "Redirect from WWW to root").

### Atualizar o site
8. No projeto do Pages, em **Settings → Variables and Secrets** (Production), crie `VITE_SITE_URL`, tipo **Text**, com o domínio final sem barra no final (ex.: `https://hotelpremierjanauba.com.br`). Depois, **Retry deployment**.
9. Atualize o endereço no perfil do Google (etapa 1) e cadastre o domínio no Search Console (etapa 2), enviando o sitemap de novo.

---

## Métricas de acesso (Cloudflare Web Analytics)

1. No projeto do Pages, abra **Metrics → Web Analytics → Enable**.
2. A partir do deploy seguinte, o painel mostra visitas, páginas mais vistas, origem do tráfego, países, dispositivos e a velocidade de carregamento do site. É grátis, anônimo e sem cookies.

---

## Desligar a Vercel

Depois que o site estiver no ar pelo Cloudflare, exclua o projeto da Vercel para não manter duas cópias do site publicadas (Vercel → projeto → **Settings → Advanced → Delete Project**).
