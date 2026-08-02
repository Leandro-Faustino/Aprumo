import type { Metadata } from "next";

import { NavegacaoPainel } from "@/components/painel-nav";
import { meusEnvios } from "@/lib/dal";
import { doTrimestre, leitura, resumir, rotuloDoTrimestre } from "@/lib/placar";

import { marcar, remover } from "./acoes";
import { FormularioEnvio } from "./formulario";

export const metadata: Metadata = { title: "Placar — Aprumo" };

/**
 * Placar do contador.
 *
 * NÃO é um painel de rastreamento. O produto continua sem saber se alguém abriu
 * o link ou preencheu o diagnóstico — quem escreve cada linha aqui é o contador,
 * à mão. É o `kit/placar.md` dentro do produto, nada além disso.
 */
export default async function Page() {
  const envios = await meusEnvios();
  const doPeriodo = doTrimestre(envios);
  const resumo = resumir(doPeriodo);

  return (
    <div className="flex min-h-full flex-col">
      <NavegacaoPainel atual="placar" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Placar
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Uma linha por envio. Você anota — o Aprumo não observa seus clientes.
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {rotuloDoTrimestre()}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Numero rotulo="Enviei" valor={resumo.enviados} />
            <Numero rotulo="Responderam" valor={resumo.responderam} />
            <Numero rotulo="Conversas" valor={resumo.conversas} />
            <Numero rotulo="Viraram trabalho" valor={resumo.trabalhos} />
          </dl>

          <p className="mt-5 border-t border-slate-200 pt-4 text-slate-600 dark:border-slate-800 dark:text-slate-300">
            {leitura(resumo)}
          </p>
        </section>

        {/* A pergunta que o kit chama de mais importante que os três números. */}
        <p className="mt-6 border-l-2 border-[#0F766E] pl-5 text-slate-900 dark:text-slate-50">
          Das conversas que aconteceram, quantas você não teria tido de outro
          jeito?
        </p>

        <div className="mt-10">
          <FormularioEnvio />
        </div>

        <div className="mt-8">
          {envios.length === 0 ? (
            <p className="rounded-xl bg-slate-100 p-6 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              Nada anotado ainda. Anote no momento do envio — depois ninguém
              lembra.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {envios.map((envio) => (
                <li key={envio.id} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {envio.contato}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {envio.canal === "telefone" ? "por telefone" : "link enviado"} ·{" "}
                      {envio.criadoEm.toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Marcador envio={envio} campo="respondeu" rotulo="Respondeu" />
                    <Marcador envio={envio} campo="conversa" rotulo="Conversa" />
                    <Marcador envio={envio} campo="trabalho" rotulo="Virou trabalho" />

                    <form action={remover} className="ml-auto">
                      <input type="hidden" name="envioId" value={envio.id} />
                      <button
                        type="submit"
                        className="px-1 py-2 text-sm text-slate-400 underline underline-offset-4 transition hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        Apagar
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div>
      <dt className="text-sm text-slate-500 dark:text-slate-400">{rotulo}</dt>
      <dd className="font-mono text-2xl tabular-nums text-slate-900 dark:text-slate-50">
        {valor}
      </dd>
    </div>
  );
}

/**
 * Cada marcador é um formulário próprio: funciona sem JavaScript e não precisa
 * de estado no cliente. `py-2` mantém o alvo de toque acima do mínimo no celular.
 */
function Marcador({
  envio,
  campo,
  rotulo,
}: {
  envio: { id: string; respondeu: boolean; conversa: boolean; trabalho: boolean };
  campo: "respondeu" | "conversa" | "trabalho";
  rotulo: string;
}) {
  const ativo = envio[campo];

  return (
    <form action={marcar}>
      <input type="hidden" name="envioId" value={envio.id} />
      <input type="hidden" name="campo" value={campo} />
      <input type="hidden" name="valor" value={String(!ativo)} />
      <button
        type="submit"
        aria-pressed={ativo}
        className={`rounded-full border px-3 py-2 text-sm transition ${
          ativo
            ? "border-[#0F766E] bg-[#0F766E] text-white"
            : "border-slate-300 text-slate-600 hover:border-slate-500 dark:border-slate-700 dark:text-slate-300"
        }`}
      >
        {rotulo}
      </button>
    </form>
  );
}
