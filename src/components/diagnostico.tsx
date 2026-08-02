"use client";

import { useMemo, useState } from "react";

import type { Marca } from "@/lib/marca";
import {
  diagnosticar,
  formatarDias,
  formatarMoedaAbsoluta,
  montarLinkWhatsapp,
  paraNumero,
  ROTULO_CENARIO,
  rotuloBotaoWhatsapp,
  validarEntrada,
  type ResultadoDiagnostico,
} from "@/lib/diagnostico";

type Campos = { entradas: string; saidas: string; saldoCaixa: string };

const CAMPOS_VAZIOS: Campos = { entradas: "", saidas: "", saldoCaixa: "" };

/**
 * Toda a conta acontece aqui, no navegador (RNF-05 / RF-23).
 * Não existe fetch, action, nem qualquer escrita — os números não saem do device.
 */
export function Diagnostico({ marca }: { marca: Marca }) {
  const [campos, setCampos] = useState<Campos>(CAMPOS_VAZIOS);
  const [resultado, setResultado] = useState<ResultadoDiagnostico | null>(null);
  const [erros, setErros] = useState<string[]>([]);

  const linkWhatsapp = useMemo(
    () => montarLinkWhatsapp(marca.whatsapp, marca.marca),
    [marca.whatsapp, marca.marca],
  );

  function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();

    const temSaldo = campos.saldoCaixa.trim() !== "";
    const entrada = {
      entradas: paraNumero(campos.entradas),
      saidas: paraNumero(campos.saidas),
      saldoCaixa: temSaldo ? paraNumero(campos.saldoCaixa) : null,
    };

    const problemas = validarEntrada(entrada);
    if (problemas.length > 0) {
      setErros(problemas.map((p) => `${ROTULO_CAMPO[p.campo]}: ${p.mensagem}`));
      setResultado(null);
      return;
    }

    setErros([]);
    setResultado(diagnosticar(entrada));
  }

  function recomecar() {
    setCampos(CAMPOS_VAZIOS);
    setResultado(null);
    setErros([]);
  }

  return (
    <div className="space-y-8">
      {resultado === null ? (
        <form onSubmit={aoEnviar} className="space-y-6" noValidate>
          <div className="space-y-5">
            <CampoMoeda
              id="entradas"
              rotulo="Quanto entrou no caixa no último mês?"
              valor={campos.entradas}
              aoMudar={(v) => setCampos((c) => ({ ...c, entradas: v }))}
            />
            <CampoMoeda
              id="saidas"
              rotulo="Quanto saiu no último mês?"
              valor={campos.saidas}
              aoMudar={(v) => setCampos((c) => ({ ...c, saidas: v }))}
            />
            <CampoMoeda
              id="saldoCaixa"
              rotulo="Quanto você tem em caixa hoje?"
              ajuda="Opcional. Com esse número dá para estimar por quantos dias o caixa cobre o ritmo atual."
              valor={campos.saldoCaixa}
              aoMudar={(v) => setCampos((c) => ({ ...c, saldoCaixa: v }))}
            />
          </div>

          {erros.length > 0 && (
            <ul
              role="alert"
              className="space-y-1 rounded-lg bg-rose-50 p-4 text-sm text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
            >
              {erros.map((erro) => (
                <li key={erro}>{erro}</li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            style={{ backgroundColor: marca.corPrimaria }}
            className="w-full rounded-lg px-6 py-3.5 font-medium text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Ver meu diagnóstico
          </button>
        </form>
      ) : (
        <Resultado
          resultado={resultado}
          marca={marca}
          linkWhatsapp={linkWhatsapp}
          aoRecomecar={recomecar}
        />
      )}
    </div>
  );
}

const ROTULO_CAMPO: Record<string, string> = {
  entradas: "Quanto entrou",
  saidas: "Quanto saiu",
  saldoCaixa: "Saldo em caixa",
};

function CampoMoeda({
  id,
  rotulo,
  ajuda,
  valor,
  aoMudar,
}: {
  id: string;
  rotulo: string;
  ajuda?: string;
  valor: string;
  aoMudar: (valor: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-medium text-slate-900 dark:text-slate-100">
        {rotulo}
      </label>
      {ajuda && (
        <p id={`${id}-ajuda`} className="text-sm text-slate-500 dark:text-slate-400">
          {ajuda}
        </p>
      )}
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
          R$
        </span>
        <input
          id={id}
          name={id}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          inputMode="decimal"
          autoComplete="off"
          aria-describedby={ajuda ? `${id}-ajuda` : undefined}
          placeholder="0,00"
          className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-11 text-lg tabular-nums text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
        />
      </div>
    </div>
  );
}

function Resultado({
  resultado,
  marca,
  linkWhatsapp,
  aoRecomecar,
}: {
  resultado: ResultadoDiagnostico;
  marca: Marca;
  linkWhatsapp: string | null;
  aoRecomecar: () => void;
}) {
  const { diferenca, folegoDias, projecao, cenario, cta } = resultado;
  const negativo = diferenca < 0;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {negativo ? "Saiu a mais do que entrou" : "Entrou a mais do que saiu"}
        </p>
        <p
          className="text-4xl font-semibold tracking-tight tabular-nums text-slate-900 sm:text-5xl dark:text-slate-50"
          style={{ color: negativo ? undefined : marca.corPrimaria }}
        >
          {formatarMoedaAbsoluta(diferenca)}
        </p>
        <p className="text-slate-600 dark:text-slate-300">{ROTULO_CENARIO[cenario]}</p>
      </div>

      {folegoDias !== null && (
        <div className="rounded-xl bg-slate-100 p-5 dark:bg-slate-800/60">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Mantido esse ritmo de saída, o caixa de hoje cobre
          </p>
          <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {formatarDias(folegoDias)}
          </p>
        </div>
      )}

      {projecao && (
        <div className="space-y-3">
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              Se os próximos três meses forem iguais a este
            </p>
            {/* A ressalva não é rodapé: sem ela a extrapolação vira previsão. */}
            <p className="text-sm text-slate-500 dark:text-slate-400">
              É uma conta de repetição, não uma previsão — serve para enxergar
              para onde o mês aponta.
            </p>
          </div>

          <ul className="divide-y divide-slate-200 rounded-xl bg-slate-100 px-5 dark:divide-slate-700 dark:bg-slate-800/60">
            {projecao.map((marco) => (
              <li key={marco.dias} className="flex items-baseline justify-between py-3">
                <span className="text-slate-600 dark:text-slate-300">
                  em {formatarDias(marco.dias)}
                </span>
                <span
                  className={`text-lg font-semibold tabular-nums ${
                    marco.saldoProjetado < 0
                      ? "text-rose-700 dark:text-rose-300"
                      : "text-slate-900 dark:text-slate-50"
                  }`}
                >
                  {marco.saldoProjetado < 0 ? "− " : ""}
                  {formatarMoedaAbsoluta(marco.saldoProjetado)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* RF-09: encerramento é sempre uma pergunta, nunca uma recomendação. */}
      <div className="border-t border-slate-200 pt-8 dark:border-slate-700">
        <p className="text-xl leading-relaxed font-medium text-balance text-slate-900 dark:text-slate-50">
          {cta}
        </p>

        {linkWhatsapp && (
          <a
            href={linkWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: marca.corPrimaria }}
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg px-6 py-3.5 font-medium text-white transition hover:brightness-110 sm:w-auto"
          >
            {rotuloBotaoWhatsapp(marca.marca)}
          </a>
        )}
      </div>

      {/* `py-3 -my-3` dá 44px de área de toque sem mudar o espaçamento visual —
          o alvo cresce, o layout não. */}
      <button
        type="button"
        onClick={aoRecomecar}
        className="-my-3 py-3 text-sm text-slate-500 underline underline-offset-4 transition hover:text-slate-900 dark:hover:text-slate-200"
      >
        Refazer com outros números
      </button>
    </div>
  );
}
