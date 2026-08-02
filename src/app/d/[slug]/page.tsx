import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaginaDiagnostico } from "@/components/pagina-diagnostico";
import { carregarMarca } from "@/lib/marca";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const marca = await carregarMarca(slug);
  if (!marca) return { title: "Diagnóstico não encontrado" };

  return {
    title: `Diagnóstico de 90 dias — ${marca.marca}`,
    description: "Três números do último mês para entender como está o seu caixa.",
  };
}

/** Página white-label por contador (RF-30). */
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const marca = await carregarMarca(slug);
  if (!marca) notFound();

  return <PaginaDiagnostico marca={marca} />;
}
