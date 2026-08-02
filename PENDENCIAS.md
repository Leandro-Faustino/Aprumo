# Pendências — o que eu não consigo resolver sozinho

Tudo aqui está parado por falta de informação, de decisão ou de acesso — não por
falta de tempo de implementação. Nenhum destes itens se resolve escrevendo mais
código.

**Como usar:** cada item diz o que falta, quem resolve e o que muda quando
chegar. Resolvidos, risque e apague. Se um item ficar aqui por muito tempo sem
incomodar ninguém, provavelmente ele não era importante — apagar também é uma
resposta.

---

## 1. O único ponto onde código mesclado depende de um palpite

### 🔴 RF-07 — seção 4.4 da v0.3

**O que falta:** o texto do requisito. A v0.4 cita o RF-07 apenas pelo
identificador, sem enunciado, entrada, saída ou casos de teste.

**O que eu fiz:** implementei como **projeção de 90 dias** — o saldo em caixa
projetado em 30, 60 e 90 dias supondo que o ritmo do mês se repita. A dedução se
apoiou em duas evidências: o produto se chama "Diagnóstico de 90 dias" mas
nenhuma grandeza olhava para 90 dias, e a seção 4.4 fica entre o fôlego (4.3) e
o encerramento (4.5).

**Por que é o item mais urgente:** está mesclado na `main` e rodando. É o único
lugar do produto onde um requisito foi inventado por mim.

**Custo de trocar, se estiver errado:** baixo, de propósito. Todo o RF-07 vive
em `src/lib/diagnostico/projecao.ts` e `projecao.test.ts`, consome valores já
calculados e é aditivo na tela. Há teste garantindo que RF-05, RF-06 e RF-09 não
dependem dele.

---

## 2. Requisitos que eu nunca li

O que sei de cada um, e como sei:

| Situação | Requisitos |
|---|---|
| **Texto completo** (vieram na v0.4) | RF-09, RF-24, RF-25, RF-26 |
| **Só o critério de aceite**, sem enunciado | RF-30, RF-32 |
| **Só menções de passagem** — implementados por dedução | RF-05, RF-06, RF-08, RF-11, RF-21, RF-23, RNF-05 |
| **Só o identificador** | RF-07 |
| **Nunca vistos** | RF-01 a 04, RF-10, RF-12 a 20, RF-22, RF-27 a 29, RF-31 |
| **Nunca vistos** | RNF-01 a 04, e do RNF-06 em diante — não sei nem quantos são |

São **19 requisitos funcionais** completamente desconhecidos, contando os buracos
na numeração.

### Documentos que resolveriam

- **v0.3, seções 4.2, 4.3 e 4.4** — RF-05, RF-06 e RF-07
- **v0.2, seções 1, 2, 3, 6, 7, 8 e 9** — pela numeração, a **seção 6** deve
  carregar os não-funcionais e a **seção 8** a validação (a v0.4 cita "seção
  8.1" ao falar das perguntas a fazer aos contadores)

### Se só der para achar um

**A seção 6 da v0.2**, pelos não-funcionais. O RNF-05 é o requisito mais
estruturante do projeto — sustenta a arquitetura de dados, a trava de CI em
`src/lib/diagnostico/privacidade.test.ts` e o argumento comercial inteiro — e eu
o conheço apenas por paráfrase. Se o texto original disser algo diferente do que
deduzi, o efeito se espalha por tudo.

### Deduções que valem confirmar

| Requisito | O que assumi |
|---|---|
| RF-05 | `diferença = entradas − saídas` do mês |
| RF-06 | `fôlego = ⌊saldo em caixa ÷ (saídas ÷ 30)⌋` |
| RF-08 | Tom não-acusatório: descrever a situação, nunca qualificar a pessoa |
| RF-11 | A ressalva "produz estimativa de caixa, não substitui a apuração contábil" |
| RF-21 | Handoff por WhatsApp com mensagem pré-preenchida |
| RF-23 | Não persistir dado financeiro em servidor na v1 |
| RNF-05 | Nenhum dado financeiro trafega ou é armazenado |

O RF-11 foi deduzido do documento da escada de valor, que o cita ao lado de "a
marca no rodapé" — é a leitura mais provável, não uma certeza.

---

## 3. Decisões que só você toma

### 🔴 Cinco campos ou três

O documento de oferta e o da escada descrevem o instrumento como sendo de **cinco
campos**. O produto tem **três**: quanto entrou, quanto saiu e o saldo em caixa
(este opcional).

A landing page foi alinhada ao **produto**, porque a demo funcional fica na mesma
página, poucos pixels abaixo da frase — prometer cinco e mostrar três seria
desmentido pela seção seguinte, no mesmo scroll.

Enquanto os dois números coexistirem, a copy volta a divergir sozinha. Ou faltam
dois campos no instrumento — e é preciso definir **quais**, já que RF-05 e RF-06
só precisam dos três atuais — ou o material precisa ser corrigido.

### Nome do degrau 0

É o único item da escada de valor sem nome (o degrau 1 é "Pauta Técnica em 90
Dias"). A página existe em `/meu-escritorio` com título descritivo, e o campo
está registrado como pendência em `src/lib/lp.ts`.

Inventar marca não é decisão de implementação.

### Os números da camada comercial

São **22 marcadores visíveis** na landing page, feios de propósito para não serem
publicados por acidente. Todos centralizados em `src/lib/lp.ts`:

- preço fundador e preço de tabela, e a data em que a tabela entra em vigor
- data de início da turma
- valor de um cliente novo (ticket × permanência média)
- nº de contatos que ativa a garantia
- duração real do setup
- valor declarado de cada item do stack
- CNPJ e contato do rodapé

### A decisão de dados, por escrito e datada

O documento da escada pede que o tradeoff de benchmark seja registrado — caminho
A (manter o bloqueio), B (agregação no nível do escritório) ou C (consentimento
do empresário).

**Está implementado como A**, e a trava de CI o torna executável. Falta o
registro formal com data, que é o que impede a deriva.

---

## 4. Acessos que só você tem

### 🔴 A senha do banco (`DATABASE_URL`)

O projeto Supabase existe: **`aprumo`**, ref `rnbbbjozioxzpreylmle`, região
`sa-east-1`. As quatro migrations já foram aplicadas e as políticas de RLS estão
verificadas.

Falta só a connection string, em *Settings → Database*. A senha não é
recuperável depois da criação nem exposta pela API — se você não a tiver, use
*Reset database password*.

**Sem ela, nada da área autenticada roda.**

### Deploy

O link mágico exige uma URL pública estável para funcionar. Também é o que
permite ao degrau 0 servir ao propósito que o documento da escada lhe dá:
distribuição por afiliado, conteúdo, contato frio.

⚠️ Variáveis `NEXT_PUBLIC_*` entram no bundle **durante o build**, não em
runtime. Um build feito sem elas gera uma aplicação em que o login nunca
funciona, mesmo que a variável exista no servidor depois.

### Branch padrão do repositório

Ainda aponta para `claude/diagnostico-90-dias-v0-4-upmkqq` em vez de `main`. Em
*Settings → Branches*. Enquanto for assim, quem clonar o repositório cai numa
branch de trabalho, e ela também não pode ser apagada.

---

## 5. Verificações externas

### 🔴 Enquadramento CFC, com fonte primária

Bloqueia a seção de blindagem da landing page inteira, hoje renderizada como
**bloqueada** em vez de preenchida. Prometer enquadramento sem fonte é
exatamente o risco que essa nota existe para cobrir.

### Controlador e operador de LGPD

Bloqueia o bloco de arquitetura de dados. Vira necessidade jurídica de verdade
se algum dia o degrau 3 existir, porque ali o disparo acontece em nome do
escritório e toca a carteira dele.

### Anterioridade do nome "Aprumo"

Bloqueia qualquer peça pública com o wordmark.

---

## 6. Validação com contadores reais

Nada aqui é opinião: são coisas que só dez conversas respondem.

- **A copy da landing page é estrutural.** O documento é explícito que ela deve
  ser escrita *depois* das entrevistas, com o vocabulário que os contadores usam
  — não com o que foi inventado no gabinete. Se eles não dizem "pauta técnica",
  o nome do programa muda junto.
- **RF-24/25/26 (roteiro de conversa) nunca foram testados.** A pergunta é
  *"esse roteiro ajudaria você a conduzir a reunião, ou você já tem o seu?"* —
  se a resposta for "já tenho o meu", o RF-24 perde prioridade.
- **O critério dos 2 minutos do RF-30** é medido em teste de usabilidade, não em
  código.
- **Dashboard.** A pergunta certa não é "você quer um dashboard?" (todos dizem
  sim), e sim *"quando você mandar para dez clientes, como vai saber se valeu a
  pena?"*. Hoje existe um placar manual em `/painel/placar`, e ele é
  deliberadamente não-rastreador.

---

## O que **não** está aqui

Para não confundir o que falta com o que foi decidido:

- **Degraus 2 a 5 da escada** não são pendência — são "não construir agora", por
  decisão registrada. Nenhum gatilho foi atingido, e não há clientes.
- **Painel, PDF e histórico comparado** não foram esquecidos: são o degrau 4.
- **Benchmark entre carteiras** está fechado pela arquitetura, por escolha
  assumida. Ver a seção de escada no `README.md`.

---

## Estado de quem pode verificar o quê

| Camada | Provado | Como |
|---|---|---|
| Diagnóstico (3 páginas públicas) | ✅ | Navegador real, três cenários, sem vazamento em rede |
| Isolamento entre contadores | ✅ | Papéis assumidos dentro do Postgres, com tentativa de invasão |
| Privacidade do núcleo | ✅ | Trava de CI, verificada por injeção de violação |
| Acesso negado à área autenticada | ✅ | Navegador, inclusive com o proxy desligado |
| **Acesso concedido à área autenticada** | ❌ | **Nunca exercitado** — o ambiente de desenvolvimento bloqueia saída para o Supabase |

O último item some assim que o produto rodar na sua máquina ou em deploy.
