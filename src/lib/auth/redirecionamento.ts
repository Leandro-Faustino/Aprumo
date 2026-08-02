/** Destino padrão após entrar. */
export const DESTINO_PADRAO = "/painel";

/**
 * Aceita apenas caminho relativo dentro do próprio site.
 *
 * Sem isto, `?next=https://site-falso` transformaria o link de login em
 * redirecionamento aberto — e o e-mail de login é justamente onde a pessoa
 * está mais disposta a clicar sem olhar o endereço.
 *
 * Casos barrados: URL absoluta, `//host` (relativo a protocolo), barra
 * invertida (que alguns navegadores normalizam para `/`), e qualquer coisa
 * que não comece com `/`.
 */
export function destinoSeguro(bruto: string | null | undefined): string {
  if (!bruto) return DESTINO_PADRAO;

  const valor = bruto.trim();
  if (!valor.startsWith("/")) return DESTINO_PADRAO;
  if (valor.startsWith("//")) return DESTINO_PADRAO;
  if (valor.startsWith("/\\") || valor.includes("\\")) return DESTINO_PADRAO;

  return valor;
}
