import { TRAVAS } from "@/lib/lp";

import { BotaoCta } from "./hero";
import { Falta, Secao, TituloSecao, Travado } from "./marcadores";

/**
 * §8 — o stack.
 *
 * Cada item declara o problema que resolve, não a feature. O Bloco 2 tem mais
 * peso visual que o Bloco 1 de propósito: se o instrumento parecer o produto,
 * a categoria vira "ferramenta" e o kit deixa de ser percebido.
 *
 * Valor declarado por item fica pendente — número inflado morre na primeira
 * pergunta de um contador, e a conversa de 30 minutos é onde ele seria feito.
 */
export function Stack() {
  return (
    <Secao>
      <TituloSecao>O que você recebe</TituloSecao>

      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <h3 className="text-sm font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
            O instrumento
          </h3>
          <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
            <Item nome="Página com a sua marca">
              para o cliente ver o número dele sem ver a nossa marca.
            </Item>
            <Item nome="Setup assistido">
              para você não ter que configurar nada.
            </Item>
          </ul>
        </div>

        {/* Bloco 2: o produto de verdade. Peso visual maior, de propósito. */}
        <div className="rounded-xl border-2 border-slate-900 p-6 sm:p-8 dark:border-slate-100">
          <h3 className="text-sm font-medium tracking-wide text-slate-900 uppercase dark:text-slate-100">
            O Kit de Pauta
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            É aqui que está o trabalho. O instrumento sozinho não abre conversa
            nenhuma.
          </p>
          <ul className="mt-5 space-y-3 text-slate-600 dark:text-slate-300">
            <Item nome="Mapa de contatos, 7 fontes">
              para quando você acha que não tem para quem mandar.
            </Item>
            <Item nome="Mensagens prontas por cenário">
              para não travar na hora de escrever a primeira.
            </Item>
            <Item nome="Roteiro da conversa seguinte">
              para a reunião não morrer depois do &ldquo;e agora?&rdquo;.
            </Item>
            <Item nome="Modo assistido">
              para a carteira que não clica em link.
            </Item>
            <Item nome="Calendário trimestral">
              para não acabar a carteira no mês 2.
            </Item>
            <Item nome="Placar de uma folha">
              para saber se está funcionando sem montar relatório.
            </Item>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <h3 className="text-sm font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Blindagem
          </h3>
          <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
            <Item nome="Nota de enquadramento profissional">
              para a pergunta que o conselho poderia fazer.
            </Item>
            <Item nome="Nota de arquitetura de dados">
              para a pergunta que o cliente vai fazer sobre LGPD.
            </Item>
          </ul>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Valor declarado de cada item: <Falta>valor por item, defensável em voz alta</Falta>
      </p>

      {/* Teto explícito na promessa (degrau 1 da escada de valor).
          Sem isto, fica implícito que o programa resolve o crescimento — e a
          frustração de "consegui três reuniões e não fechei nenhuma" vira
          cancelamento no mês 4, com o contador concluindo que o degrau 1 não
          funcionou. Anunciar o degrau seguinte sem construí-lo põe o teto e
          prepara a venda; prometê-lo pronto seria o erro oposto. */}
      <div className="mt-8 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50">
          O que este programa não resolve
        </h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Ele resolve <span className="font-medium">pauta</span>: ter um motivo
          técnico para ligar e uma conversa que começa em cima de um número.
          Transformar essa conversa em proposta e honorário é o passo seguinte,
          e ele ainda não existe — está sendo desenhado junto com os escritórios
          fundadores.
        </p>
      </div>

      <div className="mt-10">
        <BotaoCta variante="secundario" />
      </div>
    </Secao>
  );
}

function Item({ nome, children }: { nome: string; children: React.ReactNode }) {
  return (
    <li>
      <span className="font-medium text-slate-900 dark:text-slate-100">{nome}</span>{" "}
      — {children}
    </li>
  );
}

/** §9 — a objeção do mês 2, que decide a renovação e que ele não verbaliza. */
export function ObjecaoMes2() {
  return (
    <Secao>
      <TituloSecao>&ldquo;E quando eu terminar minha carteira?&rdquo;</TituloSecao>
      <div className="mt-6 space-y-5 text-lg text-slate-600 dark:text-slate-300">
        <p>
          A mesma carteira, quatro vezes por ano. Não é campanha que esgota — é
          ritual que acumula.
        </p>
        <p>
          Na segunda rodada aparece o que a primeira não tinha: os dois períodos
          lado a lado. O cliente deixa de ver um retrato e passa a ver um
          movimento, que é uma conversa completamente diferente.
        </p>
        {/* Honestidade obrigatória: prometer o que não existe quebra a renovação
            no mês 3, que é justamente o risco que esta seção existe para tratar. */}
        <p className="rounded-xl bg-slate-100 p-5 text-base dark:bg-slate-800/60">
          <span className="font-medium text-slate-900 dark:text-slate-50">
            Sendo direto:
          </span>{" "}
          a comparação entre períodos ainda não existe. É o próximo item do
          roteiro, e escritório da turma fundadora entra nela sem custo
          adicional.
        </p>
      </div>
    </Secao>
  );
}

/** §10 — blindagem. O bloco do CFC está travado até verificação com fonte primária. */
export function Blindagem() {
  return (
    <Secao>
      <TituloSecao>As duas perguntas que você não vai fazer em voz alta</TituloSecao>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Travado motivo="verificação do enquadramento CFC com fonte primária">
          <p className="font-medium">Enquadramento profissional</p>
          <p className="mt-2">
            A divisão de trabalho entre o que o instrumento constata e o que o
            profissional apura. Este texto não pode ser publicado antes da
            verificação — prometer enquadramento sem fonte é exatamente o risco
            que ele existe para cobrir.
          </p>
        </Travado>

        <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
          <p className="font-medium text-slate-900 dark:text-slate-50">
            Arquitetura de dados
          </p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Nenhum dado financeiro trafega ou é armazenado. O cálculo acontece no
            aparelho do empresário. Não existe banco de leads para vazar.
          </p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            LGPD resolvida por desenho, não por política de privacidade — e você
            pode testar isso agora: abra a demo acima com o inspetor de rede
            aberto.
          </p>
        </div>
      </div>
    </Secao>
  );
}

/**
 * §11 — transparência de pré-validação.
 *
 * Ocupa o lugar da prova social sem inventar prova. Para um público treinado em
 * rigor de método, declarar o que não foi validado é uma forma de prova — e
 * posar de líder seria a única mentira possível neste projeto.
 */
export function Transparencia() {
  return (
    <Secao>
      <TituloSecao>O que ainda não sabemos</TituloSecao>

      <ul className="mt-8 space-y-3">
        {TRAVAS.map((trava) => (
          <li
            key={trava.rotulo}
            className="flex gap-3 border-b border-slate-200 pb-3 text-slate-600 dark:border-slate-800 dark:text-slate-300"
          >
            <span className="font-mono text-slate-400">—</span>
            <span>
              {trava.rotulo}
              {trava.travaDura && (
                <span className="ml-2 text-sm text-slate-400">
                  (depende de fonte externa)
                </span>
              )}
            </span>
          </li>
        ))}
        <li className="flex gap-3 text-slate-600 dark:text-slate-300">
          <span className="font-mono text-slate-400">—</span>
          <span>
            Quantos escritórios usaram até hoje: <Falta>número real, ou zero</Falta>
          </span>
        </li>
      </ul>

      <p className="mt-8 border-l-2 border-slate-900 pl-5 text-lg text-slate-900 dark:border-slate-100 dark:text-slate-50">
        Você não está comprando um produto pronto. Está entrando nos dez
        primeiros — e é por isso que o preço é este e a sua opinião entra no
        roteiro.
      </p>
    </Secao>
  );
}

/**
 * §12 — as duas garantias. Reputação ANTES de dinheiro.
 *
 * O medo não é perder o dinheiro: é mandar a peça para um cliente da carteira e
 * passar vergonha. Reembolso não devolve reputação. Abrir pela garantia
 * financeira responde o medo errado primeiro.
 *
 * Texto corrido, sem selo — um contador lê garantia como cláusula.
 */
export function Garantias() {
  return (
    <Secao>
      <TituloSecao>Duas garantias</TituloSecao>

      <div className="mt-8 space-y-8">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            1. Garantia de reputação
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Suas cinco primeiras mensagens passam por revisão antes de irem para
            qualquer cliente seu. Nenhuma peça sai com a sua marca sem que
            alguém tenha lido.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            2. Garantia de pauta
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Se em 60 dias você enviar para <Falta>nº de contatos</Falta> contatos
            seguindo o kit e não sair uma reunião marcada, devolvo o valor
            integral e o kit fica com você.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            A condição está escrita porque ela é o método: sem envio não há
            pauta, e uma garantia sem condição só atrai quem não vai executar.
          </p>
        </div>
      </div>
    </Secao>
  );
}

/** §13 — preço como aritmética de recuperação, não como custo de software. */
export function Preco() {
  return (
    <Secao id="preco">
      <TituloSecao>Preço</TituloSecao>

      <div className="mt-8 rounded-xl border border-slate-200 p-6 font-mono text-slate-700 sm:p-8 dark:border-slate-800 dark:text-slate-200">
        <div className="flex justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
          <span>Um cliente novo vale</span>
          <span className="tabular-nums">
            <Falta>ticket × permanência</Falta>
          </span>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <span>Preço fundador</span>
          <span className="tabular-nums">
            <Falta>preço fundador</Falta>
          </span>
        </div>
        <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>
            Tabela, a partir de <Falta>data</Falta>
          </span>
          <span className="tabular-nums">
            <Falta>preço de tabela</Falta>
          </span>
        </div>
      </div>

      <p className="mt-6 text-lg font-medium text-balance text-slate-900 dark:text-slate-50">
        Um cliente novo paga <Falta>N</Falta> anos do programa. A pergunta não é
        se cabe no orçamento — é se você acredita que consegue um.
      </p>

      <div className="mt-8 space-y-4 text-slate-600 dark:text-slate-300">
        <p>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            Por que anual e não mensal:
          </span>{" "}
          o ritual é trimestral. No plano mensal dá para cancelar antes da
          segunda rodada, que é exatamente quando o método começa a funcionar.
        </p>
        <p>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            O preço fundador não é desconto.
          </span>{" "}
          Você paga menos e paga também em outra moeda: uma entrevista de 40
          minutos, feedback a cada rodada e autorização para usar o seu caso.
          Está escrito aqui para não virar surpresa depois.
        </p>
      </div>

      <div className="mt-10">
        <BotaoCta />
      </div>
    </Secao>
  );
}

/** §14 — escassez ancorada em capacidade real de operação. */
export function PorQueDez() {
  return (
    <Secao>
      <TituloSecao>Por que dez</TituloSecao>
      <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
        São dez escritórios porque eu faço a entrevista, o setup e a revisão das
        primeiras mensagens com cada um, pessoalmente. Acima disso eu entrego
        mal.
      </p>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        A turma começa em <Falta>data de início</Falta>. As sessões de método são
        coletivas, então a data é a mesma para todos.
      </p>
      {/* Sem contador de vagas: só entra se for real e atualizado à mão. Vaga
          falsa numa página que prega contra urgência fabricada é a contradição
          que este público detecta e comenta. */}
    </Secao>
  );
}

/** §15 — para quem não é. Recusar publicamente aumenta a força do convite. */
export function ParaQuemNaoE() {
  return (
    <Secao>
      <TituloSecao>Para quem isto não é</TituloSecao>
      <ul className="mt-6 space-y-3 text-lg text-slate-600 dark:text-slate-300">
        {[
          "Escritório que já tem processo de captação funcionando.",
          "Quem quer um selo de saúde financeira para mandar em massa.",
          "Quem quer software com painel, dashboard e integração.",
          "Quem não vai enviar para pelo menos alguns contatos nos primeiros 30 dias.",
        ].map((item) => (
          <li key={item} className="flex gap-3">
            <span className="font-mono text-slate-400">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Secao>
  );
}
