"use client";

import { useActionState } from "react";

import { enviarCandidatura, type EstadoCandidatura } from "@/app/acoes-candidatura";
import { FAIXAS_CARTEIRA } from "@/lib/candidatura";

import { CTA_TEXTO } from "./hero";
import { Falta } from "./marcadores";

const INICIAL: EstadoCandidatura = { status: "inicial" };

export function FormularioCandidatura() {
  const [estado, acao, enviando] = useActionState(enviarCandidatura, INICIAL);

  if (estado.status === "enviada") {
    return (
      <div className="rounded-xl border border-slate-300 p-6 dark:border-slate-700">
        <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
          Candidatura registrada.
        </p>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Respondo em <Falta>prazo real de resposta</Falta> pelo WhatsApp que
          você informou. Na conversa de 30 minutos eu pergunto como sua carteira
          funciona hoje e mostro o instrumento com números de um cliente seu —
          não é apresentação de vendas.
        </p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Você não vai receber sequência de e-mails.
        </p>
      </div>
    );
  }

  return (
    <form action={acao} className="space-y-6">
      <Campo
        id="nomeEscritorio"
        rotulo="Seu nome e o do escritório"
        placeholder="Ana Ribeiro — Ribeiro Contabilidade"
        required
      />

      <Campo
        id="whatsapp"
        rotulo="WhatsApp"
        type="tel"
        inputMode="tel"
        placeholder="(11) 98765-4321"
        required
      />

      <div className="space-y-2">
        <label
          htmlFor="clientesAtivos"
          className="block font-medium text-slate-900 dark:text-slate-100"
        >
          Quantos clientes ativos na carteira
        </label>
        <select
          id="clientesAtivos"
          name="clientesAtivos"
          required
          defaultValue=""
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
        >
          <option value="" disabled>
            Escolha uma faixa
          </option>
          {FAIXAS_CARTEIRA.map((faixa) => (
            <option key={faixa} value={faixa}>
              {faixa}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="origemUltimosClientes"
          className="block font-medium text-slate-900 dark:text-slate-100"
        >
          Como chegaram seus últimos três clientes
        </label>
        <textarea
          id="origemUltimosClientes"
          name="origemUltimosClientes"
          rows={4}
          required
          placeholder="Quem indicou, em que situação, quanto tempo levou."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
        />
      </div>

      <Campo
        id="empresaParaEnviar"
        rotulo="Cite uma empresa para quem você mandaria isso esta semana"
        placeholder="O nome basta."
        ajuda="Se nenhum nome veio à cabeça agora, vale conversarmos sobre sua lista antes de falar do instrumento."
        required
      />

      {estado.status === "erro" && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 p-4 text-sm text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
        >
          {estado.mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-lg bg-[#0F766E] px-6 py-3.5 font-medium text-white transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
      >
        {enviando ? "Enviando..." : CTA_TEXTO}
      </button>
    </form>
  );
}

function Campo({
  id,
  rotulo,
  ajuda,
  ...props
}: { id: string; rotulo: string; ajuda?: string } & React.ComponentProps<"input">) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-medium text-slate-900 dark:text-slate-100">
        {rotulo}
      </label>
      <input
        id={id}
        name={id}
        {...props}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
      />
      {ajuda && <p className="text-sm text-slate-500 dark:text-slate-400">{ajuda}</p>}
    </div>
  );
}
