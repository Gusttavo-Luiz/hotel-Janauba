#!/usr/bin/env node
// Primeiro atendimento automático dos chamados do GLPI com um agente da Tess AI.
//
// A cada execução: busca os chamados com status "Novo" abertos nas últimas horas,
// envia título e descrição para o agente da Tess e publica a resposta como
// acompanhamento no chamado. Cada chamado é respondido uma única vez: o
// acompanhamento leva uma marca (TESS_MARCA) e chamados que já a têm são pulados.
//
// Uso:
//   node --env-file=.env index.mjs                     # processa os chamados novos
//   node --env-file=.env index.mjs --dry-run           # mostra a resposta sem publicar
//   node --env-file=.env index.mjs --chamado 123       # processa só o chamado 123
//
// Sem dependências: precisa apenas do Node 20 ou mais recente.

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run') || env('DRY_RUN', '') === 'true';
const CHAMADO_UNICO = valorDoArgumento('--chamado');
if (CHAMADO_UNICO !== undefined && !/^\d+$/.test(CHAMADO_UNICO)) {
  console.error(`--chamado precisa de um número (recebido: ${CHAMADO_UNICO ?? 'nada'}).`);
  process.exit(1);
}

const config = {
  glpiUrl: env('GLPI_API_URL').replace(/\/+$/, ''),
  glpiAppToken: env('GLPI_APP_TOKEN', ''),
  glpiUserToken: env('GLPI_USER_TOKEN'),
  tessUrl: env('TESS_API_URL', 'https://tess.pareto.io/api').replace(/\/+$/, ''),
  tessApiKey: env('TESS_API_KEY'),
  tessAgentId: env('TESS_AGENT_ID'),
  tessModel: env('TESS_MODEL', ''),
  tessTemperature: env('TESS_TEMPERATURE', ''),
  tessTools: env('TESS_TOOLS', 'no-tools'),
  tessInstrucoes: env('TESS_INSTRUCOES', INSTRUCOES_PADRAO()),
  janelaHoras: Number(env('JANELA_HORAS', '24')),
  maxPorExecucao: Number(env('MAX_CHAMADOS_POR_EXECUCAO', '10')),
  acompanhamentoPrivado: env('ACOMPANHAMENTO_PRIVADO', 'false') === 'true',
  marca: env('TESS_MARCA', '[Assistente virtual]'),
  assinatura: env(
    'TESS_ASSINATURA',
    'Esta é uma resposta automática do nosso assistente virtual. Um técnico vai dar continuidade ao seu chamado.',
  ),
};

const STATUS_NOVO = 1;
// Opções de pesquisa do GLPI (Configurar → Pesquisa): 2 = ID, 12 = status, 15 = data de abertura.
const CAMPO_ID = 2;
const CAMPO_STATUS = 12;
const CAMPO_DATA_ABERTURA = 15;

const URGENCIAS = { 1: 'Muito baixa', 2: 'Baixa', 3: 'Média', 4: 'Alta', 5: 'Muito alta' };

// Status de uma execução de agente na Tess.
const STATUS_EM_ANDAMENTO = new Set(['starting', 'pending', 'queued', 'running', 'processing']);
const STATUS_FALHA = new Set(['failed', 'error', 'canceled', 'cancelled']);

await main().catch((erro) => {
  console.error(`Falha: ${erro.message}`);
  process.exitCode = 1;
});

async function main() {
  const sessao = await iniciarSessaoGlpi();
  let falhas = 0;
  try {
    const ids = CHAMADO_UNICO ? [Number(CHAMADO_UNICO)] : await buscarChamadosNovos(sessao);
    console.log(`${ids.length} chamado(s) para verificar${DRY_RUN ? ' (simulação, nada será publicado)' : ''}.`);

    for (const id of ids) {
      try {
        await atenderChamado(sessao, id);
      } catch (erro) {
        falhas++;
        console.error(`Chamado #${id}: ${erro.message}`);
      }
    }
  } finally {
    await glpi(sessao, 'GET', '/killSession').catch(() => {});
  }
  if (falhas > 0) process.exitCode = 1;
}

async function atenderChamado(sessao, id) {
  const acompanhamentos = await glpi(sessao, 'GET', `/Ticket/${id}/ITILFollowup`);
  if (Array.isArray(acompanhamentos) && acompanhamentos.some((a) => String(a.content ?? '').includes(config.marca))) {
    console.log(`Chamado #${id}: já respondido pela Tess, pulando.`);
    return;
  }

  const chamado = await glpi(sessao, 'GET', `/Ticket/${id}?expand_dropdowns=true`);
  const resposta = await perguntarTess(montarPergunta(chamado));
  if (!resposta.trim()) throw new Error('a Tess devolveu uma resposta vazia');

  const conteudo = `${textoParaHtml(resposta)}<p><em>${escaparHtml(config.marca)} ${escaparHtml(config.assinatura)}</em></p>`;

  if (DRY_RUN) {
    console.log(`Chamado #${id} — ${chamado.name}\n--- resposta da Tess ---\n${resposta}\n------------------------`);
    return;
  }

  await glpi(sessao, 'POST', '/ITILFollowup', {
    input: {
      itemtype: 'Ticket',
      items_id: id,
      content: conteudo,
      is_private: config.acompanhamentoPrivado ? 1 : 0,
    },
  });
  console.log(`Chamado #${id}: resposta publicada.`);
}

function montarPergunta(chamado) {
  const linhas = [
    config.tessInstrucoes,
    '',
    `Chamado #${chamado.id}`,
    `Título: ${htmlParaTexto(chamado.name)}`,
  ];
  if (chamado.itilcategories_id && String(chamado.itilcategories_id) !== '0') {
    linhas.push(`Categoria: ${htmlParaTexto(String(chamado.itilcategories_id))}`);
  }
  if (URGENCIAS[chamado.urgency]) linhas.push(`Urgência: ${URGENCIAS[chamado.urgency]}`);
  linhas.push('', 'Descrição enviada pelo usuário:', htmlParaTexto(chamado.content) || '(sem descrição)');
  return linhas.join('\n');
}

// ---------------------------------------------------------------- GLPI

async function iniciarSessaoGlpi() {
  const resposta = await fetch(`${config.glpiUrl}/initSession`, {
    headers: cabecalhosGlpi({ Authorization: `user_token ${config.glpiUserToken}` }),
  });
  const corpo = await lerCorpo(resposta);
  if (!resposta.ok || !corpo?.session_token) {
    throw new Error(`não foi possível entrar na API do GLPI (HTTP ${resposta.status}): ${resumo(corpo)}`);
  }
  return corpo.session_token;
}

async function buscarChamadosNovos(sessao) {
  const params = new URLSearchParams({
    'criteria[0][field]': String(CAMPO_STATUS),
    'criteria[0][searchtype]': 'equals',
    'criteria[0][value]': String(STATUS_NOVO),
    'criteria[1][link]': 'AND',
    'criteria[1][field]': String(CAMPO_DATA_ABERTURA),
    'criteria[1][searchtype]': 'morethan',
    // Data relativa ("-24HOUR") para usar o fuso do próprio servidor do GLPI.
    'criteria[1][value]': `-${config.janelaHoras}HOUR`,
    'forcedisplay[0]': String(CAMPO_ID),
    sort: String(CAMPO_ID),
    order: 'ASC',
    range: `0-${Math.max(config.maxPorExecucao, 1) - 1}`,
  });
  const resultado = await glpi(sessao, 'GET', `/search/Ticket?${params}`);
  return (resultado?.data ?? []).map((linha) => Number(linha[CAMPO_ID])).filter(Boolean);
}

async function glpi(sessao, metodo, caminho, corpo) {
  const resposta = await fetch(`${config.glpiUrl}${caminho}`, {
    method: metodo,
    headers: cabecalhosGlpi({
      'Session-Token': sessao,
      ...(corpo ? { 'Content-Type': 'application/json' } : {}),
    }),
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const dados = await lerCorpo(resposta);
  if (!resposta.ok) throw new Error(`GLPI ${metodo} ${caminho.split('?')[0]} → HTTP ${resposta.status}: ${resumo(dados)}`);
  return dados;
}

function cabecalhosGlpi(extras) {
  return { ...(config.glpiAppToken ? { 'App-Token': config.glpiAppToken } : {}), ...extras };
}

// ---------------------------------------------------------------- Tess

async function perguntarTess(pergunta) {
  const corpo = {
    messages: [{ role: 'user', content: pergunta }],
    tools: config.tessTools,
    wait_execution: true,
  };
  if (config.tessModel) corpo.model = config.tessModel;
  if (config.tessTemperature) corpo.temperature = config.tessTemperature;

  let execucao = await tess('POST', `/agents/${config.tessAgentId}/execute`, corpo);
  execucao = execucao?.responses?.[0] ?? execucao;

  // Se a Tess não esperou a execução terminar, consulta o resultado até ficar pronto.
  const limite = Date.now() + 120_000;
  while (!concluida(execucao) && execucao?.id && Date.now() < limite) {
    await new Promise((r) => setTimeout(r, 3000));
    execucao = await tess('GET', `/agent-responses/${execucao.id}`);
  }

  if (STATUS_FALHA.has(execucao?.status)) throw new Error(`a execução da Tess falhou: ${resumo(execucao.error ?? execucao)}`);
  if (!concluida(execucao)) throw new Error('a Tess não respondeu em 2 minutos');
  return String(execucao.output);
}

function concluida(execucao) {
  const status = execucao?.status;
  return execucao?.output != null && !STATUS_EM_ANDAMENTO.has(status) && !STATUS_FALHA.has(status);
}

async function tess(metodo, caminho, corpo) {
  const resposta = await fetch(`${config.tessUrl}${caminho}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${config.tessApiKey}`,
      Accept: 'application/json',
      ...(corpo ? { 'Content-Type': 'application/json' } : {}),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const dados = await lerCorpo(resposta);
  if (!resposta.ok) throw new Error(`Tess ${metodo} ${caminho} → HTTP ${resposta.status}: ${resumo(dados)}`);
  return dados;
}

// ---------------------------------------------------------------- utilitários

function env(nome, padrao) {
  const valor = process.env[nome]?.trim();
  if (valor) return valor;
  if (padrao === undefined) {
    console.error(`Variável de ambiente obrigatória ausente: ${nome} (veja o .env.example).`);
    process.exit(1);
  }
  return padrao;
}

function valorDoArgumento(nome) {
  const i = args.indexOf(nome);
  return i >= 0 ? args[i + 1] : undefined;
}

async function lerCorpo(resposta) {
  const texto = await resposta.text();
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

function resumo(dados) {
  const texto = typeof dados === 'string' ? dados : JSON.stringify(dados);
  return texto.length > 300 ? `${texto.slice(0, 300)}…` : texto;
}

// O GLPI 10 devolve o HTML da descrição codificado (&lt;p&gt;...); o 11 devolve HTML puro.
function htmlParaTexto(valor) {
  if (!valor) return '';
  const html = decodificarEntidades(String(valor));
  return decodificarEntidades(
    html
      .replace(/<(br|\/p|\/div|\/li|\/h\d)\s*\/?>/gi, '\n')
      .replace(/<li[^>]*>/gi, '- ')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/ /g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function decodificarEntidades(texto) {
  const nomes = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return texto.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (inteira, ent) => {
    if (ent[0] === '#') {
      const codigo = ent[1].toLowerCase() === 'x' ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
      return Number.isFinite(codigo) ? String.fromCodePoint(codigo) : inteira;
    }
    return nomes[ent.toLowerCase()] ?? inteira;
  });
}

function escaparHtml(texto) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Converte a resposta da Tess (texto com um pouco de Markdown) em HTML simples para o GLPI.
function textoParaHtml(texto) {
  return texto
    .trim()
    .split(/\n{2,}/)
    .map((paragrafo) => {
      const html = escaparHtml(paragrafo)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\n/g, '<br>');
      return `<p>${html}</p>`;
    })
    .join('');
}

function INSTRUCOES_PADRAO() {
  return [
    'Você faz o primeiro atendimento dos chamados de suporte abertos no GLPI.',
    'Escreva a resposta que será enviada ao usuário que abriu o chamado, em português do Brasil, com tom cordial e objetivo:',
    '- confirme que o chamado foi recebido e resuma o problema em uma frase;',
    '- se faltar informação para o técnico (equipamento, local, mensagem de erro, desde quando acontece), peça em uma lista curta;',
    '- se houver, sugira até 3 passos simples e seguros que o próprio usuário pode tentar;',
    '- não prometa prazos, não peça senhas e não invente informações sobre o ambiente.',
    'Responda apenas com o texto da mensagem, sem assinatura.',
  ].join('\n');
}
