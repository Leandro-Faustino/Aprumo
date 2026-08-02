/**
 * Tipos do núcleo de diagnóstico.
 *
 * Todo este módulo é puro e sem I/O: roda no navegador, não importa nada de
 * servidor, banco ou rede. É o que garante RNF-05 e RF-23 na prática — não há
 * caminho de código daqui até uma chamada de rede.
 */

/** Entradas brutas informadas pelo cliente final, já convertidas para número. */
export type EntradaDiagnostico = {
  /** Total que entrou no caixa no mês, em reais. */
  entradas: number;
  /** Total que saiu do caixa no mês, em reais. */
  saidas: number;
  /**
   * Saldo disponível em caixa hoje, em reais.
   * Opcional: sem ele não há como calcular fôlego (RF-06).
   */
  saldoCaixa?: number | null;
};

/** Cenário de resultado — chave compartilhada entre RF-09 (CTA) e RF-24 (roteiro). */
export type Cenario = "urgente" | "atencao" | "estavel";

/** Um ponto da projeção de 90 dias (RF-07 proposto — ver `projecao.ts`). */
export type Marco = {
  dias: number;
  saldoProjetado: number;
};

export type ResultadoDiagnostico = {
  /** RF-05 */
  diferenca: number;
  /** RF-06 — `null` quando não há dados suficientes para calcular. */
  folegoDias: number | null;
  /** RF-07 (proposto) — `null` sem saldo em caixa informado. */
  projecao: Marco[] | null;
  /** RF-09 */
  cenario: Cenario;
  /** RF-09 — pergunta final, nunca recomendação. */
  cta: string;
};

export type ErroValidacao = {
  campo: keyof EntradaDiagnostico;
  mensagem: string;
};
