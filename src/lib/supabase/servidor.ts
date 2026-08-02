import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para Server Components, Server Actions e Route Handlers.
 *
 * Um cliente novo por render — nunca compartilhe entre requisições, senão a
 * sessão de um usuário vaza para outro.
 */
export async function criarClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient(urlSupabase(), chaveSupabase(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesParaDefinir) {
        try {
          for (const { name, value, options } of cookiesParaDefinir) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components não podem escrever cookies. Quem renova a sessão
          // é o proxy.ts — por isso ignorar aqui é seguro, e só aqui.
        }
      },
    },
  });
}

/**
 * Usuário autenticado, ou `null`.
 *
 * Usa `getUser()`, que revalida o token junto ao servidor do Supabase.
 * `getSession()` apenas lê o cookie e confia nele — não serve para decisão
 * de autorização em código de servidor.
 */
export async function usuarioAtual() {
  if (!supabaseConfigurado()) return null;

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.getUser();

  return error ? null : data.user;
}

export function supabaseConfigurado(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function urlSupabase(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  return url;
}

function chaveSupabase(): string {
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!chave) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada.");
  return chave;
}
