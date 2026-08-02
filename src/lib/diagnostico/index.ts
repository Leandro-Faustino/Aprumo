import { calcularDiferenca, calcularFolegoDias, validarEntrada } from "./calculo";
import { ctaDoCenario, selecionarCenario } from "./cenario";
import { projetar90Dias } from "./projecao";
import type { EntradaDiagnostico, ResultadoDiagnostico } from "./tipos";

export * from "./tipos";
export * from "./calculo";
export * from "./cenario";
export * from "./whatsapp";
export * from "./formato";
export * from "./projecao";

/**
 * Ponto de entrada do núcleo: RF-05 -> RF-06 -> RF-09, nessa ordem.
 * Função pura. Lança se a entrada não passou por `validarEntrada`.
 */
export function diagnosticar(entrada: EntradaDiagnostico): ResultadoDiagnostico {
  const erros = validarEntrada(entrada);
  if (erros.length > 0) {
    throw new Error(
      `Entrada inválida: ${erros.map((e) => `${e.campo} — ${e.mensagem}`).join("; ")}`,
    );
  }

  const diferenca = calcularDiferenca(entrada.entradas, entrada.saidas);
  const folegoDias = calcularFolegoDias(entrada.saldoCaixa, entrada.saidas);
  const projecao = projetar90Dias(entrada.saldoCaixa, diferenca);
  const cenario = selecionarCenario(diferenca, folegoDias);

  return { diferenca, folegoDias, projecao, cenario, cta: ctaDoCenario(cenario) };
}
