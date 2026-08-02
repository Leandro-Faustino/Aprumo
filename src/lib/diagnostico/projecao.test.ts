import { describe, expect, it } from "vitest";

import { diagnosticar } from "./index";
import { primeiroMarcoNegativo, projetar90Dias } from "./projecao";

/**
 * RF-07 (proposto). Estes casos vêm da proposta descrita em `projecao.ts`,
 * não de uma tabela do documento — se a v0.3 divergir, este arquivo é reescrito
 * junto com o módulo.
 */
describe("RF-07 (proposto) — projeção de 90 dias", () => {
  it("projeta os três marcos com diferença negativa", () => {
    // Saldo 12.000, queimando 5.000/mês.
    expect(projetar90Dias(12000, -5000)).toEqual([
      { dias: 30, saldoProjetado: 7000 },
      { dias: 60, saldoProjetado: 2000 },
      { dias: 90, saldoProjetado: -3000 },
    ]);
  });

  it("projeta crescimento com diferença positiva", () => {
    expect(projetar90Dias(10000, 3000)).toEqual([
      { dias: 30, saldoProjetado: 13000 },
      { dias: 60, saldoProjetado: 16000 },
      { dias: 90, saldoProjetado: 19000 },
    ]);
  });

  it("mantém o saldo quando o mês empata", () => {
    const marcos = projetar90Dias(8000, 0)!;
    expect(marcos.every((m) => m.saldoProjetado === 8000)).toBe(true);
  });

  it("é null sem saldo em caixa — não assume zero", () => {
    expect(projetar90Dias(null, -5000)).toBeNull();
    expect(projetar90Dias(undefined, -5000)).toBeNull();
  });

  it("é null diante de valor não finito", () => {
    expect(projetar90Dias(NaN, -5000)).toBeNull();
    expect(projetar90Dias(1000, Infinity)).toBeNull();
  });

  it("não acumula ruído de ponto flutuante", () => {
    const marcos = projetar90Dias(0.3, 0.1)!;
    expect(marcos[0].saldoProjetado).toBe(0.4);
  });
});

describe("primeiro marco negativo", () => {
  it("aponta o primeiro marco em que o saldo fica negativo", () => {
    const marcos = projetar90Dias(12000, -5000);
    expect(primeiroMarcoNegativo(marcos)).toEqual({ dias: 90, saldoProjetado: -3000 });
  });

  it("é null quando nenhum marco fica negativo", () => {
    expect(primeiroMarcoNegativo(projetar90Dias(10000, 3000))).toBeNull();
  });

  it("é null quando não há projeção", () => {
    expect(primeiroMarcoNegativo(null)).toBeNull();
  });
});

describe("RF-07 não interfere em RF-05/RF-06/RF-09", () => {
  it("o cenário continua saindo da diferença e do fôlego", () => {
    const r = diagnosticar({ entradas: 5000, saidas: 10000, saldoCaixa: 4000 });

    expect(r.cenario).toBe("urgente");
    expect(r.diferenca).toBe(-5000);
    expect(r.folegoDias).toBe(12);
    // A projeção é aditiva: existe, mas não muda nada acima.
    expect(r.projecao).not.toBeNull();
  });

  it("sem saldo, o diagnóstico segue completo e só a projeção falta", () => {
    const r = diagnosticar({ entradas: 13000, saidas: 10000 });

    expect(r.projecao).toBeNull();
    expect(r.cenario).toBe("estavel");
    expect(r.cta).toContain("diferente dos outros");
  });
});
