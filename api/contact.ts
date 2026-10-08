/**
 * Função da Vercel que recebe o formulário de contato e envia por e-mail (Resend).
 *
 * Variáveis de ambiente (Vercel → Settings → Environment Variables), nunca no código:
 *   RESEND_API_KEY      chave da API do Resend (resend.com)
 *   CONTACT_TO_EMAIL    e-mail do hotel que recebe as mensagens
 *   CONTACT_FROM_EMAIL  remetente (opcional; exige domínio verificado no Resend)
 *
 * No site, ative com VITE_CONTACT_ENDPOINT=/api/contact.
 */

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string; // campo anti-spam: deve chegar vazio
}

const LIMITS: Record<keyof ContactPayload, number> = {
  name: 120,
  email: 160,
  phone: 30,
  subject: 80,
  message: 2000,
  website: 200,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function parse(body: unknown): ContactPayload | null {
  if (!body || typeof body !== 'object') return null;
  const data = body as Record<string, unknown>;
  const out = {} as ContactPayload;
  for (const key of Object.keys(LIMITS) as (keyof ContactPayload)[]) {
    const value = data[key] ?? '';
    if (typeof value !== 'string' || value.length > LIMITS[key]) return null;
    out[key] = value.trim();
  }
  if (out.name.length < 2 || !EMAIL_RE.test(out.email) || !out.subject || out.message.length < 10) return null;
  return out;
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return json({ error: 'not_configured' }, 503);

  // Aceita apenas envios feitos a partir do próprio site.
  const origin = request.headers.get('origin');
  if (origin && hostOf(origin) !== hostOf(request.url)) return json({ error: 'forbidden' }, 403);

  let payload: ContactPayload | null = null;
  try {
    payload = parse(await request.json());
  } catch {
    payload = null;
  }
  if (!payload) return json({ error: 'invalid' }, 400);
  if (payload.website) return json({ ok: true }); // robô: finge sucesso e descarta

  const text = [
    `Nome: ${payload.name}`,
    `E-mail: ${payload.email}`,
    ...(payload.phone ? [`Telefone: ${payload.phone}`] : []),
    `Assunto: ${payload.subject}`,
    '',
    payload.message,
    '',
    '— Enviado pelo formulário de contato do site do Hotel Premier Janaúba',
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'Site Hotel Premier <onboarding@resend.dev>',
      to: [to],
      reply_to: payload.email,
      subject: `[Site] ${payload.subject} — ${payload.name}`,
      text,
    }),
  });

  if (!response.ok) return json({ error: 'send_failed' }, 502);
  return json({ ok: true });
}
