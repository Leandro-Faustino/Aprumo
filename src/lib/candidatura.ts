import { z } from "zod";

/**
 * Candidatura à turma fundadora (§16).
 *
 * Cinco campos, no máximo — e cinco campos para um produto de cinco campos
 * também é coerência. Os dois últimos fazem duas coisas ao mesmo tempo:
 * filtram a agenda e produzem dado de descoberta antes da conversa.
 */

export const FAIXAS_CARTEIRA = [
  "até 20 clientes",
  "de 21 a 50",
  "de 51 a 100",
  "mais de 100",
] as const;

export const candidaturaSchema = z.object({
  nomeEscritorio: z
    .string()
    .trim()
    .min(3, "Escreva seu nome e o do escritório.")
    .max(160),

  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp com DDD.")
    .max(30)
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Informe um WhatsApp com DDD."),

  clientesAtivos: z.enum(FAIXAS_CARTEIRA, {
    message: "Escolha uma faixa.",
  }),

  /**
   * Qualificação real: resposta vaga indica lead frio, resposta com fato indica
   * que a dor existe. O mínimo alto é proposital — "indicação" sozinho não diz
   * nada, e é justamente o que se responde quando não se olhou para a carteira.
   */
  origemUltimosClientes: z
    .string()
    .trim()
    .min(20, "Conte como chegaram, com algum detalhe — é o que qualifica a conversa.")
    .max(1000),

  /**
   * O teste de compromisso, dentro do formulário. Quem não consegue nomear
   * ninguém tem problema de lista, não de ferramenta — e essa é uma conversa
   * diferente, que não é esta.
   */
  empresaParaEnviar: z
    .string()
    .trim()
    .min(2, "Escreva o nome de uma empresa, mesmo que aproximado.")
    .max(160),
});

export type Candidatura = z.infer<typeof candidaturaSchema>;
