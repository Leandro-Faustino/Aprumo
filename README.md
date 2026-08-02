# Aprumo — Diagnóstico de 90 dias

Diagnóstico financeiro white-label para contadores. O contador cria uma conta,
configura a marca e recebe um link próprio. O cliente final abre esse link,
informa três números do último mês e vê na hora o resultado e uma pergunta
final — nunca uma recomendação. O contato volta pelo WhatsApp.

Implementa os requisitos v0.4 (RF-09 revisado, seções 4.5 a 4.7).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma 7 ·
Supabase (Postgres + Auth) · Vitest

## Rotas

| Rota | Acesso | O que é |
|---|---|---|
| `/` | Pública | Landing page comercial — público: o **contador** |
| `/meu-escritorio` | Pública | Degrau 0: o contador roda o instrumento no próprio escritório |
| `/entrar` | Pública | Login por link mágico (sem senha) |
| `/auth/confirmar` | Pública | Troca o token do e-mail por sessão |
| `/painel` | **Autenticada** | Configuração da marca do contador (RF-30) |
| `/painel/placar` | **Autenticada** | Anotações do contador sobre a própria carteira |
| `/d/<slug>` | Pública | A página de diagnóstico — público: o **empresário** |

As duas páginas públicas obedecem a regras opostas e não devem ser misturadas.
A `/` é camada comercial: headline, garantias, preço, CTA de venda. A `/d/<slug>`
é o produto: sem headline, sem prova social, sem CTA de venda, marca do
escritório em cima e a nossa no rodapé. A landing page está estruturada em
`src/components/lp/`, e tudo que depende das dez entrevistas de descoberta ou de
verificação externa está centralizado em `src/lib/lp.ts` — enquanto for `null`,
aparece na tela como pendência visível, de propósito.

## A decisão de arquitetura que explica o resto

**RNF-05 e RF-23 proíbem que dado financeiro trafegue ou seja armazenado.**
Supabase e Prisma, então, não tocam em dado financeiro em momento algum — eles
guardam apenas o bloco de marca do contador (RF-30): nome, CRC, cor, logo,
WhatsApp, rodapé.

O diagnóstico inteiro (RF-05, RF-06, RF-09) é calculado no navegador, em
`src/lib/diagnostico/`, um módulo puro e sem I/O. Não existe caminho de código de
lá até uma chamada de rede, e não há rota de API, server action ou tabela que
receba os valores. É essa separação que faz a promessa "seus números ficam neste
navegador" ser verificável no código, e não só uma frase na tela.

Três testes guardam isso:

- `whatsapp.test.ts` — a mensagem de handoff não carrega valor algum;
- o smoke test de browser — nenhuma requisição de rede leva os números digitados;
- **`privacidade.test.ts` — o build falha se o núcleo do diagnóstico ganhar
  qualquer primitiva de rede** (`fetch`, `sendBeacon`, `WebSocket`,
  `"use server"`, cliente Supabase, analytics).

O terceiro é o que importa a longo prazo. Uma garantia dessas raramente morre
por decisão deliberada de violá-la: morre num `fetch` de telemetria acrescentado
numa tarde, com boa intenção, por quem nunca leu este arquivo. A promessa deixa
de ser política e passa a ser barreira de CI — e a trava foi verificada
injetando uma violação de propósito e conferindo que ela acusa arquivo e linha.

Se esse teste falhar, a resposta quase nunca é adicionar exceção. É perguntar
por que dado financeiro precisa sair do dispositivo e, se precisar mesmo, mudar
a promessa pública **primeiro** — incluindo a frase na tela do cliente.

Autenticação não muda nada disso: ela protege a configuração de marca, não o
diagnóstico. A página `/d/<slug>` continua pública e anônima — é o produto.

## Onde cada coisa fica na escada de valor

O produto tem degraus, e saber disso muda o que se constrói agora.

| Degrau | O que é | Estado |
|---|---|---|
| **0** | O contador roda o instrumento no **próprio escritório** (`/meu-escritorio`) | ✅ construído |
| **1** | Pauta Técnica em 90 Dias: instrumento com a marca dele + Kit de Pauta | ✅ construído |
| **2** | Da pauta ao contrato: proposta, escopo e honorário | ⛔ não construir |
| **3** | Rotina gerida (a operação rodada pelo escritório) | ⛔ não construir |
| **4** | Escritório grande: painel, histórico comparado, PDF, multiusuário | ⛔ não construir |
| **5** | Licenciamento para redes e sistemas contábeis | ⛔ não construir |

**Painel, PDF e histórico não foram descartados — são o degrau 4.** Foram
cortados para escritório de 1 a 15 pessoas, onde custam caro e valem pouco. Para
um escritório de 40 pessoas com três sócios o valor inverte. A diferença entre
"cortado" e "degrau 4" é como se responde quando alguém pede na conversa de 30
minutos.

Isso **não** vai para a landing page: o documento de oferta proíbe prometer o
painel do contador, e a página lista "quem quer software com painel, dashboard e
integração" entre para quem o produto não é.

### A fronteira entre o kit e o degrau 2

Elas se confundem com facilidade, e confundir custa dinheiro nos dois sentidos —
ou o degrau 2 vai de graça dentro do degrau 1, ou o kit perde algo de que o
degrau 1 precisa.

- **Kit (degrau 1):** como conduzir a conversa. Mapa de contatos, mensagens,
  modo assistido, roteiro da reunião, calendário, placar.
- **Degrau 2:** como precificar e propor o serviço que nasce da conversa.
  Modelo de proposta, faixa de honorário, escopo.

Roteiro de conversa é degrau 1. Modelo de proposta é degrau 2.

### O degrau que a arquitetura fecha

Benchmark comparativo entre carteiras seria o degrau mais valioso e defensável
da escada — e o RNF-05 o proíbe. Isso é tradeoff assumido, não omissão.

A decisão registrada é **manter o bloqueio**, e ela não depende de ninguém
lembrar: `src/lib/diagnostico/privacidade.test.ts` falha o build se o núcleo do
diagnóstico ganhar qualquer primitiva de rede. Ver a seção seguinte.

## O placar não é um dashboard

`/painel/placar` parece um painel de acompanhamento e não é. **O produto não
sabe se alguém abriu o link ou preencheu o diagnóstico** — cada linha ali é
escrita à mão pelo contador, sobre contatos que já são dele. É o
`kit/placar.md` dentro do produto.

A distinção não é semântica. Um único campo alimentado pela página do empresário
transformaria a tabela em base de leads, exigiria telemetria e desmentiria a
frase exibida na própria tela do cliente: *"nada é enviado, salvo ou
compartilhado — nem com \<contador\>"*. Está escrito no schema, junto do modelo
`Envio`, para que a próxima pessoa que mexer ali saiba o que está em jogo.

Vale lembrar que o documento da oferta lista "quem quer software com painel,
dashboard e integração" entre **para quem o produto não é**. Um placar manual
cabe nesse posicionamento; um dashboard de rastreamento, não.

## Isolamento entre contadores

Um contador só alcança a própria empresa. Três camadas, em ordem de importância:

1. **O DAL (`src/lib/dal.ts`) é a autorização de verdade.** Nenhuma função dele
   aceita id de empresa vindo do cliente — o dono sai sempre da sessão verificada
   no servidor, e toda consulta filtra por `ownerId`. `salvarMinhaEmpresa` faz
   `upsert` pela condição do dono, então não existe caminho por onde uma escrita
   alcance a linha de outra pessoa.
2. **RLS no banco fecha a porta lateral.** O Supabase publica o schema `public`
   via PostgREST usando a chave anônima, que é pública por design — vai no bundle
   do navegador. Sem RLS, qualquer pessoa com essa chave leria a tabela direto,
   passando por cima da aplicação inteira. As políticas estão na migration
   inicial. O Prisma conecta com o papel dono da tabela e não é afetado por elas,
   que é por isso que a camada 1 continua sendo a principal.
3. **O `proxy.ts` é só conveniência.** Ele renova a sessão e desvia navegação,
   mas a própria documentação do Next diz que proxy não serve como autorização —
   e aqui ele nem consulta o banco. Se o proxy sumisse, `/painel` continuaria
   protegido pelo DAL. Isso está verificado: sem Supabase configurado o proxy sai
   na primeira linha, e `/painel` ainda assim redireciona para `/entrar`.

`sessaoAtual()` chama `connection()` para impedir que uma página protegida seja
pré-renderizada no build — sem isso, um build sem sessão congelaria a decisão de
autorização no HTML estático.

O login é por link mágico: não há senha armazenada, nem fluxo de recuperação.
A tela de login responde a mesma coisa para e-mail cadastrado e não cadastrado,
para não revelar quem tem conta.

## Rodando

```bash
npm install
cp .env.example .env    # nada obrigatório para começar
npm run dev
```

Sem Supabase configurado o produto sobe e a página de diagnóstico funciona
(`/d/<qualquer-slug>` cai no fallback das variáveis `NEXT_PUBLIC_MARCA_*`), mas
`/entrar` e `/painel` ficam indisponíveis — com aviso na tela, não com erro.

### Ligando o Supabase

**O projeto já existe e o schema já foi aplicado:** `aprumo`, ref
`rnbbbjozioxzpreylmle`, região `sa-east-1`. Falta apenas conectar a aplicação.

1. Em *Project Settings → API*, copie para o `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://rnbbbjozioxzpreylmle.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = a chave anon/publishable
2. Em *Project Settings → Database → Connection string → URI*, copie para
   `DATABASE_URL` (porta `6543`, do pooler, em serverless; `5432` para migrations).
   A senha do banco não é recuperável depois da criação — se não a tiver, use
   *Reset database password* na mesma tela.
3. Defina `NEXT_PUBLIC_SITE_URL` com a URL pública do site.
4. Em *Authentication → URL Configuration*, adicione
   `<SITE_URL>/auth/confirmar` às **Redirect URLs**. Sem isso o link do e-mail
   é recusado pelo Supabase.
5. Alinhe o histórico do Prisma com o banco.

   As **quatro** migrations já foram aplicadas fora do Prisma, então marque cada
   uma como aplicada em vez de rodá-las de novo — senão o Prisma tenta recriar
   objetos que já existem e falha:

```bash
npx prisma migrate resolve --applied 20260802000000_inicial
npx prisma migrate resolve --applied 20260802010000_storage_logos
npx prisma migrate resolve --applied 20260802020000_candidaturas
npx prisma migrate resolve --applied 20260802030000_envios

npm run db:seed        # opcional: duas empresas de exemplo
```

Confira com `npx prisma migrate status` — as quatro precisam aparecer como
aplicadas antes de qualquer `db:migrate` futuro.

Em um banco novo, do zero, o passo 5 inteiro vira `npm run db:migrate`.

A partir daí, cada contador que entra cria a própria empresa pelo `/painel` e
ganha sua página em `/d/<slug>`.

> **Atenção no deploy:** variáveis `NEXT_PUBLIC_*` são embutidas no bundle
> durante o build, não lidas em runtime. Um build feito sem elas gera uma
> aplicação em que o login nunca funciona, mesmo que a variável exista no
> servidor depois.

### Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | `prisma generate` + build de produção |
| `npm test` | Testes do núcleo, validação, placar e a trava de privacidade |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint, sem tolerar avisos |
| `npm run db:migrate` | Cria/aplica migration |
| `npm run db:seed` | Popula contadores de exemplo |

## Mapa dos requisitos

| Requisito | Onde |
|---|---|
| RF-05 — diferença | `src/lib/diagnostico/calculo.ts` |
| RF-06 — fôlego em dias | `src/lib/diagnostico/calculo.ts` |
| RF-07 — projeção de 90 dias (**proposto**) | `src/lib/diagnostico/projecao.ts` |
| RF-08 — tom não-acusatório | `ROTULO_CENARIO` em `cenario.ts` e textos da UI |
| RF-09 — CTA por cenário | `src/lib/diagnostico/cenario.ts` + `cenario.test.ts` |
| RF-21 — handoff WhatsApp | `src/lib/diagnostico/whatsapp.ts` |
| RF-23 / RNF-05 — nada trafega | núcleo puro; aviso em `prisma/schema.prisma` |
| RF-24/25/26 — roteiro de conversa | `kit/roteiro-de-conversa.md` (conteúdo, não software) |
| RF-30 — bloco único de marca | `/painel` + `src/lib/empresa.ts` + modelo `Contador` |
| Login e isolamento por conta | `src/lib/dal.ts`, `src/proxy.ts`, RLS na migration |
| RF-32 — degradação | `pagina-diagnostico.tsx` + testes em `whatsapp.test.ts` |

Os cinco casos da tabela do RF-09 estão em `cenario.test.ts` um a um, incluindo o
caso 5 (fôlego exatamente 30 **não** é urgente — o limite é `<`, não `<=`).

A regra de nomenclatura do RF-09 — nenhum CTA pode conter verbo imperativo de
ação financeira — é um teste automatizado, não um comentário. Um texto novo com
"reduza", "negocie" ou "controle" quebra a suíte.

## O que está verificado, e o que não está

### Verificado contra o Postgres real

Projeto `aprumo` (`rnbbbjozioxzpreylmle`, região `sa-east-1`).

A migration foi aplicada e **rodou limpa**: tabela criada, RLS ativo, 4
políticas. As políticas foram exercitadas assumindo cada papel dentro do
Postgres — que testa a política em si, sem depender do cliente HTTP:

| Cenário | Resultado |
|---|---|
| `anon` lendo a tabela | 0 linhas |
| Contador dono lendo a própria empresa | 1 linha |
| **Outro contador lendo a empresa alheia** | **0 linhas** |
| Outro contador tentando alterar a empresa alheia | 0 linhas afetadas |
| Outro contador inserindo empresa com `owner_id` falsificado | recusado, erro `42501` |
| **Contador gravando logo na pasta de outro** | **recusado, erro `42501`** |
| Contador gravando logo na própria pasta | aceito |
| `anon` lendo o placar | 0 linhas |
| Contador dono lendo o próprio placar | 1 linha |
| **Outro contador lendo o placar alheio** | **0 linhas** |
| Outro contador alterando o placar alheio | 0 linhas afetadas |

### Verificado em navegador real

`/painel` sem sessão redireciona para `/entrar` — inclusive com o proxy
desligado, provando que o DAL segura sozinho. A tela de login renderiza e valida
o e-mail, a ausência de Supabase avisa em vez de quebrar, e a página de
diagnóstico segue intacta. Mais 91 testes automatizados.

### NÃO verificado

O fluxo de login de ponta a ponta: envio do e-mail, o link mágico virando
sessão, o `upsert` da empresa via Prisma e a renovação de token pelo proxy.

O motivo não é falta de instância — é que o ambiente onde este código foi
desenvolvido bloqueia conexões de saída para o domínio do Supabase (`403` no
CONNECT do proxy de rede). A aplicação nunca conseguiu falar com o projeto
daqui. Rodando na sua máquina ou em deploy, esse bloqueio não existe.

Resumindo: a camada de banco está provada, a de aplicação está provada no
caminho de acesso negado, e o caminho de acesso concedido continua sem
exercício.

## Divergência entre o documento de oferta e o produto

O documento da landing page descreve o instrumento como sendo de **cinco
campos** ("cinco números que ele já tem"). O produto tem **três**: quanto
entrou, quanto saiu e o saldo em caixa — este último opcional.

A copy da página foi escrita seguindo o produto, não o documento, por um motivo
prático: a demo funcional está na mesma página, alguns pixels abaixo da frase.
Prometer cinco e mostrar três seria desmentido pela própria seção seguinte.

Isto é uma decisão a tomar, não um detalhe de redação:

- **Se o instrumento deve ter cinco campos**, faltam dois — e é preciso definir
  quais, porque RF-05 e RF-06 só precisam dos três atuais. A copy volta para
  "cinco" junto com a implementação.
- **Se três está certo**, o documento de oferta é que precisa ser atualizado,
  incluindo o kit e qualquer material que já cite cinco.

Enquanto não se decide, produto e página estão coerentes entre si.

## Premissas que precisam da sua confirmação

**As fórmulas de RF-05 e RF-06 foram inferidas.** O documento v0.4 assume as
seções 4.2/4.3 da v0.3 "sem alteração", mas o texto delas não acompanha o v0.4.
Foi adotada a leitura mínima compatível com o uso que o RF-09 faz das duas
grandezas:

- `diferenca = entradas − saídas` do mês;
- `folego_dias = ⌊saldo em caixa ÷ (saídas ÷ 30)⌋`.

Se a v0.3 definir diferente, o ponto de correção é `calculo.ts` — nada mais
depende da fórmula.

Uma decisão derivada, para revisar: quando o saldo em caixa não é informado,
`folego_dias` é `null` e o cenário nunca é "urgente", mesmo com diferença muito
negativa. Sem o dado não dá para afirmar que o fôlego é curto, e classificar como
urgente quem apenas não preencheu um campo opcional violaria o RF-08.

### RF-07 é uma proposta, e precisa da sua confirmação

O texto da seção 4.4 da v0.3 não existe em lugar nenhum do material disponível —
o v0.4 cita o RF-07 só pelo identificador. O que está implementado é uma
**proposta de leitura**, apoiada em duas evidências: o produto se chama
"Diagnóstico de 90 dias" mas nenhuma grandeza olhava para 90 dias, e a seção 4.4
ocupa exatamente a posição entre o fôlego (4.3) e o encerramento (4.5).

A proposta: projetar o saldo em caixa em 30, 60 e 90 dias, supondo que o ritmo do
mês analisado se repita — `saldo + diferença × (dias ÷ 30)`.

Três pontos que valem sua atenção:

1. **Se a v0.3 disser outra coisa, o custo de trocar é baixo de propósito.** Todo
   o RF-07 vive em `projecao.ts` e `projecao.test.ts`. Ele consome valores já
   prontos e é aditivo na tela — nada de RF-05, RF-06 ou RF-09 depende dele.
2. **A projeção usa a diferença líquida, o fôlego do RF-06 usa só as saídas.** São
   perguntas diferentes de propósito ("se nada mais entrar, quanto dura" versus
   "se o mês se repetir, onde chego"), e a tela mostra as duas com rótulos
   distintos. Se isso confundir na validação com contadores, o candidato a sair
   é o RF-06, que é o menos ligado ao nome do produto.
3. **É extrapolação, não previsão** — e a ressalva está na tela, não em rodapé.
   Sem ela o número vira conselho financeiro travestido de projeção, o que
   cruzaria a mesma linha que o RF-09 evita.

## O que ficou de fora

- **RF-30, critério dos 2 minutos** — o critério de aceite é medido em teste de
  usabilidade com contadores, não em código. O que dá para garantir aqui está
  garantido: um bloco único, campos opcionais com default, nenhuma edição de
  lógica ou estilo para trocar de cliente.
- **Pontuação 0-100 / benchmark de mercado** — fora por decisão da v0.4. Exigiria
  agregar dados entre usuários, o que colide de frente com RF-23 e RNF-05.
  Candidato de v2, com arquitetura própria.
