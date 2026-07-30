import { Cabecalho } from "@/components/site/cabecalho";
import { Rodape } from "@/components/site/rodape";

export default function LayoutDoSite({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <Cabecalho />
      <main className="flex-1">{children}</main>
      <Rodape />
    </div>
  );
}
