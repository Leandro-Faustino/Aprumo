import { describe, expect, it } from "vitest";

import { calcularDiferenca, calcularFolegoDias, validarEntrada } from "./calculo";
import { paraNumero } from "./formato";

describe("RF-05 — diferença", () => {
  it("negativa quando sai mais do que entra", () => {
    expect(calcularDiferenca(5000, 10000)).toBe(-5000);
  });

  it("positiva quando entra mais do que sai", () => {
    expect(calcularDiferenca(13000, 10000)).toBe(3000);
  });

  it("zero quando empata", () => {
    expect(calcularDiferenca(10000, 10000)).toBe(0);
  });

  it("não carrega ruído de ponto flutuante", () => {
    expect(calcularDiferenca(0.3, 0.1)).toBe(0.2);
  });
});

describe("RF-06 — fôlego em dias", () => {
  it("divide o saldo pelo ritmo diário de saída", () => {
    // 10.000/mês = 333,33/dia; 4.000 / 333,33 = 12 dias.
    expect(calcularFolegoDias(4000, 10000)).toBe(12);
  });

  it("arredonda para baixo — dia incompleto não conta", () => {
    expect(calcularFolegoDias(3999, 10000)).toBe(11);
  });

  it("é null sem saldo informado", () => {
    expect(calcularFolegoDias(null, 10000)).toBeNull();
    expect(calcularFolegoDias(undefined, 10000)).toBeNull();
  });

  it("é null quando não houve saídas — evita divisão por zero e Infinity", () => {
    expect(calcularFolegoDias(4000, 0)).toBeNull();
  });

  it("é zero, e não null, quando o caixa está vazio", () => {
    expect(calcularFolegoDias(0, 10000)).toBe(0);
  });
});

describe("validação de entrada", () => {
  it("aceita entrada válida sem saldo", () => {
    expect(validarEntrada({ entradas: 100, saidas: 50 })).toEqual([]);
  });

  it("rejeita valores negativos", () => {
    const erros = validarEntrada({ entradas: -1, saidas: 50 });
    expect(erros).toHaveLength(1);
    expect(erros[0].campo).toBe("entradas");
  });

  it("rejeita texto que não vira número", () => {
    const erros = validarEntrada({ entradas: paraNumero("abc"), saidas: 50 });
    expect(erros[0].campo).toBe("entradas");
  });

  it("ignora saldo ausente, mas valida saldo presente", () => {
    expect(validarEntrada({ entradas: 1, saidas: 1, saldoCaixa: null })).toEqual([]);
    expect(validarEntrada({ entradas: 1, saidas: 1, saldoCaixa: -5 })).toHaveLength(1);
  });
});

describe("paraNumero", () => {
  it.each([
    ["1234,56", 1234.56],
    ["1.234,56", 1234.56],
    ["1234.56", 1234.56],
    ["R$ 1.234,56", 1234.56],
    ["10000", 10000],
  ])("converte %s", (texto, esperado) => {
    expect(paraNumero(texto)).toBe(esperado);
  });

  it("devolve NaN para vazio e para texto", () => {
    expect(paraNumero("")).toBeNaN();
    expect(paraNumero("abc")).toBeNaN();
  });
});
