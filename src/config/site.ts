/**
 * Configurações de ambiente. Valores vêm de variáveis VITE_* (ver .env.example).
 * Atenção: tudo que começa com VITE_ é público no navegador — nunca use
 * para senhas, tokens ou chaves privadas.
 */
const env = import.meta.env;

const trimSlash = (value: string) => value.replace(/\/+$/, '');

export const siteConfig = {
  /** URL pública do site. Vazio enquanto o domínio não estiver definido. */
  url: trimSlash((env.VITE_SITE_URL as string | undefined) ?? ''),
  /** Endpoint opcional do formulário de contato. */
  contactEndpoint: (env.VITE_CONTACT_ENDPOINT as string | undefined) ?? '',
  /** Código de verificação do Google Search Console (método "Tag HTML"). */
  googleSiteVerification: (env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined) ?? '',
  locale: 'pt_BR',
  /**
   * Exibe os espaços reservados para fotos ainda não enviadas, com rótulo.
   * Ligado em desenvolvimento; no site publicado, só com VITE_SHOW_PLACEHOLDERS=true.
   */
  showPlaceholderLabels: Boolean(env.DEV) || env.VITE_SHOW_PLACEHOLDERS === 'true',
} as const;

export const absoluteUrl = (path = '/') => (siteConfig.url ? `${siteConfig.url}${path}` : '');
