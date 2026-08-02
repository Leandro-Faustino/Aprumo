import type { Metadata } from "next";
import { headers } from "next/headers";

import { exigirSessao, minhaEmpresa } from "@/lib/dal";

import { sair } from "./acoes";
import { FormularioEmpresa } from "./formulario";

export const metadata: Metadata = { title: "Minha empresa — Aprumo" };

export default async function Page() {
  // Autorização acontece aqui, junto do acesso a dados — não no proxy.
  const sessao = await exigirSessao();
  const empresa = await minhaEmpresa();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-4">
          <span className="truncate text-sm text-slate-500 dark:text-slate-400">
            {sessao.email}
          </span>
          <form action={sair}>
            <button
              type="submit"
              className="text-sm text-slate-500 underline underline-offset-4 transition hover:text-slate-900 dark:hover:text-slate-200"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Minha empresa
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {empresa
              ? "Estes dados aparecem na página que seus clientes abrem."
              : "Preencha para gerar o link que você vai enviar aos seus clientes."}
          </p>
        </div>

        <FormularioEmpresa
          empresa={empresa}
          urlBase={await urlBase()}
          usuarioId={sessao.usuarioId}
        />
      </main>
    </div>
  );
}

async function urlBase(): Promise<string> {
  const configurada = process.env.NEXT_PUBLIC_SITE_URL;
  if (configurada) return configurada.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const cabecalhos = await headers();
  return cabecalhos.get("x-forwarded-host") ?? cabecalhos.get("host") ?? "";
}
