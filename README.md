# Aprumo — Diagnóstico de 90 dias

Página de diagnóstico financeiro white-label para contadores. O cliente final
informa três números do último mês e recebe, na hora, o resultado e uma pergunta
final — nunca uma recomendação. O contador distribui a página com a própria marca
e recebe o contato por WhatsApp.

Implementa os requisitos v0.4 (RF-09 revisado, seções 4.5 a 4.7).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma 7 ·
Supabase (Postgres) · Vitest

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

Dois testes guardam isso: `whatsapp.test.ts` verifica que a mensagem de handoff
não carrega valor algum, e o smoke test de browser confirma que nenhuma
requisição de rede leva os números digitados.

## Rodando

```bash
npm install
cp .env.example .env    # nada obrigatório para começar
npm run dev
```

Sem `DATABASE_URL` a aplicação roda inteira usando o fallback de ambiente — é o
caso do contador único. `/` usa a marca das variáveis `NEXT_PUBLIC_MARCA_*`.

### Com Supabase (vários contadores no mesmo deploy)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Copie a connection string em *Project Settings → Database → Connection string → URI*
   para `DATABASE_URL` (porta `6543`, do pooler, em serverless; `5432` para migrations).
3. Aplique o schema e popule dois exemplos:

```bash
npm run db:migrate
npm run db:seed
```

Cada contador vira uma linha em `contadores` e ganha sua página em `/d/<slug>` —
`/d/silva-contabil` (completo) e `/d/minimo` (só o obrigatório) vêm no seed.

### Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | `prisma generate` + build de produção |
| `npm test` | Testes do núcleo (42 casos) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Cria/aplica migration |
| `npm run db:seed` | Popula contadores de exemplo |

## Mapa dos requisitos

| Requisito | Onde |
|---|---|
| RF-05 — diferença | `src/lib/diagnostico/calculo.ts` |
| RF-06 — fôlego em dias | `src/lib/diagnostico/calculo.ts` |
| RF-08 — tom não-acusatório | `ROTULO_CENARIO` em `cenario.ts` e textos da UI |
| RF-09 — CTA por cenário | `src/lib/diagnostico/cenario.ts` + `cenario.test.ts` |
| RF-21 — handoff WhatsApp | `src/lib/diagnostico/whatsapp.ts` |
| RF-23 / RNF-05 — nada trafega | núcleo puro; aviso em `prisma/schema.prisma` |
| RF-24/25/26 — roteiro de conversa | `kit/roteiro-de-conversa.md` (conteúdo, não software) |
| RF-30 — bloco único de marca | `src/lib/marca.ts` + modelo `Contador` |
| RF-32 — degradação | `pagina-diagnostico.tsx` + testes em `whatsapp.test.ts` |

Os cinco casos da tabela do RF-09 estão em `cenario.test.ts` um a um, incluindo o
caso 5 (fôlego exatamente 30 **não** é urgente — o limite é `<`, não `<=`).

A regra de nomenclatura do RF-09 — nenhum CTA pode conter verbo imperativo de
ação financeira — é um teste automatizado, não um comentário. Um texto novo com
"reduza", "negocie" ou "controle" quebra a suíte.

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

## O que ficou de fora

- **RF-07** — citado na v0.4 como herdado da v0.3, mas sem texto disponível.
  Não foi implementado para não inventar requisito; é o próximo item assim que a
  redação chegar.
- **RF-30, critério dos 2 minutos** — o critério de aceite é medido em teste de
  usabilidade com contadores, não em código. O que dá para garantir aqui está
  garantido: um bloco único, campos opcionais com default, nenhuma edição de
  lógica ou estilo para trocar de cliente.
- **Pontuação 0-100 / benchmark de mercado** — fora por decisão da v0.4. Exigiria
  agregar dados entre usuários, o que colide de frente com RF-23 e RNF-05.
  Candidato de v2, com arquitetura própria.
