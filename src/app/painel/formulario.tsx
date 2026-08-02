"use client";

import { useActionState, useState } from "react";

import type { Marca } from "@/lib/marca";

import { salvarEmpresa, type EstadoPainel } from "./acoes";
import { CampoLogo } from "./campo-logo";

const INICIAL: EstadoPainel = { status: "inicial" };

/**
 * Bloco único de configuração (RF-30).
 *
 * O critério de aceite é preenchimento em até 2 minutos. Daí as escolhas:
 * dois campos obrigatórios só (endereço e nome), o resto agrupado como
 * opcional e declarado como tal, e a cor num seletor em vez de campo de texto
 * hex. Continua sendo um teste de usabilidade que decide se passou.
 */
export function FormularioEmpresa({
  empresa,
  urlBase,
  usuarioId,
}: {
  empresa: Marca | null;
  urlBase: string;
  usuarioId: string;
}) {
  const [estado, acao, salvando] = useActionState(salvarEmpresa, INICIAL);
  const [slug, setSlug] = useState(empresa?.slug ?? "");
  const [cor, setCor] = useState(empresa?.corPrimaria ?? "#0F766E");

  return (
    <form action={acao} className="space-y-10">
      <section className="space-y-5">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">O essencial</h2>

        <Campo
          id="marca"
          rotulo="Nome que aparece na página"
          defaultValue={empresa?.marca ?? ""}
          required
          placeholder="Silva Contabilidade"
        />

        <div className="space-y-2">
          <label htmlFor="slug" className="block font-medium text-slate-900 dark:text-slate-100">
            Endereço do seu link
          </label>
          <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:ring-slate-700">
            <span className="shrink-0 pl-4 text-sm text-slate-400">{urlBase}/d/</span>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="silva-contabil"
              className="w-full bg-transparent py-3 pr-4 pl-0.5 text-slate-900 outline-none dark:text-slate-100"
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Letras minúsculas, números e hífens. É o link que você envia aos clientes.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            O opcional
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pode deixar em branco — a página funciona igual, só sem esses elementos.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="whatsapp"
            className="block font-medium text-slate-900 dark:text-slate-100"
          >
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            defaultValue={empresa?.whatsapp ?? ""}
            inputMode="tel"
            placeholder="(11) 98765-4321"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sem isso, a página não mostra botão de conversa.
          </p>
        </div>

        <Campo
          id="crc"
          rotulo="CRC"
          defaultValue={empresa?.crc ?? ""}
          placeholder="SP-123456/O-4"
        />
        <CampoLogo usuarioId={usuarioId} valorInicial={empresa?.logoUrl ?? null} />
        <Campo
          id="rodape"
          rotulo="Rodapé"
          defaultValue={empresa?.rodape ?? ""}
          placeholder="Silva Contabilidade — São Paulo/SP"
        />

        <div className="space-y-2">
          <label
            htmlFor="corPrimaria"
            className="block font-medium text-slate-900 dark:text-slate-100"
          >
            Cor principal
          </label>
          <div className="flex items-center gap-3">
            <input
              id="corPrimaria"
              name="corPrimaria"
              type="color"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              className="h-11 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
            />
            <span className="font-mono text-sm text-slate-500 dark:text-slate-400">{cor}</span>
          </div>
        </div>
      </section>

      {estado.status === "erro" && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 p-4 text-sm text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
        >
          {estado.mensagem}
        </p>
      )}

      {estado.status === "salvo" && (
        <div className="rounded-lg bg-emerald-50 p-4 text-sm dark:bg-emerald-950/40">
          <p className="font-medium text-emerald-900 dark:text-emerald-100">Salvo.</p>
          <a
            href={`/d/${estado.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-800 underline underline-offset-4 dark:text-emerald-200"
          >
            Abrir minha página
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={salvando}
        style={{ backgroundColor: cor }}
        className="w-full rounded-lg px-6 py-3.5 font-medium text-white transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
      >
        {salvando ? "Salvando..." : "Salvar"}
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
