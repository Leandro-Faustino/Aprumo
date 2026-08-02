/**
 * RF-07 — PROPOSTA, NÃO CONFIRMADA. Ler antes de usar.
 *
 * O texto da seção 4.4 da v0.3 não acompanha o documento v0.4, que só cita o
 * RF-07 pelo identificador. Este arquivo é uma proposta de leitura, construída
 * a partir de duas evidências:
 *
 *   1. o produto se chama "Diagnóstico de 90 dias", mas RF-05 (diferença) e
 *      RF-06 (fôlego) só olham para o mês corrente — falta a grandeza que
 *      justifica o nome;
 *   2. a seção 4.4 fica entre o fôlego (4.3) e o encerramento (4.5), a posição
 *      natural de uma projeção.
 *
 * COMO SUBSTITUIR quando o texto real chegar: todo o RF-07 vive neste arquivo e
 * em `projecao.test.ts`. Nada do RF-05/RF-06/RF-09 depende dele — a projeção é
 * calculada a partir de valores já prontos e é puramente aditiva na tela.
 *
 * O que a projeção NÃO é: previsão, meta ou recomendação. É a extrapolação de
 * um único mês repetido, e a interface precisa dizer isso com essas palavras,
 * senão vira conselho financeiro travestido de número (RF-08 e a regra de
 * "fora sempre: recomendação").
 */

import type { Marco } from "./tipos";

/** Marcos do horizonte de 90 dias. */
const MARCOS_DIAS = [30, 60, 90] as const;

const DIAS_NO_MES = 30;

/**
 * Projeta o saldo em caixa nos próximos 30, 60 e 90 dias, supondo que o ritmo
 * do mês analisado se repita.
 *
 * Usa a diferença líquida (entradas − saídas), e não o ritmo de saída do RF-06.
 * São perguntas diferentes, de propósito:
 *   - RF-06 responde "se nada mais entrar, quanto tempo o caixa cobre";
 *   - RF-07 responde "se os próximos meses forem iguais a este, onde eu chego".
 *
 * Retorna `null` quando o saldo em caixa não foi informado — sem ponto de
 * partida não há projeção, e chutar zero como saldo inicial produziria número
 * errado com cara de certo.
 */
export function projetar90Dias(
  saldoCaixa: number | null | undefined,
  diferenca: number,
): Marco[] | null {
  if (saldoCaixa === null || saldoCaixa === undefined) return null;
  if (!Number.isFinite(saldoCaixa) || !Number.isFinite(diferenca)) return null;

  return MARCOS_DIAS.map((dias) => ({
    dias,
    saldoProjetado: arredondarCentavos(saldoCaixa + diferenca * (dias / DIAS_NO_MES)),
  }));
}

/**
 * Primeiro marco em que o saldo projetado fica negativo, se algum ficar.
 * Serve para a interface destacar o momento, sem emitir juízo sobre ele.
 */
export function primeiroMarcoNegativo(marcos: Marco[] | null): Marco | null {
  if (!marcos) return null;
  return marcos.find((m) => m.saldoProjetado < 0) ?? null;
}

function arredondarCentavos(valor: number): number {
  return Math.round(valor * 100) / 100;
}
