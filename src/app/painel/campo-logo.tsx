"use client";

import { useRef, useState } from "react";

import { criarClienteNavegador } from "@/lib/supabase/navegador";

const TAMANHO_MAXIMO = 2 * 1024 * 1024; // 2 MB — mesmo limite do bucket.
const TIPOS_ACEITOS = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

/**
 * Upload da logo direto do navegador para o Supabase Storage.
 *
 * O caminho é sempre `<id do usuário>/logo`, e a política do bucket exige que a
 * primeira pasta seja o id de quem está enviando — então o servidor recusa
 * qualquer tentativa de gravar na pasta de outro contador, independente do que
 * este componente mandar.
 *
 * O valor que vai para o formulário continua sendo uma URL comum, no campo
 * `logoUrl`. Quem já hospeda a logo em outro lugar não perde nada: o upload
 * apenas preenche o mesmo campo.
 */
export function CampoLogo({
  usuarioId,
  valorInicial,
}: {
  usuarioId: string;
  valorInicial: string | null;
}) {
  const [url, setUrl] = useState<string | null>(valorInicial);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputArquivo = useRef<HTMLInputElement>(null);

  async function aoEscolher(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    // Checagem no cliente é só cortesia — quem realmente barra é o bucket.
    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      setErro("Use uma imagem PNG, JPG, WEBP ou SVG.");
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      setErro("A imagem precisa ter no máximo 2 MB.");
      return;
    }

    setErro(null);
    setEnviando(true);

    try {
      const supabase = criarClienteNavegador();
      const caminho = `${usuarioId}/logo`;

      const { error } = await supabase.storage.from("logos").upload(caminho, arquivo, {
        upsert: true,
        contentType: arquivo.type,
      });

      if (error) {
        setErro("Não foi possível enviar a imagem. Tente de novo.");
        return;
      }

      const { data } = supabase.storage.from("logos").getPublicUrl(caminho);
      // O caminho é fixo, então trocar a logo reaproveita a mesma URL — sem o
      // parâmetro de versão, o navegador e a CDN continuariam mostrando a antiga.
      setUrl(`${data.publicUrl}?v=${Date.now()}`);
    } finally {
      setEnviando(false);
      if (inputArquivo.current) inputArquivo.current.value = "";
    }
  }

  function remover() {
    setUrl(null);
    setErro(null);
  }

  return (
    <div className="space-y-2">
      <span className="block font-medium text-slate-900 dark:text-slate-100">Logo</span>

      {/* O que o formulário envia é sempre esta URL. */}
      <input type="hidden" name="logoUrl" value={url ?? ""} />

      <div className="flex flex-wrap items-center gap-4">
        {url && (
          <span className="flex h-14 items-center rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Logo atual" className="h-9 w-auto max-w-[140px] object-contain" />
          </span>
        )}

        <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
          {enviando ? "Enviando..." : url ? "Trocar imagem" : "Enviar imagem"}
          <input
            ref={inputArquivo}
            type="file"
            accept={TIPOS_ACEITOS.join(",")}
            onChange={aoEscolher}
            disabled={enviando}
            className="sr-only"
          />
        </label>

        {url && (
          <button
            type="button"
            onClick={remover}
            className="text-sm text-slate-500 underline underline-offset-4 transition hover:text-slate-900 dark:hover:text-slate-200"
          >
            Remover
          </button>
        )}
      </div>

      {erro ? (
        <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">
          {erro}
        </p>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          PNG, JPG, WEBP ou SVG, até 2 MB. Sem logo, aparece o nome do escritório.
        </p>
      )}
    </div>
  );
}
