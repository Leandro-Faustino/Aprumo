"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase/servidor";

export type EstadoEntrar = {
  status: "inicial" | "enviado" | "erro";
  mensagem?: string;
};

const emailSchema = z.email("Digite um e-mail válido.");

export async function enviarLinkMagico(
  _anterior: EstadoEntrar,
  formData: FormData,
): Promise<EstadoEntrar> {
  if (!supabaseConfigurado()) {
    return {
      status: "erro",
      mensagem: "Login indisponível: o Supabase não está configurado neste ambiente.",
    };
  }

  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) {
    return { status: "erro", mensagem: "Digite um e-mail válido." };
  }

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: { emailRedirectTo: `${await urlDoSite()}/auth/confirmar` },
  });

  if (error) {
    return {
      status: "erro",
      mensagem: "Não foi possível enviar o link agora. Tente de novo em instantes.",
    };
  }

  // Sucesso e "e-mail não cadastrado" devolvem a mesma resposta de propósito:
  // uma mensagem diferente para cada caso deixaria qualquer pessoa descobrir
  // quais e-mails têm conta aqui.
  return { status: "enviado" };
}

async function urlDoSite(): Promise<string> {
  const configurada = process.env.NEXT_PUBLIC_SITE_URL;
  if (configurada) return configurada.replace(/\/$/, "");

  const cabecalhos = await headers();
  const host = cabecalhos.get("x-forwarded-host") ?? cabecalhos.get("host");
  const protocolo = cabecalhos.get("x-forwarded-proto") ?? "http";

  return `${protocolo}://${host}`;
}
