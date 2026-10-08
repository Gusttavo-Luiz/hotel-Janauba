# Guia: Google e domínio próprio

Passos feitos fora do código, nos painéis do Google, da Vercel e do Registro.br. A ordem recomendada é a deste guia; se for comprar um domínio próprio, vale fazer a etapa 3 primeiro e usar o domínio novo nas etapas 1 e 2.

---

## 1. Perfil do hotel no Google (Google Maps)

É de onde vem a maior parte das buscas por "hotel em Janaúba".

1. Acesse [business.google.com](https://business.google.com) com a conta Google do hotel.
2. Procure **Hotel Premier Janauba**.
   - Se o perfil já estiver na sua conta, abra-o.
   - Se não estiver, clique em **Reivindicar esta empresa** e siga a verificação (código por telefone, SMS, e-mail ou vídeo).
3. Clique em **Editar perfil → Contato → Site** e informe o endereço do site (ex.: `https://hotel-janauba.vercel.app` ou o domínio próprio).
4. Confira se nome, endereço e telefone estão **iguais** aos do site: `Rua Inhumas, 175 – Centro, Janaúba – MG, 39442-030` e `(38) 99876-0055`. Dados idênticos em todos os lugares ajudam no ranking local.
5. Aproveite para revisar os horários (check-in 14h, recepção 24h), as comodidades e as fotos do perfil, e para responder às avaliações.

---

## 2. Google Search Console

Faz o Google encontrar e indexar todas as páginas do site mais rápido, e mostra por quais buscas as pessoas chegam até ele.

1. Acesse [search.google.com/search-console](https://search.google.com/search-console) e clique em **Adicionar propriedade**.
2. Escolha **Prefixo do URL** e informe o endereço do site, com `https://`.
3. Em métodos de verificação, escolha **Tag HTML**. O Google mostra algo como:
   `<meta name="google-site-verification" content="AbC123..." />`
   Copie **só o valor** de `content` (ex.: `AbC123...`).
4. Na Vercel, abra o projeto → **Settings → Environment Variables** e crie:
   - Nome: `VITE_GOOGLE_SITE_VERIFICATION`
   - Valor: o código copiado
   - Ambiente: **Production**
5. Em **Deployments**, abra o menu (⋯) do deploy mais recente e clique em **Redeploy**.
6. Volte ao Search Console e clique em **Verificar**.
7. No menu **Sitemaps**, digite `sitemap.xml` e clique em **Enviar**.
8. Em **Inspeção de URL**, cole o endereço da página inicial e clique em **Solicitar indexação**.

> Com domínio próprio, também dá para usar a propriedade do tipo **Domínio**, verificada por um registro TXT no DNS (o Google mostra o valor; ele é adicionado na zona DNS do Registro.br, como na etapa 3).

---

## 3. Domínio próprio

Um endereço como `hotelpremierjanauba.com.br` passa mais credibilidade do que `.vercel.app`.

### Comprar o domínio
1. Acesse [registro.br](https://registro.br), pesquise o nome desejado e conclua a compra. O registro `.com.br` custa cerca de R$ 40 por ano e exige CNPJ ou CPF.

### Conectar na Vercel
2. Na Vercel, abra o projeto → **Settings → Domains** → **Add** e informe o domínio (ex.: `hotelpremierjanauba.com.br`). Aceite a sugestão de adicionar também a versão `www`.
3. A Vercel mostra os registros DNS a criar. Normalmente são:
   - Tipo **A**, nome `@` (vazio), valor `76.76.21.21`
   - Tipo **CNAME**, nome `www`, valor `cname.vercel-dns.com`

   Use sempre os valores que aparecerem na tela da Vercel, pois eles podem variar.

### Configurar o DNS no Registro.br
4. No Registro.br, abra o domínio → **DNS** → **Configurar zona DNS** (ou **Editar zona**) e adicione os registros do passo 3.
5. Aguarde a propagação, que leva de alguns minutos a algumas horas. A tela de **Domains** da Vercel fica verde quando estiver tudo certo, e o certificado HTTPS é emitido automaticamente.

### Atualizar o site
6. Na Vercel, em **Settings → Environment Variables**, crie `VITE_SITE_URL` com o domínio final, sem barra no final (ex.: `https://www.hotelpremierjanauba.com.br`), no ambiente **Production**. Depois clique em **Redeploy**.
7. Atualize o endereço no perfil do Google (etapa 1) e adicione o novo domínio no Search Console (etapa 2), enviando o sitemap de novo.

---

## Métricas de acesso (Vercel Web Analytics)

O site já envia métricas anônimas e sem cookies; falta ativar no painel:

1. Na Vercel, abra o projeto → aba **Analytics** → **Enable**.
2. Faça um **Redeploy**. Em alguns minutos as visitas começam a aparecer.

Visitas, páginas mais vistas, origem do tráfego e dispositivos ficam disponíveis no plano gratuito. Os cliques nos botões ("Abrir reserva", "Ver disponibilidade", "WhatsApp", "Booking.com", "Ligar", "Como chegar", "Instagram", "Mensagem enviada") aparecem na seção **Events**, disponível nos planos pagos da Vercel.
