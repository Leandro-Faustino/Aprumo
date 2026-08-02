import { Diagnostico } from "@/components/diagnostico";
import type { Marca } from "@/lib/marca";

/**
 * Casca white-label da página (RF-30) com a degradação do RF-32:
 * sem logo, sem CRC e sem rodapé o layout continua íntegro — cada bloco
 * opcional simplesmente não é renderizado, nada vira espaço vazio ou "undefined".
 */
export function PaginaDiagnostico({ marca }: { marca: Marca }) {
  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-5">
          {marca.logoUrl ? (
            /* Logo é URL arbitrária do contador — <img> evita exigir allowlist
               de domínios no next.config a cada cliente novo (RF-30). */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={marca.logoUrl}
              alt={marca.marca}
              className="h-9 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {marca.marca}
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 sm:py-16">
        <div className="mb-10 space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-balance text-slate-900 sm:text-4xl dark:text-slate-50">
            Como está o caixa do seu negócio?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Três números do último mês. Leva menos de um minuto.
          </p>
        </div>

        <Diagnostico marca={marca} />

        {/* RNF-05 / RF-23 — dito na cara do usuário, não só no código. */}
        <p className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Seus números ficam neste navegador. Nada é enviado, salvo ou
          compartilhado — nem com {marca.marca}.
        </p>
      </main>

      {(marca.crc || marca.rodape) && (
        <footer className="border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-2xl space-y-1 px-6 py-6 text-sm text-slate-500 dark:text-slate-400">
            {marca.rodape && <p>{marca.rodape}</p>}
            {marca.crc && <p>CRC {marca.crc}</p>}
          </div>
        </footer>
      )}
    </div>
  );
}
