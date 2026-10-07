import { ButtonLink } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';

export default function NotFoundPage() {
  return (
    <PageHero
      eyebrow="Erro 404"
      title="Página não encontrada"
      description="A página que você procura não existe ou foi movida. Que tal voltar ao início ou conhecer nossas acomodações?"
    >
      <div className="mt-10 flex flex-col gap-3 pb-10 sm:flex-row">
        <ButtonLink to="/">Voltar ao início</ButtonLink>
        <ButtonLink to="/acomodacoes" variant="outline-light">
          Ver acomodações
        </ButtonLink>
      </div>
    </PageHero>
  );
}
