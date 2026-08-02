import type { Metadata } from "next";
import Link from "next/link";

import { Diagnostico } from "@/components/diagnostico";
import { BotaoCta } from "@/components/lp/hero";
import { MARCA_DEMO } from "@/components/lp/secoes-a";

export const metadata: Metadata = {
  title: "O caixa do seu escritório — Aprumo",
  description:
    "Três números do último mês do seu próprio escritório contábil. Sem cadastro, e nada sai do seu navegador.",
};

/**
 * Degrau 0 da escada de valor — o instrumento aplicado ao próprio escritório
 * do contador.
 *
 * O QUE FAZ ESTA PÁGINA VALER: o contador é dono de empresa e retira dinheiro
 * do próprio escritório no feeling, igual ao cliente dele. Preenchendo com os
 * números dele, ele não fica sabendo o que o instrumento provoca — ele sente.
 * Num produto sem prova social, essa é a única demonstração honesta de efeito
 * que existe.
 *
 * DUAS REGRAS QUE NÃO PODEM CAIR AQUI:
 *
 * 1. Sem cadastro. Pedir e-mail para alguém ver o próprio número transforma o
 *    degrau 0 no gênero de isca que a marca inteira combate. O e-mail vem
 *    depois, quando ele quiser a versão com a marca dele.
 * 2. Nada de venda antes do número. O convite para a turma fundadora aparece
 *    só depois do resultado — antes disso, esta página é apenas útil.
 *
 * O nome de marca deste degrau está em aberto (ver `PENDENTE.nomeDegrau0`);
 * o título abaixo é descritivo de propósito.
 */
export default function Page() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-2xl px-6 py-5">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          >
            Aprumo
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 sm:py-16">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Para contadores
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-slate-900 sm:text-4xl dark:text-slate-50">
          Antes de olhar o caixa dos seus clientes, olhe o do seu escritório
        </h1>

        <div className="mt-5 space-y-4 text-lg text-slate-600 dark:text-slate-300">
          <p>
            Você também é dono de empresa. Tem folha, tem imposto, tem software
            para pagar — e tem uma retirada que sai todo mês sem passar por
            nenhuma conta gerencial.
          </p>
          <p>
            São três números do mês passado. Leva menos de um minuto, não pede
            cadastro, e nada do que você digitar sai deste navegador.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <Diagnostico marca={MARCA_DEMO} />
        </div>

        <section className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            O que você acabou de sentir
          </h2>
          <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
            <p>
              Se o número te incomodou, guarde a sensação: é exatamente essa que
              o seu cliente tem ao ver o dele. E repare que ninguém precisou
              explicar o resultado para você — o número fez isso sozinho.
            </p>
            <p>
              É por isso que a conversa que vem depois é diferente de qualquer
              tentativa de explicar um relatório. Quem constata sozinho quer
              resolver; quem é informado se defende.
            </p>
            <p>
              O instrumento para na pergunta, de propósito. A partir dali, o
              trabalho é seu — e é para isso que existe a versão com a sua marca
              em cima e o seu CRC embaixo.
            </p>
          </div>

          <div className="mt-8">
            <BotaoCta destino="/#candidatura" />
          </div>
        </section>

        <p className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Este instrumento produz estimativa de caixa. Não substitui a apuração
          contábil.
        </p>
      </main>
    </div>
  );
}
