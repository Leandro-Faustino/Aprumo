import Link from "next/link";

import { sair } from "@/app/painel/acoes";
import { exigirSessao } from "@/lib/dal";

/** Cabeçalho compartilhado das telas autenticadas. */
export async function NavegacaoPainel({ atual }: { atual: "empresa" | "placar" }) {
  const sessao = await exigirSessao();

  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
        <nav className="flex gap-5">
          <Aba href="/painel" ativo={atual === "empresa"}>
            Minha empresa
          </Aba>
          <Aba href="/painel/placar" ativo={atual === "placar"}>
            Placar
          </Aba>
        </nav>

        <div className="flex items-center gap-4">
          <span className="truncate text-sm text-slate-500 dark:text-slate-400">
            {sessao.email}
          </span>
          <form action={sair}>
            <button
              type="submit"
              className="py-2 text-sm text-slate-500 underline underline-offset-4 transition hover:text-slate-900 dark:hover:text-slate-200"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

function Aba({
  href,
  ativo,
  children,
}: {
  href: string;
  ativo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={ativo ? "page" : undefined}
      className={`py-2 text-sm font-medium transition ${
        ativo
          ? "text-slate-900 dark:text-slate-50"
          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
      }`}
    >
      {children}
    </Link>
  );
}
