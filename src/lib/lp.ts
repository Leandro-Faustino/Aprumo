/**
 * Valores da camada comercial que ainda não existem.
 *
 * A estrutura da landing page foi montada antes das dez conversas de descoberta,
 * como manda a nota de sequência do documento. Tudo que depende dessas conversas
 * — ou de uma trava de verificação — mora aqui, em um lugar só.
 *
 * REGRA: nada aqui recebe valor plausível "só para preencher". Um preço
 * inventado numa página comercial é ficção que ninguém revisa depois, e este é
 * exatamente o projeto que não pode se dar a esse luxo. Enquanto o valor for
 * `null`, a página o exibe como pendência visível — feia de propósito, para
 * não ser publicada por engano.
 */

export type Pendencia = {
  /** O que falta, em uma linha. */
  rotulo: string;
  /** `true` quando depende de verificação externa, não só de uma decisão. */
  travaDura?: boolean;
};

export const PENDENTE = {
  /**
   * Nome de marca do degrau 0. O degrau 1 tem nome ("Pauta Técnica em 90
   * Dias"); este não tem nenhum, e o documento da escada lista isso como
   * decisão em aberto. A página usa um título descritivo até lá — inventar
   * marca não é decisão de implementação.
   */
  nomeDegrau0: null as string | null,
  precoFundador: null as string | null,
  precoTabela: null as string | null,
  dataTabelaEntraEmVigor: null as string | null,
  dataInicioTurma: null as string | null,
  valorClienteNovo: null as string | null,
  anosQueUmClientePaga: null as string | null,
  contatosDaGarantia: null as string | null,
  minutosDeSetup: null as string | null,
  vagasRestantes: null as number | null,
  cnpj: null as string | null,
  contato: null as string | null,
};

/**
 * Travas que bloqueiam publicação, do documento de estrutura.
 * As duas primeiras não são decisões nossas — dependem de fonte externa.
 */
export const TRAVAS: Pendencia[] = [
  { rotulo: "Enquadramento CFC verificado com fonte primária", travaDura: true },
  { rotulo: "Controlador/operador LGPD definido", travaDura: true },
  { rotulo: "Anterioridade do nome Aprumo", travaDura: true },
  { rotulo: "Preço fundador e de tabela" },
  { rotulo: "Valor de um cliente novo (ticket × permanência)" },
  { rotulo: "Nº de contatos da garantia" },
  { rotulo: "Duração real do setup" },
  { rotulo: "Data de início da turma" },
  { rotulo: "Vocabulário validado nas dez entrevistas" },
];

/** Números do caso de teste #1, usados na peça do hero. */
export const CASO_HERO = { entradas: 12000, saidas: 15000 } as const;
