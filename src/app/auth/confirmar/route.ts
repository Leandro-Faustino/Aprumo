import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { destinoSeguro } from "@/lib/auth/redirecionamento";
import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase/servidor";

/**
 * Destino do link mágico. Troca o token do e-mail por uma sessão em cookie.
 *
 * Aceita os dois formatos que o Supabase pode emitir, porque depende de qual
 * template de e-mail o projeto usa:
 *   - `token_hash` + `type` (template com `{{ .TokenHash }}`)
 *   - `code` (fluxo PKCE, template padrão com `{{ .ConfirmationURL }}`)
 */
export async function GET(request: NextRequest) {
  if (!supabaseConfigurado()) {
    return redirecionar(request, "/auth/erro");
  }

  const { searchParams } = request.nextUrl;
  const destino = destinoSeguro(searchParams.get("next"));

  const supabase = await criarClienteServidor();

  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type") as EmailOtpType | null;
  if (tokenHash && tipo) {
    const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash });
    return redirecionar(request, error ? "/auth/erro" : destino);
  }

  const codigo = searchParams.get("code");
  if (codigo) {
    const { error } = await supabase.auth.exchangeCodeForSession(codigo);
    return redirecionar(request, error ? "/auth/erro" : destino);
  }

  return redirecionar(request, "/auth/erro");
}

function redirecionar(request: NextRequest, caminho: string) {
  const url = request.nextUrl.clone();
  url.pathname = caminho;
  url.search = "";
  return NextResponse.redirect(url);
}
