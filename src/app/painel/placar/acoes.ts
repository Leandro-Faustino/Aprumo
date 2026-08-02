"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { alternarMarcador, apagarEnvio, registrarEnvio } from "@/lib/dal";
import { CANAIS } from "@/lib/placar";

export type EstadoPlacar = { status: "inicial" | "ok" | "erro"; mensagem?: string };

const novoEnvioSchema = z.object({
  contato: z
    .string()
    .trim()
    .min(1, "Escreva como você reconhece esse contato.")
    .max(120, "Use no máximo 120 caracteres."),
  canal: z.enum(CANAIS, { message: "Escolha envio ou telefone." }),
});

export async function anotarEnvio(
  _anterior: EstadoPlacar,
  formData: FormData,
): Promise<EstadoPlacar> {
  const dados = novoEnvioSchema.safeParse({
    contato: formData.get("contato"),
    canal: formData.get("canal"),
  });

  if (!dados.success) {
    return { status: "erro", mensagem: dados.error.issues[0]?.message ?? "Revise os campos." };
  }

  const ok = await registrarEnvio(dados.data.contato, dados.data.canal);
  if (!ok) {
    return {
      status: "erro",
      mensagem: "Configure sua empresa antes de anotar envios.",
    };
  }

  revalidatePath("/painel/placar");
  return { status: "ok" };
}

const marcadorSchema = z.object({
  envioId: z.uuid(),
  campo: z.enum(["respondeu", "conversa", "trabalho"]),
  valor: z.enum(["true", "false"]),
});

export async function marcar(formData: FormData) {
  const dados = marcadorSchema.safeParse({
    envioId: formData.get("envioId"),
    campo: formData.get("campo"),
    valor: formData.get("valor"),
  });

  // Falha silenciosa é adequada aqui: um id inválido ou de outro contador não
  // deve dizer ao chamador se existe ou não. O DAL já garante que nada muda.
  if (!dados.success) return;

  await alternarMarcador(dados.data.envioId, dados.data.campo, dados.data.valor === "true");
  revalidatePath("/painel/placar");
}

export async function remover(formData: FormData) {
  const envioId = z.uuid().safeParse(formData.get("envioId"));
  if (!envioId.success) return;

  await apagarEnvio(envioId.data);
  revalidatePath("/painel/placar");
}
