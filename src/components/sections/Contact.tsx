import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router';
import { CheckCircle2, Clock, Instagram, Loader2, Mail, MapPin, Phone, Send, XCircle } from 'lucide-react';
import { fullAddress, hotel } from '@/data/hotel';
import { cn } from '@/lib/utils';
import {
  contactChannel,
  contactSubjects,
  contactWhatsappUrl,
  maskPhone,
  sendContactToEndpoint,
  validateContact,
  type ContactErrors,
  type ContactMessage,
} from '@/services/contact';
import { whatsappUrl } from '@/services/whatsapp';
import { Button } from '@/components/ui/Button';
import { Field, fieldAria } from '@/components/ui/Field';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Status = 'idle' | 'loading' | 'success' | 'error';

const empty: ContactMessage = { name: '', email: '', phone: '', subject: '', message: '' };

function ContactItem({
  icon,
  label,
  children,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-dark transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.65rem] font-semibold tracking-[0.2em] text-stone uppercase">{label}</span>
        <span className="mt-0.5 block text-[0.98rem] font-medium break-words text-ink">{children}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          className="group flex items-center gap-4"
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-4">{content}</div>
      )}
    </li>
  );
}

export function Contact() {
  const [data, setData] = useState<ContactMessage>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [honeypot, setHoneypot] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const wa = whatsappUrl();

  const update = (field: keyof ContactMessage) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = field === 'phone' ? maskPhone(e.target.value) : e.target.value;
    const next = { ...data, [field]: value };
    setData(next);
    if (submitted) setErrors(validateContact(next));
    if (status === 'error' || status === 'success') setStatus('idle');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validateContact(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#contato-${first}`)?.focus();
      return;
    }
    if (honeypot) return; // bot

    if (contactChannel === 'whatsapp') {
      const url = contactWhatsappUrl(data);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      setStatus('success');
      setData(empty);
      setSubmitted(false);
      return;
    }

    setStatus('loading');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      await sendContactToEndpoint(data, controller.signal);
      setStatus('success');
      setData(empty);
      setSubmitted(false);
    } catch {
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const loading = status === 'loading';

  return (
    <section id="contato" aria-labelledby="contato-title" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Contato"
            id="contato-title"
            title={
              <>
                Fale com a <em className="text-gold-dark">nossa equipe</em>
              </>
            }
            description="Tire dúvidas, consulte tarifas ou faça sua reserva diretamente com a recepção."
          />

          <ul className="mt-10 space-y-6" data-reveal>
            <ContactItem icon={<Phone className="h-5 w-5" aria-hidden="true" />} label="Telefone" href={`tel:${hotel.contact.phoneE164}`}>
              {hotel.contact.phoneDisplay}
            </ContactItem>
            {wa && (
              <ContactItem icon={<WhatsAppIcon className="h-5 w-5" />} label="WhatsApp" href={wa}>
                {hotel.contact.phoneDisplay}
              </ContactItem>
            )}
            {hotel.contact.email && (
              <ContactItem icon={<Mail className="h-5 w-5" aria-hidden="true" />} label="E-mail" href={`mailto:${hotel.contact.email}`}>
                {hotel.contact.email}
              </ContactItem>
            )}
            <ContactItem icon={<MapPin className="h-5 w-5" aria-hidden="true" />} label="Endereço" href={hotel.links.googleMaps}>
              {fullAddress}
            </ContactItem>
            <ContactItem icon={<Instagram className="h-5 w-5" aria-hidden="true" />} label="Instagram" href={hotel.social.instagram.url}>
              {hotel.social.instagram.handle}
            </ContactItem>
            <ContactItem icon={<Clock className="h-5 w-5" aria-hidden="true" />} label="Atendimento">
              {hotel.contact.serviceHours}
            </ContactItem>
          </ul>
        </div>

        <div className="lg:col-span-7" data-reveal>
          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            aria-labelledby="contato-form-title"
            className="relative rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft sm:p-10"
          >
            <h3 id="contato-form-title" className="text-3xl text-ink">
              Envie uma mensagem
            </h3>
            <p className="mt-2 text-sm text-muted">
              {contactChannel === 'whatsapp'
                ? 'Ao enviar, abriremos o WhatsApp da recepção com a sua mensagem pronta.'
                : 'Responderemos o mais breve possível.'}
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field id="contato-name" label="Nome" error={errors.name}>
                <input type="text" autoComplete="name" className="field-input" value={data.name} onChange={update('name')} maxLength={120} {...fieldAria('contato-name', errors.name)} />
              </Field>
              <Field id="contato-email" label="E-mail" error={errors.email}>
                <input type="email" autoComplete="email" inputMode="email" className="field-input" value={data.email} onChange={update('email')} maxLength={160} {...fieldAria('contato-email', errors.email)} />
              </Field>
              <Field id="contato-phone" label="Telefone" optional error={errors.phone}>
                <input type="tel" autoComplete="tel" inputMode="tel" placeholder="(38) 90000-0000" className="field-input" value={data.phone} onChange={update('phone')} {...fieldAria('contato-phone', errors.phone)} />
              </Field>
              <Field id="contato-subject" label="Assunto" error={errors.subject}>
                <select className="field-input" value={data.subject} onChange={update('subject')} {...fieldAria('contato-subject', errors.subject)}>
                  <option value="" disabled>
                    Selecione
                  </option>
                  {contactSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="contato-message" label="Mensagem" error={errors.message} className="sm:col-span-2">
                <textarea rows={5} className="field-input resize-y" value={data.message} onChange={update('message')} maxLength={2000} {...fieldAria('contato-message', errors.message)} />
              </Field>
              {/* Campo anti-spam invisível */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="contato-website">Website</label>
                <input id="contato-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-stone">
                Ao enviar, você concorda com a nossa{' '}
                <Link to="/politica-de-privacidade" className="underline underline-offset-2 hover:text-gold-dark">
                  Política de Privacidade
                </Link>
                .
              </p>
              <Button type="submit" variant="dark" size="lg" disabled={loading || contactChannel === 'none'} aria-busy={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                {loading ? 'Enviando…' : 'Enviar mensagem'}
              </Button>
            </div>

            <div aria-live="polite" className="empty:hidden">
              {status === 'success' && (
                <p className={cn('mt-6 flex animate-scale-in items-start gap-3 rounded-lg bg-success/10 p-4 text-sm text-success')}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  {contactChannel === 'whatsapp'
                    ? 'Tudo pronto! Abrimos o WhatsApp com a sua mensagem — é só tocar em enviar. Se a janela não abriu, verifique o bloqueador de pop-ups.'
                    : 'Mensagem enviada com sucesso! Em breve entraremos em contato.'}
                </p>
              )}
              {status === 'error' && (
                <p className="mt-6 flex animate-scale-in items-start gap-3 rounded-lg bg-danger/10 p-4 text-sm text-danger" role="alert">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  Não foi possível enviar sua mensagem agora. Tente novamente ou fale conosco pelo telefone {hotel.contact.phoneDisplay}.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
