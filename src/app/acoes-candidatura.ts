"use server";

import { candidaturaSchema } from "@/lib/candidatura";
import { getPrisma, temBancoConfigurado } from "@/lib/prisma";

export type EstadoCandidatura = {
  status: "inicial" | "enviada" | "erro";
  mensagem?: string;
};

export async function enviarCandidatura(
  _anterior: EstadoCandidatura,
  formData: FormData,
): Promise<EstadoCandidatura> {
  const dados = candidaturaSchema.safeParse({
    nomeEscritorio: formData.get("nomeEscritorio"),
    whatsapp: formData.get("whatsapp"),
    clientesAtivos: formData.get("clientesAtivos"),
    origemUltimosClientes: formData.get("origemUltimosClientes"),
    empresaParaEnviar: formData.get("empresaParaEnviar"),
  });

  if (!dados.success) {
    return {
      status: "erro",
      mensagem: dados.error.issues[0]?.message ?? "Revise os campos.",
    };
  }

  if (!temBancoConfigurado()) {
    return {
      status: "erro",
      mensagem:
        "O envio está indisponível neste ambiente. Fale direto pelo contato no rodapé.",
    };
  }

  try {
    await getPrisma().candidatura.create({ data: dados.data });
  } catch {
    return {
      status: "erro",
      mensagem: "Não foi possível registrar agora. Tente de novo em instantes.",
    };
  }

  return { status: "enviada" };
}
