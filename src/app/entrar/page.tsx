import type { Metadata } from "next";

import { FormularioEntrar } from "./formulario";

export const metadata: Metadata = { title: "Entrar — Aprumo" };

export default function Page() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Entrar
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Sem senha: você recebe um link de acesso por e-mail.
        </p>
      </div>

      <FormularioEntrar />
    </main>
  );
}
