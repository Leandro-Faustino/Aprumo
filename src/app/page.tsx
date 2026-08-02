import { PaginaDiagnostico } from "@/components/pagina-diagnostico";
import { marcaDoAmbiente } from "@/lib/marca";

/**
 * Instalação de contador único: a marca vem das variáveis de ambiente.
 * Para vários contadores no mesmo deploy, use /d/<slug> (lê do banco).
 */
export default function Page() {
  return <PaginaDiagnostico marca={marcaDoAmbiente()} />;
}
