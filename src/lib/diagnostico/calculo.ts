/**
 * RF-05 (diferença) e RF-06 (fôlego em dias).
 *
 * NOTA DE PREMISSA — ler antes de alterar:
 * O documento v0.4 assume as seções 4.2/4.3 da v0.3 "sem alteração", mas o texto
 * dessas seções não acompanha o v0.4. As fórmulas abaixo são a leitura mínima
 * compatível com o uso que o RF-09 faz das duas grandezas (sinal de `diferenca`
 * e comparação de `folego_dias` com 30). Se o texto original da v0.3 divergir,
 * o ponto de correção é este arquivo — nada mais depende da fórmula.
 */

import type { EntradaDiagnostico, ErroValidacao } from "./tipos";

/** Base de conversão de gasto mensal para gasto diário. */
const DIAS_NO_MES = 30;

/**
 * RF-05 — diferença entre o que entrou e o que saiu no mês.
 * Negativo = saiu mais do que entrou.
 */
export function calcularDiferenca(entradas: number, saidas: number): number {
  return arredondarCentavos(entradas - saidas);
}

/**
 * RF-06 — por quantos dias o saldo em caixa cobre o ritmo de saída atual.
 *
 * Retorna `null` (e não zero, nem Infinity) quando a conta não faz sentido:
 * sem saldo informado, ou sem saídas — ambos os casos são "não dá para dizer",
 * que é diferente de "o fôlego é curto". O RF-09 depende dessa distinção para
 * não classificar como "urgente" quem apenas não preencheu o saldo.
 */
export function calcularFolegoDias(
  saldoCaixa: number | null | undefined,
  saidas: number,
): number | null {
  if (saldoCaixa === null || saldoCaixa === undefined) return null;
  if (saidas <= 0) return null;

  const saidaDiaria = saidas / DIAS_NO_MES;
  return Math.floor(saldoCaixa / saidaDiaria);
}

/**
 * Validação das entradas (RF-05).
 * Retorna lista vazia quando está tudo certo.
 */
export function validarEntrada(entrada: EntradaDiagnostico): ErroValidacao[] {
  const erros: ErroValidacao[] = [];

  for (const campo of ["entradas", "saidas"] as const) {
    const valor = entrada[campo];
    if (!Number.isFinite(valor)) {
      erros.push({ campo, mensagem: "Informe um valor numérico." });
    } else if (valor < 0) {
      erros.push({ campo, mensagem: "O valor não pode ser negativo." });
    }
  }

  const { saldoCaixa } = entrada;
  if (saldoCaixa !== null && saldoCaixa !== undefined) {
    if (!Number.isFinite(saldoCaixa)) {
      erros.push({ campo: "saldoCaixa", mensagem: "Informe um valor numérico." });
    } else if (saldoCaixa < 0) {
      erros.push({ campo: "saldoCaixa", mensagem: "O valor não pode ser negativo." });
    }
  }

  return erros;
}

/** Evita o ruído de ponto flutuante em somas de dinheiro (0.1 + 0.2). */
function arredondarCentavos(valor: number): number {
  return Math.round(valor * 100) / 100;
}
