"use client";

import { useActionState } from "react";

import { enviarLinkMagico, type EstadoEntrar } from "./acoes";

const INICIAL: EstadoEntrar = { status: "inicial" };

export function FormularioEntrar() {
  const [estado, acao, enviando] = useActionState(enviarLinkMagico, INICIAL);

  if (estado.status === "enviado") {
    return (
      <div className="space-y-3 rounded-xl bg-emerald-50 p-6 dark:bg-emerald-950/40">
        <p className="font-medium text-emerald-900 dark:text-emerald-100">
          Link enviado. Confira seu e-mail.
        </p>
        <p className="text-sm text-emerald-800 dark:text-emerald-200">
          O link vale por pouco tempo e abre sua conta direto, sem senha. Se não
          aparecer em alguns minutos, veja também a caixa de spam.
        </p>
      </div>
    );
  }

  return (
    <form action={acao} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="block font-medium text-slate-900 dark:text-slate-100">
          Seu e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@escritorio.com.br"
          aria-describedby={estado.status === "erro" ? "erro-entrar" : undefined}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
        />
      </div>

      {estado.status === "erro" && (
        <p
          id="erro-entrar"
          role="alert"
          className="rounded-lg bg-rose-50 p-4 text-sm text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
        >
          {estado.mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-lg bg-slate-900 px-6 py-3.5 font-medium text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        {enviando ? "Enviando..." : "Receber link de acesso"}
      </button>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Não tem conta ainda? Use o mesmo campo — o primeiro acesso já cria a sua.
      </p>
    </form>
  );
}
