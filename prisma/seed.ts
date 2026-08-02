import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Seed de exemplo — dois contadores para exercitar o RF-32:
 * um com todos os campos preenchidos, outro só com o mínimo.
 *
 * SOBRE O DONO: `ownerId` aponta para `auth.users.id` do Supabase. Como o seed
 * roda sem ninguém logado, ele usa UUIDs de placeholder — as páginas públicas
 * `/d/<slug>` funcionam normalmente, mas **ninguém consegue editar essas duas
 * empresas pelo painel**, porque nenhuma conta tem esses ids.
 *
 * Para poder editar pelo painel, entre no produto uma vez, pegue seu id em
 * Supabase > Authentication > Users e rode:
 *
 *   SEED_OWNER_ID=<seu-uuid> npm run db:seed
 */
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const OWNER_COMPLETO = process.env.SEED_OWNER_ID ?? "00000000-0000-4000-8000-000000000001";
const OWNER_MINIMO = "00000000-0000-4000-8000-000000000002";

async function main() {
  await prisma.contador.upsert({
    where: { slug: "silva-contabil" },
    create: {
      ownerId: OWNER_COMPLETO,
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
    create: { ownerId: OWNER_MINIMO, slug: "minimo", marca: "Escritório Exemplo" },
    update: {},
  });

  console.log("Seed concluído.");
  if (!process.env.SEED_OWNER_ID) {
    console.log(
      "Aviso: sem SEED_OWNER_ID, as empresas de exemplo não pertencem a nenhuma conta e não aparecem no painel.",
    );
  }
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
