import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Link inválido — Aprumo" };

export default function Page() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Esse link não funciona mais
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Links de acesso valem por pouco tempo e só podem ser usados uma vez.
        Peça um novo — leva alguns segundos.
      </p>
      <Link
        href="/entrar"
        className="mt-8 inline-flex justify-center rounded-lg bg-slate-900 px-6 py-3.5 font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        Pedir novo link
      </Link>
    </main>
  );
}
