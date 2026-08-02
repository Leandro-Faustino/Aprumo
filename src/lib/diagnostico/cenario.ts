/**
 * RF-09 revisado — CTA final por cenário.
 *
 * Regra que não pode ser quebrada: as três variações são PERGUNTAS, nunca
 * recomendações. Nenhuma pode conter verbo no imperativo dirigido a uma ação
 * financeira ("reduza", "controle", "negocie") — isso cruzaria a linha de
 * "fora sempre: recomendação de regime tributário" e criaria responsabilidade
 * técnica indevida. Há teste automatizado guardando esta regra
 * (`cenario.test.ts` → "nenhum CTA contém verbo imperativo").
 */

import type { Cenario } from "./tipos";

/** Abaixo deste fôlego, diferença negativa vira "urgente". Limite é `<`, não `<=`. */
const LIMITE_FOLEGO_URGENTE_DIAS = 30;

/**
 * Seleção de texto (não é cálculo numérico):
 *
 *   se diferenca < 0 e folego_dias < 30 -> "urgente"
 *   senão se diferenca < 0              -> "atenção"
 *   senão                               -> "estável"
 *
 * Fôlego desconhecido (`null`) nunca produz "urgente": sem o dado não é
 * possível afirmar que o fôlego é curto, então o pior caso assumido é "atenção".
 */
export function selecionarCenario(
  diferenca: number,
  folegoDias: number | null,
): Cenario {
  if (diferenca < 0) {
    if (folegoDias !== null && folegoDias < LIMITE_FOLEGO_URGENTE_DIAS) {
      return "urgente";
    }
    return "atencao";
  }
  return "estavel";
}

/** RF-09 — os três textos finais. Todos terminam em "?" e mantêm RF-08 (não-acusatório). */
export const CTA_POR_CENARIO: Record<Cenario, string> = {
  urgente: "Você sabe se isso veio de um mês atípico ou é um padrão dos últimos meses?",
  atencao: "Esse número te surpreendeu ou já era o que você esperava?",
  estavel: "Você sabe dizer o que fez esse mês ser diferente dos outros?",
};

export function ctaDoCenario(cenario: Cenario): string {
  return CTA_POR_CENARIO[cenario];
}

/**
 * Rótulo neutro do cenário para a interface.
 * Deliberadamente sem juízo de valor ("ruim", "crítico") — RF-08.
 */
export const ROTULO_CENARIO: Record<Cenario, string> = {
  urgente: "Saiu mais do que entrou, e o caixa cobre menos de 30 dias",
  atencao: "Saiu mais do que entrou neste mês",
  estavel: "Entrou mais do que saiu neste mês",
};
