-- CreateTable
CREATE TABLE "envios" (
    "id" TEXT NOT NULL,
    "contador_id" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "respondeu" BOOLEAN NOT NULL DEFAULT false,
    "conversa" BOOLEAN NOT NULL DEFAULT false,
    "trabalho" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "envios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "envios_contador_id_criado_em_idx" ON "envios"("contador_id", "criado_em");

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_contador_id_fkey"
  FOREIGN KEY ("contador_id") REFERENCES "contadores"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- RLS: cada contador só alcança as próprias anotações.
--
-- O vínculo é indireto (envios -> contadores -> owner_id), então a política
-- precisa do subselect. Sem ele, a chave anônima leria as anotações de todos os
-- escritórios — e aqui há nome de cliente, o que torna o vazamento pior que o
-- da tabela de marca.
-- ---------------------------------------------------------------------------
ALTER TABLE "envios" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "envio_le_os_proprios"
  ON "envios" FOR SELECT
  TO authenticated
  USING (
    contador_id IN (
      SELECT id FROM contadores WHERE owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "envio_cria_os_proprios"
  ON "envios" FOR INSERT
  TO authenticated
  WITH CHECK (
    contador_id IN (
      SELECT id FROM contadores WHERE owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "envio_atualiza_os_proprios"
  ON "envios" FOR UPDATE
  TO authenticated
  USING (
    contador_id IN (
      SELECT id FROM contadores WHERE owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    contador_id IN (
      SELECT id FROM contadores WHERE owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "envio_apaga_os_proprios"
  ON "envios" FOR DELETE
  TO authenticated
  USING (
    contador_id IN (
      SELECT id FROM contadores WHERE owner_id = (SELECT auth.uid())
    )
  );
