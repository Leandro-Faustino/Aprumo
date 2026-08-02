import { describe, expect, it } from "vitest";

import { formularioEmpresaSchema, slugReservado, slugSchema } from "./empresa";

const VALIDO = {
  slug: "silva-contabil",
  marca: "Silva Contabilidade",
  crc: "",
  logoUrl: "",
  whatsapp: "",
  rodape: "",
  corPrimaria: "#0F766E",
};

describe("slug da página pública", () => {
  it.each(["silva-contabil", "abc", "contabil123", "a-b-c"])("aceita %s", (slug) => {
    expect(slugSchema.safeParse(slug).success).toBe(true);
  });

  it("normaliza para minúsculas e sem espaços nas bordas", () => {
    expect(slugSchema.parse("  Silva-Contabil  ")).toBe("silva-contabil");
  });

  it.each([
    ["ab", "curto demais"],
    ["a".repeat(41), "longo demais"],
    ["com espaço", "espaço"],
    ["-comeca-com-hifen", "hífen na ponta"],
    ["termina-com-hifen-", "hífen na ponta"],
    ["dois--hifens", "hífen duplo"],
    ["acentuação", "acento"],
    ["barra/no/meio", "barra"],
    ["ponto.no.meio", "ponto"],
  ])("recusa %s (%s)", (slug) => {
    expect(slugSchema.safeParse(slug).success).toBe(false);
  });
});

describe("slugs reservados", () => {
  it.each(["painel", "entrar", "auth", "api", "d"])("recusa a rota %s", (slug) => {
    expect(slugReservado(slug)).toBe(true);
  });

  it("libera slug comum", () => {
    expect(slugReservado("silva-contabil")).toBe(false);
  });
});

describe("formulário de empresa (RF-30 / RF-32)", () => {
  it("aceita o mínimo: só endereço, nome e cor", () => {
    const r = formularioEmpresaSchema.safeParse(VALIDO);
    expect(r.success).toBe(true);
  });

  it("campos opcionais vazios viram null, não string vazia", () => {
    const dados = formularioEmpresaSchema.parse(VALIDO);
    expect(dados.crc).toBeNull();
    expect(dados.logoUrl).toBeNull();
    expect(dados.whatsapp).toBeNull();
    expect(dados.rodape).toBeNull();
  });

  it("exige nome da marca", () => {
    expect(formularioEmpresaSchema.safeParse({ ...VALIDO, marca: "   " }).success).toBe(false);
  });

  it("recusa logo que não é URL", () => {
    expect(formularioEmpresaSchema.safeParse({ ...VALIDO, logoUrl: "logo.png" }).success).toBe(
      false,
    );
  });

  it("aceita logo com URL válida", () => {
    const r = formularioEmpresaSchema.parse({
      ...VALIDO,
      logoUrl: "https://exemplo.com/logo.png",
    });
    expect(r.logoUrl).toBe("https://exemplo.com/logo.png");
  });

  it.each(["0F766E", "#0F766", "#GGGGGG", "vermelho"])("recusa a cor %s", (cor) => {
    expect(formularioEmpresaSchema.safeParse({ ...VALIDO, corPrimaria: cor }).success).toBe(
      false,
    );
  });
});
