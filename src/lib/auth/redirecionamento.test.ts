import { describe, expect, it } from "vitest";

import { DESTINO_PADRAO, destinoSeguro } from "./redirecionamento";

describe("destinoSeguro — barreira contra redirecionamento aberto", () => {
  it("aceita caminho relativo do próprio site", () => {
    expect(destinoSeguro("/painel")).toBe("/painel");
    expect(destinoSeguro("/d/silva-contabil")).toBe("/d/silva-contabil");
  });

  it("cai no padrão quando não há destino", () => {
    expect(destinoSeguro(null)).toBe(DESTINO_PADRAO);
    expect(destinoSeguro(undefined)).toBe(DESTINO_PADRAO);
    expect(destinoSeguro("")).toBe(DESTINO_PADRAO);
  });

  it.each([
    ["https://site-falso.com", "URL absoluta"],
    ["http://site-falso.com", "URL absoluta sem TLS"],
    ["//site-falso.com", "relativo a protocolo"],
    ["/\\site-falso.com", "barra invertida após a barra"],
    ["/caminho\\..\\outro", "barra invertida no meio"],
    ["javascript:alert(1)", "esquema javascript"],
    ["site-falso.com", "sem barra inicial"],
  ])("recusa %s (%s)", (entrada) => {
    expect(destinoSeguro(entrada)).toBe(DESTINO_PADRAO);
  });
});
