import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { fullAddress, hotel } from '@/data/hotel';
import { PageHero } from '@/components/sections/PageHero';

const updatedAt = 'outubro de 2026';

function LegalLayout({ title, crumb, children }: { title: string; crumb: string; children: ReactNode }) {
  return (
    <>
      <PageHero
        eyebrow="Informações legais"
        title={title}
        description={`Última atualização: ${updatedAt}.`}
        breadcrumbs={[{ label: 'Início', to: '/' }, { label: crumb }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <article className="prose-hotel max-w-3xl text-[1.02rem] leading-relaxed text-muted">{children}</article>
        </div>
      </section>
    </>
  );
}

const contactLine = (
  <>
    pelo telefone/WhatsApp <a className="text-gold-dark underline" href={`tel:${hotel.contact.phoneE164}`}>{hotel.contact.phoneDisplay}</a>
    {hotel.contact.email && (
      <>
        {' '}ou pelo e-mail <a className="text-gold-dark underline" href={`mailto:${hotel.contact.email}`}>{hotel.contact.email}</a>
      </>
    )}
  </>
);

export function PrivacyPage() {
  return (
    <LegalLayout title="Política de Privacidade" crumb="Política de privacidade">
      <p>
        Esta Política explica como o {hotel.name} ({fullAddress}) trata os dados pessoais de quem utiliza este site, em
        conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
      </p>
      <h2>Quais dados coletamos</h2>
      <p>
        Coletamos apenas os dados que você nos informa voluntariamente no formulário de contato e na consulta de
        disponibilidade: nome, e-mail, telefone (opcional), assunto, mensagem, datas da estadia e número de hóspedes.
      </p>
      <h2>Como utilizamos os dados</h2>
      <ul>
        <li>Responder às suas mensagens e solicitações;</li>
        <li>Informar disponibilidade, tarifas e condições de hospedagem;</li>
        <li>Dar andamento a reservas solicitadas por você.</li>
      </ul>
      <p>Não vendemos nem compartilhamos seus dados para fins de marketing de terceiros.</p>
      <h2>Serviços de terceiros</h2>
      <p>
        Alguns recursos direcionam você para serviços externos, que possuem políticas próprias: WhatsApp (envio de
        mensagens), Booking.com (consulta de tarifas e reservas), Google Maps (mapa e rotas), Instagram e Tripadvisor.
        O mapa do Google só é carregado quando você clica em “Carregar mapa interativo”.
      </p>
      <h2>Cookies</h2>
      <p>
        Este site não utiliza cookies próprios de rastreamento ou publicidade. Serviços de terceiros acessados a partir
        do site, como o mapa do Google, podem utilizar cookies conforme as suas respectivas políticas.
      </p>
      <h2>Seus direitos</h2>
      <p>
        Você pode solicitar a confirmação, o acesso, a correção ou a exclusão dos seus dados pessoais a qualquer momento,
        entrando em contato {contactLine}.
      </p>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout title="Termos de Uso" crumb="Termos de uso">
      <p>
        Ao acessar este site, você concorda com os termos abaixo. Caso não concorde, recomendamos não utilizar o site.
      </p>
      <h2>Informações e tarifas</h2>
      <p>
        As informações sobre acomodações, serviços e valores têm caráter informativo. Os preços exibidos são valores
        de referência e podem variar conforme a data, a ocupação e a disponibilidade. As condições definitivas são as
        apresentadas no momento da confirmação da reserva.
      </p>
      <h2>Reservas</h2>
      <p>
        Reservas feitas por plataformas parceiras (como o Booking.com) seguem os termos e as políticas de cancelamento
        da plataforma e da tarifa escolhida. Reservas diretas são confirmadas pela recepção do hotel.
      </p>
      <h2>Imagens e conteúdo</h2>
      <p>
        Os textos, imagens e elementos visuais deste site pertencem ao {hotel.name} ou são utilizados com autorização,
        não sendo permitida a sua reprodução sem consentimento.
      </p>
      <h2>Links externos</h2>
      <p>O site contém links para serviços de terceiros, pelos quais o hotel não se responsabiliza.</p>
      <h2>Contato</h2>
      <p>
        Dúvidas sobre estes termos podem ser enviadas {contactLine}. Consulte também a nossa{' '}
        <Link to="/politica-de-privacidade" className="text-gold-dark underline">
          Política de Privacidade
        </Link>
        .
      </p>
    </LegalLayout>
  );
}
