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

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Uso |
| --- | --- |
| `VITE_SITE_URL` | Domínio final (ex.: `https://www.hotelpremierjanauba.com.br`). Ativa canonical, `og:url`, `sitemap.xml` e `robots.txt` com sitemap. |
| `VITE_CONTACT_ENDPOINT` | Opcional. URL que recebe o formulário de contato (POST JSON). Sem ela, a mensagem é enviada pelo WhatsApp da recepção. |

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

Ainda não recebemos fotos oficiais do hotel. Todos os espaços de imagem exibem um **placeholder identificado** ("Espaço para foto · …") para não induzir o visitante a erro com imagens genéricas.

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

As imagens usam lazy loading e `srcset` responsivo. Para ocultar os rótulos dos placeholders, altere `showPlaceholderLabels` em `src/config/site.ts`.

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
scripts/prerender.mjs   gera o HTML estático de cada rota
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
