import Link from "next/link";

import { marcaDoAmbiente } from "@/lib/marca";
import { temBancoConfigurado } from "@/lib/prisma";

/**
 * Entrada do produto.
 *
 * Sem banco configurado, o link de exemplo cai no fallback de ambiente — é o
 * que mantém o produto demonstrável antes de existir Supabase.
 */
export default function Page() {
  const slugExemplo = temBancoConfigurado() ? "silva-contabil" : marcaDoAmbiente().slug;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-6 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl dark:text-slate-50">
          Um diagnóstico de caixa com a sua marca
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Seu cliente responde três números do último mês e vê na hora como está
          o caixa dele. Você recebe a conversa no WhatsApp — sem planilha, sem
          reunião marcada às cegas.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/entrar"
          className="rounded-lg bg-slate-900 px-6 py-3.5 font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Criar meu link
        </Link>
        <Link
          href={`/d/${slugExemplo}`}
          className="text-slate-600 underline underline-offset-4 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          Ver um exemplo
        </Link>
      </div>

      <p className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Os números que seu cliente digita ficam no navegador dele. Nada é
        enviado, salvo ou compartilhado — nem com você.
      </p>
    </main>
  );
}
