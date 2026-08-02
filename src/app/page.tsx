import Link from "next/link";

import { slugDeExemplo } from "@/lib/marca";

/**
 * Entrada do produto.
 *
 * O link de exemplo aponta para uma empresa que existe de verdade, e some
 * quando não há nenhuma. Fixar um slug de seed daria 404 em qualquer banco
 * real — o seed é opcional, e as empresas de produção são as que os próprios
 * contadores criaram.
 */
/**
 * A consulta do exemplo roda no build. Sem revalidação, um banco vazio no
 * momento do build esconderia o link para sempre, e o primeiro contador
 * cadastrado depois nunca apareceria. Cinco minutos é barato e se corrige
 * sozinho — a home não precisa de precisão ao segundo.
 */
export const revalidate = 300;

export default async function Page() {
  const exemplo = await slugDeExemplo();

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
        {exemplo && (
          <Link
            href={`/d/${exemplo}`}
            className="text-slate-600 underline underline-offset-4 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            Ver um exemplo
          </Link>
        )}
      </div>

      <p className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Os números que seu cliente digita ficam no navegador dele. Nada é
        enviado, salvo ou compartilhado — nem com você.
      </p>
    </main>
  );
}
