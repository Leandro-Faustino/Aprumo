import { describe, expect, it } from "vitest";

import {
  doTrimestre,
  inicioDoTrimestre,
  leitura,
  resumir,
  rotuloDoTrimestre,
  type Envio,
} from "./placar";

function envio(parcial: Partial<Envio> = {}): Envio {
  return {
    id: crypto.randomUUID(),
    contato: "Cliente",
    canal: "envio",
    respondeu: false,
    conversa: false,
    trabalho: false,
    criadoEm: new Date(),
    ...parcial,
  };
}

describe("resumir", () => {
  it("conta cada marcador de forma independente", () => {
    const r = resumir([
      envio(),
      envio({ respondeu: true }),
      envio({ respondeu: true, conversa: true }),
      envio({ respondeu: true, conversa: true, trabalho: true }),
    ]);

    expect(r).toEqual({ enviados: 4, responderam: 3, conversas: 2, trabalhos: 1 });
  });

  it("lista vazia dá tudo zero", () => {
    expect(resumir([])).toEqual({ enviados: 0, responderam: 0, conversas: 0, trabalhos: 0 });
  });

  it("não presume hierarquia entre os marcadores", () => {
    // Uma conversa marcada sem "respondeu" acontece de verdade: o modo assistido
    // é por telefone, não há resposta a mensagem nenhuma.
    const r = resumir([envio({ canal: "telefone", conversa: true })]);
    expect(r.responderam).toBe(0);
    expect(r.conversas).toBe(1);
  });
});

describe("recorte trimestral", () => {
  it("começa no primeiro dia do trimestre", () => {
    expect(inicioDoTrimestre(new Date(2026, 1, 15))).toEqual(new Date(2026, 0, 1));
    expect(inicioDoTrimestre(new Date(2026, 4, 30))).toEqual(new Date(2026, 3, 1));
    expect(inicioDoTrimestre(new Date(2026, 11, 31))).toEqual(new Date(2026, 9, 1));
  });

  it("mantém o que é do trimestre e descarta o resto", () => {
    const referencia = new Date(2026, 4, 15); // maio, 2º trimestre
    const envios = [
      envio({ criadoEm: new Date(2026, 3, 2) }), // abril, dentro
      envio({ criadoEm: new Date(2026, 4, 14) }), // maio, dentro
      envio({ criadoEm: new Date(2026, 2, 31) }), // março, fora
      envio({ criadoEm: new Date(2025, 11, 1) }), // ano passado, fora
    ];

    expect(doTrimestre(envios, referencia)).toHaveLength(2);
  });

  it("inclui o primeiro instante do trimestre", () => {
    const referencia = new Date(2026, 4, 15);
    const naVirada = envio({ criadoEm: new Date(2026, 3, 1) });
    expect(doTrimestre([naVirada], referencia)).toHaveLength(1);
  });

  it("rotula o trimestre corrente", () => {
    expect(rotuloDoTrimestre(new Date(2026, 0, 5))).toBe("1º trimestre de 2026");
    expect(rotuloDoTrimestre(new Date(2026, 8, 5))).toBe("3º trimestre de 2026");
  });
});

describe("leitura do placar", () => {
  it("sem envios, não diagnostica nada", () => {
    expect(leitura(resumir([]))).toContain("Nenhum envio anotado");
  });

  it("sem resposta, aponta a lista antes da mensagem", () => {
    const texto = leitura(resumir([envio(), envio()]));
    expect(texto).toContain("mapa de contatos");
  });

  it("com resposta e sem conversa, aponta a resposta ao resultado", () => {
    const texto = leitura(resumir([envio({ respondeu: true })]));
    expect(texto).toContain("o que você responde");
  });

  it("com conversa e sem trabalho, não trata isso como fracasso", () => {
    const texto = leitura(resumir([envio({ respondeu: true, conversa: true })]));
    expect(texto).toContain("também é retorno");
  });

  it("com trabalho, confirma sem exagerar", () => {
    const texto = leitura(
      resumir([envio({ respondeu: true, conversa: true, trabalho: true })]),
    );
    expect(texto).toContain("método está rodando");
  });

  /** RF-08 sobe para o placar: descrever a situação, nunca qualificar quem usa. */
  it("nenhuma leitura culpa o contador nem manda ele fazer algo", () => {
    const cenarios = [
      resumir([]),
      resumir([envio()]),
      resumir([envio({ respondeu: true })]),
      resumir([envio({ respondeu: true, conversa: true })]),
      resumir([envio({ respondeu: true, conversa: true, trabalho: true })]),
    ];

    const proibidos = [
      "você deveria",
      "você precisa",
      "está errado",
      "fracasso",
      "ruim",
      "aumente",
      "melhore",
      "esforce",
    ];

    for (const cenario of cenarios) {
      const texto = leitura(cenario).toLowerCase();
      for (const proibido of proibidos) {
        expect(texto).not.toContain(proibido);
      }
    }
  });
});
