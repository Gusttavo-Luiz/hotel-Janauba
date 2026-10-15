# GLPI + Tess AI — primeiro atendimento dos chamados

Script que faz a **primeira interação** com cada chamado aberto no GLPI usando um agente da [Tess AI](https://tess.im):

1. busca os chamados com status **Novo** abertos nas últimas 24 horas (configurável);
2. envia título, categoria, urgência e descrição para o agente da Tess;
3. publica a resposta como **acompanhamento** no chamado, com uma assinatura avisando que é uma resposta automática.

Cada chamado é respondido uma vez só: o acompanhamento leva a marca `[Assistente virtual]` e chamados que já a têm são pulados. O status do chamado não muda, então ele continua na fila dos técnicos como "Novo".

Não precisa instalar nada além do Node 20 ou mais recente (sem dependências). Funciona com GLPI 9.5, 10 e 11 pela API REST (`apirest.php`).

## 1. Preparar o GLPI

1. **Configurar → Geral → API**: ative **Habilitar API REST** e **Habilitar login com token externo**.
2. Na mesma tela, em **Clientes da API**, crie um cliente (ou edite o existente) liberando o IP de onde o script vai rodar. Se quiser exigir um token do cliente, copie o **App-Token** gerado (`GLPI_APP_TOKEN`).
   - Se o script rodar pelo GitHub Actions, o IP muda a cada execução: deixe o intervalo de IP vazio e use o App-Token.
3. Crie um usuário para o assistente (por exemplo, "Assistente Virtual"), com um perfil que possa **ver todos os chamados** da entidade e **adicionar acompanhamentos**. As respostas aparecem no nome dele.
4. Entre com esse usuário, abra **Preferências → Chaves de acesso remoto → Token de API**, marque **Regenerar** e salve. Esse é o `GLPI_USER_TOKEN`.

O endereço da API é o do GLPI com `/apirest.php` no fim, por exemplo `https://glpi.suaempresa.com.br/apirest.php`.

## 2. Preparar a Tess

1. Crie um **agente de chat** na Tess. Nas instruções do agente você pode colocar o tom de voz, as orientações do suporte e a base de conhecimento (manuais, perguntas frequentes) — quanto mais contexto, melhores as respostas.
2. Copie o **ID do agente** (o número na URL da página do agente) → `TESS_AGENT_ID`.
3. Em **Configurações → API** (ou **API Keys**), gere uma chave → `TESS_API_KEY`.

O script já manda junto com cada chamado instruções padrão de primeiro atendimento (confirmar o recebimento, pedir as informações que faltam, sugerir até 3 passos simples, não pedir senhas nem prometer prazos). Para trocar, defina `TESS_INSTRUCOES`.

Se a API da Tess recusar a chamada pedindo `model` ou `temperature`, preencha `TESS_MODEL` (o modelo configurado no agente) e `TESS_TEMPERATURE` (por exemplo, `0.3`).

## 3. Testar

```bash
cd integracoes/glpi-tess
cp .env.example .env          # preencha os tokens
node --env-file=.env index.mjs --chamado 123 --dry-run   # mostra a resposta para o chamado 123 sem publicar
node --env-file=.env index.mjs --dry-run                 # mostra o que faria com os chamados novos
```

Para um teste real sem que os usuários vejam, use `ACOMPANHAMENTO_PRIVADO=true`: a resposta entra como acompanhamento privado, visível só para os técnicos. Quando a qualidade estiver boa, volte para `false`.

## 4. Deixar rodando

Escolha **uma** das opções.

### Opção A — GitHub Actions (sem servidor, GLPI acessível pela internet)

O workflow [`.github/workflows/glpi-tess.yml`](../../.github/workflows/glpi-tess.yml) roda o script a cada 5 minutos. Ele fica desligado até você configurar, no GitHub, em **Settings → Secrets and variables → Actions**:

| Aba | Nome | Valor |
| --- | --- | --- |
| Secrets | `GLPI_USER_TOKEN` | token do usuário do assistente |
| Secrets | `GLPI_APP_TOKEN` | App-Token do cliente da API (se usar) |
| Secrets | `TESS_API_KEY` | chave da API da Tess |
| Variables | `GLPI_API_URL` | `https://…/apirest.php` (é o que liga o workflow) |
| Variables | `TESS_AGENT_ID` | ID do agente |
| Variables (opcional) | `TESS_MODEL`, `TESS_TEMPERATURE`, `TESS_INSTRUCOES`, `JANELA_HORAS`, `ACOMPANHAMENTO_PRIVADO`, `DRY_RUN` | como no `.env.example` |

Para testar, abra **Actions → GLPI + Tess → Run workflow**, informe o ID de um chamado e marque **Simulação**.

Observações: o agendamento só vale depois que o workflow estiver na branch `main`; o GitHub pode atrasar execuções agendadas em alguns minutos nos horários de pico e pausa os agendamentos de repositórios sem nenhum commit por 60 dias (basta reativar em **Actions**).

### Opção B — no próprio servidor do GLPI (GLPI só na rede interna)

Copie a pasta `integracoes/glpi-tess` para o servidor, crie o `.env` e agende no cron (`crontab -e`), a cada 2 minutos:

```cron
*/2 * * * * cd /opt/glpi-tess && /usr/bin/node --env-file=.env index.mjs >> /var/log/glpi-tess.log 2>&1
```

No Windows, crie uma tarefa no **Agendador de Tarefas** que execute `node --env-file=.env index.mjs` na pasta do script, repetindo a cada 2 minutos.

## Variáveis

Todas estão descritas no [`.env.example`](.env.example). As obrigatórias são `GLPI_API_URL`, `GLPI_USER_TOKEN`, `TESS_API_KEY` e `TESS_AGENT_ID`.

## Cuidados

- O texto do chamado é enviado para a Tess. Avalie se isso está de acordo com a política de privacidade da empresa (LGPD), principalmente se os chamados tiverem dados pessoais de hóspedes.
- Não altere `TESS_MARCA` depois de começar a usar: é por ela que o script sabe quais chamados já foram respondidos.
- Cada chamado respondido consome créditos da Tess. `MAX_CHAMADOS_POR_EXECUCAO` limita quantos são processados por vez.
