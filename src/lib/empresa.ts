import { z } from "zod";

/**
 * Validação do formulário de empresa (RF-30).
 *
 * Mora fora do arquivo de Server Actions porque módulos `"use server"` só podem
 * exportar funções assíncronas — e porque isto é lógica pura, que merece teste.
 */

/** Campo vazio vira `null`: o RF-32 trata ausência, não string vazia. */
const opcional = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v));

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Use ao menos 3 caracteres.")
  .max(40, "Use no máximo 40 caracteres.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens.");

export const formularioEmpresaSchema = z.object({
  slug: slugSchema,
  marca: z.string().trim().min(1, "Informe o nome que aparece na página."),
  crc: opcional,
  logoUrl: opcional.pipe(z.url("Informe uma URL válida.").nullable()),
  whatsapp: opcional,
  rodape: opcional,
  corPrimaria: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Escolha uma cor válida."),
});

export type FormularioEmpresa = z.infer<typeof formularioEmpresaSchema>;

/**
 * Endereços que colidiriam com rotas do próprio produto.
 * Sem isto, um contador poderia registrar o slug "painel" e confundir a navegação.
 */
export const SLUGS_RESERVADOS = new Set([
  "entrar",
  "sair",
  "painel",
  "auth",
  "api",
  "d",
  "admin",
  "conta",
]);

export function slugReservado(slug: string): boolean {
  return SLUGS_RESERVADOS.has(slug);
}
