import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Trava de arquitetura para RNF-05 e RF-23.
 *
 * POR QUE ESTE TESTE EXISTE, e por que ele é diferente dos outros:
 *
 * A promessa "seus números ficam neste navegador" está escrita na tela do
 * cliente, no README e no material comercial. Promessa escrita depende de
 * alguém lembrar dela — e o modo como uma garantia dessas morre nunca é uma
 * decisão deliberada de violá-la. É um `fetch` de telemetria acrescentado numa
 * tarde, com boa intenção, por quem nunca leu o documento.
 *
 * Este teste não verifica comportamento: ele lê o código-fonte e falha se
 * qualquer primitiva de rede aparecer no núcleo do diagnóstico ou no
 * componente que o renderiza. A promessa passa a ser barreira de CI, não
 * política.
 *
 * SE ESTE TESTE FALHAR: a resposta certa quase nunca é adicionar o arquivo à
 * lista de exceções. É perguntar por que dado financeiro precisa sair do
 * dispositivo — e, se precisar mesmo, mudar a promessa pública primeiro,
 * incluindo a frase na tela do cliente e a seção de arquitetura de dados da
 * landing page.
 */

const RAIZ = process.cwd();

/** Arquivos que compõem o caminho por onde os números do empresário passam. */
const CAMINHOS_VIGIADOS = [
  "src/lib/diagnostico",
  "src/components/diagnostico.tsx",
  "src/components/pagina-diagnostico.tsx",
];

/**
 * Primitivas que tirariam dado do dispositivo.
 *
 * `"use server"` entra na lista porque uma Server Action é exatamente o jeito
 * mais discreto de fazer isso no Next: parece uma chamada de função local.
 */
const PROIBIDOS: { padrao: RegExp; nome: string }[] = [
  { padrao: /\bfetch\s*\(/, nome: "fetch()" },
  { padrao: /XMLHttpRequest/, nome: "XMLHttpRequest" },
  { padrao: /navigator\s*\.\s*sendBeacon/, nome: "navigator.sendBeacon()" },
  { padrao: /new\s+WebSocket/, nome: "WebSocket" },
  { padrao: /new\s+EventSource/, nome: "EventSource" },
  { padrao: /["']use server["']/, nome: '"use server" (Server Action)' },
  { padrao: /from\s+["']@\/lib\/prisma["']/, nome: "import do Prisma" },
  { padrao: /from\s+["']@\/lib\/dal["']/, nome: "import do DAL" },
  { padrao: /from\s+["']@supabase\//, nome: "cliente Supabase" },
  { padrao: /gtag|dataLayer|analytics|posthog|mixpanel|amplitude/i, nome: "analytics" },
];

function arquivosDe(caminho: string): string[] {
  const absoluto = join(RAIZ, caminho);
  const info = statSync(absoluto);

  if (info.isFile()) return [absoluto];

  return readdirSync(absoluto, { withFileTypes: true }).flatMap((entrada) => {
    const filho = join(caminho, entrada.name);
    if (entrada.isDirectory()) return arquivosDe(filho);
    if (!/\.tsx?$/.test(entrada.name)) return [];
    // O próprio teste cita as primitivas por nome; excluí-lo evita que ele
    // acuse a si mesmo.
    if (entrada.name.endsWith(".test.ts")) return [];
    return [join(RAIZ, filho)];
  });
}

describe("RNF-05 / RF-23 — o núcleo do diagnóstico não pode falar com a rede", () => {
  const arquivos = CAMINHOS_VIGIADOS.flatMap(arquivosDe);

  it("vigia os arquivos esperados", () => {
    // Se alguém mover o núcleo de lugar, o teste passaria a vigiar o vazio e
    // daria falso verde. Esta asserção é a guarda da guarda.
    expect(arquivos.length).toBeGreaterThanOrEqual(8);
  });

  it.each(CAMINHOS_VIGIADOS)("%s não contém primitiva de rede", (caminho) => {
    const achados: string[] = [];

    for (const arquivo of arquivosDe(caminho)) {
      const conteudo = readFileSync(arquivo, "utf8");

      for (const { padrao, nome } of PROIBIDOS) {
        conteudo.split("\n").forEach((linha, i) => {
          // Comentário citando o nome da primitiva não é uso dela.
          const semComentario = linha.replace(/\/\/.*$/, "").replace(/^\s*\*.*$/, "");
          if (padrao.test(semComentario)) {
            achados.push(`${arquivo.replace(RAIZ + "/", "")}:${i + 1} — ${nome}`);
          }
        });
      }
    }

    expect(achados).toEqual([]);
  });
});
