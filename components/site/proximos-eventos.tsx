"use client";

import Link from "next/link";
import { ListaEventos } from "./lista-eventos";
import { Revelar } from "./revelar";
import { useDados } from "@/lib/store";
import { ehFuturo } from "@/lib/utils";

export function ProximosEventos({ limite }: { limite?: number }) {
  const { eventos } = useDados();
  const proximos = eventos
    .filter((e) => e.publicado && ehFuturo(e))
    .sort((a, b) => a.data.localeCompare(b.data));

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-verde">Calendário</p>
          <h2 className="display mt-4 text-5xl sm:text-7xl">
            Próximas
            <br />
            largadas
          </h2>
        </div>
        <Link
          href="/eventos"
          className="eyebrow shrink-0 underline underline-offset-4 hover:text-verde"
        >
          Todas as provas
        </Link>
      </div>

      <Revelar seletor="li">
        <ListaEventos eventos={limite ? proximos.slice(0, limite) : proximos} />
      </Revelar>
    </section>
  );
}
