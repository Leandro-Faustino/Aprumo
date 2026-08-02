import "server-only";

import { redirect } from "next/navigation";
import { connection } from "next/server";

import { marcaSchema, type Marca } from "./marca";
import { getPrisma, temBancoConfigurado } from "./prisma";
import { usuarioAtual } from "./supabase/servidor";

/**
 * Data Access Layer.
 *
 * Regra desta camada: **nenhuma função daqui aceita um id de empresa vindo do
 * cliente.** O dono sai sempre da sessão verificada no servidor. É isso que
 * garante "um usuário só acessa a sua empresa" — não o proxy, que é apenas
 * conveniência de navegação, e não a interface, que o usuário controla.
 *
 * `server-only` faz o build quebrar se algum Client Component importar este
 * arquivo por engano.
 */

export type SessaoContador = {
  usuarioId: string;
  email: string | null;
};

/**
 * Sessão atual, ou `null`. Não redireciona.
 *
 * `connection()` impede que qualquer página protegida seja pré-renderizada no
 * build. Sem isso, quando o Supabase não está configurado o código nunca toca
 * em `cookies()`, e o Next entrega uma página estática — congelando no HTML a
 * decisão de autorização de um build sem sessão nenhuma.
 */
export async function sessaoAtual(): Promise<SessaoContador | null> {
  await connection();

  const usuario = await usuarioAtual();
  if (!usuario) return null;

  return { usuarioId: usuario.id, email: usuario.email ?? null };
}

/** Sessão atual, redirecionando para /entrar quando não há. */
export async function exigirSessao(): Promise<SessaoContador> {
  const sessao = await sessaoAtual();
  if (!sessao) redirect("/entrar");
  return sessao;
}

/**
 * A empresa do usuário logado. Retorna `null` quando ele ainda não criou a sua.
 *
 * O filtro é por `ownerId` da sessão — nunca por um id recebido como parâmetro.
 */
export async function minhaEmpresa(): Promise<Marca | null> {
  const sessao = await exigirSessao();
  if (!temBancoConfigurado()) return null;

  const registro = await getPrisma().contador.findUnique({
    where: { ownerId: sessao.usuarioId },
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

  const validado = marcaSchema.safeParse(registro);
  return validado.success ? validado.data : null;
}

export type ResultadoSalvar =
  | { ok: true; slug: string }
  | { ok: false; erro: string };

/**
 * Cria ou atualiza a empresa do usuário logado.
 *
 * `upsert` por `ownerId` implementa "uma empresa por conta": um segundo salvamento
 * atualiza a existente em vez de criar outra. E como a condição é o dono da
 * sessão, não há entrada por onde alguém alcance a linha de outro contador.
 */
export async function salvarMinhaEmpresa(dados: Marca): Promise<ResultadoSalvar> {
  const sessao = await exigirSessao();

  if (!temBancoConfigurado()) {
    return { ok: false, erro: "Banco de dados não configurado." };
  }

  const prisma = getPrisma();

  // O slug é público e global — precisa ser único entre todos os contadores.
  const donoDoSlug = await prisma.contador.findUnique({
    where: { slug: dados.slug },
    select: { ownerId: true },
  });

  if (donoDoSlug && donoDoSlug.ownerId !== sessao.usuarioId) {
    return { ok: false, erro: "Esse endereço já está em uso. Escolha outro." };
  }

  const campos = {
    slug: dados.slug,
    marca: dados.marca,
    crc: dados.crc,
    logoUrl: dados.logoUrl,
    whatsapp: dados.whatsapp,
    rodape: dados.rodape,
    corPrimaria: dados.corPrimaria,
  };

  await prisma.contador.upsert({
    where: { ownerId: sessao.usuarioId },
    create: { ...campos, ownerId: sessao.usuarioId },
    update: campos,
  });

  return { ok: true, slug: dados.slug };
}
