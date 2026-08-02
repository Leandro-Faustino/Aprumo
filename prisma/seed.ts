import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Seed de exemplo — dois contadores para exercitar o RF-32:
 * um com todos os campos preenchidos, outro só com o mínimo.
 */
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.contador.upsert({
    where: { slug: "silva-contabil" },
    create: {
      slug: "silva-contabil",
      marca: "Silva Contabilidade",
      crc: "SP-123456/O-4",
      whatsapp: "(11) 98765-4321",
      rodape: "Silva Contabilidade — Rua das Acácias, 120, São Paulo/SP",
      corPrimaria: "#0F766E",
    },
    update: {},
  });

  // Mínimo absoluto: sem logo, sem CRC, sem rodapé, sem WhatsApp (RF-32).
  await prisma.contador.upsert({
    where: { slug: "minimo" },
    create: { slug: "minimo", marca: "Escritório Exemplo" },
    update: {},
  });

  console.log("Seed concluído.");
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
