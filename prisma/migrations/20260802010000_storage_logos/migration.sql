-- ---------------------------------------------------------------------------
-- Bucket de logos (Supabase Storage)
--
-- Não há tabela do Prisma aqui: o Storage vive no schema `storage`, gerido pelo
-- Supabase. Esta migration existe para que o bucket e suas políticas sejam
-- reproduzíveis junto com o resto do schema, em vez de virarem um passo manual
-- esquecido no painel.
--
-- O `logoUrl` do modelo Contador continua sendo uma URL qualquer — o upload
-- apenas preenche esse campo com a URL pública do arquivo. Logo hospedada fora
-- continua funcionando.
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  -- Público para leitura: a logo aparece numa página que qualquer cliente do
  -- contador abre, sem login. Não há nada sigiloso num logotipo.
  true,
  -- 2 MB. Logo de cabeçalho não precisa de mais, e o limite é aplicado pelo
  -- Supabase — não depende do navegador ter cooperado.
  2097152,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Leitura pública: necessário para a página do cliente final renderizar a logo.
DROP POLICY IF EXISTS "logo_leitura_publica" ON storage.objects;
CREATE POLICY "logo_leitura_publica"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'logos');

-- Escrita: cada contador só mexe na pasta com o próprio id.
-- `storage.foldername(name)[1]` é o primeiro segmento do caminho — por isso o
-- app grava em `<user_id>/logo.<ext>`. Sem esta condição, um contador logado
-- poderia sobrescrever a logo de outro.
DROP POLICY IF EXISTS "logo_envio_proprio" ON storage.objects;
CREATE POLICY "logo_envio_proprio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'logos'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "logo_atualizacao_propria" ON storage.objects;
CREATE POLICY "logo_atualizacao_propria"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'logos'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'logos'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "logo_remocao_propria" ON storage.objects;
CREATE POLICY "logo_remocao_propria"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'logos'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );
