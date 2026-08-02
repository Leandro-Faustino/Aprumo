import { formatarMoeda } from "@/lib/diagnostico";
import { CASO_HERO } from "@/lib/lp";

import { Falta } from "./marcadores";

/** Texto e destino únicos, repetidos nas cinco aparições (§ transversais). */
export const CTA_TEXTO = "Quero uma das dez vagas";
export const CTA_DESTINO = "#candidatura";

export function BotaoCta({ variante = "primario" }: { variante?: "primario" | "secundario" }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-6 py-3.5 font-medium transition";

  return (
    <a
      href={CTA_DESTINO}
      className={
        variante === "primario"
          ? `${base} bg-[#0F766E] text-white hover:brightness-110`
          : `${base} border border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800`
      }
    >
      {CTA_TEXTO}
    </a>
  );
}

/**
 * Barra superior: só logo e CTA.
 *
 * Sem menu, por decisão de arquitetura — página de conversão única, e link de
 * navegação aqui só oferece saída. Monocromática: não há escritório para
 * representar nesta camada.
 */
export function BarraSuperior() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
        <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Aprumo
        </span>
        <a
          href={CTA_DESTINO}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {CTA_TEXTO}
        </a>
      </div>
    </header>
  );
}

/**
 * A peça: duas barras com números reais e a linha de prumo.
 *
 * Sem cor semântica — as duas barras têm o mesmo tom. O que comunica é a linha
 * de prumo marcando o que entrou, e a parte da barra de saídas que a ultrapassa.
 * Estática: a barra aparece pronta, nunca anima. Animar a revelação transforma
 * constatação em espetáculo, que é o gênero que a marca combate.
 */
export function PecaPrumo() {
  const { entradas, saidas } = CASO_HERO;
  const maior = Math.max(entradas, saidas);
  const larguraEntradas = (entradas / maior) * 100;
  const larguraSaidas = (saidas / maior) * 100;

  return (
    <figure className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <figcaption className="mb-5 text-sm text-slate-500 dark:text-slate-400">
        Escritório Exemplo · último mês
      </figcaption>

      <div className="space-y-5">
        <Barra rotulo="Entrou" valor={entradas} largura={larguraEntradas} prumo={larguraEntradas} />
        <Barra rotulo="Saiu" valor={saidas} largura={larguraSaidas} prumo={larguraEntradas} />
      </div>

      <p className="mt-6 border-t border-slate-200 pt-4 text-slate-700 dark:border-slate-700 dark:text-slate-200">
        Saiu {formatarMoeda(saidas - entradas)} a mais do que entrou.
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Este instrumento produz estimativa de caixa. Não substitui a apuração
        contábil.
      </p>
    </figure>
  );
}

function Barra({
  rotulo,
  valor,
  largura,
  prumo,
}: {
  rotulo: string;
  valor: number;
  largura: number;
  /** Posição da linha de prumo, em % — a mesma nas duas barras. */
  prumo: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-slate-500 dark:text-slate-400">{rotulo}</span>
        <span className="font-mono text-lg tabular-nums text-slate-900 dark:text-slate-50">
          {formatarMoeda(valor)}
        </span>
      </div>
      <div className="relative h-3 w-full rounded-sm bg-slate-100 dark:bg-slate-800">
        <div
          className="h-3 rounded-sm bg-slate-400 dark:bg-slate-500"
          style={{ width: `${largura}%` }}
        />
        {/* A linha de prumo fica dentro da barra, não sobre os números: é ali
            que ela significa algo — marca o nível do que entrou, e o que passa
            dela na barra de saídas é o excedente. */}
        <div
          aria-hidden
          className="absolute -top-1 -bottom-1 w-px bg-[#0F766E]"
          style={{ left: `${prumo}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Hero. Objetivo é parar e obrigar a ler a segunda frase — não vender.
 * Headline A (recomendada no documento): dor nomeada + mecanismo.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-14 pb-12 sm:pt-20">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Para escritórios de contabilidade de 1 a 15 pessoas
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl dark:text-slate-50">
        Seu cliente nunca pediu essa conversa. E é a única que ele precisa ter.
      </h1>

      <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
        Três números que ele já tem viram uma constatação que abre pauta técnica
        — com a sua marca em cima e o seu CRC embaixo.
      </p>

      <div className="mt-8">
        <BotaoCta />
      </div>

      {/* Escassez em texto corrido, nunca em selo. */}
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        São dez escritórios na turma fundadora. A turma começa em{" "}
        <Falta>data de início</Falta>.
      </p>

      <div className="mt-12">
        <PecaPrumo />
      </div>
    </section>
  );
}
