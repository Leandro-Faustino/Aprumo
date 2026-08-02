import { describe, expect, it } from "vitest";

import { diagnosticar } from "./index";
import {
  montarLinkWhatsapp,
  montarMensagem,
  normalizarWhatsapp,
  rotuloBotaoWhatsapp,
} from "./whatsapp";

describe("RF-21 — link de WhatsApp", () => {
  it("normaliza número com máscara e acrescenta o DDI", () => {
    expect(normalizarWhatsapp("(11) 98765-4321")).toBe("5511987654321");
  });

  it("mantém o DDI quando já informado", () => {
    expect(normalizarWhatsapp("+55 11 98765-4321")).toBe("5511987654321");
  });

  it("recusa número curto demais para ser telefone", () => {
    expect(normalizarWhatsapp("1234")).toBeNull();
  });

  it("monta o link com a mensagem codificada", () => {
    const link = montarLinkWhatsapp("(11) 98765-4321", "Contabilidade Silva");
    expect(link).toContain("https://wa.me/5511987654321?text=");
    expect(decodeURIComponent(link!)).toContain("Contabilidade Silva");
  });
});

/**
 * RF-32 — a mensagem permanece coerente mesmo sem os dados opcionais
 * preenchidos, e o botão desaparece em vez de gerar link quebrado.
 */
describe("RF-32 — degradação", () => {
  it("sem WhatsApp configurado, não há link", () => {
    expect(montarLinkWhatsapp(null, "Contabilidade Silva")).toBeNull();
    expect(montarLinkWhatsapp("", "Contabilidade Silva")).toBeNull();
  });

  it("sem marca, a mensagem continua uma frase correta", () => {
    const mensagem = montarMensagem(null);
    expect(mensagem).toBe(
      "Olá! Fiz o diagnóstico de 90 dias e queria conversar sobre o resultado.",
    );
    expect(mensagem).not.toContain("undefined");
    expect(mensagem).not.toContain("null");
    expect(mensagem).not.toMatch(/\s{2,}/);
  });

  it("marca só com espaços é tratada como ausente", () => {
    expect(montarMensagem("   ")).toBe(montarMensagem(null));
    expect(rotuloBotaoWhatsapp("   ")).toBe("Conversar no WhatsApp");
  });

  it("com marca, a mensagem cita o escritório", () => {
    expect(montarMensagem("Contabilidade Silva")).toContain(
      "no site da Contabilidade Silva",
    );
  });
});

/**
 * RNF-05 — nenhum valor financeiro pode sair do dispositivo.
 * O link de WhatsApp é o único caminho de saída que existe na página.
 */
describe("RNF-05 — a mensagem não carrega dado financeiro", () => {
  it("não contém valores, diferença nem fôlego", () => {
    const resultado = diagnosticar({
      entradas: 5000,
      saidas: 10000,
      saldoCaixa: 4000,
    });
    const link = montarLinkWhatsapp("11987654321", "Contabilidade Silva")!;
    const texto = decodeURIComponent(link);

    for (const valor of ["5000", "10000", "4000", "5.000", "10.000", "4.000"]) {
      expect(texto).not.toContain(valor);
    }

    expect(texto).not.toContain(String(resultado.diferenca));
    expect(texto).not.toContain(String(resultado.folegoDias));
    expect(texto).not.toContain(resultado.cenario);
    // O único número no texto é o "90" do nome do diagnóstico.
    const numerosNoTexto = texto.split("?text=")[1].match(/\d+/g) ?? [];
    expect(numerosNoTexto).toEqual(["90"]);
  });
});
