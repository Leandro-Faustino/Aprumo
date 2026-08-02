/**
 * RF-21 — handoff por WhatsApp, com a degradação exigida pelo RF-32.
 *
 * DECISÃO DE PRIVACIDADE (RNF-05):
 * A mensagem pré-preenchida NÃO carrega nenhum valor financeiro — nem entradas,
 * nem saídas, nem diferença, nem fôlego. Um link `wa.me?text=...` sai do
 * dispositivo e passa por terceiros; incluir os números ali seria fazer dado
 * financeiro trafegar, exatamente o que a RNF-05 proíbe. A mensagem carrega
 * apenas a intenção de conversar. O contexto do resultado quem dá é o cliente,
 * na conversa — que é o momento em que o roteiro do RF-24 entra.
 */

import type { Cenario } from "./tipos";

/**
 * Normaliza o telefone para o formato aceito pelo wa.me (só dígitos, com DDI).
 * Assume Brasil (+55) quando o número vem sem DDI.
 * Retorna `null` quando não sobra número plausível — RF-32.
 */
export function normalizarWhatsapp(bruto: string | null | undefined): string | null {
  if (!bruto) return null;

  const digitos = bruto.replace(/\D/g, "");
  if (digitos.length < 10) return null;

  // 10 = fixo com DDD, 11 = celular com DDD. Ambos sem DDI.
  const comDdi = digitos.length <= 11 ? `55${digitos}` : digitos;

  // DDI + DDD + número: 12 ou 13 dígitos no Brasil. Acima disso, deixa passar
  // (outro país), abaixo já foi barrado.
  return comDdi;
}

/**
 * Texto da mensagem. `marca` é opcional: sem ela a frase continua correta em
 * português, sem "Olá, " seguido de vazio (RF-32).
 */
export function montarMensagem(marca: string | null | undefined): string {
  const destino = marca?.trim();

  return destino
    ? `Olá! Fiz o diagnóstico de 90 dias no site da ${destino} e queria conversar sobre o resultado.`
    : "Olá! Fiz o diagnóstico de 90 dias e queria conversar sobre o resultado.";
}

/**
 * Monta o link completo. Retorna `null` quando não há WhatsApp configurado —
 * o chamador deve simplesmente não renderizar o botão, mantendo o layout íntegro.
 */
export function montarLinkWhatsapp(
  whatsapp: string | null | undefined,
  marca: string | null | undefined,
): string | null {
  const numero = normalizarWhatsapp(whatsapp);
  if (!numero) return null;

  return `https://wa.me/${numero}?text=${encodeURIComponent(montarMensagem(marca))}`;
}

/**
 * Rótulo do botão. Também degrada sem marca (RF-32).
 * Mantido como convite, não como verbo de venda (RF-08/RF-09).
 */
export function rotuloBotaoWhatsapp(marca: string | null | undefined): string {
  const destino = marca?.trim();
  return destino ? `Conversar com ${destino}` : "Conversar no WhatsApp";
}

/** Cenário não entra na mensagem (ver decisão de privacidade acima), mas o roteiro usa. */
export type { Cenario };
