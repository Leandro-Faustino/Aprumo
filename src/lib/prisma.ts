import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

/**
 * Cliente Prisma (v7: driver adapter é obrigatório).
 *
 * Singleton em dev para não estourar o pool a cada hot reload.
 * Só é usado para ler o bloco de marca (RF-30) — ver aviso em prisma/schema.prisma.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function criarCliente(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL não configurada.");
  }

  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export function getPrisma(): PrismaClient {
  const cliente = globalForPrisma.prisma ?? criarCliente();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = cliente;
  return cliente;
}

/** `true` quando há banco configurado. Permite rodar a app sem Supabase. */
export function temBancoConfigurado(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
