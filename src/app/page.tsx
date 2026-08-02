import type { Metadata } from "next";
import Link from "next/link";

import { FormularioCandidatura } from "@/components/lp/candidatura";
import { BarraSuperior, Hero } from "@/components/lp/hero";
import { Secao, TituloSecao } from "@/components/lp/marcadores";
import {
  ComoFunciona,
  FaixaDesqualificacao,
  Inimigo,
  Mecanismo,
  Problema,
} from "@/components/lp/secoes-a";
import {
  Blindagem,
  Garantias,
  ObjecaoMes2,
  ParaQuemNaoE,
  PorQueDez,
  Preco,
  Stack,
  Transparencia,
} from "@/components/lp/secoes-b";

export const metadata: Metadata = {
  title: "Aprumo — Pauta Técnica em 90 Dias",
  description:
    "Cinco números que seu cliente já tem viram uma constatação que abre pauta técnica, com a sua marca em cima e o seu CRC embaixo.",
};

/**
 * Landing page comercial. Público: o contador (comprador).
 *
 * Não confundir com a página do produto (`/d/<slug>`), cujo público é o
 * empresário e que obedece a regras opostas: lá não entra headline, garantia,
 * prova social nem CTA de venda.
 *
 * ORDEM NO MOBILE: a demo sobe para logo depois do hero. Em tela pequena
 * ninguém lê três parágrafos de problema antes de entender o que a coisa é —
 * o produto se explica primeiro, a copy justifica depois. As seções de objeção,
 * blindagem, transparência e desqualificação descem para depois do preço, para
 * quem foi atrás. No desktop vale a ordem do documento.
 */
export default function Page() {
  return (
    <>
      <BarraSuperior />

      <main className="flex flex-col">
        <div className="order-1">
          <Hero />
        </div>
        <div className="order-2">
          <FaixaDesqualificacao />
        </div>

        {/* Mobile: demo (3) antes do problema (4). Desktop: o inverso. */}
        <div className="order-3 sm:order-4">
          <Mecanismo />
        </div>
        <div className="order-4 sm:order-3">
          <Problema />
        </div>

        <div className="order-5">
          <Inimigo />
        </div>
        <div className="order-6">
          <ComoFunciona />
        </div>
        <div className="order-7">
          <Stack />
        </div>

        {/* Mobile: garantias e preço sobem; objeção/blindagem/transparência descem. */}
        <div className="order-8 sm:order-11">
          <Garantias />
        </div>
        <div className="order-9 sm:order-12">
          <Preco />
        </div>
        <div className="order-10 sm:order-13">
          <PorQueDez />
        </div>

        <div className="order-11 sm:order-8">
          <ObjecaoMes2 />
        </div>
        <div className="order-12 sm:order-9">
          <Blindagem />
        </div>
        <div className="order-[13] sm:order-10">
          <Transparencia />
        </div>
        <div className="order-[14]">
          <ParaQuemNaoE />
        </div>

        <div className="order-[15]">
          <Candidatura />
        </div>
      </main>

      <Rodape />
    </>
  );
}

/** §16 — fechamento e candidatura. Converte e qualifica no mesmo movimento. */
function Candidatura() {
  return (
    <Secao id="candidatura" className="bg-slate-50 dark:bg-slate-900/50">
      <TituloSecao>Candidatura</TituloSecao>

      <ul className="mt-6 space-y-2 text-slate-600 dark:text-slate-300">
        <li>O instrumento com a sua marca, mais o Kit de Pauta.</li>
        <li>Revisão das suas cinco primeiras mensagens, antes de irem a qualquer cliente.</li>
        <li>Devolução integral se, seguindo o kit, não sair reunião em 60 dias.</li>
      </ul>

      <p className="mt-6 text-slate-600 dark:text-slate-300">
        São cinco perguntas. As duas últimas são as que realmente importam — é
        por elas que eu sei se a conversa de 30 minutos vai servir para nós dois.
      </p>

      <div className="mt-8">
        <FormularioCandidatura />
      </div>
    </Secao>
  );
}

function Rodape() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-10 text-sm text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-900 dark:text-slate-100">Aprumo</p>

        {/* A frase-âncora aparece na camada comercial também: a mesma regra que
            o produto impõe ao escritório, a página cumpre sobre si mesma. */}
        <p className="text-slate-600 dark:text-slate-300">
          Este instrumento produz estimativa de caixa. Não substitui a apuração
          contábil.
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
          <Link href="/entrar" className="underline underline-offset-4 hover:text-slate-900 dark:hover:text-slate-200">
            Já sou cliente
          </Link>
          <span>CNPJ e contato: pendentes</span>
        </div>
      </div>
    </footer>
  );
}
