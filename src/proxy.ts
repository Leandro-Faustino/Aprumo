import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (no Next.js 16 é o antigo Middleware — mesmo comportamento, novo nome).
 *
 * Faz uma coisa só: renovar o token da sessão e reescrever os cookies. Server
 * Components não conseguem escrever cookies, então sem isto a sessão expira e
 * o contador é deslogado sem motivo aparente.
 *
 * NÃO é aqui que a autorização acontece. A documentação do Next é explícita
 * que o proxy não serve como solução de autorização, e o proxy não consulta o
 * banco — quem decide quem vê o quê é o DAL (`src/lib/dal.ts`), junto do acesso
 * a dados. O redirecionamento abaixo é só conveniência de navegação.
 */
export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  let resposta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesParaDefinir, headers) {
          for (const { name, value } of cookiesParaDefinir) {
            request.cookies.set(name, value);
          }
          resposta = NextResponse.next({ request });
          for (const { name, value, options } of cookiesParaDefinir) {
            resposta.cookies.set(name, value, options);
          }
          // Impede que CDN ou proxy reverso guarde uma resposta que carrega
          // cookie de sessão — sem isso a sessão de um usuário pode ser
          // entregue a outro.
          for (const [chave, valor] of Object.entries(headers ?? {})) {
            resposta.headers.set(chave, valor);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const caminho = request.nextUrl.pathname;

  if (!user && caminho.startsWith("/painel")) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    return NextResponse.redirect(url);
  }

  if (user && caminho === "/entrar") {
    const url = request.nextUrl.clone();
    url.pathname = "/painel";
    return NextResponse.redirect(url);
  }

  return resposta;
}

export const config = {
  /**
   * Roda em tudo, menos assets estáticos. `/d/<slug>` está incluído de
   * propósito: a página pública não exige login, mas quem estiver logado
   * precisa ter a sessão renovada ao navegar por ela.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
