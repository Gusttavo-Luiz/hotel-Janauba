import { siteConfig } from '@/config/site';
import { hotel } from '@/data/hotel';
import { whatsappUrl } from './whatsapp';

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactMessage, string>>;

export const contactSubjects = [
  'Reservas',
  'Informações sobre o hotel',
  'Hospedagem com pet',
  'Outros assuntos',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(data: ContactMessage): ContactErrors {
  const errors: ContactErrors = {};
  if (data.name.trim().length < 2) errors.name = 'Informe seu nome.';
  if (!data.email.trim()) errors.email = 'Informe seu e-mail.';
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = 'Informe um e-mail válido.';
  const digits = data.phone.replace(/\D/g, '');
  if (digits && (digits.length < 10 || digits.length > 13)) errors.phone = 'Informe um telefone válido com DDD.';
  if (!data.subject) errors.subject = 'Selecione um assunto.';
  if (data.message.trim().length < 10) errors.message = 'Escreva uma mensagem com pelo menos 10 caracteres.';
  else if (data.message.length > 2000) errors.message = 'A mensagem deve ter no máximo 2.000 caracteres.';
  return errors;
}

/** Máscara simples para telefones brasileiros. */
export function maskPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Canal de envio: endpoint configurado (backend) ou WhatsApp da recepção. */
export const contactChannel: 'endpoint' | 'whatsapp' | 'none' = siteConfig.contactEndpoint
  ? 'endpoint'
  : hotel.contact.whatsapp
    ? 'whatsapp'
    : 'none';

export function contactWhatsappUrl(data: ContactMessage) {
  const text = [
    `Olá! Meu nome é ${data.name.trim()}.`,
    `Assunto: ${data.subject}`,
    '',
    data.message.trim(),
    '',
    `E-mail: ${data.email.trim()}`,
    ...(data.phone ? [`Telefone: ${data.phone}`] : []),
  ].join('\n');
  return whatsappUrl(text);
}

export async function sendContactToEndpoint(data: ContactMessage, signal?: AbortSignal) {
  const response = await fetch(siteConfig.contactEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...data, source: 'site', hotel: hotel.name }),
    signal,
  });
  if (!response.ok) throw new Error(`Falha no envio (${response.status})`);
}
