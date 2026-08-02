import { describe, expect, it } from "vitest";

import { CTA_POR_CENARIO, selecionarCenario } from "./cenario";
import { diagnosticar } from "./index";

/**
 * Casos de teste da tabela do RF-09 (v0.4, seção 4.5), um para um.
 */
describe("RF-09 — seleção de cenário", () => {
  const casos = [
    { n: 1, diferenca: -5000, folego: 12, esperado: "urgente" },
    { n: 2, diferenca: -5000, folego: 90, esperado: "atencao" },
    { n: 3, diferenca: 3000, folego: null, esperado: "estavel" },
    { n: 4, diferenca: 0, folego: null, esperado: "estavel" },
    { n: 5, diferenca: -1, folego: 30, esperado: "atencao" },
  ] as const;

  for (const { n, diferenca, folego, esperado } of casos) {
    it(`caso ${n}: diferença ${diferenca} / fôlego ${folego ?? "—"} => ${esperado}`, () => {
      expect(selecionarCenario(diferenca, folego)).toBe(esperado);
    });
  }

  it("caso 5 (limite): fôlego 29 entra em urgente, 30 não", () => {
    expect(selecionarCenario(-1, 29)).toBe("urgente");
    expect(selecionarCenario(-1, 30)).toBe("atencao");
  });

  it("zero é tratado como não-negativo (caso 4)", () => {
    expect(selecionarCenario(0, 5)).toBe("estavel");
  });

  it("fôlego desconhecido nunca produz urgente", () => {
    expect(selecionarCenario(-9999, null)).toBe("atencao");
  });
});

describe("RF-09 — textos do CTA", () => {
  const textos = Object.values(CTA_POR_CENARIO);

  it("cada cenário tem seu próprio texto", () => {
    expect(new Set(textos).size).toBe(3);
  });

  it("todo CTA é uma pergunta", () => {
    for (const texto of textos) {
      expect(texto.trim().endsWith("?")).toBe(true);
    }
  });

  /**
   * Guarda da regra de nomenclatura do RF-09: nenhuma variação pode conter verbo
   * no imperativo dirigido a uma ação financeira — isso seria recomendação, e
   * cruzaria a linha de "fora sempre: recomendação de regime tributário".
   */
  it("nenhum CTA contém verbo imperativo de ação financeira", () => {
    const imperativosProibidos = [
      "reduza",
      "controle",
      "negocie",
      "corte",
      "aumente",
      "diminua",
      "invista",
      "contrate",
      "demita",
      "parcele",
      "renegocie",
      "economize",
      "ajuste",
      "revise",
      "migre",
    ];

    for (const texto of textos) {
      const normalizado = texto.toLowerCase();
      for (const proibido of imperativosProibidos) {
        expect(normalizado).not.toContain(proibido);
      }
    }
  });

  it("os textos batem com a tabela do RF-09", () => {
    expect(CTA_POR_CENARIO.urgente).toContain("mês atípico");
    expect(CTA_POR_CENARIO.atencao).toContain("surpreendeu");
    expect(CTA_POR_CENARIO.estavel).toContain("diferente dos outros");
  });
});

describe("RF-09 — integração com RF-05/RF-06", () => {
  it("caso 1 ponta a ponta: negativo com caixa curto => urgente", () => {
    // Saiu 5.000 a mais; caixa de 4.000 cobre ~12 dias de um ritmo de 10.000/mês.
    const r = diagnosticar({ entradas: 5000, saidas: 10000, saldoCaixa: 4000 });

    expect(r.diferenca).toBe(-5000);
    expect(r.folegoDias).toBe(12);
    expect(r.cenario).toBe("urgente");
    expect(r.cta).toBe(CTA_POR_CENARIO.urgente);
  });

  it("caso 3 ponta a ponta: positivo sem saldo informado => estável", () => {
    const r = diagnosticar({ entradas: 13000, saidas: 10000 });

    expect(r.diferenca).toBe(3000);
    expect(r.folegoDias).toBeNull();
    expect(r.cenario).toBe("estavel");
    expect(r.cta).toBe(CTA_POR_CENARIO.estavel);
  });
});
