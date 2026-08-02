-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "contadores" (
    "id" TEXT NOT NULL,
    "owner_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "crc" TEXT,
    "logo_url" TEXT,
    "whatsapp" TEXT,
    "rodape" TEXT,
    "cor_primaria" TEXT NOT NULL DEFAULT '#0F766E',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contadores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contadores_owner_id_key" ON "contadores"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "contadores_slug_key" ON "contadores"("slug");


-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- O Supabase publica o schema `public` via PostgREST usando a chave anônima,
-- que é pública por definição (vai no bundle do navegador). Sem RLS, qualquer
-- pessoa com essa chave leria e escreveria a tabela `contadores` direto,
-- passando por cima de toda a autorização da aplicação.
--
-- O Prisma conecta com o papel dono da tabela e não é afetado por estas
-- políticas — a autorização da aplicação continua sendo feita no DAL
-- (src/lib/dal.ts). Estas políticas fecham a porta lateral.
-- ---------------------------------------------------------------------------

ALTER TABLE "contadores" ENABLE ROW LEVEL SECURITY;

-- Cada conta só enxerga e altera a própria empresa.
CREATE POLICY "contador_le_a_propria_empresa"
  ON "contadores" FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

CREATE POLICY "contador_cria_a_propria_empresa"
  ON "contadores" FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY "contador_atualiza_a_propria_empresa"
  ON "contadores" FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY "contador_apaga_a_propria_empresa"
  ON "contadores" FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

-- Nenhuma política para `anon`: a página pública é lida pelo servidor via
-- Prisma, então o visitante não precisa — e não deve — alcançar a tabela.
