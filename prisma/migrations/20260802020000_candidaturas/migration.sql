-- CreateTable
CREATE TABLE "candidaturas" (
    "id" TEXT NOT NULL,
    "nome_escritorio" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "clientes_ativos" TEXT NOT NULL,
    "origem_ultimos_clientes" TEXT NOT NULL,
    "empresa_para_enviar" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidaturas_pkey" PRIMARY KEY ("id")
);

-- ---------------------------------------------------------------------------
-- RLS sem nenhuma política: ninguém alcança esta tabela pela API pública.
--
-- A gravação acontece no servidor, via Prisma, que conecta com o papel dono e
-- não é afetado pelo RLS. Para `anon` e `authenticated` a tabela simplesmente
-- não existe — e é assim que tem que ser: são dados de contato de quem se
-- candidatou, não há motivo para qualquer cliente da API lê-los.
-- ---------------------------------------------------------------------------
ALTER TABLE "candidaturas" ENABLE ROW LEVEL SECURITY;
