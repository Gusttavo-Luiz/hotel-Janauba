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

Publique o conteúdo de `dist/client` em qualquer hospedagem estática (Netlify, Vercel, Cloudflare Pages, Hostinger, Apache/Nginx…). Cada página é gerada como `rota/index.html`, e há um `404.html`.

## Deploy na Vercel

O `vercel.json` já define instalação, build, pasta publicada (`dist/client`), URLs sem `.html` e cabeçalhos de cache e segurança.

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório `Gusttavo-Luiz/hotel-Janauba` (branch `main`). Não altere as configurações de build.
2. Clique em **Deploy**. A cada push na `main` o site é publicado de novo; cada PR ganha um link de pré-visualização.
3. Quando tiver domínio próprio, adicione em **Settings → Domains** e defina `VITE_SITE_URL` em **Settings → Environment Variables** (Production). Depois faça um novo deploy.

Sem `VITE_SITE_URL`, o build de produção usa o domínio `*.vercel.app` do projeto para canonical e `sitemap.xml`. Deploys de pré-visualização publicam um `robots.txt` que bloqueia a indexação.

Perfil no Google, Search Console, domínio próprio e ativação das métricas: veja o passo a passo em [`docs/guia-google-e-dominio.md`](docs/guia-google-e-dominio.md).

## Métricas de acesso

O site usa o Vercel Web Analytics (anônimo, sem cookies), ativo apenas em builds feitos na Vercel. Para ligar: projeto na Vercel → aba **Analytics** → **Enable** → Redeploy. Além das visitas, o site registra os eventos "Abrir reserva", "Ver disponibilidade", "WhatsApp", "Booking.com", "Ligar", "Como chegar", "Instagram" e "Mensagem enviada" (a seção de eventos do painel exige um plano pago da Vercel).

## Formulário de contato por e-mail

Por padrão, o formulário abre o WhatsApp da recepção com a mensagem pronta. Para receber por e-mail, usando a função `api/contact.ts`:

1. Crie uma conta em [resend.com](https://resend.com) e gere uma chave em **API Keys**.
2. Na Vercel (**Settings → Environment Variables**, ambiente Production), crie:
   - `RESEND_API_KEY`: a chave do Resend (fica só no servidor)
   - `CONTACT_TO_EMAIL`: o e-mail do hotel que vai receber as mensagens
   - `VITE_CONTACT_ENDPOINT`: `/api/contact`
3. Faça um Redeploy.

Sem domínio verificado no Resend, o remetente padrão (`onboarding@resend.dev`) só entrega mensagens para o e-mail dono da conta Resend; por isso, crie a conta com o e-mail do hotel. Com domínio próprio, verifique-o no Resend e defina também `CONTACT_FROM_EMAIL` (ex.: `Site Hotel Premier <contato@seudominio.com.br>`). Se o envio falhar, o visitante vê a opção de mandar a mesma mensagem pelo WhatsApp.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Uso |
| --- | --- |
| `VITE_SITE_URL` | Domínio final (ex.: `https://www.hotelpremierjanauba.com.br`). Ativa canonical, `og:url`, `sitemap.xml` e `robots.txt` com sitemap. |
| `VITE_CONTACT_ENDPOINT` | Opcional. URL que recebe o formulário de contato (POST JSON), ex.: `/api/contact`. Sem ela, a mensagem é enviada pelo WhatsApp da recepção. |
| `VITE_GOOGLE_SITE_VERIFICATION` | Opcional. Código de verificação do Google Search Console (método "Tag HTML"). |
| `VITE_SHOW_PLACEHOLDERS` | Opcional. `true` mostra no site publicado os espaços reservados para fotos ainda não enviadas. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Só no servidor (Vercel). Envio do formulário por e-mail; veja abaixo. |

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
api/contact.ts          função da Vercel que envia o formulário por e-mail
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
