/**
 * Placar — os números do trimestre.
 *
 * Lógica pura: recebe as anotações, devolve as contagens. Sem I/O, para poder
 * ser testada sem banco.
 */

export const CANAIS = ["envio", "telefone"] as const;
export type Canal = (typeof CANAIS)[number];

export type Envio = {
  id: string;
  contato: string;
  canal: string;
  respondeu: boolean;
  conversa: boolean;
  trabalho: boolean;
  criadoEm: Date;
};

export type Resumo = {
  enviados: number;
  responderam: number;
  conversas: number;
  trabalhos: number;
};

export function resumir(envios: Envio[]): Resumo {
  return {
    enviados: envios.length,
    responderam: envios.filter((e) => e.respondeu).length,
    conversas: envios.filter((e) => e.conversa).length,
    trabalhos: envios.filter((e) => e.trabalho).length,
  };
}

/**
 * Filtra os envios do trimestre corrente.
 *
 * O ciclo do kit é trimestral, então "como estou indo" só faz sentido dentro do
 * trimestre — misturar rodadas antigas dilui o número e esconde a rodada atual.
 */
export function doTrimestre(envios: Envio[], referencia = new Date()): Envio[] {
  const inicio = inicioDoTrimestre(referencia);
  return envios.filter((e) => e.criadoEm >= inicio);
}

export function inicioDoTrimestre(data: Date): Date {
  const trimestre = Math.floor(data.getMonth() / 3);
  return new Date(data.getFullYear(), trimestre * 3, 1);
}

export function rotuloDoTrimestre(data = new Date()): string {
  const trimestre = Math.floor(data.getMonth() / 3) + 1;
  return `${trimestre}º trimestre de ${data.getFullYear()}`;
}

/**
 * A leitura do placar, em uma frase.
 *
 * Diagnóstico do método, não do contador — mesma regra de tom do resto do
 * produto (RF-08). E deliberadamente não é uma recomendação: aponta onde olhar,
 * quem decide o que fazer é ele.
 */
export function leitura(resumo: Resumo): string {
  if (resumo.enviados === 0) {
    return "Nenhum envio anotado ainda neste trimestre.";
  }

  if (resumo.responderam === 0) {
    return "Ninguém respondeu ainda. Quando isso acontece, costuma ser a lista, não a mensagem — vale reler o mapa de contatos.";
  }

  if (resumo.conversas === 0) {
    return "Houve resposta, mas nenhuma conversa. O ponto a olhar é o que você responde quando o resultado chega.";
  }

  if (resumo.trabalhos === 0) {
    return "As conversas estão acontecendo. Nem toda conversa vira contrato — e um cliente que passou a ter contato fora de guia e prazo também é retorno.";
  }

  return "Conversas aconteceram e viraram trabalho. O método está rodando.";
}
