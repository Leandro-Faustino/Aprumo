"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { salvarMinhaEmpresa } from "@/lib/dal";
import { formularioEmpresaSchema, slugReservado } from "@/lib/empresa";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoPainel = {
  status: "inicial" | "salvo" | "erro";
  mensagem?: string;
  slug?: string;
};

export async function salvarEmpresa(
  _anterior: EstadoPainel,
  formData: FormData,
): Promise<EstadoPainel> {
  const dados = formularioEmpresaSchema.safeParse({
    slug: formData.get("slug"),
    marca: formData.get("marca"),
    crc: formData.get("crc"),
    logoUrl: formData.get("logoUrl"),
    whatsapp: formData.get("whatsapp"),
    rodape: formData.get("rodape"),
    corPrimaria: formData.get("corPrimaria"),
  });

  if (!dados.success) {
    return { status: "erro", mensagem: dados.error.issues[0]?.message ?? "Revise os campos." };
  }

  if (slugReservado(dados.data.slug)) {
    return { status: "erro", mensagem: "Esse endereço é reservado. Escolha outro." };
  }

  // Quem é o dono vem da sessão, dentro do DAL — nunca do formulário.
  const resultado = await salvarMinhaEmpresa(dados.data);
  if (!resultado.ok) {
    return { status: "erro", mensagem: resultado.erro };
  }

  revalidatePath("/painel");
  revalidatePath(`/d/${resultado.slug}`);

  return { status: "salvo", slug: resultado.slug };
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect("/entrar");
}
