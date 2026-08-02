/** Formatação de exibição. Puro, sem dependência de locale do servidor. */

const MOEDA = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export function formatarMoeda(valor: number): string {
  return MOEDA.format(valor);
}

/** Módulo do valor — a interface indica o sinal por rótulo, não por "-". */
export function formatarMoedaAbsoluta(valor: number): string {
  return MOEDA.format(Math.abs(valor));
}

export function formatarDias(dias: number): string {
  return dias === 1 ? "1 dia" : `${dias} dias`;
}

/**
 * Converte texto digitado em número.
 * Aceita "1.234,56", "1234,56" e "1234.56"; devolve NaN para o que não for número,
 * deixando a decisão de erro para `validarEntrada`.
 */
export function paraNumero(texto: string): number {
  const limpo = texto.trim().replace(/[R$\s ]/g, "");
  if (limpo === "") return NaN;

  // Se tem vírgula, ela é o separador decimal e o ponto é separador de milhar.
  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo;

  return Number(normalizado);
}
