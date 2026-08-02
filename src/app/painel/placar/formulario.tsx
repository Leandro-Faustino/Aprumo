"use client";

import { useActionState, useRef } from "react";

import { anotarEnvio, type EstadoPlacar } from "./acoes";

const INICIAL: EstadoPlacar = { status: "inicial" };

/**
 * Anotar um envio. Dois campos e trinta segundos — se demorar mais que isso,
 * o contador para de anotar e o placar morre.
 */
export function FormularioEnvio() {
  const [estado, acao, salvando] = useActionState(anotarEnvio, INICIAL);
  const form = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={form}
      action={async (formData) => {
        await acao(formData);
        form.current?.reset();
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1 space-y-2">
        <label htmlFor="contato" className="block text-sm font-medium text-slate-900 dark:text-slate-100">
          Para quem
        </label>
        <input
          id="contato"
          name="contato"
          required
          maxLength={120}
          placeholder="Padaria do Zé — ou só as iniciais"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="canal" className="block text-sm font-medium text-slate-900 dark:text-slate-100">
          Como
        </label>
        <select
          id="canal"
          name="canal"
          defaultValue="envio"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:w-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
        >
          <option value="envio">Mandei o link</option>
          <option value="telefone">Por telefone</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={salvando}
        className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        {salvando ? "Anotando..." : "Anotar"}
      </button>

      {estado.status === "erro" && (
        <p role="alert" className="text-sm text-rose-700 sm:w-full dark:text-rose-300">
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
