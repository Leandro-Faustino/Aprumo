/**
 * Marcadores de conteúdo pendente.
 *
 * Deliberadamente destoantes do resto da página. Se um valor pendente parecesse
 * texto normal, a página seria publicada com ele — o objetivo aqui é que seja
 * impossível olhar para a tela e não ver o que falta.
 */

export function Falta({ children }: { children: React.ReactNode }) {
  return (
    <mark className="mx-0.5 rounded-sm border border-dashed border-amber-500 bg-amber-100 px-1.5 py-0.5 text-[0.9em] font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      falta: {children}
    </mark>
  );
}

/** Bloco inteiro travado por verificação externa. */
export function Travado({
  motivo,
  children,
}: {
  motivo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-amber-500 bg-amber-50/60 p-5 dark:bg-amber-950/30">
      <p className="mb-3 text-sm font-medium tracking-wide text-amber-900 uppercase dark:text-amber-200">
        Bloqueado até: {motivo}
      </p>
      <div className="text-slate-500 dark:text-slate-400">{children}</div>
    </div>
  );
}

/** Título de seção, com numeração discreta para casar com o documento. */
export function TituloSecao({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="text-2xl font-semibold tracking-tight text-balance text-slate-900 sm:text-3xl dark:text-slate-50"
    >
      {children}
    </h2>
  );
}

export function Secao({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`border-t border-slate-200 dark:border-slate-800 ${className}`}>
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">{children}</div>
    </section>
  );
}
