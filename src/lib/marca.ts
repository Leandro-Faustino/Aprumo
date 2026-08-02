/**
 * RF-30 — bloco único de configuração white-label.
 *
 * Trocar de contador é trocar UMA linha da tabela `contadores` (ou as variáveis
 * de ambiente do fallback). Nada aqui exige tocar em lógica ou estilo, e todos
 * os campos além de `marca` são opcionais por causa do RF-32.
 */

import { z } from "zod";

import { getPrisma, temBancoConfigurado } from "./prisma";

export const marcaSchema = z.object({
  slug: z.string().min(1),
  marca: z.string().min(1),
  crc: z.string().trim().min(1).nullable().default(null),
  logoUrl: z.string().trim().url().nullable().default(null),
  whatsapp: z.string().trim().min(1).nullable().default(null),
  rodape: z.string().trim().min(1).nullable().default(null),
  /** Default garante que a cor nunca falta — o layout não degrada por cor. */
  corPrimaria: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use hex no formato #RRGGBB")
    .default("#0F766E"),
});

export type Marca = z.infer<typeof marcaSchema>;

/**
 * Fallback usado quando não há banco configurado (dev, preview, ou contador
 * único auto-hospedado). Mesmo contrato do banco — a página não sabe a diferença.
 */
export function marcaDoAmbiente(): Marca {
  return marcaSchema.parse({
    slug: process.env.NEXT_PUBLIC_MARCA_SLUG || "demo",
    marca: process.env.NEXT_PUBLIC_MARCA_NOME || "Seu Escritório Contábil",
    crc: process.env.NEXT_PUBLIC_MARCA_CRC || null,
    logoUrl: process.env.NEXT_PUBLIC_MARCA_LOGO_URL || null,
    whatsapp: process.env.NEXT_PUBLIC_MARCA_WHATSAPP || null,
    rodape: process.env.NEXT_PUBLIC_MARCA_RODAPE || null,
    corPrimaria: process.env.NEXT_PUBLIC_MARCA_COR || "#0F766E",
  });
}

/**
 * Slug de uma empresa existente, para o link "Ver um exemplo" da home.
 *
 * Retorna `null` quando não há nenhuma — aí o link some, em vez de apontar para
 * um 404. Não dá para fixar um slug de seed aqui: o seed é opcional, e um banco
 * real tem só as empresas que os contadores criaram.
 */
export async function slugDeExemplo(): Promise<string | null> {
  if (!temBancoConfigurado()) return marcaDoAmbiente().slug;

  const registro = await getPrisma().contador.findFirst({
    where: { ativo: true },
    orderBy: { criadoEm: "asc" },
    select: { slug: true },
  });

  return registro?.slug ?? null;
}

/**
 * Carrega a marca de um slug. Retorna `null` quando o slug não existe.
 *
 * Sem banco configurado, devolve o fallback de ambiente para qualquer slug —
 * assim o produto roda de ponta a ponta antes de existir Supabase.
 */
export async function carregarMarca(slug: string): Promise<Marca | null> {
  if (!temBancoConfigurado()) {
    return { ...marcaDoAmbiente(), slug };
  }

  const registro = await getPrisma().contador.findFirst({
    where: { slug, ativo: true },
    select: {
      slug: true,
      marca: true,
      crc: true,
      logoUrl: true,
      whatsapp: true,
      rodape: true,
      corPrimaria: true,
    },
  });

  if (!registro) return null;

  // `safeParse` para que um dado ruim no banco (cor inválida, logo com URL
  // quebrada) degrade para o default em vez de derrubar a página — RF-32.
  const validado = marcaSchema.safeParse(registro);
  if (validado.success) return validado.data;

  return marcaSchema.parse({
    slug: registro.slug,
    marca: registro.marca,
    crc: registro.crc,
    logoUrl: null,
    whatsapp: registro.whatsapp,
    rodape: registro.rodape,
    corPrimaria: "#0F766E",
  });
}
