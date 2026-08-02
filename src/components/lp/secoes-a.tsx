import { Diagnostico } from "@/components/diagnostico";
import type { Marca } from "@/lib/marca";

import { BotaoCta } from "./hero";
import { Falta, Secao, TituloSecao } from "./marcadores";

/**
 * Marca fictícia e neutra para a demo (§5).
 * Sem WhatsApp de propósito: o botão de conversa some sozinho (RF-32), o que
 * evita um CTA concorrente no meio da landing page.
 */
export const MARCA_DEMO: Marca = {
  slug: "exemplo",
  marca: "Escritório Exemplo",
  crc: "UF-000000/O-0",
  logoUrl: null,
  whatsapp: null,
  rodape: null,
  corPrimaria: "#0F766E",
};

/** §3 — desqualificação imediata. Uma linha, não uma seção cheia. */
export function FaixaDesqualificacao() {
  return (
    <div className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      <p className="mx-auto max-w-3xl px-6 py-5 text-slate-600 dark:text-slate-300">
        São dez escritórios. Se você já tem um processo de captação que funciona,
        isto não é para você.
      </p>
    </div>
  );
}

/**
 * §4 — a pauta que não existe.
 * Descritivo, nunca acusatório: a regra RF-08 do produto sobe para a camada
 * comercial. Nada de "você está deixando dinheiro na mesa" — soa exatamente
 * como o vendedor que ele não quer ser.
 */
export function Problema() {
  return (
    <Secao>
      <TituloSecao>A pauta que não existe</TituloSecao>
      <div className="mt-6 space-y-5 text-lg text-slate-600 dark:text-slate-300">
        <p>
          O contato do mês é guia, obrigação, prazo. A pauta é sempre do
          calendário fiscal — nunca do negócio do cliente.
        </p>
        <p>
          Quando a única pauta é obrigação acessória, o escritório passa a ser
          avaliado por preço de obrigação acessória. E obrigação acessória está
          ficando barata.
        </p>
        <p>
          A saída óbvia é &ldquo;fazer marketing&rdquo; — e é aí que trava, por
          três motivos que raramente se dizem em voz alta: não sabe fazer, não
          tem tempo, e tem receio de como isso pega perante cliente e conselho.
        </p>
      </div>
    </Secao>
  );
}

/**
 * §5 — o mecanismo, demonstrado. A seção mais importante da página.
 *
 * Substitui prova social por demonstração: não há depoimento, mas há um produto
 * que se explica sozinho em três campos. O instrumento cabe inteiro aqui, e em
 * noventa segundos o leitor entendeu tudo sem ler copy.
 *
 * Sem e-mail para liberar a demo — pedir cadastro aqui contradiria a página.
 */
export function Mecanismo() {
  return (
    <Secao id="demo">
      <TituloSecao>Preencha três campos. É exatamente o que o seu cliente vai ver.</TituloSecao>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        Use números de um cliente seu, os do seu próprio escritório, ou invente.
        Nada do que você digitar sai deste navegador.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <Diagnostico marca={MARCA_DEMO} />
      </div>

      <div className="mt-8 border-l-2 border-[#0F766E] pl-5">
        <p className="text-slate-700 dark:text-slate-200">
          Repare onde o instrumento para. Ele constata e devolve uma pergunta —
          não conclui, não recomenda, não sugere regime tributário.
        </p>
        <p className="mt-2 font-medium text-slate-900 dark:text-slate-50">
          É essa frase que devolve a conversa para você.
        </p>
      </div>

      <div className="mt-10">
        <BotaoCta variante="secundario" />
      </div>
    </Secao>
  );
}

/** §6 — o inimigo. Define a categoria antes de falar de preço. */
export function Inimigo() {
  return (
    <Secao>
      <TituloSecao>O empresário não precisa de nota. Precisa de ver o próprio número.</TituloSecao>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-300 dark:border-slate-700">
              <th className="py-3 pr-4 font-medium text-slate-500 dark:text-slate-400">
                Diagnóstico gratuito de mercado
              </th>
              <th className="py-3 pl-4 font-medium text-slate-900 dark:text-slate-50">
                Este instrumento
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            {[
              ["Devolve nota, score, selo", "Devolve dois números lado a lado"],
              ["Conclui no lugar do profissional", "Para antes da conclusão"],
              ["Fabrica urgência para gerar ligação", "Abre uma pauta e sai de cena"],
              ["A marca da ferramenta em cima", "Sua marca em cima, a nossa no rodapé"],
              ["O empresário sai assustado", "O empresário sai entendendo"],
            ].map(([deles, nosso]) => (
              <tr key={deles} className="border-b border-slate-200 dark:border-slate-800">
                <td className="py-3 pr-4 align-top">{deles}</td>
                <td className="py-3 pl-4 align-top text-slate-900 dark:text-slate-100">{nosso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-lg font-medium text-slate-900 dark:text-slate-50">
        Eles concluem no seu lugar. Nós paramos antes.
      </p>

      <div className="mt-10 space-y-5">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          Com o que isso concorre de verdade
        </h3>
        {[
          {
            alt: "Continuar esperando indicação",
            resposta:
              "Funciona — é assim que seu escritório chegou até aqui. O que não funciona é escolher quando a próxima chega.",
          },
          {
            alt: "Mandar uma planilha ou um relatório",
            resposta:
              "O cliente não abre. E quando abre, não sabe qual número olhar primeiro.",
          },
          {
            alt: "Contratar agência de marketing contábil",
            resposta:
              "Resolve alcance, não pauta. Você continua sem ter o que dizer quando o telefone atende.",
          },
        ].map(({ alt, resposta }) => (
          <div key={alt}>
            <p className="font-medium text-slate-900 dark:text-slate-100">{alt}</p>
            <p className="text-slate-600 dark:text-slate-300">{resposta}</p>
          </div>
        ))}
      </div>
    </Secao>
  );
}

/**
 * §7 — como funciona.
 * Ataca o denominador da equação de valor: atraso e esforço. Redução de esforço
 * que não é comunicada não existe — daí o destaque do modo assistido, que
 * responde à objeção "meu cliente não vai preencher isso" antes de ela ser dita.
 */
export function ComoFunciona() {
  return (
    <Secao>
      <TituloSecao>Como funciona</TituloSecao>

      <ol className="mt-8 space-y-6">
        {[
          {
            titulo: (
              <>
                Configuramos com você em <Falta>duração do setup</Falta>.
              </>
            ),
            texto: "Sua marca, sua cor, seu CRC, seu WhatsApp. Você não configura nada.",
          },
          {
            titulo: <>Você manda a mensagem pronta.</>,
            texto:
              "O texto já está escrito, por cenário. Você escolhe para quem vai — o kit tem o mapa de contatos.",
          },
          {
            titulo: <>A constatação chega no seu WhatsApp.</>,
            texto: "Com o roteiro da conversa que vem depois, indexado pelo resultado.",
          },
        ].map((passo, i) => (
          <li key={i} className="flex gap-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50">{passo.titulo}</p>
              <p className="text-slate-600 dark:text-slate-300">{passo.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-xl bg-slate-100 p-6 dark:bg-slate-800/60">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50">
          Ele não precisa preencher sozinho
        </h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          No modo assistido, você preenche junto com o cliente, ao telefone. São
          três perguntas. Se a sua carteira não é de gente que clica em link,
          esse é o caminho — e continua sendo uma conversa que você abriu com um
          motivo técnico.
        </p>
      </div>
    </Secao>
  );
}
