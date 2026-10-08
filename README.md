# Hotel Premier Janaúba — site institucional

Site institucional do **Hotel Premier Janaúba** (Rua Inhumas, 175 – Centro, Janaúba – MG).

React 19 + TypeScript + Vite + Tailwind CSS 4 + Lucide, com pré-renderização estática de todas as páginas (HTML pronto para buscadores e carregamento rápido).

## Como rodar

```bash
npm install
npm run dev        # ambiente de desenvolvimento (http://localhost:5173)
npm run build      # typecheck + build + pré-renderização → dist/client
npm run preview    # serve o build localmente
```

Publique o conteúdo de `dist/client` em qualquer hospedagem estática. Cada página é gerada como `rota.html` (servida em `/rota`), e há um `404.html`.

## Deploy no Cloudflare Pages

O site é hospedado no [Cloudflare Pages](https://pages.cloudflare.com): grátis, permite uso comercial e tem servidores no Brasil.

**Configuração inicial (uma vez):**

1. Em [dash.cloudflare.com](https://dash.cloudflare.com), abra **Workers & Pages → Create → Pages → Connect to Git** e autorize o GitHub.
2. Escolha o repositório `Gusttavo-Luiz/hotel-Janauba` e preencha:
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/client`
3. Clique em **Save and Deploy**. O site fica em `https://<nome-do-projeto>.pages.dev`.

A partir daí, cada push na `main` publica o site de novo, e cada branch ou PR ganha um link de pré-visualização (com indexação bloqueada).

**O que já vem configurado no repositório:**

- `public/_headers`: cache longo para `/assets/*` e cabeçalhos de segurança;
- `functions/api/contact.ts`: função do formulário por e-mail (rota `/api/contact`);
- `.node-version`: Node 22 no build;
- sem `VITE_SITE_URL`, o build da `main` usa o endereço `*.pages.dev` do projeto para canonical, `og:url` e `sitemap.xml`.

Variáveis ficam em **projeto → Settings → Variables and Secrets** (ambiente Production). Use o tipo **Text** para as `VITE_*`, que são lidas no build, e **Secret** para chaves; depois de alterar, faça um novo deploy (**Deployments → ⋯ → Retry deployment**).

Perfil no Google, Search Console, domínio próprio e métricas: veja o passo a passo em [`docs/guia-google-e-dominio.md`](docs/guia-google-e-dominio.md).

## Métricas de acesso

O site usa o **Cloudflare Web Analytics** (grátis, anônimo e sem cookies), que não exige código: no projeto do Pages, abra **Metrics → Web Analytics → Enable**. A partir do deploy seguinte, o painel mostra visitas, páginas mais vistas, origem do tráfego, países, dispositivos e a velocidade de carregamento. Cliques em botões não são registrados.

## Formulário de contato por e-mail

Por padrão, o formulário abre o WhatsApp da recepção com a mensagem pronta. Para receber por e-mail, usando a função `functions/api/contact.ts`:

1. Crie uma conta em [resend.com](https://resend.com) e gere uma chave em **API Keys**.
2. No Cloudflare (**projeto → Settings → Variables and Secrets**, ambiente Production), crie:
   - `RESEND_API_KEY` (**Secret**): a chave do Resend, que fica só no servidor
   - `CONTACT_TO_EMAIL` (**Text**): o e-mail do hotel que vai receber as mensagens
   - `VITE_CONTACT_ENDPOINT` (**Text**): `/api/contact`
3. Faça um novo deploy.

Sem domínio verificado no Resend, o remetente padrão (`onboarding@resend.dev`) só entrega mensagens para o e-mail dono da conta Resend; por isso, crie a conta com o e-mail do hotel. Com domínio próprio, verifique-o no Resend e defina também `CONTACT_FROM_EMAIL` (ex.: `Site Hotel Premier <contato@seudominio.com.br>`). Se o envio falhar, o visitante vê a opção de mandar a mesma mensagem pelo WhatsApp.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Uso |
| --- | --- |
| `VITE_SITE_URL` | Domínio final (ex.: `https://www.hotelpremierjanauba.com.br`). Ativa canonical, `og:url`, `sitemap.xml` e `robots.txt` com sitemap. |
| `VITE_CONTACT_ENDPOINT` | Opcional. URL que recebe o formulário de contato (POST JSON), ex.: `/api/contact`. Sem ela, a mensagem é enviada pelo WhatsApp da recepção. |
| `VITE_GOOGLE_SITE_VERIFICATION` | Opcional. Código de verificação do Google Search Console (método "Tag HTML"). |
| `VITE_SHOW_PLACEHOLDERS` | Opcional. `true` mostra no site publicado os espaços reservados para fotos ainda não enviadas. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Só no servidor (Cloudflare). Envio do formulário por e-mail; veja acima. |

> Variáveis `VITE_*` ficam públicas no navegador: **nunca** coloque senhas, tokens ou chaves privadas nelas.

## Onde editar o conteúdo

Todo o conteúdo está separado do layout em `src/data/`:

| Arquivo | Conteúdo |
| --- | --- |
| `hotel.ts` | Nome, endereço, telefone, WhatsApp, e-mail, Instagram, links (Booking.com, Tripadvisor, Google Maps), políticas, textos institucionais, notas de avaliação |
| `rooms.ts` | Acomodações (capacidade, camas, área, preço de referência, fotos) |
| `amenities.ts` | Serviços e comodidades |
| `content.ts` | Menu, imagens institucionais, galeria, avaliações, pontos de referência, FAQ |
| `seo.ts` | Títulos, descrições e dados estruturados (schema.org `Hotel`) |

Campos com `null` ainda não foram informados: a seção correspondente fica oculta e aparece automaticamente quando o dado é preenchido (ex.: `email`, `checkOut`, `history`).

## Fotos

Ainda não recebemos fotos oficiais do hotel, e o site não usa imagens genéricas que poderiam ser confundidas com o hotel. Em desenvolvimento, cada espaço de imagem mostra um **placeholder identificado** ("Espaço para foto · …"). No site publicado, os espaços aparecem sem rótulo, e a galeria (com o item "Galeria" do menu) fica oculta até a primeira foto ser adicionada. Para ver os rótulos no site publicado, defina `VITE_SHOW_PLACEHOLDERS=true`.

Para adicionar as fotos reais:

1. Exporte em **WebP** (ou AVIF), qualidade ~75–80, em duas larguras: 800 px e 1600 px (hero: 1920 px).
2. Coloque os arquivos em `public/images/`.
3. Informe `src` (e opcionalmente `srcSet`, `width`, `height`) no item correspondente em `src/data/`. Exemplo:

```ts
hero: {
  src: '/images/fachada-1600.webp',
  srcSet: '/images/fachada-800.webp 800w, /images/fachada-1600.webp 1600w',
  width: 1600,
  height: 1067,
  alt: 'Fachada do Hotel Premier Janaúba',
  placeholder: 'Fachada do hotel',
},
```

As imagens usam lazy loading e `srcset` responsivo.

## Imagem de compartilhamento

`public/og-image.jpg` (1200×630) é a prévia exibida quando o link do site é compartilhado no WhatsApp, Instagram ou Facebook. Ela é gerada a partir de `scripts/og-image.html`; depois de editar o HTML, rode `npm run og-image` (requer o Playwright instalado: `npm i -D playwright`).

## Reservas

O hotel não informou um motor de reservas próprio. A busca "Ver disponibilidade" valida as datas e oferece:

- **Booking.com** — abre a página oficial do hotel com datas, hóspedes e quartos preenchidos;
- **WhatsApp** — mensagem pronta para a recepção (reserva direta).

Para integrar um motor de reservas no futuro, ajuste `src/services/booking.ts`. O campo de código promocional já existe e pode ser ativado em `bookingConfig.promoCodeEnabled`.

## Estrutura

```
src/
  components/
    booking/    formulário de reservas
    layout/     header, menu mobile, rodapé, logo
    sections/   seções das páginas (hero, quartos, galeria, mapa…)
    floating/   WhatsApp flutuante e voltar ao topo
    ui/         botões, campos, imagens, títulos, ícones
  config/       configurações de ambiente
  context/      estado da reserva compartilhado
  data/         conteúdo do hotel (fonte oficial)
  hooks/        hooks reutilizáveis
  lib/          utilitários (datas, preços)
  pages/        páginas (home, o hotel, acomodações, quarto, legais, 404)
  services/     reservas, contato e WhatsApp
functions/api/contact.ts  função do Cloudflare Pages que envia o formulário por e-mail
public/_headers           cabeçalhos de cache e segurança (Cloudflare Pages)
scripts/prerender.mjs   gera o HTML estático de cada rota (com CSS embutido)
scripts/og-image.*      gera a imagem de compartilhamento
docs/                   guias (Google, Search Console, domínio, métricas)
```

## Informações pendentes (a confirmar com o hotel)

- Logo oficial (hoje há um logotipo tipográfico provisório em `src/components/layout/Logo.tsx`)
- Fotos oficiais (fachada, recepção, quartos, banheiros, estacionamento)
- Confirmar se o número **(38) 99876-0055** é também o WhatsApp (já configurado como tal)
- Horário de check-out
- E-mail de contato
- Número de quartos, camas do Quarto Triplo e Família, área dos quartos
- Café da manhã (as tarifas de referência consultadas não o incluem)
- História do hotel
- Revisão dos textos de Política de Privacidade e Termos de Uso por um profissional jurídico
